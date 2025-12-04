"use client";

import { formatDistanceToNow } from "date-fns";
import { formatFullDate } from "@/lib/utils";
import { useState } from "react";

interface TimeAgoProps {
  timestamp: number;
  addSuffix?: boolean;
  className?: string;
}

export function TimeAgo({ timestamp, addSuffix = true, className = "" }: TimeAgoProps) {
  const [showTooltip, setShowTooltip] = useState(false);
  const relativeTime = formatDistanceToNow(timestamp * 1000, { addSuffix });
  const fullDate = formatFullDate(timestamp);

  return (
    <span
      className={`relative cursor-help inline leading-none ${className}`}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
      onTouchStart={() => setShowTooltip(true)}
      onTouchEnd={() => setShowTooltip(false)}
    >
      <span className="border-b border-dotted border-neutral-400 dark:border-neutral-600 leading-none">
        {relativeTime}
      </span>

      {/* Tooltip */}
      {showTooltip && (
        <span
          className="absolute top-full left-1/2 -translate-x-1/2 mt-2 whitespace-nowrap rounded-lg bg-neutral-900 dark:bg-neutral-100 px-3 py-1.5 text-xs font-medium text-white dark:text-neutral-900 shadow-lg z-50 pointer-events-none"
          role="tooltip"
        >
          {fullDate}
          {/* Tooltip arrow */}
          <span className="absolute bottom-full left-1/2 -translate-x-1/2 border-4 border-transparent border-b-neutral-900 dark:border-b-neutral-100" />
        </span>
      )}
    </span>
  );
}
