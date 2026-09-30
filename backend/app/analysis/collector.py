from __future__ import annotations

import http.client
import socket
import ssl
from dataclasses import dataclass
from datetime import UTC, datetime
from typing import Callable
from urllib.parse import urljoin

from app.analysis.html_signals import inspect_initial_html
from app.security.url_safety import (
    PublicWebTarget,
    UnsafeUrlError,
    parse_web_url,
    redact_url,
    resolve_public_target,
)


MAX_RESPONSE_BYTES = 1_000_000
MAX_REDIRECTS = 3
DEFAULT_TIMEOUT_SECONDS = 5.0
SAFE_RESPONSE_HEADERS = {
    "content-type",
    "strict-transport-security",
    "content-security-policy",
    "x-content-type-options",
    "x-frame-options",
    "referrer-policy",
    "permissions-policy",
    "location",
}


class ScanCollectionError(RuntimeError):
    def __init__(self, code: str, message: str) -> None:
        super().__init__(message)
        self.code = code


@dataclass(frozen=True)
class HttpObservation:
    status_code: int
    headers: dict[str, str]
    cookie_flags: dict[str, int | bool]
    body: bytes
    tls_certificate: dict[str, str] | None
    resolved_address_count: int


@dataclass(frozen=True)
class CollectedSite:
    requested_url: str
    final_url: str
    status_code: int
    redirects: tuple[dict[str, object], ...]
    response_headers: dict[str, str]
    cookie_flags: dict[str, int | bool]
    tls_certificate: dict[str, str] | None
    html_signals: dict[str, object]
    resolved_address_count: int
    observed_at: datetime


Connector = Callable[..., socket.socket]


def _host_header(target: PublicWebTarget) -> str:
    if ":" in target.hostname:
        return f"[{target.hostname}]"
    return target.hostname


def _cookie_flags(set_cookie_headers: list[str]) -> dict[str, int | bool]:
    secure_count = 0
    http_only_count = 0
    same_site_count = 0
    for header in set_cookie_headers:
        attributes = {part.strip().split("=", 1)[0].lower() for part in header.split(";")}
        secure_count += "secure" in attributes
        http_only_count += "httponly" in attributes
        same_site_count += "samesite" in attributes
    count = len(set_cookie_headers)
    return {
        "cookie_count": count,
        "secure_count": secure_count,
        "http_only_count": http_only_count,
        "same_site_count": same_site_count,
    }


def _certificate_summary(certificate: dict) -> dict[str, str]:
    def join_names(name_parts: tuple) -> str:
        return ", ".join(f"{key}={value}" for rdn in name_parts for key, value in rdn)

    return {
        "subject": join_names(certificate.get("subject", ())),
        "issuer": join_names(certificate.get("issuer", ())),
        "not_after": certificate.get("notAfter", ""),
    }


