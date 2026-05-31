import type { CollectionConfig } from "payload";

export const Users: CollectionConfig = {
  slug: "users",
  admin: {
    useAsTitle: "email",
    defaultColumns: ["name", "email", "role"],
    group: "Admin",
  },
  auth: {
    tokenExpiration: 60 * 60 * 24 * 7,
    maxLoginAttempts: 5,
    lockTime: 1000 * 60 * 15,
    cookies: {
      sameSite: "Lax",
      secure: process.env.NODE_ENV === "production",
    },
  },
  access: {
    read: ({ req: { user } }) => Boolean(user),
    create: ({ req: { user } }) => user?.role === "super-admin",
    update: ({ req: { user }, id }) =>
      user?.role === "super-admin" || user?.id === id,
    delete: ({ req: { user } }) => user?.role === "super-admin",
  },
  fields: [
    { name: "name", type: "text", required: true },
    {
      name: "role",
      type: "select",
      required: true,
      defaultValue: "viewer",
      options: [
        { label: "Super Admin", value: "super-admin" },
        { label: "SEO Manager", value: "seo-manager" },
        { label: "Editor", value: "editor" },
        { label: "Designer", value: "designer" },
        { label: "Customer Service", value: "customer-service" },
        { label: "Viewer", value: "viewer" },
      ],
    },
    {
      name: "twoFactorEnabled",
      type: "checkbox",
      defaultValue: false,
      admin: {
        description:
          "Two-factor authentication. Recommended for Super Admin and SEO Manager roles.",
      },
    },
  ],
};
