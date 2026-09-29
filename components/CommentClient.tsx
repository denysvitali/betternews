"use client";

import { useState } from "react";
import { ArrowUp, ArrowUpToLine, ChevronDown, ExternalLink, MessageSquare } from "lucide-react";
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
}

export function CommentClient({ comment, children, level = 0, showScore = false, parentId }: CommentClientProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const descendantCount = comment.descendants || 0;
  const replyCount = comment.kids?.length || 0;
  const author = comment.by;

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
    <article className={"comment relative min-w-0 " + (level === 0 ? "border-b border-[var(--border-soft)] py-4" : "py-2")}>
      <div className="relative flex min-h-8 min-w-0 items-center gap-2.5 sm:gap-3">
        <div className="comment-meta flex min-w-0 flex-1 flex-wrap items-center gap-x-2 gap-y-1 pr-11 text-[11px] text-neutral-500 dark:text-neutral-400 sm:pr-11">
          {author ? (
            <Link href={"/user/" + author} className="font-semibold text-[var(--brand)] transition-colors hover:text-orange-600 dark:text-neutral-200 dark:hover:text-orange-400">{author}</Link>
          ) : (
            <span className="font-semibold text-[var(--brand)] dark:text-neutral-200">unknown</span>
          )}
          <span className="text-neutral-300 dark:text-neutral-600" aria-hidden="true">·</span>
          <TimeAgo timestamp={comment.time} />
          {showScore && typeof comment.score === "number" && (
            <span className="inline-flex items-center gap-0.5 font-medium text-orange-600 dark:text-orange-400"><ArrowUp size={12} />{comment.score}</span>
          )}
          {replyCount > 0 && (
            <span className="inline-flex items-center gap-1 font-medium text-neutral-600 dark:text-neutral-300">
              <MessageSquare size={11} />{replyCount} {replyCount === 1 ? "reply" : "replies"}
            </span>
          )}
          {level === 0 && descendantCount >= 10 && <BestOfBadge descendantCount={descendantCount} />}
        </div>

        <button
          type="button"
          onClick={() => setIsCollapsed((collapsed) => !collapsed)}
          aria-label={isCollapsed ? "Expand comment by " + (author || "unknown") : "Collapse comment by " + (author || "unknown")}
          aria-expanded={!isCollapsed}
          aria-controls={"comment-content-" + comment.id}
          className="absolute right-0 -top-1 flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-neutral-400 transition-colors hover:bg-[var(--muted-surface)] hover:text-[var(--brand)] dark:hover:text-neutral-200"
          title={isCollapsed ? "Expand thread" : "Collapse thread"}
        >
          <ChevronDown size={16} className={"transition-transform " + (isCollapsed ? "" : "rotate-180")} />
        </button>
      </div>

      <div className="min-w-0">
        {isCollapsed ? (
          <button type="button" onClick={() => setIsCollapsed(false)} className="mt-1 inline-flex min-h-8 items-center gap-1.5 rounded-md py-1 text-xs font-medium text-neutral-500 transition-colors hover:text-orange-600 dark:text-neutral-400 dark:hover:text-orange-400">
            <ChevronDown size={14} /> Show comment{replyCount > 0 ? " and replies" : ""}
          </button>
        ) : (
          <div id={"comment-content-" + comment.id}>
            <div className="comment-body mt-1.5 max-w-[76ch] break-words text-[14px] leading-[1.65] text-[var(--foreground)] sm:text-[14.5px] [&_p]:mb-3 [&_p:last-child]:mb-0 [&_pre]:overflow-x-auto">
              <MarkdownRenderer content={comment.text || ""} stripHtml />
            </div>

            <div className="mt-2.5 flex flex-wrap items-center gap-x-4 gap-y-2 text-[11px] font-medium text-neutral-500 dark:text-neutral-400">
              <a href={"https://news.ycombinator.com/item?id=" + comment.id} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-7 items-center gap-1 transition-colors hover:text-orange-600 dark:hover:text-orange-400">
                Permalink <ExternalLink size={11} />
              </a>
              {level > 0 && (
                <button type="button" onClick={scrollToParent} className="inline-flex min-h-7 items-center gap-1 transition-colors hover:text-orange-600 dark:hover:text-orange-400">
                  <ArrowUpToLine size={12} /> {parentId ? "Parent" : "Top"}
                </button>
              )}
            </div>

            {children && (
              <div className="comment-children relative mt-2 border-l border-[var(--border-soft)] pl-3">
                {children}
              </div>
            )}
          </div>
        )}
      </div>
    </article>
  );
}
