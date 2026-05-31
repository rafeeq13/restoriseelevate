import createIntlMiddleware from "next-intl/middleware";
import type { NextRequest } from "next/server";
import { routing } from "./i18n/routing";

const intl = createIntlMiddleware(routing);

/**
 * Next 16 proxy (formerly middleware). Skips Payload admin/API routes,
 * static files, and Next internals; otherwise delegates locale handling
 * to next-intl.
 */
export function proxy(request: NextRequest) {
  return intl(request);
}

export const config = {
  matcher: [
    // Match everything except:
    // - /admin (Payload)
    // - /api (Payload + app API routes)
    // - /_next (static + image optimisation)
    // - File extensions (/.well-known assets, sitemap.xml, robots.txt, ico, png, etc.)
    "/((?!admin|api|_next|.*\\..*).*)",
  ],
};
