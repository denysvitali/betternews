"use client";

import { useBookmarks } from "@/lib/bookmarks";
import { EmptyState } from "@/components/EmptyState";
import { TimeAgo } from "@/components/TimeAgo";
import { BookmarkButton } from "@/components/BookmarkButton";
import { PageLayout, PageHeader } from "@/components/ui";
import { getDomain } from "@/lib/utils";
import { ArrowUpRight, MessageSquare, Trash2 } from "lucide-react";
import Link from "next/link";

export default function SavedPage() {
  const { bookmarks, clearBookmarks } = useBookmarks();

  return (
    <PageLayout>
      <PageHeader
        title="Your reading list"
        description="A little space for the stories you want to come back to. Saved on this device."
        eyebrow="The collection"
        meta={<span>{bookmarks.length} {bookmarks.length === 1 ? "story" : "stories"}</span>}
      />

      {bookmarks.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[var(--border-soft)] bg-[var(--surface)] px-5 py-12 sm:py-16">
          <EmptyState type="bookmarks" />
        </div>
      ) : (
        <section aria-label="Saved stories">
          <div className="mb-4 flex items-center justify-between gap-4">
            <h2 className="font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--accent)]">Saved stories</h2>
            <button
              onClick={() => {
                if (confirm("Clear all saved stories?")) clearBookmarks();
              }}
              className="inline-flex items-center gap-1.5 rounded-lg px-2 py-2 text-xs font-medium text-neutral-500 transition-colors hover:bg-red-50 hover:text-red-700 dark:hover:bg-red-950/30 dark:hover:text-red-300"
            >
              <Trash2 size={14} />
              Clear all
            </button>
          </div>
          <div className="overflow-hidden rounded-2xl border border-[var(--border-soft)] bg-[var(--surface)]">
            {bookmarks.map((story, index) => (
              <article key={story.id} className="grid grid-cols-[2rem_minmax(0,1fr)] gap-3 border-b border-[var(--border-soft)] p-4 last:border-b-0 sm:grid-cols-[3rem_minmax(0,1fr)_auto] sm:gap-5 sm:p-6">
                <span className="pt-1 font-mono text-xs font-semibold text-neutral-400 dark:text-neutral-500">{String(index + 1).padStart(2, "0")}</span>
                <div className="min-w-0">
                  <p className="mb-1.5 truncate font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--accent)]">
                    {story.url ? getDomain(story.url) : "Hacker News"}
                  </p>
                  <Link href={`/story/${story.id}`} className="text-base font-semibold leading-snug tracking-[-0.025em] text-[var(--foreground)] transition-colors hover:text-[var(--accent)] sm:text-xl">
                    {story.title}
                  </Link>
                  <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[11px] text-neutral-500 dark:text-neutral-400">
                    {story.score != null && <span>{story.score} points</span>}
                    {story.by && <Link href={`/user/${story.by}`} className="hover:text-[var(--accent)]">by {story.by}</Link>}
                    <span>saved <TimeAgo timestamp={Math.floor(story.bookmarkedAt / 1000)} /></span>
                  </div>
                  <div className="mt-4 flex items-center gap-2 sm:hidden">
                    <Link href={`/story/${story.id}`} className="inline-flex items-center gap-1.5 rounded-lg bg-[var(--muted-surface)] px-3 py-2 text-xs font-semibold"><MessageSquare size={14} /> Discuss</Link>
                    <BookmarkButton story={story} />
                    {story.url && <a href={story.url} target="_blank" rel="noopener noreferrer" aria-label="Open source" className="ml-auto rounded-lg p-2 text-neutral-500 hover:text-[var(--accent)]"><ArrowUpRight size={17} /></a>}
                  </div>
                </div>
                <div className="hidden items-center gap-2 self-center sm:flex">
                  <Link href={`/story/${story.id}`} className="inline-flex items-center gap-1.5 rounded-lg bg-[var(--muted-surface)] px-3 py-2 text-xs font-semibold transition-colors hover:text-[var(--accent)]"><MessageSquare size={14} /> Discuss</Link>
                  <BookmarkButton story={story} />
                  {story.url && <a href={story.url} target="_blank" rel="noopener noreferrer" aria-label="Open source" className="rounded-lg p-2 text-neutral-500 hover:text-[var(--accent)]"><ArrowUpRight size={17} /></a>}
                </div>
              </article>
            ))}
          </div>
        </section>
      )}
    </PageLayout>
  );
}
