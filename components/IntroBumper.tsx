"use client";

import { useEffect, useRef, useState, useCallback } from "react";

/**
 * DATASPHERE 2026 — Intro Bumper Animation
 *
 * Fullscreen cinematic bumper that plays once per session on the homepage:
 * - 0–1.1s: 200 bioluminescent particles appear randomly with smooth fade-in & drift
 * - 1.1–2.4s: Particles travel smoothly to form a central sphere silhouette
 * - 2.4–3.2s: Particles dissolve/scatter while "DATASPHERE" wordmark scales & fades in
 * - 3.2–4.0s: "IDEAS, INNOVATION, AND IMPACT" tagline fades in & lingers for impact
 * - 4.0–4.8s: Full overlay dissolves cleanly revealing the main site
 *
 * Honors `prefers-reduced-motion` and `sessionStorage.datasphere_intro_seen`.
 */

const STORAGE_KEY = "datasphere_intro_seen";
const PARTICLE_COUNT = 200;
const PARTICLE_COLORS = ["#48cae4", "#0096c7", "#00b4d8", "#90e0ef"];

interface Particle {
  startX: number;
  startY: number;
  targetX: number;
  targetY: number;
  currentX: number;
  currentY: number;
  dirX: number;
  dirY: number;
  radius: number;
  color: string;
  glow: number;
}

