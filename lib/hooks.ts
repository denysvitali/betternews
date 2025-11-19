"use client";

import { useState, useEffect } from "react";

const HN_API_BASE = "https://hacker-news.firebaseio.com/v0";

export interface Story {
    id: number;
    title: string;
    url?: string;
    by: string;
    time: number;
    score: number;
    descendants?: number;
    kids?: (number | Comment)[];
    text?: string;
    type: "job" | "story" | "comment" | "poll" | "pollopt";
}

export interface Comment {
    id: number;
    by: string;
    text?: string;
    time: number;
    kids?: (number | Comment)[];
    deleted?: boolean;
    dead?: boolean;
    type: "job" | "story" | "comment" | "poll" | "pollopt";
    parent?: number;
}

export interface User {
    id: string;
    created: number;
    karma: number;
    about?: string;
    submitted?: number[];
}

// Hook for fetching top stories
export function useTopStories(page: number = 1) {
    const [stories, setStories] = useState<Story[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        let isMounted = true;

        async function fetchStories() {
            try {
                setLoading(true);
                const res = await fetch(`${HN_API_BASE}/topstories.json`);
                const storyIds = await res.json();

                const startIndex = (page - 1) * 30;
                const endIndex = startIndex + 30;
                const pageIds = storyIds.slice(startIndex, endIndex);

                const storyPromises = pageIds.map((id: number) =>
                    fetch(`${HN_API_BASE}/item/${id}.json`).then(r => r.json())
                );

                const fetchedStories = await Promise.all(storyPromises);

                if (isMounted) {
                    setStories(fetchedStories.filter(s => s && s.type === "story"));
                    setError(null);
                }
            } catch (err) {
                if (isMounted) {
                    setError(err as Error);
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        }

        fetchStories();

        return () => {
            isMounted = false;
        };
    }, [page]);

    return { stories, loading, error };
}

// Hook for fetching new stories
export function useNewStories(page: number = 1) {
    const [stories, setStories] = useState<Story[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        let isMounted = true;

        async function fetchStories() {
            try {
                setLoading(true);
                const res = await fetch(`${HN_API_BASE}/newstories.json`);
                const storyIds = await res.json();

                const startIndex = (page - 1) * 30;
                const endIndex = startIndex + 30;
                const pageIds = storyIds.slice(startIndex, endIndex);

                const storyPromises = pageIds.map((id: number) =>
                    fetch(`${HN_API_BASE}/item/${id}.json`).then(r => r.json())
                );

                const fetchedStories = await Promise.all(storyPromises);

                if (isMounted) {
                    setStories(fetchedStories.filter(s => s && s.type === "story"));
                    setError(null);
                }
            } catch (err) {
                if (isMounted) {
                    setError(err as Error);
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        }

        fetchStories();

        return () => {
            isMounted = false;
        };
    }, [page]);

    return { stories, loading, error };
}

// Hook for fetching a single story with comments
export function useStory(id: number) {
    const [story, setStory] = useState<Story | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        let isMounted = true;

        async function fetchStory() {
            try {
                setLoading(true);
                const res = await fetch(`${HN_API_BASE}/item/${id}.json`);
                const data = await res.json();

                if (isMounted) {
                    setStory(data);
                    setError(null);
                }
            } catch (err) {
                if (isMounted) {
                    setError(err as Error);
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        }

        if (id) {
            fetchStory();
        }

        return () => {
            isMounted = false;
        };
    }, [id]);

    return { story, loading, error };
}

// Hook for fetching a comment
export function useComment(id: number) {
    const [comment, setComment] = useState<Comment | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        let isMounted = true;

        async function fetchComment() {
            try {
                setLoading(true);
                const res = await fetch(`${HN_API_BASE}/item/${id}.json`);
                const data = await res.json();

                if (isMounted) {
                    setComment(data);
                    setError(null);
                }
            } catch (err) {
                if (isMounted) {
                    setError(err as Error);
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        }

        if (id) {
            fetchComment();
        }

        return () => {
            isMounted = false;
        };
    }, [id]);

    return { comment, loading, error };
}

// Hook for fetching user profile
export function useUser(username: string) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        let isMounted = true;

        async function fetchUser() {
            try {
                setLoading(true);
                const res = await fetch(`${HN_API_BASE}/user/${username}.json`);
                const data = await res.json();

                if (isMounted) {
                    setUser(data);
                    setError(null);
                }
            } catch (err) {
                if (isMounted) {
                    setError(err as Error);
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        }

        if (username) {
            fetchUser();
        }

        return () => {
            isMounted = false;
        };
    }, [username]);

    return { user, loading, error };
}

// Hook for fetching user items (stories/comments)
export function useUserItems(itemIds: number[], limit: number = 30) {
    const [items, setItems] = useState<(Story | Comment)[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const idsKey = itemIds?.join(',') || '';

    useEffect(() => {
        let isMounted = true;

        async function fetchItems() {
            if (!idsKey) {
                setItems([]);
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                const currentIds = itemIds;
                const limitedIds = currentIds.slice(0, limit);

                const itemPromises = limitedIds.map((id: number) =>
                    fetch(`${HN_API_BASE}/item/${id}.json`).then(r => r.json())
                );

                const fetchedItems = await Promise.all(itemPromises);

                if (isMounted) {
                    setItems(fetchedItems.filter(item => item && !item.deleted && !item.dead));
                    setError(null);
                }
            } catch (err) {
                if (isMounted) {
                    setError(err as Error);
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        }

        fetchItems();

        return () => {
            isMounted = false;
        };
    }, [idsKey, limit]);

    return { items, loading, error };
}
