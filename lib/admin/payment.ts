import { FEES } from "@/lib/event-data";

// Satu-satunya aturan "status pembayaran" — dipakai dashboard, tab daftar, kolom tabel, dan export CSV
// supaya angka di semua tempat selalu sama. Ditentukan dari bukti transfer TERBARU.

export const PAY_STATES = ["perlu-dicek", "belum-upload", "valid", "ditolak"] as const;
export type PayState = (typeof PAY_STATES)[number];

export const PAY_LABEL: Record<PayState, string> = {
  "perlu-dicek": "Perlu dicek",
  "belum-upload": "Belum upload bukti",
  valid: "Bukti valid",
  ditolak: "Bukti ditolak",
};

// Batas bayar = 3 hari setelah mendaftar (sesuai teks di layar sukses pendaftaran)
export const PAY_DEADLINE_MS = 3 * 86_400_000;

interface ProofLike {
  status: string;
  created_at: string;
}

interface RegLike {
  status: string;
  created_at: string;
  payment_proofs: ProofLike[];
}

export function latestProof<T extends ProofLike>(proofs: T[]): T | undefined {
  return proofs.reduce<T | undefined>((a, p) => (!a || p.created_at > a.created_at ? p : a), undefined);
}

export function payState(proofs: ProofLike[]): PayState {
  const p = latestProof(proofs);
  if (!p) return "belum-upload";
  if (p.status === "terverifikasi") return "valid";
  if (p.status === "ditolak") return "ditolak";
  return "perlu-dicek";
}

// Pendaftaran yang sudah ditolak tidak perlu ditindaklanjuti lagi
export const needsCheck = (r: RegLike) => r.status !== "ditolak" && payState(r.payment_proofs) === "perlu-dicek";

export const isOverdue = (r: RegLike, now: number) =>
  r.status === "menunggu" &&
  ["belum-upload", "ditolak"].includes(payState(r.payment_proofs)) &&
  now - new Date(r.created_at).getTime() > PAY_DEADLINE_MS;

export const expectedFee = (gelombang: string | null) => FEES.find((f) => f.wave === gelombang);

// ── Tab cepat di halaman Pendaftaran Lomba (?tab=) ──
export const LOMBA_TABS = ["semua", "perlu-dicek", "belum-upload", "terverifikasi", "finalis", "ditolak"] as const;
export type LombaTab = (typeof LOMBA_TABS)[number];

export const TAB_LABEL: Record<LombaTab, string> = {
  semua: "Semua",
  "perlu-dicek": "Perlu dicek",
  "belum-upload": "Belum upload bukti",
  terverifikasi: "Terverifikasi",
  finalis: "Finalis",
  ditolak: "Ditolak",
};

export function inTab(r: RegLike, tab: LombaTab) {
  switch (tab) {
    case "semua":
      return true;
    case "perlu-dicek":
      return needsCheck(r);
    case "belum-upload":
      return r.status === "menunggu" && payState(r.payment_proofs) === "belum-upload";
    default:
      return r.status === tab;
  }
}

export function tabCounts(rows: RegLike[]) {
  return Object.fromEntries(LOMBA_TABS.map((t) => [t, rows.filter((r) => inTab(r, t)).length])) as Record<LombaTab, number>;
}
