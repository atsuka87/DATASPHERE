"use client";

import { useCallback, useEffect, useRef, useState, useTransition } from "react";
import jsQR from "jsqr";
import { lookupRegistration, markPresent, type CheckinInfo } from "@/app/admin/(panel)/check-in/actions";
import { fmtDateTime } from "@/lib/admin/format";
import { shortRef } from "@/lib/registration-qr";

// Scanner QR check-in: kamera belakang HP → jsQR membaca frame → server mencari data pendaftar.
// Kamera hanya jalan setelah tombol ditekan, dan dimatikan saat hasil tampil / halaman ditinggal.

type CamState = "idle" | "starting" | "scanning" | "error";

function cameraError(e: unknown) {
  const name = e instanceof DOMException ? e.name : "";
  if (!window.isSecureContext) return "Kamera hanya bisa dipakai lewat HTTPS (website online) atau localhost.";
  if (name === "NotAllowedError") return "Izin kamera ditolak. Izinkan kamera untuk situs ini di pengaturan browser, lalu coba lagi.";
  if (name === "NotFoundError" || name === "OverconstrainedError") return "Kamera tidak ditemukan di perangkat ini.";
  if (name === "NotReadableError") return "Kamera sedang dipakai aplikasi lain. Tutup aplikasi tersebut lalu coba lagi.";
  return "Kamera tidak bisa dibuka. Coba muat ulang halaman.";
}

