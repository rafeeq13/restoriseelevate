import { cache } from "react";
import { getPayloadSafe } from "@/lib/payload";

/**
 * Server-side data fetchers for CMS-driven site chrome (navigation, footer,
 * site settings, lead form). All fetchers accept an optional locale and
 * fall back to sensible defaults so the site renders before the agency
 * seeds the CMS for the first time.
 */

export type SiteSettings = {
  siteName: string;
  tagline: string;
  defaultMetaDescription: string;
  contact: {
    email: string;
    phone?: string;
    addressLine1?: string;
    addressLine2?: string;
    city?: string;
    country?: string;
    workingHours?: string;
  };
  socials: Array<{ platform: string; url: string }>;
  geographicScope: string;
};

export type NavLink = {
  label: string;
  href: string;
  children?: Array<{ label: string; href: string; description?: string }>;
};

export type Navigation = {
  primaryLinks: NavLink[];
  ctaLabel: string;
  ctaHref: string;
};

export type FooterColumn = {
  heading: string;
  links: Array<{ label: string; href: string }>;
};

export type Footer = {
  columns: FooterColumn[];
  legalLinks: Array<{ label: string; href: string }>;
  copyright: string;
};

const defaultSiteSettings: SiteSettings = {
  siteName: "Restorise Business Solutions",
  tagline: "Digital growth for the food & hospitality industry.",
  defaultMetaDescription:
    "A digital services agency for the food and hospitality sector. Performance marketing, SEO, social media, creative production, and operational services for restaurants in the UK, US, Canada, EU, and Australia.",
  contact: {
    email: "contact.restorise@gmail.com",
  },
  socials: [],
  geographicScope: "Serving clients in the UK, US, Canada, the EU, and Australia.",
};

const defaultNavigation: Navigation = {
  primaryLinks: [
    {
      label: "Services",
      href: "/services",
      children: [
        { label: "Meta Ads", href: "/services/meta-ads" },
        { label: "Google Ads", href: "/services/google-ads" },
        { label: "SEO", href: "/services/seo" },
        { label: "Social Media Management", href: "/services/social-media" },
        { label: "Graphics Design", href: "/services/graphics-design" },
        { label: "Video Editing", href: "/services/video-editing" },
        { label: "Web Development", href: "/services/web-development" },
        { label: "Mobile App Development", href: "/services/mobile-apps" },
        { label: "POS Setup", href: "/services/pos-setup" },
        { label: "Delivery Platform Setup", href: "/services/delivery-platforms" },
      ],
    },
    { label: "About", href: "/about" },
    { label: "Portfolio", href: "/portfolio" },
    { label: "Reviews", href: "/reviews" },
    { label: "Blog", href: "/blog" },
    { label: "FAQ", href: "/faq" },
  ],
  ctaLabel: "Start a project",
  ctaHref: "/contact",
};

const defaultFooter: Footer = {
  columns: [
    {
      heading: "Services",
      links: [
        { label: "Meta Ads", href: "/services/meta-ads" },
        { label: "Google Ads", href: "/services/google-ads" },
        { label: "SEO", href: "/services/seo" },
        { label: "Social Media", href: "/services/social-media" },
        { label: "Web Development", href: "/services/web-development" },
        { label: "POS Setup", href: "/services/pos-setup" },
      ],
    },
    {
      heading: "Agency",
      links: [
        { label: "About", href: "/about" },
        { label: "Team", href: "/team" },
        { label: "Portfolio", href: "/portfolio" },
        { label: "Reviews", href: "/reviews" },
        { label: "Contact", href: "/contact" },
      ],
    },
    {
      heading: "Resources",
      links: [
        { label: "Blog", href: "/blog" },
        { label: "FAQ", href: "/faq" },
      ],
    },
  ],
  legalLinks: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
    { label: "Cookie Policy", href: "/cookies" },
  ],
  copyright: "© Restorise Business Solutions. All rights reserved.",
};

export const getSiteSettings = cache(
  async (locale = "en"): Promise<SiteSettings> => {
    const payload = await getPayloadSafe();
    if (!payload) return defaultSiteSettings;
    try {
      const settings = await payload.findGlobal({
        slug: "site-settings",
        locale,
        depth: 0,
      });
      return {
        ...defaultSiteSettings,
        ...(settings as unknown as SiteSettings),
      };
    } catch {
      return defaultSiteSettings;
    }
  },
);

export const getNavigation = cache(
  async (locale = "en"): Promise<Navigation> => {
    const payload = await getPayloadSafe();
    if (!payload) return defaultNavigation;
    try {
      const nav = (await payload.findGlobal({
        slug: "navigation",
        locale,
        depth: 0,
      })) as unknown as Navigation;
      if (!nav?.primaryLinks?.length) return defaultNavigation;
      return nav;
    } catch {
      return defaultNavigation;
    }
  },
);

export const getFooter = cache(async (locale = "en"): Promise<Footer> => {
  const payload = await getPayloadSafe();
  if (!payload) return defaultFooter;
  try {
    const footer = (await payload.findGlobal({
      slug: "footer",
      locale,
      depth: 0,
    })) as unknown as Footer;
    if (!footer?.columns?.length) return defaultFooter;
    return footer;
  } catch {
    return defaultFooter;
  }
});
