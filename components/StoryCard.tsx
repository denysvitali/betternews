"use client";

import { memo, useEffect, useMemo, useRef } from "react";
import Link from "next/link";
import { ArrowUp, BookOpen, Flame, MessageCircle } from "lucide-react";
import { HNItem } from "@/lib/hn";
import { convertHNUrlToRelative, getDomain, getReadingTime, storyHref } from "@/lib/utils";
import { setStoryVisited, useHistoryEntry } from "@/lib/history";
import { useBookmarks } from "@/lib/bookmarks";
import { useSwipeActions } from "@/lib/useSwipeActions";
import { getCleanTitle, StoryBadge } from "./StoryBadge";
import { TimeAgo } from "./TimeAgo";
import { BookmarkButton } from "./BookmarkButton";
import { MarkdownRenderer } from "./MarkdownRenderer";
import { Favicon } from "./Favicon";

interface StoryCardProps {
  story: HNItem;
  index: number;
}

/** A discussion is "hot" when it is big in absolute terms or outpaces the votes. */
function isHotDiscussion(comments: number, score: number) {
  return comments >= 100 || (comments >= 40 && comments >= score);
}

export const StoryCard = memo(function StoryCard({ story, index }: StoryCardProps) {
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
    if (!story.url) return { finalStoryUrl: storyHref(story.id), isHNConverted: false };
    const relativePath = convertHNUrlToRelative(story.url);
    return relativePath
      ? { finalStoryUrl: relativePath, isHNConverted: true }
      : { finalStoryUrl: story.url, isHNConverted: false };
  }, [story.id, story.url]);

  const history = useHistoryEntry(story.id);
  const { isBookmarked, toggleBookmark } = useBookmarks();
  const comments = story.descendants || 0;
  const score = story.score || 0;
  const newComments =
    history?.comments !== undefined && comments > history.comments ? comments - history.comments : 0;
  const hot = isHotDiscussion(comments, score);
  const visited = Boolean(history?.visited);

  const bookmarkStory = {
    id: story.id,
    title: story.title || "",
    url: story.url,
    by: story.by,
    time: story.time,
    score: story.score,
  };
  const swipe = useSwipeActions({
    onSwipeRight: () => toggleBookmark(bookmarkStory),
    onSwipeLeft: () => setStoryVisited(story.id, !visited),
  });

  // Lets the feed keyboard shortcut ("x") flip read state like the swipe gesture.
  const cardRef = useRef<HTMLElement>(null);
  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;
    const toggleRead = () => setStoryVisited(story.id, !visited);
    card.addEventListener("story-toggle-read", toggleRead);
    return () => card.removeEventListener("story-toggle-read", toggleRead);
  }, [story.id, visited]);

  const hasExternalUrl = Boolean(story.url) && !isHNConverted;
  const opensInNewTab = finalStoryUrl.startsWith("http");
  const storyTitle = getCleanTitle(story.title || "");
  const markVisited = () => setStoryVisited(story.id, true);

  return (
    <article
      ref={cardRef}
      className="story-card"
      data-story-id={story.id}
      data-visited={visited || undefined}
      data-swipe-save={isBookmarked(story.id) ? "Remove" : "Save"}
      data-swipe-read={visited ? "Mark unread" : "Mark read"}
      {...swipe}
    >
      <span className="story-rank" aria-label={`Rank ${index + 1}`}>{rank}</span>
      <div className="story-card-copy">
        <div className="story-title-row">
          {opensInNewTab ? (
            <a href={finalStoryUrl} target="_blank" rel="noopener noreferrer" className="story-title" onClick={markVisited} onAuxClick={markVisited}>{storyTitle}</a>
          ) : (
            <Link href={finalStoryUrl} className="story-title" onClick={markVisited}>{storyTitle}</Link>
          )}
          <StoryBadge title={story.title} type={story.type} />
        </div>
        <div className="story-meta">
          <Favicon host={host} />
          <span className="story-host">{host}</span>
          <span aria-hidden="true">·</span>
          <TimeAgo timestamp={story.time} />
          {story.by && <Link href={`/user/${story.by}`} className="story-author">by {story.by}</Link>}
          {readingTime && <span className="story-reading"><BookOpen size={12} aria-hidden="true" /> {readingTime}</span>}
        </div>
        {story.text && (
          <div className="story-text line-clamp-2 [&>p]:m-0"><MarkdownRenderer content={story.text} allowHtml /></div>
        )}
      </div>
      <div className="story-actions-row">
        <Link
          href={storyHref(story.id)}
          aria-label={`${comments} comments${newComments > 0 ? `, ${newComments} new` : ""}`}
          className={`story-comments${hot ? " story-comments-hot" : ""}`}
          onClick={markVisited}
        >
          {hot ? <Flame size={14} aria-hidden="true" /> : <MessageCircle size={14} aria-hidden="true" />} {comments}<span className="story-action-label">comments</span>
          {newComments > 0 && <span className="story-new-comments" aria-hidden="true">+{newComments}</span>}
        </Link>
        <span className="story-score" aria-label={`${score} points`}><ArrowUp size={13} aria-hidden="true" /> {score}<span className="story-action-label">points</span></span>
        <BookmarkButton story={bookmarkStory} className="story-bookmark" />
        {hasExternalUrl ? (
          <a href={finalStoryUrl} target="_blank" rel="noopener noreferrer" className="story-open" aria-label={`Read source: ${storyTitle}`} onClick={markVisited} onAuxClick={markVisited}>Read ↗</a>
        ) : (
          <span className="story-open" aria-hidden="true" />
        )}
      </div>
    </article>
  );
});
