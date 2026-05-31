import type { Field } from "payload";

/**
 * SEO fields shared across Pages, BlogPosts, Services, etc.
 * Implements brief section 4.2.1 — per-page editable meta title,
 * description, canonical URL, OG image, Twitter card.
 */
export const seoFields: Field = {
  name: "seo",
  type: "group",
  label: "SEO",
  admin: {
    description:
      "Per-page metadata. Leave blank to inherit sensible defaults from the page title and global site settings.",
  },
  fields: [
    {
      name: "metaTitle",
      type: "text",
      maxLength: 65,
      localized: true,
      admin: { description: "Recommended ≤ 60 characters." },
    },
    {
      name: "metaDescription",
      type: "textarea",
      maxLength: 165,
      localized: true,
      admin: { description: "Recommended 140–160 characters." },
    },
    {
      name: "focusKeyword",
      type: "text",
      localized: true,
      admin: {
        description:
          "Primary keyword for this page. Used internally for editorial QA, not rendered.",
      },
    },
    {
      name: "canonicalUrl",
      type: "text",
      admin: {
        description:
          "Override the canonical URL. Leave blank to canonicalize to this page's own URL.",
      },
    },
    {
      name: "ogImage",
      type: "upload",
      relationTo: "media",
      admin: {
        description:
          "Open Graph / Twitter card image. Recommended 1200×630px.",
      },
    },
    {
      name: "noindex",
      type: "checkbox",
      defaultValue: false,
      admin: {
        description:
          "Exclude this page from search engine indexing.",
      },
    },
    {
      name: "structuredDataOverride",
      type: "json",
      admin: {
        description:
          "Optional JSON-LD object that replaces the auto-generated schema for this page.",
      },
    },
  ],
};
