"use server";

import { FEES, REGISTRATION_OPEN } from "@/lib/event-data";
import { firstIssue, lombaSchema, proofSchema, seminarSchema } from "@/lib/forms/schemas";
import { PROOF_BUCKET } from "@/lib/proof-bucket";
import { getServiceClient } from "@/lib/supabase/service";
import { verifyTurnstile } from "@/lib/turnstile";

// Server Action form publik. Alur setiap submit:
//   1. Turnstile (anti-bot) → 2. validasi Zod di server → 3. insert dengan service role.
// Publik tidak lagi punya izin INSERT langsung ke tabel (migrasi 009), jadi langkah 1–2
// tidak bisa dilewati dengan memanggil REST API Supabase memakai anon key.

type Fail = { ok: false; error: string };
const fail = (error: string): Fail => ({ ok: false, error });

const NOT_READY = "Pendaftaran online sedang tidak tersedia. Silakan hubungi panitia lewat WhatsApp.";
const CAPTCHA_FAILED = "Verifikasi anti-bot gagal atau kedaluwarsa. Centang ulang verifikasi lalu kirim lagi.";
const SAVE_FAILED = "Pendaftaran gagal disimpan. Silakan coba lagi atau hubungi panitia.";

export async function submitSeminar(input: unknown, captchaToken: unknown): Promise<{ ok: true } | Fail> {
  if (!(await verifyTurnstile(captchaToken))) return fail(CAPTCHA_FAILED);
  const parsed = seminarSchema.safeParse(input);
  if (!parsed.success) return fail(firstIssue(parsed.error));

  const db = getServiceClient();
  if (!db) {
    console.error("SUPABASE_SERVICE_ROLE_KEY belum diisi.");
    return fail(NOT_READY);
  }
  const { error } = await db.from("seminar_registrations").insert(parsed.data);
  if (error) {
    console.error("Seminar insert failed:", error.code, error.message);
    return fail(error.code === "23505" ? "Pendaftaran ini sudah tercatat." : SAVE_FAILED);
  }
  return { ok: true };
}

export async function submitLomba(
  input: unknown,
  captchaToken: unknown,
): Promise<{ ok: true; wave: string; label: string; fee: string; submittedAt: number } | Fail> {
  if (!(await verifyTurnstile(captchaToken))) return fail(CAPTCHA_FAILED);
  const parsed = lombaSchema.safeParse(input);
  if (!parsed.success) return fail(firstIssue(parsed.error));

  // Gelombang & tarif ditentukan dari jam SERVER, bukan dari browser
  const submittedAt = Date.now();
  if (submittedAt < new Date(REGISTRATION_OPEN).getTime()) {
    return fail("Pendaftaran lomba baru dibuka 12 Oktober 2026 pukul 00.00 WIB.");
  }
  const wave = FEES.find((f) => submittedAt <= new Date(f.until).getTime());
  if (!wave) return fail("Pendaftaran sudah ditutup (batas 12 November 2026 pukul 23.59 WIB).");

  const db = getServiceClient();
  if (!db) {
    console.error("SUPABASE_SERVICE_ROLE_KEY belum diisi.");
    return fail(NOT_READY);
  }
  const d = parsed.data;
  const { error } = await db.from("registrations").insert({
    id: d.id,
    nama_tim: d.nama_tim,
    nama_sekolah: d.nama_sekolah,
    kategori_lomba: d.kategori_lomba,
    kontak_whatsapp: d.anggota[0].kontak,
    jumlah_anggota: d.anggota.length,
    anggota: d.anggota,
    pendamping_nama: d.pendamping_nama,
    pendamping_kontak: d.pendamping_kontak,
    gelombang: wave.wave,
  });
  if (error) {
    console.error("Competition insert failed:", error.code, error.message);
    return fail(error.code === "23505" ? "Pendaftaran ini sudah tercatat." : SAVE_FAILED);
  }
  return { ok: true, wave: wave.wave, label: wave.label, fee: wave.fee, submittedAt };
}

// Mencatat bukti transfer setelah file terunggah ke Storage. Server memastikan file benar-benar
// ada di folder pendaftaran tersebut, dan ukuran diambil dari Storage (bukan angka dari browser).
export async function recordProof(input: unknown): Promise<{ ok: true } | Fail> {
  const parsed = proofSchema.safeParse(input);
  if (!parsed.success) return fail("Data bukti tidak valid.");
  const db = getServiceClient();
  if (!db) return fail(NOT_READY);

  const { registrationId, path } = parsed.data;
  const fileName = path.slice(registrationId.length + 1);
  const { data: files, error: listError } = await db.storage.from(PROOF_BUCKET).list(registrationId, { search: fileName, limit: 5 });
  const file = files?.find((f) => f.name === fileName);
  if (listError || !file) return fail("File bukti tidak ditemukan. Silakan unggah ulang.");

  const size = Number((file.metadata as { size?: number } | null)?.size) || parsed.data.size;
  const { error } = await db.from("payment_proofs").insert({ registration_id: registrationId, file_path: path, size_bytes: size });
  if (error) {
    console.error("Proof insert failed:", error.code, error.message);
    return fail("Bukti terunggah tetapi gagal dicatat. Hubungi Administrasi.");
  }
  return { ok: true };
}
