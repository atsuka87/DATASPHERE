"use client";

import { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AnimateOnScroll from "@/components/AnimateOnScroll";

const categoriesDetail = [
  {
    id: "dataviz",
    number: "01",
    name: "DataViz Challenge",
    tagline: "Transform Raw Data into Stunning, Actionable Insights",
    format: "Online Submission & Final Live Pitch",
    teamSize: "1 – 3 Siswa per Tim",
    target: "Siswa SMA / SMK / MA Sederajat",
    description:
      "DataViz Challenge menantang peserta untuk mengolah dataset publik riil menjadi dashboard visual interaktif yang tidak hanya estetis, tetapi juga mampu menceritakan kisah data (data storytelling) yang tajam, akurat, dan dapat membantu pengambilan keputusan strategis.",
    mechanism: [
      "Panitia merilis dataset resmi bertema pembangunan berkelanjutan, ekonomi daerah, atau pendidikan pada tanggal rilis.",
      "Peserta membuat dashboard visual interaktif dan menyusun laporan ringkas (Executive Summary maks 3 halaman).",
      "Top 10 tim terpilih lolos ke Babak Final untuk mempresentasikan hasil karya di hadapan dewan juri ahli pada Capstone Expo.",
    ],
    tools: [
      { name: "Looker Studio", desc: "Google Cloud Ecosystem" },
      { name: "Tableau Public", desc: "Advanced Analytics & Viz" },
      { name: "Power BI", desc: "Microsoft Data Platform" },
      { name: "Excel / Google Sheets", desc: "Spreadsheet Analytics" },
      { name: "Python / R (Opsional)", desc: "Streamlit / Dash / Shiny" },
    ],
    rubric: [
      { aspect: "Ketepatan & Integritas Data", weight: "25%", desc: "Akurasi kalkulasi, data cleaning, dan ketiadaan misleading chart" },
      { aspect: "Kreativitas & Desain Visual", weight: "25%", desc: "Prinsip desain UX/UI, hierarki warna, dan kemudahan navigasi" },
      { aspect: "Insight & Temuan Kunci", weight: "25%", desc: "Kedalaman analisis data dan temuan yang bernilai praktis" },
      { aspect: "Storytelling & Presentasi", weight: "25%", desc: "Alur penyampaian cerita data dan artikulasi gagasan tim" },
    ],
    prizes: [
      { rank: "Juara 1", reward: "Rp 3.500.000 + Trophy Rektor + Golden Ticket Beasiswa + Piagam Nasional" },
      { rank: "Juara 2", reward: "Rp 2.500.000 + Trophy + Piagam Penghargaan Nasional" },
      { rank: "Juara 3", reward: "Rp 1.500.000 + Trophy + Piagam Penghargaan Nasional" },
      { rank: "Best Visual Storyteller", reward: "Rp 500.000 + Plakat Khusus" },
    ],
  },
  {
    id: "quiz",
    number: "02",
    name: "Data Quiz Battle",
    tagline: "Speed, Accuracy, and Mastery in Data Literacy",
    format: "Penyisihan Online + Semifinal & Final Live Battle",
    teamSize: "2 – 3 Siswa per Tim",
    target: "Siswa SMA / SMK / MA Sederajat",
    description:
      "Ajang cerdas cermat data science tercepat dan paling kompetitif. Menguji kecepatan berpikir, pemahaman statistika inferensial dasar, literasi grafik, fungsi spreadsheet logika, serta konsep dasar Artificial Intelligence dan Machine Learning.",
    mechanism: [
      "Babak Penyisihan: Ujian online berbasis waktu terpusat (CBT platform) dengan sistem eliminasi skor otomatis.",
      "Babak Semifinal: Quick-fire round analisis soal studi kasus data secara live streaming.",
      "Grand Final: Adu cepat bel cerdas cermat di panggung pameran Capstone Expo IIB Darmajaya.",
    ],
    tools: [
      { name: "Online Quiz Platform", desc: "Platform Ujian Terpusat" },
      { name: "Spreadsheet Tool", desc: "Excel / Google Sheets untuk kalkulasi cepat" },
      { name: "Scientific Calculator", desc: "Alat hitung statistika standar" },
    ],
    rubric: [
      { aspect: "Literasi & Interpretasi Data", weight: "30%", desc: "Kecepatan membaca chart kompleks, pivot table, dan tren data" },
      { aspect: "Statistika Dasar & Probabilitas", weight: "25%", desc: "Mean, median, modus, distribusi, korelasi, dan sampling" },
      { aspect: "Formula & Spreadsheet Logic", weight: "25%", desc: "VLOOKUP, INDEX-MATCH, IF-nested, agregasi, dan sorting" },
      { aspect: "Konsep Dasar AI & Data Science", weight: "20%", desc: "Supervised/unsupervised learning, etika data, dan tren AI modern" },
    ],
    prizes: [
      { rank: "Juara 1", reward: "Rp 3.000.000 + Trophy Bergilir + Golden Ticket Beasiswa + Piagam Nasional" },
      { rank: "Juara 2", reward: "Rp 2.000.000 + Trophy + Piagam Penghargaan Nasional" },
      { rank: "Juara 3", reward: "Rp 1.000.000 + Trophy + Piagam Penghargaan Nasional" },
      { rank: "MVP Data Battle", reward: "Rp 500.000 + Medali Kehormatan" },
    ],
  },
  {
    id: "research",
    number: "03",
    name: "Young Data Researcher",
    tagline: "Scientific Inquiry Driven by Rigorous Empirical Evidence",
    format: "Paper Submission & Oral Defense Poster Session",
    teamSize: "1 – 3 Siswa per Tim (Didampingi 1 Guru)",
    target: "Siswa SMA / SMK / MA Sederajat",
    description:
      "Kompetisi karya ilmiah berbasis data untuk melatih metodologi riset saintifik sejak dini. Peserta merumuskan masalah nyata di masyarakat/lingkungan sekitar, mengumpulkan data primer atau sekunder, menganalisis dengan metodologi kuantitatif, dan merumuskan solusi berbasis bukti.",
    mechanism: [
      "Penyusunan dan submisi Full Paper (format 8-12 halaman sesuai template resmi DATASPHERE).",
      "Proses Blind Peer-Review oleh Dosen & Peneliti S1 Sains Data IIB Darmajaya.",
      "Top 8 Finalis memamerkan Poster Riset dan mempresentasikan karyanya dalam Oral Defense di Capstone Expo.",
    ],
    tools: [
      { name: "Python / Google Colab", desc: "Data Processing & Modeling" },
      { name: "R & RStudio", desc: "Statistical Analysis" },
      { name: "SPSS / Jamovi", desc: "Inferential Statistics" },
      { name: "Spreadsheet Analytics", desc: "Data Cleansing" },
      { name: "LaTeX / Google Docs", desc: "Scientific Writing" },
    ],
    rubric: [
      { aspect: "Urgensi Masalah & Kebaruan", weight: "20%", desc: "Ketajaman rumusan masalah dan relevansi sosial-teknologi" },
      { aspect: "Metodologi & Pengolahan Data", weight: "30%", desc: "Ketepatan pemilihan metode, validitas data, dan teknik analisis" },
      { aspect: "Analisis Hasil & Pembahasan", weight: "30%", desc: "Kedalaman interpretasi temuan ilmiah dan objektivitas argumen" },
      { aspect: "Presentasi & Sesi Tanya Jawab", weight: "20%", desc: "Penguasaan materi riset dan kemampuan menjawab pertanyaan juri" },
    ],
    prizes: [
      { rank: "Juara 1", reward: "Rp 4.000.000 + Trophy Rektor + Golden Ticket Beasiswa + Publikasi Prosiding Nasional" },
      { rank: "Juara 2", reward: "Rp 2.500.000 + Trophy + Piagam Penghargaan Nasional" },
      { rank: "Juara 3", reward: "Rp 1.500.000 + Trophy + Piagam Penghargaan Nasional" },
      { rank: "Best Poster & Methodology", reward: "Rp 750.000 + Piagam Penghargaan" },
    ],
  },
];

export default function KategoriPage() {
  const [activeTab, setActiveTab] = useState<string>("all");

  const displayedCategories =
    activeTab === "all"
      ? categoriesDetail
      : categoriesDetail.filter((c) => c.id === activeTab);

  return (
    <>
      <Navbar />
      <main className="pt-[110px] pb-[80px] min-h-screen">
        {/* Page Header */}
        <section className="py-[36px] relative">
          <div className="page-container flex flex-col items-center text-center gap-[16px]">
            <span className="section-label hero-animate">KOMPETISI DATA SCIENCE</span>
            <h1 className="hero-animate-d1 text-[clamp(2.5rem,5.5vw,4.5rem)] leading-none text-platinum">
              Kategori Lomba
            </h1>
            <p className="hero-animate-d2 text-silver-mist text-[17px] max-w-[660px] leading-[1.45]">
              Pilih tantangan yang sesuai dengan minat dan keahlian timmu.
              Dari visualisasi data interaktif, kuis adu cepat, hingga karya
              ilmiah berbasis bukti empiris.
            </p>

            {/* Filter Tabs */}
            <div className="flex flex-wrap items-center justify-center gap-[10px] mt-[16px]">
              <button
                onClick={() => setActiveTab("all")}
                className={`filter-pill ${
                  activeTab === "all" ? "active" : ""
                }`}
              >
                Semua Kategori (3)
              </button>
              {categoriesDetail.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveTab(cat.id)}
                  className={`filter-pill ${
                    activeTab === cat.id ? "active" : ""
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Categories Detailed Sections */}
        <section className="py-[24px]">
          <div className="page-container flex flex-col gap-[48px]">
            {displayedCategories.map((cat) => (
              <div
                key={cat.id}
                id={cat.id}
                className="surface-card flex flex-col gap-[36px] p-[32px] md:p-[48px] relative overflow-hidden"
              >
                {/* Category Header */}
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-[24px] pb-[28px] border-b border-liquid-tide">
                  <div className="flex flex-col gap-[10px]">
                    <div className="flex items-center gap-[12px]">
                      <span className="text-[12px] tracking-[0.16em] uppercase font-semibold text-lavender-phosphor bg-liquid-tide px-[10px] py-[3px] rounded-[var(--radius-small)] border border-accent-primary/40">
                        Kategori {cat.number}
                      </span>
                      <span className="text-[12px] text-silver-mist tracking-[0.08em] uppercase font-medium">
                        {cat.format}
                      </span>
                    </div>
                    <h2 className="text-platinum text-[clamp(1.75rem,3.5vw,2.8rem)] leading-[1.05]">
                      {cat.name}
                    </h2>
                    <p className="text-liquid-mist text-[15px] font-medium italic">
                      "{cat.tagline}"
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-[12px] flex-shrink-0">
                    <Link
                      href={`/daftar?kategori=${cat.id}`}
                      className="gradient-pill-btn text-center text-[13px] px-[26px] py-[13px]"
                    >
                      Daftar Kategori Ini
                    </Link>
                  </div>
                </div>

                {/* Quick Info Badges */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-[16px] bg-liquid-tide p-[20px] rounded-[var(--radius-cards)] border border-accent-primary/30">
                  <div className="flex flex-col gap-[4px]">
                    <span className="section-label text-[10px]">Ukuran Tim</span>
                    <span className="text-platinum font-medium text-[15px]">{cat.teamSize}</span>
                  </div>
                  <div className="flex flex-col gap-[4px]">
                    <span className="section-label text-[10px]">Sasaran Peserta</span>
                    <span className="text-platinum font-medium text-[15px]">{cat.target}</span>
                  </div>
                  <div className="flex flex-col gap-[4px]">
                    <span className="section-label text-[10px]">Biaya Pendaftaran</span>
                    <span className="text-liquid-mist font-medium text-[15px]">Gratis (Free of Charge)</span>
                  </div>
                </div>

                {/* Overview Description */}
                <div className="flex flex-col gap-[12px]">
                  <span className="section-label">DESKRIPSI LOMBA</span>
                  <p className="text-liquid-mist text-[16px] leading-[1.5]">
                    {cat.description}
                  </p>
                </div>

                {/* Mechanism & Stages */}
                <div className="flex flex-col gap-[16px]">
                  <span className="section-label">MEKANISME &amp; TAHAPAN</span>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-[16px]">
                    {cat.mechanism.map((step, idx) => (
                      <div
                        key={idx}
                        className="bg-liquid-tide p-[20px] rounded-[var(--radius-small)] border border-accent-primary/30 flex flex-col gap-[8px]"
                      >
                        <span className="text-[11px] tracking-[0.12em] font-semibold text-lavender-phosphor">
                          TAHAP {idx + 1}
                        </span>
                        <p className="text-liquid-mist text-[14px] leading-[1.45]">
                          {step}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Tools & Environment */}
                <div className="flex flex-col gap-[16px]">
                  <span className="section-label">SOFTWARE &amp; TOOLS YANG DIPERBOLEHKAN</span>
                  <div className="flex flex-wrap gap-[10px]">
                    {cat.tools.map((tool) => (
                      <div
                        key={tool.name}
                        className="bg-liquid-tide border border-accent-primary/30 px-[14px] py-[8px] rounded-[var(--radius-small)] flex flex-col"
                      >
                        <span className="text-platinum font-medium text-[13px]">{tool.name}</span>
                        <span className="text-silver-mist text-[11px]">{tool.desc}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Rubrik Penilaian */}
                <div className="flex flex-col gap-[16px]">
                  <span className="section-label">KRITERIA PENILAIAN</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[16px]">
                    {cat.rubric.map((r) => (
                      <div
                        key={r.aspect}
                        className="bg-liquid-tide p-[18px] rounded-[var(--radius-small)] border border-accent-primary/30 flex flex-col gap-[6px]"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-platinum font-medium text-[14px]">{r.aspect}</span>
                          <span className="text-[13px] font-bold text-silver-mist bg-liquid-kelp px-[8px] py-[2px] rounded border border-accent-primary/50">
                            {r.weight}
                          </span>
                        </div>
                        <p className="text-liquid-mist text-[12px] leading-[1.4]">
                          {r.desc}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Prizes */}
                <div className="flex flex-col gap-[16px] bg-liquid-tide p-[24px] rounded-[var(--radius-cards)] border border-accent-primary/30">
                  <div className="flex items-center justify-between">
                    <span className="section-label text-lavender-phosphor">PENGHARGAAN &amp; BENEFIT</span>
                    <span className="text-[12px] text-lavender-phosphor font-medium tracking-[0.06em]">
                      Total Hadiah Jutaan Rupiah
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[14px]">
                    {cat.prizes.map((p) => (
                      <div key={p.rank} className="flex flex-col gap-[4px]">
                        <span className="text-platinum font-semibold text-[14px]">{p.rank}</span>
                        <span className="text-liquid-mist text-[12px] leading-[1.4]">{p.reward}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bottom Card Action */}
                <div className="flex items-center justify-between pt-[16px]">
                  <Link
                    href="/faq"
                    className="ghost-nav-link text-[12px] text-silver-mist hover:text-platinum"
                  >
                    Ada pertanyaan tentang kategori ini? Buka FAQ →
                  </Link>
                  <Link
                    href={`/daftar?kategori=${cat.id}`}
                    className="gradient-pill-btn text-[13px] px-[24px] py-[11px]"
                  >
                    Daftar {cat.name}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
