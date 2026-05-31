"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Container } from "./Container";
import { Button } from "./Button";
import { LocaleSwitcher } from "./LocaleSwitcher";
import type { Navigation, SiteSettings } from "@/lib/siteData";

type Props = {
  settings: SiteSettings;
  navigation: Navigation;
};

/* ------------------------------------------------------------------
   SiteHeader — clean modern agency nav.

   Two logo variants render in the brand mark — CSS in styles.css
   swaps visibility when the page wraps in .lux-page / .lux-home so
   the brand red is preserved on every surface (no destructive
   `brightness(0) invert(1)` filter).

   Nav uses sentence case (not uppercase) with comfortable tracking
   for a Linear / Vercel feel. Active dropdown trigger gets a subtle
   surface tint and a brand-red underline — no full gradient fill.
   ------------------------------------------------------------------ */

export function SiteHeader({ settings, navigation }: Props) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openMenuLabel, setOpenMenuLabel] = useState<string | null>(null);
  // Tracks which parent's children are expanded in the MOBILE drawer.
  // Default null = all top-level labels visible, every sub-tree
  // collapsed. Single-open pattern: opening one closes the others.
  const [openMobileChild, setOpenMobileChild] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const t = useTranslations("Nav");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    // Whenever the drawer closes, collapse any expanded sub-tree so
    // the next open starts clean (all parents visible, none expanded).
    if (!mobileOpen) setOpenMobileChild(null);
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <header
      data-scrolled={scrolled ? "true" : "false"}
      className={[
        "sticky top-0 z-40 transition-[background,border-color,box-shadow,backdrop-filter] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
        scrolled
          ? "border-b border-[color:var(--brand-border)] bg-white/85 backdrop-blur-xl shadow-[0_4px_24px_-12px_rgba(0,0,0,0.10)]"
          : "border-b border-transparent bg-transparent",
      ].join(" ")}
    >
      <Container>
        <div className="flex h-[84px] items-center justify-between gap-10">
          {/* Brand mark */}
          <Link
            href="/"
            aria-label={settings.siteName}
            className="inline-flex items-center"
          >
            <Image
              src="/brand/logo-primary.webp"
              alt={settings.siteName}
              width={240}
              height={56}
              priority
              className="lux-logo-light h-10 w-auto"
            />
            <Image
              src="/brand/logo-reversed.webp"
              alt={settings.siteName}
              width={240}
              height={56}
              priority
              className="lux-logo-dark h-10 w-auto"
            />
          </Link>

          {/* Primary nav (desktop) */}
          <nav
            aria-label="Primary"
            className="hidden lg:flex lg:flex-1 lg:items-center lg:justify-center lg:gap-1"
          >
            {navigation.primaryLinks.map((link) => {
              const hasChildren = link.children && link.children.length > 0;
              const isOpen = openMenuLabel === link.label;
              return (
                <div
                  key={link.label}
                  className="relative"
                  onMouseEnter={() => hasChildren && setOpenMenuLabel(link.label)}
                  onMouseLeave={() => setOpenMenuLabel(null)}
                >
                  <Link
                    href={link.href}
                    className={[
                      "relative inline-flex items-center gap-1.5 px-3.5 py-2 text-[14px] font-semibold rounded-full transition-all duration-200",
                      isOpen
                        ? "text-ink bg-[color:var(--brand-surface-soft)]"
                        : "text-ink-soft hover:text-ink hover:bg-[color:var(--brand-surface-soft)]",
                    ].join(" ")}
                    aria-haspopup={hasChildren ? "menu" : undefined}
                    aria-expanded={hasChildren ? isOpen : undefined}
                  >
                    {link.label}
                    {hasChildren && (
                      <svg
                        aria-hidden="true"
                        viewBox="0 0 12 12"
                        className={`h-3 w-3 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                      >
                        <path
                          d="M3 4.5L6 7.5L9 4.5"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          fill="none"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                    {/* Brand-red underline reveal on hover/open */}
                    <span
                      aria-hidden="true"
                      className={[
                        "absolute left-3.5 right-3.5 -bottom-1 h-[2px] origin-center rounded-full transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
                        isOpen ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100",
                      ].join(" ")}
                      style={{ background: "var(--grad-gold)" }}
                    />
                  </Link>

                  {hasChildren && isOpen && (
                    <div
                      role="menu"
                      className="absolute left-0 top-full pt-3 z-50"
                    >
                      <div className="lux-dropdown min-w-[280px] max-w-[340px] rounded-[var(--radius-xl)] p-2">
                        {link.children!.map((child) => (
                          <Link
                            key={child.href}
                            href={child.href}
                            role="menuitem"
                            className="lux-dropdown__item group/item flex items-center justify-between gap-3 rounded-[var(--radius-md)] px-3.5 py-2.5 text-[14px] font-semibold"
                          >
                            <span>{child.label}</span>
                            <span
                              className="lux-dropdown__arrow translate-x-[-4px] opacity-0 transition-all group-hover/item:translate-x-0 group-hover/item:opacity-100"
                              aria-hidden="true"
                            >
                              →
                            </span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          {/* Right cluster — locale + CTA */}
          <div className="hidden lg:flex lg:items-center lg:gap-3">
            <LocaleSwitcher />
            <Button as="link" href={navigation.ctaHref} size="md">
              {navigation.ctaLabel}
              <span className="arrow-shift" aria-hidden="true">→</span>
            </Button>
          </div>

          {/* Mobile menu trigger */}
          <button
            type="button"
            aria-label={mobileOpen ? t("closeMenu") : t("openMenu")}
            aria-expanded={mobileOpen}
            className="lg:hidden inline-flex h-11 w-11 items-center justify-center rounded-full border border-[color:var(--brand-border-strong)] bg-white/80 backdrop-blur-md text-ink transition-all hover:border-[color:var(--brand-primary)] hover:text-[color:var(--brand-primary)]"
            onClick={() => setMobileOpen((v) => !v)}
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
              {mobileOpen ? (
                <path
                  d="M6 6L18 18M6 18L18 6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              ) : (
                <path
                  d="M4 7H20M4 12H20M4 17H20"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile menu drawer — collapsible parents.

            Renders as a FIXED full-viewport overlay (see CSS)
            so the page content beneath cannot bleed through.
            The nav list scrolls inside; the locale + CTA footer
            is pinned to the drawer floor.

            Default state: every top-level label visible, every
            sub-tree collapsed. Tapping a parent toggles its
            sub-tree (single-open pattern). */}
        {mobileOpen && (
          <div className="lux-mobile-drawer lg:hidden">
            <ul className="flex flex-col gap-1 py-3 flex-1">
              {navigation.primaryLinks.map((link) => {
                const hasChildren =
                  link.children && link.children.length > 0;
                const isOpen = openMobileChild === link.label;
                return (
                  <li key={link.label}>
                    {hasChildren ? (
                      <button
                        type="button"
                        aria-expanded={isOpen}
                        aria-controls={`mobile-sub-${link.label}`}
                        onClick={() =>
                          setOpenMobileChild(isOpen ? null : link.label)
                        }
                        className="lux-mobile-link flex w-full items-center justify-between rounded-[var(--radius-md)] px-4 py-3.5 text-[16px] font-bold"
                      >
                        <span>{link.label}</span>
                        <svg
                          viewBox="0 0 12 12"
                          aria-hidden="true"
                          className={`h-3.5 w-3.5 transition-transform duration-200 ${
                            isOpen ? "rotate-180" : ""
                          }`}
                        >
                          <path
                            d="M3 4.5L6 7.5L9 4.5"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            fill="none"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </button>
                    ) : (
                      <Link
                        href={link.href}
                        className="lux-mobile-link block rounded-[var(--radius-md)] px-4 py-3.5 text-[16px] font-bold"
                        onClick={() => setMobileOpen(false)}
                      >
                        {link.label}
                      </Link>
                    )}

                    {hasChildren && isOpen && (
                      <ul
                        id={`mobile-sub-${link.label}`}
                        className="lux-mobile-sublist ml-4 mt-1 mb-2 pl-4"
                      >
                        {/* Overview link so /services etc. is still
                            reachable when the parent itself isn't a
                            direct nav link in mobile view. */}
                        <li>
                          <Link
                            href={link.href}
                            className="lux-mobile-sublink block rounded-[var(--radius-sm)] px-3 py-2.5 text-[14px] font-semibold"
                            onClick={() => setMobileOpen(false)}
                          >
                            <span style={{ opacity: 0.85 }}>All</span>{" "}
                            {link.label}
                            <span aria-hidden="true" className="ml-1">→</span>
                          </Link>
                        </li>
                        {link.children!.map((child) => (
                          <li key={child.href}>
                            <Link
                              href={child.href}
                              className="lux-mobile-sublink block rounded-[var(--radius-sm)] px-3 py-2.5 text-[14px] font-semibold"
                              onClick={() => setMobileOpen(false)}
                            >
                              {child.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                );
              })}
            </ul>
            <div className="lux-mobile-footer mt-2 flex flex-col gap-4 pt-5 pb-2">
              {/* Inline chip-row variant — no overlay dropdown */}
              <LocaleSwitcher inline />
              <Button
                as="link"
                href={navigation.ctaHref}
                className="w-full"
                size="md"
              >
                {navigation.ctaLabel}
                <span aria-hidden="true">→</span>
              </Button>
            </div>
          </div>
        )}
      </Container>
    </header>
  );
}
