import { defineRouting } from "next-intl/routing";

/**
 * i18n routing config — implements brief §4.5.
 * The seven first-class locales are URL-routable; everything else falls
 * through to the DeepL adapter at request time.
 *
 * Locale prefix is `always` (so EN renders at /en/...) — this keeps the
 * canonical URL strategy uniform and avoids ambiguity in analytics.
 */
export const routing = defineRouting({
  locales: ["en", "de", "fr", "es", "it", "nl", "pt"],
  defaultLocale: "en",
  localePrefix: "always",
  localeDetection: true,
});

export type AppLocale = (typeof routing.locales)[number];
