"use client";

import { MessageSquare, FileText, Search, Inbox, Bookmark } from "lucide-react";
import { Button } from "./ui";

type EmptyStateType = "comments" | "posts" | "search" | "bookmarks" | "default";

interface EmptyStateProps {
  type?: EmptyStateType;
  title?: string;
  description?: string;
  actionLabel?: string;
  actionHref?: string;
  onAction?: () => void;
}

const emptyStateConfig = {
  comments: {
    icon: MessageSquare,
    title: "No comments yet",
    description: "Be the first to start the conversation!",
    iconBg: "bg-orange-100 dark:bg-orange-950/30",
    iconColor: "text-orange-500",
  },
  posts: {
    icon: FileText,
    title: "No posts yet",
    description: "This user hasn't submitted any stories yet.",
    iconBg: "bg-blue-100 dark:bg-blue-950/30",
    iconColor: "text-blue-500",
  },
  search: {
    icon: Search,
    title: "No results found",
    description: "Try adjusting your search terms or filters.",
    iconBg: "bg-purple-100 dark:bg-purple-950/30",
    iconColor: "text-purple-500",
  },
  bookmarks: {
    icon: Bookmark,
    title: "No saved stories",
    description: "Save stories to read later by clicking the bookmark icon.",
    iconBg: "bg-orange-100 dark:bg-orange-950/30",
    iconColor: "text-orange-500",
  },
  default: {
    icon: Inbox,
    title: "Nothing here",
    description: "There's nothing to show at the moment.",
    iconBg: "bg-neutral-100 dark:bg-neutral-800",
    iconColor: "text-neutral-500",
  },
};

export function EmptyState({ type = "default", title, description, actionLabel, actionHref, onAction }: EmptyStateProps) {
  const config = emptyStateConfig[type];
  const Icon = config.icon;

  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <div className={`relative mb-4 rounded-full ${config.iconBg} p-6`}>
        <Icon size={32} className={config.iconColor} strokeWidth={1.5} />
      </div>

      <h3 className="mb-1 text-lg font-semibold text-neutral-900 dark:text-white text-center">
        {title || config.title}
      </h3>
      <p className="text-sm text-neutral-500 dark:text-neutral-400 text-center max-w-xs mb-4">
        {description || config.description}
      </p>

      {(actionLabel && (actionHref || onAction)) && (
        <Button
          variant="primary"
          size="sm"
          {...(actionHref ? { href: actionHref } : { onClick: onAction })}
        >
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
