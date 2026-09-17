-- Migration: Create registrations table
-- Run this in your Supabase SQL Editor (https://supabase.com/dashboard → SQL Editor)

CREATE TABLE IF NOT EXISTS registrations (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nama_tim      TEXT NOT NULL,
  nama_sekolah  TEXT NOT NULL,
  kategori_lomba TEXT NOT NULL CHECK (kategori_lomba IN ('dataviz', 'quiz', 'research')),
  kontak_whatsapp TEXT NOT NULL,
  email         TEXT NOT NULL,
  jumlah_anggota INTEGER NOT NULL CHECK (jumlah_anggota >= 1 AND jumlah_anggota <= 5),
  created_at    TIMESTAMPTZ DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE registrations ENABLE ROW LEVEL SECURITY;

-- Policy: anyone can insert (public registration form)
CREATE POLICY "Allow public inserts" ON registrations
  FOR INSERT
  WITH CHECK (true);

-- Policy: only authenticated users (panitia) can read
CREATE POLICY "Authenticated users can read" ON registrations
  FOR SELECT
  USING (auth.role() = 'authenticated');

-- Index for common queries
CREATE INDEX idx_registrations_kategori ON registrations (kategori_lomba);
CREATE INDEX idx_registrations_created ON registrations (created_at DESC);
