import Link from "next/link";
import { MessageSquare, ArrowUp, Clock } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { HNItem } from "@/lib/hn";
import { LinkPreview } from "./LinkPreview";
import { getDomain } from "@/lib/utils";

interface StoryCardProps {
  story: HNItem;
  index: number;
}

export function StoryCard({ story, index }: StoryCardProps) {
  const host = story.url ? getDomain(story.url) : "news.ycombinator.com";

  return (
    <div className="group relative flex flex-col gap-3 sm:gap-4 overflow-hidden rounded-xl border border-neutral-200 bg-white p-3 sm:p-4 transition-all hover:border-orange-200 hover:shadow-lg dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-orange-900/50">
      <div className="flex gap-3 sm:gap-4">
        {/* Rank & Score */}
        <div className="flex flex-col items-center gap-1 text-neutral-500 min-w-fit">
          <span className="text-base sm:text-lg font-bold text-neutral-300 dark:text-neutral-700">{index + 1}</span>
          <div className="flex flex-col items-center gap-0.5 rounded-full bg-orange-50 px-1.5 sm:px-2 py-1 text-orange-600 dark:bg-orange-950/30 dark:text-orange-500">
            <ArrowUp size={12} strokeWidth={3} />
            <span className="text-xs font-bold">{story.score || 0}</span>
          </div>
        </div>

        <div className="flex flex-1 flex-col gap-2 min-w-0">
          {/* Header info - Desktop */}
          <div className="hidden sm:flex items-center gap-2 text-xs text-neutral-500">
            <Link
              href={`/user/${story.by}`}
              className="font-medium text-neutral-900 dark:text-neutral-100 hover:text-orange-600 dark:hover:text-orange-500 transition-colors"
            >
              {story.by}
            </Link>
            <span>•</span>
            <div className="flex items-center gap-1">
              <Clock size={10} />
              <span>{formatDistanceToNow(story.time * 1000, { addSuffix: true })}</span>
            </div>
            <span>•</span>
            <a
              href={`https://news.ycombinator.com/from?site=${host}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline font-mono"
            >
              {host}
            </a>
          </div>

          {/* Header info - Mobile */}
          <div className="flex flex-col gap-1 sm:hidden text-xs text-neutral-500">
            <Link
              href={`/user/${story.by}`}
              className="font-medium text-neutral-900 dark:text-neutral-100 hover:text-orange-600 dark:hover:text-orange-500 transition-colors"
            >
              {story.by}
            </Link>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                <Clock size={10} />
                <span>{formatDistanceToNow(story.time * 1000, { addSuffix: false })}</span>
              </div>
              <span>•</span>
              <a
                href={`https://news.ycombinator.com/from?site=${host}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline font-mono truncate max-w-[150px]"
              >
                {host.length > 20 ? `${host.substring(0, 20)}...` : host}
              </a>
            </div>
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
          <div className="mt-auto flex items-center gap-3 sm:gap-4 pt-2">
            <Link
              href={`/story/${story.id}`}
              className="flex items-center gap-1.5 rounded-md bg-neutral-100 px-2.5 sm:px-3 py-1.5 text-xs font-medium text-neutral-600 transition-colors hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-400 dark:hover:bg-neutral-700"
            >
              <MessageSquare size={12} />
              <span className="hidden sm:inline">{story.descendants || 0} comments</span>
              <span className="sm:hidden">{story.descendants || 0}</span>
            </Link>
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
