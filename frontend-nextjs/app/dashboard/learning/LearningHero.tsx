"use client";

import { Clock, Heart, Star, Play, BookOpen } from "lucide-react";
import { motion } from "framer-motion";

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
};

export default function LearningHero({ path }: LearningHeroProps) {
  const progressPercentage =
    path.totalSteps > 0
      ? Math.round((path.completedSteps / path.totalSteps) * 100)
      : 0;

  return (
    <section className="relative overflow-hidden border-b border-white/10 bg-[#0a0a0a] min-h-[46vh] sm:min-h-0">
      {/* Background */}
      <div className="absolute inset-0">
        <img
          src={path.coverImage}
          alt=""
          className="h-full w-full object-cover opacity-20 blur-sm"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a] via-[#0a0a0a]/80 to-transparent" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-10 lg:px-6 lg:py-12">
        {/* Breadcrumb */}
        <div className="mb-3 text-[11px] tracking-wide text-gray-500 sm:mb-4 sm:text-xs">
          Learning / {path.category}
        </div>

        <div className="grid gap-4 sm:gap-6 lg:grid-cols-2 lg:gap-10 lg:items-center">
          {/* LEFT SIDE */}
          <div>
            {/* Tags */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <span
                className={`rounded-md px-2.5 py-1 text-[9px] font-bold sm:px-3 sm:text-[10px] ${
                  path.difficulty === "Beginner"
                    ? "bg-emerald-500/20 text-emerald-400"
                    : path.difficulty === "Intermediate"
                    ? "bg-amber-500/20 text-amber-400"
                    : "bg-rose-500/20 text-rose-400"
                }`}
              >
                {path.difficulty}
              </span>

              <span className="text-[10px] uppercase tracking-wider text-pink-400 sm:text-xs">
                {path.category}
              </span>
            </div>

            {/* Title */}
            <h1 className="mt-4 max-w-[14ch] text-[2rem] font-bold leading-[1.02] text-white sm:mt-5 sm:max-w-none sm:text-4xl lg:text-5xl">
              {path.title}
            </h1>

            {/* Subtitle */}
            <p className="mt-3 max-w-md text-sm leading-6 text-gray-400 sm:mt-4 sm:max-w-xl sm:text-base lg:text-lg">
              {path.subtitle}
            </p>

            {/* Meta */}
            <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-gray-400 sm:mt-6 sm:gap-6 sm:text-sm">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <Clock className="h-4 w-4" />
                {path.readTime}
              </div>

              <div className="flex items-center gap-1.5 sm:gap-2">
                <Heart className="h-4 w-4 text-rose-400" />
                {path.likes}
              </div>

              <div className="flex items-center gap-1.5 sm:gap-2">
                <Star className="h-4 w-4 text-amber-400" />
                {path.rating.toFixed(1)}
              </div>
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-xl sm:p-5 lg:rounded-2xl lg:p-6">
            {/* Progress */}
            <div className="mb-2 flex items-center justify-between text-xs text-gray-400 sm:text-sm">
              <span>Progress</span>
              <span>{progressPercentage}%</span>
            </div>

            <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progressPercentage}%` }}
                transition={{ duration: 1 }}
                className="h-full bg-gradient-to-r from-pink-500 to-purple-500"
              />
            </div>

            {/* Steps */}
            <p className="mt-2.5 text-xs text-gray-400 sm:mt-3 sm:text-sm">
              {path.completedSteps} of {path.totalSteps} lessons completed
            </p>

            {/* Next Lesson */}
            <div className="mt-4 rounded-xl border border-white/5 bg-white/5 p-3 sm:mt-5 sm:p-4 lg:mt-6">
              <p className="mb-1 text-[10px] text-gray-500 sm:text-xs">
                Next Lesson
              </p>
              <p className="text-sm font-semibold text-white sm:text-base">
                {path.nextLesson || "Continue Learning"}
              </p>
            </div>

            {/* CTA BUTTON */}
            <button className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 py-2.5 text-sm font-semibold text-white transition hover:opacity-90 sm:mt-5 sm:py-3 lg:mt-6">
              <Play className="h-4 w-4" />
              Continue Learning
            </button>

            {/* Secondary */}
            <button className="mt-2.5 flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 py-2.5 text-sm text-gray-300 transition hover:bg-white/5 sm:mt-3 sm:py-3">
              <BookOpen className="h-4 w-4" />
              View Curriculum
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}