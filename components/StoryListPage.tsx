"use client";

import { Suspense, useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Radio } from "lucide-react";
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
        <header className="feed-header">
          <div className="feed-eyebrow"><Radio size={13} aria-hidden="true" /> A fresh perspective on Hacker News</div>
          <div className="feed-heading-row">
            <h1>{title} stories<span className="text-[var(--accent)]">.</span></h1>
            <span className="feed-count">Page {page} <span aria-hidden="true">·</span> {visibleStories.length} stories</span>
          </div>
          <p>{FEED_DESCRIPTIONS[title] || "Stories worth your attention, from the Hacker News community."}</p>
        </header>

        {error ? (
          <PageError message="Failed to load stories. Please try again later." />
        ) : visibleStories.length > 0 ? (
          <>
            <section aria-label={`${title} stories`} className="story-list">
              {visibleStories.map(({ story, index }) => (
                <StoryCard key={story.id} story={story} index={index} featured={index === 0} />
              ))}
            </section>

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