export default function QrScanner() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const rafRef = useRef<number | null>(null);
  const busyRef = useRef(false);

  const [cam, setCam] = useState<CamState>("idle");
  const [camMsg, setCamMsg] = useState<string | null>(null);
  const [info, setInfo] = useState<CheckinInfo | null>(null);
  const [lookupError, setLookupError] = useState<string | null>(null);
  const [checkin, setCheckin] = useState<{ at?: string; error?: string } | null>(null);
  const [pending, start] = useTransition();

  const stopCamera = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
  }, []);

  useEffect(() => stopCamera, [stopCamera]);

  const handleCode = (text: string) => {
    busyRef.current = true;
    stopCamera();
    setCam("idle");
    navigator.vibrate?.(80);
    start(async () => {
      const res = await lookupRegistration(text);
      if (res.ok) {
        setInfo(res.info);
        setLookupError(null);
      } else {
        setInfo(null);
        setLookupError(res.error);
      }
      busyRef.current = false;
    });
  };

  const tick = () => {
    const video = videoRef.current;
    if (!video || !streamRef.current) return;
    if (video.readyState === video.HAVE_ENOUGH_DATA && !busyRef.current) {
      // Perkecil frame agar ringan di HP; QR tetap terbaca
      const scale = Math.min(1, 640 / video.videoWidth);
      const w = Math.round(video.videoWidth * scale);
      const h = Math.round(video.videoHeight * scale);
      const canvas = (canvasRef.current ??= document.createElement("canvas"));
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d", { willReadFrequently: true });
      if (ctx) {
        ctx.drawImage(video, 0, 0, w, h);
        const found = jsQR(ctx.getImageData(0, 0, w, h).data, w, h, { inversionAttempts: "dontInvert" });
        if (found?.data) return handleCode(found.data);
      }
    }
    rafRef.current = requestAnimationFrame(tick);
  };

  const startCamera = async () => {
    setInfo(null);
    setLookupError(null);
    setCheckin(null);
    setCamMsg(null);
    setCam("starting");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: "environment" }, width: { ideal: 1280 } },
        audio: false,
      });
      streamRef.current = stream;
      const video = videoRef.current!;
      video.srcObject = stream;
      await video.play();
      setCam("scanning");
      rafRef.current = requestAnimationFrame(tick);
    } catch (e) {
      stopCamera();
      setCam("error");
      setCamMsg(cameraError(e));
    }
  };

  const doCheckin = () => {
    if (!info) return;
    start(async () => {
      const res = await markPresent({ kind: info.kind, id: info.id });
      setCheckin(res.ok ? { at: res.at } : { error: res.error });
    });
  };

  const scanning = cam === "starting" || cam === "scanning";
  const alreadyIn = Boolean(info?.hadirAt) || info?.status === "hadir";
  const warn = info && (info.status === "ditolak" || info.status === "batal");

  return (
    <div className="flex flex-col gap-[16px] max-w-[560px]">
      {/* Area kamera */}
      <div className="admin-card overflow-hidden">
        <div className={`relative bg-liquid-deep aspect-square sm:aspect-[4/3] ${scanning ? "" : "hidden"}`}>
          <video ref={videoRef} playsInline muted className="absolute inset-0 w-full h-full object-cover" />
          {/* Bingkai bidik */}
          <div className="absolute inset-[16%] rounded-[16px] border-2 border-liquid-mist/80 pointer-events-none" aria-hidden="true" />
          <span className="absolute bottom-[12px] inset-x-0 text-center text-[13px] text-platinum drop-shadow">
            {cam === "starting" ? "Membuka kamera…" : "Arahkan kamera ke QR peserta"}
          </span>
        </div>
        <div className="p-[16px] flex flex-col gap-[10px]">
          {scanning ? (
            <button
              type="button"
              onClick={() => {
                stopCamera();
                setCam("idle");
              }}
              className="admin-btn w-full justify-center py-[12px]"
            >
              Berhenti
            </button>
          ) : (
            <button type="button" onClick={startCamera} disabled={pending} className="gradient-pill-btn w-full text-[14px] py-[14px]">
              {info || lookupError ? "Pindai peserta berikutnya" : "Mulai pindai QR"}
            </button>
          )}
          {camMsg && <p className="text-[13px] text-red-300">{camMsg}</p>}
          {pending && !info && <p className="text-[13px] text-silver-mist">Mencari data…</p>}
        </div>
      </div>

      {lookupError && (
        <div className="admin-card border-red-400/50 p-[16px] text-[14px] text-red-200">{lookupError}</div>
      )}

      {info && (
        <div className="admin-card p-[18px] sm:p-[22px] flex flex-col gap-[14px]">
          <div className="flex items-start justify-between gap-[12px]">
            <div className="flex flex-col gap-[4px] min-w-0">
              <span className="text-[12px] text-lavender-phosphor">
                {info.kind === "lomba" ? "Peserta lomba" : "Peserta seminar"} · No. {shortRef(info.id)}
              </span>
              <span className="text-platinum text-[20px] leading-[1.2] break-words">{info.title}</span>
              <span className="text-silver-mist text-[13px]">{info.subtitle}</span>
            </div>
          </div>

          <div className="admin-inset px-[12px] py-[10px] grid grid-cols-2 gap-[10px] text-[13px]">
            <div className="flex flex-col gap-[2px]">
              <span className="text-[12px] text-silver-mist">Status</span>
              <span className={warn ? "text-red-300" : "text-platinum"}>{info.statusLabel}</span>
            </div>
            {info.kind === "lomba" && (
              <div className="flex flex-col gap-[2px]">
                <span className="text-[12px] text-silver-mist">Pembayaran</span>
                <span className="text-platinum">{info.payLabel}</span>
              </div>
            )}
          </div>

          {info.kind === "lomba" && info.members.length > 0 && (
            <div className="text-[13px] text-silver-mist">
              Anggota: <span className="text-liquid-mist">{info.members.join(", ")}</span>
            </div>
          )}

          {warn && (
            <p className="text-[13px] text-red-300">
              Perhatian: pendaftaran ini berstatus {info.statusLabel.toLowerCase()}. Konfirmasi ke koordinator sebelum mengizinkan masuk.
            </p>
          )}

          {checkin?.at || alreadyIn ? (
            <div className="rounded-[var(--radius-small)] border border-accent-secondary/60 bg-accent-primary/20 px-[14px] py-[12px] text-[14px] text-platinum">
              ✓ {checkin?.at ? "Check-in berhasil" : "Sudah check-in"}
              {(checkin?.at ?? info.hadirAt) && <span className="text-silver-mist"> · {fmtDateTime(checkin?.at ?? info.hadirAt)}</span>}
            </div>
          ) : info.kind === "lomba" && !info.checkinReady ? (
            <p className="text-[13px] text-silver-mist">Check-in lomba belum aktif — jalankan migrasi 010 di Supabase.</p>
          ) : (
            <button type="button" onClick={doCheckin} disabled={pending} className="admin-btn admin-btn-primary justify-center py-[12px] text-[14px]">
              {pending ? "Menyimpan…" : "✓ Tandai hadir"}
            </button>
          )}
          {checkin?.error && <p className="text-[13px] text-red-300">{checkin.error}</p>}
        </div>
      )}
    </div>
  );
}
