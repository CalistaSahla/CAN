"use client";

import Link from "next/link";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";

const dimensions = [
  {
    name: "Keamanan",
    score: 92,
    description:
      "Indikator koneksi dan konfigurasi keamanan terdeteksi baik.",
  },
  {
    name: "Identitas",
    score: 85,
    description:
      "Informasi domain dan identitas menunjukkan beberapa indikator konsisten.",
  },
  {
    name: "Transparansi",
    score: 78,
    description:
      "Beberapa informasi layanan dan kebijakan tersedia.",
  },
  {
    name: "Perilaku",
    score: 84,
    description:
      "Perilaku website selama pemeriksaan berada dalam kondisi wajar.",
  },
  {
    name: "Jaringan",
    score: 80,
    description:
      "Terdapat beberapa koneksi dengan layanan pihak ketiga.",
  },
  {
    name: "Data",
    score: 75,
    description:
      "Beberapa kategori informasi berpotensi diminta.",
  },
];

const tabs = [
  {
    name: "Trust Report",
    href: "/periksa/hasil",
    active: true,
  },
  {
    name: "Trust DNA",
    href: "/periksa/hasil/trust-dna",
  },
  {
    name: "CAN Explain",
    href: "/periksa/hasil/explain",
  },
];

export default function HasilPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center bg-[#fff9f7]">
          <p className="text-sm text-[#806f68]">Menyiapkan hasil pemeriksaan...</p>
        </main>
      }
    >
      <HasilContent />
    </Suspense>
  );
}

