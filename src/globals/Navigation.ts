import type { GlobalConfig } from "payload";

export const Navigation: GlobalConfig = {
  slug: "navigation",
  admin: {
    group: "Settings",
  },
  access: {
    read: () => true,
    update: ({ req: { user } }) =>
      ["super-admin", "seo-manager"].includes(user?.role ?? ""),
  },
  fields: [
    {
      name: "primaryLinks",
      type: "array",
      label: "Primary navigation",
      fields: [
        { name: "label", type: "text", required: true, localized: true },
        { name: "href", type: "text", required: true },
        {
          name: "children",
          type: "array",
          fields: [
            { name: "label", type: "text", required: true, localized: true },
            { name: "href", type: "text", required: true },
            { name: "description", type: "textarea", localized: true },
          ],
        },
      ],
    },
    {
      name: "ctaLabel",
      type: "text",
      localized: true,
      defaultValue: "Start a project",
    },
    {
      name: "ctaHref",
      type: "text",
      defaultValue: "/contact",
    },
  ],
};
