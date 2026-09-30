'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

import {
  getReport,
  dimensionLabel,
  dimensionDescription,
  confidenceLabelText,
  severityLabel,
} from '../../../lib/can-api';

// ──────────────────────────────────────────────────────────
// Utilities
// ──────────────────────────────────────────────────────────

function formatTimestamp(isoString) {
  if (!isoString) return '—';
  try {
    return new Date(isoString).toLocaleString('en-GB', {
      day: 'numeric', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit', timeZoneName: 'short',
    });
  } catch {
    return isoString;
  }
}

function scoreColor(score) {
  if (score === null || score === undefined) return 'var(--color-text-muted)';
  if (score >= 70) return 'var(--color-success)';
  if (score >= 40) return 'var(--color-warning)';
  return 'var(--color-danger)';
}

function scoreArc(score) {
  // Returns stroke-dashoffset for a circle with r=36, circumference ≈ 226
  const circumference = 2 * Math.PI * 36;
  if (score === null || score === undefined) return circumference;
  return circumference - (score / 100) * circumference;
}

const DIMENSION_ORDER = [
  'security', 'authenticity', 'transparency',
  'behavior', 'network', 'data_exposure',
];

// ──────────────────────────────────────────────────────────
// Trust Confidence ring
// ──────────────────────────────────────────────────────────
function ConfidenceRing({ coverage, label }) {
  const circumference = 2 * Math.PI * 40;
  const offset = circumference - (coverage / 100) * circumference;

  return (
    <svg width="100" height="100" viewBox="0 0 100 100" aria-hidden="true">
      <circle
        cx="50" cy="50" r="40"
        fill="none" strokeWidth="8"
        stroke="var(--site-soft)"
      />
      <circle
        cx="50" cy="50" r="40"
        fill="none" strokeWidth="8"
        stroke={label === 'high' ? 'var(--color-success)' : label === 'medium' ? 'var(--color-warning)' : 'var(--color-danger)'}
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        transform="rotate(-90 50 50)"
        style={{ transition: 'stroke-dashoffset 0.8s ease' }}
      />
    </svg>
  );
}

// ──────────────────────────────────────────────────────────
// Trust DNA dimension card
// ──────────────────────────────────────────────────────────
function DnaCard({ dimension }) {
  const { dimension: key, score, confidence, explanation, observed_factors, total_factors } = dimension;
  const label = dimensionLabel(key);
  const description = dimensionDescription(key);
  const circumference = 2 * Math.PI * 36;
  const offset = scoreArc(score);
  const color = scoreColor(score);

  return (
    <article className="can-dna-card" aria-labelledby={`dna-${key}`}>
      <div className="can-dna-card-top">
        <div className="can-dna-ring-wrap" aria-hidden="true">
          <svg width="84" height="84" viewBox="0 0 84 84">
            <circle cx="42" cy="42" r="36" fill="none" strokeWidth="6" stroke="var(--site-soft)" />
            <circle
              cx="42" cy="42" r="36"
              fill="none" strokeWidth="6"
              stroke={score !== null ? color : 'var(--site-line)'}
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              transform="rotate(-90 42 42)"
              style={{ transition: 'stroke-dashoffset 0.8s ease' }}
            />
          </svg>
          <span className="can-dna-ring-score" style={{ color }}>
            {score !== null ? score : '—'}
          </span>
        </div>

        <div className="can-dna-card-meta">
          <h3 className="can-dna-card-title" id={`dna-${key}`}>{label}</h3>
          <p className="can-dna-card-desc">{description}</p>
        </div>
      </div>

      <div className="can-dna-card-body">
        <p className="can-dna-explanation">{explanation}</p>

        <div className="can-dna-meta-row">
          <span className={`can-dna-confidence can-dna-confidence--${confidence}`}>
            {confidence === 'unavailable' ? 'No scoring basis' : `${confidence} confidence`}
          </span>
          {total_factors > 0 && (
            <span className="can-dna-factors">
              {observed_factors}/{total_factors} signals observed
            </span>
          )}
        </div>
      </div>
    </article>
  );
}

