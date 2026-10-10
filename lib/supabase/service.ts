import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// Client SERVICE ROLE — melewati RLS. Hanya untuk Server Action form publik (setelah validasi Zod
// + Turnstile) dan tidak pernah boleh sampai ke browser:
//   - "server-only" membuat build gagal bila file ini ter-import dari client component
//   - nama env TANPA prefix NEXT_PUBLIC_ sehingga Next.js tidak pernah membundelnya ke client
let client: SupabaseClient | null = null;

export function getServiceClient(): SupabaseClient | null {
  if (process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY) {
    // Pengaman: kunci ini tidak boleh pernah diberi prefix NEXT_PUBLIC_
    throw new Error("SUPABASE_SERVICE_ROLE_KEY tidak boleh memakai prefix NEXT_PUBLIC_. Hapus variabel itu sekarang.");
  }
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  client ??= createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
  return client;
}
