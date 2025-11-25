"use client";

import { useComment, Comment as CommentType } from "@/lib/hooks";
import { CommentClient } from "./CommentClient";
import { Suspense } from "react";
import { CommentSkeleton } from "./CommentSkeleton";

interface CommentProps {
  id: number;
  data?: CommentType;
  level?: number;
}

export function Comment({ id, data, level = 0 }: CommentProps) {
  const { comment: fetchedComment, loading: fetching, error: fetchError } = useComment(data ? 0 : id);

  const comment = data || fetchedComment;
  const loading = data ? false : fetching;
  const error = data ? null : fetchError;

  if (loading) {
    return <CommentSkeleton level={level} />;
  }

  if (error || !comment || comment.deleted || comment.dead) {
    return null;
  }

  return (
    <div
      id={`comment-${comment.id}`}
      data-comment-id={comment.id}
      data-comment-author={comment.by}
      data-comment-level={level}
      className="transition-all duration-300"
    >
      <CommentClient comment={comment} level={level}>
        {comment.kids && comment.kids.length > 0 && (
          <div className="mt-2">
            {comment.kids.map((kid) => {
              const kidId = typeof kid === 'number' ? kid : kid.id;
              const kidData = typeof kid === 'object' ? kid : undefined;

              return (
                <Suspense key={kidId} fallback={<CommentSkeleton level={level + 1} />}>
                  <Comment id={kidId} data={kidData} level={level + 1} />
                </Suspense>
              );
            })}
          </div>
        )}
      </CommentClient>
    </div>
  );
}
