"use client";

import { memo, useMemo } from "react";
import Link from "next/link";
import { MessageSquare, ArrowUp, Clock, BookOpen, ExternalLink } from "lucide-react";
import { HNItem } from "@/lib/hn";
import { LinkPreview } from "./LinkPreview";
import { getDomain, getReadingTime, convertHNUrlToRelative } from "@/lib/utils";
import { StoryBadge } from "./StoryBadge";

import { TimeAgo } from "./TimeAgo";
import { BookmarkButton } from "./BookmarkButton";
import { Card, Badge } from "@/components/ui";
import { MarkdownRenderer } from "./MarkdownRenderer";

interface StoryCardProps {
  story: HNItem;
  index: number;
}

export const StoryCard = memo(function StoryCard({ story, index }: StoryCardProps) {
  const host = useMemo(
    () => (story.url ? getDomain(story.url) : "news.ycombinator.com"),
    [story.url]
  );

  const readingTime = useMemo(
    () => (story.text ? getReadingTime(story.text) : null),
    [story.text]
  );

  const { finalStoryUrl, isHNConverted, hnId } = useMemo(() => {
    if (story.url) {
      const relativePath = convertHNUrlToRelative(story.url);
      if (relativePath) {
        const hnIdMatch = relativePath.match(/\/story\/(\d+)/);
        return {
          finalStoryUrl: relativePath,
          isHNConverted: true,
          hnId: hnIdMatch ? hnIdMatch[1] : null
        };
      }
      return {
        finalStoryUrl: story.url,
        isHNConverted: false,
        hnId: null
      };
    }
    return {
      finalStoryUrl: `/story/${story.id}`,
      isHNConverted: false,
      hnId: null
    };
  }, [story.url, story.id]);

  const hasExternalUrl = story.url && !isHNConverted;

  return (
    <Card variant="hover" padding="sm" className="overflow-hidden">
      <div className="flex gap-3">
        {/* Rank number - fixed width, top aligned */}
        <div className="flex w-10 flex-shrink-0 justify-center pt-0.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-full border border-[var(--border-soft)] bg-white/70 font-mono text-xs font-semibold text-neutral-600 shadow-sm tabular-nums dark:bg-white/6 dark:text-neutral-300">
            {index + 1}
          </span>
        </div>

        {/* Main content area */}
        <div className="min-w-0 flex-1 space-y-2">
          {/* Title */}
          <div className="space-y-2">
            <a
              href={finalStoryUrl}
              target={!isHNConverted && finalStoryUrl.startsWith("http") ? "_blank" : undefined}
              rel={!isHNConverted && finalStoryUrl.startsWith("http") ? "noreferrer" : undefined}
              className={`block text-[1.02rem] font-semibold leading-snug tracking-[-0.025em] ${
                isHNConverted
                  ? "text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                  : "text-neutral-900 hover:text-orange-600 dark:text-neutral-100 dark:hover:text-orange-500"
              } transition-colors`}
            >
              {story.title}
            </a>
            {isHNConverted && hnId && (
              <span className="ml-2 inline-block text-[10px] text-neutral-400 dark:text-neutral-500 bg-neutral-100 dark:bg-neutral-800 px-1.5 py-0.5 rounded font-mono align-middle">
                HN#{hnId}
              </span>
            )}
          </div>

          {/* Metadata row - all items have h-5 for consistent vertical alignment */}
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-neutral-500 dark:text-neutral-400">
            <StoryBadge title={story.title} type={story.type} />

            <Link
              href={`/user/${story.by}`}
              className="inline-flex h-6 items-center rounded-full border border-transparent px-2 font-medium transition-colors hover:border-[var(--border-soft)] hover:text-orange-600 dark:hover:text-orange-500"
            >
              {story.by}
            </Link>

            <span className="inline-flex items-center h-5 text-neutral-300 dark:text-neutral-600">·</span>

            <span className="inline-flex h-6 items-center gap-1 rounded-full border border-[var(--border-soft)] bg-white/60 px-2.5 dark:bg-white/6">
              <Clock size={12} className="flex-shrink-0" />
              <TimeAgo timestamp={story.time} />
            </span>

            <span className="inline-flex items-center h-5 text-neutral-300 dark:text-neutral-600">·</span>

            <span className="inline-flex items-center h-5">
              <Badge variant="orange" size="sm" icon={<ArrowUp size={10} className="flex-shrink-0" />}>
                {story.score || 0}
              </Badge>
            </span>

            {hasExternalUrl && (
              <>
                <span className="inline-flex items-center h-5 text-neutral-300 dark:text-neutral-600">·</span>
                <a
                  href={`https://news.ycombinator.com/from?site=${host}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-6 max-w-[140px] items-center rounded-full border border-[var(--border-soft)] px-2.5 font-mono text-[11px] text-neutral-500 transition-colors hover:text-orange-500 dark:text-neutral-400 dark:hover:text-orange-400"
                  title={host}
                >
                  {host}
                </a>
              </>
            )}

            {readingTime && (
              <>
                <span className="inline-flex items-center h-5 text-neutral-300 dark:text-neutral-600">·</span>
                <span className="inline-flex h-6 items-center gap-1 rounded-full border border-[var(--border-soft)] bg-white/60 px-2.5 dark:bg-white/6">
                  <BookOpen size={12} className="flex-shrink-0" />
                  <span>{readingTime}</span>
                </span>
              </>
            )}
          </div>

          {/* Text preview for text posts */}
          {story.text && (
            <div className="line-clamp-2 rounded-2xl border border-[var(--border-soft)] bg-white/45 px-3 py-2 text-sm text-neutral-600 dark:bg-white/[0.03] dark:text-neutral-400 prose prose-sm dark:prose-invert max-w-none [&>p]:mb-0 [&>p]:leading-relaxed">
              <MarkdownRenderer content={story.text} allowHtml={true} />
            </div>
          )}

          {/* Actions row */}
          <div className="flex items-center gap-2 pt-1">
            <Link
              href={`/story/${story.id}`}
              className="inline-flex items-center gap-1.5 rounded-full border border-[var(--border-soft)] px-3 py-1.5 text-xs text-neutral-600 transition-colors hover:text-orange-600 dark:text-neutral-300 dark:hover:text-orange-500"
            >
              <MessageSquare size={14} className="flex-shrink-0" />
              <span>{story.descendants || 0} comments</span>
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
            />

            {hasExternalUrl && (
              <a
                href={finalStoryUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-auto inline-flex items-center rounded-full border border-[var(--border-soft)] px-2.5 py-1.5 text-xs text-neutral-500 transition-colors hover:text-orange-500 dark:text-neutral-400 dark:hover:text-orange-400"
                title="Open external link"
              >
                <ExternalLink size={14} className="flex-shrink-0" />
              </a>
            )}
          </div>
        </div>

        {/* Thumbnail - desktop only */}
        {hasExternalUrl && (
          <div className="hidden flex-shrink-0 items-start sm:flex">
            <div className="h-22 w-32 overflow-hidden rounded-[1.2rem] border border-[var(--border-soft)] shadow-sm">
              <LinkPreview url={finalStoryUrl} />
            </div>
          </div>
        )}
      </div>

      {/* Mobile thumbnail - full width below content */}
      {hasExternalUrl && (
        <div className="mt-3 h-32 w-full overflow-hidden rounded-[1.2rem] border border-[var(--border-soft)] sm:hidden">
          <LinkPreview url={finalStoryUrl} />
        </div>
      )}
    </Card>
  );
});
