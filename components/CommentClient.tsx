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
        className="flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400 select-none"
      >
        <button
          className="p-0.5 rounded hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-colors"
          onClick={() => setIsCollapsed(!isCollapsed)}
          title={isCollapsed ? "Expand" : "Collapse"}
        >
          {isCollapsed ? <Plus size={14} /> : <Minus size={14} />}
        </button>

        {/* Upvote button */}
        <button
          className="p-0.5 rounded hover:bg-orange-100 dark:hover:bg-orange-950/30 transition-colors group"
          title="Upvote"
        >
          <Triangle
            size={10}
            className="text-neutral-400 fill-neutral-400 group-hover:text-orange-600 group-hover:fill-orange-600 dark:group-hover:text-orange-500 dark:group-hover:fill-orange-500 transition-colors"
          />
        </button>

        <Link
          href={`/user/${comment.by}`}
          className="font-bold text-neutral-700 dark:text-neutral-300 hover:text-orange-600 dark:hover:text-orange-500 transition-colors"
        >
          {comment.by}
        </Link>
        <span>•</span>
        <span className="cursor-pointer hover:text-neutral-800 dark:hover:text-neutral-200" onClick={() => setIsCollapsed(!isCollapsed)}>
          {formatDistanceToNow(comment.time * 1000, { addSuffix: true })}
        </span>

        {/* Reply count info - visible for navigation */}
        {replyCount > 0 && (
          <>
            <span>•</span>
            <span data-reply-count={replyCount} className="flex items-center gap-1 text-orange-500">
              <MessageSquare size={10} />
              {replyCount} {replyCount === 1 ? 'reply' : 'replies'}
            </span>
          </>
        )}

        {/* Collapsed state indicator */}
        {isCollapsed && replyCount > 0 && (
          <span className="ml-2 flex items-center gap-1 text-orange-500 bg-orange-50 dark:bg-orange-950/30 px-1.5 py-0.5 rounded text-[10px] font-medium">
            <MessageSquare size={10} />
            {replyCount} {replyCount === 1 ? 'reply' : 'replies'} hidden
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
