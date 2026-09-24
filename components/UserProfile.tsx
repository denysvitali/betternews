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
import { MarkdownRenderer } from "./MarkdownRenderer";

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
        <div className="space-y-7">
            {/* User Header Card */}
            <Card variant="default" padding="lg" className="overflow-hidden border-0 bg-[#18392f] text-white sm:p-8">
                <div className="flex flex-col gap-6">
                    {/* Profile Icon & Username */}
                    <div className="flex items-center gap-4 sm:gap-6">
                        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-white/20 bg-white/10 font-serif text-4xl italic text-[#ff9b71] sm:h-20 sm:w-20">
                            {user.id.charAt(0).toLowerCase() || <User size={36} strokeWidth={1.5} />}
                        </div>
                        <div>
                            <p className="mb-1 font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-[#ff9b71]">Community member</p>
                            <h1 className="editorial-title text-3xl text-white sm:text-5xl">
                                {user.id}
                            </h1>
                            <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-white/70 sm:gap-4 sm:text-sm">
                                <div className="flex items-center gap-1">
                                    <Calendar size={14} />
                                    <span>Joined </span>
                                    <TimeAgo timestamp={user.created} />
                                </div>
                                <span className="inline-flex items-center gap-1 rounded-full border border-white/20 px-2.5 py-1 font-semibold text-white"><TrendingUp size={13} />{user.karma} karma</span>
                            </div>
                        </div>
                    </div>

                    {/* Bio / About */}
                    {user.about && (
                        <div className="rounded-xl border border-white/15 bg-white/10 p-4 sm:p-5">
                            <div className="flex items-start gap-2">
                                <LinkIcon size={16} className="mt-1 text-[#ff9b71]" />
                                <div className="prose prose-sm prose-invert max-w-none text-white/80">
                                    <MarkdownRenderer content={user.about} />
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </Card>

            {/* Tabs */}
            <div role="tablist" aria-label="User activity" className="flex gap-1 rounded-xl border border-[var(--border-soft)] bg-[var(--surface)] p-1.5">
                <button
                    onClick={() => setActiveTab("submissions")}
                    aria-selected={activeTab === "submissions"}
                    role="tab"
                    className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-xs font-semibold transition-colors sm:text-sm ${activeTab === "submissions"
                        ? "bg-[var(--brand)] text-white dark:bg-[var(--accent)]"
                        : "text-neutral-500 hover:bg-[var(--muted-surface)] dark:text-neutral-400"
                        }`}
                >
                    <FileText size={16} />
                    <span>Posts ({posts.length})</span>
                </button>
                <button
                    onClick={() => setActiveTab("comments")}
                    aria-selected={activeTab === "comments"}
                    role="tab"
                    className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-xs font-semibold transition-colors sm:text-sm ${activeTab === "comments"
                        ? "bg-[var(--brand)] text-white dark:bg-[var(--accent)]"
                        : "text-neutral-500 hover:bg-[var(--muted-surface)] dark:text-neutral-400"
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
                                            <div className="prose prose-sm dark:prose-invert max-w-none text-neutral-800 dark:text-neutral-200">
                                                <MarkdownRenderer content={comment.text || ""} />
                                            </div>
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
