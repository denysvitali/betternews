"use client";

import { usePathname } from "next/navigation";
import { useTopStories } from "@/lib/hooks";
import { StoryListPage } from "@/components/StoryListPage";
import StoryPageClient from "@/app/story/[id]/StoryPageClient";
import UserPageClient from "@/app/user/[username]/UserPageClient";

export default function Home() {
  const pathname = usePathname();
  const storyMatch = pathname?.match(/^\/story\/(\d+)\/?$/);
  const userMatch = pathname?.match(/^\/user\/([^/]+)\/?$/);

  // GitHub Pages serves the root document for unknown paths through
  // public/404.html. Render dynamic routes here after that SPA fallback
  // restores the original URL.
  if (storyMatch) {
    return <StoryPageClient storyId={Number(storyMatch[1])} />;
  }

  if (userMatch) {
    return <UserPageClient username={decodeURIComponent(userMatch[1])} />;
  }

  return <StoryListPage title="Top" baseUrl="/" useStories={useTopStories} />;
}
