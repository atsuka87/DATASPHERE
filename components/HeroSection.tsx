"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { EVENT, COUNTDOWN_TARGET } from "@/lib/event-data";
import { useNow } from "@/lib/use-now";

const BioluminescentBackground = dynamic(() => import("./BioluminescentBackground"), { ssr: false });
const ParticleSphere = dynamic(() => import("./ParticleSphere"), { ssr: false });

const quickFacts = [
  { value: "12 Okt", label: "Pendaftaran Dibuka" },
  { value: "17 Nov", label: "Penyisihan Online" },
  { value: "7 Des", label: "Final Offline" },
];

export default function HeroSection() {
  const now = useNow();
  const daysLeft =
    now === null ? null : Math.ceil((new Date(COUNTDOWN_TARGET.iso).getTime() - now) / 86_400_000);

  return (
    <section className="relative min-h-[100svh] flex items-center overflow-hidden pt-[84px] pb-[40px] md:pt-[96px] md:pb-[72px]">
      {/* Jaringan partikel data di seluruh hero */}
      <BioluminescentBackground />

      <div className="page-container relative z-10 w-full grid grid-cols-1 lg:grid-cols-[1.05fr_1fr] items-center gap-[8px] lg:gap-[40px]">
        {/* Data orb 3D — di HP tampil di atas teks */}
        <div className="relative order-first lg:order-last h-[190px] sm:h-[340px] lg:h-[620px] -mx-[20px] sm:mx-0 hero-animate">
          {/* Glow persegi di tengah + gradient closest-side → pudar penuh sebelum tepi, tanpa garis potong */}
          <div
            className="absolute left-1/2 top-1/2 h-[92%] aspect-square -translate-x-1/2 -translate-y-1/2 pointer-events-none"
            aria-hidden="true"
          >
            <div
              className="w-full h-full animate-bioluminescent-breathe"
              style={{ background: "radial-gradient(closest-side, rgba(0,180,216,0.28) 0%, rgba(0,119,182,0.12) 50%, transparent 100%)" }}
            />
          </div>
          <ParticleSphere />
        </div>

        {/* Teks */}
        <div className="flex flex-col items-center text-center lg:items-start lg:text-left gap-[14px] sm:gap-[22px]">
          <span className="hero-animate inline-flex items-center gap-[10px] rounded-full border border-accent-secondary/40 bg-liquid-tide/60 backdrop-blur-sm px-[14px] py-[6px] text-[11px] sm:text-[12px] uppercase tracking-[0.14em] sm:tracking-[0.18em] text-liquid-mist">
            <span className="relative flex w-[8px] h-[8px]" aria-hidden="true">
              <span className="absolute inset-0 rounded-full bg-accent-secondary animate-ping opacity-60" />
              <span className="relative w-[8px] h-[8px] rounded-full bg-accent-secondary" />
            </span>
            {EVENT.theme}
          </span>

          <h1 className="hero-animate-d1 text-[clamp(2.9rem,7.2vw,6.4rem)] font-medium leading-[0.92] tracking-[-0.045em] text-platinum">
            DATA<span className="text-gradient-aurora">SPHERE</span>
            <span className="block">2026</span>
          </h1>

          <p className="hero-animate-d2 text-liquid-mist text-[clamp(1.1rem,2vw,1.4rem)] leading-[1.35] tracking-[-0.015em] font-medium max-w-[560px]">
            {EVENT.tagline}
          </p>

          <p className="hero-animate-d2 hidden sm:block text-silver-mist text-[15px] leading-[1.55] max-w-[520px]">
            Seminar &amp; kompetisi sains data untuk siswa SMA/SMK/sederajat se-Provinsi Lampung —
            DataViz Challenge, Data Quiz Battle, dan Young Data Researcher.
          </p>

          <div className="hero-animate-d3 w-full sm:w-auto flex flex-col sm:flex-row items-stretch sm:items-center gap-[10px] sm:gap-[14px] mt-[4px] sm:mt-[6px]">
            <Link href="/daftar" className="gradient-pill-btn text-[14px] px-[36px] py-[16px]">
              Daftar Sekarang
            </Link>
            <Link
              href="/kategori"
              className="ghost-nav-link text-center text-[13px] px-[22px] py-[14px] rounded-[var(--radius-small)] border border-liquid-mist/25 hover:border-accent-secondary hover:bg-liquid-tide/60 transition-all"
            >
              Lihat Kategori →
            </Link>
          </div>

          {/* Fakta cepat + countdown TM */}
          <div className="hero-animate-d4 w-full max-w-[560px] mt-[6px] sm:mt-[10px] grid grid-cols-3 gap-[8px] sm:gap-[10px]">
            {quickFacts.map((f) => (
              <div
                key={f.label}
                className="rounded-[var(--radius-small)] border border-accent-primary/35 bg-liquid-deep/50 backdrop-blur-sm px-[10px] sm:px-[12px] py-[10px] text-left"
              >
                <span className="block text-lavender-phosphor text-[16px] sm:text-[18px] font-medium leading-[1.1]">{f.value}</span>
                <span className="block text-silver-mist text-[11px] sm:text-[12px] leading-[1.3] mt-[2px]">{f.label}</span>
              </div>
            ))}
          </div>

          <Link
            href="/timeline"
            className="hero-animate-d4 py-[6px] text-[11px] sm:text-[12px] uppercase tracking-[0.1em] sm:tracking-[0.12em] text-silver-mist hover:text-platinum transition-colors"
          >
            {COUNTDOWN_TARGET.label} · {COUNTDOWN_TARGET.date}
            {daysLeft !== null && daysLeft > 0 && <span className="text-lavender-phosphor"> · H-{daysLeft}</span>}
          </Link>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="hero-animate-d4 absolute bottom-[20px] left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center gap-[8px] z-10">
        <span className="section-label text-[11px] text-silver-mist">Scroll</span>
        <div className="w-[1px] h-[24px] bg-accent-secondary/30 relative overflow-hidden">
          <div className="absolute inset-x-0 top-0 h-[8px] bg-silver-mist/80" style={{ animation: "float 2s ease-in-out infinite" }} />
        </div>
      </div>
    </section>
  );
}
