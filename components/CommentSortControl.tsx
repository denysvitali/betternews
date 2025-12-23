"use client";

import { ArrowUpDown, TrendingUp, Clock, ArrowUpFromDot } from "lucide-react";
import { Button } from "@/components/ui";

export type CommentSortType = "default" | "newest" | "oldest";

interface CommentSortControlProps {
  currentSort: CommentSortType;
  onSortChange: (sort: CommentSortType) => void;
  commentCount: number;
}

export function CommentSortControl({
  currentSort,
  onSortChange,
  commentCount,
}: CommentSortControlProps) {
  const sortOptions: Array<{ key: CommentSortType; label: string; icon: React.ReactNode }> = [
    { key: "default", label: "Best", icon: <TrendingUp size={14} /> },
    { key: "newest", label: "Newest", icon: <Clock size={14} /> },
    { key: "oldest", label: "Oldest", icon: <ArrowUpFromDot size={14} /> },
  ];

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <span className="text-xs text-neutral-500 dark:text-neutral-400">
        Sort by:
      </span>
      <div className="flex items-center bg-neutral-100 dark:bg-neutral-800 rounded-lg p-1">
        {sortOptions.map((option) => (
          <button
            key={option.key}
            onClick={() => onSortChange(option.key)}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-all ${
              currentSort === option.key
                ? "bg-white dark:bg-neutral-700 text-orange-600 dark:text-orange-500 shadow-sm"
                : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200"
            }`}
            aria-label={`Sort comments by ${option.label}`}
          >
            {option.icon}
            <span className="hidden sm:inline">{option.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
