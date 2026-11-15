/**
 * 本地开发/常规部署保持 `next start` 可用；
 * GitHub Pages 构建时设置 GITHUB_PAGES=true，切换为静态导出并挂载项目路径。
 */
const isGitHubPages = process.env.GITHUB_PAGES === 'true';
const githubPagesBasePath = '/24hours-well';

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  ...(isGitHubPages
    ? {
        output: 'export',
        basePath: githubPagesBasePath,
        assetPrefix: `${githubPagesBasePath}/`,
        trailingSlash: true,
      }
    : {}),
  images: {
    // 静态导出无法使用 Next 内置图片优化服务
    ...(isGitHubPages ? { unoptimized: true } : {}),
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'images.pexels.com' },
    ],
  },
};

export default nextConfig;
