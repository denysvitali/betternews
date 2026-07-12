"use client";

import { Suspense, useCallback } from "react";
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

  const handleRefresh = useCallback(async () => {
    await refetch();
  }, [refetch]);

  if (loading) {
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
              <span>{stories.length}</span>
            </>
          }
        />

        {error ? (
          <PageError message="Failed to load stories. Please try again later." />
        ) : (
          <>
            <div className="story-list flex flex-col gap-2.5">
              {stories.map((story, index) => (
                <StoryCard
                  key={story.id}
                  story={story}
                  index={index + (page - 1) * PAGINATION.DEFAULT_PAGE_SIZE}
                />
              ))}
            </div>

            <Pagination currentPage={page} baseUrl={baseUrl} />
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
