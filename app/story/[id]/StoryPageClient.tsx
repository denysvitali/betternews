"use client";

import { useParams } from "next/navigation";
import { useStory } from "@/lib/hooks";
import { HNItem } from "@/lib/types";
import { Comment, sortCommentIds } from "@/components/Comment";
import { LinkPreview } from "@/components/LinkPreview";
import { KeyboardNavigation } from "@/components/KeyboardNavigation";
import { ShareButton } from "@/components/ShareButton";
import { StoryBadge } from "@/components/StoryBadge";
import { TimeAgo } from "@/components/TimeAgo";
import { EmptyState } from "@/components/EmptyState";
import { MarkdownRenderer } from "@/components/MarkdownRenderer";
import { BookmarkButton } from "@/components/BookmarkButton";
import { CommentSortControl, CommentSortType } from "@/components/CommentSortControl";
import { CollapseDepthControl } from "@/components/CollapseDepthControl";
import { ArrowLeft, ArrowUp, MessageSquare, Clock, ExternalLink, BookOpen } from "lucide-react";
import { Suspense, useState, useCallback, useMemo } from "react";
import Link from "next/link";
import { StorySkeleton } from "@/components/StorySkeleton";
import { CommentSkeleton } from "@/components/CommentSkeleton";
import { CommentNavigation } from "@/components/CommentNavigation";
import { getDomain, getReadingTime, convertHNUrlToRelative } from "@/lib/utils";
import { PageLayout, PageError, Card, Badge, Skeleton } from "@/components/ui";
import { ReadingProgress } from "@/components/ReadingProgress";
import { parsePositiveIntParam } from "@/lib/params";

interface StoryPageClientProps {
    initialStory?: HNItem | null;
    storyId?: number;
}

