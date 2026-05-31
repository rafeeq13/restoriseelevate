import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getPayload } from "payload";
import config from "@/payload.config";

/* ---------------------------------------------------------------------------
 * /api/cart — minimal cart API.
 *   POST   add an item ({ productId, sku, quantity, unitPrice, optionValues, currency })
 *   PATCH  update an item quantity ({ index, quantity })
 *   DELETE remove an item ({ index })
 *   GET    return the active cart
 *
 * Carts are scoped by a `cart_session` cookie (guest) or by the
 * authenticated customer (when present). The cookie is httpOnly and
 * lasts 30 days.
 * -------------------------------------------------------------------------*/

const COOKIE_NAME = "rb_cart_session";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 30;

async function loadOrCreateCart() {
  const cookieStore = await cookies();
  let sessionId = cookieStore.get(COOKIE_NAME)?.value;
  if (!sessionId) {
    sessionId = crypto.randomUUID();
    cookieStore.set(COOKIE_NAME, sessionId, {
      httpOnly: true,
      maxAge: COOKIE_MAX_AGE,
      sameSite: "lax",
      path: "/",
      secure: process.env.NODE_ENV === "production",
    });
  }

  const payload = await getPayload({ config });
  const existing = await payload.find({
    collection: "carts",
    where: { sessionId: { equals: sessionId } },
    limit: 1,
    depth: 0,
  });

  if (existing.docs.length > 0) {
    return { payload, sessionId, cart: existing.docs[0] };
  }

  const created = await payload.create({
    collection: "carts",
    data: {
      sessionId,
      items: [],
      subtotalAmount: 0,
      itemCount: 0,
    } as unknown as Parameters<typeof payload.create>[0]["data"],
  });
  return { payload, sessionId, cart: created };
}

function recalc(items: Array<{ unitPrice: number; quantity: number }>) {
  const itemCount = items.reduce((s, it) => s + (it.quantity || 0), 0);
  const subtotalAmount = items.reduce(
    (s, it) => s + (it.unitPrice || 0) * (it.quantity || 0),
    0,
  );
  return {
    itemCount,
    subtotalAmount: Math.round(subtotalAmount * 100) / 100,
  };
}

export async function GET() {
  try {
    const { cart } = await loadOrCreateCart();
    return NextResponse.json({ cart });
  } catch (err) {
    console.error("[cart:get]", err);
    return NextResponse.json(
      { error: "Cart unavailable." },
      { status: 503 },
    );
  }
}

export async function POST(req: Request) {
  let body: {
    productId?: string | number;
    sku?: string;
    quantity?: number;
    unitPrice?: number;
    optionValues?: Record<string, unknown>;
    currency?: string;
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }
  if (!body.productId || !body.quantity || !body.unitPrice) {
    return NextResponse.json(
      { error: "productId, quantity, unitPrice are required." },
      { status: 400 },
    );
  }

  try {
    const { payload, cart } = await loadOrCreateCart();
    const items = [
      ...(((cart as { items?: unknown[] }).items ?? []) as Array<{
        product: string | number;
        sku?: string;
        quantity: number;
        unitPrice: number;
        optionValues?: unknown;
      }>),
      {
        product: body.productId,
        sku: body.sku,
        quantity: body.quantity,
        unitPrice: body.unitPrice,
        optionValues: body.optionValues,
      },
    ];
    const totals = recalc(items);
    const updated = await payload.update({
      collection: "carts",
      id: (cart as { id: string | number }).id,
      data: {
        items,
        currency: body.currency ?? "USD",
        ...totals,
      } as unknown as Parameters<typeof payload.update>[0]["data"],
    });
    return NextResponse.json({ cart: updated });
  } catch (err) {
    console.error("[cart:post]", err);
    return NextResponse.json({ error: "Could not update cart." }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  let body: { index?: number; quantity?: number };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }
  if (typeof body.index !== "number" || typeof body.quantity !== "number") {
    return NextResponse.json(
      { error: "index and quantity required." },
      { status: 400 },
    );
  }
  try {
    const { payload, cart } = await loadOrCreateCart();
    const items = [
      ...(((cart as { items?: unknown[] }).items ?? []) as Array<{
        quantity: number;
      }>),
    ];
    if (!items[body.index]) {
      return NextResponse.json({ error: "Item not found." }, { status: 404 });
    }
    if (body.quantity <= 0) items.splice(body.index, 1);
    else items[body.index].quantity = body.quantity;
    const totals = recalc(items as Array<{ quantity: number; unitPrice: number }>);
    const updated = await payload.update({
      collection: "carts",
      id: (cart as { id: string | number }).id,
      data: { items, ...totals } as unknown as Parameters<typeof payload.update>[0]["data"],
    });
    return NextResponse.json({ cart: updated });
  } catch (err) {
    console.error("[cart:patch]", err);
    return NextResponse.json({ error: "Could not update cart." }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  let body: { index?: number };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }
  if (typeof body.index !== "number") {
    return NextResponse.json({ error: "index required." }, { status: 400 });
  }
  try {
    const { payload, cart } = await loadOrCreateCart();
    const items = [
      ...(((cart as { items?: unknown[] }).items ?? []) as Array<{
        quantity: number;
      }>),
    ];
    items.splice(body.index, 1);
    const totals = recalc(items as Array<{ quantity: number; unitPrice: number }>);
    const updated = await payload.update({
      collection: "carts",
      id: (cart as { id: string | number }).id,
      data: { items, ...totals } as unknown as Parameters<typeof payload.update>[0]["data"],
    });
    return NextResponse.json({ cart: updated });
  } catch (err) {
    console.error("[cart:delete]", err);
    return NextResponse.json({ error: "Could not update cart." }, { status: 500 });
  }
}
