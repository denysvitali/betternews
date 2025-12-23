"use client";

import { usePathname } from "next/navigation";
import { Newspaper, Bookmark, Search, User } from "lucide-react";
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
      <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-50 border-t border-neutral-200 dark:border-neutral-800 bg-white/95 dark:bg-neutral-950/95 backdrop-blur-md safe-area-inset-bottom">
        <div className="flex items-center justify-around h-16 pb-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <a
                key={item.href}
                href={item.href}
                className={`relative flex flex-col items-center justify-center flex-1 h-full transition-colors ${
                  isActive
                    ? "text-orange-500"
                    : "text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300"
                }`}
              >
                {item.icon}
                <span className="text-[10px] font-medium mt-0.5">{item.label}</span>
                {item.badgeCount && (
                  <span className="absolute top-1 right-1/4 min-w-[16px] h-4 flex items-center justify-center px-1 bg-orange-500 text-white text-[10px] font-bold rounded-full">
                    {item.badgeCount > 9 ? "9+" : item.badgeCount}
                  </span>
                )}
              </a>
            );
          })}

          {/* Search Button */}
          <button
            onClick={() => setIsSearchOpen(true)}
            className="relative flex flex-col items-center justify-center flex-1 h-full transition-colors text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300"
            aria-label="Search"
          >
            <Search size={20} />
            <span className="text-[10px] font-medium mt-0.5">Search</span>
          </button>
        </div>
      </nav>

      {/* Add padding at bottom for mobile content to not be hidden behind nav */}
      <div className="sm:hidden h-16" />

      {/* Search Modal */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}
