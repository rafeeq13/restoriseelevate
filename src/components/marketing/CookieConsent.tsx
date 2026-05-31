"use client";

import { useCallback, useEffect, useState } from "react";
import { useTranslations } from "next-intl";

/* ---------------------------------------------------------------------------
 * GDPR cookie consent banner — implements brief §4.6.
 * - Four categories: strictly necessary, analytics, marketing, functional.
 * - Strictly necessary cookies are always on and cannot be toggled.
 * - No non-essential cookies set until explicit consent.
 * - Consent state is persisted to localStorage under `restorise:consent`.
 * - Re-openable via footer button with `data-action="open-cookie-preferences"`.
 * -------------------------------------------------------------------------*/

const CONSENT_KEY = "restorise:consent:v1";

export type ConsentState = {
  necessary: true;
  analytics: boolean;
  marketing: boolean;
  functional: boolean;
  decidedAt: string;
};

const defaultDecided: ConsentState = {
  necessary: true,
  analytics: false,
  marketing: false,
  functional: false,
  decidedAt: "",
};

export function readConsent(): ConsentState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(CONSENT_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as ConsentState;
  } catch {
    return null;
  }
}

function writeConsent(state: ConsentState) {
  window.localStorage.setItem(CONSENT_KEY, JSON.stringify(state));
  window.dispatchEvent(
    new CustomEvent("restorise:consent-changed", { detail: state }),
  );
}

