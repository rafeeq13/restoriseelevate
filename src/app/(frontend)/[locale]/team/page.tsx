import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { Container } from "@/components/marketing/Container";
import { PageHeader } from "@/components/marketing/PageHeader";
import { Button } from "@/components/marketing/Button";
import { Reveal } from "@/components/marketing/Reveal";
import { FinalCTA } from "@/components/marketing/FinalCTA";
import { listTeamMembers } from "@/lib/content";

export const metadata: Metadata = {
  title: "Team",
  description: "The people behind Restorise Business Solutions.",
};

type Member = {
  id: string | number;
  name: string;
  role: string;
  bio?: string;
  photo?: { url?: string; alt?: string } | string;
};

const DISCIPLINES = [
  { name: "Paid media", count: 4, desc: "Meta, Google, Performance Max, YouTube" },
  { name: "Organic search", count: 3, desc: "Technical, local, content, link" },
  { name: "Social & content", count: 5, desc: "Strategy, production, community" },
  { name: "Creative", count: 4, desc: "Identity, menu, photography, video" },
  { name: "Software", count: 3, desc: "Web, mobile, ordering systems" },
  { name: "Operations", count: 3, desc: "POS, aggregators, menu R&D" },
];

const CULTURE_POINTS = [
  {
    title: "Senior-led, end to end",
    body: "The strategist you meet on day one is the same strategist who reviews your numbers at the quarterly. No junior hand-offs.",
  },
  {
    title: "Specialist over generalist",
    body: "Every brief is staffed with people who&rsquo;ve done that exact thing for hospitality before — not just for any sector.",
  },
  {
    title: "Calm cadence",
    body: "Standups, reviews, and async writing instead of fire-drill Slack. We protect deep work because that&rsquo;s where the leverage is.",
  },
  {
    title: "Operator-grade pricing",
    body: "We tune our economics for independent venues. We win when you win — proven by retention, not by a slide deck.",
  },
];

