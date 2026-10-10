import type { Metadata } from "next";

// Admin panel tidak boleh diindeks mesin pencari
export const metadata: Metadata = {
  title: "Admin Panel",
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({ children }: LayoutProps<"/admin">) {
  return children;
}
