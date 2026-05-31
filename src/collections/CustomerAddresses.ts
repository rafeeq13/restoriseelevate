import type { CollectionConfig } from "payload";

export const CustomerAddresses: CollectionConfig = {
  slug: "customer-addresses",
  admin: {
    useAsTitle: "label",
    defaultColumns: ["label", "customer", "country", "isDefaultShipping"],
    group: "Commerce",
  },
  access: {
    read: ({ req: { user } }) =>
      ["super-admin", "customer-service"].includes(user?.role ?? "") || !!user,
    create: ({ req: { user } }) => !!user,
    update: ({ req: { user } }) => !!user,
    delete: ({ req: { user } }) => !!user,
  },
  fields: [
    {
      name: "customer",
      type: "relationship",
      relationTo: "customers",
      required: true,
      hasMany: false,
    },
    { name: "label", type: "text", admin: { description: "e.g. Head office, Warehouse, Home" } },
    { name: "fullName", type: "text", required: true },
    { name: "company", type: "text" },
    { name: "line1", type: "text", required: true },
    { name: "line2", type: "text" },
    { name: "city", type: "text", required: true },
    { name: "region", type: "text" },
    { name: "postalCode", type: "text", required: true },
    { name: "country", type: "text", required: true },
    { name: "phone", type: "text" },
    { name: "isDefaultBilling", type: "checkbox", defaultValue: false },
    { name: "isDefaultShipping", type: "checkbox", defaultValue: false },
    {
      name: "validated",
      type: "checkbox",
      defaultValue: false,
      admin: { description: "Set to true once verified against the address-validation API." },
    },
  ],
};
