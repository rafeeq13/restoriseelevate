"use client";

import { useState, useTransition } from "react";

type Cart = {
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
};

export function CartPanel({ cart }: { cart: Cart }) {
  const [items, setItems] = useState(cart.items ?? []);
  const [pending, startTransition] = useTransition();
  const currency = cart.currency ?? "USD";

  const subtotal = items.reduce(
    (s, it) => s + (it.unitPrice ?? 0) * (it.quantity ?? 0),
    0,
  );

  async function updateQuantity(index: number, quantity: number) {
    const optimistic = items.map((it, i) =>
      i === index ? { ...it, quantity: Math.max(0, quantity) } : it,
    );
    setItems(optimistic.filter((it) => it.quantity > 0));
    startTransition(async () => {
      await fetch("/api/cart", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ index, quantity }),
      });
    });
  }

  async function removeItem(index: number) {
    const next = items.slice();
    next.splice(index, 1);
    setItems(next);
    startTransition(async () => {
      await fetch("/api/cart", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ index }),
      });
    });
  }

  async function checkout() {
    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cartId: cart.id }),
    });
    if (!res.ok) {
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      alert(data.error ?? "Checkout failed.");
      return;
    }
    const data = (await res.json()) as { url?: string };
    if (data.url) window.location.assign(data.url);
  }

  return (
    <div className="grid gap-10 lg:grid-cols-[1.6fr_1fr]">
      <ul className="divide-y divide-[color:var(--brand-border)] rounded-[var(--radius-md)] border border-[color:var(--brand-border)]">
        {items.map((it, i) => {
          const productName =
            typeof it.product === "object" && it.product
              ? (it.product as { name?: string }).name ?? "Product"
              : `Product ${it.product}`;
          return (
            <li key={i} className="flex items-center gap-4 p-5">
              <div className="flex-1">
                <p className="font-display text-base font-extrabold text-ink">
                  {productName}
                </p>
                {it.sku && (
                  <p className="mt-1 text-xs text-ink-muted">SKU: {it.sku}</p>
                )}
                <p className="mt-1 text-sm text-ink-muted">
                  {currency} {it.unitPrice.toFixed(2)} each
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  aria-label="Decrease"
                  className="h-9 w-9 rounded-[var(--radius-sm)] border border-[color:var(--brand-border)]"
                  onClick={() => updateQuantity(i, it.quantity - 1)}
                  disabled={pending}
                >
                  −
                </button>
                <span className="w-8 text-center text-sm">{it.quantity}</span>
                <button
                  type="button"
                  aria-label="Increase"
                  className="h-9 w-9 rounded-[var(--radius-sm)] border border-[color:var(--brand-border)]"
                  onClick={() => updateQuantity(i, it.quantity + 1)}
                  disabled={pending}
                >
                  +
                </button>
              </div>
              <div className="w-24 text-right font-medium text-ink">
                {currency} {(it.unitPrice * it.quantity).toFixed(2)}
              </div>
              <button
                type="button"
                className="text-sm text-ink-muted hover:text-ink"
                onClick={() => removeItem(i)}
                disabled={pending}
              >
                Remove
              </button>
            </li>
          );
        })}
      </ul>

      <aside className="rounded-[var(--radius-md)] border border-[color:var(--brand-border)] p-6">
        <p className="text-sm font-medium uppercase tracking-[0.18em] text-ink-muted">
          Order summary
        </p>
        <dl className="mt-4 space-y-2 text-sm">
          <div className="flex justify-between">
            <dt className="text-ink-muted">Subtotal</dt>
            <dd className="text-ink">
              {currency} {subtotal.toFixed(2)}
            </dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-ink-muted">Shipping</dt>
            <dd className="text-ink-muted">Calculated at checkout</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-ink-muted">Tax</dt>
            <dd className="text-ink-muted">Calculated at checkout</dd>
          </div>
        </dl>
        <button
          type="button"
          onClick={checkout}
          disabled={pending || items.length === 0}
          className="mt-6 inline-flex h-12 w-full items-center justify-center rounded-[var(--radius-pill)] bg-brand px-6 text-sm font-semibold text-brand-contrast transition hover:opacity-90 disabled:opacity-60"
        >
          Proceed to checkout
        </button>
        <p className="mt-3 text-xs text-ink-muted">
          You&apos;ll be redirected to Stripe to enter payment details
          securely. We never see your card number.
        </p>
      </aside>
    </div>
  );
}
