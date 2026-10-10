import Link from "next/link";
import { PageHeader } from "@/components/admin/AdminShell";
import FilterBar, { ExportButton } from "@/components/admin/FilterBar";
import { DeleteButton, NoteEditor, PayBadge, ProofStatusButtons, StatusBadge, StatusSelect } from "@/components/admin/RowControls";
import type { AppRole } from "@/lib/auth-core";
import { GELOMBANG_LABEL, GELOMBANG_VALUES, KATEGORI_IDS, KATEGORI_LABEL, LOMBA_STATUSES } from "@/lib/admin/constants";
import type { LombaFilters, LombaRow } from "@/lib/admin/data";
import { fmtDateTime, toQuery, toWa } from "@/lib/admin/format";
import { LOMBA_TABS, PAY_DEADLINE_MS, TAB_LABEL, expectedFee, inTab, payState, tabCounts } from "@/lib/admin/payment";
import { formatBytes } from "@/lib/proof-upload";
import RegistrationQr from "@/components/RegistrationQr";

const BASE = "/admin/pendaftaran-lomba";
const COLS = "lg:grid-cols-[minmax(0,2.2fr)_minmax(0,1.2fr)_minmax(0,1.2fr)_150px_20px]";

function Phone({ value }: { value: string | null | undefined }) {
  const wa = toWa(value);
  if (!value) return <span className="text-silver-mist">—</span>;
  return wa ? (
    <a href={`https://wa.me/${wa}`} target="_blank" rel="noopener noreferrer" className="text-accent-secondary hover:text-platinum">
      {value}
    </a>
  ) : (
    <span className="text-liquid-mist">{value}</span>
  );
}

function Block({ title, children, aside }: { title: string; children: React.ReactNode; aside?: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-[10px]">
      <div className="flex items-baseline justify-between gap-[8px]">
        <h3 className="text-[13px] text-platinum font-medium">{title}</h3>
        {aside}
      </div>
      {children}
    </section>
  );
}

const box = "rounded-[var(--radius-small)] border border-accent-primary/25 bg-liquid-deep/40";

