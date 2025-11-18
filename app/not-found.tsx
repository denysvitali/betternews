'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from "next/link";
import StoryPageClient from './story/[id]/StoryPageClient';
import UserPageClient from './user/[username]/UserPageClient';

export default function NotFound() {
  const pathname = usePathname();
  const [routeType, setRouteType] = useState<'story' | 'user' | 'not-found'>('not-found');

  useEffect(() => {
    // Check if the path matches a story or user route pattern
    const storyMatch = pathname?.match(/\/story\/\d+$/);
    const userMatch = pathname?.match(/\/user\/[^/]+$/);

    if (storyMatch) {
      setRouteType('story');
    } else if (userMatch) {
      setRouteType('user');
    } else {
      setRouteType('not-found');
    }
  }, [pathname]);

  // Render the appropriate client component for dynamic routes
  if (routeType === 'story') {
    return <StoryPageClient />;
  }

  if (routeType === 'user') {
    return <UserPageClient />;
  }

  // Default 404 page for actual not-found routes
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-neutral-50 dark:bg-black">
      <h2 className="mb-4 text-4xl font-bold text-neutral-900 dark:text-white">404</h2>
      <p className="mb-8 text-neutral-500 dark:text-neutral-400">Page not found</p>
      <Link
        href="/"
        className="rounded-md bg-orange-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-orange-600"
      >
        Return Home
      </Link>
    </div>
  );
}
