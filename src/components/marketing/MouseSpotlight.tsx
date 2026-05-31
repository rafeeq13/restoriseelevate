"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * Wraps children with a radial gradient spotlight that follows the mouse
 * cursor. Falls back to a static center spotlight on touch devices and when
 * reduced motion is enabled.
 */
export function MouseSpotlight({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof window === "undefined") return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    let raf = 0;
    let nx = 50;
    let ny = 50;
    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      nx = ((e.clientX - rect.left) / rect.width) * 100;
      ny = ((e.clientY - rect.top) / rect.height) * 100;
      if (raf) return;
      raf = window.requestAnimationFrame(() => {
        raf = 0;
        el.style.setProperty("--mx", `${nx}%`);
        el.style.setProperty("--my", `${ny}%`);
      });
    };
    el.addEventListener("mousemove", onMove);
    return () => {
      el.removeEventListener("mousemove", onMove);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div ref={ref} className={`spotlight ${className ?? ""}`}>
      {children}
    </div>
  );
}
