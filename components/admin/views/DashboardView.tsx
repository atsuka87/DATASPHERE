import Link from "next/link";
import { PageHeader } from "@/components/admin/AdminShell";
import { StatusBadge } from "@/components/admin/RowControls";
import { KATEGORI_IDS, KATEGORI_LABEL, LOMBA_STATUSES, STATUS_LABEL, STATUS_TONE } from "@/lib/admin/constants";
import type { DashboardStats } from "@/lib/admin/data";
import { fmtDateTime } from "@/lib/admin/format";
import { QUOTA } from "@/lib/event-data";

function StatCard({ label, short, value, hint, href }: { label: string; short: string; value: number; hint: string; href: string }) {
  return (
    <Link
      href={href}
      className="admin-card p-[14px] sm:p-[20px] flex flex-col gap-[8px] sm:gap-[10px] transition-colors hover:border-accent-secondary/70 min-w-0"
    >
      <span className="text-[11px] sm:text-[12px] uppercase tracking-[0.08em] sm:tracking-[0.1em] text-silver-mist leading-[1.3]">
        <span className="sm:hidden">{short}</span>
        <span className="hidden sm:inline">{label}</span>
      </span>
      <span className="text-lavender-phosphor text-[30px] sm:text-[40px] leading-none font-medium tracking-[-0.03em] tabular-nums">{value}</span>
      <span className="hidden sm:block text-[12px] text-silver-mist">{hint} →</span>
    </Link>
  );
}

export default function DashboardView({ stats: s, email }: { stats: DashboardStats; email: string }) {
  return (
    <div className="flex flex-col gap-[28px]">
      <PageHeader eyebrow="Ringkasan" title="Dashboard" description={`Halo, ${email}. Data diperbarui setiap kali halaman dibuka.`} />

      <div className="grid grid-cols-3 gap-[10px] sm:gap-[14px]">
        <StatCard label="Pendaftar lomba" short="Lomba" value={s.totalLomba} hint="Lihat semua tim" href="/admin/pendaftaran-lomba" />
        <StatCard label="Pendaftar seminar" short="Seminar" value={s.totalSeminar} hint="Lihat peserta seminar" href="/admin/pendaftaran-seminar" />
        <StatCard label="Bukti transfer menunggu" short="Bukti baru" value={s.proofsPending} hint="Perlu diverifikasi" href="/admin/pendaftaran-lomba?status=menunggu" />
      </div>

      <section className="flex flex-col gap-[12px]">
        <h2 className="section-label text-[11px]">Per kategori lomba</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-[14px]">
          {KATEGORI_IDS.map((k) => {
            const c = s.perKategori[k];
            const quota = parseInt(QUOTA[k], 10) || 0;
            const pct = quota ? Math.min(100, Math.round((c.total / quota) * 100)) : 0;
            return (
              <Link
                key={k}
                href={`/admin/pendaftaran-lomba?kategori=${k}`}
                className="admin-card p-[20px] flex flex-col gap-[16px] transition-colors hover:border-accent-secondary/70"
              >
                <div className="flex items-start justify-between gap-[10px]">
                  <span className="text-platinum text-[16px] font-medium leading-[1.25]">{KATEGORI_LABEL[k]}</span>
                  <span className="text-lavender-phosphor text-[28px] leading-none font-medium tabular-nums">{c.total}</span>
                </div>

                <div className="flex flex-col gap-[6px]">
                  <div className="flex justify-between text-[12px] text-silver-mist">
                    <span>Kuota {QUOTA[k]}</span>
                    <span className="tabular-nums">{pct}% terisi</span>
                  </div>
                  <div className="h-[6px] rounded-full bg-liquid-deep overflow-hidden">
                    <div className="h-full rounded-full bg-[image:var(--gradient-aurora)]" style={{ width: `${pct}%` }} />
                  </div>
                </div>

                <div className="flex flex-col gap-[8px]">
                  {/* Komposisi status */}
                  <div className="flex h-[6px] rounded-full overflow-hidden bg-liquid-deep" aria-hidden="true">
                    {c.total > 0 &&
                      LOMBA_STATUSES.map((st) =>
                        c[st] ? <div key={st} className={STATUS_TONE[st].bar} style={{ width: `${(c[st] / c.total) * 100}%` }} /> : null,
                      )}
                  </div>
                  <div className="grid grid-cols-2 gap-x-[12px] gap-y-[6px] text-[12px]">
                    {LOMBA_STATUSES.map((st) => (
                      <span key={st} className="flex items-center gap-[6px] text-silver-mist">
                        <span className={`w-[7px] h-[7px] rounded-full ${STATUS_TONE[st].bar}`} />
                        {STATUS_LABEL[st]}
                        <span className="ml-auto text-platinum tabular-nums">{c[st] ?? 0}</span>
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="flex flex-col gap-[12px]">
        <div className="flex items-baseline justify-between">
          <h2 className="section-label text-[11px]">Pendaftar lomba terbaru</h2>
          <Link href="/admin/pendaftaran-lomba" className="text-[12px] text-accent-secondary hover:text-platinum">
            Lihat semua →
          </Link>
        </div>
        <div className="admin-card overflow-hidden">
          {s.recent.length === 0 ? (
            <p className="p-[20px] text-silver-mist text-[14px]">Belum ada pendaftar.</p>
          ) : (
            <ul>
              {s.recent.map((r) => (
                <li
                  key={r.id}
                  className="border-t border-accent-primary/20 first:border-t-0 px-[18px] py-[12px] grid grid-cols-[minmax(0,1fr)_auto] sm:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)_auto_auto] gap-x-[16px] gap-y-[6px] items-center"
                >
                  <div className="min-w-0">
                    <div className="text-platinum text-[14px] truncate">{r.nama_tim}</div>
                    <div className="text-silver-mist text-[12px] truncate">{r.nama_sekolah}</div>
                  </div>
                  <span className="hidden sm:block text-liquid-mist text-[13px] truncate">{KATEGORI_LABEL[r.kategori_lomba] ?? r.kategori_lomba}</span>
                  <StatusBadge status={r.status} />
                  <span className="col-span-2 sm:col-span-1 text-silver-mist text-[12px] whitespace-nowrap">{fmtDateTime(r.created_at)}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </div>
  );
}
