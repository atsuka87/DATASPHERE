import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kontak Panitia",
  description: "Hubungi panitia DATASPHERE 2026 lewat WhatsApp, email, atau Instagram.",
};

export default function Layout({ children }: LayoutProps<"/kontak">) {
  return children;
}