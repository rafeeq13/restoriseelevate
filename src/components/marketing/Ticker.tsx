import type { ReactNode } from "react";

type Props = {
  /** Items to render. Will be duplicated internally so the scroll seam is invisible. */
  items: ReactNode[];
  /** Optional separator rendered between items. Defaults to a hairline dot. */
  separator?: ReactNode;
  /** Animation speed (lower = faster). Default 40s for a full cycle. */
  speedSeconds?: number;
  /** Reverse scroll direction. */
  reverse?: boolean;
  className?: string;
};

export function Ticker({
  items,
  separator,
  speedSeconds = 40,
  reverse = false,
  className,
}: Props) {
  const sep = separator ?? (
    <span
      aria-hidden="true"
      className="inline-block h-1.5 w-1.5 rounded-full bg-current opacity-30"
    />
  );

  const Track = (
    <div
      className="ticker-track"
      style={{ ["--ticker-speed" as string]: `${speedSeconds}s` }}
    >
      {items.map((item, i) => (
        <span
          key={`a-${i}`}
          className="inline-flex shrink-0 items-center gap-12"
        >
          <span className="inline-flex shrink-0 items-center">{item}</span>
          <span className="inline-flex shrink-0 items-center">{sep}</span>
        </span>
      ))}
      {items.map((item, i) => (
        <span
          key={`b-${i}`}
          aria-hidden="true"
          className="inline-flex shrink-0 items-center gap-12"
        >
          <span className="inline-flex shrink-0 items-center">{item}</span>
          <span className="inline-flex shrink-0 items-center">{sep}</span>
        </span>
      ))}
    </div>
  );

  return (
    <div className={`ticker ${reverse ? "ticker-reverse" : ""} ${className ?? ""}`}>
      {Track}
    </div>
  );
}
