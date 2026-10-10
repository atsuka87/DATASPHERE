"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const ICONS = {
  dashboard: (
    <path d="M3 3h6v8H3zM11 3h6v5h-6zM11 10h6v7h-6zM3 13h6v4H3z" strokeLinejoin="round" />
  ),
  lomba: (
    <path d="M6 3h8v4a4 4 0 0 1-8 0V3zM6 5H3v1a3 3 0 0 0 3 3M14 5h3v1a3 3 0 0 1-3 3M10 11v3M7 17h6M8 14h4" strokeLinecap="round" strokeLinejoin="round" />
  ),
  seminar: (
    <path d="M4 4h12v9H4zM8 17h4M10 13v4M7 8h6M7 10h4" strokeLinecap="round" strokeLinejoin="round" />
  ),
};

export const ADMIN_LINKS = [
  { href: "/admin/dashboard", label: "Dashboard", icon: ICONS.dashboard },
  { href: "/admin/pendaftaran-lomba", label: "Pendaftaran Lomba", short: "Lomba", icon: ICONS.lomba },
  { href: "/admin/pendaftaran-seminar", label: "Pendaftaran Seminar", short: "Seminar", icon: ICONS.seminar },
];

function Icon({ children }: { children: React.ReactNode }) {
  return (
    <svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      {children}
    </svg>
  );
}

// variant "sidebar" = menu vertikal desktop, "tabs" = tab horizontal di HP/tablet
export default function AdminNav({ variant }: { variant: "sidebar" | "tabs" }) {
  const pathname = usePathname();
  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  if (variant === "tabs") {
    return (
      <nav className="no-scrollbar flex gap-[6px] overflow-x-auto" aria-label="Menu admin">
        {ADMIN_LINKS.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className={`flex items-center gap-[6px] whitespace-nowrap rounded-[var(--radius-small)] px-[12px] py-[8px] text-[13px] ${
              isActive(l.href) ? "bg-accent-primary text-white" : "text-silver-mist border border-accent-primary/30"
            }`}
          >
            <Icon>{l.icon}</Icon>
            {l.short ?? l.label}
          </Link>
        ))}
      </nav>
    );
  }

  return (
    <nav className="flex flex-col gap-[4px]" aria-label="Menu admin">
      {ADMIN_LINKS.map((l) => {
        const active = isActive(l.href);
        return (
          <Link
            key={l.href}
            href={l.href}
            aria-current={active ? "page" : undefined}
            className={`flex items-center gap-[10px] rounded-[var(--radius-small)] px-[12px] py-[10px] text-[14px] transition-colors ${
              active
                ? "bg-liquid-kelp text-platinum border border-accent-primary/50"
                : "text-silver-mist border border-transparent hover:text-platinum hover:bg-liquid-tide"
            }`}
          >
            <span className={active ? "text-accent-secondary" : ""}>
              <Icon>{l.icon}</Icon>
            </span>
            {l.label}
          </Link>
        );
      })}
    </nav>
  );
}
