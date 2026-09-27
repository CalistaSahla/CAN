"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/footer";

const dimensions = [
  ["Security", "Signals from HTTPS, TLS, redirects, and security headers."],
  ["Authenticity", "Domain and identity context that can be observed from a URL."],
  ["Transparency", "Visible ownership, contact, policy, and service information."],
  ["Behavior", "Observable response and page behavior during a check."],
  ["Network", "External domains and services referenced by the website."],
  ["Data Exposure", "Information categories a page appears to request."],
];

const process = [
  "Input URL",
  "Collect Evidence",
  "Analyze",
  "Trust DNA",
  "CAN Explain",
  "User Decision",
];

const explainItems = [
  ["What", "What was observed on the website?"],
  ["Why", "Why does that evidence matter?"],
  ["Evidence", "Which source supports the finding?"],
  ["Impact", "What should you keep in mind?"],
  ["Action", "What can you choose to do next?"],
];

export default function HomePage() {
  const [url, setUrl] = useState("");
  const [urlError, setUrlError] = useState("");
  const router = useRouter();

  function handleScan(event) {
    event.preventDefault();
    const cleanUrl = url.trim();

    if (!cleanUrl) {
      setUrlError("Enter a website address to view the demo scan.");
      return;
    }

    let parsedUrl;
    try {
      parsedUrl = new URL(
        /^[a-z][a-z\d+.-]*:\/\//i.test(cleanUrl)
          ? cleanUrl
          : `https://${cleanUrl}`,
      );
    } catch {
      setUrlError("That address does not look valid. Check it and try again.");
      return;
    }

    if (!['http:', 'https:'].includes(parsedUrl.protocol) || !parsedUrl.hostname.includes('.')) {
      setUrlError("Use a public website address beginning with http:// or https://.");
      return;
    }

    router.push(`/scan?mode=demo&url=${encodeURIComponent(parsedUrl.href)}`);
  }

  return (
    <main className="can-site">
      <Navbar />

      <section className="can-hero" aria-labelledby="hero-title">
        <div className="can-hero-copy">
          <p className="can-kicker">An Explainable Web Trust Intelligence Platform</p>
          <h1 id="hero-title">
            Can you trust <em>this?</em>
          </h1>
          <p className="can-hero-lede">
            Paste a URL. Understand what was found, why it matters, and what
            evidence can help you decide.
          </p>

          <form className="can-scan-form" onSubmit={handleScan} noValidate>
            <label className="sr-only" htmlFor="website-url">Website URL</label>
            <input
              id="website-url"
              type="text"
              inputMode="url"
              autoComplete="url"
              spellCheck="false"
              value={url}
              onChange={(event) => {
                setUrl(event.target.value);
                setUrlError("");
              }}
              placeholder="Enter a website URL"
              aria-invalid={Boolean(urlError)}
              aria-describedby={urlError ? "url-error" : "url-note"}
            />
            <button className="can-button" type="submit">View demo scan</button>
          </form>
          {urlError ? (
            <p id="url-error" className="can-form-error" role="alert">{urlError}</p>
          ) : (
            <p id="url-note" className="can-form-note">
              Try a public URL, such as example.com. This opens the current demo flow.
            </p>
          )}
          <p className="can-hero-footnote">
            Demo only. This preview uses illustrative results, not a live website analysis.
            CAN provides context from available evidence and never guarantees safety.
          </p>
        </div>

        <aside className="can-report-preview" aria-label="Illustration of a CAN report structure">
          <div className="can-preview-topline">
            <p className="can-preview-caption">CAN report structure</p>
            <p className="can-preview-sample">Illustration</p>
          </div>
          <div className="can-preview-body">
            <p className="can-preview-url-label">Submitted website</p>
            <p className="can-preview-url">[website URL]</p>
            <div className="can-preview-confidence">
              <div className="can-preview-score" aria-label="Illustrative score placeholder">
                <strong>--</strong>
                <span>NOT A RESULT</span>
              </div>
              <div className="can-preview-summary">
                <p>Trust Confidence</p>
                <strong>Based on available evidence</strong>
              </div>
            </div>
            <p className="can-preview-evidence-title">Evidence record</p>
            <ul className="can-preview-evidence">
              <li><span className="can-evidence-mark" aria-hidden="true" />Source and check type</li>
              <li><span className="can-evidence-mark" aria-hidden="true" />Observed status and timestamp</li>
              <li><span className="can-evidence-mark" aria-hidden="true" />Explanation linked to a finding</li>
            </ul>
          </div>
        </aside>
      </section>

      <section className="can-section can-process-section" id="how-it-works" aria-labelledby="process-title">
        <div className="can-section-inner">
          <div className="can-section-heading">
            <p className="can-kicker">From URL to an informed choice</p>
            <h2 id="process-title">A clear path from evidence to decision.</h2>
          </div>
          <ol className="can-process-list">
            {process.map((step, index) => (
              <li className="can-process-step" key={step}>
                <span>0{index + 1}</span>
                <strong>{step}</strong>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="can-section" id="dimensions" aria-labelledby="dimensions-title">
        <div className="can-section-inner can-dimensions-layout">
          <div className="can-section-heading">
            <p className="can-kicker">Trust DNA</p>
            <h2 id="dimensions-title">Six dimensions. Each tied to observable signals.</h2>
            <p>
              The profile groups evidence into the six dimensions in the CAN proposal.
              A missing signal stays missing; it is not treated as a positive result.
            </p>
          </div>
          <ol className="can-dimensions-list">
            {dimensions.map(([title, text], index) => (
              <li className="can-dimension-row" key={title}>
                <span className="can-dimension-index">0{index + 1}</span>
                <strong>{title}</strong>
                <span>{text}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="can-section can-trust-section" id="trust-model" aria-labelledby="trust-title">
        <div className="can-section-inner can-trust-grid">
          <div>
            <p className="can-kicker">Trust is not just a score</p>
            <h2 id="trust-title">A number without its evidence is not the whole story.</h2>
            <p className="can-trust-intro">
              CAN is an interpretation layer, not an antivirus or an absolute verdict.
              It connects findings to their evidence and gives people room to decide.
            </p>
          </div>
          <ol className="can-explain-list">
            {explainItems.map(([label, text]) => (
              <li key={label}>
                <strong>{label}</strong>
                <span>{text}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="can-section" aria-label="Start a demo scan">
        <div className="can-section-inner can-final-cta">
          <p>
            CAN does not guarantee that a website is safe or malicious. Results depend on
            the evidence available at the time of analysis.
          </p>
          <a className="can-button" href="#website-url">Enter a URL</a>
        </div>
      </section>

      <Footer />
    </main>
  );
}