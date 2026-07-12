"use client";

import { useState } from "react";
import { MessageSquare, Plus, Minus, ArrowUp, ArrowUpToLine } from "lucide-react";
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
  const author = comment.by;

  // Scroll to top of comments or parent comment
  const scrollToParent = () => {
    if (level > 0 && parentId) {
      const parentElement = document.getElementById(`comment-${parentId}`);
      if (parentElement) {
        parentElement.scrollIntoView({ behavior: "smooth", block: "center" });
        // Highlight effect
        parentElement.classList.add("ring-2", "ring-orange-500", "ring-opacity-50");
        setTimeout(() => {
          parentElement.classList.remove("ring-2", "ring-orange-500", "ring-opacity-50");
        }, 1500);
      }
    } else {
      // Scroll to comments container
      const container = document.getElementById("comments-container");
      if (container) {
        container.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  };

  return (
    <div className="comment relative flex flex-col gap-1.5 border-t border-neutral-100 py-2 pl-2 dark:border-neutral-900 first:border-0">
      {level > 0 && (
        <span
          aria-hidden="true"
          className="absolute bottom-3 left-0 top-3 w-0.5 rounded-full bg-orange-400/40 dark:bg-orange-500/30"
        />
      )}
      {/* Header */}
      <span className="comment-meta text-xs text-neutral-500 dark:text-neutral-400 select-none flex items-center flex-wrap gap-1">
        <button
          type="button"
          className="inline-flex h-6 items-center gap-1 rounded px-1.5 py-0.5 align-middle text-[11px] text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-neutral-100"
          onClick={() => setIsCollapsed(!isCollapsed)}
          aria-label={isCollapsed ? "Expand comment" : "Collapse comment"}
          aria-expanded={!isCollapsed}
        >
          {isCollapsed ? (
            <Plus size={12} strokeWidth={2.5} className="text-orange-500" />
          ) : (
            <Minus size={12} strokeWidth={2.5} className="text-neutral-400" />
          )}
          <span className="hidden sm:inline">{isCollapsed ? "Expand" : "Collapse"}</span>
        </button>
        {author ? (
          <Link
            href={`/user/${author}`}
            className="font-bold text-neutral-700 dark:text-neutral-300 hover:text-orange-600 dark:hover:text-orange-500 flex items-center"
          >{author}</Link>
        ) : (
          <span className="font-bold text-neutral-500">unknown</span>
        )}
        {showScore && comment.score && (
          <>
            <span className="text-neutral-300 dark:text-neutral-600"> · </span>
            <span className="flex items-center gap-0.5 text-orange-500">
              <ArrowUp size={10} strokeWidth={2} />
              {comment.score}
            </span>
          </>
        )}
        <span className="text-neutral-300 dark:text-neutral-600"> · </span>
        <TimeAgo timestamp={comment.time} />
        {descendantCount > 0 && (
          <>
            <span className="text-neutral-300 dark:text-neutral-600"> · </span>
            <span className="inline-flex items-center gap-1 rounded border border-orange-200 bg-orange-50 px-1 py-0.5 text-[11px] font-medium text-orange-600 dark:border-orange-900/60 dark:bg-orange-950/30 dark:text-orange-400">
              <MessageSquare size={10} strokeWidth={2} />
              {descendantCount}
            </span>
          </>
        )}
        {/* Show Best Of badge for highly-discussed comments */}
        {level === 0 && descendantCount >= 10 && (
          <BestOfBadge descendantCount={descendantCount} />
        )}

        {/* Jump to parent button for nested comments */}
        {level > 0 && (
          <>
            <span className="text-neutral-300 dark:text-neutral-600"> · </span>
            <button
              onClick={scrollToParent}
              className="flex items-center gap-0.5 text-neutral-400 hover:text-orange-500 dark:hover:text-orange-400 transition-colors"
              title={parentId ? "Jump to parent comment" : "Jump to top"}
              aria-label={parentId ? "Jump to parent comment" : "Jump to top"}
            >
              <ArrowUpToLine size={10} strokeWidth={2} />
              {parentId ? "Parent" : "Top"}
            </button>
          </>
        )}
      </span>

      {!isCollapsed && (
        <>
          <div className="comment-body text-sm leading-relaxed text-neutral-800 dark:text-neutral-200 break-words pl-5">
            <MarkdownRenderer
              content={comment.text || ""}
              className="[&>p]:mb-2 [&>pre]:overflow-x-auto [&>pre]:bg-neutral-100 [&>pre]:p-2 [&>pre]:rounded dark:[&>pre]:bg-neutral-900"
              stripHtml={true}
            />
          </div>

          {children && (
            <div className="comment-children pl-3 sm:pl-4 ml-1 sm:ml-2 border-l-2 border-orange-400/50 dark:border-orange-500/30 transition-colors">
              {children}
            </div>
          )}
        </>
      )}
      {isCollapsed && descendantCount > 0 && (
        <button
          type="button"
          onClick={() => setIsCollapsed(false)}
          aria-label="Expand comment replies"
          className="ml-6 mt-1 w-fit rounded-full border border-[var(--border-soft)] bg-white/60 px-3 py-1 text-xs font-medium text-neutral-600 transition-colors hover:text-orange-600 dark:bg-white/6 dark:text-neutral-300 dark:hover:text-orange-400"
        >
          +{descendantCount} replies hidden
        </button>
      )}
    </div>
  );
}
