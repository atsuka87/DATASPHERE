import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Jadwal Kegiatan",
  description: "Jadwal lengkap DATASPHERE 2026: pendaftaran, seminar, technical meeting, penyisihan, final, dan awarding.",
};

export default function Layout({ children }: LayoutProps<"/timeline">) {
  return children;
}