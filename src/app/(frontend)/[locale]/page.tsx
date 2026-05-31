import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Container } from "@/components/marketing/Container";
import { Reveal } from "@/components/marketing/Reveal";
import { Counter } from "@/components/marketing/Counter";
import { Aurora } from "@/components/marketing/Aurora";
import { MarqueeRail } from "@/components/marketing/MarqueeRail";

/* ------------------------------------------------------------------
   Restorise — Home (Aurora Midnight v2).

   Cinematic dark-luxury redesign. The page is wrapped in .lux-home
   which (a) sets an obsidian surface for the whole route and
   (b) triggers a CSS override that re-skins the sticky SiteHeader
   to glass-dark with a white-inverted logo. All design utilities
   live in src/app/(frontend)/[locale]/styles.css under the
   "AURORA MIDNIGHT" block.
   ------------------------------------------------------------------ */

const STATS = [
  { to: 200, suffix: "+", label: "Hospitality clients", sub: "Across five global regions" },
  { to: 184, prefix: "+", suffix: "%", label: "Avg order growth", sub: "Across six-month engagements" },
  { to: 24, suffix: " h", label: "Response window", sub: "Every working day, guaranteed" },
  { to: 12, suffix: "+", label: "Languages", sub: "Native-quality copy & creative" },
];

const CAPABILITIES = [
  {
    n: "01",
    title: "Performance Marketing",
    body: "Meta, Google, Performance Max, and YouTube — engineered for measurable footfall, orders, and bookings.",
    href: "/services/meta-ads",
    icon: "rocket",
    tag: "Paid",
  },
  {
    n: "02",
    title: "Search & SEO",
    body: "Technical, local, and content SEO for independent restaurants and multi-venue groups.",
    href: "/services/seo",
    icon: "search",
    tag: "Organic",
  },
  {
    n: "03",
    title: "Social Media",
    body: "End-to-end strategy, content production, community management, and analytics.",
    href: "/services/social-media",
    icon: "spark",
    tag: "Brand",
  },
  {
    n: "04",
    title: "Creative Production",
    body: "Brand identity, menu design, food photography retouching, and short-form video.",
    href: "/services/graphics-design",
    icon: "camera",
    tag: "Creative",
  },
  {
    n: "05",
    title: "Operations",
    body: "POS rollouts, delivery platform launches, and menu engineering across aggregators.",
    href: "/services/pos-setup",
    icon: "terminal",
    tag: "Ops",
  },
  {
    n: "06",
    title: "Digital Foundation",
    body: "High-performance websites and conversion-optimised online ordering systems.",
    href: "/services/web-development",
    icon: "globe",
    tag: "Web",
  },
] as const;

const SHOWCASE = [
  {
    title: "Alba Restaurant Group",
    sub: "Multi-venue · United Kingdom",
    metric: "+184%",
    metricLabel: "Online orders",
  },
  {
    title: "Harvest Cafés",
    sub: "Café chain · Canada",
    metric: "+97%",
    metricLabel: "Return on ad spend",
  },
  {
    title: "Roma Trattoria",
    sub: "Independent · European Union",
    metric: "−42%",
    metricLabel: "Cost per acquisition",
  },
] as const;

const INDUSTRIES = [
  { name: "Independent restaurants", lede: "Single-owner cafés to flagship destination dining." },
  { name: "Multi-venue groups", lede: "From three-venue ops to fifty-site portfolios." },
  { name: "Hotels & resorts", lede: "F&B revenue, spa visibility, direct booking growth." },
  { name: "Cafés & QSR", lede: "Daypart engineering, loyalty, aggregator stacks." },
  { name: "Cloud kitchens", lede: "Brand launches, multi-aggregator ops, menu R&D." },
  { name: "Catering & events", lede: "Volume bookings, B2B funnels, peak-season planning." },
];

const APPROACH = [
  { n: "I", title: "Discovery call", body: "A senior strategist listens. We map the venue, the room, and the unfair advantages." },
  { n: "II", title: "Diagnostic", body: "A two-week audit of ads, search, social, and operations — with prioritised opportunities." },
  { n: "III", title: "Engagement", body: "Productized package, retainer, or one-off scope. The strategist on call stays on the work." },
  { n: "IV", title: "Quarterly review", body: "Outcomes against forecast — orders, covers, margin, rank. Plans are adjusted, never theatre." },
];

