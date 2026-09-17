"use client";

import { useEffect, useRef, useState } from "react";

interface StatCounterProps {
  end: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
  label: string;
}

export default function StatCounter({
  end,
  suffix = "",
  prefix = "",
  duration = 1600,
  label,
}: StatCounterProps) {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const elementRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = elementRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated) {
          setHasAnimated(true);

          const startTime = performance.now();
          const step = (currentTime: number) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Ease out cubic
            const easeProgress = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(easeProgress * end));

            if (progress < 1) {
              requestAnimationFrame(step);
            } else {
              setCount(end);
            }
          };

          requestAnimationFrame(step);
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [end, duration, hasAnimated]);

  return (
    <div ref={elementRef} className="flex flex-col gap-[6px] group">
      <span className="stat-number transition-all duration-300 group-hover:scale-105 inline-block">
        {prefix}
        {count}
        {suffix}
      </span>
      <span className="stat-label text-[13px] tracking-[0.06em] text-liquid-mist">
        {label}
      </span>
    </div>
  );
}
