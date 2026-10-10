"use client";

import { COUNTDOWN_TARGET } from "@/lib/event-data";
import { useNow } from "@/lib/use-now";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const UNITS: { key: keyof TimeLeft; label: string }[] = [
  { key: "days", label: "Hari" },
  { key: "hours", label: "Jam" },
  { key: "minutes", label: "Menit" },
  { key: "seconds", label: "Detik" },
];

function getTimeLeft(target: number, now: number): TimeLeft {
  const diff = Math.max(target - now, 0);
  return {
    days: Math.floor(diff / 86_400_000),
    hours: Math.floor((diff % 86_400_000) / 3_600_000),
    minutes: Math.floor((diff % 3_600_000) / 60_000),
    seconds: Math.floor((diff % 60_000) / 1000),
  };
}

export default function Countdown() {
  const now = useNow();
  const timeLeft = now === null ? null : getTimeLeft(new Date(COUNTDOWN_TARGET.iso).getTime(), now);

  return (
    <div className="grid grid-cols-4 gap-[12px] sm:gap-[20px] w-full max-w-[540px]">
      {UNITS.map((u) => (
        <div
          key={u.key}
          className="flex flex-col items-center bg-liquid-tide border border-accent-primary/30 py-[16px] px-[8px] rounded-[var(--radius-small)]"
        >
          <span className="text-[clamp(1.8rem,4vw,3.2rem)] font-medium text-lavender-phosphor leading-none tabular-nums">
            {timeLeft ? String(timeLeft[u.key]).padStart(2, "0") : "--"}
          </span>
          <span className="text-[11px] uppercase tracking-[0.12em] text-silver-mist mt-[6px]">
            {u.label}
          </span>
        </div>
      ))}
    </div>
  );
}
