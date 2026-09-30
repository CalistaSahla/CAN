from app.analysis.collector import CollectedSite
from app.analysis.engines.common import observed, unavailable
from app.schemas import EvidenceDraft


def analyze_authenticity(site: CollectedSite) -> list[EvidenceDraft]:
    evidence = [
        observed(
            "authenticity",
            "public_dns_resolution",
            {"address_count": site.resolved_address_count},
            "The hostname resolved to public network addresses. DNS resolution does not verify site ownership or brand identity.",
            source="validated_dns_resolution",
        )
    ]
    evidence.append(
        unavailable(
            "authenticity",
            "domain_ownership",
            "Domain registration ownership and brand affiliation are not verified in this MVP.",
        )
    )
    return evidence