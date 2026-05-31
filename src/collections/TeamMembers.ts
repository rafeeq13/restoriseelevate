import type { CollectionConfig } from "payload";
import { slugField } from "../fields/slug";

export const TeamMembers: CollectionConfig = {
  slug: "team-members",
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "role", "order"],
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
  defaultSort: "order",
  fields: [
    { name: "name", type: "text", required: true },
    slugField("name"),
    { name: "role", type: "text", required: true, localized: true },
    { name: "bio", type: "textarea", localized: true },
    { name: "photo", type: "upload", relationTo: "media" },
    {
      name: "order",
      type: "number",
      defaultValue: 100,
      admin: { description: "Lower numbers appear first." },
    },
    {
      name: "socials",
      type: "group",
      fields: [
        { name: "linkedin", type: "text" },
        { name: "twitter", type: "text" },
        { name: "instagram", type: "text" },
      ],
    },
  ],
};
