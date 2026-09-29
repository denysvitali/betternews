"use client";

import { useEffect, useRef } from "react";
import { LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";

interface PaginationProps {
  /** Next page that has not been loaded yet. */
  nextPage: number;
  baseUrl: string;
  loading?: boolean;
}

/**
 * Feeds load continuously: the sentinel fetches the next page as it nears the
 * viewport, and the button is the manual fallback for the same action.
 */
export function Pagination({ nextPage, baseUrl, loading = false }: PaginationProps) {
  const router = useRouter();
  const sentinelRef = useRef<HTMLDivElement>(null);
  const requestedPageRef = useRef<number | null>(null);

  const loadNext = (scroll = false) => {
    requestedPageRef.current = nextPage;
    router.push(`${baseUrl}?page=${nextPage}`, { scroll });
  };

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || loading) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && requestedPageRef.current !== nextPage) {
          requestedPageRef.current = nextPage;
          router.push(`${baseUrl}?page=${nextPage}`, { scroll: false });
        }
      },
      { rootMargin: "300px 0px" }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [baseUrl, loading, nextPage, router]);

  return (
    <div ref={sentinelRef} className="feed-more">
      <button type="button" onClick={() => loadNext()} disabled={loading} className="feed-more-button">
        {loading && <LoaderCircle size={14} className="motion-safe:animate-spin" aria-hidden="true" />}
        <span aria-live="polite">{loading ? "Loading more stories…" : "Load more stories"}</span>
      </button>
    </div>
  );
}
