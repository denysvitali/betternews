"use client";

import { Award } from "lucide-react";
import { Badge } from "@/components/ui";

interface BestOfBadgeProps {
  descendantCount: number;
  threshold?: number;
}

/**
 * Badge to highlight highly-discussed comments
 * Shows "Top Comment" badge when comment has many descendants
 */
export function BestOfBadge({
  descendantCount,
  threshold = 10,
}: BestOfBadgeProps) {
  if (descendantCount < threshold) {
    return null;
  }

  return (
    <Badge
      variant="orange"
      size="sm"
      icon={<Award size={10} />}
      className="ml-2"
    >
      Top Comment
    </Badge>
  );
}
