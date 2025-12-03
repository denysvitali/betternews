import { Card, Skeleton } from "@/components/ui";

export function StorySkeleton() {
  return (
    <Card variant="default" padding="md" className="flex flex-col gap-4 overflow-hidden">
      <div className="flex gap-4">
        {/* Rank & Score Skeleton */}
        <div className="flex flex-col items-center gap-1">
          <Skeleton className="h-6 w-4" />
          <Skeleton variant="circular" className="h-6 w-10" />
        </div>

        <div className="flex flex-1 flex-col gap-2">
          {/* Header info Skeleton */}
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-4 w-16" />
          </div>

          {/* Title Skeleton */}
          <div className="space-y-2">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-6 w-1/2" />
          </div>

          {/* Footer actions Skeleton */}
          <div className="mt-auto pt-2">
            <Skeleton variant="rounded" className="h-8 w-24" />
          </div>
        </div>

        {/* Preview Image Skeleton (Desktop) */}
        <Skeleton variant="rounded" className="hidden h-24 w-32 shrink-0 sm:block" />
      </div>

      {/* Mobile Preview Skeleton */}
      <Skeleton variant="rounded" className="mt-2 block h-32 w-full sm:hidden" />
    </Card>
  );
}
