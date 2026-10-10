"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

/**
 * DATASPHERE 2026 — Brand-Defining 3D Bioluminescent Data Orb
 * Rendered in ocean blue, electric cyan, and white dots, picking up canvas deep ocean
 * and aurora accent cyan/phosphor with harmonic wave breathing and mouse parallax.
 */

const SPHERE_RADIUS = 2.05;

// Ukuran titik relatif terhadap tinggi canvas acuan desktop (620px)
const pointScale = (height: number) => Math.min(1, Math.max(0.4, height / 620));

export default function ParticleSphere() {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const frameRef = useRef<number>(0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Jumlah partikel lebih hemat di layar kecil (HP)
    const isSmall = window.innerWidth < 768;
    const OUTER_PARTICLES = isSmall ? 1600 : 3000;
    const INNER_CORE_PARTICLES = isSmall ? 450 : 850;
    const STREAM_PARTICLES = isSmall ? 260 : 420;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // ── 1. Scene & Camera Setup ──
    const scene = new THREE.Scene();

    const w = container.clientWidth || 800;
    const h = container.clientHeight || 420;

    const camera = new THREE.PerspectiveCamera(42, w / h, 0.1, 100);
    camera.position.set(0, 0, 7.6);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Master orientation group
    const masterGroup = new THREE.Group();
    scene.add(masterGroup);

    // Inner group for secondary counter-rotation
    const innerGroup = new THREE.Group();
    masterGroup.add(innerGroup);

    // ── 2. Custom Point Shader for Bioluminescent Dots ──
    const particleMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
        uScale: { value: pointScale(h) },
        uIntensity: { value: h < 400 ? 0.78 : 1.0 },
      },
      vertexShader: `
        attribute float size;
        attribute float isSparkle;
        attribute float isPinkAccent;
        attribute float customPhase;
        varying vec3 vColor;
        varying float vAlpha;
        varying float vIsSparkle;
        uniform float uTime;
        uniform float uPixelRatio;
        uniform float uScale;

        void main() {
          vIsSparkle = isSparkle;

          // Harmonic data wave breathing across surface
          vec3 pos = position;
          float wave = sin(pos.x * 2.6 + uTime * 1.2 + customPhase) *
                       cos(pos.y * 2.6 + uTime * 0.9) *
                       sin(pos.z * 2.6 + uTime * 0.8) * 0.05;
          pos += normalize(position) * wave;

          vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);

          // ── Color Definition: Ocean Blue Serenity Final ──
          vec3 deepOcean    = vec3(0.01, 0.24, 0.54); // #023E8A (liquid-kelp)
          vec3 oceanBlue    = vec3(0.00, 0.47, 0.71); // #0077B6 (accent-primary)
          vec3 electricCyan = vec3(0.00, 0.71, 0.85); // #00B4D8 (accent-secondary)
          
          // Phosphor blue & soft mist highlights
          vec3 phosphorBlue = vec3(0.56, 0.88, 0.94); // #90E0EF (lavender-phosphor)
          vec3 mistLight    = vec3(0.79, 0.94, 0.97); // #CAF0F8 (liquid-mist)
          
          // Diamond white sparkle
          vec3 whiteDot     = vec3(1.00, 1.00, 1.00);

          vec3 norm = normalize(pos);
          float lat = norm.y; // -1 to 1

          // Bioluminescent wave passing across the sphere
          float wavePulse = sin(uTime * 1.0 + norm.y * 2.5 + norm.x * 1.8) * 0.5 + 0.5;

          // Color logic:
          // Lower hemisphere / body: Deep ocean to electric cyan
          float blueFactor = smoothstep(-0.8, 0.4, lat);
          vec3 blueBase = mix(deepOcean, mix(oceanBlue, electricCyan, blueFactor), 0.85);

          // Upper crest / designated phosphor particles: Phosphor Blue
          vec3 phosphorCol = mix(phosphorBlue, mistLight, 0.4 + 0.3 * sin(uTime + norm.z));

          vec3 finalColor = blueBase;

          if (isSparkle > 0.5) {
            finalColor = whiteDot;
          } else if (isPinkAccent > 0.5 || (lat > 0.25 && wavePulse > 0.45)) {
            // Naturally blend in phosphor blue at top and in active wave pulses
            float pBlend = isPinkAccent > 0.5 ? 0.9 : smoothstep(0.25, 0.8, lat) * 0.85;
            finalColor = mix(blueBase, phosphorCol, pBlend);
          }

          vColor = finalColor;

          // Point sizing
          // uScale: titik ikut mengecil di canvas kecil (HP) supaya tidak menumpuk jadi gumpalan putih
          gl_PointSize = size * uPixelRatio * uScale * (42.0 / -mvPosition.z);
          gl_Position = projectionMatrix * mvPosition;

          // Depth fade: front is sharp and radiant, back is subtle
          float depthFade = smoothstep(-9.2, -6.0, mvPosition.z);
          vAlpha = 0.5 + 0.5 * depthFade;
        }
      `,
      fragmentShader: `
        uniform float uIntensity;
        varying vec3 vColor;
        varying float vAlpha;
        varying float vIsSparkle;

        void main() {
          float dist = length(gl_PointCoord - vec2(0.5));
          if (dist > 0.5) discard;

          // Crisp glowing pinpoint core + soft bioluminescent halo
          float core = exp(-dist * dist * 32.0);
          float halo = clamp(1.0 - dist * 2.0, 0.0, 1.0);
          
          float brightness = vIsSparkle > 0.5 ? 1.25 : 1.0;
          float alpha = (core * 0.92 + halo * 0.38) * vAlpha * brightness * uIntensity;

          gl_FragColor = vec4(vColor, alpha);
        }
      `,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    // ── 3. Outer Data Sphere Surface (Fibonacci Golden Spiral) ──
    const outerPositions = new Float32Array(OUTER_PARTICLES * 3);
    const outerSizes = new Float32Array(OUTER_PARTICLES);
    const outerSparkles = new Float32Array(OUTER_PARTICLES);
    const outerPinkAccents = new Float32Array(OUTER_PARTICLES);
    const outerPhases = new Float32Array(OUTER_PARTICLES);

    const goldenRatio = (1 + Math.sqrt(5)) / 2;
    const goldenAngle = 2 * Math.PI * (1 - 1 / goldenRatio);

    for (let i = 0; i < OUTER_PARTICLES; i++) {
      const y = 1 - (i / (OUTER_PARTICLES - 1)) * 2; // -1 to 1
      const radiusAtY = Math.sqrt(Math.max(0, 1 - y * y));
      const theta = goldenAngle * i;

      const r = SPHERE_RADIUS * (0.98 + Math.random() * 0.04);
      outerPositions[i * 3] = Math.cos(theta) * radiusAtY * r;
      outerPositions[i * 3 + 1] = y * r;
      outerPositions[i * 3 + 2] = Math.sin(theta) * radiusAtY * r;

      // ~10% brilliant white sparkle dots
      const isWhite = Math.random() > 0.90 ? 1.0 : 0.0;
      // ~22% designated aurora pink accent dots (more concentrated in top half)
      const isPink = !isWhite && (y > 0.1 || Math.random() < 0.15) && Math.random() > 0.45 ? 1.0 : 0.0;

      outerSparkles[i] = isWhite;
      outerPinkAccents[i] = isPink;
      outerSizes[i] = isWhite > 0.5 ? 1.7 + Math.random() * 0.5 : 1.1 + Math.random() * 0.5;
      outerPhases[i] = Math.random() * Math.PI * 2;
    }

    const outerGeom = new THREE.BufferGeometry();
    outerGeom.setAttribute("position", new THREE.BufferAttribute(outerPositions, 3));
    outerGeom.setAttribute("size", new THREE.BufferAttribute(outerSizes, 1));
    outerGeom.setAttribute("isSparkle", new THREE.BufferAttribute(outerSparkles, 1));
    outerGeom.setAttribute("isPinkAccent", new THREE.BufferAttribute(outerPinkAccents, 1));
    outerGeom.setAttribute("customPhase", new THREE.BufferAttribute(outerPhases, 1));

    const outerSphere = new THREE.Points(outerGeom, particleMaterial);
    masterGroup.add(outerSphere);

    // ── 4. Inner Volumetric Data Core (Secondary Depth Layer) ──
    const innerPositions = new Float32Array(INNER_CORE_PARTICLES * 3);
    const innerSizes = new Float32Array(INNER_CORE_PARTICLES);
    const innerSparkles = new Float32Array(INNER_CORE_PARTICLES);
    const innerPinkAccents = new Float32Array(INNER_CORE_PARTICLES);
    const innerPhases = new Float32Array(INNER_CORE_PARTICLES);

    for (let i = 0; i < INNER_CORE_PARTICLES; i++) {
      const r = SPHERE_RADIUS * (0.55 + Math.random() * 0.3);
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      innerPositions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      innerPositions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      innerPositions[i * 3 + 2] = r * Math.cos(phi);

      const isWhite = Math.random() > 0.92 ? 1.0 : 0.0;
      const isPink = !isWhite && Math.random() > 0.7 ? 1.0 : 0.0;

      innerSparkles[i] = isWhite;
      innerPinkAccents[i] = isPink;
      innerSizes[i] = isWhite > 0.5 ? 1.4 : 0.95 + Math.random() * 0.4;
      innerPhases[i] = Math.random() * Math.PI * 2;
    }

    const innerGeom = new THREE.BufferGeometry();
    innerGeom.setAttribute("position", new THREE.BufferAttribute(innerPositions, 3));
    innerGeom.setAttribute("size", new THREE.BufferAttribute(innerSizes, 1));
    innerGeom.setAttribute("isSparkle", new THREE.BufferAttribute(innerSparkles, 1));
    innerGeom.setAttribute("isPinkAccent", new THREE.BufferAttribute(innerPinkAccents, 1));
    innerGeom.setAttribute("customPhase", new THREE.BufferAttribute(innerPhases, 1));

    const innerSphere = new THREE.Points(innerGeom, particleMaterial);
    innerGroup.add(innerSphere);

    // ── 5. Equatorial Data Stream Ring (Subtle Data Flow) ──
    const streamPositions = new Float32Array(STREAM_PARTICLES * 3);
    const streamSizes = new Float32Array(STREAM_PARTICLES);
    const streamSparkles = new Float32Array(STREAM_PARTICLES);
    const streamPinkAccents = new Float32Array(STREAM_PARTICLES);
    const streamPhases = new Float32Array(STREAM_PARTICLES);

    for (let i = 0; i < STREAM_PARTICLES; i++) {
      const angle = (i / STREAM_PARTICLES) * Math.PI * 2;
      const r = SPHERE_RADIUS * (1.08 + Math.random() * 0.1);
      const yOffset = (Math.random() - 0.5) * 0.12;

      streamPositions[i * 3] = Math.cos(angle) * r;
      streamPositions[i * 3 + 1] = yOffset;
      streamPositions[i * 3 + 2] = Math.sin(angle) * r;

      const isWhite = Math.random() > 0.82 ? 1.0 : 0.0;
      const isPink = !isWhite && Math.random() > 0.5 ? 1.0 : 0.0;

      streamSparkles[i] = isWhite;
      streamPinkAccents[i] = isPink;
      streamSizes[i] = isWhite > 0.5 ? 1.6 : 1.1;
      streamPhases[i] = Math.random() * Math.PI * 2;
    }

    const streamGeom = new THREE.BufferGeometry();
    streamGeom.setAttribute("position", new THREE.BufferAttribute(streamPositions, 3));
    streamGeom.setAttribute("size", new THREE.BufferAttribute(streamSizes, 1));
    streamGeom.setAttribute("isSparkle", new THREE.BufferAttribute(streamSparkles, 1));
    streamGeom.setAttribute("isPinkAccent", new THREE.BufferAttribute(streamPinkAccents, 1));
    streamGeom.setAttribute("customPhase", new THREE.BufferAttribute(streamPhases, 1));

    const streamRing = new THREE.Points(streamGeom, particleMaterial);
    streamRing.rotation.x = 0.28; // 16° tilt
    streamRing.rotation.z = 0.08;
    masterGroup.add(streamRing);

    // ── 6. Luminous Inner Volumetric Glow Mesh ──
    const glowGeom = new THREE.SphereGeometry(SPHERE_RADIUS * 0.72, 32, 32);
    const glowMat = new THREE.ShaderMaterial({
      uniforms: { uTime: { value: 0 } },
      vertexShader: `
        varying vec3 vNormal;
        varying vec3 vPosition;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          vPosition = position;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float uTime;
        varying vec3 vNormal;
        varying vec3 vPosition;

        void main() {
          float rim = pow(0.7 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.6);
          vec3 ocean = vec3(0.00, 0.47, 0.71);    // #0077B6
          vec3 cyan = vec3(0.00, 0.71, 0.85);     // #00B4D8
          vec3 phosphor = vec3(0.56, 0.88, 0.94); // #90E0EF

          float wave = sin(uTime * 0.8 + vPosition.y * 1.8) * 0.5 + 0.5;
          vec3 col = mix(mix(ocean, cyan, 0.6), phosphor, wave * 0.55);

          gl_FragColor = vec4(col, rim * 0.08);
        }
      `,
      transparent: true,
      side: THREE.BackSide,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    const glowMesh = new THREE.Mesh(glowGeom, glowMat);
    masterGroup.add(glowMesh);

    // ── 7. Interactive Parallax & Mouse Tracking ──
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const onMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      mouseX = (e.clientX - centerX) / (window.innerWidth / 2);
      mouseY = (e.clientY - centerY) / (window.innerHeight / 2);
    };

    // Sentuhan di HP: geser jari memiringkan orb (tidak menghalangi scroll)
    const onTouchMove = (e: TouchEvent) => {
      const t = e.touches[0];
      if (!t) return;
      const rect = container.getBoundingClientRect();
      mouseX = Math.max(-1, Math.min(1, (t.clientX - (rect.left + rect.width / 2)) / (rect.width / 2)));
      mouseY = Math.max(-1, Math.min(1, (t.clientY - (rect.top + rect.height / 2)) / (window.innerHeight / 2)));
    };
    const onTouchEnd = () => {
      mouseX = 0;
      mouseY = 0;
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    container.addEventListener("touchmove", onTouchMove, { passive: true });
    container.addEventListener("touchend", onTouchEnd, { passive: true });

    // ── 8. Continuous Animation Loop ──
    const clock = new THREE.Clock();

    let running = false;
    let inView = true;
    let elapsedOffset = 0;

    const animate = () => {
      frameRef.current = requestAnimationFrame(animate);
      const elapsed = elapsedOffset + clock.getElapsedTime();

      // Uniform updates
      particleMaterial.uniforms.uTime.value = elapsed;
      glowMat.uniforms.uTime.value = elapsed;

      // Main sphere rotation
      outerSphere.rotation.y = elapsed * 0.11;
      glowMesh.rotation.y = elapsed * 0.11;

      // Inner core counter-rotation for multi-plane depth
      innerSphere.rotation.y = -elapsed * 0.07;
      innerSphere.rotation.x = Math.sin(elapsed * 0.08) * 0.05;

      // Stream ring faster flow
      streamRing.rotation.y = elapsed * 0.22;

      // Smooth interactive mouse parallax
      targetX += (mouseY * 0.35 - targetX) * 0.035;
      targetY += (mouseX * 0.35 - targetY) * 0.035;

      masterGroup.rotation.x = targetX + Math.sin(elapsed * 0.3) * 0.03;
      masterGroup.rotation.y = targetY;

      renderer.render(scene, camera);
    };

    // Hanya render saat terlihat & tab aktif — hemat GPU/baterai
    const start = () => {
      if (running || reduceMotion || !inView || document.hidden) return;
      running = true;
      clock.start();
      animate();
    };
    const stop = () => {
      if (!running) return;
      running = false;
      elapsedOffset += clock.getElapsedTime();
      clock.stop();
      cancelAnimationFrame(frameRef.current);
    };

    if (reduceMotion) {
      masterGroup.rotation.set(0.15, 0.4, 0);
      renderer.render(scene, camera);
    } else {
      start();
    }

    const io = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      if (inView) start();
      else stop();
    });
    io.observe(container);
    const onVisibility = () => (document.hidden ? stop() : start());
    document.addEventListener("visibilitychange", onVisibility);

    // Fade-in halus setelah frame pertama
    requestAnimationFrame(() => {
      renderer.domElement.style.opacity = "1";
    });
    renderer.domElement.style.opacity = "0";
    renderer.domElement.style.transition = "opacity 1.2s ease";

    // ── 9. Resize Handling ──
    const onResize = () => {
      if (!container) return;
      const nw = container.clientWidth;
      const nh = container.clientHeight;
      if (nw === 0 || nh === 0) return;
      camera.aspect = nw / nh;
      camera.updateProjectionMatrix();
      renderer.setSize(nw, nh);
      particleMaterial.uniforms.uPixelRatio.value = Math.min(window.devicePixelRatio, 2);
      particleMaterial.uniforms.uScale.value = pointScale(nh);
      particleMaterial.uniforms.uIntensity.value = nh < 400 ? 0.78 : 1.0;
      if (reduceMotion || !running) renderer.render(scene, camera);
    };

    const ro = new ResizeObserver(onResize);
    ro.observe(container);

    // ── 10. Cleanup ──
    return () => {
      stop();
      cancelAnimationFrame(frameRef.current);
      io.disconnect();
      ro.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("mousemove", onMouseMove);
      container.removeEventListener("touchmove", onTouchMove);
      container.removeEventListener("touchend", onTouchEnd);

      outerGeom.dispose();
      innerGeom.dispose();
      streamGeom.dispose();
      glowGeom.dispose();

      particleMaterial.dispose();
      glowMat.dispose();
      renderer.dispose();

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="w-full h-full relative flex items-center justify-center"
      aria-hidden="true"
    />
  );
}
