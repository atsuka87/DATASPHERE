"use client";

import dynamic from "next/dynamic";

const BioluminescentBackground = dynamic(
  () => import("./BioluminescentBackground"),
  { ssr: false }
);

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-[64px] pb-[40px]">
      {/* ── Ambient Interactive Bioluminescent Particle Layer ── */}
      <BioluminescentBackground />

      {/* ── Centered Main Content ── */}
      <div className="page-container relative z-10 text-center flex flex-col items-center gap-[24px] max-w-[1000px] px-[24px]">
        {/* Eyebrow / Label */}
        <span
          className="section-label hero-animate text-[11px] tracking-[0.18em] text-silver-mist inline-block"
          style={{ textShadow: "0 2px 12px rgba(3, 4, 94, 0.4)" }}
        >
          DARMAJAYA HIGH SCHOOL DATA SCIENCE CHALLENGE &amp; CAPSTONE EXPO
        </span>

        {/* Main Title */}
        <h1
          className="hero-animate-d1 text-[clamp(2.75rem,7vw,6.2rem)] font-medium leading-[0.96] tracking-[-0.035em] max-w-[960px] text-platinum transition-transform duration-500 hover:scale-[1.01]"
          style={{ textShadow: "0 2px 12px rgba(3, 4, 94, 0.4)" }}
        >
          DATASPHERE 2026
        </h1>

        {/* Tagline */}
        <p
          className="hero-animate-d2 text-liquid-mist text-[clamp(1.05rem,2.2vw,1.45rem)] leading-[1.35] tracking-[-0.02em] max-w-[620px] font-medium"
          style={{ textShadow: "0 2px 12px rgba(3, 4, 94, 0.4)" }}
        >
          From Data to Event, From Event to Impact
        </p>

        {/* CTA Button */}
        <div className="hero-animate-d3 mt-[12px]">
          <a
            href="/daftar"
            className="gradient-pill-btn text-[14px] px-[36px] py-[16px]"
          >
            Daftar Sekarang
          </a>
        </div>
      </div>

      {/* Scroll indicator positioned at bottom center */}
      <div className="hero-animate-d4 absolute bottom-[28px] left-1/2 -translate-x-1/2 flex flex-col items-center gap-[8px] z-10">
        <span className="section-label text-[10px] text-silver-mist">Scroll</span>
        <div className="w-[1px] h-[24px] bg-accent-secondary/30 relative overflow-hidden">
          <div
            className="absolute inset-x-0 top-0 h-[8px] bg-silver-mist/80"
            style={{ animation: "float 2s ease-in-out infinite" }}
          />
        </div>
      </div>
    </section>
  );
}
