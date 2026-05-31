import type { CollectionConfig } from "payload";
import { seoFields } from "../fields/seo";
import { slugField } from "../fields/slug";

/**
 * Products — the marketplace catalog covering physical print products,
 * digital design services, and bespoke quote-based offerings (brief §5.4).
 *
 * Variants carry the (size, material, finish) permutations and the tiered
 * quantity pricing. Material/finish surcharges (§5.5) ride on variants
 * directly rather than as a separate modifier engine.
 */
export const Products: CollectionConfig = {
  slug: "products",
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "category", "kind", "status", "updatedAt"],
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
  versions: { drafts: true },
  fields: [
    { name: "name", type: "text", required: true, localized: true },
    slugField("name"),
    {
      name: "category",
      type: "relationship",
      relationTo: "product-categories",
      required: true,
      hasMany: false,
    },
    {
      name: "kind",
      type: "select",
      required: true,
      defaultValue: "physical",
      options: [
        { label: "Physical print", value: "physical" },
        { label: "Digital service", value: "digital" },
        { label: "Bespoke / quote", value: "bespoke" },
      ],
    },
    { name: "summary", type: "textarea", localized: true },
    { name: "longDescription", type: "richText", localized: true },
    {
      name: "images",
      type: "array",
      fields: [
        { name: "image", type: "upload", relationTo: "media", required: true },
        { name: "caption", type: "text", localized: true },
        { name: "isHero", type: "checkbox", defaultValue: false },
      ],
    },
    {
      name: "options",
      type: "array",
      label: "Configurable options (size, material, finish)",
      admin: {
        description:
          "Drives the variant matrix and the on-page selectors. Each option lists the values the customer can pick.",
      },
      fields: [
        { name: "name", type: "text", required: true, localized: true },
        {
          name: "type",
          type: "select",
          required: true,
          options: [
            { label: "Size", value: "size" },
            { label: "Material", value: "material" },
            { label: "Finish", value: "finish" },
            { label: "Colour", value: "color" },
            { label: "Other", value: "other" },
          ],
        },
        {
          name: "values",
          type: "array",
          fields: [
            { name: "label", type: "text", required: true, localized: true },
            { name: "value", type: "text", required: true },
            {
              name: "surchargePercent",
              type: "number",
              defaultValue: 0,
              admin: { description: "Surcharge added to base price for this option value (e.g. matte vs gloss)." },
            },
          ],
        },
      ],
    },
    {
      name: "variants",
      type: "array",
      label: "Variants (option combinations)",
      admin: {
        description:
          "Optional concrete variants. If left empty the system derives variants from the option matrix.",
      },
      fields: [
        { name: "sku", type: "text", required: true },
        { name: "optionValues", type: "json" },
        { name: "basePrice", type: "number", required: true },
        { name: "currency", type: "select", defaultValue: "USD", options: ["USD", "GBP", "EUR"].map((c) => ({ label: c, value: c })) },
        {
          name: "tieredPricing",
          type: "array",
          fields: [
            { name: "minQuantity", type: "number", required: true },
            { name: "unitPrice", type: "number", required: true },
          ],
        },
        { name: "stockAvailable", type: "number" },
        { name: "weightGrams", type: "number" },
      ],
    },
    {
      name: "fulfillmentRules",
      type: "group",
      fields: [
        {
          name: "preferredPartner",
          type: "relationship",
          relationTo: "fulfillment-partners",
          hasMany: false,
        },
        {
          name: "allowedPartners",
          type: "relationship",
          relationTo: "fulfillment-partners",
          hasMany: true,
        },
        {
          name: "leadTimeDays",
          type: "number",
          admin: { description: "Production + dispatch days, before shipping." },
        },
      ],
    },
    {
      name: "artworkSpec",
      type: "group",
      label: "Artwork specification",
      admin: { description: "Drives validation on the artwork upload step." },
      fields: [
        {
          name: "acceptedFormats",
          type: "select",
          hasMany: true,
          defaultValue: ["pdf", "jpg", "png"],
          options: ["pdf", "ai", "eps", "psd", "jpg", "png", "svg"].map((f) => ({
            label: f.toUpperCase(),
            value: f,
          })),
        },
        { name: "minDpi", type: "number", defaultValue: 300 },
        {
          name: "colorMode",
          type: "select",
          defaultValue: "cmyk",
          options: [
            { label: "CMYK (print)", value: "cmyk" },
            { label: "RGB (digital)", value: "rgb" },
            { label: "Any", value: "any" },
          ],
        },
        { name: "bleedMm", type: "number", defaultValue: 3 },
        { name: "maxFileSizeMb", type: "number", defaultValue: 200 },
        { name: "templateDownload", type: "upload", relationTo: "media" },
      ],
    },
    {
      name: "supportsCustomizer",
      type: "checkbox",
      defaultValue: false,
      admin: {
        description: "If true, the product shows the in-browser design customizer.",
      },
    },
    {
      name: "status",
      type: "select",
      defaultValue: "draft",
      required: true,
      admin: { position: "sidebar" },
      options: [
        { label: "Draft", value: "draft" },
        { label: "Published", value: "published" },
        { label: "Archived", value: "archived" },
      ],
    },
    seoFields,
  ],
};
