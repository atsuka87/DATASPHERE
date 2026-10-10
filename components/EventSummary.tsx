import AnimateOnScroll from "./AnimateOnScroll";
import StatCounter from "./StatCounter";
import DataPulsePanel from "./DataPulsePanel";

export default function EventSummary() {
  return (
    <section className="py-[var(--section-gap)] relative overflow-x-clip">
      <div
        className="absolute top-1/2 -left-[10%] w-[450px] h-[450px] rounded-full pointer-events-none -translate-y-1/2 opacity-25"
        style={{ background: "radial-gradient(circle, rgba(0, 150, 199, 0.25) 0%, transparent 70%)" }}
        aria-hidden="true"
      />

      <div className="page-container relative z-10 flex flex-col gap-[48px]">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-[40px] lg:gap-[64px] items-center">
          {/* Teks */}
          <div className="flex flex-col gap-[24px]">
            <AnimateOnScroll animation="fade-up">
              <span className="section-label text-silver-mist">TENTANG EVENT</span>
            </AnimateOnScroll>
            <AnimateOnScroll animation="fade-up" delay={100}>
              <h2>
                Kompetisi Data Science untuk <span className="text-gradient-aurora">Generasi Muda</span>
              </h2>
            </AnimateOnScroll>
            <AnimateOnScroll animation="fade-up" delay={200}>
              <p className="text-liquid-mist text-body leading-[1.6] max-w-[600px]">
                DATASPHERE 2026 adalah rangkaian seminar dan kompetisi sains data yang
                diselenggarakan untuk pertama kalinya oleh Prodi Sains Data IIB Darmajaya.
                Rangkaian dibuka dengan Seminar &amp; Workshop luring yang terbuka untuk umum,
                dilanjutkan kompetisi bagi siswa SMA/SMK/sederajat se-Provinsi Lampung.
              </p>
            </AnimateOnScroll>
            <AnimateOnScroll animation="fade-up" delay={300}>
              <p className="text-silver-mist text-body leading-[1.6] max-w-[600px]">
                Mengusung tema <span className="text-platinum">Ideas, Innovation, and Impact</span>,
                tiga kategori lomba melatih kemampuan analisis, visualisasi, penelitian sederhana,
                dan komunikasi berbasis data — tanpa harus menguasai pemrograman tingkat lanjut.
              </p>
            </AnimateOnScroll>
          </div>

          {/* Visual data */}
          <AnimateOnScroll animation="slide-left" delay={150}>
            <DataPulsePanel />
          </AnimateOnScroll>
        </div>

        {/* Statistik */}
        <AnimateOnScroll animation="fade-up" delay={200}>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-[12px]">
            <div className="nested-box px-[16px] py-[18px] sm:px-[20px] sm:py-[22px]"><StatCounter end={3} label="Kategori Lomba" /></div>
            <div className="nested-box px-[16px] py-[18px] sm:px-[20px] sm:py-[22px]"><StatCounter end={35} label="Kuota Tim DataViz" /></div>
            <div className="nested-box px-[16px] py-[18px] sm:px-[20px] sm:py-[22px]"><StatCounter end={35} label="Kuota Tim YDR" /></div>
            <div className="nested-box px-[16px] py-[18px] sm:px-[20px] sm:py-[22px]"><StatCounter end={60} label="Kuota Data Quiz Battle" /></div>
          </div>
        </AnimateOnScroll>
      </div>
    </section>
  );
}
