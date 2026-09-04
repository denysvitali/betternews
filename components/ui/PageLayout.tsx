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
        "container relative mx-auto flex max-w-6xl flex-1 flex-col px-4 py-4 sm:px-6 sm:py-8",
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
        "mb-4 border-b border-[var(--border-soft)] pb-4 sm:mb-7 sm:pb-7",
        className
      )}
    >
      <div className="min-w-0">
        {eyebrow && (
          <p className="mb-2 font-mono text-[9px] font-semibold uppercase tracking-[0.24em] text-orange-600 dark:text-orange-400 sm:text-[10px] sm:tracking-[0.28em]">
            {eyebrow}
          </p>
        )}
        <div className="flex items-end justify-between gap-3">
          <h1 className="text-[2rem] font-semibold leading-none tracking-[-0.045em] text-[var(--brand)] dark:text-white sm:text-5xl">
            {title}
          </h1>
          {meta && (
            <div className="mb-0.5 flex shrink-0 items-center gap-1.5 rounded-full border border-[var(--border-soft)] bg-[var(--surface)] px-2.5 py-1.5 font-mono text-[9px] font-semibold uppercase tracking-[0.12em] text-neutral-500 shadow-sm dark:text-neutral-400 sm:px-3 sm:py-2 sm:text-[10px]">
              {meta}
            </div>
          )}
        </div>
        {description && (
          <p className="mt-3 max-w-xl text-[13px] leading-relaxed text-neutral-500 dark:text-neutral-400 sm:text-base">
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
