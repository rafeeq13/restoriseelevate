import type { CollectionConfig } from "payload";

/**
 * Fulfillment partners — the configurable partner registry that powers the
 * routing engine (brief §5.3). Adding a new partner is a CMS operation; the
 * routing logic in `src/lib/fulfillment/route.ts` reads from this registry.
 */
export const FulfillmentPartners: CollectionConfig = {
  slug: "fulfillment-partners",
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "provider", "regions", "priority", "enabled"],
    group: "Commerce",
  },
  access: {
    read: ({ req: { user } }) => Boolean(user),
    create: ({ req: { user } }) => user?.role === "super-admin",
    update: ({ req: { user } }) => user?.role === "super-admin",
    delete: ({ req: { user } }) => user?.role === "super-admin",
  },
  fields: [
    { name: "name", type: "text", required: true },
    {
      name: "provider",
      type: "select",
      required: true,
      options: [
        { label: "Gelato", value: "gelato" },
        { label: "Printful", value: "printful" },
        { label: "Packhelp", value: "packhelp" },
        { label: "Manual (Lahore local supplier)", value: "manual-lahore" },
        { label: "Other (custom)", value: "custom" },
      ],
    },
    {
      name: "regions",
      type: "array",
      admin: { description: "Country ISO codes this partner can ship to (e.g. GB, US, DE)." },
      fields: [
        { name: "country", type: "text", required: true },
      ],
    },
    {
      name: "productCategories",
      type: "relationship",
      relationTo: "product-categories",
      hasMany: true,
      admin: { description: "Categories this partner can fulfill. Leave empty for all categories." },
    },
    {
      name: "priority",
      type: "number",
      defaultValue: 100,
      admin: { description: "Lower priority wins ties when multiple partners qualify for an order." },
    },
    {
      name: "enabled",
      type: "checkbox",
      defaultValue: true,
      admin: { position: "sidebar" },
    },
    {
      name: "credentials",
      type: "json",
      admin: {
        position: "sidebar",
        description:
          "Provider-specific credentials JSON. For Gelato/Printful/Packhelp the system reads these as env-substitution keys (e.g. { \"apiKeyEnv\": \"GELATO_API_KEY\" }) — never store raw secrets here.",
      },
    },
    {
      name: "notes",
      type: "textarea",
      admin: { description: "Operations notes, e.g. lead times, escalation contacts." },
    },
  ],
};
