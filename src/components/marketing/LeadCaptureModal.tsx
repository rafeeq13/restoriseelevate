"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter, usePathname } from "next/navigation";

/* ---------------------------------------------------------------------------
 * Lead capture modal — implements brief §4.4.
 * - Trigger: 5s after load OR 30% scroll depth, whichever first.
 * - Session storage flag prevents reappearance on same browsing session
 *   (a new tab or new session presents it again).
 * - Closed state is keyed per-path so subsequent navigations re-trigger.
 * - reCAPTCHA v3 is invoked at submit time; suspicious submissions are
 *   flagged in the admin rather than dropped.
 * -------------------------------------------------------------------------*/

const SESSION_KEY = "restorise:lead-modal:dismissed";
const SCROLL_THRESHOLD = 0.3;
const TIME_DELAY_MS = 5000;

const BUSINESS_TYPES = [
  { value: "restaurant", label: "Restaurant" },
  { value: "takeaway", label: "Takeaway" },
  { value: "cafe", label: "Café" },
  { value: "hotel", label: "Hotel" },
  { value: "cloud-kitchen", label: "Cloud Kitchen" },
  { value: "bakery", label: "Bakery" },
  { value: "bar", label: "Bar" },
  { value: "other", label: "Other" },
] as const;

const SERVICES = [
  { value: "meta-ads", label: "Meta Ads" },
  { value: "google-ads", label: "Google Ads" },
  { value: "seo", label: "SEO" },
  { value: "social-media", label: "Social Media Management" },
  { value: "video-editing", label: "Video Editing" },
  { value: "graphics-design", label: "Graphics Design" },
  { value: "web-development", label: "Web Development" },
  { value: "mobile-apps", label: "Mobile App Development" },
  { value: "pos-setup", label: "POS Setup" },
  { value: "delivery-platforms", label: "Delivery Platform Setup" },
  { value: "menu-management", label: "Menu Management on Delivery Apps" },
] as const;

const COUNTRIES = [
  "United Kingdom",
  "United States",
  "Canada",
  "Australia",
  "Ireland",
  "Germany",
  "France",
  "Spain",
  "Italy",
  "Netherlands",
  "Belgium",
  "Portugal",
  "United Arab Emirates",
  "Saudi Arabia",
  "Other",
];

const COUNTRY_CODES = [
  { code: "+44", label: "UK (+44)" },
  { code: "+1", label: "US / CA (+1)" },
  { code: "+61", label: "AU (+61)" },
  { code: "+353", label: "IE (+353)" },
  { code: "+49", label: "DE (+49)" },
  { code: "+33", label: "FR (+33)" },
  { code: "+34", label: "ES (+34)" },
  { code: "+39", label: "IT (+39)" },
  { code: "+31", label: "NL (+31)" },
  { code: "+32", label: "BE (+32)" },
  { code: "+351", label: "PT (+351)" },
  { code: "+971", label: "AE (+971)" },
  { code: "+966", label: "SA (+966)" },
];

type FormState = {
  firstName: string;
  lastName: string;
  email: string;
  phoneCountryCode: string;
  phone: string;
  businessName: string;
  businessType: string;
  country: string;
  city: string;
  servicesRequired: string[];
  message: string;
  website: string; // honeypot
};

const emptyForm: FormState = {
  firstName: "",
  lastName: "",
  email: "",
  phoneCountryCode: "+44",
  phone: "",
  businessName: "",
  businessType: "",
  country: "",
  city: "",
  servicesRequired: [],
  message: "",
  website: "",
};

declare global {
  interface Window {
    grecaptcha?: {
      ready: (cb: () => void) => void;
      execute: (siteKey: string, opts: { action: string }) => Promise<string>;
    };
  }
}

