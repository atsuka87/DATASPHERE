import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pertanyaan Umum (FAQ)",
  description: "Jawaban pertanyaan seputar pendaftaran, biaya, berkas, dan teknis lomba DATASPHERE 2026.",
};

export default function Layout({ children }: LayoutProps<"/faq">) {
  return children;
}