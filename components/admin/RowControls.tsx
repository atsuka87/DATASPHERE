"use client";

import { useState, useTransition } from "react";
import { deleteRegistration, updateNote, updateProofStatus, updateStatus, type ActionResult } from "@/app/admin/(panel)/actions";
import { STATUS_LABEL, STATUS_TONE } from "@/lib/admin/constants";

// Kontrol interaktif kecil di tabel admin. Semua perubahan lewat Server Action
// (yang mengecek role + validasi Zod); komponen ini tidak pernah query database langsung.

function useAction() {
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const run = (fn: () => Promise<ActionResult>, onOk?: () => void, onFail?: () => void) =>
    start(async () => {
      setError(null);
      const res = await fn();
      if (res.ok) onOk?.();
      else {
        setError(res.error);
        onFail?.();
      }
    });
  return { pending, error, run };
}

export function StatusBadge({ status }: { status: string }) {
  const tone = STATUS_TONE[status] ?? STATUS_TONE.menunggu;
  return (
    <span
      className={`inline-flex items-center gap-[6px] whitespace-nowrap text-[12px] leading-none px-[9px] py-[5px] rounded-full border ${tone.badge}`}
    >
      <span className={`w-[6px] h-[6px] rounded-full ${tone.dot}`} aria-hidden="true" />
      {STATUS_LABEL[status] ?? status}
    </span>
  );
}

export function StatusSelect({
  table,
  id,
  value,
  options,
}: {
  table: "lomba" | "seminar";
  id: string;
  value: string;
  options: readonly string[];
}) {
  const [current, setCurrent] = useState(value);
  const { pending, error, run } = useAction();
  return (
    <div className="flex flex-col gap-[6px]">
      <div className="flex flex-wrap gap-[6px]" role="radiogroup" aria-label="Ubah status">
        {options.map((o) => {
          const active = o === current;
          return (
            <button
              key={o}
              type="button"
              role="radio"
              aria-checked={active}
              disabled={pending || active}
              onClick={() => {
                const previous = current;
                setCurrent(o);
                // Gagal → kembalikan pilihan ke status sebelumnya
                run(() => updateStatus({ table, id, status: o }), undefined, () => setCurrent(previous));
              }}
              className={`rounded-full px-[12px] py-[6px] text-[12px] border transition-colors ${
                active
                  ? `${STATUS_TONE[o]?.badge ?? ""} font-medium cursor-default`
                  : "border-accent-primary/35 text-silver-mist hover:text-platinum hover:border-accent-secondary disabled:opacity-50"
              }`}
            >
              {STATUS_LABEL[o] ?? o}
            </button>
          );
        })}
      </div>
      {pending && <span className="text-[12px] text-silver-mist">Menyimpan…</span>}
      {error && <span className="text-[12px] text-red-300">{error}</span>}
    </div>
  );
}

export function ProofStatusButtons({ id, status }: { id: string; status: string }) {
  const { pending, error, run } = useAction();
  return (
    <div className="flex flex-wrap items-center gap-[6px]">
      <StatusBadge status={status} />
      <span className="flex-1 min-w-[8px]" />
      {status !== "terverifikasi" && (
        <button
          disabled={pending}
          onClick={() => run(() => updateProofStatus({ id, status: "terverifikasi" }))}
          className="admin-btn admin-btn-primary px-[10px] py-[5px] text-[12px]"
        >
          ✓ Verifikasi
        </button>
      )}
      {status !== "ditolak" && (
        <button
          disabled={pending}
          onClick={() => run(() => updateProofStatus({ id, status: "ditolak" }))}
          className="admin-btn px-[10px] py-[5px] text-[12px] text-red-300 border-red-400/40 hover:border-red-400"
        >
          Tolak
        </button>
      )}
      {error && <span className="w-full text-[12px] text-red-300">{error}</span>}
    </div>
  );
}

export function NoteEditor({ table, id, value }: { table: "lomba" | "seminar"; id: string; value: string | null }) {
  const [text, setText] = useState(value ?? "");
  const [saved, setSaved] = useState(false);
  const { pending, error, run } = useAction();
  const dirty = text.trim() !== (value ?? "").trim();
  return (
    <div className="flex flex-col gap-[8px]">
      <textarea
        value={text}
        onChange={(e) => {
          setText(e.target.value);
          setSaved(false);
        }}
        maxLength={1000}
        rows={3}
        placeholder="Catatan internal panitia — tidak terlihat oleh peserta"
        className="admin-field w-full resize-y min-h-[76px]"
      />
      <div className="flex items-center gap-[10px]">
        <button
          disabled={!dirty || pending}
          onClick={() => run(() => updateNote({ table, id, catatan: text }), () => setSaved(true))}
          className="admin-btn px-[12px] py-[6px] text-[12px]"
        >
          {pending ? "Menyimpan…" : "Simpan catatan"}
        </button>
        {saved && !dirty && <span className="text-[12px] text-lavender-phosphor">✓ Tersimpan</span>}
        {error && <span className="text-[12px] text-red-300">{error}</span>}
        <span className="ml-auto text-[11px] text-silver-mist/70 tabular-nums">{text.length}/1000</span>
      </div>
    </div>
  );
}

export function DeleteButton({ table, id, label }: { table: "lomba" | "seminar"; id: string; label: string }) {
  const [confirming, setConfirming] = useState(false);
  const { pending, error, run } = useAction();
  if (!confirming) {
    return (
      <button onClick={() => setConfirming(true)} className="self-start text-[12px] text-silver-mist hover:text-red-300">
        Hapus data ini…
      </button>
    );
  }
  return (
    <div className="flex flex-col gap-[8px] rounded-[var(--radius-small)] border border-red-400/40 bg-red-500/5 px-[12px] py-[10px]">
      <span className="text-[13px] text-red-200">Hapus &ldquo;{label}&rdquo; secara permanen?</span>
      <div className="flex gap-[8px]">
        <button
          disabled={pending}
          onClick={() => run(() => deleteRegistration({ table, id }))}
          className="admin-btn px-[12px] py-[6px] text-[12px] text-red-200 border-red-400/60 hover:border-red-300"
        >
          {pending ? "Menghapus…" : "Ya, hapus"}
        </button>
        <button onClick={() => setConfirming(false)} className="admin-btn px-[12px] py-[6px] text-[12px]">
          Batal
        </button>
      </div>
      {error && <span className="text-[12px] text-red-300">{error}</span>}
    </div>
  );
}
