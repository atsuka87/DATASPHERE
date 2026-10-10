import { PageHeader } from "@/components/admin/AdminShell";
import FilterBar, { ExportButton } from "@/components/admin/FilterBar";
import { DeleteButton, NoteEditor, ProofStatusButtons, StatusBadge, StatusSelect } from "@/components/admin/RowControls";
import type { AppRole } from "@/lib/auth-core";
import {
  GELOMBANG_LABEL,
  GELOMBANG_VALUES,
  KATEGORI_IDS,
  KATEGORI_LABEL,
  LOMBA_STATUSES,
  STATUS_LABEL,
} from "@/lib/admin/constants";
import type { LombaFilters, LombaRow } from "@/lib/admin/data";
import { fmtDateTime, toQuery, toWa } from "@/lib/admin/format";
import { formatBytes } from "@/lib/proof-upload";

const COLS = "lg:grid-cols-[minmax(0,2.4fr)_minmax(0,1.3fr)_100px_70px_150px_160px_20px]";

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
        <h3 className="text-[11px] uppercase tracking-[0.12em] text-lavender-phosphor font-medium">{title}</h3>
        {aside}
      </div>
      {children}
    </section>
  );
}

export default function LombaListView({ rows, filters, role }: { rows: LombaRow[]; filters: LombaFilters; role: AppRole }) {
  return (
    <div className="flex flex-col gap-[20px]">
      <PageHeader
        eyebrow="Data peserta"
        title="Pendaftaran Lomba"
        description={
          <>
            <span className="text-platinum tabular-nums">{rows.length}</span> tim/peserta
            {rows.length >= 2000 ? " (dibatasi 2000 — persempit filter)" : ""} · klik baris untuk detail, bukti transfer, dan
            ubah status.
          </>
        }
      >
        <ExportButton href={`/admin/export/lomba${toQuery(filters)}`} />
      </PageHeader>

      <FilterBar
        basePath="/admin/pendaftaran-lomba"
        q={filters.q}
        searchPlaceholder="Nama tim, sekolah, atau guru pendamping"
        selects={[
          { name: "kategori", label: "Kategori", value: filters.kategori, options: KATEGORI_IDS.map((k) => ({ value: k, label: KATEGORI_LABEL[k] })) },
          { name: "status", label: "Status", value: filters.status, options: LOMBA_STATUSES.map((s) => ({ value: s, label: STATUS_LABEL[s] })) },
          {
            name: "gelombang",
            label: "Gelombang",
            value: filters.gelombang,
            options: GELOMBANG_VALUES.map((g) => ({ value: g, label: GELOMBANG_LABEL[g] ?? g })),
          },
        ]}
      />

      {rows.length === 0 ? (
        <div className="admin-card p-[32px] text-center text-silver-mist text-[14px]">Tidak ada data yang cocok dengan filter.</div>
      ) : (
        <div className="admin-card overflow-hidden">
          <div className={`hidden lg:grid ${COLS} gap-[16px] px-[20px] py-[11px] bg-liquid-tide border-b border-accent-primary/25 text-[11px] uppercase tracking-[0.1em] text-silver-mist`}>
            <span>Tim / Sekolah</span>
            <span>Kategori</span>
            <span>Gelombang</span>
            <span>Tim</span>
            <span>Bukti transfer</span>
            <span>Status</span>
            <span />
          </div>

          {rows.map((r) => {
            const latestProof = r.payment_proofs[0];
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
                    <StatusBadge status={r.status} />
                  </span>
                  <span className="col-span-2 lg:col-span-1 text-[13px] text-liquid-mist leading-[1.45]">
                    {KATEGORI_LABEL[r.kategori_lomba] ?? r.kategori_lomba}
                    <span className="lg:hidden text-silver-mist">
                      {" · "}
                      {r.gelombang ? GELOMBANG_LABEL[r.gelombang] ?? r.gelombang : "—"} · {r.jumlah_anggota} org · bukti{" "}
                      {latestProof ? STATUS_LABEL[latestProof.status]?.toLowerCase() : "belum ada"}
                    </span>
                  </span>
                  <span className="hidden lg:block text-silver-mist text-[13px]">{r.gelombang ? GELOMBANG_LABEL[r.gelombang] ?? r.gelombang : "—"}</span>
                  <span className="hidden lg:block text-silver-mist text-[13px] tabular-nums">{r.jumlah_anggota} org</span>
                  <span className="hidden lg:block">
                    {latestProof ? <StatusBadge status={latestProof.status} /> : <span className="text-[12px] text-silver-mist/80">Belum ada</span>}
                  </span>
                  <span className="hidden lg:block">
                    <StatusBadge status={r.status} />
                  </span>
                  <span className="hidden lg:block text-silver-mist transition-transform group-open:rotate-90" aria-hidden="true">
                    ›
                  </span>
                </summary>

                <div className="bg-liquid-tide border-t border-accent-primary/20 px-[16px] sm:px-[20px] py-[20px] grid grid-cols-1 xl:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)] gap-[24px]">
                  <div className="flex flex-col gap-[20px] min-w-0">
                    <Block title={`Anggota (${r.jumlah_anggota})`}>
                      <ul className="rounded-[var(--radius-small)] border border-accent-primary/25 bg-liquid-deep/40 divide-y divide-accent-primary/15">
                        {r.anggota.map((m, i) => (
                          <li key={i} className="px-[12px] py-[9px] grid grid-cols-[72px_minmax(0,1fr)] sm:grid-cols-[72px_minmax(0,1fr)_70px_auto] gap-x-[12px] gap-y-[2px] text-[13px] items-center">
                            <span className="text-silver-mist text-[12px]">{i === 0 ? "Ketua" : `Anggota ${i + 1}`}</span>
                            <span className="text-platinum truncate">{m.nama}</span>
                            <span className="text-silver-mist col-start-2 sm:col-start-auto">{m.kelas ? `Kelas ${m.kelas}` : ""}</span>
                            <span className="col-start-2 sm:col-start-auto">
                              <Phone value={m.kontak} />
                            </span>
                          </li>
                        ))}
                      </ul>
                    </Block>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-[12px]">
                      <Block title="Guru pendamping">
                        <div className="rounded-[var(--radius-small)] border border-accent-primary/25 bg-liquid-deep/40 px-[12px] py-[10px] text-[13px] flex flex-col gap-[2px]">
                          <span className="text-platinum">{r.pendamping_nama ?? "—"}</span>
                          <Phone value={r.pendamping_kontak} />
                        </div>
                      </Block>
                      <Block title="Kontak tim">
                        <div className="rounded-[var(--radius-small)] border border-accent-primary/25 bg-liquid-deep/40 px-[12px] py-[10px] text-[13px] flex flex-col gap-[2px] min-w-0">
                          <Phone value={r.kontak_whatsapp} />
                          <span className="text-liquid-mist break-all">{r.email ?? "Email tidak diisi"}</span>
                        </div>
                      </Block>
                    </div>

                    <Block title="Catatan panitia">
                      <NoteEditor table="lomba" id={r.id} value={r.catatan} />
                    </Block>
                  </div>

                  <div className="flex flex-col gap-[20px] min-w-0">
                    <Block
                      title="Status pendaftaran"
                      aside={
                        <span className="text-[11px] text-silver-mist text-right">
                          {r.updated_at ? `${fmtDateTime(r.updated_at)} · ${r.updated_by_email ?? "sistem"}` : "Belum pernah diubah"}
                        </span>
                      }
                    >
                      <StatusSelect table="lomba" id={r.id} value={r.status} options={LOMBA_STATUSES} />
                    </Block>

                    <Block title={`Bukti transfer (${r.payment_proofs.length})`}>
                      {r.payment_proofs.length === 0 && (
                        <p className="text-[13px] text-silver-mist rounded-[var(--radius-small)] border border-dashed border-accent-primary/35 px-[12px] py-[10px]">
                          Belum mengunggah. Cek kiriman di WhatsApp Administrasi.
                        </p>
                      )}
                      {r.payment_proofs.map((p) => (
                        <div
                          key={p.id}
                          className="rounded-[var(--radius-small)] border border-accent-primary/25 bg-liquid-deep/40 px-[12px] py-[10px] flex flex-col gap-[10px]"
                        >
                          <div className="flex flex-wrap items-center justify-between gap-[8px] text-[12px]">
                            <span className="text-silver-mist">
                              {fmtDateTime(p.created_at)}
                              {p.size_bytes ? ` · ${formatBytes(p.size_bytes)}` : ""}
                            </span>
                            {p.url ? (
                              <a href={p.url} target="_blank" rel="noopener noreferrer" className="text-accent-secondary hover:text-platinum">
                                Buka file ↗
                              </a>
                            ) : (
                              <span className="text-red-300">File tidak tersedia</span>
                            )}
                          </div>
                          <ProofStatusButtons id={p.id} status={p.status} />
                          {p.updated_by_email && <span className="text-[11px] text-silver-mist">Diperiksa oleh {p.updated_by_email}</span>}
                        </div>
                      ))}
                    </Block>

                    <div className="mt-auto flex flex-col gap-[10px] pt-[4px] border-t border-accent-primary/15">
                      <span className="pt-[10px] text-[11px] text-silver-mist/80 font-mono break-all">ID {r.id}</span>
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
