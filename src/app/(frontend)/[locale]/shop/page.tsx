import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Container } from "@/components/marketing/Container";
import { PageHeader } from "@/components/marketing/PageHeader";
import { listProductCategories } from "@/lib/commerce";

export const metadata: Metadata = {
  title: "Shop",
  description:
    "Hospitality-grade print products and digital design services. Menus, business cards, packaging, branding kits, and more.",
};

type Category = {
  id: string | number;
  name: string;
  slug: string;
  kind?: string;
  description?: string;
};

export default async function ShopPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const cats = (await listProductCategories(locale)) as unknown as Category[];

  return (
    <>
      <PageHeader
        eyebrow="Shop"
        title="Print and design built for hospitality."
        description="Order menus, business cards, packaging, signage, and full branding kits. Fulfilled by global print-on-demand partners + our Lahore supplier for bespoke work."
      />
      <Container className="py-16">
        {cats.length === 0 ? (
          <div className="rounded-[var(--radius-md)] border border-[color:var(--brand-border)] p-8 text-ink-muted">
            The catalog will populate here once categories are added in the
            admin. Phase 2 launch will publish menus, business cards,
            packaging, design services, and bespoke quote workflows.
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {cats.map((c) => (
              <Link
                key={c.id}
                href={`/shop/${c.slug}`}
                className="block rounded-[var(--radius-md)] border border-[color:var(--brand-border)] p-6 transition hover:border-[color:var(--brand-primary)]"
              >
                <p className="text-xs font-medium uppercase tracking-[0.18em] text-ink-muted">
                  {c.kind ?? "Category"}
                </p>
                <p className="mt-2 font-display text-lg font-extrabold text-ink">
                  {c.name}
                </p>
                {c.description && (
                  <p className="mt-2 text-sm text-ink-muted">{c.description}</p>
                )}
              </Link>
            ))}
          </div>
        )}
      </Container>
    </>
  );
}
