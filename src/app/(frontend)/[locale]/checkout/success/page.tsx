import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { Container } from "@/components/marketing/Container";
import { PageHeader } from "@/components/marketing/PageHeader";
import { Button } from "@/components/marketing/Button";

export const metadata: Metadata = {
  title: "Order received",
  robots: { index: false, follow: false },
};

export default async function CheckoutSuccessPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ order?: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const { order } = await searchParams;

  return (
    <>
      <PageHeader
        eyebrow="Order received"
        title="Thanks — we've got it."
        description={
          order
            ? `Your order ${order} is confirmed. A receipt is on its way.`
            : "Your order is confirmed. A receipt is on its way."
        }
      />
      <Container className="py-16">
        <div className="rounded-[var(--radius-md)] border border-[color:var(--brand-border)] p-8">
          <p className="text-ink-muted">
            What happens next:
          </p>
          <ol className="mt-4 space-y-3 text-ink-muted list-decimal list-inside">
            <li>You&apos;ll receive an order confirmation email shortly.</li>
            <li>
              If your order includes custom artwork, our team reviews the files
              and follows up if anything needs adjustment.
            </li>
            <li>
              Once production starts, we&apos;ll send tracking the moment your
              order ships.
            </li>
          </ol>
          <div className="mt-8 flex gap-3">
            <Button as="link" href="/account/orders" variant="secondary">
              View your orders
            </Button>
            <Button as="link" href="/shop">
              Continue shopping
            </Button>
          </div>
        </div>
      </Container>
    </>
  );
}
