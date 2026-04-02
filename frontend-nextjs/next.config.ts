import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  allowedDevOrigins: ["127.0.0.1", "localhost"],
  turbopack: {
    root: "C:/Users/Praisecrack/Documents/competitive-coding-platform/frontend-nextjs",
  },
  // Proxy API requests to Go backend
  async rewrites() {
    const backendURL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://127.0.0.1:8080";
    return [
      {
        source: '/api/:path*',       // frontend calls /api/challenges
        destination: `${backendURL}/:path*`, // Go backend
      },
    ];
  },
};

export default nextConfig;
