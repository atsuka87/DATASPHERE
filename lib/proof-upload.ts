import { recordProof } from "@/app/daftar/actions";

// Bukti pembayaran: file diproses sebagai Blob di browser, dikompres, lalu diunggah langsung ke
// Supabase Storage (bukan disimpan sebagai BLOB di tabel). Tabel `payment_proofs` hanya menyimpan path-nya.

import { PROOF_BUCKET } from "@/lib/proof-bucket";

export { PROOF_BUCKET };
export const MAX_ORIGINAL_BYTES = 10 * 1024 * 1024; // batas file asli sebelum kompres
export const MAX_PDF_BYTES = 2 * 1024 * 1024; // PDF tidak dikompres → batas lebih ketat
const MAX_DIMENSION = 1600; // cukup tajam untuk membaca nominal & nomor rekening
const QUALITY = 0.8;

export interface PreparedProof {
  blob: Blob;
  ext: "webp" | "jpg" | "png" | "pdf";
  originalBytes: number;
  previewUrl: string | null; // object URL untuk pratinjau gambar
}

export const formatBytes = (n: number) =>
  n < 1024 * 1024 ? `${Math.max(1, Math.round(n / 1024))} KB` : `${(n / 1024 / 1024).toFixed(1)} MB`;

function canvasToBlob(canvas: HTMLCanvasElement, type: string, quality: number) {
  return new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, type, quality));
}

// Kecilkan foto (maks. 1600px) dan ubah ke WebP; fallback JPEG bila browser tidak bisa encode WebP
// (mis. Safari lama). Hasil tipikal: foto HP 3–5 MB → 150–300 KB.
async function compressImage(file: File): Promise<{ blob: Blob; ext: "webp" | "jpg" }> {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, MAX_DIMENSION / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = "#ffffff"; // PNG transparan → latar putih supaya terbaca
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();

  const webp = await canvasToBlob(canvas, "image/webp", QUALITY);
  if (webp && webp.type === "image/webp") return { blob: webp, ext: "webp" };
  const jpg = await canvasToBlob(canvas, "image/jpeg", QUALITY);
  if (!jpg) throw new Error("Gagal memproses gambar.");
  return { blob: jpg, ext: "jpg" };
}

export async function prepareProof(file: File): Promise<PreparedProof> {
  if (file.type === "application/pdf") {
    if (file.size > MAX_PDF_BYTES) throw new Error(`PDF maksimal ${formatBytes(MAX_PDF_BYTES)}. Kirim screenshot/foto saja agar lebih ringan.`);
    return { blob: file, ext: "pdf", originalBytes: file.size, previewUrl: null };
  }
  if (!file.type.startsWith("image/")) throw new Error("Format harus gambar (JPG/PNG/WebP) atau PDF.");
  if (file.size > MAX_ORIGINAL_BYTES) throw new Error(`Ukuran file maksimal ${formatBytes(MAX_ORIGINAL_BYTES)}.`);

  try {
    const { blob, ext } = await compressImage(file);
    // Bila kompresi justru lebih besar (gambar sudah kecil), pakai file asli
    if (blob.size >= file.size && (file.type === "image/png" || file.type === "image/jpeg" || file.type === "image/webp")) {
      const origExt = file.type === "image/png" ? "png" : file.type === "image/webp" ? "webp" : "jpg";
      return { blob: file, ext: origExt, originalBytes: file.size, previewUrl: URL.createObjectURL(file) };
    }
    return { blob, ext, originalBytes: file.size, previewUrl: URL.createObjectURL(blob) };
  } catch {
    throw new Error("Gambar tidak bisa dibaca. Coba screenshot ulang atau gunakan format JPG/PNG.");
  }
}

const CONTENT_TYPE: Record<PreparedProof["ext"], string> = {
  webp: "image/webp",
  jpg: "image/jpeg",
  png: "image/png",
  pdf: "application/pdf",
};

// Upload via XHR langsung ke Storage REST API supaya progres bisa ditampilkan
// (supabase-js storage.upload tidak memberi event progres).
function putObject(path: string, proof: PreparedProof, onProgress: (pct: number) => void) {
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!base || !key) return Promise.reject(new Error("Upload belum aktif."));

  return new Promise<void>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", `${base}/storage/v1/object/${PROOF_BUCKET}/${path}`);
    xhr.setRequestHeader("apikey", key);
    xhr.setRequestHeader("Authorization", `Bearer ${key}`);
    xhr.setRequestHeader("Content-Type", CONTENT_TYPE[proof.ext]);
    xhr.setRequestHeader("x-upsert", "false");
    xhr.upload.onprogress = (e) => e.lengthComputable && onProgress(Math.round((e.loaded / e.total) * 100));
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) return resolve();
      // Storage membalas 400 untuk banyak kasus — baca isi respons supaya pesannya jelas
      let detail = "";
      try {
        const body = JSON.parse(xhr.responseText) as { error?: string; message?: string };
        detail = `${body.error ?? ""} ${body.message ?? ""}`;
      } catch {
        detail = xhr.responseText;
      }
      console.error("Proof upload failed:", xhr.status, xhr.responseText);
      if (/bucket not found/i.test(detail)) return reject(new Error("Fitur upload belum aktif. Kirim bukti lewat WhatsApp Administrasi."));
      if (/row-level security|unauthorized/i.test(detail)) return reject(new Error("Upload ditolak: data pendaftaran tidak ditemukan."));
      if (/mime|content type/i.test(detail)) return reject(new Error("Format file tidak didukung. Gunakan JPG, PNG, WebP, atau PDF."));
      if (/too large|exceeded|size/i.test(detail)) return reject(new Error("File terlalu besar (maks. 5 MB)."));
      reject(new Error(`Upload gagal (${xhr.status}). Coba lagi atau kirim lewat WhatsApp Administrasi.`));
    };
    xhr.onerror = () => reject(new Error("Koneksi terputus saat upload."));
    xhr.timeout = 60_000;
    xhr.ontimeout = () => reject(new Error("Upload terlalu lama. Periksa koneksi lalu coba lagi."));
    xhr.send(proof.blob);
  });
}

// Simpan file di folder per pendaftaran: <registration_id>/<timestamp>.<ext>
// File diunggah langsung dari browser ke Storage (cepat, tanpa lewat server Next.js), lalu
// dicatat lewat Server Action yang memverifikasi file-nya benar-benar ada.
export async function uploadProof(registrationId: string, proof: PreparedProof, onProgress: (pct: number) => void) {
  const path = `${registrationId}/${Date.now()}.${proof.ext}`;
  await putObject(path, proof, onProgress);
  const res = await recordProof({ registrationId, path, size: proof.blob.size });
  if (!res.ok) throw new Error(res.error);
  return path;
}
