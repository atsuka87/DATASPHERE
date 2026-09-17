"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AnimateOnScroll from "@/components/AnimateOnScroll";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const timelineStages = [
  {
    phase: "01",
    badge: "Fase Aktif",
    badgeColor: "text-teal-300 bg-teal-950/80 border-teal-500/40",
    title: "Pendaftaran Gelombang Terbuka",
    date: "1 September – 25 November 2026",
    location: "Online Portal",
    summary:
      "Registrasi online terbuka untuk seluruh siswa SMA/SMK/MA se-Indonesia melalui website resmi DATASPHERE 2026.",
    details: [
      "Pengisian formulir pendaftaran tim dan unggah data administrasi (Kartu Pelajar/Surat Keterangan Sekolah).",
      "Pemilihan 1 dari 3 kategori lomba yang diminati.",
      "Akses masuk ke grup WhatsApp resmi peserta untuk koordinasi berkala.",
    ],
  },
  {
    phase: "02",
    badge: "Mendatang",
    badgeColor: "text-silver-mist bg-liquid-deep border-liquid-kelp",
    title: "Technical Meeting & Workshop Data",
    date: "28 Maret 2026",
    location: "Zoom & YouTube Live Streaming",
    summary:
      "Pertemuan teknis bersama Dewan Juri dan panitia untuk membahas petunjuk teknis, rubrik penilaian, dan rilis ketentuan lomba.",
    details: [
      "Penjelasan mekanisme penjurian dan sesi tanya jawab interaktif.",
      "Workshop kilat: Tips visualisasi data efektif & dasar metodologi riset saintifik.",
      "Rilis tema studi kasus dan dataset latihan perdana.",
    ],
  },
  {
    phase: "03",
    badge: "Mendatang",
    badgeColor: "text-silver-mist bg-liquid-deep border-liquid-kelp",
    title: "Babak Penyisihan & Pengumpulan Karya",
    date: "1 – 15 April 2026",
    location: "Online Submission System",
    summary:
      "Pelaksanaan babak penyisihan untuk ketiga kategori lomba secara daring.",
    details: [
      "DataViz Challenge: Pengerjaan dashboard dan pengumpulan link dashboard publik + laporan ringkas.",
      "Data Quiz Battle: Pelaksanaan tes cerdas cermat online serentak berbasis waktu (CBT).",
      "Young Data Researcher: Pengumpulan Full Paper karya ilmiah dalam format PDF.",
    ],
  },
  {
    phase: "04",
    badge: "Mendatang",
    badgeColor: "text-silver-mist bg-liquid-deep border-liquid-kelp",
    title: "Pengumuman Finalis (Top 10 Tiap Kategori)",
    date: "22 April 2026",
    location: "Website & Instagram Resmi",
    summary:
      "Pengumuman tim-tim terbaik yang berhasil lolos penilaian blind review untuk maju ke babak Grand Final.",
    details: [
      "Surat Keputusan (SK) Finalis resmi dari Dewan Juri & Ketua Pelaksana.",
      "Undangan resmi dikirimkan ke pihak kepala sekolah masing-masing finalis.",
      "Briefing khusus persiapan presentasi final dan pameran poster.",
    ],
  },
  {
    phase: "05",
    badge: "Mendatang",
    badgeColor: "text-silver-mist bg-liquid-deep border-liquid-kelp",
    title: "Mentoring & Pembuatan Poster Expo",
    date: "25 – 30 April 2026",
    location: "Hybrid (Online Coaching)",
    summary:
      "Sesi bimbingan mentoring bersama dosen S1 Sains Data IIB Darmajaya untuk mematangkan materi presentasi dan visual poster booth.",
    details: [
      "Feedback konstruktif dari mentor akademisi terhadap dashboard/paper finalis.",
      "Finalisasi slide presentasi pitch deck & materi cetak pameran.",
    ],
  },
  {
    phase: "06",
    badge: "Puncak Acara",
    badgeColor: "text-lavender-phosphor bg-purple-950/70 border-pink-500/40",
    title: "Grand Final, Capstone Expo & Awarding",
    date: "8 – 9 Mei 2026",
    location: "Gedung Aula Utama IIB Darmajaya, Bandar Lampung",
    summary:
      "Puncak perhelatan DATASPHERE 2026 yang dirangkaikan dengan pameran karya data science mahasiswa dan siswa SMA/SMK.",
    details: [
      "Live Pitching & Oral Defense di hadapan dewan juri industri dan akademisi.",
      "Pameran Booth Capstone Expo yang dikunjungi oleh ratusan siswa, mahasiswa, dan praktisi teknologi.",
      "Awarding Night: Pengumuman Juara, penyerahan Trophy Rektor, dan pesta selebrasi talenta data muda.",
    ],
  },
];

