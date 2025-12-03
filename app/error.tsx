"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCcw, Home } from "lucide-react";
import { Button } from "@/components/ui";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center gap-6 px-4 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-red-50 dark:bg-red-900/20">
        <AlertTriangle className="h-10 w-10 text-red-500" />
      </div>
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">
          Something went wrong!
        </h2>
        <p className="text-neutral-500 dark:text-neutral-400 max-w-md mx-auto">
          Our servers are having a bad hair day. We couldn&apos;t load the content.
        </p>
      </div>
      <div className="flex flex-wrap justify-center gap-4">
        <Button onClick={() => reset()} variant="primary">
          <RefreshCcw size={16} />
          Try again
        </Button>
        <Button href="/" variant="secondary">
          <Home size={16} />
          Go Home
        </Button>
      </div>
    </div>
  );
}
