import type { NextConfig } from "next";

const isGithubActions = process.env.GITHUB_ACTIONS === 'true';

const nextConfig: NextConfig = {
  output: isGithubActions ? 'export' : undefined,
  basePath: undefined, // Host at root path
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
