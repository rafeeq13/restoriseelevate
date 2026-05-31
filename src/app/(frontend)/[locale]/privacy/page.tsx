import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { Container } from "@/components/marketing/Container";
import { PageHeader } from "@/components/marketing/PageHeader";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How Restorise Business Solutions collects, processes, retains, and protects your personal data, including rights under the GDPR.",
  robots: { index: true, follow: true },
};

export default async function PrivacyPage({
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
        title="Privacy Policy"
        description="Effective from launch. This document explains how we handle the personal data we collect through this website."
        compact
      />
      <section className="bg-[color:var(--brand-surface)]">
        <Container className="py-[var(--section-y)]" width="narrow">
          <article className="prose-page">
            <p>
              The final policy will be drafted by the agency and replace this
              placeholder before launch. It will cover: data we collect and why,
              lawful bases under the GDPR, retention periods, processors we use,
              transfers, your rights (access, rectification, erasure, restriction,
              portability, objection), how to file a complaint, and our DPO /
              point-of-contact route.
            </p>
            <h2>Data subject requests</h2>
            <p>
              Send requests to{" "}
              <a href="mailto:contact.restorise@gmail.com">contact.restorise@gmail.com</a>{" "}
              with the subject line &ldquo;Data Subject Request&rdquo;.
            </p>
          </article>
        </Container>
      </section>
    </>
  );
}
