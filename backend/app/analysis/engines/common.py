from app.analysis.collector import CollectedSite
from app.schemas import EvidenceDraft


def observed(
    dimension: str,
    kind: str,
    value: dict,
    explanation: str,
    source: str = "initial_http_response",
) -> EvidenceDraft:
    return EvidenceDraft(
        dimension=dimension,
        kind=kind,
        source=source,
        status="observed",
        value=value,
        explanation=explanation,
    )


def not_detected(
    dimension: str,
    kind: str,
    explanation: str,
    value: dict | None = None,
) -> EvidenceDraft:
    return EvidenceDraft(
        dimension=dimension,
        kind=kind,
        source="initial_html_or_http_response",
        status="not_detected",
        value=value or {"present": False},
        explanation=explanation,
    )


def unavailable(dimension: str, kind: str, explanation: str) -> EvidenceDraft:
    return EvidenceDraft(
        dimension=dimension,
        kind=kind,
        source="CAN analysis coverage",
        status="unavailable",
        value=None,
        explanation=explanation,
    )


def collect_all(site: CollectedSite) -> list[EvidenceDraft]:
    from app.analysis.engines.authenticity import analyze_authenticity
    from app.analysis.engines.behavior import analyze_behavior
    from app.analysis.engines.data_exposure import analyze_data_exposure
    from app.analysis.engines.network import analyze_network
    from app.analysis.engines.security import analyze_security
    from app.analysis.engines.transparency import analyze_transparency

    evidence: list[EvidenceDraft] = []
    for analyze in (
        analyze_security,
        analyze_authenticity,
        analyze_transparency,
        analyze_behavior,
        analyze_network,
        analyze_data_exposure,
    ):
        evidence.extend(analyze(site))
    return evidence