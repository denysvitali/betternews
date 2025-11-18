import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-neutral-50 dark:bg-black">
      <h2 className="mb-4 text-4xl font-bold text-neutral-900 dark:text-white">404</h2>
      <p className="mb-8 text-neutral-500 dark:text-neutral-400">Page not found</p>
      <Link
        href="/"
        className="rounded-md bg-orange-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-orange-600"
      >
        Return Home
      </Link>
    </div>
  );
}
