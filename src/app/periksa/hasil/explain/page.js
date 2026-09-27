import Link from "next/link";

const explanations = [
  {
    title: "Keamanan",
    score: 92,
    status: "Baik",
    what: "Website menggunakan HTTPS dan menunjukkan indikator konfigurasi keamanan yang sesuai.",
    why: "Koneksi terenkripsi membantu melindungi informasi yang dikirim antara browser dan website.",
    evidence: [
      "HTTPS aktif",
      "Sertifikat TLS terdeteksi",
      "Koneksi menggunakan HTTPS",
    ],
    impact: "Risiko informasi dikirim melalui koneksi tanpa enkripsi menjadi lebih rendah.",
  },
  {
    title: "Identitas",
    score: 85,
    status: "Baik",
    what: "Informasi domain dan identitas website menunjukkan beberapa indikator yang konsisten.",
    why: "Kesesuaian antara domain dan identitas membantu pengguna memahami siapa yang berada di balik website.",
    evidence: [
      "Informasi domain tersedia",
      "Identitas website dapat ditemukan",
      "Domain konsisten dengan halaman utama",
    ],
    impact: "Pengguna memiliki konteks yang lebih jelas mengenai identitas website.",
  },
  {
    title: "Transparansi",
    score: 78,
    status: "Perlu Ditinjau",
    what: "Website menyediakan beberapa informasi mengenai layanan dan kebijakan.",
    why: "Informasi seperti kontak dan kebijakan privasi membantu pengguna memahami bagaimana website beroperasi.",
    evidence: [
      "Halaman kontak tersedia",
      "Privacy Policy terdeteksi",
      "Informasi layanan tersedia",
    ],
    impact: "Masih terdapat beberapa informasi yang sebaiknya diperiksa sebelum memberikan data.",
  },
];

export default function ExplainPage() {
  return (
    <main className="min-h-screen bg-[#fff9f7] px-5 pb-20 pt-28 text-[#382a26]">
      <div className="mx-auto max-w-5xl">
        
        <Link
          href="/periksa/hasil"
          className="mb-8 inline-flex items-center gap-2 text-sm text-[#806f68] hover:text-[#5b4036]"
        >
          ← Kembali ke Trust Report
        </Link>

        <div className="mb-10">
          <p className="mb-3 text-sm font-medium text-[#c8879d]">
            CAN EXPLAIN
          </p>

          <h1 className="max-w-3xl text-4xl font-semibold tracking-tight md:text-5xl">
            Kenapa CAN mengatakan
            <span className="text-[#d786a1]"> seperti itu?</span>
          </h1>

          <p className="mt-4 max-w-2xl text-base leading-7 text-[#806f68]">
            CAN tidak hanya memberikan angka. Setiap penilaian dijelaskan
            berdasarkan indikator dan bukti yang dapat diamati.
          </p>
        </div>

        <div className="space-y-5">
          {explanations.map((item) => (
            <section
              key={item.title}
              className="can-glass-strong rounded-[28px] border border-white/70 p-6 shadow-sm md:p-8"
            >
              <div className="flex flex-col justify-between gap-5 md:flex-row md:items-start">
                
                <div>
                  <p className="text-sm text-[#a8958c]">
                    DIMENSI
                  </p>

                  <h2 className="mt-1 text-2xl font-semibold">
                    {item.title}
                  </h2>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-3xl font-semibold">
                    {item.score}
                  </div>

                  <span className="rounded-full bg-[#f8dce6] px-3 py-1 text-xs font-medium text-[#765549]">
                    {item.status}
                  </span>
                </div>
              </div>

              <div className="mt-7 grid gap-5 md:grid-cols-2">
                <div className="rounded-2xl bg-white/60 p-5">
                  <p className="text-xs font-semibold uppercase tracking-wider text-[#a8958c]">
                    Apa yang ditemukan?
                  </p>

                  <p className="mt-2 text-sm leading-6 text-[#5f4d46]">
                    {item.what}
                  </p>
                </div>

                <div className="rounded-2xl bg-white/60 p-5">
                  <p className="text-xs font-semibold uppercase tracking-wider text-[#a8958c]">
                    Mengapa penting?
                  </p>

                  <p className="mt-2 text-sm leading-6 text-[#5f4d46]">
                    {item.why}
                  </p>
                </div>
              </div>

              <div className="mt-5">
                <p className="text-xs font-semibold uppercase tracking-wider text-[#a8958c]">
                  Evidence
                </p>

                <div className="mt-3 flex flex-wrap gap-2">
                  {item.evidence.map((evidence) => (
                    <span
                      key={evidence}
                      className="rounded-full border border-[#eadbd5] bg-white/60 px-3 py-2 text-xs text-[#765549]"
                    >
                      ✓ {evidence}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-5 rounded-2xl bg-[#fbe5dc]/60 p-5">
                <p className="text-xs font-semibold uppercase tracking-wider text-[#a8958c]">
                  Dampak bagi pengguna
                </p>

                <p className="mt-2 text-sm leading-6 text-[#5f4d46]">
                  {item.impact}
                </p>
              </div>
            </section>
          ))}
        </div>

      </div>
    </main>
  );
}
