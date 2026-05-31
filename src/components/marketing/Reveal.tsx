"use client";

import { useEffect, useRef, type ElementType, type ReactNode, type CSSProperties } from "react";

type Variant = "fade-up" | "fade" | "scale" | "slide-left" | "slide-right";

type Props = {
  children: ReactNode;
  as?: ElementType;
  variant?: Variant;
  /** Index used for stagger delay calculation (multiplied by ~80ms). */
  index?: number;
  /** Explicit delay in ms — overrides index when provided. */
  delay?: number;
  /** Re-trigger every time the element enters viewport. Defaults to once. */
  once?: boolean;
  className?: string;
  style?: CSSProperties;
};

export function Reveal({
  children,
  as: Tag = "div",
  variant = "fade-up",
  index,
  delay,
  once = true,
  className,
  style,
}: Props) {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof window === "undefined" || !("IntersectionObserver" in window)) {
      el.setAttribute("data-reveal", "in");
      return;
    }

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      el.setAttribute("data-reveal", "in");
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            el.setAttribute("data-reveal", "in");
            if (once) io.unobserve(el);
          } else if (!once) {
            el.setAttribute("data-reveal", "out");
          }
        }
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.1 },
    );

    io.observe(el);
    return () => io.disconnect();
  }, [once]);

  const computedDelay =
    typeof delay === "number" ? delay : typeof index === "number" ? index * 80 : 0;

  const mergedStyle: CSSProperties = {
    ...style,
    ["--reveal-delay" as string]: `${computedDelay}ms`,
  };

  return (
    <Tag
      ref={ref as React.Ref<HTMLElement>}
      data-reveal="out"
      data-reveal-variant={variant}
      className={className}
      style={mergedStyle}
    >
      {children}
    </Tag>
  );
}
