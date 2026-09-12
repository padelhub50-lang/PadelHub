/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: { ignoreDuringBuilds: true },
  experimental: {
    serverComponentsExternalPackages: ["better-sqlite3"],
  },
  // The app never uses next/image (product photos are plain <img> data URLs),
  // so fully disabling the built-in Image Optimization pipeline removes its
  // attack surface (several CVEs affect that endpoint) without needing it.
  images: { unoptimized: true },
};

export default nextConfig;
