import AuthCard from "@/components/admin/AuthCard";
import { safeAdminPath } from "@/lib/safe-next";
import LoginForm from "./LoginForm";

export default async function AdminLoginPage(props: PageProps<"/admin/login">) {
  const { next } = await props.searchParams;
  return (
    <AuthCard label="ADMIN PANEL" title="Masuk Panitia">
      <LoginForm next={safeAdminPath(typeof next === "string" ? next : null)} />
    </AuthCard>
  );
}
