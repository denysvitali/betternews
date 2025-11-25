"use client";

import { useState } from "react";
import { MessageSquare, Triangle, Plus, Minus } from "lucide-react";
import { Comment } from "@/lib/hooks";
import Link from "next/link";
import { TimeAgo } from "./TimeAgo";

interface CommentClientProps {
  comment: Comment;
  children?: React.ReactNode;
  level?: number;
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

export function CommentClient({ comment, children, level = 0 }: CommentClientProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const replyCount = comment.kids?.length || 0;
  const indentColor = INDENT_COLORS[level % INDENT_COLORS.length];

  return (
    <div className="flex flex-col gap-2 py-3 border-t border-neutral-100 dark:border-neutral-900 first:border-0">
      {/* Header / Toggle */}
      <div className="flex items-center text-xs text-neutral-500 dark:text-neutral-400 select-none">
        <button
          className="mr-0.5 hover:text-orange-500 transition-colors"
          onClick={() => setIsCollapsed(!isCollapsed)}
          title={isCollapsed ? "Expand" : "Collapse"}
        >
          {isCollapsed ? (
            <Plus size={10} strokeWidth={2.5} className="text-orange-500" />
          ) : (
            <Minus size={10} strokeWidth={2.5} className="text-neutral-400" />
          )}
        </button>
        <button
          className="mr-1.5 hover:text-orange-500 transition-colors"
          title="Upvote"
        >
          <Triangle
            size={8}
            strokeWidth={2}
            className="text-neutral-400 fill-neutral-400 hover:text-orange-600 hover:fill-orange-600"
          />
        </button>
        <Link
          href={`/user/${comment.by}`}
          className="font-bold text-neutral-700 dark:text-neutral-300 hover:text-orange-600 dark:hover:text-orange-500 transition-colors"
        >
          {comment.by}
        </Link>
        <span className="mx-1 text-neutral-300 dark:text-neutral-600">·</span>
        <TimeAgo timestamp={comment.time} />
        {replyCount > 0 && (
          <>
            <span className="mx-1 text-neutral-300 dark:text-neutral-600">·</span>
            <span className="flex items-center gap-0.5 text-orange-500">
              <MessageSquare size={10} strokeWidth={2} />
              <span>{replyCount}</span>
            </span>
          </>
        )}
      </div>

      {!isCollapsed && (
        <>
          <div
            className="text-sm leading-relaxed text-neutral-800 dark:text-neutral-200 break-words pl-6 [&>p]:mb-2 [&>pre]:overflow-x-auto [&>pre]:bg-neutral-100 [&>pre]:p-2 [&>pre]:rounded dark:[&>pre]:bg-neutral-900 [&>a]:text-orange-600 [&>a]:underline"
            dangerouslySetInnerHTML={{ __html: comment.text || "" }}
          />

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
