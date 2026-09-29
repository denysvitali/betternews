"use client";

import { useSyncExternalStore } from "react";

/**
 * Per-device reading history: which stories were opened and how many comments
 * the reader had seen the last time they viewed the discussion.
 */
export interface HistoryEntry {
  visited?: boolean;
  /** Comment count at the last time the discussion was viewed. */
  comments?: number;
  at: number;
}

type History = Record<string, HistoryEntry>;

const STORAGE_KEY = "betternews_history";
const MAX_ENTRIES = 1000;
const EMPTY: History = {};

let cached: History | null = null;
const listeners = new Set<() => void>();

function read(): History {
  if (typeof window === "undefined") return EMPTY;
  if (cached) return cached;
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    cached = stored ? (JSON.parse(stored) as History) : {};
  } catch {
    cached = {};
  }
  return cached;
}

function write(next: History): void {
  const keys = Object.keys(next);
  if (keys.length > MAX_ENTRIES) {
    keys
      .sort((a, b) => next[a].at - next[b].at)
      .slice(0, keys.length - MAX_ENTRIES)
      .forEach((key) => delete next[key]);
  }
  cached = next;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch (error) {
    console.error("Failed to save reading history:", error);
  }
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void): () => void {
  const onStorage = (event: StorageEvent) => {
    if (event.key === STORAGE_KEY) {
      cached = null;
      listener();
    }
  };
  listeners.add(listener);
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

function update(id: number, patch: Partial<Omit<HistoryEntry, "at">>): void {
  const current = read();
  const previous = current[id];
  const unchanged =
    previous && Object.entries(patch).every(([key, value]) => previous[key as keyof HistoryEntry] === value);
  if (unchanged) return;
  write({ ...current, [id]: { ...previous, ...patch, at: Date.now() } });
}

export function setStoryVisited(id: number, visited: boolean): void {
  update(id, { visited });
}

export function recordCommentsSeen(id: number, comments: number): void {
  update(id, { visited: true, comments });
}

export function useHistoryEntry(id: number): HistoryEntry | undefined {
  return useSyncExternalStore(
    subscribe,
    () => read()[id],
    () => undefined
  );
}
