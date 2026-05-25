"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { RefreshCw, AlertCircle } from "lucide-react";

interface PullToRefreshProps {
  onRefresh: () => Promise<void>;
  children: React.ReactNode;
}

export function PullToRefresh({ onRefresh, children }: PullToRefreshProps) {
  const [pullDistance, setPullDistance] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isPulling, setIsPulling] = useState(false);
  const [refreshError, setRefreshError] = useState(false);
  const startY = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const THRESHOLD = 80; // Distance to trigger refresh
  const MAX_PULL = 120; // Maximum pull distance

  const handleTouchStart = useCallback((e: TouchEvent) => {
    // Only enable pull-to-refresh at the top of the page
    if (window.scrollY === 0 && !isRefreshing) {
      startY.current = e.touches[0].clientY;
      setIsPulling(true);
    }
  }, [isRefreshing]);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!isPulling || isRefreshing) return;

    const currentY = e.touches[0].clientY;
    const diff = currentY - startY.current;

    if (diff > 0 && window.scrollY === 0) {
      // Apply resistance to the pull
      const resistance = 0.5;
      const distance = Math.min(diff * resistance, MAX_PULL);
      setPullDistance(distance);

      // Prevent default scroll when pulling
      if (distance > 10) {
        e.preventDefault();
      }
    }
  }, [isPulling, isRefreshing]);

  const handleTouchEnd = useCallback(async () => {
    if (!isPulling) return;

    setIsPulling(false);

    if (pullDistance >= THRESHOLD && !isRefreshing) {
      setIsRefreshing(true);
      setRefreshError(false);
      setPullDistance(THRESHOLD);

      try {
        await onRefresh();
      } catch {
        setRefreshError(true);
        setTimeout(() => setRefreshError(false), 3000);
      } finally {
        setIsRefreshing(false);
        setPullDistance(0);
      }
    } else {
      setPullDistance(0);
    }
  }, [isPulling, pullDistance, isRefreshing, onRefresh]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Use passive: false to allow preventDefault
    container.addEventListener("touchstart", handleTouchStart, { passive: true });
    container.addEventListener("touchmove", handleTouchMove, { passive: false });
    container.addEventListener("touchend", handleTouchEnd, { passive: true });

    return () => {
      container.removeEventListener("touchstart", handleTouchStart);
      container.removeEventListener("touchmove", handleTouchMove);
      container.removeEventListener("touchend", handleTouchEnd);
    };
  }, [handleTouchStart, handleTouchMove, handleTouchEnd]);

  const progress = Math.min(pullDistance / THRESHOLD, 1);
  const rotation = progress * 360;
  const readyToRefresh = pullDistance >= THRESHOLD;

  return (
    <div ref={containerRef} className="relative">
      {/* Refresh error toast */}
      {refreshError && (
        <div className="absolute top-2 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 rounded-full bg-red-600 px-4 py-2 text-xs text-white shadow-lg animate-in fade-in slide-in-from-top-2 duration-200">
          <AlertCircle size={14} />
          Refresh failed. Please try again.
        </div>
      )}

      {/* Pull indicator */}
      <div
        className="absolute left-0 right-0 z-40 flex items-center justify-center overflow-hidden transition-all duration-200 ease-out motion-reduce:transition-none"
        style={{
          height: pullDistance,
          opacity: progress,
        }}
      >
        <div className="flex flex-col items-center gap-2">
          <div
            className={`flex items-center justify-center rounded-full bg-orange-500 p-2 shadow-lg transition-transform motion-reduce:transition-none ${
              isRefreshing ? "motion-safe:animate-spin" : ""
            }`}
            style={{
              transform: isRefreshing ? undefined : `rotate(${rotation}deg)`,
            }}
          >
            <RefreshCw size={20} className="text-white" />
          </div>
          <span className="rounded-full bg-white/90 px-3 py-1 text-[11px] font-medium text-neutral-700 shadow-sm dark:bg-neutral-900/90 dark:text-neutral-200">
            {isRefreshing ? "Refreshing" : readyToRefresh ? "Release to refresh" : "Pull to refresh"}
          </span>
        </div>
      </div>

      {/* Content */}
      <div
        className="transition-transform duration-200 ease-out motion-reduce:transition-none"
        style={{
          transform: `translateY(${pullDistance}px)`,
        }}
      >
        {children}
      </div>
    </div>
  );
}
