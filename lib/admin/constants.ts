import { CATEGORIES, FEES } from "@/lib/event-data";

// Konstanta admin panel yang dipakai bersama server & client (tanpa akses data).

export const LOMBA_STATUSES = ["menunggu", "terverifikasi", "finalis", "ditolak"] as const;
export const SEMINAR_STATUSES = ["terdaftar", "hadir", "batal"] as const;
export const PROOF_STATUSES = ["menunggu", "terverifikasi", "ditolak"] as const;

export type LombaStatus = (typeof LOMBA_STATUSES)[number];
export type SeminarStatus = (typeof SEMINAR_STATUSES)[number];
export type ProofStatus = (typeof PROOF_STATUSES)[number];

export const STATUS_LABEL: Record<string, string> = {
  menunggu: "Menunggu verifikasi",
  terverifikasi: "Terverifikasi",
  finalis: "Finalis",
  ditolak: "Ditolak",
  terdaftar: "Terdaftar",
  hadir: "Hadir",
  batal: "Batal",
};

// Warna status — token design system; merah hanya untuk status negatif.
// badge = pill (teks + latar + border), dot = titik penanda, bar = segmen grafik di dashboard
const NEUTRAL = { badge: "text-liquid-mist bg-silver-mist/10 border-silver-mist/30", dot: "bg-silver-mist", bar: "bg-silver-mist/60" };
const POSITIVE = { badge: "text-platinum bg-accent-primary/35 border-accent-secondary/60", dot: "bg-accent-secondary", bar: "bg-accent-secondary" };
const TOP = { badge: "text-liquid-deep bg-lavender-phosphor border-lavender-phosphor", dot: "bg-liquid-deep", bar: "bg-lavender-phosphor" };
const NEGATIVE = { badge: "text-red-200 bg-red-500/15 border-red-400/45", dot: "bg-red-400", bar: "bg-red-400/80" };

export const STATUS_TONE: Record<string, { badge: string; dot: string; bar: string }> = {
  menunggu: NEUTRAL,
  terdaftar: NEUTRAL,
  terverifikasi: POSITIVE,
  hadir: POSITIVE,
  finalis: TOP,
  ditolak: NEGATIVE,
  batal: NEGATIVE,
};

export const KATEGORI_IDS = ["dataviz", "quiz", "research"] as const;
export const KATEGORI_LABEL: Record<string, string> = Object.fromEntries(CATEGORIES.map((c) => [c.id, c.name]));

// Nilai di DB tetap "Gelombang I/II"; label tampilan Early Bid / Normal Bid
export const GELOMBANG_VALUES = ["Gelombang I", "Gelombang II"] as const;
export const GELOMBANG_LABEL: Record<string, string> = Object.fromEntries(FEES.map((f) => [f.wave, f.label]));
