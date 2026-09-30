from __future__ import annotations

import json
from pathlib import Path
from typing import Any

from app.schemas import DimensionName, DimensionScore, EvidenceDraft, TrustConfidence


RULES_PATH = Path(__file__).with_name("scoring_rules.json")
DIMENSIONS: tuple[DimensionName, ...] = (
    "security",
    "authenticity",
    "transparency",
    "behavior",
    "network",
    "data_exposure",
)


def load_scoring_rules() -> dict[str, Any]:
    return json.loads(RULES_PATH.read_text(encoding="utf-8"))


def _factor_value(factor: dict[str, Any], evidence: EvidenceDraft) -> int | None:
    if evidence.status == "unavailable" or evidence.value is None:
        return None

    actual = evidence.value.get(factor["value_key"])
    mode = factor["mode"]
    if mode == "equals":
        return 100 if actual == factor["expected"] else 0
    if mode == "range" and isinstance(actual, (int, float)):
        return 100 if factor["minimum"] <= actual <= factor["maximum"] else 0
    return None


def compute_trust_profile(
    evidence: list[EvidenceDraft],
    rules: dict[str, Any] | None = None,
) -> tuple[list[DimensionScore], TrustConfidence, str]:
    rules = rules or load_scoring_rules()
    evidence_by_kind = {item.kind: item for item in evidence}
    scores: list[DimensionScore] = []

    for dimension in DIMENSIONS:
        definition = rules["dimensions"][dimension]
        factors = definition["factors"]
        weighted_score = 0
        observed_weight = 0
        observed_factors = 0

        for factor in factors:
            item = evidence_by_kind.get(factor["evidence_kind"])
            if item is None:
                continue
            factor_score = _factor_value(factor, item)
            if factor_score is None:
                continue
            observed_factors += 1
            observed_weight += factor["weight"]
            weighted_score += factor_score * factor["weight"]

        score = round(weighted_score / observed_weight) if observed_weight else None
        factor_coverage = observed_factors / len(factors) if factors else 0
        if score is None:
            factor_confidence = "unavailable"
        elif factor_coverage >= 0.8:
            factor_confidence = "high"
        elif factor_coverage >= 0.5:
            factor_confidence = "medium"
        else:
            factor_confidence = "low"

        scores.append(
            DimensionScore(
                dimension=dimension,
                score=score,
                confidence=factor_confidence,
                observed_factors=observed_factors,
                total_factors=len(factors),
                explanation=definition["explanation"],
            )
        )

    observed_dimensions = sum(score.score is not None for score in scores)
    coverage_percent = round(observed_dimensions / len(DIMENSIONS) * 100)
    bands = rules["confidence_bands"]
    if coverage_percent >= bands["high_minimum_coverage_percent"]:
        label = "high"
    elif coverage_percent >= bands["medium_minimum_coverage_percent"]:
        label = "medium"
    else:
        label = "low"

    confidence = TrustConfidence(
        coverage_percent=coverage_percent,
        observed_dimensions=observed_dimensions,
        label=label,
        explanation=(
            f"Coverage of dimensions with a scoring rule: {observed_dimensions} of {len(DIMENSIONS)}. "
            "This is evidence coverage, not the probability that a website is safe."
        ),
    )
    return scores, confidence, rules["version"]