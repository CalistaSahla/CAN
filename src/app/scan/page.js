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
  const scanUrl = normalizeWebUrl(requestedUrl);
  const [draftUrl, setDraftUrl] = useState('');
  const [validationError, setValidationError] = useState('');
  const [activeStage, setActiveStage] = useState(0);
  const completed = Boolean(scanUrl) && activeStage >= scanStages.length;
  const progress = Math.round((Math.min(activeStage, scanStages.length) / scanStages.length) * 100);
  const reportHref = `/report/demo?url=${encodeURIComponent(scanUrl || '')}`;

  useEffect(() => {
    if (!scanUrl || completed) return undefined;

    const stageTimer = setInterval(() => {
      setActiveStage((currentStage) => Math.min(currentStage + 1, scanStages.length));
    }, 850);

    return () => clearInterval(stageTimer);
  }, [scanUrl, completed]);

  useEffect(() => {
    if (!completed) return undefined;

    const reportTimer = setTimeout(() => router.replace(reportHref), 1800);
    return () => clearTimeout(reportTimer);
  }, [completed, reportHref, router]);

  function handleSubmit(event) {
    if (event) event.preventDefault();
    const normalizedUrl = normalizeWebUrl(draftUrl);

    if (!normalizedUrl) {
      setValidationError('Please enter a valid website address (e.g. example.com).');
      return;
    }

    router.push(`/scan?mode=demo&url=${encodeURIComponent(normalizedUrl)}`);
  }

  function handleSelectPreset(presetDomain) {
    const normalizedUrl = normalizeWebUrl(presetDomain);
    if (normalizedUrl) {
      router.push(`/scan?mode=demo&url=${encodeURIComponent(normalizedUrl)}`);
    }
  }

  const queryError = requestedUrl && !scanUrl
    ? 'The address format is invalid. Please check and try again.'
    : '';
  const formError = validationError || queryError;

  const currentStageName = scanStages[Math.min(activeStage, scanStages.length - 1)][0];

  return (
    <main className="can-site can-scan-page">
      <Navbar currentPage="scan" />

      {scanUrl ? (
        <section className="can-scan-shell" aria-labelledby="scan-title">
          <div className="can-scan-intro">
            <p className="can-kicker">CAN Scan / In Progress</p>
            <h1 id="scan-title">Following the evidence path.</h1>
            <p>
              CAN is inspecting observable technical signals across the six Trust DNA dimensions.
              Every indicator links back to verifiable evidence.
            </p>
          </div>

          <div className="can-scan-layout">
            <section className="can-scan-target" aria-label="Submitted website">
              <p className="can-scan-label">Target website</p>
              <p className="can-scan-url">{scanUrl}</p>
              <div className="can-scan-notice" role="note">
                <strong>Demonstration Mode</strong>
                <span>Illustrative analysis simulating the full CAN Trust Engine pipeline.</span>
              </div>
              <Link className="can-scan-cancel" href="/scan">
                ← Cancel and test another website
              </Link>
            </section>

            <section className="can-scan-progress" aria-label="Demo scan progress">
              <div className="can-scan-progress-heading">
                <div>
                  <p className="can-scan-label">
                    {completed ? 'Evaluation complete' : 'Active inspection'}
                  </p>
                  <h2 aria-live="polite">
                    {completed ? 'Trust report ready' : `Evaluating: ${currentStageName}`}
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
                aria-valuetext={`${Math.min(activeStage, scanStages.length)} of ${scanStages.length} stages`}
              >
                <span style={{ width: `${progress}%`, transition: 'width 0.4s ease' }} />
              </div>

              <ol className="can-scan-stage-list">
                {scanStages.map(([title, description], index) => {
                  const isDone = completed || index < activeStage;
                  const isCurrent = !completed && index === activeStage;
                  const stageState = isDone
                    ? 'Evaluated ✓'
                    : isCurrent
                      ? 'Analyzing...'
                      : 'Pending';

                  return (
                    <li
                      className="can-scan-stage"
                      key={title}
                      style={{
                        opacity: index > activeStage ? 0.45 : 1,
                        transition: 'opacity 0.3s ease',
                      }}
                    >
                      <span className="can-scan-stage-number">0{index + 1}</span>
                      <div className="can-scan-stage-copy">
                        <strong>{title}</strong>
                        <span>{description}</span>
                      </div>
                      <span
                        className="can-scan-stage-state"
                        style={{
                          color: isDone ? 'var(--site-evidence)' : isCurrent ? 'var(--site-accent)' : 'var(--site-muted)',
                          fontWeight: isCurrent ? 700 : 500,
                        }}
                      >
                        {stageState}
                      </span>
                    </li>
                  );
                })}
              </ol>

              {completed && (
                <div className="can-scan-complete can-animate-in" role="status">
                  <p>Trust DNA dimensions calculated. Opening your explainable report...</p>
                  <Link className="can-button" href={reportHref}>
                    Open report now →
                  </Link>
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
              Enter any domain or public URL to inspect observable technical indicators,
              data exposure footprint, and Trust DNA signals.
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
              placeholder="e.g. tokopedia.com or example.com"
              aria-invalid={Boolean(formError)}
              aria-describedby={formError ? 'scan-url-error' : 'scan-url-help'}
            />
            <button className="can-button" type="submit">Start scan</button>
          </form>

          {formError ? (
            <p className="can-form-error" id="scan-url-error" role="alert">{formError}</p>
          ) : (
            <p className="can-form-note" id="scan-url-help">
              Or click one of the quick test sample domains below:
            </p>
          )}

          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '16px' }}>
            {['tokopedia.com', 'example.com', 'sample-store.net'].map((sample) => (
              <button
                key={sample}
                type="button"
                className="can-filter-pill"
                onClick={() => handleSelectPreset(sample)}
              >
                Scan {sample} →
              </button>
            ))}
          </div>
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