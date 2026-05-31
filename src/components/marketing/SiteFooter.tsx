import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { Container } from "./Container";
import type { Footer, SiteSettings } from "@/lib/siteData";

type Props = {
  settings: SiteSettings;
  footer: Footer;
};

/* ------------------------------------------------------------------
   SiteFooter — Aurora Midnight closing chord.

   This footer is the "global closing chord" — it renders on every
   page and sets a consistent dark luxury baseline. Tokens live in
   styles.css under the LUX FOOTER block (.lux-footer*).
   ------------------------------------------------------------------ */

function platformLabel(p: string): string {
  // Tolerant of arbitrary casing / aliases.
  const k = p.trim().toLowerCase();
  if (k === "x" || k === "twitter") return "X";
  if (k === "ig" || k === "instagram") return "IG";
  if (k === "fb" || k === "facebook") return "Fb";
  if (k === "in" || k === "linkedin") return "in";
  if (k === "tt" || k === "tiktok") return "TT";
  if (k === "yt" || k === "youtube") return "YT";
  if (k === "be" || k === "behance") return "Be";
  if (k === "db" || k === "dribbble") return "Db";
  return p.slice(0, 2);
}

export function SiteFooter({ settings, footer }: Props) {
  return (
    <footer className="lux-footer">
      <div className="lux-footer-top-shimmer" />

      <Container>
        {/* ============================================================
            CINEMATIC MARK — top editorial line, sets the closing tone
            ============================================================ */}
        <div className="pt-[clamp(4rem,8vw,7rem)] pb-[clamp(3rem,6vw,5rem)] hidden  ">
          <div className="grid gap-10 lg:grid-cols-[1.4fr_auto] lg:items-end">
            <p className="lux-footer__mark max-w-3xl">
              Built around the venue.
              <br />
              <em>Not the other way round.</em>
            </p>
            <Link href="/contact" className="lux-btn lux-btn--primary group self-start lg:self-end">
              Begin a conversation
              <span className="arrow-shift" aria-hidden="true">→</span>
            </Link>
          </div>
        </div>

        <div className="lux-footer__rule" />

        {/* ============================================================
            COLUMNS — brand + nav stacks
            ============================================================ */}
        <div className="grid gap-12 pt-14 pb-12 lg:grid-cols-[1.7fr_1fr_1fr_1fr]">
          {/* Brand column */}
          <div>
            <Link
              href="/"
              aria-label={settings.siteName}
              className="inline-flex items-center"
            >
              {/* Footer is always on the dark Aurora surface, so use
                  the reversed logo directly — preserves brand red on
                  the arrow / wordmark / gears. */}
              <Image
                src="/brand/logo-reversed.webp"
                alt={settings.siteName}
                width={220}
                height={48}
                className="h-10 w-auto opacity-95"
              />
            </Link>

            <p className="mt-6 max-w-md text-base leading-relaxed text-[color:var(--lux-pearl-soft)]">
              {settings.tagline}
            </p>

            {settings.contact.email && (
              <a
                href={`mailto:${settings.contact.email}`}
                className="lux-footer__email mt-7"
              >
                <span className="lux-footer__email-dot" aria-hidden="true" />
                {settings.contact.email}
              </a>
            )}

            {settings.contact.workingHours && (
              <p className="mt-5 text-sm text-[color:var(--lux-pearl-soft)]">
                <span className="text-[color:var(--lux-pearl-faint)]">Hours · </span>
                {settings.contact.workingHours}
              </p>
            )}

            {settings.socials && settings.socials.length > 0 && (
              <div className="mt-7 flex flex-wrap items-center gap-3">
                {settings.socials.map((s) => (
                  <a
                    key={s.url}
                    href={s.url}
                    target="_blank"
                    rel="noreferrer noopener"
                    aria-label={s.platform}
                    className="lux-social font-bold text-[11px] tracking-wider"
                  >
                    {platformLabel(s.platform)}
                  </a>
                ))}
              </div>
            )}

            <p className="mt-8 text-[11px] uppercase tracking-[0.22em] text-[color:var(--lux-pearl-faint)]">
              {settings.geographicScope}
            </p>
          </div>

          {/* Nav columns */}
          {footer.columns.map((column) => (
            <nav
              key={column.heading}
              aria-labelledby={`footer-${column.heading}`}
            >
              <h2
                id={`footer-${column.heading}`}
                className="lux-footer__column-heading"
              >
                {column.heading}
              </h2>
              <ul className="mt-6 space-y-3.5">
                {column.links.map((link) => (
                  <li key={`${column.heading}-${link.href}`}>
                    <Link href={link.href} className="lux-footer__link group">
                      {link.label}
                      <span aria-hidden="true" className="lux-footer__link__arrow">
                        →
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        {/* ============================================================
            LEGAL STRIP — hairline divider, copyright + legal pills
            ============================================================ */}
        <div className="lux-footer__rule" />

        <div className="flex flex-col gap-4 py-7 sm:flex-row sm:items-center sm:justify-between">
          <p className="lux-footer__legal">{footer.copyright}</p>
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            {footer.legalLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="lux-footer__legal">
                  {link.label}
                </Link>
              </li>
            ))}
            <li>
              <button
                type="button"
                data-action="open-cookie-preferences"
                className="lux-footer__legal"
              >
                Cookie preferences
              </button>
            </li>
          </ul>
        </div>
      </Container>
    </footer>
  );
}
