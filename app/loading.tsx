import { StorySkeleton } from "@/components/StorySkeleton";
import { SkeletonText } from "@/components/ui";

export default function Loading() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <div className="mb-8 space-y-2">
        <SkeletonText className="h-8 w-48" />
        <SkeletonText className="h-4 w-64" />
      </div>

      <div className="flex flex-col gap-4">
        {[...Array(10)].map((_, i) => (
          <StorySkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
