"use client";

import { useState } from "react";
import { MessageSquare, Triangle, Plus, Minus, ArrowUp, ArrowUpToLine } from "lucide-react";
import { HNItem } from "@/lib/types";
import Link from "next/link";
import { TimeAgo } from "./TimeAgo";
import { IconButton } from "./ui";
import { MarkdownRenderer } from "./MarkdownRenderer";
import { BestOfBadge } from "./BestOfBadge";

interface CommentClientProps {
  comment: HNItem;
  children?: React.ReactNode;
  level?: number;
  showScore?: boolean;
  parentId?: number;
}

// Colors for nested comment indentation (like Reddit)
const INDENT_COLORS = [
  "border-l-orange-400",
  "border-l-blue-400",
  "border-l-green-400",
  "border-l-purple-400",
  "border-l-pink-400",
  "border-l-yellow-400",
  "border-l-cyan-400",
  "border-l-red-400",
];

export function CommentClient({ comment, children, level = 0, showScore = false, parentId }: CommentClientProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const replyCount = comment.kids?.length || 0;
  const descendantCount = comment.descendants || 0;
  const indentColor = INDENT_COLORS[level % INDENT_COLORS.length];

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
    <div className="flex flex-col gap-2 py-3 border-t border-neutral-100 dark:border-neutral-900 first:border-0">
      {/* Header */}
      <span className="text-xs text-neutral-500 dark:text-neutral-400 select-none flex items-center flex-wrap gap-1">
        <IconButton
          variant="ghost"
          className="inline-flex w-3 h-3 p-0 align-middle"
          onClick={() => setIsCollapsed(!isCollapsed)}
          aria-label={isCollapsed ? "Expand" : "Collapse"}
          icon={
            isCollapsed ? (
              <Plus size={10} strokeWidth={2.5} className="text-orange-500" />
            ) : (
              <Minus size={10} strokeWidth={2.5} className="text-neutral-400" />
            )
          }
        />
        <IconButton
          variant="ghost"
          className="inline-flex w-3 h-3 p-0 align-middle"
          aria-label="Upvote"
          icon={<Triangle size={8} strokeWidth={2} className="text-neutral-400 fill-neutral-400" />}
        />
        {" "}
        <Link
          href={`/user/${comment.by}`}
          className="font-bold text-neutral-700 dark:text-neutral-300 hover:text-orange-600 dark:hover:text-orange-500"
        >{comment.by}</Link>
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
            <MessageSquare size={10} strokeWidth={2} className="inline align-middle text-orange-500" />
            <span className="text-orange-500">{descendantCount}</span>
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
          <div className="text-sm leading-relaxed text-neutral-800 dark:text-neutral-200 break-words pl-6">
            <MarkdownRenderer
              content={comment.text || ""}
              className="[&>p]:mb-2 [&>pre]:overflow-x-auto [&>pre]:bg-neutral-100 [&>pre]:p-2 [&>pre]:rounded dark:[&>pre]:bg-neutral-900"
              stripHtml={true}
            />
          </div>

          {children && (
            <div className={`pl-3 sm:pl-4 ml-1 sm:ml-2 border-l-2 ${indentColor} transition-colors`}>
              {children}
            </div>
          )}
        </>
      )}
    </div>
  );
}
