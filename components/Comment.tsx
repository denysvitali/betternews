"use client";

import { useComment, Comment as CommentType } from "@/lib/hooks";
import { CommentClient } from "./CommentClient";
import { Suspense } from "react";
import { CommentSkeleton } from "./CommentSkeleton";

interface CommentProps {
  id: number;
  data?: CommentType;
}

export function Comment({ id, data }: CommentProps) {
  const { comment: fetchedComment, loading: fetching, error: fetchError } = useComment(data ? 0 : id);

  const comment = data || fetchedComment;
  const loading = data ? false : fetching;
  const error = data ? null : fetchError;

  if (loading) {
    return <CommentSkeleton />;
  }

  if (error || !comment || comment.deleted || comment.dead) {
    return null;
  }

  return (
    <CommentClient comment={comment}>
      {comment.kids && comment.kids.length > 0 && (
        <div className="mt-2">
          {comment.kids.map((kid) => {
            const kidId = typeof kid === 'number' ? kid : kid.id;
            const kidData = typeof kid === 'object' ? kid : undefined;

            return (
              <Suspense key={kidId} fallback={<CommentSkeleton />}>
                <Comment id={kidId} data={kidData} />
              </Suspense>
            );
          })}
        </div>
      )}
    </CommentClient>
  );
}