export default function StoryPageClient({ initialStory, storyId: propStoryId }: StoryPageClientProps) {
    const params = useParams();
    const paramId = params?.id ? (Array.isArray(params.id) ? params.id[0] : params.id) : undefined;
    const storyId = propStoryId && propStoryId >= 1 ? propStoryId : parsePositiveIntParam(paramId, 0);
    const { story: fetchedStory, loading: fetching, error: fetchError } = useStory(initialStory ? 0 : storyId);

    // Comment display settings
    const [commentSort, setCommentSort] = useState<CommentSortType>("default");
    const [collapseDepth, setCollapseDepth] = useState<number>(2);
    const [showCommentScores] = useState<boolean>(false);
    const [visibleCommentCount, setVisibleCommentCount] = useState<number>(20);

    const loadMoreComments = useCallback(() => {
        setVisibleCommentCount((prev) => prev + 20);
    }, []);

    const story = initialStory || fetchedStory;
    const sortedCommentIds = useMemo(
        () => sortCommentIds(story?.kids ?? [], commentSort),
        [story?.kids, commentSort]
    );
    const invalidStoryId = !initialStory && storyId < 1;
    const loading = !initialStory && fetching;
    const error = !initialStory && fetchError;

    if (invalidStoryId) {
        return (
            <PageLayout>
                <PageError message="Story not found or failed to load." />
            </PageLayout>
        );
    }

    if (loading || (!initialStory && !fetchedStory && !fetchError)) {
        return (
            <PageLayout showBackToTop={false}>
                <div className="mb-6 sm:mb-8">
                    <StorySkeleton />
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

    if (error || !story) {
        return (
            <PageLayout>
                <PageError message="Story not found or failed to load." />
            </PageLayout>
        );
    }

    const author = story.by;
    const host = story.url ? getDomain(story.url) : "news.ycombinator.com";

    // Convert HN URLs to relative paths
    const relativePath = story.url ? convertHNUrlToRelative(story.url) : null;
    const finalStoryUrl = relativePath || story.url || `/story/${story.id}`;
    const isHNConverted = relativePath !== null;
    const hnId = relativePath ? relativePath.match(/\/story\/(\d+)/)?.[1] : null;

    return (
        <PageLayout>
            {/* Reading progress indicator */}
            <ReadingProgress />

            <div className="mb-3 flex items-center justify-between gap-3 text-xs text-neutral-500 dark:text-neutral-400">
                <nav aria-label="Breadcrumb" className="flex min-w-0 items-center gap-2">
                    <Link href="/" className="font-medium text-neutral-600 transition-colors hover:text-orange-600 dark:text-neutral-300 dark:hover:text-orange-400">
                        Home
                    </Link>
                    <span aria-hidden="true">/</span>
                    <span className="truncate">Story</span>
                </nav>
                <Link href="/" className="inline-flex items-center gap-1.5 rounded-full border border-[var(--border-soft)] bg-white/60 px-3 py-1 font-medium transition-colors hover:text-orange-600 dark:bg-white/6 dark:hover:text-orange-400">
                    <ArrowLeft size={12} />
                    Back to feed
                </Link>
            </div>

            <div className="sticky top-20 z-40 mb-4">
                <div className="glass-panel flex items-center justify-between gap-3 rounded-full border border-[var(--border-soft)] px-3 py-2 shadow-[0_10px_26px_rgba(15,23,42,0.08)]">
                    <Link href="/" className="inline-flex items-center gap-1.5 rounded-full px-2 py-1 text-xs font-medium text-neutral-600 transition-colors hover:text-orange-600 dark:text-neutral-300 dark:hover:text-orange-400">
                        <ArrowLeft size={14} />
                        Feed
                    </Link>
                    <div className="flex items-center gap-2">
                        <ShareButton title={story.title || "Story"} url={finalStoryUrl} />
                        <BookmarkButton
                            story={{
                                id: story.id,
                                title: story.title || "",
                                url: story.url,
                                by: story.by,
                                time: story.time,
                                score: story.score,
                            }}
                        />
                    </div>
                </div>
            </div>

            {/* Story Header */}
            <Card variant="default" padding="md" className="mb-6 sm:mb-8 sm:p-6">
                <div className="flex flex-col gap-3 sm:gap-4">
                    {/* Desktop header info */}
                    <div className="hidden sm:flex items-center gap-3 text-sm text-neutral-500 dark:text-neutral-400 flex-wrap">
                        <StoryBadge title={story.title} type={story.type} />
                        <Badge variant="orange" size="md" icon={<ArrowUp size={12} />}>
                            {story.score}
                        </Badge>
                        <span>|</span>
                        {author ? (
                            <Link
                                href={`/user/${author}`}
                                className="font-medium text-neutral-900 dark:text-neutral-100 hover:text-orange-600 dark:hover:text-orange-500 transition-colors"
                            >
                                {author}
                            </Link>
                        ) : (
                            <span className="font-medium text-neutral-500">unknown</span>
                        )}
                        <span>|</span>
                        <div className="flex items-center gap-1">
                            <Clock size={12} />
                            <TimeAgo timestamp={story.time} />
                        </div>
                        {story.text && (
                            <>
                                <span>|</span>
                                <div className="flex items-center gap-1 text-neutral-500">
                                    <BookOpen size={12} />
                                    <span>{getReadingTime(story.text)}</span>
                                </div>
                            </>
                        )}
                    </div>

                    {/* Mobile header info */}
                    <div className="flex flex-col gap-2 sm:hidden text-xs text-neutral-500 dark:text-neutral-400">
                        <div className="flex items-center gap-2 h-4">
                            <StoryBadge title={story.title} type={story.type} />
                            <Badge variant="orange" size="sm" icon={<ArrowUp size={10} />}>
                                {story.score}
                            </Badge>
                        </div>
                        <div className="flex items-center gap-1.5 h-4">
                            {author ? (
                                <Link
                                    href={`/user/${author}`}
                                    className="font-medium text-neutral-900 dark:text-neutral-100 hover:text-orange-600 dark:hover:text-orange-500 transition-colors flex items-center h-full"
                                >
                                    {author}
                                </Link>
                            ) : (
                                <span className="font-medium text-neutral-500">unknown</span>
                            )}
                            <span className="text-neutral-300 dark:text-neutral-600 flex items-center h-full">·</span>
                            <span className="flex items-center h-full">
                                <TimeAgo timestamp={story.time} addSuffix={false} />
                            </span>
                        </div>
                    </div>

                    <div className="flex items-start gap-2 flex-wrap">
                        <h1 className="text-2xl font-semibold leading-tight tracking-[-0.04em] text-neutral-900 dark:text-white sm:text-3xl lg:text-[2.15rem]">
                            {story.title}
                        </h1>
                        {isHNConverted && (
                            <span className="mt-2 inline-flex items-center gap-1 whitespace-nowrap rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700 dark:border-blue-900/70 dark:bg-blue-950/30 dark:text-blue-300 sm:mt-3">
                                <MessageSquare size={12} />
                                Discussion{hnId ? ` #${hnId}` : ""}
                            </span>
                        )}
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-full border border-[var(--border-soft)] bg-white/60 px-3 py-1 font-mono text-[11px] uppercase tracking-[0.22em] text-neutral-600 dark:bg-white/6 dark:text-neutral-300">
                            Story #{story.id}
                        </span>
                        <span className="inline-flex items-center gap-1 rounded-full border border-[var(--border-soft)] bg-white/60 px-3 py-1 text-xs text-neutral-600 dark:bg-white/6 dark:text-neutral-300">
                            <MessageSquare size={12} />
                            {story.descendants || 0} comments
                        </span>
                        {story.text && (
                            <span className="inline-flex items-center gap-1 rounded-full border border-[var(--border-soft)] bg-white/60 px-3 py-1 text-xs text-neutral-600 dark:bg-white/6 dark:text-neutral-300">
                                <BookOpen size={12} />
                                {getReadingTime(story.text)}
                            </span>
                        )}
                    </div>

                    {story.url && (
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-neutral-500">
                            <a
                                href={finalStoryUrl}
                                target={!isHNConverted && finalStoryUrl.startsWith("http") ? "_blank" : undefined}
                                rel={!isHNConverted && finalStoryUrl.startsWith("http") ? "noopener noreferrer" : undefined}
                                className={`flex items-center gap-2 transition-colors text-xs sm:text-sm ${
                                    isHNConverted
                                        ? "text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                                        : "hover:text-orange-600 dark:hover:text-orange-500"
                                }`}
                            >
                                {isHNConverted ? <MessageSquare size={14} /> : <ExternalLink size={14} />}
                                <span className="truncate max-w-[200px] sm:max-w-none">
                                    {isHNConverted ? `Discussion${hnId ? ` #${hnId}` : ""}` : story.url}
                                </span>
                            </a>
                            {!isHNConverted && (
                                <a
                                    href={`https://news.ycombinator.com/from?site=${host}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="font-mono text-xs sm:text-sm hover:underline hover:text-orange-600 dark:hover:text-orange-500 transition-colors truncate max-w-[150px] sm:max-w-none"
                                >
                                    {host}
                                </a>
                            )}
                        </div>
                    )}

                    {/* Large Preview for the Story Page - Only show for non-HN URLs */}
                    {story.url && !isHNConverted && (
                        <div className="mt-3 aspect-video w-full max-w-2xl overflow-hidden rounded-[1.4rem] border border-[var(--border-soft)] shadow-sm sm:mt-4">
                            <LinkPreview url={finalStoryUrl} />
                        </div>
                    )}

                    {story.text && (
                      <div className="mt-3 sm:mt-4">
                        <MarkdownRenderer
                          content={story.text}
                          className="prose-sm sm:prose-base dark:prose-invert max-w-none prose-headings:text-lg sm:prose-headings:text-xl"
                          allowHtml={true}
                        />
                      </div>
                    )}

                    {/* Actions */}
                    <div className="mt-4 flex items-center gap-3 border-t border-[var(--border-soft)] pt-4">
                        <ShareButton title={story.title || "Story"} url={finalStoryUrl} />
                        <BookmarkButton
                            story={{
                                id: story.id,
                                title: story.title || "",
                                url: story.url,
                                by: author,
                                time: story.time,
                                score: story.score,
                            }}
                            showLabel
                        />
                    </div>
                </div>
            </Card>

            {/* Comments Section */}
            <CommentNavigation totalComments={story.descendants || 0} storyId={story.id} />

            <Card variant="default" padding="md" className="sm:p-6">
                {/* Comments Header with Controls */}
                <div className="mb-4 sm:mb-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                        <h2 className="flex items-center gap-2 text-lg sm:text-xl font-bold">
                            <MessageSquare className="text-orange-500" size={20} />
                            <span>{story.descendants || 0} Comments</span>
                        </h2>
                    </div>

                    {/* Comment Display Controls */}
                    <div className="glass-panel flex flex-col gap-3 rounded-[1.2rem] border border-[var(--border-soft)] px-3 py-3 sm:flex-row sm:items-center sm:gap-4 sm:px-4">
                        <CommentSortControl
                            currentSort={commentSort}
                            onSortChange={setCommentSort}
                            commentCount={story.descendants || 0}
                        />
                        <div className="hidden sm:block w-px h-6 bg-neutral-200 dark:bg-neutral-700"></div>
                        <CollapseDepthControl
                            currentDepth={collapseDepth}
                            onDepthChange={setCollapseDepth}
                        />
                    </div>
                </div>

                <div id="comments-container" className="flex flex-col gap-3 sm:gap-4">
                    {sortedCommentIds.length > 0 ? (
                        <>
                            {sortedCommentIds.slice(0, visibleCommentCount).map((kidId) => (
                                <Suspense key={kidId} fallback={<CommentSkeleton />}>
                                    <Comment
                                        id={kidId}
                                        maxInitialDepth={collapseDepth}
                                        sortBy={commentSort}
                                        showScore={showCommentScores}
                                    />
                                </Suspense>
                            ))}
                            {visibleCommentCount < sortedCommentIds.length && (
                                <button
                                    onClick={loadMoreComments}
                                    className="glass-panel mt-2 w-full rounded-[1.1rem] border border-[var(--border-soft)] py-3 text-sm font-medium text-neutral-600 transition-colors hover:bg-white/60 disabled:cursor-not-allowed disabled:opacity-60 dark:text-neutral-300 dark:hover:bg-white/[0.04]"
                                    disabled={visibleCommentCount >= sortedCommentIds.length}
                                >
                                    Load more comments ({sortedCommentIds.length - visibleCommentCount} remaining)
                                </button>
                            )}
                        </>
                    ) : (
                        <EmptyState type="comments" />
                    )}
                </div>
            </Card>

            <KeyboardNavigation />
        </PageLayout>
    );
}
