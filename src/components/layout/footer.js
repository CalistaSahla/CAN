import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="can-footer">
      <div className="can-footer-inner">
        <div className="can-footer-brand">
          <Link className="can-wordmark" href="/">
            CAN<span>.</span>
          </Link>
          <p className="can-footer-desc">
            An interpretation layer for observable website evidence. CAN supports
            human decisions and does not make absolute safety guarantees.
          </p>
          <p className="can-footer-badge">
            Switchfest 2026 — Web Development Category
          </p>
        </div>

        <div className="can-footer-columns">
          <div className="can-footer-col">
            <p className="can-footer-col-title">Platform</p>
            <nav className="can-footer-links" aria-label="Platform navigation">
              <Link href="/scan">Scan website</Link>
              <Link href="/#how-it-works">How it works</Link>
              <Link href="/#dimensions">Trust DNA</Link>
            </nav>
          </div>

          <div className="can-footer-col">
            <p className="can-footer-col-title">Resources</p>
            <nav className="can-footer-links" aria-label="Resources navigation">
              <Link href="/about">About CAN</Link>
              <Link href="/academy">CAN Academy</Link>
              <Link href="/history">Scan History</Link>
              <Link href="/tentang">Bahasa Indonesia</Link>
            </nav>
          </div>
        </div>
      </div>

      <div className="can-footer-bottom">
        <p>© 2026 CAN (Can You Trust This?). Built for explainable web trust intelligence.</p>
      </div>
    </footer>
  );
}