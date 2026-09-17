"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

/**
 * DATASPHERE 2026 — Brand-Defining 3D Bioluminescent Data Orb
 * Rendered in teal-cyan and white dots, picking up canvas deep teal
 * and aurora accent pink with harmonic wave breathing and mouse parallax.
 */

const OUTER_PARTICLES = 3000;
const INNER_CORE_PARTICLES = 850;
const STREAM_PARTICLES = 420;
const SPHERE_RADIUS = 2.05;

export default function ParticleSphere() {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const frameRef = useRef<number>(0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

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

        void main() {
          vIsSparkle = isSparkle;

          // Harmonic data wave breathing across surface
          vec3 pos = position;
          float wave = sin(pos.x * 2.6 + uTime * 1.2 + customPhase) *
                       cos(pos.y * 2.6 + uTime * 0.9) *
                       sin(pos.z * 2.6 + uTime * 0.8) * 0.05;
          pos += normalize(position) * wave;

          vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);

          // ── Color Definition ──
          // Bioluminescent teal & electric cyan
          vec3 canvasTeal   = vec3(0.00, 0.35, 0.32); // #005952
          vec3 brightTeal   = vec3(0.00, 0.70, 0.65); // #00b3a6
          vec3 electricCyan = vec3(0.15, 0.95, 0.92); // #26f2eb
          
          // Pure vibrant aurora pink & lavender phosphor (Auros accents)
          vec3 vividPink    = vec3(1.00, 0.35, 0.85); // #ff59d9
          vec3 pastelPink   = vec3(0.98, 0.76, 0.98); // #fad1ff
          
          // Diamond white sparkle
          vec3 whiteDot     = vec3(1.00, 1.00, 1.00);

          vec3 norm = normalize(pos);
          float lat = norm.y; // -1 to 1

          // Bioluminescent wave passing across the sphere
          float wavePulse = sin(uTime * 1.0 + norm.y * 2.5 + norm.x * 1.8) * 0.5 + 0.5;

          // Color logic:
          // Lower hemisphere / body: Canvas deep teal to electric cyan
          float tealFactor = smoothstep(-0.8, 0.4, lat);
          vec3 tealBase = mix(canvasTeal, mix(brightTeal, electricCyan, tealFactor), 0.85);

          // Upper crest / designated pink particles: Vivid Aurora Pink
          vec3 pinkCol = mix(vividPink, pastelPink, 0.4 + 0.3 * sin(uTime + norm.z));

          vec3 finalColor = tealBase;

          if (isSparkle > 0.5) {
            finalColor = whiteDot;
          } else if (isPinkAccent > 0.5 || (lat > 0.25 && wavePulse > 0.45)) {
            // Naturally blend in aurora pink at top and in active wave pulses
            float pBlend = isPinkAccent > 0.5 ? 0.9 : smoothstep(0.25, 0.8, lat) * 0.85;
            finalColor = mix(tealBase, pinkCol, pBlend);
          }

          vColor = finalColor;

          // Point sizing
          gl_PointSize = size * uPixelRatio * (42.0 / -mvPosition.z);
          gl_Position = projectionMatrix * mvPosition;

          // Depth fade: front is sharp and radiant, back is subtle
          float depthFade = smoothstep(-9.2, -6.0, mvPosition.z);
          vAlpha = 0.5 + 0.5 * depthFade;
        }
      `,
      fragmentShader: `
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
          float alpha = (core * 0.92 + halo * 0.38) * vAlpha * brightness;

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
          vec3 teal = vec3(0.0, 0.58, 0.54);
          vec3 cyan = vec3(0.0, 0.90, 0.86);
          vec3 pink = vec3(1.0, 0.40, 0.88);

          float wave = sin(uTime * 0.8 + vPosition.y * 1.8) * 0.5 + 0.5;
          vec3 col = mix(mix(teal, cyan, 0.6), pink, wave * 0.55);

          gl_FragColor = vec4(col, rim * 0.065);
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

    window.addEventListener("mousemove", onMouseMove, { passive: true });

    // ── 8. Continuous Animation Loop ──
    const clock = new THREE.Clock();

    const animate = () => {
      frameRef.current = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

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

    animate();

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
    };

    window.addEventListener("resize", onResize);

    // ── 10. Cleanup ──
    return () => {
      cancelAnimationFrame(frameRef.current);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("resize", onResize);

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
      className="w-full h-full relative cursor-grab active:cursor-grabbing flex items-center justify-center"
      aria-label="DATASPHERE 2026 3D Bioluminescent Data Orb"
    />
  );
}
