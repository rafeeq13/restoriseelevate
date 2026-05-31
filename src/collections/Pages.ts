import type { CollectionConfig } from "payload";
import { seoFields } from "../fields/seo";
import { slugField } from "../fields/slug";

/**
 * Pages — catch-all marketing content (Home, About, Privacy, Terms, Cookies,
 * plus any future evergreen pages). Service landing pages live in the
 * Services collection so they can carry service-specific schema.
 *
 * Pages are localized: editorial source is English, with the six other
 * first-class languages editable side-by-side.
 */
export const Pages: CollectionConfig = {
  slug: "pages",
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "slug", "status", "updatedAt"],
    group: "Content",
  },
  access: {
    read: () => true,
    create: ({ req: { user } }) =>
      ["super-admin", "seo-manager", "editor"].includes(user?.role ?? ""),
    update: ({ req: { user } }) =>
      ["super-admin", "seo-manager", "editor"].includes(user?.role ?? ""),
    delete: ({ req: { user } }) => user?.role === "super-admin",
  },
  versions: {
    drafts: {
      autosave: { interval: 2000 },
    },
    maxPerDoc: 25,
  },
  fields: [
    {
      name: "title",
      type: "text",
      required: true,
      localized: true,
    },
    slugField("title"),
    {
      name: "status",
      type: "select",
      defaultValue: "draft",
      required: true,
      admin: { position: "sidebar" },
      options: [
        { label: "Draft", value: "draft" },
        { label: "Published", value: "published" },
      ],
    },
    {
      name: "hero",
      type: "group",
      label: "Hero",
      fields: [
        { name: "eyebrow", type: "text", localized: true },
        { name: "heading", type: "text", localized: true },
        { name: "subheading", type: "textarea", localized: true },
        {
          name: "primaryCta",
          type: "group",
          fields: [
            { name: "label", type: "text", localized: true },
            { name: "href", type: "text" },
          ],
        },
        {
          name: "secondaryCta",
          type: "group",
          fields: [
            { name: "label", type: "text", localized: true },
            { name: "href", type: "text" },
          ],
        },
        { name: "image", type: "upload", relationTo: "media" },
      ],
    },
    {
      name: "body",
      type: "richText",
      localized: true,
    },
    seoFields,
  ],
};
