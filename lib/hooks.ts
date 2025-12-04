"use client";

import { useState, useEffect, useCallback } from "react";
import { HNItem, HNUser, HN_API_BASE, PAGINATION } from "./types";

// ============================================
// Utility Hooks
// ============================================

/**
 * Debounce a value by a specified delay
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

/**
 * Track scroll position and visibility threshold
 * Uses requestAnimationFrame for performance optimization
 */
export function useScrollVisibility(threshold: number = 400): boolean {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    let rafId: number;
    let ticking = false;

    const toggleVisibility = () => {
      if (!ticking) {
        rafId = requestAnimationFrame(() => {
          setIsVisible(window.scrollY > threshold);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", toggleVisibility, { passive: true });
    return () => {
      window.removeEventListener("scroll", toggleVisibility);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [threshold]);

  return isVisible;
}

/**
 * Track reading progress as percentage (0-100)
 * Uses requestAnimationFrame for performance
 */
export function useReadingProgress(): number {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let rafId: number;
    let ticking = false;

    const updateProgress = () => {
      if (!ticking) {
        rafId = requestAnimationFrame(() => {
          const windowHeight = window.innerHeight;
          const documentHeight = document.documentElement.scrollHeight;
          const scrollTop = window.scrollY;
          const scrollable = documentHeight - windowHeight;

          if (scrollable > 0) {
            setProgress(Math.min(100, Math.round((scrollTop / scrollable) * 100)));
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", updateProgress, { passive: true });
    // Initial calculation
    updateProgress();

    return () => {
      window.removeEventListener("scroll", updateProgress);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  return progress;
}

// ============================================
// Data Fetching Hooks
// ============================================

// Re-export types for backward compatibility
export type { HNItem as Story, HNItem as Comment, HNUser as User } from "./types";

/**
 * Generic fetch hook to reduce duplication
 */
function useFetch<T>(
  fetchFn: () => Promise<T>,
  deps: unknown[],
  options?: { skip?: boolean }
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(!options?.skip);
  const [error, setError] = useState<Error | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const refetch = useCallback(() => {
    setRefreshKey((prev) => prev + 1);
  }, []);

  useEffect(() => {
    if (options?.skip) {
      setLoading(false);
      return;
    }

    let isMounted = true;

    async function doFetch() {
      try {
        setLoading(true);
        setError(null);
        const result = await fetchFn();
        if (isMounted) {
          setData(result);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err : new Error(String(err)));
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    doFetch();

    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, refreshKey, options?.skip]);

  return { data, loading, error, refetch };
}

/**
 * Fetch a paginated list of stories
 */
async function fetchPaginatedStories(
  endpoint: "topstories" | "newstories" | "beststories" | "showstories",
  page: number,
  pageSize: number = PAGINATION.DEFAULT_PAGE_SIZE
): Promise<HNItem[]> {
  const res = await fetch(`${HN_API_BASE}/${endpoint}.json`);
  const storyIds: number[] = await res.json();

  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const pageIds = storyIds.slice(startIndex, endIndex);

  const storyPromises = pageIds.map((id) =>
    fetch(`${HN_API_BASE}/item/${id}.json`).then((r) => r.json())
  );

  const fetchedStories = await Promise.all(storyPromises);
  return fetchedStories.filter((s) => s && s.type === "story");
}

/**
 * Hook for fetching top stories
 */
export function useTopStories(page: number = 1) {
  const { data, loading, error, refetch } = useFetch(
    () => fetchPaginatedStories("topstories", page),
    [page]
  );

  return { stories: data ?? [], loading, error, refetch };
}

/**
 * Hook for fetching new stories
 */
export function useNewStories(page: number = 1) {
  const { data, loading, error, refetch } = useFetch(
    () => fetchPaginatedStories("newstories", page),
    [page]
  );

  return { stories: data ?? [], loading, error, refetch };
}

/**
 * Hook for fetching best stories
 */
export function useBestStories(page: number = 1) {
  const { data, loading, error, refetch } = useFetch(
    () => fetchPaginatedStories("beststories", page),
    [page]
  );

  return { stories: data ?? [], loading, error, refetch };
}

/**
 * Hook for fetching show stories
 */
export function useShowStories(page: number = 1) {
  const { data, loading, error, refetch } = useFetch(
    () => fetchPaginatedStories("showstories", page),
    [page]
  );

  return { stories: data ?? [], loading, error, refetch };
}

/**
 * Hook for fetching a single story
 */
export function useStory(id: number) {
  const { data, loading, error } = useFetch(
    async () => {
      const res = await fetch(`${HN_API_BASE}/item/${id}.json`);
      return res.json() as Promise<HNItem>;
    },
    [id],
    { skip: !id }
  );

  return { story: data, loading, error };
}

/**
 * Hook for fetching a comment
 */
export function useComment(id: number) {
  const { data, loading, error } = useFetch(
    async () => {
      const res = await fetch(`${HN_API_BASE}/item/${id}.json`);
      return res.json() as Promise<HNItem>;
    },
    [id],
    { skip: !id }
  );

  return { comment: data, loading, error };
}

/**
 * Hook for fetching user profile
 */
export function useUser(username: string) {
  const { data, loading, error } = useFetch(
    async () => {
      const res = await fetch(`${HN_API_BASE}/user/${username}.json`);
      return res.json() as Promise<HNUser>;
    },
    [username],
    { skip: !username }
  );

  return { user: data, loading, error };
}

/**
 * Hook for fetching user items (stories/comments)
 */
export function useUserItems(
  itemIds: number[] | undefined,
  limit: number = PAGINATION.DEFAULT_USER_ITEMS
) {
  const idsKey = itemIds?.slice(0, limit).join(",") ?? "";

  const { data, loading, error } = useFetch(
    async () => {
      if (!itemIds || itemIds.length === 0) {
        return [];
      }

      const limitedIds = itemIds.slice(0, limit);
      const itemPromises = limitedIds.map((id) =>
        fetch(`${HN_API_BASE}/item/${id}.json`).then((r) => r.json())
      );

      const fetchedItems = await Promise.all(itemPromises);
      return fetchedItems.filter(
        (item) => item && !item.deleted && !item.dead
      ) as HNItem[];
    },
    [idsKey, limit],
    { skip: !idsKey }
  );

  return { items: data ?? [], loading, error };
}
