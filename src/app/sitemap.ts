import type { MetadataRoute } from "next";
import { listBlogPosts, listPortfolio, listServices } from "@/lib/content";
import { routing } from "@/i18n/routing";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://restorise.example";

const STATIC_PATHS = [
  "",
  "/about",
  "/services",
  "/team",
  "/portfolio",
  "/reviews",
  "/blog",
  "/faq",
  "/contact",
  "/privacy",
  "/terms",
  "/cookies",
];

const SERVICE_FALLBACK_SLUGS = [
  "meta-ads",
  "google-ads",
  "seo",
  "social-media",
  "video-editing",
  "graphics-design",
  "web-development",
  "mobile-apps",
  "pos-setup",
  "delivery-platforms",
  "menu-management",
];

/**
 * Build a per-locale entry with hreflang alternates pointing at every
 * routable locale + an x-default fallback to English.
 */
function buildLocalisedEntries(
  path: string,
  now: Date,
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"],
  priority: number,
): MetadataRoute.Sitemap {
  const languages = Object.fromEntries(
    routing.locales.map((l) => [l, `${siteUrl}/${l}${path}`]),
  );
  return routing.locales.map((locale) => ({
    url: `${siteUrl}/${locale}${path}`,
    lastModified: now,
    changeFrequency,
    priority,
    alternates: {
      languages: { ...languages, "x-default": `${siteUrl}/en${path}` },
    },
  }));
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticEntries: MetadataRoute.Sitemap = STATIC_PATHS.flatMap((p) =>
    buildLocalisedEntries(p, now, "weekly", p === "" ? 1 : 0.7),
  );

  const [services, posts, portfolio] = await Promise.all([
    listServices(),
    listBlogPosts(),
    listPortfolio(),
  ]);

  const serviceSlugs =
    services.length > 0
      ? services
          .map((s) => String((s as { slug?: string }).slug))
          .filter(Boolean)
      : SERVICE_FALLBACK_SLUGS;

  const serviceEntries: MetadataRoute.Sitemap = serviceSlugs.flatMap((slug) =>
    buildLocalisedEntries(`/services/${slug}`, now, "monthly", 0.8),
  );

  const postEntries: MetadataRoute.Sitemap = posts.flatMap((p) =>
    buildLocalisedEntries(
      `/blog/${(p as { slug?: string }).slug}`,
      (p as { updatedAt?: string }).updatedAt
        ? new Date((p as { updatedAt?: string }).updatedAt as string)
        : now,
      "monthly",
      0.6,
    ),
  );

  const portfolioEntries: MetadataRoute.Sitemap = portfolio.flatMap((c) =>
    buildLocalisedEntries(
      `/portfolio/${(c as { slug?: string }).slug}`,
      (c as { updatedAt?: string }).updatedAt
        ? new Date((c as { updatedAt?: string }).updatedAt as string)
        : now,
      "monthly",
      0.6,
    ),
  );

  return [
    ...staticEntries,
    ...serviceEntries,
    ...portfolioEntries,
    ...postEntries,
  ];
}
