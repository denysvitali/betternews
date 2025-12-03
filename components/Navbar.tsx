"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Newspaper, Menu, X, Search, Bookmark } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { SearchModal } from "@/components/SearchBar";

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Keyboard shortcut for search (Cmd/Ctrl + K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <>
      <nav className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md dark:bg-neutral-950/80 dark:border-neutral-800">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl sm:text-2xl">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-500 text-white">
              <Newspaper size={20} />
            </div>
            <span className="hidden sm:inline">BetterNews</span>
            <span className="sm:hidden">BN</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden sm:flex items-center gap-4 text-sm font-medium text-neutral-600 dark:text-neutral-400">
            <Link href="/" className="px-2 py-1 hover:text-orange-500 transition-colors">
              Top
            </Link>
            <Link href="/new" className="px-2 py-1 hover:text-orange-500 transition-colors">
              New
            </Link>
            <Link href="/saved" className="flex items-center gap-1 px-2 py-1 hover:text-orange-500 transition-colors">
              <Bookmark size={14} />
              Saved
            </Link>

            {/* Search Button */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="flex items-center gap-2 rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-1.5 text-neutral-500 transition-colors hover:border-neutral-300 hover:bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-800 dark:hover:border-neutral-600 dark:hover:bg-neutral-700"
            >
              <Search size={14} />
              <span className="text-xs">Search</span>
              <kbd className="hidden md:inline-flex items-center gap-0.5 rounded border border-neutral-300 bg-neutral-100 px-1.5 py-0.5 text-[10px] font-medium text-neutral-500 dark:border-neutral-600 dark:bg-neutral-700 dark:text-neutral-400">
                <span className="text-xs">⌘</span>K
              </kbd>
            </button>

            <ThemeToggle />
          </div>

          {/* Mobile Menu Button */}
          <div className="sm:hidden flex items-center gap-1">
            {/* Mobile Search Button */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="flex items-center justify-center w-10 h-10 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
              aria-label="Search"
            >
              <Search size={20} className="text-neutral-600 dark:text-neutral-400" />
            </button>

            <ThemeToggle />

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="flex items-center justify-center w-10 h-10 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? (
                <X size={24} className="text-neutral-600 dark:text-neutral-400" />
              ) : (
                <Menu size={24} className="text-neutral-600 dark:text-neutral-400" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="sm:hidden border-t border-neutral-200 dark:border-neutral-800 bg-white/95 dark:bg-neutral-950/95 backdrop-blur-md">
            <div className="container mx-auto px-4 py-3 space-y-2">
              <Link
                href="/"
                className="block px-4 py-3 text-base font-medium text-neutral-600 dark:text-neutral-400 hover:text-orange-500 dark:hover:text-orange-500 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-md transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Top Stories
              </Link>
              <Link
                href="/new"
                className="block px-4 py-3 text-base font-medium text-neutral-600 dark:text-neutral-400 hover:text-orange-500 dark:hover:text-orange-500 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-md transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                New Stories
              </Link>
              <Link
                href="/saved"
                className="flex items-center gap-2 px-4 py-3 text-base font-medium text-neutral-600 dark:text-neutral-400 hover:text-orange-500 dark:hover:text-orange-500 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-md transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Bookmark size={16} />
                Saved Stories
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* Search Modal */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}
