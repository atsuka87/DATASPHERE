"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireStaff } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { KATEGORI_LABEL, STATUS_LABEL } from "@/lib/admin/constants";
import { PAY_LABEL, payState } from "@/lib/admin/payment";
import { decodeRegQr } from "@/lib/registration-qr";

// Server Action halaman Check-in. Isi QR hanya ID; data diambil di sini memakai sesi panitia (RLS berlaku).

export type CheckinInfo =
  | {
      kind: "lomba";
      id: string;
      title: string;
      subtitle: string;
      status: string;
      statusLabel: string;
      payLabel: string;
      members: string[];
      hadirAt: string | null;
      checkinReady: boolean; // false bila migrasi 010 belum dijalankan
    }
  | { kind: "seminar"; id: string; title: string; subtitle: string; status: string; statusLabel: string; hadirAt: string | null };

export type LookupResult = { ok: true; info: CheckinInfo } | { ok: false; error: string };

const MISSING_COLUMN = "42703";

export async function lookupRegistration(code: unknown): Promise<LookupResult> {
  await requireStaff();
  const decoded = typeof code === "string" ? decodeRegQr(code) : null;
  if (!decoded) return { ok: false, error: "QR bukan QR registrasi DATASPHERE 2026." };
  const supabase = await createSupabaseServerClient();

  if (decoded.kind === "seminar") {
    const { data, error } = await supabase
      .from("seminar_registrations")
      .select("id, nama, asal, status, updated_at")
      .eq("id", decoded.id)
      .maybeSingle();
    if (error) return { ok: false, error: "Gagal memuat data. Coba lagi." };
    if (!data) return { ok: false, error: "Pendaftaran seminar tidak ditemukan (mungkin sudah dihapus)." };
    return {
      ok: true,
      info: {
        kind: "seminar",
        id: data.id,
        title: data.nama,
        subtitle: `Seminar & Workshop · ${data.asal}`,
        status: data.status,
        statusLabel: STATUS_LABEL[data.status] ?? data.status,
        hadirAt: data.status === "hadir" ? data.updated_at : null,
      },
    };
  }

  const base = "id, nama_tim, nama_sekolah, kategori_lomba, status, anggota, payment_proofs(status, created_at)";
  let checkinReady = true;
  let res = await supabase.from("registrations").select(`${base}, hadir_at`).eq("id", decoded.id).maybeSingle();
  if (res.error?.code === MISSING_COLUMN) {
    checkinReady = false;
    res = await supabase.from("registrations").select(base).eq("id", decoded.id).maybeSingle();
  }
  if (res.error) return { ok: false, error: "Gagal memuat data. Coba lagi." };
  const r = res.data as {
    id: string;
    nama_tim: string;
    nama_sekolah: string;
    kategori_lomba: string;
    status: string;
    anggota: { nama: string }[];
    payment_proofs: { status: string; created_at: string }[];
    hadir_at?: string | null;
  } | null;
  if (!r) return { ok: false, error: "Pendaftaran lomba tidak ditemukan (mungkin sudah dihapus)." };
  return {
    ok: true,
    info: {
      kind: "lomba",
      id: r.id,
      title: r.nama_tim,
      subtitle: `${KATEGORI_LABEL[r.kategori_lomba] ?? r.kategori_lomba} · ${r.nama_sekolah}`,
      status: r.status,
      statusLabel: STATUS_LABEL[r.status] ?? r.status,
      payLabel: PAY_LABEL[payState(r.payment_proofs ?? [])],
      members: (r.anggota ?? []).map((m) => m.nama),
      hadirAt: r.hadir_at ?? null,
      checkinReady,
    },
  };
}

const checkinInput = z.object({ kind: z.enum(["lomba", "seminar"]), id: z.uuid() });

export async function markPresent(input: unknown): Promise<{ ok: true; at: string } | { ok: false; error: string }> {
  await requireStaff();
  const parsed = checkinInput.safeParse(input);
  if (!parsed.success) return { ok: false, error: "Data tidak valid." };
  const { kind, id } = parsed.data;
  const supabase = await createSupabaseServerClient();
  const at = new Date().toISOString();

  const { error, count } =
    kind === "seminar"
      ? await supabase.from("seminar_registrations").update({ status: "hadir" }, { count: "exact" }).eq("id", id)
      : await supabase.from("registrations").update({ hadir_at: at }, { count: "exact" }).eq("id", id);
  if (error) {
    return {
      ok: false,
      error: error.code === MISSING_COLUMN || error.code === "PGRST204" ? "Check-in lomba belum aktif: jalankan migrasi 010 di Supabase." : "Gagal menyimpan check-in.",
    };
  }
  if (!count) return { ok: false, error: "Data tidak ditemukan atau tidak punya akses." };
  revalidatePath("/admin", "layout");
  return { ok: true, at };
}
