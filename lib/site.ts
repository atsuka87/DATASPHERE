// Alamat publik website — dipakai untuk metadata (link preview), robots.txt, dan sitemap.
// Isi NEXT_PUBLIC_SITE_URL setelah domain resmi ada; di Vercel otomatis memakai domain production.
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "http://localhost:3000")
).replace(/\/$/, "");
