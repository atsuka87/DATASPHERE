"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireAdmin, requireStaff } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { LOMBA_STATUSES, PROOF_STATUSES, SEMINAR_STATUSES } from "@/lib/admin/constants";

// Server Action admin. Setiap action:
//   1. requireStaff()/requireAdmin() — Server Action bisa dipanggil langsung lewat POST, jadi cek di sini
//   2. validasi input dengan Zod
//   3. query memakai sesi user → RLS + hak kolom di DB tetap berlaku
// updated_by / updated_at diisi trigger di database, bukan dari sini.

export type ActionResult = { ok: true } | { ok: false; error: string };

const TABLE = { lomba: "registrations", seminar: "seminar_registrations" } as const;

const statusInput = z.discriminatedUnion("table", [
  z.object({ table: z.literal("lomba"), id: z.uuid(), status: z.enum(LOMBA_STATUSES) }),
  z.object({ table: z.literal("seminar"), id: z.uuid(), status: z.enum(SEMINAR_STATUSES) }),
]);

const fail = (error: string): ActionResult => ({ ok: false, error });

function done(): ActionResult {
  revalidatePath("/admin", "layout");
  return { ok: true };
}

export async function updateStatus(input: unknown): Promise<ActionResult> {
  await requireStaff();
  const parsed = statusInput.safeParse(input);
  if (!parsed.success) return fail("Data tidak valid.");
  const { table, id, status } = parsed.data;

  const supabase = await createSupabaseServerClient();
  const { error, count } = await supabase.from(TABLE[table]).update({ status }, { count: "exact" }).eq("id", id);
  if (error) return fail("Gagal menyimpan status.");
  if (!count) return fail("Data tidak ditemukan atau tidak punya akses.");
  return done();
}

const noteInput = z.object({
  table: z.enum(["lomba", "seminar"]),
  id: z.uuid(),
  catatan: z.string().trim().max(1000, "Catatan maksimal 1000 karakter."),
});

export async function updateNote(input: unknown): Promise<ActionResult> {
  await requireStaff();
  const parsed = noteInput.safeParse(input);
  if (!parsed.success) return fail(parsed.error.issues[0]?.message ?? "Data tidak valid.");
  const { table, id, catatan } = parsed.data;

  const supabase = await createSupabaseServerClient();
  const { error, count } = await supabase
    .from(TABLE[table])
    .update({ catatan: catatan || null }, { count: "exact" })
    .eq("id", id);
  if (error) return fail("Gagal menyimpan catatan.");
  if (!count) return fail("Data tidak ditemukan atau tidak punya akses.");
  return done();
}

const proofInput = z.object({ id: z.uuid(), status: z.enum(PROOF_STATUSES) });

export async function updateProofStatus(input: unknown): Promise<ActionResult> {
  await requireStaff();
  const parsed = proofInput.safeParse(input);
  if (!parsed.success) return fail("Data tidak valid.");

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("payment_proofs")
    .update({ status: parsed.data.status })
    .eq("id", parsed.data.id)
    .select("registration_id");
  if (error) return fail("Gagal menyimpan status bukti.");
  if (!data?.length) return fail("Bukti tidak ditemukan atau tidak punya akses.");

  // Bukti valid → pendaftaran yang masih "menunggu" otomatis jadi "terverifikasi".
  // Hanya menaikkan dari "menunggu"; finalis/ditolak tidak disentuh, dan menolak bukti tidak menurunkan status.
  if (parsed.data.status === "terverifikasi") {
    const { error: regError } = await supabase
      .from("registrations")
      .update({ status: "terverifikasi" })
      .eq("id", data[0].registration_id)
      .eq("status", "menunggu");
    if (regError) {
      revalidatePath("/admin", "layout");
      return fail("Bukti tersimpan sebagai valid, tetapi status pendaftaran gagal diubah. Ubah status secara manual.");
    }
  }
  return done();
}

const deleteInput = z.object({ table: z.enum(["lomba", "seminar"]), id: z.uuid() });

// Admin saja (panitia ditolak di sini DAN oleh policy DELETE di database)
export async function deleteRegistration(input: unknown): Promise<ActionResult> {
  await requireAdmin();
  const parsed = deleteInput.safeParse(input);
  if (!parsed.success) return fail("Data tidak valid.");

  const supabase = await createSupabaseServerClient();
  const { error, count } = await supabase.from(TABLE[parsed.data.table]).delete({ count: "exact" }).eq("id", parsed.data.id);
  if (error) return fail("Gagal menghapus data.");
  if (!count) return fail("Data tidak ditemukan atau tidak punya akses.");
  return done();
}