export default function IntroBumper() {
  const [isVisible, setIsVisible] = useState(true);
  const [showSkip, setShowSkip] = useState(false);
  const [isSkipping, setIsSkipping] = useState(false);

  // Animation values for text and overlay
  const [wordmarkOpacity, setWordmarkOpacity] = useState(0);
  const [wordmarkScale, setWordmarkScale] = useState(0.9);
  const [taglineOpacity, setTaglineOpacity] = useState(0);
  const [taglineY, setTaglineY] = useState(8);
  const [overlayOpacity, setOverlayOpacity] = useState(1);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animFrameRef = useRef<number | null>(null);
  const isDoneRef = useRef(false);

  const finishIntro = useCallback(() => {
    if (isDoneRef.current) return;
    isDoneRef.current = true;
    try {
      sessionStorage.setItem(STORAGE_KEY, "true");
    } catch {
      // Storage unavailable or disabled
    }
    setIsVisible(false);
  }, []);

  const handleSkip = useCallback(() => {
    if (isDoneRef.current) return;
    setIsSkipping(true);
    setOverlayOpacity(0);
    try {
      sessionStorage.setItem(STORAGE_KEY, "true");
    } catch {
      // Storage unavailable or disabled
    }
    setTimeout(() => {
      finishIntro();
    }, 250);
  }, [finishIntro]);

  useEffect(() => {
    // 1. Check if already seen in current session
    try {
      if (sessionStorage.getItem(STORAGE_KEY) === "true") {
        setIsVisible(false);
        return;
      }
    } catch {
      // Ignore sessionStorage access errors
    }

    // 2. Prevent body scroll while bumper is active
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    // 3. Show "Lewati" button after 0.5 seconds
    const skipTimer = setTimeout(() => {
      setShowSkip(true);
    }, 500);

    // 4. Check prefers-reduced-motion
    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion) {
      // Directly show logo + tagline without particle canvas animation
      setWordmarkOpacity(1);
      setWordmarkScale(1);
      setTaglineOpacity(1);
      setTaglineY(0);

      // Fade out after 1 second
      const reducedMotionTimer = setTimeout(() => {
        setIsSkipping(true);
        setOverlayOpacity(0);
        setTimeout(() => {
          document.body.style.overflow = originalOverflow;
          finishIntro();
        }, 500);
      }, 1000);

      return () => {
        clearTimeout(skipTimer);
        clearTimeout(reducedMotionTimer);
        document.body.style.overflow = originalOverflow;
      };
    }

    // 5. Canvas particle setup & animation
    const canvas = canvasRef.current;
    if (!canvas) {
      document.body.style.overflow = originalOverflow;
      return;
    }

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      document.body.style.overflow = originalOverflow;
      return;
    }

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    // Generate sphere targets using spherical Fibonacci distribution
    const sphereRadius = Math.max(85, Math.min(width, height) * 0.17);
    const centerX = width / 2;
    const centerY = height / 2;

    const particles: Particle[] = [];

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      // Golden ratio spherical projection
      const phi = Math.acos(1 - (2 * (i + 0.5)) / PARTICLE_COUNT);
      const theta = Math.PI * (1 + Math.sqrt(5)) * i;

      // 3D coordinates on unit sphere
      const x3d = Math.sin(phi) * Math.cos(theta);
      const y3d = Math.sin(phi) * Math.sin(theta);
      const z3d = Math.cos(phi);

      // Subtle tilt for perspective
      const tilt = 0.32;
      const rotY = y3d * Math.cos(tilt) - z3d * Math.sin(tilt);

      const targetX = centerX + x3d * sphereRadius;
      const targetY = centerY + rotY * sphereRadius;

      // Random starting position across screen with subtle organic drift
      const startX = Math.random() * width;
      const startY = Math.random() * height;

      // Outward dissolve scatter vector
      const dx = targetX - centerX;
      const dy = targetY - centerY;
      const dist = Math.hypot(dx, dy) || 1;

      particles.push({
        startX,
        startY,
        targetX,
        targetY,
        currentX: startX,
        currentY: startY,
        dirX: dx / dist,
        dirY: dy / dist,
        radius: 1 + Math.random() * 1.2,
        color: PARTICLE_COLORS[i % PARTICLE_COLORS.length],
        glow: 4 + Math.random() * 5,
      });
    }

    // Resize handler
    const handleResize = () => {
      if (!canvas) return;
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
    };
    window.addEventListener("resize", handleResize);

    // Smooth cubic ease-in-out easing
    const easeInOutCubic = (t: number) => {
      return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    };

    // Smooth ease-out quad
    const easeOutQuad = (t: number) => 1 - (1 - t) * (1 - t);

    const startTime = performance.now();
    // Extended cinematic duration (~4.8 seconds total)
    const TOTAL_DURATION = 4800;

    const render = (now: number) => {
      if (isDoneRef.current) return;

      const elapsed = now - startTime;
      const sec = elapsed / 1000;

      // Clear canvas
      ctx.clearRect(0, 0, width, height);

      // ── Stage 1: 0 - 1.1s ── (Random scattered particles appear & fade in smoothly)
      if (sec < 1.1) {
        const p1 = Math.min(1, sec / 0.8);
        for (const p of particles) {
          ctx.save();
          ctx.globalAlpha = p1;
          ctx.fillStyle = p.color;
          ctx.shadowColor = p.color;
          ctx.shadowBlur = p.glow;
          ctx.beginPath();
          ctx.arc(p.startX, p.startY, p.radius, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
      }
      // ── Stage 2: 1.1 - 2.4s ── (Travel smoothly towards central sphere silhouette)
      else if (sec >= 1.1 && sec < 2.4) {
        const p2 = Math.min(1, (sec - 1.1) / 1.3);
        const eased = easeInOutCubic(p2);

        for (const p of particles) {
          p.currentX = p.startX + (p.targetX - p.startX) * eased;
          p.currentY = p.startY + (p.targetY - p.startY) * eased;

          ctx.save();
          ctx.globalAlpha = 1;
          ctx.fillStyle = p.color;
          ctx.shadowColor = p.color;
          ctx.shadowBlur = p.glow;
          ctx.beginPath();
          ctx.arc(p.currentX, p.currentY, p.radius, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
      }
      // ── Stage 3: 2.4 - 3.2s ── (Particles dissolve & scatter, DATASPHERE wordmark fades/scales in)
      else if (sec >= 2.4 && sec < 3.2) {
        const p3 = Math.min(1, (sec - 2.4) / 0.8);
        const particleAlpha = Math.max(0, 1 - p3);

        if (particleAlpha > 0) {
          for (const p of particles) {
            const scatterX = p.targetX + p.dirX * 36 * p3;
            const scatterY = p.targetY + p.dirY * 36 * p3;

            ctx.save();
            ctx.globalAlpha = particleAlpha;
            ctx.fillStyle = p.color;
            ctx.shadowColor = p.color;
            ctx.shadowBlur = p.glow * particleAlpha;
            ctx.beginPath();
            ctx.arc(scatterX, scatterY, p.radius, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
          }
        }

        const wmEase = easeOutQuad(p3);
        setWordmarkOpacity(wmEase);
        setWordmarkScale(0.92 + 0.08 * wmEase);
      }
      // ── Stage 4: 3.2 - 4.0s ── (Tagline fades in below wordmark, lingering for readability)
      else if (sec >= 3.2 && sec < 4.0) {
        setWordmarkOpacity(1);
        setWordmarkScale(1);

        const p4 = Math.min(1, (sec - 3.2) / 0.8);
        const tagEase = easeOutQuad(p4);
        setTaglineOpacity(tagEase);
        setTaglineY((1 - tagEase) * 8);
      }
      // ── Stage 5: 4.0 - 4.8s ── (Entire overlay gracefully fades out, revealing homepage)
      else if (sec >= 4.0 && sec <= 4.8) {
        setWordmarkOpacity(1);
        setWordmarkScale(1);
        setTaglineOpacity(1);
        setTaglineY(0);

        const p5 = Math.min(1, (sec - 4.0) / 0.8);
        setOverlayOpacity(Math.max(0, 1 - p5));
      }

      // Finish at >= 4.8s
      if (elapsed >= TOTAL_DURATION) {
        document.body.style.overflow = originalOverflow;
        finishIntro();
        return;
      }

      animFrameRef.current = requestAnimationFrame(render);
    };

    animFrameRef.current = requestAnimationFrame(render);

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
      clearTimeout(skipTimer);
      window.removeEventListener("resize", handleResize);
      document.body.style.overflow = originalOverflow;
    };
  }, [finishIntro]);

  if (!isVisible) return null;

  return (
    <div
      id="datasphere-intro-bumper"
      className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden bg-[#01012f] select-none"
      style={{
        opacity: overlayOpacity,
        transition: isSkipping ? "opacity 0.25s ease-out" : undefined,
        pointerEvents: overlayOpacity <= 0 ? "none" : "auto",
      }}
      aria-label="DATASPHERE 2026 Intro Animation"
      role="dialog"
      aria-modal="true"
    >
      {/* Inline early-exit script to prevent flash if already seen */}
      <script
        dangerouslySetInnerHTML={{
          __html: `if(typeof window!=='undefined'&&window.sessionStorage.getItem('${STORAGE_KEY}')==='true'){var el=document.getElementById('datasphere-intro-bumper');if(el){el.style.display='none';}}`,
        }}
      />

      {/* HTML5 Canvas for high-performance particle animation */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none block"
      />

      {/* Center Wordmark & Tagline */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center px-6 pointer-events-none">
        <h1
          style={{
            opacity: wordmarkOpacity,
            transform: `scale(${wordmarkScale})`,
          }}
          className="font-matter font-medium text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-[#ffffff] tracking-[0.22em] uppercase leading-none drop-shadow-[0_0_35px_rgba(72,202,228,0.45)] transition-transform duration-75"
        >
          DATASPHERE
        </h1>
        <p
          style={{
            opacity: taglineOpacity,
            transform: `translateY(${taglineY}px)`,
          }}
          className="mt-4 sm:mt-5 text-xs sm:text-sm md:text-base font-matter font-normal uppercase tracking-[0.25em] text-[#ade8f4] drop-shadow-[0_0_18px_rgba(173,232,244,0.35)] transition-transform duration-75"
        >
          IDEAS, INNOVATION, AND IMPACT
        </p>
      </div>

      {/* Lewati (Skip) button at bottom-right */}
      {showSkip && (
        <button
          type="button"
          onClick={handleSkip}
          className="fixed bottom-6 right-6 z-20 px-3.5 py-1.5 rounded-[6px] text-xs font-arial uppercase tracking-wider text-[#ade8f4] border border-[#ade8f4]/25 bg-[#01012f]/80 backdrop-blur-sm hover:text-white hover:border-[#00b4d8] hover:bg-[#052166] transition-all duration-200 cursor-pointer shadow-lg active:scale-95"
          aria-label="Lewati animasi intro"
        >
          Lewati
        </button>
      )}
    </div>
  );
}
