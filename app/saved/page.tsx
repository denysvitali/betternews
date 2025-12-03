"use client";

import { useBookmarks } from "@/lib/bookmarks";
import { EmptyState } from "@/components/EmptyState";
import { TimeAgo } from "@/components/TimeAgo";
import { BookmarkButton } from "@/components/BookmarkButton";
import { PageLayout, Card, Button } from "@/components/ui";
import { Bookmark, ExternalLink, MessageSquare, Trash2 } from "lucide-react";
import Link from "next/link";

export default function SavedPage() {
  const { bookmarks, clearBookmarks } = useBookmarks();

  return (
    <PageLayout>
      <div className="mb-6 sm:mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900 dark:text-white flex items-center gap-2">
            <Bookmark className="text-orange-500" />
            Reading List
          </h1>
          <p className="text-sm sm:text-base text-neutral-500 dark:text-neutral-400 mt-1">
            {bookmarks.length} {bookmarks.length === 1 ? "story" : "stories"} saved
          </p>
        </div>

        {bookmarks.length > 0 && (
          <button
            onClick={() => {
              if (confirm("Clear all saved stories?")) {
                clearBookmarks();
              }
            }}
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 dark:text-red-500 dark:hover:bg-red-950/20"
          >
            <Trash2 size={16} />
            <span className="hidden sm:inline">Clear all</span>
          </button>
        )}
      </div>

      {bookmarks.length === 0 ? (
        <Card variant="default" padding="lg" className="text-center">
          <EmptyState type="bookmarks" />
        </Card>
      ) : (
        <div className="flex flex-col gap-4">
          {bookmarks.map((story) => (
            <Card key={story.id} variant="hover" padding="md">
              <div className="flex flex-col gap-2">
                {/* Title */}
                <Link
                  href={`/story/${story.id}`}
                  className="font-bold text-base sm:text-lg leading-tight text-neutral-900 hover:text-orange-600 dark:text-neutral-100 dark:hover:text-orange-500"
                >
                  {story.title}
                </Link>

                {/* Meta info */}
                <div className="flex items-center gap-3 text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 flex-wrap">
                  {story.score && (
                    <span className="font-medium">{story.score} points</span>
                  )}
                  {story.by && (
                    <Link
                      href={`/user/${story.by}`}
                      className="hover:text-orange-500 transition-colors"
                    >
                      by {story.by}
                    </Link>
                  )}
                  <TimeAgo timestamp={story.time} />
                  <span className="text-neutral-300 dark:text-neutral-600">|</span>
                  <span>Saved <TimeAgo timestamp={Math.floor(story.bookmarkedAt / 1000)} /></span>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 pt-2">
                  <Button href={`/story/${story.id}`} variant="secondary" size="sm">
                    <MessageSquare size={14} />
                    <span>View</span>
                  </Button>

                  {story.url && (
                    <Button
                      href={story.url}
                      target="_blank"
                      variant="secondary"
                      size="sm"
                    >
                      <ExternalLink size={14} />
                      <span className="hidden sm:inline">Open link</span>
                    </Button>
                  )}

                  <BookmarkButton story={story} showLabel />
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </PageLayout>
  );
}
