"use client";

import { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AnimateOnScroll from "@/components/AnimateOnScroll";
import CategoryGlyph from "@/components/CategoryGlyph";
import { CATEGORIES, EVENT, RULEBOOK_PDF_URL, type Category } from "@/lib/event-data";

function ScoringTable({ s }: { s: NonNullable<Category["scoring"]>[number] }) {
  return (
    <div className="nested-box overflow-hidden">
      <div className="px-[18px] py-[12px] border-b border-accent-primary/25">
        <span className="text-[11px] tracking-[0.12em] uppercase font-medium text-lavender-phosphor">Sistem Poin {s.title}</span>
      </div>
      <table className="w-full text-left text-[14px]">
        <tbody>
          {s.rows.map((r) => (
            <tr key={r.condition} className="border-t border-accent-primary/15 first:border-t-0">
              <td className="px-[18px] py-[10px] text-liquid-mist">{r.condition}</td>
              <td
                className={`px-[18px] py-[10px] text-right font-medium tabular-nums w-[70px] ${
                  r.points.startsWith("−") ? "text-red-300" : "text-platinum"
                }`}
              >
                {r.points}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="px-[18px] py-[10px] border-t border-accent-primary/25 text-[13px] text-silver-mist">{s.note}</p>
    </div>
  );
}

export default function KategoriPage() {
  const [activeTab, setActiveTab] = useState<string>("all");
  const displayedCategories = activeTab === "all" ? CATEGORIES : CATEGORIES.filter((c) => c.id === activeTab);

  return (
    <>
      <Navbar />
      <main className="pt-[110px] pb-[80px] min-h-screen">
        <section className="py-[36px] relative">
          <div className="page-container flex flex-col items-center text-center gap-[16px]">
            <span className="section-label hero-animate">KOMPETISI DATA SCIENCE</span>
            <h1 className="hero-animate-d1 text-[clamp(2.5rem,5.5vw,4.5rem)] leading-none text-platinum">Kategori Lomba</h1>
            <p className="hero-animate-d2 text-silver-mist text-[17px] max-w-[660px] leading-[1.45]">
              Tiga cabang untuk siswa SMA/MA/SMK/sederajat. Penyisihan online 17–26 November 2026, final
              offline 7 Desember 2026. Setiap peserta hanya boleh mengikuti 1 cabang.
            </p>

            <div className="no-scrollbar w-[calc(100%+40px)] sm:w-auto -mx-[20px] sm:mx-0 px-[20px] sm:px-0 flex flex-nowrap sm:flex-wrap items-center justify-start sm:justify-center gap-[8px] sm:gap-[10px] mt-[16px] overflow-x-auto">
              <button
                onClick={() => setActiveTab("all")}
                className={`filter-pill flex-shrink-0 whitespace-nowrap ${activeTab === "all" ? "active" : ""}`}
              >
                Semua (3)
              </button>
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveTab(cat.id)}
                  className={`filter-pill flex-shrink-0 whitespace-nowrap ${activeTab === cat.id ? "active" : ""}`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>
        </section>

        <section className="py-[24px]">
          <div className="page-container flex flex-col gap-[48px]">
            {displayedCategories.map((cat) => (
              <div
                key={cat.id}
                id={cat.id}
                className="surface-card flex flex-col gap-[32px] p-[24px] sm:p-[32px] md:p-[48px] relative overflow-hidden scroll-mt-[100px]"
              >
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-[24px] pb-[28px] border-b border-liquid-tide">
                  <div className="flex flex-col gap-[10px]">
                    <div className="flex flex-wrap items-center gap-[12px]">
                      <span className="text-[12px] tracking-[0.16em] uppercase font-medium text-lavender-phosphor bg-liquid-tide px-[10px] py-[3px] rounded-[var(--radius-small)] border border-accent-primary/40">
                        Kategori {cat.number}
                      </span>
                      <span className="text-[12px] text-silver-mist tracking-[0.08em] uppercase font-medium">
                        Penyisihan Online · Final Offline
                      </span>
                    </div>
                    <h2 className="text-platinum text-[clamp(1.75rem,3.5vw,2.8rem)] leading-[1.05]">{cat.name}</h2>
                    <p className="text-liquid-mist text-[15px] font-medium">
                      Tema: <span className="italic">&ldquo;{cat.theme}&rdquo;</span>
                    </p>
                  </div>

                  <div className="flex flex-col items-stretch md:items-end gap-[16px] flex-shrink-0">
                    <div className="hidden md:flex w-[180px] rounded-[var(--radius-small)] bg-liquid-tide/70 border border-accent-primary/25 px-[14px] py-[10px] justify-center">
                      <CategoryGlyph id={cat.id} />
                    </div>
                    <Link
                      href={`/daftar?form=lomba&kategori=${cat.id}`}
                      className="gradient-pill-btn text-center text-[13px] px-[26px] py-[13px]"
                    >
                      Daftar Kategori Ini
                    </Link>
                  </div>
                </div>

                {/* Info cepat */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-[14px] bg-liquid-tide p-[18px] sm:p-[20px] rounded-[var(--radius-cards)] border border-accent-primary/30">
                  {[
                    { label: "Peserta", value: `${cat.teamLabel} · ${cat.grades}` },
                    { label: "Kuota", value: cat.quota },
                    { label: "Finalis", value: cat.finalists },
                    { label: "Biaya", value: "Rp75.000 (Early Bid) / Rp100.000 (Normal Bid)" },
                  ].map((f) => (
                    <div key={f.label} className="flex flex-col gap-[4px]">
                      <span className="section-label text-[12px]">{f.label}</span>
                      <span className="text-platinum font-medium text-[14px] sm:text-[15px] leading-[1.35]">{f.value}</span>
                    </div>
                  ))}
                </div>

                {/* Deskripsi */}
                <div className="flex flex-col gap-[12px]">
                  <span className="section-label">DESKRIPSI LOMBA</span>
                  <p className="text-liquid-mist text-[16px] leading-[1.55]">{cat.description}</p>
                  {cat.scope && (
                    <div className="flex flex-col gap-[10px] mt-[4px]">
                      <span className="text-[13px] text-silver-mist">{cat.scope.title}</span>
                      <div className="flex flex-wrap gap-[8px]">
                        {cat.scope.items.map((s) => (
                          <span
                            key={s}
                            className="text-[12px] text-liquid-mist bg-liquid-tide border border-accent-primary/40 rounded-[var(--radius-small)] px-[10px] py-[4px]"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  <p className="text-[14px] text-silver-mist">
                    <span className="text-platinum">Tools:</span> {cat.tools}
                  </p>
                </div>

                {/* Mekanisme */}
                <div className="flex flex-col gap-[16px]">
                  <span className="section-label">MEKANISME &amp; TAHAPAN</span>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-[16px]">
                    {cat.mechanism.map((step, idx) => (
                      <div key={step.stage} className="nested-box p-[20px] flex flex-col gap-[8px]">
                        <span className="text-[11px] tracking-[0.12em] font-medium text-lavender-phosphor uppercase">
                          Tahap {idx + 1} · {step.stage}
                        </span>
                        <p className="text-liquid-mist text-[14px] leading-[1.45]">{step.text}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Output */}
                <div className="flex flex-col gap-[12px]">
                  <span className="section-label">YANG DIKUMPULKAN</span>
                  <ul className="flex flex-col gap-[8px] text-liquid-mist text-[15px] leading-[1.45] list-disc pl-[20px] marker:text-lavender-phosphor">
                    {cat.output.map((o) => (
                      <li key={o}>{o}</li>
                    ))}
                  </ul>
                  <p className="text-[14px] text-silver-mist">
                    <span className="text-platinum">Pengumpulan:</span> {cat.submission}
                  </p>
                </div>

                {/* Sistem poin (Data Quiz Battle) */}
                {cat.scoring && (
                  <div className="flex flex-col gap-[16px]">
                    <span className="section-label">SISTEM PENILAIAN</span>
                    <AnimateOnScroll animation="fade-up">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-[16px] items-start">
                        {cat.scoring.map((s) => (
                          <ScoringTable key={s.title} s={s} />
                        ))}
                      </div>
                    </AnimateOnScroll>
                  </div>
                )}

                {/* Hadiah */}
                <div className="flex flex-col gap-[14px] bg-liquid-tide p-[20px] sm:p-[24px] rounded-[var(--radius-cards)] border border-accent-primary/30">
                  <span className="section-label text-lavender-phosphor">HADIAH &amp; PENGHARGAAN</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-[14px]">
                    {cat.awards.map((a) => (
                      <div key={a.award} className="flex flex-col gap-[4px]">
                        <span className="text-platinum font-medium text-[15px]">{a.award}</span>
                        <span className="text-liquid-mist text-[14px] leading-[1.45]">{a.prize}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-[16px] pt-[8px]">
                  <a
                    href={RULEBOOK_PDF_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ghost-nav-link text-[12px] text-silver-mist hover:text-platinum py-[6px]"
                  >
                    Baca aturan lengkap di Rulebook (PDF) ↗
                  </a>
                  <Link href={`/daftar?form=lomba&kategori=${cat.id}`} className="gradient-pill-btn text-[13px] px-[24px] py-[11px]">
                    Daftar {cat.name}
                  </Link>
                </div>
              </div>
            ))}
            <p className="text-center text-[13px] text-silver-mist">
              Biaya: {EVENT.registrationFee} — per tim (DataViz &amp; YDR) atau per peserta (Data Quiz Battle).
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
