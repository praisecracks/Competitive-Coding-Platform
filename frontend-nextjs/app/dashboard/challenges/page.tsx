"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type Challenge = {
  id: number;
  title: string;
  description: string;
  difficulty: string;
  category: string;
  duration: number;
  tags: string[];
};

const difficultyOrder = ["Easy", "Medium", "Hard"];

export default function DashboardChallengesPage() {
  const router = useRouter();

  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeDifficulty, setActiveDifficulty] = useState("All");
  const [activeCategory, setActiveCategory] = useState("All");
  const [errorMessage, setErrorMessage] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null);

  const truncateText = (text: string, maxLength: number) => {
    if (!text) return "";
    return text.length > maxLength
      ? text.substring(0, maxLength) + "..."
      : text;
  };

  const fetchChallenges = useCallback(async () => {
    setLoading(true);
    setErrorMessage("");

    try {
      const res = await fetch("/api/challenges", {
        cache: "no-store",
      });

      if (!res.ok) {
        const errorText = await res.text().catch(() => "");
        console.error("Challenge fetch failed:", res.status, errorText);
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
    const unique = [...new Set(challenges.map((item) => item.category).filter(Boolean))];
    return ["All", ...unique];
  }, [challenges]);

  const filteredChallenges = useMemo(() => {
    return challenges.filter((challenge) => {
      const query = searchQuery.trim().toLowerCase();

      const matchesSearch =
        query === "" ||
        challenge.title.toLowerCase().includes(query) ||
        challenge.description.toLowerCase().includes(query) ||
        challenge.category.toLowerCase().includes(query) ||
        challenge.tags?.some((tag) => tag.toLowerCase().includes(query));

      const matchesDifficulty =
        activeDifficulty === "All" || challenge.difficulty === activeDifficulty;

      const matchesCategory =
        activeCategory === "All" || challenge.category === activeCategory;

      return matchesSearch && matchesDifficulty && matchesCategory;
    });
  }, [challenges, searchQuery, activeDifficulty, activeCategory]);

  const openChallengeModal = (challenge: Challenge) => {
    setSelectedChallenge(challenge);
    setShowModal(true);
  };

  const closeChallengeModal = () => {
    setShowModal(false);
    setSelectedChallenge(null);
  };

  const handleStartChallenge = () => {
    if (!selectedChallenge) return;
    closeChallengeModal();
    router.push(`/challenges/${selectedChallenge.id}?mode=solo`);
  };

  const handleViewDetails = (challengeId: number) => {
    closeChallengeModal();
    router.push(`/dashboard/challenges/${challengeId}`);
  };

  const getDifficultyClasses = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case "easy":
        return "border-green-500/20 bg-green-500/10 text-green-300";
      case "medium":
        return "border-yellow-500/20 bg-yellow-500/10 text-yellow-300";
      case "hard":
        return "border-red-500/20 bg-red-500/10 text-red-300";
      default:
        return "border-white/10 bg-white/5 text-gray-300";
    }
  };

  return (
    <div className="space-y-6 text-white">
      {showModal && selectedChallenge && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/80 backdrop-blur-md" 
            onClick={closeChallengeModal}
          />
          <div className="relative w-full max-w-2xl overflow-hidden rounded-2xl border border-white/10 bg-[#0b0b10] shadow-2xl">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-pink-500/50 to-transparent" />

            <div className="p-6 sm:p-7">
              <div className="mb-5 flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-pink-300">
                    Challenge Preview
                  </p>
                  <h3 className="mt-2 text-2xl font-semibold text-white">
                    {selectedChallenge.title}
                  </h3>
                </div>

                <button
                  onClick={closeChallengeModal}
                  className="rounded-full border border-white/10 px-3 py-1 text-sm text-gray-400 transition hover:border-white/20 hover:text-white"
                >
                  ✕
                </button>
              </div>

              <div className="mb-4 flex flex-wrap gap-2">
                <span
                  className={`rounded-full border px-3 py-1 text-xs ${getDifficultyClasses(
                    selectedChallenge.difficulty
                  )}`}
                >
                  {selectedChallenge.difficulty}
                </span>

                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-gray-300">
                  {selectedChallenge.category}
                </span>

                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-gray-300">
                  {selectedChallenge.duration} min
                </span>
              </div>

              <p className="text-sm leading-7 text-gray-400">
                {selectedChallenge.description}
              </p>

              {selectedChallenge.tags?.length > 0 && (
                <div className="mt-5 flex flex-wrap gap-2">
                  {selectedChallenge.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] text-gray-300"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <button
                  onClick={handleStartChallenge}
                  className="flex-1 rounded-xl bg-gradient-to-r from-pink-500 to-purple-500 px-5 py-3 text-sm font-medium text-white transition hover:opacity-95"
                >
                  Start Challenge
                </button>

                <button
                  onClick={() => handleViewDetails(selectedChallenge.id)}
                  className="rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm text-white transition hover:bg-white/10"
                >
                  View Details
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <section className="rounded-2xl border border-white/10 bg-[#0a0a0a] px-6 py-8 sm:px-8">
        <div className="max-w-3xl">
          <p className="text-sm text-pink-300">Challenges</p>
          <h1 className="mt-3 text-3xl font-semibold leading-tight text-white sm:text-4xl">
            Explore coding challenges inside your workspace
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-gray-400">
            Search, filter, preview, and continue your coding flow without leaving the dashboard experience.
          </p>
        </div>
      </section>

      <section className="rounded-2xl border border-white/10 bg-[#0a0a0a] p-4 sm:p-5">
        <div className="grid gap-3 lg:grid-cols-[1.25fr_0.45fr_0.45fr]">
          <div className="flex items-center rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3">
            <span className="mr-3 text-sm text-pink-300">Search</span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Title, category, description, or tags"
              className="w-full bg-transparent text-sm text-white outline-none placeholder:text-gray-600"
            />
          </div>

          <select
            value={activeDifficulty}
            onChange={(e) => setActiveDifficulty(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white outline-none"
          >
            <option value="All">All difficulties</option>
            {difficultyOrder.map((difficulty) => (
              <option key={difficulty} value={difficulty}>
                {difficulty}
              </option>
            ))}
          </select>

          <select
            value={activeCategory}
            onChange={(e) => setActiveCategory(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white outline-none"
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category === "All" ? "All categories" : category}
              </option>
            ))}
          </select>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Catalog</p>
            <h2 className="mt-1 text-2xl font-semibold text-white">
              Available challenges
            </h2>
          </div>

          <p className="text-sm text-gray-500">
            {filteredChallenges.length} shown
          </p>
        </div>

        {loading ? (
          <div className="rounded-2xl border border-white/10 bg-[#0a0a0a] py-20 text-center">
            <p className="text-sm text-gray-500">Loading challenges...</p>
          </div>
        ) : errorMessage ? (
          <div className="rounded-2xl border border-pink-500/15 bg-pink-500/[0.04] px-6 py-12 text-center">
            <p className="text-sm font-medium text-pink-200">Unable to load</p>
            <p className="mx-auto mt-2 max-w-xl text-sm leading-7 text-gray-300">
              {errorMessage}
            </p>
          </div>
        ) : filteredChallenges.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-[#0a0a0a] px-6 py-12 text-center">
            <p className="text-sm font-medium text-white">No challenges found</p>
            <p className="mx-auto mt-2 max-w-xl text-sm leading-7 text-gray-400">
              Try adjusting your search or filters.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
            {filteredChallenges.map((challenge) => (
              <article
                key={challenge.id}
                className="group rounded-2xl border border-white/10 bg-[#0a0a0a] p-5 transition hover:border-pink-500/20 hover:bg-[#0c0c11]"
              >
                <div className="mb-4 flex items-start justify-between gap-3">
                  <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] text-gray-400">
                    #{String(challenge.id).padStart(3, "0")}
                  </span>

                  <span
                    className={`rounded-full border px-3 py-1 text-[11px] ${getDifficultyClasses(
                      challenge.difficulty
                    )}`}
                  >
                    {challenge.difficulty}
                  </span>
                </div>

                <h3 className="text-xl font-semibold text-white transition group-hover:text-pink-200">
                  {challenge.title}
                </h3>

                <p className="mt-2 text-sm text-gray-500">
                  {challenge.category} • {challenge.duration} min
                </p>

                <p className="mt-4 text-sm leading-7 text-gray-400">
                  {truncateText(challenge.description, 120)}
                </p>

                {challenge.tags?.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {challenge.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] text-gray-300"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                <div className="mt-6 flex items-center gap-3">
                  <button
                    onClick={() => openChallengeModal(challenge)}
                    className="flex-1 rounded-xl bg-gradient-to-r from-pink-500 to-purple-500 px-4 py-3 text-sm font-medium text-white transition hover:opacity-95"
                  >
                    Preview
                  </button>

                  <button
                    onClick={() => handleViewDetails(challenge.id)}
                    className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white transition hover:bg-white/10"
                  >
                    Details
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}