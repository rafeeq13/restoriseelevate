import type { CollectionConfig } from "payload";

export const Media: CollectionConfig = {
  slug: "media",
  admin: {
    useAsTitle: "filename",
    group: "Content",
    description:
      "Centralized media library: uploads, focal point selection, alt text, captions.",
  },
  access: {
    read: () => true,
    create: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) =>
      user?.role === "super-admin" || user?.role === "designer",
  },
  upload: {
    staticDir: "media",
    mimeTypes: [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/avif",
      "image/svg+xml",
      "image/gif",
      "application/pdf",
    ],
    imageSizes: [
      { name: "thumbnail", width: 400, height: 300, position: "centre" },
      { name: "card", width: 768, height: 1024, position: "centre" },
      { name: "tablet", width: 1024, position: "centre" },
      { name: "desktop", width: 1600, position: "centre" },
    ],
    focalPoint: true,
    crop: true,
    formatOptions: {
      format: "webp",
      options: { quality: 82 },
    },
  },
  fields: [
    {
      name: "alt",
      type: "text",
      required: true,
      admin: {
        description:
          "Required for accessibility (WCAG 2.1 AA) and SEO. Describe the image's purpose.",
      },
    },
    {
      name: "caption",
      type: "text",
    },
    {
      name: "credit",
      type: "text",
      admin: {
        description: "Photographer, designer, or source attribution (optional).",
      },
    },
  ],
};
