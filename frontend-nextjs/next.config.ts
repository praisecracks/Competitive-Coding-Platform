import type { NextConfig } from "next";
import path from "path";

const isProduction = process.env.NODE_ENV === "production";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  allowedDevOrigins: [
    "127.0.0.1",
    "localhost",
    "10.104.207.174",
    "10.185.182.174",
  ],
  outputFileTracingRoot: path.join(__dirname),

  async rewrites() {
    const isProduction = process.env.NODE_ENV === "production";
    const backendURL =
      process.env.NEXT_PUBLIC_BACKEND_URL ||
      (isProduction
        ? "https://codemaster-q9oo.onrender.com"
        : "http://localhost:8080");

    return [
      {
        source: "/api/:path*",
        destination: `${backendURL}/:path*`,
      },
      {
        source: "/uploads/:path*",
        destination: `${backendURL}/uploads/:path*`,
      },
    ];
  },
};

export default nextConfig;