import { Ticker } from "./Ticker";

/**
 * Marquee of mock hospitality client text logos. Each logo is a stylised
 * wordmark in display type — no external imagery required. Used as social
 * proof strip on the homepage.
 */

const LOGOS = [
  { name: "Alba", glyph: "A" },
  { name: "Maison Vert", glyph: "MV" },
  { name: "Roma Trattoria", glyph: "RT" },
  { name: "Saffron & Co.", glyph: "S&" },
  { name: "Harvest", glyph: "H" },
  { name: "Bento Lab", glyph: "BL" },
  { name: "Casa Mio", glyph: "CM" },
  { name: "Loft Coffee", glyph: "L" },
  { name: "Urban Grill", glyph: "UG" },
  { name: "Patisserie Nord", glyph: "PN" },
];

export function LogoWall() {
  return (
    <Ticker
      speedSeconds={50}
      items={LOGOS.map((l) => (
        <span key={l.name} className="logo-mark">
          <span className="logo-mark__glyph">{l.glyph}</span>
          <span>{l.name}</span>
        </span>
      ))}
      separator={
        <span
          aria-hidden="true"
          className="inline-block h-1 w-1 rounded-full bg-[color:var(--brand-border-strong)]"
        />
      }
    />
  );
}
