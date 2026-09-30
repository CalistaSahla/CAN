import unittest
from datetime import UTC, datetime
from unittest.mock import patch

from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app.config import Settings, get_settings
from app.db import Base, get_db
from app.analysis.collector import CollectedSite
from app import models
from app.api import scans as scan_routes
from app.main import app as fastapi_app
from app.security.rate_limit import InMemoryScanRateLimiter
from app.services.scan_service import create_scan_record, process_scan


class ScanApiTests(unittest.TestCase):
    def setUp(self):
        scan_routes.scan_rate_limiter = InMemoryScanRateLimiter()
        self.engine = create_engine(
            "sqlite+pysqlite:///:memory:",
            connect_args={"check_same_thread": False},
            poolclass=StaticPool,
        )
        Base.metadata.create_all(self.engine)
        self.session_factory = sessionmaker(bind=self.engine, autoflush=False, expire_on_commit=False)

        def override_db():
            session = self.session_factory()
            try:
                yield session
            finally:
                session.close()

        fastapi_app.dependency_overrides[get_db] = override_db
        fastapi_app.dependency_overrides[get_settings] = lambda: Settings(
            _env_file=None,
            demo_mode=True,
            database_url="sqlite+pysqlite:///:memory:",
        )
        self.client = TestClient(fastapi_app)

    def tearDown(self):
        fastapi_app.dependency_overrides.clear()
        self.engine.dispose()

    def test_create_scan_returns_queued_state_and_sanitizes_url(self):
        with patch("app.api.scans.process_scan") as process_task:
            response = self.client.post(
                "/api/scan",
                json={"url": "https://example.com/account?token=secret"},
            )

        self.assertEqual(response.status_code, 202)
        body = response.json()
        self.assertEqual(body["status"], "queued")
        self.assertEqual(body["mode"], "demo")
        process_task.assert_called_once()

        status_response = self.client.get(f"/api/scan/{body['scan_id']}/status")
        self.assertEqual(status_response.json()["status"], "queued")
        report_response = self.client.get(f"/api/report/{body['scan_id']}")
        self.assertEqual(report_response.status_code, 409)

        session = self.session_factory()
        try:
            stored_scan = session.get(models.Scan, body["scan_id"])
            self.assertEqual(stored_scan.requested_url, "https://example.com/account")
        finally:
            session.close()

    def test_rejects_private_ip_before_creating_a_scan(self):
        response = self.client.post("/api/scan", json={"url": "http://127.0.0.1/admin"})

        self.assertEqual(response.status_code, 422)
        self.assertEqual(response.json()["detail"]["code"], "blocked_address")

    def test_scan_endpoint_enforces_configured_rate_limit(self):
        fastapi_app.dependency_overrides[get_settings] = lambda: Settings(
            _env_file=None,
            demo_mode=True,
            database_url="sqlite+pysqlite:///:memory:",
            scan_rate_limit_requests=1,
        )
        with patch("app.api.scans.process_scan"):
            first = self.client.post("/api/scan", json={"url": "https://example.com/"})
            second = self.client.post("/api/scan", json={"url": "https://example.com/"})

        self.assertEqual(first.status_code, 202)
        self.assertEqual(second.status_code, 429)
        self.assertGreaterEqual(int(second.headers["Retry-After"]), 1)

    def test_demo_pipeline_persists_report_and_evidence_provenance(self):
        session = self.session_factory()
        scan = create_scan_record(session, "https://example.com/?token=secret", "demo")
        scan_id = scan.id
        session.close()

        settings = Settings(_env_file=None, demo_mode=True, database_url="sqlite+pysqlite:///:memory:")
        process_scan(scan_id, "https://example.com/?token=secret", settings, self.session_factory)

        response = self.client.get(f"/api/report/{scan_id}")
        self.assertEqual(response.status_code, 200)
        report = response.json()
        self.assertEqual(report["mode"], "demo")
        self.assertEqual(report["requested_url"], "https://example.com/")
        self.assertEqual(report["analysis_target"], "https://demo.example.invalid")
        self.assertEqual(len(report["trust_dna"]), 6)
        self.assertTrue(report["evidence"])
        self.assertTrue(all(item["source"] == "demo_fixture_v1" for item in report["evidence"]))
        self.assertTrue(all(finding["evidence_ids"] for finding in report["findings"]))

    def test_live_pipeline_uses_collected_evidence_without_demo_fixtures(self):
        session = self.session_factory()
        scan = create_scan_record(session, "https://example.com/", "live")
        scan_id = scan.id
        session.close()
        observation = CollectedSite(
            requested_url="https://example.com/",
            final_url="https://example.com/",
            status_code=200,
            redirects=(),
            response_headers={
                "strict-transport-security": "max-age=31536000",
                "content-security-policy": "default-src 'self'",
                "x-content-type-options": "nosniff",
            },
            cookie_flags={"cookie_count": 0, "secure_count": 0, "http_only_count": 0, "same_site_count": 0},
            tls_certificate={"subject": "CN=example.com", "issuer": "CN=Test CA", "not_after": "2030-01-01"},
            html_signals={
                "form_count": 1,
                "input_types": ["email"],
                "data_categories": ["email address"],
                "external_domains": ["cdn.example.net"],
                "contact_link_visible": True,
                "privacy_link_visible": True,
            },
            resolved_address_count=1,
            observed_at=datetime.now(UTC),
        )
        settings = Settings(_env_file=None, demo_mode=False, database_url="sqlite+pysqlite:///:memory:")

        with patch("app.services.scan_service.collect_initial_response", return_value=observation):
            process_scan(scan_id, "https://example.com/", settings, self.session_factory)

        response = self.client.get(f"/api/report/{scan_id}")
        self.assertEqual(response.status_code, 200)
        report = response.json()
        self.assertEqual(report["mode"], "live")
        self.assertEqual(report["analysis_target"], "https://example.com/")
        self.assertTrue(report["trust_dna"])
        self.assertTrue(report["findings"])
        self.assertFalse(any(item["source"] == "demo_fixture_v1" for item in report["evidence"]))


if __name__ == "__main__":
    unittest.main()