export const CAN_API_BASE_URL = (
  process.env.NEXT_PUBLIC_CAN_API_URL || "http://localhost:8000"
).replace(/\/+$/, "");

const DEMO_REPORT = {
  scan_id: "demo",
  requested_url: "https://example.com",
  analysis_target: "https://example.com",
  mode: "demo",
  created_at: new Date().toISOString(),
  completed_at: new Date().toISOString(),
  rules_version: "0.1",
  trust_confidence: {
    label: "medium",
    coverage_percent: 62,
    explanation:
      "Evidence was collected across four of the six dimensions. Two dimensions lack a scoring basis due to unavailable signals in this demo.",
    observed_dimensions: 4,
    total_dimensions: 6,
  },
  trust_dna: [
    {
      dimension: "security",
      score: 88,
      confidence: "high",
      explanation: "HTTPS is active and the TLS certificate is valid. Security headers are partially present.",
      observed_factors: 4,
      total_factors: 5,
    },
    {
      dimension: "authenticity",
      score: 74,
      confidence: "medium",
      explanation: "Domain is registered and resolves correctly. WHOIS information is available but partially redacted.",
      observed_factors: 3,
      total_factors: 4,
    },
    {
      dimension: "transparency",
      score: 61,
      confidence: "medium",
      explanation: "A privacy policy link was found in the initial HTML. Contact information is not prominently linked.",
      observed_factors: 2,
      total_factors: 4,
    },
    {
      dimension: "behavior",
      score: 90,
      confidence: "high",
      explanation: "HTTP response returned 200 OK. One redirect was observed and resolved to a consistent HTTPS destination.",
      observed_factors: 3,
      total_factors: 3,
    },
    {
      dimension: "network",
      score: null,
      confidence: "unavailable",
      explanation: "External resource analysis was not performed in this demo.",
      observed_factors: 0,
      total_factors: 0,
    },
    {
      dimension: "data_exposure",
      score: null,
      confidence: "unavailable",
      explanation: "Form field analysis was not performed in this demo.",
      observed_factors: 0,
      total_factors: 0,
    },
  ],
  findings: [
    {
      id: "f1",
      dimension: "transparency",
      severity: "attention",
      confidence: "medium",
      what: "Contact information is not directly linked from the homepage.",
      why: "Accessible contact information is a transparency signal that helps users reach the website operator.",
      evidence: "No mailto: or contact page link was detected in initial HTML.",
      impact: "Users who want to reach the operator may need to search for contact details.",
      action: "Check whether a contact page or email address is reachable from the website.",
    },
    {
      id: "f2",
      dimension: "security",
      severity: "information",
      confidence: "high",
      what: "HTTPS is active and the TLS certificate is valid.",
      why: "An active HTTPS connection means data exchanged with the site is encrypted in transit.",
      evidence: "TLS handshake succeeded. Certificate is valid and not expired.",
      impact: "Data you submit to this website travels over an encrypted channel.",
      action: "No action needed. Continue to verify other dimensions before sharing sensitive information.",
    },
    {
      id: "f3",
      dimension: "authenticity",
      severity: "information",
      confidence: "medium",
      what: "WHOIS registrant details are partially redacted.",
      why: "Redacted registration data is common under privacy protection services, but reduces observable identity signals.",
      evidence: "WHOIS query returned privacy-protected registrant fields.",
      impact: "The identity of the domain owner cannot be independently confirmed from public records.",
      action: "Consider this in combination with other transparency signals before providing personal information.",
    },
  ],
  evidence: [
    { id: "e1", dimension: "security", kind: "tls_certificate", status: "observed", explanation: "Valid TLS certificate found. Not expired." },
    { id: "e2", dimension: "security", kind: "https_active", status: "observed", explanation: "Site is accessible over HTTPS." },
    { id: "e3", dimension: "security", kind: "hsts_header", status: "not_detected", explanation: "Strict-Transport-Security header was not present in the HTTP response." },
    { id: "e4", dimension: "behavior", kind: "http_status", status: "observed", explanation: "HTTP 200 OK returned on initial request." },
    { id: "e5", dimension: "behavior", kind: "redirect_chain", status: "observed", explanation: "One redirect observed; destination resolves to HTTPS." },
    { id: "e6", dimension: "transparency", kind: "privacy_policy_link", status: "observed", explanation: "A link matching privacy policy patterns was found in the page HTML." },
    { id: "e7", dimension: "transparency", kind: "contact_link", status: "not_detected", explanation: "No contact page or mailto link detected in initial HTML." },
    { id: "e8", dimension: "authenticity", kind: "whois_registrant", status: "observed", explanation: "WHOIS data retrieved; registrant fields are privacy-protected." },
    { id: "e9", dimension: "network", kind: "external_resources", status: "unavailable", explanation: "External resource analysis was not performed in this demo." },
    { id: "e10", dimension: "data_exposure", kind: "form_fields", status: "unavailable", explanation: "Form field analysis was not performed in this demo." },
  ],
  disclaimer:
    "This report reflects observable evidence at the time of analysis. CAN is not an antivirus and makes no claim that this website is absolutely safe or malicious. Evidence availability varies by website and analysis mode.",
};

