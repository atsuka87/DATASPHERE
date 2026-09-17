# PRD — Website DATASPHERE 2026

**Darmajaya High School Data Science Challenge & Capstone Expo**
Versi: 0.1 (draft awal — perlu direview) • Pemilik: Pablo (IIB Darmajaya)

---

## 1. Latar Belakang

DATASPHERE 2026 adalah kompetisi data science untuk siswa SMA/SMK, sekaligus menjadi Capstone Project mahasiswa S1 Sains Data IIB Darmajaya (mahasiswa berperan sebagai Event Organizer). Website ini adalah media utama untuk publikasi event, pendaftaran peserta, dan penyampaian informasi lomba.

## 2. Tujuan Website

- Memperkenalkan DATASPHERE 2026 ke sekolah-sekolah target (SMA/SMK).
- Menjadi kanal pendaftaran peserta untuk 3 kategori lomba.
- Menyampaikan timeline, syarat, dan format lomba secara jelas.
- Menampilkan pengumuman dan (opsional) hasil/leaderboard.

**[ASUMSI]** Website tahap awal fokus sebagai *landing + informasi + pendaftaran*, bukan sistem lomba penuh (quiz engine, submission portal). Sistem lomba teknis (misal Data Quiz Battle live) bisa memakai tools eksternal (Google Form, platform quiz pihak ketiga) yang di-embed/di-link dari website.

## 3. Target Pengguna

| Peran | Kebutuhan di website |
|---|---|
| Siswa SMA/SMK (calon peserta) | Info lomba, syarat, cara daftar, timeline |
| Guru/sekolah | Info kredibilitas event, kontak, surat resmi |
| Panitia (mahasiswa) | Data pendaftar masuk, update konten mudah |
| Dosen/Pembimbing/Juri | Melihat progres, hasil, laporan |

## 4. Kategori Lomba (Konten Wajib)

1. **DataViz Challenge** — membuat dashboard dari dataset yang disediakan (Excel/Sheets/Looker Studio/Power BI). Penilaian: ketepatan data, visualisasi, insight, storytelling, desain.
2. **Data Quiz Battle** — cerdas cermat data science online. Materi: literasi data, statistika dasar, interpretasi grafik, spreadsheet, AI/ML dasar. Format: penyisihan online + final.
3. **Young Data Researcher** — karya ilmiah berbasis data (masalah → data → metode → analisis → temuan → rekomendasi).

**[ASUMSI]** Detail teknis tiap kategori (tanggal, kuota tim, hadiah, rubrik lengkap) belum final — ditandai `[ISI]` di struktur halaman pada bagian 6.

## 5. Fitur Utama (Scope v1)

| Fitur | Prioritas | Catatan |
|---|---|---|
| Landing page (hero, tentang, 3 kategori, timeline, CTA daftar) | Wajib | |
| Halaman detail per kategori lomba | Wajib | |
| Form pendaftaran online | Wajib | Nama, sekolah, kontak, kategori, anggota tim |
| Halaman Timeline/Jadwal | Wajib | Dengan countdown ke tanggal penting |
| Halaman FAQ | Wajib | |
| Halaman Kontak (WA/email/sosmed) | Wajib | |
| Halaman Tentang Panitia | Opsional | Struktur EO, divisi |
| Pengumuman/Berita | Opsional | Bisa berupa list statis awal |
| Dashboard status pendaftaran peserta | Opsional (v2) | Butuh backend + auth |
| Leaderboard/hasil publik | Opsional (v2) | Setelah lomba berjalan |

**[UPDATE]** v1 dibangun dengan Next.js + Supabase — data pendaftaran langsung tersimpan di database Supabase (Postgres), panitia bisa cek data masuk lewat table editor Supabase tanpa perlu bikin dashboard admin custom dulu. Fitur v2 (dashboard custom, leaderboard) tinggal query dari tabel yang sama.

## 6. Struktur Halaman & Konten

