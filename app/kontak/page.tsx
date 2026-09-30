"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AnimateOnScroll from "@/components/AnimateOnScroll";

const contactChannels = [
  {
    icon: "💬",
    name: "WhatsApp Hotline",
    value: "+62 821-8888-2026",
    actionText: "Chat WhatsApp Resmi",
    href: "https://wa.me/6282188882026?text=Halo%20Panitia%20DATASPHERE%202026,%20saya%20ingin%20bertanya",
    desc: "Respon cepat setiap hari pukul 08.00 – 20.00 WIB",
  },
  {
    icon: "✉️",
    name: "Email Resmi",
    value: "datasphere@darmajaya.ac.id",
    actionText: "Kirim Email",
    href: "mailto:datasphere@darmajaya.ac.id?subject=Pertanyaan%20Kompetisi%20DATASPHERE%202026",
    desc: "Untuk keperluan administrasi, persuratan, & kemitraan sekolah",
  },
  {
    icon: "📸",
    name: "Instagram",
    value: "@datasphere.2026",
    actionText: "Follow Instagram",
    href: "https://instagram.com/",
    desc: "Update info, live quiz, tips data science, & pengumuman juara",
  },
  {
    icon: "📍",
    name: "Sekretariat Panitia",
    value: "Gedung Rektorat Lt. 2, IIB Darmajaya",
    actionText: "Buka Google Maps",
    href: "https://maps.google.com/?q=IIB+Darmajaya+Lampung",
    desc: "Jl. Z.A. Pagar Alam No.93, Gedong Meneng, Bandar Lampung",
  },
];

export default function KontakPage() {
  const [formData, setFormData] = useState({
    nama: "",
    email: "",
    no_hp: "",
    asal_sekolah: "",
    subjek: "Pertanyaan Umum",
    pesan: "",
  });

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
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
              Ada hal yang ingin ditanyakan seputar pendaftaran, perlombaan,
              atau kerjasama sekolah? Tim panitia DATASPHERE 2026 siap membantumu.
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
                  className="surface-card flex flex-col justify-between gap-[20px] p-[28px] md:p-[32px]"
                >
                  <div className="flex items-start gap-[16px]">
                    <span className="text-[28px] p-[10px] rounded-[var(--radius-small)] bg-liquid-tide border border-accent-primary/40 flex-shrink-0">
                      {c.icon}
                    </span>
                    <div className="flex flex-col gap-[4px]">
                      <span className="text-[12px] uppercase tracking-[0.14em] text-lavender-phosphor font-semibold">
                        {c.name}
                      </span>
                      <h3 className="text-platinum text-[18px] font-medium leading-[1.3]">
                        {c.value}
                      </h3>
                      <p className="text-silver-mist text-[13px] leading-[1.4] mt-[2px]">
                        {c.desc}
                      </p>
                    </div>
                  </div>

                  <a
                    href={c.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ghost-nav-link text-[13px] text-silver-mist hover:text-white flex items-center gap-[6px] font-medium self-start mt-auto"
                  >
                    <span>{c.actionText}</span>
                    <span>→</span>
                  </a>
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
                  <h2 className="text-platinum text-[24px]">Pesan Berhasil Terkirim!</h2>
                  <p className="text-silver-mist text-[15px] max-w-[460px]">
                    Terima kasih telah menghubungi kami. Panitia DATASPHERE 2026 akan
                    membalas pesanmu melalui email atau nomor WhatsApp yang telah dicantumkan.
                  </p>
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setFormData({
                        nama: "",
                        email: "",
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
                      Isi formulir di bawah ini dan kami akan membalas dalam waktu 1x24 jam.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-[16px]">
                    <div className="flex flex-col gap-[6px]">
                      <label className="text-[13px] text-platinum font-medium">Nama Lengkap *</label>
                      <input
                        type="text"
                        required
                        value={formData.nama}
                        onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                        placeholder="Nama kamu / Guru"
                        className="bg-liquid-tide border border-accent-primary/40 text-platinum rounded-[var(--radius-small)] px-[14px] py-[12px] text-[14px] focus:outline-none focus:border-accent-secondary transition-colors"
                      />
                    </div>

                    <div className="flex flex-col gap-[6px]">
                      <label className="text-[13px] text-platinum font-medium">Alamat Email *</label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="email@sekolah.sch.id / gmail"
                        className="bg-liquid-tide border border-accent-primary/40 text-platinum rounded-[var(--radius-small)] px-[14px] py-[12px] text-[14px] focus:outline-none focus:border-accent-secondary transition-colors"
                      />
                    </div>

                    <div className="flex flex-col gap-[6px]">
                      <label className="text-[13px] text-platinum font-medium">Nomor WhatsApp *</label>
                      <input
                        type="tel"
                        required
                        value={formData.no_hp}
                        onChange={(e) => setFormData({ ...formData, no_hp: e.target.value })}
                        placeholder="08xxxxxxxxxx"
                        className="bg-liquid-tide border border-accent-primary/40 text-platinum rounded-[var(--radius-small)] px-[14px] py-[12px] text-[14px] focus:outline-none focus:border-accent-secondary transition-colors"
                      />
                    </div>

                    <div className="flex flex-col gap-[6px]">
                      <label className="text-[13px] text-platinum font-medium">Asal Sekolah</label>
                      <input
                        type="text"
                        value={formData.asal_sekolah}
                        onChange={(e) => setFormData({ ...formData, asal_sekolah: e.target.value })}
                        placeholder="SMA / SMK / MA"
                        className="bg-liquid-tide border border-accent-primary/40 text-platinum rounded-[var(--radius-small)] px-[14px] py-[12px] text-[14px] focus:outline-none focus:border-accent-secondary transition-colors"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-[6px]">
                    <label className="text-[13px] text-platinum font-medium">Topik / Subjek</label>
                    <select
                      value={formData.subjek}
                      onChange={(e) => setFormData({ ...formData, subjek: e.target.value })}
                      className="bg-liquid-tide border border-accent-primary/40 text-platinum rounded-[var(--radius-small)] px-[14px] py-[12px] text-[14px] focus:outline-none focus:border-accent-secondary transition-colors"
                    >
                      <option value="Pertanyaan Umum">Pertanyaan Umum</option>
                      <option value="Kendala Pendaftaran">Kendala Pendaftaran</option>
                      <option value="Teknis Lomba DataViz">Teknis Lomba DataViz Challenge</option>
                      <option value="Teknis Lomba Quiz">Teknis Lomba Data Quiz Battle</option>
                      <option value="Teknis Lomba Research">Teknis Lomba Young Data Researcher</option>
                      <option value="Undangan & Kemitraan Sekolah">Undangan & Kemitraan Sekolah</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-[6px]">
                    <label className="text-[13px] text-platinum font-medium">Isi Pesan *</label>
                    <textarea
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
                    className="gradient-pill-btn text-[14px] px-[32px] py-[15px] self-start"
                  >
                    Kirim Pesan ke Panitia →
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
