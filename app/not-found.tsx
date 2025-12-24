'use client';

import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import StoryPageClient from './story/[id]/StoryPageClient';
import UserPageClient from './user/[username]/UserPageClient';
import { FileQuestion, Home } from "lucide-react";
import { PageLayout, Button, Skeleton } from "@/components/ui";
import { StorySkeleton } from "@/components/StorySkeleton";
import { CommentSkeleton } from "@/components/CommentSkeleton";
import { Card } from "@/components/ui";

export default function NotFound() {
  const pathname = usePathname();
  const [isChecking, setIsChecking] = useState(true);

  // Check if the path matches a story or user route pattern
  const storyMatch = pathname?.match(/\/story\/(\d+)$/);
  const userMatch = pathname?.match(/\/user\/([^/]+)$/);

  useEffect(() => {
    // Once we've determined the route type on the client, stop showing skeleton
    setIsChecking(false);
  }, []);

  // Show loading skeleton while checking route on client-side
  if (isChecking) {
    // Show appropriate skeleton based on URL pattern
    if (storyMatch) {
      return (
        <PageLayout showBackToTop={false}>
          <div className="mb-6 sm:mb-8">
            <Card variant="default" padding="md" className="sm:p-6">
              <div className="flex flex-col gap-4">
                <Skeleton className="h-8 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-48 w-full max-w-2xl rounded-lg" />
              </div>
            </Card>
          </div>
          <Card variant="default" padding="md" className="sm:p-6">
            <Skeleton className="mb-6 h-6 w-32" />
            <div className="flex flex-col">
              {[...Array(5)].map((_, i) => (
                <CommentSkeleton key={i} />
              ))}
            </div>
          </Card>
        </PageLayout>
      );
    }

    if (userMatch) {
      return (
        <PageLayout showBackToTop={false}>
          <Card variant="default" padding="md" className="sm:p-6">
            <div className="flex flex-col gap-4">
              <Skeleton className="h-10 w-48" />
              <Skeleton className="h-4 w-64" />
              <Skeleton className="h-4 w-32" />
            </div>
          </Card>
          <div className="mt-6 flex flex-col gap-4">
            {[...Array(5)].map((_, i) => (
              <StorySkeleton key={i} />
            ))}
          </div>
        </PageLayout>
      );
    }

    // Generic loading for unknown routes
    return (
      <PageLayout showBackToTop={false}>
        <div className="flex min-h-[50vh] flex-col items-center justify-center">
          <Skeleton className="h-20 w-20 rounded-full" />
        </div>
      </PageLayout>
    );
  }

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
