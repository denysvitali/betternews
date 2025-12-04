import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
// @ts-expect-error - psl types are not resolving correctly
import psl from "psl";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getDomain(url: string): string {
  try {
    const hostname = new URL(url).hostname;
    const parsed = psl.get(hostname);
    return parsed || hostname;
  } catch {
    return "";
  }
}

/**
 * Calculate estimated reading time for text content
 * Average reading speed: 200-250 words per minute
 */
export function getReadingTime(text: string): string {
  // Strip HTML tags
  const plainText = text.replace(/<[^>]*>/g, "");
  // Count words
  const wordCount = plainText.trim().split(/\s+/).filter(Boolean).length;
  // Calculate minutes (using 200 wpm for technical content)
  const minutes = Math.ceil(wordCount / 200);

  if (minutes < 1) return "< 1 min read";
  if (minutes === 1) return "1 min read";
  return `${minutes} min read`;
}

/**
 * Format a Unix timestamp to a full date string
 */
export function formatFullDate(timestamp: number): string {
  const date = new Date(timestamp * 1000);
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZoneName: "short",
  });
}

/**
 * Converts Hacker News URLs to relative bttrne.ws paths
 * Examples:
 * - https://news.ycombinator.com/item?id=45913663 -> /story/45913663
 * - http://news.ycombinator.com/item?id=45913663&foo=bar -> /story/45913663
 * - https://www.news.ycombinator.com/item?id=45913663 -> /story/45913663
 * - https://news.ycombinator.com/user?id=user -> [unchanged, not a story]
 */
export function convertHNUrlToRelative(url: string): string | null {
  try {
    // If it's already a relative path, return as-is
    if (url.startsWith('/')) {
      return url;
    }

    const parsedUrl = new URL(url);
    const hostname = parsedUrl.hostname.toLowerCase();

    // Check if this is a Hacker News domain
    const isHNDomain = hostname === 'news.ycombinator.com' ||
                      hostname === 'www.news.ycombinator.com' ||
                      hostname === 'hacker-news.firebaseio.com';

    if (!isHNDomain) {
      return null; // Not an HN URL
    }

    // Handle Firebase API URLs (convert to story links)
    if (hostname === 'hacker-news.firebaseio.com') {
      const pathMatch = parsedUrl.pathname.match(/\/v0\/item\/(\d+)\.json$/);
      if (pathMatch) {
        return `/story/${pathMatch[1]}`;
      }
      return null;
    }

    // Handle news.ycombinator.com URLs
    const searchParams = new URLSearchParams(parsedUrl.search);
    const id = searchParams.get('id');

    if (id && /^\d+$/.test(id)) {
      return `/story/${id}`;
    }

    return null; // No valid ID found
  } catch {
    return null; // Invalid URL format
  }
}
