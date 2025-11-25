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
