"use client";

import { useMemo, useState, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertTriangle,
  ArrowRight,
  CalendarCheck,
  CheckCircle2,
  Flame,
  Lock,
  ShieldCheck,
  Snowflake,
  Sparkles,
  Target,
  Trophy,
  X,
} from "lucide-react";

interface Milestone {
  count: number;
  label: string;
  iconName: string;
}

interface LearningStatsHubProps {
  isLight: boolean;
  streak: number;
  completedTopics: number;
  totalTopics: number;
  trackCompletedLessons: number;
  trackTotalLessons: number;
  standaloneCompletedLessons: number;
  standaloneTotalLessons: number;
  trackProgressPercent: number;
  earnedMilestones: Milestone[];
  lastCompletedDate?: string;
  onContinueLearning?: () => void;
  onStreakIncrease?: (newStreak: number) => void;
}

type ActivePanel = "streak" | "progress" | "badges" | null;
type StreakState = "completed" | "pending" | "atRisk" | "empty";

const badgeTargets = [
  { count: 5, label: "Starter" },
  { count: 10, label: "Builder" },
  { count: 20, label: "Focused" },
  { count: 30, label: "Pro" },
];

function isSameDay(dateA: Date, dateB: Date) {
  return (
    dateA.getFullYear() === dateB.getFullYear() &&
    dateA.getMonth() === dateB.getMonth() &&
    dateA.getDate() === dateB.getDate()
  );
}

function isYesterday(date: Date, today: Date) {
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  return isSameDay(date, yesterday);
}

