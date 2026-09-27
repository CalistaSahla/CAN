"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../components/layout/Navbar";

const dimensions = [
  {
    icon: "◌",
    title: "Keamanan",
    text: "Melihat indikator koneksi dan konfigurasi keamanan.",
  },
  {
    icon: "◯",
    title: "Identitas",
    text: "Memahami informasi domain dan identitas website.",
  },
  {
    icon: "◇",
    title: "Transparansi",
    text: "Melihat informasi kontak, kebijakan, dan layanan.",
  },
  {
    icon: "↗",
    title: "Perilaku",
    text: "Mengamati perilaku website saat diperiksa.",
  },
  {
    icon: "⌘",
    title: "Jaringan",
    text: "Melihat hubungan dengan layanan pihak ketiga.",
  },
  {
    icon: "□",
    title: "Data",
    text: "Mengidentifikasi data yang berpotensi diminta.",
  },
];

export default function HomePage() {
  const [url, setUrl] = useState("");
  const router = useRouter();

  function handleScan(event) {
    event.preventDefault();

    const cleanUrl = url.trim();

    if (!cleanUrl) {
      return;
    }

    let finalUrl = cleanUrl;

    if (
      !finalUrl.startsWith("http://") &&
      !finalUrl.startsWith("https://")
    ) {
      finalUrl = `https://${finalUrl}`;
    }

    router.push(
      `/periksa/scan?url=${encodeURIComponent(finalUrl)}`
    );
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[#fff9f7] text-[#382a26]">
      <Navbar />

      {/* DECORATION */}
      <div className="pointer-events-none absolute left-[5%] top-32 h-24 w-24 rounded-full bg-[#f8dce6]/60 blur-2xl" />

      <div className="pointer-events-none absolute right-[8%] top-48 h-32 w-32 rounded-full bg-[#f6c7b5]/50 blur-3xl" />

      <div className="pointer-events-none absolute left-[45%] top-[55%] h-20 w-20 rounded-full bg-[#f8dce6]/40 blur-2xl" />

      {/* HERO */}
      <section className="relative px-5 pb-20 pt-36 md:pb-28 md:pt-44">
        <div className="mx-auto max-w-6xl">

          <div className="grid items-center gap-14 lg:grid-cols-[1.05fr_0.95fr]">

            {/* LEFT */}
            <div>

              <div className="inline-flex items-center gap-2 rounded-full border border-[#eadbd5] bg-white/60 px-4 py-2 text-xs text-[#806f68]">
                <span className="h-2 w-2 rounded-full bg-[#d786a1]" />
                Understand before you trust
              </div>

              <h1 className="mt-7 max-w-3xl text-5xl font-semibold leading-[1.05] tracking-tight md:text-7xl">
                Jangan hanya percaya
                <br />
                sebuah website.
                <br />
                <span className="text-[#d786a1]">
                  Pahami itu.
                </span>
              </h1>

              <p className="mt-7 max-w-xl text-base leading-7 text-[#806f68] md:text-lg">
                CAN membantu kamu memahami karakteristik sebuah website
                melalui berbagai indikator keamanan, identitas, transparansi,
                perilaku, jaringan, dan data.
              </p>

              {/* URL SCANNER */}
              <form
                onSubmit={handleScan}
                className="can-glass-strong mt-9 flex max-w-2xl items-center rounded-full border border-white/70 p-2 shadow-sm"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#f8dce6] text-[#765549]">
                  ⌕
                </div>

                <input
                  type="text"
                  value={url}
                  onChange={(event) => setUrl(event.target.value)}
                  placeholder="Masukkan URL website..."
                  className="min-w-0 flex-1 bg-transparent px-4 text-sm text-[#382a26] outline-none placeholder:text-[#a8958c]"
                />

                <button
                  type="submit"
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#765549] text-lg text-white transition hover:bg-[#5b4036]"
                  aria-label="Periksa website"
                >
                  →
                </button>
              </form>

              <p className="mt-3 text-xs text-[#a8958c]">
                Contoh: example.com atau https://example.com
              </p>

            </div>

            {/* RIGHT VISUAL */}
            <div className="relative mx-auto w-full max-w-lg">

              <div className="can-glass-strong relative min-h-[430px] overflow-hidden rounded-[38px] border border-white/70 p-7 shadow-sm">

                <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-[#f8dce6]/60 blur-2xl" />

                <div className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-[#f6c7b5]/50 blur-2xl" />

                {/* BROWSER */}
                <div className="relative mt-10 rounded-[26px] border border-white bg-white/65 p-5 shadow-sm">

                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-[#eadbd5]" />
                    <span className="h-2.5 w-2.5 rounded-full bg-[#eadbd5]" />
                    <span className="h-2.5 w-2.5 rounded-full bg-[#eadbd5]" />

                    <div className="ml-3 h-7 flex-1 rounded-full bg-[#f8f1ee]" />
                  </div>

                  <div className="mt-8 rounded-[22px] bg-[#fff9f7] p-6">

                    <div className="h-4 w-28 rounded-full bg-[#eadbd5]" />

                    <div className="mt-4 h-3 w-44 rounded-full bg-[#f1e5e0]" />

                    <div className="mt-7 grid grid-cols-2 gap-3">
                      <div className="h-20 rounded-2xl bg-[#f8dce6]/60" />
                      <div className="h-20 rounded-2xl bg-[#fbe5dc]/70" />
                    </div>

                    <div className="mt-3 h-20 rounded-2xl bg-[#e7f0e9]/70" />

                  </div>
                </div>

                {/* FLOATING QUESTIONS */}
                <div className="absolute left-4 top-16 rounded-2xl border border-white bg-white/75 px-4 py-3 text-xs text-[#765549] shadow-sm">
                  Aman kah?
                </div>

                <div className="absolute right-3 top-28 rounded-2xl border border-white bg-white/75 px-4 py-3 text-xs text-[#765549] shadow-sm">
                  Domain siapa?
                </div>

                <div className="absolute bottom-20 left-4 rounded-2xl border border-white bg-white/75 px-4 py-3 text-xs text-[#765549] shadow-sm">
                  Ada pihak ketiga?
                </div>

                <div className="absolute bottom-8 right-4 rounded-2xl border border-white bg-white/75 px-4 py-3 text-xs text-[#765549] shadow-sm">
                  Data apa yang diminta?
                </div>

              </div>

              <div className="absolute -right-2 -top-5 text-xl text-[#d786a1]">
                ✦
              </div>

              <div className="absolute -bottom-3 left-8 text-sm text-[#d786a1]">
                ✦
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* DIMENSIONS */}
      <section className="px-5 pb-24">
        <div className="mx-auto max-w-6xl">

          <div className="mb-8 max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#a8958c]">
              What CAN looks at
            </p>

            <h2 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">
              Tidak hanya satu indikator.
            </h2>

            <p className="mt-3 text-sm leading-6 text-[#806f68]">
              CAN melihat beberapa dimensi untuk memberikan konteks yang lebih
              lengkap mengenai sebuah website.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {dimensions.map((item) => (
              <div
                key={item.title}
                className="can-glass-strong rounded-[26px] p-6 shadow-sm"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#f8dce6] text-[#765549]">
                  {item.icon}
                </div>

                <h3 className="mt-5 text-lg font-semibold">
                  {item.title}
                </h3>

                <p className="mt-2 text-sm leading-6 text-[#806f68]">
                  {item.text}
                </p>
              </div>
            ))}
          </div>

        </div>
      </section>

    </main>
  );
}