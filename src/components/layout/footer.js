import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-[#eadbd5] bg-[#fff9f7] px-5 py-10">
      <div className="mx-auto max-w-6xl">

        <div className="grid gap-8 md:grid-cols-[1.5fr_1fr_1fr]">

          {/* BRAND */}
          <div>
            <Link
              href="/"
              className="text-2xl font-bold tracking-tight text-[#5b4036]"
            >
              CAN<span className="text-[#d786a1]">.</span>
            </Link>

            <p className="mt-3 max-w-sm text-sm leading-6 text-[#806f68]">
              Can You Trust This? membantu pengguna memahami karakteristik
              website melalui indikator, evidence, dan penjelasan yang mudah
              dipahami.
            </p>

            <p className="mt-4 text-xs text-[#a8958c]">
              Understand before you trust.
            </p>
          </div>

          {/* PRODUCT */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[#a8958c]">
              Product
            </p>

            <div className="mt-4 flex flex-col gap-3">
              <Link
                href="/periksa"
                className="text-sm text-[#806f68] hover:text-[#5b4036]"
              >
                Periksa Website
              </Link>

              <Link
                href="/history"
                className="text-sm text-[#806f68] hover:text-[#5b4036]"
              >
                Riwayat
              </Link>

              <Link
                href="/academy"
                className="text-sm text-[#806f68] hover:text-[#5b4036]"
              >
                CAN Academy
              </Link>
            </div>
          </div>

          {/* EXPLORE */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[#a8958c]">
              Explore
            </p>

            <div className="mt-4 flex flex-col gap-3">
              <Link
                href="/tentang"
                className="text-sm text-[#806f68] hover:text-[#5b4036]"
              >
                Tentang CAN
              </Link>

              <Link
                href="/periksa/hasil/trust-dna"
                className="text-sm text-[#806f68] hover:text-[#5b4036]"
              >
                Trust DNA
              </Link>

              <Link
                href="/periksa/hasil/explain"
                className="text-sm text-[#806f68] hover:text-[#5b4036]"
              >
                CAN Explain
              </Link>
            </div>
          </div>

        </div>

        <div className="mt-10 flex flex-col justify-between gap-3 border-t border-[#eadbd5] pt-5 md:flex-row">
          <p className="text-xs text-[#a8958c]">
            © 2026 CAN — Can You Trust This?
          </p>

          <p className="text-xs text-[#a8958c]">
            Built for NextGen Secure
          </p>
        </div>

      </div>
    </footer>
  );
}