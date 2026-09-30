from app.analysis.collector import CollectedSite
from app.analysis.engines.common import observed
from app.schemas import EvidenceDraft


def analyze_behavior(site: CollectedSite) -> list[EvidenceDraft]:
    return [
        observed(
            "behavior",
            "http_response",
            {"status_code": site.status_code},
            "The final HTTP status was observed after the redirect chain. This does not assess all page behavior.",
        ),
        observed(
            "behavior",
            "redirect_chain",
            {"count": len(site.redirects), "hops": list(site.redirects)},
            "Redirect destinations were individually validated before connection.",
            source="http_redirect_responses",
        ),
    ]