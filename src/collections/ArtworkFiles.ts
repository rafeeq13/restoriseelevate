import type { CollectionConfig } from "payload";

/**
 * Artwork files — customer-uploaded files (logos, menus, packaging artwork)
 * scoped to a single customer. Access is private — file URLs are not
 * enumerable per brief §12.3. Files are validated on upload (format, size,
 * dimensions, colour mode) and the outcome is recorded for ops.
 */
export const ArtworkFiles: CollectionConfig = {
  slug: "artwork-files",
  admin: {
    useAsTitle: "filename",
    defaultColumns: ["filename", "customer", "product", "validationStatus", "createdAt"],
    group: "Commerce",
  },
  access: {
    read: ({ req: { user } }) =>
      ["super-admin", "designer", "customer-service"].includes(user?.role ?? "")
        ? true
        : { customer: { equals: user?.id } },
    create: ({ req: { user } }) => !!user,
    update: ({ req: { user } }) =>
      ["super-admin", "designer", "customer-service"].includes(user?.role ?? ""),
    delete: ({ req: { user } }) => user?.role === "super-admin",
  },
  upload: {
    mimeTypes: [
      "application/pdf",
      "image/jpeg",
      "image/png",
      "image/svg+xml",
      "application/postscript",
      "application/illustrator",
      "image/vnd.adobe.photoshop",
    ],
  },
  fields: [
    {
      name: "customer",
      type: "relationship",
      relationTo: "customers",
      hasMany: false,
      index: true,
    },
    {
      name: "product",
      type: "relationship",
      relationTo: "products",
      hasMany: false,
    },
    {
      name: "order",
      type: "relationship",
      relationTo: "orders",
      hasMany: false,
      admin: { description: "Linked at checkout time once an order is created." },
    },
    {
      name: "validationStatus",
      type: "select",
      defaultValue: "pending",
      options: [
        { label: "Pending validation", value: "pending" },
        { label: "Passed", value: "passed" },
        { label: "Passed with warnings", value: "warning" },
        { label: "Failed", value: "failed" },
      ],
    },
    {
      name: "validationReport",
      type: "json",
      admin: { description: "Raw validation output: detected format, dimensions, channels, colour mode, file size, warnings." },
    },
    {
      name: "approvedByCustomer",
      type: "checkbox",
      defaultValue: false,
      admin: { description: "Customer signed off the artwork (brief §5.6 design approval workflow)." },
    },
    { name: "approvedAt", type: "date" },
    { name: "notes", type: "textarea" },
  ],
  hooks: {
    afterChange: [
      async ({ doc, operation, req }) => {
        if (operation !== "create") return doc;
        const mimeType = (doc as { mimeType?: string }).mimeType ?? "";
        const filesize = (doc as { filesize?: number }).filesize ?? 0;

        const report: Record<string, unknown> = {
          inspectedAt: new Date().toISOString(),
          mimeType,
          filesizeBytes: filesize,
          warnings: [] as string[],
        };
        let status: "passed" | "warning" | "failed" = "passed";

        if (filesize > 200 * 1024 * 1024) {
          status = "failed";
          (report.warnings as string[]).push(
            "File exceeds 200MB. Reduce file size or contact support.",
          );
        }

        if (mimeType.startsWith("image/") && mimeType !== "image/svg+xml") {
          try {
            const sharp = (await import("sharp")).default;
            const incoming = (req as unknown as { file?: { data?: Buffer } })
              .file?.data;
            if (incoming) {
              const meta = await sharp(incoming).metadata();
              report.width = meta.width;
              report.height = meta.height;
              report.channels = meta.channels;
              report.colorSpace = meta.space;
              report.format = meta.format;
              report.density = meta.density;
              if (meta.space && meta.space !== "cmyk") {
                status = status === "passed" ? "warning" : status;
                (report.warnings as string[]).push(
                  "Colour space is not CMYK. Print colours may shift; check with your designer.",
                );
              }
              if (meta.density && meta.density < 300) {
                status = status === "passed" ? "warning" : status;
                (report.warnings as string[]).push(
                  `Image density is ${meta.density} DPI; print products typically require 300 DPI.`,
                );
              }
            } else {
              (report.warnings as string[]).push(
                "Could not inspect file contents (storage adapter buffer not exposed). Manual review required.",
              );
              status = status === "passed" ? "warning" : status;
            }
          } catch (err) {
            (report.warnings as string[]).push(
              `Inspection failed: ${err instanceof Error ? err.message : "unknown"}`,
            );
            status = status === "passed" ? "warning" : status;
          }
        } else if (
          mimeType === "application/pdf" ||
          mimeType === "application/postscript" ||
          mimeType === "application/illustrator" ||
          mimeType === "image/vnd.adobe.photoshop"
        ) {
          (report.warnings as string[]).push(
            "PDF/EPS/AI/PSD files require manual pre-press review for bleed, trim, and colour fidelity.",
          );
          status = "warning";
        }

        try {
          await req.payload.update({
            collection: "artwork-files",
            id: (doc as { id: string | number }).id,
            data: {
              validationStatus: status,
              validationReport: report,
            } as unknown as Parameters<typeof req.payload.update>[0]["data"],
          });
        } catch (err) {
          req.payload.logger.warn(
            { err },
            "[artwork-files] Could not persist validation report",
          );
        }
        return doc;
      },
    ],
  },
};
