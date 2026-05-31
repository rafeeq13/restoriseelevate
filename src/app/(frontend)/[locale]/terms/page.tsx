import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { Container } from "@/components/marketing/Container";
import { PageHeader } from "@/components/marketing/PageHeader";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "Terms governing the use of the Restorise Business Solutions website and services.",
};

export default async function TermsPage({
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
        title="Terms of Service"
        description="The terms below govern your use of this website and any services we provide."
        compact
      />
      <section className="bg-[color:var(--brand-surface)]">
        <Container className="py-[var(--section-y)]" width="narrow">
          <article className="prose-page">
            <p>
              The final terms will be drafted by the agency and replace this
              placeholder before launch.
            </p>
          </article>
        </Container>
      </section>
    </>
  );
}
