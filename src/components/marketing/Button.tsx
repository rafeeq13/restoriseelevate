import { Link } from "@/i18n/navigation";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

type Variant = "primary" | "secondary" | "ghost" | "dark" | "glass";
type Size = "sm" | "md" | "lg";

const baseClasses = cn(
  "group relative inline-flex items-center justify-center gap-2",
  "font-bold whitespace-nowrap rounded-[var(--radius-pill)]",
  "transition-[transform,box-shadow,background,color,border-color] duration-300",
  "ease-[cubic-bezier(0.22,1,0.36,1)]",
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--brand-primary)]",
  "disabled:opacity-50 disabled:cursor-not-allowed",
);

const variantClasses: Record<Variant, string> = {
  primary: cn(
    "btn-glow text-white border border-transparent",
    "bg-[image:var(--grad-primary)] bg-[length:200%_100%] bg-left",
    "shadow-[var(--glow-primary)]",
    "hover:bg-right hover:-translate-y-0.5 hover:shadow-[var(--glow-primary-strong)]",
    "active:translate-y-0",
  ),
  secondary: cn(
    "bg-[color:var(--brand-surface)] text-ink border border-[color:var(--brand-border-strong)]",
    "hover:border-[color:var(--brand-ink)] hover:-translate-y-0.5",
    "hover:shadow-[var(--shadow-md)]",
    "active:translate-y-0",
  ),
  ghost: cn(
    "bg-transparent text-ink-soft border border-transparent",
    "hover:text-[color:var(--brand-primary)]",
  ),
  dark: cn(
    "bg-[color:var(--brand-accent)] text-white border border-[color:var(--brand-accent)]",
    "hover:bg-[color:var(--brand-primary)] hover:border-[color:var(--brand-primary)]",
    "hover:-translate-y-0.5 hover:shadow-[var(--glow-primary)]",
    "active:translate-y-0",
  ),
  glass: cn(
    "text-white border border-white/25",
    "bg-white/10 backdrop-blur-md",
    "hover:bg-white/20 hover:border-white/40 hover:-translate-y-0.5",
    "active:translate-y-0",
  ),
};

const sizeClasses: Record<Size, string> = {
  sm: "h-9 px-4 text-[13px] tracking-wide",
  md: "h-11 px-6 text-sm tracking-wide",
  lg: "h-[56px] px-8 text-[15px] tracking-wide",
};

type Common = {
  variant?: Variant;
  size?: Size;
  children: ReactNode;
};

type ButtonAsButton = ButtonHTMLAttributes<HTMLButtonElement> &
  Common & { as?: "button" };

type ButtonAsLink = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> &
  Common & { as: "link"; href: string };

type ButtonProps = ButtonAsButton | ButtonAsLink;

export function Button(props: ButtonProps) {
  const variant: Variant = props.variant ?? "primary";
  const size: Size = props.size ?? "md";
  const classes = cn(
    baseClasses,
    variantClasses[variant],
    sizeClasses[size],
    props.className,
  );

  if (props.as === "link") {
    const { as: _as, variant: _v, size: _s, className: _c, href, children, ...rest } =
      props;
    return (
      <Link className={classes} href={href} {...rest}>
        {children}
      </Link>
    );
  }

  const { as: _as, variant: _v, size: _s, className: _c, children, ...rest } =
    props;
  return (
    <button className={classes} {...rest}>
      {children}
    </button>
  );
}
