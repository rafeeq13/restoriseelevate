import type { GlobalConfig } from "payload";

/**
 * Shipping zones — geographic groupings with their own pricing tiers and
 * carrier preferences. Per-product weights drive selection within a zone.
 */
export const ShippingZones: GlobalConfig = {
  slug: "shipping-zones",
  admin: { group: "Settings" },
  access: {
    read: () => true,
    update: ({ req: { user } }) => user?.role === "super-admin",
  },
  fields: [
    {
      name: "zones",
      type: "array",
      fields: [
        { name: "name", type: "text", required: true, localized: true },
        {
          name: "countries",
          type: "array",
          fields: [{ name: "country", type: "text", required: true }],
        },
        { name: "currency", type: "select", defaultValue: "USD", options: ["USD", "GBP", "EUR"].map((c) => ({ label: c, value: c })) },
        {
          name: "methods",
          type: "array",
          fields: [
            { name: "label", type: "text", required: true, localized: true },
            { name: "carrier", type: "text" },
            { name: "estimatedDays", type: "text", localized: true, admin: { description: "e.g. \"2–4 business days\"" } },
            { name: "flatRate", type: "number" },
            { name: "freeShippingMinOrder", type: "number" },
            {
              name: "weightTiers",
              type: "array",
              fields: [
                { name: "maxWeightGrams", type: "number", required: true },
                { name: "price", type: "number", required: true },
              ],
            },
          ],
        },
      ],
    },
  ],
};
