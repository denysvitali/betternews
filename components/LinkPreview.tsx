"use client";

import { ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

interface LinkPreviewProps {
  url: string;
  className?: string;
}

export function LinkPreview({ url, className }: LinkPreviewProps) {
  // For static export, show a simple link placeholder
  // In the future, this could use a third-party preview service
  const domain = new URL(url).hostname.replace('www.', '');

  return (
    <div className={cn(
      "flex h-full w-full items-center justify-center bg-gradient-to-br from-orange-50 to-amber-50 dark:from-neutral-800 dark:to-neutral-900 rounded-md border border-neutral-200 dark:border-neutral-700",
      className
    )}>
      <div className="flex flex-col items-center gap-2 text-neutral-600 dark:text-neutral-400">
        <ExternalLink size={24} />
        <span className="text-xs font-medium">{domain}</span>
      </div>
    </div>
  );
}

