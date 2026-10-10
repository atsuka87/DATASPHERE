-- Migration: Row Level Security untuk admin panel (Tahap 2)
-- Jalankan SETELAH 006. Aman dijalankan ulang.
--
-- Model akses:
--   anon (pengunjung website)            → HANYA INSERT (submit form). Tidak bisa SELECT/UPDATE/DELETE.
--   authenticated + profiles.role staf   → SELECT & UPDATE data pendaftaran; DELETE hanya role 'admin'.
--   authenticated tanpa baris profiles    → tidak punya akses apa pun (sama seperti tidak login).
-- Lapisan ganda: RLS policy + REVOKE hak tabel. Dengan REVOKE, SELECT dari anon ditolak
-- dengan error "permission denied" (bukan sekadar mengembalikan daftar kosong).

-- ── 0. Fungsi bantu pengecekan role ──
-- SECURITY DEFINER: membaca profiles sebagai pemilik fungsi, sehingga policy di tabel lain
-- (dan di profiles sendiri) tidak terkena rekursi RLS. search_path dikunci agar tidak bisa dibajak.
CREATE OR REPLACE FUNCTION public.is_staff()
RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'panitia'));
$$;

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin');
$$;

REVOKE ALL ON FUNCTION public.is_staff() FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.is_admin() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.is_staff() TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated;


-- ══════════════════════════════════════════════════════════════
-- 1. registrations (pendaftaran lomba)
-- ══════════════════════════════════════════════════════════════
ALTER TABLE public.registrations ENABLE ROW LEVEL SECURITY;

-- Hapus policy lama dari 001: "Authenticated users can read" mengizinkan SEMUA user login membaca.
DROP POLICY IF EXISTS "Authenticated users can read" ON public.registrations;
DROP POLICY IF EXISTS "Allow public inserts" ON public.registrations;

-- Hak tabel: anon hanya INSERT. (Insert dari form tidak memakai .select(), jadi tidak butuh SELECT.)
REVOKE ALL ON public.registrations FROM anon;
GRANT INSERT ON public.registrations TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.registrations TO authenticated;

-- Publik: boleh mengirim formulir pendaftaran lomba.
CREATE POLICY "Allow public inserts" ON public.registrations
  FOR INSERT TO anon
  WITH CHECK (true);

-- Staf (admin/panitia): melihat semua pendaftar lomba di dashboard.
DROP POLICY IF EXISTS "Staff can read" ON public.registrations;
CREATE POLICY "Staff can read" ON public.registrations
  FOR SELECT TO authenticated
  USING (public.is_staff());

-- Staf: mengubah data, mis. status verifikasi/lolos final (audit trail ditambahkan di Tahap 5).
DROP POLICY IF EXISTS "Staff can update" ON public.registrations;
CREATE POLICY "Staff can update" ON public.registrations
  FOR UPDATE TO authenticated
  USING (public.is_staff())
  WITH CHECK (public.is_staff());

-- Admin saja: menghapus pendaftaran (data uji/spam). Panitia tidak bisa menghapus.
DROP POLICY IF EXISTS "Admin can delete" ON public.registrations;
CREATE POLICY "Admin can delete" ON public.registrations
  FOR DELETE TO authenticated
  USING (public.is_admin());


-- ══════════════════════════════════════════════════════════════
-- 2. seminar_registrations (pendaftaran seminar & workshop)
-- ══════════════════════════════════════════════════════════════
ALTER TABLE public.seminar_registrations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Authenticated users can read" ON public.seminar_registrations;
DROP POLICY IF EXISTS "Allow public inserts" ON public.seminar_registrations;

REVOKE ALL ON public.seminar_registrations FROM anon;
GRANT INSERT ON public.seminar_registrations TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.seminar_registrations TO authenticated;

-- Publik: boleh mengirim formulir pendaftaran seminar.
CREATE POLICY "Allow public inserts" ON public.seminar_registrations
  FOR INSERT TO anon
  WITH CHECK (true);

-- Staf: melihat semua pendaftar seminar.
DROP POLICY IF EXISTS "Staff can read" ON public.seminar_registrations;
CREATE POLICY "Staff can read" ON public.seminar_registrations
  FOR SELECT TO authenticated
  USING (public.is_staff());

-- Staf: mengubah data pendaftar seminar (mis. tandai hadir).
DROP POLICY IF EXISTS "Staff can update" ON public.seminar_registrations;
CREATE POLICY "Staff can update" ON public.seminar_registrations
  FOR UPDATE TO authenticated
  USING (public.is_staff())
  WITH CHECK (public.is_staff());

-- Admin saja: menghapus pendaftar seminar.
DROP POLICY IF EXISTS "Admin can delete" ON public.seminar_registrations;
CREATE POLICY "Admin can delete" ON public.seminar_registrations
  FOR DELETE TO authenticated
  USING (public.is_admin());


