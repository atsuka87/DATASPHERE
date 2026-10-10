-- Migration: Form publik wajib lewat server (Tahap 6)
-- Jalankan SETELAH 008, dan SETELAH SUPABASE_SERVICE_ROLE_KEY diisi di environment server
-- (lokal: .env.local, production: Vercel → Settings → Environment Variables). Aman dijalankan ulang.
--
-- Sebelumnya publik (anon key) boleh INSERT langsung ke tabel. Karena anon key memang terlihat di
-- browser, siapa pun bisa memanggil REST API Supabase dan melewati validasi Zod + Turnstile.
-- Sekarang insert hanya dilakukan Server Action (app/daftar/actions.ts) memakai service role,
-- SETELAH lolos Turnstile & validasi Zod di server.
--
-- Yang TETAP untuk anon: upload file bukti ke Storage (policy 007, hanya ke folder pendaftaran yang ada),
-- supaya file besar tidak perlu lewat server Next.js. Pencatatan bukti ke tabel tetap lewat server.

-- ── registrations: cabut hak & policy INSERT publik ──
REVOKE INSERT ON public.registrations FROM anon;
DROP POLICY IF EXISTS "Allow public inserts" ON public.registrations;

-- ── seminar_registrations ──
REVOKE INSERT ON public.seminar_registrations FROM anon;
DROP POLICY IF EXISTS "Allow public inserts" ON public.seminar_registrations;

-- ── payment_proofs ──
REVOKE INSERT ON public.payment_proofs FROM anon;
DROP POLICY IF EXISTS "Allow public inserts" ON public.payment_proofs;

-- Catatan: service role melewati RLS, jadi tidak butuh policy. Staf tetap memakai policy dari 007/008.

NOTIFY pgrst, 'reload schema';
