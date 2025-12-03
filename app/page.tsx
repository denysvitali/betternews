"use client";

import { useSearchParams } from "next/navigation";
import { useTopStories } from "@/lib/hooks";
import { StoryCard } from "@/components/StoryCard";
import { Pagination } from "@/components/Pagination";
import { PullToRefresh } from "@/components/PullToRefresh";
import { Suspense, useCallback } from "react";
import { PageLayout, PageHeader, PageLoading, PageError } from "@/components/ui";

function HomeContent() {
  const searchParams = useSearchParams();
  const page = parseInt(searchParams.get("page") || "1");
  const { stories, loading, error, refetch } = useTopStories(page);

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
          title="Top Stories"
          description="Today's most popular tech news."
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
                  story={story}
                  index={index + ((page - 1) * 30)}
                />
              ))}
            </div>

            <Pagination currentPage={page} baseUrl="/" />
          </>
        )}
      </PageLayout>
    </PullToRefresh>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<PageLoading />}>
      <HomeContent />
    </Suspense>
  );
}
