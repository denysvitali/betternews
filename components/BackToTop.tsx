"use client";

import { ChevronUp } from "lucide-react";
import { useScrollVisibility } from "@/lib/hooks";

export function BackToTop() {
  const isVisible = useScrollVisibility(400);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  if (!isVisible) return null;

  return (
    <button
      onClick={scrollToTop}
      className="fixed bottom-20 right-3 z-40 flex h-9 w-9 items-center justify-center rounded-xl border border-[var(--border-soft)] bg-[var(--surface)]/95 text-[var(--accent)] shadow-md backdrop-blur transition-colors hover:bg-[var(--muted-surface)] focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 dark:focus:ring-offset-neutral-950 sm:bottom-4 sm:right-20 sm:h-12 sm:w-12 sm:rounded-full sm:border-0 sm:bg-orange-500 sm:text-white sm:hover:bg-orange-600"
      aria-label="Back to top"
    >
      <ChevronUp size={20} />
    </button>
  );
}
