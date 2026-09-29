"use client";

import { useParams } from "next/navigation";
import { useStory, useCommentTimes } from "@/lib/hooks";
import { HNItem } from "@/lib/types";
import { Comment, sortCommentIds } from "@/components/Comment";
import { KeyboardNavigation } from "@/components/KeyboardNavigation";
import { ShareButton } from "@/components/ShareButton";
import { getCleanTitle, StoryBadge } from "@/components/StoryBadge";
import { TimeAgo } from "@/components/TimeAgo";
import { EmptyState } from "@/components/EmptyState";
import { MarkdownRenderer } from "@/components/MarkdownRenderer";
import { BookmarkButton } from "@/components/BookmarkButton";
import { CommentSortControl, CommentSortType } from "@/components/CommentSortControl";
import { CollapseDepthControl } from "@/components/CollapseDepthControl";
import { ArrowLeft, ArrowUpRight, MessageCircle, ArrowUp } from "lucide-react";
import { Suspense, useState, useCallback, useMemo } from "react";
import Link from "next/link";
import { StorySkeleton } from "@/components/StorySkeleton";
import { CommentSkeleton } from "@/components/CommentSkeleton";
import { CommentNavigation } from "@/components/CommentNavigation";
import { getDomain, convertHNUrlToRelative } from "@/lib/utils";
import { PageLayout, PageError, Card, Skeleton } from "@/components/ui";
import { ReadingProgress } from "@/components/ReadingProgress";
import { parsePositiveIntParam } from "@/lib/params";

interface StoryPageClientProps {
    initialStory?: HNItem | null;
    storyId?: number;
}

function StoryLoadingState() {
    return (
        <PageLayout showBackToTop={false} mainClassName="story-detail">
            <div className="mb-5">
                <StorySkeleton />
            </div>
            <Card variant="default" padding="sm" className="rounded-xl">
                <Skeleton className="mb-4 h-5 w-32" />
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
        <PageLayout mainClassName="story-detail">
            <ReadingProgress />

            <nav aria-label="Breadcrumb" className="story-breadcrumb">
                <Link href="/"><ArrowLeft size={14} aria-hidden="true" /> Back to stories</Link>
            </nav>

            <article className="story-page-card">
                <div className="story-source-row">
                    <span className="story-source-host">{host}</span>
                    <StoryBadge title={story.title} type={story.type} />
                </div>
                <h1 className="story-page-title">{getCleanTitle(story.title || "Untitled story")}</h1>
                <div className="story-detail-meta">
                    <span className="story-score"><ArrowUp size={13} aria-hidden="true" /> {story.score ?? 0} points</span>
                    <span>by {author ? <Link href={"/user/" + author}>{author}</Link> : "unknown"}</span>
                    <span aria-hidden="true">·</span>
                    <TimeAgo timestamp={story.time} />
                </div>
                <div className="story-actions">
                    {story.url && (
                        <a href={finalStoryUrl} target={isExternalSource ? "_blank" : undefined} rel={isExternalSource ? "noopener noreferrer" : undefined} className="story-source-link">
                            {isHNConverted ? "Open discussion" : "Read original"}<ArrowUpRight size={14} aria-hidden="true" />
                        </a>
                    )}
                    <a href={hnUrl} target="_blank" rel="noopener noreferrer" className="story-hn-link">On HN ↗</a>
                    <div className="story-detail-buttons">
                        <ShareButton title={story.title || "Story"} url={finalStoryUrl} />
                        <BookmarkButton story={bookmarkStory} />
                    </div>
                </div>
                {story.text && (
                    <div className="story-author-text">
                        <MarkdownRenderer content={story.text} allowHtml />
                    </div>
                )}
            </article>

            <section aria-labelledby="discussion-heading" className="discussion-section">
                <div className="discussion-heading-row">
                    <h2 id="discussion-heading">Discussion <span>{commentCount}</span></h2>
                    <a href="#comments-container" className="discussion-jump"><MessageCircle size={13} aria-hidden="true" /> Comments</a>
                </div>
                <div className="comments-card">
                    <div className="comment-controls">
                        <CommentSortControl currentSort={commentSort} onSortChange={setCommentSort} commentCount={commentCount} />
                        <CollapseDepthControl currentDepth={collapseDepth} onDepthChange={setCollapseDepth} />
                        <CommentNavigation totalComments={commentCount} storyId={story.id} />
                    </div>
                    <div id="comments-container" className="comments-container">
                        {sortedCommentIds.length > 0 ? (
                            <>
                                {sortedCommentIds.slice(0, visibleCommentCount).map((kidId) => (
                                    <Suspense key={kidId} fallback={<CommentSkeleton />}>
                                        <Comment id={kidId} maxInitialDepth={collapseDepth} sortBy={commentSort} showScore={false} />
                                    </Suspense>
                                ))}
                                {visibleCommentCount < sortedCommentIds.length && (
                                    <button type="button" onClick={loadMoreComments} className="load-comments">
                                        Load more comments <span>({sortedCommentIds.length - visibleCommentCount} remaining)</span>
                                    </button>
                                )}
                            </>
                        ) : <EmptyState type="comments" />}
                    </div>
                </div>
            </section>

            <KeyboardNavigation />
        </PageLayout>
    );
}
