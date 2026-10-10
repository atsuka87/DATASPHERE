import "server-only";
import { cache } from "react";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { readCurrentUser, type AppRole, type CurrentUser } from "@/lib/auth-core";

export type { AppRole, CurrentUser };

// User yang sedang login + role-nya, untuk Server Component / Server Action.
// Sengaja BUKAN "use server": fungsi ini tidak perlu jadi endpoint yang bisa dipanggil browser.
// cache() → dipanggil berkali-kali dalam satu request hanya query sekali.
export const getCurrentUser = cache(async () => readCurrentUser(await createSupabaseServerClient()));

export async function getCurrentUserRole(): Promise<AppRole | null> {
  return (await getCurrentUser())?.role ?? null;
}

// Penjaga lapis kedua (setelah proxy.ts). Dipanggil di layout admin dan WAJIB di awal setiap
// Server Action admin — Server Action bisa dipanggil langsung lewat POST, jadi jangan andalkan proxy saja.
export async function requireStaff(): Promise<CurrentUser & { role: AppRole }> {
  const user = await getCurrentUser();
  if (!user) redirect("/admin/login");
  if (!user.role) redirect("/admin/unauthorized");
  return user as CurrentUser & { role: AppRole };
}

export async function requireAdmin() {
  const user = await requireStaff();
  if (user.role !== "admin") redirect("/admin/unauthorized");
  return user;
}
