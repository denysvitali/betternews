import type { NextConfig } from "next";

const isGithubActions = process.env.GITHUB_ACTIONS === 'true';
const gitCommitHash = (
  process.env.NEXT_PUBLIC_GIT_COMMIT ||
  process.env.VERCEL_GIT_COMMIT_SHA ||
  process.env.GITHUB_SHA ||
  "dev"
).slice(0, 6);

const nextConfig: NextConfig = {
  output: isGithubActions ? 'export' : undefined,
  basePath: undefined, // Host at root path
  images: {
    unoptimized: true,
  },
  env: {
    NEXT_PUBLIC_GIT_COMMIT: gitCommitHash,
  },
};

export default nextConfig;
