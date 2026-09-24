"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Bookmark, Menu, Search, X, ArrowUpRight } from "lucide-react";
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
      <nav className="sticky top-0 z-50 w-full border-b border-[var(--border-soft)] bg-[color-mix(in_srgb,var(--background)_94%,transparent)] backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:h-20 sm:px-6 lg:px-8">
          <Link href="/" className="group flex shrink-0 items-center gap-2.5" aria-label="BetterNews home">
            <span className="flex h-9 w-9 items-center justify-center rounded-[0.7rem] bg-[var(--accent)] font-serif text-2xl font-bold italic leading-none text-white shadow-[0_3px_0_var(--brand)] transition-transform group-hover:-rotate-6 sm:h-10 sm:w-10">
              b
            </span>
            <span className="leading-none">
              <span className="block text-[18px] font-extrabold tracking-[-0.065em] text-[var(--brand)] dark:text-white sm:text-xl">better<span className="text-[var(--accent)]">news.</span></span>
              <span className="mt-1 hidden font-mono text-[9px] font-medium uppercase tracking-[0.18em] text-neutral-500 lg:block">A clearer look at HN</span>
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
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={isMobileMenuOpen}
              icon={isMobileMenuOpen ? <X size={21} /> : <Menu size={21} />}
              className="h-10 w-10"
            />
          </div>
        </div>

        {isMobileMenuOpen && (
          <div className="border-t border-[var(--border-soft)] bg-[var(--surface)] px-4 py-4 shadow-xl md:hidden">
            <div className="mx-auto grid max-w-7xl grid-cols-2 gap-2">
              {[...NAV_LINKS, { href: "/saved", label: "Saved" }].map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className={`flex items-center justify-between rounded-xl px-4 py-3 text-sm font-semibold ${pathname === href ? "bg-[var(--brand)] text-white dark:bg-[var(--accent)]" : "bg-[var(--muted-surface)] text-neutral-600 dark:text-neutral-300"}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {label}
                  <ArrowUpRight size={14} className="opacity-50" />
                </Link>
              ))}
            </div>
            <DensityToggle className="mx-auto mt-3 flex w-full max-w-7xl justify-center rounded-xl bg-[var(--muted-surface)]" />
          </div>
        )}
      </nav>
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}
