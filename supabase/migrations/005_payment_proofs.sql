-- Migration: Upload bukti pembayaran ke Supabase Storage
-- Jalankan SETELAH 004. Aman dijalankan ulang.
--
-- File TIDAK disimpan sebagai BLOB di tabel. File diunggah dari browser ke Storage bucket
-- `bukti-pembayaran` (private), tabel `payment_proofs` hanya menyimpan path-nya.
-- Panitia melihat file lewat Dashboard → Storage → bukti-pembayaran/<registration_id>/.

-- ── 1. Bucket private: maks. 5 MB, hanya gambar & PDF ──
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('bukti-pembayaran', 'bukti-pembayaran', false, 5242880,
        ARRAY['image/webp', 'image/jpeg', 'image/png', 'application/pdf'])
ON CONFLICT (id) DO UPDATE
  SET public = false,
      file_size_limit = EXCLUDED.file_size_limit,
      allowed_mime_types = EXCLUDED.allowed_mime_types;

-- ── 2. Cek pendaftaran ada tanpa membuka akses SELECT ke tabel registrations ──
-- SECURITY DEFINER: berjalan sebagai pemilik fungsi, jadi anon tidak perlu izin baca registrations.
CREATE OR REPLACE FUNCTION public.registration_exists(reg_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM public.registrations WHERE id = reg_id);
$$;
REVOKE ALL ON FUNCTION public.registration_exists(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.registration_exists(uuid) TO anon, authenticated;

-- ── 3. Publik hanya boleh UPLOAD ke folder milik pendaftaran yang ada ──
-- Path wajib: <registration_id>/<nama-file>. Tidak ada policy SELECT/UPDATE/DELETE untuk anon,
-- jadi file tidak bisa dilihat, ditimpa, atau dihapus dari website.
DROP POLICY IF EXISTS "Public upload bukti pembayaran" ON storage.objects;
CREATE POLICY "Public upload bukti pembayaran" ON storage.objects
  FOR INSERT TO anon, authenticated
  WITH CHECK (
    bucket_id = 'bukti-pembayaran'
    AND (storage.foldername(name))[1] ~ '^[0-9a-f-]{36}$'
    AND public.registration_exists(((storage.foldername(name))[1])::uuid)
  );

-- ── 4. Catatan bukti per pendaftaran (boleh lebih dari satu, mis. unggah ulang) ──
CREATE TABLE IF NOT EXISTS payment_proofs (
  id               UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  registration_id  UUID NOT NULL REFERENCES registrations (id) ON DELETE CASCADE,
  file_path        TEXT NOT NULL CHECK (file_path LIKE registration_id::text || '/%'),
  size_bytes       INTEGER CHECK (size_bytes > 0 AND size_bytes <= 5242880),
  status           TEXT NOT NULL DEFAULT 'menunggu' CHECK (status IN ('menunggu', 'terverifikasi', 'ditolak')),
  created_at       TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE payment_proofs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public inserts" ON payment_proofs;
CREATE POLICY "Allow public inserts" ON payment_proofs
  FOR INSERT TO anon, authenticated
  WITH CHECK (status = 'menunggu' AND public.registration_exists(registration_id));

DROP POLICY IF EXISTS "Authenticated users can read" ON payment_proofs;
CREATE POLICY "Authenticated users can read" ON payment_proofs
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE INDEX IF NOT EXISTS idx_payment_proofs_registration ON payment_proofs (registration_id);
CREATE INDEX IF NOT EXISTS idx_payment_proofs_created ON payment_proofs (created_at DESC);

NOTIFY pgrst, 'reload schema';
