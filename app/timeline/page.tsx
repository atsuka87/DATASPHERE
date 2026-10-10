"use client";

import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Countdown from "@/components/Countdown";
import { COUNTDOWN_TARGET, TIMELINE } from "@/lib/event-data";
import { useNow } from "@/lib/use-now";

type Status = "done" | "ongoing" | "upcoming";

const STATUS_STYLE: Record<Status, { label: string; className: string }> = {
  done: { label: "Selesai", className: "text-silver-mist bg-transparent border-silver-mist/30" },
  ongoing: { label: "Berlangsung", className: "text-platinum bg-accent-primary border-accent-secondary" },
  upcoming: { label: "Mendatang", className: "text-silver-mist bg-liquid-tide border-accent-primary/30" },
};

function getStatus(start: string, end: string, now: number): Status {
  if (now > new Date(end).getTime()) return "done";
  if (now >= new Date(start).getTime()) return "ongoing";
  return "upcoming";
}

export default function TimelinePage() {
  // Status mengikuti waktu pengunjung, bukan waktu build
  const now = useNow();

  return (
    <>
      <Navbar />
      <main className="pt-[110px] pb-[80px] min-h-screen">
        {/* Header Section */}
        <section className="py-[36px]">
          <div className="page-container flex flex-col items-center text-center gap-[16px]">
            <span className="section-label hero-animate">ROADMAP &amp; JADWAL KEGIATAN</span>
            <h1 className="hero-animate-d1 text-[clamp(2.5rem,5.5vw,4.5rem)] leading-none text-platinum">
              Jadwal &amp; Agenda
            </h1>
            <p className="hero-animate-d2 text-silver-mist text-[17px] max-w-[640px] leading-[1.45]">
              Jadwal resmi DATASPHERE 2026 — dari Seminar &amp; Workshop pembukaan
              hingga Awarding.
            </p>

            {/* Live Countdown Box */}
            <div className="w-full max-w-[760px] mt-[24px] p-[24px] sm:p-[28px] md:p-[36px] rounded-[var(--radius-cards)] bg-liquid-kelp border border-accent-primary/40 relative overflow-hidden">
              <div
                className="absolute inset-0 pointer-events-none opacity-20"
                style={{
                  background:
                    "radial-gradient(circle 400px at 50% 50%, rgba(0, 180, 216, 0.3), transparent 70%)",
                }}
                aria-hidden="true"
              />

              <div className="relative z-10 flex flex-col items-center gap-[16px]">
                <span className="section-label text-lavender-phosphor text-[11px] tracking-[0.16em]">
                  COUNTDOWN MENUJU {COUNTDOWN_TARGET.label.toUpperCase()}
                </span>
                <Countdown />
                <p className="text-silver-mist text-[13px] mt-[4px]">
                  {COUNTDOWN_TARGET.label} peserta lomba: {COUNTDOWN_TARGET.date}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Timeline Roadmap Section */}
        <section className="py-[32px]">
          <div className="page-container max-w-[900px] flex flex-col gap-[20px]">
            {TIMELINE.map((stage, idx) => {
              const status = now === null ? "upcoming" : getStatus(stage.start, stage.end, now);
              const badge = STATUS_STYLE[status];
              return (
                <div
                  key={stage.id}
                  className="surface-card flex flex-col md:flex-row gap-[20px] md:gap-[24px] p-[24px] md:p-[32px] relative"
                >
                  {/* Stage Indicator Column */}
                  <div className="flex md:flex-col items-center md:items-start justify-between md:justify-start gap-[12px] md:w-[140px] flex-shrink-0">
                    <div className="w-[52px] h-[52px] rounded-full bg-liquid-tide border border-accent-primary/40 flex items-center justify-center font-medium text-[20px] text-platinum tracking-[0.06em]">
                      {String(idx + 1).padStart(2, "0")}
                    </div>
                    <span
                      className={`text-[11px] tracking-[0.12em] uppercase font-medium px-[10px] py-[3px] rounded-[var(--radius-small)] border ${badge.className}`}
                    >
                      {badge.label}
                    </span>
                  </div>

                  {/* Stage Content */}
                  <div className="flex flex-col gap-[10px] flex-grow">
                    <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-[6px]">
                      <h2 className="text-platinum text-[22px] md:text-[24px] font-medium leading-[1.2]">
                        {stage.title}
                      </h2>
                      <span className="text-lavender-phosphor text-[14px] font-medium tracking-[0.02em] sm:whitespace-nowrap">
                        {stage.date}
                      </span>
                    </div>

                    <span className="text-silver-mist text-[12px] uppercase tracking-[0.1em]">
                      {stage.mode}
                      {stage.location && ` · ${stage.location}`}
                    </span>

                    <p className="text-liquid-mist text-[15px] leading-[1.45]">{stage.summary}</p>
                  </div>
                </div>
              );
            })}

            {/* Bottom CTA Card */}
            <div className="recessed-card flex flex-col sm:flex-row items-center justify-between gap-[24px] p-[32px] md:p-[48px] mt-[24px]">
              <div className="flex flex-col gap-[6px] text-center sm:text-left">
                <span className="section-label text-lavender-phosphor">JANGAN TERTINGGAL</span>
                <h3 className="text-platinum text-[24px]">Daftar Seminar atau Lomba</h3>
                <p className="text-silver-mist text-[14px]">
                  Seminar terbuka untuk umum; lomba untuk siswa SMA/SMK/sederajat se-Provinsi Lampung.
                </p>
              </div>
              <Link href="/daftar" className="gradient-pill-btn text-[14px] px-[32px] py-[14px] flex-shrink-0">
                Daftar Sekarang
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