-- ══════════════════════════════════════════════════════════════
-- 3. payment_proofs + file bukti di Storage (hanya bila 005 sudah dijalankan)
-- ══════════════════════════════════════════════════════════════
DO $$
BEGIN
  IF to_regclass('public.payment_proofs') IS NULL THEN
    RAISE NOTICE 'payment_proofs belum ada — jalankan 005 lalu jalankan ulang file ini.';
    RETURN;
  END IF;

  ALTER TABLE public.payment_proofs ENABLE ROW LEVEL SECURITY;
  DROP POLICY IF EXISTS "Authenticated users can read" ON public.payment_proofs;
  DROP POLICY IF EXISTS "Allow public inserts" ON public.payment_proofs;

  REVOKE ALL ON public.payment_proofs FROM anon;
  GRANT INSERT ON public.payment_proofs TO anon;
  GRANT SELECT, INSERT, UPDATE, DELETE ON public.payment_proofs TO authenticated;

  -- Publik: mencatat bukti transfer, hanya untuk pendaftaran yang ada dan berstatus awal 'menunggu'.
  CREATE POLICY "Allow public inserts" ON public.payment_proofs
    FOR INSERT TO anon
    WITH CHECK (status = 'menunggu' AND public.registration_exists(registration_id));

  -- Staf: melihat bukti transfer.
  DROP POLICY IF EXISTS "Staff can read" ON public.payment_proofs;
  CREATE POLICY "Staff can read" ON public.payment_proofs
    FOR SELECT TO authenticated USING (public.is_staff());

  -- Staf: memverifikasi/menolak bukti (ubah status).
  DROP POLICY IF EXISTS "Staff can update" ON public.payment_proofs;
  CREATE POLICY "Staff can update" ON public.payment_proofs
    FOR UPDATE TO authenticated USING (public.is_staff()) WITH CHECK (public.is_staff());

  -- Admin saja: menghapus catatan bukti.
  DROP POLICY IF EXISTS "Admin can delete" ON public.payment_proofs;
  CREATE POLICY "Admin can delete" ON public.payment_proofs
    FOR DELETE TO authenticated USING (public.is_admin());
END $$;

-- Upload publik ke Storage sebelumnya hanya diizinkan untuk anon & authenticated (005).
-- Batasi ke anon saja, dan beri staf akses MEMBACA file bukti (untuk ditampilkan di dashboard).
DROP POLICY IF EXISTS "Public upload bukti pembayaran" ON storage.objects;
CREATE POLICY "Public upload bukti pembayaran" ON storage.objects
  FOR INSERT TO anon
  WITH CHECK (
    bucket_id = 'bukti-pembayaran'
    AND (storage.foldername(name))[1] ~ '^[0-9a-f-]{36}$'
    AND public.registration_exists(((storage.foldername(name))[1])::uuid)
  );

DROP POLICY IF EXISTS "Staff read bukti pembayaran" ON storage.objects;
CREATE POLICY "Staff read bukti pembayaran" ON storage.objects
  FOR SELECT TO authenticated
  USING (bucket_id = 'bukti-pembayaran' AND public.is_staff());


-- ══════════════════════════════════════════════════════════════
-- 4. sponsor_inquiries (hanya bila tabelnya ada — saat ini tidak dipakai website)
-- ══════════════════════════════════════════════════════════════
DO $$
BEGIN
  IF to_regclass('public.sponsor_inquiries') IS NULL THEN
    RETURN;
  END IF;
  ALTER TABLE public.sponsor_inquiries ENABLE ROW LEVEL SECURITY;
  DROP POLICY IF EXISTS "Authenticated users can read" ON public.sponsor_inquiries;
  DROP POLICY IF EXISTS "Allow public inserts" ON public.sponsor_inquiries;
  REVOKE ALL ON public.sponsor_inquiries FROM anon;
  GRANT INSERT ON public.sponsor_inquiries TO anon;
  GRANT SELECT, INSERT, UPDATE, DELETE ON public.sponsor_inquiries TO authenticated;
  -- Publik: kirim inquiry sponsor.
  CREATE POLICY "Allow public inserts" ON public.sponsor_inquiries FOR INSERT TO anon WITH CHECK (true);
  -- Staf: baca & ubah status inquiry; admin: hapus.
  DROP POLICY IF EXISTS "Staff can read" ON public.sponsor_inquiries;
  CREATE POLICY "Staff can read" ON public.sponsor_inquiries FOR SELECT TO authenticated USING (public.is_staff());
  DROP POLICY IF EXISTS "Staff can update" ON public.sponsor_inquiries;
  CREATE POLICY "Staff can update" ON public.sponsor_inquiries FOR UPDATE TO authenticated
    USING (public.is_staff()) WITH CHECK (public.is_staff());
  DROP POLICY IF EXISTS "Admin can delete" ON public.sponsor_inquiries;
  CREATE POLICY "Admin can delete" ON public.sponsor_inquiries FOR DELETE TO authenticated USING (public.is_admin());
END $$;


-- ══════════════════════════════════════════════════════════════
-- 5. profiles
-- ══════════════════════════════════════════════════════════════
-- Policy "Read own profile" dari 006 tetap berlaku (user baca profil sendiri).
-- Anon: tidak punya hak apa pun. Authenticated: hanya SELECT (dibatasi policy).
-- SENGAJA tidak ada policy INSERT/UPDATE/DELETE: kalau panitia boleh UPDATE profiles,
-- ia bisa mengubah role-nya sendiri menjadi admin. Role dikelola lewat SQL Editor saja.
REVOKE ALL ON public.profiles FROM anon;
REVOKE INSERT, UPDATE, DELETE, TRUNCATE ON public.profiles FROM authenticated;
GRANT SELECT ON public.profiles TO authenticated;

-- Admin: melihat daftar semua akun panitia.
DROP POLICY IF EXISTS "Admin can read all profiles" ON public.profiles;
CREATE POLICY "Admin can read all profiles" ON public.profiles
  FOR SELECT TO authenticated
  USING (public.is_admin());

NOTIFY pgrst, 'reload schema';
