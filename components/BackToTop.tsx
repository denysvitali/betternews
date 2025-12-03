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
      className="fixed bottom-20 right-4 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-orange-500 text-white shadow-lg transition-all hover:bg-orange-600 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 dark:focus:ring-offset-neutral-950 sm:bottom-4 sm:right-20"
      aria-label="Back to top"
    >
      <ChevronUp size={24} />
    </button>
  );
}
