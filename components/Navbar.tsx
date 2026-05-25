"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Newspaper, Menu, X, Search, Bookmark } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { SearchModal } from "@/components/SearchBar";
import { IconButton } from "./ui";

const NAV_LINKS = [
  { href: "/", label: "Top" },
  { href: "/new", label: "New" },
  { href: "/best", label: "Best" },
  { href: "/show", label: "Show" },
] as const;

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const pathname = usePathname();

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
      <nav className="sticky top-0 z-50 w-full border-b border-[var(--border-soft)] bg-white/90 backdrop-blur-md dark:bg-neutral-950/90">
        <div className="container mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6">
          <Link href="/" className="flex items-center gap-3 text-xl font-bold">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-orange-500 text-white shadow-sm">
              <Newspaper size={20} />
            </div>
            <div className="flex leading-none">
              <span className="hidden sm:inline">BetterNews</span>
              <span className="sm:hidden">BN</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden items-center gap-1 text-sm font-medium text-neutral-600 dark:text-neutral-400 sm:flex">
            {NAV_LINKS.map(({ href, label }) => {
              const isActive = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  className={`rounded-md px-3 py-2 transition-colors ${
                    isActive
                      ? "bg-neutral-900 text-white dark:bg-white dark:text-neutral-950"
                      : "hover:bg-neutral-100 hover:text-neutral-950 dark:hover:bg-neutral-800 dark:hover:text-white"
                  }`}
                  aria-current={isActive ? "page" : undefined}
                >
                  {label}
                </Link>
              );
            })}
            <Link
              href="/saved"
              className={`flex items-center gap-1 rounded-md px-3 py-2 transition-colors ${
                pathname === "/saved"
                  ? "bg-neutral-900 text-white dark:bg-white dark:text-neutral-950"
                  : "hover:bg-neutral-100 hover:text-neutral-950 dark:hover:bg-neutral-800 dark:hover:text-white"
              }`}
              aria-current={pathname === "/saved" ? "page" : undefined}
            >
              <Bookmark size={14} />
              Saved
            </Link>

            {/* Search Button */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="ml-2 flex items-center gap-2 rounded-md border border-[var(--border-soft)] bg-[var(--surface)] px-3 py-2 text-neutral-600 transition-colors hover:border-orange-300 hover:text-neutral-950 dark:text-neutral-300 dark:hover:text-white"
            >
              <Search size={14} />
              <span className="text-xs">Search</span>
              <kbd className="hidden items-center gap-0.5 rounded border border-[var(--border-soft)] px-1.5 py-0.5 font-mono text-[10px] font-medium text-neutral-500 dark:text-neutral-400 md:inline-flex">
                <span className="text-xs">⌘</span>K
              </kbd>
            </button>

            <ThemeToggle />
          </div>

          {/* Mobile Menu Button */}
          <div className="sm:hidden flex items-center gap-1">
            {/* Mobile Search Button */}
            <IconButton
              variant="ghost"
              onClick={() => setIsSearchOpen(true)}
              aria-label="Search"
              icon={<Search size={20} className="text-neutral-600 dark:text-neutral-400" />}
            />

            <ThemeToggle />

            <IconButton
              variant="ghost"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle mobile menu"
              icon={
                isMobileMenuOpen ? (
                  <X size={24} className="text-neutral-600 dark:text-neutral-400" />
                ) : (
                  <Menu size={24} className="text-neutral-600 dark:text-neutral-400" />
                )
              }
            />
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="sm:hidden border-t border-neutral-200 dark:border-neutral-800 bg-white/95 dark:bg-neutral-950/95 backdrop-blur-md">
              <div className="container mx-auto space-y-2 px-4 py-3">
              {[
                { href: "/", label: "Top Stories" },
                { href: "/new", label: "New Stories" },
                { href: "/best", label: "Best Stories" },
                { href: "/show", label: "Show Stories" },
              ].map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className={`block px-4 py-3 text-base font-medium rounded-md transition-colors ${
                    pathname === href
                      ? "text-orange-500 bg-orange-50 dark:bg-orange-950/20"
                      : "text-neutral-600 dark:text-neutral-400 hover:text-orange-500 dark:hover:text-orange-500 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                  aria-current={pathname === href ? "page" : undefined}
                >
                  {label}
                </Link>
              ))}
              <Link
                href="/saved"
                className={`flex items-center gap-2 px-4 py-3 text-base font-medium rounded-md transition-colors ${
                  pathname === "/saved"
                    ? "text-orange-500 bg-orange-50 dark:bg-orange-950/20"
                    : "text-neutral-600 dark:text-neutral-400 hover:text-orange-500 dark:hover:text-orange-500 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
                aria-current={pathname === "/saved" ? "page" : undefined}
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
