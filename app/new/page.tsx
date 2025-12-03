"use client";

import { useSearchParams } from "next/navigation";
import { useNewStories } from "@/lib/hooks";
import { HNItem } from "@/lib/hn";
import { StoryCard } from "@/components/StoryCard";
import { Pagination } from "@/components/Pagination";
import { PullToRefresh } from "@/components/PullToRefresh";
import { Suspense, useCallback } from "react";
import { PageLayout, PageHeader, PageLoading, PageError } from "@/components/ui";

function NewStoriesContent() {
  const searchParams = useSearchParams();
  const page = parseInt(searchParams.get("page") || "1");
  const { stories, loading, error, refetch } = useNewStories(page);

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
          title="New Stories"
          description="The latest submissions from the community."
        />

        {error && (
          <PageError message="Failed to load stories. Please try again later." />
        )}

        {!error && (
          <>
            <div className="flex flex-col gap-4">
              {stories.map((story, index) => (
                <StoryCard
                  key={story.id}
                  story={story as unknown as HNItem}
                  index={index + ((page - 1) * 30)}
                />
              ))}
            </div>

            <Pagination currentPage={page} baseUrl="/new" />
          </>
        )}
      </PageLayout>
    </PullToRefresh>
  );
}

export default function NewStories() {
  return (
    <Suspense fallback={<PageLoading />}>
      <NewStoriesContent />
    </Suspense>
  );
}
