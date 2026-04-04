import type { NextConfig } from "next";
import path from "path";

const isProduction = process.env.NODE_ENV === "production";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  allowedDevOrigins: ["127.0.0.1", "localhost"],
  outputFileTracingRoot: path.join(__dirname),

  async rewrites() {
    const backendURL =
      process.env.NEXT_PUBLIC_BACKEND_URL ||
      (isProduction
        ? "https://codemaster-q9oo.onrender.com"
        : "http://127.0.0.1:8080");

    return [
      {
        source: "/api/:path*",
        destination: `${backendURL}/:path*`,
      },
    ];
  },
};

export default nextConfig;