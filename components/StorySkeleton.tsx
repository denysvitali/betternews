
export function StorySkeleton() {
  return (
    <div className="group relative flex flex-col gap-4 overflow-hidden rounded-xl border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900">
      <div className="flex gap-4">
        {/* Rank & Score Skeleton */}
        <div className="flex flex-col items-center gap-1">
          <div className="h-6 w-4 animate-pulse rounded bg-neutral-200 dark:bg-neutral-800" />
          <div className="h-6 w-10 animate-pulse rounded-full bg-neutral-200 dark:bg-neutral-800" />
        </div>

        <div className="flex flex-1 flex-col gap-2">
          {/* Header info Skeleton */}
          <div className="flex items-center gap-2">
            <div className="h-4 w-24 animate-pulse rounded bg-neutral-200 dark:bg-neutral-800" />
            <div className="h-4 w-4 animate-pulse rounded bg-neutral-200 dark:bg-neutral-800" />
            <div className="h-4 w-16 animate-pulse rounded bg-neutral-200 dark:bg-neutral-800" />
          </div>

          {/* Title Skeleton */}
          <div className="space-y-2">
            <div className="h-6 w-3/4 animate-pulse rounded bg-neutral-200 dark:bg-neutral-800" />
            <div className="h-6 w-1/2 animate-pulse rounded bg-neutral-200 dark:bg-neutral-800" />
          </div>

          {/* Footer actions Skeleton */}
          <div className="mt-auto pt-2">
            <div className="h-8 w-24 animate-pulse rounded bg-neutral-200 dark:bg-neutral-800" />
          </div>
        </div>

        {/* Preview Image Skeleton (Desktop) */}
        <div className="hidden h-24 w-32 shrink-0 animate-pulse rounded-lg bg-neutral-200 dark:bg-neutral-800 sm:block" />
      </div>

      {/* Mobile Preview Skeleton */}
      <div className="mt-2 block h-32 w-full animate-pulse rounded-lg bg-neutral-200 dark:bg-neutral-800 sm:hidden" />
    </div>
  );
}
