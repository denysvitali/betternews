"use client";

export type CommentSortType = "default" | "newest" | "oldest";

interface CommentSortControlProps {
  currentSort: CommentSortType;
  onSortChange: (sort: CommentSortType) => void;
  commentCount: number;
}

const OPTIONS: { value: CommentSortType; label: string }[] = [
  { value: "default", label: "Best" },
  { value: "newest", label: "Newest" },
  { value: "oldest", label: "Oldest" },
];

export function CommentSortControl({ currentSort, onSortChange }: CommentSortControlProps) {
  return (
    <div role="radiogroup" aria-label="Sort comments" className="segmented">
      {OPTIONS.map(({ value, label }) => (
        <button
          key={value}
          type="button"
          role="radio"
          aria-checked={currentSort === value}
          onClick={() => onSortChange(value)}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
