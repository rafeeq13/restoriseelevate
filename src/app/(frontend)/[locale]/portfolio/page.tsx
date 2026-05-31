import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Container } from "@/components/marketing/Container";
import { PageHeader } from "@/components/marketing/PageHeader";
import { Reveal } from "@/components/marketing/Reveal";
import { FinalCTA } from "@/components/marketing/FinalCTA";
import { listPortfolio } from "@/lib/content";

export const metadata: Metadata = {
  title: "Portfolio",
  description:
    "Case studies with measurable outcomes for hospitality clients across the UK, US, Canada, EU, and Australia.",
};

type Item = {
  id: string | number;
  title: string;
  slug: string;
  client: string;
  industry?: string;
  country?: string;
  summary?: string;
  outcomes?: Array<{ metric: string; value: string; context?: string }>;
};

const IMPACT_STATS = [
  { value: "+184%", label: "Avg online order growth", sub: "Six-month engagement window" },
  { value: "5.8×", label: "Avg paid ROAS", sub: "Across active retainers" },
  { value: "−42%", label: "Avg cost per acquisition", sub: "Year-over-year improvement" },
  { value: "97%", label: "Client retention rate", sub: "After first 12 months" },
];

const SECTORS = [
  "All work",
  "Independent restaurants",
  "Multi-venue groups",
  "Hotels & resorts",
  "Cafés & QSR",
  "Cloud kitchens",
] as const;

