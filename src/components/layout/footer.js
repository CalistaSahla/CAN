import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="can-footer">
      <p>
        <span className="can-wordmark">CAN<span>.</span></span>
        <br />
        An interpretation layer for observable website evidence. CAN supports
        user decisions and does not guarantee that a website is safe or malicious.
      </p>
      <nav className="can-footer-links" aria-label="Footer navigation">
        <Link href="/scan">Open demo scan</Link>
        <Link href="#how-it-works">How it works</Link>
        <Link href="#dimensions">Trust DNA</Link>
        <Link href="/tentang">About CAN</Link>
      </nav>
    </footer>
  );
}