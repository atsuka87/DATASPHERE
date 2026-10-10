// Validasi parameter ?next= agar tidak bisa dipakai untuk open redirect ke situs lain.
// Hanya path internal /admin/* (bukan halaman login) yang diterima. Path dinormalisasi dulu
// supaya trik seperti "/admin/../x", "//evil.com", atau "/\evil.com" tidak lolos.
export function safeAdminPath(next: string | null | undefined, fallback = "/admin/dashboard") {
  if (!next || typeof next !== "string" || next.includes("\\") || next.includes("//")) return fallback;
  let url: URL;
  try {
    url = new URL(next, "http://admin.local");
  } catch {
    return fallback;
  }
  if (url.origin !== "http://admin.local") return fallback;
  if (!url.pathname.startsWith("/admin/") || url.pathname.startsWith("/admin/login")) return fallback;
  return url.pathname + url.search;
}
