import type { CollectionConfig } from "payload";

/**
 * Promotional codes — brief §5.5. Codes support percentage, fixed-amount,
 * free shipping, free embellishment, and first-order discount types, with
 * validity windows, usage caps, and customer-group restrictions.
 */
export const PromoCodes: CollectionConfig = {
  slug: "promo-codes",
  admin: {
    useAsTitle: "code",
    defaultColumns: ["code", "discountType", "discountValue", "validUntil", "usageCount"],
    group: "Commerce",
  },
  access: {
    read: ({ req: { user } }) => Boolean(user),
    create: ({ req: { user } }) =>
      ["super-admin", "seo-manager"].includes(user?.role ?? ""),
    update: ({ req: { user } }) =>
      ["super-admin", "seo-manager"].includes(user?.role ?? ""),
    delete: ({ req: { user } }) => user?.role === "super-admin",
  },
  fields: [
    {
      name: "code",
      type: "text",
      required: true,
      unique: true,
      index: true,
      hooks: {
        beforeValidate: [({ value }) => (typeof value === "string" ? value.toUpperCase().trim() : value)],
      },
    },
    {
      name: "discountType",
      type: "select",
      required: true,
      options: [
        { label: "Percentage off", value: "percentage" },
        { label: "Fixed amount off", value: "fixed" },
        { label: "Free shipping", value: "free-shipping" },
        { label: "Free embellishment / upgrade", value: "free-upgrade" },
        { label: "First-order discount", value: "first-order" },
      ],
    },
    {
      name: "discountValue",
      type: "number",
      admin: { description: "Percent for `percentage`, currency amount for `fixed`, ignored otherwise." },
    },
    { name: "currency", type: "select", options: ["USD", "GBP", "EUR"].map((c) => ({ label: c, value: c })) },
    { name: "minOrderAmount", type: "number" },
    { name: "validFrom", type: "date" },
    { name: "validUntil", type: "date" },
    {
      name: "usageCap",
      type: "number",
      admin: { description: "Total uses across all customers. Leave blank for unlimited." },
    },
    {
      name: "perCustomerCap",
      type: "number",
      admin: { description: "Per-customer use limit. Leave blank for unlimited." },
    },
    {
      name: "usageCount",
      type: "number",
      defaultValue: 0,
      admin: { readOnly: true, position: "sidebar" },
    },
    {
      name: "customerSegmentTags",
      type: "array",
      admin: { description: "If set, only customers with at least one of these tags can use the code." },
      fields: [{ name: "tag", type: "text", required: true }],
    },
    {
      name: "applicableCategories",
      type: "relationship",
      relationTo: "product-categories",
      hasMany: true,
      admin: { description: "If set, code only applies to orders containing at least one product in these categories." },
    },
    {
      name: "enabled",
      type: "checkbox",
      defaultValue: true,
      admin: { position: "sidebar" },
    },
  ],
};
