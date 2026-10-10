import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kategori Lomba",
  description: "DataViz Challenge, Data Quiz Battle, dan Young Data Researcher: ketentuan, kuota, dan sistem penilaian lomba DATASPHERE 2026.",
};

export default function Layout({ children }: LayoutProps<"/kategori">) {
  return children;
}