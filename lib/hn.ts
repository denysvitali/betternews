export interface HNItem {
  id: number;
  deleted?: boolean;
  type: "job" | "story" | "comment" | "poll" | "pollopt";
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

export interface HNUser {
  id: string;
  created: number;
  karma: number;
  about?: string;
  submitted?: number[];
}

const BASE_URL = "https://hacker-news.firebaseio.com/v0";

export async function getItem(id: number): Promise<HNItem> {
  const res = await fetch(`${BASE_URL}/item/${id}.json`, {
    next: { revalidate: 60 }, // Cache for 60 seconds
  });
  return res.json();
}

export async function getItems(ids: number[]): Promise<HNItem[]> {
  const items = await Promise.all(ids.map((id) => getItem(id)));
  return items.filter((item) => item && !item.deleted && !item.dead);
}

export async function getTopStories(page = 1, limit = 30): Promise<HNItem[]> {
  const res = await fetch(`${BASE_URL}/topstories.json`, {
    next: { revalidate: 60 },
  });
  const ids: number[] = await res.json();

  const start = (page - 1) * limit;
  const end = start + limit;
  const pageIds = ids.slice(start, end);

  return getItems(pageIds);
}

export async function getNewStories(page = 1, limit = 30): Promise<HNItem[]> {
  const res = await fetch(`${BASE_URL}/newstories.json`, {
    next: { revalidate: 60 },
  });
  const ids: number[] = await res.json();

  const start = (page - 1) * limit;
  const end = start + limit;
  const pageIds = ids.slice(start, end);

  return getItems(pageIds);
}

export async function getStoryWithComments(id: number): Promise<HNItem> {
  const item = await getItem(id);
  return item;
}

export async function getUserProfile(username: string): Promise<HNUser | null> {
  try {
    const res = await fetch(`${BASE_URL}/user/${username}.json`, {
      next: { revalidate: 300 }, // Cache for 5 minutes
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export async function getUserItems(itemIds: number[], limit = 20): Promise<HNItem[]> {
  const items = await Promise.all(
    itemIds.slice(0, limit).map((id) => getItem(id))
  );
  return items.filter((item) => item && !item.deleted && !item.dead);
}

export interface HNItemRecursive extends Omit<HNItem, 'kids'> {
  kids?: HNItemRecursive[];
}

export async function getStoryWithRecursiveComments(
  id: number,
  depth = 3,
  limit = 20
): Promise<HNItemRecursive | null> {
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

  // We cast the item to HNItemRecursive because we are replacing kids (number[]) with kids (object[])
  return {
    ...item,
    kids: kids,
  } as HNItemRecursive;
}

