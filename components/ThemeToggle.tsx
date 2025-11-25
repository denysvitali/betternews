"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export function ThemeToggle() {
  const { setTheme, theme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <button
        className="relative p-2 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors overflow-hidden"
        aria-label="Toggle theme"
      >
        <div className="h-5 w-5" />
      </button>
    );
  }

  return (
    <button
      className="relative p-2 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors overflow-hidden group"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
    >
      <div className="relative h-5 w-5">
        {/* Sun icon */}
        <Sun
          className={`absolute inset-0 h-5 w-5 text-amber-500 transition-all duration-300 ease-in-out ${
            theme === "dark"
              ? "rotate-90 scale-0 opacity-0"
              : "rotate-0 scale-100 opacity-100"
          }`}
        />
        {/* Moon icon */}
        <Moon
          className={`absolute inset-0 h-5 w-5 text-blue-400 transition-all duration-300 ease-in-out ${
            theme === "dark"
              ? "rotate-0 scale-100 opacity-100"
              : "-rotate-90 scale-0 opacity-0"
          }`}
        />
      </div>
      {/* Ripple effect on hover */}
      <span className="absolute inset-0 rounded-md bg-current opacity-0 group-hover:opacity-5 transition-opacity" />
    </button>
  );
}
