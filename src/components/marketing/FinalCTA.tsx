import { Container } from "./Container";
import { Button } from "./Button";
import { Reveal } from "./Reveal";

type Props = {
  eyebrow?: string;
  title: string;
  accentWord?: string;
  description?: string;
  primaryHref?: string;
  primaryLabel?: string;
  secondaryHref?: string;
  secondaryLabel?: string;
};

export function FinalCTA({
  eyebrow = "Ready when you are",
  title = "Let's build something",
  accentWord = "together.",
  description = "A short intro call. Senior strategist on the line, your questions in plain language — no obligation, no deck-pitch.",
  primaryHref = "/contact",
  primaryLabel = "Talk to us",
  secondaryHref = "/services",
  secondaryLabel = "Browse services",
}: Props) {
  return (
    <section className="bg-mesh-dark grain relative overflow-hidden text-white">
      <Container className="relative z-10 py-[var(--section-y)]">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr] lg:items-end">
          <Reveal variant="fade-up">
            <span className="pill" style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.18)", color: "rgba(255,255,255,0.85)" }}>
              <span className="pill-dot" aria-hidden="true" />
              <span>{eyebrow}</span>
            </span>
            <h2 className="h-section mt-6 text-white">
              {title}
              {accentWord && (
                <>
                  {" "}
                  <span className="text-gradient-animated">{accentWord}</span>
                </>
              )}
            </h2>
            {description && (
              <p className="lede mt-6 max-w-xl" style={{ color: "rgba(255,255,255,0.7)" }}>
                {description}
              </p>
            )}
          </Reveal>

          <Reveal variant="fade-up" delay={150} className="flex flex-wrap gap-3 lg:justify-end">
            <Button as="link" href={primaryHref} size="lg">
              {primaryLabel}
              <span className="arrow-shift" aria-hidden="true">→</span>
            </Button>
            <Button as="link" href={secondaryHref} variant="glass" size="lg">
              {secondaryLabel}
            </Button>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
