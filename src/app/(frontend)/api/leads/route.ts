import { NextResponse } from "next/server";
import { getPayload } from "payload";
import config from "@/payload.config";

/* ---------------------------------------------------------------------------
 * POST /api/leads — accepts lead-capture submissions from the public modal.
 * - Validates required fields.
 * - Verifies reCAPTCHA v3 token when configured.
 * - Persists to the `leads` collection (flagging suspicious submissions).
 * - Fires acknowledgement + notification emails when SMTP is configured.
 * - Returns 202 Accepted (or 400 on validation error) — never echoes PII.
 * - CRM and email-marketing sync are stubbed and invoked asynchronously.
 * -------------------------------------------------------------------------*/

const REQUIRED: Array<keyof IncomingPayload> = [
  "firstName",
  "lastName",
  "email",
  "phoneCountryCode",
  "phone",
  "businessName",
  "businessType",
  "country",
  "city",
  "message",
];

type IncomingPayload = {
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneCountryCode?: string;
  phone?: string;
  businessName?: string;
  businessType?: string;
  country?: string;
  city?: string;
  servicesRequired?: string[];
  message?: string;
  recaptchaToken?: string | null;
  source?: Record<string, string | undefined>;
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

async function verifyRecaptcha(token: string | null | undefined) {
  const secret = process.env.RECAPTCHA_SECRET_KEY;
  if (!secret) return { ok: true, score: null as number | null };
  if (!token) return { ok: false, score: 0 };
  try {
    const res = await fetch(
      "https://www.google.com/recaptcha/api/siteverify",
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ secret, response: token }).toString(),
      },
    );
    const data = (await res.json()) as {
      success?: boolean;
      score?: number;
      action?: string;
    };
    return {
      ok: Boolean(data.success) && (data.score ?? 0) >= 0.3,
      score: data.score ?? null,
    };
  } catch {
    return { ok: false, score: null };
  }
}

