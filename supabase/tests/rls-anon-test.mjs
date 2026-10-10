// Uji RLS dari sudut pandang publik (anon key) — jalankan: node supabase/tests/rls-anon-test.mjs
// Lulus bila: SELECT/UPDATE/DELETE/INSERT langsung dari anon key SEMUA ditolak.
// Sejak migrasi 009, pendaftaran hanya bisa masuk lewat Server Action (Turnstile + Zod + service role).
// INSERT diuji dengan data yang sengaja tidak valid, jadi kalaupun izin bocor tidak ada data tersimpan.
import { readFileSync } from "node:fs";

const env = Object.fromEntries(
  readFileSync(new URL("../../.env.local", import.meta.url), "utf8")
    .split(/\r?\n/)
    .filter((l) => /^NEXT_PUBLIC_SUPABASE_/.test(l))
    .map((l) => [l.slice(0, l.indexOf("=")), l.slice(l.indexOf("=") + 1).trim()]),
);
const URL_ = env.NEXT_PUBLIC_SUPABASE_URL;
const KEY = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const headers = { apikey: KEY, Authorization: `Bearer ${KEY}`, "Content-Type": "application/json", Prefer: "return=minimal" };

const TABLES = ["registrations", "seminar_registrations", "payment_proofs", "profiles"];
let failed = 0;

async function call(method, path, body) {
  const res = await fetch(`${URL_}/rest/v1/${path}`, { method, headers, body: body && JSON.stringify(body) });
  const text = await res.text();
  let json = null;
  try {
    json = JSON.parse(text);
  } catch {}
  return { status: res.status, json, text };
}

function report(name, ok, detail) {
  if (!ok) failed++;
  console.log(`${ok ? "PASS" : "FAIL"}  ${name.padEnd(46)} ${detail}`);
}

// Ditolak = error permission (42501) atau tabel tidak terlihat sama sekali. 200 + [] berarti hanya disaring RLS.
const denied = (r) => r.json?.code === "42501" || r.status === 401 || r.status === 403;

for (const t of TABLES) {
  const sel = await call("GET", `${t}?select=*&limit=1`);
  const missing = sel.json?.code === "PGRST205" || sel.json?.code === "42P01";
  if (missing) {
    console.log(`SKIP  ${t.padEnd(46)} tabel belum ada`);
    continue;
  }
  report(`${t}: anon SELECT ditolak`, denied(sel), `${sel.status} ${sel.json?.code ?? ""} ${sel.json?.message ?? sel.text.slice(0, 60)}`);

  const upd = await call("PATCH", `${t}?id=eq.00000000-0000-0000-0000-000000000000`, { created_at: new Date().toISOString() });
  report(`${t}: anon UPDATE ditolak`, denied(upd), `${upd.status} ${upd.json?.code ?? ""}`);

  const del = await call("DELETE", `${t}?id=eq.00000000-0000-0000-0000-000000000000`);
  report(`${t}: anon DELETE ditolak`, denied(del), `${del.status} ${del.json?.code ?? ""}`);
}

// INSERT langsung harus ditolak — form publik wajib lewat server
const ins = await call("POST", "seminar_registrations", { nama: " ", asal: "uji", kontak: "uji" });
report("seminar_registrations: anon INSERT ditolak", denied(ins), `${ins.status} ${ins.json?.code ?? ""}`);

const insLomba = await call("POST", "registrations", {
  nama_tim: "uji-rls", nama_sekolah: "uji", kategori_lomba: "tidak-valid", kontak_whatsapp: "0", jumlah_anggota: 1,
});
report("registrations: anon INSERT ditolak", denied(insLomba), `${insLomba.status} ${insLomba.json?.code ?? ""}`);

const insProof = await call("POST", "payment_proofs", {
  registration_id: "00000000-0000-4000-8000-000000000000", file_path: "x", size_bytes: 1,
});
report("payment_proofs: anon INSERT ditolak", denied(insProof), `${insProof.status} ${insProof.json?.code ?? ""}`);

// Tahap 5 (008): publik tidak boleh mengisi kolom status/audit sendiri
const insStatus = await call("POST", "registrations", {
  nama_tim: "uji-rls", nama_sekolah: "uji", kategori_lomba: "tidak-valid", kontak_whatsapp: "0", jumlah_anggota: 1, status: "finalis",
});
report("registrations: anon tidak bisa set status", denied(insStatus), `${insStatus.status} ${insStatus.json?.code ?? ""}`);
const insAudit = await call("POST", "seminar_registrations", { nama: " ", asal: "uji", kontak: "uji", updated_by_email: "palsu@x.com" });
report("seminar_registrations: anon tidak bisa set audit", denied(insAudit), `${insAudit.status} ${insAudit.json?.code ?? ""}`);

console.log(failed ?`\n${failed} uji GAGAL` : "\nSemua uji lulus");
process.exit(failed ? 1 : 0);
