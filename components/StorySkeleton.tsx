import { Skeleton } from "@/components/ui";

export function StorySkeleton() {
  return (
    <div className="story-page-card space-y-4" role="status" aria-label="Loading story">
      <Skeleton className="h-3 w-36" />
      <Skeleton className="h-7 w-full" />
      <Skeleton className="h-7 w-2/3" />
      <Skeleton className="h-3 w-1/2" />
      <Skeleton className="h-9 w-32" />
    </div>
  );
}
