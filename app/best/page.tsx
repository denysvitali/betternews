"use client";

import { useSearchParams } from "next/navigation";
import { useBestStories } from "@/lib/hooks";
import { StoryCard } from "@/components/StoryCard";
import { Pagination } from "@/components/Pagination";
import { PullToRefresh } from "@/components/PullToRefresh";
import { Suspense, useCallback } from "react";
import { PageLayout, PageHeader, PageLoading, PageError } from "@/components/ui";
import { parsePositiveIntParam } from "@/lib/params";

function BestStoriesContent() {
  const searchParams = useSearchParams();
  const page = parsePositiveIntParam(searchParams.get("page"));
  const { stories, loading, error, refetch } = useBestStories(page);

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
          title="Best"
          meta={
            <>
              <span>p{page}</span>
              <span aria-hidden="true">·</span>
              <span>{stories.length}</span>
            </>
          }
        />

        {error && (
          <PageError message="Failed to load stories. Please try again later." />
        )}

        {!error && (
          <>
            <div className="story-list flex flex-col gap-2.5">
              {stories.map((story, index) => (
                <StoryCard
                  key={story.id}
                  story={story}
                  index={index + ((page - 1) * 30)}
                />
              ))}
            </div>

            <Pagination currentPage={page} baseUrl="/best" />
          </>
        )}
      </PageLayout>
    </PullToRefresh>
  );
}

export default function BestStories() {
  return (
    <Suspense fallback={<PageLoading />}>
      <BestStoriesContent />
    </Suspense>
  );
}
