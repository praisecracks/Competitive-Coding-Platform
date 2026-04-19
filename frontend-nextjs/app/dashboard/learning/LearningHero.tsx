"use client";

import { Clock, Heart, Star, Play, BookOpen, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";
import { useTheme } from "@/app/context/ThemeContext";

type LearningHeroProps = {
  path: {
    title: string;
    subtitle: string;
    difficulty: string;
    category: string;
    readTime: string;
    likes: number;
    rating: number;
    completedSteps: number;
    totalSteps: number;
    coverImage: string;
    nextLesson?: string;
  };
  isCompleted?: boolean;
  onViewCurriculum?: () => void;
  onContinue?: () => void;
};

export default function LearningHero({ path, isCompleted, onViewCurriculum, onContinue }: LearningHeroProps) {
  const { theme } = useTheme();
  const isLight = theme === "light";

  const progressPercentage =
    path.totalSteps > 0
      ? Math.round((path.completedSteps / path.totalSteps) * 100)
      : 0;

  return (
    <section
      className={`relative overflow-hidden border-b min-h-[46vh] sm:min-h-0 ${
        isLight
          ? "border-gray-200 bg-gray-50"
          : "border-white/10 bg-[#242424]"
      }`}
    >
      {/* Background */}
      <div className="absolute inset-0">
        <img
          src={path.coverImage}
          alt=""
          className={`h-full w-full object-cover ${
            isLight
              ? "opacity-25 blur-[1px]"
              : "opacity-20 blur-sm"
          }`}
        />

        {/* ✅ FIXED: Proper gradient blending instead of flat white */}
        <div
          className={`absolute inset-0 ${
            isLight
              ? "bg-gradient-to-r from-white/95 via-white/85 to-white/60"
              : "bg-gradient-to-r from-[#0a0a0a] via-[#0a0a0a]/80 to-transparent"
          }`}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-10 lg:px-6 lg:py-12">
        {/* Breadcrumb */}
        <div
          className={`mb-3 text-[11px] tracking-wide sm:mb-4 sm:text-xs ${
            isLight ? "text-gray-500" : "text-gray-500"
          }`}
        >
          Learning / {path.category}
        </div>

        <div className="grid gap-4 sm:gap-6 lg:grid-cols-2 lg:gap-10 lg:items-center">
          {/* LEFT */}
          <div>
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <span
                className={`rounded-md px-2.5 py-1 text-[9px] font-bold sm:px-3 sm:text-[10px] ${
                  isLight
                    ? path.difficulty === "Beginner"
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                      : path.difficulty === "Intermediate"
                      ? "bg-amber-50 text-amber-700 border border-amber-200"
                      : "bg-rose-50 text-rose-700 border border-rose-200"
                    : path.difficulty === "Beginner"
                    ? "bg-emerald-500/20 text-emerald-400"
                    : path.difficulty === "Intermediate"
                    ? "bg-amber-500/20 text-amber-400"
                    : "bg-rose-500/20 text-rose-400"
                }`}
              >
                {path.difficulty}
              </span>

              <span
                className={`text-[10px] uppercase tracking-wider sm:text-xs ${
                  isLight ? "text-pink-600" : "text-pink-400"
                }`}
              >
                {path.category}
              </span>
            </div>

            <h1
              className={`mt-4 max-w-[14ch] text-[2rem] font-bold leading-[1.02] sm:mt-5 sm:max-w-none sm:text-4xl lg:text-5xl ${
                isLight ? "text-gray-900" : "text-white"
              }`}
            >
              {path.title}
            </h1>

            <p
              className={`mt-3 max-w-md text-sm leading-6 sm:mt-4 sm:max-w-xl sm:text-base lg:text-lg ${
                isLight ? "text-gray-600" : "text-gray-400"
              }`}
            >
              {path.subtitle}
            </p>

            <div
              className={`mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs sm:mt-6 sm:gap-6 sm:text-sm ${
                isLight ? "text-gray-500" : "text-gray-400"
              }`}
            >
              <div className="flex items-center gap-1.5 sm:gap-2">
                <Clock className="h-4 w-4" />
                {path.readTime}
              </div>

              <div className="flex items-center gap-1.5 sm:gap-2">
                <Heart
                  className={`h-4 w-4 ${
                    isLight ? "text-rose-500" : "text-rose-400"
                  }`}
                />
                {path.likes}
              </div>

              <div className="flex items-center gap-1.5 sm:gap-2">
                <Star
                  className={`h-4 w-4 ${
                    isLight ? "text-amber-500" : "text-amber-400"
                  }`}
                />
                {path.rating.toFixed(1)}
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div
            className={`rounded-2xl border p-4 backdrop-blur-xl sm:p-5 lg:p-6 ${
              isLight
                ? "border-gray-200 bg-white/90 shadow-[0_14px_34px_rgba(15,23,42,0.06)]"
                : "border-white/10 bg-white/5"
            }`}
          >
            <div
              className={`mb-2 flex items-center justify-between text-xs sm:text-sm ${
                isLight ? "text-gray-500" : "text-gray-400"
              }`}
            >
              <span>Progress</span>
              <span>{progressPercentage}%</span>
            </div>

            <div
              className={`h-2 w-full overflow-hidden rounded-full ${
                isLight ? "bg-gray-100" : "bg-white/10"
              }`}
            >
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progressPercentage}%` }}
                transition={{ duration: 1 }}
                className="h-full bg-gradient-to-r from-pink-500 to-purple-500"
              />
            </div>

            <p
              className={`mt-2.5 text-xs sm:mt-3 sm:text-sm ${
                isLight ? "text-gray-500" : "text-gray-400"
              }`}
            >
              {path.completedSteps} of {path.totalSteps} lessons completed
            </p>

            <div
              className={`mt-4 rounded-xl border p-3 sm:mt-5 sm:p-4 lg:mt-6 ${
                isLight
                  ? "border-gray-200 bg-gray-50"
                  : "border-white/5 bg-white/5"
              }`}
            >
              <p
                className={`mb-1 text-[10px] sm:text-xs ${
                  isLight ? "text-gray-500" : "text-gray-500"
                }`}
              >
                Next Lesson
              </p>
              <p
                className={`text-sm font-semibold sm:text-base ${
                  isLight ? "text-gray-900" : "text-white"
                }`}
              >
                {path.nextLesson || "Continue Learning"}
              </p>
            </div>

            <button 
              onClick={onContinue}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 py-2.5 text-sm font-semibold text-white transition hover:opacity-90 sm:mt-5 sm:py-3 lg:mt-6"
            >
              {isCompleted ? (
                <>
                  <CheckCircle className="h-4 w-4" />
                  Learning Completed
                </>
              ) : (
                <>
                  <Play className="h-4 w-4" />
                  Continue Learning
                </>
              )}
            </button>

            <button
              onClick={onViewCurriculum}
              className={`mt-2.5 flex w-full items-center justify-center gap-2 rounded-xl border py-2.5 text-sm transition sm:mt-3 sm:py-3 ${
                isLight
                  ? "border-gray-200 bg-gray-50 text-gray-700 hover:bg-gray-100"
                  : "border-white/10 text-gray-300 hover:bg-white/5"
              }`}
            >
              <BookOpen className="h-4 w-4" />
              View Curriculum
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}