// Data resmi DATASPHERE 2026.
// Sumber utama: "Rulebook Datasphere 2026 fix.pdf" (ketentuan lomba, jadwal, biaya, rubrik).
// Sumber pendukung: Proposal Kegiatan DATASPHERE 2026 (tema, penyelenggara, seminar).
// Field yang belum ditetapkan panitia bernilai `null` dan dirender sebagai
// placeholder "Segera diumumkan" lewat komponen <Pending />.

// Rulebook resmi (PDF di Google Drive)
export const RULEBOOK_PDF_URL =
  "https://drive.google.com/file/d/1Kn-akKS6mggcxPcNi7sw9LsXOCaUU8g5/view?usp=sharing";

export const EVENT = {
  name: "DATASPHERE 2026",
  theme: "Ideas, Innovation, and Impact",
  tagline: "From Data to Event, From Event to Impact",
  organizer: "Prodi Sains Data, IIB Darmajaya",
  personInCharge: "M. Hafizh Rafi Raihan",
  advisor: "Egi Safitri, S.Mat., M.Si.",
  venue: "Aula Rektorat & Pelataran Gedung F, IIB Darmajaya, Bandar Lampung",
  campusAddress: "Jl. Z.A. Pagar Alam No. 93, Gedong Meneng, Bandar Lampung, Lampung 35141",
  target: "Siswa SMA/MA/SMK/sederajat se-Provinsi Lampung",
  registrationFee: "Rp75.000 (Early Bid) · Rp100.000 (Normal Bid)",
  email: "dataspher@gmail.com" as string | null,
  instagram: "@dataspheredarmajaya" as string | null,
  // Belum ditetapkan panitia
  speakers: null as string | null,
};

// ── Pendaftaran & biaya (Rulebook Bab 2) ──
// `wave` disimpan ke kolom registrations.gelombang (constraint DB), `label` untuk tampilan.
export const FEES = [
  { wave: "Gelombang I", label: "Early Bid", period: "12 – 25 Oktober 2026", fee: "Rp75.000", until: "2026-10-25T23:59:59+07:00" },
  { wave: "Gelombang II", label: "Normal Bid", period: "26 Oktober – 12 November 2026", fee: "Rp100.000", until: "2026-11-12T23:59:59+07:00" },
];
export const REGISTRATION_OPEN = "2026-10-12T00:00:00+07:00";
export const REGISTRATION_CLOSE = "2026-11-12T23:59:59+07:00";

export const PAYMENT = { bank: "BRI", account: "1290-0100-5445-502", holder: "Novita Triyasri" };

export const REQUIRED_FILES = [
  "Kartu Pelajar (setiap anggota tim)",
  "Bukti pengisian formulir pendaftaran",
  "Bukti pembayaran lomba",
  "Screenshot unggahan twibbon (akun publik, tidak diprivat)",
];

export const QUOTA = { dataviz: "35 tim", research: "35 tim", quiz: "60 peserta" };

// ── Contact person ──
export interface Contact {
  name: string;
  role: string;
  desc: string;
  phone: string;
  wa: string;
}

// Rulebook Bab 17
export const CP_ADMIN: Contact = {
  name: "Rekha Aprilia Andini",
  role: "Administrasi",
  desc: "Pembayaran, bukti transfer, berkas, dan refund",
  phone: "+62 857-0995-3924",
  wa: "6285709953924",
};
export const CP_LOMBA: Contact = {
  name: "Yandi Jaya Antonio",
  role: "Lomba",
  desc: "Teknis lomba, kendala saat penyisihan, dan keberatan hasil",
  phone: "+62 851-7691-6364",
  wa: "6285176916364",
};

export const CONTACTS: Contact[] = [CP_ADMIN, CP_LOMBA];

export const waLink = (wa: string, text = "Halo Panitia DATASPHERE 2026, saya ingin bertanya") =>
  `https://wa.me/${wa}?text=${encodeURIComponent(text)}`;

