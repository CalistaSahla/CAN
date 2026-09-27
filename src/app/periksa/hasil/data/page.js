import Link from "next/link";

const dataCategories = [
  {
    title: "Informasi akun",
    level: "Berpotensi diminta",
    examples: ["Nama", "Email", "Username"],
  },
  {
    title: "Informasi kontak",
    level: "Berpotensi diminta",
    examples: ["Nomor telepon", "Alamat"],
  },
  {
    title: "Informasi pembayaran",
    level: "Berpotensi diminta",
    examples: ["Metode pembayaran", "Informasi transaksi"],
  },
  {
    title: "Informasi perangkat",
    level: "Dapat terdeteksi",
    examples: ["Browser", "Jenis perangkat", "IP address"],
  },
];

export default function DataPage() {
  return (
    <main className="min-h-screen bg-[#fff9f7] px-5 pb-20 pt-28 text-[#382a26]">
      <div className="mx-auto max-w-5xl">

        <Link
          href="/periksa/hasil"
          className="mb-8 inline-flex items-center gap-2 text-sm text-[#806f68]"
        >
          ← Kembali ke Trust Report
        </Link>

        <div className="mb-10">
          <p className="mb-3 text-sm font-medium text-[#c8879d]">
            CAN DATA
          </p>

          <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">
            Data apa yang
            <span className="text-[#d786a1]"> berpotensi diminta?</span>
          </h1>

          <p className="mt-4 max-w-2xl text-base leading-7 text-[#806f68]">
            CAN menunjukkan kategori informasi yang terdeteksi atau berpotensi
            diminta oleh website. Ini bukan berarti CAN mengetahui bagaimana
            data tersebut digunakan secara internal.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          {dataCategories.map((item) => (
            <section
              key={item.title}
              className="can-glass-strong rounded-[28px] p-6 shadow-sm"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-wider text-[#a8958c]">
                    Kategori
                  </p>

                  <h2 className="mt-2 text-xl font-semibold">
                    {item.title}
                  </h2>
                </div>

                <span className="rounded-full bg-[#fbe5dc] px-3 py-1.5 text-[11px] font-medium text-[#765549]">
                  {item.level}
                </span>
              </div>

              <div className="mt-6 space-y-2">
                {item.examples.map((example) => (
                  <div
                    key={example}
                    className="flex items-center gap-3 rounded-xl bg-white/60 px-4 py-3 text-sm text-[#5f4d46]"
                  >
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#f8dce6] text-xs text-[#765549]">
                      ✓
                    </span>

                    {example}
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>

        <div className="mt-6 rounded-[28px] border border-[#eadbd5] bg-[#fffdfc]/70 p-6">
          <p className="text-sm font-semibold text-[#765549]">
            Catatan penting
          </p>

          <p className="mt-2 text-sm leading-6 text-[#806f68]">
            Informasi di halaman ini berasal dari indikator yang dapat diamati
            saat pemeriksaan. CAN tidak menyimpulkan bahwa sebuah website
            menyalahgunakan data hanya berdasarkan keberadaan suatu input atau
            layanan pihak ketiga.
          </p>
        </div>

      </div>
    </main>
  );
}
