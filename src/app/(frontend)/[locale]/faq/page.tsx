import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { Container } from "@/components/marketing/Container";
import { PageHeader } from "@/components/marketing/PageHeader";
import { Reveal } from "@/components/marketing/Reveal";
import { FinalCTA } from "@/components/marketing/FinalCTA";
import { listFAQ } from "@/lib/content";

export const metadata: Metadata = {
  title: "FAQ",
  description:
    "Frequently asked questions about working with Restorise Business Solutions.",
};

type Category = { id: string | number; name: string; slug?: string };
type Item = {
  id: string | number;
  question: string;
  answer?: unknown;
  category: { id?: string | number } | string | number;
};

export default async function FAQPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const { categories, items } = await listFAQ(locale);
  const cats = categories as unknown as Category[];
  const its = items as unknown as Item[];

  const grouped = cats.map((c) => ({
    category: c,
    items: its.filter((i) => {
      const cid =
        typeof i.category === "object"
          ? (i.category as { id?: string | number }).id
          : i.category;
      return cid === c.id;
    }),
  }));

  const faqSchema = its.length
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: its.map((i) => ({
          "@type": "Question",
          name: i.question,
          acceptedAnswer: {
            "@type": "Answer",
            text:
              typeof i.answer === "string"
                ? i.answer
                : "See the website for the full answer.",
          },
        })),
      }
    : null;

  return (
    <>
      <PageHeader
        chapter="08"
        eyebrow="FAQ"
        title="Frequently asked"
        accentWord="questions."
        description="Straight answers about scope, pricing, timelines, and how we work."
      />

      {/* ============================================================
          QUICK-LINK CATEGORY STRIP — anchor jumps + question counts
          ============================================================ */}
      {grouped.length > 0 && (
        <section
          className="relative overflow-hidden"
          style={{ background: "var(--lux-onyx)" }}
        >
          <div
            aria-hidden="true"
            className="absolute inset-0"
            style={{ background: "var(--lux-grad-aurora-soft)", opacity: 0.5 }}
          />
          <Container className="relative z-10 py-[var(--section-y)]">
            <Reveal variant="fade-up" className="mb-12 max-w-3xl">
              <span className="lux-overline">Jump to a category</span>
              <h2 className="lux-section-title mt-6">
                Browse {its.length}{" "}
                <em>
                  {its.length === 1 ? "question" : "questions"}
                </em>{" "}
                in {grouped.length}{" "}
                {grouped.length === 1 ? "category" : "categories"}.
              </h2>
            </Reveal>

            <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {grouped.map((g, i) => (
                <Reveal as="li" key={g.category.id} variant="fade-up" index={i}>
                  <a
                    href={`#faq-${g.category.id}`}
                    className="lux-glass group block h-full p-6"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <span
                        className="font-display italic text-base"
                        style={{
                          background: "var(--lux-grad-champagne-rose)",
                          WebkitBackgroundClip: "text",
                          backgroundClip: "text",
                          WebkitTextFillColor: "transparent",
                        }}
                      >
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span
                        className="rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.18em]"
                        style={{
                          background: "rgba(246, 236, 214, 0.06)",
                          border: "1px solid var(--lux-line)",
                          color: "var(--lux-pearl-soft)",
                        }}
                      >
                        {g.items.length}{" "}
                        {g.items.length === 1 ? "Q" : "Qs"}
                      </span>
                    </div>
                    <p
                      className="mt-5 font-display"
                      style={{
                        fontSize: "1.2rem",
                        fontWeight: 700,
                        lineHeight: 1.24,
                        color: "var(--lux-pearl)",
                      }}
                    >
                      {g.category.name}
                    </p>
                    <span className="mt-5 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-[color:var(--lux-pearl-faint)] group-hover:text-[color:var(--lux-champagne)] transition-colors">
                      Browse questions
                      <span className="arrow-shift" aria-hidden="true">↓</span>
                    </span>
                  </a>
                </Reveal>
              ))}
            </ul>
          </Container>
        </section>
      )}

      {/* ============================================================
          QUESTION GROUPS — accordion within category
          ============================================================ */}
      <section className="border-t border-[color:var(--brand-border)] bg-[color:var(--brand-surface-paper)]">
        <Container className="py-[var(--section-y)] space-y-20">
          {grouped.length === 0 ? (
            <Reveal variant="fade-up" className="mx-auto max-w-xl border-l-2 border-[color:var(--brand-primary)] pl-6">
              <p className="h-section">
                Questions <em className="em">coming soon.</em>
              </p>
              <p className="lede mt-5">
                Questions and answers will appear here once added in the admin.
              </p>
            </Reveal>
          ) : (
            grouped.map(({ category, items: cItems }, gi) => (
              <Reveal key={category.id} variant="fade-up">
                <article
                  id={`faq-${category.id}`}
                  className="chapter-rule scroll-mt-32"
                >
                  <div className="grid gap-10 lg:grid-cols-[1fr_2fr]">
                    <div>
                      <span className="chapter">{String(gi + 1).padStart(2, "0")}</span>
                      <h2 className="h-section mt-4 max-w-[16ch]">
                        {category.name}
                      </h2>
                    </div>
                    <ul
                      className="rounded-[var(--radius-xl)]"
                      style={{
                        background: "var(--lux-glass)",
                        border: "1px solid var(--lux-glass-border)",
                        backdropFilter: "blur(14px)",
                      }}
                    >
                      {cItems.map((i, ii) => (
                        <li
                          key={i.id}
                          style={{
                            borderTop:
                              ii === 0 ? "none" : "1px solid var(--lux-line)",
                          }}
                        >
                          <details className="group/det">
                            <summary className="flex cursor-pointer list-none items-start justify-between gap-6 px-6 py-6 transition-colors hover:bg-[color:var(--lux-glass-strong)]">
                              <span
                                className="font-display text-xl transition-colors group-open/det:text-[color:var(--lux-champagne)]"
                                style={{
                                  fontWeight: 700,
                                  color: "var(--lux-pearl)",
                                }}
                              >
                                {i.question}
                              </span>
                              <span
                                aria-hidden="true"
                                className="font-display italic text-2xl mt-0.5 transition-transform group-open/det:rotate-45 flex-shrink-0"
                                style={{ color: "var(--lux-champagne)" }}
                              >
                                +
                              </span>
                            </summary>
                            <div
                              className="px-6 pb-6 text-base leading-relaxed"
                              style={{ color: "var(--lux-pearl-soft)" }}
                            >
                              Answer renders here from the CMS.
                            </div>
                          </details>
                        </li>
                      ))}
                    </ul>
                  </div>
                </article>
              </Reveal>
            ))
          )}
        </Container>
      </section>

      <FinalCTA
        eyebrow="Didn't see your question?"
        title="Just ask"
        accentWord="us."
        description="We respond to every enquiry with a real human within one working day."
        primaryLabel="Send your question"
      />

      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}
    </>
  );
}