const MARQUEE_ITEMS = [
  "Independent restaurants",
  "Multi-venue groups",
  "Hotels & resorts",
  "Cafés & QSR",
  "Cloud kitchens",
  "Catering & events",
  "Bars & bistros",
  "Boutique hospitality",
] as const;

function CapIcon({ name }: { name: (typeof CAPABILITIES)[number]["icon"] }) {
  const props = {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.7,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    className: "h-7 w-7",
    "aria-hidden": true,
  };
  switch (name) {
    case "rocket":
      return (
        <svg {...props}>
          <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09Z" />
          <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2Z" />
          <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
        </svg>
      );
    case "search":
      return (
        <svg {...props}>
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-3.5-3.5" />
        </svg>
      );
    case "spark":
      return (
        <svg {...props}>
          <path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1" />
          <path d="M12 8.5l1.2 2.3 2.3 1.2-2.3 1.2-1.2 2.3-1.2-2.3-2.3-1.2 2.3-1.2L12 8.5Z" />
        </svg>
      );
    case "camera":
      return (
        <svg {...props}>
          <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3Z" />
          <circle cx="12" cy="13" r="3.5" />
        </svg>
      );
    case "terminal":
      return (
        <svg {...props}>
          <rect x="3" y="4" width="18" height="16" rx="2" />
          <path d="m7 9 3 3-3 3M13 15h4" />
        </svg>
      );
    case "globe":
      return (
        <svg {...props}>
          <circle cx="12" cy="12" r="9" />
          <path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" />
        </svg>
      );
  }
}

