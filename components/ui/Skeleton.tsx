import { cn } from "@/lib/utils";

interface SkeletonProps {
  className?: string;
  variant?: "default" | "circular" | "rounded";
}

const variantStyles = {
  default: "rounded",
  circular: "rounded-full",
  rounded: "rounded-lg",
};

export function Skeleton({ className, variant = "default" }: SkeletonProps) {
  return (
    <div
      className={cn(
        "animate-pulse bg-neutral-200 dark:bg-neutral-800",
        variantStyles[variant],
        className
      )}
    />
  );
}

// Common skeleton patterns
export function SkeletonText({
  className,
  lines = 1,
  lastLineWidth = "full",
}: {
  className?: string;
  lines?: number;
  lastLineWidth?: "full" | "3/4" | "1/2" | "1/4";
}) {
  const widthMap = {
    full: "w-full",
    "3/4": "w-3/4",
    "1/2": "w-1/2",
    "1/4": "w-1/4",
  };

  return (
    <div className={cn("space-y-2", className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          className={cn(
            "h-4",
            i === lines - 1 ? widthMap[lastLineWidth] : "w-full"
          )}
        />
      ))}
    </div>
  );
}

export function SkeletonAvatar({
  size = "md",
  className,
}: {
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const sizeStyles = {
    sm: "h-8 w-8",
    md: "h-10 w-10",
    lg: "h-20 w-20",
  };

  return (
    <Skeleton
      variant="circular"
      className={cn(sizeStyles[size], className)}
    />
  );
}

export function SkeletonButton({
  size = "md",
  className,
}: {
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const sizeStyles = {
    sm: "h-8 w-16",
    md: "h-9 w-20",
    lg: "h-11 w-24",
  };

  return (
    <Skeleton
      variant="rounded"
      className={cn(sizeStyles[size], className)}
    />
  );
}
