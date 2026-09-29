"use client";

import { useEffect, useState } from "react";
import { ArrowUp, MessageCircle } from "lucide-react";

interface StickyStoryBarProps {
  title: string;
  score: number;
  comments: number;
}

/** Slim bar under the header that keeps the story in view while reading comments. */
export function StickyStoryBar({ title, score, comments }: StickyStoryBarProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const card = document.querySelector(".story-page-card");
    if (!card) return;
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(!entry.isIntersecting && entry.boundingClientRect.bottom < 0),
      { rootMargin: "-64px 0px 0px 0px" }
    );
    observer.observe(card);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="sticky-story-bar" data-visible={visible} aria-hidden={!visible}>
      <button
        type="button"
        tabIndex={visible ? 0 : -1}
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        title="Back to top of story"
      >
        <span className="sticky-story-title">{title}</span>
        <span className="sticky-story-stats">
          <ArrowUp size={12} aria-hidden="true" /> {score}
          <MessageCircle size={12} aria-hidden="true" /> {comments}
        </span>
      </button>
    </div>
  );
}
