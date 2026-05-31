import type { CollectionConfig } from "payload";

/**
 * Orders — Phase 2 (brief §5, §6.1). Each order carries a full snapshot of
 * line items, pricing, addresses, and the routing decision so a historic
 * order can be reconstructed even if a product or partner is later edited.
 *
 * Lifecycle is captured by the `status` field and a separate
 * `fulfillment.status` so a single order can be partially fulfilled.
 */
export const Orders: CollectionConfig = {
  slug: "orders",
  admin: {
    useAsTitle: "orderNumber",
    defaultColumns: [
      "orderNumber",
      "customer",
      "status",
      "totalAmount",
      "currency",
      "createdAt",
    ],
    group: "Commerce",
  },
  access: {
    read: ({ req: { user } }) =>
      ["super-admin", "customer-service"].includes(user?.role ?? "") || !!user,
    create: () => true, // checkout API endpoint creates orders
    update: ({ req: { user } }) =>
      ["super-admin", "customer-service"].includes(user?.role ?? ""),
    delete: ({ req: { user } }) => user?.role === "super-admin",
  },
  fields: [
    {
      name: "orderNumber",
      type: "text",
      required: true,
      unique: true,
      index: true,
      admin: { position: "sidebar" },
    },
    {
      name: "customer",
      type: "relationship",
      relationTo: "customers",
      hasMany: false,
      admin: { position: "sidebar" },
    },
    {
      name: "guestEmail",
      type: "email",
      admin: { description: "Set for guest checkout (no customer record)." },
    },
    {
      name: "items",
      type: "array",
      label: "Line items",
      required: true,
      fields: [
        {
          name: "product",
          type: "relationship",
          relationTo: "products",
          required: true,
        },
        { name: "productSnapshot", type: "json", admin: { description: "Frozen product data at checkout time." } },
        { name: "sku", type: "text" },
        { name: "quantity", type: "number", required: true, min: 1 },
        { name: "unitPrice", type: "number", required: true },
        { name: "subtotal", type: "number", required: true },
        { name: "optionValues", type: "json" },
        {
          name: "artwork",
          type: "relationship",
          relationTo: "artwork-files",
          hasMany: true,
        },
        {
          name: "designProject",
          type: "relationship",
          relationTo: "design-projects",
          hasMany: false,
          admin: { description: "Set for orders that need in-house design work." },
        },
      ],
    },
    {
      name: "billingAddress",
      type: "json",
      admin: { description: "Frozen billing address snapshot." },
    },
    {
      name: "shippingAddress",
      type: "json",
      admin: { description: "Frozen shipping address snapshot." },
    },
    {
      name: "currency",
      type: "select",
      required: true,
      defaultValue: "USD",
      options: ["USD", "GBP", "EUR"].map((c) => ({ label: c, value: c })),
    },
    { name: "subtotalAmount", type: "number", required: true },
    { name: "shippingAmount", type: "number", defaultValue: 0 },
    { name: "taxAmount", type: "number", defaultValue: 0 },
    { name: "discountAmount", type: "number", defaultValue: 0 },
    { name: "totalAmount", type: "number", required: true },
    {
      name: "promoCode",
      type: "relationship",
      relationTo: "promo-codes",
      hasMany: false,
    },
    {
      name: "status",
      type: "select",
      required: true,
      defaultValue: "pending-payment",
      admin: { position: "sidebar" },
      options: [
        { label: "Pending payment", value: "pending-payment" },
        { label: "Paid", value: "paid" },
        { label: "Awaiting artwork approval", value: "awaiting-artwork" },
        { label: "In production", value: "in-production" },
        { label: "Shipped", value: "shipped" },
        { label: "Delivered", value: "delivered" },
        { label: "Cancelled", value: "cancelled" },
        { label: "Refunded", value: "refunded" },
      ],
    },
    {
      name: "isSamplePack",
      type: "checkbox",
      defaultValue: false,
      admin: { position: "sidebar", description: "Sample pack workflow flag (brief §5.8)." },
    },
    {
      name: "payment",
      type: "group",
      fields: [
        {
          name: "provider",
          type: "select",
          defaultValue: "stripe",
          options: [
            { label: "Stripe", value: "stripe" },
            { label: "PayPal", value: "paypal" },
          ],
        },
        { name: "stripePaymentIntentId", type: "text" },
        { name: "stripeCheckoutSessionId", type: "text" },
        { name: "paypalOrderId", type: "text" },
        { name: "paidAt", type: "date" },
        { name: "rawWebhookEvents", type: "json" },
      ],
    },
    {
      name: "fulfillment",
      type: "group",
      fields: [
        {
          name: "partner",
          type: "relationship",
          relationTo: "fulfillment-partners",
          hasMany: false,
        },
        { name: "partnerOrderId", type: "text" },
        {
          name: "status",
          type: "select",
          defaultValue: "unrouted",
          options: [
            { label: "Unrouted", value: "unrouted" },
            { label: "Submitted", value: "submitted" },
            { label: "In production", value: "in-production" },
            { label: "Shipped", value: "shipped" },
            { label: "Delivered", value: "delivered" },
            { label: "Cancelled", value: "cancelled" },
            { label: "Manual handling", value: "manual" },
          ],
        },
        { name: "trackingCarrier", type: "text" },
        { name: "trackingNumber", type: "text" },
        { name: "trackingUrl", type: "text" },
        { name: "routingNotes", type: "textarea" },
      ],
    },
    {
      name: "source",
      type: "group",
      admin: { description: "Attribution captured at checkout." },
      fields: [
        { name: "channel", type: "text" },
        { name: "utmSource", type: "text" },
        { name: "utmMedium", type: "text" },
        { name: "utmCampaign", type: "text" },
      ],
    },
    {
      name: "customerNotes",
      type: "textarea",
      admin: { description: "Free-form notes the customer left at checkout." },
    },
    {
      name: "internalNotes",
      type: "textarea",
      admin: { description: "Internal notes (not visible to the customer)." },
    },
    {
      name: "communicationLog",
      type: "array",
      fields: [
        { name: "occurredAt", type: "date", required: true },
        {
          name: "channel",
          type: "select",
          options: [
            { label: "Email", value: "email" },
            { label: "Phone", value: "phone" },
            { label: "WhatsApp", value: "whatsapp" },
            { label: "Internal note", value: "internal" },
          ],
        },
        { name: "summary", type: "textarea", required: true },
        { name: "author", type: "relationship", relationTo: "users" },
      ],
    },
  ],
};
