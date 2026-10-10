import Link from "next/link";

export default function UnauthorizedPage() {
  return (
    <main className="flex-1 flex items-center justify-center px-[20px] py-[80px]">
      <div className="bg-liquid-deep rounded-[16px] border border-accent-primary/30 px-[28px] py-[56px] max-w-[440px] w-full flex flex-col items-center text-center gap-[14px]">
        <span className="section-label">AKSES DITOLAK</span>
        <h1 className="text-platinum text-[28px] leading-[1.1]">Akun ini bukan akun panitia</h1>
        <p className="text-silver-mist text-[15px] leading-[1.5]">
          Hubungi admin DATASPHERE untuk mendapatkan akses ke admin panel.
        </p>
        <Link href="/" className="ghost-nav-link text-[12px] text-silver-mist hover:text-platinum mt-[8px]">
          ← Kembali ke beranda
        </Link>
      </div>
    </main>
  );
}
