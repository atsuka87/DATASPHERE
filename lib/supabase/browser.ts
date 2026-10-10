"use client";

import { createBrowserClient } from "@supabase/ssr";

// Client auth untuk halaman login admin. Sesi disimpan di cookie
// sehingga terbaca oleh proxy.ts & Server Component. Login sengaja dari browser supaya rate limit
// Supabase Auth dihitung per IP pengunjung, bukan per IP server.
// JANGAN dipakai untuk query data pendaftar — itu hanya lewat server (Tahap 5).
let client: ReturnType<typeof createBrowserClient> | null = null;

export function getSupabaseBrowserClient() {
  client ??= createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
  return client;
}
