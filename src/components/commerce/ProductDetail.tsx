"use client";

import { useMemo, useState } from "react";

type Variant = {
  sku: string;
  basePrice: number;
  currency?: string;
  tieredPricing?: Array<{ minQuantity: number; unitPrice: number }>;
};

type Product = {
  id: string | number;
  name: string;
  slug: string;
  summary?: string;
  images?: Array<{ image?: { url?: string; alt?: string } }>;
  options?: Array<{
    name: string;
    type: string;
    values: Array<{ label: string; value: string; surchargePercent?: number }>;
  }>;
  variants?: Variant[];
  fulfillmentRules?: { leadTimeDays?: number };
  supportsCustomizer?: boolean;
};

function pickUnitPrice(variant: Variant, quantity: number): number {
  if (!variant.tieredPricing?.length) return variant.basePrice;
  const tier = [...variant.tieredPricing]
    .sort((a, b) => b.minQuantity - a.minQuantity)
    .find((t) => quantity >= t.minQuantity);
  return tier ? tier.unitPrice : variant.basePrice;
}

export function ProductDetail({ product }: { product: Product }) {
  const variant = product.variants?.[0];
  const currency = variant?.currency ?? "USD";
  const [quantity, setQuantity] = useState(50);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>(
    Object.fromEntries(
      (product.options ?? []).map((o) => [o.name, o.values[0]?.value ?? ""]),
    ),
  );

  const unitPrice = useMemo(() => {
    if (!variant) return 0;
    let base = pickUnitPrice(variant, quantity);
    // Apply surcharges from selected option values.
    for (const opt of product.options ?? []) {
      const v = selectedOptions[opt.name];
      const val = opt.values.find((x) => x.value === v);
      if (val?.surchargePercent) {
        base *= 1 + val.surchargePercent / 100;
      }
    }
    return Math.round(base * 100) / 100;
  }, [variant, quantity, product.options, selectedOptions]);

  const subtotal = unitPrice * quantity;

  return (
    <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr]">
      <div>
        {product.images?.[0]?.image?.url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={product.images[0].image.url}
            alt={product.images[0].image.alt ?? product.name}
            className="w-full rounded-[var(--radius-md)] border border-[color:var(--brand-border)]"
          />
        ) : (
          <div className="aspect-[4/3] w-full rounded-[var(--radius-md)] border border-dashed border-[color:var(--brand-border)] bg-surface-muted" />
        )}
      </div>

      <aside className="space-y-6">
        {(product.options ?? []).map((opt) => (
          <div key={opt.name}>
            <p className="text-sm font-medium text-ink">{opt.name}</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {opt.values.map((v) => {
                const active = selectedOptions[opt.name] === v.value;
                return (
                  <button
                    key={v.value}
                    type="button"
                    onClick={() =>
                      setSelectedOptions((s) => ({ ...s, [opt.name]: v.value }))
                    }
                    className={
                      "rounded-[var(--radius-pill)] border px-4 py-2 text-sm " +
                      (active
                        ? "border-[color:var(--brand-primary)] bg-brand text-brand-contrast"
                        : "border-[color:var(--brand-border)] text-ink hover:bg-surface-muted")
                    }
                  >
                    {v.label}
                  </button>
                );
              })}
            </div>
          </div>
        ))}

        <div>
          <label htmlFor="quantity" className="text-sm font-medium text-ink">
            Quantity
          </label>
          <input
            id="quantity"
            type="number"
            min={1}
            value={quantity}
            onChange={(e) =>
              setQuantity(Math.max(1, Number(e.target.value) || 1))
            }
            className="mt-2 w-32 rounded-[var(--radius-sm)] border border-[color:var(--brand-border)] bg-surface px-3 py-2 text-sm text-ink focus:border-[color:var(--brand-primary)] focus:outline-none"
          />
        </div>

        <div className="rounded-[var(--radius-md)] border border-[color:var(--brand-border)] p-5">
          <p className="text-sm text-ink-muted">Unit price</p>
          <p className="mt-1 font-display text-2xl font-extrabold text-ink">
            {currency} {unitPrice.toFixed(2)}
          </p>
          <p className="mt-3 text-sm text-ink-muted">Subtotal</p>
          <p className="font-display text-xl font-extrabold text-ink">
            {currency} {subtotal.toFixed(2)}
          </p>
          {product.fulfillmentRules?.leadTimeDays && (
            <p className="mt-3 text-xs text-ink-muted">
              Estimated production: {product.fulfillmentRules.leadTimeDays}{" "}
              business days, plus shipping.
            </p>
          )}
        </div>

        <button
          type="button"
          onClick={async () => {
            await fetch("/api/cart", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                productId: product.id,
                sku: variant?.sku,
                quantity,
                unitPrice,
                optionValues: selectedOptions,
                currency,
              }),
            });
            // Best-effort: hard navigate to /cart.
            window.location.assign("/cart");
          }}
          className="inline-flex h-12 w-full items-center justify-center rounded-[var(--radius-pill)] bg-brand px-6 text-sm font-semibold text-brand-contrast transition hover:opacity-90"
        >
          Add to cart
        </button>

        {product.supportsCustomizer && (
          <p className="text-xs text-ink-muted">
            This product supports the in-browser design customizer. The
            customizer launches at checkout once integration lands.
          </p>
        )}
      </aside>
    </div>
  );
}
