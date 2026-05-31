import type { CollectionConfig } from "payload";

/**
 * Design projects — in-house design work for orders that include the
 * agency's design service (logo, menu, branding kit, etc.). Provides the
 * revision/approval workflow + designer-customer messaging surface from
 * brief §5.6.
 */
export const DesignProjects: CollectionConfig = {
  slug: "design-projects",
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "customer", "designer", "status", "updatedAt"],
    group: "Commerce",
  },
  access: {
    read: ({ req: { user } }) =>
      ["super-admin", "designer", "customer-service"].includes(user?.role ?? "")
        ? true
        : { customer: { equals: user?.id } },
    create: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => user?.role === "super-admin",
  },
  fields: [
    { name: "title", type: "text", required: true },
    {
      name: "customer",
      type: "relationship",
      relationTo: "customers",
      required: true,
      hasMany: false,
    },
    {
      name: "designer",
      type: "relationship",
      relationTo: "users",
      hasMany: false,
      admin: { description: "Assigned in-house designer (Users with role=designer)." },
    },
    {
      name: "order",
      type: "relationship",
      relationTo: "orders",
      hasMany: false,
    },
    {
      name: "brief",
      type: "richText",
      admin: { description: "Customer-supplied brief or internal interpretation of it." },
    },
    {
      name: "status",
      type: "select",
      defaultValue: "brief-pending",
      options: [
        { label: "Brief pending", value: "brief-pending" },
        { label: "In progress", value: "in-progress" },
        { label: "Awaiting customer review", value: "review" },
        { label: "Revisions requested", value: "revisions" },
        { label: "Approved", value: "approved" },
        { label: "Delivered", value: "delivered" },
      ],
    },
    {
      name: "revisions",
      type: "array",
      fields: [
        { name: "label", type: "text", required: true },
        { name: "submittedAt", type: "date", required: true },
        { name: "files", type: "relationship", relationTo: "artwork-files", hasMany: true },
        { name: "customerFeedback", type: "textarea" },
        { name: "designerNotes", type: "textarea" },
      ],
    },
    {
      name: "messages",
      type: "array",
      label: "Customer ↔ designer messaging",
      fields: [
        { name: "sentAt", type: "date", required: true },
        {
          name: "author",
          type: "select",
          required: true,
          options: [
            { label: "Customer", value: "customer" },
            { label: "Designer", value: "designer" },
            { label: "Account manager", value: "account-manager" },
          ],
        },
        { name: "body", type: "textarea", required: true },
        { name: "attachments", type: "relationship", relationTo: "artwork-files", hasMany: true },
      ],
    },
  ],
};
