"use client";

import { useState } from "react";
import Image from "next/image";
import { ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

interface LinkPreviewProps {
  url: string;
  className?: string;
}

// 11ty OpenGraph API - completely free, no API key needed
// Returns the actual Open Graph image that websites define
const getOGImageUrl = (url: string, size: "small" | "medium" = "small") => {
  const encodedUrl = encodeURIComponent(url);
  return `https://v1.opengraph.11ty.dev/${encodedUrl}/${size}/`;
};

export function LinkPreview({ url, className }: LinkPreviewProps) {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Extract domain for fallback
  let domain = "";
  try {
    domain = new URL(url).hostname.replace("www.", "");
  } catch {
    domain = url;
  }

  const ogImageUrl = getOGImageUrl(url, "small");

  // Fallback placeholder when image fails or is loading
  const Placeholder = () => (
    <div
      className={cn(
        "flex h-full w-full items-center justify-center bg-gradient-to-br from-orange-50 to-amber-50 dark:from-neutral-800 dark:to-neutral-900 rounded-md border border-neutral-200 dark:border-neutral-700",
        className
      )}
    >
      <div className="flex flex-col items-center gap-2 text-neutral-600 dark:text-neutral-400">
        <ExternalLink size={24} />
        <span className="text-xs font-medium truncate max-w-full px-2">
          {domain}
        </span>
      </div>
    </div>
  );

  if (imageError) {
    return <Placeholder />;
  }

  return (
    <div
      className={cn(
        "relative h-full w-full overflow-hidden rounded-md border border-neutral-200 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-800",
        className
      )}
    >
      {/* Loading skeleton */}
      {!imageLoaded && !imageError && (
        <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-neutral-200 to-neutral-300 dark:from-neutral-700 dark:to-neutral-800" />
      )}

      {/* Actual image */}
      <Image
        src={ogImageUrl}
        alt={`Preview of ${domain}`}
        fill
        sizes="(max-width: 640px) 100vw, 128px"
        className={cn(
          "object-cover transition-opacity duration-300",
          imageLoaded ? "opacity-100" : "opacity-0"
        )}
        onLoad={() => setImageLoaded(true)}
        onError={() => setImageError(true)}
        unoptimized // External URL, skip Next.js optimization
      />

      {/* Domain overlay on hover */}
      <div className="absolute inset-0 flex items-end justify-center bg-gradient-to-t from-black/60 to-transparent opacity-0 hover:opacity-100 transition-opacity">
        <span className="text-xs text-white font-medium pb-2 truncate max-w-full px-2">
          {domain}
        </span>
      </div>
    </div>
  );
}
