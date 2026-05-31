import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { Container } from "@/components/marketing/Container";
import { PageHeader } from "@/components/marketing/PageHeader";

export const metadata: Metadata = {
  title: "Cookie Policy",
  description:
    "Cookies and similar technologies used on the Restorise Business Solutions website, organised by purpose.",
};

export default async function CookiePolicyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <>
      <PageHeader
        eyebrow="Legal"
        title="Cookie Policy"
        description="A plain-language explanation of each cookie category we use and how to control them."
        compact
      />
      <section className="bg-[color:var(--brand-surface)]">
        <Container className="py-[var(--section-y)]" width="narrow">
          <article className="prose-page">
            <p>
              We group cookies and similar technologies into four categories. You
              can change your preferences at any time using the{" "}
              <button type="button" data-action="open-cookie-preferences">
                Cookie preferences
              </button>{" "}
              button.
            </p>
            <h2>Strictly necessary</h2>
            <p>
              Required for the site to function — for example, remembering your
              cookie consent choice. These cannot be disabled.
            </p>
            <h2>Analytics</h2>
            <p>
              Used to understand how visitors use the site (e.g. Google
              Analytics 4). Loaded only with your consent.
            </p>
            <h2>Marketing</h2>
            <p>
              Used to measure and personalise advertising (e.g. Meta Pixel,
              TikTok Pixel, Google Ads). Loaded only with your consent.
            </p>
            <h2>Functional</h2>
            <p>
              Enhance the site beyond core function — for example, embedded
              media and live chat. Loaded only with your consent.
            </p>
          </article>
        </Container>
      </section>
    </>
  );
}