export function CookieConsent() {
  const t = useTranslations("Cookie");
  const [open, setOpen] = useState(false);
  const [showPrefs, setShowPrefs] = useState(false);
  const [state, setState] = useState<ConsentState>(defaultDecided);

  useEffect(() => {
    const existing = readConsent();
    if (existing) {
      setState(existing);
      return;
    }
    setOpen(true);
  }, []);

  useEffect(() => {
    const onOpenPrefs = (e: Event) => {
      const target = (e.target as HTMLElement | null)?.closest(
        '[data-action="open-cookie-preferences"]',
      );
      if (target) {
        const existing = readConsent();
        if (existing) setState(existing);
        setShowPrefs(true);
        setOpen(true);
      }
    };
    document.addEventListener("click", onOpenPrefs);
    return () => document.removeEventListener("click", onOpenPrefs);
  }, []);

  const acceptAll = useCallback(() => {
    const next: ConsentState = {
      necessary: true,
      analytics: true,
      marketing: true,
      functional: true,
      decidedAt: new Date().toISOString(),
    };
    writeConsent(next);
    setState(next);
    setOpen(false);
    setShowPrefs(false);
  }, []);

  const rejectAll = useCallback(() => {
    const next: ConsentState = {
      necessary: true,
      analytics: false,
      marketing: false,
      functional: false,
      decidedAt: new Date().toISOString(),
    };
    writeConsent(next);
    setState(next);
    setOpen(false);
    setShowPrefs(false);
  }, []);

  const saveChoices = useCallback(() => {
    const next: ConsentState = {
      ...state,
      necessary: true,
      decidedAt: new Date().toISOString(),
    };
    writeConsent(next);
    setState(next);
    setOpen(false);
    setShowPrefs(false);
  }, [state]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="false"
      aria-labelledby="cookie-banner-title"
      className="fixed inset-x-3 bottom-3 z-40 sm:inset-x-6 sm:bottom-6"
      style={{ animation: "banner-rise 0.45s var(--ease-soft) both" }}
    >
      <div className="glass mx-auto max-w-[var(--max-content)] overflow-hidden rounded-[var(--radius-xl)]">
        <span
          aria-hidden="true"
          className="block h-[3px] w-full"
          style={{ background: "var(--gradient-ember)" }}
        />
        <div className="flex flex-col gap-5 p-6 sm:p-7 lg:flex-row lg:items-start lg:gap-8">
          <div className="flex-1">
            <div className="flex items-start gap-4">
              <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[color:var(--brand-primary-soft)] text-[color:var(--brand-primary)]">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-5 w-5" aria-hidden="true">
                  <path d="M21.6 12.2A9.6 9.6 0 1 1 12 2a3 3 0 0 0 3 3 3 3 0 0 0 3 3 3 3 0 0 0 3 3c0 .4-.1.8-.4 1.2Z" />
                  <circle cx="8" cy="14" r="1" fill="currentColor" />
                  <circle cx="12" cy="17" r="1" fill="currentColor" />
                  <circle cx="15" cy="13" r="1" fill="currentColor" />
                  <circle cx="9" cy="9" r="1" fill="currentColor" />
                </svg>
              </span>
              <div>
                <p id="cookie-banner-title" className="font-display text-lg text-ink">
                  {t("title")}
                </p>
                <p className="mt-1.5 text-sm leading-relaxed text-ink-muted">
                  {t("body")}{" "}
                  <a href="/cookies" className="font-semibold text-[color:var(--brand-primary)] underline underline-offset-2 hover:text-[color:var(--brand-primary-deep)]">
                    {t("cookiePolicy")}
                  </a>
                  .
                </p>
              </div>
            </div>

            {showPrefs && (
              <div className="mt-5 grid gap-2.5 rounded-[var(--radius-lg)] border border-[color:var(--brand-border)] bg-white/60 p-4 sm:grid-cols-2">
                <ConsentToggle
                  label={t("necessary")}
                  description={t("necessaryDesc")}
                  checked
                  disabled
                />
                <ConsentToggle
                  label={t("analytics")}
                  description={t("analyticsDesc")}
                  checked={state.analytics}
                  onChange={(v) => setState((s) => ({ ...s, analytics: v }))}
                />
                <ConsentToggle
                  label={t("marketing")}
                  description={t("marketingDesc")}
                  checked={state.marketing}
                  onChange={(v) => setState((s) => ({ ...s, marketing: v }))}
                />
                <ConsentToggle
                  label={t("functional")}
                  description={t("functionalDesc")}
                  checked={state.functional}
                  onChange={(v) => setState((s) => ({ ...s, functional: v }))}
                />
              </div>
            )}
          </div>

          <div className="flex flex-col gap-2.5 lg:w-[260px]">
            {!showPrefs && (
              <button
                type="button"
                onClick={() => setShowPrefs(true)}
                className="inline-flex h-11 items-center justify-center rounded-full border border-[color:var(--brand-border-strong)] bg-white px-5 text-sm font-semibold text-ink transition-all hover:-translate-y-0.5 hover:border-ink hover:shadow-[var(--shadow-md)]"
              >
                {t("manage")}
              </button>
            )}
            {showPrefs && (
              <button
                type="button"
                onClick={saveChoices}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-full text-sm font-semibold text-white shadow-[var(--shadow-glow-red)] transition-all hover:-translate-y-0.5"
                style={{ background: "var(--gradient-ember)" }}
              >
                {t("save")}
                <span className="arrow-shift" aria-hidden="true">→</span>
              </button>
            )}
            <button
              type="button"
              onClick={rejectAll}
              className="inline-flex h-11 items-center justify-center rounded-full border border-[color:var(--brand-border)] bg-white/80 px-5 text-sm font-semibold text-ink-soft transition-all hover:border-[color:var(--brand-border-strong)] hover:text-ink"
            >
              {t("reject")}
            </button>
            {!showPrefs && (
              <button
                type="button"
                onClick={acceptAll}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-full text-sm font-semibold text-white shadow-[var(--shadow-glow-red)] transition-all hover:-translate-y-0.5"
                style={{ background: "var(--gradient-ember)" }}
              >
                {t("accept")}
                <span className="arrow-shift" aria-hidden="true">→</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function ConsentToggle(props: {
  label: string;
  description: string;
  checked: boolean;
  onChange?: (next: boolean) => void;
  disabled?: boolean;
}) {
  return (
    <label className={`flex items-start gap-3 rounded-[var(--radius-md)] p-3 transition-colors ${props.disabled ? "" : "hover:bg-white/80 cursor-pointer"}`}>
      <button
        type="button"
        role="switch"
        aria-checked={props.checked}
        disabled={props.disabled}
        onClick={() => props.onChange?.(!props.checked)}
        className={`relative mt-0.5 inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors ${
          props.checked
            ? "bg-[color:var(--brand-primary)]"
            : "bg-[color:var(--brand-border-strong)]"
        } ${props.disabled ? "opacity-60" : ""}`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform ${
            props.checked ? "translate-x-[18px]" : "translate-x-0.5"
          }`}
        />
      </button>
      <span className="flex-1">
        <span className="block text-sm font-semibold text-ink">{props.label}</span>
        <span className="block text-xs leading-relaxed text-ink-muted">{props.description}</span>
      </span>
    </label>
  );
}
