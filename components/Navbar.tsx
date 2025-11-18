import Link from "next/link";
import { Newspaper } from "lucide-react";

export function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md dark:bg-neutral-950/80 dark:border-neutral-800">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-500 text-white">
            <Newspaper size={20} />
          </div>
          <span>BetterNews</span>
        </Link>
        <div className="flex items-center gap-6 text-sm font-medium text-neutral-600 dark:text-neutral-400">
          <Link href="/" className="hover:text-orange-500 transition-colors">
            Top
          </Link>
          <Link href="/new" className="hover:text-orange-500 transition-colors">
            New
          </Link>
        </div>
      </div>
    </nav>
  );
}
