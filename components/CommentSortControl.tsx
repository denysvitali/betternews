"use client";

export type CommentSortType = "default" | "newest" | "oldest";

interface CommentSortControlProps {
  currentSort: CommentSortType;
  onSortChange: (sort: CommentSortType) => void;
  commentCount: number;
}

export function CommentSortControl({ currentSort, onSortChange }: CommentSortControlProps) {
  return (
    <label className="discussion-select">
      <span>Sort</span>
      <select aria-label="Sort comments" value={currentSort} onChange={(event) => onSortChange(event.target.value as CommentSortType)}>
        <option value="default">Best</option>
        <option value="newest">Newest</option>
        <option value="oldest">Oldest</option>
      </select>
    </label>
  );
}