export function LeadCaptureModal() {
  const t = useTranslations("LeadModal");
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const triggeredRef = useRef(false);
  const pathname = usePathname();
  const router = useRouter();
  const recaptchaSiteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY ?? "";

  useEffect(() => {
    triggeredRef.current = false;
    setOpen(false);
    setSubmitted(false);
    setError(null);
  }, [pathname]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const dismissed = window.sessionStorage.getItem(SESSION_KEY);
    if (dismissed) return;

    const trigger = () => {
      if (triggeredRef.current) return;
      triggeredRef.current = true;
      setOpen(true);
    };

    const timer = window.setTimeout(trigger, TIME_DELAY_MS);

    const onScroll = () => {
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight <= 0) return;
      const pct = window.scrollY / docHeight;
      if (pct >= SCROLL_THRESHOLD) trigger();
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("scroll", onScroll);
    };
  }, [pathname]);

  useEffect(() => {
    if (!open || !recaptchaSiteKey) return;
    if (document.getElementById("recaptcha-v3")) return;
    const script = document.createElement("script");
    script.id = "recaptcha-v3";
    script.src = `https://www.google.com/recaptcha/api.js?render=${recaptchaSiteKey}`;
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);
  }, [open, recaptchaSiteKey]);

  const close = useCallback(() => {
    setOpen(false);
    if (typeof window !== "undefined") {
      window.sessionStorage.setItem(SESSION_KEY, "1");
    }
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, close]);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      if (form.website.trim() !== "") {
        setSubmitted(true);
        return;
      }

      let recaptchaToken: string | null = null;
      if (recaptchaSiteKey && window.grecaptcha) {
        recaptchaToken = await new Promise<string>((resolve) =>
          window.grecaptcha!.ready(async () => {
            const token = await window.grecaptcha!.execute(recaptchaSiteKey, {
              action: "lead_submit",
            });
            resolve(token);
          }),
        );
      }

      const params = new URLSearchParams(window.location.search);
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          recaptchaToken,
          source: {
            page: pathname,
            referrer: document.referrer || undefined,
            utmSource: params.get("utm_source") ?? undefined,
            utmMedium: params.get("utm_medium") ?? undefined,
            utmCampaign: params.get("utm_campaign") ?? undefined,
            utmTerm: params.get("utm_term") ?? undefined,
            utmContent: params.get("utm_content") ?? undefined,
          },
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(
          typeof data?.error === "string" ? data.error : t("errorGeneric"),
        );
      }

      setSubmitted(true);
      window.sessionStorage.setItem(SESSION_KEY, "1");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : t("errorGeneric"));
    } finally {
      setSubmitting(false);
    }
  };

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="lead-modal-title"
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm p-0 sm:items-center sm:p-6"
      style={{ animation: "modal-fade 0.3s var(--ease-soft) both" }}
    >
      <div
        className="relative w-full max-w-lg overflow-hidden rounded-t-[var(--radius-xl)] border border-[color:var(--brand-border)] bg-white shadow-[var(--shadow-xl)] sm:rounded-[var(--radius-xl)]"
        style={{ animation: "modal-rise 0.45s var(--ease-soft) both" }}
      >
        {/* Gradient hairline at top */}
        <span
          aria-hidden="true"
          className="absolute inset-x-0 top-0 h-[3px]"
          style={{ background: "var(--gradient-ember)" }}
        />

        <button
          type="button"
          aria-label={t("close")}
          onClick={close}
          className="absolute right-3 top-3 inline-flex h-10 w-10 items-center justify-center rounded-full border border-[color:var(--brand-border)] bg-white/95 text-ink-muted transition-all hover:rotate-90 hover:border-[color:var(--brand-primary)] hover:text-[color:var(--brand-primary)]"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4" aria-hidden="true">
            <path d="M6 6l12 12M6 18L18 6" strokeLinecap="round" />
          </svg>
        </button>

        <div className="max-h-[90vh] overflow-y-auto p-7 sm:p-9">
          {!submitted ? (
            <>
              <span className="pill">
                <span className="pill-dot" aria-hidden="true" />
                <span>{t("eyebrow")}</span>
              </span>
              <h2
                id="lead-modal-title"
                className="font-display mt-5 text-3xl text-ink"
              >
                {t("heading")}
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-ink-muted">{t("subheading")}</p>

              <form className="mt-6 space-y-4" onSubmit={onSubmit} noValidate>
                <div className="grid gap-4 sm:grid-cols-2">
                  <LabeledInput
                    label={t("firstName")}
                    name="firstName"
                    value={form.firstName}
                    onChange={(v) => setForm((f) => ({ ...f, firstName: v }))}
                    required
                    autoComplete="given-name"
                  />
                  <LabeledInput
                    label={t("lastName")}
                    name="lastName"
                    value={form.lastName}
                    onChange={(v) => setForm((f) => ({ ...f, lastName: v }))}
                    required
                    autoComplete="family-name"
                  />
                </div>

                <LabeledInput
                  label={t("email")}
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={(v) => setForm((f) => ({ ...f, email: v }))}
                  required
                  autoComplete="email"
                />

                <div className="grid gap-4 sm:grid-cols-[140px_1fr]">
                  <LabeledSelect
                    label={t("phoneCode")}
                    name="phoneCountryCode"
                    value={form.phoneCountryCode}
                    onChange={(v) =>
                      setForm((f) => ({ ...f, phoneCountryCode: v }))
                    }
                    options={COUNTRY_CODES.map((c) => ({
                      value: c.code,
                      label: c.label,
                    }))}
                  />
                  <LabeledInput
                    label={t("phone")}
                    name="phone"
                    type="tel"
                    value={form.phone}
                    onChange={(v) => setForm((f) => ({ ...f, phone: v }))}
                    required
                    autoComplete="tel"
                  />
                </div>

                <LabeledInput
                  label={t("businessName")}
                  name="businessName"
                  value={form.businessName}
                  onChange={(v) => setForm((f) => ({ ...f, businessName: v }))}
                  required
                  autoComplete="organization"
                />

                <LabeledSelect
                  label={t("businessType")}
                  name="businessType"
                  value={form.businessType}
                  onChange={(v) => setForm((f) => ({ ...f, businessType: v }))}
                  options={[
                    { value: "", label: t("select") },
                    ...BUSINESS_TYPES.map((b) => ({
                      value: b.value,
                      label: b.label,
                    })),
                  ]}
                  required
                />

                <div className="grid gap-4 sm:grid-cols-2">
                  <LabeledSelect
                    label={t("country")}
                    name="country"
                    value={form.country}
                    onChange={(v) => setForm((f) => ({ ...f, country: v }))}
                    options={[
                      { value: "", label: t("select") },
                      ...COUNTRIES.map((c) => ({ value: c, label: c })),
                    ]}
                    required
                  />
                  <LabeledInput
                    label={t("city")}
                    name="city"
                    value={form.city}
                    onChange={(v) => setForm((f) => ({ ...f, city: v }))}
                    required
                    autoComplete="address-level2"
                  />
                </div>

                <fieldset>
                  <legend className="text-[12px] font-semibold uppercase tracking-[0.10em] text-ink-soft">
                    {t("servicesRequired")}
                  </legend>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {SERVICES.map((s) => {
                      const checked = form.servicesRequired.includes(s.value);
                      return (
                        <label
                          key={s.value}
                          className={`inline-flex cursor-pointer items-center gap-2 rounded-full border px-3.5 py-2 text-[12px] font-semibold tracking-wide transition-all ${
                            checked
                              ? "border-[color:var(--brand-primary)] bg-[color:var(--brand-primary-soft)] text-[color:var(--brand-primary)] shadow-[0_0_0_1px_var(--brand-primary)]"
                              : "border-[color:var(--brand-border)] bg-white text-ink-soft hover:border-[color:var(--brand-border-strong)] hover:text-ink"
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() =>
                              setForm((f) => ({
                                ...f,
                                servicesRequired: checked
                                  ? f.servicesRequired.filter(
                                      (v) => v !== s.value,
                                    )
                                  : [...f.servicesRequired, s.value],
                              }))
                            }
                            className="sr-only"
                          />
                          {checked && (
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="h-3 w-3" aria-hidden="true">
                              <path d="M5 12l5 5L20 7" />
                            </svg>
                          )}
                          {s.label}
                        </label>
                      );
                    })}
                  </div>
                </fieldset>

                <label className="block">
                  <span className="text-[12px] font-semibold uppercase tracking-[0.10em] text-ink-soft">
                    {t("message")} <span className="ml-1 text-[color:var(--brand-primary)]">*</span>
                  </span>
                  <textarea
                    name="message"
                    rows={4}
                    required
                    value={form.message}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, message: e.target.value }))
                    }
                    className="input-premium mt-2 resize-none"
                  />
                </label>

                <div className="hidden" aria-hidden="true">
                  <label>
                    Website
                    <input
                      type="text"
                      name="website"
                      tabIndex={-1}
                      autoComplete="off"
                      value={form.website}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, website: e.target.value }))
                      }
                    />
                  </label>
                </div>

                {error && (
                  <p
                    role="alert"
                    className="text-sm text-[color:var(--brand-danger)]"
                  >
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="group inline-flex h-[52px] w-full items-center justify-center gap-2 rounded-full text-sm font-semibold text-white shadow-[var(--shadow-glow-red)] transition-all hover:-translate-y-0.5 hover:shadow-[0_16px_40px_-10px_rgba(255,0,0,0.55)] disabled:opacity-60 disabled:hover:translate-y-0"
                  style={{ background: "var(--gradient-ember)" }}
                >
                  {submitting ? (
                    <>
                      <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" strokeOpacity="0.3" />
                        <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                      </svg>
                      {t("sending")}
                    </>
                  ) : (
                    <>
                      {t("submit")}
                      <span className="arrow-shift" aria-hidden="true">→</span>
                    </>
                  )}
                </button>

                <p className="text-xs leading-relaxed text-ink-muted">{t("privacyNote")}</p>
              </form>
            </>
          ) : (
            <div className="py-8 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full" style={{ background: "var(--gradient-ember)", boxShadow: "var(--shadow-glow-red)" }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8" aria-hidden="true">
                  <path d="M5 12l5 5L20 7" />
                </svg>
              </div>
              <span className="eyebrow mt-6 justify-center">
                {t("successEyebrow")}
              </span>
              <h2 className="font-display mt-4 text-2xl text-ink">
                {t("successHeading")}
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-ink-muted">{t("successMessage")}</p>
              <button
                onClick={close}
                className="mt-7 inline-flex h-11 items-center justify-center rounded-full border border-[color:var(--brand-border-strong)] bg-white px-6 text-sm font-semibold text-ink transition-all hover:-translate-y-0.5 hover:border-ink hover:shadow-[var(--shadow-md)]"
              >
                {t("close")}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function LabeledInput(props: {
  label: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  required?: boolean;
  autoComplete?: string;
}) {
  return (
    <label className="block">
      <span className="text-[12px] font-semibold uppercase tracking-[0.10em] text-ink-soft">
        {props.label}
        {props.required && <span className="ml-1 text-[color:var(--brand-primary)]">*</span>}
      </span>
      <input
        type={props.type ?? "text"}
        name={props.name}
        value={props.value}
        onChange={(e) => props.onChange(e.target.value)}
        required={props.required}
        autoComplete={props.autoComplete}
        className="input-premium mt-2"
      />
    </label>
  );
}

function LabeledSelect(props: {
  label: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  options: Array<{ value: string; label: string }>;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="text-[12px] font-semibold uppercase tracking-[0.10em] text-ink-soft">
        {props.label}
        {props.required && <span className="ml-1 text-[color:var(--brand-primary)]">*</span>}
      </span>
      <select
        name={props.name}
        value={props.value}
        onChange={(e) => props.onChange(e.target.value)}
        required={props.required}
        className="input-premium mt-2 appearance-none bg-[length:14px] bg-no-repeat bg-[right_1rem_center] pr-9"
        style={{
          backgroundImage:
            'url("data:image/svg+xml;utf8,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%2712%27 height=%2712%27 viewBox=%270 0 12 12%27%3E%3Cpath fill=%27none%27 stroke=%27%2356524d%27 stroke-width=%271.5%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27 d=%27M3 4.5L6 7.5L9 4.5%27/%3E%3C/svg%3E")',
        }}
      >
        {props.options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}
