import type { GlobalConfig } from "payload";

export const Footer: GlobalConfig = {
  slug: "footer",
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
      name: "columns",
      type: "array",
      fields: [
        { name: "heading", type: "text", required: true, localized: true },
        {
          name: "links",
          type: "array",
          fields: [
            { name: "label", type: "text", required: true, localized: true },
            { name: "href", type: "text", required: true },
          ],
        },
      ],
    },
    {
      name: "legalLinks",
      type: "array",
      fields: [
        { name: "label", type: "text", required: true, localized: true },
        { name: "href", type: "text", required: true },
      ],
    },
    {
      name: "copyright",
      type: "text",
      localized: true,
      defaultValue: "© Restorise Business Solutions. All rights reserved.",
    },
  ],
};
