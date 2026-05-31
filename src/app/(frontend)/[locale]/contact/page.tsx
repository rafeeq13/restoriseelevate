import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { Container } from "@/components/marketing/Container";
import { PageHeader } from "@/components/marketing/PageHeader";
import { Button } from "@/components/marketing/Button";
import { Reveal } from "@/components/marketing/Reveal";
import { getSiteSettings } from "@/lib/siteData";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with Restorise Business Solutions. We respond to enquiries within one working day.",
};

const REGIONS = ["United Kingdom", "United States", "Canada", "European Union", "Australia"];

const NEXT_STEPS = [
  {
    n: "I",
    title: "We acknowledge",
    body: "Within four working hours, you&rsquo;ll have a personal reply from a senior strategist — not an auto-responder.",
  },
  {
    n: "II",
    title: "We diagnose",
    body: "A 30-minute intro call. We listen, ask sharp questions, and surface the highest-leverage move.",
  },
  {
    n: "III",
    title: "We propose",
    body: "Within one working week, a written proposal with scope, timeline, and pricing — no deck-pitch.",
  },
] as const;

function MailGlyph() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="h-6 w-6" aria-hidden="true">
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m4 7 8 6 8-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function PhoneGlyph() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="h-6 w-6" aria-hidden="true">
      <path
        d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.95.34 1.88.64 2.78a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.3-1.21a2 2 0 0 1 2.11-.45c.9.3 1.83.51 2.78.64A2 2 0 0 1 22 16.92z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
