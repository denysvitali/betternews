"use client";

import { useCallback, useRef, type PointerEvent } from "react";

interface SwipeActions {
  onSwipeRight?: () => void;
  onSwipeLeft?: () => void;
  threshold?: number;
}

/**
 * Horizontal touch swipes on a row. The element should set `touch-action: pan-y`
 * so vertical scrolling stays native. Drag progress is exposed through the
 * `--swipe-x` CSS variable and a `data-swipe` attribute so styling stays in CSS.
 */
export function useSwipeActions({ onSwipeRight, onSwipeLeft, threshold = 84 }: SwipeActions) {
  const start = useRef<{ x: number; y: number; id: number } | null>(null);
  const locked = useRef(false);

  const reset = useCallback((element: HTMLElement) => {
    element.style.removeProperty("--swipe-x");
    element.removeAttribute("data-swipe");
    start.current = null;
    locked.current = false;
  }, []);

  const onPointerDown = useCallback((event: PointerEvent<HTMLElement>) => {
    if (event.pointerType !== "touch") return;
    start.current = { x: event.clientX, y: event.clientY, id: event.pointerId };
    locked.current = false;
  }, []);

  const onPointerMove = useCallback((event: PointerEvent<HTMLElement>) => {
    const origin = start.current;
    if (!origin || origin.id !== event.pointerId) return;
    const dx = event.clientX - origin.x;
    const dy = event.clientY - origin.y;
    if (!locked.current) {
      if (Math.abs(dx) < 10 || Math.abs(dx) < Math.abs(dy) * 1.5) return;
      locked.current = true;
      event.currentTarget.setPointerCapture(event.pointerId);
    }
    const allowed = dx > 0 ? onSwipeRight : onSwipeLeft;
    if (!allowed) return;
    const clamped = Math.max(-threshold * 1.4, Math.min(threshold * 1.4, dx));
    event.currentTarget.style.setProperty("--swipe-x", `${clamped}px`);
    event.currentTarget.dataset.swipe = dx > 0 ? "right" : "left";
    event.currentTarget.dataset.swipeReady = String(Math.abs(dx) >= threshold);
  }, [onSwipeLeft, onSwipeRight, threshold]);

  const onPointerUp = useCallback((event: PointerEvent<HTMLElement>) => {
    const origin = start.current;
    const element = event.currentTarget;
    if (origin && locked.current) {
      const dx = event.clientX - origin.x;
      if (dx >= threshold) onSwipeRight?.();
      else if (dx <= -threshold) onSwipeLeft?.();
    }
    delete element.dataset.swipeReady;
    reset(element);
  }, [onSwipeLeft, onSwipeRight, reset, threshold]);

  const onPointerCancel = useCallback((event: PointerEvent<HTMLElement>) => {
    delete event.currentTarget.dataset.swipeReady;
    reset(event.currentTarget);
  }, [reset]);

  return { onPointerDown, onPointerMove, onPointerUp, onPointerCancel };
}
