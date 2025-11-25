import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  baseUrl: string;
}

export function Pagination({ currentPage, baseUrl }: PaginationProps) {
  return (
    <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
      {currentPage > 1 ? (
        <Link
          href={`${baseUrl}?page=${currentPage - 1}`}
          className="flex items-center gap-2 rounded-lg bg-white px-4 sm:px-6 py-3 text-sm sm:text-base font-medium text-neutral-700 shadow-sm ring-1 ring-inset ring-neutral-300 hover:bg-neutral-50 dark:bg-neutral-900 dark:text-neutral-200 dark:ring-neutral-700 dark:hover:bg-neutral-800 min-w-[120px] justify-center transition-colors"
        >
          <ChevronLeft size={18} />
          <span>Previous</span>
        </Link>
      ) : (
        <button
          disabled
          className="flex items-center gap-2 rounded-lg bg-neutral-100 px-4 sm:px-6 py-3 text-sm sm:text-base font-medium text-neutral-400 shadow-none ring-0 cursor-not-allowed dark:bg-neutral-900 dark:text-neutral-600 min-w-[120px] justify-center"
        >
          <ChevronLeft size={18} />
          <span>Previous</span>
        </button>
      )}

      <span className="text-sm sm:text-base font-medium text-neutral-600 dark:text-neutral-400 px-3 py-2">
        Page {currentPage}
      </span>

      <Link
        href={`${baseUrl}?page=${currentPage + 1}`}
        className="flex items-center gap-2 rounded-lg bg-white px-4 sm:px-6 py-3 text-sm sm:text-base font-medium text-neutral-700 shadow-sm ring-1 ring-inset ring-neutral-300 hover:bg-neutral-50 dark:bg-neutral-900 dark:text-neutral-200 dark:ring-neutral-700 dark:hover:bg-neutral-800 min-w-[120px] justify-center transition-colors"
      >
        <span>Next</span>
        <ChevronRight size={18} />
      </Link>
    </div>
  );
}
