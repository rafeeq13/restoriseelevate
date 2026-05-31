import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { Container } from "@/components/marketing/Container";
import { PageHeader } from "@/components/marketing/PageHeader";
import { getProductBySlug } from "@/lib/commerce";
import { ProductDetail } from "@/components/commerce/ProductDetail";

type Params = { locale: string; category: string; product: string };

type Product = {
  id: string | number;
  name: string;
  slug: string;
  summary?: string;
  longDescription?: unknown;
  images?: Array<{ image?: { url?: string; alt?: string } }>;
  options?: Array<{
    name: string;
    type: string;
    values: Array<{ label: string; value: string; surchargePercent?: number }>;
  }>;
  variants?: Array<{
    sku: string;
    basePrice: number;
    currency?: string;
    tieredPricing?: Array<{ minQuantity: number; unitPrice: number }>;
  }>;
  fulfillmentRules?: { leadTimeDays?: number };
  supportsCustomizer?: boolean;
};

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { product, locale } = await params;
  const doc = (await getProductBySlug(product, locale)) as unknown as Product | null;
  return {
    title: doc?.name ?? "Product",
    description: doc?.summary,
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { product, locale } = await params;
  setRequestLocale(locale);
  const doc = (await getProductBySlug(product, locale)) as unknown as Product | null;
  if (!doc) notFound();

  return (
    <>
      <PageHeader title={doc.name} description={doc.summary} />
      <Container className="py-12">
        <ProductDetail product={doc} />
      </Container>
    </>
  );
}
