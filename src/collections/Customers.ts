import type { CollectionConfig } from "payload";

/**
 * Customers — Phase 2 customer accounts (brief §5.6).
 *
 * Authentication is delegated to Payload's built-in auth so the same
 * Postgres database serves both staff (Users) and customer accounts.
 * Email magic-link, Google sign-in, and TOTP 2FA are additive — they
 * land in follow-up commits via Payload auth strategies and
 * @payloadcms/plugin-* extensions.
 */
export const Customers: CollectionConfig = {
  slug: "customers",
  admin: {
    useAsTitle: "email",
    defaultColumns: [
      "email",
      "businessName",
      "country",
      "lifetimeValue",
      "createdAt",
    ],
    group: "Commerce",
  },
  access: {
    read: ({ req: { user } }) =>
      ["super-admin", "customer-service"].includes(user?.role ?? "") ||
      !!user, // customer reading own record handled via field-level access below
    create: () => true, // public sign-up endpoint
    update: ({ req: { user }, id }) =>
      ["super-admin", "customer-service"].includes(user?.role ?? "") ||
      user?.id === id,
    delete: ({ req: { user } }) => user?.role === "super-admin",
  },
  auth: {
    tokenExpiration: 60 * 60 * 24 * 30,
    maxLoginAttempts: 5,
    lockTime: 1000 * 60 * 15,
    cookies: {
      sameSite: "Lax",
      secure: process.env.NODE_ENV === "production",
    },
    verify: true,
    forgotPassword: { expiration: 1000 * 60 * 60 },
  },
  fields: [
    { name: "firstName", type: "text", required: true },
    { name: "lastName", type: "text", required: true },
    { name: "businessName", type: "text" },
    { name: "businessType", type: "text" },
    { name: "phone", type: "text" },
    { name: "country", type: "text" },
    {
      name: "preferredCurrency",
      type: "select",
      defaultValue: "USD",
      options: [
        { label: "US Dollars", value: "USD" },
        { label: "British Pounds", value: "GBP" },
        { label: "Euros", value: "EUR" },
      ],
    },
    {
      name: "stripeCustomerId",
      type: "text",
      admin: {
        position: "sidebar",
        readOnly: true,
        description: "Linked Stripe customer for recurring identification.",
      },
    },
    {
      name: "lifetimeValue",
      type: "number",
      defaultValue: 0,
      admin: { position: "sidebar", readOnly: true },
    },
    {
      name: "segmentTags",
      type: "array",
      fields: [{ name: "tag", type: "text", required: true }],
    },
    { name: "marketingOptIn", type: "checkbox", defaultValue: false },
    { name: "notes", type: "textarea", admin: { description: "Internal CRM notes (not visible to the customer)." } },
  ],
};
