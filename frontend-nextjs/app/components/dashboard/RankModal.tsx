"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
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
  const [mounted, setMounted] = useState(false);

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

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || !isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen, mounted]);

  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[300]">
          <motion.button
            type="button"
            aria-label="Close rank modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className={`absolute inset-0 h-screen w-screen ${
              isLight
                ? "bg-slate-900/40 backdrop-blur-sm"
                : "bg-black/70 backdrop-blur-sm"
            }`}
          />

          <div className="absolute inset-0 flex min-h-screen items-center justify-center overflow-y-auto p-4">
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label="Your ranking snapshot"
              initial={{ opacity: 0, scale: 0.96, y: 14 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 14 }}
              transition={{ duration: 0.22 }}
              onClick={(e) => e.stopPropagation()}
              className={`relative w-full max-w-[380px] overflow-hidden rounded-3xl border shadow-[0_24px_80px_rgba(0,0,0,0.45)] ${
                isLight
                  ? "border-gray-200 bg-white shadow-[0_20px_55px_rgba(15,23,42,0.16)]"
                  : "border-white/10 bg-[#0b0b10]"
              }`}
            >
              <div
                className={`absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent to-transparent ${
                  isLight ? "via-pink-400" : "via-pink-500/50"
                }`}
              />

              <div
                className={`pointer-events-none absolute inset-0 ${
                  isLight
                    ? "bg-[radial-gradient(circle_at_top_right,rgba(168,85,247,0.08),transparent_28%),radial-gradient(circle_at_left,rgba(236,72,153,0.05),transparent_24%)]"
                    : "bg-[radial-gradient(circle_at_top_right,rgba(168,85,247,0.14),transparent_28%),radial-gradient(circle_at_left,rgba(236,72,153,0.08),transparent_24%)]"
                }`}
              />

              <div className="relative p-4 sm:p-5">
                <div className="mb-4 flex items-start justify-between gap-4">
                  <div>
                    <p
                      className={`text-[10px] font-semibold uppercase tracking-[0.22em] ${
                        isLight ? "text-pink-600" : "text-pink-300"
                      }`}
                    >
                      Ranking
                    </p>

                    <h2
                      className={`mt-1 text-lg font-semibold tracking-tight ${
                        isLight ? "text-gray-900" : "text-white"
                      }`}
                    >
                      Your snapshot
                    </h2>
                  </div>

                  <button
                    onClick={onClose}
                    aria-label="Close modal"
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
                  className={`rounded-2xl border px-4 py-4 ${
                    isLight
                      ? "border-pink-100 bg-gradient-to-b from-pink-50 to-white"
                      : "border-pink-500/15 bg-[linear-gradient(180deg,rgba(236,72,153,0.08),rgba(255,255,255,0.02))]"
                  }`}
                >
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p
                        className={`text-[10px] font-semibold uppercase tracking-[0.2em] ${
                          isLight ? "text-pink-600/80" : "text-pink-200/80"
                        }`}
                      >
                        Global rank
                      </p>

                      <div
                        className={`mt-1 text-4xl font-bold leading-none tracking-tight ${
                          isLight ? "text-gray-900" : "text-white"
                        }`}
                      >
                        #{safeRank}
                      </div>

                      <p
                        className={`mt-2 text-xs ${
                          isLight ? "text-gray-600" : "text-gray-400"
                        }`}
                      >
                        {safePoints} total points
                      </p>
                    </div>

                    <div
                      className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border ${
                        isLight
                          ? "border-pink-200 bg-white text-pink-600"
                          : "border-pink-500/20 bg-pink-500/10 text-pink-300"
                      }`}
                    >
                      <Trophy className="h-6 w-6" />
                    </div>
                  </div>
                </div>

                <div
                  className={`mt-4 rounded-2xl border p-4 ${
                    isLight
                      ? "border-gray-200 bg-gray-50"
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
                        Next tier progress
                      </p>

                      <p
                        className={`mt-0.5 text-xs ${
                          isLight ? "text-gray-500" : "text-gray-500"
                        }`}
                      >
                        Keep solving to climb higher.
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
                    className={`relative h-2 w-full overflow-hidden rounded-full ${
                      isLight ? "bg-gray-200" : "bg-white/[0.06]"
                    }`}
                  >
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${progressToNext}%` }}
                      transition={{ duration: 0.5, ease: "easeOut" }}
                      className="absolute left-0 top-0 h-full rounded-full bg-gradient-to-r from-pink-500 to-purple-500"
                    />
                  </div>

                  <p
                    className={`mt-2 text-right text-[11px] ${
                      isLight ? "text-gray-500" : "text-gray-500"
                    }`}
                  >
                    {safeRank > 1
                      ? `${pointsNeeded} points to next tier`
                      : "You are currently at the top tier"}
                  </p>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-2">
                  {[
                    {
                      label: "Total",
                      value: totalSolved,
                      className: isLight
                        ? "border-gray-200 bg-gray-50 text-gray-900"
                        : "border-white/10 bg-white/[0.03] text-white",
                      labelClass: isLight ? "text-gray-500" : "text-gray-500",
                    },
                    {
                      label: "Easy",
                      value: solvedStats.easy,
                      className: isLight
                        ? "border-emerald-200 bg-emerald-50 text-emerald-600"
                        : "border-emerald-500/15 bg-emerald-500/[0.05] text-emerald-300",
                      labelClass: isLight
                        ? "text-emerald-600"
                        : "text-emerald-200/80",
                    },
                    {
                      label: "Medium",
                      value: solvedStats.medium,
                      className: isLight
                        ? "border-amber-200 bg-amber-50 text-amber-600"
                        : "border-amber-500/15 bg-amber-500/[0.05] text-amber-300",
                      labelClass: isLight
                        ? "text-amber-600"
                        : "text-amber-200/80",
                    },
                    {
                      label: "Hard",
                      value: solvedStats.hard,
                      className: isLight
                        ? "border-rose-200 bg-rose-50 text-rose-600"
                        : "border-rose-500/15 bg-rose-500/[0.05] text-rose-300",
                      labelClass: isLight ? "text-rose-600" : "text-rose-200/80",
                    },
                  ].map((stat) => (
                    <div
                      key={stat.label}
                      className={`rounded-2xl border px-3 py-3 text-center ${stat.className}`}
                    >
                      <p
                        className={`text-[10px] font-semibold uppercase tracking-[0.16em] ${stat.labelClass}`}
                      >
                        {stat.label}
                      </p>
                      <p className="mt-1 text-xl font-bold">{stat.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}