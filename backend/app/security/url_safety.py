from __future__ import annotations

import ipaddress
import re
import socket
from dataclasses import dataclass
from typing import Callable
from urllib.parse import SplitResult, quote, urlsplit, urlunsplit

import dns.exception
import dns.resolver


class UnsafeUrlError(ValueError):
    def __init__(self, code: str, message: str) -> None:
        super().__init__(message)
        self.code = code


Resolver = Callable[..., list[tuple]]
DNS_QUERY_TIMEOUT_SECONDS = 1.5


@dataclass(frozen=True)
class PublicWebTarget:
    url: str
    scheme: str
    hostname: str
    port: int
    request_target: str
    addresses: tuple[str, ...] = ()


def parse_web_url(raw_url: str) -> PublicWebTarget:
    if not isinstance(raw_url, str) or not raw_url or len(raw_url) > 2048:
        raise UnsafeUrlError("invalid_url", "Enter a valid HTTP or HTTPS website URL.")
    if any(ord(character) < 32 for character in raw_url):
        raise UnsafeUrlError("invalid_url", "The website URL contains unsupported characters.")

    candidate = raw_url.strip()
    if not re.match(r"^[a-z][a-z\d+.-]*://", candidate, re.IGNORECASE):
        candidate = f"https://{candidate}"

    try:
        parts = urlsplit(candidate)
        scheme = parts.scheme.lower()
        hostname = (parts.hostname or "").rstrip(".").lower()
        port = parts.port
    except ValueError as error:
        raise UnsafeUrlError("invalid_url", "Enter a valid HTTP or HTTPS website URL.") from error

    if scheme not in {"http", "https"}:
        raise UnsafeUrlError("unsupported_scheme", "Only HTTP and HTTPS website URLs are supported.")
    if not hostname or parts.username is not None or parts.password is not None:
        raise UnsafeUrlError("invalid_url", "The URL must contain a host and cannot contain credentials.")

    expected_port = 443 if scheme == "https" else 80
    if port is not None and port != expected_port:
        raise UnsafeUrlError("unsupported_port", "Only standard HTTP and HTTPS ports are supported.")
    port = expected_port

    try:
        address = ipaddress.ip_address(hostname.strip("[]"))
    except ValueError:
        address = None

    if address is not None:
        if not address.is_global:
            raise UnsafeUrlError("blocked_address", "The URL points to a non-public network address.")
        addresses = (str(address),)
        authority_host = f"[{hostname}]" if address.version == 6 else hostname
    else:
        if "." not in hostname or hostname == "localhost" or hostname.endswith((".localhost", ".local", ".internal")):
            raise UnsafeUrlError("blocked_host", "The URL must point to a public website host.")
        try:
            hostname = hostname.encode("idna").decode("ascii")
        except UnicodeError as error:
            raise UnsafeUrlError("invalid_url", "The website host name is invalid.") from error
        labels = hostname.split(".")
        if any(
            not label
            or len(label) > 63
            or label.startswith("-")
            or label.endswith("-")
            or not re.fullmatch(r"[a-z\d-]+", label)
            for label in labels
        ):
            raise UnsafeUrlError("invalid_url", "The website host name is invalid.")
        addresses = ()
        authority_host = hostname

    authority = authority_host if port == expected_port else f"{authority_host}:{port}"
    path = quote(parts.path or "/", safe="/%:@!$&'()*+,;=-._~")
    query = quote(parts.query, safe="=&?/:@!$'()*+,;%-._~")
    canonical_url = urlunsplit((scheme, authority, path, query, ""))
    request_target = urlunsplit(("", "", path, query, ""))

    return PublicWebTarget(
        url=canonical_url,
        scheme=scheme,
        hostname=hostname,
        port=port,
        request_target=request_target,
        addresses=addresses,
    )


def _resolve_dns(hostname: str, port: int, type: int = socket.SOCK_STREAM) -> list[tuple]:
    resolved: list[tuple] = []
    resolver = dns.resolver.Resolver()

    for record_type in ("A", "AAAA"):
        try:
            answer = resolver.resolve(
                hostname,
                record_type,
                lifetime=DNS_QUERY_TIMEOUT_SECONDS,
                raise_on_no_answer=False,
            )
        except dns.resolver.NXDOMAIN as error:
            raise OSError("DNS name does not exist") from error
        except (dns.exception.Timeout, dns.resolver.NoNameservers) as error:
            raise OSError("DNS resolution did not complete") from error

        if answer.rrset is None:
            continue
        for record in answer:
            address = ipaddress.ip_address(record.address)
            family = socket.AF_INET6 if address.version == 6 else socket.AF_INET
            socket_address = (str(address), port, 0, 0) if address.version == 6 else (str(address), port)
            resolved.append((family, type, socket.IPPROTO_TCP, "", socket_address))

    return resolved


def resolve_public_target(
    target: PublicWebTarget,
    resolver: Resolver | None = None,
) -> PublicWebTarget:
    if target.addresses:
        return target

    resolver = resolver or _resolve_dns
    try:
        results = resolver(target.hostname, target.port, type=socket.SOCK_STREAM)
    except OSError as error:
        raise UnsafeUrlError("dns_failed", "The website host could not be resolved.") from error

    addresses: set[str] = set()
    for result in results:
        try:
            address = ipaddress.ip_address(result[4][0])
        except (IndexError, ValueError):
            continue
        if not address.is_global:
            raise UnsafeUrlError("blocked_address", "The website resolves to a non-public network address.")
        addresses.add(str(address))

    if not addresses:
        raise UnsafeUrlError("dns_failed", "The website host did not resolve to a public address.")

    return PublicWebTarget(
        url=target.url,
        scheme=target.scheme,
        hostname=target.hostname,
        port=target.port,
        request_target=target.request_target,
        addresses=tuple(sorted(addresses)),
    )


def validate_public_url(raw_url: str, resolver: Resolver | None = None) -> PublicWebTarget:
    return resolve_public_target(parse_web_url(raw_url), resolver=resolver)


def redact_url(raw_url: str) -> str:
    target = parse_web_url(raw_url)
    parts: SplitResult = urlsplit(target.url)
    return urlunsplit((parts.scheme, parts.netloc, parts.path, "", ""))