// ──────────────────────────────────────────────────────────
// CAN Explain finding card
// ──────────────────────────────────────────────────────────
function FindingCard({ finding }) {
  const { dimension, severity, confidence, what, why, impact, action } = finding;
  const isAttention = severity === 'attention';

  return (
    <article
      className={`can-finding-card${isAttention ? ' can-finding-card--attention' : ''}`}
      aria-label={`Finding: ${what}`}
    >
      <header className="can-finding-header">
        <div className="can-finding-badges">
          <span className={`can-badge can-badge--${severity}`}>
            {severityLabel(severity)}
          </span>
          <span className="can-badge can-badge--dim">
            {dimensionLabel(dimension)}
          </span>
          <span className="can-badge can-badge--confidence">
            {confidence}
          </span>
        </div>
      </header>

      <dl className="can-finding-explain">
        <div className="can-explain-row">
          <dt>What</dt>
          <dd>{what}</dd>
        </div>
        <div className="can-explain-row">
          <dt>Why</dt>
          <dd>{why}</dd>
        </div>
        <div className="can-explain-row can-explain-row--highlight">
          <dt>Impact</dt>
          <dd>{impact}</dd>
        </div>
        <div className="can-explain-row">
          <dt>Action</dt>
          <dd>{action}</dd>
        </div>
      </dl>
    </article>
  );
}

// ──────────────────────────────────────────────────────────
// Evidence table
// ──────────────────────────────────────────────────────────
function EvidenceRow({ item }) {
  const statusMap = {
    observed: { label: 'Observed', cls: 'can-ev-status--observed' },
    not_detected: { label: 'Not detected', cls: 'can-ev-status--not-detected' },
    unavailable: { label: 'Unavailable', cls: 'can-ev-status--unavailable' },
  };
  const { label, cls } = statusMap[item.status] || { label: item.status, cls: '' };

  return (
    <tr>
      <td className="can-ev-cell can-ev-dim">{dimensionLabel(item.dimension)}</td>
      <td className="can-ev-cell can-ev-kind"><code>{item.kind}</code></td>
      <td className="can-ev-cell">
        <span className={`can-ev-status ${cls}`}>{label}</span>
      </td>
      <td className="can-ev-cell can-ev-explanation">{item.explanation}</td>
    </tr>
  );
}

// ──────────────────────────────────────────────────────────
// Loading skeleton
// ──────────────────────────────────────────────────────────
function ReportSkeleton() {
  return (
    <main className="can-site">

      <div className="can-report-shell" aria-busy="true" aria-label="Loading report">
        <div className="can-report-header">
          <div className="can-skeleton can-skeleton--line" style={{ width: '60%', height: 14 }} />
          <div className="can-skeleton can-skeleton--line" style={{ width: '80%', height: 40, marginTop: 12 }} />
        </div>
        <div className="can-skeleton can-skeleton--block" style={{ height: 180, marginTop: 32 }} />
        <div className="can-skeleton can-skeleton--block" style={{ height: 320, marginTop: 24 }} />
      </div>

    </main>
  );
}

// ──────────────────────────────────────────────────────────
// Error state
// ──────────────────────────────────────────────────────────
function ReportError({ message, scanId }) {
  return (
    <main className="can-site">

      <div className="can-report-shell">
        <div className="can-report-header">
          <p className="can-kicker" style={{ color: 'var(--site-accent)' }}>Report unavailable</p>
          <h1>Could not load this report.</h1>
          <p style={{ color: 'var(--site-muted)', fontSize: 15, marginTop: 8 }}>{message}</p>
        </div>
        <div style={{ marginTop: 32, display: 'flex', gap: 14, flexWrap: 'wrap' }}>
          <Link href="/scan" className="can-button">Scan another URL</Link>
          {scanId && (
            <button
              className="can-button-ghost"
              onClick={() => window.location.reload()}
            >
              Retry
            </button>
          )}
        </div>
      </div>

    </main>
  );
}

