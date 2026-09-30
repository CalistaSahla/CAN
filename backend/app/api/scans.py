import logging

from fastapi import APIRouter, BackgroundTasks, Depends, HTTPException, Request, status
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session

from app.config import Settings, get_settings
from app.db import get_db
from app.models import Scan
from app.schemas import (
    DimensionScore,
    EvidenceResponse,
    FindingResponse,
    ScanAccepted,
    ScanReport,
    ScanRequest,
    ScanStatusResponse,
    TrustConfidence,
)
from app.security.url_safety import UnsafeUrlError
from app.security.rate_limit import InMemoryScanRateLimiter
from app.services.scan_service import create_scan_record, process_scan


logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api", tags=["scans"])
scan_rate_limiter = InMemoryScanRateLimiter()


@router.post("/scan", response_model=ScanAccepted, status_code=status.HTTP_202_ACCEPTED)
def start_scan(
    payload: ScanRequest,
    background_tasks: BackgroundTasks,
    request: Request,
    db: Session = Depends(get_db),
    settings: Settings = Depends(get_settings),
) -> ScanAccepted:
    client_key = request.client.host if request.client else "unknown"
    allowed, retry_after = scan_rate_limiter.allow(
        client_key,
        settings.scan_rate_limit_requests,
        settings.scan_rate_limit_window_seconds,
    )
    if not allowed:
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail={"code": "scan_rate_limited", "message": "Too many scans were requested. Wait before trying again."},
            headers={"Retry-After": str(retry_after)},
        )

    try:
        mode = "demo" if settings.demo_mode else "live"
        scan = create_scan_record(db, payload.url, mode)
    except UnsafeUrlError as error:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail={"code": error.code, "message": str(error)},
        ) from error
    except SQLAlchemyError as error:
        db.rollback()
        logger.exception("Could not create scan record")
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail={"code": "storage_unavailable", "message": "Scan storage is not available right now."},
        ) from error

    background_tasks.add_task(process_scan, scan.id, payload.url, settings)
    return ScanAccepted(scan_id=scan.id, status="queued", mode=mode)


@router.get("/scan/{scan_id}/status", response_model=ScanStatusResponse)
def get_scan_status(scan_id: str, db: Session = Depends(get_db)) -> ScanStatusResponse:
    scan = db.get(Scan, scan_id)
    if scan is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={"code": "scan_not_found", "message": "This scan could not be found."},
        )
    return ScanStatusResponse(
        scan_id=scan.id,
        status=scan.status,
        mode=scan.mode,
        progress=scan.progress,
        current_stage=scan.current_stage,
        error_code=scan.error_code,
    )


@router.get("/report/{scan_id}", response_model=ScanReport)
def get_scan_report(scan_id: str, db: Session = Depends(get_db)) -> ScanReport:
    scan = db.get(Scan, scan_id)
    if scan is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={"code": "scan_not_found", "message": "This scan could not be found."},
        )
    if scan.status == "failed":
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail={"code": scan.error_code or "scan_failed", "message": "This scan could not be completed. Review the URL and try again."},
        )
    if scan.status != "completed":
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail={"code": "scan_in_progress", "message": "The scan report is not ready yet."},
        )

    confidence = TrustConfidence(
        coverage_percent=scan.confidence_coverage_percent or 0,
        observed_dimensions=scan.confidence_observed_dimensions or 0,
        label=scan.confidence_label or "low",
        explanation=scan.confidence_explanation or "Evidence coverage was unavailable.",
    )
    findings = [
        FindingResponse(
            id=finding.id,
            dimension=finding.dimension,
            severity=finding.severity,
            confidence=finding.confidence,
            what=finding.what,
            why=finding.why,
            evidence_ids=[evidence.id for evidence in finding.evidence],
            impact=finding.impact,
            action=finding.action,
        )
        for finding in scan.findings
    ]
    return ScanReport(
        scan_id=scan.id,
        requested_url=scan.requested_url,
        analysis_target=scan.analysis_target or scan.requested_url,
        mode=scan.mode,
        status="completed",
        created_at=scan.created_at,
        completed_at=scan.completed_at,
        rules_version=scan.rules_version or "unknown",
        trust_confidence=confidence,
        trust_dna=[DimensionScore.model_validate(score) for score in scan.trust_scores],
        findings=findings,
        evidence=[EvidenceResponse.model_validate(item) for item in scan.evidence],
        disclaimer=(
            "CAN does not guarantee that a website is safe or malicious. "
            "Results reflect available evidence at the time of analysis."
        ),
    )