export async function POST(req: Request) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "unknown";

  let body: IncomingPayload;
  try {
    body = (await req.json()) as IncomingPayload;
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }

  // Required field validation.
  for (const key of REQUIRED) {
    if (!body[key] || (typeof body[key] === "string" && !String(body[key]).trim())) {
      return NextResponse.json(
        { error: `Missing required field: ${key}` },
        { status: 400 },
      );
    }
  }

  if (!EMAIL_REGEX.test(String(body.email))) {
    return NextResponse.json(
      { error: "Invalid email address." },
      { status: 400 },
    );
  }

  const captcha = await verifyRecaptcha(body.recaptchaToken);

  let payload;
  try {
    payload = await getPayload({ config });
  } catch (err) {
    console.error("[leads] Payload init failed:", err);
    return NextResponse.json(
      { error: "Service temporarily unavailable. Please try again shortly." },
      { status: 503 },
    );
  }

  let leadId: number | string | undefined;
  try {
    const services = Array.isArray(body.servicesRequired)
      ? body.servicesRequired
      : [];

    const created = await payload.create({
      collection: "leads",
      data: {
        firstName: String(body.firstName),
        lastName: String(body.lastName),
        email: String(body.email).toLowerCase().trim(),
        phoneCountryCode: String(body.phoneCountryCode),
        phone: String(body.phone),
        businessName: String(body.businessName),
        businessType: String(body.businessType),
        country: String(body.country),
        city: String(body.city),
        // Service slugs are passed by the modal; the admin can map them
        // to actual Service records during triage. Stored as plain text in
        // the message preamble so admins see what was requested even
        // before the catalog is fully seeded.
        message: services.length
          ? `Services requested: ${services.join(", ")}\n\n${body.message}`
          : String(body.message),
        source: body.source ?? {},
        status: "new",
        flagged: !captcha.ok,
        recaptchaScore: captcha.score ?? undefined,
      } as unknown as Parameters<typeof payload.create>[0]["data"],
    });
    leadId = (created as { id: number | string }).id;
  } catch (err) {
    console.error("[leads] Create failed:", err);
    return NextResponse.json(
      { error: "Could not save your submission." },
      { status: 500 },
    );
  }

  // Notification + acknowledgement emails. Best-effort.
  const notifyTo =
    process.env.LEADS_NOTIFY_EMAIL ?? "contact.restorise@gmail.com";
  try {
    await payload.sendEmail({
      to: notifyTo,
      subject: `New lead: ${body.businessName} (${body.country})`,
      text:
        `New lead submitted via the website.\n\n` +
        `Name: ${body.firstName} ${body.lastName}\n` +
        `Business: ${body.businessName} (${body.businessType})\n` +
        `Email: ${body.email}\n` +
        `Phone: ${body.phoneCountryCode} ${body.phone}\n` +
        `Location: ${body.city}, ${body.country}\n` +
        `Services: ${(body.servicesRequired ?? []).join(", ") || "—"}\n` +
        `IP: ${ip}\n` +
        `reCAPTCHA score: ${captcha.score ?? "n/a"}\n\n` +
        `Message:\n${body.message}\n`,
    });
  } catch (err) {
    console.warn("[leads] Notification email skipped:", err);
  }

  try {
    await payload.sendEmail({
      to: String(body.email),
      subject: "We received your enquiry — Restorise",
      text:
        `Hi ${body.firstName},\n\n` +
        `Thanks for reaching out to Restorise Business Solutions. ` +
        `We've received your enquiry and a member of our team will be in ` +
        `touch within one working day.\n\n` +
        `If your need is urgent, reply to this email and we'll prioritise it.\n\n` +
        `— The Restorise team`,
    });
  } catch (err) {
    console.warn("[leads] Acknowledgement email skipped:", err);
  }

  // CRM + email marketing sync stubs (wire up keys via env to activate).
  void syncToCrm({ leadId, body }).catch((e) =>
    console.warn("[leads] CRM sync failed:", e),
  );
  void syncToEmailMarketing({ leadId, body }).catch((e) =>
    console.warn("[leads] Email marketing sync failed:", e),
  );

  return NextResponse.json({ ok: true }, { status: 202 });
}

async function syncToCrm({
  leadId,
  body,
}: {
  leadId?: string | number;
  body: IncomingPayload;
}) {
  const provider = process.env.CRM_PROVIDER ?? "hubspot";
  if (provider === "hubspot") {
    const token = process.env.HUBSPOT_PRIVATE_APP_TOKEN;
    if (!token) return;
    await fetch("https://api.hubapi.com/crm/v3/objects/contacts", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        properties: {
          email: body.email,
          firstname: body.firstName,
          lastname: body.lastName,
          phone: `${body.phoneCountryCode} ${body.phone}`,
          company: body.businessName,
          city: body.city,
          country: body.country,
          lifecyclestage: "lead",
          hs_lead_status: "NEW",
          message: body.message,
          source: "Restorise website",
          internal_lead_id: String(leadId ?? ""),
        },
      }),
    });
  }
}

async function syncToEmailMarketing({
  leadId: _leadId,
  body,
}: {
  leadId?: string | number;
  body: IncomingPayload;
}) {
  const provider = process.env.EMAIL_MARKETING_PROVIDER ?? "brevo";
  if (provider === "brevo") {
    const key = process.env.BREVO_API_KEY;
    if (!key) return;
    await fetch("https://api.brevo.com/v3/contacts", {
      method: "POST",
      headers: {
        "api-key": key,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: body.email,
        attributes: {
          FIRSTNAME: body.firstName,
          LASTNAME: body.lastName,
          SMS: `${body.phoneCountryCode}${body.phone}`,
          BUSINESS: body.businessName,
          COUNTRY: body.country,
          CITY: body.city,
        },
        updateEnabled: true,
      }),
    });
  }
}
