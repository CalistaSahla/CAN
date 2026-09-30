from app.analysis.collector import CollectedSite
from app.analysis.engines.common import not_detected, observed, unavailable
from app.schemas import EvidenceDraft


SECURITY_HEADERS = {
    "strict-transport-security": "strict_transport_security",
    "content-security-policy": "content_security_policy",
    "x-content-type-options": "x_content_type_options",
    "referrer-policy": "referrer_policy",
    "permissions-policy": "permissions_policy",
}


def analyze_security(site: CollectedSite) -> list[EvidenceDraft]:
    is_https = site.final_url.startswith("https://")
    evidence = [
        observed(
            "security",
            "https_enabled",
            {"enabled": is_https},
            "The final response used HTTPS." if is_https else "The final response used HTTP without transport encryption.",
            source="final_response_url",
        )
    ]

    if site.tls_certificate:
        evidence.append(
            observed(
                "security",
                "tls_certificate_valid",
                {"verified": True, **site.tls_certificate},
                "The TLS handshake and certificate hostname verification completed successfully.",
                source="verified_tls_handshake",
            )
        )
    else:
        evidence.append(unavailable("security", "tls_certificate_valid", "TLS was not available for verification."))

    for header, kind in SECURITY_HEADERS.items():
        if header in site.response_headers:
            evidence.append(
                observed(
                    "security",
                    kind,
                    {"present": True, "value": site.response_headers[header]},
                    f"The {header} response header was present.",
                )
            )
        else:
            evidence.append(
                not_detected(
                    "security",
                    kind,
                    f"The {header} response header was not present on the final response.",
                )
            )

    cookie_flags = site.cookie_flags
    if cookie_flags["cookie_count"]:
        evidence.append(
            observed(
                "security",
                "cookie_security_attributes",
                cookie_flags,
                "Cookie security attributes were summarized; cookie names and values were not stored.",
            )
        )
    else:
        evidence.append(not_detected("security", "cookie_security_attributes", "No Set-Cookie header was observed in the initial response."))
    return evidence