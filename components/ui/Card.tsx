import { cn } from "@/lib/utils";
import { ReactNode, MouseEventHandler } from "react";

export interface CardProps {
  children: ReactNode;
  className?: string;
  variant?: "default" | "hover" | "interactive";
  padding?: "none" | "sm" | "md" | "lg";
  as?: "div" | "article" | "section";
  onClick?: MouseEventHandler<HTMLElement>;
}

const paddingStyles = {
  none: "",
  sm: "p-3",
  md: "p-4",
  lg: "p-6 sm:p-8",
};

const variantStyles = {
  default: "border-[var(--border-soft)] shadow-[0_10px_30px_rgba(15,23,42,0.06)] focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2",
  hover: "border-[var(--border-soft)] shadow-[0_12px_34px_rgba(15,23,42,0.08)] hover:border-orange-300/60 hover:shadow-[0_18px_44px_rgba(245,121,32,0.12)] hover:-translate-y-1 active:scale-[0.985] transition-all duration-300 focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2",
  interactive: "border-[var(--border-soft)] shadow-[0_12px_34px_rgba(15,23,42,0.08)] hover:border-orange-300/60 hover:shadow-[0_16px_38px_rgba(245,121,32,0.1)] hover:-translate-y-0.5 active:scale-[0.99] transition-all duration-300 cursor-pointer focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2",
};

export function Card({
  children,
  className,
  variant = "default",
  padding = "md",
  as: Component = "div",
  onClick,
}: CardProps) {
  return (
    <Component
      className={cn(
        "surface-card rounded-[1.4rem] border transition-colors duration-200",
        variantStyles[variant],
        paddingStyles[padding],
        className
      )}
      onClick={onClick}
    >
      {children}
    </Component>
  );
}

// Subcomponents for common card patterns
export function CardHeader({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex items-center gap-3", className)}>{children}</div>
  );
}

export function CardContent({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={cn("flex flex-col gap-2", className)}>{children}</div>;
}

export function CardFooter({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("mt-auto flex items-center gap-2 pt-2", className)}>
      {children}
    </div>
  );
}
