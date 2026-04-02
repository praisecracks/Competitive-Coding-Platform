"use client";

import { motion, AnimatePresence } from "framer-motion";

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
  const nextRankPoints = rank > 1 ? (Math.floor(points / 100) + 1) * 100 : points;
  const progressToNext = rank > 1 ? ((points % 100) / 100) * 100 : 100;

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
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-md overflow-hidden rounded-2xl border border-white/10 bg-[#0d0d0d] p-6 shadow-2xl"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Ranking Details</h2>
              <button
                onClick={onClose}
                className="rounded-full p-1 text-gray-500 hover:bg-white/10 hover:text-white transition-colors"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="flex flex-col items-center justify-center py-8 bg-gradient-to-b from-pink-500/10 to-transparent rounded-xl border border-pink-500/20 mb-6">
              <div className="text-sm font-medium text-pink-400 uppercase tracking-wider mb-1">Global Rank</div>
              <div className="text-6xl font-black text-white">#{rank}</div>
              <div className="mt-4 text-gray-400 text-sm">{points} Total Points</div>
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-400">Progress to Next Level</span>
                  <span className="text-white font-medium">{Math.floor(progressToNext)}%</span>
                </div>
                <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progressToNext}%` }}
                    className="h-full bg-gradient-to-r from-pink-500 to-purple-500"
                  />
                </div>
                <p className="text-[10px] text-gray-500 mt-2 text-right">
                  {nextRankPoints - points} points needed for next tier
                </p>
              </div>

              <div className="grid grid-cols-3 gap-3 pt-4 border-t border-white/5">
                <div className="text-center">
                  <div className="text-xs text-gray-500 mb-1">Easy</div>
                  <div className="text-lg font-bold text-green-400">{solvedStats.easy}</div>
                </div>
                <div className="text-center">
                  <div className="text-xs text-gray-500 mb-1">Medium</div>
                  <div className="text-lg font-bold text-yellow-400">{solvedStats.medium}</div>
                </div>
                <div className="text-center">
                  <div className="text-xs text-gray-500 mb-1">Hard</div>
                  <div className="text-lg font-bold text-red-400">{solvedStats.hard}</div>
                </div>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-full mt-8 rounded-xl bg-white/5 py-3 text-sm font-medium text-white hover:bg-white/10 transition-colors"
            >
              Close
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
