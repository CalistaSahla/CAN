import unittest

from app.engine.explain_engine import create_findings
from app.engine.trust_engine import compute_trust_profile
from app.schemas import EvidenceDraft


def evidence(kind, dimension, status, value):
    return EvidenceDraft(
        dimension=dimension,
        kind=kind,
        source="unit_test_fixture",
        status=status,
        value=value,
        explanation="Unit-test evidence fixture.",
    )


class TrustEngineTests(unittest.TestCase):
    def test_scores_only_dimensions_with_configured_observed_factors(self):
        evidence_items = [
            evidence("https_enabled", "security", "observed", {"enabled": True}),
            evidence("tls_certificate_valid", "security", "observed", {"verified": True}),
            evidence("strict_transport_security", "security", "not_detected", {"present": False}),
            evidence("content_security_policy", "security", "observed", {"present": True}),
            evidence("x_content_type_options", "security", "not_detected", {"present": False}),
            evidence("referrer_policy", "security", "observed", {"present": True}),
            evidence("permissions_policy", "security", "unavailable", None),
        ]

        scores, confidence, rules_version = compute_trust_profile(evidence_items)
        by_dimension = {item.dimension: item for item in scores}

        self.assertEqual(rules_version, "1.0.0")
        self.assertEqual(by_dimension["security"].score, 72)
        self.assertIsNone(by_dimension["authenticity"].score)
        self.assertEqual(by_dimension["security"].observed_factors, 6)
        self.assertEqual(confidence.observed_dimensions, 1)
        self.assertEqual(confidence.coverage_percent, 17)
        self.assertIn("not the probability", confidence.explanation)

    def test_no_evidence_produces_no_scores_or_findings(self):
        scores, confidence, _ = compute_trust_profile([])

        self.assertEqual(len(scores), 6)
        self.assertTrue(all(item.score is None for item in scores))
        self.assertEqual(confidence.coverage_percent, 0)
        self.assertEqual(create_findings([]), [])

    def test_explanations_reference_the_evidence_that_supports_them(self):
        evidence_items = [
            evidence("https_enabled", "security", "observed", {"enabled": False}),
            evidence("external_domains_in_initial_html", "network", "observed", {
                "domains": ["cdn.example.net"],
                "count": 1,
            }),
        ]

        findings = create_findings(evidence_items)
        kinds = {item.kind for item in evidence_items}

        self.assertEqual(len(findings), 2)
        self.assertTrue(all(set(finding.evidence_kinds) <= kinds for finding in findings))
        self.assertTrue(all(finding.what and finding.why and finding.impact and finding.action for finding in findings))


if __name__ == "__main__":
    unittest.main()