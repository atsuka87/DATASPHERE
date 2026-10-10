import Link from "next/link";
import { signOut } from "@/app/admin/actions";
import type { CurrentUser } from "@/lib/auth-core";
import AdminNav from "./AdminNav";

function Brand() {
  return (
    <Link href="/admin/dashboard" className="flex items-center gap-[10px]">
      <span className="w-[30px] h-[30px] rounded-[8px] bg-[image:var(--gradient-aurora)] flex items-center justify-center text-liquid-deep text-[13px] font-medium">
        D
      </span>
      <span className="flex flex-col leading-none gap-[3px]">
        <span className="text-platinum text-[14px] font-medium tracking-[0.06em]">DATASPHERE</span>
        <span className="text-[10px] tracking-[0.16em] uppercase text-lavender-phosphor">Admin Panel</span>
      </span>
    </Link>
  );
}

function LogoutButton({ compact = false }: { compact?: boolean }) {
  return (
    <form action={signOut}>
      <button type="submit" className={`admin-btn ${compact ? "px-[10px] py-[6px] text-[12px]" : "w-full"}`}>
        Keluar
      </button>
    </form>
  );
}

// Kerangka admin: sidebar tetap di desktop (≥1024px), top bar + tab menu di HP/tablet
export default function AdminShell({ user, children }: { user: CurrentUser; children: React.ReactNode }) {
  return (
    <div className="flex-1 lg:grid lg:grid-cols-[248px_minmax(0,1fr)]">
      <aside className="hidden lg:flex flex-col gap-[28px] sticky top-0 h-screen bg-liquid-deep border-r border-accent-primary/20 px-[16px] py-[24px]">
        <div className="px-[6px]">
          <Brand />
        </div>
        <AdminNav variant="sidebar" />
        <div className="mt-auto flex flex-col gap-[12px]">
          <div className="admin-inset px-[12px] py-[10px] flex flex-col gap-[2px] min-w-0">
            <span className="text-platinum text-[13px] truncate" title={user.email}>
              {user.email}
            </span>
            <span className="text-[11px] uppercase tracking-[0.12em] text-lavender-phosphor">{user.role}</span>
          </div>
          <LogoutButton />
          <Link href="/" className="text-center text-[12px] text-silver-mist hover:text-platinum">
            ← Lihat website
          </Link>
        </div>
      </aside>

      <div className="min-w-0 flex flex-col">
        <header className="lg:hidden sticky top-0 z-40 bg-liquid-deep/95 backdrop-blur-md border-b border-accent-primary/20">
          <div className="px-[16px] sm:px-[28px] py-[12px] flex items-center justify-between gap-[12px]">
            <Brand />
            <LogoutButton compact />
          </div>
          <div className="px-[16px] sm:px-[28px] pb-[12px]">
            <AdminNav variant="tabs" />
          </div>
        </header>
        <main className="flex-1 w-full max-w-[1280px] px-[16px] sm:px-[28px] lg:px-[40px] py-[24px] sm:py-[32px] lg:py-[40px]">
          {children}
        </main>
      </div>
    </div>
  );
}

export function PageHeader({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow: string;
  title: string;
  description?: React.ReactNode;
  children?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-[14px]">
      <div className="flex flex-col gap-[8px] min-w-0">
        <span className="section-label text-[11px] text-lavender-phosphor">{eyebrow}</span>
        <h1 className="text-platinum text-[clamp(1.6rem,3vw,2.2rem)] leading-[1.05] tracking-[-0.02em]">{title}</h1>
        {description && <p className="text-silver-mist text-[14px] leading-[1.5]">{description}</p>}
      </div>
      {children && <div className="flex flex-wrap gap-[8px] flex-shrink-0">{children}</div>}
    </div>
  );
}
