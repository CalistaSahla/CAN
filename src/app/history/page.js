'use client';

import { useState } from 'react';
import Link from 'next/link';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/footer';

const initialHistory = [
  {
    domain: 'tokopedia.com',
    url: 'https://tokopedia.com',
    date: 'Today, 14:20 WIB',
    score: 86,
    level: 'high',
    status: 'High Confidence',
    tags: ['TLS 1.3', 'HSTS Enforced', 'Registered 2009', 'Transparent Contact'],
  },
  {
    domain: 'example.com',
    url: 'https://example.com',
    date: 'Yesterday, 19:42 WIB',
    score: 81,
    level: 'high',
    status: 'High Confidence',
    tags: ['IANA Managed', 'Minimal Footprint', 'Zero Trackers'],
  },
  {
    domain: 'sample-flash-store.net',
    url: 'https://sample-flash-store.net',
    date: '24 Sep 2026, 15:10 WIB',
    score: 54,
    level: 'medium',
    status: 'Review Recommended',
    tags: ['Domain Age 12d', 'Missing HSTS', 'External Payment Gateway'],
  },
  {
    domain: 'github.com',
    url: 'https://github.com',
    date: '22 Sep 2026, 11:05 WIB',
    score: 92,
    level: 'high',
    status: 'High Confidence',
    tags: ['EV Certificate', 'Strict CSP', 'Verified Org'],
  },
];

export default function HistoryPage() {
  const [historyList, setHistoryList] = useState(initialHistory);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterLevel, setFilterLevel] = useState('all');

  const filteredHistory = historyList.filter((item) => {
    const matchesSearch = item.domain.toLowerCase().includes(searchQuery.toLowerCase().trim());
    if (filterLevel === 'all') return matchesSearch;
    if (filterLevel === 'high') return matchesSearch && item.score >= 80;
    if (filterLevel === 'medium') return matchesSearch && item.score < 80;
    return matchesSearch;
  });

  function clearHistory() {
    if (confirm('Clear all local scan history?')) {
      setHistoryList([]);
    }
  }

  function resetDefaultHistory() {
    setHistoryList(initialHistory);
    setSearchQuery('');
    setFilterLevel('all');
  }

  return (
    <main className="can-site can-history-page">
      <Navbar currentPage="history" />

      <div className="can-sub-shell">
        <header className="can-sub-header">
          <p className="can-kicker">Scan History / Ledger</p>
          <h1>
            Previously evaluated <em>websites.</em>
          </h1>
          <p className="can-sub-lede">
            An auditable log of domains analyzed by CAN. Review past Trust DNA snapshots,
            confidence scores, and verifiable technical indicators.
          </p>
        </header>

        <div className="can-history-toolbar">
          <div className="can-history-search">
            <svg
              className="can-history-search-icon"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              className="can-history-input"
              placeholder="Filter by domain name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Filter domains"
            />
          </div>

          <div className="can-filter-bar" style={{ margin: 0 }}>
            <button
              type="button"
              className="can-filter-pill"
              data-active={filterLevel === 'all'}
              onClick={() => setFilterLevel('all')}
            >
              All scans ({historyList.length})
            </button>
            <button
              type="button"
              className="can-filter-pill"
              data-active={filterLevel === 'high'}
              onClick={() => setFilterLevel('high')}
            >
              High confidence (80+)
            </button>
            <button
              type="button"
              className="can-filter-pill"
              data-active={filterLevel === 'medium'}
              onClick={() => setFilterLevel('medium')}
            >
              Review recommended (&lt;80)
            </button>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <Link className="can-button" href="/scan">
              + New scan
            </Link>
          </div>
        </div>

        {filteredHistory.length > 0 ? (
          <div className="can-history-list">
            {filteredHistory.map((item, idx) => (
              <article
                key={item.domain}
                className={`can-history-row can-animate-in can-stagger-${(idx % 4) + 1}`}
              >
                <div>
                  <h2 className="can-history-domain">{item.domain}</h2>
                  <p className="can-history-time">Scanned: {item.date}</p>
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '10px' }}>
                    {item.tags.map((tag) => (
                      <span
                        key={tag}
                        style={{
                          fontSize: '11px',
                          color: 'var(--site-muted)',
                          background: 'var(--site-soft)',
                          padding: '2px 8px',
                          borderRadius: '6px',
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="can-history-badges">
                  <div className="can-score-badge" data-level={item.level}>
                    <span style={{ fontSize: '18px', fontWeight: 800 }}>{item.score}</span>
                    <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.1 }}>
                      <span style={{ fontSize: '10px', textTransform: 'uppercase' }}>Trust Score</span>
                      <span style={{ fontSize: '11px', opacity: 0.85 }}>{item.status}</span>
                    </div>
                  </div>

                  <Link
                    href={`/report/demo?url=${encodeURIComponent(item.url)}`}
                    className="can-button"
                    style={{ minHeight: '38px', fontSize: '13px', padding: '0 16px' }}
                  >
                    View Report →
                  </Link>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="can-history-empty">
            <h3 style={{ fontFamily: '"Iowan Old Style", Georgia, serif', fontSize: '24px', margin: '0 0 8px' }}>
              No matching scans found
            </h3>
            <p style={{ color: 'var(--site-muted)', fontSize: '14px', maxWidth: '400px', margin: '0 auto 20px' }}>
              {searchQuery
                ? `No domain matched "${searchQuery}". Try a different keyword.`
                : 'Your scan history is currently empty.'}
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              {historyList.length === 0 ? (
                <button type="button" className="can-button" onClick={resetDefaultHistory}>
                  Load sample history
                </button>
              ) : (
                <button
                  type="button"
                  className="can-filter-pill"
                  onClick={() => { setSearchQuery(''); setFilterLevel('all'); }}
                >
                  Reset filters
                </button>
              )}
              <Link className="can-button" href="/scan">
                Scan a new URL
              </Link>
            </div>
          </div>
        )}

        {historyList.length > 0 && (
          <div style={{ marginTop: '36px', textAlign: 'right' }}>
            <button
              type="button"
              onClick={clearHistory}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--site-muted)',
                fontSize: '12px',
                cursor: 'pointer',
                textDecoration: 'underline',
              }}
            >
              Clear all history records
            </button>
          </div>
        )}
      </div>

      <Footer />
    </main>
  );
}