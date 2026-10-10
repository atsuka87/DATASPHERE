import { z } from "zod";
import { CATEGORIES } from "@/lib/event-data";
import { KATEGORI_IDS } from "@/lib/admin/constants";

// Skema validasi form publik — dijalankan di SERVER (Server Action). Validasi di browser
// hanya untuk kenyamanan; yang menentukan data boleh masuk adalah skema ini.

const text = (label: string, max: number) =>
  z
    .string({ error: `${label} wajib diisi.` })
    .trim()
    .min(1, `${label} wajib diisi.`)
    .max(max, `${label} maksimal ${max} karakter.`)
    // Tolak karakter kontrol (selain spasi biasa)
    .refine((s) => !/[\u0000-\u001f\u007f]/.test(s), `${label} mengandung karakter tidak valid.`);

const phone = (label: string) =>
  z
    .string({ error: `${label} wajib diisi.` })
    .trim()
    .regex(/^\+?[0-9][0-9\s-]{7,18}$/, `${label} tidak valid (contoh: 081234567890).`);

const GRADES = ["X", "XI", "XII"] as const;

export const lombaSchema = z
  .object({
    id: z.uuid("ID pendaftaran tidak valid."),
    nama_tim: text("Nama tim/peserta", 100),
    nama_sekolah: text("Asal sekolah", 150),
    kategori_lomba: z.enum(KATEGORI_IDS, { error: "Kategori tidak valid." }),
    anggota: z
      .array(
        z.object({
          nama: text("Nama anggota", 100),
          kontak: phone("Nomor WhatsApp anggota"),
          kelas: z.enum(GRADES, { error: "Kelas tidak valid." }),
        }),
      )
      .min(1, "Minimal 1 peserta.")
      .max(3, "Maksimal 3 anggota."),
    pendamping_nama: text("Nama guru pendamping", 100),
    pendamping_kontak: phone("Nomor WhatsApp guru pendamping"),
  })
  .strict()
  .superRefine((d, ctx) => {
    const cat = CATEGORIES.find((c) => c.id === d.kategori_lomba)!;
    if (d.anggota.length > cat.maxTeam) {
      ctx.addIssue({ code: "custom", path: ["anggota"], message: `${cat.name} maksimal ${cat.maxTeam} peserta.` });
    }
    if (d.anggota.some((m) => !cat.allowedGrades.includes(m.kelas))) {
      ctx.addIssue({ code: "custom", path: ["anggota"], message: `${cat.name} hanya untuk ${cat.grades.toLowerCase()}.` });
    }
  });
export type LombaInput = z.infer<typeof lombaSchema>;

export const seminarSchema = z
  .object({
    id: z.uuid("ID pendaftaran tidak valid."),
    nama: text("Nama", 100),
    asal: text("Asal sekolah/instansi", 150),
    kontak: z
      .string({ error: "Kontak wajib diisi." })
      .trim()
      .max(120, "Kontak terlalu panjang.")
      .refine(
        (s) => /^\+?[0-9][0-9\s-]{7,18}$/.test(s) || z.email().safeParse(s).success,
        "Kontak harus nomor WhatsApp atau email yang valid.",
      ),
  })
  .strict();
export type SeminarInput = z.infer<typeof seminarSchema>;

// Bukti transfer: path wajib <registration_id>/<timestamp>.<ext>
export const proofSchema = z
  .object({
    registrationId: z.uuid(),
    path: z.string().regex(/^[0-9a-f-]{36}\/\d{10,16}\.(webp|jpg|png|pdf)$/),
    size: z.number().int().positive().max(5 * 1024 * 1024),
  })
  .strict()
  .refine((d) => d.path.startsWith(`${d.registrationId}/`), "Path tidak sesuai pendaftaran.");

export const firstIssue = (e: z.ZodError) => e.issues[0]?.message ?? "Data tidak valid.";