### 6.1 Beranda
- Hero: judul "DATASPHERE 2026", tagline "From Data to Event, From Event to Impact", CTA "Daftar Sekarang"
- Ringkasan event (1 paragraf) + 3 kategori lomba (card)
- Cuplikan timeline
- CTA akhir (Recessed Card) → daftar / hubungi panitia

### 6.2 Kategori Lomba (3 halaman atau 1 halaman dengan tab)
Untuk tiap kategori: deskripsi, syarat peserta, format & mekanisme, tools yang dipakai, kriteria penilaian, `[ISI: hadiah]`, `[ISI: tanggal pelaksanaan]`, tombol daftar kategori ini.

### 6.3 Timeline
Tahapan: Pendaftaran → Penyisihan → Final → Expo (`[ISI: tanggal pasti tiap tahap]`). Tampilkan sebagai stepper/timeline horizontal + countdown ke tanggal tutup pendaftaran.

### 6.4 Pendaftaran
Form: Nama peserta/tim, asal sekolah, kategori lomba, kontak (WA/email), jumlah anggota tim, `[ISI: field tambahan sesuai kebutuhan panitia]`. Tombol submit → konfirmasi sukses.

### 6.5 Tentang / Panitia
Deskripsi Capstone & program studi, struktur EO (opsional ditampilkan publik), logo Darmajaya.

### 6.6 FAQ
Minimal 6–8 pertanyaan umum: siapa yang boleh ikut, biaya, jumlah tim, format online/offline, dll. `[ISI oleh panitia]`.

### 6.7 Kontak
WhatsApp, email, Instagram, alamat kampus.

## 7. Referensi Desain

Mengikuti design system **Auros** (lihat `DESIGN.md` / `CLAUDE.md`): tema dark, "abyssal terminal" teal-hitam dengan gradient bioluminescent teal→pink, tipografi Matter (fallback Inter/DM Sans), card tanpa shadow radius 16px.

**[CATATAN]** Palet asli Auros bertema fintech/trading — untuk DATASPHERE (event edukasi kampus), gaya visual (dark, teknikal, data-terminal) dipertahankan, tapi copy/istilah disesuaikan ke konteks kompetisi data science pelajar, bukan finansial.

## 8. Kebutuhan Teknis

- **Stack final:** Next.js (App Router) + React + Tailwind CSS v4 untuk frontend, **Supabase** (Postgres + Auth + Storage) sebagai backend.
- Form pendaftaran menulis langsung ke tabel Supabase (misal tabel `registrations`) lewat Supabase JS client — tidak perlu backend/API terpisah.
- Panitia memantau data pendaftar lewat Supabase Table Editor (bawaan Supabase) di tahap awal; dashboard custom bisa dibangun belakangan dari tabel yang sama.
- Responsive (mobile-first, banyak calon peserta akan akses via HP).
- Hosting: Vercel (frontend) + Supabase cloud (database/backend).

## 9. Out of Scope (v1)

- Sistem quiz interaktif live (pakai platform eksternal dulu)
- Login peserta & dashboard personal
- Sistem scoring/judging otomatis

## 10. Metrik Keberhasilan

- Jumlah kunjungan halaman & jumlah sekolah yang mendaftar
- Conversion rate: kunjungan → pendaftaran
- Waktu muat halaman < 3 detik, mobile-friendly

## 11. Daftar Asumsi & Pertanyaan Terbuka

Semua `[ISI]` dan `[ASUMSI]` di atas perlu dikonfirmasi ke tim panitia/dosen pembimbing sebelum development final. Ringkasan pertanyaan terbuka utama:
1. Tanggal pasti tiap tahap lomba (pendaftaran, penyisihan, final, expo)
2. Biaya pendaftaran (gratis/berbayar)
3. Jumlah maksimal anggota tim per kategori
4. Hadiah tiap kategori
5. Metode pengumpulan karya (upload di web vs link eksternal)
6. Struktur tabel Supabase final (kolom apa saja yang dibutuhkan panitia dari form pendaftaran)
