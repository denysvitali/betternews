"use client";

import { useEffect, useSyncExternalStore } from "react";
import { Minimize2 } from "lucide-react";

type Density = "comfortable" | "super";

const STORAGE_KEY = "betternews-density";
const CHANGE_EVENT = "betternews-density-change";

function getDensitySnapshot(): Density {
  if (typeof window === "undefined") {
    return "comfortable";
  }

  return window.localStorage.getItem(STORAGE_KEY) === "super" ? "super" : "comfortable";
}

function subscribeToDensity(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener(CHANGE_EVENT, callback);

  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(CHANGE_EVENT, callback);
  };
}

export function DensityToggle({ className = "" }: { className?: string }) {
  const density = useSyncExternalStore(
    subscribeToDensity,
    getDensitySnapshot,
    () => "comfortable"
  );
  const isSuper = density === "super";

  useEffect(() => {
    document.documentElement.dataset.density = density;
  }, [density]);

  const toggleDensity = () => {
    const nextDensity: Density = isSuper ? "comfortable" : "super";
    document.documentElement.dataset.density = nextDensity;
    window.localStorage.setItem(STORAGE_KEY, nextDensity);
    window.dispatchEvent(new Event(CHANGE_EVENT));
  };

  return (
    <button
      type="button"
      onClick={toggleDensity}
      className={`inline-flex items-center gap-2 rounded-full border border-[var(--border-soft)] px-3 py-2 text-xs font-medium transition-colors hover:text-orange-600 dark:hover:text-orange-400 ${className}`}
      aria-pressed={isSuper}
      aria-label={isSuper ? "Use normal density" : "Use super compact density"}
      title={isSuper ? "Normal density" : "Super compact"}
    >
      <Minimize2 size={14} />
      <span>{isSuper ? "Normal" : "Super compact"}</span>
    </button>
  );
}
