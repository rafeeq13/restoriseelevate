import type { Metadata } from "next";
import localFont from "next/font/local";
import { notFound } from "next/navigation";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";

import "./styles.css";
import { MarketingShell } from "@/components/marketing/MarketingShell";
import { ConsentScripts } from "@/components/marketing/ConsentScripts";
import { organizationJsonLd } from "@/lib/structuredData";
import { routing } from "@/i18n/routing";

/* Proxima Nova — the official Restorise typeface per the brand identity
   sheet. Used everywhere: body, headings, display. No secondary serif. */
const proxima = localFont({
  variable: "--font-proxima",
  display: "swap",
  src: [
    {
      path: "../../../../public/fonts/ProximaNova-Regular.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../../../public/fonts/ProximaNova-Semibold.otf",
      weight: "600",
      style: "normal",
    },
    {
      path: "../../../../public/fonts/ProximaNova-Bold.otf",
      weight: "700",
      style: "normal",
    },
    {
      path: "../../../../public/fonts/ProximaNova-Extrabold.otf",
      weight: "800",
      style: "normal",
    },
  ],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://restorise.example";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const localeAlternates = Object.fromEntries(
    routing.locales.map((l) => [l, `${siteUrl}/${l}`]),
  );

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default:
        "Restorise Business Solutions — Digital growth for food & hospitality",
      template: "%s — Restorise Business Solutions",
    },
    description:
      "A digital services agency for the food and hospitality sector. Performance marketing, SEO, social media, creative production, and operational services for restaurants in the UK, US, Canada, EU, and Australia.",
    alternates: {
      canonical: `${siteUrl}/${locale}`,
      languages: { ...localeAlternates, "x-default": `${siteUrl}/en` },
    },
    openGraph: {
      type: "website",
      siteName: "Restorise Business Solutions",
      locale,
      alternateLocale: routing.locales.filter((l) => l !== locale),
      images: [
        {
          url: `${siteUrl}/brand/logo-stacked.webp`,
          alt: "Restorise Business Solutions",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      images: [`${siteUrl}/brand/logo-stacked.webp`],
    },
    icons: {
      icon: [
        { url: "/brand/logo-icon.webp", type: "image/webp" },
      ],
      shortcut: "/brand/logo-icon.webp",
      apple: "/brand/logo-icon.webp",
    },
    robots: { index: true, follow: true },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  setRequestLocale(locale);
  const [messages, orgSchema] = await Promise.all([
    getMessages(),
    organizationJsonLd(),
  ]);

  return (
    <html
      lang={locale}
      className={`${proxima.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-surface text-ink">
        <NextIntlClientProvider messages={messages} locale={locale}>
          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:absolute focus:left-3 focus:top-3 focus:z-50 focus:rounded focus:bg-brand focus:px-4 focus:py-2 focus:text-brand-contrast"
          >
            Skip to content
          </a>
          <MarketingShell locale={locale}>{children}</MarketingShell>
          <ConsentScripts />
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
          />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
