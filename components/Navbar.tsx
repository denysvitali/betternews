"use client";

import Link from "next/link";
import { useState } from "react";
import { Newspaper, Menu, X } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
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
        <div className="hidden sm:flex items-center gap-6 text-sm font-medium text-neutral-600 dark:text-neutral-400">
          <Link href="/" className="hover:text-orange-500 transition-colors">
            Top
          </Link>
          <Link href="/new" className="hover:text-orange-500 transition-colors">
            New
          </Link>
          <ThemeToggle />
        </div>

        {/* Mobile Menu Button */}
        <div className="sm:hidden flex items-center gap-2">
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
          </div>
        </div>
      )}
    </nav>
  );
}
