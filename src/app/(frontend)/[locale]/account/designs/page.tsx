import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { Container } from "@/components/marketing/Container";
import { PageHeader } from "@/components/marketing/PageHeader";
import { getCurrentCustomer } from "@/lib/auth";
import { getPayloadSafe } from "@/lib/payload";

export const metadata: Metadata = {
  title: "Designs",
  robots: { index: false, follow: false },
};

type DesignProject = {
  id: string | number;
  title: string;
  status: string;
  updatedAt: string;
};

export default async function DesignsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const customer = await getCurrentCustomer();
  if (!customer) redirect(`/${locale}/sign-in`);

  let projects: DesignProject[] = [];
  const payload = await getPayloadSafe();
  if (payload) {
    try {
      const res = await payload.find({
        collection: "design-projects",
        where: { customer: { equals: customer.id } },
        sort: "-updatedAt",
        limit: 50,
      });
      projects = res.docs as unknown as DesignProject[];
    } catch {
      projects = [];
    }
  }

  return (
    <>
      <PageHeader
        eyebrow="Account"
        title="Designs"
        description="In-progress and approved design projects with our team."
      />
      <Container className="py-16">
        {projects.length === 0 ? (
          <p className="text-ink-muted">
            No design projects yet. They&apos;ll appear here once you order a
            design service.
          </p>
        ) : (
          <ul className="grid gap-4 sm:grid-cols-2">
            {projects.map((p) => (
              <li
                key={p.id}
                className="rounded-[var(--radius-md)] border border-[color:var(--brand-border)] p-5"
              >
                <p className="font-display text-base font-extrabold text-ink">
                  {p.title}
                </p>
                <p className="mt-1 text-xs text-ink-muted">
                  Status: {p.status} ·{" "}
                  {new Date(p.updatedAt).toLocaleDateString()}
                </p>
              </li>
            ))}
          </ul>
        )}
      </Container>
    </>
  );
}
