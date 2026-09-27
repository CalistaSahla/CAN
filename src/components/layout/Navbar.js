'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed left-0 right-0 top-0 z-50 px-4 pt-4">
      <div className="mx-auto max-w-6xl">
        {/* NAVBAR */}
        <nav className="can-glass-strong flex items-center justify-between rounded-full border border-white/70 px-5 py-3 shadow-sm">
          {/* LOGO */}
          <Link
            href="/"
            className="flex items-center"
          >
            <div className="leading-none">
              <div className="text-xl font-bold tracking-tight text-[#5b4036]">
                CAN<span className="text-[#d786a1]">.</span>
              </div>

              <div className="mt-0.5 text-[6px] text-[#a8958c]">Can You Trust This?</div>
            </div>
          </Link>

          {/* DESKTOP MENU */}
          <div className="hidden items-center gap-7 md:flex">
            <Link
              href="/"
              className="text-sm text-[#806f68] transition hover:text-[#5b4036]"
            >
              Beranda
            </Link>

            <Link
              href="/periksa"
              className="text-sm text-[#806f68] transition hover:text-[#5b4036]"
            >
              Periksa
            </Link>

            <Link
              href="/history"
              className="text-sm text-[#806f68] transition hover:text-[#5b4036]"
            >
              Riwayat
            </Link>

            <Link
              href="/academy"
              className="text-sm text-[#806f68] transition hover:text-[#5b4036]"
            >
              Edukasi
            </Link>

            <Link
              href="/tentang"
              className="text-sm text-[#806f68] transition hover:text-[#5b4036]"
            >
              Tentang
            </Link>
          </div>

          {/* DESKTOP BUTTON */}
          <div className="hidden items-center gap-2 md:flex">
            <button
              type="button"
              className="rounded-full border border-[#eadbd5] bg-white/50 px-5 py-2 text-sm text-[#806f68] transition hover:bg-white"
            >
              Masuk
            </button>

            <button
              type="button"
              className="rounded-full bg-[#765549] px-5 py-2 text-sm font-medium text-white transition hover:bg-[#5b4036]"
            >
              Daftar
            </button>
          </div>

          {/* MOBILE BUTTON */}
          <button
            type="button"
            onClick={() => setOpen(!open)}
            className="rounded-full bg-white/70 px-3 py-2 text-[#5b4036] md:hidden"
            aria-label="Buka menu"
          >
            {open ? '✕' : '☰'}
          </button>
        </nav>

        {/* MOBILE MENU */}
        {open && (
          <div className="can-glass-strong mt-2 rounded-[24px] border border-white/70 p-4 shadow-sm md:hidden">
            <div className="flex flex-col gap-1">
              <Link
                href="/"
                onClick={() => setOpen(false)}
                className="rounded-xl px-4 py-3 text-sm text-[#806f68] hover:bg-white/60"
              >
                Beranda
              </Link>

              <Link
                href="/periksa"
                onClick={() => setOpen(false)}
                className="rounded-xl px-4 py-3 text-sm text-[#806f68] hover:bg-white/60"
              >
                Periksa
              </Link>

              <Link
                href="/history"
                onClick={() => setOpen(false)}
                className="rounded-xl px-4 py-3 text-sm text-[#806f68] hover:bg-white/60"
              >
                Riwayat
              </Link>

              <Link
                href="/academy"
                onClick={() => setOpen(false)}
                className="rounded-xl px-4 py-3 text-sm text-[#806f68] hover:bg-white/60"
              >
                Edukasi
              </Link>

              <Link
                href="/tentang"
                onClick={() => setOpen(false)}
                className="rounded-xl px-4 py-3 text-sm text-[#806f68] hover:bg-white/60"
              >
                Tentang
              </Link>

              <div className="my-2 h-px bg-[#eadbd5]" />

              <button
                type="button"
                className="rounded-xl px-4 py-3 text-left text-sm text-[#806f68] hover:bg-white/60"
              >
                Masuk
              </button>

              <button
                type="button"
                className="rounded-xl bg-[#765549] px-4 py-3 text-left text-sm font-medium text-white"
              >
                Daftar
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
