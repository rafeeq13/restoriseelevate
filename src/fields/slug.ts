import type { Field } from "payload";

/**
 * Slug field with a basic auto-generate hook from a source field
 * (typically "title"). The source string is lowercased, stripped of
 * punctuation, and joined with hyphens.
 */
export const slugField = (source = "title"): Field => ({
  name: "slug",
  type: "text",
  required: true,
  unique: true,
  index: true,
  admin: {
    position: "sidebar",
    description: `URL slug. Auto-generated from "${source}" if left blank.`,
  },
  hooks: {
    beforeValidate: [
      ({ value, data }) => {
        if (value) return value;
        const src = (data?.[source] as string) ?? "";
        return src
          .toLowerCase()
          .replace(/[^a-z0-9\s-]/g, "")
          .trim()
          .replace(/\s+/g, "-")
          .replace(/-+/g, "-");
      },
    ],
  },
});
