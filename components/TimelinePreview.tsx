import AnimateOnScroll from "./AnimateOnScroll";

const timelineSteps = [
  {
    phase: "01",
    title: "Pendaftaran",
    description: "Registrasi tim secara online melalui website DATASPHERE.",
    date: "Februari – Maret 2026",
    status: "active",
  },
  {
    phase: "02",
    title: "Penyisihan",
    description: "Babak eliminasi untuk masing-masing kategori lomba.",
    date: "Maret 2026",
    status: "upcoming",
  },
  {
    phase: "03",
    title: "Final",
    description: "Babak final bagi tim terbaik di setiap kategori.",
    date: "April 2026",
    status: "upcoming",
  },
  {
    phase: "04",
    title: "Capstone Expo",
    description: "Pameran hasil karya dan pengumuman pemenang.",
    date: "Mei 2026",
    status: "upcoming",
  },
];

export default function TimelinePreview() {
  return (
    <section className="py-[var(--section-gap)] relative">
      <div className="page-container flex flex-col gap-[36px] relative z-10">
        {/* Section Label */}
        <AnimateOnScroll animation="fade-up">
          <div className="flex flex-col gap-[16px] max-w-[600px]">
            <span className="section-label">TIMELINE</span>
            <h2>Perjalanan Menuju Data Expo</h2>
          </div>
        </AnimateOnScroll>

        {/* Timeline Steps */}
        <div className="relative">
          {/* Connecting line track — desktop */}
          <div className="hidden lg:block absolute top-[28px] left-[60px] right-[60px] h-[2px] bg-liquid-kelp overflow-hidden">
            {/* Animated bioluminescent beam streaming along the track */}
            <div
              className="w-full h-full animate-timeline-beam"
              style={{
                background:
                  "linear-gradient(90deg, transparent 0%, rgba(0, 150, 199, 0.4) 20%, rgba(72, 202, 228, 0.9) 50%, rgba(144, 224, 239, 0.8) 80%, transparent 100%)",
              }}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[24px] relative">
            {timelineSteps.map((step, index) => (
              <AnimateOnScroll
                key={step.phase}
                animation="fade-up"
                delay={index * 140}
              >
                <div className="flex flex-col gap-[16px] relative group">
                  {/* Phase Number Circle with Pulsing Glow */}
                  <div className="flex items-center gap-[16px] lg:flex-col lg:items-start relative">
                    <div className="relative flex-shrink-0">
                      {/* Active pulsing ring for phase 01 */}
                      {step.status === "active" && (
                        <div
                          className="absolute -inset-[6px] rounded-full border border-accent-secondary/60 animate-pulse-ring pointer-events-none"
                          aria-hidden="true"
                        />
                      )}

                      <div
                        className="w-[56px] h-[56px] rounded-full flex items-center justify-center relative z-10 transition-all duration-300 group-hover:scale-110 shadow-lg"
                        style={{
                          background:
                            step.status === "active"
                              ? "var(--gradient-aurora)"
                              : "var(--color-liquid-kelp)",
                          boxShadow:
                            step.status === "active"
                              ? "0 0 20px rgba(0, 180, 216, 0.5)"
                              : "none",
                        }}
                      >
                        <span
                          className={`font-medium text-[20px] tracking-[0.08em] ${
                            step.status === "active"
                              ? "text-liquid-deep font-semibold"
                              : "text-platinum"
                          }`}
                        >
                          {step.phase}
                        </span>
                      </div>
                    </div>

                    {/* Vertical connector — mobile only */}
                    {index < timelineSteps.length - 1 && (
                      <div className="sm:hidden absolute left-[27px] top-[56px] w-[2px] h-[calc(100%+24px)] bg-liquid-kelp" />
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex flex-col gap-[8px] pl-[72px] sm:pl-0">
                    <h3 className="text-[22px] text-platinum leading-[1.3] tracking-[-0.02em] transition-colors duration-200 group-hover:text-liquid-mist">
                      {step.title}
                    </h3>
                    <p className="text-silver-mist text-[15px] leading-[1.45]">
                      {step.description}
                    </p>
                    <span className="text-[12px] tracking-[0.08em] font-medium text-lavender-phosphor bg-liquid-tide border border-accent-primary/40 rounded-[var(--radius-small)] px-[10px] py-[3px] mt-[4px] self-start">
                      {step.date}
                    </span>
                  </div>
                </div>
              </AnimateOnScroll>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
