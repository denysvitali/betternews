"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui";
import { useRouter } from "next/navigation";

interface PaginationProps {
  currentPage: number;
  baseUrl: string;
}

export function Pagination({ currentPage, baseUrl }: PaginationProps) {
  const router = useRouter();

  const navigate = (page: number) => {
    router.push(`${baseUrl}?page=${page}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="mt-8 flex flex-col items-stretch gap-4 rounded-lg border border-[var(--border-soft)] bg-[var(--surface)] px-4 py-4 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:px-5">
      <div className="flex items-center gap-3 text-sm text-neutral-600 dark:text-neutral-300">
        <span className="rounded-md border border-[var(--border-soft)] bg-[var(--muted-surface)] px-3 py-1 font-mono text-[11px] uppercase tracking-[0.18em]">
          Page {currentPage}
        </span>
        <span className="text-xs uppercase tracking-[0.22em] text-neutral-400 dark:text-neutral-500">
          Keep scrolling
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
          className="min-w-[132px] rounded-md"
        >
          <span>Next</span>
          <ChevronRight size={18} />
        </Button>
      </div>
    </div>
  );
}
