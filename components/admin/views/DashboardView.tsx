import Link from "next/link";
import { PageHeader } from "@/components/admin/AdminShell";
import { PayBadge, StatusBadge } from "@/components/admin/RowControls";
import { KATEGORI_IDS, KATEGORI_LABEL } from "@/lib/admin/constants";
import type { DashboardStats } from "@/lib/admin/data";
import { fmtDateTime } from "@/lib/admin/format";
import { payState } from "@/lib/admin/payment";
import { QUOTA } from "@/lib/event-data";

// Dashboard sederhana: (1) apa yang perlu dikerjakan sekarang, (2) angka utama, (3) kuota per lomba, (4) pendaftar terbaru.

function ActionPanel({ perluDicek, lewatBatas }: { perluDicek: number; lewatBatas: number }) {
  if (perluDicek === 0 && lewatBatas === 0) {
    return (
      <div className="admin-card p-[20px] sm:p-[24px] flex items-center gap-[14px]">
        <span className="w-[36px] h-[36px] rounded-full border border-accent-secondary/60 text-lavender-phosphor flex items-center justify-center flex-shrink-0">
          ✓
        </span>
        <div className="flex flex-col gap-[2px]">
          <span className="text-platinum text-[16px]">Semua beres</span>
          <span className="text-silver-mist text-[13px]">Tidak ada bukti transfer yang menunggu dicek.</span>
        </div>
      </div>
    );
  }
  return (
    <div className="admin-card border-accent-secondary/60 p-[20px] sm:p-[24px] flex flex-col gap-[16px]">
      <span className="section-label text-[11px] text-lavender-phosphor">Perlu tindakan</span>
      <div className="flex flex-col sm:flex-row sm:items-center gap-[16px] sm:gap-[24px]">
        <div className="flex items-baseline gap-[12px] flex-1 min-w-0">
          <span className="text-lavender-phosphor text-[44px] leading-none font-medium tabular-nums">{perluDicek}</span>
          <span className="text-platinum text-[16px] leading-[1.35]">bukti transfer perlu dicek</span>
        </div>
        {perluDicek > 0 && (
          <Link href="/admin/pendaftaran-lomba?tab=perlu-dicek" className="gradient-pill-btn text-[13px] px-[24px] py-[12px] text-center">
            Cek sekarang →
          </Link>
        )}
      </div>
      {lewatBatas > 0 && (
        <Link
          href="/admin/pendaftaran-lomba?tab=belum-upload"
          className="admin-inset px-[14px] py-[10px] text-[13px] text-silver-mist hover:text-platinum flex flex-wrap justify-between gap-[8px]"
        >
          <span>
            <span className="text-red-300 tabular-nums">{lewatBatas} tim</span> sudah lewat 3 hari tanpa bukti transfer yang valid
          </span>
          <span className="text-accent-secondary">Lihat →</span>
        </Link>
      )}
    </div>
  );
}

function Stat({ label, value, href }: { label: string; value: number; href: string }) {
  return (
    <Link href={href} className="admin-card p-[14px] sm:p-[20px] flex flex-col gap-[8px] min-w-0 transition-colors hover:border-accent-secondary/70">
      <span className="text-[12px] sm:text-[13px] text-silver-mist leading-[1.3]">{label}</span>
      <span className="text-platinum text-[28px] sm:text-[34px] leading-none font-medium tracking-[-0.02em] tabular-nums">{value}</span>
    </Link>
  );
}

export default function DashboardView({ stats: s, email }: { stats: DashboardStats; email: string }) {
  const name = email.split("@")[0];
  return (
    <div className="flex flex-col gap-[28px]">
      <PageHeader eyebrow="Dashboard" title={`Halo, ${name}`} description="Ringkasan pendaftaran DATASPHERE 2026 saat ini." />

      <ActionPanel perluDicek={s.perluDicek} lewatBatas={s.lewatBatas} />

      <div className="grid grid-cols-3 gap-[10px] sm:gap-[14px]">
        <Stat label="Tim lomba" value={s.totalLomba} href="/admin/pendaftaran-lomba" />
        <Stat label="Terverifikasi" value={s.totalTerverifikasi} href="/admin/pendaftaran-lomba?tab=terverifikasi" />
        <Stat label="Peserta seminar" value={s.totalSeminar} href="/admin/pendaftaran-seminar" />
      </div>

      <section className="flex flex-col gap-[12px]">
        <h2 className="text-platinum text-[17px]">Kuota per lomba</h2>
        <div className="admin-card divide-y divide-accent-primary/20">
          {KATEGORI_IDS.map((k) => {
            const c = s.perKategori[k];
            const quota = parseInt(QUOTA[k], 10) || 0;
            const unit = QUOTA[k].replace(/^\d+\s*/, "");
            const pct = quota ? Math.min(100, (c.terverifikasi / quota) * 100) : 0;
            return (
              <Link
                key={k}
                href={`/admin/pendaftaran-lomba?kategori=${k}`}
                className="px-[16px] sm:px-[20px] py-[16px] grid grid-cols-1 sm:grid-cols-[200px_minmax(0,1fr)_auto] gap-x-[24px] gap-y-[8px] items-center transition-colors hover:bg-liquid-tide/50"
              >
                <span className="text-platinum text-[15px]">{KATEGORI_LABEL[k]}</span>
                <div className="flex flex-col gap-[6px] min-w-0">
                  <span className="text-[13px] text-silver-mist">
                    <span className="text-platinum tabular-nums">{c.terverifikasi}</span> dari {quota} {unit} terverifikasi
                  </span>
                  <div className="h-[8px] rounded-full bg-liquid-deep overflow-hidden">
                    <div className="h-full rounded-full bg-[image:var(--gradient-aurora)]" style={{ width: `${pct}%` }} />
                  </div>
                </div>
                <span className="text-[13px] text-silver-mist sm:text-right whitespace-nowrap">
                  {c.menunggu} menunggu · {c.total} total
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="flex flex-col gap-[12px]">
        <div className="flex items-baseline justify-between gap-[12px]">
          <h2 className="text-platinum text-[17px]">Pendaftar terbaru</h2>
          <Link href="/admin/pendaftaran-lomba" className="text-[13px] text-accent-secondary hover:text-platinum">
            Lihat semua →
          </Link>
        </div>
        <div className="admin-card overflow-hidden">
          {s.recent.length === 0 ? (
            <p className="p-[20px] text-silver-mist text-[14px]">Belum ada pendaftar.</p>
          ) : (
            <ul className="divide-y divide-accent-primary/20">
              {s.recent.map((r) => (
                <li key={r.id} className="px-[16px] sm:px-[20px] py-[12px] flex items-center gap-[12px]">
                  <div className="min-w-0 flex-1">
                    <div className="text-platinum text-[14px] truncate">{r.nama_tim}</div>
                    <div className="text-silver-mist text-[12px] truncate">
                      {KATEGORI_LABEL[r.kategori_lomba] ?? r.kategori_lomba} · {r.nama_sekolah} · {fmtDateTime(r.created_at)}
                    </div>
                  </div>
                  {r.status === "ditolak" ? <StatusBadge status="ditolak" /> : <PayBadge state={payState(r.payment_proofs)} />}
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </div>
  );
}
