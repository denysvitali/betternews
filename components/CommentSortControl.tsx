"use client";

import { TrendingUp, Clock, ArrowUpFromDot } from "lucide-react";

export type CommentSortType = "default" | "newest" | "oldest";

interface CommentSortControlProps {
  currentSort: CommentSortType;
  onSortChange: (sort: CommentSortType) => void;
  commentCount: number;
}

const sortOptions: Array<{ key: CommentSortType; label: string; icon: React.ReactNode }> = [
  { key: "default", label: "Best", icon: <TrendingUp size={14} /> },
  { key: "newest", label: "Newest", icon: <Clock size={14} /> },
  { key: "oldest", label: "Oldest", icon: <ArrowUpFromDot size={14} /> },
];

export function CommentSortControl({ currentSort, onSortChange, commentCount: _commentCount }: CommentSortControlProps) {
  void _commentCount;

  return (
    <div className="flex flex-wrap items-center gap-2.5">
      <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-neutral-500 dark:text-neutral-400">Sort</span>
      <div className="flex items-center rounded-lg border border-[var(--border-soft)] bg-[var(--surface)] p-0.5">
        {sortOptions.map((option) => (
          <button
            type="button"
            key={option.key}
            onClick={() => onSortChange(option.key)}
            className={"flex min-h-8 items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors " + (
              currentSort === option.key
                ? "bg-[var(--brand)] text-white shadow-sm dark:bg-orange-600"
                : "text-neutral-600 hover:bg-[var(--muted-surface)] hover:text-[var(--brand)] dark:text-neutral-400 dark:hover:text-neutral-100"
            )}
            aria-label={"Sort comments by " + option.label}
            aria-pressed={currentSort === option.key}
          >
            {option.icon}
            <span>{option.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
