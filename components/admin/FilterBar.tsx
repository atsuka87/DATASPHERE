import Link from "next/link";

// Filter berbasis URL (form GET) — bisa di-bookmark/dibagikan dan tidak butuh JavaScript.
// Tombol export memakai filter yang sama.

export interface FilterSelect {
  name: string;
  label: string;
  value?: string;
  options: { value: string; label: string }[];
}

export default function FilterBar({
  basePath,
  q,
  searchPlaceholder,
  selects,
}: {
  basePath: string;
  q?: string;
  searchPlaceholder: string;
  selects: FilterSelect[];
}) {
  const active = Boolean(q) || selects.some((s) => s.value);
  return (
    <form method="get" action={basePath} className="admin-card p-[14px] sm:p-[16px] flex flex-wrap items-end gap-[10px]">
      <label className="flex flex-col gap-[6px] flex-[1_1_240px] min-w-0">
        <span className="text-[11px] uppercase tracking-[0.12em] text-silver-mist">Cari</span>
        <span className="relative">
          <svg
            viewBox="0 0 20 20"
            width="16"
            height="16"
            className="absolute left-[11px] top-1/2 -translate-y-1/2 text-silver-mist pointer-events-none"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            aria-hidden="true"
          >
            <circle cx="9" cy="9" r="5.5" />
            <path d="M13 13l4 4" strokeLinecap="round" />
          </svg>
          <input name="q" defaultValue={q ?? ""} placeholder={searchPlaceholder} className="admin-field w-full pl-[34px]" maxLength={80} />
        </span>
      </label>
      {selects.map((s) => (
        <label key={s.name} className="flex flex-col gap-[6px] flex-[1_1_150px] sm:flex-[0_1_180px] min-w-0">
          <span className="text-[11px] uppercase tracking-[0.12em] text-silver-mist">{s.label}</span>
          <select name={s.name} defaultValue={s.value ?? ""} className="admin-field w-full">
            <option value="">Semua</option>
            {s.options.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </label>
      ))}
      <div className="flex items-center gap-[8px]">
        <button type="submit" className="admin-btn admin-btn-primary py-[9px]">
          Terapkan
        </button>
        {active && (
          <Link href={basePath} className="admin-btn py-[9px]">
            Reset
          </Link>
        )}
      </div>
    </form>
  );
}

export function ExportButton({ href }: { href: string }) {
  return (
    <a href={href} download className="admin-btn">
      <svg viewBox="0 0 20 20" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
        <path d="M10 3v9M6 8l4 4 4-4M4 15h12" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      Export CSV
    </a>
  );
}
