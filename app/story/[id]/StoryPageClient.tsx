"use client";

import { useParams } from "next/navigation";
import { useStory, Story } from "@/lib/hooks";
import { Comment } from "@/components/Comment";
import { Navbar } from "@/components/Navbar";
import { LinkPreview } from "@/components/LinkPreview";
import { ArrowUp, MessageSquare, Clock, ExternalLink } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Suspense } from "react";
import Link from "next/link";
import { StorySkeleton } from "@/components/StorySkeleton";
import { CommentSkeleton } from "@/components/CommentSkeleton";
import { CommentNavigation } from "@/components/CommentNavigation";
import { getDomain } from "@/lib/utils";

interface StoryPageClientProps {
    initialStory?: Story | null;
    storyId?: number;
}

export default function StoryPageClient({ initialStory, storyId: propStoryId }: StoryPageClientProps) {
    const params = useParams();
    const paramId = params?.id ? (Array.isArray(params.id) ? params.id[0] : params.id) : undefined;
    const storyId = propStoryId || (paramId ? parseInt(paramId) : 0);
    const { story: fetchedStory, loading: fetching, error: fetchError } = useStory(initialStory ? 0 : storyId);

    const story = initialStory || fetchedStory;
    const loading = initialStory ? false : fetching;
    const error = initialStory ? null : fetchError;

    if (loading) {
        return (
            <div className="min-h-screen bg-neutral-50 dark:bg-black">
                <Navbar />
                <main className="container mx-auto max-w-5xl sm:max-w-4xl px-4 sm:px-6 py-6 sm:py-8">
                    <div className="mb-6 sm:mb-8">
                        <StorySkeleton />
                    </div>
                    <div className="rounded-xl border border-neutral-200 bg-white p-4 sm:p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
                        <div className="mb-6 h-6 w-32 animate-pulse rounded bg-neutral-200 dark:bg-neutral-800" />
                        <div className="flex flex-col">
                            {[...Array(5)].map((_, i) => (
                                <CommentSkeleton key={i} />
                            ))}
                        </div>
                    </div>
                </main>
            </div>
        );
    }


    if (error || !story) {
        return (
            <div className="min-h-screen bg-neutral-50 dark:bg-black">
                <Navbar />
                <main className="container mx-auto max-w-5xl sm:max-w-4xl px-4 sm:px-6 py-6 sm:py-8">
                    <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm sm:text-base text-red-800 dark:border-red-800 dark:bg-red-950 dark:text-red-200">
                        Story not found or failed to load.
                    </div>
                </main>
            </div>
        );
    }

    const host = story.url ? getDomain(story.url) : "news.ycombinator.com";

    return (
        <div className="min-h-screen bg-neutral-50 dark:bg-black">
            <Navbar />
            <main className="container mx-auto max-w-5xl sm:max-w-4xl px-4 sm:px-6 py-6 sm:py-8">
                {/* Story Header */}
                <div className="mb-6 sm:mb-8 rounded-xl border border-neutral-200 bg-white p-4 sm:p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
                    <div className="flex flex-col gap-3 sm:gap-4">
                        {/* Desktop header info */}
                        <div className="hidden sm:flex items-center gap-3 text-sm text-neutral-500 dark:text-neutral-400">
                            <div className="flex items-center gap-1 rounded-full bg-orange-50 px-2 py-0.5 text-orange-600 dark:bg-orange-950/30 dark:text-orange-500">
                                <ArrowUp size={12} />
                                <span className="font-bold text-sm">{story.score}</span>
                            </div>
                            <span>•</span>
                            <Link
                                href={`/user/${story.by}`}
                                className="font-medium text-neutral-900 dark:text-neutral-100 hover:text-orange-600 dark:hover:text-orange-500 transition-colors"
                            >
                                {story.by}
                            </Link>
                            <span>•</span>
                            <div className="flex items-center gap-1">
                                <Clock size={12} />
                                <span>{formatDistanceToNow(story.time * 1000, { addSuffix: true })}</span>
                            </div>
                        </div>

                        {/* Mobile header info */}
                        <div className="flex flex-col gap-2 sm:hidden text-xs text-neutral-500 dark:text-neutral-400">
                            <div className="flex items-center gap-1 rounded-full bg-orange-50 px-2 py-0.5 text-orange-600 dark:bg-orange-950/30 dark:text-orange-500">
                                <ArrowUp size={10} />
                                <span className="font-bold text-sm">{story.score}</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <Link
                                    href={`/user/${story.by}`}
                                    className="font-medium text-neutral-900 dark:text-neutral-100 hover:text-orange-600 dark:hover:text-orange-500 transition-colors"
                                >
                                    {story.by}
                                </Link>
                                <span>•</span>
                                <div className="flex items-center gap-1">
                                    <Clock size={10} />
                                    <span>{formatDistanceToNow(story.time * 1000, { addSuffix: false })}</span>
                                </div>
                            </div>
                        </div>

                        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold leading-tight text-neutral-900 dark:text-white">
                            {story.title}
                        </h1>

                        {story.url && (
                            <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-neutral-500">
                                <a
                                    href={story.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 hover:text-orange-600 dark:hover:text-orange-500 transition-colors text-xs sm:text-sm"
                                >
                                    <ExternalLink size={14} />
                                    <span className="truncate max-w-[200px] sm:max-w-none">{story.url}</span>
                                </a>
                                <a
                                    href={`https://news.ycombinator.com/from?site=${host}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="font-mono text-xs sm:text-sm hover:underline hover:text-orange-600 dark:hover:text-orange-500 transition-colors truncate max-w-[150px] sm:max-w-none"
                                >
                                    {host}
                                </a>
                            </div>
                        )}

                        {/* Large Preview for the Story Page */}
                        {story.url && (
                            <div className="mt-3 sm:mt-4 aspect-video w-full max-w-2xl overflow-hidden rounded-lg border border-neutral-100 dark:border-neutral-800">
                                <LinkPreview url={story.url} detailed />
                            </div>
                        )}

                        {story.text && (
                            <div
                                className="mt-3 sm:mt-4 prose prose-sm sm:prose-base dark:prose-invert max-w-none prose-headings:text-lg sm:prose-headings:text-xl"
                                dangerouslySetInnerHTML={{ __html: story.text }}
                            />
                        )}
                    </div>
                </div>

                {/* Comments Section */}
                <>
                    <CommentNavigation totalComments={story.descendants || 0} storyId={story.id} />

                    <div className="rounded-xl border border-neutral-200 bg-white p-4 sm:p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
                        <h2 className="mb-4 sm:mb-6 flex items-center gap-2 text-lg sm:text-xl font-bold">
                            <MessageSquare className="text-orange-500" size={20} />
                            <span>{story.descendants || 0} Comments</span>
                        </h2>

                        <div id="comments-container" className="flex flex-col gap-3 sm:gap-4">
                            {story.kids && story.kids.length > 0 ? (
                                story.kids.map((kid) => {
                                    const kidId = typeof kid === 'number' ? kid : kid.id;
                                    const kidData = typeof kid === 'object' ? kid : undefined;
                                    return (
                                        <Suspense key={kidId} fallback={<CommentSkeleton />}>
                                            <Comment id={kidId} data={kidData} />
                                        </Suspense>
                                    );
                                })
                            ) : (
                                <div className="py-8 text-center text-sm sm:text-base text-neutral-500">No comments yet.</div>
                            )}
                        </div>
                    </div>
                </>
            </main>
        </div>
    );
}
