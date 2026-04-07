"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
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
const INITIAL_SECTION_LIMIT = 6;
const LOAD_MORE_STEP = 6;

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

  const [continueVisibleCount, setContinueVisibleCount] = useState(INITIAL_SECTION_LIMIT);
  const [recommendedVisibleCount, setRecommendedVisibleCount] = useState(INITIAL_SECTION_LIMIT);

  const truncateText = (text: string, maxLength: number) => {
    if (!text) return "";
    return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
  };

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

  useEffect(() => {
    setContinueVisibleCount(INITIAL_SECTION_LIMIT);
    setRecommendedVisibleCount(INITIAL_SECTION_LIMIT);
  }, [searchQuery, activeDifficulty, activeCategory]);

  const categories = useMemo(() => {
    const unique = [...new Set(challenges.map((item) => item.category).filter(Boolean))];
    return ["All", ...unique];
  }, [challenges]);

  const getDifficultyWeight = (difficulty: string) => {
    switch (difficulty?.toLowerCase()) {
      case "easy":
        return 1;
      case "medium":
        return 2;
      case "hard":
        return 3;
      default:
        return 4;
    }
  };

  const sortedChallenges = useMemo(() => {
    return [...challenges].sort((a, b) => {
      const difficultyCompare =
        getDifficultyWeight(a.difficulty) - getDifficultyWeight(b.difficulty);

      if (difficultyCompare !== 0) return difficultyCompare;
      return a.id - b.id;
    });
  }, [challenges]);

  const filteredChallenges = useMemo(() => {
    return sortedChallenges.filter((challenge) => {
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
  }, [sortedChallenges, searchQuery, activeDifficulty, activeCategory]);

  const continueLearningChallenges = useMemo(() => {
    return filteredChallenges.filter((challenge) => challenge.opened);
  }, [filteredChallenges]);

  const recommendedChallenges = useMemo(() => {
    return filteredChallenges.filter((challenge) => !challenge.opened);
  }, [filteredChallenges]);

  const visibleContinueLearningChallenges = useMemo(() => {
    return continueLearningChallenges.slice(0, continueVisibleCount);
  }, [continueLearningChallenges, continueVisibleCount]);

  const visibleRecommendedChallenges = useMemo(() => {
    return recommendedChallenges.slice(0, recommendedVisibleCount);
  }, [recommendedChallenges, recommendedVisibleCount]);

  const learningStats = useMemo(() => {
    const openedCount = challenges.filter((challenge) => challenge.opened).length;
    const notOpenedCount = challenges.length - openedCount;

    return {
      total: challenges.length,
      opened: openedCount,
      recommended: notOpenedCount,
    };
  }, [challenges]);

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
        return "border-emerald-500/20 bg-emerald-500/10 text-emerald-300";
      case "medium":
        return "border-amber-500/20 bg-amber-500/10 text-amber-300";
      case "hard":
        return "border-rose-500/20 bg-rose-500/10 text-rose-300";
      default:
        return "border-white/10 bg-white/5 text-gray-300";
    }
  };

  const CustomSelect = ({
    value,
    onChange,
    options,
    allLabel,
  }: {
    value: string;
    onChange: (value: string) => void;
    options: string[];
    allLabel: string;
  }) => {
    return (
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full appearance-none rounded-xl border border-white/10 bg-[#0d0d12] px-4 py-3 pr-10 text-sm text-gray-200 outline-none transition hover:border-white/15 focus:border-pink-500/30"
        >
          {options.map((option) => (
            <option
              key={option}
              value={option}
              className="bg-[#0d0d12] text-gray-200"
            >
              {option === "All" ? allLabel : option}
            </option>
          ))}
        </select>

        <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-xs text-gray-500">
          ▼
        </span>
      </div>
    );
  };

  const renderChallengeCard = (
    challenge: Challenge,
    variant: "continue" | "recommended" = "recommended"
  ) => {
    const isContinue = variant === "continue";

    return (
      <article
        key={challenge.id}
        className={`group rounded-2xl border p-4 transition duration-300 ${
          isContinue
            ? "border-purple-500/20 bg-[linear-gradient(180deg,rgba(168,85,247,0.08),rgba(10,10,10,0.95))] hover:border-purple-400/30"
            : "border-white/10 bg-[#0a0a0a] hover:border-pink-500/20 hover:bg-[#0c0c11]"
        }`}
      >
        <div className="mb-3 flex items-start justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[10px] text-gray-400">
              #{String(challenge.id).padStart(3, "0")}
            </span>

            {challenge.opened && (
              <span className="rounded-full border border-purple-500/20 bg-purple-500/10 px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.18em] text-purple-300">
                Opened
              </span>
            )}
          </div>

          <span
            className={`rounded-full border px-2.5 py-1 text-[10px] font-medium ${getDifficultyClasses(
              challenge.difficulty
            )}`}
          >
            {challenge.difficulty}
          </span>
        </div>

        <h3 className="text-lg font-semibold tracking-tight text-white transition group-hover:text-pink-200">
          {challenge.title}
        </h3>

        <p className="mt-1 text-xs text-gray-500">
          {challenge.category} • {challenge.duration} min
        </p>

        <p className="mt-3 text-sm leading-6 text-gray-400">
          {truncateText(challenge.description, 110)}
        </p>

        {challenge.tags?.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {challenge.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[10px] text-gray-300"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        <div className="mt-5 flex items-center gap-2.5">
          <button
            onClick={() => openChallengeModal(challenge)}
            className="flex-1 rounded-xl bg-gradient-to-r from-pink-500 to-purple-500 px-4 py-2.5 text-sm font-medium text-white transition hover:opacity-95"
          >
            {challenge.opened ? "Continue" : "Preview"}
          </button>

          <button
            onClick={() => handleViewDetails(challenge.id)}
            className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm text-white transition hover:bg-white/[0.08]"
          >
            Details
          </button>
        </div>
      </article>
    );
  };

  const renderSection = ({
    eyebrow,
    title,
    subtitle,
    items,
    totalCount,
    visibleCount,
    onLoadMore,
    variant,
    emptyTitle,
    emptyMessage,
  }: {
    eyebrow: string;
    title: string;
    subtitle: string;
    items: Challenge[];
    totalCount: number;
    visibleCount: number;
    onLoadMore: () => void;
    variant: "continue" | "recommended";
    emptyTitle: string;
    emptyMessage: string;
  }) => {
    const hasMore = visibleCount < totalCount;

    return (
      <section className="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-gray-500">
              {eyebrow}
            </p>
            <h2 className="mt-1.5 text-xl font-semibold tracking-tight text-white sm:text-2xl">
              {title}
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-400">
              {subtitle}
            </p>
          </div>

          <div className="text-sm text-gray-500">
            {totalCount} {totalCount === 1 ? "challenge" : "challenges"}
          </div>
        </div>

        {items.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-[#0a0a0a] px-6 py-10 text-center">
            <p className="text-sm font-medium text-white">{emptyTitle}</p>
            <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-gray-400">
              {emptyMessage}
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
              {items.map((challenge) => renderChallengeCard(challenge, variant))}
            </div>

            {hasMore && (
              <div className="flex justify-center pt-1">
                <button
                  onClick={onLoadMore}
                  className="rounded-xl border border-white/10 bg-white/[0.04] px-5 py-2.5 text-sm text-white transition hover:bg-white/[0.08]"
                >
                  Load More
                </button>
              </div>
            )}
          </>
        )}
      </section>
    );
  };

  return (
    <div className="space-y-6 text-white">
      {showModal && selectedChallenge && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/75 backdrop-blur-sm"
            onClick={closeChallengeModal}
          />

          <div className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-white/10 bg-[#0b0b10] shadow-[0_20px_80px_rgba(0,0,0,0.45)]">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-pink-500/50 to-transparent" />

            <div className="p-5 sm:p-6">
              <div className="mb-4 flex items-start justify-between gap-4">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.22em] text-pink-300">
                    Challenge Preview
                  </p>
                  <h3 className="mt-2 text-xl font-semibold tracking-tight text-white">
                    {selectedChallenge.title}
                  </h3>
                </div>

                <button
                  onClick={closeChallengeModal}
                  className="rounded-full border border-white/10 px-2.5 py-1 text-xs text-gray-400 transition hover:border-white/20 hover:text-white"
                >
                  ✕
                </button>
              </div>

              <div className="mb-4 flex flex-wrap gap-2">
                <span
                  className={`rounded-full border px-3 py-1 text-[10px] font-medium ${getDifficultyClasses(
                    selectedChallenge.difficulty
                  )}`}
                >
                  {selectedChallenge.difficulty}
                </span>

                {selectedChallenge.opened && (
                  <span className="rounded-full border border-purple-500/20 bg-purple-500/10 px-3 py-1 text-[9px] font-semibold uppercase tracking-[0.18em] text-purple-300">
                    Opened
                  </span>
                )}

                <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[10px] text-gray-300">
                  {selectedChallenge.category}
                </span>

                <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[10px] text-gray-300">
                  {selectedChallenge.duration} min
                </span>
              </div>

              <p className="text-sm leading-6 text-gray-400">
                {selectedChallenge.description}
              </p>

              {selectedChallenge.tags?.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {selectedChallenge.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[10px] text-gray-300"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              <div className="mt-5 flex items-center gap-2.5">
                <button
                  onClick={handleStartChallenge}
                  className="flex-1 rounded-xl bg-gradient-to-r from-pink-500 to-purple-500 px-4 py-2.5 text-sm font-medium text-white transition hover:opacity-95"
                >
                  {selectedChallenge.opened ? "Continue" : "Start"}
                </button>

                <button
                  onClick={() => handleViewDetails(selectedChallenge.id)}
                  className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm text-white transition hover:bg-white/[0.08]"
                >
                  Details
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <section className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#0a0a0a] px-5 py-5 sm:px-6 sm:py-6">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(168,85,247,0.10),transparent_28%),radial-gradient(circle_at_left,rgba(236,72,153,0.08),transparent_24%)]" />
        <div className="relative">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <p className="text-[11px] font-medium uppercase tracking-[0.24em] text-pink-300">
                Learning Workspace
              </p>
              <h1 className="mt-2 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                Sharpen your coding mastery with focused practice
              </h1>
              <p className="mt-3 max-w-xl text-sm leading-6 text-gray-400">
                Continue challenges you already opened and discover your next best learning recommendations.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-2 sm:gap-3">
              <div className="min-w-[92px] rounded-2xl border border-white/10 bg-white/[0.03] px-3 py-3 backdrop-blur-sm">
                <p className="text-[10px] uppercase tracking-[0.18em] text-gray-500">
                  Total
                </p>
                <h3 className="mt-2 text-xl font-semibold text-white">
                  {learningStats.total}
                </h3>
              </div>

              <div className="min-w-[92px] rounded-2xl border border-purple-500/20 bg-purple-500/[0.06] px-3 py-3 backdrop-blur-sm">
                <p className="text-[10px] uppercase tracking-[0.18em] text-purple-200/80">
                  Opened
                </p>
                <h3 className="mt-2 text-xl font-semibold text-white">
                  {learningStats.opened}
                </h3>
              </div>

              <div className="min-w-[92px] rounded-2xl border border-pink-500/20 bg-pink-500/[0.06] px-3 py-3 backdrop-blur-sm">
                <p className="text-[10px] uppercase tracking-[0.18em] text-pink-200/80">
                  Next
                </p>
                <h3 className="mt-2 text-xl font-semibold text-white">
                  {learningStats.recommended}
                </h3>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-white/10 bg-[#0a0a0a] p-4">
        <div className="grid gap-3 lg:grid-cols-[1.25fr_0.45fr_0.45fr]">
          <div className="flex items-center rounded-xl border border-white/10 bg-[#0d0d12] px-4 py-3 transition hover:border-white/15">
            <span className="mr-3 text-sm text-pink-300">Search</span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Title, category, description, or tags"
              className="w-full bg-transparent text-sm text-white outline-none placeholder:text-gray-600"
            />
          </div>

          <CustomSelect
            value={activeDifficulty}
            onChange={setActiveDifficulty}
            options={["All", ...difficultyOrder]}
            allLabel="All difficulties"
          />

          <CustomSelect
            value={activeCategory}
            onChange={setActiveCategory}
            options={categories}
            allLabel="All categories"
          />
        </div>
      </section>

      {loading ? (
        <div className="rounded-2xl border border-white/10 bg-[#0a0a0a] py-20 text-center">
          <p className="text-sm text-gray-500">Loading your learning challenges...</p>
        </div>
      ) : errorMessage ? (
        <div className="rounded-2xl border border-pink-500/15 bg-pink-500/[0.04] px-6 py-12 text-center">
          <p className="text-sm font-medium text-pink-200">Unable to load</p>
          <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-gray-300">
            {errorMessage}
          </p>
        </div>
      ) : (
        <>
          {renderSection({
            eyebrow: "Continue Learning",
            title: "Return to your opened challenges",
            subtitle:
              "Resume the challenges you already started without breaking your learning flow.",
            items: visibleContinueLearningChallenges,
            totalCount: continueLearningChallenges.length,
            visibleCount: continueVisibleCount,
            onLoadMore: () =>
              setContinueVisibleCount((prev) => prev + LOAD_MORE_STEP),
            variant: "continue",
            emptyTitle: "No opened challenges yet",
            emptyMessage:
              "Once you preview or start a challenge, it will appear here for quick return access.",
          })}

          {renderSection({
            eyebrow: "Learning Recommendations",
            title: "Your next recommended challenges",
            subtitle:
              "Fresh suggestions to help you continue learning and build stronger problem-solving depth.",
            items: visibleRecommendedChallenges,
            totalCount: recommendedChallenges.length,
            visibleCount: recommendedVisibleCount,
            onLoadMore: () =>
              setRecommendedVisibleCount((prev) => prev + LOAD_MORE_STEP),
            variant: "recommended",
            emptyTitle: "No recommendations found",
            emptyMessage:
              "Try adjusting your search or filter options to reveal more relevant challenges.",
          })}
        </>
      )}
    </div>
  );
}