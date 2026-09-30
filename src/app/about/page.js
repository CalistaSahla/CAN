import Link from 'next/link';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/footer';

const principles = [
  {
    number: '01',
    title: 'Evidence first',
    text: 'CAN explains every assessment using observable signals. A score without its evidence is incomplete.',
  },
  {
    number: '02',
    title: 'Explain, not scare',
    text: 'CAN does not use alarm language to drive behaviour. Findings are described in plain terms so you can decide.',
  },
  {
    number: '03',
    title: 'Context matters',
    text: 'One signal is rarely the full picture. CAN groups evidence across six dimensions to give you context, not a verdict.',
  },
  {
    number: '04',
    title: 'Human decision',
    text: 'CAN is a tool. The decision to trust a website belongs to you, not to an algorithm.',
  },
];

const notList = [
  'An antivirus or malware scanner',
  'A guarantee of website safety or malice',
  'A threat-intelligence service',
  'A replacement for browser security warnings',
];

export default function AboutPage() {
  return (
    <main className="can-site">
      <Navbar />

      <div className="can-about-shell">

        <header className="can-about-header">
          <p className="can-kicker">About CAN</p>
          <h1>
            Understanding a website<br />
            is not the same as trusting it.
          </h1>
          <p className="can-about-lede">
            CAN — <strong>Can You Trust This?</strong> — is an explainable web trust intelligence platform.
            It collects observable evidence about a website and explains what that evidence means,
            so you can make an informed choice.
          </p>
        </header>

        <section className="can-about-section" aria-labelledby="principles-title">
          <h2 id="principles-title" className="can-section-label">Our four principles</h2>
          <ol className="can-principles-list">
            {principles.map((item) => (
              <li key={item.number} className="can-principle-item">
                <span className="can-principle-number">{item.number}</span>
                <div>
                  <strong>{item.title}</strong>
                  <p>{item.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section className="can-about-section can-about-dark" aria-labelledby="approach-title">
          <div className="can-about-dark-inner">
            <div>
              <p className="can-kicker" style={{ color: 'var(--site-soft)' }}>Our approach</p>
              <h2 id="approach-title">
                From &ldquo;safe or not?&rdquo; to<br />&ldquo;what does the evidence say?&rdquo;
              </h2>
              <p>
                CAN sits between technical website information and human understanding.
                Its job is not to make decisions for you — it is to make the evidence legible.
              </p>
            </div>
            <div>
              <p className="can-kicker" style={{ color: 'var(--site-soft)' }}>CAN is not</p>
              <ul className="can-not-list">
                {notList.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className="can-about-section can-about-cta" aria-label="Start a scan">
          <p>CAN does not guarantee that a website is safe or malicious.<br />Results depend on the evidence available at the time of analysis.</p>
          <Link className="can-button" href="/scan">Open demo scan</Link>
        </section>

      </div>

      <Footer />
    </main>
  );
}
