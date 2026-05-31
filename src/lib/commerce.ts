import "server-only";
import { cache } from "react";
import { getPayloadSafe } from "@/lib/payload";

type Doc = Record<string, unknown> & { id: number | string };

export const listProductCategories = cache(
  async (locale = "en"): Promise<Doc[]> => {
    const payload = await getPayloadSafe();
    if (!payload) return [];
    try {
      const res = await payload.find({
        collection: "product-categories",
        locale,
        where: { status: { equals: "published" } },
        sort: "order",
        limit: 100,
      });
      return res.docs as unknown as Doc[];
    } catch {
      return [];
    }
  },
);

export const getProductCategoryBySlug = cache(
  async (slug: string, locale = "en"): Promise<Doc | null> => {
    const payload = await getPayloadSafe();
    if (!payload) return null;
    try {
      const res = await payload.find({
        collection: "product-categories",
        locale,
        where: { slug: { equals: slug } },
        limit: 1,
      });
      return (res.docs[0] as unknown as Doc) ?? null;
    } catch {
      return null;
    }
  },
);

export const listProductsByCategory = cache(
  async (categoryId: string | number, locale = "en"): Promise<Doc[]> => {
    const payload = await getPayloadSafe();
    if (!payload) return [];
    try {
      const res = await payload.find({
        collection: "products",
        locale,
        where: {
          and: [
            { status: { equals: "published" } },
            { category: { equals: categoryId } },
          ],
        },
        limit: 100,
        depth: 1,
      });
      return res.docs as unknown as Doc[];
    } catch {
      return [];
    }
  },
);

export const getProductBySlug = cache(
  async (slug: string, locale = "en"): Promise<Doc | null> => {
    const payload = await getPayloadSafe();
    if (!payload) return null;
    try {
      const res = await payload.find({
        collection: "products",
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
