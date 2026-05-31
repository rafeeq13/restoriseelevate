import { Container } from "./Container";
import { Aurora } from "./Aurora";

type Props = {
  /** Optional roman/numeric chapter marker rendered above the eyebrow. */
  chapter?: string;
  eyebrow?: string;
  title: string;
  /** Italic gradient word appended to the title. */
  accentWord?: string;
  /** Optional secondary muted word inserted between title and accent. */
  strokeWord?: string;
  description?: string;
  /** Compact mode for legal pages — no aurora background, tighter padding. */
  compact?: boolean;
};

/* ------------------------------------------------------------------
   PageHeader — Aurora cinematic hero for every inner page.

   Renders inside <main class="lux-page"> so background + text
   tokens are already obsidian + pearl. The header section adds
   layered aurora glow for cinematic depth, an italic gradient
   accent word, and an optional chapter marker (roman numeral or
   "01"-style) for editorial rhythm across pages.

   Compact mode skips the aurora and trims padding — used by
   legal pages (privacy / terms / cookies) where a soft entrance
   reads better than a full cinematic hero.
   ------------------------------------------------------------------ */

export function PageHeader({
  chapter,
  eyebrow,
  title,
  accentWord,
  strokeWord,
  description,
  compact = false,
}: Props) {
  if (compact) {
    return (
      <section
        className="relative overflow-hidden"
        style={{ background: "var(--lux-onyx)" }}
      >
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{ background: "var(--lux-grad-aurora-soft)", opacity: 0.55 }}
        />
        <Container
          className="relative z-10"
          style={{
            paddingTop: "var(--hero-y-top)",
            paddingBottom: "var(--hero-y-bottom)",
          }}
        >
          <div className="max-w-3xl">
            {chapter && (
              <p className="text-[0.7rem] font-bold uppercase tracking-[0.32em] text-[color:var(--lux-champagne)]">
                <span className="font-display italic font-extrabold normal-case tracking-tight text-[1rem]">
                  No.
                </span>{" "}
                {chapter}
              </p>
            )}
            {eyebrow && (
              <span className={`lux-overline ${chapter ? "mt-4" : ""}`}>
                {eyebrow}
              </span>
            )}
            <h1 className="lux-section-title mt-5">
              {title}
              {strokeWord && (
                <>
                  {" "}
                  <span style={{ color: "var(--lux-pearl-faint)" }}>{strokeWord}</span>
                </>
              )}
              {accentWord && (
                <>
                  {" "}
                  <em>{accentWord}</em>
                </>
              )}
            </h1>
            {description && (
              <p className="lux-lede mt-6 max-w-2xl">{description}</p>
            )}
          </div>
        </Container>
        <div
          className="absolute inset-x-0 bottom-0 h-px"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(255, 87, 87, 0.45), transparent)",
          }}
          aria-hidden="true"
        />
      </section>
    );
  }

  return (
    <section
      className="relative overflow-hidden"
      style={{ background: "var(--lux-onyx)" }}
    >
      <Aurora variant="soft" />

      <Container
        className="relative z-10"
        style={{
          paddingTop: "var(--hero-y-top)",
          paddingBottom: "var(--hero-y-bottom)",
        }}
      >
        <div className="max-w-4xl">
          {chapter && (
            <p className="text-[0.7rem] font-bold uppercase tracking-[0.32em] text-[color:var(--lux-champagne)]">
              <span className="font-display italic font-extrabold normal-case tracking-tight text-[1rem]">
                Chapter
              </span>{" "}
              <span className="ml-1">{chapter}</span>
            </p>
          )}

          {eyebrow && (
            <span className={`lux-overline ${chapter ? "mt-5" : ""}`}>
              {eyebrow}
            </span>
          )}

          <h1
            className="lux-display mt-5 max-w-[22ch]"
            style={{ fontSize: "clamp(2.25rem, 5vw, 4.25rem)" }}
          >
            {title}
            {strokeWord && (
              <>
                {" "}
                <span style={{ color: "var(--lux-pearl-faint)" }}>{strokeWord}</span>
              </>
            )}
            {accentWord && (
              <>
                {" "}
                <em>{accentWord}</em>
              </>
            )}
          </h1>

          {description && (
            <p className="lux-lede mt-6 max-w-2xl">{description}</p>
          )}
        </div>
      </Container>

      <div
        className="absolute inset-x-0 bottom-0 h-px z-10"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(255, 87, 87, 0.5), transparent)",
        }}
        aria-hidden="true"
      />
    </section>
  );
}
