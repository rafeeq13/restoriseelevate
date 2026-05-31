import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Container } from "@/components/marketing/Container";
import { PageHeader } from "@/components/marketing/PageHeader";
import { Reveal } from "@/components/marketing/Reveal";
import { listBlogPosts } from "@/lib/content";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Practical, hospitality-specific writing on marketing, operations, and growth.",
};

type Post = {
  id: string | number;
  title: string;
  slug: string;
  excerpt?: string;
  publishedAt?: string;
  readingTimeMinutes?: number;
  category?: { name?: string } | string;
  pinned?: boolean;
  featured?: boolean;
};

const CATEGORIES = [
  "All articles",
  "Paid media",
  "SEO",
  "Social & content",
  "Delivery platforms",
  "Operations",
  "Brand & creative",
] as const;

function getCategoryName(c: Post["category"]): string {
  if (!c) return "Article";
  if (typeof c === "string") return c;
  return c.name ?? "Article";
}

export default async function BlogPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const docs = (await listBlogPosts(locale)) as unknown as Post[];
  const posts = [...docs].sort((a, b) => {
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    return (b.publishedAt ?? "").localeCompare(a.publishedAt ?? "");
  });
  const featured = posts.find((p) => p.featured || p.pinned) ?? posts[0];
  const rest = featured ? posts.filter((p) => p.id !== featured.id) : posts;

  return (
    <>
      <PageHeader
        chapter="09"
        eyebrow="Journal"
        title="Field notes from a hospitality"
        accentWord="agency."
        description="Operator-focused writing on paid media, SEO, delivery platforms, and brand."
      />

      {/* ============================================================
          FEATURED SPOTLIGHT — cinematic article hero
          ============================================================ */}
      {featured && (
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
            <Reveal variant="fade-up">
              <Link
                href={`/blog/${featured.slug}`}
                className="group block"
              >
                <div
                  className="rounded-[var(--radius-2xl)] p-10 sm:p-14 lg:p-16 transition-all"
                  style={{
                    background:
                      "radial-gradient(ellipse 60% 50% at 0% 0%, rgba(255, 87, 87, 0.22), transparent 60%), radial-gradient(ellipse 60% 70% at 100% 100%, rgba(122, 0, 0, 0.45), transparent 60%), linear-gradient(160deg, var(--lux-obsidian) 0%, var(--lux-onyx) 60%, #1a0000 100%)",
                    border: "1px solid rgba(255, 87, 87, 0.28)",
                    boxShadow: "0 28px 80px -16px rgba(0, 0, 0, 0.6)",
                  }}
                >
                  <div className="flex flex-wrap items-center gap-3 text-[10px] font-bold uppercase tracking-[0.22em] text-[color:var(--lux-pearl-faint)]">
                    <span
                      className="inline-flex items-center gap-2 rounded-full px-3 py-1.5"
                      style={{
                        background: "var(--lux-grad-champagne-rose)",
                        color: "var(--ink-900)",
                      }}
                    >
                      Featured
                    </span>
                    <span className="text-[color:var(--lux-champagne)]">
                      {getCategoryName(featured.category)}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span>{featured.readingTimeMinutes ?? "—"} min read</span>
                  </div>

                  <p
                    className="mt-6 font-display max-w-4xl"
                    style={{
                      fontSize: "clamp(1.85rem, 3.6vw, 3rem)",
                      fontWeight: 800,
                      lineHeight: 1.05,
                      letterSpacing: "-0.022em",
                      color: "var(--lux-pearl)",
                    }}
                  >
                    {featured.title}
                  </p>

                  {featured.excerpt && (
                    <p className="lux-lede mt-6 max-w-3xl">{featured.excerpt}</p>
                  )}

                  <span className="mt-9 inline-flex items-center gap-2 text-sm font-bold text-[color:var(--lux-champagne)]">
                    Read the full article
                    <span className="arrow-shift" aria-hidden="true">→</span>
                  </span>
                </div>
              </Link>
            </Reveal>
          </Container>
        </section>
      )}

      {/* ============================================================
          CATEGORY FILTER PILLS
          ============================================================ */}
      <section className="border-t border-[color:var(--brand-border)] bg-[color:var(--brand-surface-paper)]">
        <Container className="pt-[clamp(3rem,6vw,5rem)] pb-6">
          <Reveal variant="fade-up">
            <p className="lux-overline mb-6">Browse by topic</p>
            <ul className="flex flex-wrap gap-3">
              {CATEGORIES.map((c, i) => (
                <li key={c}>
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
                    {c}
                  </span>
                </li>
              ))}
            </ul>
          </Reveal>
        </Container>
      </section>

      {/* ============================================================
          ARTICLE LIST — preserved editorial divider layout
          ============================================================ */}
      <section className="bg-[color:var(--brand-surface-paper)]">
        <Container className="py-[var(--section-y)]">
          {posts.length === 0 ? (
            <Reveal variant="fade-up" className="mx-auto max-w-xl border-l-2 border-[color:var(--brand-primary)] pl-6">
              <p className="h-section">
                Articles <em className="em">coming soon.</em>
              </p>
              <p className="lede mt-5">
                Articles will appear here once published in the admin.
              </p>
            </Reveal>
          ) : (
            <ul className="divide-y divide-[color:var(--brand-border)] border-y border-[color:var(--brand-border)]">
              {rest.map((p, i) => (
                <Reveal as="li" key={p.id} variant="fade-up" index={i}>
                  <Link
                    href={`/blog/${p.slug}`}
                    className="group grid gap-6 py-8 transition-colors hover:bg-[color:var(--brand-surface-cream)] sm:grid-cols-[1fr_2fr] sm:gap-12 hover:px-6"
                  >
                    <div className="flex flex-wrap items-center gap-4 text-[10px] font-semibold uppercase tracking-[0.18em] text-ink-faint">
                      <span className="text-[color:var(--brand-primary)]">
                        {getCategoryName(p.category)}
                      </span>
                      <span aria-hidden="true" className="inline-block h-px w-4 bg-[color:var(--brand-border-strong)]" />
                      <span>{p.readingTimeMinutes ?? "—"} min read</span>
                      {p.pinned && (
                        <>
                          <span aria-hidden="true" className="inline-block h-px w-4 bg-[color:var(--brand-border-strong)]" />
                          <span className="text-[color:var(--brand-warm-deep)]">Pinned</span>
                        </>
                      )}
                    </div>
                    <div>
                      <p className="h-section group-hover:text-[color:var(--brand-primary)] transition-colors">
                        {p.title}
                      </p>
                      {p.excerpt && (
                        <p className="lede mt-3">{p.excerpt}</p>
                      )}
                      <span className="link-edit mt-5 inline-flex">
                        Read article
                        <span className="arrow-shift" aria-hidden="true">→</span>
                      </span>
                    </div>
                  </Link>
                </Reveal>
              ))}
            </ul>
          )}
        </Container>
      </section>

      {/* ============================================================
          NEWSLETTER CARD — premium glass capture
          ============================================================ */}
      <section className="border-t border-[color:var(--brand-border)] bg-[color:var(--brand-surface)]">
        <Container className="py-[var(--section-y)]">
          <Reveal variant="fade-up">
            <div
              className="rounded-[var(--radius-2xl)] p-10 sm:p-14"
              style={{
                background:
                  "radial-gradient(ellipse 50% 50% at 50% 0%, rgba(255, 87, 87, 0.30), transparent 60%), radial-gradient(ellipse 60% 60% at 50% 100%, rgba(122, 0, 0, 0.40), transparent 60%), linear-gradient(160deg, var(--lux-obsidian) 0%, var(--lux-onyx) 60%, #1a0000 100%)",
                border: "1px solid rgba(255, 87, 87, 0.30)",
                boxShadow: "0 28px 70px -16px rgba(0, 0, 0, 0.55)",
              }}
            >
              <div className="grid gap-10 lg:grid-cols-[1.3fr_1fr] lg:items-center">
                <div>
                  <span className="lux-overline">The dispatch</span>
                  <h2 className="lux-section-title mt-6 max-w-2xl">
                    Operator-grade tactics, <em>in your inbox.</em>
                  </h2>
                  <p className="lux-lede mt-6 max-w-xl">
                    Occasional dispatches with what&rsquo;s actually moving
                    the needle for hospitality brands — no fluff, no
                    growth-hacks, no spam. Unsubscribe anytime.
                  </p>
                </div>
                <form className="flex flex-col gap-3 sm:flex-row sm:items-stretch">
                  <label className="sr-only" htmlFor="newsletter-email">
                    Email address
                  </label>
                  <input
                    id="newsletter-email"
                    type="email"
                    required
                    placeholder="venue@example.com"
                    className="flex-1 rounded-full px-5 py-3.5 text-sm font-medium outline-none transition-all"
                    style={{
                      background: "rgba(246, 236, 214, 0.06)",
                      border: "1px solid var(--lux-line-strong)",
                      color: "var(--lux-pearl)",
                    }}
                  />
                  <button
                    type="submit"
                    className="lux-btn lux-btn--primary group whitespace-nowrap"
                  >
                    Subscribe
                    <span className="arrow-shift" aria-hidden="true">→</span>
                  </button>
                </form>
              </div>
            </div>
          </Reveal>
        </Container>
      </section>
    </>
  );
}
