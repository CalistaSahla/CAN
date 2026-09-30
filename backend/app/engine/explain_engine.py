from app.schemas import EvidenceDraft, FindingDraft


def create_findings(evidence: list[EvidenceDraft]) -> list[FindingDraft]:
    findings: list[FindingDraft] = []
    by_kind = {item.kind: item for item in evidence}

    https = by_kind.get("https_enabled")
    if https and https.value and https.value.get("enabled") is False:
        findings.append(
            FindingDraft(
                dimension="security",
                severity="attention",
                confidence="high",
                what="The final response used HTTP, not HTTPS.",
                why="HTTP does not provide TLS transport encryption for this response.",
                evidence_kinds=["https_enabled"],
                impact="Information exchanged during a visit may not be protected in transit.",
                action="Avoid submitting sensitive information unless the site provides a verified HTTPS connection.",
            )
        )

    status = by_kind.get("http_response")
    if status and status.value and status.value.get("status_code", 0) >= 400:
        findings.append(
            FindingDraft(
                dimension="behavior",
                severity="attention",
                confidence="high",
                what=f"The final response returned HTTP {status.value['status_code']}.",
                why="The server returned an error status for the request made during this check.",
                evidence_kinds=["http_response"],
                impact="Some site content or functions may not be available at the time of this check.",
                action="Try again later and confirm the address before continuing.",
            )
        )

    policy = by_kind.get("privacy_policy_link")
    if policy and policy.status == "not_detected":
        findings.append(
            FindingDraft(
                dimension="transparency",
                severity="information",
                confidence="medium",
                what="No privacy-policy link was found in the initial HTML.",
                why="A privacy policy can explain how a site describes its handling of personal information.",
                evidence_kinds=["privacy_policy_link"],
                impact="The policy may be absent or rendered in content this initial HTML check does not inspect.",
                action="Look for the site's privacy information before providing personal data.",
            )
        )

    domains = by_kind.get("external_domains_in_initial_html")
    if domains and domains.value and domains.value.get("count", 0) > 0:
        domain_list = ", ".join(domains.value["domains"][:5])
        findings.append(
            FindingDraft(
                dimension="network",
                severity="information",
                confidence="medium",
                what=f"The initial HTML references {domains.value['count']} external domain(s).",
                why="Third-party services can provide functions such as media, analytics, or authentication.",
                evidence_kinds=["external_domains_in_initial_html"],
                impact=f"The page references: {domain_list}. This check did not contact those domains.",
                action="Review which external services are necessary before sharing sensitive information.",
            )
        )

    categories = by_kind.get("form_data_categories")
    if categories and categories.value and categories.value.get("categories"):
        labels = ", ".join(categories.value["categories"])
        findings.append(
            FindingDraft(
                dimension="data_exposure",
                severity="information",
                confidence="medium",
                what=f"The initial HTML contains form fields associated with: {labels}.",
                why="Input types and autocomplete hints can indicate which information a form may request.",
                evidence_kinds=["form_data_categories"],
                impact="JavaScript-rendered forms and form submission behavior were not inspected.",
                action="Review each field and the site's stated purpose before submitting information.",
            )
        )

    return findings