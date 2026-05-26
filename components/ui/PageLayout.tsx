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
      <Navbar />
      <main className={cn(
        "container relative mx-auto flex max-w-5xl flex-1 flex-col px-3 py-3 sm:px-5 sm:py-5",
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
        "mb-3 flex items-center justify-between gap-3 border-b border-[var(--border-soft)] pb-2 sm:mb-4",
        className
      )}
    >
      <div className="flex min-w-0 flex-1 flex-wrap items-baseline gap-x-2 gap-y-1">
        <div className="min-w-0">
          {eyebrow && (
            <p className="sr-only">
              {eyebrow}
            </p>
          )}
          <h1 className="text-xl font-semibold text-neutral-950 dark:text-white sm:text-2xl">
            {title}
          </h1>
        </div>
        {description && (
          <p className="hidden text-sm text-neutral-500 dark:text-neutral-400 sm:block">
            {description}
          </p>
        )}
      </div>
      {meta && (
        <div className="flex shrink-0 flex-wrap items-center gap-1.5 text-xs text-neutral-500 dark:text-neutral-400">
          {meta}
        </div>
      )}
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
