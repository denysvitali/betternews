"use client";

import { useEffect, useCallback, useState } from "react";

interface KeyboardNavigationProps {
  enabled?: boolean;
}

export function KeyboardNavigation({ enabled = true }: KeyboardNavigationProps) {
  const [currentCommentIndex, setCurrentCommentIndex] = useState(-1);
  const [showHelp, setShowHelp] = useState(false);

  const getAllComments = useCallback(() => {
    return Array.from(document.querySelectorAll('[data-comment-id]'));
  }, []);

  const highlightComment = useCallback((element: Element | null, scroll = true) => {
    // Remove previous highlights
    document.querySelectorAll('.keyboard-nav-highlight').forEach(el => {
      el.classList.remove('keyboard-nav-highlight', 'ring-2', 'ring-orange-400', 'dark:ring-orange-500', 'ring-opacity-75', 'rounded-lg');
    });

    if (element) {
      element.classList.add('keyboard-nav-highlight', 'ring-2', 'ring-orange-400', 'dark:ring-orange-500', 'ring-opacity-75', 'rounded-lg');
      if (scroll) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, []);

  const navigateToComment = useCallback((direction: 'next' | 'prev') => {
    const comments = getAllComments();
    if (comments.length === 0) return;

    let newIndex = currentCommentIndex;
    if (direction === 'next') {
      newIndex = Math.min(currentCommentIndex + 1, comments.length - 1);
    } else {
      newIndex = Math.max(currentCommentIndex - 1, 0);
    }

    if (newIndex !== currentCommentIndex || currentCommentIndex === -1) {
      setCurrentCommentIndex(newIndex);
      highlightComment(comments[newIndex]);
    }
  }, [currentCommentIndex, getAllComments, highlightComment]);

  const navigateToNextRoot = useCallback(() => {
    const rootComments = Array.from(document.querySelectorAll('[data-comment-level="0"]'));
    if (rootComments.length === 0) return;

    const currentRoot = rootComments.findIndex((el, idx) => {
      const allComments = getAllComments();
      const currentEl = allComments[currentCommentIndex];
      if (!currentEl) return idx === 0;

      // Check if current comment is this root or a child of it
      const commentId = currentEl.getAttribute('data-comment-id');
      return el.getAttribute('data-comment-id') === commentId || el.contains(currentEl);
    });

    const nextRootIdx = Math.min(currentRoot + 1, rootComments.length - 1);
    const nextRoot = rootComments[nextRootIdx];

    if (nextRoot) {
      const allComments = getAllComments();
      const newIndex = allComments.indexOf(nextRoot);
      setCurrentCommentIndex(newIndex);
      highlightComment(nextRoot);
    }
  }, [currentCommentIndex, getAllComments, highlightComment]);

  const navigateToPrevRoot = useCallback(() => {
    const rootComments = Array.from(document.querySelectorAll('[data-comment-level="0"]'));
    if (rootComments.length === 0) return;

    const currentRoot = rootComments.findIndex((el) => {
      const allComments = getAllComments();
      const currentEl = allComments[currentCommentIndex];
      if (!currentEl) return false;

      const commentId = currentEl.getAttribute('data-comment-id');
      return el.getAttribute('data-comment-id') === commentId || el.contains(currentEl);
    });

    const prevRootIdx = Math.max(currentRoot - 1, 0);
    const prevRoot = rootComments[prevRootIdx];

    if (prevRoot) {
      const allComments = getAllComments();
      const newIndex = allComments.indexOf(prevRoot);
      setCurrentCommentIndex(newIndex);
      highlightComment(prevRoot);
    }
  }, [currentCommentIndex, getAllComments, highlightComment]);

  const toggleCurrentComment = useCallback(() => {
    const comments = getAllComments();
    const currentComment = comments[currentCommentIndex];
    if (!currentComment) return;

    // Find the collapse button within this comment
    const collapseBtn = currentComment.querySelector('button[title="Collapse"], button[title="Expand"]');
    if (collapseBtn) {
      (collapseBtn as HTMLButtonElement).click();
    }
  }, [currentCommentIndex, getAllComments]);

  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      switch (e.key.toLowerCase()) {
        case 'j':
          e.preventDefault();
          navigateToComment('next');
          break;
        case 'k':
          e.preventDefault();
          navigateToComment('prev');
          break;
        case 'n':
          e.preventDefault();
          navigateToNextRoot();
          break;
        case 'p':
          e.preventDefault();
          navigateToPrevRoot();
          break;
        case ' ':
          e.preventDefault();
          toggleCurrentComment();
          break;
        case '?':
          e.preventDefault();
          setShowHelp(prev => !prev);
          break;
        case 'escape':
          setShowHelp(false);
          highlightComment(null);
          setCurrentCommentIndex(-1);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [enabled, navigateToComment, navigateToNextRoot, navigateToPrevRoot, toggleCurrentComment, highlightComment]);

  if (!enabled) return null;

  return (
    <>
      {/* Keyboard shortcut hint */}
      <div className="fixed bottom-4 right-4 z-50 hidden sm:block">
        <button
          onClick={() => setShowHelp(prev => !prev)}
          className="flex items-center gap-1.5 rounded-lg bg-neutral-900/90 dark:bg-white/90 px-3 py-2 text-xs font-medium text-white dark:text-neutral-900 shadow-lg backdrop-blur-sm transition-all hover:scale-105"
          title="Keyboard shortcuts"
        >
          <kbd className="rounded bg-neutral-700 dark:bg-neutral-300 px-1.5 py-0.5 text-[10px]">?</kbd>
          <span>Shortcuts</span>
        </button>
      </div>

      {/* Help modal */}
      {showHelp && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          onClick={() => setShowHelp(false)}
        >
          <div
            className="mx-4 max-w-sm rounded-xl bg-white p-6 shadow-2xl dark:bg-neutral-900"
            onClick={e => e.stopPropagation()}
          >
            <h3 className="mb-4 text-lg font-bold text-neutral-900 dark:text-white">
              Keyboard Shortcuts
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-neutral-600 dark:text-neutral-400">Next comment</span>
                <kbd className="rounded bg-neutral-100 px-2 py-1 font-mono text-xs dark:bg-neutral-800">j</kbd>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-neutral-600 dark:text-neutral-400">Previous comment</span>
                <kbd className="rounded bg-neutral-100 px-2 py-1 font-mono text-xs dark:bg-neutral-800">k</kbd>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-neutral-600 dark:text-neutral-400">Next root comment</span>
                <kbd className="rounded bg-neutral-100 px-2 py-1 font-mono text-xs dark:bg-neutral-800">n</kbd>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-neutral-600 dark:text-neutral-400">Previous root comment</span>
                <kbd className="rounded bg-neutral-100 px-2 py-1 font-mono text-xs dark:bg-neutral-800">p</kbd>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-neutral-600 dark:text-neutral-400">Collapse/Expand</span>
                <kbd className="rounded bg-neutral-100 px-2 py-1 font-mono text-xs dark:bg-neutral-800">space</kbd>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-neutral-600 dark:text-neutral-400">Close/Clear</span>
                <kbd className="rounded bg-neutral-100 px-2 py-1 font-mono text-xs dark:bg-neutral-800">esc</kbd>
              </div>
            </div>
            <button
              onClick={() => setShowHelp(false)}
              className="mt-6 w-full rounded-lg bg-orange-500 py-2 text-sm font-medium text-white transition-colors hover:bg-orange-600"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </>
  );
}
