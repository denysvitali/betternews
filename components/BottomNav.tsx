"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Newspaper, Bookmark, Search } from "lucide-react";
import { useBookmarks } from "@/lib/bookmarks";
import { SearchModal } from "@/components/SearchBar";
import { useState } from "react";

interface NavItem {
  href: string;
  icon: React.ReactNode;
  label: string;
  badgeCount?: number;
}

export function BottomNav() {
  const pathname = usePathname();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { bookmarks } = useBookmarks();

  const navItems: NavItem[] = [
    {
      href: "/",
      icon: <Newspaper size={20} />,
      label: "Home",
    },
    {
      href: "/saved",
      icon: <Bookmark size={20} />,
      label: "Saved",
      badgeCount: bookmarks.length > 0 ? bookmarks.length : undefined,
    },
  ];

  // Only show on mobile screens
  return (
    <>
      <nav className="fixed bottom-3 left-3 right-3 z-50 rounded-2xl border border-[var(--border-soft)] bg-[color-mix(in_srgb,var(--surface)_92%,transparent)] p-1.5 shadow-[0_12px_36px_rgba(23,61,50,0.18)] backdrop-blur-xl sm:hidden">
        <div className="flex h-14 items-center justify-around">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                className={`relative flex h-full flex-1 flex-col items-center justify-center rounded-xl transition-colors ${
                  isActive
                    ? "bg-[var(--muted-surface)] text-orange-600 dark:text-orange-400"
                    : "text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300"
                }`}
              >
                <span className="flex h-7 min-w-12 items-center justify-center">
                  {item.icon}
                </span>
                <span className={`mt-0.5 text-[10px] ${isActive ? "font-bold" : "font-medium"}`}>
                  {item.label}
                </span>
                {item.badgeCount && (
                  <span className="absolute top-1 right-1/4 min-w-[16px] h-4 flex items-center justify-center px-1 bg-orange-500 text-white text-[10px] font-bold rounded-full">
                    {item.badgeCount > 9 ? "9+" : item.badgeCount}
                  </span>
                )}
              </Link>
            );
          })}

          {/* Search Button */}
          <button
            onClick={() => setIsSearchOpen(true)}
                  className="relative flex h-full flex-1 flex-col items-center justify-center rounded-xl text-neutral-500 transition-colors hover:bg-[var(--muted-surface)] hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-300"
            aria-label="Search"
          >
            <span className="flex h-7 min-w-12 items-center justify-center"><Search size={20} /></span>
            <span className="text-[10px] font-medium mt-0.5">Search</span>
          </button>
        </div>
      </nav>

      {/* Add padding at bottom for mobile content to not be hidden behind nav */}
      <div className="h-20 sm:hidden" />

      {/* Search Modal */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}
