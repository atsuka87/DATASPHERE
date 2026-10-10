"use client";

import { useEffect, useState } from "react";
import QRCode from "qrcode";
import { encodeRegQr, shortRef, type RegKind } from "@/lib/registration-qr";

// QR code nomor registrasi — dibuat di browser (tanpa layanan pihak ketiga).
// Gelap di atas putih agar mudah dipindai kamera mana pun.

const QR_OPTS = { errorCorrectionLevel: "M" as const, margin: 2, color: { dark: "#01012f", light: "#ffffff" } };

// Gambar PNG untuk disimpan/dikirim via WA: QR + judul acara + nomor registrasi + nama
async function buildPng(text: string, ref: string, name: string, kindLabel: string) {
  const qr = document.createElement("canvas");
  await QRCode.toCanvas(qr, text, { ...QR_OPTS, width: 520 });
  const pad = 40;
  const canvas = document.createElement("canvas");
  canvas.width = qr.width + pad * 2;
  canvas.height = qr.height + pad * 2 + 150;
  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#01012f";
  ctx.textAlign = "center";
  ctx.font = "600 30px Arial, sans-serif";
  ctx.fillText("DATASPHERE 2026", canvas.width / 2, pad + 20);
  ctx.font = "20px Arial, sans-serif";
  ctx.fillStyle = "#023e8a";
  ctx.fillText(kindLabel, canvas.width / 2, pad + 52);
  ctx.drawImage(qr, pad, pad + 70);
  const y = pad + 70 + qr.height;
  ctx.fillStyle = "#01012f";
  ctx.font = "600 34px 'Courier New', monospace";
  ctx.fillText(ref, canvas.width / 2, y + 44);
  ctx.font = "22px Arial, sans-serif";
  ctx.fillText(name.length > 40 ? `${name.slice(0, 39)}…` : name, canvas.width / 2, y + 80);
  return canvas.toDataURL("image/png");
}

export default function RegistrationQr({
  kind,
  id,
  name,
  size = 168,
}: {
  kind: RegKind;
  id: string;
  name: string;
  size?: number;
}) {
  const [svg, setSvg] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const text = encodeRegQr(kind, id);
  const ref = shortRef(id);
  const kindLabel = kind === "lomba" ? "Peserta Lomba" : "Peserta Seminar & Workshop";

  useEffect(() => {
    let alive = true;
    QRCode.toString(text, { ...QR_OPTS, type: "svg" })
      .then((s) => alive && setSvg(s))
      .catch(() => alive && setSvg(null));
    return () => {
      alive = false;
    };
  }, [text]);

  const save = async () => {
    setSaving(true);
    try {
      const url = await buildPng(text, ref, name, kindLabel);
      const a = document.createElement("a");
      a.href = url;
      a.download = `QR-DATASPHERE-${ref}.png`;
      a.click();
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-[10px]">
      <div
        role="img"
        aria-label={`QR code nomor registrasi ${ref}`}
        className="rounded-[10px] bg-white p-[6px] [&>svg]:block [&>svg]:w-full [&>svg]:h-full"
        style={{ width: size, height: size }}
        // SVG dihasilkan library qrcode dari teks yang kita susun sendiri (bukan input pengguna)
        dangerouslySetInnerHTML={svg ? { __html: svg } : undefined}
      />
      <button
        type="button"
        onClick={save}
        disabled={!svg || saving}
        className="text-[12px] text-accent-secondary hover:text-platinum disabled:opacity-50 underline underline-offset-2"
      >
        {saving ? "Menyiapkan gambar…" : "Simpan gambar QR"}
      </button>
    </div>
  );
}
