/**
 * Shared types for Hacker News API data
 */

export type ItemType = "job" | "story" | "comment" | "poll" | "pollopt";

/**
 * Base HN Item - used for API responses
 */
export interface HNItem {
  id: number;
  deleted?: boolean;
  type: ItemType;
  by?: string;
  time: number;
  text?: string;
  dead?: boolean;
  parent?: number;
  poll?: number;
  kids?: number[];
  url?: string;
  score?: number;
  title?: string;
  parts?: number[];
  descendants?: number;
}

/**
 * HN User profile
 */
export interface HNUser {
  id: string;
  created: number;
  karma: number;
  about?: string;
  submitted?: number[];
}

/**
 * HN Item with recursively loaded children
 */
export interface HNItemRecursive extends Omit<HNItem, "kids"> {
  kids?: HNItemRecursive[];
}

/**
 * Story type - a subset of HNItem for story display
 */
export interface Story extends HNItem {
  title: string;
  by: string;
  score: number;
}

/**
 * Comment type - for comment display
 */
export interface Comment extends HNItem {
  by: string;
  parent: number;
}

/**
 * Type guard for checking if an item is a story
 */
export function isStory(item: HNItem): item is Story {
  return item.type === "story" && !!item.title;
}

/**
 * Type guard for checking if an item is a comment
 */
export function isComment(item: HNItem): item is Comment {
  return item.type === "comment";
}

/**
 * API Configuration
 */
export const HN_API_BASE = "https://hacker-news.firebaseio.com/v0";

export const CACHE_TIMES = {
  STORIES: 60, // 1 minute
  USER: 300, // 5 minutes
  ITEM: 60, // 1 minute
} as const;

export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 30,
  DEFAULT_USER_ITEMS: 20,
} as const;
