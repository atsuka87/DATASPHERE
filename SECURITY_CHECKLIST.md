# Checklist Keamanan — Admin Panel DATASPHERE 2026

Centang semua sebelum admin panel dipakai di production. Uji otomatis: `node supabase/tests/rls-anon-test.mjs` (harus "Semua uji lulus").

## 1. Database Supabase
- [ ] Migrasi 001–010 sudah dijalankan berurutan di SQL Editor (009 **setelah** service role key terpasang di server).
- [ ] `rls-anon-test.mjs` lulus: anon key tidak bisa SELECT/INSERT/UPDATE/DELETE di `registrations`, `seminar_registrations`, `payment_proofs`, `profiles`.
- [ ] Table Editor → setiap tabel di schema `public` berlabel **RLS enabled** (tidak ada tabel baru tanpa RLS).
- [ ] Storage → bucket `bukti-pembayaran` berstatus **Private** (bukan Public).
- [ ] Authentication → Providers → Email: **"Allow new users to sign up" dimatikan** (akun panitia hanya dibuat manual).
- [ ] Hanya akun panitia aktif yang punya baris di `profiles`; role `admin` hanya untuk yang benar-benar perlu menghapus data.
- [ ] Panitia yang keluar: hapus usernya di Authentication → Users (baris `profiles` ikut terhapus).

## 2. Akun & login
- [ ] Satu akun per orang — tidak ada akun/password bersama.
- [ ] Password minimal 12 karakter, unik, disimpan di password manager (tanpa MFA, password adalah satu-satunya kunci).
- [ ] Authentication → Policies/Settings: minimum password length ≥ 12.
- [ ] Coba login dengan email tidak terdaftar & password salah → pesan sama: "Email atau password salah."
- [ ] Buka `/admin/dashboard` di jendela incognito → dialihkan ke `/admin/login`.
- [ ] Login dengan akun tanpa baris `profiles` → dialihkan ke `/admin/unauthorized`.
- [ ] Akun `panitia` tidak melihat tombol "Hapus data" dan tidak bisa menghapus.

## 3. Environment variable (Vercel → Settings → Environment Variables)
- [ ] `SUPABASE_SERVICE_ROLE_KEY` dan `TURNSTILE_SECRET_KEY` terisi **tanpa** prefix `NEXT_PUBLIC_`.
- [ ] Tidak ada variabel bernama `NEXT_PUBLIC_*SERVICE*` atau `NEXT_PUBLIC_*SECRET*`.
- [ ] `NEXT_PUBLIC_SITE_URL` diisi domain resmi (untuk pratinjau link & sitemap) bila tidak memakai domain bawaan Vercel.
- [ ] Cek header keamanan: `curl -I https://<domain>` → ada `X-Frame-Options: DENY` dan tidak ada `X-Powered-By`.
- [ ] `.env.local` tidak ikut ter-commit (`git status` bersih; `.gitignore` berisi `.env*`).
- [ ] Setelah deploy: DevTools → Sources/Network, cari teks `service_role` → **tidak ditemukan** di file JS.
- [ ] Bila service role key pernah bocor (chat, screenshot, commit): **Rotate** di Supabase → Project Settings → API.

## 4. Form publik
- [ ] Turnstile memakai kunci asli (bukan kunci tes `1x000…`) dan domain production terdaftar di widget Cloudflare.
- [ ] Coba kirim form lomba & seminar di production → berhasil, data muncul di admin panel.
- [ ] Coba kirim tanpa menyelesaikan Turnstile → ditolak.
- [ ] Upload bukti transfer dari form → file muncul di admin panel & bisa dibuka.

## 5. Admin panel
- [ ] Ubah status satu pendaftar → muncul "Diubah … oleh <email>" (audit trail jalan).
- [ ] Export CSV hanya bisa diunduh saat login (coba buka `/admin/export/lomba` di incognito → dialihkan ke login).
- [ ] File CSV hasil export disimpan di drive panitia yang aksesnya terbatas (berisi nomor HP siswa — data pribadi).
- [ ] Kamera hanya diizinkan di `/admin/check-in` (header `Permissions-Policy`); halaman lain tetap `camera=()`.
- [ ] Link "Buka file" bukti transfer kedaluwarsa (±10 menit) — jangan dibagikan ke luar panitia.

## 6. Operasional
- [ ] Supabase → Database → Backups aktif (atau export CSV berkala).
- [ ] Hanya admin yang punya akses ke Supabase Dashboard & Vercel; panitia cukup admin panel.
- [ ] Setelah acara selesai: export arsip, lalu nonaktifkan/hapus akun panitia dan pertimbangkan menghapus data pribadi peserta sesuai kebijakan.