def _request_once(
    target: PublicWebTarget,
    timeout: float,
    max_response_bytes: int,
    resolver: Callable[..., list[tuple]] | None,
    connector: Connector | None,
) -> HttpObservation:
    safe_target = resolve_public_target(target, resolver=resolver)
    connector = connector or socket.create_connection
    raw_socket = None
    connected_socket = None
    response = None
    last_error: OSError | None = None

    for address in safe_target.addresses:
        try:
            raw_socket = connector((address, safe_target.port), timeout=timeout)
            connected_socket = raw_socket
            break
        except OSError as error:
            last_error = error

    if connected_socket is None:
        raise ScanCollectionError("connection_failed", "The website could not be reached.") from last_error

    try:
        connected_socket.settimeout(timeout)
        certificate_summary = None
        if safe_target.scheme == "https":
            context = ssl.create_default_context()
            try:
                connected_socket = context.wrap_socket(
                    connected_socket,
                    server_hostname=safe_target.hostname,
                )
            except ssl.SSLCertVerificationError as error:
                raise ScanCollectionError(
                    "tls_verification_failed",
                    "A secure connection to the website could not be verified.",
                ) from error
            certificate_summary = _certificate_summary(connected_socket.getpeercert())

        host_header = _host_header(safe_target)
        request = (
            f"GET {safe_target.request_target} HTTP/1.1\r\n"
            f"Host: {host_header}\r\n"
            "User-Agent: CAN-Research/0.1\r\n"
            "Accept: text/html,application/xhtml+xml;q=0.9,*/*;q=0.1\r\n"
            "Accept-Encoding: identity\r\n"
            "Connection: close\r\n\r\n"
        ).encode("ascii")
        connected_socket.sendall(request)
        response = http.client.HTTPResponse(connected_socket)
        response.begin()
        body = response.read(max_response_bytes + 1)
        if len(body) > max_response_bytes:
            raise ScanCollectionError("response_too_large", "The website response exceeded the scan size limit.")

        headers: dict[str, str] = {}
        set_cookie_headers: list[str] = []
        for name, value in response.getheaders():
            normalized_name = name.lower()
            if normalized_name == "set-cookie":
                set_cookie_headers.append(value)
            elif normalized_name in SAFE_RESPONSE_HEADERS:
                headers[normalized_name] = value[:2000]

        return HttpObservation(
            status_code=response.status,
            headers=headers,
            cookie_flags=_cookie_flags(set_cookie_headers),
            body=body,
            tls_certificate=certificate_summary,
            resolved_address_count=len(safe_target.addresses),
        )
    except ScanCollectionError:
        raise
    except (OSError, http.client.HTTPException, UnicodeError) as error:
        raise ScanCollectionError("response_unavailable", "A readable website response was unavailable.") from error
    finally:
        if response is not None:
            response.close()
        if connected_socket is not None:
            connected_socket.close()
        elif raw_socket is not None:
            raw_socket.close()


def collect_initial_response(
    raw_url: str,
    timeout: float = DEFAULT_TIMEOUT_SECONDS,
    max_response_bytes: int = MAX_RESPONSE_BYTES,
    max_redirects: int = MAX_REDIRECTS,
    resolver: Callable[..., list[tuple]] | None = None,
    connector: Connector | None = None,
) -> CollectedSite:
    current_target = parse_web_url(raw_url)
    requested_url = redact_url(current_target.url)
    redirects: list[dict[str, object]] = []

    for redirect_index in range(max_redirects + 1):
        observation = _request_once(
            current_target,
            timeout=timeout,
            max_response_bytes=max_response_bytes,
            resolver=resolver,
            connector=connector,
        )
        location = observation.headers.get("location")
        if observation.status_code not in {301, 302, 303, 307, 308} or not location:
            content_type = observation.headers.get("content-type", "").lower()
            html = ""
            if "text/html" in content_type or "application/xhtml+xml" in content_type:
                charset = "utf-8"
                html = observation.body.decode(charset, errors="replace")
            signals = inspect_initial_html(current_target.url, html)
            return CollectedSite(
                requested_url=requested_url,
                final_url=redact_url(current_target.url),
                status_code=observation.status_code,
                redirects=tuple(redirects),
                response_headers=observation.headers,
                cookie_flags=observation.cookie_flags,
                tls_certificate=observation.tls_certificate,
                html_signals=signals,
                resolved_address_count=observation.resolved_address_count,
                observed_at=datetime.now(UTC),
            )

        if redirect_index >= max_redirects:
            raise ScanCollectionError("redirect_limit", "The website redirected too many times to scan safely.")

        destination_url = urljoin(current_target.url, location)
        next_target = parse_web_url(destination_url)
        redirects.append(
            {
                "status_code": observation.status_code,
                "from_url": redact_url(current_target.url),
                "to_url": redact_url(next_target.url),
            }
        )
        current_target = next_target

    raise ScanCollectionError("redirect_limit", "The website redirected too many times to scan safely.")