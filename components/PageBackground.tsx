"use client";

import { usePathname } from "next/navigation";

interface PageBackgroundProps {
  glowX?: string;
  glowY?: string;
}

export default function PageBackground({
  glowX,
  glowY,
}: PageBackgroundProps) {
  const pathname = usePathname();

  // Titik glow:
  // - Hero / Beranda ("/"): geser sedikit ke kiri (35% 40%) sesuai referensi Auros
  // - Halaman lain ("/kategori", "/timeline", "/daftar", dll): dipusatkan di tengah atas (50% 20%)
  const isHome = pathname === "/";
  const activeGlowX = glowX ?? (isHome ? "35%" : "50%");
  const activeGlowY = glowY ?? (isHome ? "40%" : "20%");

  return (
    <div
      className="auros-fixed-bg"
      style={
        {
          "--bg-glow-x": activeGlowX,
          "--bg-glow-y": activeGlowY,
        } as React.CSSProperties
      }
      aria-hidden="true"
    />
  );
}
