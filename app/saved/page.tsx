"use client";

import { useBookmarks } from "@/lib/bookmarks";
import { EmptyState } from "@/components/EmptyState";
import { TimeAgo } from "@/components/TimeAgo";
import { BookmarkButton } from "@/components/BookmarkButton";
import { PageLayout } from "@/components/ui";
import { getDomain, storyHref } from "@/lib/utils";
import { ArrowUp, MessageCircle, Trash2 } from "lucide-react";
import Link from "next/link";

export default function SavedPage() {
  const { bookmarks, clearBookmarks } = useBookmarks();

  return (
    <PageLayout>
      <header className="feed-header">
        <div className="feed-heading-row">
          <h1>Saved stories<span className="text-[var(--accent)]">.</span></h1>
          <span className="feed-count">{bookmarks.length} {bookmarks.length === 1 ? "story" : "stories"}</span>
        </div>
        <p>Your reading list, saved on this device.</p>
      </header>
      {bookmarks.length > 0 && <div className="saved-toolbar">
        <button type="button" onClick={() => { if (confirm("Clear all saved stories?")) clearBookmarks(); }}><Trash2 size={13} aria-hidden="true" /> Clear all</button>
      </div>}
      <section aria-label="Saved stories" className="story-list">
        {bookmarks.length === 0 ? <EmptyState type="bookmarks" /> : bookmarks.map((story, index) => (
          <article key={story.id} className="story-card">
            <span className="story-rank">{String(index + 1).padStart(2, "0")}</span>
            <div className="story-card-copy">
              <div className="story-title-row"><Link href={storyHref(story.id)} className="story-title">{story.title}</Link></div>
              <div className="story-meta">
                <span className="story-host">{story.url ? getDomain(story.url) : "news.ycombinator.com"}</span>
                <span aria-hidden="true">·</span>
                <span>saved <TimeAgo timestamp={Math.floor(story.bookmarkedAt / 1000)} /></span>
              </div>
            </div>
            <div className="story-actions-row">
                {story.score != null && <span className="story-score"><ArrowUp size={13} aria-hidden="true" /> {story.score}<span className="story-action-label">points</span></span>}
                <Link href={storyHref(story.id)} className="story-comments"><MessageCircle size={14} aria-hidden="true" /> Discuss</Link>
                <BookmarkButton story={story} className="story-bookmark" />
                {story.url && <a href={story.url} target="_blank" rel="noopener noreferrer" aria-label={`Read source: ${story.title}`} className="story-open">Read ↗</a>}
            </div>
          </article>
        ))}
      </section>
    </PageLayout>
  );
}
