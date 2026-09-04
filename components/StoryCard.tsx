"use client";

import { memo, useMemo } from "react";
import Link from "next/link";
import { ArrowUp, BookOpen, Clock, ExternalLink, MessageSquare } from "lucide-react";
import { HNItem } from "@/lib/hn";
import { convertHNUrlToRelative, getDomain, getReadingTime } from "@/lib/utils";
import { getCleanTitle, StoryBadge } from "./StoryBadge";
import { TimeAgo } from "./TimeAgo";
import { BookmarkButton } from "./BookmarkButton";
import { Card } from "@/components/ui";
import { MarkdownRenderer } from "./MarkdownRenderer";
import { LinkPreview } from "./LinkPreview";

interface StoryCardProps {
  story: HNItem;
  index: number;
}

export const StoryCard = memo(function StoryCard({ story, index }: StoryCardProps) {
  const author = story.by;
  const host = useMemo(
    () => (story.url ? getDomain(story.url) : "news.ycombinator.com") || "Hacker News",
    [story.url]
  );
  const readingTime = useMemo(
    () => (story.text ? getReadingTime(story.text) : null),
    [story.text]
  );

  const { finalStoryUrl, isHNConverted } = useMemo(() => {
    if (!story.url) {
      return { finalStoryUrl: `/story/${story.id}`, isHNConverted: false };
    }
    const relativePath = convertHNUrlToRelative(story.url);
    return relativePath
      ? { finalStoryUrl: relativePath, isHNConverted: true }
      : { finalStoryUrl: story.url, isHNConverted: false };
  }, [story.id, story.url]);

  const hasExternalUrl = Boolean(story.url) && !isHNConverted;
  const opensInNewTab = finalStoryUrl.startsWith("http");
  const storyTitle = getCleanTitle(story.title || "");
  const titleClassName =
    "story-title block max-w-3xl text-[1.02rem] font-semibold leading-[1.35] tracking-[-0.018em] text-[var(--foreground)] transition-colors hover:text-orange-600 dark:hover:text-orange-400 sm:text-lg";

  return (
    <Card variant="hover" padding="sm" as="article" className="story-card group overflow-hidden">
      <div className="story-card-grid grid grid-cols-[2rem_minmax(0,1fr)] gap-3 sm:grid-cols-[2.5rem_minmax(0,1fr)_6.5rem] sm:gap-4">
        <div className="story-rank pt-0.5 text-right font-mono text-[11px] font-semibold tracking-[-0.04em] text-neutral-400 dark:text-neutral-500 sm:text-sm">
          #{String(index + 1).padStart(2, "0")}
        </div>

        <div className="relative min-w-0">
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <span className="story-host max-w-[190px] truncate font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-orange-600 dark:text-orange-400">
              {host}
            </span>
            <StoryBadge title={story.title} type={story.type} />
            <span className="story-score-mobile ml-auto inline-flex items-center gap-1 rounded-full bg-orange-50 px-2 py-1 font-mono text-[10px] font-semibold text-orange-700 dark:bg-orange-950/40 dark:text-orange-300 sm:hidden">
              <ArrowUp size={11} />
              {story.score || 0}
            </span>
          </div>

          <div className={hasExternalUrl ? "pr-[5.75rem] sm:pr-32" : undefined}>
            {opensInNewTab ? (
              <a href={finalStoryUrl} target="_blank" rel="noopener noreferrer" className={titleClassName}>
                {storyTitle}
              </a>
            ) : (
              <Link href={finalStoryUrl} className={titleClassName}>
                {storyTitle}
              </Link>
            )}

            <div className="story-meta mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-[10px] text-neutral-500 dark:text-neutral-400">
              <span>
                by{" "}
                {author ? (
                  <Link href={`/user/${author}`} className="font-semibold text-neutral-700 hover:text-orange-600 dark:text-neutral-300">
                    {author}
                  </Link>
                ) : (
                  "unknown"
                )}
              </span>
              <span aria-hidden="true" className="text-neutral-300 dark:text-neutral-600">•</span>
              <span className="story-time inline-flex items-center gap-1">
                <Clock size={11} />
                <TimeAgo timestamp={story.time} />
              </span>
              {readingTime && (
                <>
                  <span aria-hidden="true" className="text-neutral-300 dark:text-neutral-600">•</span>
                  <span className="story-reading inline-flex items-center gap-1">
                    <BookOpen size={11} />
                    {readingTime}
                  </span>
                </>
              )}
            </div>

            {story.text && (
              <div className="story-text mt-3 border-l-2 border-orange-400 pl-3 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
                <div className="line-clamp-2 [&>p]:m-0">
                  <MarkdownRenderer content={story.text} allowHtml />
                </div>
              </div>
            )}
          </div>

          {hasExternalUrl && (
            <a
              href={finalStoryUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="story-preview absolute right-0 top-7 h-[4.25rem] w-20 overflow-hidden rounded-xl border border-[var(--border-soft)] bg-[var(--muted-surface)] shadow-sm transition-transform hover:scale-[1.03] sm:h-[4.75rem] sm:w-28"
              aria-label={`Open ${storyTitle}`}
            >
              <LinkPreview url={finalStoryUrl} />
            </a>
          )}

          <div className="story-actions-row mt-3 flex items-center gap-2">
            <Link
              href={`/story/${story.id}`}
              aria-label={`${story.descendants || 0} comments`}
              className="story-comments inline-flex h-8 items-center gap-1.5 rounded-full bg-[var(--muted-surface)] px-3 text-xs font-semibold text-neutral-600 transition-colors hover:bg-[var(--brand)] hover:text-white dark:text-neutral-300 dark:hover:bg-orange-500"
            >
              <MessageSquare size={13} />
              {story.descendants || 0}
              <span className="hidden sm:inline">comments</span>
            </Link>
            <BookmarkButton
              story={{
                id: story.id,
                title: story.title || "",
                url: story.url,
                by: story.by,
                time: story.time,
                score: story.score,
              }}
              className="story-bookmark touch-target-auto h-8 rounded-full px-2.5 py-0"
            />
            {hasExternalUrl && (
              <a
                href={finalStoryUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="story-open ml-auto inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-400 transition-colors hover:text-orange-600 dark:hover:text-orange-400"
              >
                Read source
                <ExternalLink size={13} />
              </a>
            )}
          </div>
        </div>

        <div className="hidden border-l border-[var(--border-soft)] pl-4 sm:flex sm:flex-col sm:items-center sm:justify-center">
          <ArrowUp size={16} className="mb-1 text-orange-500" />
          <span className="font-mono text-xl font-semibold tracking-[-0.05em] text-[var(--brand)] dark:text-white">
            {story.score || 0}
          </span>
          <span className="mt-1 font-mono text-[9px] uppercase tracking-[0.16em] text-neutral-400">points</span>
        </div>
      </div>
    </Card>
  );
});
