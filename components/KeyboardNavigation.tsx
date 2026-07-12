"use client";

import { useEffect, useCallback, useState } from "react";
import { Card, Button } from "./ui";

interface KeyboardNavigationProps {
  enabled?: boolean;
}

const SHORTCUTS = [
  { key: "j", label: "Next comment" },
  { key: "k", label: "Previous comment" },
  { key: "n", label: "Next root comment" },
  { key: "p", label: "Previous root comment" },
  { key: "space", label: "Collapse / Expand" },
  { key: "esc", label: "Close / Clear" },
] as const;

// Tailwind classes applied to the currently keyboard-focused comment.
const HIGHLIGHT_CLASSES = [
  "keyboard-nav-highlight",
  "ring-2",
  "ring-orange-400",
  "dark:ring-orange-500",
  "ring-opacity-75",
  "rounded-lg",
] as const;

export function KeyboardNavigation({ enabled = true }: KeyboardNavigationProps) {
  const [currentCommentIndex, setCurrentCommentIndex] = useState(-1);
  const [showHelp, setShowHelp] = useState(false);

  const getAllComments = useCallback(() => {
    return Array.from(document.querySelectorAll('[data-comment-id]'));
  }, []);

  const highlightComment = useCallback((element: Element | null, scroll = true) => {
    // Remove previous highlights
    document.querySelectorAll('.keyboard-nav-highlight').forEach(el => {
      el.classList.remove(...HIGHLIGHT_CLASSES);
    });

    if (element) {
      element.classList.add(...HIGHLIGHT_CLASSES);
      if (scroll) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, []);

  const navigateToComment = useCallback((direction: 'next' | 'prev') => {
    const comments = getAllComments();
    if (comments.length === 0) return;

    const delta = direction === 'next' ? 1 : -1;
    const newIndex = Math.min(
      Math.max(currentCommentIndex + delta, 0),
      comments.length - 1
    );

    if (newIndex !== currentCommentIndex || currentCommentIndex === -1) {
      setCurrentCommentIndex(newIndex);
      highlightComment(comments[newIndex]);
    }
  }, [currentCommentIndex, getAllComments, highlightComment]);

  const navigateToRoot = useCallback((direction: 'next' | 'prev') => {
    const rootComments = Array.from(document.querySelectorAll('[data-comment-level="0"]'));
    if (rootComments.length === 0) return;

    const allComments = getAllComments();
    const currentEl = allComments[currentCommentIndex];

    // Find the root that currently contains (or is) the focused comment.
    const currentRoot = rootComments.findIndex((el) => {
      if (!currentEl) return false;

      const commentId = currentEl.getAttribute('data-comment-id');
      return el.getAttribute('data-comment-id') === commentId || el.contains(currentEl);
    });

    const delta = direction === 'next' ? 1 : -1;
    const startingRoot = currentRoot === -1
      ? direction === "next" ? -1 : 0
      : currentRoot;
    const targetIdx = Math.min(
      Math.max(startingRoot + delta, 0),
      rootComments.length - 1
    );
    const targetRoot = rootComments[targetIdx];

    if (targetRoot) {
      setCurrentCommentIndex(allComments.indexOf(targetRoot));
      highlightComment(targetRoot);
    }
  }, [currentCommentIndex, getAllComments, highlightComment]);

  const toggleCurrentComment = useCallback(() => {
    const comments = getAllComments();
    const currentComment = comments[currentCommentIndex];
    if (!currentComment) return;

    // Find the collapse button within this comment
    const collapseBtn = currentComment.querySelector(
      'button[aria-label="Collapse comment"], button[aria-label="Expand comment"]'
    );
    if (collapseBtn) {
      (collapseBtn as HTMLButtonElement).click();
    }
  }, [currentCommentIndex, getAllComments]);

  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger while the user is typing or interacting with controls.
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        e.target instanceof HTMLSelectElement ||
        (e.target instanceof HTMLElement &&
          (e.target.isContentEditable || e.target.closest("button, a")))
      ) {
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
          navigateToRoot('next');
          break;
        case 'p':
          e.preventDefault();
          navigateToRoot('prev');
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
  }, [enabled, navigateToComment, navigateToRoot, toggleCurrentComment, highlightComment]);

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
          <Card
            className="mx-4 max-w-sm shadow-2xl"
            padding="lg"
            onClick={e => e.stopPropagation()}
          >
            <h3 className="mb-4 text-lg font-bold text-neutral-900 dark:text-white">
              Keyboard Shortcuts
            </h3>
            <div className="space-y-3 text-sm">
              {SHORTCUTS.map(({ key, label }) => (
                <div key={key} className="flex items-center justify-between">
                  <span className="text-neutral-600 dark:text-neutral-400">{label}</span>
                  <kbd className="rounded bg-neutral-100 px-2 py-1 font-mono text-xs dark:bg-neutral-800">{key}</kbd>
                </div>
              ))}
            </div>
            <Button
              variant="primary"
              onClick={() => setShowHelp(false)}
              className="mt-6 w-full"
            >
              Got it
            </Button>
          </Card>
        </div>
      )}
    </>
  );
}
