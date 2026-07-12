"use client";

import { memo, useMemo } from "react";
import Link from "next/link";
import { MessageSquare, ArrowUp, Clock, BookOpen, ExternalLink } from "lucide-react";
import { HNItem } from "@/lib/hn";
import { LinkPreview } from "./LinkPreview";
import { getDomain, getReadingTime, convertHNUrlToRelative } from "@/lib/utils";
import { getCleanTitle, StoryBadge } from "./StoryBadge";

import { TimeAgo } from "./TimeAgo";
import { BookmarkButton } from "./BookmarkButton";
import { Card, Badge } from "@/components/ui";
import { MarkdownRenderer } from "./MarkdownRenderer";

interface StoryCardProps {
  story: HNItem;
  index: number;
}

export const StoryCard = memo(function StoryCard({ story, index }: StoryCardProps) {
  const author = story.by;
  const host = useMemo(
    () => (story.url ? getDomain(story.url) : "news.ycombinator.com") || "Unknown source",
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
          hnId: hnIdMatch ? hnIdMatch[1] : null,
        };
      }
      return {
        finalStoryUrl: story.url,
        isHNConverted: false,
        hnId: null,
      };
    }
    return {
      finalStoryUrl: `/story/${story.id}`,
      isHNConverted: false,
      hnId: null,
    };
  }, [story.url, story.id]);

  const hasExternalUrl = Boolean(story.url) && !isHNConverted;
  const opensInNewTab = !isHNConverted && finalStoryUrl.startsWith("http");
  const titleClassName = `story-title block text-[0.98rem] font-semibold leading-snug ${
    isHNConverted
      ? "text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
      : "text-neutral-950 hover:text-orange-600 dark:text-neutral-50 dark:hover:text-orange-400"
  } transition-colors`;

  return (
    <Card variant="hover" padding="sm" as="article" className="story-card overflow-hidden">
      <div className="story-card-grid grid grid-cols-[1.75rem_minmax(0,1fr)] gap-2.5 sm:grid-cols-[1.9rem_minmax(0,1fr)_7rem]">
        <div className="story-rank flex sm:justify-center">
          <span className="flex h-6 w-7 items-center justify-center rounded border border-[var(--border-soft)] bg-[var(--muted-surface)] font-mono text-[11px] font-semibold text-neutral-600 tabular-nums dark:text-neutral-300">
            {index + 1}
          </span>
        </div>

        <div className="min-w-0 space-y-1.5">
          <div className="space-y-1">
            {opensInNewTab ? (
              <a
                href={finalStoryUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={titleClassName}
              >
                {getCleanTitle(story.title || "")}
              </a>
            ) : (
              <Link href={finalStoryUrl} className={titleClassName}>
                {getCleanTitle(story.title || "")}
              </Link>
            )}
            {isHNConverted && (
              <span className="inline-flex w-fit items-center gap-1 rounded border border-blue-200 bg-blue-50 px-1.5 py-0.5 text-[10px] font-medium text-blue-700 dark:border-blue-900/70 dark:bg-blue-950/30 dark:text-blue-300">
                <MessageSquare size={10} />
                Discussion{hnId ? ` #${hnId}` : ""}
              </span>
            )}
          </div>

          <div className="story-meta flex flex-wrap items-center gap-x-1.5 gap-y-1 text-xs text-neutral-500 dark:text-neutral-400">
            <StoryBadge title={story.title} type={story.type} />

            {author ? (
              <Link
                href={`/user/${author}`}
                className="font-medium text-neutral-700 transition-colors hover:text-orange-600 dark:text-neutral-300 dark:hover:text-orange-400"
              >
                {author}
              </Link>
            ) : (
              <span className="font-medium text-neutral-500">unknown</span>
            )}

            <span className="text-neutral-300 dark:text-neutral-600">/</span>

            <span className="story-time inline-flex items-center gap-1">
              <Clock size={12} className="flex-shrink-0" />
              <TimeAgo timestamp={story.time} />
            </span>

            <span className="text-neutral-300 dark:text-neutral-600">/</span>

            <span className="inline-flex items-center">
              <Badge variant="orange" size="sm" icon={<ArrowUp size={10} className="flex-shrink-0" />} className="rounded-md">
                {story.score || 0}
              </Badge>
            </span>

            {hasExternalUrl && (
              <>
                <span className="text-neutral-300 dark:text-neutral-600">/</span>
                <a
                  href={`https://news.ycombinator.com/from?site=${host}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="story-host inline-flex max-w-[180px] min-w-0 truncate font-mono text-[11px] text-neutral-500 transition-colors hover:text-orange-500 dark:text-neutral-400 dark:hover:text-orange-400"
                  title={host}
                >
                  {host}
                </a>
              </>
            )}

            {readingTime && (
              <>
                <span className="text-neutral-300 dark:text-neutral-600">/</span>
                <span className="story-reading inline-flex items-center gap-1">
                  <BookOpen size={12} className="flex-shrink-0" />
                  <span>{readingTime}</span>
                </span>
              </>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            <Link
              href={`/story/${story.id}`}
              className="story-comments inline-flex h-7 items-center gap-1.5 rounded-md border border-[var(--border-soft)] bg-[var(--muted-surface)] px-2 text-xs font-medium text-neutral-700 transition-colors hover:border-orange-300 hover:text-orange-600 dark:text-neutral-300 dark:hover:text-orange-400"
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
              className="story-bookmark touch-target-auto h-7 rounded-md px-2 py-0.5 text-xs"
            />

            {hasExternalUrl && (
              <a
                href={finalStoryUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="story-open inline-flex h-7 items-center gap-1.5 rounded-md border border-[var(--border-soft)] px-2 text-xs font-medium text-neutral-600 transition-colors hover:border-orange-300 hover:text-orange-600 dark:text-neutral-300 dark:hover:text-orange-400"
                title="Open external link"
              >
                <ExternalLink size={14} className="flex-shrink-0" />
                <span>Open</span>
              </a>
            )}
          </div>

          {story.text && (
            <div className="story-text rounded-lg border border-[var(--border-soft)] bg-[var(--muted-surface)] px-2.5 py-1.5 text-sm text-neutral-600 dark:text-neutral-400">
              <div className="line-clamp-2 prose prose-sm max-w-none dark:prose-invert [&>p]:mb-0 [&>p]:leading-relaxed">
                <MarkdownRenderer content={story.text} allowHtml={true} />
              </div>
              <Link
                href={`/story/${story.id}`}
                className="mt-1 inline-flex text-xs font-medium text-orange-600 hover:text-orange-700 dark:text-orange-400 dark:hover:text-orange-300"
              >
                Read full text
              </Link>
            </div>
          )}
        </div>

        {hasExternalUrl && (
          <div className="story-thumbnail hidden sm:block">
            <div className="aspect-[4/3] w-full overflow-hidden rounded-lg border border-[var(--border-soft)] bg-[var(--muted-surface)]">
              <LinkPreview url={finalStoryUrl} />
            </div>
          </div>
        )}
      </div>

      {hasExternalUrl && (
        <div className="story-mobile-thumbnail mt-2 aspect-[16/9] w-full overflow-hidden rounded-lg border border-[var(--border-soft)] bg-[var(--muted-surface)] sm:hidden">
          <LinkPreview url={finalStoryUrl} />
        </div>
      )}
    </Card>
  );
});
