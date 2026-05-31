"use client";

import { useEffect, useRef, type CSSProperties } from "react";

type Props = {
  /** Parallax intensity — fraction of scroll Y applied as translateY. */
  speed?: number;
  className?: string;
  style?: CSSProperties;
};

/**
 * Decorative blob that drifts with the scroll position. Use for hero
 * gradient orbs that need scroll-driven motion. JS sets --parallax-y on the
 * element; CSS reads it via .parallax. Respects prefers-reduced-motion.
 */
export function ParallaxBlob({ speed = 0.25, className, style }: Props) {
  const ref = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof window === "undefined") return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    let raf = 0;
    const baseRect = el.getBoundingClientRect();
    const initialTop = baseRect.top + window.scrollY;

    const update = () => {
      raf = 0;
      const fromTop = window.scrollY - initialTop;
      el.style.setProperty("--parallax-y", `${fromTop * speed}px`);
    };
    const onScroll = () => {
      if (raf) return;
      raf = window.requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [speed]);

  return (
    <span
      ref={ref}
      aria-hidden="true"
      className={`blob parallax ${className ?? ""}`}
      style={style}
    />
  );
}
