import type { CollectionConfig } from "payload";
import { seoFields } from "../fields/seo";
import { slugField } from "../fields/slug";

/**
 * Product categories — top-level taxonomy for the marketplace catalog.
 * Categories support the "industry landing pages" feature from brief §5.7.1
 * (Restaurants, Cafés, Hotels, Takeaways) plus product taxonomies like
 * Menus, Business cards, Packaging, Digital design services.
 */
export const ProductCategories: CollectionConfig = {
  slug: "product-categories",
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "kind", "order", "status"],
    group: "Commerce",
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
    { name: "name", type: "text", required: true, localized: true },
    slugField("name"),
    {
      name: "kind",
      type: "select",
      required: true,
      defaultValue: "physical",
      options: [
        { label: "Physical print product", value: "physical" },
        { label: "Digital design service", value: "digital" },
        { label: "Bespoke / quote-based", value: "bespoke" },
        { label: "Industry landing", value: "industry" },
      ],
    },
    { name: "description", type: "textarea", localized: true },
    { name: "heroImage", type: "upload", relationTo: "media" },
    {
      name: "parent",
      type: "relationship",
      relationTo: "product-categories",
      hasMany: false,
    },
    {
      name: "order",
      type: "number",
      defaultValue: 100,
      admin: { description: "Lower numbers appear first." },
    },
    {
      name: "status",
      type: "select",
      defaultValue: "published",
      admin: { position: "sidebar" },
      options: [
        { label: "Draft", value: "draft" },
        { label: "Published", value: "published" },
      ],
    },
    seoFields,
  ],
};