// ── Timeline resmi (Rulebook halaman 1) ──
// start/end dalam WIB; dipakai untuk status Mendatang / Berlangsung / Selesai.
export const TIMELINE = [
  {
    id: "gel1",
    title: "Pendaftaran Early Bid",
    date: "12 – 25 Oktober 2026",
    start: "2026-10-12T00:00:00+07:00",
    end: "2026-10-25T23:59:59+07:00",
    mode: "Online",
    location: null,
    summary: "Early Bid Rp75.000 per tim (DataViz & YDR) atau per peserta (Data Quiz Battle). Bayar paling lambat 3 hari setelah mendaftar.",
  },
  {
    id: "gel2",
    title: "Pendaftaran Normal Bid",
    date: "26 Oktober – 12 November 2026",
    start: "2026-10-26T00:00:00+07:00",
    end: "2026-11-12T23:59:59+07:00",
    mode: "Online",
    location: null,
    summary: "Normal Bid Rp100.000. Pendaftaran cabang ditutup lebih awal bila kuota terpenuhi.",
  },
  {
    id: "verifikasi",
    title: "Verifikasi Berkas & Kesiapan Peserta",
    date: "26 Oktober – 13 November 2026",
    start: "2026-10-26T00:00:00+07:00",
    end: "2026-11-13T23:59:59+07:00",
    mode: "Online",
    location: null,
    summary: "Batas akhir pengumpulan berkas: Kamis, 12 November 2026 pukul 23.59 WIB.",
  },
  {
    id: "simulasi",
    title: "Simulasi Pelaksanaan Lomba",
    date: "2 – 15 November 2026",
    start: "2026-11-02T00:00:00+07:00",
    end: "2026-11-15T23:59:59+07:00",
    mode: "Wajib",
    location: null,
    summary: "Seluruh tim/peserta wajib mengikuti simulasi sesuai jadwal yang diumumkan panitia.",
  },
  {
    id: "seminar",
    title: "Seminar & Workshop",
    date: "12 November 2026",
    start: "2026-11-12T00:00:00+07:00",
    end: "2026-11-12T23:59:59+07:00",
    mode: "Luring · Wajib",
    location: "Aula Rektorat & Pelataran Gedung F, IIB Darmajaya",
    summary: "Wajib bagi peserta lomba (minimal 1 perwakilan per tim), terbuka untuk umum. Sistem pengumpulan karya dijelaskan di sini.",
  },
  {
    id: "tm",
    title: "Technical Meeting",
    date: "16 November 2026",
    start: "2026-11-16T00:00:00+07:00",
    end: "2026-11-16T23:59:59+07:00",
    mode: "Peserta lomba",
    location: null,
    summary: "Penjelasan dataset, tools, sistem kuis, output, dan penilaian tiap cabang. Metode dan tautan diinformasikan panitia.",
  },
  {
    id: "penyisihan",
    title: "Babak Penyisihan (Online)",
    date: "17 – 26 November 2026",
    start: "2026-11-17T00:00:00+07:00",
    end: "2026-11-26T23:59:59+07:00",
    mode: "Daring",
    location: null,
    summary: "Data Quiz Battle: Selasa, 17 November 2026. Batas submission DataViz & YDR: 26 November 2026 pukul 23.59 WIB.",
  },
  {
    id: "penilaian",
    title: "Pemeriksaan, Penilaian & Seleksi Finalis",
    date: "27 – 30 November 2026",
    start: "2026-11-27T00:00:00+07:00",
    end: "2026-11-30T23:59:59+07:00",
    mode: "Juri",
    location: null,
    summary: "Juri menilai karya penyisihan berdasarkan rubrik resmi tiap cabang.",
  },
  {
    id: "finalis",
    title: "Pengumuman Finalis",
    date: "1 Desember 2026",
    start: "2026-12-01T00:00:00+07:00",
    end: "2026-12-01T23:59:59+07:00",
    mode: "Online",
    location: null,
    summary: "5 tim DataViz, 10 peserta Data Quiz Battle, dan 5 tim YDR lolos ke final.",
  },
  {
    id: "persiapan",
    title: "Persiapan Finalis",
    date: "2 – 6 Desember 2026",
    start: "2026-12-02T00:00:00+07:00",
    end: "2026-12-06T23:59:59+07:00",
    mode: "Finalis",
    location: null,
    summary: "Materi final (infografis digital/file presentasi) dikumpulkan paling lambat 6 Desember 2026 pukul 18.00 WIB.",
  },
  {
    id: "final",
    title: "Final Offline",
    date: "7 Desember 2026",
    start: "2026-12-07T00:00:00+07:00",
    end: "2026-12-07T23:59:59+07:00",
    mode: "Luring",
    location: "Kampus IIB Darmajaya, Bandar Lampung",
    summary: "Check-in finalis 07.30–08.00 WIB. DataViz di Ruang 1 Gedung B, Data Quiz di Aula, YDR di Ruang 2 Gedung B.",
  },
  {
    id: "awarding",
    title: "Awarding & Pengumuman Pemenang",
    date: "10 Desember 2026",
    start: "2026-12-10T00:00:00+07:00",
    end: "2026-12-10T23:59:59+07:00",
    mode: "Wajib bagi pemenang",
    location: null,
    summary: "Waktu dan tempat diinformasikan panitia. Pemenang yang berhalangan dapat diwakilkan pendamping dengan surat keterangan.",
  },
];

