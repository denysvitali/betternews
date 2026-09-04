"use client";

import Link from "next/link";
import { Suspense, useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { HNItem } from "@/lib/hn";
import { PAGINATION } from "@/lib/types";
import { StoryCard } from "@/components/StoryCard";
import { Pagination } from "@/components/Pagination";
import { PullToRefresh } from "@/components/PullToRefresh";
import { PageLayout, PageHeader, PageLoading, PageError } from "@/components/ui";
import { parsePositiveIntParam } from "@/lib/params";

interface StoriesResult {
  stories: HNItem[];
  loading: boolean;
  error: Error | null;
  refetch: () => void;
}

interface StoryListPageProps {
  /** Page title shown in the header (e.g. "Top", "Best"). */
  title: string;
  /** Base URL used by pagination links (e.g. "/", "/best"). */
  baseUrl: string;
  /** Hook that fetches the paginated stories for the current page. */
  useStories: (page: number) => StoriesResult;
}

const MOBILE_FEEDS = [
  { href: "/", label: "Top" },
  { href: "/new", label: "New" },
  { href: "/best", label: "Best" },
  { href: "/show", label: "Show" },
] as const;

function StoryListContent({ title, baseUrl, useStories }: StoryListPageProps) {
  const searchParams = useSearchParams();
  const page = parsePositiveIntParam(searchParams.get("page"));
  const { stories, loading, error, refetch } = useStories(page);
  const [loadedPages, setLoadedPages] = useState<Map<number, HNItem[]>>(new Map());

  useEffect(() => {
    if (loading || error) return;

    setLoadedPages((pages) => {
      const nextPages = new Map(pages);
      nextPages.set(page, stories);
      return nextPages;
    });
  }, [error, loading, page, stories]);

  const visibleStories = [...loadedPages.entries()]
    .sort(([leftPage], [rightPage]) => leftPage - rightPage)
    .flatMap(([storyPage, pageStories]) =>
      pageStories.map((story, index) => ({
        story,
        index: index + (storyPage - 1) * PAGINATION.DEFAULT_PAGE_SIZE,
      }))
    );

  const handleRefresh = useCallback(async () => {
    await refetch();
  }, [refetch]);

  if (loading && loadedPages.size === 0) {
    return <PageLoading />;
  }

  return (
    <PullToRefresh onRefresh={handleRefresh}>
      <PageLayout>
        <PageHeader
          eyebrow="The Hacker News signal"
          title={`${title} stories`}
          description="The stories worth your attention, ranked by the Hacker News community."
          meta={
            <>
              <span>Page {page}</span>
              <span aria-hidden="true">·</span>
              <span>{visibleStories.length} stories</span>
            </>
          }
        />

        <nav aria-label="Story feeds" className="mb-3 grid grid-cols-4 gap-1 rounded-xl border border-[var(--border-soft)] bg-[var(--surface)] p-1 shadow-sm sm:hidden">
          {MOBILE_FEEDS.map(({ href, label }) => {
            const active = baseUrl === href;
            return (
              <Link
                key={href}
                href={href}
                aria-current={active ? "page" : undefined}
                className={`rounded-lg px-2 py-2 text-center text-xs font-semibold transition-colors ${active ? "bg-[var(--brand)] text-white dark:bg-orange-500" : "text-neutral-500 hover:bg-[var(--muted-surface)] dark:text-neutral-400"}`}
              >
                {label}
              </Link>
            );
          })}
        </nav>

        {error ? (
          <PageError message="Failed to load stories. Please try again later." />
        ) : (
          <>
            <div className="story-list flex flex-col gap-3">
              {visibleStories.map(({ story, index }) => (
                <StoryCard
                  key={story.id}
                  story={story}
                  index={index}
                />
              ))}
            </div>

            <Pagination currentPage={page} baseUrl={baseUrl} loading={loading} />
          </>
        )}
      </PageLayout>
    </PullToRefresh>
  );
}

export function StoryListPage(props: StoryListPageProps) {
  return (
    <Suspense fallback={<PageLoading />}>
      <StoryListContent {...props} />
    </Suspense>
  );
}
