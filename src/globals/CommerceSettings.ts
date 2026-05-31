import type { GlobalConfig } from "payload";

/**
 * Commerce-wide settings — currencies, VAT, sample-pack pricing, etc.
 * Lives as a global so a single record drives the whole storefront.
 */
export const CommerceSettings: GlobalConfig = {
  slug: "commerce-settings",
  admin: { group: "Settings" },
  access: {
    read: () => true,
    update: ({ req: { user } }) => user?.role === "super-admin",
  },
  fields: [
    {
      name: "defaultCurrency",
      type: "select",
      defaultValue: "USD",
      options: ["USD", "GBP", "EUR"].map((c) => ({ label: c, value: c })),
    },
    {
      name: "supportedCurrencies",
      type: "select",
      hasMany: true,
      defaultValue: ["USD", "GBP", "EUR"],
      options: ["USD", "GBP", "EUR"].map((c) => ({ label: c, value: c })),
    },
    {
      name: "vat",
      type: "group",
      fields: [
        {
          name: "applyToCountries",
          type: "array",
          admin: { description: "ISO codes where VAT applies (defaults: UK + EU member states)." },
          fields: [{ name: "country", type: "text", required: true }],
        },
        {
          name: "displayMode",
          type: "select",
          defaultValue: "inclusive",
          options: [
            { label: "Inclusive (prices shown with VAT)", value: "inclusive" },
            { label: "Exclusive (VAT added at checkout)", value: "exclusive" },
          ],
          admin: { description: "Default display mode; customer can toggle." },
        },
      ],
    },
    {
      name: "samplePack",
      type: "group",
      label: "Sample pack workflow (brief §5.8)",
      fields: [
        { name: "enabled", type: "checkbox", defaultValue: true },
        { name: "price", type: "number", defaultValue: 5 },
        { name: "currency", type: "select", defaultValue: "USD", options: ["USD", "GBP", "EUR"].map((c) => ({ label: c, value: c })) },
        { name: "description", type: "textarea", localized: true },
        {
          name: "linkedProduct",
          type: "relationship",
          relationTo: "products",
          hasMany: false,
          admin: { description: "The product used to represent the sample pack in checkout." },
        },
      ],
    },
    {
      name: "addressValidation",
      type: "group",
      fields: [
        { name: "enabled", type: "checkbox", defaultValue: false },
        {
          name: "provider",
          type: "select",
          defaultValue: "loqate",
          options: [
            { label: "Loqate", value: "loqate" },
            { label: "Google Address", value: "google" },
            { label: "Smarty", value: "smarty" },
          ],
        },
      ],
    },
    {
      name: "checkoutNotice",
      type: "richText",
      localized: true,
      admin: { description: "Optional notice shown above the payment step (e.g. lead-time advisory)." },
    },
  ],
};
