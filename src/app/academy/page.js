'use client';

import { useState } from 'react';
import Link from 'next/link';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/footer';

const lessons = [
  {
    id: 'basics',
    category: 'Literacy',
    number: '01',
    title: 'What makes a website trustworthy?',
    summary:
      'Learn the critical difference between a visually polished design and verifiable technical signals.',
    signal: 'Domain age, TLS validity, clear physical contact details, transparent ownership.',
    misconception: 'A clean modern layout or an attractive logo does not prove legitimacy; anyone can copy CSS templates.',
    action: 'Always cross-reference observable domain history and organizational transparency with visual claims.',
  },
  {
    id: 'security',
    category: 'Security',
    number: '02',
    title: 'Understanding HTTPS and TLS',
    summary:
      'Explore how encrypted connections work and what HTTPS actually guarantees — and what it does not.',
    signal: 'TLS 1.3 protocol, valid certificate authority, Strict-Transport-Security (HSTS) headers.',
    misconception: 'The padlock icon means your connection is private, NOT that the website operator is honest or safe.',
    action: 'Verify that HTTPS is enforced across all subdomains and that HSTS prevents downgrade attacks.',
  },
  {
    id: 'privacy',
    category: 'Privacy',
    number: '03',
    title: 'Data collection & input forms',
    summary:
      'Learn how to inspect input fields, sensitive data requests, and third-party form processors.',
    signal: 'Sensitive input types (passwords, credit cards, national IDs) submitted over unencrypted or external endpoints.',
    misconception: 'Websites without a privacy policy can still be trusted if they are well-known.',
    action: 'Never submit sensitive personal or financial information without clear policy links and verified endpoints.',
  },
  {
    id: 'identity',
    category: 'Identity',
    number: '04',
    title: 'Who is really behind this domain?',
    summary:
      'Understand WHOIS records, domain registration age, certificate subject names, and entity matching.',
    signal: 'Registration date, registrar reputation, organization name in Extended Validation certificates.',
    misconception: 'New domains are always malicious.',
    action: 'Treat freshly registered domains (under 30 days) with cautious scrutiny, especially during flash sales or urgent promotions.',
  },
  {
    id: 'network',
    category: 'Network',
    number: '05',
    title: 'Third-party connections & trackers',
    summary:
      'Discover how modern websites connect to external ad networks, tracking scripts, CDNs, and APIs.',
    signal: 'External domain requests, third-party cookies, cross-site resource loading.',
    misconception: 'A website only talks to the domain shown in the address bar.',
    action: 'Inspect the external dependencies that receive your browser telemetry when a page loads.',
  },
  {
    id: 'literacy',
    category: 'Literacy',
    number: '06',
    title: 'Context over binary scores',
    summary:
      'Learn why single risk numbers can be misleading and how to evaluate evidence across six Trust DNA dimensions.',
    signal: 'Corroborating indicators across Security, Authenticity, Transparency, Behavior, Network, and Exposure.',
    misconception: 'An algorithm can give a 100% guarantee of safety.',
    action: 'Look at the evidence breakdown, understand the missing signals, and make an informed personal decision.',
  },
];

const categories = ['All', 'Security', 'Privacy', 'Identity', 'Network', 'Literacy'];

export default function AcademyPage() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [expandedId, setExpandedId] = useState(null);

  const filteredLessons = selectedCategory === 'All'
    ? lessons
    : lessons.filter((l) => l.category === selectedCategory);

  function toggleExpand(id) {
    setExpandedId((current) => (current === id ? null : id));
  }

  return (
    <main className="can-site can-academy-page">
      <Navbar currentPage="academy" />

      <div className="can-sub-shell">
        <header className="can-sub-header">
          <p className="can-kicker">CAN Academy / Web Literacy</p>
          <h1>
            Decode what the web <em>is telling you.</em>
          </h1>
          <p className="can-sub-lede">
            Short, evidence-based modules designed to help you understand technical web indicators,
            privacy risks, domain identity, and network footprints — without the fear-mongering.
          </p>
        </header>

        <div className="can-filter-bar" role="tablist" aria-label="Lesson categories">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              className="can-filter-pill"
              data-active={selectedCategory === cat}
              onClick={() => setSelectedCategory(cat)}
              role="tab"
              aria-selected={selectedCategory === cat}
            >
              {cat} {cat === 'All' ? `(${lessons.length})` : ''}
            </button>
          ))}
        </div>

        <div className="can-lesson-grid">
          {filteredLessons.map((lesson, idx) => {
            const isExpanded = expandedId === lesson.id;
            return (
              <article
                key={lesson.id}
                className={`can-lesson-card can-animate-in can-stagger-${(idx % 4) + 1}`}
              >
                <div className="can-lesson-header">
                  <span className="can-lesson-badge">{lesson.category}</span>
                  <span className="can-lesson-number">{lesson.number}</span>
                </div>

                <h2 className="can-lesson-title">{lesson.title}</h2>
                <p className="can-lesson-summary">{lesson.summary}</p>

                {isExpanded && (
                  <div className="can-lesson-detail">
                    <div>
                      <h4>Observable Signal</h4>
                      <p>{lesson.signal}</p>
                    </div>
                    <div style={{ marginTop: '12px' }}>
                      <h4>Common Misconception</h4>
                      <p>{lesson.misconception}</p>
                    </div>
                    <div style={{ marginTop: '12px' }}>
                      <h4>Recommended Practice</h4>
                      <p>{lesson.action}</p>
                    </div>
                    <div style={{ marginTop: '16px' }}>
                      <Link
                        href="/scan"
                        className="can-button"
                        style={{ minHeight: '36px', fontSize: '12px', padding: '0 14px' }}
                      >
                        Inspect in demo scan →
                      </Link>
                    </div>
                  </div>
                )}

                <div className="can-lesson-footer">
                  <button
                    type="button"
                    className="can-lesson-expand"
                    onClick={() => toggleExpand(lesson.id)}
                    aria-expanded={isExpanded}
                  >
                    {isExpanded ? 'Collapse guide ↑' : 'Explore guide ↓'}
                  </button>
                  <span style={{ fontSize: '12px', color: 'var(--site-muted)' }}>
                    4 min read
                  </span>
                </div>
              </article>
            );
          })}
        </div>
      </div>

      <Footer />
    </main>
  );
}