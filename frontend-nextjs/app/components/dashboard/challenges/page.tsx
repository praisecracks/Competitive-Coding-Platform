// app/(authenticated)/challenges/page.tsx
"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { getStoredToken } from "@/lib/auth";

type Challenge = {
  id: number;
  title: string;
  description: string;
  difficulty: string;
  category: string;
  duration: number;
  tags: string[];
  opened?: boolean;
};

const difficultyOrder = ["Easy", "Medium", "Hard"];

export default function ChallengesPage() {
  const router = useRouter();
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeDifficulty, setActiveDifficulty] = useState("All");
  const [activeCategory, setActiveCategory] = useState("All");
  const [errorMessage, setErrorMessage] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null);

  const fetchChallenges = useCallback(async () => {
    setLoading(true);
    setErrorMessage("");

    try {
      const token = getStoredToken();
      const headers: HeadersInit = {
        "Content-Type": "application/json",
      };
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const res = await fetch("/api/challenges", {
        cache: "no-store",
        headers,
      });

      if (!res.ok) {
        setChallenges([]);
        setErrorMessage("Unable to load challenges right now.");
        return;
      }

      const data = await res.json();
      setChallenges(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Challenge fetch error:", error);
      setChallenges([]);
      setErrorMessage("Backend is offline or unreachable at the moment.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchChallenges();
  }, [fetchChallenges]);

  const categories = useMemo(() => {
    const unique = [...new Set(challenges.map((c) => c.category).filter(Boolean))];
    return ["All", ...unique];
  }, [challenges]);

  const filteredChallenges = useMemo(() => {
    return challenges.filter((challenge) => {
      const q = searchQuery.toLowerCase();

      const matchesSearch =
        challenge.title.toLowerCase().includes(q) ||
        challenge.description.toLowerCase().includes(q) ||
        challenge.category.toLowerCase().includes(q) ||
        challenge.tags?.some((tag) => tag.toLowerCase().includes(q));

      const matchesDifficulty =
        activeDifficulty === "All" || challenge.difficulty === activeDifficulty;

      const matchesCategory =
        activeCategory === "All" || challenge.category === activeCategory;

      return matchesSearch && matchesDifficulty && matchesCategory;
    });
  }, [challenges, searchQuery, activeDifficulty, activeCategory]);

  const getDifficultyClasses = (difficulty: string) => {
    if (difficulty.toLowerCase() === "easy") {
      return "bg-green-500/10 text-green-400 border-green-500/20";
    }
    if (difficulty.toLowerCase() === "hard") {
      return "bg-red-500/10 text-red-400 border-red-500/20";
    }
    return "bg-yellow-500/10 text-yellow-400 border-yellow-500/20";
  };

  const openChallengeModal = (challenge: Challenge) => {
    setSelectedChallenge(challenge);
    setShowModal(true);
  };

  const handleStartChallenge = () => {
    if (!selectedChallenge) return;
    setShowModal(false);
    router.push(`/challenges/${selectedChallenge.id}`);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-white/10 rounded w-1/4 mb-4" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="h-64 bg-white/10 rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div>
        <h1 className="text-3xl font-bold text-white">Coding Challenges</h1>
        <p className="text-gray-400 mt-2">
          Practice with real-world coding problems. Choose a challenge and start solving!
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-white">{challenges.length}</p>
          <p className="text-xs text-gray-500">Total Challenges</p>
        </div>
        <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-green-400">
            {challenges.filter(c => c.difficulty === "Easy").length}
          </p>
          <p className="text-xs text-gray-500">Easy</p>
        </div>
        <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-yellow-400">
            {challenges.filter(c => c.difficulty === "Medium").length}
          </p>
          <p className="text-xs text-gray-500">Medium</p>
        </div>
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-red-400">
            {challenges.filter(c => c.difficulty === "Hard").length}
          </p>
          <p className="text-xs text-gray-500">Hard</p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="space-y-4">
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by title, category, or tags..."
            className="w-full px-4 py-3 pl-10 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-gray-500 focus:outline-none focus:border-pink-500/50"
          />
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => setActiveDifficulty("All")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeDifficulty === "All"
                ? "bg-pink-500 text-white"
                : "bg-white/5 text-gray-400 hover:bg-white/10"
            }`}
          >
            All
          </button>
          {difficultyOrder.map(diff => (
            <button
              key={diff}
              onClick={() => setActiveDifficulty(diff)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeDifficulty === diff
                  ? "bg-pink-500 text-white"
                  : "bg-white/5 text-gray-400 hover:bg-white/10"
              }`}
            >
              {diff}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap gap-2">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs transition-all ${
                activeCategory === cat
                  ? "bg-pink-500 text-white"
                  : "bg-white/5 text-gray-400 hover:bg-white/10"
              }`}
            >
              {cat === "All" ? "All Categories" : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Challenges Grid */}
      {errorMessage ? (
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-8 text-center">
          <p className="text-red-400">{errorMessage}</p>
          <button
            onClick={fetchChallenges}
            className="mt-4 px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30"
          >
            Try Again
          </button>
        </div>
      ) : filteredChallenges.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">No challenges found</p>
          <p className="text-sm text-gray-600 mt-1">Try adjusting your filters</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredChallenges.map((challenge, index) => (
            <motion.div
              key={challenge.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="group bg-white/5 border border-white/10 rounded-xl overflow-hidden hover:border-pink-500/30 hover:shadow-lg hover:shadow-pink-500/5 transition-all"
            >
              <div className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getDifficultyClasses(challenge.difficulty)}`}>
                      {challenge.difficulty}
                    </span>
                    {challenge.opened && (
                      <span className="px-2 py-1 rounded-full text-[10px] font-bold bg-purple-500/20 text-purple-400 border border-purple-500/30 uppercase tracking-wider">
                        Opened
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-gray-500">{challenge.duration} min</span>
                </div>
                
                <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-pink-400 transition-colors">
                  {challenge.title}
                </h3>
                
                <p className="text-sm text-gray-400 mb-4 line-clamp-2">
                  {challenge.description}
                </p>
                
                <div className="flex flex-wrap gap-1 mb-4">
                  {challenge.tags?.slice(0, 2).map(tag => (
                    <span key={tag} className="text-[10px] text-gray-500 bg-white/5 px-2 py-1 rounded">
                      {tag}
                    </span>
                  ))}
                </div>
                
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openChallengeModal(challenge)}
                    className="flex-1 px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white text-sm rounded-lg hover:opacity-90 transition-opacity"
                  >
                    Start Challenge
                  </button>
                  <button
                    onClick={() => router.push(`/challenges/${challenge.id}`)}
                    className="px-3 py-2 border border-white/10 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
                  >
                    Details
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Challenge Modal */}
      {showModal && selectedChallenge && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="max-w-lg w-full bg-[#0a0a0a] border border-white/10 rounded-xl overflow-hidden"
          >
            <div className="p-5 border-b border-white/10">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-semibold text-white">{selectedChallenge.title}</h3>
                  <p className="text-sm text-gray-400 mt-1">{selectedChallenge.category}</p>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-500 hover:text-white"
                >
                  ✕
                </button>
              </div>
            </div>
            
            <div className="p-5">
              <div className="flex items-center gap-3 mb-4">
                <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getDifficultyClasses(selectedChallenge.difficulty)}`}>
                  {selectedChallenge.difficulty}
                </span>
                {selectedChallenge.opened && (
                  <span className="px-2 py-1 rounded-full text-[10px] font-bold bg-purple-500/20 text-purple-400 border border-purple-500/30 uppercase tracking-wider">
                    Opened
                  </span>
                )}
                <span className="text-xs text-gray-500">{selectedChallenge.duration} minutes</span>
              </div>
              
              <p className="text-sm text-gray-300 mb-4">
                {selectedChallenge.description}
              </p>
              
              {selectedChallenge.tags && selectedChallenge.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {selectedChallenge.tags.map(tag => (
                    <span key={tag} className="px-2 py-1 bg-white/5 text-gray-400 text-xs rounded-md">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
              
              <button
                onClick={handleStartChallenge}
                className="w-full py-2.5 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
              >
                Start Solving
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}