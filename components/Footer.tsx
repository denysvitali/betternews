"use client";

import Link from "next/link";
import { Github, ExternalLink, Heart } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-950">
      <div className="container mx-auto max-w-5xl sm:max-w-4xl px-4 sm:px-6 py-8">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
          {/* Navigation */}
          <div>
            <h3 className="mb-3 text-sm font-semibold text-neutral-900 dark:text-white">
              Navigation
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/"
                  className="text-neutral-600 hover:text-orange-500 dark:text-neutral-400 dark:hover:text-orange-500 transition-colors"
                >
                  Top Stories
                </Link>
              </li>
              <li>
                <Link
                  href="/new"
                  className="text-neutral-600 hover:text-orange-500 dark:text-neutral-400 dark:hover:text-orange-500 transition-colors"
                >
                  New Stories
                </Link>
              </li>
            </ul>
          </div>

          {/* Hacker News */}
          <div>
            <h3 className="mb-3 text-sm font-semibold text-neutral-900 dark:text-white">
              Hacker News
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="https://news.ycombinator.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-neutral-600 hover:text-orange-500 dark:text-neutral-400 dark:hover:text-orange-500 transition-colors"
                >
                  HN Official
                  <ExternalLink size={12} />
                </a>
              </li>
              <li>
                <a
                  href="https://hn.algolia.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-neutral-600 hover:text-orange-500 dark:text-neutral-400 dark:hover:text-orange-500 transition-colors"
                >
                  HN Search
                  <ExternalLink size={12} />
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/HackerNews/API"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-neutral-600 hover:text-orange-500 dark:text-neutral-400 dark:hover:text-orange-500 transition-colors"
                >
                  HN API
                  <ExternalLink size={12} />
                </a>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="mb-3 text-sm font-semibold text-neutral-900 dark:text-white">
              Resources
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="https://news.ycombinator.com/newsguidelines.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-neutral-600 hover:text-orange-500 dark:text-neutral-400 dark:hover:text-orange-500 transition-colors"
                >
                  Guidelines
                  <ExternalLink size={12} />
                </a>
              </li>
              <li>
                <a
                  href="https://news.ycombinator.com/newsfaq.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-neutral-600 hover:text-orange-500 dark:text-neutral-400 dark:hover:text-orange-500 transition-colors"
                >
                  FAQ
                  <ExternalLink size={12} />
                </a>
              </li>
            </ul>
          </div>

          {/* About */}
          <div>
            <h3 className="mb-3 text-sm font-semibold text-neutral-900 dark:text-white">
              About
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="https://github.com/denysvitali/betternews"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-neutral-600 hover:text-orange-500 dark:text-neutral-400 dark:hover:text-orange-500 transition-colors"
                >
                  <Github size={14} />
                  Source Code
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-neutral-200 pt-6 dark:border-neutral-800 sm:flex-row">
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            {currentYear} BetterNews. Not affiliated with Y Combinator.
          </p>
          <p className="inline-flex items-center gap-1 text-xs text-neutral-500 dark:text-neutral-400">
            Made with <Heart size={12} className="text-red-500 fill-red-500" /> for the HN community
          </p>
        </div>
      </div>
    </footer>
  );
}
