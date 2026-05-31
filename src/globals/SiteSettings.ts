import type { GlobalConfig } from "payload";

export const SiteSettings: GlobalConfig = {
  slug: "site-settings",
  admin: {
    group: "Settings",
  },
  access: {
    read: () => true,
    update: ({ req: { user } }) =>
      ["super-admin", "seo-manager"].includes(user?.role ?? ""),
  },
  fields: [
    {
      name: "siteName",
      type: "text",
      required: true,
      defaultValue: "Restorise Business Solutions",
    },
    {
      name: "tagline",
      type: "text",
      localized: true,
      defaultValue: "Digital growth for the food & hospitality industry.",
    },
    {
      name: "defaultMetaDescription",
      type: "textarea",
      localized: true,
      defaultValue:
        "A digital services agency for the food and hospitality sector. Performance marketing, SEO, social media, creative production, and operational services.",
    },
    { name: "logo", type: "upload", relationTo: "media" },
    { name: "logoReversed", type: "upload", relationTo: "media" },
    { name: "favicon", type: "upload", relationTo: "media" },
    { name: "defaultOgImage", type: "upload", relationTo: "media" },
    {
      name: "contact",
      type: "group",
      fields: [
        { name: "email", type: "email", defaultValue: "contact.restorise@gmail.com" },
        { name: "phone", type: "text" },
        { name: "addressLine1", type: "text" },
        { name: "addressLine2", type: "text" },
        { name: "city", type: "text" },
        { name: "country", type: "text" },
        { name: "workingHours", type: "text", localized: true },
      ],
    },
    {
      name: "socials",
      type: "array",
      fields: [
        {
          name: "platform",
          type: "select",
          required: true,
          options: [
            { label: "Instagram", value: "instagram" },
            { label: "Facebook", value: "facebook" },
            { label: "LinkedIn", value: "linkedin" },
            { label: "TikTok", value: "tiktok" },
            { label: "YouTube", value: "youtube" },
            { label: "X / Twitter", value: "twitter" },
            { label: "WhatsApp", value: "whatsapp" },
          ],
        },
        { name: "url", type: "text", required: true },
      ],
    },
    {
      name: "geographicScope",
      type: "text",
      localized: true,
      defaultValue:
        "Serving clients in the UK, US, Canada, the EU, and Australia.",
      admin: {
        description:
          "Country-of-service disclosure shown in the footer (brief §4.3).",
      },
    },
  ],
};
