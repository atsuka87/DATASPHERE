import Link from "next/link";
import AnimateOnScroll from "./AnimateOnScroll";

export default function CTASection() {
  return (
    <section className="py-[var(--section-gap)] relative">
      <div className="page-container">
        <AnimateOnScroll animation="scale-in">
          <div className="recessed-card flex flex-col items-center text-center gap-[24px] relative overflow-hidden">
            {/* Ambient deep-water bioluminescent glow inside recessed card */}
            <div
              className="absolute inset-0 pointer-events-none animate-bioluminescent-breathe"
              style={{
                background:
                  "radial-gradient(ellipse 70% 55% at 50% 50%, rgba(0, 130, 124, 0.18) 0%, rgba(250, 209, 255, 0.04) 45%, transparent 70%)",
              }}
              aria-hidden="true"
            />

            {/* Eyebrow */}
            <span className="section-label relative z-10 text-silver-mist">
              SIAP BERKOMPETISI?
            </span>

            {/* Heading */}
            <h2 className="max-w-[720px] relative z-10 text-platinum">
              Jadilah Bagian dari DATASPHERE&nbsp;2026
            </h2>

            {/* Body */}
            <p className="text-silver-mist text-[16px] leading-[1.4] max-w-[540px] relative z-10">
              Daftarkan timmu sekarang dan tunjukkan kemampuan data science-mu.
              Kompetisi terbuka untuk seluruh siswa SMA/SMK.
            </p>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-[16px] mt-[12px] relative z-10">
              <Link href="/daftar" className="gradient-pill-btn px-[36px] py-[16px]">
                Daftar Sekarang
              </Link>
              <Link
                href="/kontak"
                className="ghost-nav-link text-[13px] tracking-[0.12em] py-[16px] px-[24px] rounded-[var(--radius-small)] border border-transparent hover:border-liquid-kelp hover:bg-liquid-kelp/40 transition-all duration-300"
              >
                Hubungi Panitia →
              </Link>
            </div>
          </div>
        </AnimateOnScroll>
      </div>
    </section>
  );
}
