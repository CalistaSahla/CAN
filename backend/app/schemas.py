from datetime import UTC, datetime
from typing import Any, Literal

from pydantic import BaseModel, ConfigDict, Field


DimensionName = Literal[
    "security",
    "authenticity",
    "transparency",
    "behavior",
    "network",
    "data_exposure",
]
EvidenceStatus = Literal["observed", "not_detected", "unavailable"]
ScanStatusName = Literal["queued", "running", "completed", "failed"]


class ScanRequest(BaseModel):
    url: str = Field(min_length=1, max_length=2048)


class ScanAccepted(BaseModel):
    scan_id: str
    status: ScanStatusName
    mode: Literal["demo", "live"]


class ScanStatusResponse(BaseModel):
    scan_id: str
    status: ScanStatusName
    mode: Literal["demo", "live"]
    progress: int = Field(ge=0, le=100)
    current_stage: str | None = None
    error_code: str | None = None


class EvidenceDraft(BaseModel):
    dimension: DimensionName
    kind: str
    source: str
    status: EvidenceStatus
    value: dict[str, Any] | None = None
    explanation: str
    observed_at: datetime = Field(default_factory=lambda: datetime.now(UTC))


class EvidenceResponse(EvidenceDraft):
    id: int
    model_config = ConfigDict(from_attributes=True)


class DimensionScore(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    dimension: DimensionName
    score: int | None = Field(default=None, ge=0, le=100)
    confidence: Literal["high", "medium", "low", "unavailable"]
    observed_factors: int = Field(ge=0)
    total_factors: int = Field(ge=0)
    explanation: str


class TrustConfidence(BaseModel):
    coverage_percent: int = Field(ge=0, le=100)
    observed_dimensions: int = Field(ge=0, le=6)
    total_dimensions: int = 6
    label: Literal["high", "medium", "low"]
    explanation: str


class FindingDraft(BaseModel):
    dimension: DimensionName
    severity: Literal["information", "attention"]
    confidence: Literal["high", "medium", "low"]
    what: str
    why: str
    evidence_kinds: list[str]
    impact: str
    action: str


class FindingResponse(BaseModel):
    id: int
    dimension: DimensionName
    severity: Literal["information", "attention"]
    confidence: Literal["high", "medium", "low"]
    what: str
    why: str
    evidence_ids: list[int]
    impact: str
    action: str
    model_config = ConfigDict(from_attributes=True)


class ScanReport(BaseModel):
    scan_id: str
    requested_url: str
    analysis_target: str
    mode: Literal["demo", "live"]
    status: Literal["completed"]
    created_at: datetime
    completed_at: datetime
    rules_version: str
    trust_confidence: TrustConfidence
    trust_dna: list[DimensionScore]
    findings: list[FindingResponse]
    evidence: list[EvidenceResponse]
    disclaimer: str