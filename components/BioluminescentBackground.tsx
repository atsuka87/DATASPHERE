"use client";

import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  alpha: number;
  baseAlpha: number;
  pulseSpeed: number;
  pulsePhase: number;
}

export default function BioluminescentBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || window.innerHeight);

    // Mouse tracking for subtle interactive reaction
    let mouseX = -1000;
    let mouseY = -1000;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
    };

    const handleMouseLeave = () => {
      mouseX = -1000;
      mouseY = -1000;
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("mouseleave", handleMouseLeave);

    // Color palette strictly from Ocean Blue Serenity
    const colors = [
      "rgba(0, 119, 182, ",   // Accent Primary (#0077B6)
      "rgba(0, 180, 216, ",   // Accent Secondary (#00B4D8)
      "rgba(202, 240, 248, ", // Mist Light Blue (#CAF0F8)
      "rgba(144, 224, 239, ", // Phosphor Blue (#90E0EF)
      "rgba(255, 255, 255, ", // Platinum Sparkle
    ];

    // Initialize particles (restrained count for elegance and 60fps performance)
    const particleCount = Math.min(Math.floor((width * height) / 16000), 55);
    const particles: Particle[] = [];

    for (let i = 0; i < particleCount; i++) {
      const isPhosphor = Math.random() > 0.75;
      const isWhite = !isPhosphor && Math.random() > 0.7;
      const colorPrefix = isPhosphor
        ? colors[3]
        : isWhite
        ? colors[4]
        : colors[Math.floor(Math.random() * 3)];

      const baseAlpha = isWhite ? 0.65 : isPhosphor ? 0.5 : 0.35 + Math.random() * 0.3;

      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        radius: isWhite ? 1.5 + Math.random() * 1.2 : 1.2 + Math.random() * 1.8,
        color: colorPrefix,
        alpha: baseAlpha,
        baseAlpha,
        pulseSpeed: 0.02 + Math.random() * 0.03,
        pulsePhase: Math.random() * Math.PI * 2,
      });
    }

    let time = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      time += 0.015;

      // Update and draw particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Organic drift
        p.x += p.vx;
        p.y += p.vy;

        // Wrap edges smoothly
        if (p.x < -20) p.x = width + 20;
        if (p.x > width + 20) p.x = -20;
        if (p.y < -20) p.y = height + 20;
        if (p.y > height + 20) p.y = -20;

        // Mouse proximity reaction
        const dx = mouseX - p.x;
        const dy = mouseY - p.y;
        const distToMouse = Math.sqrt(dx * dx + dy * dy);
        let mouseBoost = 0;

        if (distToMouse < 160) {
          mouseBoost = (1 - distToMouse / 160) * 0.45;
          // Gentle push away
          p.x -= (dx / distToMouse) * 0.4;
          p.y -= (dy / distToMouse) * 0.4;
        }

        // Bioluminescent breathing pulse
        const pulse = Math.sin(time * p.pulseSpeed + p.pulsePhase) * 0.2;
        const currentAlpha = Math.min(1, Math.max(0.1, p.baseAlpha + pulse + mouseBoost));

        // Draw particle glow
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius * (1 + mouseBoost * 0.4), 0, Math.PI * 2);
        ctx.fillStyle = `${p.color}${currentAlpha})`;
        ctx.shadowColor = p.color === colors[3] ? "rgba(144, 224, 239, 0.6)" : "rgba(0, 150, 199, 0.6)";
        ctx.shadowBlur = p.radius * 6;
        ctx.fill();

        // Connect nearby nodes (Geometric Molecular Network from DESIGN.md)
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const ndx = p.x - p2.x;
          const ndy = p.y - p2.y;
          const nDist = Math.sqrt(ndx * ndx + ndy * ndy);

          if (nDist < 120) {
            const lineAlpha = (1 - nDist / 120) * 0.12 * Math.min(currentAlpha, p2.alpha);
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(0, 150, 199, ${lineAlpha})`;
            ctx.lineWidth = 0.8;
            ctx.shadowBlur = 0;
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    // Resize handler
    const handleResize = () => {
      if (!canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };

    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none z-0 opacity-80"
      aria-hidden="true"
    />
  );
}
