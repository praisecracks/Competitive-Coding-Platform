"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Trophy, ChevronUp, X } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

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
  const { theme } = useTheme();
  const isLight = theme === "light";

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
            className={`absolute inset-0 w-full h-full ${
              isLight ? "bg-slate-900/50 backdrop-blur-md" : "bg-black/80 backdrop-blur-md"
            }`}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 18 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 18 }}
            transition={{ duration: 0.24 }}
            className={`relative w-full max-w-md overflow-hidden rounded-[26px] border shadow-[0_30px_100px_rgba(0,0,0,0.45)] ${
              isLight
                ? "border-gray-200 bg-white shadow-[0_20px_60px_rgba(15,23,42,0.18)]"
                : "border-white/10 bg-[#0b0b10]"
            }`}
          >
            <div
              className={`absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent to-transparent ${
                isLight
                  ? "via-pink-400"
                  : "via-pink-500/50"
              }`}
            />
            <div
              className={`absolute inset-0 ${
                isLight
                  ? "bg-[radial-gradient(circle_at_top_right,rgba(168,85,247,0.08),transparent_26%),radial-gradient(circle_at_left,rgba(236,72,153,0.05),transparent_22%)]"
                  : "bg-[radial-gradient(circle_at_top_right,rgba(168,85,247,0.12),transparent_26%),radial-gradient(circle_at_left,rgba(236,72,153,0.08),transparent_22%)]"
              }`}
            />

            <div className="relative p-5 sm:p-6">
              <div className="mb-5 flex items-start justify-between gap-4">
                <div>
                  <p
                    className={`text-[11px] font-medium uppercase tracking-[0.22em] ${
                      isLight ? "text-pink-600" : "text-pink-300"
                    }`}
                  >
                    Ranking details
                  </p>
                  <h2
                    className={`mt-2 text-lg font-semibold tracking-tight sm:text-xl ${
                      isLight ? "text-gray-900" : "text-white"
                    }`}
                  >
                    Your ranking snapshot
                  </h2>
                </div>

                <button
                  onClick={onClose}
                  className={`rounded-full border p-2 transition ${
                    isLight
                      ? "border-gray-200 text-gray-500 hover:border-gray-300 hover:bg-gray-100 hover:text-gray-900"
                      : "border-white/10 text-gray-500 hover:border-white/20 hover:bg-white/[0.05] hover:text-white"
                  }`}
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div
                className={`rounded-[24px] border px-4 py-5 text-center sm:px-5 sm:py-6 ${
                  isLight
                    ? "border-pink-100 bg-gradient-to-b from-pink-50 to-white shadow-[0_10px_24px_rgba(236,72,153,0.06)]"
                    : "border-pink-500/15 bg-[linear-gradient(180deg,rgba(236,72,153,0.08),rgba(255,255,255,0.02))]"
                }`}
              >
                <div
                  className={`mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border ${
                    isLight
                      ? "border-pink-200 bg-pink-50 text-pink-600"
                      : "border-pink-500/20 bg-pink-500/10 text-pink-300"
                  }`}
                >
                  <Trophy className="h-5 w-5" />
                </div>

                <p
                  className={`mt-3 text-[10px] font-semibold uppercase tracking-[0.24em] ${
                    isLight ? "text-pink-600/80" : "text-pink-200/80"
                  }`}
                >
                  Global rank
                </p>

                <div
                  className={`mt-2 text-5xl font-semibold leading-none tracking-tight sm:text-6xl ${
                    isLight ? "text-gray-900" : "text-white"
                  }`}
                >
                  #{safeRank}
                </div>

                <p
                  className={`mt-3 text-sm ${
                    isLight ? "text-gray-600" : "text-gray-400"
                  }`}
                >
                  {safePoints} total points earned
                </p>
              </div>

              <div
                className={`mt-5 rounded-[22px] border p-4 ${
                  isLight
                    ? "border-gray-200 bg-gray-50 shadow-[0_8px_20px_rgba(15,23,42,0.04)]"
                    : "border-white/10 bg-white/[0.03]"
                }`}
              >
                <div className="mb-3 flex items-center justify-between gap-3">
                  <div>
                    <p
                      className={`text-sm font-medium ${
                        isLight ? "text-gray-900" : "text-white"
                      }`}
                    >
                      Progress to next tier
                    </p>
                    <p
                      className={`mt-1 text-xs ${
                        isLight ? "text-gray-500" : "text-gray-500"
                      }`}
                    >
                      Keep solving challenges to climb higher.
                    </p>
                  </div>

                  <div
                    className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] font-medium ${
                      isLight
                        ? "border-gray-200 bg-white text-gray-900"
                        : "border-white/10 bg-white/[0.03] text-white"
                    }`}
                  >
                    <ChevronUp
                      className={`h-3.5 w-3.5 ${
                        isLight ? "text-pink-600" : "text-pink-300"
                      }`}
                    />
                    {Math.floor(progressToNext)}%
                  </div>
                </div>

                <div
                  className={`relative h-2.5 w-full overflow-hidden rounded-full ${
                    isLight ? "bg-gray-200" : "bg-white/[0.06]"
                  }`}
                >
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

                <p
                  className={`mt-2 text-right text-[11px] ${
                    isLight ? "text-gray-500" : "text-gray-500"
                  }`}
                >
                  {safeRank > 1
                    ? `${pointsNeeded} points needed for the next tier`
                    : "You are currently at the top tier"}
                </p>
              </div>

              <div className="mt-5 grid grid-cols-4 gap-3">
                <div
                  className={`rounded-[20px] border px-3 py-4 text-center ${
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
                  <p
                    className={`mt-2 text-lg font-semibold ${
                      isLight ? "text-gray-900" : "text-white"
                    }`}
                  >
                    {totalSolved}
                  </p>
                </div>

                <div
                  className={`rounded-[20px] border px-3 py-4 text-center ${
                    isLight
                      ? "border-emerald-200 bg-emerald-50"
                      : "border-emerald-500/15 bg-emerald-500/[0.05]"
                  }`}
                >
                  <p
                    className={`text-[10px] uppercase tracking-[0.18em] ${
                      isLight ? "text-emerald-600" : "text-emerald-200/80"
                    }`}
                  >
                    Easy
                  </p>
                  <p
                    className={`mt-2 text-lg font-semibold ${
                      isLight ? "text-emerald-600" : "text-emerald-300"
                    }`}
                  >
                    {solvedStats.easy}
                  </p>
                </div>

                <div
                  className={`rounded-[20px] border px-3 py-4 text-center ${
                    isLight
                      ? "border-amber-200 bg-amber-50"
                      : "border-amber-500/15 bg-amber-500/[0.05]"
                  }`}
                >
                  <p
                    className={`text-[10px] uppercase tracking-[0.18em] ${
                      isLight ? "text-amber-600" : "text-amber-200/80"
                    }`}
                  >
                    Medium
                  </p>
                  <p
                    className={`mt-2 text-lg font-semibold ${
                      isLight ? "text-amber-600" : "text-amber-300"
                    }`}
                  >
                    {solvedStats.medium}
                  </p>
                </div>

                <div
                  className={`rounded-[20px] border px-3 py-4 text-center ${
                    isLight
                      ? "border-rose-200 bg-rose-50"
                      : "border-rose-500/15 bg-rose-500/[0.05]"
                  }`}
                >
                  <p
                    className={`text-[10px] uppercase tracking-[0.18em] ${
                      isLight ? "text-rose-600" : "text-rose-200/80"
                    }`}
                  >
                    Hard
                  </p>
                  <p
                    className={`mt-2 text-lg font-semibold ${
                      isLight ? "text-rose-600" : "text-rose-300"
                    }`}
                  >
                    {solvedStats.hard}
                  </p>
                </div>
              </div>

              <button
                onClick={onClose}
                className={`mt-6 w-full rounded-xl border py-3 text-sm font-medium transition ${
                  isLight
                    ? "border-gray-200 bg-gray-50 text-gray-900 hover:bg-gray-100"
                    : "border-white/10 bg-white/[0.04] text-white hover:bg-white/[0.08]"
                }`}
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