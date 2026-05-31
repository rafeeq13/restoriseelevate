import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { Container } from "@/components/marketing/Container";
import { PageHeader } from "@/components/marketing/PageHeader";
import { Button } from "@/components/marketing/Button";
import { Reveal } from "@/components/marketing/Reveal";
import { FinalCTA } from "@/components/marketing/FinalCTA";

export const metadata: Metadata = {
  title: "About",
  description:
    "Restorise Business Solutions is a hospitality-focused digital agency operating from Pakistan and serving clients in the UK, US, Canada, EU, and Australia.",
};

const PRINCIPLES = [
  {
    n: "01",
    title: "Hospitality only",
    body: "One sector, deeply. Every recommendation is grounded in the operational realities of running a venue.",
  },
  {
    n: "02",
    title: "Senior-led delivery",
    body: "The strategist on your first call is the strategist on every call. No junior hand-offs, no outsourced delivery.",
  },
  {
    n: "03",
    title: "Operator economics",
    body: "Pricing tuned to independent margins. We win when you win — proven by retention, not by a pitch deck.",
  },
];

const FOUNDER_STATS = [
  { value: "10+", label: "Years in hospitality marketing" },
  { value: "5", label: "Regions actively served" },
  { value: "200+", label: "Operators worked with" },
  { value: "24 h", label: "Founder response window" },
];

const REGIONS = [
  { code: "UK", name: "United Kingdom", venues: "Restaurants · Pubs · Hotels" },
  { code: "US", name: "United States", venues: "QSR · Cloud kitchens · Cafés" },
  { code: "CA", name: "Canada", venues: "Café chains · Bistros" },
  { code: "EU", name: "European Union", venues: "Boutique · Fine dining" },
  { code: "AU", name: "Australia", venues: "Cafés · Multi-venue groups" },
];

const DISCIPLINES = [
  { name: "Paid media", desc: "Meta · Google · Performance Max" },
  { name: "Organic search", desc: "Technical · Local · Content" },
  { name: "Social & content", desc: "Strategy · Production · Community" },
  { name: "Creative", desc: "Identity · Menu · Photography" },
  { name: "Software", desc: "Web · Mobile · Ordering" },
  { name: "Operations", desc: "POS · Aggregators · Menu R&D" },
];

const MILESTONES = [
  {
    year: "2020",
    title: "Founded in Karachi",
    body: "First three hospitality clients across UK and Pakistan. The Restorise playbook is born.",
  },
  {
    year: "2022",
    title: "Multi-region expansion",
    body: "Specialist teams established for paid media, SEO, and creative. First US and Canadian engagements.",
  },
  {
    year: "2024",
    title: "Operations practice",
    body: "POS, delivery platforms, and menu engineering added — closing the loop from marketing to margin.",
  },
  {
    year: "2026",
    title: "Hospitality marketplace",
    body: "Phase 2 launches: print-on-demand and design marketplace for venues worldwide.",
  },
];

