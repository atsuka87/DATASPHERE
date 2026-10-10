-- Migration: Field pendaftaran sesuai Rulebook DATASPHERE 2026
-- Jalankan di Supabase SQL Editor SETELAH 002_official_forms.sql. Aman dijalankan ulang.
--   - Contact person pendamping (guru/pembimbing) wajib per tim/peserta (Rulebook Bab 1 poin 6)
--   - Gelombang pendaftaran menentukan tarif (Rulebook Bab 2A)
--   - Kelas tiap peserta disimpan di dalam JSON `anggota` ({ nama, kontak, kelas })

ALTER TABLE registrations ADD COLUMN IF NOT EXISTS pendamping_nama TEXT;
ALTER TABLE registrations ADD COLUMN IF NOT EXISTS pendamping_kontak TEXT;
ALTER TABLE registrations ADD COLUMN IF NOT EXISTS gelombang TEXT;

ALTER TABLE registrations DROP CONSTRAINT IF EXISTS registrations_gelombang_check;
ALTER TABLE registrations ADD CONSTRAINT registrations_gelombang_check
  CHECK (gelombang IS NULL OR gelombang IN ('Gelombang I', 'Gelombang II'));

CREATE INDEX IF NOT EXISTS idx_registrations_gelombang ON registrations (gelombang);
