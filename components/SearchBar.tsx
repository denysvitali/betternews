"use client";

import { useState, useRef, useEffect } from "react";
import { Search, X, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

interface SearchBarProps {
  onClose?: () => void;
  isOpen?: boolean;
}

export function SearchBar({ onClose, isOpen }: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsLoading(true);
    // Navigate to Algolia HN search
    const searchUrl = `https://hn.algolia.com/?q=${encodeURIComponent(query.trim())}`;
    window.open(searchUrl, "_blank", "noopener,noreferrer");
    setIsLoading(false);
    setQuery("");
    onClose?.();
  };

  return (
    <form onSubmit={handleSearch} className="relative">
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
          placeholder="Search Hacker News..."
          className="w-full rounded-lg border border-neutral-200 bg-white py-2.5 pl-10 pr-10 text-sm text-neutral-900 placeholder-neutral-500 outline-none transition-all focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white dark:placeholder-neutral-400"
        />
        {query && (
          <button
            type="button"
            onClick={() => setQuery("")}
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

      {/* Search hint */}
      <div className="mt-2 text-xs text-neutral-500 dark:text-neutral-400">
        Press <kbd className="rounded bg-neutral-100 px-1.5 py-0.5 font-mono text-[10px] dark:bg-neutral-800">Enter</kbd> to search on HN Algolia
      </div>
    </form>
  );
}

// Search button for navbar
export function SearchButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-neutral-600 transition-colors hover:bg-neutral-100 hover:text-orange-500 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-orange-500"
      aria-label="Search"
    >
      <Search size={18} />
      <span className="hidden md:inline">Search</span>
    </button>
  );
}

// Full search modal
export function SearchModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
      // Open search with Cmd/Ctrl + K
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
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
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh]">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative mx-4 w-full max-w-lg rounded-xl bg-white p-4 shadow-2xl dark:bg-neutral-900 animate-in fade-in slide-in-from-top-4 duration-200">
        <SearchBar onClose={onClose} isOpen={isOpen} />
      </div>
    </div>
  );
}
