"use client";

import { User as UserType, Story, Comment } from "@/lib/hooks";
import { formatDistanceToNow } from "date-fns";
import { User, Calendar, TrendingUp, LinkIcon, MessageSquare, FileText } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { StorySkeleton } from "./StorySkeleton";
import { CommentSkeleton } from "./CommentSkeleton";

interface UserProfileProps {
    user: UserType;
    items: (Story | Comment)[];
    activeTab: string;
    loading?: boolean;
}

export function UserProfile({ user, items, activeTab: initialTab, loading }: UserProfileProps) {
    const [activeTab, setActiveTab] = useState(initialTab);

    // Type guards
    const isStory = (item: Story | Comment): item is Story => item.type === "story";
    const isComment = (item: Story | Comment): item is Comment => item.type === "comment";

    const comments = items.filter(isComment);
    const posts = items.filter(isStory);

    return (
        <div className="space-y-6">
            {/* User Header Card */}
            <div className="rounded-xl border border-neutral-200 bg-white p-8 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
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
                                    <span>
                                        Joined {formatDistanceToNow(user.created * 1000, { addSuffix: true })}
                                    </span>
                                </div>
                                <div className="flex items-center gap-1 rounded-full bg-orange-50 px-2 py-0.5 text-orange-600 dark:bg-orange-950/30 dark:text-orange-500">
                                    <TrendingUp size={14} />
                                    <span className="font-bold">{user.karma} karma</span>
                                </div>
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
            </div>

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
                            <div key={i} className="rounded-lg border border-neutral-200 bg-white p-4 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
                                <CommentSkeleton />
                            </div>
                    ))
                ) : (
                    <>
                        {activeTab === "submissions" && (
                            <>
                                {posts.length > 0 ? (
                                    posts.map((post) => (
                                        <div
                                            key={post.id}
                                            className="rounded-lg border border-neutral-200 bg-white p-4 shadow-sm transition-all hover:border-orange-200 hover:shadow-md dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-orange-900/50"
                                        >
                                            <Link
                                                href={`/story/${post.id}`}
                                                className="text-lg font-semibold text-neutral-900 hover:text-orange-600 dark:text-white dark:hover:text-orange-500"
                                            >
                                                {post.title}
                                            </Link>
                                            <div className="mt-2 flex items-center gap-3 text-xs text-neutral-500 dark:text-neutral-400">
                                                <span className="flex items-center gap-1 rounded-full bg-orange-50 px-2 py-0.5 text-orange-600 dark:bg-orange-950/30 dark:text-orange-500">
                                                    <TrendingUp size={12} />
                                                    <span className="font-bold">{post.score || 0} points</span>
                                                </span>
                                                <span>•</span>
                                                <span>{formatDistanceToNow(post.time * 1000, { addSuffix: true })}</span>
                                                <span>•</span>
                                                <span>{post.descendants || 0} comments</span>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="rounded-lg border border-neutral-200 bg-white p-8 text-center text-neutral-500 dark:border-neutral-800 dark:bg-neutral-900">
                                        No posts yet
                                    </div>
                                )}
                            </>
                        )}

                        {activeTab === "comments" && (
                            <>
                                {comments.length > 0 ? (
                                    comments.map((comment) => (
                                        <div
                                            key={comment.id}
                                            className="rounded-lg border border-neutral-200 bg-white p-4 shadow-sm dark:border-neutral-800 dark:bg-neutral-900"
                                        >
                                            <div className="mb-2 text-xs text-neutral-500 dark:text-neutral-400">
                                                {formatDistanceToNow(comment.time * 1000, { addSuffix: true })}
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
                                        </div>
                                    ))
                                ) : (
                                    <div className="rounded-lg border border-neutral-200 bg-white p-8 text-center text-neutral-500 dark:border-neutral-800 dark:bg-neutral-900">
                                        No comments yet
                                    </div>
                                )}
                            </>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
