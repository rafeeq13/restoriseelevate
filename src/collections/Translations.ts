import type { CollectionConfig } from "payload";

/**
 * Translations — per-key UI string overrides used to refine machine-translated
 * locales over time (brief §4.5.3). Each row is keyed by (locale, namespace,
 * key) and overlays the JSON message catalog at request time.
 *
 * Source field distinguishes manual entries from machine-cached entries; the
 * admin can flip a machine entry to manual after editing.
 */
export const Translations: CollectionConfig = {
  slug: "translations",
  admin: {
    useAsTitle: "key",
    defaultColumns: ["namespace", "key", "locale", "source", "updatedAt"],
    group: "i18n",
    description:
      "Per-key UI string overrides. Edits take precedence over the JSON message catalogue and over DeepL fallback output.",
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
  indexes: [
    {
      fields: ["locale", "namespace", "key"],
      unique: true,
    },
  ],
  fields: [
    {
      name: "locale",
      type: "text",
      required: true,
      index: true,
      admin: {
        description:
          "BCP-47 locale code, e.g. `de`, `fr-CH`, `pt-BR`. Match the routing locale.",
      },
    },
    {
      name: "namespace",
      type: "text",
      required: true,
      admin: { description: "Top-level key in messages/<locale>.json (e.g. Nav, Footer, LeadModal)." },
    },
    {
      name: "key",
      type: "text",
      required: true,
      admin: {
        description:
          "Dot-delimited key path within the namespace (e.g. `startProject`, `submit.cta`).",
      },
    },
    { name: "value", type: "textarea", required: true },
    {
      name: "source",
      type: "select",
      required: true,
      defaultValue: "manual",
      admin: { position: "sidebar" },
      options: [
        { label: "Manual (professional translation)", value: "manual" },
        { label: "Machine (DeepL / Google cache)", value: "machine" },
      ],
    },
    {
      name: "provider",
      type: "text",
      admin: {
        position: "sidebar",
        description: "Set automatically for machine entries (e.g. `deepl`, `google`).",
      },
    },
  ],
};
