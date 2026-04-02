"use client";

import { useState } from "react";
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

  const difficultyStats = [
    {
      label: "Easy",
      solved: stats.easySolved,
      total: totals.easy,
      color: "from-green-500 to-emerald-500",
    },
    {
      label: "Medium",
      solved: stats.mediumSolved,
      total: totals.medium,
      color: "from-yellow-500 to-orange-500",
    },
    {
      label: "Hard",
      solved: stats.hardSolved,
      total: totals.hard,
      color: "from-red-500 to-rose-500",
    },
  ];

  const getStatusColor = (status: string) => {
    return status === "Completed" ? "text-green-400" : "text-yellow-400";
  };

  const getSubmissionKey = (
    sub: { id: number; title: string; status: string; score: number; date: string },
    index: number
  ) => {
    return `${sub.id}-${sub.title}-${sub.date}-${index}`;
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <div className="rounded-xl border border-white/10 bg-white/5 p-4">
          <p className="text-xs text-gray-500">Solved</p>
          <p className="mt-1 text-2xl font-bold text-white">{stats.totalSolved}</p>
        </div>

        <div className="rounded-xl border border-white/10 bg-white/5 p-4 transition hover:bg-white/10 group relative">
          <p className="text-xs text-gray-500 font-black uppercase tracking-widest">Won / Played</p>
          <div className="mt-1 flex items-baseline gap-1">
            <p className="text-2xl font-black text-white italic">
              {stats.challengesWon}
            </p>
            <span className="text-gray-600 font-bold">/</span>
            <p className="text-sm font-black text-gray-500">
              {stats.challengesPlayed}
            </p>
          </div>
          
          {/* Reset Stats Icon */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsResetModalOpen(true);
            }}
            className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-all p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-500 hover:text-rose-500 border border-white/5"
            title="Reset Stats"
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
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
                className="relative w-full max-w-sm overflow-hidden rounded-[32px] border border-white/10 bg-[#0d0d0d] p-8 text-center shadow-2xl"
              >
                <div className="h-16 w-16 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-2xl mx-auto mb-6">⚠️</div>
                <h3 className="text-xl font-black text-white tracking-tight uppercase">Reset Battle Stats?</h3>
                <p className="mt-3 text-xs text-gray-500 leading-relaxed font-medium">
                  This will permanently clear your <span className="text-white">Won / Played</span> record. This action cannot be undone.
                </p>
                <div className="mt-8 flex flex-col gap-3">
                  <button
                    onClick={() => {
                      onResetStats?.();
                      setIsResetModalOpen(false);
                    }}
                    className="w-full rounded-2xl bg-rose-500 py-4 text-xs font-black text-white shadow-xl shadow-rose-500/20 hover:bg-rose-600 transition-all uppercase tracking-widest"
                  >
                    Confirm Reset
                  </button>
                  <button onClick={() => setIsResetModalOpen(false)} className="w-full py-2 text-[10px] font-black text-gray-500 hover:text-white uppercase tracking-widest transition-colors">Go Back</button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        <button
          onClick={onRankClick}
          className="rounded-xl border border-white/10 bg-white/5 p-4 text-left transition hover:bg-white/10"
        >
          <p className="text-xs text-gray-500">Rank</p>
          <p className="mt-1 text-2xl font-bold text-white">#{stats.rank}</p>
        </button>

        <button
          onClick={onRankClick}
          className="rounded-xl border border-white/10 bg-white/5 p-4 text-left transition hover:bg-white/10"
        >
          <p className="text-xs text-gray-500">Points</p>
          <p className="mt-1 text-2xl font-bold text-white">{stats.totalPoints}</p>
        </button>
      </div>

      <div className="rounded-xl border border-white/10 bg-white/5 p-5">
        <h3 className="mb-4 text-sm font-semibold text-white">
          Progress by Difficulty
        </h3>

        <div className="space-y-4">
          {difficultyStats.map((diff) => {
            const percentage =
              diff.total > 0 ? (diff.solved / diff.total) * 100 : 0;

            return (
              <div key={diff.label}>
                <div className="mb-1 flex justify-between text-sm">
                  <span className="text-gray-400">{diff.label}</span>
                  <span className="text-gray-500">
                    {diff.solved}/{diff.total}
                  </span>
                </div>

                <div className="h-2 overflow-hidden rounded-full bg-white/10">
                  <div
                    className={`h-full rounded-full bg-gradient-to-r ${diff.color}`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="rounded-xl border border-white/10 bg-white/5 p-5">
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
                className="flex items-center justify-between border-b border-white/5 py-2 last:border-0"
              >
                <div>
                  <p className="text-sm text-white">{sub.title}</p>
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