const BRAND_PARTS = [
  {
    title: "Growth & rise",
    meaning:
      "The upward red arrow represents the trajectory our clients hire us for — covers booked, orders placed, rankings held.",
  },
  {
    title: "Initial letters",
    meaning:
      "The stylised RBS monogram anchors the mark — Restorise Business Solutions, FZ-LLC.",
  },
  {
    title: "Solution engine",
    meaning:
      "The gears signal the operational machine behind every engagement — POS, delivery, marketing, design.",
  },
];

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <PageHeader
        chapter="01"
        eyebrow="About"
        title="A digital agency built around"
        accentWord="hospitality."
        description="Restorise Business Solutions exists to give food and hospitality operators the marketing, creative, and operational firepower of a senior in-house team — without the overhead."
      />

      {/* ============================================================
          FOUNDER PORTRAIT CARD — premium intro section
          ============================================================ */}
      <section
        className="relative overflow-hidden"
        style={{ background: "var(--lux-onyx)" }}
      >
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{ background: "var(--lux-grad-aurora-soft)", opacity: 0.55 }}
        />
        <Container className="relative z-10 py-[var(--section-y)]">
          <div className="grid gap-12 lg:grid-cols-[1.05fr_1.3fr] lg:items-center">
            <Reveal variant="fade-up">
              <div className="relative">
                <span
                  aria-hidden="true"
                  className="absolute -inset-6 rounded-full"
                  style={{
                    background:
                      "radial-gradient(ellipse at center, rgba(255, 87, 87, 0.30), transparent 65%)",
                    filter: "blur(50px)",
                  }}
                />
                <div className="photo-frame relative aspect-[4/5]">
                  <p className="photo-frame__caption">Founder · 2026</p>
                </div>
                <span
                  aria-hidden="true"
                  className="absolute -top-5 -right-5 hidden h-20 w-20 rotate-[12deg] items-center justify-center rounded-full text-center text-[10px] font-bold uppercase leading-tight tracking-[0.16em] sm:flex"
                  style={{
                    background: "var(--lux-grad-champagne-rose)",
                    color: "var(--ink-900)",
                    boxShadow: "var(--lux-glow-champagne)",
                  }}
                >
                  Senior<br />led
                </span>
              </div>
            </Reveal>

            <Reveal variant="fade-up" delay={150}>
              <span className="lux-overline">Founder</span>
              <p className="lux-display mt-6" style={{ fontSize: "clamp(2.1rem, 3.8vw, 3.25rem)" }}>
                Muhammad <em>Usama</em>
              </p>
              <p className="mt-3 text-sm font-bold uppercase tracking-[0.2em] text-[color:var(--lux-pearl-faint)]">
                Founder · Restorise Business Solutions
              </p>

              <p className="pull-quote mt-9">
                Hospitality is the only sector I&rsquo;ve ever built for. After
                a decade of running campaigns for restaurants and hotels, I
                started Restorise to give independent operators the senior
                in-house team they could never quite afford.
              </p>

              <ul className="mt-10 grid grid-cols-2 gap-3">
                {FOUNDER_STATS.map((s) => (
                  <li key={s.label} className="lux-kpi">
                    <p className="lux-kpi__num">{s.value}</p>
                    <p className="lux-kpi__label">{s.label}</p>
                  </li>
                ))}
              </ul>

              <div className="mt-10 flex flex-wrap gap-3">
                <Button as="link" href="/contact" size="md">
                  Talk to the founder
                  <span className="arrow-shift" aria-hidden="true">→</span>
                </Button>
                <Button as="link" href="/portfolio" variant="ghost" size="md">
                  See recent work
                </Button>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* ============================================================
          THE STORY — existing narrative, now reads on dark
          ============================================================ */}
      <section className="border-t border-[color:var(--brand-border)] bg-[color:var(--brand-surface-paper)]">
        <Container className="py-[var(--section-y)]">
          <div className="grid gap-12 lg:grid-cols-[1fr_1.5fr]">
            <Reveal variant="fade-up">
              <span className="chapter">02</span>
              <p className="eyebrow mt-3">The story</p>
            </Reveal>
            <Reveal variant="fade-up" delay={150} className="drop-cap">
              <p className="pull-quote">
                We work exclusively with the food and hospitality sector.
                One sector, deeply — at a price point that respects
                independent operator economics.
              </p>
              <p className="lede mt-10">
                Our headquarters are in Pakistan and our clients are in the
                United Kingdom, United States, Canada, the European Union,
                and Australia. That model lets us assemble specialist teams
                across paid media, SEO, social, creative production,
                software, and hospitality operations.
              </p>
              <p className="lede mt-5">
                We&rsquo;re a partner, not a vendor. We measure ourselves
                against what actually matters to operators — covers booked,
                orders placed, menu margins protected, delivery rankings
                held.
              </p>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* ============================================================
          REGIONS PRESENCE — 5 glass region cards
          ============================================================ */}
      <section className="border-t border-[color:var(--brand-border)] bg-[color:var(--brand-surface)]">
        <Container className="py-[var(--section-y)]">
          <Reveal variant="fade-up" className="mb-12 max-w-3xl">
            <span className="chapter">03</span>
            <p className="eyebrow mt-3">Presence</p>
            <h2 className="h-section mt-6">
              Operators we serve in <em className="em">five regions.</em>
            </h2>
            <p className="lede mt-6">
              From a single café in Manchester to a fifteen-venue group in
              Toronto — same senior team, same playbook, local-market
              calibration.
            </p>
          </Reveal>

          <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
            {REGIONS.map((r, i) => (
              <Reveal as="li" key={r.code} variant="fade-up" index={i}>
                <div className="glow-card group flex h-full flex-col gap-4">
                  <p
                    className="font-display text-5xl leading-none"
                    style={{
                      fontWeight: 800,
                      background: "var(--lux-grad-champagne-rose)",
                      WebkitBackgroundClip: "text",
                      backgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                    }}
                  >
                    {r.code}
                  </p>
                  <div>
                    <p className="h-sub">{r.name}</p>
                    <p className="mt-2 text-sm leading-relaxed text-ink-muted">
                      {r.venues}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </ul>
        </Container>
      </section>

      {/* ============================================================
          MILESTONES — timeline rail with gold connector
          ============================================================ */}
      <section className="border-t border-[color:var(--brand-border)] bg-[color:var(--brand-surface-paper)]">
        <Container className="py-[var(--section-y)]">
          <Reveal variant="fade-up" className="mb-12 max-w-3xl">
            <span className="chapter">04</span>
            <p className="eyebrow mt-3">Milestones</p>
            <h2 className="h-section mt-6">
              Six years of <em className="em">compounding focus.</em>
            </h2>
          </Reveal>

          <ol className="relative">
            <span
              aria-hidden="true"
              className="absolute left-[27px] top-3 bottom-3 w-px lg:left-[7%]"
              style={{
                background:
                  "linear-gradient(to bottom, transparent, rgba(255, 87, 87, 0.5), rgba(255, 138, 138, 0.4), transparent)",
              }}
            />
            {MILESTONES.map((m, i) => (
              <Reveal as="li" key={m.year} variant="fade-up" index={i}>
                <div className="relative grid gap-6 pb-12 pl-16 lg:grid-cols-[14%_1fr] lg:pl-0 lg:gap-12">
                  <span
                    aria-hidden="true"
                    className="absolute left-0 top-0 inline-flex h-14 w-14 items-center justify-center rounded-full lg:relative lg:left-auto"
                    style={{
                      background: "var(--lux-onyx)",
                      border: "1px solid rgba(255, 87, 87, 0.45)",
                      color: "var(--lux-champagne)",
                      fontFamily: "var(--font-display)",
                      fontStyle: "italic",
                      fontSize: "0.95rem",
                      boxShadow:
                        "inset 0 1px 0 rgba(246, 236, 214, 0.10), 0 0 0 4px var(--lux-onyx), 0 0 24px -4px rgba(255, 87, 87, 0.45)",
                    }}
                  >
                    {m.year}
                  </span>
                  <div>
                    <p className="h-sub">{m.title}</p>
                    <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ink-muted">
                      {m.body}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </ol>
        </Container>
      </section>

      {/* ============================================================
          PRINCIPLES — existing 3-card grid, auto-adapts on dark
          ============================================================ */}
      <section className="border-t border-[color:var(--brand-border)] bg-[color:var(--brand-surface)]">
        <Container className="py-[var(--section-y)]">
          <Reveal variant="fade-up" className="mb-12 max-w-3xl">
            <span className="chapter">05</span>
            <p className="eyebrow mt-3">Operating principles</p>
            <h2 className="h-section mt-6">
              Three things we never <em className="em">compromise.</em>
            </h2>
          </Reveal>

          <ul className="grid gap-0 border-y border-[color:var(--brand-border)] md:grid-cols-3">
            {PRINCIPLES.map((p, i) => (
              <Reveal as="li" key={p.n} variant="fade-up" index={i}>
                <article className="flex h-full flex-col gap-6 border-b border-[color:var(--brand-border)] p-8 md:border-b-0 md:[&:not(:last-child)]:border-r">
                  <span className="index-mark">{p.n}</span>
                  <div>
                    <p className="h-sub">{p.title}</p>
                    <p className="mt-3 text-sm leading-relaxed text-ink-muted">
                      {p.body}
                    </p>
                  </div>
                </article>
              </Reveal>
            ))}
          </ul>
        </Container>
      </section>

      {/* ============================================================
          SPECIALIST DISCIPLINES — strip showing 6 disciplines
          ============================================================ */}
      <section className="border-t border-[color:var(--brand-border)] bg-[color:var(--brand-surface-paper)]">
        <Container className="py-[var(--section-y)]">
          <Reveal variant="fade-up" className="mb-12 max-w-3xl">
            <span className="chapter">06</span>
            <p className="eyebrow mt-3">Specialist disciplines</p>
            <h2 className="h-section mt-6">
              Six interlocking practices, <em className="em">one senior team.</em>
            </h2>
          </Reveal>

          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {DISCIPLINES.map((d, i) => (
              <Reveal as="li" key={d.name} variant="fade-up" index={i}>
                <div
                  className="group flex items-center gap-5 rounded-[var(--radius-xl)] p-5 transition-all"
                  style={{
                    background: "var(--lux-glass)",
                    border: "1px solid var(--lux-glass-border)",
                    backdropFilter: "blur(14px)",
                  }}
                >
                  <span
                    aria-hidden="true"
                    className="inline-block h-2 w-2 rounded-full"
                    style={{
                      background: "var(--lux-grad-champagne-rose)",
                      boxShadow: "0 0 10px rgba(255, 87, 87, 0.7)",
                    }}
                  />
                  <div>
                    <p className="font-display text-lg" style={{ fontWeight: 700 }}>
                      {d.name}
                    </p>
                    <p className="mt-1 text-xs text-[color:var(--lux-pearl-faint)]">
                      {d.desc}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </ul>
        </Container>
      </section>

      {/* ============================================================
          BRAND IDENTITY — existing, preserved
          ============================================================ */}
      <section className="border-t border-[color:var(--brand-border)] bg-[color:var(--brand-surface)]">
        <Container className="py-[var(--section-y)]">
          <Reveal variant="fade-up" className="mb-12 max-w-3xl">
            <span className="chapter">07</span>
            <p className="eyebrow mt-3">Brand identity</p>
            <h2 className="h-section mt-6">
              The RBS mark tells our story in <em className="em">three parts.</em>
            </h2>
            <p className="lede mt-6">
              Set in Proxima Nova Extrabold across the wordmark, the logo
              fuses three elements that together describe how we work with
              operators.
            </p>
          </Reveal>

          <ul className="grid gap-6 sm:grid-cols-3">
            {BRAND_PARTS.map((item, i) => (
              <Reveal as="li" key={item.title} variant="fade-up" index={i}>
                <article className="editorial-card flex h-full flex-col gap-5">
                  <div className="photo-frame aspect-square" />
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-ink-faint">
                      Element {String(i + 1).padStart(2, "0")}
                    </p>
                    <p className="h-sub mt-2">{item.title}</p>
                    <p className="mt-3 text-sm leading-relaxed text-ink-muted">{item.meaning}</p>
                  </div>
                </article>
              </Reveal>
            ))}
          </ul>

          <dl className="mt-14 grid gap-6 sm:grid-cols-3">
            {[
              { key: "Primary colour", value: "#7A1A1A", subvalue: "Wine red" },
              { key: "Ink", value: "#1A1410", subvalue: "Warm black" },
              { key: "Typography", value: "Playfair Display", subvalue: "+ Proxima Nova" },
            ].map((c, i) => (
              <Reveal as="div" key={c.key} variant="fade-up" index={i}>
                <div className="border-t border-[color:var(--brand-primary)] pt-5">
                  <dt className="text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-faint">
                    {c.key}
                  </dt>
                  <dd className="mt-2 font-serif italic text-2xl text-ink">
                    {c.value}
                  </dd>
                  <dd className="mt-1 text-sm text-ink-muted">{c.subvalue}</dd>
                </div>
              </Reveal>
            ))}
          </dl>
        </Container>
      </section>

      <FinalCTA
        eyebrow="Let's talk hospitality"
        title="Built around the venue."
        accentWord="Not the other way round."
      />
    </>
  );
}
