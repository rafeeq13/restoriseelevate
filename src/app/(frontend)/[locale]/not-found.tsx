import Image from "next/image";
import { Container } from "@/components/marketing/Container";
import { Button } from "@/components/marketing/Button";
import { Link } from "@/i18n/navigation";

export const metadata = {
  title: "Page not found",
  description: "We couldn't find the page you were looking for.",
};

export default function NotFound() {
  return (
    <section className="relative overflow-hidden bg-[color:var(--brand-surface)]">
      {/* Soft corner orbs for atmosphere */}
      <span
        aria-hidden="true"
        className="absolute -top-40 -right-40 h-[480px] w-[480px] rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(255,8,68,0.18), transparent 65%)",
          filter: "blur(60px)",
        }}
      />
      <span
        aria-hidden="true"
        className="absolute -bottom-40 -left-40 h-[420px] w-[420px] rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(255,181,71,0.18), transparent 65%)",
          filter: "blur(60px)",
        }}
      />

      <Container className="relative z-10 pt-24 pb-24 sm:pt-32 sm:pb-28">
        <div className="grid gap-14 lg:grid-cols-[1.1fr_1fr] lg:items-center">
          {/* Left — message */}
          <div>
            <span className="pill">
              <span className="pill-dot" aria-hidden="true" />
              <span>Error 404</span>
            </span>

            <h1 className="h-hero mt-6 text-ink">
              This page <span className="text-gradient-animated">went missing.</span>
            </h1>

            <p className="lede mt-6 max-w-xl">
              The link is broken or the page has moved. While you&apos;re here,
              jump back to home — or pick one of the popular spots below.
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Button as="link" href="/" size="lg">
                Back to home
                <span className="arrow-shift" aria-hidden="true">→</span>
              </Button>
              <Button as="link" href="/contact" variant="secondary" size="lg">
                Get in touch
              </Button>
            </div>

            <nav aria-label="Popular pages" className="mt-12">
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-ink-faint">
                Popular pages
              </p>
              <ul className="mt-4 flex flex-wrap gap-2">
                {[
                  { label: "Services", href: "/services" },
                  { label: "Portfolio", href: "/portfolio" },
                  { label: "About", href: "/about" },
                  { label: "Blog", href: "/blog" },
                  { label: "FAQ", href: "/faq" },
                ].map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      className="inline-flex items-center gap-1.5 rounded-full border border-[color:var(--brand-border)] bg-[color:var(--brand-surface)] px-3.5 py-1.5 text-xs font-bold text-ink-soft transition-all hover:border-[color:var(--brand-primary)] hover:text-[color:var(--brand-primary)]"
                    >
                      {l.label}
                      <span aria-hidden="true">→</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* Right — 404 image with halo */}
          <div className="relative">
            <span
              aria-hidden="true"
              className="absolute -inset-8 rounded-[var(--radius-3xl)]"
              style={{
                background: "var(--grad-primary)",
                opacity: 0.20,
                filter: "blur(40px)",
              }}
            />
            <div className="relative overflow-hidden rounded-[var(--radius-2xl)] border border-[color:var(--brand-border)] shadow-[var(--shadow-lg)]">
              <Image
                src="/brand/404.png"
                alt="Page not found"
                width={1920}
                height={1080}
                priority
                className="h-auto w-full"
              />
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
