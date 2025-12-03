import { cn } from "@/lib/utils";
import { ReactNode } from "react";

type BadgeVariant = "orange" | "purple" | "green" | "blue" | "amber" | "neutral";
type BadgeSize = "sm" | "md";

interface BadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
  size?: BadgeSize;
  icon?: ReactNode;
  className?: string;
}

const variantStyles = {
  orange: "bg-orange-50 text-orange-600 dark:bg-orange-950/30 dark:text-orange-500",
  purple: "bg-purple-100 text-purple-700 dark:bg-purple-950/50 dark:text-purple-400",
  green: "bg-green-100 text-green-700 dark:bg-green-950/50 dark:text-green-400",
  blue: "bg-blue-100 text-blue-700 dark:bg-blue-950/50 dark:text-blue-400",
  amber: "bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400",
  neutral: "bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300",
};

const sizeStyles = {
  sm: "px-1.5 py-0.5 text-xs gap-1",
  md: "px-2 py-1 text-xs gap-1",
};

export function Badge({
  children,
  variant = "neutral",
  size = "sm",
  icon,
  className,
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center font-bold rounded-full leading-none",
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
    >
      {icon}
      {children}
    </span>
  );
}

// Score/Karma badge with upvote icon pattern
interface ScoreBadgeProps {
  score: number;
  icon?: ReactNode;
  className?: string;
}

export function ScoreBadge({ score, icon, className }: ScoreBadgeProps) {
  return (
    <Badge variant="orange" size="md" icon={icon} className={className}>
      {score}
    </Badge>
  );
}
