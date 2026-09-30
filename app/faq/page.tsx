"use client";

import { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AnimateOnScroll from "@/components/AnimateOnScroll";

const faqs = [
  {
    category: "umum",
    question: "Apa itu DATASPHERE 2026?",
    answer:
      "DATASPHERE 2026 adalah kompetisi data science tingkat nasional yang ditujukan khusus bagi siswa SMA/SMK/MA sederajat. Acara ini diselenggarakan sebagai bagian dari Capstone Project mahasiswa S1 Sains Data Institut Informatika dan Bisnis (IIB) Darmajaya untuk menginspirasi generasi muda dalam mengeksplorasi potensi sains data.",
  },
  {
    category: "umum",
    question: "Siapa saja yang berhak menjadi peserta?",
    answer:
      "Seluruh siswa aktif SMA/SMK/MA negeri maupun swasta di seluruh Indonesia yang dibuktikan dengan Kartu Tanda Pelajar atau Surat Keterangan Siswa Aktif dari sekolah yang bersangkutan.",
  },
  {
    category: "pendaftaran",
    question: "Berapa biaya pendaftaran untuk mengikuti lomba?",
    answer:
      "Pendaftaran DATASPHERE 2026 adalah 100% GRATIS (Free of Charge). Seluruh peserta tidak dipungut biaya apapun selama masa kompetisi.",
  },
  {
    category: "pendaftaran",
    question: "Berapa jumlah anggota dalam satu tim?",
    answer:
      "Untuk kategori DataViz Challenge dan Young Data Researcher, tim dapat beranggotakan 1 hingga 3 siswa. Untuk Data Quiz Battle, tim terdiri dari 2 hingga 3 siswa. Anggota tim wajib berasal dari sekolah yang sama.",
  },
  {
    category: "pendaftaran",
    question: "Bolehkah satu sekolah mengirimkan lebih dari satu tim?",
    answer:
      "Ya, setiap sekolah diperbolehkan mengirimkan lebih dari satu tim, baik pada kategori lomba yang sama maupun kategori lomba yang berbeda.",
  },
  {
    category: "teknis",
    question: "Apakah perlombaan dilaksanakan secara online atau offline?",
    answer:
      "Kompetisi diselenggarakan secara HYBRID. Babak penyisihan untuk seluruh kategori dilakukan secara ONLINE. Tim yang berhasil lolos sebagai finalis (Top Finalists) akan diundang untuk menghadiri babak Grand Final dan pameran Capstone Expo secara OFFLINE di Kampus IIB Darmajaya, Bandar Lampung.",
  },
  {
    category: "teknis",
    question: "Tools atau software apa saja yang boleh digunakan dalam DataViz Challenge?",
    answer:
      "Peserta bebas menggunakan berbagai platform visualisasi data modern seperti Looker Studio, Tableau Public, Microsoft Power BI, Microsoft Excel, Google Sheets, ataupun library pemrograman berbasis Python (Streamlit/Dash) / R (Shiny).",
  },
  {
    category: "teknis",
    question: "Bagaimana jika peserta belum memiliki pengalaman coding / pemrograman?",
    answer:
      "Sangat tidak masalah! Dua kategori lomba (DataViz Challenge dan Data Quiz Battle) dirancang ramah bagi pemula tanpa keharusan menguasai bahasa pemrograman seperti Python/R. Kamu dapat memanfaatkan spreadsheet (Excel/Google Sheets) dan visual drag-and-drop tools seperti Looker Studio.",
  },
  {
    category: "hadiah",
    question: "Apakah seluruh peserta akan mendapatkan sertifikat?",
    answer:
      "Ya, seluruh peserta yang mengumpulkan karya lengkap pada babak penyisihan akan mendapatkan E-Sertifikat Tingkat Nasional resmi dari Institut Informatika dan Bisnis (IIB) Darmajaya. Pemenang dan finalis akan mendapatkan Piagam Penghargaan Cetak dan Trophy.",
  },
  {
    category: "hadiah",
    question: "Apa saja benefit bagi pemenang selain uang tunai?",
    answer:
      "Selain uang tunai pembinaan dan piala rektor, para juara akan memperoleh Golden Ticket Beasiswa Kuliah di Program Studi S1 Sains Data IIB Darmajaya serta relasi mentoring langsung bersama dosen dan praktisi data profesional.",
  },
];

export default function FAQPage() {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const filteredFaqs =
    activeCategory === "all"
      ? faqs
      : faqs.filter((f) => f.category === activeCategory);

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <>
      <Navbar />
      <main className="pt-[110px] pb-[80px] min-h-screen">
        {/* Header Section */}
        <section className="py-[32px]">
          <div className="page-container flex flex-col items-center text-center gap-[14px]">
            <span className="section-label hero-animate">PUSAT INFORMASI</span>
            <h1 className="hero-animate-d1 text-[clamp(2.5rem,5.5vw,4.5rem)] leading-none text-platinum">
              Frequently Asked Questions
            </h1>
            <p className="hero-animate-d2 text-silver-mist text-[16px] max-w-[620px] leading-[1.45]">
              Temukan jawaban seputar syarat kepesertaan, teknis kompetisi,
              dan pelaksanaan acara DATASPHERE 2026.
            </p>

            {/* Category Filter Tabs */}
            <div className="flex flex-wrap items-center justify-center gap-[8px] mt-[16px]">
              {[
                { id: "all", label: "Semua Pertanyaan" },
                { id: "umum", label: "Umum & Syarat" },
                { id: "pendaftaran", label: "Pendaftaran" },
                { id: "teknis", label: "Teknis & Format" },
                { id: "hadiah", label: "Hadiah & Sertifikat" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveCategory(tab.id);
                    setOpenIndex(null);
                  }}
                  className={`filter-pill ${
                    activeCategory === tab.id ? "active" : ""
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Accordion Section */}
        <section className="py-[24px]">
          <div className="page-container max-w-[800px] flex flex-col gap-[14px]">
            {filteredFaqs.map((faq, idx) => {
              const isOpen = openIndex === idx;
              return (
                <div
                  key={idx}
                  className="surface-card p-0 transition-all duration-200 overflow-hidden"
                >
                  <button
                    onClick={() => toggleAccordion(idx)}
                    className="w-full text-left p-[22px] md:p-[26px] flex items-center justify-between gap-[16px] cursor-pointer bg-transparent border-none text-platinum font-medium text-[17px] leading-[1.35] transition-colors hover:text-lavender-phosphor"
                  >
                    <span>{faq.question}</span>
                    <span
                      className={`w-[28px] h-[28px] rounded-full bg-liquid-tide flex items-center justify-center text-accent-secondary text-[18px] flex-shrink-0 transition-all duration-300 border border-accent-primary/40 ${
                        isOpen ? "rotate-45 text-lavender-phosphor border-accent-secondary" : ""
                      }`}
                    >
                      +
                    </span>
                  </button>

                  {isOpen && (
                    <div className="px-[22px] md:px-[26px] py-[20px] text-silver-mist text-[15px] leading-[1.55] border-t border-accent-primary/25 bg-liquid-tide/50">
                      <p>{faq.answer}</p>
                    </div>
                  )}
                </div>
              );
            })}

            {/* Helpdesk Contact Card */}
            <div className="recessed-card flex flex-col sm:flex-row items-center justify-between gap-[20px] p-[28px] md:p-[36px] mt-[32px]">
              <div className="flex flex-col gap-[4px] text-center sm:text-left">
                <span className="section-label text-lavender-phosphor text-[11px]">BANTUAN LEBIH LANJUT</span>
                <h3 className="text-platinum text-[20px]">Masih Memiliki Pertanyaan Lain?</h3>
                <p className="text-silver-mist text-[14px]">Tim panitia siap menjawab melalui WhatsApp resmi.</p>
              </div>
              <Link
                href="/kontak"
                className="gradient-pill-btn text-[13px] px-[26px] py-[13px] flex-shrink-0"
              >
                Hubungi Panitia
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
