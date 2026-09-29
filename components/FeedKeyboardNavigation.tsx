"use client";

import { useEffect, useState } from "react";
import { ShortcutsDialog, ShortcutsHint } from "./ShortcutsDialog";

const SHORTCUTS = [
  { key: "j", label: "Next story" },
  { key: "k", label: "Previous story" },
  { key: "o", label: "Open story" },
  { key: "c", label: "Open comments" },
  { key: "s", label: "Save / unsave" },
  { key: "x", label: "Mark read / unread" },
  { key: "esc", label: "Clear selection" },
] as const;

function getCards() {
  return Array.from(document.querySelectorAll<HTMLElement>(".story-list .story-card"));
}

function select(card: HTMLElement | null) {
  document.querySelectorAll('.story-card[data-selected="true"]').forEach((el) => el.removeAttribute("data-selected"));
  if (!card) return;
  card.setAttribute("data-selected", "true");
  const { top, bottom } = card.getBoundingClientRect();
  // Leave room for the sticky header and the mobile tab bar.
  if (top < 80 || bottom > window.innerHeight - 24) {
    card.scrollIntoView({ block: "center", behavior: "smooth" });
  }
}

/** Vim-style story navigation for feed pages. */
export function FeedKeyboardNavigation() {
  const [showHelp, setShowHelp] = useState(false);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      const target = event.target;
      if (
        target instanceof HTMLInputElement ||
        target instanceof HTMLTextAreaElement ||
        target instanceof HTMLSelectElement ||
        (target instanceof HTMLElement && (target.isContentEditable || target.closest("[role=dialog]")))
      ) {
        return;
      }

      const cards = getCards();
      const current = cards.findIndex((card) => card.getAttribute("data-selected") === "true");
      const card = current >= 0 ? cards[current] : null;

      switch (event.key.toLowerCase()) {
        case "j":
          event.preventDefault();
          select(cards[Math.min(current + 1, cards.length - 1)] ?? null);
          break;
        case "k":
          event.preventDefault();
          select(cards[Math.max(current - 1, 0)] ?? null);
          break;
        case "o":
        case "enter":
          if (!card) return;
          if (event.key === "Enter" && target instanceof HTMLElement && target.closest("a, button")) return;
          event.preventDefault();
          card.querySelector<HTMLElement>(".story-title")?.click();
          break;
        case "c":
          if (!card) return;
          event.preventDefault();
          card.querySelector<HTMLElement>(".story-comments")?.click();
          break;
        case "s":
          if (!card) return;
          event.preventDefault();
          card.querySelector<HTMLElement>(".story-bookmark")?.click();
          break;
        case "x":
          if (!card) return;
          event.preventDefault();
          // Same toggle the swipe gesture uses.
          card.dispatchEvent(new CustomEvent("story-toggle-read", { bubbles: false }));
          break;
        case "?":
          event.preventDefault();
          setShowHelp((open) => !open);
          break;
        case "escape":
          select(null);
          break;
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <>
      <ShortcutsHint onClick={() => setShowHelp(true)} />
      <ShortcutsDialog open={showHelp} onClose={() => setShowHelp(false)} shortcuts={SHORTCUTS} />
    </>
  );
}
