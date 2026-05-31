import type { CollectionConfig } from "payload";

/**
 * Leads — submissions from the Phase 1 lead-capture modal (brief §4.4.3).
 * Stores the full payload plus admin lifecycle fields (status, notes, owner).
 * Synced to CRM + email marketing platform from the submission API route.
 */
export const Leads: CollectionConfig = {
  slug: "leads",
  admin: {
    useAsTitle: "email",
    defaultColumns: [
      "email",
      "businessName",
      "country",
      "status",
      "createdAt",
    ],
    group: "Pipeline",
  },
  access: {
    read: ({ req: { user } }) =>
      ["super-admin", "seo-manager", "customer-service"].includes(
        user?.role ?? "",
      ),
    create: () => true, // public form submits via authenticated API route
    update: ({ req: { user } }) =>
      ["super-admin", "customer-service"].includes(user?.role ?? ""),
    delete: ({ req: { user } }) => user?.role === "super-admin",
  },
  fields: [
    { name: "firstName", type: "text", required: true },
    { name: "lastName", type: "text", required: true },
    { name: "email", type: "email", required: true, index: true },
    { name: "phoneCountryCode", type: "text", required: true },
    { name: "phone", type: "text", required: true },
    { name: "businessName", type: "text", required: true },
    {
      name: "businessType",
      type: "select",
      required: true,
      options: [
        { label: "Restaurant", value: "restaurant" },
        { label: "Takeaway", value: "takeaway" },
        { label: "Café", value: "cafe" },
        { label: "Hotel", value: "hotel" },
        { label: "Cloud Kitchen", value: "cloud-kitchen" },
        { label: "Bakery", value: "bakery" },
        { label: "Bar", value: "bar" },
        { label: "Other", value: "other" },
      ],
    },
    { name: "country", type: "text", required: true },
    { name: "city", type: "text", required: true },
    {
      name: "servicesRequired",
      type: "relationship",
      relationTo: "services",
      hasMany: true,
    },
    { name: "message", type: "textarea", required: true },
    {
      name: "source",
      type: "group",
      admin: { description: "Attribution metadata captured at submission." },
      fields: [
        { name: "page", type: "text" },
        { name: "referrer", type: "text" },
        { name: "utmSource", type: "text" },
        { name: "utmMedium", type: "text" },
        { name: "utmCampaign", type: "text" },
        { name: "utmTerm", type: "text" },
        { name: "utmContent", type: "text" },
      ],
    },
    {
      name: "status",
      type: "select",
      defaultValue: "new",
      required: true,
      admin: { position: "sidebar" },
      options: [
        { label: "New", value: "new" },
        { label: "Contacted", value: "contacted" },
        { label: "Qualified", value: "qualified" },
        { label: "Won", value: "won" },
        { label: "Lost", value: "lost" },
      ],
    },
    {
      name: "flagged",
      type: "checkbox",
      defaultValue: false,
      admin: {
        position: "sidebar",
        description:
          "Suspicious submissions (low reCAPTCHA score, honeypot trip, rate-limit) land here.",
      },
    },
    {
      name: "recaptchaScore",
      type: "number",
      admin: { readOnly: true, position: "sidebar" },
    },
    {
      name: "owner",
      type: "relationship",
      relationTo: "users",
      admin: { position: "sidebar" },
    },
    { name: "notes", type: "textarea" },
  ],
};
