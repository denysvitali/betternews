"use client";

import { HNItem, HNUser } from "@/lib/types";
import { User, Calendar, TrendingUp, LinkIcon, MessageSquare, FileText } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { StorySkeleton } from "./StorySkeleton";
import { CommentSkeleton } from "./CommentSkeleton";
import { EmptyState } from "./EmptyState";
import { TimeAgo } from "./TimeAgo";
import { Card, Badge } from "@/components/ui";

interface UserProfileProps {
    user: HNUser;
    items: HNItem[];
    activeTab: string;
    loading?: boolean;
}

export function UserProfile({ user, items, activeTab: initialTab, loading }: UserProfileProps) {
    const [activeTab, setActiveTab] = useState(initialTab);

    // Memoize filtered lists for performance
    const posts = useMemo(() => items.filter(item => item.type === "story"), [items]);
    const comments = useMemo(() => items.filter(item => item.type === "comment"), [items]);

    return (
        <div className="space-y-6">
            {/* User Header Card */}
            <Card variant="default" padding="lg">
                <div className="flex flex-col gap-6">
                    {/* Profile Icon & Username */}
                    <div className="flex items-center gap-4">
                        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-orange-500 to-orange-600 text-white shadow-lg">
                            <User size={40} strokeWidth={2} />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-neutral-900 dark:text-white">
                                {user.id}
                            </h1>
                            <div className="mt-2 flex items-center gap-4 text-sm text-neutral-500 dark:text-neutral-400">
                                <div className="flex items-center gap-1">
                                    <Calendar size={14} />
                                    <span>Joined </span>
                                    <TimeAgo timestamp={user.created} />
                                </div>
                                <Badge variant="orange" size="md" icon={<TrendingUp size={14} />}>
                                    {user.karma} karma
                                </Badge>
                            </div>
                        </div>
                    </div>

                    {/* Bio / About */}
                    {user.about && (
                        <div className="rounded-lg bg-neutral-50 p-4 dark:bg-neutral-800/50">
                            <div className="flex items-start gap-2">
                                <LinkIcon size={16} className="mt-1 text-neutral-400" />
                                <div
                                    className="prose prose-sm dark:prose-invert max-w-none text-neutral-700 dark:text-neutral-300"
                                    dangerouslySetInnerHTML={{ __html: user.about }}
                                />
                            </div>
                        </div>
                    )}
                </div>
            </Card>

            {/* Tabs */}
            <div className="flex gap-2 border-b border-neutral-200 dark:border-neutral-800">
                <button
                    onClick={() => setActiveTab("submissions")}
                    className={`flex items-center gap-2 px-4 py-3 font-medium transition-colors ${activeTab === "submissions"
                        ? "border-b-2 border-orange-500 text-orange-600 dark:text-orange-500"
                        : "text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100"
                        }`}
                >
                    <FileText size={16} />
                    <span>Posts ({posts.length})</span>
                </button>
                <button
                    onClick={() => setActiveTab("comments")}
                    className={`flex items-center gap-2 px-4 py-3 font-medium transition-colors ${activeTab === "comments"
                        ? "border-b-2 border-orange-500 text-orange-600 dark:text-orange-500"
                        : "text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100"
                        }`}
                >
                    <MessageSquare size={16} />
                    <span>Comments ({comments.length})</span>
                </button>
            </div>

            {/* Content */}
            <div className="space-y-4">
                {loading ? (
                    [...Array(10)].map((_, i) => (
                        activeTab === "submissions" ?
                            <StorySkeleton key={i} /> :
                            <Card key={i} variant="default" padding="md">
                                <CommentSkeleton />
                            </Card>
                    ))
                ) : (
                    <>
                        {activeTab === "submissions" && (
                            <>
                                {posts.length > 0 ? (
                                    posts.map((post) => (
                                        <Card key={post.id} variant="interactive" padding="md">
                                            <Link
                                                href={`/story/${post.id}`}
                                                className="text-lg font-semibold text-neutral-900 hover:text-orange-600 dark:text-white dark:hover:text-orange-500"
                                            >
                                                {post.title}
                                            </Link>
                                            <div className="mt-2 flex items-center gap-3 text-xs text-neutral-500 dark:text-neutral-400">
                                                <Badge variant="orange" size="sm" icon={<TrendingUp size={12} />}>
                                                    {post.score || 0} points
                                                </Badge>
                                                <span>|</span>
                                                <TimeAgo timestamp={post.time} />
                                                <span>•</span>
                                                <span>{post.descendants || 0} comments</span>
                                            </div>
                                        </Card>
                                    ))
                                ) : (
                                    <Card variant="default" padding="none">
                                        <EmptyState type="posts" />
                                    </Card>
                                )}
                            </>
                        )}

                        {activeTab === "comments" && (
                            <>
                                {comments.length > 0 ? (
                                    comments.map((comment) => (
                                        <Card key={comment.id} variant="default" padding="md">
                                            <div className="mb-2 text-xs text-neutral-500 dark:text-neutral-400">
                                                <TimeAgo timestamp={comment.time} />
                                            </div>
                                            <div
                                                className="prose prose-sm dark:prose-invert max-w-none text-neutral-800 dark:text-neutral-200"
                                                dangerouslySetInnerHTML={{ __html: comment.text || "" }}
                                            />
                                            {comment.parent && (
                                                <Link
                                                    href={`/story/${comment.parent}`}
                                                    className="mt-3 inline-flex items-center gap-1 text-xs text-orange-600 hover:underline dark:text-orange-500"
                                                >
                                                    View context →
                                                </Link>
                                            )}
                                        </Card>
                                    ))
                                ) : (
                                    <Card variant="default" padding="none">
                                        <EmptyState type="comments" />
                                    </Card>
                                )}
                            </>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
