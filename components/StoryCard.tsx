"use client";

import { memo, useMemo } from "react";
import Link from "next/link";
import { MessageSquare, ArrowUp, Clock, BookOpen, ExternalLink } from "lucide-react";
import { HNItem } from "@/lib/hn";
import { LinkPreview } from "./LinkPreview";
import { getDomain, getReadingTime, convertHNUrlToRelative } from "@/lib/utils";
import { StoryBadge } from "./StoryBadge";
import { ShareButton } from "./ShareButton";
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

  const storyUrl = useMemo(
    () => finalStoryUrl || `${typeof window !== "undefined" ? window.location.origin : ""}/story/${story.id}`,
    [finalStoryUrl, story.id]
  );

  const hasExternalUrl = story.url && !isHNConverted;

  return (
    <Card variant="hover" padding="sm" className="overflow-hidden">
      <div className="flex gap-2">
        {/* Rank number - fixed width, top aligned */}
        <div className="flex-shrink-0 w-6 pt-0 text-center">
          <span className="text-sm font-bold text-neutral-300 dark:text-neutral-600 tabular-nums">
            {index + 1}
          </span>
        </div>

        {/* Main content area */}
        <div className="flex-1 min-w-0 space-y-0.5">
          {/* Title */}
          <div>
            <a
              href={finalStoryUrl}
              target={!isHNConverted && finalStoryUrl.startsWith("http") ? "_blank" : undefined}
              rel={!isHNConverted && finalStoryUrl.startsWith("http") ? "noreferrer" : undefined}
              className={`font-semibold text-base leading-snug ${
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
              className="inline-flex items-center h-5 font-medium hover:text-orange-600 dark:hover:text-orange-500 transition-colors"
            >
              {story.by}
            </Link>

            <span className="inline-flex items-center h-5 text-neutral-300 dark:text-neutral-600">·</span>

            <span className="inline-flex items-center h-5 gap-1">
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
                  className="inline-flex items-center h-5 font-mono text-[11px] text-neutral-400 hover:text-orange-500 dark:hover:text-orange-400 transition-colors truncate max-w-[120px]"
                  title={host}
                >
                  {host}
                </a>
              </>
            )}

            {readingTime && (
              <>
                <span className="inline-flex items-center h-5 text-neutral-300 dark:text-neutral-600">·</span>
                <span className="inline-flex items-center h-5 gap-1">
                  <BookOpen size={12} className="flex-shrink-0" />
                  <span>{readingTime}</span>
                </span>
              </>
            )}
          </div>

          {/* Text preview for text posts */}
          {story.text && (
            <div className="text-sm text-neutral-600 dark:text-neutral-400 line-clamp-2 prose prose-sm dark:prose-invert max-w-none [&>p]:mb-0 [&>p]:leading-relaxed">
              <MarkdownRenderer content={story.text} allowHtml={true} />
            </div>
          )}

          {/* Actions row */}
          <div className="flex items-center gap-2">
            <Link
              href={`/story/${story.id}`}
              className="inline-flex items-center gap-1.5 text-xs text-neutral-500 hover:text-orange-600 dark:text-neutral-400 dark:hover:text-orange-500 transition-colors"
            >
              <MessageSquare size={14} className="flex-shrink-0" />
              <span>{story.descendants || 0}</span>
            </Link>

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

            {hasExternalUrl && (
              <a
                href={finalStoryUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-auto inline-flex items-center text-xs text-neutral-400 hover:text-orange-500 dark:hover:text-orange-400 transition-colors"
                title="Open external link"
              >
                <ExternalLink size={14} className="flex-shrink-0" />
              </a>
            )}
          </div>
        </div>

        {/* Thumbnail - desktop only */}
        {hasExternalUrl && (
          <div className="hidden sm:flex flex-shrink-0 items-start">
            <div className="w-28 h-20 rounded-lg overflow-hidden border border-neutral-200 dark:border-neutral-700">
              <LinkPreview url={finalStoryUrl} />
            </div>
          </div>
        )}
      </div>

      {/* Mobile thumbnail - full width below content */}
      {hasExternalUrl && (
        <div className="sm:hidden mt-2 w-full h-32 rounded-lg overflow-hidden border border-neutral-200 dark:border-neutral-700">
          <LinkPreview url={finalStoryUrl} />
        </div>
      )}
    </Card>
  );
});
