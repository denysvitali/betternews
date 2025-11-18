export default function Loading() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <div className="mb-8 space-y-2">
        <div className="h-8 w-48 animate-pulse rounded-md bg-neutral-200 dark:bg-neutral-800" />
        <div className="h-4 w-64 animate-pulse rounded-md bg-neutral-200 dark:bg-neutral-800" />
      </div>

      <div className="flex flex-col gap-4">
        {[...Array(10)].map((_, i) => (
          <div
            key={i}
            className="h-40 w-full animate-pulse rounded-xl border border-neutral-200 bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-900"
          />
        ))}
      </div>
    </div>
  );
}
