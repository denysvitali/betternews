"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Bookmark, Clock3, Flame, Lightbulb, Sparkles } from "lucide-react";
import { useBookmarks } from "@/lib/bookmarks";

const navItems = [
  { href: "/", icon: Flame, label: "Top" },
  { href: "/new", icon: Clock3, label: "New" },
  { href: "/best", icon: Sparkles, label: "Best" },
  { href: "/show", icon: Lightbulb, label: "Show" },
  { href: "/saved", icon: Bookmark, label: "Saved" },
] as const;

export function BottomNav() {
  const pathname = usePathname();
  const { bookmarks } = useBookmarks();

  return (
      <nav aria-label="Mobile navigation" className="fixed inset-x-0 bottom-0 z-50 border-t border-[var(--border-soft)] bg-[color-mix(in_srgb,var(--surface)_96%,transparent)] px-2 pt-1.5 pb-[max(0.5rem,env(safe-area-inset-bottom))] shadow-[0_-8px_28px_rgba(20,44,35,0.08)] backdrop-blur-xl md:hidden">
        <div className="mx-auto flex max-w-lg items-center justify-around gap-1">
          {navItems.map(({ href, icon: Icon, label }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                aria-current={isActive ? "page" : undefined}
                className={`relative flex min-h-12 min-w-0 flex-1 flex-col items-center justify-center gap-0.5 rounded-xl text-[10px] font-semibold transition-colors ${isActive ? "bg-[var(--muted-surface)] text-[var(--accent)]" : "text-neutral-500 hover:bg-[var(--muted-surface)] dark:text-neutral-400"}`}
              >
                <Icon size={18} strokeWidth={isActive ? 2.4 : 1.8} />
                <span>{label}</span>
                {href === "/saved" && bookmarks.length > 0 && (
                  <span className="absolute right-2 top-1 flex h-3.5 min-w-3.5 items-center justify-center rounded-full bg-[var(--accent)] px-0.5 text-[9px] leading-none text-white">
                    {bookmarks.length > 9 ? "9+" : bookmarks.length}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      </nav>
  );
}
