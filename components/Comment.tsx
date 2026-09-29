"use client";

import { memo, useState, useMemo } from "react";
import { useComment, useCommentTimes } from "@/lib/hooks";
import { CommentClient } from "./CommentClient";
import { Suspense } from "react";
import { CommentSkeleton } from "./CommentSkeleton";
import { MessageSquare, ChevronDown } from "lucide-react";
import { CommentSortType } from "./CommentSortControl";

interface CommentProps {
  id: number;
  level?: number;
  maxInitialDepth?: number;
  sortBy?: CommentSortType;
  showScore?: boolean;
  parentId?: number;
  storyAuthor?: string;
}

// Default depth after which replies are collapsed
const DEFAULT_MAX_INITIAL_DEPTH = 2;

export function sortCommentIds(
  ids: number[],
  sortBy: CommentSortType,
  times?: ReadonlyMap<number, number>
): number[] {
  const sortedIds = [...ids];

  if (sortBy === "newest") {
    return sortedIds.sort(
      (a, b) => (times?.get(b) ?? b) - (times?.get(a) ?? a)
    );
  }

  if (sortBy === "oldest") {
    return sortedIds.sort(
      (a, b) => (times?.get(a) ?? a) - (times?.get(b) ?? b)
    );
  }

  return sortedIds;
}

export const Comment = memo(function Comment({
  id,
  level = 0,
  maxInitialDepth = DEFAULT_MAX_INITIAL_DEPTH,
  sortBy = "default",
  showScore = false,
  parentId,
  storyAuthor
}: CommentProps) {
  const { comment, loading, error } = useComment(id);
  const [showReplies, setShowReplies] = useState(false);

  // Determine if this comment's replies should be initially collapsed
  const shouldCollapseReplies = level >= maxInitialDepth;
  const hasReplies = comment?.kids && comment.kids.length > 0;
  const replyCount = comment?.kids?.length || 0;
  const childIds = useMemo(() => comment?.kids ?? [], [comment?.kids]);
  const { times: childTimes } = useCommentTimes(
    childIds,
    sortBy !== "default"
  );

  // Sort replies based on the selected sort option
  const sortedKids = useMemo(() => {
    return sortCommentIds(childIds, sortBy, childTimes);
  }, [childIds, childTimes, sortBy]);

  if (loading) {
    return <CommentSkeleton level={level} />;
  }

  if (error || !comment || comment.deleted || comment.dead) {
    return null;
  }

  // Shared list of reply nodes, reused whether replies are shown directly or
  // revealed via the toggle on collapsed deep threads.
  const replyList = (
    <div id={`comment-replies-${comment.id}`} className="mt-1">
      {sortedKids.map((kidId) => (
        <Suspense key={kidId} fallback={<CommentSkeleton level={level + 1} />}>
          <Comment
            id={kidId}
            level={level + 1}
            maxInitialDepth={maxInitialDepth}
            sortBy={sortBy}
            showScore={showScore}
            parentId={comment.id}
            storyAuthor={storyAuthor}
          />
        </Suspense>
      ))}
    </div>
  );

  // Below the collapse threshold deep replies are hidden until the user opts
  // in, but can also be collapsed again after they have been revealed.
  let replies: React.ReactNode = null;
  if (hasReplies) {
    if (!shouldCollapseReplies) {
      replies = replyList;
    } else {
      replies = (
        <>
          <button
            type="button"
            onClick={() => setShowReplies((visible) => !visible)}
            aria-expanded={showReplies}
            aria-controls={`comment-replies-${comment.id}`}
            className="mt-2 inline-flex min-h-8 items-center gap-1.5 rounded-lg border border-orange-500/20 bg-orange-500/5 px-2.5 py-1.5 text-xs font-semibold text-orange-700 transition-colors hover:border-orange-500/40 hover:bg-orange-500/10 dark:text-orange-300"
          >
            <ChevronDown size={14} className={showReplies ? "rotate-180" : ""} />
            <MessageSquare size={12} />
            <span>
              {showReplies
                ? "Hide replies"
                : replyCount === 1
                  ? "Show 1 reply"
                  : `Show ${replyCount} replies`}
            </span>
          </button>
          {showReplies && replyList}
        </>
      );
    }
  }

  return (
    <div
      id={`comment-${comment.id}`}
      data-comment-id={comment.id}
      data-comment-author={comment.by}
      data-comment-level={level}
      data-reply-count={replyCount}
      className="scroll-mt-36 rounded-xl transition-all duration-300"
    >
      <CommentClient comment={comment} level={level} showScore={showScore} parentId={parentId} storyAuthor={storyAuthor}>
        {replies}
      </CommentClient>
    </div>
  );
});
