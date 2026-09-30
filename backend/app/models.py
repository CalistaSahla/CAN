from datetime import UTC, datetime

from sqlalchemy import JSON, Column, DateTime, ForeignKey, Integer, String, Table, Text, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db import Base


finding_evidence = Table(
    "finding_evidence",
    Base.metadata,
    Column("finding_id", ForeignKey("findings.id", ondelete="CASCADE"), primary_key=True),
    Column("evidence_id", ForeignKey("evidence.id", ondelete="CASCADE"), primary_key=True),
)


class Scan(Base):
    __tablename__ = "scans"

    id: Mapped[str] = mapped_column(String(36), primary_key=True)
    requested_url: Mapped[str] = mapped_column(String(2048))
    analysis_target: Mapped[str | None] = mapped_column(String(2048), nullable=True)
    mode: Mapped[str] = mapped_column(String(16))
    status: Mapped[str] = mapped_column(String(16), index=True)
    progress: Mapped[int] = mapped_column(Integer, default=0)
    current_stage: Mapped[str | None] = mapped_column(String(80), nullable=True)
    error_code: Mapped[str | None] = mapped_column(String(48), nullable=True)
    rules_version: Mapped[str | None] = mapped_column(String(32), nullable=True)
    confidence_coverage_percent: Mapped[int | None] = mapped_column(Integer, nullable=True)
    confidence_observed_dimensions: Mapped[int | None] = mapped_column(Integer, nullable=True)
    confidence_label: Mapped[str | None] = mapped_column(String(16), nullable=True)
    confidence_explanation: Mapped[str | None] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(UTC))
    completed_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)

    evidence: Mapped[list["Evidence"]] = relationship(
        back_populates="scan",
        cascade="all, delete-orphan",
        order_by="Evidence.id",
    )
    trust_scores: Mapped[list["TrustScore"]] = relationship(
        back_populates="scan",
        cascade="all, delete-orphan",
        order_by="TrustScore.dimension",
    )
    findings: Mapped[list["Finding"]] = relationship(
        back_populates="scan",
        cascade="all, delete-orphan",
        order_by="Finding.id",
    )


class Evidence(Base):
    __tablename__ = "evidence"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    scan_id: Mapped[str] = mapped_column(ForeignKey("scans.id", ondelete="CASCADE"), index=True)
    dimension: Mapped[str] = mapped_column(String(32), index=True)
    kind: Mapped[str] = mapped_column(String(80), index=True)
    source: Mapped[str] = mapped_column(String(80))
    status: Mapped[str] = mapped_column(String(20))
    value: Mapped[dict | None] = mapped_column(JSON, nullable=True)
    explanation: Mapped[str] = mapped_column(Text)
    observed_at: Mapped[datetime] = mapped_column(DateTime(timezone=True))

    scan: Mapped[Scan] = relationship(back_populates="evidence")
    findings: Mapped[list["Finding"]] = relationship(secondary=finding_evidence, back_populates="evidence")


class TrustScore(Base):
    __tablename__ = "trust_scores"
    __table_args__ = (UniqueConstraint("scan_id", "dimension", name="uq_trust_score_dimension"),)

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    scan_id: Mapped[str] = mapped_column(ForeignKey("scans.id", ondelete="CASCADE"), index=True)
    dimension: Mapped[str] = mapped_column(String(32))
    score: Mapped[int | None] = mapped_column(Integer, nullable=True)
    confidence: Mapped[str] = mapped_column(String(16))
    observed_factors: Mapped[int] = mapped_column(Integer)
    total_factors: Mapped[int] = mapped_column(Integer)
    explanation: Mapped[str] = mapped_column(Text)

    scan: Mapped[Scan] = relationship(back_populates="trust_scores")


class Finding(Base):
    __tablename__ = "findings"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    scan_id: Mapped[str] = mapped_column(ForeignKey("scans.id", ondelete="CASCADE"), index=True)
    dimension: Mapped[str] = mapped_column(String(32), index=True)
    severity: Mapped[str] = mapped_column(String(16))
    confidence: Mapped[str] = mapped_column(String(16))
    what: Mapped[str] = mapped_column(Text)
    why: Mapped[str] = mapped_column(Text)
    impact: Mapped[str] = mapped_column(Text)
    action: Mapped[str] = mapped_column(Text)

    scan: Mapped[Scan] = relationship(back_populates="findings")
    evidence: Mapped[list[Evidence]] = relationship(secondary=finding_evidence, back_populates="findings")