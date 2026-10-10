"use client";

import { useRef, useState } from "react";
import { formatBytes, prepareProof, type PreparedProof } from "@/lib/proof-upload";

interface Props {
  value: PreparedProof | null;
  onChange: (proof: PreparedProof | null) => void;
  disabled?: boolean;
}

// Pilih/seret file bukti transfer → langsung dikompres di browser → tampil pratinjau + ukuran hemat
export default function ProofPicker({ value, onChange, disabled }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);

  const handleFile = async (file: File | undefined) => {
    if (!file) return;
    setError(null);
    setProcessing(true);
    try {
      const prepared = await prepareProof(file);
      if (value?.previewUrl) URL.revokeObjectURL(value.previewUrl);
      onChange(prepared);
    } catch (e) {
      setError(e instanceof Error ? e.message : "File tidak bisa diproses.");
    } finally {
      setProcessing(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const clear = () => {
    if (value?.previewUrl) URL.revokeObjectURL(value.previewUrl);
    onChange(null);
  };

  const saved = value ? Math.max(0, Math.round((1 - value.blob.size / value.originalBytes) * 100)) : 0;

  return (
    <div className="flex flex-col gap-[8px]">
      <input
        ref={inputRef}
        type="file"
        accept="image/*,application/pdf"
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0])}
        disabled={disabled}
      />

      {value ? (
        <div className="nested-box p-[12px] flex items-center gap-[14px]">
          {value.previewUrl ? (
            // eslint-disable-next-line @next/next/no-img-element -- object URL lokal, bukan aset statis
            <img src={value.previewUrl} alt="Pratinjau bukti transfer" className="w-[64px] h-[64px] object-cover rounded-[var(--radius-small)] border border-accent-primary/40 flex-shrink-0" />
          ) : (
            <span className="w-[64px] h-[64px] rounded-[var(--radius-small)] border border-accent-primary/40 bg-liquid-deep flex items-center justify-center text-[12px] font-mono text-lavender-phosphor flex-shrink-0">
              PDF
            </span>
          )}
          <div className="flex flex-col gap-[2px] min-w-0 flex-1">
            <span className="text-platinum text-[14px] font-medium">Bukti siap diunggah</span>
            <span className="text-silver-mist text-[12px]">
              {value.ext === "pdf" ? (
                formatBytes(value.blob.size)
              ) : (
                <>
                  {formatBytes(value.originalBytes)} → <span className="text-lavender-phosphor">{formatBytes(value.blob.size)}</span>
                  {saved > 0 && <> · hemat {saved}%</>}
                </>
              )}
            </span>
          </div>
          <div className="flex flex-col sm:flex-row gap-[6px] flex-shrink-0">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={disabled}
              className="text-[12px] text-liquid-mist px-[10px] py-[7px] rounded-[var(--radius-small)] border border-accent-primary/40 hover:border-accent-secondary"
            >
              Ganti
            </button>
            <button
              type="button"
              onClick={clear}
              disabled={disabled}
              className="text-[12px] text-red-300 px-[10px] py-[7px] rounded-[var(--radius-small)] border border-red-400/30 hover:border-red-400/60"
            >
              Hapus
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          disabled={disabled || processing}
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragOver(false);
            handleFile(e.dataTransfer.files?.[0]);
          }}
          className={`w-full rounded-[var(--radius-small)] border border-dashed px-[16px] py-[22px] flex flex-col items-center gap-[6px] text-center transition-colors ${
            dragOver ? "border-accent-secondary bg-liquid-tide" : "border-accent-secondary/50 hover:border-accent-secondary hover:bg-liquid-tide/60"
          }`}
        >
          <span className="w-[36px] h-[36px] rounded-full bg-accent-secondary/15 text-accent-secondary flex items-center justify-center text-[18px]" aria-hidden="true">
            {processing ? "…" : "↑"}
          </span>
          <span className="text-platinum text-[14px] font-medium">
            {processing ? "Memproses gambar…" : "Pilih foto/screenshot bukti transfer"}
          </span>
          <span className="text-silver-mist text-[12px]">JPG, PNG, WebP, atau PDF (maks. 2 MB) · foto otomatis dikompres</span>
        </button>
      )}

      {error && <span className="text-[12px] text-red-300">{error}</span>}
    </div>
  );
}
