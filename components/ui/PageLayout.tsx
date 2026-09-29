import { ReactNode } from "react";
import { Navbar } from "@/components/Navbar";
import { BottomNav } from "@/components/BottomNav";
import { Footer } from "@/components/Footer";
import { BackToTop } from "@/components/BackToTop";
import { cn } from "@/lib/utils";
import { Skeleton } from "./Skeleton";

interface PageLayoutProps {
  children: ReactNode;
  showBackToTop?: boolean;
  className?: string;
  mainClassName?: string;
}

export function PageLayout({
  children,
  showBackToTop = true,
  className,
  mainClassName,
}: PageLayoutProps) {
  return (
    <div className={cn("relative flex min-h-screen flex-col overflow-hidden bg-transparent transition-colors duration-300", className)}>
      <Navbar />
      <BottomNav />
      <main id="main-content" tabIndex={-1} className={cn(
        "relative mx-auto flex w-full max-w-6xl flex-1 flex-col px-4 py-5 sm:px-6 sm:py-7 lg:px-8",
        mainClassName
      )}>
        {children}
      </main>
      <Footer />
      <div className="h-20 md:hidden" aria-hidden="true" />
      {showBackToTop && <BackToTop />}
    </div>
  );
}

// Page header component for consistent titles
interface PageHeaderProps {
  title: string;
  description?: string;
  className?: string;
  eyebrow?: string;
  meta?: ReactNode;
}

export function PageHeader({
  title,
  description,
  className,
  eyebrow,
  meta,
}: PageHeaderProps) {
  return (
    <div
      className={cn(
        "mb-5 border-b border-[var(--border-soft)] pb-5 sm:mb-8 sm:pb-8",
        className
      )}
    >
      <div className="min-w-0">
        {(eyebrow || meta) && (
            <div className="mb-3 flex items-center justify-between gap-3 sm:mb-4">
            {eyebrow && (
              <p className="min-w-0 truncate font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--accent)] sm:text-[11px]">
                {eyebrow}
              </p>
            )}
          {meta && (
            <div className="flex shrink-0 items-center gap-1.5 font-mono text-[9px] font-semibold uppercase tracking-[0.1em] text-neutral-500 dark:text-neutral-400 sm:rounded-full sm:border sm:border-[var(--border-soft)] sm:bg-[var(--surface)] sm:px-3 sm:py-2 sm:text-[10px]">
              {meta}
            </div>
          )}
          </div>
        )}
        <h1 className="text-2xl font-bold tracking-tight leading-tight text-[var(--brand)] dark:text-white sm:text-3xl">
          {title}
        </h1>
        {description && (
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-neutral-600 dark:text-neutral-400 sm:mt-4 sm:text-base">
            {description}
          </p>
        )}
      </div>
    </div>
  );
}

// Loading state for pages
interface PageLoadingProps {
  className?: string;
}

export function PageLoading({ className }: PageLoadingProps) {
  return (
    <PageLayout showBackToTop={false} mainClassName={className}>
      <div className="mb-6 space-y-3" aria-hidden="true">
        <Skeleton className="h-7 w-40" /><Skeleton className="h-3 w-64 max-w-full" />
      </div>
      <div className="story-list" role="status" aria-label="Loading stories">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="flex gap-4 border-b border-[var(--border-soft)] px-4 py-5 last:border-0" aria-hidden="true">
            <Skeleton className="h-4 w-5 shrink-0" />
            <div className="min-w-0 flex-1 space-y-3">
              <Skeleton className="h-5 w-4/5" /><Skeleton className="h-3 w-1/2" /><Skeleton className="h-4 w-24" />
            </div>
          </div>
        ))}
      </div>
    </PageLayout>
  );
}

// Error state for pages
interface PageErrorProps {
  message?: string;
  className?: string;
}

export function PageError({ message = "Something went wrong. Please try again later.", className }: PageErrorProps) {
  return (
    <div className={cn(
      "rounded-lg border border-red-200 bg-red-50 p-4 text-sm sm:text-base text-red-800",
      "dark:border-red-800 dark:bg-red-950 dark:text-red-200",
      className
    )}>
      {message}
    </div>
  );
}
