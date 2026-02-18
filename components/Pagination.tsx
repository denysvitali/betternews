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
    <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
      {currentPage > 1 ? (
        <Button
          onClick={() => navigate(currentPage - 1)}
          variant="secondary"
          size="lg"
          className="min-w-[120px]"
        >
          <ChevronLeft size={18} />
          <span>Previous</span>
        </Button>
      ) : (
        <Button
          variant="secondary"
          size="lg"
          disabled
          className="min-w-[120px]"
        >
          <ChevronLeft size={18} />
          <span>Previous</span>
        </Button>
      )}

      <span className="text-sm sm:text-base font-medium text-neutral-600 dark:text-neutral-400 px-3 py-2">
        Page {currentPage}
      </span>

      <Button
        onClick={() => navigate(currentPage + 1)}
        variant="secondary"
        size="lg"
        className="min-w-[120px]"
      >
        <span>Next</span>
        <ChevronRight size={18} />
      </Button>
    </div>
  );
}
