import "server-only";
import { z } from "zod";
import { requireStaff } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { PROOF_BUCKET } from "@/lib/proof-bucket";
import { GELOMBANG_VALUES, KATEGORI_IDS, LOMBA_STATUSES, SEMINAR_STATUSES } from "./constants";
import { LOMBA_TABS, isOverdue, needsCheck } from "./payment";

// Semua query data admin lewat sini — hanya dipanggil dari Server Component / Route Handler.
// Memakai sesi user (bukan service role), jadi RLS tetap menjadi pagar terakhir.

export interface Member {
  nama: string;
  kontak?: string;
  kelas?: string;
}

export interface ProofRow {
  id: string;
  file_path: string;
  size_bytes: number | null;
  status: string;
  created_at: string;
  updated_by_email: string | null;
  url?: string | null; // signed URL sementara (10 menit)
}

export interface LombaRow {
  id: string;
  created_at: string;
  nama_tim: string;
  nama_sekolah: string;
  kategori_lomba: string;
  kontak_whatsapp: string;
  email: string | null;
  jumlah_anggota: number;
  anggota: Member[];
  pendamping_nama: string | null;
  pendamping_kontak: string | null;
  gelombang: string | null;
  status: string;
  catatan: string | null;
  updated_at: string | null;
  updated_by_email: string | null;
  payment_proofs: ProofRow[];
  overdue?: boolean; // lewat 3 hari tanpa bukti valid (dihitung di server)
  hadir_at?: string | null; // waktu check-in (migrasi 010)
}

export interface SeminarRow {
  id: string;
  created_at: string;
  nama: string;
  asal: string;
  kontak: string;
  status: string;
  catatan: string | null;
  updated_at: string | null;
  updated_by_email: string | null;
}

