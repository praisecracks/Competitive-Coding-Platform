"use client";

import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "../../context/ThemeContext";

interface ProgressOverviewProps {
  stats: {
    totalSolved: number;
    currentStreak: number;
    challengesWon: number;
    challengesPlayed: number;
    rank: number;
    totalPoints: number;
    easySolved: number;
    mediumSolved: number;
    hardSolved: number;
  };
  totals: {
    easy: number;
    medium: number;
    hard: number;
  };
  recentSubmissions: Array<{
    id: number;
    title: string;
    status: string;
    score: number;
    date: string;
  }>;
  onStartChallenge: () => void;
  onViewProfile: () => void;
  onRankClick?: () => void;
  onResetStats?: () => void;
}

export default function ProgressOverview({
  stats,
  totals,
  recentSubmissions,
  onStartChallenge,
  onViewProfile,
  onRankClick,
  onResetStats,
}: ProgressOverviewProps) {
  const { theme } = useTheme();
  const isLight = theme === "light";

  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  const [animatedStats, setAnimatedStats] = useState({
    totalSolved: 0,
    challengesWon: 0,
    challengesPlayed: 0,
    rank: 0,
    totalPoints: 0,
    easySolved: 0,
    mediumSolved: 0,
    hardSolved: 0,
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const previousOverflow = document.body.style.overflow;

    if (isResetModalOpen) {
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isResetModalOpen, mounted]);

  useEffect(() => {
    const animateValue = (
      start: number,
      end: number,
      key: keyof typeof animatedStats,
      duration = 900
    ) => {
      let startTime: number | null = null;

      const step = (timestamp: number) => {
        if (!startTime) startTime = timestamp;

        const progress = Math.min((timestamp - startTime) / duration, 1);
        const easedProgress =
          progress < 0.5
            ? 2 * progress * progress
            : -1 + (4 - 2 * progress) * progress;

        const value = Math.floor(start + (end - start) * easedProgress);

        setAnimatedStats((prev) => ({
          ...prev,
          [key]: value,
        }));

        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          setAnimatedStats((prev) => ({
            ...prev,
            [key]: end,
          }));
        }
      };

      requestAnimationFrame(step);
    };

    const targets = {
      totalSolved: stats.totalSolved,
      challengesWon: stats.challengesWon,
      challengesPlayed: stats.challengesPlayed,
      rank: stats.rank,
      totalPoints: stats.totalPoints,
      easySolved: stats.easySolved,
      mediumSolved: stats.mediumSolved,
      hardSolved: stats.hardSolved,
    };

    Object.entries(targets).forEach(([key, end]) => {
      const typedKey = key as keyof typeof animatedStats;

      if (animatedStats[typedKey] !== end) {
        animateValue(animatedStats[typedKey], end, typedKey);
      }
    });
  }, [stats]);

  const overallTotal = totals.easy + totals.medium + totals.hard;

  const overallPercentage =
    overallTotal > 0 ? Math.round((stats.totalSolved / overallTotal) * 100) : 0;

  const progressInsight = useMemo(() => {
    if (stats.totalSolved === 0) {
      return "Start with one Easy challenge today. Small wins build consistency.";
    }

    if (stats.easySolved > 0 && stats.mediumSolved === 0) {
      return "You are building a strong foundation. Try one Medium challenge when you feel ready.";
    }

    if (stats.mediumSolved > 0 && stats.hardSolved === 0) {
      return "Good progress. Keep improving your Medium streak before jumping into Hard challenges.";
    }

    if (overallPercentage >= 70) {
      return "You are making strong progress. Keep solving consistently to maintain momentum.";
    }

    return "Keep practicing consistently. Every solved challenge improves your problem-solving speed.";
  }, [
    stats.totalSolved,
    stats.easySolved,
    stats.mediumSolved,
    stats.hardSolved,
    overallPercentage,
  ]);

  const difficultyStats = useMemo(
    () => [
      {
        label: "Easy",
        solved: stats.easySolved,
        total: totals.easy,
        color: "from-emerald-500 to-green-400",
        trackClass: isLight ? "bg-emerald-100" : "bg-white/8",
      },
      {
        label: "Medium",
        solved: stats.mediumSolved,
        total: totals.medium,
        color: "from-amber-500 to-yellow-400",
        trackClass: isLight ? "bg-amber-100" : "bg-white/8",
      },
      {
        label: "Hard",
        solved: stats.hardSolved,
        total: totals.hard,
        color: "from-rose-500 to-red-400",
        trackClass: isLight ? "bg-rose-100" : "bg-white/8",
      },
    ],
    [
      isLight,
      stats.easySolved,
      stats.mediumSolved,
      stats.hardSolved,
      totals.easy,
      totals.medium,
      totals.hard,
    ]
  );

  const getStatusColor = (status: string) => {
    const normalized = status.toLowerCase();

    if (normalized === "completed" || normalized === "accepted") {
      return isLight ? "text-emerald-600" : "text-emerald-400";
    }

    if (normalized === "runtime_error" || normalized === "runtime error") {
      return isLight ? "text-amber-600" : "text-amber-400";
    }

    if (normalized === "rejected" || normalized === "failed") {
      return isLight ? "text-rose-600" : "text-rose-400";
    }

    return isLight ? "text-yellow-600" : "text-yellow-400";
  };

  const getSubmissionKey = (
    sub: {
      id: number;
      title: string;
      status: string;
      score: number;
      date: string;
    },
    index: number
  ) => {
    return `${sub.id}-${sub.title}-${sub.date}-${index}`;
  };

  const enhancedStatCardClass = isLight
    ? "rounded-2xl border border-gray-200 bg-white p-4 shadow-[0_8px_24px_rgba(15,23,42,0.05)] transition-all hover:-translate-y-1 hover:shadow-[0_12px_28px_rgba(15,23,42,0.1)]"
    : "rounded-2xl border border-white/10 bg-white/[0.04] p-4 transition-all hover:-translate-y-1 hover:bg-white/[0.06]";

  const panelClass = isLight
    ? "rounded-2xl border border-gray-200 bg-white p-5 shadow-[0_10px_30px_rgba(15,23,42,0.06)]"
    : "rounded-2xl border border-white/10 bg-white/[0.04] p-5";

  const resetModal =
    mounted &&
    createPortal(
      <AnimatePresence>
        {isResetModalOpen && (
          <div className="fixed inset-0 z-[200]">
            <motion.button
              type="button"
              aria-label="Close reset stats modal"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsResetModalOpen(false)}
              className={`absolute inset-0 h-screen w-screen ${
                isLight
                  ? "bg-slate-900/60 backdrop-blur-sm"
                  : "bg-black/80 backdrop-blur-md"
              }`}
            />

            <div className="absolute inset-0 flex min-h-screen items-center justify-center overflow-y-auto p-4 sm:p-6">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className={`relative w-full max-w-sm overflow-hidden rounded-[28px] border p-7 text-center ${
                  isLight
                    ? "border-gray-200 bg-white shadow-[0_24px_60px_rgba(15,23,42,0.18)]"
                    : "border-white/10 bg-[#0d0d0d] shadow-2xl"
                }`}
              >
                <div
                  className={`mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border text-2xl ${
                    isLight
                      ? "border-rose-200 bg-rose-50"
                      : "border-rose-500/20 bg-rose-500/10"
                  }`}
                >
                  ⚠️
                </div>

                <h3
                  className={`text-lg font-semibold uppercase tracking-[0.14em] ${
                    isLight ? "text-gray-900" : "text-white"
                  }`}
                >
                  Reset Battle Stats?
                </h3>

                <p
                  className={`mt-3 text-xs leading-6 ${
                    isLight ? "text-gray-600" : "text-gray-500"
                  }`}
                >
                  This will permanently clear your{" "}
                  <span className={isLight ? "text-gray-900" : "text-white"}>
                    Won / Played
                  </span>{" "}
                  record. This action cannot be undone.
                </p>

                <div className="mt-7 flex flex-col gap-3">
                  <button
                    onClick={() => {
                      onResetStats?.();
                      setIsResetModalOpen(false);
                    }}
                    className="w-full rounded-2xl bg-rose-500 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-white shadow-lg shadow-rose-500/20 transition hover:bg-rose-600"
                  >
                    Confirm Reset
                  </button>

                  <button
                    onClick={() => setIsResetModalOpen(false)}
                    className={`w-full py-2 text-[10px] font-semibold uppercase tracking-[0.18em] transition-colors ${
                      isLight
                        ? "text-gray-500 hover:text-gray-900"
                        : "text-gray-500 hover:text-white"
                    }`}
                  >
                    Go Back
                  </button>
                </div>
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>,
      document.body
    );

  return (
    <>
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <div className={enhancedStatCardClass}>
            <p
              className={`text-[11px] uppercase tracking-[0.18em] ${
                isLight ? "text-gray-500" : "text-gray-500"
              }`}
            >
              Solved
            </p>
            <p
              className={`mt-2 text-3xl font-semibold tracking-tight ${
                isLight ? "text-gray-900" : "text-white"
              }`}
            >
              {animatedStats.totalSolved}
            </p>
          </div>

          <div className={`${enhancedStatCardClass} group relative`}>
            <p
              className={`text-[11px] font-semibold uppercase tracking-[0.18em] ${
                isLight ? "text-gray-500" : "text-gray-500"
              }`}
            >
              Won / Played
            </p>

            <div className="mt-2 flex items-end gap-1.5">
              <p
                className={`text-3xl font-semibold leading-none tracking-tight ${
                  isLight ? "text-gray-900" : "text-white"
                }`}
              >
                {animatedStats.challengesWon}
              </p>
              <span
                className={`pb-1 text-sm font-medium ${
                  isLight ? "text-gray-400" : "text-gray-600"
                }`}
              >
                /
              </span>
              <p
                className={`pb-1 text-base font-medium ${
                  isLight ? "text-gray-500" : "text-gray-400"
                }`}
              >
                {animatedStats.challengesPlayed}
              </p>
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsResetModalOpen(true);
              }}
              className={`absolute bottom-3 right-3 rounded-lg border p-1.5 opacity-0 transition-all group-hover:opacity-100 ${
                isLight
                  ? "border-gray-200 bg-white text-gray-500 hover:border-gray-300 hover:bg-gray-100 hover:text-rose-500"
                  : "border-white/5 bg-white/5 text-gray-500 hover:border-white/10 hover:bg-white/10 hover:text-rose-500"
              }`}
              title="Reset Stats"
            >
              <svg
                className="h-3 w-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
            </button>
          </div>

          <button onClick={onRankClick} className={`${enhancedStatCardClass} text-left`}>
            <p
              className={`text-[11px] uppercase tracking-[0.18em] ${
                isLight ? "text-gray-500" : "text-gray-500"
              }`}
            >
              Rank
            </p>
            <p
              className={`mt-2 text-3xl font-semibold tracking-tight ${
                isLight ? "text-gray-900" : "text-white"
              }`}
            >
              #{animatedStats.rank}
            </p>
          </button>

          <button onClick={onRankClick} className={`${enhancedStatCardClass} text-left`}>
            <p
              className={`text-[11px] uppercase tracking-[0.18em] ${
                isLight ? "text-gray-500" : "text-gray-500"
              }`}
            >
              Points
            </p>
            <p
              className={`mt-2 text-3xl font-semibold tracking-tight ${
                isLight ? "text-gray-900" : "text-white"
              }`}
            >
              {animatedStats.totalPoints}
            </p>
          </button>
        </div>

        <div className={panelClass}>
          <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h3
                className={`text-sm font-semibold ${
                  isLight ? "text-gray-900" : "text-white"
                }`}
              >
                Progress Overview
              </h3>
              <p
                className={`mt-1 text-xs ${
                  isLight ? "text-gray-500" : "text-gray-500"
                }`}
              >
                Track your challenge completion across difficulty levels.
              </p>
            </div>

            <div
              className={`rounded-xl border px-3.5 py-2 ${
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
                Overall Completion
              </p>
              <div className="mt-1 flex items-center gap-2">
                <span
                  className={`text-sm font-semibold ${
                    isLight ? "text-gray-900" : "text-white"
                  }`}
                >
                  {stats.totalSolved}/{overallTotal}
                </span>
                <span className={isLight ? "text-gray-400" : "text-gray-500"}>
                  •
                </span>
                <span
                  className={`text-sm font-medium ${
                    isLight ? "text-pink-600" : "text-pink-300"
                  }`}
                >
                  {overallPercentage}%
                </span>
              </div>
            </div>
          </div>

          <div
            className={`mb-5 rounded-2xl border px-4 py-3 ${
              isLight
                ? "border-pink-100 bg-pink-50/60 text-pink-800"
                : "border-pink-500/10 bg-pink-500/[0.06] text-pink-200"
            }`}
          >
            <p className="text-xs font-semibold uppercase tracking-[0.18em]">
              Progress Insight
            </p>
            <p
              className={`mt-1 text-sm leading-6 ${
                isLight ? "text-gray-700" : "text-gray-300"
              }`}
            >
              {progressInsight}
            </p>
          </div>

          <div className="space-y-5">
            {difficultyStats.map((diff) => {
              const percentage =
                diff.total > 0 ? Math.round((diff.solved / diff.total) * 100) : 0;

              return (
                <div key={diff.label}>
                  <div className="mb-2 flex items-center justify-between">
                    <span
                      className={`text-sm font-medium ${
                        isLight ? "text-gray-700" : "text-gray-300"
                      }`}
                    >
                      {diff.label}
                    </span>

                    <div className="flex items-center gap-2 text-xs">
                      <span className={isLight ? "text-gray-500" : "text-gray-400"}>
                        {diff.solved}/{diff.total}
                      </span>
                      <span className={isLight ? "text-gray-400" : "text-gray-600"}>
                        •
                      </span>
                      <span
                        className={`font-medium ${
                          isLight ? "text-gray-700" : "text-gray-300"
                        }`}
                      >
                        {percentage}%
                      </span>
                    </div>
                  </div>

                  <div className={`relative h-2.5 overflow-hidden rounded-full ${diff.trackClass}`}>
                    <div
                      className={`absolute left-0 top-0 h-full rounded-full bg-gradient-to-r ${diff.color} transition-all duration-500`}
                      style={{ width: `${percentage}%` }}
                    />
                    <div
                      className={`absolute left-0 top-0 h-full rounded-full bg-gradient-to-r ${diff.color} opacity-25 blur-sm transition-all duration-500`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className={panelClass}>
          <div className="mb-4 flex items-center justify-between">
            <h3
              className={`text-sm font-semibold ${
                isLight ? "text-gray-900" : "text-white"
              }`}
            >
              Recent Activity
            </h3>

            <button
              onClick={() => {
                window.location.href = "/dashboard/activity";
              }}
              className={`text-xs font-medium transition-colors ${
                isLight
                  ? "text-pink-600 hover:text-pink-700"
                  : "text-pink-400 hover:text-pink-300"
              }`}
            >
              View All →
            </button>
          </div>

          <div className="flex min-h-[180px] flex-col justify-center">
            {recentSubmissions.length === 0 ? (
              <div className="flex flex-col items-center justify-center text-center">
                <div
                  className={`mb-3 flex h-12 w-12 items-center justify-center rounded-full ${
                    isLight
                      ? "bg-gray-100 text-gray-400"
                      : "bg-white/5 text-gray-500"
                  }`}
                >
                  ✦
                </div>

                <p
                  className={`text-sm font-medium ${
                    isLight ? "text-gray-900" : "text-white"
                  }`}
                >
                  No activity yet
                </p>

                <p
                  className={`mt-1 text-xs ${
                    isLight ? "text-gray-500" : "text-gray-500"
                  }`}
                >
                  Start a challenge to begin tracking progress.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {recentSubmissions.slice(0, 3).map((sub, index) => (
                  <motion.div
                    key={getSubmissionKey(sub, index)}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`group border-b pb-3 last:border-0 ${
                      isLight ? "border-gray-200" : "border-white/5"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div className="min-w-0 flex-1">
                        <p
                          className={`truncate text-sm font-medium ${
                            isLight ? "text-gray-900" : "text-white"
                          }`}
                        >
                          {sub.title}
                        </p>

                        <div className="mt-1 flex items-center gap-2 text-xs">
                          <span
                            className={
                              isLight ? "text-gray-500" : "text-gray-500"
                            }
                          >
                            {sub.date}
                          </span>

                          <span
                            className={`h-1 w-1 rounded-full ${
                              isLight ? "bg-gray-400" : "bg-gray-600"
                            }`}
                          />

                          <span className={`font-medium ${getStatusColor(sub.status)}`}>
                            {sub.status}
                          </span>
                        </div>
                      </div>

                      <div className="shrink-0 text-right">
                        <p
                          className={`text-xs font-semibold ${getStatusColor(
                            sub.status
                          )}`}
                        >
                          Score: {sub.score}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onStartChallenge}
            className="flex-1 rounded-xl bg-gradient-to-r from-pink-500 to-purple-500 py-3 font-medium text-white transition-opacity hover:opacity-90"
          >
            Practice Challenges
          </button>

          <button
            onClick={onViewProfile}
            className={`flex-1 rounded-xl border py-3 font-medium transition-colors ${
              isLight
                ? "border-gray-200 bg-white text-gray-900 hover:bg-gray-100"
                : "border-white/10 text-white hover:bg-white/5"
            }`}
          >
            View Profile
          </button>
        </div>
      </div>

      {resetModal}
    </>
  );
}
