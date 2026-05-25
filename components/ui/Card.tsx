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
  sm: "p-4",
  md: "p-5",
  lg: "p-6 sm:p-7",
};

const variantStyles = {
  default: "border-[var(--border-soft)] shadow-sm focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2",
  hover: "border-[var(--border-soft)] shadow-sm transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 motion-safe:hover:border-orange-300/70 motion-safe:hover:bg-orange-50/35 dark:motion-safe:hover:bg-white/[0.03]",
  interactive: "cursor-pointer border-[var(--border-soft)] shadow-sm transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 motion-safe:hover:border-orange-300/70 motion-safe:hover:bg-orange-50/35 dark:motion-safe:hover:bg-white/[0.03]",
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
        "surface-card rounded-lg border transition-colors duration-200",
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
