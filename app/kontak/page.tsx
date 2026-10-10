"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Pending from "@/components/Pending";
import { CONTACTS, CP_ADMIN, CP_LOMBA, EVENT, waLink } from "@/lib/event-data";

const contactChannels: {
  icon: string;
  name: string;
  value: React.ReactNode;
  desc: string;
  actionText?: string;
  href?: string;
  wide?: boolean;
}[] = [
  ...CONTACTS.map((c) => ({
    icon: "💬",
    name: `WhatsApp — ${c.role}`,
    value: c.phone,
    desc: `${c.name} — ${c.desc}`,
    actionText: "Chat WhatsApp",
    href: waLink(c.wa),
  })),
  {
    icon: "✉️",
    name: "Email Resmi",
    value: EVENT.email ?? <Pending />,
    desc: "Untuk keperluan administrasi, persuratan, & kemitraan",
    ...(EVENT.email ? { actionText: "Kirim Email", href: `mailto:${EVENT.email}` } : {}),
  },
  {
    icon: "📸",
    name: "Instagram",
    value: EVENT.instagram ?? <Pending />,
    desc: "Update info, pengumuman finalis, & pemenang",
    ...(EVENT.instagram ? {
      actionText: "Buka Instagram",
      href: `https://www.instagram.com/${EVENT.instagram.replace(/^@/, "")}/`,
    } : {}),
  },
  {
    icon: "📍",
    name: "Lokasi Kegiatan",
    value: "Kampus IIB Darmajaya",
    actionText: "Buka Google Maps",
    href: "https://maps.google.com/?q=IIB+Darmajaya+Bandar+Lampung",
    desc: "Institut Informatika dan Bisnis Darmajaya, Bandar Lampung",
    wide: true,
  },
];

const ADMIN_TOPICS = ["Pembayaran & Bukti Transfer", "Berkas Pendaftaran", "Refund", "Kendala Pendaftaran"];

