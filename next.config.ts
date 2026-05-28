import type { NextConfig } from "next";

const repositoryOwner = process.env.GITHUB_REPOSITORY_OWNER;
const repositoryName = process.env.GITHUB_REPOSITORY?.split('/')[1];
const isGitHubActions = process.env.GITHUB_ACTIONS === 'true';
const isUserOrOrgPage = repositoryOwner && repositoryName === `${repositoryOwner}.github.io`;
const basePath = isGitHubActions && repositoryName && !isUserOrOrgPage
  ? `/${repositoryName}`
  : '';

const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  ...(basePath ? {
    basePath,
    assetPrefix: basePath,
  } : {}),
  images: {
    unoptimized: true,
  },
  /* config options here */
  webpack: (config) => {
    config.module.rules.push({
      test: /\.bib$/,
      type: 'asset/source',
    });
    return config;
  },
};

export default nextConfig;
