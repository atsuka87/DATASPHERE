import AnimateOnScroll from "./AnimateOnScroll";
import StatCounter from "./StatCounter";

export default function EventSummary() {
  return (
    <section className="py-[var(--section-gap)] relative">
      {/* Background subtle radial ambient teal tint */}
      <div
        className="absolute top-1/2 -left-[10%] w-[450px] h-[450px] rounded-full pointer-events-none -translate-y-1/2 opacity-25"
        style={{
          background: "radial-gradient(circle, rgba(0, 130, 124, 0.25) 0%, transparent 70%)",
        }}
        aria-hidden="true"
      />

      <div className="page-container max-w-[800px] mx-auto flex flex-col gap-[24px] relative z-10">
        {/* Section Label */}
        <AnimateOnScroll animation="fade-up">
          <span className="section-label text-silver-mist">TENTANG EVENT</span>
        </AnimateOnScroll>

        {/* Heading */}
        <AnimateOnScroll animation="fade-up" delay={100}>
          <h2>
            Kompetisi Data Science untuk Generasi Muda
          </h2>
        </AnimateOnScroll>

        {/* Body */}
        <AnimateOnScroll animation="fade-up" delay={200}>
          <p className="text-silver-mist text-body leading-body max-w-[680px]">
            DATASPHERE 2026 adalah kompetisi data science untuk siswa SMA/SMK,
            diselenggarakan sebagai Capstone Project mahasiswa S1 Sains Data IIB
            Darmajaya. Event ini dirancang untuk memperkenalkan dunia data science
            kepada generasi muda melalui tantangan kreatif, kuis interaktif, dan
            penelitian berbasis data.
          </p>
        </AnimateOnScroll>
        <AnimateOnScroll animation="fade-up" delay={300}>
          <p className="text-silver-mist text-body leading-body max-w-[680px]">
            Dengan tiga kategori lomba yang beragam, DATASPHERE membuka ruang bagi
            siswa untuk mengeksplorasi kemampuan analisis data, visualisasi, dan
            berpikir kritis — dari membangun dashboard profesional hingga
            menyusun karya ilmiah berbasis data yang berdampak nyata.
          </p>
        </AnimateOnScroll>

        {/* Stats Row with Animated Number Counters */}
        <AnimateOnScroll animation="fade-up" delay={400}>
          <div className="flex flex-wrap gap-[48px] mt-[28px] pt-[24px] border-t border-liquid-kelp/60">
            <StatCounter end={3} label="Kategori Lomba" />
            <StatCounter end={50} suffix="+" label="Target Sekolah" />
            <StatCounter end={1} label="Expo Besar" />
            <StatCounter end={25} prefix="Rp " suffix="JT+" label="Total Hadiah & Benefit" />
          </div>
        </AnimateOnScroll>
      </div>
    </section>
  );
}
