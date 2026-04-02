"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "../../components/dashboard/header";
import Footer from "../../components/dashboard/footer";
import Link from "next/link";

interface SocialPost {
  id: string;
  type: "submission" | "achievement" | "leaderboard";
  user: {
    id: string;
    username: string;
    profile_pic?: string;
  };
  action: string;
  details: string;
  challenge?: {
    id: string;
    title: string;
  };
  timestamp: string;
}

export default function SocialFeedPage() {
  const router = useRouter();
  const [posts, setPosts] = useState<SocialPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("terminal_token");
    if (!token) {
      router.push("/login");
      return;
    }

    // Simulate loading social feed from API
    const loadFeed = async () => {
      try {
        setLoading(true);
        // TODO: Replace with actual API call to fetch social feed
        // For now, showing mock data structure
        const mockPosts: SocialPost[] = [
          {
            id: "1",
            type: "submission",
            user: {
              id: "user1",
              username: "CodeMaster92",
            },
            action: "solved",
            details: "Just crushed it!",
            challenge: {
              id: "ch1",
              title: "Two Sum",
            },
            timestamp: "2 hours ago",
          },
          {
            id: "2",
            type: "leaderboard",
            user: {
              id: "user2",
              username: "AlgoGuru",
            },
            action: "climbed to",
            details: "#5 on Global Leaderboard",
            timestamp: "4 hours ago",
          },
          {
            id: "3",
            type: "achievement",
            user: {
              id: "user3",
              username: "DevNinja",
            },
            action: "unlocked",
            details: "Speed Demon Badge - Solved 3 challenges in 24 hours",
            timestamp: "1 day ago",
          },
        ];
        setPosts(mockPosts);
      } catch (err) {
        setError("Failed to load social feed");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadFeed();
  }, [router]);

  const getPostIcon = (type: string) => {
    switch (type) {
      case "submission":
        return "✓";
      case "achievement":
        return "★";
      case "leaderboard":
        return "🏆";
      default:
        return "•";
    }
  };

  const getPostColor = (type: string) => {
    switch (type) {
      case "submission":
        return "from-emerald-500/20 to-emerald-600/10";
      case "achievement":
        return "from-yellow-500/20 to-yellow-600/10";
      case "leaderboard":
        return "from-purple-500/20 to-purple-600/10";
      default:
        return "from-gray-500/20 to-gray-600/10";
    }
  };

  return (
    <div className="min-h-screen bg-[#020202]">
      <Header />

      <main className="pt-20 pb-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
              Social Feed
            </h1>
            <p className="text-gray-400">
              Stay updated with achievements and submissions from the community
            </p>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center py-16">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-pink-500/30 border-t-pink-500"></div>
              <p className="ml-4 text-gray-400">Loading social feed...</p>
            </div>
          )}

          {/* Error State */}
          {error && !loading && (
            <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-4">
              <p className="text-red-400">{error}</p>
            </div>
          )}

          {/* Feed Posts */}
          {!loading && posts.length > 0 && (
            <div className="space-y-4">
              {posts.map((post) => (
                <div
                  key={post.id}
                  className={`rounded-xl border border-white/10 bg-gradient-to-r ${getPostColor(
                    post.type
                  )} p-6 transition hover:border-white/20 hover:bg-white/5`}
                >
                  {/* Post Header */}
                  <div className="flex items-start gap-4">
                    {/* Avatar & Icon */}
                    <div className="relative flex-shrink-0">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg border border-white/10 bg-gradient-to-br from-pink-500/20 to-purple-500/20">
                        {post.user.profile_pic ? (
                          <img
                            src={post.user.profile_pic}
                            alt={post.user.username}
                            className="h-full w-full rounded-lg object-cover"
                          />
                        ) : (
                          <span className="text-sm font-bold text-pink-400">
                            {post.user.username.charAt(0).toUpperCase()}
                          </span>
                        )}
                      </div>
                      {/* Type Icon */}
                      <div className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-pink-500 text-xs font-bold text-white">
                        {getPostIcon(post.type)}
                      </div>
                    </div>

                    {/* Post Content */}
                    <div className="flex-1 min-w-0">
                      <p className="text-white">
                        <Link
                          href={`/dashboard/leaderboard?user=${post.user.id}`}
                          className="font-semibold hover:text-pink-400 transition"
                        >
                          {post.user.username}
                        </Link>
                        {" "}
                        <span className="text-gray-300">{post.action}</span>
                        {post.challenge ? (
                          <>
                            {" "}
                            <Link
                              href={`/dashboard/challenges/${post.challenge.id}`}
                              className="font-semibold text-purple-400 hover:text-purple-300 transition"
                            >
                              {post.challenge.title}
                            </Link>
                          </>
                        ) : (
                          <>
                            {" "}
                            <span className="font-semibold text-yellow-400">
                              {post.details}
                            </span>
                          </>
                        )}
                      </p>

                      {/* Timestamp */}
                      <p className="text-xs text-gray-500 mt-2">{post.timestamp}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Empty State */}
          {!loading && posts.length === 0 && !error && (
            <div className="rounded-xl border border-white/10 bg-white/5 p-12 text-center">
              <svg
                className="mx-auto h-12 w-12 text-gray-600 mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M12 8v4m0 4v.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p className="text-gray-500">No social feed available yet</p>
              <p className="text-sm text-gray-600 mt-2">Start solving challenges to see activity</p>
            </div>
          )}

          {/* Call to Action */}
          <div className="mt-12 pt-8 border-t border-white/10 text-center">
            <p className="text-gray-400 mb-4">Ready to join the community?</p>
            <Link
              href="/dashboard/challenges"
              className="inline-block px-6 py-3 rounded-lg bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 transition text-white font-semibold shadow-lg"
            >
              Solve Your First Challenge →
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
