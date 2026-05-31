import type { CollectionConfig } from "payload";
import { slugField } from "../fields/slug";

export const BlogTags: CollectionConfig = {
  slug: "blog-tags",
  admin: {
    useAsTitle: "name",
    group: "Blog",
  },
  access: {
    read: () => true,
    create: ({ req: { user } }) =>
      ["super-admin", "seo-manager", "editor"].includes(user?.role ?? ""),
    update: ({ req: { user } }) =>
      ["super-admin", "seo-manager", "editor"].includes(user?.role ?? ""),
    delete: ({ req: { user } }) => user?.role === "super-admin",
  },
  fields: [
    { name: "name", type: "text", required: true, localized: true },
    slugField("name"),
  ],
};
