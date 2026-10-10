"use client";

import { useEffect, useRef, type ReactNode } from "react";

interface AnimateOnScrollProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  /** Animation variant */
  animation?: "fade-up" | "fade-in" | "scale-in" | "slide-left" | "slide-right";
}

export default function AnimateOnScroll({
  children,
  className = "",
  delay = 0,
  animation = "fade-up",
}: AnimateOnScrollProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Pengguna yang memilih "kurangi gerakan": tampilkan langsung tanpa menunggu scroll
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.classList.add("aos-visible");
      return;
    }

    // If already in viewport on mount, reveal immediately with delay
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight + 50 && rect.bottom > -50) {
      const timer = setTimeout(() => {
        el.classList.add("aos-visible");
      }, delay);
      return () => clearTimeout(timer);
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            el.classList.add("aos-visible");
          }, delay);
          observer.unobserve(el);
        }
      },
      { threshold: 0.05, rootMargin: "200px 0px -20px 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [delay]);

  return (
    <div ref={ref} className={`aos-element aos-${animation} ${className}`}>
      {children}
    </div>
  );
}
