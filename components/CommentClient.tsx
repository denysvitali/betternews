"use client";

import { useState } from "react";
import { ArrowUp, ArrowUpToLine, ChevronDown, MessageSquare } from "lucide-react";
import { HNItem } from "@/lib/types";
import Link from "next/link";
import { TimeAgo } from "./TimeAgo";
import { MarkdownRenderer } from "./MarkdownRenderer";
import { BestOfBadge } from "./BestOfBadge";

interface CommentClientProps {
  comment: HNItem;
  children?: React.ReactNode;
  level?: number;
  showScore?: boolean;
  parentId?: number;
  /** Username of the story submitter, used to flag their replies as OP. */
  storyAuthor?: string;
}

export function CommentClient({ comment, children, level = 0, showScore = false, parentId, storyAuthor }: CommentClientProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const descendantCount = comment.descendants || 0;
  const replyCount = comment.kids?.length || 0;
  const author = comment.by;
  const isOp = Boolean(author && storyAuthor && author === storyAuthor);

  const scrollToParent = () => {
    const target = level > 0 && parentId
      ? document.getElementById("comment-" + parentId)
      : document.getElementById("comments-container");

    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: level > 0 ? "center" : "start" });
      if (level > 0) {
        target.classList.add("ring-2", "ring-orange-500", "ring-opacity-50");
        setTimeout(() => target.classList.remove("ring-2", "ring-orange-500", "ring-opacity-50"), 1500);
      }
    }
  };

  return (
    <article className={"comment relative min-w-0 " + (level === 0 ? "border-b border-[var(--border-soft)] py-3.5" : "py-1.5")}>
      <div className="comment-meta flex min-h-7 min-w-0 flex-wrap items-center gap-x-2 gap-y-1 text-xs text-neutral-500 dark:text-neutral-400">
        {author ? (
          <Link href={"/user/" + author} className="font-semibold text-[var(--brand)] transition-colors hover:text-orange-600 dark:text-neutral-200 dark:hover:text-orange-400">{author}</Link>
        ) : (
          <span className="font-semibold text-[var(--brand)] dark:text-neutral-200">unknown</span>
        )}
        {isOp && <span className="comment-op" title="Submitted this story">OP</span>}
        <span className="text-neutral-300 dark:text-neutral-600" aria-hidden="true">·</span>
        <a href={"https://news.ycombinator.com/item?id=" + comment.id} target="_blank" rel="noopener noreferrer" className="comment-timestamp transition-colors hover:text-[var(--accent)] [&_span]:cursor-pointer">
          <TimeAgo timestamp={comment.time} />
        </a>
        {showScore && typeof comment.score === "number" && (
          <span className="inline-flex items-center gap-0.5 font-medium text-orange-600 dark:text-orange-400"><ArrowUp size={12} />{comment.score}</span>
        )}
        {replyCount > 0 && (
          <span className="inline-flex items-center gap-1 font-medium text-neutral-600 dark:text-neutral-300">
            <MessageSquare size={11} />{replyCount} {replyCount === 1 ? "reply" : "replies"}
          </span>
        )}
        {level === 0 && descendantCount >= 10 && <BestOfBadge descendantCount={descendantCount} />}
        <button
          type="button"
          onClick={() => setIsCollapsed((collapsed) => !collapsed)}
          aria-label={isCollapsed ? "Expand comment by " + (author || "unknown") : "Collapse comment by " + (author || "unknown")}
          aria-expanded={!isCollapsed}
          aria-controls={"comment-content-" + comment.id}
          className="comment-toggle"
          title={isCollapsed ? "Expand thread" : "Collapse thread"}
        >
          <ChevronDown size={16} className={"transition-transform " + (isCollapsed ? "" : "rotate-180")} />
        </button>
      </div>

      <div className="min-w-0">
        {isCollapsed ? (
          <button type="button" onClick={() => setIsCollapsed(false)} className="comment-action mt-1 inline-flex min-h-8 items-center gap-1.5 rounded-md py-1 text-xs font-medium text-neutral-500 transition-colors hover:text-orange-600 dark:text-neutral-400 dark:hover:text-orange-400">
            <ChevronDown size={14} /> Show comment{replyCount > 0 ? " and replies" : ""}
          </button>
        ) : (
          <div id={"comment-content-" + comment.id}>
            <div className="comment-body mt-1 max-w-[76ch] break-words text-[14px] leading-[1.65] text-[var(--foreground)] sm:text-[14.5px] [&_p]:mb-3 [&_p:last-child]:mb-0 [&_pre]:overflow-x-auto">
              <MarkdownRenderer content={comment.text || ""} stripHtml />
            </div>

            {level > 0 && (
              <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs font-medium text-neutral-500 dark:text-neutral-400">
                <button type="button" onClick={scrollToParent} className="comment-action inline-flex min-h-7 items-center gap-1 transition-colors hover:text-orange-600 dark:hover:text-orange-400">
                  <ArrowUpToLine size={12} /> {parentId ? "Parent" : "Top"}
                </button>
              </div>
            )}

            {children && (
              <div className={"comment-children comment-rail-" + (level % 5) + " relative mt-1 pl-3"}>
                {children}
              </div>
            )}
          </div>
        )}
      </div>
    </article>
  );
}
