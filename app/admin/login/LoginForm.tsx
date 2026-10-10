"use client";

import { useState } from "react";
import { adminInputClass } from "@/components/admin/AuthCard";
import { getSupabaseBrowserClient } from "@/lib/supabase/browser";

export default function LoginForm({ next }: { next: string }) {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setPending(true);
    setError(null);

    const supabase = getSupabaseBrowserClient();
    const { error: authError } = await supabase.auth.signInWithPassword({
      email: String(fd.get("email") ?? "").trim(),
      password: String(fd.get("password") ?? ""),
    });

    if (authError) {
      setPending(false);
      // Pesan generik — tidak membedakan "email tidak terdaftar" vs "password salah" (cegah user enumeration)
      if (authError.status === 429) setError("Terlalu banyak percobaan. Coba lagi beberapa menit lagi.");
      else if (!authError.status) setError("Tidak dapat terhubung. Periksa koneksi lalu coba lagi.");
      else setError("Email atau password salah.");
      return;
    }

    // Pindah halaman penuh agar proxy membaca cookie sesi baru
    window.location.assign(next);
  };

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-[18px]">
      <label className="flex flex-col gap-[8px]">
        <span className="text-[12px] tracking-[0.1em] uppercase text-silver-mist">Email</span>
        <input name="email" type="email" autoComplete="username" required className={adminInputClass} disabled={pending} />
      </label>
      <label className="flex flex-col gap-[8px]">
        <span className="text-[12px] tracking-[0.1em] uppercase text-silver-mist">Password</span>
        <input name="password" type="password" autoComplete="current-password" required className={adminInputClass} disabled={pending} />
      </label>
      {error && (
        <p role="alert" className="text-[13px] text-red-300">
          {error}
        </p>
      )}
      <button
        type="submit"
        disabled={pending}
        className="gradient-pill-btn text-[13px] px-[22px] py-[14px] mt-[4px] disabled:opacity-70 disabled:cursor-wait"
      >
        {pending ? "Memeriksa…" : "Masuk"}
      </button>
    </form>
  );
}
