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
    <Card variant="hover" padding="md" className="overflow-hidden">
      <div className="flex gap-3">
        {/* Rank - subtle, minimal */}
        <div className="flex flex-col items-center justify-start pt-0.5 min-w-[24px]">
          <span className="text-sm font-bold text-neutral-200 dark:text-neutral-700">{index + 1}</span>
        </div>

        <div className="flex flex-1 flex-col gap-1.5 min-w-0">
          {/* Title - most prominent, no line clamp on desktop */}
          <div className="flex items-start gap-2 flex-wrap">
            <a
              href={finalStoryUrl}
              target={!isHNConverted && finalStoryUrl.startsWith("http") ? "_blank" : undefined}
              rel={!isHNConverted && finalStoryUrl.startsWith("http") ? "noreferrer" : undefined}
              className={`font-semibold text-base sm:text-lg leading-snug line-clamp-2 sm:line-clamp-1 ${
                isHNConverted
                  ? "text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                  : "text-neutral-900 hover:text-orange-600 dark:text-neutral-100 dark:hover:text-orange-500"
              }`}
            >
              {story.title}
            </a>
            {isHNConverted && hnId && (
              <span className="text-[10px] sm:text-xs text-neutral-500 dark:text-neutral-400 bg-neutral-100 dark:bg-neutral-800 px-1.5 py-0.5 rounded font-mono whitespace-nowrap mt-0.5">
                HN#{hnId}
              </span>
            )}
          </div>

          {/* Metadata row - single line, clean */}
          <div className="flex flex-wrap items-center gap-x-1.5 gap-y-0.5 text-xs text-neutral-500 dark:text-neutral-400">
            <StoryBadge title={story.title} type={story.type} />
            <Link
              href={`/user/${story.by}`}
              className="font-medium hover:text-orange-600 dark:hover:text-orange-500 transition-colors"
            >
              {story.by}
            </Link>
            <span className="text-neutral-300 dark:text-neutral-600">·</span>
            <span className="flex items-center gap-0.5">
              <Clock size={10} strokeWidth={2} />
              <TimeAgo timestamp={story.time} />
            </span>
            <span className="text-neutral-300 dark:text-neutral-600">·</span>
            <Badge variant="orange" size="sm" icon={<ArrowUp size={8} strokeWidth={2} />}>
              {story.score || 0}
            </Badge>
            {hasExternalUrl && (
              <>
                <span className="text-neutral-300 dark:text-neutral-600">·</span>
                <a
                  href={`https://news.ycombinator.com/from?site=${host}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-[11px] hover:text-orange-500 dark:hover:text-orange-400 transition-colors truncate max-w-[100px]"
                  title={host}
                >
                  {host}
                </a>
              </>
            )}
            {readingTime && (
              <>
                <span className="text-neutral-300 dark:text-neutral-600">·</span>
                <span className="flex items-center gap-0.5 text-neutral-500">
                  <BookOpen size={10} strokeWidth={2} />
                  <span>{readingTime}</span>
                </span>
              </>
            )}
          </div>

          {/* Text preview for text posts */}
          {story.text && (
            <div className="line-clamp-2 text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 prose prose-sm dark:prose-invert max-w-none [&>p]:mb-1 [&>p]:leading-relaxed">
              <MarkdownRenderer content={story.text} allowHtml={true} />
            </div>
          )}

          {/* Footer - actions row */}
          <div className="flex items-center gap-2 pt-1">
            <Link
              href={`/story/${story.id}`}
              className="inline-flex items-center gap-1.5 text-xs text-neutral-500 hover:text-orange-600 dark:text-neutral-400 dark:hover:text-orange-500 transition-colors"
            >
              <MessageSquare size={12} strokeWidth={2} />
              <span>{story.descendants || 0}</span>
            </Link>
            <span className="text-neutral-200 dark:text-neutral-700">·</span>
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
              <span className="ml-auto">
                <a
                  href={finalStoryUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-neutral-400 hover:text-orange-500 dark:hover:text-orange-400 transition-colors"
                  title="Open external link"
                >
                  <ExternalLink size={12} strokeWidth={2} />
                </a>
              </span>
            )}
          </div>
        </div>

        {/* Thumbnail - desktop only */}
        {hasExternalUrl && (
          <div className="hidden sm:block w-28 h-20 shrink-0 rounded-md overflow-hidden border border-neutral-100 dark:border-neutral-800">
            <LinkPreview url={finalStoryUrl} />
          </div>
        )}
      </div>

      {/* Thumbnail - mobile only, below content */}
      {hasExternalUrl && (
        <div className="sm:hidden mt-2 w-full h-28 rounded-md overflow-hidden border border-neutral-100 dark:border-neutral-800">
          <LinkPreview url={finalStoryUrl} />
        </div>
      )}
    </Card>
  );
});
