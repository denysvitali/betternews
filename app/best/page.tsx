"use client";

import { useBestStories } from "@/lib/hooks";
import { StoryListPage } from "@/components/StoryListPage";

export default function BestStories() {
  return (
    <StoryListPage title="Best" baseUrl="/best" useStories={useBestStories} />
  );
}
