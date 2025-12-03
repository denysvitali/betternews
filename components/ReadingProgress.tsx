"use client";

import { useReadingProgress } from "@/lib/hooks";

export function ReadingProgress() {
  const progress = useReadingProgress();

  // Don't render if no progress yet (avoids flash)
  if (progress === 0) return null;

  return (
    <div
      className="fixed top-0 left-0 right-0 h-1 z-[60] bg-neutral-200/50 dark:bg-neutral-800/50"
      role="progressbar"
      aria-valuenow={progress}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label="Reading progress"
    >
      <div
        className="h-full bg-gradient-to-r from-orange-400 to-orange-600 transition-all duration-150 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
