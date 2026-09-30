import type { Metadata } from "next";
import { Inter } from "next/font/google";
import PageBackground from "@/components/PageBackground";
import "./globals.css";

const inter = Inter({
  variable: "--font-matter",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "DATASPHERE 2026 — Darmajaya High School Data Science Challenge & Capstone Expo",
  description:
    "Kompetisi data science untuk siswa SMA/SMK se-Lampung. Tiga kategori: DataViz Challenge, Data Quiz Battle, Young Data Researcher. Diselenggarakan oleh mahasiswa S1 Sains Data IIB Darmajaya.",
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
    <html lang="id" className={`${inter.variable} antialiased`}>
      <body className="min-h-screen flex flex-col relative">
        <PageBackground />
        {children}
      </body>
    </html>
  );
}
