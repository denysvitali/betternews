"use client";

import { memo, useState } from "react";
import { useComment } from "@/lib/hooks";
import { CommentClient } from "./CommentClient";
import { Suspense } from "react";
import { CommentSkeleton } from "./CommentSkeleton";
import { MessageSquare, ChevronDown } from "lucide-react";

interface CommentProps {
  id: number;
  level?: number;
  maxInitialDepth?: number;
}

// Default depth after which replies are collapsed
const DEFAULT_MAX_INITIAL_DEPTH = 2;

export const Comment = memo(function Comment({
  id,
  level = 0,
  maxInitialDepth = DEFAULT_MAX_INITIAL_DEPTH
}: CommentProps) {
  const { comment, loading, error } = useComment(id);
  const [showReplies, setShowReplies] = useState(false);

  // Determine if this comment's replies should be initially collapsed
  const shouldCollapseReplies = level >= maxInitialDepth;
  const hasReplies = comment?.kids && comment.kids.length > 0;
  const replyCount = comment?.kids?.length || 0;

  if (loading) {
    return <CommentSkeleton level={level} />;
  }

  if (error || !comment || comment.deleted || comment.dead) {
    return null;
  }

  // Render the "load more replies" button for collapsed deep threads
  const renderCollapsedReplies = () => {
    if (!hasReplies) return null;

    if (!showReplies) {
      return (
        <button
          onClick={() => setShowReplies(true)}
          className="mt-2 flex items-center gap-1.5 text-xs text-orange-600 dark:text-orange-500 hover:text-orange-700 dark:hover:text-orange-400 transition-colors py-1.5 px-2 rounded-md hover:bg-orange-50 dark:hover:bg-orange-950/30"
        >
          <ChevronDown size={14} />
          <MessageSquare size={12} />
          <span>
            {replyCount === 1
              ? "Show 1 reply"
              : `Show ${replyCount} replies`}
          </span>
        </button>
      );
    }

    // Show replies when expanded
    return (
      <div className="mt-2">
        {comment.kids!.map((kidId) => (
          <Suspense key={kidId} fallback={<CommentSkeleton level={level + 1} />}>
            <Comment
              id={kidId}
              level={level + 1}
              maxInitialDepth={maxInitialDepth}
            />
          </Suspense>
        ))}
      </div>
    );
  };

  // Render replies normally (not collapsed)
  const renderReplies = () => {
    if (!hasReplies) return null;

    return (
      <div className="mt-2">
        {comment.kids!.map((kidId) => (
          <Suspense key={kidId} fallback={<CommentSkeleton level={level + 1} />}>
            <Comment
              id={kidId}
              level={level + 1}
              maxInitialDepth={maxInitialDepth}
            />
          </Suspense>
        ))}
      </div>
    );
  };

  return (
    <div
      id={`comment-${comment.id}`}
      data-comment-id={comment.id}
      data-comment-author={comment.by}
      data-comment-level={level}
      className="transition-all duration-300"
    >
      <CommentClient comment={comment} level={level}>
        {shouldCollapseReplies ? renderCollapsedReplies() : renderReplies()}
      </CommentClient>
    </div>
  );
});
