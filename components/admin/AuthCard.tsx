// Recessed Card di tengah layar untuk halaman login admin
export default function AuthCard({ label, title, children }: { label: string; title: string; children: React.ReactNode }) {
  return (
    <main className="flex-1 flex items-center justify-center px-[20px] py-[64px]">
      <div className="bg-liquid-deep rounded-[16px] border border-accent-primary/30 px-[24px] sm:px-[40px] py-[48px] sm:py-[64px] w-full max-w-[420px] flex flex-col gap-[28px]">
        <div className="flex flex-col gap-[10px] text-center">
          <span className="section-label">{label}</span>
          <h1 className="text-platinum text-[30px] leading-[1.05] tracking-[-0.02em]">{title}</h1>
        </div>
        {children}
      </div>
    </main>
  );
}

export const adminInputClass =
  "w-full bg-liquid-tide border border-accent-primary/40 text-platinum rounded-[var(--radius-small)] px-[14px] py-[12px] text-[16px] sm:text-[14px] placeholder:text-silver-mist/70 focus:outline-none focus:border-accent-secondary transition-colors";
