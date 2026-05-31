import type { CollectionConfig } from "payload";
import { seoFields } from "../fields/seo";
import { slugField } from "../fields/slug";

/**
 * Services — the agency's service catalog from brief section 3.
 * Each entry powers a dedicated landing page with its own SEO and
 * lead-capture funnel. Service-packaging options (productized,
 * retainer, project) are surfaced on the page.
 */
export const Services: CollectionConfig = {
  slug: "services",
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "category", "status", "updatedAt"],
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
    drafts: true,
  },
  fields: [
    { name: "name", type: "text", required: true, localized: true },
    slugField("name"),
    {
      name: "category",
      type: "select",
      required: true,
      admin: { position: "sidebar" },
      options: [
        { label: "Performance Marketing & Advertising", value: "advertising" },
        { label: "Search Engine Optimization", value: "seo" },
        { label: "Social Media & Content", value: "social" },
        { label: "Creative & Design", value: "creative" },
        { label: "Software Development", value: "software" },
        { label: "Hospitality Operations", value: "operations" },
      ],
    },
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
    { name: "tagline", type: "text", localized: true },
    { name: "summary", type: "textarea", localized: true },
    { name: "heroImage", type: "upload", relationTo: "media" },
    {
      name: "deliverables",
      type: "array",
      fields: [
        { name: "label", type: "text", required: true, localized: true },
        { name: "description", type: "textarea", localized: true },
      ],
    },
    {
      name: "packages",
      type: "array",
      label: "Commercial packages",
      admin: {
        description:
          "Productized, retainer, and project-based options per brief §3.7.",
      },
      fields: [
        {
          name: "kind",
          type: "select",
          required: true,
          options: [
            { label: "Productized", value: "productized" },
            { label: "Retainer", value: "retainer" },
            { label: "Project", value: "project" },
          ],
        },
        { name: "name", type: "text", required: true, localized: true },
        { name: "summary", type: "textarea", localized: true },
        { name: "priceFrom", type: "text", localized: true },
        { name: "currency", type: "text", defaultValue: "USD" },
        {
          name: "inclusions",
          type: "array",
          fields: [
            { name: "item", type: "text", localized: true, required: true },
          ],
        },
      ],
    },
    {
      name: "caseStudies",
      type: "relationship",
      relationTo: "portfolio",
      hasMany: true,
    },
    {
      name: "relatedServices",
      type: "relationship",
      relationTo: "services",
      hasMany: true,
    },
    {
      name: "body",
      type: "richText",
      localized: true,
    },
    seoFields,
  ],
};
