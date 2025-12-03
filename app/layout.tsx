import type { Metadata } from "next";
import { ThemeProvider } from "@/components/ThemeProvider";
import { BookmarksProvider } from "@/lib/bookmarks";
import "./globals.css";

export const metadata: Metadata = {
  title: "BetterNews",
  description: "BetterNews - The best news aggregator",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "BetterNews",
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" }
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <BookmarksProvider>
            {children}
          </BookmarksProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
