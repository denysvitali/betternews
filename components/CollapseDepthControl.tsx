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

export function CollapseDepthControl({ currentDepth, onDepthChange }: CollapseDepthControlProps) {
  return (
    <div className="flex flex-wrap items-center gap-2.5">
      <Layers size={14} className="text-neutral-500 dark:text-neutral-400" aria-hidden="true" />
      <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-neutral-500 dark:text-neutral-400">Thread depth</span>
      <div className="flex items-center rounded-lg border border-[var(--border-soft)] bg-[var(--surface)] p-0.5">
        {DEPTH_OPTIONS.map((option) => (
          <button
            type="button"
            key={option.value}
            onClick={() => onDepthChange(option.value)}
            className={"min-h-8 min-w-8 rounded-md px-2 py-1 text-xs font-medium transition-colors " + (
              currentDepth === option.value
                ? "bg-[var(--brand)] text-white shadow-sm dark:bg-orange-600"
                : "text-neutral-600 hover:bg-[var(--muted-surface)] hover:text-[var(--brand)] dark:text-neutral-400 dark:hover:text-neutral-100"
            )}
            aria-label={"Set collapse depth to " + option.label}
            aria-pressed={currentDepth === option.value}
            title={"Collapse replies after level " + option.label}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}
