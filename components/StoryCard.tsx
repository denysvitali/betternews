import Link from "next/link";
import { MessageSquare, ArrowUp, Clock, BookOpen } from "lucide-react";
import { HNItem } from "@/lib/hn";
import { LinkPreview } from "./LinkPreview";
import { getDomain, getReadingTime } from "@/lib/utils";
import { StoryBadge } from "./StoryBadge";
import { ShareButton } from "./ShareButton";
import { TimeAgo } from "./TimeAgo";

interface StoryCardProps {
  story: HNItem;
  index: number;
}

export function StoryCard({ story, index }: StoryCardProps) {
  const host = story.url ? getDomain(story.url) : "news.ycombinator.com";
  const storyUrl = story.url || `${typeof window !== 'undefined' ? window.location.origin : ''}/story/${story.id}`;

  return (
    <div className="group relative flex flex-col gap-3 sm:gap-4 overflow-hidden rounded-xl border border-neutral-200 bg-white p-3 sm:p-4 transition-all hover:border-orange-200 hover:shadow-lg dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-orange-900/50">
      <div className="flex gap-3 sm:gap-4">
        {/* Rank & Score */}
        <div className="flex flex-col items-center gap-1 min-w-fit">
          <span className="text-base sm:text-lg font-bold text-neutral-300 dark:text-neutral-700">{index + 1}</span>
          <div className="flex flex-row items-center gap-1 rounded-full bg-orange-50 px-2 py-1 text-orange-600 dark:bg-orange-950/30 dark:text-orange-500">
            <ArrowUp size={10} strokeWidth={2} />
            <span className="text-xs font-bold leading-none">{story.score || 0}</span>
          </div>
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
            {story.text && (
              <>
                <span className="text-neutral-400">|</span>
                <div className="flex items-center gap-1 text-neutral-500">
                  <BookOpen size={11} />
                  <span>{getReadingTime(story.text)}</span>
                </div>
              </>
            )}
          </div>

          {/* Header info - Mobile: Simple single line with badge, user, time */}
          <div className="flex items-center gap-1.5 sm:hidden text-xs leading-none text-neutral-500 dark:text-neutral-400">
            <StoryBadge title={story.title} type={story.type} />
            <Link
              href={`/user/${story.by}`}
              className="font-medium leading-none text-neutral-700 dark:text-neutral-300 hover:text-orange-600 dark:hover:text-orange-500 transition-colors"
            >
              {story.by}
            </Link>
            <span className="text-neutral-300 dark:text-neutral-600 leading-none">·</span>
            <TimeAgo timestamp={story.time} addSuffix={false} />
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
            <div
              className="line-clamp-2 sm:line-clamp-3 text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 prose prose-sm dark:prose-invert max-w-none [&>p]:mb-1"
              dangerouslySetInnerHTML={{ __html: story.text }}
            />
          )}

          {/* Footer actions */}
          <div className="mt-auto flex items-center gap-2 sm:gap-3 pt-2">
            <Link
              href={`/story/${story.id}`}
              className="flex items-center gap-1.5 rounded-md bg-neutral-100 px-2.5 sm:px-3 py-1.5 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700"
            >
              <MessageSquare size={11} />
              <span className="hidden sm:inline">{story.descendants || 0} comments</span>
              <span className="sm:hidden">{story.descendants || 0}</span>
            </Link>
            <ShareButton title={story.title || "Story"} url={storyUrl} />
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
    </div>
  );
}
