'use client';

import { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/footer';

const scanStages = [
  ['Security', 'HTTPS, TLS, redirects, and security headers'],
  ['Authenticity', 'Domain and identity context'],
  ['Transparency', 'Ownership, contact, and policy signals'],
  ['Behavior', 'Observable response and page behavior'],
  ['Network', 'External domains and services'],
  ['Data Exposure', 'Information categories a page appears to request'],
];

function normalizeWebUrl(value) {
  const trimmedValue = value.trim();
  if (!trimmedValue) return null;

  try {
    const parsedUrl = new URL(
      /^[a-z][a-z\d+.-]*:\/\//i.test(trimmedValue)
        ? trimmedValue
        : `https://${trimmedValue}`,
    );

    if (!['http:', 'https:'].includes(parsedUrl.protocol)) return null;
    if (!parsedUrl.hostname.includes('.')) return null;

    return parsedUrl.href;
  } catch {
    return null;
  }
}

function ScanExperience() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const requestedUrl = searchParams.get('url') || '';
  const mode = searchParams.get('mode');
  const scanUrl = mode === 'demo' ? normalizeWebUrl(requestedUrl) : null;
  const [draftUrl, setDraftUrl] = useState('');
  const [validationError, setValidationError] = useState('');
  const [activeStage, setActiveStage] = useState(0);
  const completed = Boolean(scanUrl) && activeStage >= scanStages.length;
  const progress = Math.round((Math.min(activeStage, scanStages.length) / scanStages.length) * 100);
  const reportHref = scanUrl
    ? `/periksa/hasil?mode=demo&url=${encodeURIComponent(scanUrl)}`
    : '/';

  useEffect(() => {
    if (!scanUrl || completed) return undefined;

    const stageTimer = setInterval(() => {
      setActiveStage((currentStage) => Math.min(currentStage + 1, scanStages.length));
    }, 950);

    return () => clearInterval(stageTimer);
  }, [scanUrl, completed]);

  useEffect(() => {
    if (!completed) return undefined;

    const reportTimer = setTimeout(() => router.replace(reportHref), 2200);
    return () => clearTimeout(reportTimer);
  }, [completed, reportHref, router]);

  function handleSubmit(event) {
    event.preventDefault();
    const normalizedUrl = normalizeWebUrl(draftUrl);

    if (!normalizedUrl) {
      setValidationError('Enter a valid website address using HTTP or HTTPS.');
      return;
    }

    router.push(`/scan?mode=demo&url=${encodeURIComponent(normalizedUrl)}`);
  }

  const queryError = requestedUrl && mode !== 'demo'
    ? 'Live scanning is not connected yet. Use the clearly labeled demo flow.'
    : requestedUrl && !scanUrl
      ? 'The URL is invalid. Enter a valid HTTP or HTTPS website address.'
      : '';
  const formError = validationError || queryError;

  return (
    <main className="can-site can-scan-page">
      <Navbar currentPage="scan" />

      {scanUrl ? (
        <section className="can-scan-shell" aria-labelledby="scan-title">
          <div className="can-scan-intro">
            <p className="can-kicker">CAN Scan / demonstration</p>
            <h1 id="scan-title">Following the evidence path.</h1>
            <p>
              This demo walks through the six planned analysis dimensions. It does not
              send a request to the website or collect live evidence.
            </p>
          </div>

          <div className="can-scan-layout">
            <section className="can-scan-target" aria-label="Submitted website">
              <p className="can-scan-label">Website submitted</p>
              <p className="can-scan-url">{scanUrl}</p>
              <div className="can-scan-notice" role="note">
                <strong>Demo mode</strong>
                <span>All progress on this screen is illustrative.</span>
              </div>
              <Link className="can-scan-cancel" href="/scan">
                Stop demo and enter another URL
              </Link>
            </section>

            <section className="can-scan-progress" aria-label="Demo scan progress">
              <div className="can-scan-progress-heading">
                <div>
                  <p className="can-scan-label">{completed ? 'Sequence complete' : 'Demo sequence'}</p>
                  <h2 aria-live="polite">
                    {completed ? 'Preview ready' : `Demo step: ${scanStages[Math.min(activeStage, scanStages.length - 1)][0]}`}
                  </h2>
                </div>
                <span className="can-scan-percent">{progress}%</span>
              </div>

              <div
                className="can-scan-progress-track"
                role="progressbar"
                aria-label="Demo scan progress"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={progress}
                aria-valuetext={`${Math.min(activeStage, scanStages.length)} of ${scanStages.length} demo stages`}
              >
                <span style={{ width: `${progress}%` }} />
              </div>

              <ol className="can-scan-stage-list">
                {scanStages.map(([title, description], index) => {
                  const stageState = completed || index < activeStage
                    ? 'Previewed'
                    : index === activeStage
                      ? 'In demo'
                      : 'Not run';

                  return (
                    <li className="can-scan-stage" key={title}>
                      <span className="can-scan-stage-number">0{index + 1}</span>
                      <div className="can-scan-stage-copy">
                        <strong>{title}</strong>
                        <span>{description}</span>
                      </div>
                      <span className="can-scan-stage-state">{stageState}</span>
                    </li>
                  );
                })}
              </ol>

              {completed && (
                <div className="can-scan-complete" role="status">
                  <p>Demo sequence complete. The following report is labeled demonstration data.</p>
                  <Link className="can-button" href={reportHref}>View demo report</Link>
                </div>
              )}
            </section>
          </div>
        </section>
      ) : (
        <section className="can-scan-shell can-scan-entry" aria-labelledby="scan-title">
          <div className="can-scan-intro">
            <p className="can-kicker">CAN Scan</p>
            <h1 id="scan-title">Start with a website address.</h1>
            <p>
              The current flow is a presentation demo. Live evidence collection will be
              connected after the scan API and analysis pipeline are implemented.
            </p>
          </div>

          <form className="can-scan-form" onSubmit={handleSubmit} noValidate>
            <label className="sr-only" htmlFor="scan-url">Website URL</label>
            <input
              id="scan-url"
              type="text"
              inputMode="url"
              autoComplete="url"
              spellCheck="false"
              value={draftUrl}
              onChange={(event) => {
                setDraftUrl(event.target.value);
                setValidationError('');
              }}
              placeholder="Enter a website URL"
              aria-invalid={Boolean(formError)}
              aria-describedby={formError ? 'scan-url-error' : 'scan-url-help'}
            />
            <button className="can-button" type="submit">Start demo scan</button>
          </form>
          {formError ? (
            <p className="can-form-error" id="scan-url-error" role="alert">{formError}</p>
          ) : (
            <p className="can-form-note" id="scan-url-help">
              Demo only. No request will be sent to the submitted website.
            </p>
          )}
        </section>
      )}

      <Footer />
    </main>
  );
}

export default function ScanPage() {
  return (
    <Suspense
      fallback={
        <main className="can-site can-scan-page">
          <div className="can-scan-shell" role="status">Loading scan interface...</div>
        </main>
      }
    >
      <ScanExperience />
    </Suspense>
  );
}