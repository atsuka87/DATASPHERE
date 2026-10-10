"use client";

import { useEffect, useRef } from "react";

/**
 * Jaringan partikel "data network": node bercahaya yang saling terhubung,
 * dengan paket data kecil yang mengalir di sepanjang garis koneksi.
 * - HiDPI (devicePixelRatio) supaya tajam di HP/laptop modern
 * - Berhenti saat tidak terlihat (offscreen / tab tersembunyi) untuk hemat baterai
 * - prefers-reduced-motion: hanya menggambar satu frame statis
 */

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  color: [number, number, number];
  baseAlpha: number;
  phase: number;
}

interface Packet {
  from: number;
  to: number;
  t: number;
  speed: number;
}

const PALETTE: [number, number, number][] = [
  [0, 180, 216], // accent-secondary
  [72, 202, 228],
  [144, 224, 239], // lavender-phosphor
  [202, 240, 248], // liquid-mist
  [255, 255, 255],
];

// Jarak koneksi menyesuaikan lebar layar (lebih pendek di HP supaya tidak semrawut)
let LINK_DIST = 140;

function makeGlowSprite(): HTMLCanvasElement {
  const s = document.createElement("canvas");
  s.width = s.height = 64;
  const g = s.getContext("2d")!;
  const grad = g.createRadialGradient(32, 32, 0, 32, 32, 32);
  grad.addColorStop(0, "rgba(144,224,239,0.9)");
  grad.addColorStop(0.25, "rgba(0,180,216,0.35)");
  grad.addColorStop(1, "rgba(0,180,216,0)");
  g.fillStyle = grad;
  g.fillRect(0, 0, 64, 64);
  return s;
}

