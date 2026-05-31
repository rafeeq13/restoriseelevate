import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Container } from "@/components/marketing/Container";
import { PageHeader } from "@/components/marketing/PageHeader";
import { Reveal } from "@/components/marketing/Reveal";
import { FinalCTA } from "@/components/marketing/FinalCTA";
import { listServices } from "@/lib/content";

export const metadata: Metadata = {
  title: "Services",
  description:
    "The full Restorise service stack — advertising, SEO, social media, creative production, software development, and hospitality operations.",
};

const FALLBACK = [
  {
    category: "Performance Marketing & Advertising",
    items: [
      { name: "Meta Ads", slug: "meta-ads", summary: "Facebook & Instagram campaigns for footfall, orders, and bookings." },
      { name: "Google Ads", slug: "google-ads", summary: "Paid search, Performance Max, and YouTube — optimised for ROAS." },
    ],
  },
  {
    category: "Search Engine Optimization",
    items: [
      { name: "SEO", slug: "seo", summary: "Technical, on-page, local SEO, content strategy, and Google Business Profile management." },
    ],
  },
  {
    category: "Social Media & Content",
    items: [
      { name: "Social Media Management", slug: "social-media", summary: "Strategy, scheduling, community, and reporting." },
      { name: "Video Editing", slug: "video-editing", summary: "Short-form video and food ads with captions, colour, motion." },
    ],
  },
  {
    category: "Creative & Design",
    items: [
      { name: "Graphics Design", slug: "graphics-design", summary: "Identity, menus, packaging, social, print collateral." },
    ],
  },
  {
    category: "Software Development",
    items: [
      { name: "Web Development", slug: "web-development", summary: "Marketing sites and online ordering for restaurants and takeaways." },
      { name: "Mobile App Development", slug: "mobile-apps", summary: "Ordering, loyalty, and engagement apps." },
    ],
  },
  {
    category: "Hospitality Operations",
    items: [
      { name: "POS Setup", slug: "pos-setup", summary: "POS selection, configuration, integration, and staff training." },
      { name: "Delivery Platform Setup", slug: "delivery-platforms", summary: "End-to-end aggregator onboarding and launch optimisation." },
      { name: "Menu Management on Delivery Apps", slug: "menu-management", summary: "Pricing, photography, promo, and performance on UberEats, Deliveroo, Just Eat, Grubhub, foodpanda, and more." },
    ],
  },
];

type ServiceDoc = {
  id: string | number;
  name: string;
  slug: string;
  summary?: string;
  category: string;
};

const CATEGORY_LABELS: Record<string, string> = {
  advertising: "Performance Marketing & Advertising",
  seo: "Search Engine Optimization",
  social: "Social Media & Content",
  creative: "Creative & Design",
  software: "Software Development",
  operations: "Hospitality Operations",
};

const ENGAGEMENT_MODELS = [
  {
    n: "I",
    name: "Productized package",
    tagline: "Fixed scope · Fixed price",
    body: "A clear deliverable for first engagements and price-sensitive prospects. Quote signed within 48 hours, work begins inside one week.",
    suited: "Single-channel launch, audit, brand sprint",
    highlight: false,
  },
  {
    n: "II",
    name: "Custom retainer",
    tagline: "Monthly · Dominant model",
    body: "Ongoing engagements scoped to your goals — social management, paid acquisition, SEO, or full-funnel growth. Senior strategist on every call.",
    suited: "Long-term growth, multi-channel ownership",
    highlight: true,
  },
  {
    n: "III",
    name: "Project-based scope",
    tagline: "One-time · Defined outcome",
    body: "New website builds, brand refreshes, POS rollouts, or aggregator setups. Discovery, build, launch, handover — done.",
    suited: "Website rebuild, POS rollout, brand refresh",
    highlight: false,
  },
] as const;

