import Link from 'next/link';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/footer';

export const metadata = {
  title: "Tentang CAN — Can You Trust This?",
  description: "Platform explainable web trust intelligence yang membantu pengguna memahami karakteristik website.",
};

const principles = [
  {
    number: '01',
    title: 'Evidence first',
    text: 'CAN menjelaskan penilaian berdasarkan indikator yang dapat diamati.',
  },
  {
    number: '02',
    title: 'Explain, not scare',
    text: 'CAN tidak menggunakan ketakutan sebagai cara untuk membuat pengguna berhenti atau percaya.',
  },
  {
    number: '03',
    title: 'Context matters',
    text: 'Satu indikator tidak selalu cukup. CAN melihat beberapa dimensi untuk memberikan konteks.',
  },
  {
    number: '04',
    title: 'Human decision',
    text: 'CAN membantu pengguna memahami informasi, sementara keputusan tetap berada di tangan pengguna.',
  },
];

export default function TentangPage() {
  return (
    <main className="can-site">
      <Navbar currentPage="about" />

      <div className="can-about-shell">
        <header className="can-about-header">
          <p className="can-kicker">Tentang CAN</p>
          <h1>
            Memahami sebuah website<br />
            bukan berarti mempercayainya secara buta.
          </h1>
          <p className="can-about-lede">
            CAN — <strong>Can You Trust This?</strong> — adalah platform explainable web trust intelligence.
            CAN mengumpulkan evidence yang dapat diamati dari sebuah website dan menjelaskan artinya
            secara transparan, sehingga kamu dapat mengambil keputusan yang terinformasi.
          </p>
        </header>

        <section className="can-about-section" aria-labelledby="principles-title">
          <h2 id="principles-title" className="can-section-label">Empat prinsip utama kami</h2>
          <ol className="can-principles-list">
            {principles.map((item) => (
              <li key={item.number} className="can-principle-item">
                <span className="can-principle-number">{item.number}</span>
                <div className="can-principle-content">
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section className="can-about-dark" aria-labelledby="approach-title">
          <div className="can-about-dark-inner">
            <div>
              <p className="can-kicker-light">Pendekatan Kami</p>
              <h2 id="approach-title">
                Dari &ldquo;aman atau tidak?&rdquo;<br />
                ke &ldquo;apa bukti yang tersedia?&rdquo;
              </h2>
              <p className="can-about-dark-body">
                Keamanan web modern terlalu rumit untuk disederhanakan menjadi satu skor biner yang buram.
                CAN bertindak sebagai lapisan interpretasi yang mengubah header teknis, riwayat domain,
                dan pola pelacakan menjadi penjelasan manusiawi.
              </p>
            </div>
            <div>
              <p className="can-kicker-light">Apa yang BUKAN CAN</p>
              <ul className="can-not-list">
                <li>Bukan antivirus atau malware remover</li>
                <li>Bukan jaminan mutlak keselamatan atau bahaya</li>
                <li>Bukan pengganti peringatan keamanan bawaan browser</li>
                <li>Bukan algoritma yang mengambil keputusan menggantikanmu</li>
              </ul>
            </div>
          </div>
        </section>

        <div className="can-about-cta">
          <p>
            CAN menyajikan indikator objektif dan konteks teknis.
            Keputusan akhir tetap berada sepenuhnya di tangan pengguna.
          </p>
          <Link className="can-button" href="/scan">
            Mulai periksa website →
          </Link>
        </div>
      </div>

      <Footer />
    </main>
  );
}
