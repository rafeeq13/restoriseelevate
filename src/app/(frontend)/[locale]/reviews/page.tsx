import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { Container } from "@/components/marketing/Container";
import { PageHeader } from "@/components/marketing/PageHeader";
import { Reveal } from "@/components/marketing/Reveal";
import { FinalCTA } from "@/components/marketing/FinalCTA";
import { listReviews } from "@/lib/content";

export const metadata: Metadata = {
  title: "Reviews",
  description:
    "What hospitality operators say about working with Restorise Business Solutions.",
};

type Review = {
  id: string | number;
  personName: string;
  personRole?: string;
  businessName: string;
  country?: string;
  rating?: number;
  quote: string;
};

const TRUST_STATS = [
  { value: "4.9", label: "Average client rating", sub: "Across active retainers" },
  { value: "97%", label: "Retention after year one", sub: "First-engagement → year two" },
  { value: "200+", label: "Operators worked with", sub: "Across five regions" },
  { value: "24 h", label: "Response window", sub: "Every working day" },
];

export default async function ReviewsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const reviews = (await listReviews(locale)) as unknown as Review[];

  // Use highest-rated review (or first) as featured spotlight
  const featured =
    [...reviews].sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0))[0] ??
    reviews[0];
  const rest = featured ? reviews.filter((r) => r.id !== featured.id) : reviews;

  return (
    <>
      <PageHeader
        chapter="05"
        eyebrow="Reviews"
        title="In their"
        accentWord="words."
        description="Testimonials from operators we work with across the UK, US, Canada, EU, and Australia."
      />

      {/* ============================================================
          TRUST STATS — 4 glass KPI cards
          ============================================================ */}
      <section
        className="relative overflow-hidden"
        style={{ background: "var(--lux-onyx)" }}
      >
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{ background: "var(--lux-grad-aurora-soft)", opacity: 0.6 }}
        />
        <Container className="relative z-10 py-[var(--section-y)]">
          <Reveal variant="fade-up" className="mb-12 max-w-3xl">
            <span className="lux-overline">Operator trust</span>
            <h2 className="lux-section-title mt-6">
              Reviewed, retained, <em>recommended.</em>
            </h2>
          </Reveal>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {TRUST_STATS.map((s, i) => (
              <Reveal as="div" key={s.label} variant="fade-up" index={i}>
                <div className="lux-stat h-full">
                  <p className="lux-stat__num">{s.value}</p>
                  <p className="lux-stat__label">{s.label}</p>
                  <p className="lux-stat__sub">{s.sub}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* ============================================================
          FEATURED PULL-QUOTE — cinematic standout testimonial
          ============================================================ */}
      {featured && (
        <section className="border-t border-[color:var(--brand-border)] bg-[color:var(--brand-surface-paper)]">
          <Container className="py-[var(--section-y)]">
            <Reveal variant="fade-up">
              <div
                className="rounded-[var(--radius-2xl)] p-10 sm:p-14 lg:p-20"
                style={{
                  background:
                    "radial-gradient(ellipse 60% 60% at 0% 0%, rgba(255, 87, 87, 0.25), transparent 60%), radial-gradient(ellipse 60% 60% at 100% 100%, rgba(122, 0, 0, 0.45), transparent 60%), linear-gradient(160deg, var(--lux-obsidian) 0%, var(--lux-onyx) 60%, #1a0000 100%)",
                  border: "1px solid rgba(255, 87, 87, 0.28)",
                  boxShadow: "0 28px 80px -16px rgba(0, 0, 0, 0.6)",
                }}
              >
                {typeof featured.rating === "number" && featured.rating > 0 && (
                  <div className="flex gap-1" aria-label={`${featured.rating} out of 5`}>
                    {Array.from({ length: 5 }).map((_, k) => (
                      <svg
                        key={k}
                        viewBox="0 0 24 24"
                        fill={k < (featured.rating ?? 0) ? "currentColor" : "none"}
                        stroke="currentColor"
                        strokeWidth="1.5"
                        className="h-5 w-5"
                        style={{ color: "var(--lux-champagne)" }}
                        aria-hidden="true"
                      >
                        <path d="m12 2 3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.56 5.82 22 7 14.14 2 9.27l6.91-1.01L12 2z" />
                      </svg>
                    ))}
                  </div>
                )}

                <p
                  className="mt-8 font-display max-w-5xl"
                  style={{
                    fontSize: "clamp(1.55rem, 2.6vw, 2.25rem)",
                    fontWeight: 800,
                    fontStyle: "italic",
                    lineHeight: 1.28,
                    letterSpacing: "-0.014em",
                    color: "var(--lux-pearl)",
                  }}
                >
                  &ldquo;{featured.quote}&rdquo;
                </p>

                <div
                  className="mt-10 flex flex-wrap items-center gap-6 border-t pt-7"
                  style={{ borderColor: "var(--lux-line)" }}
                >
                  <div>
                    <p
                      className="font-display italic text-xl"
                      style={{ color: "var(--lux-pearl)" }}
                    >
                      {featured.personName}
                      {featured.personRole && (
                        <span
                          className="not-italic font-normal text-base ml-2"
                          style={{ color: "var(--lux-pearl-soft)" }}
                        >
                          · {featured.personRole}
                        </span>
                      )}
                    </p>
                    <p
                      className="mt-1 text-[11px] uppercase tracking-[0.22em]"
                      style={{ color: "var(--lux-pearl-faint)" }}
                    >
                      {featured.businessName}
                      {featured.country ? ` · ${featured.country}` : ""}
                    </p>
                  </div>
                </div>
              </div>
            </Reveal>
          </Container>
        </section>
      )}

      {/* ============================================================
          REVIEWS GRID — preserved 2-col editorial layout
          ============================================================ */}
      <section className="bg-[color:var(--brand-surface-paper)]">
        <Container className="py-[var(--section-y)]">
          {reviews.length === 0 ? (
            <Reveal variant="fade-up" className="mx-auto max-w-xl border-l-2 border-[color:var(--brand-primary)] pl-6">
              <p className="h-section">
                Reviews <em className="em">coming soon.</em>
              </p>
              <p className="lede mt-5">
                Operator testimonials will be published here once the agency
                adds them in the admin.
              </p>
            </Reveal>
          ) : (
            <ul className="grid gap-y-14 sm:grid-cols-2 sm:gap-x-12">
              {rest.map((r, i) => (
                <Reveal as="li" key={r.id} variant="fade-up" index={i}>
                  <article className="border-t border-[color:var(--brand-primary)] pt-6">
                    <p className="chapter">{String(i + 2).padStart(2, "0")}</p>
                    {typeof r.rating === "number" && r.rating > 0 && (
                      <div className="mt-3 flex gap-0.5 text-[color:var(--brand-warm)]" aria-label={`${r.rating} out of 5`}>
                        {Array.from({ length: 5 }).map((_, k) => (
                          <svg
                            key={k}
                            viewBox="0 0 24 24"
                            fill={k < (r.rating ?? 0) ? "currentColor" : "none"}
                            stroke="currentColor"
                            strokeWidth="1.5"
                            className="h-4 w-4"
                            aria-hidden="true"
                          >
                            <path d="m12 2 3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.56 5.82 22 7 14.14 2 9.27l6.91-1.01L12 2z" />
                          </svg>
                        ))}
                      </div>
                    )}
                    <p className="pull-quote mt-6 border-l-0 p-0">
                      {r.quote}
                    </p>
                    <div className="mt-8 border-t border-[color:var(--brand-border)] pt-5">
                      <p className="font-serif italic text-lg text-ink">
                        {r.personName}
                        {r.personRole && (
                          <span className="not-italic text-base text-ink-muted">, {r.personRole}</span>
                        )}
                      </p>
                      <p className="mt-1 text-[11px] uppercase tracking-[0.16em] text-ink-faint">
                        {r.businessName}
                        {r.country ? ` · ${r.country}` : ""}
                      </p>
                    </div>
                  </article>
                </Reveal>
              ))}
            </ul>
          )}
        </Container>
      </section>

      <FinalCTA
        eyebrow="Hear it firsthand"
        title="Want to talk to a"
        accentWord="reference?"
        description="Happy to connect you with operators we've worked with. Tell us your segment and region and we'll set up a 15-minute intro."
        primaryLabel="Request a reference"
      />
    </>
  );
}
