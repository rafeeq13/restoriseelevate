import type { CollectionConfig } from "payload";

/**
 * Quote requests — brief §5.4.3 bespoke quote workflow. Customer submits
 * requirements via a structured form; agency replies with a quote; on
 * approval the request graduates to a regular Order.
 */
export const QuoteRequests: CollectionConfig = {
  slug: "quote-requests",
  admin: {
    useAsTitle: "subject",
    defaultColumns: ["subject", "customer", "status", "estimatedAmount", "createdAt"],
    group: "Commerce",
  },
  access: {
    read: ({ req: { user } }) =>
      ["super-admin", "customer-service"].includes(user?.role ?? "")
        ? true
        : { customer: { equals: user?.id } },
    create: () => true, // public form
    update: ({ req: { user } }) =>
      ["super-admin", "customer-service"].includes(user?.role ?? ""),
    delete: ({ req: { user } }) => user?.role === "super-admin",
  },
  fields: [
    { name: "subject", type: "text", required: true },
    {
      name: "customer",
      type: "relationship",
      relationTo: "customers",
      hasMany: false,
    },
    { name: "contactEmail", type: "email", required: true },
    { name: "contactName", type: "text", required: true },
    { name: "businessName", type: "text" },
    { name: "country", type: "text" },
    {
      name: "productType",
      type: "select",
      options: [
        { label: "Custom packaging", value: "packaging" },
        { label: "Roll-up banners", value: "banners" },
        { label: "Bespoke print", value: "print" },
        { label: "Custom design", value: "design" },
        { label: "Other", value: "other" },
      ],
    },
    { name: "quantity", type: "number" },
    { name: "specifications", type: "textarea", required: true },
    {
      name: "referenceFiles",
      type: "relationship",
      relationTo: "artwork-files",
      hasMany: true,
    },
    {
      name: "status",
      type: "select",
      defaultValue: "new",
      admin: { position: "sidebar" },
      options: [
        { label: "New", value: "new" },
        { label: "In review", value: "in-review" },
        { label: "Quote sent", value: "quoted" },
        { label: "Accepted", value: "accepted" },
        { label: "Declined", value: "declined" },
        { label: "Converted to order", value: "converted" },
      ],
    },
    { name: "estimatedAmount", type: "number" },
    { name: "currency", type: "select", options: ["USD", "GBP", "EUR"].map((c) => ({ label: c, value: c })) },
    {
      name: "convertedOrder",
      type: "relationship",
      relationTo: "orders",
      hasMany: false,
      admin: { description: "Set when the customer accepts the quote and the order is created." },
    },
    { name: "internalNotes", type: "textarea" },
  ],
};
