from app.analysis.collector import CollectedSite
from app.analysis.engines.common import observed, not_detected
from app.schemas import EvidenceDraft


def analyze_data_exposure(site: CollectedSite) -> list[EvidenceDraft]:
    signals = site.html_signals
    categories = signals["data_categories"]
    if categories:
        return [
            observed(
                "data_exposure",
                "form_data_categories",
                {"categories": categories, "form_count": signals["form_count"]},
                "Categories are inferred from form input types and autocomplete attributes in the initial HTML. Submission and JavaScript behavior were not tested.",
                source="initial_html_forms",
            )
        ]
    return [
        not_detected(
            "data_exposure",
            "form_data_categories",
            "No supported personal-data field category was detected in forms in the initial HTML. Client-rendered forms were not inspected.",
        )
    ]