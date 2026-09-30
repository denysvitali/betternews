"use client";

import { useSearchParams } from "next/navigation";
import { parsePositiveIntParam } from "@/lib/params";
import StoryPageClient from "./[id]/StoryPageClient";

export default function StoryQueryPage() {
  const storyId = parsePositiveIntParam(useSearchParams().get("id"), 0);
  // Remount per story so comment state never leaks between discussions.
  return <StoryPageClient key={storyId} storyId={storyId} />;
}
