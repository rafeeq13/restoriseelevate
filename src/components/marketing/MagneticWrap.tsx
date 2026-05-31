"use client";

import { useEffect, useRef, type ReactNode } from "react";

type Props = {
  children: ReactNode;
  /** How strongly the target tracks the cursor (0–1). */
  strength?: number;
  /** Distance in px from the element edge where the magnet activates. */
  radius?: number;
  className?: string;
};

/**
 * Wraps a button/link so it gently moves toward the cursor when nearby.
 * Pairs with .magnetic-target CSS for the transition. Pointer-fine only.
 */
export function MagneticWrap({
  children,
  strength = 0.35,
  radius = 80,
  className,
}: Props) {
  const ref = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    const wrap = ref.current;
    if (!wrap || typeof window === "undefined") return;
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduced) return;

    const target = wrap.querySelector<HTMLElement>(".magnetic-target") ?? wrap;
    let raf = 0;

    const onMove = (e: PointerEvent) => {
      const rect = wrap.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const dist = Math.hypot(dx, dy);
      const activeRange = Math.max(rect.width, rect.height) / 2 + radius;
      if (dist > activeRange) {
        if (raf) return;
        raf = requestAnimationFrame(() => {
          raf = 0;
          target.style.transform = "translate3d(0,0,0)";
        });
        return;
      }
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        target.style.transform = `translate3d(${dx * strength}px, ${dy * strength}px, 0)`;
      });
    };

    const onLeave = () => {
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
      target.style.transform = "translate3d(0,0,0)";
    };

    window.addEventListener("pointermove", onMove);
    wrap.addEventListener("pointerleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      wrap.removeEventListener("pointerleave", onLeave);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [strength, radius]);

  return (
    <span ref={ref} className={`inline-flex ${className ?? ""}`}>
      {children}
    </span>
  );
}
