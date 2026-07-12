"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import {
  HNItem,
  HNUser,
  HN_API_BASE,
  CACHE_TIMES,
  PAGINATION,
  isLiveItem,
} from "./types";

// Re-export types for consumers that historically imported them from hooks.
export type { HNItem as Story, HNItem as Comment, HNUser as User } from "./types";

// ============================================
// In-memory request cache
// ============================================

interface CacheEntry<T> {
  data: T;
  expiresAt: number;
}

const cache = new Map<string, CacheEntry<unknown>>();
const inFlight = new Map<string, Promise<unknown>>();
const MAX_CACHE_ENTRIES = 500;
const MAX_CONCURRENT_REQUESTS = 8;
let activeRequests = 0;
const queuedRequests: Array<() => void> = [];

function setCacheEntry<T>(url: string, data: T, expiresAt: number): void {
  if (cache.size >= MAX_CACHE_ENTRIES && !cache.has(url)) {
    const now = Date.now();
    for (const [key, entry] of cache) {
      if (entry.expiresAt <= now || cache.size >= MAX_CACHE_ENTRIES) {
        cache.delete(key);
      }
      if (cache.size < MAX_CACHE_ENTRIES) break;
    }
  }
  cache.set(url, { data, expiresAt });
}

function enqueueRequest<T>(request: () => Promise<T>): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const start = () => {
      activeRequests += 1;
      Promise.resolve()
        .then(request)
        .then(resolve, reject)
        .finally(() => {
          activeRequests -= 1;
          const next = queuedRequests.shift();
          if (next) next();
        });
    };

    if (activeRequests < MAX_CONCURRENT_REQUESTS) {
      start();
    } else {
      queuedRequests.push(start);
    }
  });
}

async function cachedFetch<T>(
  url: string,
  ttlSeconds: number,
  force = false
): Promise<T> {
  const now = Date.now();
  const entry = cache.get(url);
  if (!force && entry && entry.expiresAt > now) {
    return entry.data as T;
  }

  const existingRequest = inFlight.get(url);
  if (existingRequest) {
    return existingRequest as Promise<T>;
  }

  const request = enqueueRequest(() =>
    fetch(url, force ? { cache: "no-store" } : undefined).then(async (res) => {
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data: T = await res.json();
      setCacheEntry(url, data, Date.now() + ttlSeconds * 1000);
      return data;
    })
  )
    .finally(() => {
      if (inFlight.get(url) === request) {
        inFlight.delete(url);
      }
    });

  inFlight.set(url, request);
  return request;
}

/**
 * Fetch a single HN item, using the in-memory cache.
 */
function fetchItem(id: number, force = false): Promise<HNItem | null> {
  return cachedFetch<HNItem | null>(
    `${HN_API_BASE}/item/${id}.json`,
    CACHE_TIMES.ITEM,
    force
  );
}

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

/**
 * Generic fetch hook to reduce duplication
 */
