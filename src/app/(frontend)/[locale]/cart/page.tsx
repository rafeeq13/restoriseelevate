import type { Metadata } from "next";
import { cookies, headers } from "next/headers";
import { setRequestLocale } from "next-intl/server";
import { Container } from "@/components/marketing/Container";
import { PageHeader } from "@/components/marketing/PageHeader";
import { Link } from "@/i18n/navigation";
import { CartPanel } from "@/components/commerce/CartPanel";

export const metadata: Metadata = { title: "Cart" };

type CartDoc = {
  id: string | number;
  currency?: string;
  items?: Array<{
    product:
      | { id: string | number; name?: string; slug?: string }
      | string
      | number;
    sku?: string;
    quantity: number;
    unitPrice: number;
  }>;
  subtotalAmount?: number;
  itemCount?: number;
};

async function fetchCart(): Promise<CartDoc | null> {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get("rb_cart_session")?.value;
  if (!sessionId) return null;
  const h = await headers();
  const host = h.get("host") ?? "localhost:3000";
  const proto = h.get("x-forwarded-proto") ?? "http";
  try {
    const res = await fetch(`${proto}://${host}/api/cart`, {
      cache: "no-store",
      headers: { cookie: `rb_cart_session=${sessionId}` },
    });
    if (!res.ok) return null;
    const data = (await res.json()) as { cart?: CartDoc };
    return data.cart ?? null;
  } catch {
    return null;
  }
}

export default async function CartPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const cart = await fetchCart();

  return (
    <>
      <PageHeader
        eyebrow="Cart"
        title="Your basket"
        description="Review your items, apply a promo code, and proceed to secure checkout."
      />
      <Container className="py-16">
        {!cart || (cart.items?.length ?? 0) === 0 ? (
          <div className="rounded-[var(--radius-md)] border border-[color:var(--brand-border)] p-8 text-ink-muted">
            Your cart is empty.{" "}
            <Link
              href="/shop"
              className="underline underline-offset-4 text-ink"
            >
              Browse the catalog
            </Link>{" "}
            to add products.
          </div>
        ) : (
          <CartPanel cart={cart} />
        )}
      </Container>
    </>
  );
}