// ── Filter dari URL (?q=&kategori=&status=&gelombang=) — nilai tidak valid diabaikan ──
type SearchParams = Record<string, string | string[] | undefined>;
const first = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);
const opt = <T extends z.ZodType>(schema: T, v: unknown) => {
  const r = schema.safeParse(v);
  return r.success ? (r.data as z.infer<T>) : undefined;
};
// Karakter sintaks filter PostgREST dibuang agar pencarian tidak bisa menyisipkan filter lain
const searchText = z
  .string()
  .trim()
  .max(80)
  .transform((s) => s.replace(/[,()*%\\:."']/g, " ").trim())
  .pipe(z.string().min(1));

export function parseLombaFilters(sp: SearchParams) {
  return {
    q: opt(searchText, first(sp.q)),
    kategori: opt(z.enum(KATEGORI_IDS), first(sp.kategori)),
    status: opt(z.enum(LOMBA_STATUSES), first(sp.status)),
    gelombang: opt(z.enum(GELOMBANG_VALUES), first(sp.gelombang)),
    tab: opt(z.enum(LOMBA_TABS), first(sp.tab)),
  };
}
export type LombaFilters = ReturnType<typeof parseLombaFilters>;

export function parseSeminarFilters(sp: SearchParams) {
  return {
    q: opt(searchText, first(sp.q)),
    status: opt(z.enum(SEMINAR_STATUSES), first(sp.status)),
  };
}
export type SeminarFilters = ReturnType<typeof parseSeminarFilters>;

// ── Query ──
export async function fetchLomba(f: LombaFilters, { withProofUrls = false } = {}) {
  await requireStaff();
  const supabase = await createSupabaseServerClient();
  const cols =
    "id, created_at, nama_tim, nama_sekolah, kategori_lomba, kontak_whatsapp, email, jumlah_anggota, anggota, pendamping_nama, pendamping_kontak, gelombang, status, catatan, updated_at, updated_by_email, payment_proofs(id, file_path, size_bytes, status, created_at, updated_by_email)";
  const run = (select: string) => {
    let query = supabase.from("registrations").select(select).order("created_at", { ascending: false }).limit(2000);
    if (f.kategori) query = query.eq("kategori_lomba", f.kategori);
    if (f.status) query = query.eq("status", f.status);
    if (f.gelombang) query = query.eq("gelombang", f.gelombang);
    if (f.q) query = query.or(`nama_tim.ilike.*${f.q}*,nama_sekolah.ilike.*${f.q}*,pendamping_nama.ilike.*${f.q}*`);
    return query;
  };

  // hadir_at baru ada setelah migrasi 010 — tanpa itu tetap tampil tanpa info check-in
  let { data, error } = await run(`${cols}, hadir_at`);
  if (error?.code === "42703") ({ data, error } = await run(cols));
  if (error) throw new Error(`Gagal memuat pendaftaran lomba: ${error.message}`);
  const rows = (data ?? []) as unknown as LombaRow[];
  const now = Date.now();
  rows.forEach((r) => {
    r.payment_proofs?.sort((a, b) => b.created_at.localeCompare(a.created_at));
    r.overdue = isOverdue(r, now);
  });

  if (withProofUrls) {
    const paths = rows.flatMap((r) => r.payment_proofs.map((p) => p.file_path));
    if (paths.length) {
      const { data: signed } = await supabase.storage.from(PROOF_BUCKET).createSignedUrls(paths, 600);
      const byPath = new Map((signed ?? []).map((s) => [s.path, s.signedUrl]));
      rows.forEach((r) => r.payment_proofs.forEach((p) => (p.url = byPath.get(p.file_path) ?? null)));
    }
  }
  return rows;
}

export async function fetchSeminar(f: SeminarFilters) {
  await requireStaff();
  const supabase = await createSupabaseServerClient();
  let query = supabase
    .from("seminar_registrations")
    .select("id, created_at, nama, asal, kontak, status, catatan, updated_at, updated_by_email")
    .order("created_at", { ascending: false })
    .limit(5000);
  if (f.status) query = query.eq("status", f.status);
  if (f.q) query = query.or(`nama.ilike.*${f.q}*,asal.ilike.*${f.q}*`);
  const { data, error } = await query;
  if (error) throw new Error(`Gagal memuat pendaftaran seminar: ${error.message}`);
  return (data ?? []) as SeminarRow[];
}

export type DashboardStats = Awaited<ReturnType<typeof fetchDashboardStats>>;

export async function fetchDashboardStats() {
  await requireStaff();
  const supabase = await createSupabaseServerClient();
  const [lomba, seminar] = await Promise.all([
    supabase
      .from("registrations")
      .select("id, created_at, nama_tim, nama_sekolah, kategori_lomba, status, payment_proofs(status, created_at)")
      .order("created_at", { ascending: false })
      .limit(5000),
    supabase.from("seminar_registrations").select("id", { count: "exact", head: true }),
  ]);
  if (lomba.error) throw new Error(`Gagal memuat statistik: ${lomba.error.message}`);
  const rows = lomba.data ?? [];
  const now = Date.now();

  // Kuota terisi = tim yang sudah terverifikasi (termasuk finalis), bukan semua pendaftar
  const perKategori = Object.fromEntries(
    KATEGORI_IDS.map((k) => [k, { total: 0, terverifikasi: 0, menunggu: 0, ditolak: 0 }]),
  ) as Record<string, { total: number; terverifikasi: number; menunggu: number; ditolak: number }>;
  for (const r of rows) {
    const b = perKategori[r.kategori_lomba];
    if (!b) continue;
    b.total++;
    if (r.status === "terverifikasi" || r.status === "finalis") b.terverifikasi++;
    else if (r.status === "ditolak") b.ditolak++;
    else b.menunggu++;
  }

  return {
    totalLomba: rows.length,
    totalTerverifikasi: rows.filter((r) => r.status === "terverifikasi" || r.status === "finalis").length,
    perKategori,
    totalSeminar: seminar.count ?? 0,
    perluDicek: rows.filter(needsCheck).length,
    lewatBatas: rows.filter((r) => isOverdue(r, now)).length,
    recent: rows.slice(0, 6) as Pick<LombaRow, "id" | "created_at" | "nama_tim" | "nama_sekolah" | "kategori_lomba" | "status" | "payment_proofs">[],
  };
}