"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  /** Numeric target value, e.g. 200, 184. */
  to: number;
  /** Optional prefix rendered before the number (e.g. "+"). */
  prefix?: string;
  /** Optional suffix rendered after the number (e.g. "+", "%", "×"). */
  suffix?: string;
  /** Animation duration in ms. */
  duration?: number;
  /** Decimal places — counter rounds to this precision. */
  decimals?: number;
  className?: string;
};

export function Counter({
  to,
  prefix = "",
  suffix = "",
  duration = 1400,
  decimals = 0,
  className,
}: Props) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const [value, setValue] = useState(0);
  const startedRef = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof window === "undefined") return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setValue(to);
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && !startedRef.current) {
            startedRef.current = true;
            const start = performance.now();
            const tick = (now: number) => {
              const t = Math.min(1, (now - start) / duration);
              const eased = 1 - Math.pow(1 - t, 3);
              setValue(to * eased);
              if (t < 1) requestAnimationFrame(tick);
              else setValue(to);
            };
            requestAnimationFrame(tick);
            io.unobserve(el);
          }
        }
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [to, duration]);

  return (
    <span ref={ref} className={`counter ${className ?? ""}`}>
      {prefix}
      {value.toFixed(decimals)}
      {suffix}
    </span>
  );
}
