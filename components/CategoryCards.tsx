"use client";

import Link from "next/link";
import AnimateOnScroll from "./AnimateOnScroll";
import { MouseEvent } from "react";

const categories = [
  {
    id: "dataviz",
    number: "01",
    title: "DataViz Challenge",
    description:
      "Buat dashboard visualisasi data dari dataset yang disediakan. Gunakan Excel, Google Sheets, Looker Studio, atau Power BI untuk menyajikan insight yang bermakna dengan desain yang memikat.",
    criteria: ["Ketepatan Data", "Visualisasi", "Insight", "Storytelling", "Desain"],
    href: "/kategori#dataviz",
  },
  {
    id: "quiz",
    number: "02",
    title: "Data Quiz Battle",
    description:
      "Cerdas cermat data science secara online. Uji pemahamanmu tentang literasi data, statistika dasar, interpretasi grafik, spreadsheet, dan konsep AI/ML dasar.",
    criteria: ["Literasi Data", "Statistika", "Grafik", "Spreadsheet", "AI/ML"],
    href: "/kategori#quiz",
  },
  {
    id: "research",
    number: "03",
    title: "Young Data Researcher",
    description:
      "Susun karya ilmiah berbasis data — dari identifikasi masalah, pengumpulan data, pemilihan metode, analisis, hingga temuan dan rekomendasi yang berdampak.",
    criteria: ["Masalah", "Data", "Metode", "Analisis", "Rekomendasi"],
    href: "/kategori#research",
  },
];

export default function CategoryCards() {
  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    e.currentTarget.style.setProperty("--mouse-x", `${x}px`);
    e.currentTarget.style.setProperty("--mouse-y", `${y}px`);
  };

  return (
    <section className="py-[var(--section-gap)] relative">
      {/* Ambient background glow */}
      <div
        className="absolute top-1/3 -right-[15%] w-[500px] h-[500px] rounded-full pointer-events-none opacity-20"
        style={{
          background: "radial-gradient(circle, rgba(0, 150, 199, 0.3) 0%, transparent 70%)",
        }}
        aria-hidden="true"
      />

      <div className="page-container flex flex-col gap-[36px] relative z-10">
        {/* Section Label */}
        <AnimateOnScroll animation="fade-up">
          <div className="flex flex-col gap-[16px] max-w-[600px]">
            <span className="section-label">KATEGORI LOMBA</span>
            <h2>Tiga Tantangan, Satu Panggung</h2>
          </div>
        </AnimateOnScroll>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[20px]">
          {categories.map((cat, index) => (
            <AnimateOnScroll
              key={cat.id}
              animation="scale-in"
              delay={index * 140}
            >
              <div
                onMouseMove={handleMouseMove}
                className="surface-card flex flex-col gap-[20px] h-full group transition-all duration-300 relative overflow-hidden"
              >
                {/* Interactive cursor spotlight effect */}
                <div
                  className="pointer-events-none absolute -inset-px opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{
                    background:
                      "radial-gradient(400px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(0, 150, 199, 0.25), transparent 70%)",
                  }}
                  aria-hidden="true"
                />

                {/* Card Top Row: Number & Arrow */}
                <div className="flex items-start justify-between gap-[16px] relative z-10">
                  <span className="text-[12px] tracking-[0.16em] font-medium text-silver-mist group-hover:text-platinum transition-colors duration-300">
                    {cat.number}
                  </span>
                  <Link
                    href={cat.href}
                    className="arrow-icon-btn"
                    aria-label={`Lihat detail ${cat.title}`}
                  >
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 14 14"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M3 11L11 3M11 3H5M11 3V9"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </Link>
                </div>

                {/* Title */}
                <h3 className="text-platinum text-[28px] leading-[1.1] relative z-10 transition-colors duration-300 group-hover:text-liquid-mist">
                  {cat.title}
                </h3>

                {/* Description */}
                <p className="text-liquid-mist text-[15px] leading-[1.45] relative z-10">
                  {cat.description}
                </p>

                {/* Criteria Tags */}
                <div className="flex flex-wrap gap-[8px] mt-auto pt-[16px] relative z-10">
                  {cat.criteria.map((tag) => (
                    <span
                      key={tag}
                      className="text-[10px] uppercase tracking-[0.14em] text-liquid-mist bg-liquid-tide border border-accent-primary/40 group-hover:border-accent-secondary/50 rounded-[var(--radius-small)] px-[10px] py-[4px] transition-all duration-200"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </AnimateOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
