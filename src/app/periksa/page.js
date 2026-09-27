"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function PeriksaPage() {
  const router = useRouter();
  const [url, setUrl] = useState("");

  function handleSubmit(event) {
    event.preventDefault();

    const value = url.trim();

    if (!value) {
      return;
    }

    let website = value;

    if (
      !website.startsWith("http://") &&
      !website.startsWith("https://")
    ) {
      website = `https://${website}`;
    }

    router.push(
      `/periksa/scan?url=${encodeURIComponent(website)}`
    );
  }

  return (
    <main className="min-h-screen bg-[#fff9f7] px-5 pb-20 pt-28 text-[#382a26]">

      <div className="mx-auto max-w-6xl">

        {/* BACK */}
        <Link
          href="/"
          className="text-sm text-[#806f68] transition hover:text-[#5b4036]"
        >
          ← Kembali ke Beranda
        </Link>

        {/* HEADER */}
        <section className="mx-auto max-w-3xl pt-16 text-center">

          <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-[#eadbd5] bg-white px-4 py-2 text-xs text-[#806f68]">
            <span className="h-2 w-2 rounded-full bg-[#d786a1]" />
            CAN Scan
          </div>

          <h1 className="mt-7 text-4xl font-semibold leading-tight tracking-tight md:text-6xl">
            Website mana yang
            <br />
            ingin kamu
            <span className="text-[#d786a1]"> pahami?</span>
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-[#806f68]">
            Masukkan alamat website yang ingin diperiksa. CAN akan membantu
            memahami karakteristik website berdasarkan berbagai indikator.
          </p>

        </section>

        {/* INPUT */}
        <section className="mx-auto mt-12 max-w-3xl">

          <form
            onSubmit={handleSubmit}
            className="flex items-center rounded-[30px] border border-white bg-white p-2 shadow-[0_15px_50px_rgba(118,85,73,0.08)]"
          >

            <div className="ml-2 flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#f8dce6] text-lg text-[#765549]">
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
              className="flex h-12 shrink-0 items-center justify-center rounded-full bg-[#765549] px-6 text-sm font-medium text-white transition hover:bg-[#5b4036]"
            >
              Periksa →
            </button>

          </form>

          <p className="mt-3 text-center text-xs text-[#a8958c]">
            Contoh: example.com
          </p>

        </section>

        {/* DIMENSIONS */}
        <section className="mt-20">

          <div className="text-center">

            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#a8958c]">
              CAN looks at
            </p>

            <h2 className="mt-3 text-3xl font-semibold tracking-tight">
              Enam dimensi yang diperiksa
            </h2>

            <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-[#806f68]">
              CAN tidak hanya melihat satu angka. Beberapa dimensi dianalisis
              untuk memberikan konteks yang lebih lengkap.
            </p>

          </div>

          <div className="mt-9 grid gap-4 md:grid-cols-2 lg:grid-cols-3">

            <Dimension
              icon="◌"
              title="Keamanan"
              text="Indikator koneksi dan konfigurasi keamanan yang dapat diamati."
            />

            <Dimension
              icon="◯"
              title="Identitas"
              text="Informasi domain dan konteks identitas website."
            />

            <Dimension
              icon="◇"
              title="Transparansi"
              text="Kontak, kebijakan, dan informasi layanan yang tersedia."
            />

            <Dimension
              icon="↗"
              title="Perilaku"
              text="Pola navigasi, redirect, dan respons website."
            />

            <Dimension
              icon="⌘"
              title="Jaringan"
              text="Hubungan website dengan layanan pihak ketiga."
            />

            <Dimension
              icon="□"
              title="Data"
              text="Kategori informasi yang terdeteksi berpotensi diminta."
            />

          </div>

        </section>

        {/* NOTE */}
        <div className="mx-auto mt-10 max-w-3xl rounded-[24px] border border-[#eadbd5] bg-white/60 p-5 text-center">

          <p className="text-xs leading-5 text-[#806f68]">
            CAN memberikan konteks berdasarkan indikator yang dapat diamati.
            Hasil pemeriksaan bukan jaminan keamanan absolut terhadap website.
          </p>

        </div>

      </div>

    </main>
  );
}

function Dimension({ icon, title, text }) {
  return (
    <div className="rounded-[26px] border border-white bg-white/65 p-6 shadow-sm backdrop-blur">

      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#f8dce6] text-[#765549]">
        {icon}
      </div>

      <h3 className="mt-5 font-semibold text-[#382a26]">
        {title}
      </h3>

      <p className="mt-2 text-sm leading-6 text-[#806f68]">
        {text}
      </p>

    </div>
  );
}