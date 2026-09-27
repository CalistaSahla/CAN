'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

const steps = ['Memeriksa koneksi', 'Mengenali identitas', 'Membaca transparansi', 'Mengamati perilaku', 'Memetakan jaringan', 'Memahami data'];

export default function ScanPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center bg-[#fff9f7]">
          <p className="text-sm text-[#806f68]">Menyiapkan pemeriksaan...</p>
        </main>
      }
    >
      <ScanContent />
    </Suspense>
  );
}

function ScanContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const url = searchParams.get('url') || '';

  const [progress, setProgress] = useState(0);
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (!url) {
      router.replace('/periksa');
    }
  }, [url, router]);

  useEffect(() => {
    if (!url) return;

    const progressTimer = setInterval(() => {
      setProgress((value) => {
        if (value >= 100) {
          clearInterval(progressTimer);
          return 100;
        }

        return value + 1;
      });
    }, 60);

    return () => clearInterval(progressTimer);
  }, [url]);

  useEffect(() => {
    if (!url) return;

    const stepTimer = setInterval(() => {
      setStep((value) => {
        if (value >= steps.length - 1) {
          clearInterval(stepTimer);
          return value;
        }

        return value + 1;
      });
    }, 900);

    return () => clearInterval(stepTimer);
  }, [url]);

  useEffect(() => {
    if (!url) return;

    const resultTimer = setTimeout(() => {
      router.push(`/periksa/hasil?url=${encodeURIComponent(url)}`);
    }, 7000);

    return () => clearTimeout(resultTimer);
  }, [url, router]);

  if (!url) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#fff9f7]">
        <p className="text-sm text-[#806f68]">Menyiapkan pemeriksaan...</p>
      </main>
    );
  }

  return (
    <>
      <main className="min-h-screen overflow-hidden bg-[#fff9f7] px-5 pb-20 pt-28 text-[#382a26]">
        {/* DECORATIVE BLOBS */}

        <div className="scan-blob scan-blob-one" />

        <div className="scan-blob scan-blob-two" />

        <div className="mx-auto max-w-4xl">
          {/* ===================== */}
          {/* ANIMATED SCANNER */}
          {/* ===================== */}

          <div className="flex justify-center">
            <div className="scanner">
              {/* Ring paling luar */}

              <div className="scanner-ring scanner-ring-one" />

              {/* Ring kedua */}

              <div className="scanner-ring scanner-ring-two" />

              {/* Garis scanning */}

              <div className="scanner-line" />

              {/* Titik orbit 1 */}

              <div className="scanner-orbit scanner-orbit-one">
                <span />
              </div>

              {/* Titik orbit 2 */}

              <div className="scanner-orbit scanner-orbit-two">
                <span />
              </div>

              {/* Tengah */}

              <div className="scanner-center">
                <div className="scanner-logo">CAN</div>

                <div className="scanner-dots">
                  <span />
                  <span />
                  <span />
                </div>
              </div>
            </div>
          </div>

          {/* ===================== */}
          {/* TITLE */}
          {/* ===================== */}

          <div className="mt-7 text-center">
            <p className="text-sm font-medium text-[#c8879d]">CAN SCAN</p>

            <h1 className="mt-3 text-4xl font-semibold tracking-tight md:text-5xl">
              Sedang memahami
              <span className="text-[#d786a1]"> website</span>
              <span className="loading-dots">...</span>
            </h1>

            <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-[#806f68]">CAN sedang mengamati berbagai indikator untuk membangun gambaran karakteristik website.</p>
          </div>

          {/* ===================== */}
          {/* URL */}
          {/* ===================== */}

          <div className="mx-auto mt-8 max-w-2xl rounded-[28px] border border-white bg-white/70 p-2 shadow-sm">
            <div className="flex items-center gap-3 rounded-[22px] bg-white px-5 py-4">
              <div className="url-icon">◇</div>

              <div className="min-w-0 flex-1">
                <p className="text-[10px] uppercase tracking-[0.15em] text-[#a8958c]">Website yang diperiksa</p>

                <p className="mt-1 truncate text-sm font-medium text-[#382a26]">{url}</p>
              </div>

              <div className="flex items-center gap-2 text-xs text-[#a8958c]">
                <span className="status-dot" />
                scanning
              </div>
            </div>
          </div>

          {/* ===================== */}
          {/* PROGRESS */}
          {/* ===================== */}

          <div className="mx-auto mt-5 max-w-2xl rounded-[30px] border border-white bg-white/70 p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.15em] text-[#a8958c]">Analysis progress</p>

                <p className="mt-2 text-sm font-medium text-[#5b4036]">{steps[step]}</p>
              </div>

              <span className="text-2xl font-semibold text-[#765549]">{progress}%</span>
            </div>

            <div className="progress-track">
              <div
                className="progress-fill"
                style={{
                  width: `${progress}%`,
                }}
              >
                <div className="progress-light" />
              </div>
            </div>

            <p className="mt-4 text-xs text-[#a8958c]">Menganalisis indikator website...</p>
          </div>

          {/* ===================== */}
          {/* STEPS */}
          {/* ===================== */}

          <div className="mx-auto mt-5 max-w-2xl space-y-2">
            {steps.map((item, index) => {
              const completed = index < step;
              const active = index === step;

              return (
                <div
                  key={item}
                  className={`scan-step ${active ? 'scan-step-active' : ''} ${completed ? 'scan-step-complete' : ''}`}
                >
                  <div className={`step-number ${active ? 'step-active' : ''} ${completed ? 'step-complete' : ''}`}>{completed ? '✓' : `0${index + 1}`}</div>

                  <span className="flex-1">{item}</span>

                  {completed && <span className="step-done">selesai</span>}

                  {active && (
                    <div className="mini-loader">
                      <span />
                      <span />
                      <span />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <p className="mx-auto mt-7 max-w-xl text-center text-[11px] leading-5 text-[#a8958c]">CAN menggunakan indikator yang dapat diamati untuk membantu menjelaskan karakteristik website.</p>
        </div>
      </main>

      {/* ========================= */}
      {/* ANIMATION CSS */}
      {/* ========================= */}

      <style>{`

        /* BLOBS */

        .scan-blob {
          position: fixed;
          width: 180px;
          height: 180px;
          border-radius: 9999px;
          filter: blur(55px);
          pointer-events: none;
          z-index: 0;
        }

        .scan-blob-one {
          left: 5%;
          top: 25%;
          background: rgba(248, 220, 230, 0.55);
          animation: blobMoveOne 5s ease-in-out infinite;
        }

        .scan-blob-two {
          right: 5%;
          top: 45%;
          background: rgba(246, 199, 181, 0.45);
          animation: blobMoveTwo 6s ease-in-out infinite;
        }

        @keyframes blobMoveOne {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }

          50% {
            transform: translate(35px, -25px) scale(1.2);
          }
        }

        @keyframes blobMoveTwo {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }

          50% {
            transform: translate(-35px, 25px) scale(1.15);
          }
        }

        /* SCANNER */

        .scanner {
          position: relative;
          width: 190px;
          height: 190px;
        }

        .scanner-ring {
          position: absolute;
          inset: 0;
          border-radius: 9999px;
        }

        .scanner-ring-one {
          border: 1px solid #e4bdc9;
          animation: rotateClockwise 5s linear infinite;
        }

        .scanner-ring-two {
          inset: 17px;
          border: 2px dashed rgba(215, 134, 161, 0.55);
          animation: rotateReverse 4s linear infinite;
        }

        @keyframes rotateClockwise {
          from {
            transform: rotate(0deg);
          }

          to {
            transform: rotate(360deg);
          }
        }

        @keyframes rotateReverse {
          from {
            transform: rotate(360deg);
          }

          to {
            transform: rotate(0deg);
          }
        }

        /* ORBIT */

        .scanner-orbit {
          position: absolute;
          inset: 0;
          border-radius: 9999px;
          animation: rotateClockwise 3s linear infinite;
        }

        .scanner-orbit span {
          position: absolute;
          width: 13px;
          height: 13px;
          border-radius: 9999px;
          background: #d786a1;
          box-shadow: 0 0 18px rgba(215, 134, 161, 0.7);
        }

        .scanner-orbit-one span {
          top: 2px;
          left: 50%;
          transform: translateX(-50%);
        }

        .scanner-orbit-two {
          inset: 25px;
          animation: rotateReverse 2.5s linear infinite;
        }

        .scanner-orbit-two span {
          bottom: 0;
          left: 50%;
          width: 9px;
          height: 9px;
          transform: translateX(-50%);
          background: #f0b8c8;
          box-shadow: none;
        }

        /* CENTER */

        .scanner-center {
          position: absolute;
          left: 50%;
          top: 50%;
          width: 95px;
          height: 95px;
          transform: translate(-50%, -50%);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          border-radius: 9999px;
          background: rgba(255, 255, 255, 0.92);
          border: 1px solid white;
          box-shadow:
            0 15px 40px rgba(118, 85, 73, 0.12),
            0 0 30px rgba(215, 134, 161, 0.15);
          animation: centerPulse 2s ease-in-out infinite;
          z-index: 3;
        }

        @keyframes centerPulse {
          0%, 100% {
            transform: translate(-50%, -50%) scale(1);
          }

          50% {
            transform: translate(-50%, -50%) scale(1.08);
          }
        }

        .scanner-logo {
          font-size: 25px;
          font-weight: 700;
          color: #765549;
          letter-spacing: -1px;
        }

        /* DOTS */

        .scanner-dots {
          display: flex;
          gap: 4px;
          margin-top: 8px;
        }

        .scanner-dots span {
          width: 5px;
          height: 5px;
          border-radius: 9999px;
          background: #d786a1;
          animation: dotBounce 1.2s ease-in-out infinite;
        }

        .scanner-dots span:nth-child(2) {
          animation-delay: 0.2s;
        }

        .scanner-dots span:nth-child(3) {
          animation-delay: 0.4s;
        }

        @keyframes dotBounce {
          0%, 100% {
            transform: translateY(0);
            opacity: 0.35;
          }

          50% {
            transform: translateY(-5px);
            opacity: 1;
          }
        }

        /* SCANNING LINE */

        .scanner-line {
          position: absolute;
          left: 25px;
          right: 25px;
          top: 50%;
          height: 1px;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(215, 134, 161, 0.5),
            transparent
          );
          animation: scanLine 1.8s ease-in-out infinite;
          z-index: 4;
        }

        @keyframes scanLine {
          0%, 100% {
            opacity: 0;
            transform: translateY(-45px);
          }

          50% {
            opacity: 1;
            transform: translateY(45px);
          }
        }

        /* TITLE DOTS */

        .loading-dots {
          display: inline-block;
          width: 24px;
          overflow: hidden;
          animation: loadingDots 1.4s steps(4, end) infinite;
        }

        @keyframes loadingDots {
          0% {
            width: 0;
          }

          25% {
            width: 7px;
          }

          50% {
            width: 14px;
          }

          75%, 100% {
            width: 24px;
          }
        }

        /* URL ICON */

        .url-icon {
          display: flex;
          width: 36px;
          height: 36px;
          align-items: center;
          justify-content: center;
          border-radius: 9999px;
          background: #f8dce6;
          color: #765549;
          animation: iconPulse 1.8s ease-in-out infinite;
        }

        @keyframes iconPulse {
          0%, 100% {
            transform: scale(1);
          }

          50% {
            transform: scale(1.12);
          }
        }

        /* STATUS */

        .status-dot {
          width: 8px;
          height: 8px;
          border-radius: 9999px;
          background: #8db79a;
          animation: statusPulse 1s ease-in-out infinite;
        }

        @keyframes statusPulse {
          0%, 100% {
            opacity: 0.35;
            transform: scale(0.8);
          }

          50% {
            opacity: 1;
            transform: scale(1.2);
          }
        }

        /* PROGRESS */

        .progress-track {
          position: relative;
          width: 100%;
          height: 8px;
          margin-top: 20px;
          overflow: hidden;
          border-radius: 9999px;
          background: #f1e5e0;
        }

        .progress-fill {
          position: relative;
          height: 100%;
          border-radius: 9999px;
          background: #d786a1;
          transition: width 0.15s linear;
          overflow: hidden;
        }

        .progress-light {
          position: absolute;
          right: -30px;
          top: 0;
          width: 40px;
          height: 100%;
          background: rgba(255, 255, 255, 0.6);
          filter: blur(3px);
          animation: progressLight 1s linear infinite;
        }

        @keyframes progressLight {
          from {
            transform: translateX(-100px);
          }

          to {
            transform: translateX(100px);
          }
        }

        /* STEPS */

        .scan-step {
          display: flex;
          align-items: center;
          gap: 16px;
          min-height: 62px;
          padding: 12px 20px;
          border-radius: 18px;
          border: 1px solid rgba(255, 255, 255, 0.7);
          background: rgba(255, 255, 255, 0.3);
          color: #b09f98;
          transition: all 0.4s ease;
        }

        .scan-step-active {
          background: rgba(255, 255, 255, 0.9);
          border-color: #e5c2cc;
          color: #5b4036;
          box-shadow: 0 8px 25px rgba(118, 85, 73, 0.07);
          transform: translateX(5px);
        }

        .scan-step-complete {
          background: rgba(255, 255, 255, 0.55);
          color: #806f68;
        }

        .step-number {
          display: flex;
          width: 36px;
          height: 36px;
          flex-shrink: 0;
          align-items: center;
          justify-content: center;
          border-radius: 9999px;
          background: white;
          color: #b5a59e;
          font-size: 12px;
        }

        .step-active {
          background: #f8dce6;
          color: #765549;
        }

        .step-complete {
          background: #e7f0e9;
          color: #55715e;
        }

        .step-done {
          font-size: 11px;
          color: #70907b;
        }

        /* MINI LOADER */

        .mini-loader {
          display: flex;
          gap: 4px;
        }

        .mini-loader span {
          width: 6px;
          height: 6px;
          border-radius: 9999px;
          background: #d786a1;
          animation: miniBounce 1s ease-in-out infinite;
        }

        .mini-loader span:nth-child(2) {
          animation-delay: 0.15s;
        }

        .mini-loader span:nth-child(3) {
          animation-delay: 0.3s;
        }

        @keyframes miniBounce {
          0%, 100% {
            transform: translateY(0);
            opacity: 0.4;
          }

          50% {
            transform: translateY(-4px);
            opacity: 1;
          }
        }

      `}</style>
    </>
  );
}
