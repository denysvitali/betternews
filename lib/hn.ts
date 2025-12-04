import {
  HNItem,
  HNUser,
  HNItemRecursive,
  HN_API_BASE,
  CACHE_TIMES,
  PAGINATION,
} from "./types";

// Re-export types for backward compatibility
export type { HNItem, HNUser, HNItemRecursive } from "./types";

/**
 * Fetch a single item from the HN API
 */
export async function getItem(id: number): Promise<HNItem> {
  const res = await fetch(`${HN_API_BASE}/item/${id}.json`, {
    next: { revalidate: CACHE_TIMES.ITEM },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch item ${id}: ${res.status}`);
  }

  return res.json();
}

/**
 * Fetch multiple items in parallel
 */
export async function getItems(ids: number[]): Promise<HNItem[]> {
  try {
    const items = await Promise.all(ids.map((id) => getItem(id)));
    return items.filter((item) => item && !item.deleted && !item.dead);
  } catch (error) {
    console.error("Failed to fetch items:", error);
    return [];
  }
}

/**
 * Fetch paginated top stories
 */
export async function getTopStories(
  page = 1,
  limit = PAGINATION.DEFAULT_PAGE_SIZE
): Promise<HNItem[]> {
  try {
    const res = await fetch(`${HN_API_BASE}/topstories.json`, {
      next: { revalidate: CACHE_TIMES.STORIES },
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch top stories: ${res.status}`);
    }

    const ids: number[] = await res.json();
    const start = (page - 1) * limit;
    const end = start + limit;
    const pageIds = ids.slice(start, end);

    return getItems(pageIds);
  } catch (error) {
    console.error("Failed to fetch top stories:", error);
    return [];
  }
}

/**
 * Fetch paginated new stories
 */
export async function getNewStories(
  page = 1,
  limit = PAGINATION.DEFAULT_PAGE_SIZE
): Promise<HNItem[]> {
  try {
    const res = await fetch(`${HN_API_BASE}/newstories.json`, {
      next: { revalidate: CACHE_TIMES.STORIES },
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch new stories: ${res.status}`);
    }

    const ids: number[] = await res.json();
    const start = (page - 1) * limit;
    const end = start + limit;
    const pageIds = ids.slice(start, end);

    return getItems(pageIds);
  } catch (error) {
    console.error("Failed to fetch new stories:", error);
    return [];
  }
}

/**
 * Fetch paginated best stories
 */
export async function getBestStories(
  page = 1,
  limit = PAGINATION.DEFAULT_PAGE_SIZE
): Promise<HNItem[]> {
  try {
    const res = await fetch(`${HN_API_BASE}/beststories.json`, {
      next: { revalidate: CACHE_TIMES.STORIES },
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch best stories: ${res.status}`);
    }

    const ids: number[] = await res.json();
    const start = (page - 1) * limit;
    const end = start + limit;
    const pageIds = ids.slice(start, end);

    return getItems(pageIds);
  } catch (error) {
    console.error("Failed to fetch best stories:", error);
    return [];
  }
}

/**
 * Fetch paginated show stories
 */
export async function getShowStories(
  page = 1,
  limit = PAGINATION.DEFAULT_PAGE_SIZE
): Promise<HNItem[]> {
  try {
    const res = await fetch(`${HN_API_BASE}/showstories.json`, {
      next: { revalidate: CACHE_TIMES.STORIES },
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch show stories: ${res.status}`);
    }

    const ids: number[] = await res.json();
    const start = (page - 1) * limit;
    const end = start + limit;
    const pageIds = ids.slice(start, end);

    return getItems(pageIds);
  } catch (error) {
    console.error("Failed to fetch show stories:", error);
    return [];
  }
}

/**
 * Fetch a story with its comments
 * @deprecated Use getItem instead
 */
export async function getStoryWithComments(id: number): Promise<HNItem> {
  return getItem(id);
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
    const items = await Promise.all(
      itemIds.slice(0, limit).map((id) => getItem(id))
    );
    return items.filter((item) => item && !item.deleted && !item.dead);
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
    if (!item || item.deleted || item.dead) return null;

    let kids: HNItemRecursive[] = [];

    if (depth > 0 && item.kids && item.kids.length > 0) {
      const kidsIds = item.kids.slice(0, limit);
      const kidsPromises = kidsIds.map((kidId) =>
        getStoryWithRecursiveComments(kidId, depth - 1, limit)
      );
      const results = await Promise.all(kidsPromises);
      kids = results.filter((k): k is HNItemRecursive => k !== null);
    }

    return {
      ...item,
      kids: kids,
    } as HNItemRecursive;
  } catch (error) {
    console.error(`Failed to fetch story ${id} with comments:`, error);
    return null;
  }
}
