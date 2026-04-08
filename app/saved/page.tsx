"use client";

import { useBookmarks } from "@/lib/bookmarks";
import { EmptyState } from "@/components/EmptyState";
import { TimeAgo } from "@/components/TimeAgo";
import { BookmarkButton } from "@/components/BookmarkButton";
import { PageLayout, Card, Button, PageHeader } from "@/components/ui";
import { ExternalLink, MessageSquare, Trash2 } from "lucide-react";
import Link from "next/link";

export default function SavedPage() {
  const { bookmarks, clearBookmarks } = useBookmarks();

  return (
    <PageLayout>
      <div className="mb-6 sm:mb-8">
        <PageHeader
          title="Reading List"
          description="Stories you bookmarked for later, kept in the browser for quick return visits."
          eyebrow="Saved"
          meta={
            <span className="rounded-full border border-[var(--border-soft)] bg-white/60 px-3 py-1 font-mono dark:bg-white/6">
              {bookmarks.length} {bookmarks.length === 1 ? "story" : "stories"}
            </span>
          }
        />
        {bookmarks.length > 0 && (
          <button
            onClick={() => {
              if (confirm("Clear all saved stories?")) {
                clearBookmarks();
              }
            }}
            className="glass-panel -mt-2 inline-flex items-center gap-2 rounded-full border border-red-200/60 px-4 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-50/70 dark:border-red-900/40 dark:text-red-400 dark:hover:bg-red-950/20"
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
              <div className="flex flex-col gap-3">
                {/* Title */}
                <Link
                  href={`/story/${story.id}`}
                  className="text-base font-semibold leading-tight tracking-[-0.02em] text-neutral-900 hover:text-orange-600 dark:text-neutral-100 dark:hover:text-orange-500 sm:text-lg"
                >
                  {story.title}
                </Link>

                {/* Meta info */}
                <div className="flex flex-wrap items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400 sm:text-sm">
                  {story.score && (
                    <span className="rounded-full border border-[var(--border-soft)] bg-white/60 px-2.5 py-1 font-medium dark:bg-white/6">
                      {story.score} points
                    </span>
                  )}
                  {story.by && (
                    <Link
                      href={`/user/${story.by}`}
                      className="rounded-full border border-[var(--border-soft)] px-2.5 py-1 transition-colors hover:text-orange-500"
                    >
                      by {story.by}
                    </Link>
                  )}
                  <span className="rounded-full border border-[var(--border-soft)] bg-white/60 px-2.5 py-1 dark:bg-white/6">
                    <TimeAgo timestamp={story.time} />
                  </span>
                  <span className="rounded-full border border-[var(--border-soft)] bg-white/60 px-2.5 py-1 dark:bg-white/6">
                    Saved <TimeAgo timestamp={Math.floor(story.bookmarkedAt / 1000)} />
                  </span>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <Button href={`/story/${story.id}`} variant="secondary" size="sm" className="rounded-full">
                    <MessageSquare size={14} />
                    <span>View</span>
                  </Button>

                  {story.url && (
                    <Button
                      href={story.url}
                      target="_blank"
                      variant="secondary"
                      size="sm"
                      className="rounded-full"
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
