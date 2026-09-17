# CLAUDE.md — Website DATASPHERE 2026

Instruksi proyek untuk AI coding assistant. Baca `PRD.md` untuk konten & fitur lengkap sebelum mulai coding.

## Ringkasan Proyek

Website kompetisi data science untuk siswa SMA/SMK: **DATASPHERE 2026 — Darmajaya High School Data Science Challenge & Capstone Expo**. Tiga kategori lomba: DataViz Challenge, Data Quiz Battle, Young Data Researcher. Fungsi utama: informasi event + pendaftaran online.

## Tech Stack

- Next.js (App Router) + React + Tailwind CSS v4
- **Backend: Supabase** (Postgres + Auth + Storage). Gunakan `@supabase/supabase-js` untuk write ke tabel `registrations` dari form pendaftaran.
- Simpan kredensial Supabase (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`) di `.env.local` — jangan hardcode di kode.
- Buat Supabase client di `lib/supabase.ts`, dipakai dari client component form pendaftaran (`'use client'`).
- Struktur tabel awal `registrations` (sesuaikan dengan PRD.md bagian 6.4): `id`, `nama_tim`, `nama_sekolah`, `kategori_lomba`, `kontak_whatsapp`, `email`, `jumlah_anggota`, `created_at`.
- Panitia cek data lewat Supabase Table Editor — tidak perlu bikin dashboard admin di v1.
- Font: Matter (custom display) — fallback Inter/DM Sans/Satoshi kalau Matter tidak tersedia; Arial untuk elemen UI kecil (14px: nav, tombol, label form)

## Design System — "Auros" (Abyssal Terminal)

Tema: **dark**, "abyssal terminal dengan bioluminescent data orbs" — canvas teal gelap nyaris hitam, gradasi teal→pink, sparse & cinematic.

### Warna (WAJIB pakai token ini, jangan improvisasi warna baru)

```css
--color-liquid-abyss: #012624;   /* background utama: page, header, hero */
--color-liquid-deep: #011d1c;    /* surface terdalam: footer, recessed card/CTA */
--color-liquid-kelp: #003734;    /* card terangkat: feature card, tombol primer */
--color-liquid-mist: #edfffe;    /* teks body ditekankan, label section */
--color-platinum: #ffffff;       /* heading, nav, ikon, teks kontras tinggi */
--color-silver-mist: #bbc7c6;    /* teks body sekunder, link resting state */
--color-ash: #f2f2f2;            /* teks tersier: quote, testimoni */
--color-slate-deep: #707777;     /* background low-emphasis */
--color-lavender-phosphor: #fde9ff; /* angka statistik besar, highlight */

--gradient-bioluminescent: linear-gradient(90deg, rgb(0,130,124) 0%, rgb(203,255,252) 100%);
--gradient-aurora: linear-gradient(90deg, rgb(203,255,252) 0%, rgb(237,255,254) 26.25%, rgb(255,253,250) 47.57%, rgb(250,209,255) 88.96%);
```

**Aturan warna:** hanya pakai stack teal (`liquid-deep` → `liquid-abyss` → `liquid-kelp`) untuk diferensiasi background. Jangan pakai gray/hitam/biru netral generik. Gradient hanya untuk: tombol CTA utama & aksen dekoratif kecil.

### Tipografi

- **Matter** (500 untuk semua heading H1–H3 & teks kinetic besar; 400 untuk body/UI). Tracking negatif agresif di ukuran besar (-0.04em @ 61px, -0.046em @ 86px), tracking positif lebar di label uppercase (0.08–0.15em).
- **Arial** hanya di 14px, untuk nav/tombol/label form sebagai fallback aman.
- Tidak ada bold, tidak ada light — hanya weight 400 & 500. Konsistensi ini penting untuk kesan "mechanical confidence".

| Role | Size | Line-height | Tracking |
|---|---|---|---|
| caption | 10px | 1.4 | 1.5px |
| body | 16px | 1.4 | — |
| subheading | 24px | 1.3 | -0.48px |
| heading | 36px | 1 | — |
| heading-lg | 61px | 1 | -2.44px |
| display | 96px | 1 | -3.84px |

### Spacing & Shape

- Base unit 4px, density **spacious** — jangan bikin layout padat.
- Border radius: card 16px, tombol/elemen kecil 6px.
- Page max-width 1440px, section gap 68px, card padding 36–48px, element gap 20px.
- Card **tanpa shadow** — kedalaman dibentuk lewat lapisan warna (deep → abyss → kelp), bukan shadow.

### Komponen Kunci

- **Gradient Pill Button** (CTA utama): gradient aurora, radius 6px, padding 32px vertikal/22px horizontal, teks gelap (#222) 14px Arial uppercase.
- **Ghost Navigation Link**: transparan, uppercase 12px Matter 400, tracking 0.12em, putih (aktif) / silver (nonaktif).
- **Surface Card**: background `liquid-kelp`, radius 16px, padding 36px, heading 36px putih, body 16px silver.
- **Recessed Card**: background `liquid-deep`, radius 16px, padding vertikal 120px — untuk CTA/section penutup.
- **Statistic Counter**: angka besar warna `lavender-phosphor`, label kecil uppercase di bawahnya.
- **Arrow Icon Button**: 32×32px, radius 6px, fill teal semi-transparan `rgba(3,81,75,0.5)`, ikon panah putih ↗.

### Do's & Don'ts

- ✅ Uppercase tracked label di atas heading section (eyebrow/kicker)
- ✅ Whitespace luas, bukan garis aksen di bawah judul
- ❌ Jangan pakai accent line di bawah title, atau color bar/stripe dekoratif di tepi kartu — ini ciri khas desain AI generik
- ❌ Jangan pakai background cream/beige
- ❌ Jangan biarkan teks overflow dari container-nya

## Adaptasi Konten (Auros → DATASPHERE)

Auros aslinya bertema fintech/trading. Untuk DATASPHERE:
- Gaya visual (dark, teknikal, data-terminal, gradient bioluminescent) **dipertahankan penuh**.
- Copy/istilah diganti ke konteks kompetisi data science pelajar: "AUROS" → "DATASPHERE", istilah trading/liquidity → istilah lomba/data/event (contoh: Statistic Counter dipakai untuk jumlah peserta/sekolah, bukan angka finansial).
- Particle Sphere / Geometric Molecule Illustration bisa dipertahankan sebagai elemen dekoratif "data orb" — cocok secara tematik dengan data science.

## Struktur Halaman (ringkas — detail di PRD.md)

1. Beranda (hero + ringkasan 3 kategori + timeline singkat + CTA)
2. Kategori Lomba (DataViz Challenge / Data Quiz Battle / Young Data Researcher)
3. Timeline/Jadwal
4. Pendaftaran (form)
5. Tentang/Panitia
6. FAQ
7. Kontak

## Aturan Kerja untuk Agent

- Baca `PRD.md` dulu untuk detail konten tiap halaman sebelum generate kode.
- Banyak field konten masih `[ISI]` (tanggal, hadiah, biaya) — pakai placeholder yang jelas ditandai, jangan mengarang data pasti.
- Prioritaskan mobile-first responsive — target pengguna banyak akses dari HP.
- Komponen dibuat reusable (Card, Button, SectionLabel, StatCounter) sesuai token di atas — jangan hardcode warna/spacing di luar token ini.
