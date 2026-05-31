"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

const LOCALE_LABELS: Record<string, string> = {
  en: "English",
  de: "Deutsch",
  fr: "Français",
  es: "Español",
  it: "Italiano",
  nl: "Nederlands",
  pt: "Português",
};

const LOCALE_FLAGS: Record<string, string> = {
  en: "EN",
  de: "DE",
  fr: "FR",
  es: "ES",
  it: "IT",
  nl: "NL",
  pt: "PT",
};

type Props = {
  /** When true, renders a horizontal chip row (one chip per locale)
   *  instead of a dropdown button. Used inside the mobile drawer
   *  where a dropdown would overlap surrounding elements. */
  inline?: boolean;
};

export function LocaleSwitcher({ inline = false }: Props = {}) {
  const t = useTranslations("LocaleSwitcher");
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;
    const onDocClick = (e: MouseEvent) => {
      if (!wrapRef.current) return;
      if (!wrapRef.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const switchTo = (next: string) => {
    setOpen(false);
    if (next === locale) return;
    startTransition(() => {
      router.replace(pathname, { locale: next });
    });
  };

  // Inline variant — horizontal chip row, no dropdown. Used in
  // the mobile drawer to avoid the dropdown overlapping content
  // beneath it.
  if (inline) {
    return (
      <div className="flex flex-wrap items-center gap-2" aria-label={t("ariaLabel")}>
        {routing.locales.map((l) => {
          const isActive = l === locale;
          return (
            <button
              key={l}
              type="button"
              disabled={isPending}
              onClick={() => switchTo(l)}
              aria-pressed={isActive}
              className={`lux-locale-chip inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[12px] font-bold tracking-wide transition-all ${
                isActive ? "lux-locale-chip--active" : ""
              }`}
            >
              <span className="text-[10px] font-extrabold tracking-wider opacity-90">
                {LOCALE_FLAGS[l] ?? l.slice(0, 2).toUpperCase()}
              </span>
              <span>{LOCALE_LABELS[l] ?? l.toUpperCase()}</span>
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div ref={wrapRef} className="relative">
      <button
        type="button"
        aria-label={t("ariaLabel")}
        aria-haspopup="menu"
        aria-expanded={open}
        disabled={isPending}
        onClick={() => setOpen((v) => !v)}
        className="inline-flex h-9 items-center gap-2 rounded-full border border-[color:var(--brand-border)] bg-white px-3 text-[12px] font-semibold tracking-wide text-ink-soft transition-all hover:border-[color:var(--brand-border-strong)] hover:text-ink disabled:opacity-60"
      >
        <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-[color:var(--brand-primary-soft)] text-[10px] font-bold text-[color:var(--brand-primary)]">
          {LOCALE_FLAGS[locale] ?? locale.slice(0, 2).toUpperCase()}
        </span>
        <span>{LOCALE_LABELS[locale] ?? locale.toUpperCase()}</span>
        <svg
          viewBox="0 0 12 12"
          className={`h-3 w-3 transition-transform ${open ? "rotate-180" : ""}`}
          aria-hidden="true"
        >
          <path
            d="M3 4.5L6 7.5L9 4.5"
            stroke="currentColor"
            strokeWidth="1.5"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 top-full z-50 mt-2 min-w-[200px] rounded-[var(--radius-lg)] border border-[color:var(--brand-border)] bg-white/95 p-1.5 shadow-[var(--shadow-lg)] backdrop-blur-xl"
        >
          {routing.locales.map((l) => {
            const isActive = l === locale;
            return (
              <button
                key={l}
                type="button"
                role="menuitem"
                onClick={() => switchTo(l)}
                className={`flex w-full items-center gap-3 rounded-[var(--radius-md)] px-3 py-2 text-left text-sm transition-colors ${
                  isActive
                    ? "bg-[color:var(--brand-primary-soft)] text-[color:var(--brand-primary)]"
                    : "text-ink-soft hover:bg-[color:var(--brand-surface-muted)] hover:text-ink"
                }`}
              >
                <span
                  className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold ${
                    isActive
                      ? "bg-[color:var(--brand-primary)] text-white"
                      : "bg-[color:var(--brand-surface-muted)] text-ink-soft"
                  }`}
                >
                  {LOCALE_FLAGS[l] ?? l.slice(0, 2).toUpperCase()}
                </span>
                <span className="flex-1 font-semibold">
                  {LOCALE_LABELS[l] ?? l.toUpperCase()}
                </span>
                {isActive && (
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-3.5 w-3.5"
                    aria-hidden="true"
                  >
                    <path d="M5 12l5 5L20 7" />
                  </svg>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
