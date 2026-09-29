"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Bookmark, SlidersHorizontal, Search, X } from "lucide-react";
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
      <nav aria-label="Main navigation" className="site-nav sticky top-0 z-50 w-full border-b border-[var(--border-soft)] bg-[color-mix(in_srgb,var(--surface)_94%,transparent)] backdrop-blur-xl">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-4 sm:h-16 sm:px-6 lg:px-8">
          <Link href="/" className="group flex shrink-0 items-center gap-2.5" aria-label="BetterNews home">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--accent)] font-serif text-2xl font-bold italic leading-none text-white transition-transform group-hover:-rotate-6">
              b
            </span>
            <span className="leading-none">
              <span className="block text-[18px] font-extrabold tracking-[-0.065em] text-[var(--brand)] dark:text-white sm:text-xl">better<span className="text-[var(--accent)]">news.</span></span>
            </span>
          </Link>

          <div className="hidden h-full items-center gap-7 md:flex">
            <div className="flex h-full items-center gap-6">
              {NAV_LINKS.map(({ href, label }) => {
                const isActive = pathname === href;
                return (
                  <Link
                    key={href}
                    href={href}
                    className={`relative flex h-full items-center border-b-2 pt-0.5 text-[13px] font-semibold transition-colors ${
                      isActive
                        ? "border-[var(--accent)] text-[var(--brand)] dark:text-white"
                        : "border-transparent text-neutral-500 hover:text-[var(--brand)] dark:text-neutral-400 dark:hover:text-white"
                    }`}
                    aria-current={isActive ? "page" : undefined}
                  >
                    {label}
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="hidden items-center gap-2 md:flex">
            <Link
              href="/saved"
              aria-label="Saved stories"
              className={`flex h-10 w-10 items-center justify-center rounded-xl border transition-colors ${pathname === "/saved" ? "border-[var(--accent)] bg-[var(--accent)] text-white" : "border-[var(--border-soft)] bg-[var(--surface)] text-neutral-500 hover:text-[var(--accent)]"}`}
            >
              <Bookmark size={16} />
            </Link>
            <button
              onClick={() => setIsSearchOpen(true)}
              className="flex h-10 items-center gap-2.5 rounded-xl border border-[var(--border-soft)] bg-[var(--surface)] px-3.5 text-xs font-medium text-neutral-500 transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)] dark:text-neutral-300"
            >
              <Search size={15} />
              <span className="hidden lg:inline">Search stories</span>
              <kbd className="hidden rounded bg-[var(--muted-surface)] px-1.5 py-0.5 font-mono text-[10px] lg:inline">⌘ K</kbd>
            </button>
            <DensityToggle className="hidden h-10 rounded-xl bg-[var(--surface)] xl:inline-flex" />
            <ThemeToggle />
          </div>

          <div className="flex items-center gap-1 md:hidden">
            <IconButton variant="ghost" onClick={() => setIsSearchOpen(true)} aria-label="Search" icon={<Search size={19} />} className="h-10 w-10" />
            <ThemeToggle />
            <IconButton
              variant="ghost"
              onClick={() => setIsMobileMenuOpen((open) => !open)}
              aria-label={isMobileMenuOpen ? "Close display settings" : "Display settings"}
              aria-expanded={isMobileMenuOpen}
              icon={isMobileMenuOpen ? <X size={21} /> : <SlidersHorizontal size={19} />}
              className="h-10 w-10"
            />
          </div>
        </div>

        {isMobileMenuOpen && (
          <div className="border-t border-[var(--border-soft)] bg-[var(--surface)] px-4 py-4 shadow-xl md:hidden">
            <DensityToggle className="mx-auto flex w-full max-w-6xl justify-center rounded-xl bg-[var(--muted-surface)]" />
          </div>
        )}
      </nav>
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}