// ──────────────────────────────────────────────────────────
// Main report page
// ──────────────────────────────────────────────────────────
export default function ReportPage() {
  const { id: scanId } = useParams();
  const [report, setReport] = useState(null);
  const [status, setStatus] = useState('loading'); // loading | ready | error
  const [errorMessage, setErrorMessage] = useState('');
  const [activeTab, setActiveTab] = useState('overview'); // overview | dna | explain | evidence

  useEffect(() => {
    if (!scanId) return;

    async function fetchReport() {
      try {
        const data = await getReport(scanId);
        setReport(data);
        setStatus('ready');
      } catch (err) {
        setErrorMessage(err.message || 'The report could not be loaded.');
        setStatus('error');
      }
    }

    fetchReport();
  }, [scanId]);

  if (status === 'loading') return <ReportSkeleton />;
  if (status === 'error') return <ReportError message={errorMessage} scanId={scanId} />;

  const {
    requested_url,
    analysis_target,
    mode,
    created_at,
    completed_at,
    rules_version,
    trust_confidence,
    trust_dna,
    findings,
    evidence,
    disclaimer,
  } = report;

  // Sort trust_dna by DIMENSION_ORDER
  const sortedDna = [...trust_dna].sort(
    (a, b) => DIMENSION_ORDER.indexOf(a.dimension) - DIMENSION_ORDER.indexOf(b.dimension),
  );

  // Average score across dimensions that have a score
  const scoredDimensions = sortedDna.filter((d) => d.score !== null);
  const averageScore = scoredDimensions.length > 0
    ? Math.round(scoredDimensions.reduce((s, d) => s + d.score, 0) / scoredDimensions.length)
    : null;

  const attentionFindings = findings.filter((f) => f.severity === 'attention');
  const infoFindings = findings.filter((f) => f.severity === 'information');

  const tabs = [
    { key: 'overview', label: 'Overview' },
    { key: 'dna', label: 'Trust DNA' },
    { key: 'explain', label: 'CAN Explain' },
    { key: 'evidence', label: 'Evidence' },
  ];

  return (
    <main className="can-site">


      <div className="can-report-shell">

        {/* ── HEADER ── */}
        <header className="can-report-header">
          <Link href="/scan" className="can-report-back">← Scan another URL</Link>

          <div className="can-report-title-row">
            <div>
              <p className="can-kicker">
                Trust Report
                {mode === 'demo' && <span className="can-demo-badge">Demo</span>}
              </p>
              <h1 className="can-report-url" title={requested_url}>{requested_url}</h1>
              {analysis_target !== requested_url && (
                <p className="can-report-target">
                  Analysis target: <code>{analysis_target}</code>
                </p>
              )}
            </div>
            <div className="can-report-meta">
              <p><span>Completed</span>{formatTimestamp(completed_at)}</p>
              <p><span>Rules</span>v{rules_version}</p>
              <p><span>ID</span><code>{scanId?.slice(0, 8)}…</code></p>
            </div>
          </div>

          {mode === 'demo' && (
            <div className="can-demo-notice" role="note">
              <strong>Demonstration data.</strong> This report uses illustrative fixture data and does not reflect a live analysis of the submitted URL.
            </div>
          )}
        </header>

        {/* ── TRUST CONFIDENCE BANNER ── */}
        <section className="can-confidence-section" aria-labelledby="confidence-title">
          <div className="can-confidence-left">
            <div className="can-confidence-ring-wrap" aria-hidden="true">
              <ConfidenceRing coverage={trust_confidence.coverage_percent} label={trust_confidence.label} />
              <span className="can-confidence-percent">{trust_confidence.coverage_percent}%</span>
            </div>
            <div>
              <p className="can-kicker">Trust Confidence</p>
              <h2 id="confidence-title" className="can-confidence-label">
                {confidenceLabelText(trust_confidence.label)}
              </h2>
              <p className="can-confidence-explanation">{trust_confidence.explanation}</p>
            </div>
          </div>

          <div className="can-confidence-right">
            {averageScore !== null && (
              <div className="can-avg-score-wrap">
                <p className="can-avg-score-label">Evidence score<br /><span>(observed dimensions)</span></p>
                <strong className="can-avg-score">{averageScore}</strong>
              </div>
            )}
            <div className="can-confidence-dims">
              <p>{trust_confidence.observed_dimensions} of {trust_confidence.total_dimensions} dimensions have a scoring basis</p>
            </div>
          </div>
        </section>

        <p className="can-report-disclaimer">{disclaimer}</p>

        {/* ── TAB NAV ── */}
        <nav className="can-report-tabs" aria-label="Report sections">
          {tabs.map((t) => (
            <button
              key={t.key}
              className={`can-report-tab${activeTab === t.key ? ' can-report-tab--active' : ''}`}
              onClick={() => setActiveTab(t.key)}
              aria-selected={activeTab === t.key}
              role="tab"
            >
              {t.label}
              {t.key === 'explain' && findings.length > 0 && (
                <span className="can-tab-badge">{findings.length}</span>
              )}
              {t.key === 'evidence' && evidence.length > 0 && (
                <span className="can-tab-badge">{evidence.length}</span>
              )}
            </button>
          ))}
        </nav>

        {/* ── OVERVIEW TAB ── */}
        {activeTab === 'overview' && (
          <section aria-label="Report overview">

            {/* Key findings summary */}
            {findings.length > 0 ? (
              <div className="can-overview-findings">
                {attentionFindings.length > 0 && (
                  <div className="can-overview-group">
                    <h2 className="can-section-label">
                      Attention
                      <span className="can-count-badge">{attentionFindings.length}</span>
                    </h2>
                    <div className="can-findings-list">
                      {attentionFindings.map((f) => (
                        <FindingCard key={f.id} finding={f} />
                      ))}
                    </div>
                  </div>
                )}
                {infoFindings.length > 0 && (
                  <div className="can-overview-group">
                    <h2 className="can-section-label">
                      Information
                      <span className="can-count-badge">{infoFindings.length}</span>
                    </h2>
                    <div className="can-findings-list">
                      {infoFindings.map((f) => (
                        <FindingCard key={f.id} finding={f} />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="can-no-findings">
                <p>No findings were generated for this scan.</p>
                <p style={{ color: 'var(--site-muted)', fontSize: 13, marginTop: 6 }}>
                  This does not indicate that the website is safe — it may reflect limited evidence coverage.
                </p>
              </div>
            )}

            {/* Mini DNA strip */}
            <div className="can-overview-dna">
              <h2 className="can-section-label">Trust DNA — at a glance</h2>
              <div className="can-dna-strip">
                {sortedDna.map((dim) => (
                  <div key={dim.dimension} className="can-dna-strip-item">
                    <div
                      className="can-dna-strip-bar"
                      style={{
                        '--bar-height': dim.score !== null ? `${dim.score}%` : '4px',
                        '--bar-color': scoreColor(dim.score),
                      }}
                      title={`${dimensionLabel(dim.dimension)}: ${dim.score ?? '—'}`}
                    />
                    <span className="can-dna-strip-score" style={{ color: scoreColor(dim.score) }}>
                      {dim.score ?? '—'}
                    </span>
                    <span className="can-dna-strip-label">{dimensionLabel(dim.dimension)}</span>
                  </div>
                ))}
              </div>
              <button className="can-ghost-link" onClick={() => setActiveTab('dna')}>
                View full Trust DNA →
              </button>
            </div>

          </section>
        )}

        {/* ── TRUST DNA TAB ── */}
        {activeTab === 'dna' && (
          <section aria-labelledby="dna-section-title">
            <h2 id="dna-section-title" className="can-section-label">
              Trust DNA
              <span style={{ fontWeight: 400, fontSize: 12, marginLeft: 10, color: 'var(--site-muted)' }}>
                Six dimensions — each tied to observable evidence
              </span>
            </h2>
            <p className="can-section-intro">
              A missing score indicates no scoring basis exists for that dimension in the current rules version.
              Absence is not treated as a positive or negative result.
            </p>
            <div className="can-dna-grid">
              {sortedDna.map((dim) => (
                <DnaCard key={dim.dimension} dimension={dim} />
              ))}
            </div>
          </section>
        )}

        {/* ── CAN EXPLAIN TAB ── */}
        {activeTab === 'explain' && (
          <section aria-labelledby="explain-section-title">
            <h2 id="explain-section-title" className="can-section-label">CAN Explain</h2>
            <p className="can-section-intro">
              Each finding describes what was observed, why it matters, the evidence behind it,
              potential impact, and an action you can consider.
            </p>

            {findings.length === 0 ? (
              <div className="can-no-findings">
                <p>No findings were generated for this scan.</p>
                <p style={{ color: 'var(--site-muted)', fontSize: 13, marginTop: 6 }}>
                  This may reflect limited evidence coverage rather than a clean result.
                </p>
              </div>
            ) : (
              <div className="can-findings-list">
                {findings.map((f) => (
                  <FindingCard key={f.id} finding={f} />
                ))}
              </div>
            )}
          </section>
        )}

        {/* ── EVIDENCE TAB ── */}
        {activeTab === 'evidence' && (
          <section aria-labelledby="evidence-section-title">
            <h2 id="evidence-section-title" className="can-section-label">Evidence record</h2>
            <p className="can-section-intro">
              All signals collected during this scan. &ldquo;Not detected&rdquo; means the signal was checked
              but absent. &ldquo;Unavailable&rdquo; means the check could not be performed.

            </p>

            {evidence.length === 0 ? (
              <p style={{ color: 'var(--site-muted)', marginTop: 16 }}>No evidence records found.</p>
            ) : (
              <div className="can-evidence-table-wrap">
                <table className="can-evidence-table">
                  <thead>
                    <tr>
                      <th>Dimension</th>
                      <th>Signal</th>
                      <th>Status</th>
                      <th>Explanation</th>
                    </tr>
                  </thead>
                  <tbody>
                    {evidence.map((item) => (
                      <EvidenceRow key={item.id} item={item} />
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        )}

        {/* ── FOOTER DISCLAIMER ── */}
        <footer className="can-report-footer-note">
          <p>{disclaimer}</p>
          <p>Analyzed: {formatTimestamp(completed_at)} · Rules: v{rules_version} · Scan ID: {scanId}</p>
        </footer>

      </div>


    </main>
  );
}
