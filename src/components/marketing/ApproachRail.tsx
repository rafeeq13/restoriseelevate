"use client";

import { useEffect, useRef } from "react";

/**
 * Vertical gradient rail that fills as the user scrolls past its container.
 * Positioned absolutely inside an ol.relative parent.
 */
export function ApproachRail() {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof window === "undefined") return;
    const parent = el.parentElement;
    if (!parent) return;

    let raf = 0;
    const update = () => {
      raf = 0;
      const rect = parent.getBoundingClientRect();
      const vh = window.innerHeight;
      // Progress: 0 when top of parent reaches mid-screen,
      // 1 when bottom of parent reaches mid-screen.
      const total = rect.height + vh * 0.4;
      const traveled = vh * 0.7 - rect.top;
      const p = Math.max(0, Math.min(1, traveled / total));
      el.style.setProperty("--rail-progress", String(p));
    };
    const onScroll = () => {
      if (raf) return;
      raf = window.requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", update);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return <div ref={ref} className="approach-rail" aria-hidden="true" />;
}