function ClockGlyph() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="h-6 w-6" aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function GlobeGlyph() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="h-6 w-6" aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const settings = await getSiteSettings(locale);

  const channels = [
    {
      icon: <MailGlyph />,
      label: "Email",
      value: settings.contact.email,
      href: `mailto:${settings.contact.email}`,
      sub: "Direct line · response within one working day",
    },
    settings.contact.phone
      ? {
          icon: <PhoneGlyph />,
          label: "Telephone",
          value: settings.contact.phone,
          href: `tel:${settings.contact.phone}`,
          sub: "Senior strategist on the line",
        }
      : null,
    settings.contact.workingHours
      ? {
          icon: <ClockGlyph />,
          label: "Working hours",
          value: settings.contact.workingHours,
          href: undefined,
          sub: "Local timezone availability per region",
        }
      : null,
    {
      icon: <GlobeGlyph />,
      label: "Coverage",
      value: "5 regions",
      href: undefined,
      sub: "UK · US · Canada · EU · Australia",
    },
  ].filter(Boolean) as Array<{
    icon: React.ReactNode;
    label: string;
    value: string;
    href?: string;
    sub: string;
  }>;

  return (
    <>
      <PageHeader
        chapter="06"
        eyebrow="Contact"
        title="Tell us about your"
        accentWord="venue."
        description="We respond to enquiries within one working day. Senior strategist on the first call — no obligation, no deck-pitch."
      />

      {/* ============================================================
          CHANNEL CARDS — 4 glass cards with icon orbs
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
          <Reveal variant="fade-up" className="mb-12 max-w-3xl">
            <span className="lux-overline">Reach us</span>
            <h2 className="lux-section-title mt-6">
              Pick the line that <em>suits you.</em>
            </h2>
          </Reveal>

          <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {channels.map((c, i) => {
              const inner = (
                <>
                  <span className="lux-icon-orb">{c.icon}</span>
                  <p className="mt-6 text-[10px] font-bold uppercase tracking-[0.22em] text-[color:var(--lux-pearl-faint)]">
                    {c.label}
                  </p>
                  <p
                    className="mt-2 font-display break-words"
                    style={{
                      fontSize: "1.2rem",
                      fontWeight: 700,
                      lineHeight: 1.24,
                      color: "var(--lux-pearl)",
                    }}
                  >
                    {c.value}
                  </p>
                  <p className="mt-3 text-sm text-[color:var(--lux-pearl-faint)]">
                    {c.sub}
                  </p>
                </>
              );
              return (
                <Reveal as="li" key={c.label} variant="fade-up" index={i}>
                  {c.href ? (
                    <a href={c.href} className="lux-service group">
                      {inner}
                    </a>
                  ) : (
                    <div className="lux-service group" style={{ cursor: "default" }}>
                      {inner}
                    </div>
                  )}
                </Reveal>
              );
            })}
          </ul>
        </Container>
      </section>

      {/* ============================================================
          ENQUIRY + WHAT HAPPENS NEXT
          ============================================================ */}
      <section className="border-t border-[color:var(--brand-border)] bg-[color:var(--brand-surface-paper)]">
        <Container className="py-[var(--section-y)]">
          <div className="grid gap-12 lg:grid-cols-[1.2fr_1fr] lg:items-start">
            {/* Brief invitation panel */}
            <Reveal variant="fade-up">
              <aside
                className="rounded-[var(--radius-2xl)] p-10 sm:p-12"
                style={{
                  background:
                    "radial-gradient(ellipse 50% 50% at 0% 0%, rgba(255, 87, 87, 0.25), transparent 60%), radial-gradient(ellipse 60% 60% at 100% 100%, rgba(122, 0, 0, 0.42), transparent 60%), linear-gradient(160deg, var(--lux-obsidian) 0%, var(--lux-onyx) 60%, #1a0000 100%)",
                  border: "1px solid rgba(255, 87, 87, 0.28)",
                  boxShadow: "0 24px 70px -16px rgba(0, 0, 0, 0.55)",
                }}
              >
                <span className="lux-overline">Send your brief</span>
                <h2 className="lux-section-title mt-6">
                  One form. Full brief in <em>one place.</em>
                </h2>
                <p className="lux-lede mt-6">
                  The lead capture modal collects the structured details we
                  need — venue type, location, current channels, and the
                  outcome you&rsquo;re hiring for.
                </p>

                <ul className="mt-9 space-y-3.5">
                  {[
                    "Reply within one working day",
                    "Senior strategist on the first call",
                    "No deck-pitch — only the highest-leverage move",
                    "Free, no-obligation 30-minute intro",
                  ].map((b) => (
                    <li
                      key={b}
                      className="flex items-start gap-3 text-[color:var(--lux-pearl-soft)]"
                    >
                      <span
                        aria-hidden="true"
                        className="mt-2 inline-block h-1.5 w-1.5 flex-shrink-0 rounded-full"
                        style={{
                          background: "var(--lux-grad-champagne-rose)",
                          boxShadow: "0 0 10px rgba(255, 87, 87, 0.7)",
                        }}
                      />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-10 flex flex-wrap gap-3">
                  <Button as="link" href="/" size="lg">
                    Open enquiry form
                    <span className="arrow-shift" aria-hidden="true">→</span>
                  </Button>
                  <Button as="link" href="/services" variant="glass" size="lg">
                    Browse services
                  </Button>
                </div>
              </aside>
            </Reveal>

            {/* What happens next — 3-step rail */}
            <Reveal variant="fade-up" delay={150}>
              <span className="chapter">02</span>
              <p className="eyebrow mt-3">What happens next</p>
              <h2 className="h-section mt-6 max-w-md">
                Three steps to a <em className="em">proposal.</em>
              </h2>

              <ol className="relative mt-10">
                <span
                  aria-hidden="true"
                  className="absolute left-[27px] top-4 bottom-4 w-px"
                  style={{
                    background:
                      "linear-gradient(to bottom, transparent, rgba(255, 87, 87, 0.5), rgba(255, 138, 138, 0.4), transparent)",
                  }}
                />
                {NEXT_STEPS.map((step, i) => (
                  <li key={step.n} className="relative pl-20 pb-10 last:pb-0">
                    <span
                      aria-hidden="true"
                      className="absolute left-0 top-0 inline-flex h-14 w-14 items-center justify-center rounded-full"
                      style={{
                        background: "var(--lux-onyx)",
                        border: "1px solid rgba(255, 87, 87, 0.45)",
                        color: "var(--lux-champagne)",
                        fontFamily: "var(--font-display)",
                        fontStyle: "italic",
                        fontSize: "1.25rem",
                        boxShadow:
                          "inset 0 1px 0 rgba(246, 236, 214, 0.10), 0 0 0 4px var(--lux-onyx), 0 0 24px -4px rgba(255, 87, 87, 0.45)",
                      }}
                    >
                      {step.n}
                    </span>
                    <p className="h-sub">{step.title}</p>
                    <p
                      className="mt-2 text-sm leading-relaxed text-ink-muted"
                      dangerouslySetInnerHTML={{ __html: step.body }}
                    />
                  </li>
                ))}
              </ol>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* ============================================================
          REGIONS — chip strip for global coverage
          ============================================================ */}
      <section className="border-t border-[color:var(--brand-border)] bg-[color:var(--brand-surface)]">
        <Container className="py-[var(--section-y)]">
          <Reveal variant="fade-up" className="mb-10 max-w-3xl">
            <span className="lux-overline">Regions served</span>
            <h2 className="h-section mt-6">
              Wherever your <em className="em">venue is.</em>
            </h2>
            <p className="lede mt-6">{settings.geographicScope}</p>
          </Reveal>

          <ul className="flex flex-wrap gap-3">
            {REGIONS.map((r, i) => (
              <Reveal as="li" key={r} variant="fade-up" index={i}>
                <span
                  className="inline-flex items-center gap-2.5 rounded-full px-4 py-2.5"
                  style={{
                    background: "var(--lux-glass)",
                    border: "1px solid var(--lux-glass-border)",
                    backdropFilter: "blur(12px)",
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
                  <span className="text-sm font-bold">{r}</span>
                </span>
              </Reveal>
            ))}
          </ul>
        </Container>
      </section>
    </>
  );
}
