-- Migration: Profil & role akun admin panel (Tahap 1)
-- Jalankan SETELAH 005. Aman dijalankan ulang.
--
-- Tidak ada sign-up publik. Alur membuat akun panitia:
--   1. Supabase Dashboard → Authentication → Users → "Add user" (email + password, centang Auto Confirm).
--   2. SQL Editor → beri role (ganti emailnya):
--        INSERT INTO public.profiles (id, email, role)
--        SELECT id, email, 'admin' FROM auth.users WHERE email = 'nama@contoh.com'
--        ON CONFLICT (id) DO UPDATE SET role = EXCLUDED.role;
--   Akun di auth.users TANPA baris profiles tidak bisa masuk admin panel.

-- ── 1. Enum role ──
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'app_role' AND typnamespace = 'public'::regnamespace) THEN
    CREATE TYPE public.app_role AS ENUM ('admin', 'panitia');
  END IF;
END $$;

-- ── 2. Tabel profiles (1 baris per akun panitia) ──
CREATE TABLE IF NOT EXISTS public.profiles (
  id          UUID PRIMARY KEY REFERENCES auth.users (id) ON DELETE CASCADE,
  email       TEXT NOT NULL,
  role        public.app_role NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ── 3. RLS dasar (policy staf lengkap ditambahkan di Tahap 2) ──
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Publik (anon) tidak punya akses apa pun ke profiles.
REVOKE ALL ON public.profiles FROM anon;

-- User login hanya boleh membaca baris profilnya sendiri → dipakai getCurrentUserRole().
-- Tidak ada policy INSERT/UPDATE/DELETE: role hanya bisa diubah lewat SQL Editor (bypass RLS),
-- sehingga user tidak bisa menaikkan role-nya sendiri dari API.
DROP POLICY IF EXISTS "Read own profile" ON public.profiles;
CREATE POLICY "Read own profile" ON public.profiles
  FOR SELECT TO authenticated
  USING (id = auth.uid());

NOTIFY pgrst, 'reload schema';
