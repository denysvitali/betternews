export function CommentSkeleton() {
  return (
    <div className="flex flex-col gap-2 py-3 border-t border-neutral-100 dark:border-neutral-900 first:border-0">
      {/* Header Skeleton */}
      <div className="flex items-center gap-2">
        <div className="h-4 w-4 animate-pulse rounded bg-neutral-200 dark:bg-neutral-800" />
        <div className="h-4 w-24 animate-pulse rounded bg-neutral-200 dark:bg-neutral-800" />
        <div className="h-4 w-16 animate-pulse rounded bg-neutral-200 dark:bg-neutral-800" />
      </div>

      {/* Content Skeleton */}
      <div className="pl-6 space-y-2">
        <div className="h-4 w-full animate-pulse rounded bg-neutral-200 dark:bg-neutral-800" />
        <div className="h-4 w-3/4 animate-pulse rounded bg-neutral-200 dark:bg-neutral-800" />
        <div className="h-4 w-1/2 animate-pulse rounded bg-neutral-200 dark:bg-neutral-800" />
      </div>
    </div>
  );
}
