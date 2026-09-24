"use client";

import { Suspense, useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { HNItem } from "@/lib/hn";
import { PAGINATION } from "@/lib/types";
import { StoryCard } from "@/components/StoryCard";
import { Pagination } from "@/components/Pagination";
import { PullToRefresh } from "@/components/PullToRefresh";
import { PageLayout, PageLoading, PageError } from "@/components/ui";
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

const FEED_DESCRIPTIONS: Record<string, string> = {
  Top: "The links and ideas drawing the most attention from the Hacker News community.",
  New: "Fresh submissions from across the web, as they arrive.",
  Best: "Standout stories with staying power, chosen by the community.",
  Show: "Things people have made, shared by the people who made them.",
};

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

  const seenStoryIds = new Set<number>();
  const visibleStories = [...loadedPages.entries()]
    .sort(([leftPage], [rightPage]) => leftPage - rightPage)
    .flatMap(([storyPage, pageStories]) =>
      pageStories.map((story, index) => ({
        story,
        index: index + (storyPage - 1) * PAGINATION.DEFAULT_PAGE_SIZE,
      }))
    )
    .filter(({ story }) => {
      if (seenStoryIds.has(story.id)) return false;
      seenStoryIds.add(story.id);
      return true;
    });

  const handleRefresh = useCallback(async () => {
    await refetch();
  }, [refetch]);

  if (loading && loadedPages.size === 0) {
    return <PageLoading />;
  }

  return (
    <PullToRefresh onRefresh={handleRefresh}>
      <PageLayout>
        <header className="relative mb-6 overflow-hidden border-b border-[var(--border-soft)] pb-6 pt-3 sm:mb-8 sm:pb-8 sm:pt-4">
          <div className="grid gap-5 md:grid-cols-[minmax(0,1fr)_16rem] md:items-end md:gap-10">
            <div>
              <div className="mb-4 flex items-center gap-3 font-mono text-[0.63rem] font-semibold uppercase tracking-[0.2em] text-[#a95132] dark:text-[#ef9876] sm:mb-5">
                <span className="h-2 w-2 rounded-full bg-[var(--accent)]" aria-hidden="true" />
                The Hacker News signal
                <span className="text-[#b5bdb2]" aria-hidden="true">/</span>
                {title}
              </div>
              <h1 className="font-[Georgia,serif] text-[2.7rem] leading-[0.98] tracking-[-0.055em] text-[var(--brand)] dark:text-[#f7f3e8] sm:text-[4rem] lg:text-[5rem]">
                {title} <em className="font-normal text-[#bb5a38] dark:text-[#ed916c]">stories.</em>
              </h1>
            </div>
            <div className="max-w-[34rem] md:border-l md:border-[var(--border-soft)] md:pl-6">
              <p className="text-sm leading-relaxed text-[#607066] dark:text-[#a9b9ac] sm:text-base">
                {FEED_DESCRIPTIONS[title] || "The stories worth your attention, ranked by the Hacker News community."}
              </p>
              <p className="mt-3 flex items-center gap-2 font-mono text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-[#9b6f55] dark:text-[#cc9879]">
                <span>Page {page}</span>
                <span aria-hidden="true">·</span>
                <span>{visibleStories.length} stories loaded</span>
              </p>
            </div>
          </div>
        </header>

        {error ? (
          <PageError message="Failed to load stories. Please try again later." />
        ) : visibleStories.length > 0 ? (
          <>
            <div className="story-list flex flex-col gap-5 sm:gap-7">
              <section aria-label="Leading story">
                <div className="mb-3 flex items-center justify-between gap-4 sm:mb-4">
                  <h2 className="flex items-center gap-2 font-mono text-[0.64rem] font-semibold uppercase tracking-[0.18em] text-[#617368] dark:text-[#a6b9aa]">
                    <span className="text-[var(--accent)]">01</span>
                    <span className="text-[#b5beb2]" aria-hidden="true">/</span>
                    Leading the conversation
                  </h2>
                  <ArrowUpRight size={15} aria-hidden="true" className="text-[var(--accent)]" />
                </div>
                <StoryCard story={visibleStories[0].story} index={visibleStories[0].index} featured />
              </section>

              {visibleStories.length > 1 && (
                <section aria-label="More stories">
                  <div className="mb-3 flex items-center justify-between gap-4 sm:mb-4">
                    <h2 className="flex items-center gap-2 font-mono text-[0.64rem] font-semibold uppercase tracking-[0.18em] text-[#617368] dark:text-[#a6b9aa]">
                      <span className="text-[var(--accent)]">02</span>
                      <span className="text-[#b5beb2]" aria-hidden="true">/</span>
                      More to explore
                    </h2>
                    <span className="flex items-center gap-1 font-mono text-[0.6rem] uppercase tracking-[0.12em] text-[#8a9b8d] dark:text-[#8d9f91]">
                      Scroll to read <ArrowDownRight size={12} aria-hidden="true" />
                    </span>
                  </div>
                  <div className="overflow-hidden rounded-[1.25rem] border border-[var(--border-soft)] bg-[var(--surface)] shadow-[0_6px_24px_rgba(23,61,50,0.045)] sm:rounded-[1.5rem]">
                    {visibleStories.slice(1).map(({ story, index }) => (
                      <StoryCard key={story.id} story={story} index={index} />
                    ))}
                  </div>
                </section>
              )}
            </div>

            <Pagination currentPage={page} baseUrl={baseUrl} loading={loading} />
          </>
        ) : (
          <div className="rounded-[1.25rem] border border-[var(--border-soft)] bg-[var(--surface)] px-5 py-10 text-center text-sm text-[#647368] dark:text-[#a9b8ac]">
            No stories are available right now.
          </div>
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
