"use client";

import { Bookmark } from "lucide-react";
import { useBookmarks } from "@/lib/bookmarks";
import { Button } from "./ui";
import { cn } from "@/lib/utils";
import { useState } from "react";

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
  const [isAnimating, setIsAnimating] = useState(false);

  const handleClick = () => {
    setIsAnimating(true);
    toggleBookmark(story);
    setTimeout(() => setIsAnimating(false), 300);
  };

  return (
    <Button
      onClick={handleClick}
      variant="action"
      size="sm"
      className={cn(
        bookmarked && "bg-orange-100 text-orange-600 hover:bg-orange-200 dark:bg-orange-950/30 dark:text-orange-500 dark:hover:bg-orange-950/50",
        isAnimating && "scale-110",
        "transition-transform duration-200",
        className
      )}
      title={bookmarked ? "Remove from reading list" : "Add to reading list"}
      aria-label={bookmarked ? "Remove from reading list" : "Add to reading list"}
    >
      <Bookmark
        size={14}
        className={cn(
          bookmarked && "fill-current",
          bookmarked && isAnimating && "animate-bounce"
        )}
      />
      {showLabel && (
        <span className="hidden sm:inline">
          {bookmarked ? "Saved" : "Save"}
        </span>
      )}
    </Button>
  );
}
