"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Bookmark, Menu, Search, X } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { SearchModal } from "@/components/SearchBar";
import { DensityToggle } from "@/components/DensityToggle";
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

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === "k") {
        event.preventDefault();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <>
      <nav className="sticky top-0 z-50 w-full border-b border-[var(--border-soft)] bg-[color-mix(in_srgb,var(--background)_88%,transparent)] backdrop-blur-xl">
        <div className="container mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:h-[72px] sm:px-6">
          <Link href="/" className="group flex items-center gap-3" aria-label="BetterNews home">
            <span className="flex h-9 w-9 items-center justify-center rounded-[0.7rem] bg-[var(--brand)] font-mono text-xs font-bold text-white shadow-[inset_0_-2px_0_rgba(0,0,0,0.18)] transition-transform group-hover:-rotate-3 dark:bg-orange-500 sm:h-10 sm:w-10 sm:rounded-xl sm:text-sm">
              BN
            </span>
            <span className="leading-none">
              <span className="block text-[15px] font-bold tracking-[-0.03em] text-[var(--brand)] dark:text-white">BetterNews</span>
              <span className="mt-1 hidden font-mono text-[9px] uppercase tracking-[0.16em] text-neutral-500 sm:block">signal over noise</span>
            </span>
          </Link>

          <div className="hidden items-center gap-3 sm:flex">
            <div className="flex items-center rounded-full border border-[var(--border-soft)] bg-[var(--surface)] p-1 shadow-sm">
              {NAV_LINKS.map(({ href, label }) => {
                const isActive = pathname === href;
                return (
                  <Link
                    key={href}
                    href={href}
                    className={`rounded-full px-3.5 py-2 text-xs font-semibold transition-all ${
                      isActive
                        ? "bg-[var(--brand)] text-white shadow-sm dark:bg-orange-500"
                        : "text-neutral-500 hover:text-neutral-950 dark:text-neutral-400 dark:hover:text-white"
                    }`}
                    aria-current={isActive ? "page" : undefined}
                  >
                    {label}
                  </Link>
                );
              })}
            </div>
            <Link
              href="/saved"
              aria-label="Saved stories"
              className={`flex h-10 w-10 items-center justify-center rounded-full border border-[var(--border-soft)] transition-colors ${pathname === "/saved" ? "bg-orange-500 text-white" : "bg-[var(--surface)] text-neutral-500 hover:text-orange-600"}`}
            >
              <Bookmark size={16} />
            </Link>
            <button
              onClick={() => setIsSearchOpen(true)}
              className="flex h-10 items-center gap-2 rounded-full border border-[var(--border-soft)] bg-[var(--surface)] px-3.5 text-xs font-medium text-neutral-500 shadow-sm transition-colors hover:border-orange-300 hover:text-orange-600 dark:text-neutral-300"
            >
              <Search size={15} />
              Search
              <kbd className="rounded bg-[var(--muted-surface)] px-1.5 py-0.5 font-mono text-[9px]">⌘K</kbd>
            </button>
            <DensityToggle className="h-10 bg-[var(--surface)]" />
            <ThemeToggle />
          </div>

          <div className="flex items-center gap-1 sm:hidden">
            <IconButton variant="ghost" onClick={() => setIsSearchOpen(true)} aria-label="Search" icon={<Search size={19} />} />
            <ThemeToggle />
            <IconButton
              variant="ghost"
              onClick={() => setIsMobileMenuOpen((open) => !open)}
              aria-label="Toggle mobile menu"
              icon={isMobileMenuOpen ? <X size={21} /> : <Menu size={21} />}
            />
          </div>
        </div>

        {isMobileMenuOpen && (
          <div className="border-t border-[var(--border-soft)] bg-[var(--surface)] px-4 py-3 sm:hidden">
            <div className="grid grid-cols-2 gap-2">
              {[...NAV_LINKS, { href: "/saved", label: "Saved" }].map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className={`rounded-xl px-4 py-3 text-sm font-semibold ${pathname === href ? "bg-[var(--brand)] text-white dark:bg-orange-500" : "bg-[var(--muted-surface)] text-neutral-600 dark:text-neutral-300"}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {label}
                </Link>
              ))}
            </div>
            <DensityToggle className="mt-2 w-full justify-center bg-[var(--muted-surface)]" />
          </div>
        )}
      </nav>
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}
