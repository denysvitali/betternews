"use client";

import { memo, useMemo } from "react";
import Link from "next/link";
import { ArrowUpRight, BookOpen, Clock3, ExternalLink, MessageCircle } from "lucide-react";
import { HNItem } from "@/lib/hn";
import { convertHNUrlToRelative, getDomain, getReadingTime } from "@/lib/utils";
import { getCleanTitle, StoryBadge } from "./StoryBadge";
import { TimeAgo } from "./TimeAgo";
import { BookmarkButton } from "./BookmarkButton";
import { MarkdownRenderer } from "./MarkdownRenderer";

interface StoryCardProps {
  story: HNItem;
  index: number;
  featured?: boolean;
}

export const StoryCard = memo(function StoryCard({ story, index, featured = false }: StoryCardProps) {
  const rank = String(index + 1).padStart(2, "0");
  const host = useMemo(
    () => (story.url ? getDomain(story.url) : "news.ycombinator.com") || "Hacker News",
    [story.url]
  );
  const readingTime = useMemo(
    () => (story.text ? getReadingTime(story.text) : null),
    [story.text]
  );
  const { finalStoryUrl, isHNConverted } = useMemo(() => {
    if (!story.url) return { finalStoryUrl: `/story/${story.id}`, isHNConverted: false };
    const relativePath = convertHNUrlToRelative(story.url);
    return relativePath
      ? { finalStoryUrl: relativePath, isHNConverted: true }
      : { finalStoryUrl: story.url, isHNConverted: false };
  }, [story.id, story.url]);

  const hasExternalUrl = Boolean(story.url) && !isHNConverted;
  const opensInNewTab = finalStoryUrl.startsWith("http");
  const storyTitle = getCleanTitle(story.title || "");
  const titleClassName = `story-title block max-w-[48rem] transition-colors hover:text-[var(--accent)] ${
    featured
      ? "font-[Georgia,serif] text-[1.75rem] font-semibold leading-[1.14] tracking-[-0.045em] text-[#fffaf0] sm:text-[2.5rem] lg:text-[3rem]"
      : "text-[1.06rem] font-semibold leading-[1.36] tracking-[-0.025em] text-[var(--foreground)] sm:text-[1.23rem]"
  }`;

  return (
    <article
      className={`story-card group relative overflow-hidden transition-colors ${
        featured
          ? "story-card-featured rounded-[1.35rem] border border-[#315748] bg-[#183b30] p-5 text-[#fff9ed] shadow-[0_16px_44px_rgba(23,61,50,0.16)] dark:border-[#456350] dark:bg-[#20382d] sm:rounded-[1.75rem] sm:p-7 lg:p-8"
          : "border-b border-[var(--border-soft)] bg-[var(--surface)] px-4 py-4 last:border-b-0 hover:bg-[#faf8f0] dark:hover:bg-[#1e2923] sm:px-6 sm:py-5"
      }`}
    >
      {featured && (
        <div aria-hidden="true" className="pointer-events-none absolute -bottom-14 right-3 hidden font-[Georgia,serif] text-[14rem] font-semibold leading-none tracking-[-0.1em] text-white/[0.055] sm:block lg:right-12">
          {rank}
        </div>
      )}
      <div className={`story-card-grid relative grid min-w-0 ${
        featured
          ? "gap-4 sm:grid-cols-[3rem_minmax(0,1fr)] sm:gap-5"
          : "grid-cols-[minmax(0,1fr)_3.25rem] gap-3 sm:grid-cols-[3rem_minmax(0,1fr)_4.75rem] sm:gap-5"
      }`}>
        <div className={`story-rank hidden pt-0.5 font-mono text-[0.7rem] font-medium tracking-[-0.04em] sm:block ${featured ? "text-[#f3a27e]" : "text-[#9caa9f] dark:text-[#718478]"}`}>
          {rank}<span className="text-[var(--accent)]">.</span>
        </div>

        <div className={`min-w-0 ${featured ? "sm:col-start-2" : ""}`}>
          <div className="story-kicker mb-2.5 flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1.5">
            <span className={`story-rank-mobile shrink-0 font-mono text-[0.7rem] font-semibold sm:hidden ${featured ? "text-[#f3a27e]" : "text-[var(--accent)]"}`}>
              {rank}<span className="opacity-70"> /</span>
            </span>
            {featured && (
              <span className="rounded-full border border-[#d6a486]/40 px-2 py-0.5 font-mono text-[0.58rem] font-semibold uppercase tracking-[0.16em] text-[#ffbf96]">
                Lead story
              </span>
            )}
            <span className={`story-host min-w-0 max-w-[min(55vw,18rem)] truncate font-mono text-[0.64rem] font-semibold uppercase tracking-[0.12em] ${featured ? "text-[#f7be94]" : "text-[#a95132] dark:text-[#ee9670]"}`}>
              {host}
            </span>
            <StoryBadge title={story.title} type={story.type} />
            {featured && (
              <span className="ml-auto inline-flex shrink-0 items-center gap-1 rounded-full border border-white/20 bg-white/10 px-2.5 py-1 font-mono text-[0.65rem] font-semibold text-[#fff9ed]">
                <ArrowUpRight size={12} aria-hidden="true" />
                {story.score || 0} pts
              </span>
            )}
          </div>

          <div className="story-card-body min-w-0">
            <div className="story-card-copy min-w-0">
              {opensInNewTab ? (
                <a href={finalStoryUrl} target="_blank" rel="noopener noreferrer" className={titleClassName}>
                  {storyTitle}
                </a>
              ) : (
                <Link href={finalStoryUrl} className={titleClassName}>
                  {storyTitle}
                </Link>
              )}

              <div className={`story-meta mt-2.5 flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-[0.65rem] ${featured ? "text-[#cadbd0]" : "text-[#6d7a71] dark:text-[#a0ada3]"}`}>
                <span>
                  by{" "}
                  {story.by ? (
                    <Link href={`/user/${story.by}`} className={`font-semibold hover:text-[var(--accent)] ${featured ? "text-[#fff9ed]" : "text-[var(--foreground)]"}`}>
                      {story.by}
                    </Link>
                  ) : "unknown"}
                </span>
                <span aria-hidden="true">·</span>
                <span className="story-time inline-flex items-center gap-1">
                  <Clock3 size={11} aria-hidden="true" />
                  <TimeAgo timestamp={story.time} />
                </span>
                {readingTime && (
                  <>
                    <span aria-hidden="true">·</span>
                    <span className="story-reading inline-flex items-center gap-1">
                      <BookOpen size={11} aria-hidden="true" />
                      {readingTime}
                    </span>
                  </>
                )}
              </div>

              {story.text && (
                <div className={`story-text mt-4 border-l-2 pl-3 text-sm leading-relaxed ${featured ? "border-[#ee8659] text-[#d7e2d8]" : "border-[#e8a47e] text-[#69756d] dark:text-[#abb9ae]"}`}>
                  <div className="line-clamp-2 [&>p]:m-0">
                    <MarkdownRenderer content={story.text} allowHtml />
                  </div>
                </div>
              )}

              <div className={`story-actions-row mt-3.5 flex min-h-8 items-center gap-2 ${featured ? "sm:mt-6" : ""}`}>
                <Link
                  href={`/story/${story.id}`}
                  aria-label={`${story.descendants || 0} comments`}
                  className={`story-comments inline-flex h-8 items-center gap-1.5 rounded-full px-3 text-xs font-semibold transition-colors ${featured ? "border border-white/20 bg-white/10 text-[#fff9ed] hover:bg-white/20" : "bg-[var(--muted-surface)] text-[#506155] hover:bg-[#e5ebe1] dark:text-[#c5d0c6] dark:hover:bg-[#35473a]"}`}
                >
                  <MessageCircle size={13} aria-hidden="true" />
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
                  className={`story-bookmark touch-target-auto h-8 rounded-full px-2.5 py-0 ${featured ? "border border-white/20 bg-white/10 text-[#fff9ed] hover:bg-white/20" : ""}`}
                />
                {hasExternalUrl && (
                  <a
                    href={finalStoryUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`story-open ml-auto inline-flex items-center gap-1.5 text-xs font-semibold transition-colors hover:text-[var(--accent)] ${featured ? "text-[#d7e4d9]" : "text-[#728377]"}`}
                    aria-label="Read source"
                  >
                    <span className="hidden sm:inline">Read source</span>
                    <ExternalLink size={13} aria-hidden="true" />
                  </a>
                )}
              </div>
            </div>

          </div>
        </div>

        {!featured && (
          <div className="flex flex-col items-end gap-0.5 border-l border-[var(--border-soft)] pl-2 sm:items-center sm:justify-center sm:pl-4">
            <ArrowUpRight size={15} aria-hidden="true" className="text-[var(--accent)]" />
            <span className="story-score-mobile font-mono text-sm font-semibold leading-none tracking-[-0.05em] text-[var(--brand)] dark:text-[#f2f0e7] sm:text-lg">
              {story.score || 0}
            </span>
            <span className="hidden font-mono text-[0.54rem] uppercase tracking-[0.16em] text-[#8c9b8f] sm:block">pts</span>
          </div>
        )}
      </div>
    </article>
  );
});
