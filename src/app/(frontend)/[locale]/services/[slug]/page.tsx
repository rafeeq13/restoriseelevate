import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import type { SerializedEditorState } from "@payloadcms/richtext-lexical/lexical";
import { Container } from "@/components/marketing/Container";
import { PageHeader } from "@/components/marketing/PageHeader";
import { Button } from "@/components/marketing/Button";
import { LexicalContent } from "@/components/marketing/LexicalContent";
import { Reveal } from "@/components/marketing/Reveal";
import { FinalCTA } from "@/components/marketing/FinalCTA";
import { getServiceBySlug } from "@/lib/content";

type Params = { locale: string; slug: string };

const FALLBACK_BY_SLUG: Record<string, { name: string; summary: string }> = {
  "meta-ads": {
    name: "Meta Ads",
    summary:
      "Paid advertising campaigns on Facebook and Instagram. Setup, creative, audience research, conversion tracking, and ongoing optimisation.",
  },
  "google-ads": {
    name: "Google Ads",
    summary:
      "Paid search, display, Performance Max, and YouTube. Keyword research, ad copy, landing-page guidance, bid strategy, and ROAS optimisation.",
  },
  seo: {
    name: "SEO",
    summary:
      "Technical SEO, on-page optimisation, local SEO for hospitality, content strategy, link acquisition, schema, and Google Business Profile management.",
  },
  "social-media": {
    name: "Social Media Management",
    summary:
      "Strategy, planning, scheduling, community management, and reporting across Instagram, Facebook, TikTok, and other platforms.",
  },
  "video-editing": {
    name: "Video Editing",
    summary:
      "Short-form video for social, food ads, recipe content, and brand storytelling — colour, captions, motion graphics, format optimisation.",
  },
  "graphics-design": {
    name: "Graphics Design",
    summary:
      "Brand identity, menus, packaging, social graphics, advertising creatives, and full visual identity systems.",
  },
  "web-development": {
    name: "Web Development",
    summary:
      "Marketing sites, brochure sites, and online ordering systems for restaurants and takeaways.",
  },
  "mobile-apps": {
    name: "Mobile Application Development",
    summary:
      "Native and cross-platform mobile apps — ordering, loyalty, and customer engagement.",
  },
  "pos-setup": {
    name: "POS Setup",
    summary:
      "POS selection, configuration, delivery + payment integration, inventory management, staff training, and ongoing support.",
  },
  "delivery-platforms": {
    name: "Delivery Platform Setup",
    summary:
      "End-to-end account setup on UberEats, Deliveroo, Just Eat, Grubhub, foodpanda, and regional aggregators.",
  },
  "menu-management": {
    name: "Menu Management on Delivery Apps",
    summary:
      "Ongoing management of restaurant presence on delivery aggregators — menu engineering, pricing, photography, promos, reporting.",
  },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug, locale } = await params;
  const doc = await getServiceBySlug(slug, locale);
  const fallback = FALLBACK_BY_SLUG[slug];
  const name =
    (doc as unknown as { name?: string })?.name ?? fallback?.name ?? "Service";
  return {
    title: name,
    description:
      (doc as unknown as { summary?: string })?.summary ?? fallback?.summary,
  };
}

export default async function ServicePage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug, locale } = await params;
  setRequestLocale(locale);
  const doc = (await getServiceBySlug(slug, locale)) as
    | {
        name?: string;
        tagline?: string;
        summary?: string;
        body?: SerializedEditorState | null;
      }
    | null;
  const fallback = FALLBACK_BY_SLUG[slug];
  if (!doc && !fallback) notFound();

  const name = doc?.name ?? fallback?.name ?? "Service";
  const summary = doc?.summary ?? fallback?.summary;

  return (
    <>
      <PageHeader
        eyebrow="Service"
        title={name}
        description={doc?.tagline ?? summary}
      />

      <section className="border-t border-[color:var(--brand-border)] bg-[color:var(--brand-surface-paper)]">
        <Container className="py-[var(--section-y)] grid gap-12 lg:grid-cols-[1.6fr_1fr]">
          <Reveal variant="fade-up">
            <article className="drop-cap">
              {doc?.body ? (
                <LexicalContent data={doc.body} />
              ) : (
                <>
                  <p className="lede">
                    {summary ??
                      "Detailed service copy will be published shortly. In the meantime, get in touch and we'll send a tailored scope and pricing."}
                  </p>
                  <p className="lede mt-5">
                    This page will be populated from the CMS — the agency will
                    publish a tailored narrative, package options, case
                    studies, and a service-specific lead capture funnel.
                  </p>
                </>
              )}
            </article>
          </Reveal>

          <Reveal variant="fade-up" delay={150} className="lg:sticky lg:top-28 lg:self-start">
            <aside className="border-t border-[color:var(--brand-primary)] pt-6">
              <span className="chapter">99</span>
              <p className="eyebrow mt-3">Next step</p>
              <p className="h-section mt-5">
                Get a tailored proposal in <em className="em">one working day.</em>
              </p>
              <p className="lede mt-5 text-base">
                Tell us about your venue and current goals — we&apos;ll come
                back with scope, pricing, and a clear next step.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Button as="link" href="/contact" size="md">
                  Start a project
                  <span className="arrow-shift" aria-hidden="true">→</span>
                </Button>
                <Button as="link" href="/services" variant="ghost" size="md">
                  All services
                </Button>
              </div>
            </aside>
          </Reveal>
        </Container>
      </section>

      <FinalCTA
        eyebrow="Have a venue?"
        title="Let's grow it"
        accentWord="together."
      />
    </>
  );
}
