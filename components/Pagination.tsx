"use client";

import { useCallback, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight, LoaderCircle } from "lucide-react";
import { Button } from "@/components/ui";
import { useRouter } from "next/navigation";

interface PaginationProps {
  currentPage: number;
  baseUrl: string;
  loading?: boolean;
}

export function Pagination({ currentPage, baseUrl, loading = false }: PaginationProps) {
  const router = useRouter();
  const sentinelRef = useRef<HTMLDivElement>(null);
  const requestedPageRef = useRef<number | null>(null);

  const navigate = useCallback((page: number, scroll = true) => {
    router.push(`${baseUrl}?page=${page}`, { scroll });
  }, [baseUrl, router]);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || loading) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const nextPage = currentPage + 1;
        if (entry.isIntersecting && requestedPageRef.current !== nextPage) {
          requestedPageRef.current = nextPage;
          navigate(nextPage, false);
        }
      },
      { rootMargin: "300px 0px" }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [currentPage, loading, navigate]);

  return (
    <div ref={sentinelRef} className="mt-8 flex flex-col items-stretch gap-4 rounded-lg border border-[var(--border-soft)] bg-[var(--surface)] px-4 py-4 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:px-5">
      <div className="flex items-center gap-3 text-sm text-neutral-600 dark:text-neutral-300">
        <span className="rounded-md border border-[var(--border-soft)] bg-[var(--muted-surface)] px-3 py-1 font-mono text-[11px] uppercase tracking-[0.18em]">
          Page {currentPage}
        </span>
        <span aria-live="polite" className="flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-neutral-400 dark:text-neutral-500">
          {loading && <LoaderCircle size={14} className="motion-safe:animate-spin" />}
          {loading ? "Loading more" : "Keep scrolling"}
        </span>
      </div>

      <div className="flex items-center justify-center gap-3">
        {currentPage > 1 ? (
          <Button
            onClick={() => navigate(currentPage - 1)}
            variant="secondary"
            size="lg"
            className="min-w-[132px] rounded-md"
          >
            <ChevronLeft size={18} />
            <span>Previous</span>
          </Button>
        ) : (
          <Button
            variant="secondary"
            size="lg"
            disabled
            className="min-w-[132px] rounded-md"
          >
            <ChevronLeft size={18} />
            <span>Previous</span>
          </Button>
        )}

        <Button
          onClick={() => navigate(currentPage + 1)}
          variant="secondary"
          size="lg"
          disabled={loading}
          className="min-w-[132px] rounded-md"
        >
          <span>Next</span>
          <ChevronRight size={18} />
        </Button>
      </div>
    </div>
  );
}
