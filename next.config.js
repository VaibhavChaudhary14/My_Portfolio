/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [],
  },
  transpilePackages: ['next-mdx-remote', 'remark-math', 'rehype-katex', 'mermaid'],
};

module.exports = nextConfig;