export default function LearningStatsHub({
  isLight,
  streak,
  completedTopics,
  totalTopics,
  trackCompletedLessons,
  trackTotalLessons,
  standaloneCompletedLessons,
  standaloneTotalLessons,
  trackProgressPercent,
  earnedMilestones,
  lastCompletedDate,
  onContinueLearning,
  onStreakIncrease,
}: LearningStatsHubProps) {
  const [activePanel, setActivePanel] = useState<ActivePanel>(null);
  const prevStreakRef = useRef(streak);

  // Combined lessons for badge calculation
  const combinedCompletedLessons = trackCompletedLessons + standaloneCompletedLessons;
  const combinedTotalLessons = trackTotalLessons + standaloneTotalLessons;

  // Notify parent when streak increases
  useEffect(() => {
    if (streak > prevStreakRef.current) {
      onStreakIncrease?.(streak);
    }
    prevStreakRef.current = streak;
  }, [streak, onStreakIncrease]);

  const streakState = useMemo<StreakState>(() => {
    if (streak <= 0) return "empty";

    if (!lastCompletedDate) return "pending";

    const today = new Date();
    const lastDate = new Date(lastCompletedDate);

    if (Number.isNaN(lastDate.getTime())) return "pending";

    if (isSameDay(lastDate, today)) return "completed";
    if (isYesterday(lastDate, today)) return "pending";

    return "atRisk";
  }, [lastCompletedDate, streak]);

  const streakCopy = {
    completed: {
      label: "Secured",
      title: "Streak secured",
      body: "You have completed your streak activity for today. Keep the engine warm and come back tomorrow.",
      short: "Streak secured for today.",
    },
    pending: {
      label: "Daily Quest",
      title: "Protect your streak",
      body: "Complete one lesson today to keep your streak alive and protect your learning momentum.",
      short: "Complete one lesson today to keep it alive.",
    },
    atRisk: {
      label: "At Risk",
      title: "Your streak is at risk",
      body: "Your streak is close to resetting. Complete one lesson now to restore your streak engine.",
      short: "Your streak is at risk. Act now.",
    },
    empty: {
      label: "Start",
      title: "Start your streak",
      body: "Complete your first lesson today and begin building your learning rhythm.",
      short: "Start your first lesson today.",
    },
  }[streakState];

   const nextBadge =
     badgeTargets.find((badge) => combinedCompletedLessons < badge.count) ||
     badgeTargets[badgeTargets.length - 1];

   const lessonsToNextBadge = Math.max(nextBadge.count - combinedCompletedLessons, 0);

  const cardBase = `group relative overflow-hidden rounded-2xl border p-3 text-left transition-all duration-300 ${
    isLight
      ? "border-gray-200 bg-white shadow-[0_10px_28px_rgba(15,23,42,0.06)] hover:border-pink-200 hover:shadow-[0_14px_36px_rgba(236,72,153,0.10)]"
      : "border-white/10 bg-[#0c0c10] shadow-[0_10px_28px_rgba(0,0,0,0.22)] hover:border-pink-500/25"
  }`;

  const mutedText = isLight ? "text-gray-600" : "text-gray-400";
  const strongText = isLight ? "text-gray-950" : "text-white";

  const getStreakIconClass = () => {
    if (streakState === "completed") {
      return isLight
        ? "bg-emerald-100 text-emerald-600"
        : "bg-emerald-500/15 text-emerald-300";
    }

    if (streakState === "atRisk") {
      return isLight
        ? "bg-sky-100 text-sky-600"
        : "bg-sky-500/15 text-sky-300";
    }

    return isLight
      ? "bg-orange-100 text-orange-500"
      : "bg-orange-500/15 text-orange-300";
  };

  const getStreakPillClass = () => {
    if (streakState === "completed") {
      return isLight
        ? "bg-emerald-50 text-emerald-700"
        : "bg-emerald-500/10 text-emerald-300";
    }

    if (streakState === "atRisk") {
      return isLight
        ? "bg-sky-50 text-sky-700"
        : "bg-sky-500/10 text-sky-300";
    }

    return isLight
      ? "bg-orange-50 text-orange-700"
      : "bg-orange-500/10 text-orange-300";
  };

  const getStreakBarClass = (active: boolean) => {
    if (!active) {
      return isLight ? "bg-gray-100" : "bg-white/10";
    }

    if (streakState === "completed") return "bg-emerald-400";
    if (streakState === "atRisk") return "bg-sky-400";

    return "bg-orange-400";
  };

  const getBadgeShellClass = (unlocked: boolean) => {
    if (unlocked) {
      return isLight
        ? "border-amber-200 bg-amber-50"
        : "border-amber-500/20 bg-amber-500/10";
    }

    return isLight
      ? "border-gray-200 bg-gray-50"
      : "border-white/10 bg-white/[0.04]";
  };

  const getBadgeIconClass = (unlocked: boolean) => {
    if (unlocked) return "bg-amber-400 text-white";

    return isLight
      ? "bg-gray-200 text-gray-400"
      : "bg-white/10 text-gray-500";
  };

  const StreakIcon = streakState === "atRisk" ? Snowflake : Flame;

  return (
    <>
      <div className="grid gap-3 lg:grid-cols-3">
        <button
          type="button"
          onClick={() => setActivePanel("streak")}
          className={cardBase}
        >
          <div className="absolute -right-5 -top-6 opacity-10">
            <StreakIcon className="h-20 w-20" />
          </div>

          <div className="flex items-start justify-between gap-3">
            <div
              className={`flex h-9 w-9 items-center justify-center rounded-xl ${getStreakIconClass()}`}
            >
              <motion.div
                animate={
                  streakState === "completed"
                    ? { scale: [1, 1.15, 1] }
                    : streakState === "atRisk"
                    ? { rotate: [-4, 4, -4] }
                    : streak > 0
                    ? { scale: [1, 1.08, 1] }
                    : undefined
                }
                transition={{ repeat: Infinity, duration: 1.4 }}
              >
                <StreakIcon className="h-[18px] w-[18px]" />
              </motion.div>
            </div>

            <span
              className={`rounded-full px-2 py-1 text-[9px] font-black uppercase tracking-wide ${getStreakPillClass()}`}
            >
              {streakCopy.label}
            </span>
          </div>

          <p
            className={`mt-3 text-[11px] font-bold uppercase tracking-wide ${
              isLight ? "text-gray-700" : "text-gray-400"
            }`}
          >
            Streak Engine
          </p>

          <div className="mt-1 flex items-end gap-1.5">
            <span className={`text-3xl font-black leading-none ${strongText}`}>
              {streak}
            </span>
            <span className={`text-xs ${mutedText}`}>days</span>
          </div>

          <div className="mt-3 flex gap-1">
            {Array.from({ length: 7 }).map((_, index) => (
              <span
                key={index}
                className={`h-1.5 flex-1 rounded-full ${getStreakBarClass(
                  index < Math.min(streak, 7)
                )}`}
              />
            ))}
          </div>

          <p className={`mt-3 text-[11px] leading-5 ${mutedText}`}>
            {streakCopy.short}
          </p>
        </button>

           <button
             type="button"
             onClick={() => setActivePanel("progress")}
             className={cardBase}
           >
             <div className="absolute -right-5 -top-6 opacity-10">
               <Target className="h-20 w-20" />
             </div>

             <div className="flex items-start justify-between gap-2">
               <div
                 className={`flex h-9 w-9 items-center justify-center rounded-xl ${
                   isLight
                     ? "bg-emerald-100 text-emerald-500"
                     : "bg-emerald-500/15 text-emerald-300"
                 }`}
               >
                 <Target className="h-[18px] w-[18px]" />
               </div>

               <span
                 className={`rounded-full px-2 py-1 text-[9px] font-black uppercase tracking-wide ${
                   isLight
                     ? "bg-emerald-50 text-emerald-700"
                     : "bg-emerald-500/10 text-emerald-300"
                 }`}
               >
                 Level {Math.max(1, Math.floor(combinedCompletedLessons / 10) + 1)}
               </span>
             </div>

             <p
               className={`mt-3 text-[11px] font-bold uppercase tracking-wide ${
                 isLight ? "text-gray-700" : "text-gray-400"
               }`}
             >
               Mission Progress
             </p>

             <div className="mt-1 flex items-end gap-1.5">
               <span
                 className={`text-3xl font-black leading-none ${strongText}`}
               >
                 {trackProgressPercent}%
               </span>
               <span className={`text-xs ${mutedText}`}>complete</span>
             </div>

             <div
               className={`mt-3 h-2 overflow-hidden rounded-full ${
                 isLight ? "bg-gray-100" : "bg-white/10"
               }`}
             >
               <motion.div
                 initial={{ width: 0 }}
                 animate={{ width: `${trackProgressPercent}%` }}
                 transition={{ duration: 0.9, ease: "easeOut" }}
                 className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-teal-400"
               />
             </div>

             <p className={`mt-3 text-[11px] leading-5 ${mutedText}`}>
               {trackCompletedLessons}/{trackTotalLessons} track lessons.
               {standaloneCompletedLessons > 0 && (
                 <span> +{standaloneCompletedLessons} standalone.</span>
               )}
             </p>
           </button>

        <button
          type="button"
          onClick={() => setActivePanel("badges")}
          className={cardBase}
        >
          <div className="absolute -right-5 -top-6 opacity-10">
            <Trophy className="h-20 w-20" />
          </div>

          <div className="flex items-start justify-between gap-3">
            <div
              className={`flex h-9 w-9 items-center justify-center rounded-xl ${
                isLight
                  ? "bg-amber-100 text-amber-500"
                  : "bg-amber-500/15 text-amber-300"
              }`}
            >
              <Trophy className="h-[18px] w-[18px]" />
            </div>

            <span
              className={`rounded-full px-2 py-1 text-[9px] font-black uppercase tracking-wide ${
                isLight
                  ? "bg-amber-50 text-amber-700"
                  : "bg-amber-500/10 text-amber-300"
              }`}
            >
              {earnedMilestones.length} Earned
            </span>
          </div>

          <p
            className={`mt-3 text-[11px] font-bold uppercase tracking-wide ${
              isLight ? "text-gray-700" : "text-gray-400"
            }`}
          >
            Achievement Vault
          </p>

          <div className="mt-2 flex gap-1.5">
            {earnedMilestones.length > 0
              ? earnedMilestones.slice(0, 4).map((badge, index) => (
                  <motion.div
                    key={`${badge.label}-${index}`}
                    whileHover={{ scale: 1.08, rotate: -2 }}
                    className={`flex h-7 w-7 items-center justify-center rounded-lg ${
                      isLight
                        ? "bg-amber-100 text-amber-600"
                        : "bg-amber-500/15 text-amber-300"
                    }`}
                  >
                    <Sparkles className="h-3.5 w-3.5" />
                  </motion.div>
                ))
              : badgeTargets.slice(0, 4).map((badge) => (
                  <div
                    key={badge.count}
                    className={`flex h-7 w-7 items-center justify-center rounded-lg ${
                      isLight
                        ? "bg-gray-100 text-gray-400"
                        : "bg-white/10 text-gray-500"
                    }`}
                    title={badge.label}
                  >
                    <Lock className="h-3.5 w-3.5" />
                  </div>
                ))}
          </div>

          <p className={`mt-3 text-[11px] leading-5 ${mutedText}`}>
            {earnedMilestones.length > 0
              ? "Learning milestones unlocked."
              : `Next: ${lessonsToNextBadge} more lesson${
                  lessonsToNextBadge === 1 ? "" : "s"
                }.`}
          </p>
        </button>
      </div>

      <AnimatePresence>
        {activePanel && (
          <motion.div
            className="fixed inset-0 z-[120] flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActivePanel(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 12 }}
              transition={{ duration: 0.18 }}
              onClick={(e) => e.stopPropagation()}
              className={`w-full max-w-xl overflow-hidden rounded-2xl border p-5 shadow-2xl ${
                isLight
                  ? "border-gray-200 bg-white"
                  : "border-white/10 bg-[#09090b]"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-pink-500">
                    Learning Insight
                  </p>

                  <h2 className={`mt-1.5 text-xl font-black ${strongText}`}>
                    {activePanel === "streak" && streakCopy.title}
                    {activePanel === "progress" && "Your mission progress"}
                    {activePanel === "badges" && "Achievement vault"}
                  </h2>
                </div>

                <button
                  type="button"
                  onClick={() => setActivePanel(null)}
                  className={`rounded-lg p-1.5 transition ${
                    isLight
                      ? "bg-gray-100 text-gray-500 hover:text-gray-900"
                      : "bg-white/10 text-gray-400 hover:text-white"
                  }`}
                  aria-label="Close learning insight"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="mt-4 space-y-3">
                {activePanel === "streak" && (
                  <>
                    <div
                      className={`rounded-xl border p-3 ${
                        streakState === "completed"
                          ? isLight
                            ? "border-emerald-100 bg-emerald-50"
                            : "border-emerald-500/10 bg-emerald-500/10"
                          : streakState === "atRisk"
                          ? isLight
                            ? "border-sky-100 bg-sky-50"
                            : "border-sky-500/10 bg-sky-500/10"
                          : isLight
                          ? "border-orange-100 bg-orange-50"
                          : "border-orange-500/10 bg-orange-500/10"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${getStreakIconClass()}`}
                        >
                          {streakState === "completed" ? (
                            <ShieldCheck className="h-[18px] w-[18px]" />
                          ) : streakState === "atRisk" ? (
                            <AlertTriangle className="h-[18px] w-[18px]" />
                          ) : (
                            <CalendarCheck className="h-[18px] w-[18px]" />
                          )}
                        </div>

                        <p className={`text-xs leading-5 ${mutedText}`}>
                          {streakCopy.body}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-7 gap-1">
                      {Array.from({ length: 7 }).map((_, index) => {
                        const active = index < Math.min(streak, 7);

                        return (
                          <div
                            key={index}
                            className={`flex h-8 items-center justify-center rounded-lg ${
                              active
                                ? streakState === "completed"
                                  ? "bg-emerald-400 text-white"
                                  : streakState === "atRisk"
                                  ? "bg-sky-400 text-white"
                                  : "bg-orange-400 text-white"
                                : isLight
                                ? "bg-gray-100 text-gray-400"
                                : "bg-white/10 text-gray-500"
                            }`}
                          >
                            {active ? (
                              <CheckCircle2 className="h-4 w-4" />
                            ) : streakState === "atRisk" ? (
                              <Snowflake className="h-4 w-4" />
                            ) : (
                              <Flame className="h-4 w-4" />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </>
                )}

                 {activePanel === "progress" && (
                   <>
                     <div
                       className={`rounded-xl border p-3 ${
                         isLight
                           ? "border-emerald-100 bg-emerald-50"
                           : "border-emerald-500/10 bg-emerald-500/10"
                       }`}
                     >
                       <p className={`text-xs leading-5 ${mutedText}`}>
                         You have completed <strong>{trackCompletedLessons}</strong> out of{" "}
                         <strong>{trackTotalLessons}</strong> track lessons ({trackProgressPercent}%){" "}
                         and <strong>{standaloneCompletedLessons}</strong> out of{" "}
                         <strong>{standaloneTotalLessons}</strong> standalone course lessons.
                         <br />
                         <strong>{completedTopics}</strong> of <strong>{totalTopics}</strong> topics completed.
                       </p>
                     </div>

                     <div
                       className={`h-3 overflow-hidden rounded-full ${
                         isLight ? "bg-gray-100" : "bg-white/10"
                       }`}
                     >
                       <motion.div
                         initial={{ width: 0 }}
                         animate={{ width: `${trackProgressPercent}%` }}
                         transition={{ duration: 1 }}
                         className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-teal-400"
                       />
                     </div>
                   </>
                 )}

                {activePanel === "badges" && (
                  <>
                    <div
                      className={`rounded-xl border p-3 ${
                        isLight
                          ? "border-amber-100 bg-amber-50"
                          : "border-amber-500/10 bg-amber-500/10"
                      }`}
                    >
                      <p className={`text-xs leading-5 ${mutedText}`}>
                        {earnedMilestones.length > 0
                          ? `You have unlocked ${earnedMilestones.length} milestone badge(s).`
                          : "Your first badge unlocks after 5 completed lessons."}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                       {badgeTargets.map((badge) => {
                         const unlocked = combinedCompletedLessons >= badge.count;

                        return (
                          <div
                            key={badge.count}
                            className={`rounded-xl border p-3 ${getBadgeShellClass(
                              unlocked
                            )}`}
                          >
                            <div className="flex items-center gap-2">
                              <div
                                className={`flex h-8 w-8 items-center justify-center rounded-lg ${getBadgeIconClass(
                                  unlocked
                                )}`}
                              >
                                {unlocked ? (
                                  <Sparkles className="h-4 w-4" />
                                ) : (
                                  <Lock className="h-3.5 w-3.5" />
                                )}
                              </div>

                              <div>
                                <p
                                  className={`text-xs font-bold ${
                                    isLight ? "text-gray-900" : "text-white"
                                  }`}
                                >
                                  {badge.label}
                                </p>
                                <p
                                  className={`text-[10px] ${
                                    isLight
                                      ? "text-gray-500"
                                      : "text-gray-400"
                                  }`}
                                >
                                  {badge.count} lessons
                                </p>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </>
                )}
              </div>

              {onContinueLearning && (
                <button
                  type="button"
                  onClick={() => {
                    setActivePanel(null);
                    onContinueLearning();
                  }}
                  className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-pink-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-pink-700"
                >
                  Continue Learning
                  <ArrowRight className="h-4 w-4" />
                </button>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}