export default async function TeamPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const members = (await listTeamMembers(locale)) as unknown as Member[];

  return (
    <>
      <PageHeader
        chapter="07"
        eyebrow="Team"
        title="The people behind the"
        accentWord="work."
        description="Specialists across paid media, organic search, social, creative, software, and hospitality operations."
      />

      {/* ============================================================
          DISCIPLINES STRIP — 6 specialist practices with counts
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
            <span className="lux-overline">Specialist practices</span>
            <h2 className="lux-section-title mt-6">
              Six interlocking <em>disciplines.</em>
            </h2>
            <p className="lux-lede mt-6">
              We staff briefs with people who have done the exact thing for
              hospitality before — not just for any sector.
            </p>
          </Reveal>

          <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {DISCIPLINES.map((d, i) => (
              <Reveal as="li" key={d.name} variant="fade-up" index={i}>
                <div className="lux-glass h-full p-7">
                  <div className="flex items-start justify-between gap-3">
                    <p
                      className="font-display text-xl"
                      style={{ fontWeight: 700, color: "var(--lux-pearl)" }}
                    >
                      {d.name}
                    </p>
                    <span
                      className="font-display italic text-xl"
                      style={{
                        background: "var(--lux-grad-champagne-rose)",
                        WebkitBackgroundClip: "text",
                        backgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                      }}
                    >
                      {d.count}
                    </span>
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-[color:var(--lux-pearl-soft)]">
                    {d.desc}
                  </p>
                </div>
              </Reveal>
            ))}
          </ul>
        </Container>
      </section>

      {/* ============================================================
          TEAM GRID — existing layout, dark luxe
          ============================================================ */}
      <section className="border-t border-[color:var(--brand-border)] bg-[color:var(--brand-surface-paper)]">
        <Container className="py-[var(--section-y)]">
          <Reveal variant="fade-up" className="mb-12 max-w-3xl">
            <span className="chapter">02</span>
            <p className="eyebrow mt-3">The people</p>
            <h2 className="h-section mt-6">
              Faces you&rsquo;ll <em className="em">actually meet.</em>
            </h2>
          </Reveal>

          {members.length === 0 ? (
            <Reveal variant="fade-up" className="mx-auto max-w-xl border-l-2 border-[color:var(--brand-primary)] pl-6">
              <p className="h-section">
                Profiles <em className="em">coming soon.</em>
              </p>
              <p className="lede mt-5">
                Specialist profiles will be published here once added in the
                admin.
              </p>
            </Reveal>
          ) : (
            <ul className="grid gap-y-14 gap-x-8 sm:grid-cols-2 lg:grid-cols-3">
              {members.map((m, i) => {
                const photoUrl =
                  typeof m.photo === "string"
                    ? m.photo
                    : (m.photo as { url?: string } | undefined)?.url;
                return (
                  <Reveal as="li" key={m.id} variant="fade-up" index={i}>
                    <article>
                      <div className="photo-frame aspect-[4/5]">
                        {photoUrl && (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={photoUrl} alt={m.name} className="absolute inset-0 h-full w-full object-cover" />
                        )}
                        <p className="photo-frame__caption">
                          {String(i + 1).padStart(2, "0")}
                        </p>
                      </div>
                      <p className="font-serif italic mt-6 text-2xl text-ink">
                        {m.name}
                      </p>
                      <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[color:var(--brand-primary)]">
                        {m.role}
                      </p>
                      {m.bio && (
                        <p className="mt-3 text-sm leading-relaxed text-ink-muted">{m.bio}</p>
                      )}
                    </article>
                  </Reveal>
                );
              })}
            </ul>
          )}
        </Container>
      </section>

      {/* ============================================================
          CULTURE / WAY OF WORKING — 4 principles
          ============================================================ */}
      <section className="border-t border-[color:var(--brand-border)] bg-[color:var(--brand-surface)]">
        <Container className="py-[var(--section-y)]">
          <Reveal variant="fade-up" className="mb-12 max-w-3xl">
            <span className="chapter">03</span>
            <p className="eyebrow mt-3">How we work</p>
            <h2 className="h-section mt-6">
              Four things you can <em className="em">count on.</em>
            </h2>
          </Reveal>

          <ul className="grid gap-5 sm:grid-cols-2">
            {CULTURE_POINTS.map((c, i) => (
              <Reveal as="li" key={c.title} variant="fade-up" index={i}>
                <article className="glow-card h-full">
                  <div className="flex items-start gap-4">
                    <span
                      aria-hidden="true"
                      className="mt-1.5 inline-block h-2 w-2 flex-shrink-0 rounded-full"
                      style={{
                        background: "var(--lux-grad-champagne-rose)",
                        boxShadow: "0 0 10px rgba(255, 87, 87, 0.7)",
                      }}
                    />
                    <div>
                      <p className="h-sub">{c.title}</p>
                      <p
                        className="mt-3 text-sm leading-relaxed text-ink-muted"
                        dangerouslySetInnerHTML={{ __html: c.body }}
                      />
                    </div>
                  </div>
                </article>
              </Reveal>
            ))}
          </ul>

          {/* Join us mini-card */}
          <Reveal variant="fade-up" delay={400} className="mt-14">
            <div
              className="rounded-[var(--radius-2xl)] p-10 sm:p-12"
              style={{
                background:
                  "radial-gradient(ellipse 50% 50% at 0% 0%, rgba(255, 87, 87, 0.20), transparent 60%), radial-gradient(ellipse 60% 60% at 100% 100%, rgba(122, 0, 0, 0.35), transparent 60%), linear-gradient(160deg, var(--lux-obsidian) 0%, var(--lux-onyx) 60%, #1a0000 100%)",
                border: "1px solid rgba(255, 87, 87, 0.25)",
                boxShadow: "0 24px 60px -16px rgba(0, 0, 0, 0.5)",
              }}
            >
              <div className="grid gap-8 lg:grid-cols-[1.2fr_auto] lg:items-center">
                <div>
                  <span className="lux-overline">Hiring</span>
                  <h3 className="lux-section-title mt-5 max-w-2xl">
                    Senior in hospitality? <em>Let&rsquo;s talk.</em>
                  </h3>
                  <p className="lux-lede mt-5 max-w-xl">
                    We&rsquo;re always reading applications from strategists,
                    creators, developers, and operators who&rsquo;ve done the
                    work for restaurants and hotels before.
                  </p>
                </div>
                <Button as="link" href="/contact" size="lg">
                  Introduce yourself
                  <span className="arrow-shift" aria-hidden="true">→</span>
                </Button>
              </div>
            </div>
          </Reveal>
        </Container>
      </section>

      <FinalCTA
        eyebrow="Senior-led, end to end"
        title="Talk to the people who'll"
        accentWord="do the work."
        primaryLabel="Book an intro call"
      />
    </>
  );
}
