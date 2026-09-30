"use client";

import { useState, useEffect, useSyncExternalStore, useCallback, createContext, useContext, ReactNode } from "react";
import { useRef } from "react";

interface BookmarkedStory {
  id: number;
  title: string;
  url?: string;
  by?: string;
  time: number;
  score?: number;
  bookmarkedAt: number;
}

interface BookmarksContextType {
  bookmarks: BookmarkedStory[];
  isBookmarked: (id: number) => boolean;
  addBookmark: (story: Omit<BookmarkedStory, "bookmarkedAt">) => void;
  removeBookmark: (id: number) => void;
  toggleBookmark: (story: Omit<BookmarkedStory, "bookmarkedAt">) => void;
  clearBookmarks: () => void;
}

const EMPTY_BOOKMARKS: BookmarkedStory[] = [];
const subscribeToHydration = () => () => {};

const STORAGE_KEY = "betternews_bookmarks";

function getStoredBookmarks(): BookmarkedStory[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function setStoredBookmarks(bookmarks: BookmarkedStory[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(bookmarks));
  } catch (error) {
    console.error("Failed to save bookmarks:", error);
  }
}

const BookmarksContext = createContext<BookmarksContextType | null>(null);

export function BookmarksProvider({ children }: { children: ReactNode }) {
  const [bookmarks, setBookmarks] = useState<BookmarkedStory[]>(getStoredBookmarks);
  const hasPersistedInitialValue = useRef(false);
  // Device storage is exposed after hydration, so saved pages match their server HTML.
  const hydrated = useSyncExternalStore(subscribeToHydration, () => true, () => false);
  const visibleBookmarks = hydrated ? bookmarks : EMPTY_BOOKMARKS;

  // Save bookmarks to localStorage when they change
  useEffect(() => {
    if (!hasPersistedInitialValue.current) {
      hasPersistedInitialValue.current = true;
      return;
    }

    setStoredBookmarks(bookmarks);
  }, [bookmarks]);

  const isBookmarked = useCallback(
    (id: number) => visibleBookmarks.some((b) => b.id === id),
    [visibleBookmarks]
  );

  const addBookmark = useCallback(
    (story: Omit<BookmarkedStory, "bookmarkedAt">) => {
      setBookmarks((prev) => {
        if (prev.some((b) => b.id === story.id)) return prev;
        return [{ ...story, bookmarkedAt: Date.now() }, ...prev];
      });
    },
    []
  );

  const removeBookmark = useCallback((id: number) => {
    setBookmarks((prev) => prev.filter((b) => b.id !== id));
  }, []);

  const toggleBookmark = useCallback(
    (story: Omit<BookmarkedStory, "bookmarkedAt">) => {
      if (isBookmarked(story.id)) {
        removeBookmark(story.id);
      } else {
        addBookmark(story);
      }
    },
    [isBookmarked, addBookmark, removeBookmark]
  );

  const clearBookmarks = useCallback(() => {
    setBookmarks([]);
  }, []);

  return (
    <BookmarksContext.Provider
      value={{
        bookmarks: visibleBookmarks,
        isBookmarked,
        addBookmark,
        removeBookmark,
        toggleBookmark,
        clearBookmarks,
      }}
    >
      {children}
    </BookmarksContext.Provider>
  );
}

export function useBookmarks(): BookmarksContextType {
  const context = useContext(BookmarksContext);
  if (!context) {
    throw new Error("useBookmarks must be used within a BookmarksProvider");
  }
  return context;
}