const PLATFORM_PARTNERS = [
  { label: "Meta", group: "Ads" },
  { label: "Google", group: "Ads" },
  { label: "TikTok", group: "Social" },
  { label: "Instagram", group: "Social" },
  { label: "UberEats", group: "Aggregator" },
  { label: "Deliveroo", group: "Aggregator" },
  { label: "Just Eat", group: "Aggregator" },
  { label: "DoorDash", group: "Aggregator" },
  { label: "Grubhub", group: "Aggregator" },
  { label: "foodpanda", group: "Aggregator" },
  { label: "Talabat", group: "Aggregator" },
  { label: "Toast", group: "POS" },
  { label: "Square", group: "POS" },
  { label: "Lightspeed", group: "POS" },
  { label: "Stripe", group: "Payments" },
] as const;

export default async function ServicesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const docs = (await listServices(locale)) as unknown as ServiceDoc[];

  const grouped =
    docs.length > 0
      ? Object.values(
          docs.reduce<Record<string, { category: string; items: ServiceDoc[] }>>(
            (acc, doc) => {
              const label = CATEGORY_LABELS[doc.category] ?? doc.category;
              if (!acc[label]) acc[label] = { category: label, items: [] };
              acc[label].items.push(doc);
              return acc;
            },
            {},
          ),
        )
      : FALLBACK;

  return (
    <>
      <PageHeader
        chapter="02"
        eyebrow="Services"
        title="A focused stack for"
        accentWord="hospitality."
        description="Each service is offered as a productised package, a custom retainer, or a one-time project."
      />

      {/* ============================================================
          ENGAGEMENT MODELS — three commercial paths in glass cards
          ============================================================ */}
      <section
        className="relative overflow-hidden"
        style={{ background: "var(--lux-onyx)" }}
      >
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 50% 40% at 50% 0%, rgba(255, 87, 87, 0.18), transparent 60%), radial-gradient(ellipse 60% 50% at 90% 100%, rgba(122, 0, 0, 0.32), transparent 65%)",
          }}
        />
        <Container className="relative z-10 py-[var(--section-y)]">
          <Reveal variant="fade-up" className="mb-12 max-w-3xl">
            <span className="lux-overline">Engagement models</span>
            <h2 className="lux-section-title mt-6">
              One enquiry form, <em>three commercial paths.</em>
            </h2>
            <p className="lux-lede mt-6">
              Whichever shape suits your stage — pick the engagement model
              that fits and we&rsquo;ll calibrate everything else.
            </p>
          </Reveal>

          <ul className="grid gap-5 lg:grid-cols-3">
            {ENGAGEMENT_MODELS.map((m, i) => (
              <Reveal as="li" key={m.n} variant="fade-up" index={i}>
                <div className={`lux-glass h-full p-8 ${m.highlight ? "lux-glass--hot" : ""}`}>
                  <div className="flex items-center justify-between gap-3">
                    <span
                      className="font-display italic"
                      style={{
                        fontSize: "1rem",
                        background: "var(--lux-grad-champagne-rose)",
                        WebkitBackgroundClip: "text",
                        backgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                      }}
                    >
                      Model {m.n}
                    </span>
                    {m.highlight && (
                      <span
                        className="rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.18em]"
                        style={{
                          background: "var(--lux-grad-champagne-rose)",
                          color: "var(--ink-900)",
                        }}
                      >
                        Most chosen
                      </span>
                    )}
                  </div>

                  <p
                    className="mt-5 font-display"
                    style={{
                      fontSize: "1.6rem",
                      fontWeight: 700,
                      lineHeight: 1.18,
                      color: "var(--lux-pearl)",
                    }}
                  >
                    {m.name}
                  </p>
                  <p className="mt-2 text-xs font-bold uppercase tracking-[0.18em] text-[color:var(--lux-champagne)]">
                    {m.tagline}
                  </p>

                  <p className="mt-6 text-sm leading-relaxed text-[color:var(--lux-pearl-soft)]">
                    {m.body}
                  </p>

                  <div className="mt-6 border-t border-[color:var(--lux-line)] pt-5">
                    <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[color:var(--lux-pearl-faint)]">
                      Best for
                    </p>
                    <p className="mt-2 text-sm text-[color:var(--lux-pearl)]">
                      {m.suited}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </ul>
        </Container>
      </section>

      {/* ============================================================
          SERVICE CATALOG — existing categories, dark luxe styling
          ============================================================ */}
      <section className="border-t border-[color:var(--brand-border)] bg-[color:var(--brand-surface-paper)]">
        <Container className="py-[var(--section-y)] space-y-20">
          {grouped.map((group, gi) => (
            <Reveal key={group.category} variant="fade-up">
              <article className="chapter-rule">
                <div className="grid gap-10 lg:grid-cols-[1fr_2fr]">
                  <div>
                    <span className="chapter">{String(gi + 1).padStart(2, "0")}</span>
                    <h2 className="h-section mt-4 max-w-[16ch]">
                      {group.category}
                    </h2>
                  </div>
                  <ul className="divide-y divide-[color:var(--brand-border)]">
                    {group.items.map((item) => (
                      <li key={item.slug}>
                        <Link
                          href={`/services/${item.slug}`}
                          className="group flex items-start justify-between gap-6 py-6 transition-colors hover:bg-[color:var(--brand-surface-cream)] hover:px-4"
                        >
                          <div className="flex-1">
                            <p className="h-sub">{item.name}</p>
                            {item.summary && (
                              <p className="mt-2 text-sm leading-relaxed text-ink-muted">
                                {item.summary}
                              </p>
                            )}
                          </div>
                          <span
                            aria-hidden="true"
                            className="font-serif italic text-2xl text-[color:var(--brand-primary)] opacity-30 transition-opacity group-hover:opacity-100"
                          >
                            →
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            </Reveal>
          ))}
        </Container>
      </section>

      {/* ============================================================
          PLATFORM PARTNERS — chips strip showing tools/aggregators
          ============================================================ */}
      <section className="border-t border-[color:var(--brand-border)] bg-[color:var(--brand-surface)]">
        <Container className="py-[var(--section-y)]">
          <Reveal variant="fade-up" className="mb-12 max-w-3xl">
            <span className="lux-overline">Platforms we work across</span>
            <h2 className="h-section mt-6">
              The platforms that <em className="em">move the metrics.</em>
            </h2>
            <p className="lede mt-6">
              From ad networks to point-of-sale to the aggregators where
              orders land — we&rsquo;re fluent in the stack a modern food
              business actually runs on.
            </p>
          </Reveal>

          <ul className="flex flex-wrap gap-3">
            {PLATFORM_PARTNERS.map((p, i) => (
              <Reveal as="li" key={p.label} variant="fade-up" index={i}>
                <span
                  className="inline-flex items-center gap-2.5 rounded-full px-4 py-2.5"
                  style={{
                    background: "var(--lux-glass)",
                    border: "1px solid var(--lux-glass-border)",
                    backdropFilter: "blur(14px)",
                  }}
                >
                  <span
                    aria-hidden="true"
                    className="inline-block h-1.5 w-1.5 rounded-full"
                    style={{
                      background: "var(--lux-grad-champagne-rose)",
                      boxShadow: "0 0 8px rgba(255, 87, 87, 0.6)",
                    }}
                  />
                  <span
                    className="font-display"
                    style={{ fontSize: "1rem", fontWeight: 700 }}
                  >
                    {p.label}
                  </span>
                  <span className="text-[9px] font-bold uppercase tracking-[0.18em] text-[color:var(--lux-pearl-faint)]">
                    {p.group}
                  </span>
                </span>
              </Reveal>
            ))}
          </ul>
        </Container>
      </section>

      <FinalCTA
        eyebrow="Pick a starting point"
        title="Not sure which service"
        accentWord="fits?"
        description="Send us a short note about your venue and current goals. We'll come back with the highest-leverage move within one working day."
        primaryLabel="Get a tailored proposal"
        secondaryLabel="Read case studies"
        secondaryHref="/portfolio"
      />
    </>
  );
}
