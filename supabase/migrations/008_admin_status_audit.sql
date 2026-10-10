-- Migration: Status pendaftaran + audit trail sederhana (Tahap 5)
-- Jalankan SETELAH 007. Aman dijalankan ulang.
--
-- Setiap tabel yang bisa diubah panitia mendapat:
--   status / catatan            → yang boleh diubah dari admin panel
--   updated_at, updated_by,     → diisi OTOMATIS oleh trigger setiap kali baris diubah,
--   updated_by_email              jadi tidak bisa dipalsukan dari aplikasi.
-- Hak kolom dipersempit: panitia hanya bisa UPDATE kolom status/catatan (bukan nama tim, kontak, dll.),
-- dan publik hanya bisa INSERT kolom-kolom formulir (tidak bisa mengisi status = 'finalis' sendiri).

-- ── 0. Fungsi trigger audit ──
CREATE OR REPLACE FUNCTION public.set_audit_fields()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = ''
AS $$
BEGIN
  NEW.updated_at := now();
  NEW.updated_by := auth.uid();                  -- NULL bila diubah lewat SQL Editor
  NEW.updated_by_email := auth.jwt() ->> 'email';
  RETURN NEW;
END;
$$;


-- ══════════════════════════════════════════════════════════════
-- 1. registrations (lomba)
--    status: menunggu → terverifikasi (berkas & bayar OK) → finalis; atau ditolak
-- ══════════════════════════════════════════════════════════════
ALTER TABLE public.registrations
  ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'menunggu',
  ADD COLUMN IF NOT EXISTS catatan TEXT,
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS updated_by UUID REFERENCES auth.users (id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS updated_by_email TEXT;

ALTER TABLE public.registrations DROP CONSTRAINT IF EXISTS registrations_status_check;
ALTER TABLE public.registrations ADD CONSTRAINT registrations_status_check
  CHECK (status IN ('menunggu', 'terverifikasi', 'finalis', 'ditolak'));
ALTER TABLE public.registrations DROP CONSTRAINT IF EXISTS registrations_catatan_check;
ALTER TABLE public.registrations ADD CONSTRAINT registrations_catatan_check
  CHECK (catatan IS NULL OR length(catatan) <= 1000);

DROP TRIGGER IF EXISTS registrations_audit ON public.registrations;
CREATE TRIGGER registrations_audit BEFORE UPDATE ON public.registrations
  FOR EACH ROW EXECUTE FUNCTION public.set_audit_fields();

-- Publik: INSERT hanya kolom formulir
REVOKE INSERT ON public.registrations FROM anon;
GRANT INSERT (id, nama_tim, nama_sekolah, kategori_lomba, kontak_whatsapp, email, jumlah_anggota,
              anggota, pendamping_nama, pendamping_kontak, gelombang)
  ON public.registrations TO anon;

-- Panitia: UPDATE hanya status & catatan (data peserta tidak bisa diubah dari panel)
REVOKE UPDATE ON public.registrations FROM authenticated;
GRANT UPDATE (status, catatan) ON public.registrations TO authenticated;

CREATE INDEX IF NOT EXISTS idx_registrations_status ON public.registrations (status);


-- ══════════════════════════════════════════════════════════════
-- 2. seminar_registrations
--    status: terdaftar → hadir; atau batal
-- ══════════════════════════════════════════════════════════════
ALTER TABLE public.seminar_registrations
  ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'terdaftar',
  ADD COLUMN IF NOT EXISTS catatan TEXT,
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS updated_by UUID REFERENCES auth.users (id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS updated_by_email TEXT;

ALTER TABLE public.seminar_registrations DROP CONSTRAINT IF EXISTS seminar_registrations_status_check;
ALTER TABLE public.seminar_registrations ADD CONSTRAINT seminar_registrations_status_check
  CHECK (status IN ('terdaftar', 'hadir', 'batal'));
ALTER TABLE public.seminar_registrations DROP CONSTRAINT IF EXISTS seminar_registrations_catatan_check;
ALTER TABLE public.seminar_registrations ADD CONSTRAINT seminar_registrations_catatan_check
  CHECK (catatan IS NULL OR length(catatan) <= 1000);

DROP TRIGGER IF EXISTS seminar_registrations_audit ON public.seminar_registrations;
CREATE TRIGGER seminar_registrations_audit BEFORE UPDATE ON public.seminar_registrations
  FOR EACH ROW EXECUTE FUNCTION public.set_audit_fields();

REVOKE INSERT ON public.seminar_registrations FROM anon;
GRANT INSERT (id, nama, asal, kontak) ON public.seminar_registrations TO anon;

REVOKE UPDATE ON public.seminar_registrations FROM authenticated;
GRANT UPDATE (status, catatan) ON public.seminar_registrations TO authenticated;


-- ══════════════════════════════════════════════════════════════
-- 3. payment_proofs — status: menunggu → terverifikasi / ditolak
-- ══════════════════════════════════════════════════════════════
ALTER TABLE public.payment_proofs
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS updated_by UUID REFERENCES auth.users (id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS updated_by_email TEXT;

DROP TRIGGER IF EXISTS payment_proofs_audit ON public.payment_proofs;
CREATE TRIGGER payment_proofs_audit BEFORE UPDATE ON public.payment_proofs
  FOR EACH ROW EXECUTE FUNCTION public.set_audit_fields();

REVOKE INSERT ON public.payment_proofs FROM anon;
GRANT INSERT (registration_id, file_path, size_bytes) ON public.payment_proofs TO anon;

REVOKE UPDATE ON public.payment_proofs FROM authenticated;
GRANT UPDATE (status) ON public.payment_proofs TO authenticated;

NOTIFY pgrst, 'reload schema';
