import "server-only";
import { getPayloadSafe } from "@/lib/payload";

/**
 * Loads UI messages for a locale: JSON catalogue, then overlayed with any
 * Translations collection records for that locale. CMS rows take precedence
 * over the JSON baseline so the agency can refine machine-translated or
 * out-of-date strings without redeploying.
 */

type Messages = Record<string, unknown>;

function setByKeyPath(target: Messages, namespace: string, key: string, value: string) {
  const ns =
    typeof target[namespace] === "object" && target[namespace] !== null
      ? (target[namespace] as Messages)
      : {};
  target[namespace] = ns;
  // Dot-paths are allowed inside `key` to reach nested values.
  const parts = key.split(".");
  let cursor: Messages = ns;
  for (let i = 0; i < parts.length - 1; i++) {
    const part = parts[i];
    if (typeof cursor[part] !== "object" || cursor[part] === null) {
      cursor[part] = {};
    }
    cursor = cursor[part] as Messages;
  }
  cursor[parts[parts.length - 1]] = value;
}

export async function loadMessages(locale: string): Promise<Messages> {
  // Base JSON catalogue. Fall back to English if the requested locale has
  // no JSON file (covers DeepL-only locales seeded via the Translations
  // collection or via /api/translate).
  let base: Messages;
  try {
    base = (await import(`../../messages/${locale}.json`)).default as Messages;
  } catch {
    base = (await import(`../../messages/en.json`)).default as Messages;
  }

  // Deep-clone so we don't mutate the imported module cache.
  const messages = JSON.parse(JSON.stringify(base)) as Messages;

  const payload = await getPayloadSafe();
  if (!payload) return messages;

  try {
    const overrides = await payload.find({
      collection: "translations",
      where: { locale: { equals: locale } },
      limit: 1000,
      depth: 0,
    });
    for (const row of overrides.docs as unknown as Array<{
      namespace: string;
      key: string;
      value: string;
    }>) {
      setByKeyPath(messages, row.namespace, row.key, row.value);
    }
  } catch {
    // Payload not available — return the JSON baseline.
  }

  return messages;
}
