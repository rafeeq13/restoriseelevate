import type { CollectionConfig } from "payload";
import { seoFields } from "../fields/seo";
import { slugField } from "../fields/slug";

/**
 * Blog posts — SEO content hub per brief §7.
 * Supports drafts, scheduling, featured/pinned, reading-time, and
 * per-post SEO overrides.
 */
export const BlogPosts: CollectionConfig = {
  slug: "blog-posts",
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "category", "status", "publishedAt"],
    group: "Blog",
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
  versions: {
    drafts: {
      autosave: { interval: 2000 },
    },
    maxPerDoc: 25,
  },
  fields: [
    { name: "title", type: "text", required: true, localized: true },
    slugField("title"),
    { name: "excerpt", type: "textarea", localized: true },
    { name: "featuredImage", type: "upload", relationTo: "media" },
    {
      name: "author",
      type: "relationship",
      relationTo: "authors",
      required: true,
    },
    {
      name: "category",
      type: "relationship",
      relationTo: "blog-categories",
      required: true,
    },
    {
      name: "tags",
      type: "relationship",
      relationTo: "blog-tags",
      hasMany: true,
    },
    {
      name: "body",
      type: "richText",
      localized: true,
      required: true,
    },
    {
      name: "readingTimeMinutes",
      type: "number",
      admin: {
        description:
          "Auto-computed from body length; editable for manual override.",
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
        { label: "Scheduled", value: "scheduled" },
        { label: "Published", value: "published" },
      ],
    },
    {
      name: "publishedAt",
      type: "date",
      admin: {
        position: "sidebar",
        description:
          "Set in the future and Status=Scheduled to schedule publication.",
      },
    },
    {
      name: "featured",
      type: "checkbox",
      defaultValue: false,
      admin: {
        position: "sidebar",
        description: "Surface on the home page and blog index.",
      },
    },
    {
      name: "pinned",
      type: "checkbox",
      defaultValue: false,
      admin: {
        position: "sidebar",
        description: "Keep at the top of the blog index until unpinned.",
      },
    },
    {
      name: "relatedPostsOverride",
      type: "relationship",
      relationTo: "blog-posts",
      hasMany: true,
      admin: {
        description:
          "Override auto-derived related posts (defaults to category + tag overlap).",
      },
    },
    seoFields,
  ],
  hooks: {
    beforeChange: [
      ({ data }) => {
        // Naive reading-time estimate: 200 wpm.
        if (!data.readingTimeMinutes && data.body) {
          try {
            const text = JSON.stringify(data.body);
            const words = text.split(/\s+/).length;
            data.readingTimeMinutes = Math.max(1, Math.round(words / 200));
          } catch {
            // Ignore JSON serialization failures; field stays unset.
          }
        }
        return data;
      },
    ],
  },
};
