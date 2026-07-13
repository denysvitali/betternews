"use client";

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
          title={title}
          meta={
            <>
              <span>p{page}</span>
              <span aria-hidden="true">·</span>
              <span>{visibleStories.length}</span>
            </>
          }
        />

        {error ? (
          <PageError message="Failed to load stories. Please try again later." />
        ) : (
          <>
            <div className="story-list flex flex-col gap-2.5">
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
