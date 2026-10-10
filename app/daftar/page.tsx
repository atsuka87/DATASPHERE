"use client";

import { Suspense, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Pending from "@/components/Pending";
import Turnstile, { TURNSTILE_SITE_KEY } from "@/components/Turnstile";
import { submitLomba, submitSeminar } from "./actions";
import { useNow } from "@/lib/use-now";
import ProofPicker from "@/components/ProofPicker";
import { uploadProof, type PreparedProof } from "@/lib/proof-upload";
import {
  CATEGORIES,
  CP_ADMIN,
  EVENT,
  FEES,
  PAYMENT,
  REGISTRATION_CLOSE,
  REGISTRATION_OPEN,
  REQUIRED_FILES,
  RULEBOOK_PDF_URL,
  waLink,
  type CategoryId,
} from "@/lib/event-data";

type FormType = "seminar" | "lomba";

const inputClass =
  "w-full bg-liquid-tide border border-accent-primary/40 text-platinum rounded-[var(--radius-small)] px-[14px] py-[12px] text-[14px] placeholder:text-silver-mist/70 focus:outline-none focus:border-accent-secondary transition-colors";

// randomUUID hanya tersedia di secure context (https/localhost)
function newId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return "10000000-1000-4000-8000-100000000000".replace(/[018]/g, (c) =>
    (Number(c) ^ (Math.random() * 16) >> (Number(c) / 4)).toString(16)
  );
}

const CAPTCHA_REQUIRED = "Selesaikan verifikasi anti-bot (kotak Cloudflare) terlebih dulu.";

function Field({
  label,
  required,
  children,
  hint,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
  hint?: string;
}) {
  return (
    <label className="flex flex-col gap-[6px]">
      <span className="text-[13px] text-platinum font-medium">
        {label} {required && <span className="text-lavender-phosphor">*</span>}
      </span>
      {children}
      {hint && <span className="text-[12px] text-silver-mist">{hint}</span>}
    </label>
  );
}

function StepLabel({ n, children }: { n: number; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-[8px]">
      <span className="w-[20px] h-[20px] rounded-full bg-liquid-tide text-lavender-phosphor text-[11px] font-medium flex items-center justify-center border border-accent-primary/40">
        {n}
      </span>
      <span className="section-label">{children}</span>
    </div>
  );
}

function ErrorBox({ msg }: { msg: string | null }) {
  if (!msg) return null;
  return (
    <div className="p-[14px] rounded-[var(--radius-small)] bg-red-950/60 border border-red-500/40 text-red-200 text-[13px]">
      {msg}
    </div>
  );
}

