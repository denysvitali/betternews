"use client";

import { useSearchParams } from "next/navigation";
import { useNewStories } from "@/lib/hooks";
import { HNItem } from "@/lib/hn";
import { StoryCard } from "@/components/StoryCard";
import { Navbar } from "@/components/Navbar";
import { Pagination } from "@/components/Pagination";
import { Loader2 } from "lucide-react";
import { Suspense } from "react";

function NewStoriesContent() {
  const searchParams = useSearchParams();
  const page = parseInt(searchParams.get("page") || "1");
  const { stories, loading, error } = useNewStories(page);

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-black">
      <Navbar />
      <main className="container mx-auto max-w-4xl px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-white">New Stories</h1>
          <p className="text-neutral-500 dark:text-neutral-400">The latest submissions from the community.</p>
        </div>

        {loading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
          </div>
        )}

        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-800 dark:border-red-800 dark:bg-red-950 dark:text-red-200">
            Failed to load stories. Please try again later.
          </div>
        )}

        {!loading && !error && (
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
      </main>
    </div>
  );
}

export default function NewStories() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-neutral-50 dark:bg-black">
        <Navbar />
        <main className="container mx-auto max-w-4xl px-4 py-8">
           <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
          </div>
        </main>
      </div>
    }>
      <NewStoriesContent />
    </Suspense>
  );
}
