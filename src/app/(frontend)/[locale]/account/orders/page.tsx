import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { Container } from "@/components/marketing/Container";
import { PageHeader } from "@/components/marketing/PageHeader";
import { Link } from "@/i18n/navigation";
import { getCurrentCustomer } from "@/lib/auth";
import { getPayloadSafe } from "@/lib/payload";

export const metadata: Metadata = {
  title: "Your orders",
  robots: { index: false, follow: false },
};

type Order = {
  id: string | number;
  orderNumber: string;
  status: string;
  currency?: string;
  totalAmount?: number;
  createdAt: string;
  fulfillment?: { trackingUrl?: string; trackingNumber?: string };
};

export default async function OrdersPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const customer = await getCurrentCustomer();
  if (!customer) redirect(`/${locale}/sign-in`);

  let orders: Order[] = [];
  const payload = await getPayloadSafe();
  if (payload) {
    try {
      const res = await payload.find({
        collection: "orders",
        where: { customer: { equals: customer.id } },
        sort: "-createdAt",
        limit: 50,
        depth: 1,
      });
      orders = res.docs as unknown as Order[];
    } catch {
      orders = [];
    }
  }

  return (
    <>
      <PageHeader eyebrow="Account" title="Your orders" />
      <Container className="py-16">
        {orders.length === 0 ? (
          <div className="rounded-[var(--radius-md)] border border-[color:var(--brand-border)] p-8 text-ink-muted">
            You don&apos;t have any orders yet.{" "}
            <Link
              href="/shop"
              className="underline underline-offset-4 text-ink"
            >
              Browse the catalog
            </Link>
            .
          </div>
        ) : (
          <ul className="divide-y divide-[color:var(--brand-border)] rounded-[var(--radius-md)] border border-[color:var(--brand-border)]">
            {orders.map((o) => (
              <li key={o.id} className="p-5">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <p className="font-display text-base font-extrabold text-ink">
                      {o.orderNumber}
                    </p>
                    <p className="mt-1 text-xs text-ink-muted">
                      {new Date(o.createdAt).toLocaleDateString()} · {o.status}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-ink">
                      {o.currency ?? "USD"} {Number(o.totalAmount ?? 0).toFixed(2)}
                    </p>
                    {o.fulfillment?.trackingUrl ? (
                      <a
                        href={o.fulfillment.trackingUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-ink underline underline-offset-2"
                      >
                        Track shipment
                      </a>
                    ) : null}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Container>
    </>
  );
}