export default async function PortfolioPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const items = (await listPortfolio(locale)) as unknown as Item[];
  const featured = items[0];
  const rest = items.slice(1);

  return (
    <>
      <PageHeader
        chapter="04"
        eyebrow="Portfolio"
        title="Outcomes, not just"
        accentWord="outputs."
        description="A selection of recent engagements with hospitality brands. Each case study leads with measurable impact."
      />

      {/* ============================================================
          AGGREGATE IMPACT STRIP — 4 glass KPI cards
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
            <span className="lux-overline">Aggregate impact</span>
            <h2 className="lux-section-title mt-6">
              Across every engagement, <em>compounding outcomes.</em>
            </h2>
            <p className="lux-lede mt-6">
              Numbers shown are blended averages across active and completed
              retainers in the last twelve months.
            </p>
          </Reveal>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {IMPACT_STATS.map((s, i) => (
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
          SECTOR FILTER CHIPS — visual category pills (display only)
          ============================================================ */}
      <section className="border-t border-[color:var(--brand-border)] bg-[color:var(--brand-surface-paper)]">
        <Container className="pt-[clamp(3rem,6vw,5rem)] pb-6">
          <Reveal variant="fade-up">
            <p className="lux-overline mb-6">Browse by sector</p>
            <ul className="flex flex-wrap gap-3">
              {SECTORS.map((s, i) => (
                <li key={s}>
                  <span
                    className={`inline-flex items-center rounded-full px-4 py-2 text-sm font-bold transition-all ${
                      i === 0 ? "text-[color:var(--ink-900)]" : "text-[color:var(--lux-pearl-soft)]"
                    }`}
                    style={
                      i === 0
                        ? {
                            background: "var(--lux-grad-champagne-rose)",
                            border: "1px solid transparent",
                            boxShadow: "var(--lux-glow-champagne)",
                          }
                        : {
                            background: "var(--lux-glass)",
                            border: "1px solid var(--lux-glass-border)",
                            backdropFilter: "blur(10px)",
                          }
                    }
                  >
                    {s}
                  </span>
                </li>
              ))}
            </ul>
          </Reveal>
        </Container>
      </section>

      {/* ============================================================
          FEATURED SPOTLIGHT + CASE GRID
          ============================================================ */}
      <section className="bg-[color:var(--brand-surface-paper)]">
        <Container className="py-[var(--section-y)]">
          {items.length === 0 ? (
            <Reveal variant="fade-up" className="mx-auto max-w-xl border-l-2 border-[color:var(--brand-primary)] pl-6">
              <p className="h-section">
                Case studies <em className="em">coming soon.</em>
              </p>
              <p className="lede mt-5">
                Engagement write-ups will be published here once the agency
                adds them in the admin.
              </p>
            </Reveal>
          ) : (
            <>
              {/* Featured case spotlight — first item gets cinematic treatment */}
              {featured && (
                <Reveal variant="fade-up" className="mb-20">
                  <Link href={`/portfolio/${featured.slug}`} className="group block">
                    <div
                      className="relative overflow-hidden rounded-[var(--radius-2xl)]"
                      style={{
                        background:
                          "radial-gradient(ellipse 50% 50% at 20% 30%, rgba(255, 87, 87, 0.35), transparent 60%), radial-gradient(ellipse 50% 50% at 80% 70%, rgba(255, 138, 138, 0.45), transparent 60%), linear-gradient(135deg, var(--lux-wine) 0%, var(--lux-onyx) 55%, var(--lux-bronze) 100%)",
                        border: "1px solid rgba(255, 87, 87, 0.30)",
                        boxShadow: "0 28px 80px -16px rgba(0, 0, 0, 0.6)",
                      }}
                    >
                      <div className="grid gap-0 lg:grid-cols-[1.2fr_1fr]">
                        <div className="aspect-[5/4] relative lg:aspect-auto">
                          <div
                            aria-hidden="true"
                            className="absolute inset-0"
                            style={{
                              backgroundImage:
                                "linear-gradient(rgba(246, 236, 214, 0.10) 1px, transparent 1px), linear-gradient(90deg, rgba(246, 236, 214, 0.10) 1px, transparent 1px)",
                              backgroundSize: "32px 32px",
                              maskImage:
                                "radial-gradient(ellipse at center, black 0, transparent 80%)",
                              WebkitMaskImage:
                                "radial-gradient(ellipse at center, black 0, transparent 80%)",
                            }}
                          />
                          <span
                            className="absolute left-6 top-6 inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em]"
                            style={{
                              background: "rgba(4, 2, 10, 0.7)",
                              border: "1px solid rgba(255, 87, 87, 0.40)",
                              color: "var(--lux-pearl)",
                              backdropFilter: "blur(10px)",
                            }}
                          >
                            <span
                              className="h-1.5 w-1.5 rounded-full"
                              style={{
                                background: "var(--lux-grad-champagne-rose)",
                              }}
                            />
                            Featured · {featured.country ?? "Global"}
                          </span>
                        </div>

                        <div className="p-8 sm:p-10 lg:p-14 flex flex-col justify-center">
                          <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[color:var(--lux-pearl-faint)]">
                            {featured.industry ?? "Case study"}
                          </p>
                          <p
                            className="mt-4 font-display"
                            style={{
                              fontSize: "clamp(1.85rem, 3.2vw, 2.75rem)",
                              fontWeight: 800,
                              lineHeight: 1.08,
                              letterSpacing: "-0.018em",
                              color: "var(--lux-pearl)",
                            }}
                          >
                            {featured.title}
                          </p>
                          {featured.summary && (
                            <p className="mt-5 text-base leading-relaxed text-[color:var(--lux-pearl-soft)]">
                              {featured.summary}
                            </p>
                          )}
                          {featured.outcomes && featured.outcomes.length > 0 && (
                            <div className="mt-6 grid grid-cols-3 gap-3">
                              {featured.outcomes.slice(0, 3).map((o, ii) => (
                                <div key={ii} className="lux-kpi">
                                  <p className="lux-kpi__num">{o.value}</p>
                                  <p className="lux-kpi__label">{o.metric}</p>
                                </div>
                              ))}
                            </div>
                          )}
                          <span className="mt-8 inline-flex items-center gap-2 text-sm font-bold text-[color:var(--lux-champagne)]">
                            Read the full case study
                            <span className="arrow-shift" aria-hidden="true">→</span>
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </Reveal>
              )}

              <ul className="grid gap-y-14 gap-x-8 sm:grid-cols-2">
                {rest.map((item, i) => (
                  <Reveal as="li" key={item.id} variant="fade-up" index={i}>
                    <Link href={`/portfolio/${item.slug}`} className="group block">
                      <div className="photo-frame aspect-[4/3]">
                        <p className="photo-frame__caption">
                          Case · {String(i + 2).padStart(2, "0")}
                        </p>
                      </div>
                      <div className="mt-6 flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-ink-faint">
                        <span>{item.industry ?? "Case study"}</span>
                        {item.country && (
                          <>
                            <span aria-hidden="true" className="inline-block h-px w-4 bg-[color:var(--brand-border-strong)]" />
                            <span>{item.country}</span>
                          </>
                        )}
                      </div>
                      <p className="h-section mt-3 group-hover:text-[color:var(--brand-primary)] transition-colors">
                        {item.title}
                      </p>
                      {item.summary && (
                        <p className="mt-3 text-base leading-relaxed text-ink-soft">{item.summary}</p>
                      )}
                      {item.outcomes?.length ? (
                        <ul className="mt-6 flex flex-wrap gap-x-8 gap-y-3">
                          {item.outcomes.slice(0, 3).map((o, ii) => (
                            <li key={ii} className="border-l-2 border-[color:var(--brand-primary)] pl-3">
                              <p className="font-serif italic text-2xl text-[color:var(--brand-primary)]">{o.value}</p>
                              <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-ink-faint">
                                {o.metric}
                              </p>
                            </li>
                          ))}
                        </ul>
                      ) : null}
                      <span className="link-edit mt-6 inline-flex">
                        View case study
                        <span className="arrow-shift" aria-hidden="true">→</span>
                      </span>
                    </Link>
                  </Reveal>
                ))}
              </ul>
            </>
          )}
        </Container>
      </section>

      <FinalCTA
        eyebrow="Could be your venue next"
        title="Ready to write your"
        accentWord="case study?"
      />
    </>
  );
}
