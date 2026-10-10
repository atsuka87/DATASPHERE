-- Migration: Ukuran tim fleksibel (revisi panitia)
-- DataViz Challenge & Young Data Researcher: 1–3 anggota (ketua + anggota tambahan opsional).
-- Data Quiz Battle tetap individu. Jalankan SETELAH 003. Aman dijalankan ulang.

ALTER TABLE registrations DROP CONSTRAINT IF EXISTS registrations_ukuran_tim_check;
ALTER TABLE registrations ADD CONSTRAINT registrations_ukuran_tim_check CHECK (
  (kategori_lomba = 'quiz' AND jumlah_anggota = 1)
  OR (kategori_lomba IN ('dataviz', 'research') AND jumlah_anggota BETWEEN 1 AND 3)
) NOT VALID;
