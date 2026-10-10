import LombaListView from "@/components/admin/views/LombaListView";
import { requireStaff } from "@/lib/auth";
import { fetchLomba, parseLombaFilters } from "@/lib/admin/data";

export default async function PendaftaranLombaPage(props: PageProps<"/admin/pendaftaran-lomba">) {
  const user = await requireStaff();
  const filters = parseLombaFilters(await props.searchParams);
  const rows = await fetchLomba(filters, { withProofUrls: true });
  return <LombaListView rows={rows} filters={filters} role={user.role} />;
}
