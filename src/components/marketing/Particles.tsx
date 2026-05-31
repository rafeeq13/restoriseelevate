"use client";

import { useEffect, useRef, type CSSProperties } from "react";

type Props = {
  /** Number of particles to render. */
  count?: number;
  /** Color of the particles (CSS color). */
  color?: string;
  /** Max particle size in px. */
  maxSize?: number;
  className?: string;
  style?: CSSProperties;
};

/**
 * Atmospheric warm-light particles for the cinematic dark hero. Drifts
 * upward slowly with random horizontal sway. Canvas-rendered for
 * performance. Respects prefers-reduced-motion (renders static dots).
 */
export function Particles({
  count = 36,
  color = "rgba(255, 138, 61, 0.55)",
  maxSize = 2.4,
  className,
  style,
}: Props) {
  const ref = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas || typeof window === "undefined") return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    let w = canvas.clientWidth;
    let h = canvas.clientHeight;

    const resize = () => {
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    type P = { x: number; y: number; r: number; vy: number; vx: number; a: number; phase: number };
    const rand = (a: number, b: number) => a + Math.random() * (b - a);
    const particles: P[] = Array.from({ length: count }).map(() => ({
      x: rand(0, w),
      y: rand(0, h),
      r: rand(0.6, maxSize),
      vy: rand(0.08, 0.24),
      vx: rand(-0.04, 0.04),
      a: rand(0.25, 0.75),
      phase: rand(0, Math.PI * 2),
    }));

    let raf = 0;
    let last = performance.now();

    const tick = (now: number) => {
      const dt = (now - last) / 16;
      last = now;
      ctx.clearRect(0, 0, w, h);
      for (const p of particles) {
        if (!reduced) {
          p.y -= p.vy * dt;
          p.phase += 0.015 * dt;
          p.x += p.vx * dt + Math.sin(p.phase) * 0.18;
          if (p.y < -4) {
            p.y = h + 4;
            p.x = rand(0, w);
          }
          if (p.x < -4) p.x = w + 4;
          if (p.x > w + 4) p.x = -4;
        }
        const flicker = 0.85 + Math.sin(p.phase * 1.6) * 0.15;
        ctx.beginPath();
        ctx.fillStyle = color.replace(/[\d.]+\)$/g, `${(p.a * flicker).toFixed(3)})`);
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
        // Outer glow
        ctx.beginPath();
        ctx.fillStyle = color.replace(/[\d.]+\)$/g, `${(p.a * 0.15).toFixed(3)})`);
        ctx.arc(p.x, p.y, p.r * 3, 0, Math.PI * 2);
        ctx.fill();
      }
      raf = window.requestAnimationFrame(tick);
    };
    raf = window.requestAnimationFrame(tick);

    const onResize = () => resize();
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [count, color, maxSize]);

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 h-full w-full ${className ?? ""}`}
      style={style}
    />
  );
}