function useFetch<T>(
  fetchFn: (force?: boolean) => Promise<T>,
  deps: unknown[],
  options?: { skip?: boolean }
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(!options?.skip);
  const [error, setError] = useState<Error | null>(null);
  const fetchFnRef = useRef(fetchFn);
  const requestIdRef = useRef(0);
  fetchFnRef.current = fetchFn;

  const runFetch = useCallback(async (force: boolean) => {
    const requestId = ++requestIdRef.current;
    setLoading(true);
    setError(null);

    try {
      const result = await fetchFnRef.current(force);
      if (requestId === requestIdRef.current) {
        setData(result);
        setLoading(false);
      }
    } catch (err) {
      if (requestId === requestIdRef.current) {
        setError(err instanceof Error ? err : new Error(String(err)));
        setLoading(false);
      }
      throw err;
    }
  }, []);

  const refetch = useCallback(() => runFetch(true), [runFetch]);

  useEffect(() => {
    if (options?.skip) {
      requestIdRef.current += 1;
      setLoading(false);
      setData(null);
      setError(null);
      return;
    }

    void runFetch(false).catch(() => {
      // The hook exposes the error state; initial loads should not produce an
      // unhandled promise rejection.
    });
    // `fetchFn` is stored in a ref so changing its closure does not retrigger
    // the request outside the explicitly supplied dependency list.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, options?.skip, runFetch]);

  return { data, loading, error, refetch };
}

/**
 * Fetch a paginated list of stories
 */
async function fetchPaginatedStories(
  endpoint: "topstories" | "newstories" | "beststories" | "showstories",
  page: number,
  pageSize: number = PAGINATION.DEFAULT_PAGE_SIZE,
  force = false
): Promise<HNItem[]> {
  const storyIds = await cachedFetch<number[]>(
    `${HN_API_BASE}/${endpoint}.json`,
    CACHE_TIMES.STORIES,
    force
  );

  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const pageIds = storyIds.slice(startIndex, endIndex);

  const results = await Promise.allSettled(
    pageIds.map((id) => fetchItem(id, force))
  );
  return results.flatMap((result) =>
    result.status === "fulfilled" &&
    isLiveItem(result.value) &&
    result.value.type === "story"
      ? [result.value]
      : []
  );
}

/**
 * Hook for fetching top stories
 */
export function useTopStories(page: number = 1) {
  const { data, loading, error, refetch } = useFetch(
    (force) => fetchPaginatedStories("topstories", page, undefined, force),
    [page]
  );

  return { stories: data ?? [], loading, error, refetch };
}

/**
 * Hook for fetching new stories
 */
export function useNewStories(page: number = 1) {
  const { data, loading, error, refetch } = useFetch(
    (force) => fetchPaginatedStories("newstories", page, undefined, force),
    [page]
  );

  return { stories: data ?? [], loading, error, refetch };
}

/**
 * Hook for fetching best stories
 */
export function useBestStories(page: number = 1) {
  const { data, loading, error, refetch } = useFetch(
    (force) => fetchPaginatedStories("beststories", page, undefined, force),
    [page]
  );

  return { stories: data ?? [], loading, error, refetch };
}

/**
 * Hook for fetching show stories
 */
export function useShowStories(page: number = 1) {
  const { data, loading, error, refetch } = useFetch(
    (force) => fetchPaginatedStories("showstories", page, undefined, force),
    [page]
  );

  return { stories: data ?? [], loading, error, refetch };
}

/**
 * Hook for fetching a single story
 */
export function useStory(id: number) {
  const { data, loading, error } = useFetch((force) => fetchItem(id, force), [id], {
    skip: !id,
  });

  return { story: data, loading, error };
}

/**
 * Hook for fetching a comment
 */
export function useComment(id: number) {
  const { data, loading, error } = useFetch((force) => fetchItem(id, force), [id], {
    skip: !id,
  });

  return { comment: data, loading, error };
}

/** Fetch child timestamps so comment sorting reflects creation time. */
export function useCommentTimes(ids: number[], enabled: boolean) {
  const idsKey = enabled ? ids.join(",") : "";
  const { data, loading, error } = useFetch(
    async (force) => {
      const results = await Promise.allSettled(
        ids.map((id) => fetchItem(id, force))
      );
      return new Map(
        results.flatMap((result) =>
          result.status === "fulfilled" && result.value
            ? [[result.value.id, result.value.time] as const]
            : []
        )
      );
    },
    [idsKey, enabled],
    { skip: !enabled || !idsKey }
  );

  return { times: data ?? new Map<number, number>(), loading, error };
}

/**
 * Hook for fetching user profile
 */
export function useUser(username: string) {
  const { data, loading, error } = useFetch(
    (force) =>
      cachedFetch<HNUser>(
        `${HN_API_BASE}/user/${username}.json`,
        CACHE_TIMES.USER,
        force
      ),
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
    async (force) => {
      if (!itemIds || itemIds.length === 0) {
        return [];
      }

      const limitedIds = itemIds.slice(0, limit);
      const results = await Promise.allSettled(
        limitedIds.map((id) => fetchItem(id, force))
      );
      return results.flatMap((result) =>
        result.status === "fulfilled" && isLiveItem(result.value)
          ? [result.value]
          : []
      );
    },
    [idsKey, limit],
    { skip: !idsKey }
  );

  return { items: data ?? [], loading, error };
}
