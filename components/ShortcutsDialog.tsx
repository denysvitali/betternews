"use client";

import { useEffect } from "react";
import { Card, Button } from "./ui";

export interface Shortcut {
  key: string;
  label: string;
}

interface ShortcutsDialogProps {
  open: boolean;
  onClose: () => void;
  shortcuts: readonly Shortcut[];
}

/** The floating "?" hint plus the modal listing keyboard shortcuts. */
export function ShortcutsDialog({ open, onClose, shortcuts }: ShortcutsDialogProps) {
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Keyboard shortcuts"
    >
      <Card className="mx-4 max-w-sm shadow-2xl" padding="lg" onClick={(event) => event.stopPropagation()}>
        <h3 className="mb-4 text-lg font-bold text-neutral-900 dark:text-white">Keyboard Shortcuts</h3>
        <div className="space-y-3 text-sm">
          {shortcuts.map(({ key, label }) => (
            <div key={key} className="flex items-center justify-between">
              <span className="text-neutral-600 dark:text-neutral-400">{label}</span>
              <kbd className="rounded bg-neutral-100 px-2 py-1 font-mono text-xs dark:bg-neutral-800">{key}</kbd>
            </div>
          ))}
        </div>
        <Button variant="primary" onClick={onClose} className="mt-6 w-full">Got it</Button>
      </Card>
    </div>
  );
}

export function ShortcutsHint({ onClick }: { onClick: () => void }) {
  return (
    <div className="fixed bottom-4 right-4 z-40 hidden sm:block">
      <button
        type="button"
        onClick={onClick}
        className="flex items-center gap-1.5 rounded-lg bg-neutral-900/90 px-3 py-2 text-xs font-medium text-white shadow-lg backdrop-blur-sm transition-all hover:scale-105 dark:bg-white/90 dark:text-neutral-900"
        title="Keyboard shortcuts"
      >
        <kbd className="rounded bg-neutral-700 px-1.5 py-0.5 text-[10px] dark:bg-neutral-300">?</kbd>
        <span>Shortcuts</span>
      </button>
    </div>
  );
}