function ArrowGlyph() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
      <path d="M7 17L17 7M17 7H8M17 7V16" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Home");

  return (
    <div className="lux-home">
      {/* ============================================================
          HERO — full-bleed cinematic image background.

          Save the hero image at public/brand/hero-image.jpg —
          this section uses it edge-to-edge with layered dark
          gradient overlays so the headline + CTAs stay readable.
          Aurora orbs drift behind the image for depth; a glass
          KPI strip pins to the bottom of the section.
          ============================================================ */}
      <section className="lux-hero-section relative overflow-hidden flex flex-col">
        {/* Aurora ambient behind image */}
        <Aurora variant="soft" />

        {/* Full-bleed image fill.

            object-position is responsive:
            - mobile (narrow viewport): biased to 70% horizontal so
              the figure's torso/head (right side of the image) stays
              visible after the left/right edges are cropped by
              object-cover.
            - md+ (wider viewport): centered. */}
        <Image
          src="/brand/hero-image.jpg"
          alt="Hospitality growth in motion"
          fill
          priority
          sizes="100vw"
          className="absolute inset-0 z-[1] object-cover object-[70%_center] md:object-center"
          style={{ opacity: 0.85 }}
        />

        {/* Layered scrims — uniform darken + center darken for
            centered headline contrast + top/bottom fades for
            sticky header and KPI strip readability. */}
        <div
          aria-hidden="true"
          className="absolute inset-0 z-[2]"
          style={{
            background: "rgba(5, 5, 5, 0.55)",
          }}
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 z-[2]"
          style={{
            background:
              "radial-gradient(ellipse 70% 60% at 50% 50%, rgba(5, 5, 5, 0.55), transparent 80%)",
          }}
        />
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-0 h-36 z-[2]"
          style={{
            background:
              "linear-gradient(to bottom, rgba(5, 5, 5, 0.95), transparent)",
          }}
        />
        <div
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 h-2/5 z-[2]"
          style={{
            background:
              "linear-gradient(to top, rgba(5, 5, 5, 0.97) 0%, rgba(5, 5, 5, 0.75) 35%, rgba(5, 5, 5, 0.25) 75%, transparent 100%)",
          }}
        />

        {/* Subtle grid + noise overlay for editorial texture */}
        <div
          aria-hidden="true"
          className="absolute inset-0 z-[3] pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255, 255, 255, 0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.04) 1px, transparent 1px)",
            backgroundSize: "64px 64px",
            maskImage:
              "radial-gradient(ellipse at center, black 0, transparent 80%)",
            WebkitMaskImage:
              "radial-gradient(ellipse at center, black 0, transparent 80%)",
          }}
        />

        {/* Content overlay — centered on the page */}
        <Container
          className="relative z-[10] flex-1 flex flex-col items-center justify-center text-center"
          style={{
            paddingTop: "var(--hero-y-top)",
            paddingBottom: "var(--hero-y-bottom)",
          }}
        >
          <Reveal variant="fade-up" className="mx-auto max-w-4xl flex flex-col items-center">
            <span className="lux-overline">{t("eyebrow")}</span>

            <h1
              className="lux-display mt-7 mx-auto max-w-[24ch]"
              style={{
                textShadow: "0 2px 24px rgba(0, 0, 0, 0.55)",
              }}
            >
              Where the <em>art of hospitality</em> meets the science of growth.
            </h1>

            <p
              className="lux-lede mt-8 mx-auto max-w-2xl"
              style={{
                color: "#ffffff",
                textShadow:
                  "0 1px 2px rgba(0, 0, 0, 0.85), 0 0 18px rgba(0, 0, 0, 0.65)",
              }}
            >
              {t("subheading")}
            </p>

            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <Link href="/contact" className="lux-btn lux-btn--primary group">
                Begin a conversation
                <span className="arrow-shift" aria-hidden="true">→</span>
              </Link>
              <Link href="/portfolio" className="lux-btn lux-btn--ghost group">
                See recent work
                <span className="arrow-shift" aria-hidden="true">→</span>
              </Link>
            </div>

            <div
              className="mt-12 flex flex-wrap items-center justify-center gap-x-7 gap-y-3 text-[11px] font-bold uppercase tracking-[0.22em]"
              style={{
                color: "#ffffff",
                textShadow: "0 1px 2px rgba(0, 0, 0, 0.85)",
              }}
            >
              <span style={{ opacity: 0.8 }}>Serving operators in</span>
              {["UK", "US", "CA", "EU", "AU"].map((r, i) => (
                <span key={r} className="flex items-center gap-4">
                  <span>{r}</span>
                  {i < 4 && (
                    <span
                      aria-hidden="true"
                      className="h-1 w-1 rounded-full"
                      style={{ background: "var(--lux-grad-champagne-rose)" }}
                    />
                  )}
                </span>
              ))}
            </div>
          </Reveal>
        </Container>

        {/* Bottom glass KPI strip — pinned to hero floor */}
        <div className="relative z-[10] border-t border-[color:var(--lux-line)]">
          <Container className="py-6 sm:py-7">
            <Reveal variant="fade-up" delay={200}>
              <div className="flex flex-wrap items-center gap-x-8 gap-y-4 justify-between">
                <div className="flex items-baseline gap-3">
                  <p
                    className="font-display leading-none"
                    style={{
                      fontSize: "clamp(2rem, 3.6vw, 2.85rem)",
                      fontWeight: 800,
                      letterSpacing: "-0.028em",
                      background: "var(--lux-grad-champagne-rose)",
                      WebkitBackgroundClip: "text",
                      backgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                    }}
                  >
                    +184<span className="text-[0.45em] align-top">%</span>
                  </p>
                  <div>
                    <p className="text-sm font-bold text-[color:var(--lux-pearl)]">
                      Online order growth
                    </p>
                    <p className="text-xs text-[color:var(--lux-pearl-faint)]">
                      14-venue UK group · six-month engagement
                    </p>
                  </div>
                </div>

                <ul className="flex flex-wrap items-stretch gap-3 sm:gap-4">
                  {[
                    { k: "ROAS", v: "5.8×" },
                    { k: "CAC", v: "−42%" },
                    { k: "Repeat", v: "+31%" },
                  ].map((m) => (
                    <li key={m.k} className="lux-kpi flex-1 min-w-[110px]">
                      <p className="lux-kpi__num">{m.v}</p>
                      <p className="lux-kpi__label">{m.k}</p>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </Container>
        </div>

        {/* Hero bottom marquee — sits flush against next section */}
        <div className="relative z-[10] border-t border-[color:var(--lux-line)] py-7">
          <MarqueeRail items={MARQUEE_ITEMS} />
        </div>
      </section>

      {/* ============================================================
          STATS — 4 glass cards on continuing obsidian
          ============================================================ */}
      <section className="relative overflow-hidden" style={{ background: "var(--lux-onyx)" }}>
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{ background: "var(--lux-grad-aurora-soft)", opacity: 0.6 }}
        />
        <Container className="relative z-10 py-[var(--section-y)]">
          <Reveal variant="fade-up" className="mb-12 max-w-2xl">
            <span className="lux-overline">By the numbers</span>
            <h2 className="lux-section-title mt-6">
              Built on outcomes, <em>measured every quarter.</em>
            </h2>
          </Reveal>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {STATS.map((s, i) => (
              <Reveal as="div" key={s.label} variant="fade-up" index={i}>
                <div className="lux-stat h-full">
                  <p className="lux-stat__num">
                    {s.prefix}
                    <Counter to={s.to} />
                    {s.suffix}
                  </p>
                  <p className="lux-stat__label">{s.label}</p>
                  <p className="lux-stat__sub">{s.sub}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* ============================================================
          CAPABILITIES — 6 glass service tiles with icon orbs
          ============================================================ */}
      <section className="relative overflow-hidden" style={{ background: "var(--lux-onyx)" }}>
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 60% 50% at 80% 20%, rgba(255, 87, 87, 0.20), transparent 60%), radial-gradient(ellipse 50% 50% at 20% 80%, rgba(122, 0, 0, 0.30), transparent 60%)",
            opacity: 0.7,
          }}
        />
        <Container className="relative z-10 py-[var(--section-y)]">
          <Reveal
            variant="fade-up"
            className="mb-12 grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end"
          >
            <div className="max-w-2xl">
              <span className="lux-overline">{t("servicesEyebrow")}</span>
              <h2 className="lux-section-title mt-6">
                A complete <em>growth practice</em>, under one senior-led roof.
              </h2>
              <p className="lux-lede mt-6 max-w-xl">
                Six interlocking disciplines. The strategist on your first
                call is the strategist on every call after.
              </p>
            </div>
            <Link
              href="/services"
              className="link-arrow text-sm"
              style={{ color: "var(--lux-champagne)" }}
            >
              Browse all services
              <span className="arrow-shift" aria-hidden="true">→</span>
            </Link>
          </Reveal>

          <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {CAPABILITIES.map((c, i) => (
              <Reveal as="li" key={c.href} variant="fade-up" index={i}>
                <Link href={c.href} className="lux-service group">
                  <div className="flex items-start justify-between gap-3">
                    <span className="lux-icon-orb">
                      <CapIcon name={c.icon} />
                    </span>
                    <span className="lux-service__tag">{c.tag}</span>
                  </div>
                  <p className="lux-service__num mt-7">— {c.n}</p>
                  <p className="lux-service__title">{c.title}</p>
                  <p className="lux-service__body">{c.body}</p>
                  <div className="lux-service__cta">
                    <span className="lux-service__cta-text">Learn more</span>
                    <span className="lux-fab" aria-hidden="true">
                      <ArrowGlyph />
                    </span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </ul>
        </Container>
      </section>

      {/* ============================================================
          SIGNATURE WORK — three cinematic showcase tiles
          ============================================================ */}
      <section className="relative overflow-hidden" style={{ background: "var(--lux-void)" }}>
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{ background: "var(--lux-grad-aurora-soft)", opacity: 0.5 }}
        />
        <Container className="relative z-10 py-[var(--section-y)]">
          <Reveal
            variant="fade-up"
            className="mb-12 grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end"
          >
            <div className="max-w-2xl">
              <span className="lux-overline">Signature work</span>
              <h2 className="lux-section-title mt-6">
                Outcomes, not just <em>outputs.</em>
              </h2>
              <p className="lux-lede mt-6 max-w-xl">
                Each engagement leads with measurable impact — orders,
                covers, margin, rank — never vanity metrics.
              </p>
            </div>
            <Link
              href="/portfolio"
              className="link-arrow text-sm"
              style={{ color: "var(--lux-champagne)" }}
            >
              See full portfolio
              <span className="arrow-shift" aria-hidden="true">→</span>
            </Link>
          </Reveal>

          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {SHOWCASE.map((item, i) => (
              <Reveal as="li" key={item.title} variant="fade-up" index={i}>
                <Link href="/portfolio" className="lux-showcase group">
                  <div className="lux-showcase__cover">
                    <span className="lux-showcase__chip">
                      <span className="lux-showcase__chip-dot" />
                      {item.sub}
                    </span>
                    <div className="lux-showcase__metric">
                      <div>
                        <p className="lux-showcase__metric-num">{item.metric}</p>
                        <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.18em] text-[color:var(--lux-pearl-soft)]">
                          {item.metricLabel}
                        </p>
                      </div>
                      <span className="lux-fab" aria-hidden="true">
                        <ArrowGlyph />
                      </span>
                    </div>
                  </div>
                  <div className="lux-showcase__body">
                    <p className="lux-showcase__title">{item.title}</p>
                    <p className="lux-showcase__sub">Case study</p>
                  </div>
                </Link>
              </Reveal>
            ))}
          </ul>
        </Container>
      </section>

      {/* ============================================================
          APPROACH — 4-step process strip with gold rule
          ============================================================ */}
      <section className="relative overflow-hidden" style={{ background: "var(--lux-onyx)" }}>
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 50% 40% at 50% 0%, rgba(255, 87, 87, 0.16), transparent 60%)",
          }}
        />
        <Container className="relative z-10 py-[var(--section-y)]">
          <Reveal variant="fade-up" className="mb-12 max-w-2xl">
            <span className="lux-overline">{t("engagementEyebrow")}</span>
            <h2 className="lux-section-title mt-6">
              A considered <em>four-step</em> rhythm.
            </h2>
            <p className="lux-lede mt-6">{t("engagementBody")}</p>
          </Reveal>

          <div className="lux-approach">
            {APPROACH.map((step, i) => (
              <Reveal key={step.title} variant="fade-up" index={i} className="lux-approach__step">
                <span className="lux-approach__dot">{step.n}</span>
                <p className="lux-approach__title">{step.title}</p>
                <p className="lux-approach__body">{step.body}</p>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* ============================================================
          INDUSTRIES — split layout with glass numbered list
          ============================================================ */}
      <section className="relative overflow-hidden" style={{ background: "var(--lux-void)" }}>
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 50% 40% at 10% 30%, rgba(255, 138, 138, 0.22), transparent 60%), radial-gradient(ellipse 50% 50% at 90% 80%, rgba(255, 87, 87, 0.16), transparent 60%)",
          }}
        />
        <Container className="relative z-10 py-[var(--section-y)]">
          <div className="grid gap-14 lg:grid-cols-[1fr_1.5fr] lg:items-start">
            <Reveal variant="fade-up">
              <span className="lux-overline">Industries served</span>
              <h2 className="lux-section-title mt-6">
                Built for <em>hospitality.</em>
                <br />
                <span style={{ color: "var(--lux-pearl-faint)" }}>Nothing else.</span>
              </h2>
              <p className="lux-lede mt-6 max-w-md">
                One sector, deeply. The playbook scales from a single
                café to a fifty-venue restaurant group.
              </p>
            </Reveal>

            <Reveal variant="slide-left" delay={150}>
              <ul className="lux-industry-list">
                {INDUSTRIES.map((sector, i) => (
                  <li key={sector.name}>
                    <Link
                      href="/services"
                      className="lux-industry-row group flex items-center"
                    >
                      <span className="lux-industry-row__num">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <div className="flex-1 px-2">
                        <p className="lux-industry-row__title">{sector.name}</p>
                        <p className="lux-industry-row__sub">{sector.lede}</p>
                      </div>
                      <span className="lux-fab" aria-hidden="true">
                        <ArrowGlyph />
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* ============================================================
          CTA — cinematic finale panel
          ============================================================ */}
      <section className="relative overflow-hidden" style={{ background: "var(--lux-onyx)" }}>
        <Container className="py-[var(--section-y)]">
          <Reveal variant="fade-up">
            <div className="lux-cta-panel">
              <div className="relative z-10 grid gap-10 lg:grid-cols-[1.4fr_1fr] lg:items-end">
                <div>
                  <span className="lux-overline">{t("ctaSectionEyebrow")}</span>
                  <h2 className="lux-section-title mt-6 max-w-3xl">
                    Built around the venue. <em>Not the other way round.</em>
                  </h2>
                  <p className="lux-lede mt-6 max-w-xl">
                    A short intro call. Senior strategist on the line.
                    Your questions in plain language. We&rsquo;ll review your current
                    stack and propose the highest-leverage move.
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-4 lg:justify-end">
                  <Link href="/contact" className="lux-btn lux-btn--primary group">
                    {t("ctaPrimary")}
                    <span className="arrow-shift" aria-hidden="true">→</span>
                  </Link>
                  <Link href="/services" className="lux-btn lux-btn--ghost group">
                    {t("ctaSecondary")}
                    <span className="arrow-shift" aria-hidden="true">→</span>
                  </Link>
                </div>
              </div>
            </div>
          </Reveal>
        </Container>
      </section>
    </div>
  );
}
