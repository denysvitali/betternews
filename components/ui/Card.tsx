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
  default: "border-neutral-200 dark:border-neutral-800 shadow-sm",
  hover: "border-neutral-200 dark:border-neutral-800 shadow-sm hover:border-orange-200 hover:shadow-lg hover:-translate-y-0.5 dark:hover:border-orange-900/50 transition-all duration-200",
  interactive: "border-neutral-200 dark:border-neutral-800 shadow-sm hover:border-orange-200 hover:shadow-md hover:-translate-y-0.5 active:scale-[0.99] dark:hover:border-orange-900/50 transition-all duration-200 cursor-pointer",
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
        "rounded-xl border bg-white dark:bg-neutral-900",
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
