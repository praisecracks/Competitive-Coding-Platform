"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
// import Header from "./../app/components/dashboard/header";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#0D0F12] text-white flex flex-col">
      {/* <Header /> */}
      
      <main className="flex-1 flex items-center justify-center px-4 py-32">
        <div className="text-center max-w-lg mx-auto">
          {/* 404 Animation */}
          <div className="mb-8">
            <h1 className="text-9xl md:text-[120px] font-black bg-gradient-to-r from-pink-500 via-purple-500 to-pink-500 bg-clip-text text-transparent animate-pulse">
              404
            </h1>
          </div>

          {/* Error Message */}
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Page Not Found
          </h2>
          
          <p className="text-gray-400 mb-8 text-lg">
            Oops! The page you're looking for doesn't exist. It might have been moved or deleted.
          </p>

          {/* Error Details */}
          <div className="mb-12 p-4 rounded-lg bg-white/5 border border-white/10">
            <p className="text-sm text-gray-500 font-mono">
              Error: Resource not available at this endpoint
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => router.back()}
              className="px-6 py-3 rounded-lg border border-white/20 bg-white/5 hover:bg-white/10 transition text-white font-medium"
            >
              ← Go Back
            </button>
            
            <Link
              href="/dashboard"
              className="px-6 py-3 rounded-lg bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 transition text-white font-semibold shadow-lg"
            >
              Dashboard  →
            </Link>
          </div>

          {/* Helpful Links */}
          <div className="mt-12 pt-8 border-t border-white/10">
            <p className="text-gray-500 mb-4 text-sm">Quick Links:</p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Link
                href="/dashboard/challenges"
                className="text-sm text-pink-400 hover:text-pink-300 transition"
              >
                Browse Challenges
              </Link>
              <span className="text-gray-600">•</span>
              <Link
                href="/dashboard/leaderboard"
                className="text-sm text-purple-400 hover:text-purple-300 transition"
              >
                Leaderboard
              </Link>
              <span className="text-gray-600">•</span>
              <Link
                href="/"
                className="text-sm text-gray-400 hover:text-gray-300 transition"
              >
                Home
              </Link>
            </div>
          </div>
        </div>
      </main>

    </div>
  );
}
