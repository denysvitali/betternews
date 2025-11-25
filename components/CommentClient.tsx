"use client";

import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { MessageSquare, Triangle, Minus, Plus } from "lucide-react";
import { Comment } from "@/lib/hooks";
import Link from "next/link";

interface CommentClientProps {
  comment: Comment;
  children?: React.ReactNode;
}

export function CommentClient({ comment, children }: CommentClientProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const replyCount = comment.kids?.length || 0;

  return (
    <div className="flex flex-col gap-2 py-3 border-t border-neutral-100 dark:border-neutral-900 first:border-0">
      {/* Header / Toggle */}
      <div
        className="flex items-center gap-1.5 text-xs text-neutral-500 dark:text-neutral-400 select-none"
      >
        {/* Collapse/Expand button */}
        <button
          className="p-0.5 rounded hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-colors flex items-center justify-center"
          onClick={() => setIsCollapsed(!isCollapsed)}
          title={isCollapsed ? "Expand" : "Collapse"}
        >
          {isCollapsed ? <Plus size={12} /> : <Minus size={12} />}
        </button>

        {/* Upvote button */}
        <button
          className="p-0.5 rounded hover:bg-orange-100 dark:hover:bg-orange-950/30 transition-colors group flex items-center justify-center"
          title="Upvote"
        >
          <Triangle
            size={8}
            className="text-neutral-400 fill-neutral-400 group-hover:text-orange-600 group-hover:fill-orange-600 dark:group-hover:text-orange-500 dark:group-hover:fill-orange-500 transition-colors"
          />
        </button>

        <span className="w-1 text-neutral-400">•</span>

        {/* Username */}
        <Link
          href={`/user/${comment.by}`}
          className="font-bold text-neutral-700 dark:text-neutral-300 hover:text-orange-600 dark:hover:text-orange-500 transition-colors whitespace-nowrap"
        >
          {comment.by}
        </Link>

        <span className="text-neutral-400">•</span>

        {/* Comment time */}
        <span
          className="cursor-pointer hover:text-neutral-800 dark:hover:text-neutral-200 whitespace-nowrap"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          {formatDistanceToNow(comment.time * 1000, { addSuffix: true })}
        </span>

        {/* Reply count info - visible for navigation */}
        {replyCount > 0 && (
          <>
            <span className="text-neutral-400">•</span>
            <span
              data-reply-count={replyCount}
              className="flex items-center gap-1 text-orange-500 whitespace-nowrap"
            >
              <MessageSquare size={10} />
              <span>{replyCount} {replyCount === 1 ? 'reply' : 'replies'}</span>
            </span>
          </>
        )}

        {/* Collapsed state indicator */}
        {isCollapsed && replyCount > 0 && (
          <span className="ml-2 flex items-center gap-1 text-orange-500 bg-orange-50 dark:bg-orange-950/30 px-1.5 py-0.5 rounded text-[10px] font-medium whitespace-nowrap">
            <MessageSquare size={10} />
            <span>{replyCount} {replyCount === 1 ? 'reply' : 'replies'} hidden</span>
          </span>
        )}
      </div>

      {!isCollapsed && (
        <>
          <div
            className="text-sm leading-relaxed text-neutral-800 dark:text-neutral-200 break-words pl-6 [&>p]:mb-2 [&>pre]:overflow-x-auto [&>pre]:bg-neutral-100 [&>pre]:p-2 [&>pre]:rounded dark:[&>pre]:bg-neutral-900 [&>a]:text-orange-600 [&>a]:underline"
            dangerouslySetInnerHTML={{ __html: comment.text || "" }}
          />

          {children && (
            <div className="pl-4 ml-2 border-l-2 border-neutral-100 dark:border-neutral-800">
              {children}
            </div>
          )}
        </>
      )}
    </div>
  );
}
