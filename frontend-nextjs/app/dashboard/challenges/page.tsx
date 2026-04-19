"use client";

import { createPortal } from "react-dom";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { getStoredToken } from "@/lib/auth";
import { useTheme } from "../../context/ThemeContext";
import Header from "@/app/components/dashboard/header";
import Footer from "@/app/components/Footer";
import FeedbackFAB from "../../components/FeedbackFAB";
import PageFooter from "@/app/components/PageFooter";

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
const statusOptions = ["All", "Opened", "Recommended"];
const INITIAL_SECTION_LIMIT = 6;
const LOAD_MORE_STEP = 6;

export default function DashboardChallengesPage() {
  const router = useRouter();
  const { theme } = useTheme();
  const isLight = theme === "light";

  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeDifficulty, setActiveDifficulty] = useState("All");
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeStatus, setActiveStatus] = useState("All");
  const [errorMessage, setErrorMessage] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(
    null
  );
  const [mounted, setMounted] = useState(false);

  const [visibleCount, setVisibleCount] = useState(INITIAL_SECTION_LIMIT);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!showModal) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [showModal]);

  useEffect(() => {
    if (!showModal) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeChallengeModal();
      }
    };

    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, [showModal]);

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
    setVisibleCount(INITIAL_SECTION_LIMIT);
  }, [searchQuery, activeDifficulty, activeCategory, activeStatus]);

  const categories = useMemo(() => {
    const unique = [
      ...new Set(challenges.map((item) => item.category).filter(Boolean)),
    ];
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

      const matchesStatus =
        activeStatus === "All" ||
        (activeStatus === "Opened" && challenge.opened) ||
        (activeStatus === "Recommended" && !challenge.opened);

      return (
        matchesSearch &&
        matchesDifficulty &&
        matchesCategory &&
        matchesStatus
      );
    });
  }, [
    sortedChallenges,
    searchQuery,
    activeDifficulty,
    activeCategory,
    activeStatus,
  ]);

  const visibleChallenges = useMemo(() => {
    return filteredChallenges.slice(0, visibleCount);
  }, [filteredChallenges, visibleCount]);

  const learningStats = useMemo(() => {
    const openedCount = challenges.filter((challenge) => challenge.opened).length;

    return {
      total: challenges.length,
      opened: openedCount,
      recommended: challenges.length - openedCount,
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
        return isLight
          ? "border-emerald-200 bg-emerald-50 text-emerald-700"
          : "border-emerald-500/20 bg-emerald-500/10 text-emerald-300";
      case "medium":
        return isLight
          ? "border-amber-200 bg-amber-50 text-amber-700"
          : "border-amber-500/20 bg-amber-500/10 text-amber-300";
      case "hard":
        return isLight
          ? "border-rose-200 bg-rose-50 text-rose-700"
          : "border-rose-500/20 bg-rose-500/10 text-rose-300";
      default:
        return isLight
          ? "border-gray-200 bg-gray-50 text-gray-700"
          : "border-white/10 bg-white/5 text-gray-300";
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
          className={`w-full appearance-none rounded-2xl border px-4 py-3 pr-10 text-sm outline-none transition duration-200 ${
            isLight
              ? "border-gray-200 bg-white text-gray-800 hover:border-gray-300 focus:border-pink-300 focus:bg-white"
              : "border-white/10 bg-[#0c0c10] text-gray-200 hover:border-white/15 focus:border-pink-500/30 focus:bg-[#101017]"
          }`}
        >
          {options.map((option) => (
            <option
              key={option}
              value={option}
              className={isLight ? "bg-white text-gray-800" : "bg-[#0c0c10] text-gray-200"}
            >
              {option === "All" ? allLabel : option}
            </option>
          ))}
        </select>

        <span
          className={`pointer-events-none absolute inset-y-0 right-4 flex items-center text-[11px] ${
            isLight ? "text-gray-400" : "text-gray-500"
          }`}
        >
          ▼
        </span>
      </div>
    );
  };

  const renderChallengeCard = (challenge: Challenge) => {
    return (
      <article
        key={challenge.id}
        className={`group relative overflow-hidden rounded-[24px] border p-4 transition duration-300 ${
          isLight
            ? "border-gray-200 bg-white shadow-[0_10px_30px_rgba(15,23,42,0.06)] hover:border-pink-200 hover:shadow-[0_16px_40px_rgba(15,23,42,0.10)]"
            : "border-white/10 bg-[#09090c] hover:border-pink-500/20 hover:shadow-[0_0_0_1px_rgba(236,72,153,0.04),0_18px_50px_rgba(0,0,0,0.24)]"
        }`}
      >
        <div
          className={`absolute inset-x-0 top-0 h-px ${
            isLight
              ? "bg-gradient-to-r from-transparent via-gray-200 to-transparent"
              : "bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-60"
          }`}
        />

        <div className="mb-3 flex items-start justify-between gap-3">
          <div className="flex items-center gap-2">
            <span
              className={`rounded-full border px-2.5 py-1 text-[10px] ${
                isLight
                  ? "border-gray-200 bg-gray-50 text-gray-500"
                  : "border-white/10 bg-white/[0.04] text-gray-400"
              }`}
            >
              #{String(challenge.id).padStart(3, "0")}
            </span>

            {challenge.opened && (
              <span
                className={`rounded-full border px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.18em] ${
                  isLight
                    ? "border-purple-200 bg-purple-50 text-purple-700"
                    : "border-purple-500/20 bg-purple-500/10 text-purple-300"
                }`}
              >
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

        <h3
          className={`text-[1.15rem] font-semibold leading-tight tracking-tight transition ${
            isLight
              ? "text-gray-900 group-hover:text-pink-600"
              : "text-white group-hover:text-pink-100"
          }`}
        >
          {challenge.title}
        </h3>

        <p className={`mt-1.5 text-xs ${isLight ? "text-gray-500" : "text-gray-500"}`}>
          {challenge.category} • {challenge.duration} min
        </p>

        <p
          className={`mt-3 text-sm leading-6 ${
            isLight ? "text-gray-600" : "text-gray-400"
          }`}
        >
          {truncateText(challenge.description, 110)}
        </p>

        {challenge.tags?.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {challenge.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className={`rounded-full border px-2.5 py-1 text-[10px] ${
                  isLight
                    ? "border-gray-200 bg-gray-50 text-gray-700"
                    : "border-white/10 bg-white/[0.04] text-gray-300"
                }`}
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        <div className="mt-5 flex items-center gap-2.5">
          <button
            onClick={() => openChallengeModal(challenge)}
            className="flex-1 rounded-xl bg-gradient-to-r from-pink-500 to-purple-500 px-4 py-2.5 text-sm font-medium text-white transition duration-200 hover:opacity-95"
          >
            {challenge.opened ? "Continue" : "Preview"}
          </button>

          <button
            onClick={() => handleViewDetails(challenge.id)}
            className={`rounded-xl border px-4 py-2.5 text-sm transition duration-200 ${
              isLight
                ? "border-gray-200 bg-gray-50 text-gray-800 hover:bg-gray-100"
                : "border-white/10 bg-white/[0.04] text-white hover:bg-white/[0.08]"
            }`}
          >
            Details
          </button>
        </div>
      </article>
    );
  };

  const renderSection = ({
    title,
    subtitle,
    items,
    totalCount,
    visibleCount,
    onLoadMore,
  }: {
    title: string;
    subtitle: string;
    items: Challenge[];
    totalCount: number;
    visibleCount: number;
    onLoadMore: () => void;
  }) => {
    const hasMore = visibleCount < totalCount;

    return (
      <section className="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2
              className={`text-[1.85rem] font-semibold leading-tight tracking-tight ${
                isLight ? "text-gray-900" : "text-white"
              }`}
            >
              {title}
            </h2>
            <p
              className={`mt-2 max-w-2xl text-sm leading-6 ${
                isLight ? "text-gray-600" : "text-gray-400"
              }`}
            >
              {subtitle}
            </p>
          </div>

          <div className={`text-sm ${isLight ? "text-gray-500" : "text-gray-500"}`}>
            {totalCount} {totalCount === 1 ? "challenge" : "challenges"}
          </div>
        </div>

        {items.length === 0 ? (
          <div
            className={`rounded-[24px] border px-6 py-10 text-center ${
              isLight
                ? "border-gray-200 bg-white shadow-[0_10px_30px_rgba(15,23,42,0.06)]"
                : "border-white/10 bg-[#09090c]"
            }`}
          >
            <p className={`text-sm font-medium ${isLight ? "text-gray-900" : "text-white"}`}>
              No challenges found
            </p>
            <p
              className={`mx-auto mt-2 max-w-xl text-sm leading-6 ${
                isLight ? "text-gray-600" : "text-gray-400"
              }`}
            >
              Try adjusting your search or filter options.
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
              {items.map((challenge) => renderChallengeCard(challenge))}
            </div>

            {hasMore && (
              <div className="flex justify-center pt-1">
                <button
                  onClick={onLoadMore}
                  className={`rounded-xl border px-5 py-2.5 text-sm transition duration-200 ${
                    isLight
                      ? "border-gray-200 bg-white text-gray-800 hover:bg-gray-100"
                      : "border-white/10 bg-white/[0.04] text-white hover:bg-white/[0.08]"
                  }`}
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

  const challengeModal =
    mounted &&
    showModal &&
    selectedChallenge &&
    createPortal(
      <div className="fixed inset-0 z-[300]">
        <button
          type="button"
          aria-label="Close challenge preview modal"
          className={`absolute inset-0 h-screen w-screen ${
            isLight ? "bg-slate-900/30" : "bg-black/50"
          } backdrop-blur-md`}
          onClick={closeChallengeModal}
        />

        <div className="absolute inset-0 flex min-h-screen items-center justify-center overflow-y-auto p-4">
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Challenge preview"
            className={`relative w-full max-w-md overflow-hidden rounded-[26px] border ${
              isLight
                ? "border-gray-200 bg-white shadow-[0_24px_60px_rgba(15,23,42,0.18)]"
                : "border-white/10 bg-[#0b0b10] shadow-[0_25px_100px_rgba(0,0,0,0.45)]"
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className={`absolute inset-x-0 top-0 h-px ${
                isLight
                  ? "bg-gradient-to-r from-transparent via-pink-300 to-transparent"
                  : "bg-gradient-to-r from-transparent via-pink-500/50 to-transparent"
              }`}
            />

            <div className="p-5">
              <div className="mb-4 flex items-start justify-between gap-4">
                <div>
                  <p
                    className={`text-[11px] uppercase tracking-[0.22em] ${
                      isLight ? "text-pink-600" : "text-pink-300"
                    }`}
                  >
                    Challenge Preview
                  </p>
                  <h3
                    className={`mt-2 text-lg font-semibold leading-tight tracking-tight ${
                      isLight ? "text-gray-900" : "text-white"
                    }`}
                  >
                    {selectedChallenge.title}
                  </h3>
                </div>

                <button
                  onClick={closeChallengeModal}
                  className={`rounded-full border px-2.5 py-1 text-xs transition ${
                    isLight
                      ? "border-gray-200 text-gray-500 hover:border-gray-300 hover:text-gray-900"
                      : "border-white/10 text-gray-400 hover:border-white/20 hover:text-white"
                  }`}
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
                  <span
                    className={`rounded-full border px-3 py-1 text-[9px] font-semibold uppercase tracking-[0.18em] ${
                      isLight
                        ? "border-purple-200 bg-purple-50 text-purple-700"
                        : "border-purple-500/20 bg-purple-500/10 text-purple-300"
                    }`}
                  >
                    Opened
                  </span>
                )}

                <span
                  className={`rounded-full border px-3 py-1 text-[10px] ${
                    isLight
                      ? "border-gray-200 bg-gray-50 text-gray-700"
                      : "border-white/10 bg-white/[0.04] text-gray-300"
                  }`}
                >
                  {selectedChallenge.category}
                </span>

                <span
                  className={`rounded-full border px-3 py-1 text-[10px] ${
                    isLight
                      ? "border-gray-200 bg-gray-50 text-gray-700"
                      : "border-white/10 bg-white/[0.04] text-gray-300"
                  }`}
                >
                  {selectedChallenge.duration} min
                </span>
              </div>

              <p
                className={`text-sm leading-6 ${
                  isLight ? "text-gray-600" : "text-gray-400"
                }`}
              >
                {selectedChallenge.description}
              </p>

              {selectedChallenge.tags?.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {selectedChallenge.tags.map((tag) => (
                    <span
                      key={tag}
                      className={`rounded-full border px-2.5 py-1 text-[10px] ${
                        isLight
                          ? "border-gray-200 bg-gray-50 text-gray-700"
                          : "border-white/10 bg-white/[0.04] text-gray-300"
                      }`}
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
                  className={`rounded-xl border px-4 py-2.5 text-sm transition ${
                    isLight
                      ? "border-gray-200 bg-gray-50 text-gray-800 hover:bg-gray-100"
                      : "border-white/10 bg-white/[0.04] text-white hover:bg-white/[0.08]"
                  }`}
                >
                  Details
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>,
      document.body
    );

  return (
    <div className={`space-y-6 ${isLight ? "text-gray-900" : "text-white"}`}>
      {challengeModal}

      <section
        className={`relative overflow-hidden rounded-[28px] border px-5 py-5 sm:px-6 sm:py-6 ${
          isLight
            ? "border-gray-200 bg-white shadow-[0_12px_34px_rgba(15,23,42,0.06)]"
            : "border-white/10 bg-[#09090c]"
        }`}
      >
        <div
          className={`absolute inset-0 ${
            isLight
              ? "bg-[radial-gradient(circle_at_top_right,rgba(168,85,247,0.08),transparent_26%),radial-gradient(circle_at_left,rgba(236,72,153,0.05),transparent_24%)]"
              : "bg-[radial-gradient(circle_at_top_right,rgba(168,85,247,0.12),transparent_26%),radial-gradient(circle_at_left,rgba(236,72,153,0.08),transparent_24%)]"
          }`}
        />
        <div
          className={`absolute inset-0 ${
            isLight
              ? "opacity-[0.02] [background-image:linear-gradient(rgba(15,23,42,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(15,23,42,0.08)_1px,transparent_1px)] [background-size:28px_28px]"
              : "opacity-[0.04] [background-image:linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:28px_28px]"
          }`}
        />

        <div className="relative">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <span
                className={`inline-flex items-center rounded-full border px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] ${
                  isLight
                    ? "border-pink-200 bg-pink-50 text-pink-600"
                    : "border-pink-500/20 bg-pink-500/[0.08] text-pink-200"
                }`}
              >
                Learning workspace
              </span>

              <h1
                className={`mt-4 text-[2rem] font-semibold leading-tight tracking-tight sm:text-[2.35rem] ${
                  isLight ? "text-gray-900" : "text-white"
                }`}
              >
                Sharpen your coding mastery with focused practice
              </h1>

              <p
                className={`mt-3 max-w-xl text-sm leading-6 ${
                  isLight ? "text-gray-600" : "text-gray-400"
                }`}
              >
                Continue opened challenges and move into the next set of learning
                recommendations with a cleaner, more focused workflow.
              </p>
            </div>

            <div className="flex flex-wrap gap-2.5 lg:max-w-[360px] lg:justify-end">
              <div
                className={`min-w-[96px] rounded-2xl border px-3.5 py-3 backdrop-blur-sm ${
                  isLight
                    ? "border-gray-200 bg-gray-50"
                    : "border-white/10 bg-white/[0.03]"
                }`}
              >
                <p
                  className={`text-[10px] uppercase tracking-[0.18em] ${
                    isLight ? "text-gray-500" : "text-gray-500"
                  }`}
                >
                  Total
                </p>
                <h3
                  className={`mt-2 text-xl font-semibold ${
                    isLight ? "text-gray-900" : "text-white"
                  }`}
                >
                  {learningStats.total}
                </h3>
              </div>

              <div
                className={`min-w-[96px] rounded-2xl border px-3.5 py-3 backdrop-blur-sm ${
                  isLight
                    ? "border-purple-200 bg-purple-50"
                    : "border-purple-500/20 bg-purple-500/[0.07]"
                }`}
              >
                <p
                  className={`text-[10px] uppercase tracking-[0.18em] ${
                    isLight ? "text-purple-600/80" : "text-purple-200/80"
                  }`}
                >
                  Opened
                </p>
                <h3
                  className={`mt-2 text-xl font-semibold ${
                    isLight ? "text-gray-900" : "text-white"
                  }`}
                >
                  {learningStats.opened}
                </h3>
              </div>

              <div
                className={`min-w-[96px] rounded-2xl border px-3.5 py-3 backdrop-blur-sm ${
                  isLight
                    ? "border-pink-200 bg-pink-50"
                    : "border-pink-500/20 bg-pink-500/[0.07]"
                }`}
              >
                <p
                  className={`text-[10px] uppercase tracking-[0.18em] ${
                    isLight ? "text-pink-600/80" : "text-pink-200/80"
                  }`}
                >
                  Next
                </p>
                <h3
                  className={`mt-2 text-xl font-semibold ${
                    isLight ? "text-gray-900" : "text-white"
                  }`}
                >
                  {learningStats.recommended}
                </h3>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        className={`rounded-[26px] border p-3 sm:p-4 ${
          isLight
            ? "border-gray-200 bg-white shadow-[0_10px_30px_rgba(15,23,42,0.06)]"
            : "border-white/10 bg-[#09090c]"
        }`}
      >
        <div className="grid gap-3 lg:grid-cols-[1.35fr_0.28fr_0.28fr_0.28fr]">
          <div
            className={`flex items-center rounded-2xl border px-4 py-3 transition duration-200 ${
              isLight
                ? "border-gray-200 bg-white hover:border-gray-300 focus-within:border-pink-300"
                : "border-white/10 bg-[#0c0c10] hover:border-white/15 focus-within:border-pink-500/25"
            }`}
          >
            <span className={`mr-3 text-sm ${isLight ? "text-pink-600" : "text-pink-300"}`}>
              Search
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Title, category, description, or tags"
              className={`w-full bg-transparent text-sm outline-none ${
                isLight
                  ? "text-gray-900 placeholder:text-gray-400"
                  : "text-white placeholder:text-gray-600"
              }`}
            />
          </div>

          <CustomSelect
            value={activeStatus}
            onChange={setActiveStatus}
            options={statusOptions}
            allLabel="All status"
          />

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
        <div
          className={`rounded-[24px] border py-20 text-center ${
            isLight
              ? "border-gray-200 bg-white shadow-[0_10px_30px_rgba(15,23,42,0.06)]"
              : "border-white/10 bg-[#09090c]"
          }`}
        >
          <p className={`text-sm ${isLight ? "text-gray-500" : "text-gray-500"}`}>
            Loading your learning challenges...
          </p>
        </div>
      ) : errorMessage ? (
        <div
          className={`rounded-[24px] border px-6 py-12 text-center ${
            isLight
              ? "border-pink-200 bg-pink-50"
              : "border-pink-500/15 bg-pink-500/[0.04]"
          }`}
        >
          <p
            className={`text-sm font-medium ${
              isLight ? "text-pink-700" : "text-pink-200"
            }`}
          >
            Unable to load
          </p>
          <p
            className={`mx-auto mt-2 max-w-xl text-sm leading-6 ${
              isLight ? "text-gray-600" : "text-gray-300"
            }`}
          >
            {errorMessage}
          </p>
        </div>
      ) : (
        renderSection({
          title: "Challenges",
          subtitle: "Browse, resume, or discover your next challenge.",
          items: visibleChallenges,
          totalCount: filteredChallenges.length,
          visibleCount: visibleCount,
          onLoadMore: () => setVisibleCount((prev) => prev + LOAD_MORE_STEP),
        })
      )}
      {/* <Footer /> */}
      <FeedbackFAB />
      <PageFooter />
    </div>
  );
}