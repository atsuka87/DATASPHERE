// Panel bergaya data terminal (angka statis, bukan jumlah pendaftar real-time). Semua angka dari Rulebook DATASPHERE 2026:
// kuota peserta per cabang (Bab 2B) & tanggal milestone (Timeline).
// Animasi CSS berjalan saat parent AnimateOnScroll mendapat class .aos-visible.

// Kuota dalam jumlah siswa maksimal (tim × maks. 3 orang)
const TARGETS = [
  { label: "DataViz Challenge", value: 105, quota: "35 tim", note: "maks. 105 siswa" },
  { label: "Young Data Researcher", value: 105, quota: "35 tim", note: "maks. 105 siswa" },
  { label: "Data Quiz Battle", value: 60, quota: "60 peserta", note: "individu" },
];
const MAX = 105;

// Porsi kuota per cabang (105 / 105 / 60 dari 270 siswa)
const DONUT = [
  { label: "DataViz", value: 105, color: "#48cae4" },
  { label: "YDR", value: 105, color: "#90e0ef" },
  { label: "Quiz", value: 60, color: "#0077b6" },
];
const DONUT_TOTAL = DONUT.reduce((s, d) => s + d.value, 0);
const DONUT_R = 38;
const DONUT_CIRC = 2 * Math.PI * DONUT_R;
const DONUT_SEGS = DONUT.map((d, i) => {
  const before = DONUT.slice(0, i).reduce((s, x) => s + x.value, 0);
  return { ...d, len: (d.value / DONUT_TOTAL) * DONUT_CIRC, offset: (before / DONUT_TOTAL) * DONUT_CIRC };
});

// Hari sejak 12 Nov 2026 → posisi x; urutan tahap → posisi y
const MILESTONES = [
  { day: 0, label: "Seminar" },
  { day: 4, label: "TM" },
  { day: 5, label: "Mulai" },
  { day: 14, label: "Submit" },
  { day: 19, label: "Finalis" },
  { day: 25, label: "Final" },
  { day: 28, label: "Awarding" },
];

const LW = 400;
const LH = 100;
const pts = MILESTONES.map((m, i) => ({
  ...m,
  x: 12 + (m.day / 28) * (LW - 24),
  y: LH - 16 - (i / (MILESTONES.length - 1)) * (LH - 34),
}));
const linePath = pts.map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ");
const areaPath = `${linePath} L${pts[pts.length - 1].x.toFixed(1)},${LH} L${pts[0].x.toFixed(1)},${LH} Z`;

