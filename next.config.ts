import type { NextConfig } from "next";
import { execSync } from "child_process";

const isGithubActions = process.env.GITHUB_ACTIONS === 'true';

// Get git commit hash at build time
let gitCommitHash = '';
try {
  gitCommitHash = execSync('git rev-parse HEAD').toString().trim().slice(0, 6);
} catch {
  gitCommitHash = 'dev';
}

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
