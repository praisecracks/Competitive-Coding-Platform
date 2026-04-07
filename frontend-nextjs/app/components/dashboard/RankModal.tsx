"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Trophy, ChevronUp, X } from "lucide-react";

interface RankModalProps {
  isOpen: boolean;
  onClose: () => void;
  rank: number;
  points: number;
  solvedStats: {
    easy: number;
    medium: number;
    hard: number;
  };
}

export default function RankModal({
  isOpen,
  onClose,
  rank,
  points,
  solvedStats,
}: RankModalProps) {
  const safeRank = rank > 0 ? rank : 0;
  const safePoints = points > 0 ? points : 0;

  const nextTierPoints =
    safeRank > 1 ? (Math.floor(safePoints / 100) + 1) * 100 : safePoints;

  const pointsNeeded =
    safeRank > 1 ? Math.max(nextTierPoints - safePoints, 0) : 0;

  const progressToNext =
    safeRank > 1 ? Math.min(((safePoints % 100) / 100) * 100, 100) : 100;

  const totalSolved =
    solvedStats.easy + solvedStats.medium + solvedStats.hard;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 18 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 18 }}
            transition={{ duration: 0.24 }}
            className="relative w-full max-w-md overflow-hidden rounded-[26px] border border-white/10 bg-[#0b0b10] shadow-[0_30px_100px_rgba(0,0,0,0.45)]"
          >
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-pink-500/50 to-transparent" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(168,85,247,0.12),transparent_26%),radial-gradient(circle_at_left,rgba(236,72,153,0.08),transparent_22%)]" />

            <div className="relative p-5 sm:p-6">
              <div className="mb-5 flex items-start justify-between gap-4">
                <div>
                  <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-pink-300">
                    Ranking details
                  </p>
                  <h2 className="mt-2 text-lg font-semibold tracking-tight text-white sm:text-xl">
                    Your ranking snapshot
                  </h2>
                </div>

                <button
                  onClick={onClose}
                  className="rounded-full border border-white/10 p-2 text-gray-500 transition hover:border-white/20 hover:bg-white/[0.05] hover:text-white"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="rounded-[24px] border border-pink-500/15 bg-[linear-gradient(180deg,rgba(236,72,153,0.08),rgba(255,255,255,0.02))] px-4 py-5 text-center sm:px-5 sm:py-6">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-pink-500/20 bg-pink-500/10 text-pink-300">
                  <Trophy className="h-5 w-5" />
                </div>

                <p className="mt-3 text-[10px] font-semibold uppercase tracking-[0.24em] text-pink-200/80">
                  Global rank
                </p>

                <div className="mt-2 text-5xl font-semibold leading-none tracking-tight text-white sm:text-6xl">
                  #{safeRank}
                </div>

                <p className="mt-3 text-sm text-gray-400">
                  {safePoints} total points earned
                </p>
              </div>

              <div className="mt-5 rounded-[22px] border border-white/10 bg-white/[0.03] p-4">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium text-white">
                      Progress to next tier
                    </p>
                    <p className="mt-1 text-xs text-gray-500">
                      Keep solving challenges to climb higher.
                    </p>
                  </div>

                  <div className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-1 text-[11px] font-medium text-white">
                    <ChevronUp className="h-3.5 w-3.5 text-pink-300" />
                    {Math.floor(progressToNext)}%
                  </div>
                </div>

                <div className="relative h-2.5 w-full overflow-hidden rounded-full bg-white/[0.06]">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progressToNext}%` }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="absolute left-0 top-0 h-full rounded-full bg-gradient-to-r from-pink-500 to-purple-500"
                  />
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progressToNext}%` }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="absolute left-0 top-0 h-full rounded-full bg-gradient-to-r from-pink-500 to-purple-500 opacity-25 blur-sm"
                  />
                </div>

                <p className="mt-2 text-right text-[11px] text-gray-500">
                  {safeRank > 1
                    ? `${pointsNeeded} points needed for the next tier`
                    : "You are currently at the top tier"}
                </p>
              </div>

              <div className="mt-5 grid grid-cols-4 gap-3">
                <div className="rounded-[20px] border border-white/10 bg-white/[0.03] px-3 py-4 text-center">
                  <p className="text-[10px] uppercase tracking-[0.18em] text-gray-500">
                    Total
                  </p>
                  <p className="mt-2 text-lg font-semibold text-white">
                    {totalSolved}
                  </p>
                </div>

                <div className="rounded-[20px] border border-emerald-500/15 bg-emerald-500/[0.05] px-3 py-4 text-center">
                  <p className="text-[10px] uppercase tracking-[0.18em] text-emerald-200/80">
                    Easy
                  </p>
                  <p className="mt-2 text-lg font-semibold text-emerald-300">
                    {solvedStats.easy}
                  </p>
                </div>

                <div className="rounded-[20px] border border-amber-500/15 bg-amber-500/[0.05] px-3 py-4 text-center">
                  <p className="text-[10px] uppercase tracking-[0.18em] text-amber-200/80">
                    Medium
                  </p>
                  <p className="mt-2 text-lg font-semibold text-amber-300">
                    {solvedStats.medium}
                  </p>
                </div>

                <div className="rounded-[20px] border border-rose-500/15 bg-rose-500/[0.05] px-3 py-4 text-center">
                  <p className="text-[10px] uppercase tracking-[0.18em] text-rose-200/80">
                    Hard
                  </p>
                  <p className="mt-2 text-lg font-semibold text-rose-300">
                    {solvedStats.hard}
                  </p>
                </div>
              </div>

              <button
                onClick={onClose}
                className="mt-6 w-full rounded-xl border border-white/10 bg-white/[0.04] py-3 text-sm font-medium text-white transition hover:bg-white/[0.08]"
              >
                Close
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}