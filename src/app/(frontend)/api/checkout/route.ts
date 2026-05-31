import { NextResponse } from "next/server";
import { getPayload } from "payload";
import config from "@/payload.config";
import { getStripe } from "@/lib/stripe";

/* ---------------------------------------------------------------------------
 * POST /api/checkout — creates a Stripe Checkout Session from the current
 * cart and returns the redirect URL.
 *
 * The order is provisioned in Payload with status="pending-payment". On
 * payment success, the Stripe webhook flips it to "paid" and triggers the
 * fulfillment routing engine.
 * -------------------------------------------------------------------------*/

type Body = {
  cartId?: string | number;
  customerId?: string | number;
  guestEmail?: string;
  shippingAddress?: Record<string, unknown>;
  billingAddress?: Record<string, unknown>;
  successUrl?: string;
  cancelUrl?: string;
};

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

function generateOrderNumber() {
  const dt = new Date()
    .toISOString()
    .slice(0, 10)
    .replace(/-/g, "");
  const rnd = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `RB-${dt}-${rnd}`;
}

export async function POST(req: Request) {
  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }

  if (!body.cartId) {
    return NextResponse.json({ error: "cartId is required." }, { status: 400 });
  }

  let payload;
  try {
    payload = await getPayload({ config });
  } catch (err) {
    console.error("[checkout] payload init failed", err);
    return NextResponse.json(
      { error: "Service unavailable." },
      { status: 503 },
    );
  }

  let cart;
  try {
    cart = (await payload.findByID({
      collection: "carts",
      id: body.cartId,
      depth: 2,
    })) as unknown as {
      currency?: string;
      items?: Array<{
        product: { id: string | number; name?: string };
        sku?: string;
        quantity: number;
        unitPrice: number;
        optionValues?: Record<string, unknown>;
      }>;
      subtotalAmount?: number;
    };
  } catch (err) {
    console.error("[checkout] cart load failed", err);
    return NextResponse.json({ error: "Cart not found." }, { status: 404 });
  }

  if (!cart?.items?.length) {
    return NextResponse.json({ error: "Cart is empty." }, { status: 400 });
  }

  const currency = (cart.currency ?? "USD").toLowerCase();
  const orderNumber = generateOrderNumber();

  // Provision the order in pending-payment state so the webhook has a row to update.
  const orderItems = cart.items.map((it) => ({
    product: it.product?.id,
    sku: it.sku,
    quantity: it.quantity,
    unitPrice: it.unitPrice,
    subtotal: Math.round(it.unitPrice * it.quantity * 100) / 100,
    optionValues: it.optionValues,
    productSnapshot: it.product,
  }));

  const subtotal = orderItems.reduce((s, it) => s + it.subtotal, 0);

  let createdOrder;
  try {
    createdOrder = await payload.create({
      collection: "orders",
      data: {
        orderNumber,
        customer: body.customerId,
        guestEmail: body.customerId ? undefined : body.guestEmail,
        items: orderItems,
        billingAddress: body.billingAddress,
        shippingAddress: body.shippingAddress,
        currency: cart.currency ?? "USD",
        subtotalAmount: subtotal,
        totalAmount: subtotal,
        status: "pending-payment",
      } as unknown as Parameters<typeof payload.create>[0]["data"],
    });
  } catch (err) {
    console.error("[checkout] order create failed", err);
    return NextResponse.json(
      { error: "Could not provision the order." },
      { status: 500 },
    );
  }

  let stripe;
  try {
    stripe = getStripe();
  } catch (err) {
    console.error("[checkout] Stripe not configured", err);
    return NextResponse.json(
      { error: "Payments are not configured. Please contact us to complete your order." },
      { status: 501 },
    );
  }

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    line_items: orderItems.map((it) => ({
      quantity: it.quantity,
      price_data: {
        currency,
        unit_amount: Math.round(it.unitPrice * 100),
        product_data: {
          name:
            (it.productSnapshot as { name?: string } | undefined)?.name ??
            `Product ${it.product}`,
        },
      },
    })),
    customer_email: body.guestEmail,
    metadata: {
      orderNumber,
      orderId: String(
        (createdOrder as { id: string | number }).id,
      ),
    },
    success_url:
      body.successUrl ??
      `${siteUrl}/checkout/success?order=${orderNumber}&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: body.cancelUrl ?? `${siteUrl}/checkout/cancel?order=${orderNumber}`,
  });

  try {
    await payload.update({
      collection: "orders",
      id: (createdOrder as { id: string | number }).id,
      data: {
        payment: {
          provider: "stripe",
          stripeCheckoutSessionId: session.id,
        },
      } as unknown as Parameters<typeof payload.update>[0]["data"],
    });
  } catch (err) {
    console.warn("[checkout] failed to attach checkout session id", err);
  }

  return NextResponse.json({ url: session.url, orderNumber });
}
