import Link from "next/link";
import { ArrowUpRight, Github } from "lucide-react";

const footerLinks = [
  { href: "/", label: "Top" },
  { href: "/new", label: "New" },
  { href: "/best", label: "Best" },
  { href: "https://news.ycombinator.com", label: "HN original", external: true },
] as const;

export function Footer() {
  return (
    <footer className="mt-12 border-t border-[var(--border-soft)]">
      <div className="container mx-auto flex max-w-6xl flex-col gap-6 px-6 py-8 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-bold tracking-[-0.02em] text-[var(--brand)] dark:text-white">BetterNews</p>
          <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">The Hacker News signal, thoughtfully presented.</p>
        </div>
        <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
          {footerLinks.map((item) =>
            "external" in item && item.external ? (
              <a
                key={item.href}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs font-medium text-neutral-500 hover:text-orange-600 dark:text-neutral-400"
              >
                {item.label}
                <ArrowUpRight size={12} />
              </a>
            ) : (
              <Link key={item.href} href={item.href} className="text-xs font-medium text-neutral-500 hover:text-orange-600 dark:text-neutral-400">
                {item.label}
              </Link>
            )
          )}
          <a
            href="https://github.com/denysvitali/betternews"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="BetterNews source code"
            className="text-neutral-400 transition-colors hover:text-orange-600"
          >
            <Github size={17} />
          </a>
        </div>
      </div>
    </footer>
  );
}
