import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  async rewrites() {
    return [
      {
        source: "/api/v1/:path*",
        destination: "/api/v1/:path*"
      },
    ];
  },
  env: {
    // API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000',
    MONGODB_URI: process.env.MONGO_URI,
  },
  allowedDevOrigins: ['local-origin.dev', '*.local-origin.dev', 'localhost', 'task-manager-rohaid.vercel.app'],
};

export default nextConfig;
