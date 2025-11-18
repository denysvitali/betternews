"use client";

import { useComment } from "@/lib/hooks";
import { CommentClient } from "./CommentClient";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";

interface CommentProps {
  id: number;
}

export function Comment({ id }: CommentProps) {
  const { comment, loading, error } = useComment(id);

  if (loading) {
    return (
      <div className="py-2 pl-6 flex items-center gap-2 text-xs text-neutral-400">
        <Loader2 size={12} className="animate-spin" />
        <span>Loading...</span>
      </div>
    );
  }

  if (error || !comment || comment.deleted || comment.dead) {
    return null;
  }

  return (
    <CommentClient comment={comment}>
      {comment.kids && comment.kids.length > 0 && (
        <div className="mt-2">
          {comment.kids.map((kidId) => (
            <Suspense key={kidId} fallback={
              <div className="py-2 pl-6 flex items-center gap-2 text-xs text-neutral-400">
                <Loader2 size={12} className="animate-spin" />
                <span>Loading...</span>
              </div>
            }>
              <Comment id={kidId} />
            </Suspense>
          ))}
        </div>
      )}
    </CommentClient>
  );
}
