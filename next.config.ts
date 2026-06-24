import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  // Pin the workspace root. A sibling package (globs-by-backend) ships a
  // package-lock.json while this app uses yarn.lock; with two different
  // lockfiles Next infers the common parent (Globs-By) as the root, so
  // Turbopack resolves CSS `@import "tailwindcss"` from there and misses
  // this project's node_modules. __dirname keeps resolution inside the app.
  turbopack: {
    root: __dirname,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
};

export default nextConfig;
