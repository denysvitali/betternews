import type { NextConfig } from "next";

const isGithubActions = process.env.GITHUB_ACTIONS === 'true';

const nextConfig: NextConfig = {
  output: isGithubActions ? 'export' : undefined,
  basePath: isGithubActions ? '/betternews' : undefined,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
