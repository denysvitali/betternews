"use client";

import { useReadingProgress } from "@/lib/hooks";
import { useState } from "react";

export function ReadingProgress() {
  const progress = useReadingProgress();
  const [showPercentage, setShowPercentage] = useState(false);

  // Don't render if no progress yet (avoids flash)
  if (progress === 0) return null;

  return (
    <>
      {/* Thicker progress bar at top */}
      <div
        className="fixed top-0 left-0 right-0 h-1.5 z-[60] bg-neutral-200/50 dark:bg-neutral-800/50"
        role="progressbar"
        aria-valuenow={progress}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Reading progress"
        onMouseEnter={() => setShowPercentage(true)}
        onMouseLeave={() => setShowPercentage(false)}
      >
        <div
          className="relative h-full bg-gradient-to-r from-orange-400 to-orange-600 transition-all duration-150 ease-out motion-reduce:transition-none"
          style={{ width: `${progress}%` }}
        >
          {/* Progress glow effect */}
          <div className="absolute right-0 top-1/2 h-4 w-2 -translate-y-1/2 rounded-full bg-orange-500 opacity-50 blur-sm motion-reduce:hidden" />
        </div>
      </div>

      {/* Percentage indicator (shown on hover or when progress > 10%) */}
      {(showPercentage || progress > 10) && (
        <div
          className="fixed right-4 top-4 z-[60] hidden rounded-lg border border-neutral-200 bg-white/90 px-3 py-1.5 text-xs font-medium text-neutral-700 shadow-lg backdrop-blur-sm transition-opacity duration-200 motion-reduce:transition-none dark:border-neutral-700 dark:bg-neutral-900/90 dark:text-neutral-300 sm:block"
          aria-live="polite"
        >
          {progress}% read
        </div>
      )}
    </>
  );
}
