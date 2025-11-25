"use client";

import { HelpCircle, Rocket, Briefcase, BarChart3 } from "lucide-react";

type StoryType = "ask" | "show" | "job" | "poll" | null;

interface StoryBadgeProps {
  title?: string;
  type?: string;
}

function getStoryType(title?: string, type?: string): StoryType {
  if (type === "job") return "job";
  if (type === "poll") return "poll";

  if (!title) return null;

  const lowerTitle = title.toLowerCase();
  if (lowerTitle.startsWith("ask hn:") || lowerTitle.startsWith("ask hn -")) return "ask";
  if (lowerTitle.startsWith("show hn:") || lowerTitle.startsWith("show hn -")) return "show";
  if (lowerTitle.startsWith("tell hn:")) return "ask";

  return null;
}

const badgeConfig = {
  ask: {
    label: "Ask HN",
    icon: HelpCircle,
    className: "bg-purple-100 text-purple-700 dark:bg-purple-950/50 dark:text-purple-400",
  },
  show: {
    label: "Show HN",
    icon: Rocket,
    className: "bg-green-100 text-green-700 dark:bg-green-950/50 dark:text-green-400",
  },
  job: {
    label: "Job",
    icon: Briefcase,
    className: "bg-blue-100 text-blue-700 dark:bg-blue-950/50 dark:text-blue-400",
  },
  poll: {
    label: "Poll",
    icon: BarChart3,
    className: "bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400",
  },
};

export function StoryBadge({ title, type }: StoryBadgeProps) {
  const storyType = getStoryType(title, type);

  if (!storyType) return null;

  const config = badgeConfig[storyType];
  const Icon = config.icon;

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${config.className}`}
    >
      <Icon size={10} strokeWidth={2.5} />
      <span>{config.label}</span>
    </span>
  );
}

export function getCleanTitle(title: string): string {
  // Remove "Ask HN:", "Show HN:", "Tell HN:" prefixes for cleaner display
  return title
    .replace(/^(Ask HN|Show HN|Tell HN):\s*/i, "")
    .replace(/^(Ask HN|Show HN|Tell HN)\s*-\s*/i, "");
}
