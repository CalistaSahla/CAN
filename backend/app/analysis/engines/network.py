from app.analysis.collector import CollectedSite
from app.analysis.engines.common import observed
from app.schemas import EvidenceDraft


def analyze_network(site: CollectedSite) -> list[EvidenceDraft]:
    domains = site.html_signals["external_domains"]
    return [
        observed(
            "network",
            "external_domains_in_initial_html",
            {"domains": domains, "count": len(domains)},
            "External domains referenced by script, image, iframe, or link elements in the initial HTML. These domains were not contacted.",
            source="initial_html",
        )
    ]