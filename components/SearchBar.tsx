"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Search, X, Loader2, ExternalLink, Clock, MessageSquare, Bookmark, Share2 } from "lucide-react";
import Link from "next/link";
import { HNItem, HN_API_BASE } from "@/lib/types";
import { useDebounce } from "@/lib/hooks";
import { useBookmarks } from "@/lib/bookmarks";
import { TimeAgo } from "./TimeAgo";
import { Card, Button } from "./ui";
import { getDomain } from "@/lib/utils";

interface SearchResult {
  id: number;
  title: string;
  url?: string;
  by?: string;
  time: number;
  score?: number;
  type: string;
  text?: string;
  descendants?: number;
}

interface SearchBarProps {
  onClose?: () => void;
  isOpen?: boolean;
}

export function SearchBar({ onClose, isOpen }: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const debouncedQuery = useDebounce(query, 300);
  const { isBookmarked, toggleBookmark } = useBookmarks();

  // Focus input when opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Search when query changes
  const performSearch = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim() || searchQuery.length < 2) {
      setResults([]);
      setShowResults(false);
      return;
    }

    setIsLoading(true);
    try {
      // Fetch top 100 stories to search through
      const res = await fetch(`${HN_API_BASE}/topstories.json`);
      const storyIds: number[] = await res.json();

      // Fetch first 50 stories for quick search
      const storyPromises = storyIds.slice(0, 50).map(id =>
        fetch(`${HN_API_BASE}/item/${id}.json`).then(r => r.json())
      );

      const stories: HNItem[] = await Promise.all(storyPromises);

      // Filter stories that match the query
      const searchLower = searchQuery.toLowerCase();
      const matchingStories = stories
        .filter(story =>
          story &&
          story.title &&
          (story.title.toLowerCase().includes(searchLower) ||
           story.by?.toLowerCase().includes(searchLower))
        )
        .slice(0, 8)
        .map(story => ({
          id: story.id,
          title: story.title || "",
          url: story.url,
          by: story.by,
          time: story.time,
          score: story.score,
          type: story.type,
          text: story.text,
          descendants: story.descendants,
        }));

      setResults(matchingStories);
      setShowResults(true);
    } catch (error) {
      console.error("Search failed:", error);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    performSearch(debouncedQuery);
  }, [debouncedQuery, performSearch]);

  const handleExternalSearch = () => {
    if (!query.trim()) return;
    const searchUrl = `https://hn.algolia.com/?q=${encodeURIComponent(query.trim())}`;
    window.open(searchUrl, "_blank", "noopener,noreferrer");
    setQuery("");
    onClose?.();
  };

  const handleResultClick = () => {
    setQuery("");
    setResults([]);
    setShowResults(false);
    onClose?.();
  };

  return (
    <div className="relative">
      <form onSubmit={(e) => { e.preventDefault(); handleExternalSearch(); }} className="relative">
        <div className="relative flex items-center">
          <Search
            size={18}
            className="absolute left-3 text-neutral-400 dark:text-neutral-500"
          />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search stories..."
            className="w-full rounded-lg border border-neutral-200 bg-white py-2.5 pl-10 pr-10 text-sm text-neutral-900 placeholder-neutral-500 outline-none transition-all focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white dark:placeholder-neutral-400"
          />
          {query && !isLoading && (
            <button
              type="button"
              onClick={() => { setQuery(""); setResults([]); setShowResults(false); }}
              className="absolute right-3 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300"
            >
              <X size={16} />
            </button>
          )}
          {isLoading && (
            <Loader2
              size={16}
              className="absolute right-3 animate-spin text-orange-500"
            />
          )}
        </div>
      </form>

      {/* Search Results */}
      {showResults && results.length > 0 && (
        <Card className="mt-2 max-h-96 overflow-y-auto shadow-lg" padding="none">
          {results.map((result) => {
            const domain = result.url ? getDomain(result.url) : null;
            const bookmarked = isBookmarked(result.id);
            // Strip HTML from text preview
            const textPreview = result.text
              ? result.text.replace(/<[^>]*>/g, "").substring(0, 120) + (result.text.length > 120 ? "..." : "")
              : null;

            return (
              <div
                key={result.id}
                className="flex flex-col gap-2 border-b border-neutral-100 p-3 transition-colors hover:bg-neutral-50 last:border-0 dark:border-neutral-700 dark:hover:bg-neutral-700"
              >
                <div className="flex items-start gap-2">
                  <Link
                    href={`/story/${result.id}`}
                    onClick={handleResultClick}
                    className="flex-1 min-w-0"
                  >
                    <span className="text-sm font-medium text-neutral-900 dark:text-white line-clamp-2 leading-snug">
                      {result.title}
                    </span>
                  </Link>
                </div>

                {/* Metadata row */}
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-neutral-500 dark:text-neutral-400">
                  {result.score && <span>{result.score} points</span>}
                  <span className="text-neutral-300 dark:text-neutral-600">·</span>
                  {result.by && <span>by {result.by}</span>}
                  <span className="text-neutral-300 dark:text-neutral-600">·</span>
                  <span className="flex items-center gap-1">
                    <Clock size={10} />
                    <TimeAgo timestamp={result.time} />
                  </span>
                  {result.descendants && (
                    <>
                      <span className="text-neutral-300 dark:text-neutral-600">·</span>
                      <span className="flex items-center gap-1">
                        <MessageSquare size={10} />
                        {result.descendants}
                      </span>
                    </>
                  )}
                  {domain && (
                    <>
                      <span className="text-neutral-300 dark:text-neutral-600">·</span>
                      <span className="font-mono text-neutral-600 dark:text-neutral-500 truncate max-w-[120px]">{domain}</span>
                    </>
                  )}
                </div>

                {/* Text preview for stories with text content */}
                {textPreview && (
                  <p className="text-xs text-neutral-600 dark:text-neutral-400 line-clamp-2 leading-relaxed">
                    {textPreview}
                  </p>
                )}

                {/* Quick actions */}
                <div className="flex items-center gap-2 mt-1">
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      toggleBookmark({
                        id: result.id,
                        title: result.title,
                        url: result.url,
                        by: result.by,
                        time: result.time,
                        score: result.score,
                      });
                    }}
                    className={`flex items-center gap-1 text-xs px-2 py-1 rounded transition-colors ${
                      bookmarked
                        ? "bg-orange-100 text-orange-600 dark:bg-orange-950/30 dark:text-orange-500"
                        : "bg-neutral-100 text-neutral-500 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-400 dark:hover:bg-neutral-700"
                    }`}
                    aria-label={bookmarked ? "Remove bookmark" : "Add bookmark"}
                  >
                    <Bookmark size={12} className={bookmarked ? "fill-current" : ""} />
                    {bookmarked ? "Saved" : "Save"}
                  </button>

                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      if (navigator.share && result.url) {
                        navigator.share({
                          title: result.title,
                          url: result.url,
                        }).catch(() => {});
                      }
                    }}
                    className="flex items-center gap-1 text-xs px-2 py-1 rounded bg-neutral-100 text-neutral-500 hover:bg-neutral-200 transition-colors dark:bg-neutral-800 dark:text-neutral-400 dark:hover:bg-neutral-700"
                    aria-label="Share"
                  >
                    <Share2 size={12} />
                    Share
                  </button>

                  <Link
                    href={`/story/${result.id}`}
                    onClick={handleResultClick}
                    className="ml-auto text-xs text-orange-600 hover:text-orange-700 dark:text-orange-500 dark:hover:text-orange-400 font-medium"
                  >
                    View →
                  </Link>
                </div>
              </div>
            );
          })}

          {/* Algolia fallback */}
          <button
            onClick={handleExternalSearch}
            className="flex w-full items-center justify-center gap-2 border-t border-neutral-200 p-3 text-sm text-orange-600 transition-colors hover:bg-orange-50 dark:border-neutral-700 dark:text-orange-500 dark:hover:bg-orange-950/20"
          >
            <ExternalLink size={14} />
            <span>Search more on HN Algolia</span>
          </button>
        </Card>
      )}

      {/* No results */}
      {showResults && query.length >= 2 && results.length === 0 && !isLoading && (
        <Card className="mt-2 text-center" padding="md">
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            No stories found for &quot;{query}&quot;
          </p>
          <button
            onClick={handleExternalSearch}
            className="mt-2 flex items-center justify-center gap-2 text-sm text-orange-600 transition-colors hover:text-orange-700 dark:text-orange-500 dark:hover:text-orange-400 w-full"
          >
            <ExternalLink size={14} />
            <span>Try searching on HN Algolia</span>
          </button>
        </Card>
      )}

      {/* Search hints */}
      {!showResults && (
        <div className="mt-2 text-xs text-neutral-500 dark:text-neutral-400">
          <span>Type to search top stories. Press </span>
          <kbd className="rounded bg-neutral-100 px-1.5 py-0.5 font-mono text-[10px] dark:bg-neutral-800">Enter</kbd>
          <span> for full HN Algolia search.</span>
        </div>
      )}
    </div>
  );
}

// Search button for navbar
export function SearchButton({ onClick }: { onClick: () => void }) {
  return (
    <Button onClick={onClick} variant="ghost" aria-label="Search">
      <Search size={18} />
      <span className="hidden md:inline">Search</span>
    </Button>
  );
}

// Full search modal
export function SearchModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh]">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <Card className="relative mx-4 w-full max-w-lg shadow-2xl animate-in fade-in slide-in-from-top-4 duration-200" padding="md">
        <SearchBar onClose={onClose} isOpen={isOpen} />
      </Card>
    </div>
  );
}
