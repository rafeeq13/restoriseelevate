import { cn } from "@/lib/cn";

type Props = {
  items: readonly string[];
  className?: string;
};

export function MarqueeRail({ items, className }: Props) {
  const doubled = [...items, ...items];
  return (
    <div className={cn("lux-marquee", className)} aria-hidden="true">
      <div className="lux-marquee__track">
        {doubled.map((item, i) => (
          <span key={`${item}-${i}`} className="lux-marquee__item">
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