export default function TimelinePage() {
  // Target closing date for current registration cycle
  const targetDate = new Date("2026-11-25T23:59:59+07:00").getTime();

  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor(
          (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        const minutes = Math.floor(
          (difference % (1000 * 60 * 60)) / (1000 * 60)
        );
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);
        setTimeLeft({ days, hours, minutes, seconds });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  return (
    <>
      <Navbar />
      <main className="pt-[110px] pb-[80px] min-h-screen">
        {/* Header Section */}
        <section className="py-[36px]">
          <div className="page-container flex flex-col items-center text-center gap-[16px]">
            <span className="section-label hero-animate">ROADMAP &amp; JADWAL KOMPETISI</span>
            <h1 className="hero-animate-d1 text-[clamp(2.5rem,5.5vw,4.5rem)] leading-none text-platinum">
              Timeline &amp; Agenda
            </h1>
            <p className="hero-animate-d2 text-silver-mist text-[17px] max-w-[640px] leading-[1.45]">
              Catat tanggal-tanggal penting DATASPHERE 2026. Persiapkan timmu
              dari masa registrasi hingga panggung Capstone Expo.
            </p>

            {/* Live Countdown Box */}
            <div className="w-full max-w-[760px] mt-[24px] p-[28px] md:p-[36px] rounded-[var(--radius-cards)] bg-liquid-kelp/40 border border-teal-500/30 backdrop-blur-sm relative overflow-hidden">
              <div
                className="absolute inset-0 pointer-events-none opacity-20"
                style={{
                  background:
                    "radial-gradient(circle 400px at 50% 50%, rgba(0, 130, 124, 0.4), transparent 70%)",
                }}
                aria-hidden="true"
              />

              <div className="relative z-10 flex flex-col items-center gap-[16px]">
                <span className="section-label text-teal-300 text-[11px] tracking-[0.16em]">
                  COUNTDOWN PENUTUPAN PENDAFTARAN
                </span>

                <div className="grid grid-cols-4 gap-[12px] sm:gap-[20px] w-full max-w-[540px]">
                  <div className="flex flex-col items-center bg-liquid-abyss/80 border border-liquid-kelp py-[16px] px-[8px] rounded-[var(--radius-small)]">
                    <span className="text-[clamp(1.8rem,4vw,3.2rem)] font-bold text-lavender-phosphor font-[var(--font-matter)] leading-none">
                      {String(timeLeft.days).padStart(2, "0")}
                    </span>
                    <span className="text-[11px] uppercase tracking-[0.12em] text-silver-mist mt-[6px]">
                      Hari
                    </span>
                  </div>

                  <div className="flex flex-col items-center bg-liquid-abyss/80 border border-liquid-kelp py-[16px] px-[8px] rounded-[var(--radius-small)]">
                    <span className="text-[clamp(1.8rem,4vw,3.2rem)] font-bold text-lavender-phosphor font-[var(--font-matter)] leading-none">
                      {String(timeLeft.hours).padStart(2, "0")}
                    </span>
                    <span className="text-[11px] uppercase tracking-[0.12em] text-silver-mist mt-[6px]">
                      Jam
                    </span>
                  </div>

                  <div className="flex flex-col items-center bg-liquid-abyss/80 border border-liquid-kelp py-[16px] px-[8px] rounded-[var(--radius-small)]">
                    <span className="text-[clamp(1.8rem,4vw,3.2rem)] font-bold text-lavender-phosphor font-[var(--font-matter)] leading-none">
                      {String(timeLeft.minutes).padStart(2, "0")}
                    </span>
                    <span className="text-[11px] uppercase tracking-[0.12em] text-silver-mist mt-[6px]">
                      Menit
                    </span>
                  </div>

                  <div className="flex flex-col items-center bg-liquid-abyss/80 border border-liquid-kelp py-[16px] px-[8px] rounded-[var(--radius-small)]">
                    <span className="text-[clamp(1.8rem,4vw,3.2rem)] font-bold text-teal-300 font-[var(--font-matter)] leading-none">
                      {String(timeLeft.seconds).padStart(2, "0")}
                    </span>
                    <span className="text-[11px] uppercase tracking-[0.12em] text-silver-mist mt-[6px]">
                      Detik
                    </span>
                  </div>
                </div>

                <p className="text-slate-deep text-[13px] mt-[4px]">
                  Batas akhir pendaftaran: 25 November 2026 pukul 23:59 WIB
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Timeline Roadmap Section */}
        <section className="py-[32px]">
          <div className="page-container max-w-[900px] flex flex-col gap-[28px]">
            {timelineStages.map((stage, idx) => (
              <div
                key={stage.phase}
                className="surface-card flex flex-col md:flex-row gap-[24px] p-[28px] md:p-[36px] border border-liquid-kelp/80 hover:border-teal-500/40 transition-all duration-300 relative"
              >
                {/* Stage Indicator Column */}
                <div className="flex md:flex-col items-center md:items-start justify-between md:justify-start gap-[12px] md:w-[160px] flex-shrink-0">
                  <div className="w-[52px] h-[52px] rounded-full bg-liquid-deep border border-teal-500/30 flex items-center justify-center font-bold text-[20px] text-platinum tracking-[0.06em]">
                    {stage.phase}
                  </div>
                  <span
                    className={`text-[11px] tracking-[0.12em] uppercase font-semibold px-[10px] py-[3px] rounded-[var(--radius-small)] border ${stage.badgeColor}`}
                  >
                    {stage.badge}
                  </span>
                </div>

                {/* Stage Content */}
                <div className="flex flex-col gap-[12px] flex-grow">
                  <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-[6px]">
                    <h2 className="text-platinum text-[24px] font-medium leading-[1.2]">
                      {stage.title}
                    </h2>
                    <span className="text-teal-400 text-[14px] font-medium tracking-[0.02em] whitespace-nowrap">
                      {stage.date}
                    </span>
                  </div>

                  <span className="text-slate-deep text-[12px] uppercase tracking-[0.1em]">
                    📍 {stage.location}
                  </span>

                  <p className="text-silver-mist text-[15px] leading-[1.45]">
                    {stage.summary}
                  </p>

                  {/* Bullet Highlights */}
                  <ul className="flex flex-col gap-[6px] mt-[4px] pt-[12px] border-t border-liquid-deep text-[14px] text-liquid-mist/90 list-disc list-inside">
                    {stage.details.map((detail, dIdx) => (
                      <li key={dIdx} className="leading-[1.4]">
                        {detail}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}

            {/* Bottom CTA Card */}
            <div className="recessed-card flex flex-col sm:flex-row items-center justify-between gap-[24px] p-[32px] md:p-[48px] mt-[24px] border border-liquid-kelp">
              <div className="flex flex-col gap-[6px] text-center sm:text-left">
                <span className="section-label text-teal-300">JANGAN TERTINGGAL</span>
                <h3 className="text-platinum text-[24px]">Segera Daftarkan Tim Sekolahmu</h3>
                <p className="text-silver-mist text-[14px]">Kuota terbatas untuk tiap kategori perlombaan.</p>
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
