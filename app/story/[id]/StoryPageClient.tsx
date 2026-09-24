"use client";

import { useParams } from "next/navigation";
import { useStory, useCommentTimes } from "@/lib/hooks";
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
import { ArrowLeft, ArrowUpRight, MessageSquare, Clock3, ExternalLink, BookOpen, MoveUpRight, TrendingUp } from "lucide-react";
import { Suspense, useState, useCallback, useMemo } from "react";
import Link from "next/link";
import { StorySkeleton } from "@/components/StorySkeleton";
import { CommentSkeleton } from "@/components/CommentSkeleton";
import { CommentNavigation } from "@/components/CommentNavigation";
import { getDomain, getReadingTime, convertHNUrlToRelative } from "@/lib/utils";
import { PageLayout, PageError, Card, Skeleton } from "@/components/ui";
import { ReadingProgress } from "@/components/ReadingProgress";
import { parsePositiveIntParam } from "@/lib/params";

interface StoryPageClientProps {
    initialStory?: HNItem | null;
    storyId?: number;
}

function StoryLoadingState() {
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

export default function StoryPageClient({ initialStory, storyId: propStoryId }: StoryPageClientProps) {
    const params = useParams();
    const paramId = params?.id ? (Array.isArray(params.id) ? params.id[0] : params.id) : undefined;
    const storyId = propStoryId && propStoryId >= 1 ? propStoryId : parsePositiveIntParam(paramId, 0);
    const { story: fetchedStory, loading: fetching, error: fetchError } = useStory(initialStory ? 0 : storyId);

    // Comment display settings
    const [commentSort, setCommentSort] = useState<CommentSortType>("default");
    const [collapseDepth, setCollapseDepth] = useState<number>(2);
    const [visibleCommentCount, setVisibleCommentCount] = useState<number>(20);

    const loadMoreComments = useCallback(() => {
        setVisibleCommentCount((prev) => prev + 20);
    }, []);

    const story = initialStory || fetchedStory;
    const { times: commentTimes } = useCommentTimes(
        story?.kids ?? [],
        commentSort !== "default"
    );
    const sortedCommentIds = useMemo(
        () => sortCommentIds(story?.kids ?? [], commentSort, commentTimes),
        [story?.kids, commentSort, commentTimes]
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
        return <StoryLoadingState />;
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

    const isExternalSource = !isHNConverted && finalStoryUrl.startsWith("http");
    const hnUrl = "https://news.ycombinator.com/item?id=" + story.id;
    const commentCount = story.descendants || 0;
    const bookmarkStory = {
        id: story.id,
        title: story.title || "",
        url: story.url,
        by: story.by,
        time: story.time,
        score: story.score,
    };

    return (
        <PageLayout mainClassName="max-w-5xl">
            <ReadingProgress />

            <nav aria-label="Breadcrumb" className="mb-4 flex items-center gap-2 text-xs font-medium text-neutral-500 dark:text-neutral-400 sm:mb-6">
                <Link href="/" className="inline-flex items-center gap-1.5 rounded-md py-1 transition-colors hover:text-orange-600 dark:hover:text-orange-400">
                    <ArrowLeft size={14} /> Front page
                </Link>
                <span aria-hidden="true" className="text-neutral-300 dark:text-neutral-700">/</span>
                <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--brand)] dark:text-neutral-300">Story {story.id}</span>
            </nav>

            <Card as="article" variant="default" padding="none" className="story-page-card mb-7 overflow-hidden rounded-[1.4rem] sm:mb-9 sm:rounded-[1.7rem]">
                <div className="h-1 w-full bg-[var(--brand)] dark:bg-orange-500" />
                <div className="px-5 pb-5 pt-6 sm:px-8 sm:pb-8 sm:pt-8 lg:px-10">
                    <div className="mb-5 flex flex-wrap items-center justify-between gap-3 sm:mb-7">
                        <div className="flex items-center gap-2">
                            <span className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-orange-600 dark:text-orange-400">The story</span>
                            <span className="h-1 w-1 rounded-full bg-neutral-300 dark:bg-neutral-600" aria-hidden="true" />
                            <StoryBadge title={story.title} type={story.type} />
                            <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-neutral-500 dark:text-neutral-400">{host}</span>
                        </div>
                        <span className="hidden font-mono text-[10px] uppercase tracking-[0.14em] text-neutral-400 dark:text-neutral-500 sm:inline">BetterNews / #{story.id}</span>
                    </div>

                    <div className={story.url && !isHNConverted ? "grid gap-6 lg:grid-cols-[minmax(0,1fr)_15.5rem] lg:gap-9" : "grid gap-6"}>
                        <div className="min-w-0">
                            <h1 className="story-page-title max-w-3xl font-serif text-[2.15rem] font-semibold leading-[1.09] tracking-[-0.035em] text-[var(--brand)] dark:text-[#f4f1e8] sm:text-[3rem] lg:text-[3.5rem]">
                                {story.title}
                            </h1>

                            <div className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-2 text-xs text-neutral-500 dark:text-neutral-400 sm:text-sm">
                                <span className="inline-flex items-center gap-1.5 font-semibold text-orange-600 dark:text-orange-400"><TrendingUp size={15} />{story.score ?? 0} points</span>
                                <span className="text-neutral-300 dark:text-neutral-600" aria-hidden="true">·</span>
                                <span>by {author ? <Link href={"/user/" + author} className="font-semibold text-[var(--brand)] underline decoration-transparent underline-offset-4 transition-colors hover:decoration-orange-500 dark:text-neutral-200">{author}</Link> : "unknown"}</span>
                                <span className="text-neutral-300 dark:text-neutral-600" aria-hidden="true">·</span>
                                <span className="inline-flex items-center gap-1.5"><Clock3 size={14} /><TimeAgo timestamp={story.time} /></span>
                                {story.text && <span className="inline-flex items-center gap-1.5"><BookOpen size={14} />{getReadingTime(story.text)} read</span>}
                            </div>

                            <div className="mt-7 flex flex-wrap items-center gap-3">
                                {story.url && (
                                    <a
                                        href={finalStoryUrl}
                                        target={isExternalSource ? "_blank" : undefined}
                                        rel={isExternalSource ? "noopener noreferrer" : undefined}
                                        className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-[var(--brand)] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-[#245a49] hover:shadow-md dark:bg-orange-600 dark:hover:bg-orange-500"
                                    >
                                        {isHNConverted ? "Open discussion" : "Read original story"}
                                        <ArrowUpRight size={16} />
                                    </a>
                                )}
                                <a href={hnUrl} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-[var(--border-soft)] bg-[var(--surface)] px-4 py-2.5 text-sm font-medium text-[var(--brand)] transition-colors hover:border-orange-400/60 hover:text-orange-600 dark:text-neutral-200 dark:hover:text-orange-400">
                                    View on Hacker News <ExternalLink size={14} />
                                </a>
                            </div>
                        </div>

                        {story.url && !isHNConverted && (
                            <a href={finalStoryUrl} target={isExternalSource ? "_blank" : undefined} rel={isExternalSource ? "noopener noreferrer" : undefined} className="story-page-preview group relative block aspect-[16/10] overflow-hidden rounded-xl border border-[var(--border-soft)] bg-[var(--muted-surface)] lg:aspect-[4/5]" aria-label={"Open story at " + host}>
                                <LinkPreview url={finalStoryUrl} />
                                <span className="absolute bottom-0 left-0 right-0 flex items-center justify-between gap-2 bg-gradient-to-t from-black/80 to-transparent px-4 pb-3 pt-10 text-xs font-semibold text-white">
                                    <span className="truncate">{host}</span><MoveUpRight size={16} className="shrink-0 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                                </span>
                            </a>
                        )}
                    </div>

                    {story.text && (
                        <div className="mt-8 border-t border-[var(--border-soft)] pt-7 sm:mt-9 sm:pt-8">
                            <p className="mb-4 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-orange-600 dark:text-orange-400">From the author</p>
                            <MarkdownRenderer content={story.text} allowHtml className="max-w-[72ch] text-[15px] leading-[1.8] text-[var(--foreground)] sm:text-base [&_p]:mb-4" />
                        </div>
                    )}
                </div>

                <div className="story-actions flex flex-wrap items-center justify-between gap-3 border-t border-[var(--border-soft)] bg-[var(--muted-surface)]/45 px-5 py-3 sm:px-8 lg:px-10">
                    <a href="#comments-container" className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--brand)] transition-colors hover:text-orange-600 dark:text-neutral-200 dark:hover:text-orange-400">
                        <MessageSquare size={17} className="text-orange-600 dark:text-orange-400" />
                        Join the discussion <span className="font-normal text-neutral-500 dark:text-neutral-400">({commentCount})</span>
                    </a>
                    <div className="flex items-center gap-2">
                        <ShareButton title={story.title || "Story"} url={finalStoryUrl} />
                        <BookmarkButton story={bookmarkStory} showLabel />
                    </div>
                </div>
            </Card>

            <CommentNavigation totalComments={commentCount} storyId={story.id} />

            <section aria-labelledby="discussion-heading" className="mb-8">
                <div className="mb-4 flex flex-wrap items-end justify-between gap-3 sm:mb-5">
                    <div>
                        <p className="mb-1 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-orange-600 dark:text-orange-400">The conversation</p>
                        <h2 id="discussion-heading" className="font-serif text-[2rem] font-semibold leading-none tracking-[-0.03em] text-[var(--brand)] dark:text-[#f4f1e8] sm:text-[2.45rem]">Discussion <span className="font-sans text-xl font-normal text-neutral-400 dark:text-neutral-500">{commentCount}</span></h2>
                    </div>
                    <span className="hidden items-center gap-1.5 text-xs text-neutral-500 dark:text-neutral-400 sm:inline-flex"><MessageSquare size={14} /> Read what the community thinks</span>
                </div>

                <Card variant="default" padding="none" className="comments-card overflow-hidden rounded-[1.4rem] sm:rounded-[1.7rem]">
                    <div className="comment-controls flex flex-col gap-3 border-b border-[var(--border-soft)] bg-[var(--muted-surface)]/40 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                        <CommentSortControl currentSort={commentSort} onSortChange={setCommentSort} commentCount={commentCount} />
                        <CollapseDepthControl currentDepth={collapseDepth} onDepthChange={setCollapseDepth} />
                    </div>

                    <div id="comments-container" className="comments-container scroll-mt-32 px-4 py-1 sm:px-6 sm:py-2">
                        {sortedCommentIds.length > 0 ? (
                            <>
                                {sortedCommentIds.slice(0, visibleCommentCount).map((kidId) => (
                                    <Suspense key={kidId} fallback={<CommentSkeleton />}>
                                        <Comment id={kidId} maxInitialDepth={collapseDepth} sortBy={commentSort} showScore={false} />
                                    </Suspense>
                                ))}
                                {visibleCommentCount < sortedCommentIds.length && (
                                    <button type="button" onClick={loadMoreComments} className="my-5 flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-[var(--border-soft)] bg-[var(--muted-surface)]/45 px-4 py-3 text-sm font-semibold text-[var(--brand)] transition-colors hover:border-orange-400/50 hover:text-orange-600 dark:text-neutral-200 dark:hover:text-orange-400">
                                        Load more comments <span className="font-normal text-neutral-500 dark:text-neutral-400">({sortedCommentIds.length - visibleCommentCount} remaining)</span>
                                    </button>
                                )}
                            </>
                        ) : <EmptyState type="comments" />}
                    </div>
                </Card>
            </section>

            <KeyboardNavigation />
        </PageLayout>
    );
}