// Tab cepat dengan jumlah — mempertahankan pencarian & filter lain
function Tabs({ filters, counts }: { filters: LombaFilters; counts: Record<string, number> }) {
  const active = filters.tab ?? "semua";
  return (
    <nav aria-label="Saring cepat" className="-mx-[16px] sm:mx-0 px-[16px] sm:px-0 overflow-x-auto">
      <div className="flex gap-[6px] w-max">
        {LOMBA_TABS.map((t) => {
          const href = `${BASE}${toQuery({ ...filters, tab: t === "semua" ? undefined : t })}`;
          const on = t === active;
          return (
            <Link
              key={t}
              href={href}
              aria-current={on ? "page" : undefined}
              className={`flex items-center gap-[8px] rounded-full border px-[14px] py-[8px] text-[13px] whitespace-nowrap transition-colors ${
                on
                  ? "bg-accent-primary border-accent-primary text-platinum"
                  : "border-silver-mist/20 text-silver-mist hover:text-platinum hover:border-accent-secondary"
              }`}
            >
              {TAB_LABEL[t]}
              <span className={`tabular-nums text-[12px] ${on ? "text-liquid-mist" : "text-silver-mist/70"}`}>{counts[t]}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

function PaymentBlock({ r }: { r: LombaRow }) {
  const fee = expectedFee(r.gelombang);
  const deadline = new Date(new Date(r.created_at).getTime() + PAY_DEADLINE_MS).toISOString();
  return (
    <Block title="Pembayaran">
      <div className={`${box} px-[12px] py-[10px] grid grid-cols-2 gap-[10px] text-[13px]`}>
        <div className="flex flex-col gap-[2px]">
          <span className="text-[12px] text-silver-mist">Harus bayar</span>
          <span className="text-platinum">{fee ? `${fee.fee} · ${fee.label}` : "—"}</span>
        </div>
        <div className="flex flex-col gap-[2px]">
          <span className="text-[12px] text-silver-mist">Batas bayar</span>
          <span className={r.overdue ? "text-red-300" : "text-platinum"}>
            {fmtDateTime(deadline)}
            {r.overdue ? " · lewat" : ""}
          </span>
        </div>
      </div>
      {r.payment_proofs.length === 0 && (
        <p className="text-[13px] text-silver-mist rounded-[var(--radius-small)] border border-dashed border-accent-primary/35 px-[12px] py-[10px]">
          Belum upload bukti. Cek juga kiriman di WhatsApp Administrasi.
        </p>
      )}
      {r.payment_proofs.map((p, i) => (
        <div key={p.id} className={`${box} px-[12px] py-[12px] flex flex-col gap-[10px] ${i > 0 ? "opacity-70" : ""}`}>
          <div className="flex flex-wrap items-center justify-between gap-[8px] text-[12px]">
            <span className="text-silver-mist">
              {i === 0 ? "Bukti terbaru" : "Bukti lama"} · {fmtDateTime(p.created_at)}
              {p.size_bytes ? ` · ${formatBytes(p.size_bytes)}` : ""}
            </span>
            {p.url ? (
              <a href={p.url} target="_blank" rel="noopener noreferrer" className="admin-btn px-[12px] py-[6px] text-[12px]">
                Lihat bukti ↗
              </a>
            ) : (
              <span className="text-red-300">File tidak tersedia</span>
            )}
          </div>
          <ProofStatusButtons id={p.id} status={p.status} actions={i === 0} />
          {p.updated_by_email && <span className="text-[11px] text-silver-mist">Diperiksa oleh {p.updated_by_email}</span>}
        </div>
      ))}
    </Block>
  );
}

export default function LombaListView({ rows: all, filters, role }: { rows: LombaRow[]; filters: LombaFilters; role: AppRole }) {
  const counts = tabCounts(all);
  const rows = all.filter((r) => inTab(r, filters.tab ?? "semua"));

  return (
    <div className="flex flex-col gap-[18px]">
      <PageHeader
        eyebrow="Data peserta"
        title="Pendaftaran Lomba"
        description={
          <>
            Menampilkan <span className="text-platinum tabular-nums">{rows.length}</span> tim/peserta
            {all.length >= 2000 ? " (dibatasi 2000 — persempit pencarian)" : ""}. Klik baris untuk melihat detail.
          </>
        }
      >
        <ExportButton href={`/admin/export/lomba${toQuery(filters)}`} />
      </PageHeader>

      <Tabs filters={filters} counts={counts} />

      <FilterBar
        basePath={BASE}
        q={filters.q}
        searchPlaceholder="Nama tim, sekolah, atau guru"
        hidden={{ tab: filters.tab, status: filters.status }}
        selects={[
          { name: "kategori", label: "Lomba", value: filters.kategori, options: KATEGORI_IDS.map((k) => ({ value: k, label: KATEGORI_LABEL[k] })) },
          {
            name: "gelombang",
            label: "Gelombang",
            value: filters.gelombang,
            options: GELOMBANG_VALUES.map((g) => ({ value: g, label: GELOMBANG_LABEL[g] ?? g })),
          },
        ]}
      />

      {rows.length === 0 ? (
        <div className="admin-card p-[32px] text-center text-silver-mist text-[14px]">
          {filters.tab === "perlu-dicek" ? "Tidak ada bukti transfer yang perlu dicek." : "Tidak ada data yang cocok."}
        </div>
      ) : (
        <div className="admin-card overflow-hidden">
          <div className={`hidden lg:grid ${COLS} gap-[16px] px-[20px] py-[11px] bg-liquid-tide border-b border-accent-primary/25 text-[12px] text-silver-mist`}>
            <span>Tim / Sekolah</span>
            <span>Lomba</span>
            <span>Pembayaran</span>
            <span>Status</span>
            <span />
          </div>

          {rows.map((r) => {
            const pay = payState(r.payment_proofs);
            return (
              <details key={r.id} className="admin-row group border-t border-accent-primary/20 first-of-type:border-t-0">
                <summary
                  className={`cursor-pointer px-[16px] sm:px-[20px] py-[14px] grid grid-cols-[minmax(0,1fr)_auto] ${COLS} gap-x-[16px] gap-y-[8px] items-center transition-colors hover:bg-liquid-tide/50 group-open:bg-liquid-tide`}
                >
                  <div className="min-w-0">
                    <div className="text-platinum text-[15px] truncate">{r.nama_tim}</div>
                    <div className="text-silver-mist text-[12px] truncate">
                      {r.nama_sekolah} · <span className="whitespace-nowrap">{fmtDateTime(r.created_at)}</span>
                    </div>
                  </div>
                  <span className="lg:hidden justify-self-end">
                    <PayBadge state={pay} overdue={r.overdue} />
                  </span>
                  <span className="col-span-2 lg:col-span-1 text-[13px] text-liquid-mist">
                    {KATEGORI_LABEL[r.kategori_lomba] ?? r.kategori_lomba}
                    <span className="lg:hidden">
                      {" · "}
                      <StatusBadge status={r.status} />
                    </span>
                  </span>
                  <span className="hidden lg:block">
                    <PayBadge state={pay} overdue={r.overdue} />
                  </span>
                  <span className="hidden lg:block">
                    <StatusBadge status={r.status} />
                  </span>
                  <span className="hidden lg:block text-silver-mist transition-transform group-open:rotate-90" aria-hidden="true">
                    ›
                  </span>
                </summary>

                <div className="bg-liquid-tide border-t border-accent-primary/20 px-[16px] sm:px-[20px] py-[20px] grid grid-cols-1 xl:grid-cols-2 gap-[24px]">
                  {/* Kiri: yang paling sering dikerjakan — cek pembayaran lalu status */}
                  <div className="flex flex-col gap-[20px] min-w-0">
                    <PaymentBlock r={r} />
                    <Block
                      title="Status pendaftaran"
                      aside={
                        <span className="text-[11px] text-silver-mist text-right">
                          {r.updated_at ? `Diubah ${fmtDateTime(r.updated_at)} · ${r.updated_by_email ?? "sistem"}` : "Belum pernah diubah"}
                        </span>
                      }
                    >
                      <StatusSelect table="lomba" id={r.id} value={r.status} options={LOMBA_STATUSES} />
                    </Block>
                  </div>

                  {/* Kanan: data peserta */}
                  <div className="flex flex-col gap-[20px] min-w-0">
                    <Block title={`Anggota (${r.jumlah_anggota})`} aside={<span className="text-[12px] text-silver-mist">{r.gelombang ? GELOMBANG_LABEL[r.gelombang] ?? r.gelombang : ""}</span>}>
                      <ul className={`${box} divide-y divide-accent-primary/15`}>
                        {r.anggota.map((m, i) => (
                          <li key={i} className="px-[12px] py-[9px] flex flex-wrap items-center gap-x-[12px] gap-y-[2px] text-[13px]">
                            <span className="text-silver-mist text-[12px] w-[64px]">{i === 0 ? "Ketua" : `Anggota ${i + 1}`}</span>
                            <span className="text-platinum flex-1 min-w-[120px] truncate">{m.nama}</span>
                            <span className="text-silver-mist">{m.kelas ? `Kelas ${m.kelas}` : ""}</span>
                            <Phone value={m.kontak} />
                          </li>
                        ))}
                      </ul>
                    </Block>

                    <Block title="Guru pendamping">
                      <div className={`${box} px-[12px] py-[10px] text-[13px] flex flex-wrap justify-between gap-[8px]`}>
                        <span className="text-platinum">{r.pendamping_nama ?? "—"}</span>
                        <Phone value={r.pendamping_kontak} />
                      </div>
                    </Block>

                    <Block title="Catatan panitia">
                      <NoteEditor table="lomba" id={r.id} value={r.catatan} />
                    </Block>

                    <Block title="QR registrasi">
                      <div className="flex items-center gap-[16px]">
                        <RegistrationQr kind="lomba" id={r.id} name={r.nama_tim} size={112} />
                        <p className="text-[12px] text-silver-mist">
                          Simpan lalu kirim ke peserta lewat WA bila QR mereka hilang. Dipindai di menu Check-in.
                          {r.hadir_at ? <span className="block mt-[6px] text-lavender-phosphor">✓ Check-in {fmtDateTime(r.hadir_at)}</span> : null}
                        </p>
                      </div>
                    </Block>

                    <div className="flex flex-wrap items-center justify-between gap-[10px] pt-[10px] border-t border-accent-primary/15">
                      <span className="text-[11px] text-silver-mist/80 font-mono">No. registrasi {r.id.slice(0, 8).toUpperCase()}</span>
                      {role === "admin" && <DeleteButton table="lomba" id={r.id} label={r.nama_tim} />}
                    </div>
                  </div>
                </div>
              </details>
            );
          })}
        </div>
      )}
    </div>
  );
}
