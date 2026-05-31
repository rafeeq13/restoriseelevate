import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { Container } from "@/components/marketing/Container";
import { PageHeader } from "@/components/marketing/PageHeader";
import { Button } from "@/components/marketing/Button";

export const metadata: Metadata = {
  title: "Checkout cancelled",
  robots: { index: false, follow: false },
};

export default async function CheckoutCancelPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <PageHeader
        eyebrow="Checkout cancelled"
        title="Your basket is still here."
        description="No payment was taken. You can return to the cart and try again, or get in touch if you'd like a hand."
      />
      <Container className="py-16">
        <div className="flex gap-3">
          <Button as="link" href="/cart">
            Back to cart
          </Button>
          <Button as="link" href="/contact" variant="secondary">
            Contact us
          </Button>
        </div>
      </Container>
    </>
  );
}