export default function BioluminescentBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const parent = canvas?.parentElement;
    if (!canvas || !parent) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const glow = makeGlowSprite();

    let width = 0;
    let height = 0;
    let nodes: Node[] = [];
    let packets: Packet[] = [];
    let mouseX = -9999;
    let mouseY = -9999;
    let frame = 0;
    let running = false;
    let inView = true;
    let time = 0;

    const fitCanvas = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = parent.clientWidth;
      height = parent.clientHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      LINK_DIST = width < 640 ? 110 : 140;
    };

    const seed = () => {
      fitCanvas();
      const count = Math.max(width < 640 ? 34 : 24, Math.min(Math.floor((width * height) / 14000), 90));
      nodes = Array.from({ length: count }, () => {
        const bright = Math.random() > 0.8;
        return {
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.3,
          vy: (Math.random() - 0.5) * 0.3,
          r: bright ? 1.8 + Math.random() * 1.2 : 1 + Math.random() * 1.4,
          color: PALETTE[bright ? 3 + Math.floor(Math.random() * 2) : Math.floor(Math.random() * 3)],
          baseAlpha: bright ? 0.85 : 0.45 + Math.random() * 0.3,
          phase: Math.random() * Math.PI * 2,
        };
      });
      packets = [];
    };

    const spawnPacket = () => {
      const a = Math.floor(Math.random() * nodes.length);
      let best = -1;
      let bestD = LINK_DIST;
      for (let j = 0; j < nodes.length; j++) {
        if (j === a) continue;
        const d = Math.hypot(nodes[a].x - nodes[j].x, nodes[a].y - nodes[j].y);
        if (d < bestD) {
          bestD = d;
          best = j;
        }
      }
      if (best >= 0) packets.push({ from: a, to: best, t: 0, speed: 0.008 + Math.random() * 0.012 });
    };

    const draw = (step: boolean) => {
      ctx.clearRect(0, 0, width, height);
      if (step) time += 0.016;

      // Gerak node
      for (const n of nodes) {
        if (step) {
          n.x += n.vx;
          n.y += n.vy;
          if (n.x < -20) n.x = width + 20;
          if (n.x > width + 20) n.x = -20;
          if (n.y < -20) n.y = height + 20;
          if (n.y > height + 20) n.y = -20;

          const dx = n.x - mouseX;
          const dy = n.y - mouseY;
          const d = Math.hypot(dx, dy);
          if (d < 150 && d > 0) {
            n.x += (dx / d) * 0.6;
            n.y += (dy / d) * 0.6;
          }
        }
      }

      // Garis koneksi
      ctx.lineWidth = 0.7;
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i];
          const b = nodes[j];
          const d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d < LINK_DIST) {
            ctx.strokeStyle = `rgba(72, 202, 228, ${(1 - d / LINK_DIST) * 0.22})`;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      // Node bercahaya
      for (const n of nodes) {
        const pulse = Math.sin(time * 1.4 + n.phase) * 0.18;
        const near = Math.max(0, 1 - Math.hypot(n.x - mouseX, n.y - mouseY) / 150);
        const alpha = Math.min(1, n.baseAlpha + pulse + near * 0.4);
        const glowSize = n.r * 9 * (1 + near * 0.5);
        ctx.globalAlpha = alpha * 0.55;
        ctx.drawImage(glow, n.x - glowSize / 2, n.y - glowSize / 2, glowSize, glowSize);
        ctx.globalAlpha = 1;
        ctx.fillStyle = `rgba(${n.color[0]}, ${n.color[1]}, ${n.color[2]}, ${alpha})`;
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fill();
      }

      // Paket data mengalir di sepanjang koneksi
      if (step && packets.length < Math.min(14, nodes.length / 4) && Math.random() < 0.06) spawnPacket();
      packets = packets.filter((p) => {
        const a = nodes[p.from];
        const b = nodes[p.to];
        if (!a || !b || Math.hypot(a.x - b.x, a.y - b.y) > LINK_DIST * 1.3) return false;
        if (step) p.t += p.speed;
        if (p.t >= 1) return false;
        const x = a.x + (b.x - a.x) * p.t;
        const y = a.y + (b.y - a.y) * p.t;
        // ekor
        const tx = a.x + (b.x - a.x) * Math.max(0, p.t - 0.18);
        const ty = a.y + (b.y - a.y) * Math.max(0, p.t - 0.18);
        const grad = ctx.createLinearGradient(tx, ty, x, y);
        grad.addColorStop(0, "rgba(202, 240, 248, 0)");
        grad.addColorStop(1, "rgba(202, 240, 248, 0.9)");
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.moveTo(tx, ty);
        ctx.lineTo(x, y);
        ctx.stroke();
        ctx.globalAlpha = 0.9;
        ctx.drawImage(glow, x - 9, y - 9, 18, 18);
        ctx.globalAlpha = 1;
        return true;
      });
    };

    const loop = () => {
      draw(true);
      frame = requestAnimationFrame(loop);
    };
    const start = () => {
      if (running || reduceMotion || !inView || document.hidden) return;
      running = true;
      frame = requestAnimationFrame(loop);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(frame);
    };

    seed();
    draw(false);
    start();

    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
    };
    const onMouseLeave = () => {
      mouseX = mouseY = -9999;
    };
    // Sentuhan di HP: partikel menyibak di sekitar jari (passive, tidak menghalangi scroll)
    const onTouch = (e: TouchEvent) => {
      const t = e.touches[0];
      if (!t) return;
      const rect = canvas.getBoundingClientRect();
      mouseX = t.clientX - rect.left;
      mouseY = t.clientY - rect.top;
    };
    const onVisibility = () => (document.hidden ? stop() : start());

    const io = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      if (inView) start();
      else stop();
    });
    io.observe(canvas);

    // Resize (rotasi HP, address bar muncul/hilang): posisi node diskalakan, bukan diacak ulang,
    // supaya partikel tidak "lompat"
    const ro = new ResizeObserver(() => {
      const oldW = width;
      const oldH = height;
      fitCanvas();
      if (!oldW || !oldH) return;
      if (width === oldW && height === oldH) return;
      for (const n of nodes) {
        n.x *= width / oldW;
        n.y *= height / oldH;
      }
      if (!running) draw(false);
    });
    ro.observe(parent);

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    document.addEventListener("mouseleave", onMouseLeave);
    window.addEventListener("touchstart", onTouch, { passive: true });
    window.addEventListener("touchmove", onTouch, { passive: true });
    window.addEventListener("touchend", onMouseLeave, { passive: true });
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      stop();
      io.disconnect();
      ro.disconnect();
      window.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseleave", onMouseLeave);
      window.removeEventListener("touchstart", onTouch);
      window.removeEventListener("touchmove", onTouch);
      window.removeEventListener("touchend", onMouseLeave);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-0" aria-hidden="true" />;
}
