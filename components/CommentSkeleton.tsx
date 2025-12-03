import { Skeleton } from "@/components/ui";

interface CommentSkeletonProps {
  level?: number;
}

export function CommentSkeleton({ level = 0 }: CommentSkeletonProps) {
  const opacity = 1 - (level * 0.15); // Decrease opacity for nested comments
  const borderLeft = level > 0 ? 'border-l-2 border-neutral-100 dark:border-neutral-800 ml-2' : '';

  return (
    <div
      className={`flex flex-col gap-2 py-3 border-t border-neutral-100 dark:border-neutral-900 first:border-0 ${borderLeft}`}
      style={{ opacity: Math.max(opacity, 0.4) }}
    >
      {/* Header Skeleton */}
      <div className="flex items-center gap-1 leading-none">
        {/* Collapse/Expand button skeleton */}
        <Skeleton className="w-3 h-3" />
        {/* Upvote button skeleton */}
        <Skeleton className="w-3 h-3" />
        {/* Separator */}
        <Skeleton className="w-1 h-3 opacity-60" />
        {/* Username skeleton */}
        <Skeleton className="h-3 w-20" />
        {/* Separator */}
        <Skeleton className="w-1 h-3 opacity-60" />
        {/* Time skeleton */}
        <Skeleton className="h-3 w-16" />
        {/* Reply count skeleton (optional) */}
        <Skeleton className="h-3 w-4 opacity-80" />
      </div>

      {/* Content Skeleton */}
      <div className="pl-6 space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </div>

      {/* Only show nested skeleton for first two levels */}
      {level < 2 && (
        <div className="pl-4 ml-2 border-l-2 border-neutral-100 dark:border-neutral-800 space-y-2">
          <div className="flex items-center gap-1 leading-none opacity-60">
            <Skeleton className="w-3 h-3" />
            <Skeleton className="w-3 h-3" />
            <Skeleton className="w-1 h-3 opacity-40" />
            <Skeleton className="h-3 w-16" />
            <Skeleton className="w-1 h-3 opacity-40" />
            <Skeleton className="h-3 w-12" />
          </div>
          <div className="pl-6 space-y-1 opacity-40">
            <Skeleton className="h-3 w-5/6" />
            <Skeleton className="h-3 w-2/3" />
          </div>
        </div>
      )}
    </div>
  );
}
