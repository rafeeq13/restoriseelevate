import "server-only";
import { getPayloadSafe } from "@/lib/payload";
import { getProvider, type FulfillmentLineItem, type FulfillmentShipTo } from "./providers";

/**
 * Routing engine — brief §5.3. Picks the best partner for an order based
 * on product category, destination country, partner availability, and
 * priority. Reads from the FulfillmentPartners collection so new partners
 * can be added without code changes (§5.3.3).
 */

export type RouteDecision = {
  partnerId: string | number | null;
  partnerName: string;
  provider: string;
  reason: string;
};

type PartnerDoc = {
  id: string | number;
  name: string;
  provider: string;
  regions?: Array<{ country: string }>;
  productCategories?: Array<string | number | { id: string | number }>;
  priority?: number;
  enabled?: boolean;
};

export async function routeOrder({
  destinationCountry,
  productCategoryIds,
}: {
  destinationCountry: string;
  productCategoryIds: Array<string | number>;
}): Promise<RouteDecision> {
  const payload = await getPayloadSafe();
  if (!payload) {
    return {
      partnerId: null,
      partnerName: "manual-lahore",
      provider: "manual-lahore",
      reason: "Payload unavailable; falling back to manual handling.",
    };
  }

  let partners: PartnerDoc[] = [];
  try {
    const res = await payload.find({
      collection: "fulfillment-partners",
      where: { enabled: { equals: true } },
      limit: 100,
      depth: 0,
    });
    partners = res.docs as unknown as PartnerDoc[];
  } catch {
    partners = [];
  }

  const candidates = partners.filter((p) => {
    const coversCountry =
      !p.regions?.length ||
      p.regions.some(
        (r) => r.country?.toUpperCase() === destinationCountry?.toUpperCase(),
      );
    const coversCategory =
      !p.productCategories?.length ||
      p.productCategories.some((c) => {
        const cid = typeof c === "object" ? c.id : c;
        return productCategoryIds.some((pid) => String(pid) === String(cid));
      });
    return coversCountry && coversCategory;
  });

  if (candidates.length === 0) {
    // Local Lahore supplier handles bespoke / out-of-network destinations.
    const fallback = partners.find((p) => p.provider === "manual-lahore");
    return {
      partnerId: fallback?.id ?? null,
      partnerName: fallback?.name ?? "manual-lahore",
      provider: "manual-lahore",
      reason:
        "No matching partner; falling back to manual handling (Lahore supplier).",
    };
  }

  candidates.sort((a, b) => (a.priority ?? 100) - (b.priority ?? 100));
  const pick = candidates[0];
  return {
    partnerId: pick.id,
    partnerName: pick.name,
    provider: pick.provider,
    reason: `Best match by priority (${pick.priority ?? 100}).`,
  };
}

export async function submitOrderToPartner(args: {
  decision: RouteDecision;
  orderNumber: string;
  items: FulfillmentLineItem[];
  shipTo: FulfillmentShipTo;
  currency: string;
}) {
  const provider = getProvider(args.decision.provider);
  return provider.submitOrder({
    orderNumber: args.orderNumber,
    items: args.items,
    shipTo: args.shipTo,
    currency: args.currency,
  });
}
