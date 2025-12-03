"use client";

import { Bookmark } from "lucide-react";
import { useBookmarks } from "@/lib/bookmarks";
import { cn } from "@/lib/utils";

interface BookmarkButtonProps {
  story: {
    id: number;
    title: string;
    url?: string;
    by?: string;
    time: number;
    score?: number;
  };
  className?: string;
  showLabel?: boolean;
}

export function BookmarkButton({ story, className, showLabel = false }: BookmarkButtonProps) {
  const { isBookmarked, toggleBookmark } = useBookmarks();
  const bookmarked = isBookmarked(story.id);

  return (
    <button
      onClick={() => toggleBookmark(story)}
      className={cn(
        "flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-sm font-medium transition-colors",
        bookmarked
          ? "bg-orange-100 text-orange-600 hover:bg-orange-200 dark:bg-orange-950/30 dark:text-orange-500 dark:hover:bg-orange-950/50"
          : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700",
        className
      )}
      title={bookmarked ? "Remove from reading list" : "Add to reading list"}
      aria-label={bookmarked ? "Remove from reading list" : "Add to reading list"}
    >
      <Bookmark
        size={14}
        className={bookmarked ? "fill-current" : ""}
      />
      {showLabel && (
        <span className="hidden sm:inline">
          {bookmarked ? "Saved" : "Save"}
        </span>
      )}
    </button>
  );
}
