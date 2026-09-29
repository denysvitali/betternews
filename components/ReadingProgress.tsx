"use client";

import { useReadingProgress } from "@/lib/hooks";

export function ReadingProgress() {
  const progress = useReadingProgress();
  if (progress === 0) return null;

  return (
    <div className="fixed inset-x-0 top-0 z-[60] h-0.5 bg-[var(--border-soft)]" role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100} aria-label="Reading progress">
      <div className="h-full bg-[var(--accent)] transition-[width] duration-150 motion-reduce:transition-none" style={{ width: `${progress}%` }} />
    </div>
  );
}
