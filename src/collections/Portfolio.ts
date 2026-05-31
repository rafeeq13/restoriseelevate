import type { CollectionConfig } from "payload";
import { seoFields } from "../fields/seo";
import { slugField } from "../fields/slug";

/**
 * Portfolio — case studies with measurable outcomes per brief §4.1.
 */
export const Portfolio: CollectionConfig = {
  slug: "portfolio",
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "client", "industry", "status"],
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
  versions: { drafts: true },
  fields: [
    { name: "title", type: "text", required: true, localized: true },
    slugField("title"),
    { name: "client", type: "text", required: true },
    { name: "clientLogo", type: "upload", relationTo: "media" },
    {
      name: "industry",
      type: "select",
      options: [
        { label: "Restaurant", value: "restaurant" },
        { label: "Café", value: "cafe" },
        { label: "Takeaway", value: "takeaway" },
        { label: "Hotel", value: "hotel" },
        { label: "Cloud Kitchen", value: "cloud-kitchen" },
        { label: "Bakery", value: "bakery" },
        { label: "Bar", value: "bar" },
        { label: "Other", value: "other" },
      ],
    },
    { name: "country", type: "text" },
    { name: "summary", type: "textarea", localized: true },
    {
      name: "outcomes",
      type: "array",
      admin: { description: "Headline metrics shown on the case-study card." },
      fields: [
        { name: "metric", type: "text", required: true, localized: true },
        { name: "value", type: "text", required: true },
        { name: "context", type: "text", localized: true },
      ],
    },
    {
      name: "services",
      type: "relationship",
      relationTo: "services",
      hasMany: true,
    },
    { name: "heroImage", type: "upload", relationTo: "media" },
    {
      name: "gallery",
      type: "array",
      fields: [
        { name: "image", type: "upload", relationTo: "media", required: true },
        { name: "caption", type: "text", localized: true },
      ],
    },
    { name: "body", type: "richText", localized: true },
    {
      name: "status",
      type: "select",
      defaultValue: "draft",
      admin: { position: "sidebar" },
      options: [
        { label: "Draft", value: "draft" },
        { label: "Published", value: "published" },
      ],
    },
    seoFields,
  ],
};
