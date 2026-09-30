"use client";

import { HNItem, HNUser } from "@/lib/types";
import Link from "next/link";
import { storyHref } from "@/lib/utils";
import { useMemo, useState } from "react";
import { StoryCard } from "./StoryCard";
import { StorySkeleton } from "./StorySkeleton";
import { CommentSkeleton } from "./CommentSkeleton";
import { EmptyState } from "./EmptyState";
import { TimeAgo } from "./TimeAgo";
import { MarkdownRenderer } from "./MarkdownRenderer";

interface UserProfileProps {
  user: HNUser;
  items: HNItem[];
  activeTab: string;
  loading?: boolean;
}

export function UserProfile({ user, items, activeTab: initialTab, loading }: UserProfileProps) {
  const [activeTab, setActiveTab] = useState(initialTab === "comments" ? "comments" : "submissions");
  const posts = useMemo(() => items.filter(item => item.type === "story"), [items]);
  const comments = useMemo(() => items.filter(item => item.type === "comment"), [items]);

  return (
    <div className="profile-view">
      <header className="profile-header">
        <p className="profile-eyebrow">Community member</p>
        <h1>{user.id}</h1>
        <div className="profile-stats"><span className="text-[var(--accent)]">{user.karma.toLocaleString()} karma</span><span>Joined <TimeAgo timestamp={user.created} /></span></div>
        {user.about && <MarkdownRenderer content={user.about} allowHtml className="profile-bio" />}
      </header>
      <div className="profile-tabs" aria-label="User activity">
        <button type="button" aria-pressed={activeTab === "submissions"} onClick={() => setActiveTab("submissions")}>Posts <span>{posts.length}</span></button>
        <button type="button" aria-pressed={activeTab === "comments"} onClick={() => setActiveTab("comments")}>Comments <span>{comments.length}</span></button>
      </div>
      <section className="story-list" aria-label={activeTab === "submissions" ? "User posts" : "User comments"}>
        {loading ? (
          Array.from({ length: 4 }, (_, index) => activeTab === "submissions" ? <StorySkeleton key={index} /> : <div className="profile-comment" key={index}><CommentSkeleton /></div>)
        ) : activeTab === "submissions" ? (
          posts.length ? posts.map((post, index) => <StoryCard key={post.id} story={post} index={index} />) : <EmptyState type="posts" />
        ) : comments.length ? (
          comments.map(comment => (
            <article key={comment.id} className="profile-comment">
              <div className="profile-comment-time"><TimeAgo timestamp={comment.time} /></div>
              <MarkdownRenderer content={comment.text || ""} allowHtml className="profile-comment-body" />
              {comment.parent && <Link href={storyHref(comment.parent)} className="profile-context">View context →</Link>}
            </article>
          ))
        ) : <EmptyState type="comments" />}
      </section>
    </div>
  );
}
