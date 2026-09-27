import Link from "next/link";

const lessons = [
  {
    category: "Dasar",
    title: "Apa itu website yang dapat dipercaya?",
    description:
      "Kenali perbedaan antara sekadar terlihat profesional dan memiliki indikator yang dapat diperiksa.",
  },
  {
    category: "Keamanan",
    title: "Mengenal HTTPS dan TLS",
    description:
      "Pahami bagaimana koneksi terenkripsi bekerja dan apa yang sebenarnya bisa dijelaskan oleh HTTPS.",
  },
  {
    category: "Privasi",
    title: "Data apa yang diminta website?",
    description:
      "Pelajari cara membaca form, privacy policy, dan kategori informasi yang berpotensi diminta.",
  },
  {
    category: "Identitas",
    title: "Siapa sebenarnya di balik sebuah domain?",
    description:
      "Kenali indikator yang dapat membantu memahami identitas dan konteks sebuah website.",
  },
  {
    category: "Jaringan",
    title: "Website tidak bekerja sendirian",
    description:
      "Kenali hubungan website dengan analytics, CDN, payment provider, dan layanan pihak ketiga.",
  },
  {
    category: "Literasi Digital",
    title: "Jangan hanya melihat skor",
    description:
      "Pelajari mengapa konteks dan evidence penting ketika memahami karakteristik website.",
  },
];

export default function AcademyPage() {
  return (
    <main className="min-h-screen bg-[#fff9f7] px-5 pb-20 pt-32 text-[#382a26]">
      <div className="mx-auto max-w-6xl">

        <div className="max-w-3xl">
          <p className="text-sm font-medium text-[#c8879d]">
            CAN ACADEMY
          </p>

          <h1 className="mt-3 text-4xl font-semibold tracking-tight md:text-6xl">
            Belajar memahami
            <span className="text-[#d786a1]"> web.</span>
          </h1>

          <p className="mt-5 max-w-2xl text-base leading-7 text-[#806f68]">
            Materi singkat untuk membantu kamu memahami indikator website,
            privasi, keamanan, identitas, dan jaringan digital.
          </p>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {lessons.map((lesson, index) => (
            <article
              key={lesson.title}
              className="can-glass-strong rounded-[28px] p-6 shadow-sm transition hover:-translate-y-1"
            >
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-[#f8dce6] px-3 py-1 text-xs text-[#765549]">
                  {lesson.category}
                </span>

                <span className="text-xs text-[#b09d95]">
                  0{index + 1}
                </span>
              </div>

              <h2 className="mt-6 text-xl font-semibold leading-7">
                {lesson.title}
              </h2>

              <p className="mt-3 text-sm leading-6 text-[#806f68]">
                {lesson.description}
              </p>

              <button className="mt-6 text-sm font-medium text-[#765549]">
                Pelajari →
              </button>
            </article>
          ))}
        </div>

      </div>
    </main>
  );
}