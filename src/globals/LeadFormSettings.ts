import type { GlobalConfig } from "payload";

/**
 * Lead-capture modal copy and notification settings (brief §4.4).
 * Acknowledgement email template is editable from the admin per §4.4.3.
 */
export const LeadFormSettings: GlobalConfig = {
  slug: "lead-form-settings",
  admin: {
    group: "Settings",
    description:
      "Controls the site-wide lead capture modal copy and notification flow.",
  },
  access: {
    read: () => true,
    update: ({ req: { user } }) =>
      ["super-admin", "seo-manager", "customer-service"].includes(
        user?.role ?? "",
      ),
  },
  fields: [
    {
      name: "modal",
      type: "group",
      fields: [
        {
          name: "eyebrow",
          type: "text",
          localized: true,
          defaultValue: "Let's talk",
        },
        {
          name: "heading",
          type: "text",
          localized: true,
          defaultValue: "Tell us about your business",
        },
        {
          name: "subheading",
          type: "textarea",
          localized: true,
          defaultValue:
            "Share a few details and our team will reply within one working day with next steps.",
        },
        {
          name: "submitLabel",
          type: "text",
          localized: true,
          defaultValue: "Send",
        },
        {
          name: "successHeading",
          type: "text",
          localized: true,
          defaultValue: "Thanks — we've got it.",
        },
        {
          name: "successMessage",
          type: "textarea",
          localized: true,
          defaultValue:
            "A team member will be in touch within one working day. Check your inbox for confirmation.",
        },
        {
          name: "privacyNote",
          type: "textarea",
          localized: true,
          defaultValue:
            "By submitting this form you agree to our Privacy Policy.",
        },
      ],
    },
    {
      name: "acknowledgementEmail",
      type: "group",
      fields: [
        {
          name: "subject",
          type: "text",
          localized: true,
          defaultValue: "We received your enquiry — Restorise",
        },
        {
          name: "body",
          type: "richText",
          localized: true,
        },
      ],
    },
  ],
};
