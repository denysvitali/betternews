import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "BetterNews",
  description: "BetterNews - The best news aggregator",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
