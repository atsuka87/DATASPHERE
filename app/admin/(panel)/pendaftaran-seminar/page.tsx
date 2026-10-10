import SeminarListView from "@/components/admin/views/SeminarListView";
import { requireStaff } from "@/lib/auth";
import { fetchSeminar, parseSeminarFilters } from "@/lib/admin/data";

export default async function PendaftaranSeminarPage(props: PageProps<"/admin/pendaftaran-seminar">) {
  const user = await requireStaff();
  const filters = parseSeminarFilters(await props.searchParams);
  return <SeminarListView rows={await fetchSeminar(filters)} filters={filters} role={user.role} />;
}
