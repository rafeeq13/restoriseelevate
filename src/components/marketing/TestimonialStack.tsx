"use client";

import { useEffect, useState } from "react";

type Testimonial = {
  quote: string;
  name: string;
  role: string;
  business: string;
  region: string;
};

const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      "Within three months they had our online orders up 2.4× and our cost per acquisition down by nearly half. The team feels like an extension of ours.",
    name: "Sara Mehmood",
    role: "Operations Director",
    business: "Alba Restaurant Group",
    region: "United Kingdom",
  },
  {
    quote:
      "Restorise rebuilt our delivery stack from scratch and gave us a brand that finally matches the food. No hand-offs, no surprises — just senior people doing senior work.",
    name: "James Carter",
    role: "Founder",
    business: "Harvest Cafés",
    region: "Canada",
  },
  {
    quote:
      "We tried two agencies before. Both pitched well, neither delivered. Restorise's first month had us reconsidering what an agency relationship should feel like.",
    name: "Isabella Romano",
    role: "Group GM",
    business: "Roma Trattoria",
    region: "European Union",
  },
];

export function TestimonialStack() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % TESTIMONIALS.length);
    }, 6500);
    return () => window.clearInterval(id);
  }, []);

  return (
    <div className="relative">
      {/* Stack — only active card is fully visible */}
      <div className="relative min-h-[280px]">
        {TESTIMONIALS.map((t, i) => {
          const active = i === index;
          const offset = (i - index + TESTIMONIALS.length) % TESTIMONIALS.length;
          return (
            <article
              key={t.name}
              data-active={active}
              className="t-card absolute inset-0 shine"
              style={{
                transform: `translate3d(${offset * 12}px, ${offset * 12}px, 0) scale(${1 - offset * 0.03})`,
                zIndex: TESTIMONIALS.length - offset,
                opacity: active ? 1 : 0,
              }}
              aria-hidden={!active}
            >
              <div className="flex items-start justify-between gap-6">
                <span className="quote-mark" aria-hidden="true">
                  &ldquo;
                </span>
                <div className="flex gap-0.5 text-[color:var(--brand-warm)]">
                  {Array.from({ length: 5 }).map((_, k) => (
                    <svg
                      key={k}
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="h-3.5 w-3.5"
                      aria-hidden="true"
                    >
                      <path d="m12 2 3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.56 5.82 22 7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                  ))}
                </div>
              </div>
              <p className="font-display mt-2 text-2xl leading-snug text-ink">
                {t.quote}
              </p>
              <div className="mt-7 flex items-end justify-between gap-6 border-t border-[color:var(--brand-border)] pt-5">
                <div>
                  <p className="font-display text-base text-ink">{t.name}</p>
                  <p className="mt-0.5 text-xs text-ink-muted">
                    {t.role} · {t.business}
                  </p>
                </div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-ink-faint">
                  {t.region}
                </p>
              </div>
            </article>
          );
        })}
      </div>

      {/* Indicator dots */}
      <div className="mt-6 flex items-center justify-center gap-2">
        {TESTIMONIALS.map((_, i) => (
          <button
            key={i}
            type="button"
            aria-label={`Show testimonial ${i + 1}`}
            onClick={() => setIndex(i)}
            className={`h-1.5 rounded-full transition-all ${
              i === index
                ? "w-8 bg-[color:var(--brand-primary)]"
                : "w-1.5 bg-[color:var(--brand-border-strong)] hover:bg-ink-faint"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
