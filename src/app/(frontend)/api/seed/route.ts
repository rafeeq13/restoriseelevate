import { NextResponse } from "next/server";
import { getPayload } from "payload";
import config from "@/payload.config";
import { runSeed } from "@/seed/seed";

/**
 * POST /api/seed — populates marketing collections with sample data.
 *
 * Dev-only by default. To run:
 *   curl -X POST http://localhost:3000/api/seed
 *
 * Idempotent — safe to call multiple times. Returns counts of newly
 * created records per collection.
 */
export async function POST() {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json(
      { error: "Seeding disabled in production." },
      { status: 403 },
    );
  }

  try {
    const payload = await getPayload({ config });
    const result = await runSeed(payload);
    return NextResponse.json({ ok: true, result });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}

// Convenience GET for browser-based triggering during development.
export async function GET() {
  return POST();
}
