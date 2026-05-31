import type { HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

type Props = HTMLAttributes<HTMLDivElement> & {
  /** "wide" stretches to 1280px (default); "narrow" caps at 880px for prose. */
  width?: "wide" | "narrow";
};

export function Container({
  className,
  children,
  width = "wide",
  ...rest
}: Props) {
  return (
    <div
      className={cn(
        "mx-auto w-full px-6 sm:px-8 lg:px-10",
        width === "wide"
          ? "max-w-[var(--max-content)]"
          : "max-w-[880px]",
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  );
}
