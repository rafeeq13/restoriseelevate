import "server-only";
import { getSiteSettings } from "@/lib/siteData";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://restorise.example";

export async function organizationJsonLd() {
  const settings = await getSiteSettings();
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: settings.siteName,
    url: siteUrl,
    email: settings.contact.email,
    telephone: settings.contact.phone,
    description: settings.defaultMetaDescription,
    sameAs: settings.socials.map((s) => s.url),
    areaServed: [
      { "@type": "Country", name: "United Kingdom" },
      { "@type": "Country", name: "United States" },
      { "@type": "Country", name: "Canada" },
      { "@type": "Country", name: "Australia" },
      { "@type": "Country", name: "European Union" },
    ],
  };
}

export function breadcrumbJsonLd(items: Array<{ name: string; url: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: it.name,
      item: it.url,
    })),
  };
}