// Countdown diarahkan ke Technical Meeting — milestone terdekat bagi calon peserta.
export const COUNTDOWN_TARGET = {
  label: "Technical Meeting",
  date: "16 November 2026",
  iso: "2026-11-16T00:00:00+07:00",
};

// ── Kategori lomba (Rulebook Bab 7) ──
export type CategoryId = "dataviz" | "quiz" | "research";

export interface RubricItem {
  aspect: string;
  weight: number;
}

export interface Category {
  id: CategoryId;
  number: string;
  name: string;
  theme: string;
  // Jumlah anggota maksimal (minimal 1 = ketua). Quiz: individu → 1.
  maxTeam: number;
  teamLabel: string;
  grades: string;
  // kelas yang boleh ikut (dipakai validasi form)
  allowedGrades: ("X" | "XI" | "XII")[];
  quota: string;
  finalists: string;
  finalVenue: string;
  tools: string;
  difficulty: string;
  short: string;
  description: string;
  scope?: { title: string; items: string[] };
  mechanism: { stage: string; text: string }[];
  output: string[];
  submission: string;
  rubric?: { penyisihan: RubricItem[]; final: RubricItem[] };
  scoring?: { title: string; rows: { condition: string; points: string }[]; note: string }[];
  awards: { award: string; prize: string }[];
}

const PRIZE_TOP = "Uang tunai + piala + medali + merchandise + sertifikat";
const PRIZE_OTHER = "Medali + merchandise + sertifikat";

