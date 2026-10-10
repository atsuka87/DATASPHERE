"use client";

import { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { CP_ADMIN, CP_LOMBA, PAYMENT } from "@/lib/event-data";

// Disusun dari Rulebook DATASPHERE 2026 — fokus pertanyaan calon peserta
const faqs: { question: string; answer: React.ReactNode }[] = [
  {
    question: "Siapa yang boleh ikut lomba DATASPHERE 2026?",
    answer:
      "Siswa aktif SMA/MA/SMK/sederajat yang mewakili sekolahnya. DataViz Challenge dan Data Quiz Battle terbuka untuk kelas X–XII, sedangkan Young Data Researcher untuk kelas XI–XII. Tidak ada batasan jumlah tim dari satu sekolah selama kuota masih tersedia.",
  },
  {
    question: "Berapa anggota per tim? Boleh ikut lebih dari satu cabang?",
    answer:
      "DataViz Challenge dan Young Data Researcher: tim 1–3 orang dari sekolah yang sama — ketua tim mendaftar lalu menambahkan anggota lewat tombol “Tambah Anggota” di formulir. Data Quiz Battle: individu. Setiap peserta hanya boleh mengikuti 1 cabang dan tidak boleh merangkap anggota tim lain.",
  },
  {
    question: "Berapa biaya pendaftaran dan bagaimana cara membayar?",
    answer: (
      <>
        Early Bid (12–25 Oktober 2026) Rp75.000, Normal Bid (26 Oktober–12 November 2026) Rp100.000 —
        per tim untuk DataViz &amp; YDR, per peserta untuk Data Quiz Battle. Transfer ke {PAYMENT.bank}{" "}
        {PAYMENT.account} a.n. {PAYMENT.holder} paling lambat 3 hari setelah mendaftar, lalu kirim bukti ke
        Administrasi ({CP_ADMIN.phone}). Pendaftaran yang belum dibayar setelah 3 hari dinyatakan batal.
      </>
    ),
  },
  {
    question: "Berkas apa saja yang harus dikumpulkan?",
    answer:
      "Paling lambat 12 November 2026 pukul 23.59 WIB: Kartu Pelajar setiap anggota, bukti pengisian formulir pendaftaran, bukti pembayaran, dan screenshot unggahan twibbon (akun publik). Setiap tim/peserta juga wajib mencantumkan contact person guru pendamping.",
  },
  {
    question: "Apakah lomba online atau offline?",
    answer:
      "Penyisihan online (17–26 November 2026; Data Quiz Battle pada 17 November). Final offline pada 7 Desember 2026 di Kampus IIB Darmajaya, Jl. Z.A. Pagar Alam No. 93, Bandar Lampung. Peserta juga wajib mengikuti Seminar & Workshop (12 November, minimal 1 perwakilan per tim) serta simulasi lomba.",
  },
  {
    question: "Bolehkah memakai AI?",
    answer:
      "DataViz & YDR: boleh sebagai alat bantu (brainstorming, rumus/syntax, tata bahasa) dengan melampirkan Pernyataan Penggunaan AI; dilarang menyerahkan analisis/kesimpulan yang sebagian besar dibuat AI atau membuat data/sitasi fiktif. Data Quiz Battle: dilarang memakai AI, mesin pencari, atau bantuan orang lain — sistem kuis dilengkapi anti-cheating.",
  },
  {
    question: "Bagaimana jika terlambat submit atau mengalami kendala teknis?",
    answer: (
      <>
        Karya yang masuk setelah batas waktu tidak dinilai. Kendala koneksi/perangkat menjadi tanggung jawab
        peserta, jadi siapkan cadangan dan kumpulkan paling lambat 3 jam sebelum batas. Jika ada kendala,
        segera lapor ke CP Lomba ({CP_LOMBA.name}, {CP_LOMBA.phone}) dengan bukti screenshot. Karya boleh
        diunggah ulang sebelum batas waktu — yang dinilai versi terakhir.
      </>
    ),
  },
  {
    question: "Apakah biaya pendaftaran bisa dikembalikan?",
    answer:
      "Refund 100% hanya jika lomba/cabang dibatalkan panitia, kuota sudah penuh saat kamu membayar, terjadi pembayaran ganda/kelebihan transfer (dikembalikan selisihnya), atau pendaftaran ditolak karena kesalahan panitia. Tidak ada refund untuk pengunduran diri, gagal verifikasi berkas, atau diskualifikasi. Ajukan ke Administrasi paling lambat 7 hari setelah kejadian.",
  },
  {
    question: "Bagaimana jika tidak setuju dengan hasil penilaian?",
    answer:
      "Keputusan juri bersifat mutlak. Keberatan hanya untuk kesalahan teknis-administratif (mis. salah jumlah atau salah input nilai), diajukan ke CP Lomba maksimal 1×24 jam setelah pengumuman, disertai bukti. Panitia menjawab tertulis paling lambat 2×24 jam. Pengajuan tidak dikenai biaya.",
  },
  {
    question: "Apa hadiahnya?",
    answer:
      "Juara 1, 2, dan 3 tiap cabang: uang tunai, piala, medali, merchandise, dan sertifikat. Harapan (dan Favorit 1 untuk DataViz): medali, merchandise, dan sertifikat. Pemenang wajib hadir di Awarding pada 10 Desember 2026 atau diwakilkan pendamping dengan surat keterangan.",
  },
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const filteredFaqs = faqs;

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
              Pertanyaan Umum
            </h1>
            <p className="hero-animate-d2 text-silver-mist text-[16px] max-w-[620px] leading-[1.45]">
              Jawaban singkat seputar syarat, biaya, berkas, dan aturan lomba
              DATASPHERE 2026. Aturan lengkap ada di Rulebook resmi.
            </p>

          </div>
        </section>

        {/* Accordion Section */}
        <section className="py-[24px]">
          <div className="page-container max-w-[800px] flex flex-col gap-[14px]">
            {filteredFaqs.map((faq, idx) => {
              const isOpen = openIndex === idx;
              return (
                <div
                  key={faq.question}
                  className="surface-card p-0 transition-all duration-200 overflow-hidden"
                >
                  <button
                    onClick={() => toggleAccordion(idx)}
                    aria-expanded={isOpen}
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
