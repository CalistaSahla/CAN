import Link from "next/link";

const history = [
  {
    domain: "tokopedia.com",
    date: "Hari ini, 14:20",
    score: 86,
    status: "Tinggi",
  },
  {
    domain: "example.com",
    date: "Kemarin, 19:42",
    score: 81,
    status: "Tinggi",
  },
  {
    domain: "sample-store.com",
    date: "24 Sep 2026, 15:10",
    score: 64,
    status: "Perlu Ditinjau",
  },
];

export default function HistoryPage() {
  return (
    <main className="min-h-screen bg-[#fff9f7] px-5 pb-20 pt-32 text-[#382a26]">
      <div className="mx-auto max-w-5xl">

        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <p className="text-sm font-medium text-[#c8879d]">
              CAN HISTORY
            </p>

            <h1 className="mt-3 text-4xl font-semibold tracking-tight md:text-5xl">
              Pemeriksaan sebelumnya
            </h1>

            <p className="mt-4 text-sm leading-6 text-[#806f68]">
              Riwayat website yang pernah kamu periksa.
            </p>
          </div>

          <Link
            href="/periksa"
            className="rounded-full bg-[#765549] px-5 py-3 text-center text-sm font-medium text-white"
          >
            + Periksa Website
          </Link>
        </div>

        <div className="mt-10 space-y-4">
          {history.map((item) => (
            <div
              key={item.domain}
              className="can-glass-strong flex flex-col gap-5 rounded-[26px] p-5 shadow-sm md:flex-row md:items-center md:justify-between"
            >
              <div>
                <h2 className="font-semibold">
                  {item.domain}
                </h2>

                <p className="mt-1 text-xs text-[#a8958c]">
                  {item.date}
                </p>
              </div>

              <div className="flex items-center gap-4">
                <span className="rounded-full bg-[#f8dce6] px-3 py-1.5 text-xs text-[#765549]">
                  {item.status}
                </span>

                <div className="text-right">
                  <div className="text-xl font-semibold">
                    {item.score}
                  </div>

                  <div className="text-[10px] text-[#a8958c]">
                    Trust Confidence
                  </div>
                </div>

                <Link
                  href="/periksa/hasil"
                  className="rounded-full border border-[#eadbd5] bg-white/60 px-4 py-2 text-xs text-[#765549]"
                >
                  Lihat →
                </Link>
              </div>
            </div>
          ))}
        </div>

      </div>
    </main>
  );
}