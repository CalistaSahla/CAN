import Link from 'next/link';

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
    <main className="min-h-screen bg-[#fff9f7] px-5 pb-20 pt-32 text-[#382a26]">
      <div className="mx-auto max-w-5xl">
        <p className="text-sm font-medium text-[#c8879d]">TENTANG CAN</p>

        <h1 className="mt-3 max-w-4xl text-4xl font-semibold tracking-tight md:text-6xl">
          Don&apos;t just trust a website.
          <br />
          <span className="text-[#d786a1]">Understand it.</span>
        </h1>

        <p className="mt-7 max-w-2xl text-base leading-8 text-[#806f68]">
          CAN atau <strong>Can You Trust This?</strong> adalah platform explainable web trust intelligence yang membantu pengguna memahami karakteristik sebuah website berdasarkan berbagai indikator.
        </p>

        <div className="mt-14 grid gap-5 md:grid-cols-2">
          {principles.map((item) => (
            <div
              key={item.number}
              className="can-glass-strong rounded-[28px] p-7 shadow-sm"
            >
              <span className="text-sm text-[#c8879d]">{item.number}</span>

              <h2 className="mt-4 text-2xl font-semibold">{item.title}</h2>

              <p className="mt-3 text-sm leading-7 text-[#806f68]">{item.text}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 rounded-[30px] bg-[#765549] p-8 text-white shadow-sm md:p-10">
          <p className="text-xs uppercase tracking-[0.2em] text-[#f8dce6]">Our approach</p>

          <h2 className="mt-4 max-w-2xl text-3xl font-semibold">Dari “aman atau tidak?” menjadi “apa yang sebenarnya saya percayai?”</h2>

          <p className="mt-4 max-w-2xl text-sm leading-7 text-white/75">
            CAN dirancang sebagai lapisan pemahaman di antara pengguna dan website. Fokusnya bukan memberikan jaminan keamanan absolut, melainkan membuat indikator teknis lebih mudah dipahami.
          </p>

          <Link
            href="/periksa"
            className="rounded-full border border-[#eadbd5] bg-white/80 px-5 py-3 text-sm font-medium text-[#382a26]"
          >
            Coba CAN →
          </Link>
        </div>
      </div>
    </main>
  );
}