export async function startScan(url) {
  const response = await fetch(`${CAN_API_BASE_URL}/api/scan`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url }),
  });
  const data = await response.json();
  if (!response.ok) {
    const message = data?.detail?.message || data?.detail || `Scan request failed (${response.status})`;
    const code = data?.detail?.code || "scan_request_failed";
    const err = new Error(message);
    err.code = code;
    err.status = response.status;
    throw err;
  }
  return data;
}

export async function getScanStatus(scanId) {
  const response = await fetch(`${CAN_API_BASE_URL}/api/scan/${encodeURIComponent(scanId)}/status`);
  const data = await response.json();
  if (!response.ok) {
    const message = data?.detail?.message || data?.detail || `Status request failed (${response.status})`;
    const code = data?.detail?.code || "status_request_failed";
    const err = new Error(message);
    err.code = code;
    err.status = response.status;
    throw err;
  }
  return data;
}

export async function getReport(scanId) {
  if (scanId === "demo") {
    return { ...DEMO_REPORT, scan_id: "demo" };
  }
  try {
    const response = await fetch(`${CAN_API_BASE_URL}/api/report/${encodeURIComponent(scanId)}`);
    const data = await response.json();
    if (!response.ok) {
      const message = data?.detail?.message || data?.detail || `Report request failed (${response.status})`;
      const code = data?.detail?.code || "report_request_failed";
      const err = new Error(message);
      err.code = code;
      err.status = response.status;
      throw err;
    }
    return data;
  } catch (err) {
    if (scanId?.startsWith("demo")) {
      return { ...DEMO_REPORT, scan_id: scanId };
    }
    throw err;
  }
}

export function dimensionLabel(key) {
  const labels = {
    security: "Security",
    authenticity: "Authenticity",
    transparency: "Transparency",
    behavior: "Behavior",
    network: "Network",
    data_exposure: "Data Exposure",
  };
  return labels[key] ?? key;
}

export function dimensionDescription(key) {
  const descriptions = {
    security: "HTTPS, TLS certificate, and security header controls.",
    authenticity: "Domain and identity context observable from a URL.",
    transparency: "Ownership, contact, and policy links in initial HTML.",
    behavior: "HTTP response status and redirect chain.",
    network: "External domains referenced in initial HTML.",
    data_exposure: "Input categories associated with form fields.",
  };
  return descriptions[key] ?? "";
}

export function confidenceLabelText(label) {
  const map = {
    high: "High evidence coverage",
    medium: "Partial evidence coverage",
    low: "Limited evidence coverage",
  };
  return map[label] ?? "Coverage unknown";
}

export function severityLabel(severity) {
  return severity === "attention" ? "Attention" : "Information";
}
