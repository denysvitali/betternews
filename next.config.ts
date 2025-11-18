import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // output: 'export', // Commented out for now - will handle static export differently
  // Uncomment and set basePath if deploying to a subdirectory (e.g., GitHub Pages project site)
  // basePath: '/betternews',
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
