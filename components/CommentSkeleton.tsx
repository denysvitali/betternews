interface CommentSkeletonProps {
  level?: number;
}

export function CommentSkeleton({ level = 0 }: CommentSkeletonProps) {
  const opacity = 1 - (level * 0.15); // Decrease opacity for nested comments
  const marginLeft = level * 16; // 16px per level
  const borderLeft = level > 0 ? 'border-l-2 border-neutral-100 dark:border-neutral-800 ml-2' : '';

  return (
    <div
      className={`flex flex-col gap-2 py-3 border-t border-neutral-100 dark:border-neutral-900 first:border-0 ${borderLeft}`}
      style={{ opacity: Math.max(opacity, 0.4) }}
    >
      {/* Header Skeleton */}
      <div className="flex items-center gap-1.5">
        {/* Collapse/Expand button skeleton */}
        <div className="w-3 h-3 rounded bg-gradient-to-r from-neutral-200 to-neutral-300 dark:from-neutral-700 dark:to-neutral-600 animate-pulse" />

        {/* Upvote button skeleton */}
        <div className="w-3 h-3 rounded bg-gradient-to-r from-neutral-200 to-neutral-300 dark:from-neutral-700 dark:to-neutral-600 animate-pulse" />

        {/* Separator */}
        <div className="w-1 h-4 rounded bg-gradient-to-r from-neutral-200 to-neutral-300 dark:from-neutral-700 dark:to-neutral-600 animate-pulse opacity-60" />

        {/* Username skeleton */}
        <div className="h-4 w-20 rounded bg-gradient-to-r from-neutral-200 to-neutral-300 dark:from-neutral-700 dark:to-neutral-600 animate-pulse" />

        {/* Separator */}
        <div className="w-1 h-4 rounded bg-gradient-to-r from-neutral-200 to-neutral-300 dark:from-neutral-700 dark:to-neutral-600 animate-pulse opacity-60" />

        {/* Time skeleton */}
        <div className="h-4 w-16 rounded bg-gradient-to-r from-neutral-200 to-neutral-300 dark:from-neutral-700 dark:to-neutral-600 animate-pulse" />

        {/* Reply count skeleton (optional) */}
        <div className="h-4 w-4 rounded bg-gradient-to-r from-neutral-200 to-neutral-300 dark:from-neutral-700 dark:to-neutral-600 animate-pulse opacity-80" />
      </div>

      {/* Content Skeleton */}
      <div className="pl-6 space-y-2">
        <div className="h-4 w-full rounded bg-gradient-to-r from-neutral-200 to-neutral-300 dark:from-neutral-700 dark:to-neutral-600 animate-shimmer" />
        <div className="h-4 w-3/4 rounded bg-gradient-to-r from-neutral-200 to-neutral-300 dark:from-neutral-700 dark:to-neutral-600 animate-shimmer animation-delay-200" />
        <div className="h-4 w-1/2 rounded bg-gradient-to-r from-neutral-200 to-neutral-300 dark:from-neutral-700 dark:to-neutral-600 animate-shimmer animation-delay-400" />
      </div>

      {/* Only show nested skeleton for first two levels */}
      {level < 2 && (
        <div className="pl-4 ml-2 border-l-2 border-neutral-100 dark:border-neutral-800 space-y-2">
          <div className="flex items-center gap-1.5">
            {/* Nested collapse/expand button skeleton */}
            <div className="w-3 h-3 rounded bg-gradient-to-r from-neutral-200 to-neutral-300 dark:from-neutral-700 dark:to-neutral-600 animate-pulse opacity-60" />

            {/* Nested upvote button skeleton */}
            <div className="w-3 h-3 rounded bg-gradient-to-r from-neutral-200 to-neutral-300 dark:from-neutral-700 dark:to-neutral-600 animate-pulse opacity-60" />

            {/* Nested separator */}
            <div className="w-1 h-4 rounded bg-gradient-to-r from-neutral-200 to-neutral-300 dark:from-neutral-700 dark:to-neutral-600 animate-pulse opacity-40" />

            {/* Nested username skeleton */}
            <div className="h-4 w-16 rounded bg-gradient-to-r from-neutral-200 to-neutral-300 dark:from-neutral-700 dark:to-neutral-600 animate-pulse opacity-60" />

            {/* Nested separator */}
            <div className="w-1 h-4 rounded bg-gradient-to-r from-neutral-200 to-neutral-300 dark:from-neutral-700 dark:to-neutral-600 animate-pulse opacity-40" />

            {/* Nested time skeleton */}
            <div className="h-4 w-12 rounded bg-gradient-to-r from-neutral-200 to-neutral-300 dark:from-neutral-700 dark:to-neutral-600 animate-pulse opacity-60" />
          </div>
          <div className="pl-6 space-y-1">
            <div className="h-3 w-5/6 rounded bg-gradient-to-r from-neutral-200 to-neutral-300 dark:from-neutral-700 dark:to-neutral-600 animate-pulse opacity-40" />
            <div className="h-3 w-2/3 rounded bg-gradient-to-r from-neutral-200 to-neutral-300 dark:from-neutral-700 dark:to-neutral-600 animate-pulse opacity-40" />
          </div>
        </div>
      )}
    </div>
  );
}
