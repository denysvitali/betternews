"use client";

import { useEffect, useState, useCallback } from "react";
import { ChevronUp, ChevronDown, MessageCircle, List } from "lucide-react";

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
  const [isVisible, setIsVisible] = useState(true);

  // Scroll to a specific comment by ID
  const scrollToComment = useCallback((commentId: number) => {
    const element = document.getElementById(`comment-${commentId}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
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
        const id = parseInt(element.getAttribute('data-comment-id') || '0');
        const author = element.getAttribute('data-comment-author') || 'Unknown';
        const repliesElement = element.querySelector('[data-reply-count]');
        const replyCount = repliesElement ? parseInt(repliesElement.getAttribute('data-reply-count') || '0') : 0;

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
    setTimeout(extractRootComments, 1000);

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
        attributeFilter: ['data-comment-id', 'data-comment-author']
      });
    }

    // Check scroll position for visibility
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsVisible(scrollY < 200); // Show when near top
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', handleScroll);
    };
  }, [totalComments]);

  // Hide navigation when no root comments or only one comment
  if (rootComments.length <= 1 || !isVisible) {
    return null;
  }

  return (
    <div className="sticky top-20 z-40 mb-4">
      <div className="container mx-auto max-w-5xl sm:max-w-4xl px-4 sm:px-6">
        <div className="bg-white dark:bg-neutral-900 rounded-lg shadow-md border border-neutral-200 dark:border-neutral-800 p-3 sm:p-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            {/* Comment count and position info */}
            <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
              <MessageCircle size={16} className="text-orange-500" />
              <span className="font-medium">
                {totalComments} comments
              </span>
              {rootComments.length > 0 && (
                <>
                  <span>•</span>
                  <span className="text-xs sm:text-sm">
                    {currentIndex + 1} of {rootComments.length} root
                  </span>
                </>
              )}
            </div>

            {/* Navigation controls */}
            <div className="flex items-center gap-2">
              {/* Dropdown for mobile */}
              <div className="sm:hidden">
                <select
                  value={currentIndex}
                  onChange={(e) => {
                    const index = parseInt(e.target.value);
                    setCurrentIndex(index);
                    scrollToComment(rootComments[index].id);
                  }}
                  className="text-xs bg-neutral-100 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded px-2 py-1 text-neutral-700 dark:text-neutral-300"
                >
                  {rootComments.map((comment, index) => (
                    <option key={comment.id} value={index}>
                      {index + 1}. {comment.author}
                      {comment.commentCount && comment.commentCount > 0 && ` (${comment.commentCount})`}
                    </option>
                  ))}
                </select>
              </div>

              {/* Previous/Next buttons */}
              <div className="hidden sm:flex items-center gap-1">
                <button
                  onClick={navigatePrevious}
                  disabled={currentIndex === 0}
                  className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  aria-label="Previous root comment"
                >
                  <ChevronUp size={16} />
                  <span className="hidden md:inline">Prev</span>
                </button>

                <button
                  onClick={navigateNext}
                  disabled={currentIndex === rootComments.length - 1}
                  className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  aria-label="Next root comment"
                >
                  <span className="hidden md:inline">Next</span>
                  <ChevronDown size={16} />
                </button>
              </div>

              {/* Quick jump buttons for desktop */}
              <div className="hidden md:flex items-center gap-1 ml-2">
                <div className="text-xs text-neutral-500 dark:text-neutral-400">Jump to:</div>
                <div className="flex gap-1">
                  {rootComments.slice(0, 5).map((comment, index) => (
                    <button
                      key={comment.id}
                      onClick={() => {
                        setCurrentIndex(index);
                        scrollToComment(comment.id);
                      }}
                      className={`w-6 h-6 text-xs rounded-full border transition-colors ${
                        currentIndex === index
                          ? 'bg-orange-500 text-white border-orange-500'
                          : 'bg-white dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 border-neutral-300 dark:border-neutral-700 hover:border-orange-300 dark:hover:border-orange-700'
                      }`}
                      title={`Jump to comment by ${comment.author}`}
                      aria-label={`Jump to comment ${index + 1}`}
                    >
                      {index + 1}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}