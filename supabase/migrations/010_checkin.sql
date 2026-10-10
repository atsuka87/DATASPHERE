-- 010: Check-in peserta lomba lewat scanner QR di admin panel (/admin/check-in).
-- Peserta seminar memakai status 'hadir' yang sudah ada; peserta lomba mendapat kolom
-- hadir_at (waktu check-in, mis. saat final offline). Siapa yang check-in tercatat di
-- updated_by/updated_by_email lewat trigger audit dari migrasi 008.

ALTER TABLE public.registrations
  ADD COLUMN IF NOT EXISTS hadir_at timestamptz;

-- Panitia (authenticated + is_staff lewat policy "Staff can update") boleh mengisi kolom ini saja,
-- sama seperti status & catatan (hak kolom dari migrasi 008).
GRANT UPDATE (hadir_at) ON public.registrations TO authenticated;
