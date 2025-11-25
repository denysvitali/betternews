"use client";

import { useState } from "react";
import { Share2, Check, Copy, Twitter, Linkedin } from "lucide-react";

interface ShareButtonProps {
  title: string;
  url: string;
  className?: string;
}

export function ShareButton({ title, url, className = "" }: ShareButtonProps) {
  const [showMenu, setShowMenu] = useState(false);
  const [copied, setCopied] = useState(false);

  const shareData = {
    title,
    url,
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch {
        // User cancelled or share failed
      }
    }
    setShowMenu(false);
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const textArea = document.createElement("textarea");
      textArea.value = url;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
    setShowMenu(false);
  };

  const shareToTwitter = () => {
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`;
    window.open(twitterUrl, "_blank", "noopener,noreferrer");
    setShowMenu(false);
  };

  const shareToLinkedIn = () => {
    const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
    window.open(linkedInUrl, "_blank", "noopener,noreferrer");
    setShowMenu(false);
  };

  // Check if native share is supported
  const canNativeShare = typeof navigator !== "undefined" && navigator.share;

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => {
          if (canNativeShare) {
            handleNativeShare();
          } else {
            setShowMenu(!showMenu);
          }
        }}
        className="flex items-center gap-1.5 rounded-md bg-neutral-100 px-2.5 sm:px-3 py-1.5 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700"
        aria-label="Share"
      >
        <Share2 size={11} />
        <span className="hidden sm:inline">Share</span>
      </button>

      {/* Dropdown menu for non-native share */}
      {showMenu && !canNativeShare && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setShowMenu(false)}
          />

          {/* Menu */}
          <div className="absolute right-0 top-full mt-2 z-50 w-48 rounded-lg bg-white dark:bg-neutral-900 shadow-xl border border-neutral-200 dark:border-neutral-800 py-1 animate-in fade-in slide-in-from-top-2 duration-200">
            <button
              onClick={copyToClipboard}
              className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            >
              {copied ? (
                <>
                  <Check size={16} className="text-green-500" />
                  <span className="text-green-600 dark:text-green-400">Copied!</span>
                </>
              ) : (
                <>
                  <Copy size={16} />
                  <span>Copy link</span>
                </>
              )}
            </button>
            <button
              onClick={shareToTwitter}
              className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            >
              <Twitter size={16} />
              <span>Share on X</span>
            </button>
            <button
              onClick={shareToLinkedIn}
              className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            >
              <Linkedin size={16} />
              <span>Share on LinkedIn</span>
            </button>
          </div>
        </>
      )}
    </div>
  );
}