function HasilContent() {
  const searchParams = useSearchParams();

  const website =
    searchParams.get("url") || "example.com";

  return (
    <main className="min-h-screen bg-[#fff9f7] px-5 pb-20 pt-28 text-[#382a26]">
      <div className="mx-auto max-w-6xl">

        {/* HEADER */}
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">

          <div>

            <Link
              href="/periksa"
              className="text-sm text-[#806f68] hover:text-[#5b4036]"
            >
              ← Periksa website lain
            </Link>

            <p className="mt-8 text-sm font-medium text-[#c8879d]">
              TRUST REPORT
            </p>

            <h1 className="mt-2 break-all text-4xl font-semibold tracking-tight md:text-5xl">
              {website}
            </h1>

            <p className="mt-2 text-sm text-[#a8958c]">
              Demonstration data. No live analysis has been performed.
            </p>

          </div>

          <div className="rounded-full border border-[#cbd5d0] bg-white px-4 py-2 text-xs text-[#536765]">
            Demo data
          </div>

        </div>

        <p className="mt-8 border border-[#cbd5d0] bg-white px-4 py-3 text-sm text-[#172d2d]" role="note">
          <strong>Demo report.</strong> The scores, descriptions, and evidence shown here are illustrative placeholders, not findings about this website.
        </p>

        {/* TRUST SCORE */}
        <section className="can-glass-strong mt-10 overflow-hidden rounded-[32px] p-7 shadow-sm md:p-10">

          <div className="grid gap-10 md:grid-cols-[240px_1fr] md:items-center">

            {/* SCORE */}
            <div className="flex justify-center">

              <div className="flex h-48 w-48 flex-col items-center justify-center rounded-full border-[12px] border-[#f8dce6] bg-white/70 shadow-inner">

                <span className="text-6xl font-semibold tracking-tight text-[#765549]">
                  86
                </span>

                <span className="mt-1 text-xs text-[#a8958c]">
                  / 100
                </span>

              </div>

            </div>

            {/* SUMMARY */}
            <div>

              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#a8958c]">
                Trust Confidence
              </p>

              <h2 className="mt-2 text-3xl font-semibold">
                Tingkat kepercayaan tinggi
              </h2>

              <p className="mt-4 max-w-2xl text-sm leading-7 text-[#806f68]">
                Berdasarkan indikator yang dapat diamati, website ini
                menunjukkan sejumlah karakteristik yang mendukung tingkat
                kepercayaan yang relatif tinggi.
              </p>

              <div className="mt-6 rounded-2xl bg-[#fbe5dc]/60 p-4">

                <p className="text-xs font-semibold text-[#765549]">
                  Penting untuk dipahami
                </p>

                <p className="mt-1 text-xs leading-5 text-[#806f68]">
                  Trust Confidence merupakan ringkasan indikator yang tersedia,
                  bukan jaminan bahwa website sepenuhnya aman.
                </p>

              </div>

            </div>

          </div>

        </section>

        {/* TABS */}
        <div className="mt-8 overflow-x-auto">

          <div className="flex min-w-max gap-2 rounded-full bg-white/50 p-1.5">

            {tabs.map((tab) => (
              <Link
                key={tab.name}
                href={`${tab.href}?mode=demo&url=${encodeURIComponent(website)}`}
                className={`rounded-full px-5 py-2.5 text-sm transition ${
                  tab.active
                    ? "bg-[#765549] font-medium text-white shadow-sm"
                    : "text-[#806f68] hover:bg-white"
                }`}
              >
                {tab.name}
              </Link>
            ))}

          </div>

        </div>

        {/* DIMENSIONS */}
        <section className="mt-8">

          <div className="mb-5">

            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#a8958c]">
              Trust Dimensions
            </p>

            <h2 className="mt-2 text-2xl font-semibold">
              Enam dimensi yang diperiksa
            </h2>

          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">

            {dimensions.map((item) => (

              <div
                key={item.name}
                className="can-glass-strong rounded-[26px] p-6 shadow-sm"
              >

                <div className="flex items-start justify-between gap-4">

                  <h3 className="font-semibold">
                    {item.name}
                  </h3>

                  <span className="text-2xl font-semibold text-[#765549]">
                    {item.score}
                  </span>

                </div>

                <div className="mt-4 h-2 overflow-hidden rounded-full bg-[#f1e5e0]">

                  <div
                    className="h-full rounded-full bg-[#d99caf]"
                    style={{
                      width: `${item.score}%`,
                    }}
                  />

                </div>

                <p className="mt-4 text-sm leading-6 text-[#806f68]">
                  {item.description}
                </p>

                <Link
                  href={`/periksa/hasil/explain?mode=demo&url=${encodeURIComponent(website)}`}
                  className="mt-5 inline-block text-xs font-medium text-[#765549]"
                >
                  Pahami lebih lanjut →
                </Link>

              </div>

            ))}

          </div>

        </section>

        {/* INSIGHT */}
        <section className="mt-8 grid gap-5 md:grid-cols-2">

          <div className="rounded-[28px] bg-[#765549] p-7 text-white">

            <p className="text-xs uppercase tracking-[0.18em] text-[#f8dce6]">
              CAN Insight
            </p>

            <h2 className="mt-4 text-2xl font-semibold">
              Jangan berhenti pada satu angka.
            </h2>

            <p className="mt-3 text-sm leading-7 text-white/75">
              Trust Confidence is only a starting point. CAN Explain connects a finding
              to its evidence, impact, and possible action.
            </p>

            <Link
              href={`/periksa/hasil/explain?mode=demo&url=${encodeURIComponent(website)}`}
              className="mt-6 inline-flex rounded-full bg-white px-5 py-3 text-sm font-medium text-[#382a26]"
            >
              Lihat penjelasan →
            </Link>

          </div>

          <div className="can-glass-strong rounded-[28px] p-7 shadow-sm">

            <p className="text-xs uppercase tracking-[0.18em] text-[#a8958c]">
              Next step
            </p>

            <h2 className="mt-4 text-2xl font-semibold">
              Lihat Trust DNA
            </h2>

            <p className="mt-3 text-sm leading-7 text-[#806f68]">
              Lihat karakteristik website dalam satu gambaran berdasarkan
              enam dimensi CAN.
            </p>

            <Link
              href={`/periksa/hasil/trust-dna?mode=demo&url=${encodeURIComponent(website)}`}
              className="mt-6 inline-flex rounded-full border border-[#eadbd5] bg-white/70 px-5 py-3 text-sm font-medium text-[#382a26]"
            >
              Buka Trust DNA →
            </Link>

          </div>

        </section>

      </div>
    </main>
  );
}