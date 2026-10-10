import type { CategoryId } from "@/lib/event-data";

// Ilustrasi data animasi kecil per kategori (SVG + CSS, tanpa library).
// DataViz → bar chart tumbuh · Quiz → timer & pilihan jawaban · Research → scatter + garis tren

function DataVizGlyph() {
  const bars = [34, 58, 44, 72, 52, 86];
  return (
    <svg viewBox="0 0 120 80" className="w-full h-full" aria-hidden="true">
      <line x1="6" y1="72" x2="114" y2="72" stroke="#0077b6" strokeOpacity="0.6" />
      {bars.map((h, i) => (
        <rect
          key={i}
          x={10 + i * 17.5}
          y={72 - h * 0.75}
          width="11"
          height={h * 0.75}
          rx="2"
          fill={i === bars.length - 1 ? "#caf0f8" : i % 2 ? "#48cae4" : "#00b4d8"}
          className="glyph-bar"
          style={{ animationDelay: `${i * 0.18}s` }}
        />
      ))}
      <polyline
        points={bars.map((h, i) => `${15.5 + i * 17.5},${66 - h * 0.75}`).join(" ")}
        fill="none"
        stroke="#ffffff"
        strokeWidth="1.5"
        strokeDasharray="3 3"
        className="glyph-trend"
      />
    </svg>
  );
}

function QuizGlyph() {
  const r = 26;
  const c = 2 * Math.PI * r;
  return (
    <svg viewBox="0 0 120 80" className="w-full h-full" aria-hidden="true">
      <circle cx="34" cy="40" r={r} fill="none" stroke="#052166" strokeWidth="6" />
      <circle
        cx="34"
        cy="40"
        r={r}
        fill="none"
        stroke="#48cae4"
        strokeWidth="6"
        strokeLinecap="round"
        strokeDasharray={c}
        className="glyph-timer"
        style={{ ["--c" as string]: c }}
        transform="rotate(-90 34 40)"
      />
      <text x="34" y="45" textAnchor="middle" fontSize="15" fill="#ffffff" fontWeight="500">
        ?
      </text>
      {["A", "B", "C", "D"].map((l, i) => (
        <g key={l} className={i === 2 ? "glyph-answer" : undefined}>
          <rect x="70" y={10 + i * 16} width="44" height="12" rx="3" fill={i === 2 ? "#00b4d8" : "#052166"} stroke="#0077b6" strokeOpacity="0.6" />
          <text x="76" y={19.5 + i * 16} fontSize="8" fill={i === 2 ? "#01012f" : "#ade8f4"}>
            {l}
          </text>
        </g>
      ))}
    </svg>
  );
}

function ResearchGlyph() {
  const dots = [
    [14, 62], [22, 56], [28, 60], [36, 48], [44, 52], [50, 42], [58, 46],
    [66, 34], [72, 38], [80, 28], [88, 30], [96, 20], [104, 22],
  ];
  return (
    <svg viewBox="0 0 120 80" className="w-full h-full" aria-hidden="true">
      <line x1="8" y1="72" x2="114" y2="72" stroke="#0077b6" strokeOpacity="0.6" />
      <line x1="8" y1="8" x2="8" y2="72" stroke="#0077b6" strokeOpacity="0.6" />
      {dots.map(([x, y], i) => (
        <circle
          key={i}
          cx={x}
          cy={y}
          r="3"
          fill={i % 3 === 0 ? "#caf0f8" : "#48cae4"}
          className="glyph-dot"
          style={{ animationDelay: `${i * 0.12}s` }}
        />
      ))}
      <line x1="12" y1="66" x2="110" y2="16" stroke="#ffffff" strokeWidth="1.5" className="glyph-fit" pathLength={1} />
      <circle cx="96" cy="20" r="9" fill="none" stroke="#90e0ef" strokeWidth="1.2" className="glyph-lens" />
    </svg>
  );
}

export default function CategoryGlyph({ id }: { id: CategoryId }) {
  return (
    <div className="glyph h-[88px] w-full max-w-[160px]">
      {id === "dataviz" && <DataVizGlyph />}
      {id === "quiz" && <QuizGlyph />}
      {id === "research" && <ResearchGlyph />}
    </div>
  );
}
