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
  // Beranda: glow di kanan, di belakang data orb 3D
  // Admin panel: glow digeser ke pojok kanan atas agar tabel/teks tetap kontras
  const isAdmin = pathname.startsWith("/admin");
  const activeGlowX = glowX ?? (isHome ? "70%" : isAdmin ? "92%" : "50%");
  const activeGlowY = glowY ?? (isHome ? "40%" : isAdmin ? "-15%" : "20%");

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
