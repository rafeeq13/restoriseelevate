import { NextResponse } from "next/server";

/* ---------------------------------------------------------------------------
 * POST /api/translate — DeepL / Google Translate fallback adapter.
 *
 * Brief §4.5.2: locales outside the seven first-class ones are served via a
 * translation API with page-level caching. This endpoint is the building
 * block — it accepts a batch of strings + a target locale and returns the
 * translated payload, ready to be cached and substituted into a server-
 * rendered page.
 *
 * Status: stub. Wire DEEPL_API_KEY or GOOGLE_TRANSLATE_API_KEY in .env to
 * activate. The full per-page fallback flow (catch-all locale route +
 * cache layer + admin override surface per §4.5.3) lands in a follow-up
 * milestone alongside Lexical→HTML.
 * -------------------------------------------------------------------------*/

type Body = {
  strings: string[];
  targetLocale: string;
  sourceLocale?: string;
};

const PROVIDER = process.env.TRANSLATION_PROVIDER ?? "deepl";

const ALLOWED_ORIGIN = process.env.NEXT_PUBLIC_SITE_URL ?? "*";

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": ALLOWED_ORIGIN,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };
}

export function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders() });
}

export async function POST(req: Request) {
  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON." },
      { status: 400, headers: corsHeaders() },
    );
  }

  if (
    !body?.targetLocale ||
    !Array.isArray(body.strings) ||
    body.strings.length === 0
  ) {
    return NextResponse.json(
      { error: "Expected { strings: string[], targetLocale: string }." },
      { status: 400, headers: corsHeaders() },
    );
  }

  if (body.strings.length > 200) {
    return NextResponse.json(
      { error: "Maximum 200 strings per request." },
      { status: 413, headers: corsHeaders() },
    );
  }

  try {
    const translated =
      PROVIDER === "deepl"
        ? await translateWithDeepL(body)
        : await translateWithGoogle(body);
    return NextResponse.json(
      { provider: PROVIDER, translated },
      { headers: corsHeaders() },
    );
  } catch (err) {
    console.warn("[translate] failed:", err);
    return NextResponse.json(
      { error: "Translation provider unavailable." },
      { status: 502, headers: corsHeaders() },
    );
  }
}

async function translateWithDeepL(body: Body): Promise<string[]> {
  const key = process.env.DEEPL_API_KEY;
  if (!key) throw new Error("DEEPL_API_KEY not configured");

  // DeepL's free tier uses api-free.deepl.com; paid uses api.deepl.com.
  // We default to free; users can override via DEEPL_ENDPOINT.
  const endpoint =
    process.env.DEEPL_ENDPOINT ?? "https://api-free.deepl.com/v2/translate";

  const params = new URLSearchParams();
  for (const s of body.strings) params.append("text", s);
  params.append("target_lang", body.targetLocale.toUpperCase());
  if (body.sourceLocale)
    params.append("source_lang", body.sourceLocale.toUpperCase());

  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      Authorization: `DeepL-Auth-Key ${key}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: params.toString(),
    next: { revalidate: 86400 },
  });
  if (!res.ok) throw new Error(`DeepL returned ${res.status}`);

  const data = (await res.json()) as {
    translations?: Array<{ text: string }>;
  };
  return (data.translations ?? []).map((t) => t.text);
}

async function translateWithGoogle(body: Body): Promise<string[]> {
  const key = process.env.GOOGLE_TRANSLATE_API_KEY;
  if (!key) throw new Error("GOOGLE_TRANSLATE_API_KEY not configured");

  const res = await fetch(
    `https://translation.googleapis.com/language/translate/v2?key=${key}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        q: body.strings,
        target: body.targetLocale,
        source: body.sourceLocale,
        format: "text",
      }),
      next: { revalidate: 86400 },
    },
  );
  if (!res.ok) throw new Error(`Google Translate returned ${res.status}`);

  const data = (await res.json()) as {
    data?: { translations?: Array<{ translatedText: string }> };
  };
  return (data.data?.translations ?? []).map((t) => t.translatedText);
}
