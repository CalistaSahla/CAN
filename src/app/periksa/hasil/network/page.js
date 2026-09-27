import Link from "next/link";

const connections = [
  {
    name: "Google Analytics",
    type: "Analytics",
    status: "Terdeteksi",
  },
  {
    name: "Cloudflare",
    type: "CDN / Security",
    status: "Terdeteksi",
  },
  {
    name: "Payment Provider",
    type: "Pembayaran",
    status: "Terdeteksi",
  },
  {
    name: "Authentication Provider",
    type: "Autentikasi",
    status: "Terdeteksi",
  },
];

export default function NetworkPage() {
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
            CAN NETWORK
          </p>

          <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">
            Website tidak berdiri
            <span className="text-[#d786a1]"> sendirian.</span>
          </h1>

          <p className="mt-4 max-w-2xl text-base leading-7 text-[#806f68]">
            CAN membantu melihat hubungan website dengan layanan atau domain
            pihak ketiga yang terdeteksi selama pemeriksaan.
          </p>
        </div>

        <div className="can-glass-strong relative overflow-hidden rounded-[32px] p-8 shadow-sm">
          
          <div className="relative flex min-h-[430px] items-center justify-center">

            <div className="absolute left-1/2 top-1/2 z-20 flex h-28 w-28 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white bg-white/80 shadow-lg backdrop-blur">
              <div className="text-center">
                <div className="text-xl font-bold text-[#765549]">
                  CAN
                </div>
                <div className="mt-1 text-[10px] text-[#a8958c]">
                  website
                </div>
              </div>
            </div>

            <div className="absolute left-[16%] top-[20%] h-16 w-16 rounded-full border border-white bg-[#f8dce6]/80 shadow-sm" />
            <div className="absolute right-[18%] top-[18%] h-16 w-16 rounded-full border border-white bg-[#fbe5dc]/80 shadow-sm" />
            <div className="absolute bottom-[20%] left-[18%] h-16 w-16 rounded-full border border-white bg-[#e7f0e9]/80 shadow-sm" />
            <div className="absolute bottom-[18%] right-[18%] h-16 w-16 rounded-full border border-white bg-[#fbe5dc]/80 shadow-sm" />

            <div className="absolute left-[24%] top-[29%] h-px w-[27%] rotate-[18deg] bg-[#d8c5bd]" />
            <div className="absolute right-[24%] top-[29%] h-px w-[27%] -rotate-[18deg] bg-[#d8c5bd]" />
            <div className="absolute bottom-[30%] left-[25%] h-px w-[27%] -rotate-[18deg] bg-[#d8c5bd]" />
            <div className="absolute bottom-[29%] right-[25%] h-px w-[27%] rotate-[18deg] bg-[#d8c5bd]" />

            <span className="absolute left-[12%] top-[11%] text-xs text-[#765549]">
              Analytics
            </span>

            <span className="absolute right-[11%] top-[10%] text-xs text-[#765549]">
              CDN
            </span>

            <span className="absolute bottom-[12%] left-[10%] text-xs text-[#765549]">
              Security
            </span>

            <span className="absolute bottom-[12%] right-[10%] text-xs text-[#765549]">
              Payment
            </span>
          </div>

          <div className="border-t border-[#eadbd5] pt-6">
            <p className="text-xs text-[#a8958c]">
              CONNECTIONS TERDETEKSI
            </p>

            <div className="mt-4 grid gap-3 md:grid-cols-2">
              {connections.map((item) => (
                <div
                  key={item.name}
                  className="flex items-center justify-between rounded-2xl bg-white/60 px-4 py-4"
                >
                  <div>
                    <p className="text-sm font-medium">
                      {item.name}
                    </p>
                    <p className="mt-1 text-xs text-[#a8958c]">
                      {item.type}
                    </p>
                  </div>

                  <span className="rounded-full bg-[#e7f0e9] px-3 py-1 text-xs text-[#55715e]">
                    {item.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}
