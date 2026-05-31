import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Container } from "@/components/marketing/Container";
import { PageHeader } from "@/components/marketing/PageHeader";
import {
  getProductCategoryBySlug,
  listProductsByCategory,
} from "@/lib/commerce";

type Params = { locale: string; category: string };

type Category = {
  id: string | number;
  name: string;
  slug: string;
  description?: string;
  kind?: string;
};

type Product = {
  id: string | number;
  name: string;
  slug: string;
  summary?: string;
  variants?: Array<{ basePrice?: number; currency?: string }>;
};

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { category, locale } = await params;
  const cat = (await getProductCategoryBySlug(
    category,
    locale,
  )) as unknown as Category | null;
  return {
    title: cat?.name ?? "Category",
    description: cat?.description,
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { category, locale } = await params;
  setRequestLocale(locale);
  const cat = (await getProductCategoryBySlug(
    category,
    locale,
  )) as unknown as Category | null;
  if (!cat) notFound();

  const products = (await listProductsByCategory(
    cat.id,
    locale,
  )) as unknown as Product[];

  return (
    <>
      <PageHeader eyebrow={cat.kind} title={cat.name} description={cat.description} />
      <Container className="py-16">
        {products.length === 0 ? (
          <p className="text-ink-muted">
            Products will appear here once added in the admin.
          </p>
        ) : (
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((p) => {
              const from = p.variants?.[0]?.basePrice;
              const ccy = p.variants?.[0]?.currency ?? "USD";
              return (
                <li key={p.id}>
                  <Link
                    href={`/shop/${cat.slug}/${p.slug}`}
                    className="block rounded-[var(--radius-md)] border border-[color:var(--brand-border)] p-5 transition hover:border-[color:var(--brand-primary)]"
                  >
                    <p className="font-display text-base font-extrabold text-ink">
                      {p.name}
                    </p>
                    {p.summary && (
                      <p className="mt-1 text-sm text-ink-muted">{p.summary}</p>
                    )}
                    {typeof from === "number" && (
                      <p className="mt-2 text-sm text-ink">
                        From{" "}
                        <span className="font-semibold">
                          {ccy} {from.toFixed(2)}
                        </span>
                      </p>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </Container>
    </>
  );
}