function SuccessCard({
  title,
  body,
  refId,
  onReset,
  resetLabel,
  children,
}: {
  title: string;
  body: React.ReactNode;
  refId: string;
  onReset: () => void;
  resetLabel: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="surface-card flex flex-col items-center text-center gap-[24px] p-[32px] md:p-[56px]">
      <div className="w-[64px] h-[64px] rounded-full bg-liquid-tide border border-accent-secondary/50 flex items-center justify-center text-lavender-phosphor text-[28px]">
        ✓
      </div>
      <div className="flex flex-col gap-[8px]">
        <span className="section-label text-lavender-phosphor">PENDAFTARAN BERHASIL</span>
        <h2 className="text-platinum text-[26px] md:text-[32px]">{title}</h2>
        <p className="text-silver-mist text-[15px] max-w-[500px]">{body}</p>
      </div>
      <div className="bg-liquid-deep px-[24px] py-[16px] rounded-[var(--radius-small)] border border-accent-primary/30 flex flex-col items-center gap-[4px] w-full max-w-[420px]">
        <span className="text-[11px] uppercase tracking-[0.14em] text-silver-mist">Nomor Registrasi</span>
        <span className="text-[16px] font-mono text-lavender-phosphor break-all">{refId.slice(0, 8).toUpperCase()}</span>
      </div>
      {children}
      <p className="text-silver-mist text-[13px] max-w-[460px]">
        <span className="text-platinum">Tangkap layar (screenshot) halaman ini sekarang</span> — nomor registrasi
        tidak dikirim ulang lewat email. Informasi selanjutnya akan disampaikan panitia melalui kontak yang kamu isi.
      </p>
      <div className="flex flex-col sm:flex-row gap-[16px]">
        <Link href="/timeline" className="gradient-pill-btn text-[13px] px-[28px] py-[14px]">
          Lihat Jadwal
        </Link>
        <button
          onClick={onReset}
          className="ghost-nav-link text-[13px] px-[20px] py-[14px] border border-accent-primary/40 rounded-[var(--radius-small)] hover:border-accent-secondary"
        >
          {resetLabel}
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────── Form Seminar ───────────────────────────────

const emptySeminar = { nama: "", asal: "", kontak: "" };

function SeminarForm() {
  const [isPending, startTransition] = useTransition();
  const [form, setForm] = useState(emptySeminar);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<{ id: string; nama: string } | null>(null);
  const [captcha, setCaptcha] = useState<string | null>(null);
  const [captchaReset, setCaptchaReset] = useState(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!form.nama.trim() || !form.asal.trim() || !form.kontak.trim()) {
      setError("Mohon lengkapi nama, asal, dan kontak.");
      return;
    }
    if (TURNSTILE_SITE_KEY && !captcha) {
      setError(CAPTCHA_REQUIRED);
      return;
    }
    startTransition(async () => {
      const id = newId();
      // Validasi final (Zod) + cek anti-bot dilakukan di server
      const res = await submitSeminar({ id, nama: form.nama.trim(), asal: form.asal.trim(), kontak: form.kontak.trim() }, captcha);
      if (!res.ok) {
        setError(res.error);
        setCaptchaReset((k) => k + 1); // token Turnstile hanya sekali pakai
        return;
      }
      setSuccess({ id, nama: form.nama.trim() });
    });
  };

  if (success) {
    return (
      <SuccessCard
        title={`Terima kasih, ${success.nama}!`}
        body={
          <>
            Kamu terdaftar sebagai peserta Seminar &amp; Workshop DATASPHERE 2026 pada{" "}
            <span className="text-platinum">12 November 2026</span> di {EVENT.venue}.
          </>
        }
        refId={success.id}
        onReset={() => {
          setForm(emptySeminar);
          setCaptcha(null);
          setSuccess(null);
        }}
        resetLabel="Daftarkan Peserta Lain"
      />
    );
  }

  return (
    <form onSubmit={handleSubmit} className="surface-card flex flex-col gap-[28px] p-[24px] sm:p-[32px] md:p-[48px]">
      <div className="flex flex-col gap-[10px]">
        <span className="section-label">FORM SEMINAR &amp; WORKSHOP</span>
        <p className="text-silver-mist text-[14px] leading-[1.5]">
          Terbuka untuk umum — pelajar, mahasiswa, pendidik, dan masyarakat. Topik: Data Science
          dalam Dunia Profesional dan Industri. 12 November 2026, luring di {EVENT.venue}.
        </p>
        <p className="text-[13px] text-silver-mist">
          Narasumber: {EVENT.speakers ?? <Pending />}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-[18px]">
        <Field label="Nama Lengkap" required>
          <input
            type="text"
            value={form.nama}
            onChange={(e) => setForm({ ...form, nama: e.target.value })}
            placeholder="Nama sesuai identitas"
            className={inputClass}
            required
          />
        </Field>
        <Field label="Asal Sekolah / Instansi" required>
          <input
            type="text"
            value={form.asal}
            onChange={(e) => setForm({ ...form, asal: e.target.value })}
            placeholder="Contoh: SMAN 1 Bandar Lampung / IIB Darmajaya / Umum"
            className={inputClass}
            required
          />
        </Field>
        <div className="md:col-span-2">
          <Field label="Kontak (WhatsApp / Email)" required>
            <input
              type="text"
              value={form.kontak}
              onChange={(e) => setForm({ ...form, kontak: e.target.value })}
              placeholder="08xxxxxxxxxx atau email@contoh.com"
              className={inputClass}
              required
            />
          </Field>
        </div>
      </div>

      <Turnstile onToken={setCaptcha} resetKey={captchaReset} />
      <ErrorBox msg={error} />

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-[16px]">
        <span className="text-[12px] text-silver-mist">
          Biaya seminar untuk umum: <Pending />
        </span>
        <button
          type="submit"
          disabled={isPending}
          className={`gradient-pill-btn text-[14px] px-[36px] py-[16px] w-full sm:w-auto ${isPending ? "opacity-60 cursor-not-allowed" : ""}`}
        >
          {isPending ? "Mengirim..." : "Daftar Seminar →"}
        </button>
      </div>
    </form>
  );
}

// ─────────────────────────────── Form Lomba ───────────────────────────────

type Grade = "X" | "XI" | "XII";

interface Member {
  uid: number; // key stabil supaya input tidak tertukar saat anggota dihapus
  nama: string;
  kontak: string;
  kelas: Grade | "";
}

let memberSeq = 0;
const blankMember = (): Member => ({ uid: ++memberSeq, nama: "", kontak: "", kelas: "" });

// Gelombang ditentukan dari tanggal pengisian formulir (Rulebook Bab 2A poin 2)
function waveAt(now: number) {
  return FEES.find((f) => now <= new Date(f.until).getTime()) ?? null;
}

const fmtDate = (d: Date) =>
  d.toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric", timeZone: "Asia/Jakarta" });

function ProofUploadBox({ registrationId, uploaded, onUploaded }: { registrationId: string; uploaded: boolean; onUploaded: () => void }) {
  const [proof, setProof] = useState<PreparedProof | null>(null);
  const [pct, setPct] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (uploaded) {
    return (
      <div className="flex items-center gap-[10px] text-[14px] text-liquid-mist">
        <span className="w-[22px] h-[22px] rounded-full bg-lavender-phosphor/15 text-lavender-phosphor border border-lavender-phosphor/40 flex items-center justify-center text-[12px]">✓</span>
        Bukti transfer terkirim. Administrasi akan memverifikasi pembayaranmu.
      </div>
    );
  }

  const send = async () => {
    if (!proof) return;
    setError(null);
    setPct(0);
    try {
      await uploadProof(registrationId, proof, setPct);
      onUploaded();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload gagal. Coba lagi.");
    } finally {
      setPct(null);
    }
  };

  return (
    <div className="flex flex-col gap-[10px]">
      <ProofPicker value={proof} onChange={setProof} disabled={pct !== null} />
      {proof && (
        <button
          type="button"
          onClick={send}
          disabled={pct !== null}
          className="relative overflow-hidden gradient-pill-btn text-[13px] px-[20px] py-[12px] disabled:cursor-wait"
        >
          {pct !== null && (
            <span className="absolute inset-y-0 left-0 bg-white/40 transition-[width] duration-200" style={{ width: `${pct}%` }} aria-hidden="true" />
          )}
          <span className="relative">{pct !== null ? `Mengunggah… ${pct}%` : "Unggah Bukti Transfer"}</span>
        </button>
      )}
      {error && <span className="text-[12px] text-red-300">{error}</span>}
    </div>
  );
}

function PaymentSteps({
  refCode,
  registrationId,
  proofUploaded,
  onProofUploaded,
  fee,
  deadline,
  kategori,
  nama,
}: {
  refCode: string;
  registrationId: string;
  proofUploaded: boolean;
  onProofUploaded: () => void;
  fee: string;
  deadline: string;
  kategori: string;
  nama: string;
}) {
  const proofText = `Halo Kak ${CP_ADMIN.name.split(" ")[0]}, saya ingin mengirim bukti pembayaran DATASPHERE 2026.\nNo. registrasi: ${refCode}\nNama tim/peserta: ${nama}\nCabang: ${kategori}`;
  return (
    <div className="w-full max-w-[520px] text-left flex flex-col gap-[14px]">
      <div className="nested-box p-[16px] flex flex-col gap-[6px]">
        <span className="section-label text-[11px] text-lavender-phosphor">Langkah 1 · Bayar {fee}</span>
        <span className="text-platinum text-[15px]">
          {PAYMENT.bank} <span className="font-mono">{PAYMENT.account}</span> a.n. {PAYMENT.holder}
        </span>
        <span className="text-silver-mist text-[13px]">
          Paling lambat <span className="text-platinum">{deadline}</span> (3 hari). Lewat dari itu, pendaftaran batal.
        </span>
      </div>
      <div className="nested-box p-[16px] flex flex-col gap-[10px]">
        <span className="section-label text-[11px] text-lavender-phosphor">Langkah 2 · Unggah bukti transfer</span>
        <ProofUploadBox registrationId={registrationId} uploaded={proofUploaded} onUploaded={onProofUploaded} />
        <a
          href={waLink(CP_ADMIN.wa, proofText)}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[12px] text-silver-mist hover:text-platinum text-center py-[6px]"
        >
          {proofUploaded ? "Konfirmasi ke" : "Atau kirim lewat"} WhatsApp Administrasi ({CP_ADMIN.phone}) →
        </a>
      </div>
      <div className="nested-box p-[16px] flex flex-col gap-[8px]">
        <span className="section-label text-[11px] text-lavender-phosphor">Langkah 3 · Lengkapi berkas sebelum 12 Nov 2026, 23.59 WIB</span>
        <ul className="flex flex-col gap-[4px] text-[14px] text-liquid-mist list-disc pl-[18px] marker:text-lavender-phosphor">
          {REQUIRED_FILES.map((f) => (
            <li key={f}>{f}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function LombaForm({ initialCategory }: { initialCategory: CategoryId }) {
  const now = useNow();
  const [isPending, startTransition] = useTransition();
  const [kategori, setKategori] = useState<CategoryId>(initialCategory);
  const [namaTim, setNamaTim] = useState("");
  const [sekolah, setSekolah] = useState("");
  // Mulai dari ketua saja; anggota ditambah lewat tombol "Tambah Anggota"
  const [members, setMembers] = useState<Member[]>(() => [blankMember()]);
  const [pendamping, setPendamping] = useState({ nama: "", kontak: "" });
  const [setuju, setSetuju] = useState(false);
  const [proof, setProof] = useState<PreparedProof | null>(null);
  const [uploadPct, setUploadPct] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [captcha, setCaptcha] = useState<string | null>(null);
  const [captchaReset, setCaptchaReset] = useState(0);
  const [success, setSuccess] = useState<{
    id: string;
    nama: string;
    kategori: string;
    sekolah: string;
    fee: string;
    deadline: string;
    proofUploaded: boolean;
    proofError: string | null;
  } | null>(null);

  const category = CATEGORIES.find((c) => c.id === kategori)!;
  const isIndividual = category.maxTeam === 1;
  const canAddMember = members.length < category.maxTeam;
  const wave = now === null ? null : waveAt(now);
  const closed = now !== null && now > new Date(REGISTRATION_CLOSE).getTime();
  const notOpenYet = now !== null && now < new Date(REGISTRATION_OPEN).getTime();

  // Ukuran tim menyesuaikan kategori; data yang sudah diisi tetap dipertahankan
  // Pindah ke kategori individu → hanya ketua yang dipertahankan
  const selectCategory = (id: CategoryId) => {
    const max = CATEGORIES.find((c) => c.id === id)!.maxTeam;
    setKategori(id);
    setMembers((prev) => prev.slice(0, max));
  };

  const addMember = () => setMembers((prev) => (prev.length < category.maxTeam ? [...prev, blankMember()] : prev));
  const removeMember = (uid: number) => setMembers((prev) => (prev.length > 1 ? prev.filter((m) => m.uid !== uid) : prev));

  const updateMember = (i: number, key: keyof Member, value: string) =>
    setMembers((prev) => prev.map((m, idx) => (idx === i ? { ...m, [key]: value } : m)));

  const reset = () => {
    setNamaTim("");
    setSekolah("");
    setMembers([blankMember()]);
    setPendamping({ nama: "", kontak: "" });
    setSetuju(false);
    if (proof?.previewUrl) URL.revokeObjectURL(proof.previewUrl);
    setProof(null);
    setCaptcha(null);
    setSuccess(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const anggota = isIndividual
      ? [{ nama: namaTim.trim(), kontak: members[0].kontak.trim(), kelas: members[0].kelas }]
      : members.map((m) => ({ nama: m.nama.trim(), kontak: m.kontak.trim(), kelas: m.kelas }));

    if (!namaTim.trim()) {
      setError(isIndividual ? "Mohon isi nama lengkap peserta." : "Mohon isi nama tim.");
      return;
    }
    if (!sekolah.trim()) {
      setError("Mohon isi asal sekolah.");
      return;
    }
    if (anggota.some((m) => !m.nama || m.kontak.length < 9)) {
      setError("Mohon lengkapi nama dan nomor WhatsApp yang valid untuk setiap anggota.");
      return;
    }
    if (anggota.some((m) => !m.kelas || !category.allowedGrades.includes(m.kelas as Grade))) {
      setError(`Mohon pilih kelas setiap peserta. ${category.name} hanya untuk ${category.grades.toLowerCase()}.`);
      return;
    }
    if (!pendamping.nama.trim() || pendamping.kontak.trim().length < 9) {
      setError("Mohon isi nama dan nomor WhatsApp guru/pembimbing pendamping.");
      return;
    }
    if (!setuju) {
      setError("Kamu harus menyetujui pernyataan peserta.");
      return;
    }
    if (now === null) return;
    if (notOpenYet) {
      setError("Pendaftaran lomba baru dibuka 12 Oktober 2026 pukul 00.00 WIB. Silakan kirim formulir mulai tanggal tersebut.");
      return;
    }
    if (!waveAt(now)) {
      setError("Pendaftaran sudah ditutup (batas 12 November 2026 pukul 23.59 WIB).");
      return;
    }
    if (TURNSTILE_SITE_KEY && !captcha) {
      setError(CAPTCHA_REQUIRED);
      return;
    }

    startTransition(async () => {
      const id = newId();
      // Validasi final (Zod), cek anti-bot, dan penentuan gelombang dilakukan di server
      const res = await submitLomba(
        {
          id,
          nama_tim: namaTim.trim(),
          nama_sekolah: sekolah.trim(),
          kategori_lomba: kategori,
          anggota,
          pendamping_nama: pendamping.nama.trim(),
          pendamping_kontak: pendamping.kontak.trim(),
        },
        captcha,
      );
      if (!res.ok) {
        setError(res.error);
        setCaptchaReset((k) => k + 1); // token Turnstile hanya sekali pakai
        return;
      }
      // Bukti transfer (opsional) diunggah setelah pendaftaran tersimpan. Bila gagal, pendaftaran
      // tetap sah dan peserta bisa mengunggah ulang dari layar sukses.
      let proofUploaded = false;
      let proofError: string | null = null;
      if (proof) {
        setUploadPct(0);
        try {
          await uploadProof(id, proof, setUploadPct);
          proofUploaded = true;
        } catch (e) {
          proofError = e instanceof Error ? e.message : "Upload bukti gagal.";
        } finally {
          setUploadPct(null);
        }
      }
      setSuccess({
        id,
        nama: namaTim.trim(),
        kategori: category.name,
        sekolah: sekolah.trim(),
        fee: `${res.fee} (${res.label})`,
        deadline: fmtDate(new Date(res.submittedAt + 3 * 86_400_000)),
        proofUploaded,
        proofError,
      });
    });
  };

  if (success) {
    const refCode = success.id.slice(0, 8).toUpperCase();
    return (
      <SuccessCard
        title={isIndividual ? `Terdaftar, ${success.nama}!` : `Terdaftar, Tim ${success.nama}!`}
        body={
          <>
            Pendaftaran dari {success.sekolah} untuk <span className="text-platinum">{success.kategori}</span> sudah
            tercatat. Selesaikan pembayaran agar kuota kamu terkunci — kuota dihitung dari urutan pembayaran
            terverifikasi.
          </>
        }
        refId={success.id}
        onReset={reset}
        resetLabel="Daftarkan Peserta/Tim Lain"
      >
        {success.proofError && (
          <p className="w-full max-w-[520px] text-[13px] text-red-300 text-left">
            Pendaftaran tersimpan, tetapi bukti transfer gagal terunggah ({success.proofError}). Silakan unggah ulang di bawah.
          </p>
        )}
        <PaymentSteps
          refCode={refCode}
          registrationId={success.id}
          proofUploaded={success.proofUploaded}
          onProofUploaded={() => setSuccess((s) => (s ? { ...s, proofUploaded: true, proofError: null } : s))}
          fee={success.fee}
          deadline={success.deadline}
          kategori={success.kategori}
          nama={success.nama}
        />
      </SuccessCard>
    );
  }

  if (closed) {
    return (
      <div className="surface-card flex flex-col items-center text-center gap-[14px] p-[32px] md:p-[48px]">
        <span className="section-label text-lavender-phosphor">PENDAFTARAN DITUTUP</span>
        <h2 className="text-platinum text-[26px]">Pendaftaran lomba sudah ditutup</h2>
        <p className="text-silver-mist text-[15px] max-w-[480px]">
          Batas pendaftaran adalah 12 November 2026 pukul 23.59 WIB. Ikuti info selanjutnya di halaman Jadwal.
        </p>
        <Link href="/timeline" className="gradient-pill-btn text-[13px] px-[28px] py-[14px] mt-[6px]">
          Lihat Jadwal
        </Link>
      </div>
    );
  }

  const gradeSelect = (i: number) => (
    <Field label={`Kelas${isIndividual ? "" : i === 0 ? " Ketua" : ` Anggota ${i + 1}`}`} required>
      <select
        value={members[i]?.kelas ?? ""}
        onChange={(e) => updateMember(i, "kelas", e.target.value)}
        className={inputClass}
        required
      >
        <option value="" disabled>
          Pilih kelas
        </option>
        {category.allowedGrades.map((g) => (
          <option key={g} value={g}>
            Kelas {g}
          </option>
        ))}
      </select>
    </Field>
  );

  return (
    <form onSubmit={handleSubmit} className="surface-card flex flex-col gap-[36px] p-[24px] sm:p-[32px] md:p-[48px]">
      {/* Info gelombang & biaya */}
      <div className="nested-box px-[16px] py-[14px] flex flex-col sm:flex-row sm:items-center justify-between gap-[8px]">
        <div className="flex flex-col gap-[2px]">
          <span className="section-label text-[11px] text-lavender-phosphor">
            {notOpenYet ? "Pendaftaran dibuka 12 Oktober 2026" : wave ? `${wave.label} · ${wave.period}` : "Biaya pendaftaran"}
          </span>
          <span className="text-platinum text-[15px]">
            {wave ? (
              <>
                {wave.fee} <span className="text-silver-mist text-[13px]">per {isIndividual ? "peserta" : "tim"}</span>
              </>
            ) : (
              "Rp75.000 (Early Bid) / Rp100.000 (Normal Bid)"
            )}
          </span>
        </div>
        <span className="text-[12px] text-silver-mist sm:max-w-[260px]">
          {notOpenYet
            ? "Formulir sudah bisa dilihat, tetapi baru bisa dikirim mulai 12 Oktober 2026."
            : "Bayar maksimal 3 hari setelah mendaftar. Kuota dihitung dari urutan pembayaran terverifikasi."}
        </span>
      </div>

      {/* 1. Kategori */}
      <div className="flex flex-col gap-[16px]">
        <StepLabel n={1}>PILIH KATEGORI LOMBA</StepLabel>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-[14px]">
          {CATEGORIES.map((cat) => {
            const selected = kategori === cat.id;
            return (
              <button
                type="button"
                key={cat.id}
                onClick={() => selectCategory(cat.id)}
                aria-pressed={selected}
                className={`text-left p-[18px] rounded-[var(--radius-small)] cursor-pointer transition-all duration-200 border flex flex-col justify-between gap-[10px] ${
                  selected
                    ? "bg-liquid-tide border-accent-secondary"
                    : "bg-transparent border-accent-primary/30 hover:border-accent-secondary/60"
                }`}
              >
                <span className="flex items-center justify-between gap-[8px]">
                  <span className="text-[14px] font-medium text-platinum">{cat.name}</span>
                  <span
                    className={`w-[14px] h-[14px] rounded-full border flex items-center justify-center flex-shrink-0 ${
                      selected ? "border-accent-secondary bg-accent-secondary" : "border-silver-mist/50"
                    }`}
                  >
                    {selected && <span className="w-[6px] h-[6px] rounded-full bg-liquid-abyss" />}
                  </span>
                </span>
                <span className="text-silver-mist text-[12px] leading-[1.35]">
                  {cat.grades} · Kuota {cat.quota}
                </span>
                <span className="text-[12px] uppercase tracking-[0.12em] text-lavender-phosphor">
                  {cat.maxTeam === 1 ? "Individu" : `1–${cat.maxTeam} anggota`}
                </span>
              </button>
            );
          })}
        </div>
        <p className="text-[13px] text-liquid-mist nested-box px-[14px] py-[10px]">
          {isIndividual
            ? `${category.name} adalah kompetisi individu untuk ${category.grades.toLowerCase()}.`
            : `${category.name}: tim 1–${category.maxTeam} siswa ${category.grades.toLowerCase()} dari sekolah yang sama, didaftarkan oleh ketua tim.`}{" "}
          Setiap peserta hanya boleh mengikuti 1 cabang.
        </p>
      </div>

      {/* 2. Identitas */}
      <div className="flex flex-col gap-[20px] pt-[24px] border-t border-liquid-tide">
        <StepLabel n={2}>{isIndividual ? "DATA PESERTA" : "DATA TIM"}</StepLabel>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-[18px]">
          <Field label={isIndividual ? "Nama Lengkap Peserta" : "Nama Tim"} required>
            <input
              type="text"
              value={namaTim}
              onChange={(e) => setNamaTim(e.target.value)}
              placeholder={isIndividual ? "Nama sesuai kartu pelajar" : "Contoh: Tim Algoritma Garuda"}
              className={inputClass}
              required
            />
          </Field>
          <Field label="Asal Sekolah (SMA/MA/SMK/sederajat)" required>
            <input
              type="text"
              value={sekolah}
              onChange={(e) => setSekolah(e.target.value)}
              placeholder="Contoh: SMAN 1 Bandar Lampung"
              className={inputClass}
              required
            />
          </Field>
          {isIndividual && (
            <>
              <Field label="Nomor WhatsApp Aktif" required>
                <input
                  type="tel"
                  value={members[0]?.kontak ?? ""}
                  onChange={(e) => updateMember(0, "kontak", e.target.value)}
                  placeholder="08xxxxxxxxxx"
                  className={inputClass}
                  required
                />
              </Field>
              {gradeSelect(0)}
            </>
          )}
        </div>
      </div>

      {/* 3. Anggota tim */}
      {!isIndividual && (
        <div className="flex flex-col gap-[20px] pt-[24px] border-t border-liquid-tide">
          <div className="flex flex-wrap items-center justify-between gap-[10px]">
            <StepLabel n={3}>KETUA &amp; ANGGOTA TIM</StepLabel>
            <span className="text-[12px] text-silver-mist tabular-nums">
              {members.length}/{category.maxTeam} orang
            </span>
          </div>
          <div className="flex flex-col gap-[16px]">
            {members.map((m, i) => (
              <div key={m.uid} className="nested-box p-[16px] flex flex-col gap-[12px]">
                <div className="flex items-center justify-between gap-[10px]">
                  <span className="text-[12px] uppercase tracking-[0.12em] text-lavender-phosphor">
                    {i === 0 ? "Ketua Tim" : `Anggota ${i + 1}`}
                  </span>
                  {i > 0 && (
                    <button
                      type="button"
                      onClick={() => removeMember(m.uid)}
                      className="text-[12px] text-red-300 hover:text-red-200 px-[10px] py-[6px] rounded-[var(--radius-small)] border border-red-400/30 hover:border-red-400/60 transition-colors"
                      aria-label={`Hapus anggota ${i + 1}`}
                    >
                      ✕ Hapus
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-[14px]">
                <Field label={i === 0 ? "Nama Ketua Tim" : `Nama Anggota ${i + 1}`} required>
                  <input
                    type="text"
                    value={m.nama}
                    onChange={(e) => updateMember(i, "nama", e.target.value)}
                    placeholder="Nama lengkap"
                    className={inputClass}
                    required
                  />
                </Field>
                <Field label={`WhatsApp ${i === 0 ? "Ketua" : `Anggota ${i + 1}`}`} required>
                  <input
                    type="tel"
                    value={m.kontak}
                    onChange={(e) => updateMember(i, "kontak", e.target.value)}
                    placeholder="08xxxxxxxxxx"
                    className={inputClass}
                    required
                  />
                </Field>
                {gradeSelect(i)}
                </div>
              </div>
            ))}
            {canAddMember ? (
              <button
                type="button"
                onClick={addMember}
                className="w-full rounded-[var(--radius-small)] border border-dashed border-accent-secondary/50 hover:border-accent-secondary hover:bg-liquid-tide/60 text-liquid-mist hover:text-platinum px-[16px] py-[14px] text-[14px] font-medium transition-colors flex items-center justify-center gap-[8px]"
              >
                <span className="w-[22px] h-[22px] rounded-full bg-accent-secondary/20 text-accent-secondary flex items-center justify-center text-[16px] leading-none">+</span>
                Tambah Anggota ({members.length}/{category.maxTeam})
              </button>
            ) : (
              <p className="text-[13px] text-silver-mist text-center">Tim sudah mencapai jumlah maksimal {category.maxTeam} orang.</p>
            )}
          </div>
        </div>
      )}

      {/* Pendamping */}
      <div className="flex flex-col gap-[20px] pt-[24px] border-t border-liquid-tide">
        <StepLabel n={isIndividual ? 3 : 4}>CONTACT PERSON PENDAMPING (GURU/PEMBIMBING)</StepLabel>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-[18px]">
          <Field label="Nama Guru/Pembimbing" required>
            <input
              type="text"
              value={pendamping.nama}
              onChange={(e) => setPendamping({ ...pendamping, nama: e.target.value })}
              placeholder="Nama Bapak/Ibu pendamping"
              className={inputClass}
              required
            />
          </Field>
          <Field label="WhatsApp Guru/Pembimbing" required>
            <input
              type="tel"
              value={pendamping.kontak}
              onChange={(e) => setPendamping({ ...pendamping, kontak: e.target.value })}
              placeholder="08xxxxxxxxxx"
              className={inputClass}
              required
            />
          </Field>
        </div>
      </div>

      {/* Bukti transfer (opsional) */}
      <div className="flex flex-col gap-[14px] pt-[24px] border-t border-liquid-tide">
        <StepLabel n={isIndividual ? 4 : 5}>BUKTI TRANSFER (OPSIONAL)</StepLabel>
        <p className="text-[13px] text-silver-mist leading-[1.5]">
          Sudah transfer {wave ? wave.fee : "biaya pendaftaran"} ke {PAYMENT.bank}{" "}
          <span className="font-mono text-liquid-mist">{PAYMENT.account}</span> a.n. {PAYMENT.holder}? Unggah buktinya di sini.
          Belum? Lewati saja — kamu bisa mengunggahnya di layar berikutnya setelah formulir terkirim, atau
          kirim lewat WhatsApp Administrasi ({CP_ADMIN.phone}) paling lambat 3 hari setelah mendaftar.
        </p>
        <ProofPicker value={proof} onChange={setProof} disabled={isPending} />
      </div>

      {/* Persetujuan & submit */}
      <div className="flex flex-col gap-[18px] pt-[24px] border-t border-liquid-tide">
        <label className="flex items-start gap-[12px] cursor-pointer">
          <input
            type="checkbox"
            checked={setuju}
            onChange={(e) => setSetuju(e.target.checked)}
            className="mt-[3px] w-[18px] h-[18px] accent-[#00b4d8] cursor-pointer flex-shrink-0"
          />
          <span className="text-[13px] text-silver-mist leading-[1.45]">
            Saya menyatakan data yang diisi benar, peserta adalah siswa aktif yang mewakili sekolahnya, karya
            yang dikumpulkan orisinal (mencantumkan sumber data, referensi, dan Pernyataan Penggunaan AI), serta
            bersedia mengikuti Seminar &amp; Workshop, simulasi lomba, dan seluruh aturan di{" "}
            <a href={RULEBOOK_PDF_URL} target="_blank" rel="noopener noreferrer" className="text-lavender-phosphor underline underline-offset-2">
              Rulebook DATASPHERE 2026
            </a>
            .
          </span>
        </label>

        <Turnstile onToken={setCaptcha} resetKey={captchaReset} />
        <ErrorBox msg={error} />

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-[16px]">
          <a href={RULEBOOK_PDF_URL} target="_blank" rel="noopener noreferrer" className="text-[13px] text-silver-mist hover:text-platinum py-[6px]">
            Baca Rulebook (PDF) ↗
          </a>
          <button
            type="submit"
            disabled={isPending}
            className={`gradient-pill-btn text-[14px] px-[36px] py-[16px] w-full sm:w-auto ${isPending ? "opacity-60 cursor-not-allowed" : ""}`}
          >
            {uploadPct !== null ? `Mengunggah bukti… ${uploadPct}%` : isPending ? "Mengirim..." : "Kirim Pendaftaran →"}
          </button>
        </div>
      </div>
    </form>
  );
}

// ─────────────────────────────── Page ───────────────────────────────

export default function DaftarPage() {
  return (
    <Suspense>
      <DaftarContent />
    </Suspense>
  );
}

// ?form=seminar|lomba & ?kategori=... dari link halaman lain
function DaftarContent() {
  const router = useRouter();
  const params = useSearchParams();
  const kat = params.get("kategori");
  const initialCategory: CategoryId = CATEGORIES.some((c) => c.id === kat) ? (kat as CategoryId) : "dataviz";
  const formType: FormType = params.get("form") === "seminar" ? "seminar" : "lomba";

  const setFormType = (form: FormType) => {
    const next = new URLSearchParams(params.toString());
    next.set("form", form);
    router.replace(`/daftar?${next.toString()}`, { scroll: false });
  };

  return (
    <>
      <Navbar />
      <main className="pt-[110px] pb-[80px] min-h-screen">
        <section className="py-[32px]">
          <div className="page-container flex flex-col items-center text-center gap-[14px]">
            <span className="section-label hero-animate">PENDAFTARAN RESMI</span>
            <h1 className="hero-animate-d1 text-[clamp(2.5rem,5.5vw,4.5rem)] leading-none text-platinum">
              Formulir Pendaftaran
            </h1>
            <p className="hero-animate-d2 text-silver-mist text-[16px] max-w-[620px] leading-[1.45]">
              Pilih jenis pendaftaran: Seminar &amp; Workshop (terbuka untuk umum) atau Lomba (siswa
              SMA/SMK/sederajat se-Provinsi Lampung).
            </p>

            <div className="grid grid-cols-2 gap-[8px] w-full max-w-[460px] mt-[12px]" role="tablist">
              <button
                role="tab"
                aria-selected={formType === "lomba"}
                onClick={() => setFormType("lomba")}
                className={`filter-pill justify-center py-[12px] ${formType === "lomba" ? "active" : ""}`}
              >
                Daftar Lomba
              </button>
              <button
                role="tab"
                aria-selected={formType === "seminar"}
                onClick={() => setFormType("seminar")}
                className={`filter-pill justify-center py-[12px] ${formType === "seminar" ? "active" : ""}`}
              >
                Daftar Seminar
              </button>
            </div>
          </div>
        </section>

        <section className="py-[16px]">
          <div className="page-container max-w-[840px]">
            {/* Kedua form tetap ter-mount supaya isian tidak hilang saat pindah tab */}
            <div hidden={formType !== "lomba"}>
              <LombaForm key={initialCategory} initialCategory={initialCategory} />
            </div>
            <div hidden={formType !== "seminar"}>
              <SeminarForm />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
