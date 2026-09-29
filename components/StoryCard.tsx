"use client";

import { memo, useMemo } from "react";
import Link from "next/link";
import { ArrowUp, BookOpen, MessageCircle } from "lucide-react";
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
  return (
    <article className={`story-card ${featured ? "story-card-featured" : ""}`}>
      <span className="story-rank" aria-label={`Rank ${index + 1}`}>{rank}</span>
      <div className="story-card-copy">
        <div className="story-title-row">
          {opensInNewTab ? (
            <a href={finalStoryUrl} target="_blank" rel="noopener noreferrer" className="story-title">{storyTitle}</a>
          ) : (
            <Link href={finalStoryUrl} className="story-title">{storyTitle}</Link>
          )}
          <StoryBadge title={story.title} type={story.type} />
        </div>
        <div className="story-meta">
          <span className="story-host">{host}</span>
          <span aria-hidden="true">·</span>
          <TimeAgo timestamp={story.time} />
          {story.by && <Link href={`/user/${story.by}`} className="story-author">by {story.by}</Link>}
          {readingTime && <span className="story-reading"><BookOpen size={12} aria-hidden="true" /> {readingTime}</span>}
        </div>
        {story.text && (
          <div className="story-text line-clamp-2 [&>p]:m-0"><MarkdownRenderer content={story.text} allowHtml /></div>
        )}
        <div className="story-actions-row">
          <span className="story-score" aria-label={`${story.score || 0} points`}><ArrowUp size={13} aria-hidden="true" /> {story.score || 0}<span>points</span></span>
          <Link href={`/story/${story.id}`} aria-label={`${story.descendants || 0} comments`} className="story-comments">
            <MessageCircle size={14} aria-hidden="true" /> {story.descendants || 0}<span className="hidden sm:inline">comments</span>
          </Link>
          <BookmarkButton story={{ id: story.id, title: story.title || "", url: story.url, by: story.by, time: story.time, score: story.score }} className="story-bookmark" />
          {hasExternalUrl && <a href={finalStoryUrl} target="_blank" rel="noopener noreferrer" className="story-open" aria-label={`Read source: ${storyTitle}`}>Read ↗</a>}
        </div>
      </div>
    </article>
  );
});
