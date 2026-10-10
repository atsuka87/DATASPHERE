import { NextResponse, type NextRequest } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { GELOMBANG_LABEL, KATEGORI_LABEL, STATUS_LABEL } from "@/lib/admin/constants";
import { fetchLomba, fetchSeminar, parseLombaFilters, parseSeminarFilters } from "@/lib/admin/data";
import { fmtDateTime } from "@/lib/admin/format";

// Export CSV dengan filter yang sama seperti halaman list (?q=&kategori=&status=&gelombang=).
// Route Handler tidak melewati layout admin, jadi role dicek sendiri di sini (selain proxy.ts).

type Cell = string | number | null | undefined;

// Escape CSV + cegah "CSV injection": sel yang diawali = + - @ dibuka Excel sebagai rumus,
// jadi diberi awalan ' agar tampil sebagai teks.
function cell(v: Cell) {
  let s = v === null || v === undefined ? "" : String(v);
  if (/^[=+\-@\t\r]/.test(s)) s = `'${s}`;
  return /[",\n\r;]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

function toCsv(header: string[], rows: Cell[][]) {
  // BOM agar Excel membaca UTF-8 dengan benar
  return "﻿" + [header, ...rows].map((r) => r.map(cell).join(",")).join("\r\n");
}

export async function GET(request: NextRequest, ctx: RouteContext<"/admin/export/[type]">) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!user.role) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { type } = await ctx.params;
  const sp = Object.fromEntries(request.nextUrl.searchParams);
  const stamp = new Date().toLocaleDateString("sv-SE", { timeZone: "Asia/Jakarta" }).replace(/-/g, "");
  let csv: string;

  if (type === "lomba") {
    const rows = await fetchLomba(parseLombaFilters(sp));
    const header = [
      "ID", "Tanggal Daftar", "Nama Tim", "Sekolah", "Kategori", "Gelombang", "Jumlah Anggota",
      "Ketua", "Kelas Ketua", "Kontak Ketua",
      "Anggota 2", "Kelas Anggota 2", "Kontak Anggota 2",
      "Anggota 3", "Kelas Anggota 3", "Kontak Anggota 3",
      "Guru Pendamping", "Kontak Pendamping", "Email",
      "Status", "Bukti Transfer", "Catatan", "Diubah Pada", "Diubah Oleh",
    ];
    csv = toCsv(
      header,
      rows.map((r) => {
        const m = [0, 1, 2].flatMap((i) => [r.anggota[i]?.nama, r.anggota[i]?.kelas, r.anggota[i]?.kontak]);
        const proof = r.payment_proofs[0];
        return [
          r.id, fmtDateTime(r.created_at), r.nama_tim, r.nama_sekolah,
          KATEGORI_LABEL[r.kategori_lomba] ?? r.kategori_lomba,
          r.gelombang ? GELOMBANG_LABEL[r.gelombang] ?? r.gelombang : "", r.jumlah_anggota,
          ...m,
          r.pendamping_nama, r.pendamping_kontak, r.email,
          STATUS_LABEL[r.status] ?? r.status,
          proof ? `${STATUS_LABEL[proof.status] ?? proof.status} (${r.payment_proofs.length} file)` : "Belum ada",
          r.catatan, r.updated_at ? fmtDateTime(r.updated_at) : "", r.updated_by_email,
        ];
      }),
    );
  } else if (type === "seminar") {
    const rows = await fetchSeminar(parseSeminarFilters(sp));
    csv = toCsv(
      ["ID", "Tanggal Daftar", "Nama", "Asal", "Kontak", "Status", "Catatan", "Diubah Pada", "Diubah Oleh"],
      rows.map((r) => [
        r.id, fmtDateTime(r.created_at), r.nama, r.asal, r.kontak, STATUS_LABEL[r.status] ?? r.status,
        r.catatan, r.updated_at ? fmtDateTime(r.updated_at) : "", r.updated_by_email,
      ]),
    );
  } else {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="datasphere-${type}-${stamp}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
