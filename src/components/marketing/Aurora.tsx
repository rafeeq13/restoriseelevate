import { cn } from "@/lib/cn";

type Props = {
  variant?: "full" | "soft";
  className?: string;
};

export function Aurora({ variant = "full", className }: Props) {
  return (
    <div className={cn("lux-aurora", className)} aria-hidden="true">
      <div className="lux-aurora__layer" />
      {variant === "full" && <div className="lux-aurora__layer lux-aurora__layer--2" />}
      <div className="lux-aurora__orb lux-aurora__orb--gold" />
      <div className="lux-aurora__orb lux-aurora__orb--rose" />
      {variant === "full" && <div className="lux-aurora__orb lux-aurora__orb--wine" />}
      <div className="lux-aurora__grid" />
      <div className="lux-aurora__noise" />
    </div>
  );
}
