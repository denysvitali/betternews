"use client";

import { useParams } from "next/navigation";
import { useStory } from "@/lib/hooks";
import { Comment } from "@/components/Comment";
import { Navbar } from "@/components/Navbar";
import { LinkPreview } from "@/components/LinkPreview";
import { ArrowUp, MessageSquare, Clock, ExternalLink, Loader2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Suspense } from "react";
import Link from "next/link";

export default function StoryPageClient() {
    const params = useParams();
    const storyId = parseInt(params?.id as string || "0");
    const { story, loading, error } = useStory(storyId);

    if (loading) {
        return (
            <div className="min-h-screen bg-neutral-50 dark:bg-black">
                <Navbar />
                <main className="container mx-auto max-w-4xl px-4 py-8">
                    <div className="flex items-center justify-center py-12">
                        <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
                    </div>
                </main>
            </div>
        );
    }

    if (error || !story) {
        return (
            <div className="min-h-screen bg-neutral-50 dark:bg-black">
                <Navbar />
                <main className="container mx-auto max-w-4xl px-4 py-8">
                    <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-800 dark:border-red-800 dark:bg-red-950 dark:text-red-200">
                        Story not found or failed to load.
                    </div>
                </main>
            </div>
        );
    }

    const host = story.url ? new URL(story.url).host : "news.ycombinator.com";

    return (
        <div className="min-h-screen bg-neutral-50 dark:bg-black">
            <Navbar />
            <main className="container mx-auto max-w-4xl px-4 py-8">
                {/* Story Header */}
                <div className="mb-8 rounded-xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center gap-3 text-sm text-neutral-500 dark:text-neutral-400">
                            <div className="flex items-center gap-1 rounded-full bg-orange-50 px-2 py-0.5 text-orange-600 dark:bg-orange-950/30 dark:text-orange-500">
                                <ArrowUp size={14} />
                                <span className="font-bold">{story.score}</span>
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
                                <Clock size={14} />
                                <span>{formatDistanceToNow(story.time * 1000, { addSuffix: true })}</span>
                            </div>
                        </div>

                        <h1 className="text-2xl font-bold leading-tight text-neutral-900 dark:text-white sm:text-3xl">
                            {story.title}
                        </h1>

                        {story.url && (
                            <a
                                href={story.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 text-neutral-500 hover:text-orange-600 dark:hover:text-orange-500 transition-colors"
                            >
                                <ExternalLink size={16} />
                                <span className="font-mono text-sm">{host}</span>
                            </a>
                        )}

                        {/* Large Preview for the Story Page */}
                        {story.url && (
                            <div className="mt-4 aspect-video w-full max-w-2xl overflow-hidden rounded-lg border border-neutral-100 dark:border-neutral-800">
                                <LinkPreview url={story.url} />
                            </div>
                        )}

                        {story.text && (
                            <div
                                className="mt-4 prose prose-sm dark:prose-invert max-w-none"
                                dangerouslySetInnerHTML={{ __html: story.text }}
                            />
                        )}
                    </div>
                </div>

                {/* Comments Section */}
                <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
                    <h2 className="mb-6 flex items-center gap-2 text-xl font-bold">
                        <MessageSquare className="text-orange-500" />
                        <span>{story.descendants || 0} Comments</span>
                    </h2>

                    <div className="flex flex-col">
                        {story.kids && story.kids.length > 0 ? (
                            story.kids.map((kidId) => (
                                <Suspense key={kidId} fallback={<div className="py-4">Loading comment...</div>}>
                                    <Comment id={kidId} />
                                </Suspense>
                            ))
                        ) : (
                            <div className="py-8 text-center text-neutral-500">No comments yet.</div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
