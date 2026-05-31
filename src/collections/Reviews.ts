import type { CollectionConfig } from "payload";

/**
 * Reviews — client testimonials per brief §4.1.
 * Stores text, attribution, business, country, rating, and optional avatar.
 */
export const Reviews: CollectionConfig = {
  slug: "reviews",
  admin: {
    useAsTitle: "personName",
    defaultColumns: ["personName", "businessName", "country", "rating"],
    group: "Content",
  },
  access: {
    read: () => true,
    create: ({ req: { user } }) =>
      ["super-admin", "editor"].includes(user?.role ?? ""),
    update: ({ req: { user } }) =>
      ["super-admin", "editor"].includes(user?.role ?? ""),
    delete: ({ req: { user } }) => user?.role === "super-admin",
  },
  fields: [
    { name: "personName", type: "text", required: true },
    { name: "personRole", type: "text", localized: true },
    { name: "businessName", type: "text", required: true },
    { name: "country", type: "text" },
    { name: "rating", type: "number", min: 1, max: 5, defaultValue: 5 },
    { name: "quote", type: "textarea", required: true, localized: true },
    { name: "avatar", type: "upload", relationTo: "media" },
    {
      name: "featured",
      type: "checkbox",
      defaultValue: false,
      admin: { description: "Surface this testimonial on the home page." },
    },
  ],
};
