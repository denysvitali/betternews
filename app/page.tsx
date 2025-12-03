"use client";

import { useSearchParams } from "next/navigation";
import { useTopStories } from "@/lib/hooks";
import { StoryCard } from "@/components/StoryCard";
import { Navbar } from "@/components/Navbar";
import { Pagination } from "@/components/Pagination";
import { Footer } from "@/components/Footer";
import { BackToTop } from "@/components/BackToTop";
import { PullToRefresh } from "@/components/PullToRefresh";
import { Loader2 } from "lucide-react";
import { Suspense, useCallback } from "react";

function HomeContent() {
  const searchParams = useSearchParams();
  const page = parseInt(searchParams.get("page") || "1");
  const { stories, loading, error, refetch } = useTopStories(page);

  const handleRefresh = useCallback(async () => {
    await refetch();
  }, [refetch]);

  return (
    <PullToRefresh onRefresh={handleRefresh}>
      <div className="flex min-h-screen flex-col bg-neutral-50 dark:bg-black">
        <Navbar />
        <main className="container mx-auto max-w-5xl sm:max-w-4xl px-4 sm:px-6 py-6 sm:py-8 flex-1">
          <div className="mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900 dark:text-white">Top Stories</h1>
            <p className="text-sm sm:text-base text-neutral-500 dark:text-neutral-400 mt-1">Today&apos;s most popular tech news.</p>
          </div>

          {loading && (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
            </div>
          )}

          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm sm:text-base text-red-800 dark:border-red-800 dark:bg-red-950 dark:text-red-200">
              Failed to load stories. Please try again later.
            </div>
          )}

          {!loading && !error && (
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
        </main>
        <Footer />
        <BackToTop />
      </div>
    </PullToRefresh>
  );
}

export default function Home() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen flex-col bg-neutral-50 dark:bg-black">
        <Navbar />
        <main className="container mx-auto max-w-5xl sm:max-w-4xl px-4 sm:px-6 py-6 sm:py-8 flex-1">
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
          </div>
        </main>
        <Footer />
      </div>
    }>
      <HomeContent />
    </Suspense>
  );
}
