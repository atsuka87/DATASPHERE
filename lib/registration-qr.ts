// Format isi QR code nomor registrasi. Hanya berisi jenis pendaftaran + ID — tanpa nama atau
// nomor HP — jadi QR yang tersebar tidak membocorkan data pribadi. Data baru terlihat saat
// dipindai panitia yang sudah login di halaman Check-in admin.
//   Contoh: DS26-L-1f0c2a9e-....  (L = lomba, S = seminar)

export type RegKind = "lomba" | "seminar";

const PREFIX = "DS26";
const CODE: Record<RegKind, string> = { lomba: "L", seminar: "S" };

export const encodeRegQr = (kind: RegKind, id: string) => `${PREFIX}-${CODE[kind]}-${id}`;

export function decodeRegQr(text: string): { kind: RegKind; id: string } | null {
  const m = /^DS26-([LS])-([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})$/i.exec(text.trim());
  if (!m) return null;
  return { kind: m[1].toUpperCase() === "L" ? "lomba" : "seminar", id: m[2].toLowerCase() };
}

// Nomor registrasi pendek yang ditampilkan ke peserta (8 karakter pertama ID)
export const shortRef = (id: string) => id.slice(0, 8).toUpperCase();
