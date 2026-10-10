import { PageHeader } from "@/components/admin/AdminShell";
import FilterBar, { ExportButton } from "@/components/admin/FilterBar";
import { DeleteButton, NoteEditor, StatusBadge, StatusSelect } from "@/components/admin/RowControls";
import type { AppRole } from "@/lib/auth-core";
import { SEMINAR_STATUSES, STATUS_LABEL } from "@/lib/admin/constants";
import type { SeminarFilters, SeminarRow } from "@/lib/admin/data";
import { fmtDateTime, toQuery, toWa } from "@/lib/admin/format";

const COLS = "md:grid-cols-[minmax(0,1.5fr)_minmax(0,1.5fr)_minmax(0,1fr)_130px_20px]";

export default function SeminarListView({ rows, filters, role }: { rows: SeminarRow[]; filters: SeminarFilters; role: AppRole }) {
  return (
    <div className="flex flex-col gap-[20px]">
      <PageHeader
        eyebrow="Data peserta"
        title="Pendaftaran Seminar"
        description={
          <>
            <span className="text-platinum tabular-nums">{rows.length}</span> peserta · klik baris untuk ubah status kehadiran atau
            catatan.
          </>
        }
      >
        <ExportButton href={`/admin/export/seminar${toQuery(filters)}`} />
      </PageHeader>

      <FilterBar
        basePath="/admin/pendaftaran-seminar"
        q={filters.q}
        searchPlaceholder="Nama atau asal sekolah/instansi"
        selects={[
          { name: "status", label: "Status", value: filters.status, options: SEMINAR_STATUSES.map((s) => ({ value: s, label: STATUS_LABEL[s] })) },
        ]}
      />

      {rows.length === 0 ? (
        <div className="admin-card p-[32px] text-center text-silver-mist text-[14px]">Tidak ada data yang cocok dengan filter.</div>
      ) : (
        <div className="admin-card overflow-hidden">
          <div className={`hidden md:grid ${COLS} gap-[16px] px-[20px] py-[11px] bg-liquid-tide border-b border-accent-primary/25 text-[11px] uppercase tracking-[0.1em] text-silver-mist`}>
            <span>Nama</span>
            <span>Asal</span>
            <span>Kontak</span>
            <span>Status</span>
            <span />
          </div>
          {rows.map((r) => {
            const wa = toWa(r.kontak);
            return (
              <details key={r.id} className="admin-row group border-t border-accent-primary/20 first-of-type:border-t-0">
                <summary
                  className={`cursor-pointer px-[16px] sm:px-[20px] py-[13px] grid grid-cols-[minmax(0,1fr)_auto] ${COLS} gap-x-[16px] gap-y-[4px] items-center transition-colors hover:bg-liquid-tide/50 group-open:bg-liquid-tide`}
                >
                  <div className="min-w-0">
                    <div className="text-platinum text-[15px] truncate">{r.nama}</div>
                    <div className="text-silver-mist text-[12px]">{fmtDateTime(r.created_at)}</div>
                  </div>
                  <span className="md:hidden justify-self-end">
                    <StatusBadge status={r.status} />
                  </span>
                  <span className="col-span-2 md:col-span-1 text-liquid-mist text-[13px] truncate">
                    {r.asal}
                    <span className="md:hidden text-silver-mist"> · {r.kontak}</span>
                  </span>
                  <span className="hidden md:block text-silver-mist text-[13px] truncate">{r.kontak}</span>
                  <span className="hidden md:block">
                    <StatusBadge status={r.status} />
                  </span>
                  <span className="hidden md:block text-silver-mist transition-transform group-open:rotate-90" aria-hidden="true">
                    ›
                  </span>
                </summary>
                <div className="bg-liquid-tide border-t border-accent-primary/20 px-[16px] sm:px-[20px] py-[18px] grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)] gap-[22px]">
                  <section className="flex flex-col gap-[10px]">
                    <div className="flex items-baseline justify-between gap-[8px]">
                      <h3 className="text-[11px] uppercase tracking-[0.12em] text-lavender-phosphor font-medium">Kehadiran</h3>
                      <span className="text-[11px] text-silver-mist text-right">
                        {r.updated_at ? `${fmtDateTime(r.updated_at)} · ${r.updated_by_email ?? "sistem"}` : "Belum pernah diubah"}
                      </span>
                    </div>
                    <StatusSelect table="seminar" id={r.id} value={r.status} options={SEMINAR_STATUSES} />
                    <div className="flex flex-wrap items-center gap-[12px] pt-[6px]">
                      {wa && (
                        <a href={`https://wa.me/${wa}`} target="_blank" rel="noopener noreferrer" className="admin-btn px-[12px] py-[6px] text-[12px]">
                          Chat WhatsApp ↗
                        </a>
                      )}
                      {role === "admin" && <DeleteButton table="seminar" id={r.id} label={r.nama} />}
                    </div>
                  </section>
                  <section className="flex flex-col gap-[10px]">
                    <h3 className="text-[11px] uppercase tracking-[0.12em] text-lavender-phosphor font-medium">Catatan panitia</h3>
                    <NoteEditor table="seminar" id={r.id} value={r.catatan} />
                  </section>
                </div>
              </details>
            );
          })}
        </div>
      )}
    </div>
  );
}
