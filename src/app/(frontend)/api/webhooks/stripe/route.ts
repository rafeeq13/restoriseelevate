import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { getPayload } from "payload";
import config from "@/payload.config";
import { getStripe } from "@/lib/stripe";
import { routeOrder, submitOrderToPartner } from "@/lib/fulfillment/route";

/* ---------------------------------------------------------------------------
 * POST /api/webhooks/stripe — Stripe webhook receiver.
 *
 * Validates the signature, then:
 *   - checkout.session.completed → mark order paid, trigger fulfillment
 *   - charge.refunded → mark order refunded
 *   - payment_intent.payment_failed → leave order in pending; surface in admin
 *
 * Body must be read as the raw stream for signature verification, per
 * Stripe docs. Next.js App Router exposes `req.text()` for this.
 * -------------------------------------------------------------------------*/

export const runtime = "nodejs"; // signature verification needs Node crypto

export async function POST(req: Request) {
  const signature = req.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing signature." }, { status: 400 });
  }
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) {
    return NextResponse.json({ error: "Webhook not configured." }, { status: 503 });
  }

  const stripe = getStripe();
  const raw = await req.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(raw, signature, secret);
  } catch (err) {
    console.warn("[stripe-webhook] signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature." }, { status: 400 });
  }

  let payload;
  try {
    payload = await getPayload({ config });
  } catch (err) {
    console.error("[stripe-webhook] payload init failed", err);
    return NextResponse.json({ error: "Service unavailable." }, { status: 503 });
  }

  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      const orderId = session.metadata?.orderId;
      if (!orderId) return NextResponse.json({ ok: true });

      const order = await payload.findByID({
        collection: "orders",
        id: orderId,
        depth: 2,
      });

      await payload.update({
        collection: "orders",
        id: orderId,
        data: {
          status: "paid",
          payment: {
            provider: "stripe",
            stripeCheckoutSessionId: session.id,
            stripePaymentIntentId:
              typeof session.payment_intent === "string"
                ? session.payment_intent
                : (session.payment_intent?.id ?? undefined),
            paidAt: new Date().toISOString(),
            rawWebhookEvents: [event],
          },
        } as unknown as Parameters<typeof payload.update>[0]["data"],
      });

      // Trigger fulfillment routing. Failures are isolated — the order stays
      // marked paid and ops can manually re-route from the admin.
      void routeAndSubmit({
        payload,
        order: order as unknown as OrderRecord,
      }).catch((err) =>
        console.error("[stripe-webhook] fulfillment dispatch failed", err),
      );
    }

    if (event.type === "charge.refunded") {
      const charge = event.data.object as Stripe.Charge;
      const piId =
        typeof charge.payment_intent === "string"
          ? charge.payment_intent
          : charge.payment_intent?.id;
      if (!piId) return NextResponse.json({ ok: true });

      const matched = await payload.find({
        collection: "orders",
        where: { "payment.stripePaymentIntentId": { equals: piId } },
        limit: 1,
      });
      const orderRow = matched.docs[0] as unknown as { id: string | number };
      if (orderRow) {
        await payload.update({
          collection: "orders",
          id: orderRow.id,
          data: { status: "refunded" } as unknown as Parameters<typeof payload.update>[0]["data"],
        });
      }
    }
  } catch (err) {
    console.error("[stripe-webhook] handler error", err);
    return NextResponse.json({ error: "Handler error." }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}

type OrderRecord = {
  id: string | number;
  orderNumber: string;
  currency?: string;
  items?: Array<{
    product: {
      id?: string | number;
      category?: { id?: string | number } | string | number;
    } | string | number;
    sku?: string;
    quantity: number;
    optionValues?: Record<string, string | undefined>;
  }>;
  shippingAddress?: Record<string, unknown>;
};

async function routeAndSubmit({
  payload,
  order,
}: {
  payload: Awaited<ReturnType<typeof getPayload>>;
  order: OrderRecord;
}) {
  const shipping = (order.shippingAddress ?? {}) as Record<string, unknown>;
  const destinationCountry =
    typeof shipping.country === "string" ? shipping.country : "";

  const categoryIds = (order.items ?? [])
    .map((it) => {
      if (typeof it.product === "object" && it.product) {
        const cat = (it.product as { category?: unknown }).category;
        if (typeof cat === "object" && cat !== null) {
          return (cat as { id?: string | number }).id;
        }
        return cat as string | number | undefined;
      }
      return undefined;
    })
    .filter((v): v is string | number => v !== undefined);

  const decision = await routeOrder({
    destinationCountry,
    productCategoryIds: categoryIds,
  });

  const result = await submitOrderToPartner({
    decision,
    orderNumber: order.orderNumber,
    items: (order.items ?? []).map((it) => ({
      productId:
        typeof it.product === "object"
          ? ((it.product as { id?: string | number }).id ?? "")
          : it.product,
      sku: it.sku,
      quantity: it.quantity,
      optionValues: it.optionValues,
    })),
    shipTo: {
      fullName: String(shipping.fullName ?? ""),
      company: shipping.company as string | undefined,
      line1: String(shipping.line1 ?? ""),
      line2: shipping.line2 as string | undefined,
      city: String(shipping.city ?? ""),
      region: shipping.region as string | undefined,
      postalCode: String(shipping.postalCode ?? ""),
      country: destinationCountry,
      phone: shipping.phone as string | undefined,
    },
    currency: order.currency ?? "USD",
  });

  await payload.update({
    collection: "orders",
    id: order.id,
    data: {
      fulfillment: {
        partner: decision.partnerId ?? undefined,
        partnerOrderId: result.partnerOrderId,
        status: result.status === "manual" ? "manual" : "submitted",
        routingNotes: decision.reason,
      },
    } as unknown as Parameters<typeof payload.update>[0]["data"],
  });
}
