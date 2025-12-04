"use client";

import { memo, useMemo } from "react";
import Link from "next/link";
import { MessageSquare, ArrowUp, Clock, BookOpen } from "lucide-react";
import { HNItem } from "@/lib/hn";
import { LinkPreview } from "./LinkPreview";
import { getDomain, getReadingTime } from "@/lib/utils";
import { StoryBadge } from "./StoryBadge";
import { ShareButton } from "./ShareButton";
import { TimeAgo } from "./TimeAgo";
import { BookmarkButton } from "./BookmarkButton";
import { Card, Badge, Button } from "@/components/ui";
import { MarkdownRenderer } from "./MarkdownRenderer";

interface StoryCardProps {
  story: HNItem;
  index: number;
}

export const StoryCard = memo(function StoryCard({ story, index }: StoryCardProps) {
  // Memoize expensive computations
  const host = useMemo(
    () => (story.url ? getDomain(story.url) : "news.ycombinator.com"),
    [story.url]
  );

  const readingTime = useMemo(
    () => (story.text ? getReadingTime(story.text) : null),
    [story.text]
  );

  const storyUrl = useMemo(
    () => story.url || `${typeof window !== "undefined" ? window.location.origin : ""}/story/${story.id}`,
    [story.url, story.id]
  );

  return (
    <Card variant="hover" padding="sm" className="flex flex-col gap-3 sm:gap-4 overflow-hidden sm:p-4">
      <div className="flex gap-3 sm:gap-4">
        {/* Rank & Score */}
        <div className="flex flex-col items-center gap-1 min-w-fit">
          <span className="text-base sm:text-lg font-bold text-neutral-300 dark:text-neutral-700">{index + 1}</span>
          <Badge variant="orange" size="md" icon={<ArrowUp size={10} strokeWidth={2} />}>
            {story.score || 0}
          </Badge>
        </div>

        <div className="flex flex-1 flex-col gap-2 min-w-0">
          {/* Header info - Desktop */}
          <div className="hidden sm:flex items-center gap-3 text-sm text-neutral-600 dark:text-neutral-400 leading-none flex-wrap">
            {/* Story Type Badge */}
            <StoryBadge title={story.title} type={story.type} />

            <Link
              href={`/user/${story.by}`}
              className="font-medium text-neutral-800 dark:text-neutral-200 hover:text-orange-600 dark:hover:text-orange-500 transition-colors"
            >
              {story.by}
            </Link>
            <span className="text-neutral-400">|</span>
            <div className="flex items-center gap-1">
              <Clock size={11} />
              <TimeAgo timestamp={story.time} />
            </div>
            <span className="text-neutral-400">|</span>
            <a
              href={`https://news.ycombinator.com/from?site=${host}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline hover:text-orange-600 dark:hover:text-orange-500 font-mono text-neutral-600 dark:text-neutral-400 transition-colors"
              title={host}
            >
              {host}
            </a>
            {/* Reading time for text posts */}
            {readingTime && (
              <>
                <span className="text-neutral-400">|</span>
                <div className="flex items-center gap-1 text-neutral-500">
                  <BookOpen size={11} />
                  <span>{readingTime}</span>
                </div>
              </>
            )}
          </div>

          {/* Header info - Mobile: Simple single line with badge, user, time */}
          <div className="flex items-center gap-1.5 sm:hidden text-xs text-neutral-500 dark:text-neutral-400 h-4">
            <StoryBadge title={story.title} type={story.type} />
            <Link
              href={`/user/${story.by}`}
              className="font-medium text-neutral-700 dark:text-neutral-300 hover:text-orange-600 dark:hover:text-orange-500 transition-colors flex items-center h-full"
            >
              {story.by}
            </Link>
            <span className="text-neutral-300 dark:text-neutral-600 flex items-center h-full">·</span>
            <span className="flex items-center h-full">
              <TimeAgo timestamp={story.time} addSuffix={false} />
            </span>
          </div>

          {/* Title */}
          <a
            href={story.url || `/story/${story.id}`}
            target={story.url ? "_blank" : undefined}
            rel="noreferrer"
            className="font-bold text-base sm:text-lg leading-tight text-neutral-900 hover:text-orange-600 dark:text-neutral-100 dark:hover:text-orange-500 line-clamp-2 sm:line-clamp-none"
          >
            {story.title}
          </a>

          {/* Story Text Preview */}
          {story.text && (
            <div className="line-clamp-2 sm:line-clamp-3 text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 prose prose-sm dark:prose-invert max-w-none [&>p]:mb-1">
              <MarkdownRenderer content={story.text} />
            </div>
          )}

          {/* Footer actions */}
          <div className="mt-auto flex items-center gap-2 sm:gap-3 pt-2">
            <Button
              href={`/story/${story.id}`}
              variant="action"
              size="sm"
            >
              <MessageSquare size={11} />
              <span className="hidden sm:inline">{story.descendants || 0} comments</span>
              <span className="sm:hidden">{story.descendants || 0}</span>
            </Button>
            <ShareButton title={story.title || "Story"} url={storyUrl} />
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
            {/* Domain - mobile only, shown in footer */}
            {story.url && (
              <a
                href={`https://news.ycombinator.com/from?site=${host}`}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-auto sm:hidden text-xs font-mono text-neutral-400 dark:text-neutral-500 hover:text-orange-500 dark:hover:text-orange-500 truncate max-w-[120px] transition-colors"
                title={host}
              >
                {host}
              </a>
            )}
          </div>
        </div>

        {/* Preview Image (Desktop) */}
        {story.url && (
          <div className="hidden sm:block w-24 sm:w-32 h-16 sm:h-24 shrink-0">
            <LinkPreview url={story.url} />
          </div>
        )}
      </div>

      {/* Mobile Preview */}
      {story.url && (
        <div className="block sm:hidden w-full h-24 sm:h-32 mt-2">
          <LinkPreview url={story.url} />
        </div>
      )}
    </Card>
  );
});
