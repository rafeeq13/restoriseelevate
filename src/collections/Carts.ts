import type { CollectionConfig } from "payload";

/**
 * Carts — persistent shopping carts, keyed either by customer (logged in)
 * or by an opaque sessionId cookie (guest). The cookie is set by the
 * /api/cart endpoint and migrated to the customer record on sign-in.
 */
export const Carts: CollectionConfig = {
  slug: "carts",
  admin: {
    useAsTitle: "sessionId",
    defaultColumns: ["customer", "sessionId", "itemCount", "subtotalAmount", "updatedAt"],
    group: "Commerce",
  },
  access: {
    read: ({ req: { user } }) =>
      ["super-admin", "customer-service"].includes(user?.role ?? "") || !!user,
    create: () => true,
    update: () => true, // gated server-side by sessionId / customer ownership
    delete: ({ req: { user } }) => user?.role === "super-admin",
  },
  fields: [
    {
      name: "sessionId",
      type: "text",
      index: true,
      admin: { description: "Opaque cookie identifier for guest carts." },
    },
    {
      name: "customer",
      type: "relationship",
      relationTo: "customers",
      hasMany: false,
    },
    {
      name: "currency",
      type: "select",
      defaultValue: "USD",
      options: ["USD", "GBP", "EUR"].map((c) => ({ label: c, value: c })),
    },
    {
      name: "items",
      type: "array",
      fields: [
        {
          name: "product",
          type: "relationship",
          relationTo: "products",
          required: true,
        },
        { name: "sku", type: "text" },
        { name: "quantity", type: "number", required: true, min: 1 },
        { name: "unitPrice", type: "number", required: true },
        { name: "optionValues", type: "json" },
        {
          name: "artwork",
          type: "relationship",
          relationTo: "artwork-files",
          hasMany: true,
        },
      ],
    },
    { name: "subtotalAmount", type: "number", defaultValue: 0 },
    { name: "itemCount", type: "number", defaultValue: 0 },
    {
      name: "promoCode",
      type: "relationship",
      relationTo: "promo-codes",
      hasMany: false,
    },
    {
      name: "expiresAt",
      type: "date",
      admin: { description: "Carts are garbage-collected past this date if no activity." },
    },
  ],
};
