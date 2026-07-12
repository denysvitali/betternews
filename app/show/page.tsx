"use client";

import { useShowStories } from "@/lib/hooks";
import { StoryListPage } from "@/components/StoryListPage";

export default function ShowStories() {
  return (
    <StoryListPage title="Show" baseUrl="/show" useStories={useShowStories} />
  );
}