export default function KontakPage() {
  const [formData, setFormData] = useState({
    nama: "",
    no_hp: "",
    asal_sekolah: "",
    subjek: "Pertanyaan Umum",
    pesan: "",
  });

  const [submitted, setSubmitted] = useState(false);
  // Pembayaran & berkas → Administrasi; lainnya → CP Lomba (Rulebook Bab 17)
  const target = ADMIN_TOPICS.includes(formData.subjek) ? CP_ADMIN : CP_LOMBA;

  // Tidak ada backend untuk pesan — form menyusun pesan lalu membukanya di WhatsApp panitia
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const text = [
      `Halo Panitia DATASPHERE 2026,`,
      ``,
      `Nama: ${formData.nama}`,
      formData.asal_sekolah ? `Asal: ${formData.asal_sekolah}` : null,
      `No. WA: ${formData.no_hp}`,
      `Topik: ${formData.subjek}`,
      ``,
      formData.pesan,
    ]
      .filter((l) => l !== null)
      .join("\n");
    window.open(waLink(target.wa, text), "_blank", "noopener,noreferrer");
    setSubmitted(true);
  };

  return (
    <>
      <Navbar />
      <main className="pt-[110px] pb-[80px] min-h-screen">
        {/* Header Section */}
        <section className="py-[32px]">
          <div className="page-container flex flex-col items-center text-center gap-[14px]">
            <span className="section-label hero-animate">HUBUNGI KAMI</span>
            <h1 className="hero-animate-d1 text-[clamp(2.5rem,5.5vw,4.5rem)] leading-none text-platinum">
              Pusat Bantuan &amp; Kontak
            </h1>
            <p className="hero-animate-d2 text-silver-mist text-[16px] max-w-[620px] leading-[1.45]">
              Ada pertanyaan seputar pendaftaran, perlombaan, atau kerja sama?
              Hubungi panitia DATASPHERE 2026 melalui kontak resmi berikut.
            </p>
          </div>
        </section>

        {/* Contact Channels Grid */}
        <section className="py-[24px]">
          <div className="page-container max-w-[1000px]">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-[20px]">
              {contactChannels.map((c) => (
                <div
                  key={c.name}
                  className={`surface-card flex flex-col justify-between gap-[18px] p-[22px] md:p-[32px] ${c.wide ? "sm:col-span-2 sm:flex-row sm:items-center" : ""}`}
                >
                  <div className="flex items-start gap-[16px]">
                    <span className="text-[22px] sm:text-[28px] p-[8px] sm:p-[10px] rounded-[var(--radius-small)] bg-liquid-tide border border-accent-primary/40 flex-shrink-0">
                      {c.icon}
                    </span>
                    <div className="flex flex-col gap-[4px]">
                      <span className="text-[12px] uppercase tracking-[0.14em] text-lavender-phosphor font-semibold">
                        {c.name}
                      </span>
                      <h3 className="text-platinum text-[18px] font-medium leading-[1.3] break-all sm:break-normal">
                        {c.value}
                      </h3>
                      <p className="text-silver-mist text-[13px] leading-[1.4] mt-[2px]">
                        {c.desc}
                      </p>
                    </div>
                  </div>

                  {c.href && (
                    <a
                      href={c.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ghost-nav-link text-[13px] text-silver-mist hover:text-white flex items-center justify-center sm:justify-start gap-[6px] font-medium self-stretch sm:self-start mt-auto flex-shrink-0 px-[16px] py-[12px] rounded-[var(--radius-small)] border border-accent-primary/40 hover:border-accent-secondary"
                    >
                      <span>{c.actionText}</span>
                      <span>→</span>
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Direct Inquiry Message Form */}
        <section className="py-[32px]">
          <div className="page-container max-w-[800px]">
            <div className="surface-card p-[32px] md:p-[48px]">
              {submitted ? (
                <div className="flex flex-col items-center text-center gap-[16px] py-[32px]">
                  <div className="w-[56px] h-[56px] rounded-full bg-liquid-tide text-liquid-mist text-[26px] flex items-center justify-center border border-accent-secondary/50">
                    ✓
                  </div>
                  <h2 className="text-platinum text-[24px]">Pesan Siap Dikirim</h2>
                  <p className="text-silver-mist text-[15px] max-w-[460px]">
                    Pesanmu sudah dibuka di WhatsApp {target.role} ({target.name}, {target.phone}). Tekan
                    tombol kirim di WhatsApp untuk mengirimkannya. Jika WhatsApp tidak
                    terbuka, hubungi nomor tersebut secara langsung.
                  </p>
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setFormData({
                        nama: "",
                        no_hp: "",
                        asal_sekolah: "",
                        subjek: "Pertanyaan Umum",
                        pesan: "",
                      });
                    }}
                    className="gradient-pill-btn text-[13px] px-[28px] py-[12px] mt-[12px]"
                  >
                    Kirim Pesan Lain
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-[24px]">
                  <div className="flex flex-col gap-[6px]">
                    <span className="section-label">KIRIM PESAN LANGSUNG</span>
                    <h2 className="text-platinum text-[24px]">Tanya Panitia</h2>
                    <p className="text-silver-mist text-[14px]">
                      Isi formulir di bawah ini — pesanmu akan dibuka di WhatsApp panitia untuk dikirim.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-[16px]">
                    <div className="flex flex-col gap-[6px]">
                      <label htmlFor="tanya-nama" className="text-[13px] text-platinum font-medium">Nama Lengkap *</label>
                      <input
                        id="tanya-nama"
                        type="text"
                        required
                        value={formData.nama}
                        onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                        placeholder="Nama kamu / Guru"
                        className="bg-liquid-tide border border-accent-primary/40 text-platinum rounded-[var(--radius-small)] px-[14px] py-[12px] text-[14px] focus:outline-none focus:border-accent-secondary transition-colors"
                      />
                    </div>

                    <div className="flex flex-col gap-[6px]">
                      <label htmlFor="tanya-wa" className="text-[13px] text-platinum font-medium">Nomor WhatsApp *</label>
                      <input
                        id="tanya-wa"
                        type="tel"
                        required
                        value={formData.no_hp}
                        onChange={(e) => setFormData({ ...formData, no_hp: e.target.value })}
                        placeholder="08xxxxxxxxxx"
                        className="bg-liquid-tide border border-accent-primary/40 text-platinum rounded-[var(--radius-small)] px-[14px] py-[12px] text-[14px] focus:outline-none focus:border-accent-secondary transition-colors"
                      />
                    </div>

                    <div className="flex flex-col gap-[6px]">
                      <label htmlFor="tanya-sekolah" className="text-[13px] text-platinum font-medium">Asal Sekolah</label>
                      <input
                        id="tanya-sekolah"
                        type="text"
                        value={formData.asal_sekolah}
                        onChange={(e) => setFormData({ ...formData, asal_sekolah: e.target.value })}
                        placeholder="SMA / SMK / MA"
                        className="bg-liquid-tide border border-accent-primary/40 text-platinum rounded-[var(--radius-small)] px-[14px] py-[12px] text-[14px] focus:outline-none focus:border-accent-secondary transition-colors"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-[6px]">
                    <label htmlFor="tanya-topik" className="text-[13px] text-platinum font-medium">Topik / Subjek</label>
                    <select
                      id="tanya-topik"
                      value={formData.subjek}
                      onChange={(e) => setFormData({ ...formData, subjek: e.target.value })}
                      className="bg-liquid-tide border border-accent-primary/40 text-platinum rounded-[var(--radius-small)] px-[14px] py-[12px] text-[14px] focus:outline-none focus:border-accent-secondary transition-colors"
                    >
                      <option value="Pertanyaan Umum">Pertanyaan Umum</option>
                      <option value="Pembayaran & Bukti Transfer">Pembayaran &amp; Bukti Transfer</option>
                      <option value="Berkas Pendaftaran">Berkas Pendaftaran</option>
                      <option value="Refund">Refund</option>
                      <option value="Kendala Pendaftaran">Kendala Pendaftaran</option>
                      <option value="Teknis Lomba DataViz">Teknis Lomba DataViz Challenge</option>
                      <option value="Teknis Lomba Quiz">Teknis Lomba Data Quiz Battle</option>
                      <option value="Teknis Lomba Research">Teknis Lomba Young Data Researcher</option>
                      <option value="Seminar & Workshop">Seminar & Workshop</option>
                      <option value="Keberatan Hasil Penilaian">Keberatan Hasil Penilaian</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-[6px]">
                    <label htmlFor="tanya-pesan" className="text-[13px] text-platinum font-medium">Isi Pesan *</label>
                    <textarea
                      id="tanya-pesan"
                      required
                      rows={4}
                      value={formData.pesan}
                      onChange={(e) => setFormData({ ...formData, pesan: e.target.value })}
                      placeholder="Tuliskan pertanyaan atau kebutuhan bantuanmu secara detail di sini..."
                      className="bg-liquid-tide border border-accent-primary/40 text-platinum rounded-[var(--radius-small)] px-[14px] py-[12px] text-[14px] focus:outline-none focus:border-accent-secondary resize-none transition-colors"
                    />
                  </div>

                  <button
                    type="submit"
                    className="gradient-pill-btn text-[14px] px-[32px] py-[15px] self-stretch sm:self-start"
                  >
                    Kirim via WhatsApp →
                  </button>
                </form>
              )}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
