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
          className="h-full bg-gradient-to-r from-orange-400 to-orange-600 transition-all duration-150 ease-out relative"
          style={{ width: `${progress}%` }}
        >
          {/* Progress glow effect */}
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-4 bg-orange-500 rounded-full blur-sm opacity-50" />
        </div>
      </div>

      {/* Percentage indicator (shown on hover or when progress > 10%) */}
      {(showPercentage || progress > 10) && (
        <div
          className="fixed top-4 right-4 z-[60] bg-white/90 dark:bg-neutral-900/90 backdrop-blur-sm border border-neutral-200 dark:border-neutral-700 rounded-lg px-3 py-1.5 shadow-lg text-xs font-medium text-neutral-700 dark:text-neutral-300 transition-opacity duration-200"
          aria-live="polite"
        >
          {progress}% read
        </div>
      )}
    </>
  );
}
