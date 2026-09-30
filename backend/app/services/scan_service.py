from datetime import UTC, datetime
import logging
from uuid import uuid4

from sqlalchemy.orm import Session

from app.analysis.collector import ScanCollectionError, collect_initial_response
from app.analysis.engines.common import collect_all
from app.config import Settings, get_settings
from app.db import SessionLocal
from app.engine.explain_engine import create_findings
from app.engine.trust_engine import compute_trust_profile
from app.fixtures.demo_scan import DEMO_ANALYSIS_TARGET, demo_evidence
from app.models import Evidence, Finding, Scan, TrustScore
from app.security.url_safety import UnsafeUrlError, parse_web_url, redact_url


logger = logging.getLogger(__name__)


def _mark_failed(session: Session, scan_id: str, error_code: str) -> None:
    scan = session.get(Scan, scan_id)
    if scan is None:
        return
    scan.status = "failed"
    scan.progress = min(scan.progress, 95)
    scan.current_stage = "failed"
    scan.error_code = error_code
    scan.completed_at = datetime.now(UTC)
    session.commit()


def process_scan(
    scan_id: str,
    submitted_url: str,
    settings: Settings | None = None,
    session_factory=None,
) -> None:
    settings = settings or get_settings()
    session_factory = session_factory or SessionLocal
    session: Session = session_factory()
    try:
        scan = session.get(Scan, scan_id)
        if scan is None:
            return

        scan.status = "running"
        scan.progress = 10
        scan.current_stage = "collecting_evidence"
        session.commit()

        if settings.demo_mode:
            analysis_target = DEMO_ANALYSIS_TARGET
            evidence_drafts = demo_evidence()
            scan.mode = "demo"
        else:
            collected = collect_initial_response(
                submitted_url,
                timeout=settings.scan_timeout_seconds,
                max_response_bytes=settings.scan_max_response_bytes,
                max_redirects=settings.scan_max_redirects,
            )
            analysis_target = collected.final_url
            evidence_drafts = collect_all(collected)
            scan.mode = "live"

        scan.analysis_target = analysis_target
        scan.progress = 65
        scan.current_stage = "analyzing_evidence"
        session.commit()

        dimension_scores, trust_confidence, rules_version = compute_trust_profile(evidence_drafts)
        findings = create_findings(evidence_drafts)
        scan.rules_version = rules_version
        scan.confidence_coverage_percent = trust_confidence.coverage_percent
        scan.confidence_observed_dimensions = trust_confidence.observed_dimensions
        scan.confidence_label = trust_confidence.label
        scan.confidence_explanation = trust_confidence.explanation

        evidence_models: list[Evidence] = []
        evidence_by_kind: dict[str, Evidence] = {}
        for draft in evidence_drafts:
            evidence_model = Evidence(
                dimension=draft.dimension,
                kind=draft.kind,
                source=draft.source,
                status=draft.status,
                value=draft.value,
                explanation=draft.explanation,
                observed_at=draft.observed_at,
            )
            evidence_models.append(evidence_model)
            evidence_by_kind[draft.kind] = evidence_model
        scan.evidence = evidence_models

        scan.trust_scores = [
            TrustScore(
                dimension=dimension.dimension,
                score=dimension.score,
                confidence=dimension.confidence,
                observed_factors=dimension.observed_factors,
                total_factors=dimension.total_factors,
                explanation=dimension.explanation,
            )
            for dimension in dimension_scores
        ]

        finding_models = []
        for draft in findings:
            finding = Finding(
                dimension=draft.dimension,
                severity=draft.severity,
                confidence=draft.confidence,
                what=draft.what,
                why=draft.why,
                impact=draft.impact,
                action=draft.action,
            )
            finding.evidence = [
                evidence_by_kind[kind]
                for kind in draft.evidence_kinds
                if kind in evidence_by_kind
            ]
            finding_models.append(finding)
        scan.findings = finding_models
        scan.progress = 90
        scan.current_stage = "saving_report"
        session.commit()

        scan.status = "completed"
        scan.progress = 100
        scan.current_stage = "completed"
        scan.completed_at = datetime.now(UTC)
        session.commit()
    except UnsafeUrlError as error:
        session.rollback()
        _mark_failed(session, scan_id, error.code)
    except ScanCollectionError as error:
        session.rollback()
        _mark_failed(session, scan_id, error.code)
    except Exception:
        session.rollback()
        logger.exception("Scan processing failed for scan_id=%s", scan_id)
        _mark_failed(session, scan_id, "scan_processing_failed")
    finally:
        session.close()


def create_scan_record(session: Session, submitted_url: str, mode: str) -> Scan:
    target = parse_web_url(submitted_url)
    scan = Scan(
        id=str(uuid4()),
        requested_url=redact_url(target.url),
        mode=mode,
        status="queued",
        progress=0,
        current_stage="queued",
    )
    session.add(scan)
    session.commit()
    session.refresh(scan)
    return scan