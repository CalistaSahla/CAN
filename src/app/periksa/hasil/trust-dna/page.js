import Link from 'next/link';

const dna = [
  {
    name: 'Keamanan',
    score: 92,
    label: 'Kuat',
    description: 'Koneksi dan indikator keamanan terdeteksi baik.',
  },
  {
    name: 'Identitas',
    score: 85,
    label: 'Konsisten',
    description: 'Informasi domain dan identitas menunjukkan kesesuaian.',
  },
  {
    name: 'Transparansi',
    score: 78,
    label: 'Cukup',
    description: 'Informasi layanan dan kebijakan tersedia sebagian.',
  },
  {
    name: 'Perilaku',
    score: 84,
    label: 'Wajar',
    description: 'Perilaku website selama pemeriksaan berada dalam kondisi wajar.',
  },
  {
    name: 'Jaringan',
    score: 80,
    label: 'Terlihat',
    description: 'Beberapa koneksi pihak ketiga terdeteksi.',
  },
  {
    name: 'Data',
    score: 75,
    label: 'Perlu Dilihat',
    description: 'Beberapa kategori data berpotensi diminta.',
  },
];

export default function TrustDNA() {
  return (
    <main className="min-h-screen bg-[#fff9f7] px-5 pb-20 pt-28 text-[#382a26]">
      <div className="mx-auto max-w-6xl">
        <Link
          href="/periksa/hasil"
          className="text-sm text-[#806f68] hover:text-[#5b4036]"
        >
          ← Kembali ke Trust Report
        </Link>

        <div className="mt-10 max-w-3xl">
          <p className="text-sm font-medium text-[#c8879d]">TRUST DNA</p>

          <h1 className="mt-3 text-4xl font-semibold tracking-tight md:text-6xl">
            Karakter website,
            <span className="text-[#d786a1]"> dalam satu gambaran.</span>
          </h1>

          <p className="mt-5 text-base leading-7 text-[#806f68]">Trust DNA menggambarkan karakteristik website berdasarkan enam dimensi yang diperiksa oleh CAN.</p>
        </div>

        {/* DNA VISUAL */}
        <section className="can-glass-strong mt-12 rounded-[34px] p-7 shadow-sm md:p-10">
          <div className="grid gap-10 md:grid-cols-[360px_1fr] md:items-center">
            {/* RADAR-LIKE VISUAL */}
            <div className="relative mx-auto flex h-[310px] w-[310px] items-center justify-center">
              <div className="absolute h-[270px] w-[270px] rounded-full border border-[#eadbd5]" />
              <div className="absolute h-[210px] w-[210px] rounded-full border border-[#eadbd5]" />
              <div className="absolute h-[150px] w-[150px] rounded-full border border-[#eadbd5]" />
              <div className="absolute h-[90px] w-[90px] rounded-full border border-[#eadbd5]" />

              <div className="absolute h-px w-[270px] bg-[#eadbd5]" />
              <div className="absolute h-[270px] w-px bg-[#eadbd5]" />

              <div className="absolute h-[180px] w-[180px] rotate-45 rounded-[35%] border-2 border-[#d786a1] bg-[#f8dce6]/30" />

              <div className="relative z-10 flex h-24 w-24 flex-col items-center justify-center rounded-full bg-white/90 shadow-sm">
                <span className="text-2xl font-bold text-[#765549]">86</span>

                <span className="text-[10px] text-[#a8958c]">TRUST</span>
              </div>

              <span className="absolute left-1/2 top-0 -translate-x-1/2 text-[11px] text-[#806f68]">Keamanan</span>

              <span className="absolute right-0 top-[28%] text-[11px] text-[#806f68]">Identitas</span>

              <span className="absolute bottom-[20%] right-0 text-[11px] text-[#806f68]">Transparansi</span>

              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 text-[11px] text-[#806f68]">Perilaku</span>

              <span className="absolute bottom-[20%] left-0 text-[11px] text-[#806f68]">Jaringan</span>

              <span className="absolute left-0 top-[28%] text-[11px] text-[#806f68]">Data</span>
            </div>

            {/* SUMMARY */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#a8958c]">CAN Interpretation</p>

              <h2 className="mt-3 text-3xl font-semibold">Profil website terlihat cukup seimbang.</h2>

              <p className="mt-4 text-sm leading-7 text-[#806f68]">Dimensi keamanan menjadi salah satu indikator paling kuat, sementara transparansi dan data exposure menjadi area yang masih perlu diperhatikan lebih lanjut.</p>

              <div className="mt-7 rounded-2xl bg-[#fbe5dc]/60 p-5">
                <p className="text-xs font-semibold text-[#765549]">Cara membaca Trust DNA</p>

                <p className="mt-2 text-sm leading-6 text-[#806f68]">Semakin besar area suatu dimensi, semakin banyak indikator positif yang terdeteksi pada dimensi tersebut. Trust DNA bukan skor keamanan absolut.</p>
              </div>
            </div>
          </div>
        </section>

        {/* DIMENSION LIST */}
        <section className="mt-8">
          <div className="mb-5">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#a8958c]">DNA Components</p>

            <h2 className="mt-2 text-2xl font-semibold">Enam karakteristik website</h2>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {dna.map((item) => (
              <div
                key={item.name}
                className="can-glass-strong rounded-[26px] p-6 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">{item.name}</h3>

                  <span className="text-xl font-semibold text-[#765549]">{item.score}</span>
                </div>

                <div className="mt-4 h-2 rounded-full bg-[#f1e5e0]">
                  <div
                    className="h-2 rounded-full bg-[#d786a1]"
                    style={{ width: `${item.score}%` }}
                  />
                </div>

                <div className="mt-4">
                  <span className="rounded-full bg-[#f8dce6] px-3 py-1 text-[11px] text-[#765549]">{item.label}</span>
                </div>

                <p className="mt-4 text-sm leading-6 text-[#806f68]">{item.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ACTION */}
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/periksa/hasil/explain"
            className="rounded-full bg-[#765549] px-5 py-3 text-sm font-medium text-white"
          >
            Lihat CAN Explain →
          </Link>

          <Link
            href="/periksa/hasil/trust-gap"
            className="rounded-full border border-[#eadbd5] bg-white/70 px-5 py-3 text-sm font-medium text-[#765549]"
          >
            Lihat Trust Gap →
          </Link>

          <Link
            href="/periksa/hasil"
            className="rounded-full border border-[#eadbd5] bg-white/70 px-5 py-3 text-sm text-[#806f68]"
          >
            Kembali ke Report
          </Link>
        </div>
      </div>
    </main>
  );
}
