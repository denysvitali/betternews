import {
  HNItem,
  HNUser,
  HNItemRecursive,
  HN_API_BASE,
  CACHE_TIMES,
  PAGINATION,
  isLiveItem,
} from "./types";

// Re-export types for backward compatibility
export type { HNItem, HNUser, HNItemRecursive } from "./types";

type StoryFeed = "topstories" | "newstories" | "beststories" | "showstories";

/**
 * Slice a list of ids to a single page.
 */
function paginate<T>(ids: T[], page: number, limit: number): T[] {
  const start = (page - 1) * limit;
  return ids.slice(start, start + limit);
}

/**
 * Fetch a single item from the HN API
 */
export async function getItem(id: number): Promise<HNItem | null> {
  const res = await fetch(`${HN_API_BASE}/item/${id}.json`, {
    next: { revalidate: CACHE_TIMES.ITEM },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch item ${id}: ${res.status}`);
  }

  return res.json();
}

/**
 * Fetch multiple items in parallel, dropping any that are deleted or dead.
 */
export async function getItems(ids: number[]): Promise<HNItem[]> {
  try {
    const results = await Promise.allSettled(ids.map((id) => getItem(id)));
    return results.flatMap((result) =>
      result.status === "fulfilled" && isLiveItem(result.value)
        ? [result.value]
        : []
    );
  } catch (error) {
    console.error("Failed to fetch items:", error);
    return [];
  }
}

/**
 * Fetch a paginated story feed by endpoint.
 */
async function getStoryFeed(
  feed: StoryFeed,
  page: number,
  limit: number
): Promise<HNItem[]> {
  try {
    const res = await fetch(`${HN_API_BASE}/${feed}.json`, {
      next: { revalidate: CACHE_TIMES.STORIES },
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch ${feed}: ${res.status}`);
    }

    const ids: number[] = await res.json();
    return getItems(paginate(ids, page, limit));
  } catch (error) {
    console.error(`Failed to fetch ${feed}:`, error);
    return [];
  }
}

/**
 * Fetch paginated top stories
 */
export function getTopStories(
  page = 1,
  limit = PAGINATION.DEFAULT_PAGE_SIZE
): Promise<HNItem[]> {
  return getStoryFeed("topstories", page, limit);
}

/**
 * Fetch paginated new stories
 */
export function getNewStories(
  page = 1,
  limit = PAGINATION.DEFAULT_PAGE_SIZE
): Promise<HNItem[]> {
  return getStoryFeed("newstories", page, limit);
}

/**
 * Fetch paginated best stories
 */
export function getBestStories(
  page = 1,
  limit = PAGINATION.DEFAULT_PAGE_SIZE
): Promise<HNItem[]> {
  return getStoryFeed("beststories", page, limit);
}

/**
 * Fetch paginated show stories
 */
export function getShowStories(
  page = 1,
  limit = PAGINATION.DEFAULT_PAGE_SIZE
): Promise<HNItem[]> {
  return getStoryFeed("showstories", page, limit);
}

/**
 * Fetch a user profile
 */
export async function getUserProfile(username: string): Promise<HNUser | null> {
  try {
    const res = await fetch(`${HN_API_BASE}/user/${username}.json`, {
      next: { revalidate: CACHE_TIMES.USER },
    });

    if (!res.ok) {
      return null;
    }

    return res.json();
  } catch (error) {
    console.error(`Failed to fetch user ${username}:`, error);
    return null;
  }
}

/**
 * Fetch a user's items (stories/comments)
 */
export async function getUserItems(
  itemIds: number[],
  limit = PAGINATION.DEFAULT_USER_ITEMS
): Promise<HNItem[]> {
  try {
    const results = await Promise.allSettled(
      itemIds.slice(0, limit).map((id) => getItem(id))
    );
    return results.flatMap((result) =>
      result.status === "fulfilled" && isLiveItem(result.value)
        ? [result.value]
        : []
    );
  } catch (error) {
    console.error("Failed to fetch user items:", error);
    return [];
  }
}

/**
 * Fetch a story with recursively loaded comments
 */
export async function getStoryWithRecursiveComments(
  id: number,
  depth = 3,
  limit = PAGINATION.DEFAULT_USER_ITEMS
): Promise<HNItemRecursive | null> {
  try {
    const item = await getItem(id);
    if (!isLiveItem(item)) return null;

    let kids: HNItemRecursive[] = [];

    if (depth > 0 && item.kids && item.kids.length > 0) {
      const kidsIds = item.kids.slice(0, limit);
      const results = await Promise.allSettled(
        kidsIds.map((kidId) =>
          getStoryWithRecursiveComments(kidId, depth - 1, limit)
        )
      );
      kids = results.flatMap((result) =>
        result.status === "fulfilled" && result.value !== null
          ? [result.value]
          : []
      );
    }

    return { ...item, kids };
  } catch (error) {
    console.error(`Failed to fetch story ${id} with comments:`, error);
    return null;
  }
}
