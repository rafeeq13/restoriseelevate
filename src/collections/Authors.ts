import type { CollectionConfig } from "payload";
import { slugField } from "../fields/slug";

export const Authors: CollectionConfig = {
  slug: "authors",
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
    { name: "name", type: "text", required: true },
    slugField("name"),
    { name: "role", type: "text" },
    { name: "bio", type: "textarea", localized: true },
    { name: "photo", type: "upload", relationTo: "media" },
    {
      name: "socials",
      type: "group",
      fields: [
        { name: "linkedin", type: "text" },
        { name: "twitter", type: "text" },
        { name: "website", type: "text" },
      ],
    },
  ],
};
