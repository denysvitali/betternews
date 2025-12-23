"use client";

import { Layers } from "lucide-react";

interface CollapseDepthControlProps {
  currentDepth: number;
  onDepthChange: (depth: number) => void;
}

const DEPTH_OPTIONS = [
  { value: 1, label: "1" },
  { value: 2, label: "2" },
  { value: 3, label: "3" },
  { value: 4, label: "4" },
  { value: 99, label: "All" },
];

export function CollapseDepthControl({
  currentDepth,
  onDepthChange,
}: CollapseDepthControlProps) {
  return (
    <div className="flex items-center gap-2">
      <Layers size={14} className="text-neutral-500 dark:text-neutral-400" />
      <span className="text-xs text-neutral-500 dark:text-neutral-400">
        Collapse after level:
      </span>
      <div className="flex items-center bg-neutral-100 dark:bg-neutral-800 rounded-lg p-1">
        {DEPTH_OPTIONS.map((option) => (
          <button
            key={option.value}
            onClick={() => onDepthChange(option.value)}
            className={`px-2 py-1 rounded-md text-xs font-medium transition-all min-w-[28px] ${
              currentDepth === option.value
                ? "bg-white dark:bg-neutral-700 text-orange-600 dark:text-orange-500 shadow-sm"
                : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200"
            }`}
            aria-label={`Set collapse depth to ${option.label}`}
            title={`Collapse replies after level ${option.value}`}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}
