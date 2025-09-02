import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  env: {
    MONGODB_URI: process.env.MONGODB_URI, // Make sure this matches Vercel env var name
  },
  allowedDevOrigins: ['local-origin.dev', '*.local-origin.dev', 'localhost', 'task-manager-rohaid.vercel.app'],
};

export default nextConfig;
