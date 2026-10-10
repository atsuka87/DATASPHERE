-- Migration: Form resmi (PRD 6.4)
-- Jalankan di Supabase SQL Editor SETELAH 001_create_registrations.sql.
--   1. registrations         → form Lomba: simpan nama & kontak tiap anggota, email jadi opsional
--   2. seminar_registrations → form Seminar & Workshop (baru)
-- Semua tabel: publik hanya boleh INSERT, baca hanya untuk panitia (authenticated).
-- Catatan: form tidak memakai .select() setelah insert, jadi tidak butuh policy SELECT untuk anon.

-- ── 1. registrations (lomba) ──
ALTER TABLE registrations ADD COLUMN IF NOT EXISTS anggota JSONB NOT NULL DEFAULT '[]'::jsonb;
ALTER TABLE registrations ALTER COLUMN email DROP NOT NULL;

-- Ukuran tim resmi: DataViz & Young Data Researcher = 3, Data Quiz Battle = individu
ALTER TABLE registrations DROP CONSTRAINT IF EXISTS registrations_jumlah_anggota_check;
ALTER TABLE registrations DROP CONSTRAINT IF EXISTS registrations_ukuran_tim_check;
ALTER TABLE registrations ADD CONSTRAINT registrations_ukuran_tim_check CHECK (
  (kategori_lomba = 'quiz' AND jumlah_anggota = 1)
  OR (kategori_lomba IN ('dataviz', 'research') AND jumlah_anggota = 3)
) NOT VALID; -- NOT VALID: data uji lama tidak memblokir migrasi, data baru tetap dicek
ALTER TABLE registrations DROP CONSTRAINT IF EXISTS registrations_anggota_check;
ALTER TABLE registrations ADD CONSTRAINT registrations_anggota_check CHECK (
  jsonb_typeof(anggota) = 'array' AND jsonb_array_length(anggota) = jumlah_anggota
) NOT VALID;

-- ── 2. seminar_registrations ──
CREATE TABLE IF NOT EXISTS seminar_registrations (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nama        TEXT NOT NULL CHECK (length(trim(nama)) > 0),
  asal        TEXT NOT NULL CHECK (length(trim(asal)) > 0),
  kontak      TEXT NOT NULL CHECK (length(trim(kontak)) > 0),
  created_at  TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE seminar_registrations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public inserts" ON seminar_registrations;
CREATE POLICY "Allow public inserts" ON seminar_registrations
  FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated users can read" ON seminar_registrations;
CREATE POLICY "Authenticated users can read" ON seminar_registrations
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE INDEX IF NOT EXISTS idx_seminar_created ON seminar_registrations (created_at DESC);
