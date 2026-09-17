"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
  { label: "Beranda", href: "/" },
  { label: "Kategori", href: "/kategori" },
  { label: "Timeline", href: "/timeline" },
  { label: "FAQ", href: "/faq" },
  { label: "Kontak", href: "/kontak" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-liquid-abyss/85 backdrop-blur-md border-b border-liquid-kelp/40">
      <nav className="page-container flex items-center justify-between h-[80px]">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-[12px] no-underline group">
          {/* Data Orb mark */}
          <div className="relative w-[32px] h-[32px] rounded-full flex-shrink-0 transition-transform duration-300 group-hover:scale-105">
            <div
              className="absolute inset-0 rounded-full animate-pulse-glow"
              style={{ background: "var(--gradient-bioluminescent)", opacity: 0.8 }}
            />
            <div className="absolute inset-[3px] rounded-full bg-liquid-abyss" />
            <div
              className="absolute inset-[6px] rounded-full"
              style={{ background: "var(--gradient-bioluminescent)", opacity: 0.6 }}
            />
          </div>
          <span className="text-platinum font-[var(--font-matter)] text-[20px] font-medium tracking-[0.08em] uppercase transition-colors duration-200 group-hover:text-liquid-mist">
            DATASPHERE
          </span>
        </Link>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center gap-[28px]">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`ghost-nav-link relative py-[6px] transition-all duration-200 ${
                  isActive ? "text-platinum font-medium" : "text-silver-mist hover:text-platinum"
                }`}
              >
                {link.label}
                {isActive && (
                  <span
                    className="absolute -bottom-[2px] left-0 right-0 h-[2px] rounded-full"
                    style={{ background: "var(--gradient-bioluminescent)" }}
                  />
                )}
              </Link>
            );
          })}
        </div>

        {/* Desktop CTA */}
        <div className="hidden md:block">
          <Link href="/daftar" className="gradient-pill-btn text-[13px] px-[24px] py-[12px]">
            Daftar
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden flex flex-col gap-[5px] p-[8px] bg-transparent border-none cursor-pointer"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle navigation menu"
        >
          <span
            className={`block w-[20px] h-[2px] bg-platinum transition-transform duration-200 ${
              mobileOpen ? "translate-y-[7px] rotate-45" : ""
            }`}
          />
          <span
            className={`block w-[20px] h-[2px] bg-platinum transition-opacity duration-200 ${
              mobileOpen ? "opacity-0" : ""
            }`}
          />
          <span
            className={`block w-[20px] h-[2px] bg-platinum transition-transform duration-200 ${
              mobileOpen ? "-translate-y-[7px] -rotate-45" : ""
            }`}
          />
        </button>
      </nav>

      {/* Mobile Menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 bg-liquid-abyss/98 backdrop-blur-lg ${
          mobileOpen ? "max-h-[420px] border-t border-liquid-kelp" : "max-h-0"
        }`}
      >
        <div className="page-container flex flex-col gap-[18px] py-[24px]">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`ghost-nav-link text-[15px] flex items-center justify-between ${
                  isActive ? "text-platinum font-medium" : "text-silver-mist"
                }`}
                onClick={() => setMobileOpen(false)}
              >
                <span>{link.label}</span>
                {isActive && (
                  <span className="w-[6px] h-[6px] rounded-full bg-teal-400" />
                )}
              </Link>
            );
          })}
          <Link
            href="/daftar"
            className="gradient-pill-btn text-center mt-[10px] py-[14px]"
            onClick={() => setMobileOpen(false)}
          >
            Daftar Sekarang
          </Link>
        </div>
      </div>
    </header>
  );
}
