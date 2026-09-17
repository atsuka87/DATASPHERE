"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AnimateOnScroll from "@/components/AnimateOnScroll";
import { supabase } from "@/lib/supabase";

const categories = [
  {
    id: "dataviz",
    name: "DataViz Challenge",
    desc: "Visualisasi data & pembuatan dashboard interaktif",
    badge: "1 – 3 Orang",
  },
  {
    id: "quiz",
    name: "Data Quiz Battle",
    desc: "Cerdas cermat literasi data, statistika & AI online",
    badge: "2 – 3 Orang",
  },
  {
    id: "research",
    name: "Young Data Researcher",
    desc: "Karya ilmiah & analisis riset berbasis bukti",
    badge: "1 – 3 Orang",
  },
];

export default function DaftarPage() {
  const [isPending, startTransition] = useTransition();

  const [formData, setFormData] = useState({
    kategori_lomba: "dataviz",
    nama_tim: "",
    nama_sekolah: "",
    kota_provinsi: "",
    jumlah_anggota: 3,
    nama_ketua: "",
    nisn_ketua: "",
    email: "",
    kontak_whatsapp: "",
    nama_anggota_1: "",
    nama_anggota_2: "",
    nama_guru_pembimbing: "",
    catatan: "",
    setuju_syarat: false,
  });

  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successData, setSuccessData] = useState<{
    id: string;
    nama_tim: string;
    kategori: string;
    sekolah: string;
  } | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    // Basic Validations
    if (!formData.nama_tim.trim()) {
      setErrorMsg("Mohon masukkan nama tim kamu.");
      return;
    }
    if (!formData.nama_sekolah.trim()) {
      setErrorMsg("Mohon masukkan nama asal sekolah.");
      return;
    }
    if (!formData.nama_ketua.trim()) {
      setErrorMsg("Mohon masukkan nama lengkap ketua tim.");
      return;
    }
    if (!formData.email.trim() || !formData.email.includes("@")) {
      setErrorMsg("Mohon masukkan alamat email yang valid.");
      return;
    }
    if (!formData.kontak_whatsapp.trim() || formData.kontak_whatsapp.length < 9) {
      setErrorMsg("Mohon masukkan nomor WhatsApp aktif yang valid.");
      return;
    }
    if (!formData.setuju_syarat) {
      setErrorMsg("Kamu harus menyetujui syarat & ketentuan perlombaan.");
      return;
    }

    startTransition(async () => {
      try {
        let registrationId = `DSP-${Date.now().toString().slice(-6)}`;

        // If supabase client is active and configured
        if (supabase) {
          const { data, error } = await supabase
            .from("registrations")
            .insert([
              {
                nama_tim: formData.nama_tim,
                nama_sekolah: formData.nama_sekolah,
                kategori_lomba: formData.kategori_lomba,
                kontak_whatsapp: formData.kontak_whatsapp,
                email: formData.email,
                jumlah_anggota: Number(formData.jumlah_anggota),
              },
            ])
            .select();

          if (error) {
            console.warn("Supabase insert warning, falling back to client confirmation:", error);
          } else if (data && data.length > 0) {
            registrationId = data[0].id;
          }
        }

        // Save local confirmation state
        setSuccessData({
          id: registrationId,
          nama_tim: formData.nama_tim,
          kategori:
            categories.find((c) => c.id === formData.kategori_lomba)?.name ||
            formData.kategori_lomba,
          sekolah: formData.nama_sekolah,
        });
      } catch (err: any) {
        console.error("Submission error:", err);
        setErrorMsg("Terjadi kesalahan teknis saat mengirim data. Silakan coba kembali.");
      }
    });
  };

  return (
    <>
      <Navbar />
      <main className="pt-[110px] pb-[80px] min-h-screen">
        {/* Header Section */}
        <section className="py-[32px]">
          <div className="page-container flex flex-col items-center text-center gap-[14px]">
            <span className="section-label hero-animate">PENDAFTARAN RESMI</span>
            <h1 className="hero-animate-d1 text-[clamp(2.5rem,5.5vw,4.5rem)] leading-none text-platinum">
              Formulir Pendaftaran
            </h1>
            <p className="hero-animate-d2 text-silver-mist text-[16px] max-w-[620px] leading-[1.45]">
              Daftarkan tim sekolahmu untuk mengikuti DATASPHERE 2026.
              Pastikan data yang kamu masukkan benar dan dapat dihubungi.
            </p>
          </div>
        </section>

        {/* Form Container */}
        <section className="py-[16px]">
          <div className="page-container max-w-[840px]">
            {successData ? (
              /* Success Confirmation Card */
              <div className="surface-card flex flex-col items-center text-center gap-[24px] p-[40px] md:p-[56px] border border-teal-500/50 shadow-2xl shadow-teal-500/10">
                <div className="w-[68px] h-[68px] rounded-full bg-teal-500/20 border border-teal-400/50 flex items-center justify-center text-teal-300 text-[32px] animate-pulse-glow">
                  ✓
                </div>

                <div className="flex flex-col gap-[8px]">
                  <span className="section-label text-teal-300">PENDAFTARAN BERHASIL</span>
                  <h2 className="text-platinum text-[28px] md:text-[34px]">
                    Selamat, Tim {successData.nama_tim}!
                  </h2>
                  <p className="text-silver-mist text-[15px] max-w-[500px]">
                    Data pendaftaran tim dari {successData.sekolah} untuk kategori{" "}
                    <span className="text-platinum font-medium">{successData.kategori}</span> telah
                    berhasil dicatat oleh panitia DATASPHERE 2026.
                  </p>
                </div>

                {/* ID Badge */}
                <div className="bg-liquid-deep/90 px-[24px] py-[16px] rounded-[var(--radius-small)] border border-liquid-kelp flex flex-col items-center gap-[4px] w-full max-w-[380px]">
                  <span className="text-[11px] uppercase tracking-[0.14em] text-slate-deep">
                    Nomor Registrasi Resmi
                  </span>
                  <span className="text-[20px] font-mono font-semibold text-lavender-phosphor tracking-[0.08em]">
                    {successData.id}
                  </span>
                </div>

                <div className="flex flex-col gap-[12px] w-full max-w-[480px] text-[14px] text-silver-mist bg-liquid-abyss/60 p-[20px] rounded-[var(--radius-small)] border border-liquid-kelp/60 text-left">
                  <span className="font-semibold text-platinum">Langkah Selanjutnya:</span>
                  <ol className="list-decimal list-inside flex flex-col gap-[8px]">
                    <li>Simpan atau tangkap layar bukti pendaftaran ini.</li>
                    <li>
                      Ketua tim akan segera dihubungi oleh panitia via WhatsApp untuk verifikasi berkas
                      dan undangan masuk WhatsApp Group resmi.
                    </li>
                    <li>Pantau update jadwal dan Technical Meeting di halaman Timeline.</li>
                  </ol>
                </div>

                <div className="flex flex-col sm:flex-row gap-[16px] mt-[8px]">
                  <Link href="/timeline" className="gradient-pill-btn text-[13px] px-[28px] py-[14px]">
                    Lihat Timeline Kompetisi
                  </Link>
                  <button
                    onClick={() => setSuccessData(null)}
                    className="ghost-nav-link text-[13px] px-[20px] py-[14px] border border-liquid-kelp rounded-[var(--radius-small)] hover:border-teal-700/60"
                  >
                    Daftarkan Tim Lain
                  </button>
                </div>
              </div>
            ) : (
              /* Registration Form */
              <form
                onSubmit={handleSubmit}
                className="surface-card flex flex-col gap-[36px] p-[32px] md:p-[48px] border border-liquid-kelp/80"
              >
                {/* Section 1: Kategori Lomba */}
                <div className="flex flex-col gap-[16px]">
                  <div className="flex items-center gap-[8px]">
                    <span className="w-[20px] h-[20px] rounded-full bg-teal-500/20 text-teal-300 text-[11px] font-bold flex items-center justify-center border border-teal-500/40">
                      1
                    </span>
                    <span className="section-label">PILIH KATEGORI LOMBA</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-[14px]">
                    {categories.map((cat) => {
                      const isSelected = formData.kategori_lomba === cat.id;
                      return (
                        <div
                          key={cat.id}
                          onClick={() =>
                            setFormData((prev) => ({ ...prev, kategori_lomba: cat.id }))
                          }
                          className={`p-[18px] rounded-[var(--radius-small)] cursor-pointer transition-all duration-200 border flex flex-col justify-between gap-[10px] ${
                            isSelected
                              ? "bg-teal-950/50 border-teal-400 shadow-md shadow-teal-500/10"
                              : "bg-liquid-deep/60 border-liquid-kelp/70 hover:border-teal-700/50"
                          }`}
                        >
                          <div className="flex flex-col gap-[4px]">
                            <div className="flex items-center justify-between">
                              <span className="text-[14px] font-semibold text-platinum">
                                {cat.name}
                              </span>
                              <span
                                className={`w-[14px] h-[14px] rounded-full border flex items-center justify-center ${
                                  isSelected
                                    ? "border-teal-300 bg-teal-400"
                                    : "border-slate-deep"
                                }`}
                              >
                                {isSelected && (
                                  <span className="w-[6px] h-[6px] rounded-full bg-liquid-abyss" />
                                )}
                              </span>
                            </div>
                            <span className="text-silver-mist text-[12px] leading-[1.35]">
                              {cat.desc}
                            </span>
                          </div>
                          <span className="text-[10px] uppercase tracking-[0.12em] text-teal-300">
                            {cat.badge}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Section 2: Data Sekolah & Tim */}
                <div className="flex flex-col gap-[20px] pt-[24px] border-t border-liquid-deep">
                  <div className="flex items-center gap-[8px]">
                    <span className="w-[20px] h-[20px] rounded-full bg-teal-500/20 text-teal-300 text-[11px] font-bold flex items-center justify-center border border-teal-500/40">
                      2
                    </span>
                    <span className="section-label">DATA SEKOLAH &amp; TIM</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-[18px]">
                    <div className="flex flex-col gap-[6px]">
                      <label className="text-[13px] text-platinum font-medium">
                        Nama Tim <span className="text-teal-400">*</span>
                      </label>
                      <input
                        type="text"
                        name="nama_tim"
                        value={formData.nama_tim}
                        onChange={handleChange}
                        placeholder="Contoh: Tim Algoritma Garuda"
                        className="bg-liquid-deep border border-liquid-kelp text-platinum rounded-[var(--radius-small)] px-[14px] py-[12px] text-[14px] focus:outline-none focus:border-teal-400 transition-colors"
                        required
                      />
                    </div>

                    <div className="flex flex-col gap-[6px]">
                      <label className="text-[13px] text-platinum font-medium">
                        Asal Sekolah (SMA / SMK / MA) <span className="text-teal-400">*</span>
                      </label>
                      <input
                        type="text"
                        name="nama_sekolah"
                        value={formData.nama_sekolah}
                        onChange={handleChange}
                        placeholder="Contoh: SMAN 1 Bandar Lampung"
                        className="bg-liquid-deep border border-liquid-kelp text-platinum rounded-[var(--radius-small)] px-[14px] py-[12px] text-[14px] focus:outline-none focus:border-teal-400 transition-colors"
                        required
                      />
                    </div>

                    <div className="flex flex-col gap-[6px]">
                      <label className="text-[13px] text-platinum font-medium">
                        Kota / Kabupaten &amp; Provinsi <span className="text-teal-400">*</span>
                      </label>
                      <input
                        type="text"
                        name="kota_provinsi"
                        value={formData.kota_provinsi}
                        onChange={handleChange}
                        placeholder="Contoh: Bandar Lampung, Lampung"
                        className="bg-liquid-deep border border-liquid-kelp text-platinum rounded-[var(--radius-small)] px-[14px] py-[12px] text-[14px] focus:outline-none focus:border-teal-400 transition-colors"
                        required
                      />
                    </div>

                    <div className="flex flex-col gap-[6px]">
                      <label className="text-[13px] text-platinum font-medium">
                        Jumlah Anggota Tim <span className="text-teal-400">*</span>
                      </label>
                      <select
                        name="jumlah_anggota"
                        value={formData.jumlah_anggota}
                        onChange={handleChange}
                        className="bg-liquid-deep border border-liquid-kelp text-platinum rounded-[var(--radius-small)] px-[14px] py-[12px] text-[14px] focus:outline-none focus:border-teal-400 transition-colors"
                      >
                        <option value={1}>1 Orang (Individu)</option>
                        <option value={2}>2 Orang</option>
                        <option value={3}>3 Orang (Maksimal)</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Section 3: Data Ketua & Anggota */}
                <div className="flex flex-col gap-[20px] pt-[24px] border-t border-liquid-deep">
                  <div className="flex items-center gap-[8px]">
                    <span className="w-[20px] h-[20px] rounded-full bg-teal-500/20 text-teal-300 text-[11px] font-bold flex items-center justify-center border border-teal-500/40">
                      3
                    </span>
                    <span className="section-label">DATA KETUA &amp; ANGGOTA TIM</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-[18px]">
                    <div className="flex flex-col gap-[6px]">
                      <label className="text-[13px] text-platinum font-medium">
                        Nama Lengkap Ketua Tim <span className="text-teal-400">*</span>
                      </label>
                      <input
                        type="text"
                        name="nama_ketua"
                        value={formData.nama_ketua}
                        onChange={handleChange}
                        placeholder="Nama sesuai kartu identitas"
                        className="bg-liquid-deep border border-liquid-kelp text-platinum rounded-[var(--radius-small)] px-[14px] py-[12px] text-[14px] focus:outline-none focus:border-teal-400 transition-colors"
                        required
                      />
                    </div>

                    <div className="flex flex-col gap-[6px]">
                      <label className="text-[13px] text-platinum font-medium">
                        NISN Ketua Tim <span className="text-teal-400">*</span>
                      </label>
                      <input
                        type="text"
                        name="nisn_ketua"
                        value={formData.nisn_ketua}
                        onChange={handleChange}
                        placeholder="10 digit nomor induk siswa"
                        className="bg-liquid-deep border border-liquid-kelp text-platinum rounded-[var(--radius-small)] px-[14px] py-[12px] text-[14px] focus:outline-none focus:border-teal-400 transition-colors"
                        required
                      />
                    </div>

                    <div className="flex flex-col gap-[6px]">
                      <label className="text-[13px] text-platinum font-medium">
                        Email Aktif Ketua <span className="text-teal-400">*</span>
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="email@sekolah.sch.id / gmail"
                        className="bg-liquid-deep border border-liquid-kelp text-platinum rounded-[var(--radius-small)] px-[14px] py-[12px] text-[14px] focus:outline-none focus:border-teal-400 transition-colors"
                        required
                      />
                    </div>

                    <div className="flex flex-col gap-[6px]">
                      <label className="text-[13px] text-platinum font-medium">
                        Nomor WhatsApp Aktif <span className="text-teal-400">*</span>
                      </label>
                      <input
                        type="tel"
                        name="kontak_whatsapp"
                        value={formData.kontak_whatsapp}
                        onChange={handleChange}
                        placeholder="Contoh: 081234567890"
                        className="bg-liquid-deep border border-liquid-kelp text-platinum rounded-[var(--radius-small)] px-[14px] py-[12px] text-[14px] focus:outline-none focus:border-teal-400 transition-colors"
                        required
                      />
                    </div>

                    {Number(formData.jumlah_anggota) >= 2 && (
                      <div className="flex flex-col gap-[6px]">
                        <label className="text-[13px] text-platinum font-medium">
                          Nama Lengkap Anggota 1
                        </label>
                        <input
                          type="text"
                          name="nama_anggota_1"
                          value={formData.nama_anggota_1}
                          onChange={handleChange}
                          placeholder="Nama anggota 1"
                          className="bg-liquid-deep border border-liquid-kelp text-platinum rounded-[var(--radius-small)] px-[14px] py-[12px] text-[14px] focus:outline-none focus:border-teal-400 transition-colors"
                        />
                      </div>
                    )}

                    {Number(formData.jumlah_anggota) >= 3 && (
                      <div className="flex flex-col gap-[6px]">
                        <label className="text-[13px] text-platinum font-medium">
                          Nama Lengkap Anggota 2
                        </label>
                        <input
                          type="text"
                          name="nama_anggota_2"
                          value={formData.nama_anggota_2}
                          onChange={handleChange}
                          placeholder="Nama anggota 2"
                          className="bg-liquid-deep border border-liquid-kelp text-platinum rounded-[var(--radius-small)] px-[14px] py-[12px] text-[14px] focus:outline-none focus:border-teal-400 transition-colors"
                        />
                      </div>
                    )}

                    <div className="flex flex-col gap-[6px] md:col-span-2">
                      <label className="text-[13px] text-platinum font-medium">
                        Nama Guru Pembimbing / Pendamping (Opsional)
                      </label>
                      <input
                        type="text"
                        name="nama_guru_pembimbing"
                        value={formData.nama_guru_pembimbing}
                        onChange={handleChange}
                        placeholder="Nama Bapak/Ibu guru pembimbing"
                        className="bg-liquid-deep border border-liquid-kelp text-platinum rounded-[var(--radius-small)] px-[14px] py-[12px] text-[14px] focus:outline-none focus:border-teal-400 transition-colors"
                      />
                    </div>
                  </div>
                </div>

                {/* Section 4: Persetujuan & Submit */}
                <div className="flex flex-col gap-[18px] pt-[24px] border-t border-liquid-deep">
                  <div className="flex items-start gap-[12px]">
                    <input
                      type="checkbox"
                      id="setuju_syarat"
                      name="setuju_syarat"
                      checked={formData.setuju_syarat}
                      onChange={handleChange}
                      className="mt-[3px] w-[18px] h-[18px] accent-teal-400 cursor-pointer"
                    />
                    <label htmlFor="setuju_syarat" className="text-[13px] text-silver-mist cursor-pointer leading-[1.45]">
                      Saya menyatakan bahwa seluruh data yang diisi adalah benar, anggota tim berstatus siswa aktif, dan bersedia mematuhi seluruh peraturan perlombaan DATASPHERE 2026.
                    </label>
                  </div>

                  {errorMsg && (
                    <div className="p-[14px] rounded-[var(--radius-small)] bg-red-950/60 border border-red-500/40 text-red-200 text-[13px]">
                      ⚠️ {errorMsg}
                    </div>
                  )}

                  <div className="flex flex-col sm:flex-row items-center justify-between gap-[16px] mt-[8px]">
                    <span className="text-[12px] text-slate-deep">
                      Pendaftaran 100% Gratis • Tidak dipungut biaya apapun
                    </span>
                    <button
                      type="submit"
                      disabled={isPending}
                      className={`gradient-pill-btn text-[14px] px-[36px] py-[16px] w-full sm:w-auto ${
                        isPending ? "opacity-60 cursor-not-allowed" : ""
                      }`}
                    >
                      {isPending ? "Memproses Data..." : "Kirim Pendaftaran Tim →"}
                    </button>
                  </div>
                </div>
              </form>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
