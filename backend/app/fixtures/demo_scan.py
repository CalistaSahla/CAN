from app.schemas import EvidenceDraft


DEMO_ANALYSIS_TARGET = "https://demo.example.invalid"


def demo_evidence() -> list[EvidenceDraft]:
    source = "demo_fixture_v1"
    return [
        EvidenceDraft(
            dimension="security",
            kind="https_enabled",
            source=source,
            status="observed",
            value={"enabled": True},
            explanation="Fixture: HTTPS is shown as enabled for the sample report.",
        ),
        EvidenceDraft(
            dimension="security",
            kind="tls_certificate_valid",
            source=source,
            status="observed",
            value={"verified": True},
            explanation="Fixture: a verified TLS certificate is shown for the sample report.",
        ),
        EvidenceDraft(
            dimension="security",
            kind="strict_transport_security",
            source=source,
            status="observed",
            value={"present": True, "value": "max-age=31536000"},
            explanation="Fixture response header for demonstration only.",
        ),
        EvidenceDraft(
            dimension="security",
            kind="content_security_policy",
            source=source,
            status="observed",
            value={"present": True, "value": "default-src 'self'"},
            explanation="Fixture response header for demonstration only.",
        ),
        EvidenceDraft(
            dimension="security",
            kind="x_content_type_options",
            source=source,
            status="observed",
            value={"present": True},
            explanation="Fixture response header for demonstration only.",
        ),
        EvidenceDraft(
            dimension="security",
            kind="referrer_policy",
            source=source,
            status="observed",
            value={"present": True, "value": "strict-origin-when-cross-origin"},
            explanation="Fixture response header for demonstration only.",
        ),
        EvidenceDraft(
            dimension="security",
            kind="permissions_policy",
            source=source,
            status="not_detected",
            value={"present": False},
            explanation="Fixture: Permissions-Policy was not present in the sample response.",
        ),
        EvidenceDraft(
            dimension="authenticity",
            kind="domain_ownership",
            source=source,
            status="unavailable",
            value=None,
            explanation="Ownership is not part of the demo fixture.",
        ),
        EvidenceDraft(
            dimension="transparency",
            kind="contact_link",
            source=source,
            status="observed",
            value={"visible_in_initial_html": True},
            explanation="Fixture: a contact link is shown for demonstration only.",
        ),
        EvidenceDraft(
            dimension="transparency",
            kind="privacy_policy_link",
            source=source,
            status="observed",
            value={"visible_in_initial_html": True},
            explanation="Fixture: a privacy-policy link is shown for demonstration only.",
        ),
        EvidenceDraft(
            dimension="behavior",
            kind="http_response",
            source=source,
            status="observed",
            value={"status_code": 200},
            explanation="Fixture status code for demonstration only.",
        ),
        EvidenceDraft(
            dimension="behavior",
            kind="redirect_chain",
            source=source,
            status="observed",
            value={"count": 1, "hops": []},
            explanation="Fixture redirect count for demonstration only.",
        ),
        EvidenceDraft(
            dimension="network",
            kind="external_domains_in_initial_html",
            source=source,
            status="observed",
            value={"domains": ["cdn.demo.example.invalid"], "count": 1},
            explanation="Synthetic reserved .invalid domain used only in the demo fixture; it was not contacted.",
        ),
        EvidenceDraft(
            dimension="data_exposure",
            kind="form_data_categories",
            source=source,
            status="observed",
            value={"categories": ["email address"], "form_count": 1},
            explanation="Fixture form category for demonstration only.",
        ),
    ]