export const CATEGORIES: Category[] = [
  {
    id: "dataviz",
    number: "01",
    name: "DataViz Challenge",
    theme: "Data for a Better Future",
    maxTeam: 3,
    teamLabel: "Tim 1–3 siswa",
    grades: "Kelas X–XII",
    allowedGrades: ["X", "XI", "XII"],
    quota: "35 tim",
    finalists: "5 tim",
    finalVenue: "Ruang 1, Gedung B",
    tools: "Power BI, Excel, dan Canva",
    difficulty: "Menengah",
    short: "Olah dataset dari panitia menjadi infografis berisi visualisasi, 3–5 insight, dan rekomendasi.",
    description:
      "Tim mengolah dataset dan studi kasus dari panitia menjadi infografis yang memuat visualisasi data, 3–5 insight utama, serta kesimpulan atau rekomendasi. Setiap tim memilih satu dari lima topik data.",
    scope: {
      title: "5 topik data (pilih satu):",
      items: [
        "Pendidikan dan Literasi Digital",
        "AI dan Teknologi Masa Depan",
        "Media Sosial dan Gaya Hidup Generasi Muda",
        "Ekonomi Kreatif dan Kewirausahaan Digital",
        "Lingkungan dan Keberlanjutan",
      ],
    },
    mechanism: [
      { stage: "Penyisihan (Online)", text: "17–26 November 2026: dataset dibagikan, tim membuat infografis & ringkasan insight, lalu submission." },
      { stage: "Seleksi Finalis", text: "Juri menilai pada 27–30 November 2026; 5 tim finalis diumumkan 1 Desember 2026." },
      { stage: "Final (Offline)", text: "7 Desember 2026: presentasi infografis + tanya jawab, 15 menit per tim." },
    ],
    output: [
      "Infografis ukuran A3 portrait, format PDF dan PNG/JPEG, resolusi minimal 300 DPI.",
      "Ringkasan insight PDF maksimal 2 halaman (3–5 insight utama + kesimpulan/rekomendasi).",
      "Sumber data/referensi dalam file teks terpisah.",
      "Pernyataan Penggunaan AI.",
      "Nama file: JudulKarya_NamaTim_NamaSekolah.",
    ],
    submission: "Batas 26 November 2026 pukul 23.59 WIB, melalui kanal yang dijelaskan saat Workshop.",
    rubric: {
      penyisihan: [
        { aspect: "Pemahaman Data", weight: 25 },
        { aspect: "Ketepatan Pengolahan Data", weight: 30 },
        { aspect: "Pemilihan Visualisasi", weight: 25 },
        { aspect: "Kejelasan Visual", weight: 20 },
      ],
      final: [
        { aspect: "Analisis & Insight", weight: 30 },
        { aspect: "Data Storytelling", weight: 25 },
        { aspect: "Kreativitas Visual", weight: 15 },
        { aspect: "Desain & Estetika", weight: 15 },
        { aspect: "Presentasi & Argumentasi", weight: 15 },
      ],
    },
    awards: [
      { award: "Juara 1, 2, dan 3", prize: PRIZE_TOP },
      { award: "Favorit 1 dan Harapan 1", prize: PRIZE_OTHER },
    ],
  },
  {
    id: "quiz",
    number: "02",
    name: "Data Quiz Battle",
    theme: "Think with Data",
    maxTeam: 1,
    teamLabel: "Individu",
    grades: "Kelas X–XII",
    allowedGrades: ["X", "XI", "XII"],
    quota: "60 peserta",
    finalists: "10 peserta",
    finalVenue: "Aula",
    tools: "Website kuis (penyisihan) & bel cepat tepat (final)",
    difficulty: "Bertahap (mudah, menengah, sulit)",
    short: "Lomba cepat tepat individu seputar data: membaca tabel, grafik, dan statistik sederhana.",
    description:
      "Data Quiz Battle adalah lomba cepat tepat individu yang menguji kecepatan dan ketepatan peserta dalam memahami, membaca, dan menggunakan data. Soal berupa tabel, grafik, informasi statistik sederhana, dan studi kasus singkat — penyisihan dikerjakan online, final berupa adu cepat tepat dengan bel.",
    scope: {
      title: "Materi soal:",
      items: ["Literasi data", "Statistika dasar", "Interpretasi grafik", "AI/Machine Learning dasar", "Logika data"],
    },
    mechanism: [
      { stage: "Penyisihan (Online)", text: "Selasa, 17 November 2026 via website: 50 soal pilihan ganda, 90 menit, 1 kali percobaan." },
      { stage: "Seleksi Finalis", text: "10 skor tertinggi lolos (skor sama → waktu pengerjaan tercepat); diumumkan 1 Desember 2026." },
      { stage: "Final (Offline)", text: "7 Desember 2026: cepat tepat dengan bel, 15 soal, waktu berpikir maksimal 2 menit per soal." },
    ],
    output: [
      "Penyisihan: jawaban 50 soal pilihan ganda di website kuis.",
      "Final: jawaban lisan maksimal 15 detik setelah dipersilakan juri.",
    ],
    submission: "Dikerjakan langsung di website kuis; jam sesi diumumkan panitia.",
    scoring: [
      {
        title: "Penyisihan",
        rows: [
          { condition: "Jawaban benar", points: "+2" },
          { condition: "Jawaban salah atau kosong", points: "0" },
        ],
        note: "Skor maksimal 100. Tidak ada pengurangan nilai untuk jawaban salah.",
      },
      {
        title: "Final",
        rows: [
          { condition: "Benar pada kesempatan pertama (penekan bel tercepat)", points: "+10" },
          { condition: "Benar pada kesempatan berikutnya", points: "+5" },
          { condition: "Menjawab salah", points: "−5" },
          { condition: "Tidak menekan bel / soal hangus", points: "0" },
        ],
        note: "Maksimal 150 poin (15 soal × 10). Poin sama pada peringkat penghargaan → soal sudden death.",
      },
    ],
    awards: [
      { award: "Juara 1, 2, dan 3", prize: PRIZE_TOP },
      { award: "Harapan 1 dan 2", prize: PRIZE_OTHER },
    ],
  },
  {
    id: "research",
    number: "03",
    name: "Young Data Researcher",
    theme: "Data Around Us",
    maxTeam: 3,
    teamLabel: "Tim 1–3 siswa",
    grades: "Kelas XI–XII",
    allowedGrades: ["XI", "XII"],
    quota: "35 tim",
    finalists: "5 tim",
    finalVenue: "Ruang 2, Gedung B",
    tools: "Python atau R, dan Microsoft Word/Google Docs",
    difficulty: "Menengah–tinggi",
    short: "Susun karya ilmiah penelitian sederhana dari dataset panitia bertopik Generasi Muda di Era Digital.",
    description:
      "Kompetisi penelitian sederhana berbasis data dengan alur masalah → data → metode → analisis → temuan → rekomendasi. Topik: Generasi Muda di Era Digital, menggunakan dataset dari panitia.",
    mechanism: [
      { stage: "Penyisihan (Online)", text: "17–26 November 2026: pengolahan data, penyusunan karya ilmiah, dan submission karya ilmiah." },
      { stage: "Seleksi Finalis", text: "Juri menilai karya ilmiah pada 27–30 November 2026; 5 tim finalis diumumkan 1 Desember 2026." },
      { stage: "Final (Offline)", text: "7 Desember 2026: ±10 menit presentasi + 5 menit tanya jawab per tim." },
    ],
    output: [
      "Karya ilmiah PDF maks. 10 MB: isi 10–15 halaman (A4, Times New Roman 12, spasi 1,5, margin 4-3-3-3).",
      "Abstrak 150–250 kata, sitasi APA edisi ke-7, tabel/grafik bernomor dan bersumber.",
      "File olahan data (mis. .xlsx) dilampirkan terpisah; Pernyataan Penggunaan AI di lampiran.",
      "Nama file: YDR_NamaTim_NamaSekolah.",
    ],
    submission: "Batas 26 November 2026 pukul 23.59 WIB, melalui kanal yang dijelaskan saat Workshop.",
    rubric: {
      penyisihan: [
        { aspect: "Identifikasi Masalah dan Tujuan", weight: 15 },
        { aspect: "Kesesuaian Data dan Metode", weight: 20 },
        { aspect: "Kualitas Analisis dan Hasil", weight: 25 },
        { aspect: "Interpretasi, Kesimpulan, dan Rekomendasi", weight: 20 },
        { aspect: "Sistematika, Bahasa, dan Sitasi", weight: 10 },
        { aspect: "Orisinalitas dan Kreativitas Ide", weight: 10 },
      ],
      final: [
        { aspect: "Penguasaan Hasil Penelitian", weight: 25 },
        { aspect: "Kualitas Analisis dan Insight", weight: 20 },
        { aspect: "Interpretasi dan Kesimpulan", weight: 15 },
        { aspect: "Visualisasi dan Media Presentasi", weight: 15 },
        { aspect: "Kemampuan Presentasi", weight: 10 },
        { aspect: "Tanya Jawab dan Pertanggungjawaban", weight: 15 },
      ],
    },
    awards: [
      { award: "Juara 1, 2, dan 3", prize: PRIZE_TOP },
      { award: "Harapan 1 dan 2", prize: PRIZE_OTHER },
    ],
  },
];
