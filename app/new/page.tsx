"use client";

import { useNewStories } from "@/lib/hooks";
import { StoryListPage } from "@/components/StoryListPage";

export default function NewStories() {
  return (
    <StoryListPage title="New" baseUrl="/new" useStories={useNewStories} />
  );
}
