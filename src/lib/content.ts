import "server-only";
import { cache } from "react";
import { getPayloadSafe } from "@/lib/payload";

/**
 * Server-side content fetchers for marketing collections. All wrap the
 * Payload call in try/catch and return empty results when the DB isn't
 * provisioned yet, so pages render placeholder UI before the agency
 * seeds the CMS.
 */

type Doc = Record<string, unknown> & { id: number | string };

export const listServices = cache(async (locale = "en"): Promise<Doc[]> => {
  const payload = await getPayloadSafe();
  if (!payload) return [];
  try {
    const res = await payload.find({
      collection: "services",
      locale,
      where: { status: { equals: "published" } },
      limit: 50,
      depth: 1,
    });
    return res.docs as unknown as Doc[];
  } catch {
    return [];
  }
});

export const getServiceBySlug = cache(
  async (slug: string, locale = "en"): Promise<Doc | null> => {
    const payload = await getPayloadSafe();
    if (!payload) return null;
    try {
      const res = await payload.find({
        collection: "services",
        locale,
        where: {
          and: [
            { slug: { equals: slug } },
            { status: { equals: "published" } },
          ],
        },
        limit: 1,
        depth: 2,
      });
      return (res.docs[0] as unknown as Doc) ?? null;
    } catch {
      return null;
    }
  },
);

export const listTeamMembers = cache(async (locale = "en"): Promise<Doc[]> => {
  const payload = await getPayloadSafe();
  if (!payload) return [];
  try {
    const res = await payload.find({
      collection: "team-members",
      locale,
      sort: "order",
      limit: 100,
      depth: 1,
    });
    return res.docs as unknown as Doc[];
  } catch {
    return [];
  }
});

export const listPortfolio = cache(async (locale = "en"): Promise<Doc[]> => {
  const payload = await getPayloadSafe();
  if (!payload) return [];
  try {
    const res = await payload.find({
      collection: "portfolio",
      locale,
      where: { status: { equals: "published" } },
      limit: 50,
      depth: 1,
    });
    return res.docs as unknown as Doc[];
  } catch {
    return [];
  }
});

export const getPortfolioBySlug = cache(
  async (slug: string, locale = "en"): Promise<Doc | null> => {
    const payload = await getPayloadSafe();
    if (!payload) return null;
    try {
      const res = await payload.find({
        collection: "portfolio",
        locale,
        where: {
          and: [
            { slug: { equals: slug } },
            { status: { equals: "published" } },
          ],
        },
        limit: 1,
        depth: 2,
      });
      return (res.docs[0] as unknown as Doc) ?? null;
    } catch {
      return null;
    }
  },
);

export const listReviews = cache(async (locale = "en"): Promise<Doc[]> => {
  const payload = await getPayloadSafe();
  if (!payload) return [];
  try {
    const res = await payload.find({
      collection: "reviews",
      locale,
      limit: 100,
      depth: 1,
    });
    return res.docs as unknown as Doc[];
  } catch {
    return [];
  }
});

export const listBlogPosts = cache(async (locale = "en"): Promise<Doc[]> => {
  const payload = await getPayloadSafe();
  if (!payload) return [];
  try {
    const res = await payload.find({
      collection: "blog-posts",
      locale,
      where: { status: { equals: "published" } },
      sort: "-publishedAt",
      limit: 50,
      depth: 1,
    });
    return res.docs as unknown as Doc[];
  } catch {
    return [];
  }
});

export const getBlogPostBySlug = cache(
  async (slug: string, locale = "en"): Promise<Doc | null> => {
    const payload = await getPayloadSafe();
    if (!payload) return null;
    try {
      const res = await payload.find({
        collection: "blog-posts",
        locale,
        where: {
          and: [
            { slug: { equals: slug } },
            { status: { equals: "published" } },
          ],
        },
        limit: 1,
        depth: 2,
      });
      return (res.docs[0] as unknown as Doc) ?? null;
    } catch {
      return null;
    }
  },
);

export const listFAQ = cache(async (locale = "en") => {
  const payload = await getPayloadSafe();
  if (!payload) return { categories: [] as Doc[], items: [] as Doc[] };
  try {
    const [categories, items] = await Promise.all([
      payload.find({
        collection: "faq-categories",
        locale,
        sort: "order",
        limit: 50,
      }),
      payload.find({
        collection: "faq-items",
        locale,
        sort: "order",
        limit: 500,
        depth: 1,
      }),
    ]);
    return {
      categories: categories.docs as unknown as Doc[],
      items: items.docs as unknown as Doc[],
    };
  } catch {
    return { categories: [] as Doc[], items: [] as Doc[] };
  }
});

export const getPageBySlug = cache(
  async (slug: string, locale = "en"): Promise<Doc | null> => {
    const payload = await getPayloadSafe();
    if (!payload) return null;
    try {
      const res = await payload.find({
        collection: "pages",
        locale,
        where: {
          and: [
            { slug: { equals: slug } },
            { status: { equals: "published" } },
          ],
        },
        limit: 1,
        depth: 2,
      });
      return (res.docs[0] as unknown as Doc) ?? null;
    } catch {
      return null;
    }
  },
);