export default function DataPulsePanel() {
  return (
    <div className="data-panel relative rounded-[var(--radius-cards)] border border-accent-primary/40 bg-liquid-deep/70 backdrop-blur-md p-[20px] sm:p-[24px] overflow-hidden">
      <div className="absolute inset-0 data-grid-bg pointer-events-none" aria-hidden="true" />

      {/* Header terminal */}
      <div className="relative flex items-center justify-between gap-[12px] pb-[14px] border-b border-accent-primary/25">
        <span className="flex items-center gap-[8px] text-[12px] uppercase tracking-[0.14em] text-liquid-mist">
          <span className="relative flex w-[8px] h-[8px]" aria-hidden="true">
            <span className="relative w-[8px] h-[8px] rounded-full bg-accent-secondary" />
          </span>
          Kuota Peserta · 2026
        </span>
        <span className="text-[11px] font-mono text-silver-mist">kuota_lomba.csv</span>
      </div>

      <div className="relative grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-[20px] pt-[18px]">
        {/* Horizontal bars */}
        <div className="flex flex-col gap-[12px]">
          {TARGETS.map((t, i) => (
            <div key={t.label} className="flex flex-col gap-[5px]">
              <div className="flex items-baseline justify-between gap-[8px] text-[12px]">
                <span className="text-liquid-mist">{t.label}</span>
                <span className="text-silver-mist">
                  Kuota <span className="text-platinum font-medium tabular-nums">{t.quota}</span> · {t.note}
                </span>
              </div>
              <div className="h-[8px] rounded-full bg-liquid-tide overflow-hidden">
                <div
                  className="data-bar h-full rounded-full"
                  style={{
                    width: `${(t.value / MAX) * 100}%`,
                    background: "linear-gradient(90deg, #0077b6, #48cae4 70%, #caf0f8)",
                    animationDelay: `${200 + i * 140}ms`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Donut porsi kategori */}
        <figure className="flex sm:flex-col items-center gap-[14px] sm:gap-[8px] m-0">
          <svg width="104" height="104" viewBox="0 0 104 104" className="flex-shrink-0 -rotate-90" role="img" aria-label="Porsi kuota peserta per cabang lomba">
            <circle cx="52" cy="52" r={DONUT_R} fill="none" stroke="#052166" strokeWidth="12" />
            {DONUT_SEGS.map((d, i) => (
              <circle
                key={d.label}
                className="data-donut-seg"
                cx="52"
                cy="52"
                r={DONUT_R}
                fill="none"
                stroke={d.color}
                strokeWidth="12"
                strokeDasharray={`${d.len - 2} ${DONUT_CIRC}`}
                strokeDashoffset={-d.offset}
                style={{ animationDelay: `${400 + i * 200}ms` }}
              />
            ))}
          </svg>
          <figcaption className="flex flex-col gap-[3px] text-[11px]">
            <span className="text-platinum text-[13px] font-medium sm:text-center">Total maks. {DONUT_TOTAL} siswa</span>
            {DONUT.map((d) => (
              <span key={d.label} className="flex items-center gap-[6px] text-silver-mist">
                <span className="w-[8px] h-[8px] rounded-[2px]" style={{ background: d.color }} />
                {d.label} {Math.round((d.value / DONUT_TOTAL) * 100)}%
              </span>
            ))}
          </figcaption>
        </figure>
      </div>

      {/* Garis perjalanan milestone */}
      <div className="relative mt-[20px] pt-[16px] border-t border-accent-primary/25">
        <div className="flex items-baseline justify-between text-[12px] mb-[6px]">
          <span className="uppercase tracking-[0.12em] text-liquid-mist">Perjalanan Event</span>
          <span className="text-silver-mist">12 Nov → 10 Des 2026</span>
        </div>
        <div className="relative">
        <svg viewBox={`0 0 ${LW} ${LH + 16}`} className="w-full h-auto block" role="img" aria-label="Linimasa milestone DATASPHERE 2026">
          <defs>
            <linearGradient id="dp-area" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#00b4d8" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#00b4d8" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="dp-line" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#0077b6" />
              <stop offset="60%" stopColor="#48cae4" />
              <stop offset="100%" stopColor="#caf0f8" />
            </linearGradient>
          </defs>
          <path d={areaPath} fill="url(#dp-area)" className="data-area" />
          <path d={linePath} fill="none" stroke="url(#dp-line)" strokeWidth="2.2" strokeLinejoin="round" className="data-line" pathLength={1} />
          {pts.map((p, i) => (
            <circle
              key={p.label}
              cx={p.x}
              cy={p.y}
              r="3.2"
              fill="#caf0f8"
              className="data-point"
              style={{ animationDelay: `${600 + i * 150}ms` }}
            />
          ))}
          {/* Pulsa yang berjalan di sepanjang garis */}
          <circle r="4" fill="#ffffff" className="data-runner">
            <animateMotion dur="5s" repeatCount="indefinite" path={linePath} />
          </circle>
        </svg>
        {/* Label HTML (ukuran tetap 11px di semua layar), diposisikan dalam % dari viewBox */}
        {pts.map((p, i) => (
          <span
            key={p.label}
            className="data-point absolute text-[11px] leading-none text-silver-mist whitespace-nowrap"
            style={{
              left: `${(p.x / LW) * 100}%`,
              top: `${((i % 2 === 0 ? p.y - 14 : p.y + 8) / (LH + 16)) * 100}%`,
              transform: `translateX(${i === 0 ? "0" : i === pts.length - 1 ? "-100%" : "-50%"})`,
              animationDelay: `${600 + i * 150}ms`,
            }}
          >
            {p.label}
          </span>
        ))}
        </div>
      </div>
    </div>
  );
}
