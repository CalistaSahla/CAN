from app.analysis.collector import CollectedSite
from app.analysis.engines.common import not_detected, observed
from app.schemas import EvidenceDraft


def analyze_transparency(site: CollectedSite) -> list[EvidenceDraft]:
    signals = site.html_signals
    evidence = []
    for key, kind, label in (
        ("contact_link_visible", "contact_link", "contact link"),
        ("privacy_link_visible", "privacy_policy_link", "privacy-policy link"),
    ):
        if signals[key]:
            evidence.append(
                observed(
                    "transparency",
                    kind,
                    {"visible_in_initial_html": True},
                    f"A {label} was found in the retrieved initial HTML. Its contents were not audited.",
                    source="initial_html",
                )
            )
        else:
            evidence.append(
                not_detected(
                    "transparency",
                    kind,
                    f"No {label} was found in the retrieved initial HTML; client-rendered content was not inspected.",
                    value={"visible_in_initial_html": False},
                )
            )
    return evidence