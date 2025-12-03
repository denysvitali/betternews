'use client';

import { usePathname } from 'next/navigation';
import StoryPageClient from './story/[id]/StoryPageClient';
import UserPageClient from './user/[username]/UserPageClient';
import { FileQuestion, Home } from "lucide-react";
import { PageLayout, Button } from "@/components/ui";

export default function NotFound() {
  const pathname = usePathname();

  // Check if the path matches a story or user route pattern
  const storyMatch = pathname?.match(/\/story\/(\d+)$/);
  const userMatch = pathname?.match(/\/user\/([^/]+)$/);

  // Render the appropriate client component for dynamic routes
  if (storyMatch && storyMatch[1]) {
    return <StoryPageClient storyId={parseInt(storyMatch[1])} />;
  }

  if (userMatch && userMatch[1]) {
    return <UserPageClient username={userMatch[1]} />;
  }

  // Default 404 page for actual not-found routes
  return (
    <PageLayout showBackToTop={false}>
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-6 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-neutral-100 dark:bg-neutral-800 animate-bounce">
          <FileQuestion className="h-10 w-10 text-neutral-400" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">
            Page not found
          </h2>
          <p className="text-neutral-500 dark:text-neutral-400 max-w-md mx-auto">
            Looks like this story got lost in the archives. Or maybe it never existed!
          </p>
        </div>
        <Button href="/" variant="primary" size="lg">
          <Home size={18} />
          Return Home
        </Button>
      </div>
    </PageLayout>
  );
}
