import DashboardView from "@/components/admin/views/DashboardView";
import { requireStaff } from "@/lib/auth";
import { fetchDashboardStats } from "@/lib/admin/data";

export default async function DashboardPage() {
  const user = await requireStaff();
  return <DashboardView stats={await fetchDashboardStats()} email={user.email} />;
}
