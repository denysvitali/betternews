import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  baseUrl: string;
}

export function Pagination({ currentPage, baseUrl }: PaginationProps) {
  return (
    <div className="mt-8 flex items-center justify-center gap-4">
      {currentPage > 1 ? (
        <Link
          href={`${baseUrl}?page=${currentPage - 1}`}
          className="flex items-center gap-1 rounded-md bg-white px-4 py-2 text-sm font-medium text-neutral-700 shadow-sm ring-1 ring-inset ring-neutral-300 hover:bg-neutral-50 dark:bg-neutral-900 dark:text-neutral-200 dark:ring-neutral-700 dark:hover:bg-neutral-800"
        >
          <ChevronLeft size={16} />
          Previous
        </Link>
      ) : (
        <button
          disabled
          className="flex items-center gap-1 rounded-md bg-neutral-100 px-4 py-2 text-sm font-medium text-neutral-400 shadow-none ring-0 cursor-not-allowed dark:bg-neutral-900 dark:text-neutral-600"
        >
          <ChevronLeft size={16} />
          Previous
        </button>
      )}

      <span className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
        Page {currentPage}
      </span>

      <Link
        href={`${baseUrl}?page=${currentPage + 1}`}
        className="flex items-center gap-1 rounded-md bg-white px-4 py-2 text-sm font-medium text-neutral-700 shadow-sm ring-1 ring-inset ring-neutral-300 hover:bg-neutral-50 dark:bg-neutral-900 dark:text-neutral-200 dark:ring-neutral-700 dark:hover:bg-neutral-800"
      >
        Next
        <ChevronRight size={16} />
      </Link>
    </div>
  );
}
