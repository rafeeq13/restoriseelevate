import type { CollectionConfig } from "payload";
import { slugField } from "../fields/slug";

export const FAQCategories: CollectionConfig = {
  slug: "faq-categories",
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "order"],
    group: "FAQ",
  },
  access: {
    read: () => true,
    create: ({ req: { user } }) =>
      ["super-admin", "seo-manager", "editor"].includes(user?.role ?? ""),
    update: ({ req: { user } }) =>
      ["super-admin", "seo-manager", "editor"].includes(user?.role ?? ""),
    delete: ({ req: { user } }) => user?.role === "super-admin",
  },
  defaultSort: "order",
  fields: [
    { name: "name", type: "text", required: true, localized: true },
    slugField("name"),
    { name: "description", type: "textarea", localized: true },
    {
      name: "order",
      type: "number",
      defaultValue: 100,
      admin: { description: "Lower numbers appear first." },
    },
  ],
};
