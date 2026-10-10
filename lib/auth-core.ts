import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";

// Bagian auth yang tidak bergantung pada next/headers — dipakai bersama oleh proxy.ts
// (cookie dari request) dan lib/auth.ts (cookie dari Server Component).

export type AppRole = "admin" | "panitia";

export interface CurrentUser {
  id: string;
  email: string;
  role: AppRole | null; // null = login, tetapi bukan panitia (tidak ada baris profiles)
}

// getUser() memvalidasi JWT ke server Supabase — jangan pakai getSession() untuk otorisasi.
export async function readCurrentUser(supabase: SupabaseClient): Promise<CurrentUser | null> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).maybeSingle();
  const role = profile?.role === "admin" || profile?.role === "panitia" ? profile.role : null;
  return { id: user.id, email: user.email ?? "", role };
}
