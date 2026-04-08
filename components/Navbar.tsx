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
      <nav className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md dark:bg-neutral-950/80 dark:border-neutral-800">
        <div className="container mx-auto flex h-18 items-center justify-between px-4 py-3 sm:px-6">
          <Link href="/" className="flex items-center gap-3 text-xl font-bold sm:text-2xl">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-400 via-orange-500 to-amber-600 text-white shadow-[0_10px_24px_rgba(245,121,32,0.32)]">
              <Newspaper size={20} />
            </div>
            <div className="flex flex-col leading-none">
              <span className="hidden sm:inline tracking-[-0.04em]">BetterNews</span>
              <span className="hidden font-mono text-[10px] uppercase tracking-[0.3em] text-neutral-500 dark:text-neutral-400 sm:inline">
                Signal over noise
              </span>
              <span className="tracking-[-0.04em] sm:hidden">BN</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="glass-panel hidden items-center gap-2 rounded-full border border-[var(--border-soft)] px-2 py-2 text-sm font-medium text-neutral-600 shadow-[0_8px_24px_rgba(15,23,42,0.05)] dark:text-neutral-400 sm:flex">
            {NAV_LINKS.map(({ href, label }) => {
              const isActive = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  className={`rounded-full px-3 py-2 transition-all ${
                    isActive
                      ? "bg-neutral-950 text-white shadow-sm dark:bg-white dark:text-neutral-950"
                      : "hover:bg-white/70 hover:text-orange-600 dark:hover:bg-white/8"
                  }`}
                  aria-current={isActive ? "page" : undefined}
                >
                  {label}
                </Link>
              );
            })}
            <Link
              href="/saved"
              className={`flex items-center gap-1 rounded-full px-3 py-2 transition-all ${
                pathname === "/saved"
                  ? "bg-neutral-950 text-white shadow-sm dark:bg-white dark:text-neutral-950"
                  : "hover:bg-white/70 hover:text-orange-600 dark:hover:bg-white/8"
              }`}
              aria-current={pathname === "/saved" ? "page" : undefined}
            >
              <Bookmark size={14} />
              Saved
            </Link>

            {/* Search Button */}
            <button
              onClick={() => setIsSearchOpen(true)}
            className="glass-panel flex items-center gap-2 rounded-full border border-[var(--border-soft)] px-3 py-2 text-neutral-600 transition-colors hover:text-orange-600 dark:text-neutral-300"
            >
              <Search size={14} />
              <span className="text-xs">Search</span>
              <kbd className="hidden items-center gap-0.5 rounded-full border border-[var(--border-soft)] px-2 py-0.5 font-mono text-[10px] font-medium text-neutral-500 dark:text-neutral-400 md:inline-flex">
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
