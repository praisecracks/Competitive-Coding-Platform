"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

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
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);

  const overallTotal = totals.easy + totals.medium + totals.hard;
  const overallPercentage =
    overallTotal > 0 ? Math.round((stats.totalSolved / overallTotal) * 100) : 0;

  const difficultyStats = useMemo(
    () => [
      {
        label: "Easy",
        solved: stats.easySolved,
        total: totals.easy,
        color: "from-emerald-500 to-green-400",
        trackColor: "bg-emerald-500/10",
      },
      {
        label: "Medium",
        solved: stats.mediumSolved,
        total: totals.medium,
        color: "from-amber-500 to-yellow-400",
        trackColor: "bg-amber-500/10",
      },
      {
        label: "Hard",
        solved: stats.hardSolved,
        total: totals.hard,
        color: "from-rose-500 to-red-400",
        trackColor: "bg-rose-500/10",
      },
    ],
    [stats.easySolved, stats.mediumSolved, stats.hardSolved, totals.easy, totals.medium, totals.hard]
  );

  const getStatusColor = (status: string) => {
    const normalized = status.toLowerCase();

    if (normalized === "completed" || normalized === "accepted") {
      return "text-emerald-400";
    }

    if (normalized === "runtime_error" || normalized === "runtime error") {
      return "text-amber-400";
    }

    if (normalized === "rejected" || normalized === "failed") {
      return "text-rose-400";
    }

    return "text-yellow-400";
  };

  const getSubmissionKey = (
    sub: { id: number; title: string; status: string; score: number; date: string },
    index: number
  ) => {
    return `${sub.id}-${sub.title}-${sub.date}-${index}`;
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
          <p className="text-[11px] uppercase tracking-[0.18em] text-gray-500">Solved</p>
          <p className="mt-2 text-3xl font-semibold tracking-tight text-white">
            {stats.totalSolved}
          </p>
        </div>

        <div className="group relative rounded-2xl border border-white/10 bg-white/[0.04] p-4 transition hover:bg-white/[0.06]">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gray-500">
            Won / Played
          </p>

          <div className="mt-2 flex items-end gap-1.5">
            <p className="text-3xl font-semibold leading-none tracking-tight text-white">
              {stats.challengesWon}
            </p>
            <span className="pb-1 text-sm font-medium text-gray-600">/</span>
            <p className="pb-1 text-base font-medium text-gray-400">
              {stats.challengesPlayed}
            </p>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsResetModalOpen(true);
            }}
            className="absolute bottom-3 right-3 opacity-0 transition-all group-hover:opacity-100 rounded-lg border border-white/5 bg-white/5 p-1.5 text-gray-500 hover:border-white/10 hover:bg-white/10 hover:text-rose-500"
            title="Reset Stats"
          >
            <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
          </button>
        </div>

        <AnimatePresence>
          {isResetModalOpen && (
            <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsResetModalOpen(false)}
                className="absolute inset-0 bg-black/80 backdrop-blur-md"
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="relative w-full max-w-sm overflow-hidden rounded-[28px] border border-white/10 bg-[#0d0d0d] p-7 text-center shadow-2xl"
              >
                <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-rose-500/20 bg-rose-500/10 text-2xl">
                  ⚠️
                </div>

                <h3 className="text-lg font-semibold uppercase tracking-[0.14em] text-white">
                  Reset Battle Stats?
                </h3>

                <p className="mt-3 text-xs leading-6 text-gray-500">
                  This will permanently clear your <span className="text-white">Won / Played</span>{" "}
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
                    className="w-full py-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-gray-500 transition-colors hover:text-white"
                  >
                    Go Back
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        <button
          onClick={onRankClick}
          className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-left transition hover:bg-white/[0.06]"
        >
          <p className="text-[11px] uppercase tracking-[0.18em] text-gray-500">Rank</p>
          <p className="mt-2 text-3xl font-semibold tracking-tight text-white">#{stats.rank}</p>
        </button>

        <button
          onClick={onRankClick}
          className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-left transition hover:bg-white/[0.06]"
        >
          <p className="text-[11px] uppercase tracking-[0.18em] text-gray-500">Points</p>
          <p className="mt-2 text-3xl font-semibold tracking-tight text-white">
            {stats.totalPoints}
          </p>
        </button>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h3 className="text-sm font-semibold text-white">Progress Overview</h3>
            <p className="mt-1 text-xs text-gray-500">
              Track your challenge completion across difficulty levels.
            </p>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2">
            <p className="text-[10px] uppercase tracking-[0.18em] text-gray-500">
              Overall Completion
            </p>
            <div className="mt-1 flex items-center gap-2">
              <span className="text-sm font-semibold text-white">
                {stats.totalSolved}/{overallTotal}
              </span>
              <span className="text-xs text-gray-500">•</span>
              <span className="text-sm font-medium text-pink-300">{overallPercentage}%</span>
            </div>
          </div>
        </div>

        <div className="space-y-5">
          {difficultyStats.map((diff) => {
            const percentage =
              diff.total > 0 ? Math.round((diff.solved / diff.total) * 100) : 0;

            return (
              <div key={diff.label}>
                <div className="mb-2 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-300">{diff.label}</span>
                  </div>

                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-gray-400">
                      {diff.solved}/{diff.total}
                    </span>
                    <span className="text-gray-600">•</span>
                    <span className="font-medium text-gray-300">{percentage}%</span>
                  </div>
                </div>

                <div className={`relative h-2.5 overflow-hidden rounded-full bg-white/8 ${diff.trackColor}`}>
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

      <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
        <h3 className="mb-4 text-sm font-semibold text-white">Recent Activity</h3>

        <div className="space-y-3">
          {recentSubmissions.length === 0 ? (
            <p className="py-4 text-center text-sm text-gray-500">
              No submissions yet. Start coding!
            </p>
          ) : (
            recentSubmissions.slice(0, 3).map((sub, index) => (
              <div
                key={getSubmissionKey(sub, index)}
                className="flex items-center justify-between border-b border-white/5 py-2.5 last:border-0"
              >
                <div>
                  <p className="text-sm font-medium text-white">{sub.title}</p>
                  <p className="text-xs text-gray-500">{sub.date}</p>
                </div>

                <div className="text-right">
                  <p className={`text-xs font-medium ${getStatusColor(sub.status)}`}>
                    {sub.status}
                  </p>
                  <p className="text-xs text-gray-500">Score: {sub.score}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="flex gap-3">
        <button
          onClick={onStartChallenge}
          className="flex-1 rounded-xl bg-gradient-to-r from-pink-500 to-purple-500 py-3 font-medium text-white transition-opacity hover:opacity-90"
        >
          Start Challenge
        </button>

        <button
          onClick={onViewProfile}
          className="flex-1 rounded-xl border border-white/10 py-3 font-medium text-white transition-colors hover:bg-white/5"
        >
          View Profile
        </button>
      </div>
    </div>
  );
}