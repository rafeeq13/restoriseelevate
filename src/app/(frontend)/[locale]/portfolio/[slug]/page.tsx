import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { Container } from "@/components/marketing/Container";
import { PageHeader } from "@/components/marketing/PageHeader";
import { Reveal } from "@/components/marketing/Reveal";
import { FinalCTA } from "@/components/marketing/FinalCTA";
import { getPortfolioBySlug } from "@/lib/content";

type Params = { locale: string; slug: string };

type Item = {
  title?: string;
  client?: string;
  industry?: string;
  country?: string;
  summary?: string;
  outcomes?: Array<{ metric: string; value: string; context?: string }>;
};

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug, locale } = await params;
  const doc = (await getPortfolioBySlug(slug, locale)) as unknown as Item | null;
  return {
    title: doc?.title ?? "Case study",
    description: doc?.summary,
  };
}

export default async function PortfolioDetailPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug, locale } = await params;
  setRequestLocale(locale);
  const doc = (await getPortfolioBySlug(slug, locale)) as unknown as Item | null;
  if (!doc) notFound();

  return (
    <>
      <PageHeader
        eyebrow={`${doc.industry ?? "Case study"}${doc.country ? ` · ${doc.country}` : ""}`}
        title={doc.title ?? "Case study"}
        description={doc.summary}
      />

      <section className="border-t border-[color:var(--brand-border)] bg-[color:var(--brand-surface-paper)]">
        <Container className="py-[var(--section-y)] grid gap-12 lg:grid-cols-[1.6fr_1fr]">
          <Reveal variant="fade-up">
            <div className="photo-frame aspect-[16/9] mb-10" />
            <article className="drop-cap">
              <p className="lede">
                Full narrative will render here from the CMS — rich text,
                gallery, embedded testimonials.
              </p>
            </article>
          </Reveal>

          <Reveal variant="fade-up" delay={150} className="lg:sticky lg:top-28 lg:self-start">
            <aside className="border-t border-[color:var(--brand-primary)] pt-6">
              <span className="chapter">99</span>
              <p className="eyebrow mt-3">Outcomes</p>
              {doc.outcomes?.length ? (
                <ul className="mt-8 space-y-7">
                  {doc.outcomes.map((o, i) => (
                    <li key={i} className={i > 0 ? "border-t border-[color:var(--brand-border)] pt-7" : ""}>
                      <p className="font-serif italic text-5xl text-[color:var(--brand-primary)]">{o.value}</p>
                      <p className="mt-2 text-sm font-semibold text-ink">{o.metric}</p>
                      {o.context && (
                        <p className="mt-1 text-xs leading-relaxed text-ink-muted">{o.context}</p>
                      )}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-6 text-sm text-ink-muted">
                  Outcomes will be listed here once published.
                </p>
              )}
            </aside>
          </Reveal>
        </Container>
      </section>

      <FinalCTA
        eyebrow="Inspired?"
        title="Let's plan"
        accentWord="yours."
      />
    </>
  );
}
