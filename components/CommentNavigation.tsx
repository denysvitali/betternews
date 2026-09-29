"use client";

import { useEffect, useState, useCallback } from "react";
import { ChevronUp, ChevronDown } from "lucide-react";

interface CommentNavProps {
  totalComments: number;
  storyId: number;
}

interface RootComment {
  id: number;
  author: string;
  index: number;
  commentCount?: number;
}

export function CommentNavigation({ totalComments, storyId }: CommentNavProps) {
  const [rootComments, setRootComments] = useState<RootComment[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  void storyId;

  // Scroll to a specific comment by ID with offset for sticky header
  const scrollToComment = useCallback((commentId: number) => {
    const element = document.getElementById(`comment-${commentId}`);
    if (element) {
      // Leave room for the shared sticky header.
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({
        top: elementPosition - offset,
        behavior: 'smooth'
      });
      // Add highlight effect
      element.classList.add('ring-2', 'ring-orange-400', 'ring-opacity-75', 'dark:ring-orange-500');
      setTimeout(() => {
        element.classList.remove('ring-2', 'ring-orange-400', 'ring-opacity-75', 'dark:ring-orange-500');
      }, 2000);
    }
  }, []);

  // Navigate to previous root comment
  const navigatePrevious = useCallback(() => {
    if (currentIndex > 0) {
      const newIndex = currentIndex - 1;
      setCurrentIndex(newIndex);
      scrollToComment(rootComments[newIndex].id);
    }
  }, [currentIndex, rootComments, scrollToComment]);

  // Navigate to next root comment
  const navigateNext = useCallback(() => {
    if (currentIndex < rootComments.length - 1) {
      const newIndex = currentIndex + 1;
      setCurrentIndex(newIndex);
      scrollToComment(rootComments[newIndex].id);
    }
  }, [currentIndex, rootComments, scrollToComment]);

  // Extract root comments from the DOM
  useEffect(() => {
    const extractRootComments = () => {
      const commentElements = document.querySelectorAll('[data-comment-level="0"]');
      const comments: RootComment[] = [];

      commentElements.forEach((element, index) => {
        const id = Number.parseInt(element.getAttribute('data-comment-id') || '0', 10);
        const author = element.getAttribute('data-comment-author') || 'Unknown';
        const replyCount = Number.parseInt(element.getAttribute('data-reply-count') || '0', 10);

        if (id > 0) {
          comments.push({
            id,
            author,
            index,
            commentCount: replyCount
          });
        }
      });

      setRootComments(comments);
    };

    // Initial extraction
    const extractionTimer = setTimeout(extractRootComments, 1000);

    // Listen for DOM changes (when comments load)
    const observer = new MutationObserver(() => {
      extractRootComments();
    });

    const commentsContainer = document.getElementById('comments-container');
    if (commentsContainer) {
      observer.observe(commentsContainer, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['data-comment-id', 'data-comment-author', 'data-reply-count']
      });
    }

    return () => {
      clearTimeout(extractionTimer);
      observer.disconnect();
    };
  }, [totalComments]);

  // Hide navigation when no root comments or only one comment
  if (rootComments.length <= 1) {
    return null;
  }

  return (
    <div className="thread-navigation">
      <label className="discussion-select">
        <span>Thread</span>
        <select aria-label="Jump to thread" value={Math.min(currentIndex, rootComments.length - 1)} onChange={(event) => {
          const index = Number(event.target.value);
          setCurrentIndex(index);
          scrollToComment(rootComments[index].id);
        }}>
          {rootComments.map((comment, index) => (
            <option key={comment.id} value={index}>{index + 1}. {comment.author}</option>
          ))}
        </select>
      </label>
      <button type="button" onClick={navigatePrevious} disabled={currentIndex === 0} aria-label="Previous root comment"><ChevronUp size={15} /></button>
      <button type="button" onClick={navigateNext} disabled={currentIndex >= rootComments.length - 1} aria-label="Next root comment"><ChevronDown size={15} /></button>
    </div>
  );
}
