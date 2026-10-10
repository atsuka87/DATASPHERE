import AdminShell from "@/components/admin/AdminShell";
import { requireStaff } from "@/lib/auth";

// Semua halaman di grup (panel) wajib staf. Ini lapis kedua setelah proxy.ts —
// tetap aman meskipun matcher proxy berubah atau terlewat.
export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const user = await requireStaff();
  return <AdminShell user={user}>{children}</AdminShell>;
}
