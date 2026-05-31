import type { CollectionConfig } from "payload";

/**
 * FAQ items — per brief §8.
 * - Per-question analytics counters (viewCount, helpful, notHelpful)
 *   are surfaced for the admin and incremented from public endpoints.
 * - The drag-and-drop ordering uses the `order` field.
 */
export const FAQItems: CollectionConfig = {
  slug: "faq-items",
  admin: {
    useAsTitle: "question",
    defaultColumns: ["question", "category", "order", "viewCount"],
    group: "FAQ",
  },
  access: {
    read: () => true,
    create: ({ req: { user } }) =>
      ["super-admin", "seo-manager", "editor"].includes(user?.role ?? ""),
    update: ({ req: { user } }) =>
      ["super-admin", "seo-manager", "editor"].includes(user?.role ?? ""),
    delete: ({ req: { user } }) =>
      ["super-admin", "seo-manager"].includes(user?.role ?? ""),
  },
  defaultSort: "order",
  fields: [
    {
      name: "category",
      type: "relationship",
      relationTo: "faq-categories",
      required: true,
    },
    { name: "question", type: "text", required: true, localized: true },
    {
      name: "answer",
      type: "richText",
      required: true,
      localized: true,
    },
    {
      name: "order",
      type: "number",
      defaultValue: 100,
      admin: { description: "Lower numbers appear first within the category." },
    },
    {
      name: "viewCount",
      type: "number",
      defaultValue: 0,
      admin: { readOnly: true, position: "sidebar" },
    },
    {
      name: "helpfulCount",
      type: "number",
      defaultValue: 0,
      admin: { readOnly: true, position: "sidebar" },
    },
    {
      name: "notHelpfulCount",
      type: "number",
      defaultValue: 0,
      admin: { readOnly: true, position: "sidebar" },
    },
  ],
};
