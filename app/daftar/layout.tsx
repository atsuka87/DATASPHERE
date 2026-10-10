import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pendaftaran",
  description: "Daftar lomba (DataViz Challenge, Data Quiz Battle, Young Data Researcher) atau Seminar & Workshop DATASPHERE 2026.",
};

export default function Layout({ children }: LayoutProps<"/daftar">) {
  return children;
}