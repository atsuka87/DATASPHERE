import "server-only";
import { headers } from "next/headers";

// Verifikasi token Cloudflare Turnstile di server. Token dari browser hanya berlaku sekali & ±5 menit.
// Tanpa TURNSTILE_SECRET_KEY: development dilewati (dengan peringatan), production DITOLAK (fail closed).
export async function verifyTurnstile(token: unknown): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) {
    if (process.env.NODE_ENV === "production") {
      console.error("TURNSTILE_SECRET_KEY belum diisi — semua submit form publik ditolak.");
      return false;
    }
    console.warn("[dev] TURNSTILE_SECRET_KEY kosong — verifikasi captcha dilewati.");
    return true;
  }
  if (typeof token !== "string" || token.length === 0 || token.length > 2048) return false;

  const h = await headers();
  const ip = h.get("cf-connecting-ip") ?? h.get("x-forwarded-for")?.split(",")[0]?.trim() ?? undefined;

  try {
    const body = new URLSearchParams({ secret, response: token });
    if (ip) body.set("remoteip", ip);
    const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      body,
      signal: AbortSignal.timeout(8000),
    });
    const data = (await res.json()) as { success?: boolean };
    return data.success === true;
  } catch (e) {
    console.error("Turnstile verify error:", e);
    return false;
  }
}
