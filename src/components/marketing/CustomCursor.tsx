"use client";

import { useEffect, useRef } from "react";

/**
 * Custom cursor: a tiny white dot following the pointer with a larger ring
 * that lags slightly behind. Ring grows + tints red over interactive
 * elements. Pointer-fine only — disabled on touch/coarse devices and on
 * prefers-reduced-motion.
 */
export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement | null>(null);
  const ringRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduced) return;

    document.body.classList.add("has-custom-cursor");

    let mx = window.innerWidth / 2;
    let my = window.innerHeight / 2;
    let rx = mx;
    let ry = my;
    let raf = 0;

    const onMove = (e: PointerEvent) => {
      mx = e.clientX;
      my = e.clientY;
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${mx}px, ${my}px, 0)`;
      }
    };
    const loop = () => {
      rx += (mx - rx) * 0.18;
      ry += (my - ry) * 0.18;
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${rx}px, ${ry}px, 0)`;
      }
      raf = window.requestAnimationFrame(loop);
    };

    const onOver = (e: Event) => {
      const t = e.target as HTMLElement | null;
      if (!t) return;
      const interactive = t.closest("a, button, [role='button'], input, textarea, select, label, .magnetic-target");
      if (interactive) {
        dotRef.current?.setAttribute("data-hover", "true");
        ringRef.current?.setAttribute("data-hover", "true");
      } else {
        dotRef.current?.setAttribute("data-hover", "false");
        ringRef.current?.setAttribute("data-hover", "false");
      }
    };

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerover", onOver);
    raf = window.requestAnimationFrame(loop);

    return () => {
      document.body.classList.remove("has-custom-cursor");
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerover", onOver);
      if (raf) window.cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      <div ref={dotRef} className="cursor-dot" data-hover="false" aria-hidden="true" />
      <div ref={ringRef} className="cursor-ring" data-hover="false" aria-hidden="true" />
    </>
  );
}
