import Link from "next/link";

const data = [
  ["Security", 92],
  ["Authenticity", 85],
  ["Transparency", 78],
  ["Behavior", 84],
  ["Network", 80],
  ["Data Exposure", 75],
];

export default function TrustGap() {
  return (
    <main className="min-h-screen px-5 py-8 md:px-8">
      <div className="mx-auto max-w-6xl">
        <Link
          href="/periksa/hasil"
          className="text-xs text-[#806f68]"
        >
          ← Trust Report
        </Link>

        <div className="mt-8">
          <p className="text-xs text-[#a8958c]">
            ANALYSIS
          </p>

          <h1 className="mt-2 text-4xl font-semibold tracking-[-.05em] text-[#382a26]">
            Trust Gap
          </h1>

          <p className="mt-3 text-sm text-[#806f68]">
            Menunjukkan perbedaan antar dimensi yang perlu diperhatikan.
          </p>
        </div>

        <div className="can-glass mt-8 rounded-[32px] p-7 md:p-10">
          <div className="space-y-6">
            {data.map(([name, score]) => (
              <div key={name}>
                <div className="mb-2 flex justify-between text-xs">
                  <span className="text-[#806f68]">{name}</span>
                  <span className="font-medium text-[#51382f]">
                    {score}/100
                  </span>
                </div>

                <div className="h-4 rounded-full bg-[#765549]/8">
                  <div
                    className="h-full rounded-full bg-[#d7839d]"
                    style={{ width: `${score}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="can-glass mt-5 rounded-[28px] p-7">
          <p className="text-xs font-medium text-[#51382f]">
            ✦ Insight
          </p>

          <p className="mt-3 text-sm leading-7 text-[#806f68]">
            Terdapat perbedaan pada dimensi Transparency dan Data
            Exposure. Pengguna dapat memeriksa informasi kebijakan
            privasi dan data yang berpotensi diminta.
          </p>
        </div>
      </div>
    </main>
  );
}