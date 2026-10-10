import type { Metadata } from "next";
import { Inter } from "next/font/google";
import PageBackground from "@/components/PageBackground";
import { SITE_URL } from "@/lib/site";
import "./globals.css";

const inter = Inter({
  variable: "--font-matter",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

const DESCRIPTION =
  "Seminar & kompetisi sains data untuk siswa SMA/SMK/sederajat se-Provinsi Lampung. Tiga kategori: DataViz Challenge, Data Quiz Battle, Young Data Researcher. Diselenggarakan oleh Prodi Sains Data IIB Darmajaya.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  // Halaman lain cukup mengisi title pendek, mis. "Kategori Lomba" → "Kategori Lomba · DATASPHERE 2026"
  title: { default: "DATASPHERE 2026 — Ideas, Innovation, and Impact", template: "%s · DATASPHERE 2026" },
  description: DESCRIPTION,
  openGraph: {
    type: "website",
    locale: "id_ID",
    siteName: "DATASPHERE 2026",
    title: "DATASPHERE 2026 — Lomba & Seminar Sains Data",
    description: DESCRIPTION,
  },
  twitter: { card: "summary_large_image" },
  keywords: [
    "DATASPHERE",
    "data science",
    "kompetisi",
    "SMA",
    "SMK",
    "Darmajaya",
    "DataViz",
    "quiz",
    "penelitian data",
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    // suppressHydrationWarning: script IntroBumper menambah class "intro-seen" sebelum hydration
    <html lang="id" className={`${inter.variable} antialiased`} suppressHydrationWarning>
      <body className="min-h-screen flex flex-col relative">
        <PageBackground />
        {children}
      </body>
    </html>
  );
}
