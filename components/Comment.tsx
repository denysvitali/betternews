"use client";

import { useComment } from "@/lib/hooks";
import { CommentClient } from "./CommentClient";
import { Suspense } from "react";
import { CommentSkeleton } from "./CommentSkeleton";

interface CommentProps {
  id: number;
  level?: number;
}

export function Comment({ id, level = 0 }: CommentProps) {
  const { comment, loading, error } = useComment(id);

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
            {comment.kids.map((kidId) => (
              <Suspense key={kidId} fallback={<CommentSkeleton level={level + 1} />}>
                <Comment id={kidId} level={level + 1} />
              </Suspense>
            ))}
          </div>
        )}
      </CommentClient>
    </div>
  );
}
