import { ReactNode } from "react";
import { Navbar } from "@/components/Navbar";
import { BottomNav } from "@/components/BottomNav";
import { Footer } from "@/components/Footer";
import { BackToTop } from "@/components/BackToTop";
import { cn } from "@/lib/utils";
import { Skeleton, SkeletonText } from "./Skeleton";
import { Card } from "./Card";

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
      <div className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-[radial-gradient(circle_at_top,rgba(245,121,32,0.16),transparent_60%)] dark:bg-[radial-gradient(circle_at_top,rgba(245,121,32,0.12),transparent_60%)]" />
      <Navbar />
      <main className={cn(
        "container relative mx-auto flex max-w-5xl flex-1 px-4 py-6 sm:max-w-4xl sm:px-6 sm:py-8",
        mainClassName
      )}>
        {children}
      </main>
      <Footer />
      {showBackToTop && <BackToTop />}
      {/* Mobile bottom navigation - only visible on small screens */}
      <BottomNav />
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
        "glass-panel relative mb-6 overflow-hidden rounded-[1.8rem] border border-[var(--border-soft)] px-5 py-5 shadow-[0_18px_50px_rgba(15,23,42,0.08)] sm:mb-8 sm:px-7 sm:py-7",
        className
      )}
    >
      <div className="pointer-events-none absolute inset-y-0 right-0 w-40 bg-[radial-gradient(circle_at_center,rgba(245,121,32,0.18),transparent_70%)]" />
      <div className="relative flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-2xl">
          {eyebrow && (
            <p className="mb-2 font-mono text-[11px] uppercase tracking-[0.28em] text-orange-600 dark:text-orange-400">
              {eyebrow}
            </p>
          )}
          <h1 className="text-3xl font-semibold tracking-[-0.04em] text-neutral-950 dark:text-white sm:text-4xl">
            {title}
          </h1>
          {description && (
            <p className="mt-2 max-w-xl text-sm leading-6 text-neutral-600 dark:text-neutral-300 sm:text-base">
              {description}
            </p>
          )}
        </div>
        {meta && (
          <div className="flex flex-wrap items-center gap-2 text-xs text-neutral-600 dark:text-neutral-300">
            {meta}
          </div>
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
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <Card key={i} variant="default" padding="sm" className="overflow-hidden">
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-6 pt-1">
                <Skeleton className="h-5 w-6" />
              </div>
              <div className="flex-1 min-w-0 space-y-2">
                <Skeleton className="h-5 w-3/4" />
                <div className="flex flex-wrap items-center gap-2">
                  <Skeleton className="h-3 w-16" />
                  <Skeleton className="h-3 w-12" />
                  <Skeleton className="h-3 w-20" />
                </div>
                <SkeletonText lines={2} className="mt-3" />
                <div className="flex items-center gap-2 pt-1">
                  <Skeleton className="h-6 w-12" />
                  <Skeleton className="h-6 w-12" />
                </div>
              </div>
              <div className="hidden sm:flex flex-shrink-0 items-start">
                <Skeleton className="h-20 w-28 rounded-lg" />
              </div>
            </div>
            <div className="sm:hidden mt-3">
              <Skeleton className="h-32 w-full rounded-lg" />
            </div>
          </Card>
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
