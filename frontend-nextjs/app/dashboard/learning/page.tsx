"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Clock,
  ChevronRight,
  Lock,
  ArrowRight,
  TrendingUp,
  Sparkles,
  BookOpen,
} from "lucide-react";
import { LEARNING_PATHS } from "./data";
import { useTheme } from "@/app/context/ThemeContext";

const PROGRESS_KEY = "codemaster_learning_progress_v1";

type PathStatus = "not_started" | "in_progress" | "completed" | "locked";

interface UserProgress {
  totalXp?: number;
  paths: {
    [pathId: string]: {
      completedStepIds: string[];
      liked: boolean;
      rating: number | null;
    };
  };
}

export default function LearningPage() {
  const router = useRouter();
  const { theme } = useTheme();
  const isLight = theme === "light";

  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [userProgress, setUserProgress] = useState<UserProgress>({
    paths: {},
    totalXp: 0,
  });

  useEffect(() => {
    const loadProgress = () => {
      const saved = localStorage.getItem(PROGRESS_KEY);
      if (saved) {
        try {
          setUserProgress(JSON.parse(saved));
        } catch (e) {
          console.error("Failed to parse learning progress", e);
        }
      }
    };

    loadProgress();

    const handleUpdate = () => {
      loadProgress();
    };

    window.addEventListener("codemaster-learning-updated", handleUpdate);
    return () =>
      window.removeEventListener("codemaster-learning-updated", handleUpdate);
  }, []);

  const derivedPaths = useMemo(() => {
    return LEARNING_PATHS.map((path) => {
      const progress = userProgress.paths[path.id] || {
        completedStepIds: [],
        liked: false,
        rating: null,
      };

      const completedCount = progress.completedStepIds.length;
      const totalSteps = path.steps.length;
      const progressPercentage =
        totalSteps > 0 ? Math.round((completedCount / totalSteps) * 100) : 0;

      let isUnlocked = true;
      if (path.prerequisiteIds && path.prerequisiteIds.length > 0) {
        isUnlocked = path.prerequisiteIds.every((preId) => {
          const preProgress = userProgress.paths[preId];
          const prePath = LEARNING_PATHS.find((p) => p.id === preId);
          return (
            preProgress &&
            prePath &&
            preProgress.completedStepIds.length === prePath.steps.length
          );
        });
      }

      let status: PathStatus = "not_started";
      if (!isUnlocked) status = "locked";
      else if (progressPercentage === 100) status = "completed";
      else if (progressPercentage > 0) status = "in_progress";

      return {
        ...path,
        completedSteps: completedCount,
        totalSteps,
        progressPercentage,
        status,
        isUnlocked,
        isRecommended:
          path.difficulty === "Beginner" && status === "not_started",
      };
    });
  }, [userProgress]);

  const stats = useMemo(() => {
    const totalXp = userProgress.totalXp || 0;
    const masteredCount = derivedPaths.filter(
      (p) => p.status === "completed"
    ).length;
    const inProgressCount = derivedPaths.filter(
      (p) => p.status === "in_progress"
    ).length;
    const totalSteps = derivedPaths.reduce((sum, p) => sum + p.totalSteps, 0);
    const completedSteps = derivedPaths.reduce(
      (sum, p) => sum + p.completedSteps,
      0
    );

    return {
      totalXp,
      masteredCount,
      inProgressCount,
      totalSteps,
      completedSteps,
    };
  }, [userProgress, derivedPaths]);

  const filteredPaths = derivedPaths.filter((path) => {
    const matchesSearch =
      path.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      path.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      path.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      path.difficulty.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      activeFilter === "All" || path.category === activeFilter;

    return matchesSearch && matchesCategory;
  });

  const sortedPaths = [...filteredPaths].sort((a, b) => {
    const statusPriority = {
      in_progress: 0,
      not_started: 1,
      completed: 2,
      locked: 3,
    };

    if (statusPriority[a.status] !== statusPriority[b.status]) {
      return statusPriority[a.status] - statusPriority[b.status];
    }

    const difficultyPriority = {
      Beginner: 0,
      Intermediate: 1,
      Advanced: 2,
    };

    if (difficultyPriority[a.difficulty] !== difficultyPriority[b.difficulty]) {
      return difficultyPriority[a.difficulty] - difficultyPriority[b.difficulty];
    }

    return a.title.localeCompare(b.title);
  });

  const categories = [
    "All",
    ...Array.from(new Set(LEARNING_PATHS.map((p) => p.category))),
  ];

  const continuePath = derivedPaths.find((p) => p.status === "in_progress");

  const handleStart = (pathId: string, isUnlocked: boolean) => {
    if (isUnlocked) {
      router.push(`/dashboard/learning/${pathId}`);
    }
  };

  const getDifficultyBadge = (difficulty: string) => {
    if (isLight) {
      switch (difficulty) {
        case "Beginner":
          return "border-emerald-200 bg-emerald-50 text-emerald-700";
        case "Intermediate":
          return "border-amber-200 bg-amber-50 text-amber-700";
        case "Advanced":
          return "border-rose-200 bg-rose-50 text-rose-700";
        default:
          return "border-gray-200 bg-gray-50 text-gray-700";
      }
    }

    switch (difficulty) {
      case "Beginner":
        return "border-emerald-500/15 bg-emerald-500/10 text-emerald-300";
      case "Intermediate":
        return "border-amber-500/15 bg-amber-500/10 text-amber-300";
      case "Advanced":
        return "border-rose-500/15 bg-rose-500/10 text-rose-300";
      default:
        return "border-white/10 bg-white/[0.04] text-gray-300";
    }
  };

  const getStatusBadge = (status: PathStatus) => {
    if (isLight) {
      switch (status) {
        case "in_progress":
          return "border-purple-200 bg-purple-50 text-purple-700";
        case "completed":
          return "border-emerald-200 bg-emerald-50 text-emerald-700";
        case "locked":
          return "border-gray-200 bg-gray-50 text-gray-500";
        default:
          return "border-pink-200 bg-pink-50 text-pink-700";
      }
    }

    switch (status) {
      case "in_progress":
        return "border-purple-500/15 bg-purple-500/10 text-purple-300";
      case "completed":
        return "border-emerald-500/15 bg-emerald-500/10 text-emerald-300";
      case "locked":
        return "border-white/10 bg-white/[0.04] text-gray-400";
      default:
        return "border-pink-500/15 bg-pink-500/10 text-pink-300";
    }
  };

  return (
    <div className="space-y-8">
      <section className="space-y-5">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
          <div className="max-w-2xl">
            <p
              className={`text-[11px] font-semibold uppercase tracking-[0.24em] ${
                isLight ? "text-pink-600" : "text-pink-300"
              }`}
            >
              Learning Hub
            </p>
            <h1
              className={`mt-2 text-3xl font-semibold tracking-tight sm:text-[2.35rem] ${
                isLight ? "text-gray-900" : "text-white"
              }`}
            >
              Explore your learning paths
            </h1>
            <p
              className={`mt-3 text-sm leading-6 ${
                isLight ? "text-gray-600" : "text-gray-400"
              }`}
            >
              Learn concepts clearly, track real progress, and move from
              structured lessons into practical coding confidence.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 xl:min-w-[520px]">
            <div
              className={`rounded-2xl border px-4 py-3 ${
                isLight
                  ? "border-gray-200 bg-white shadow-[0_10px_24px_rgba(15,23,42,0.05)]"
                  : "border-white/10 bg-[#0c0c10]"
              }`}
            >
              <p
                className={`text-[10px] uppercase tracking-[0.18em] ${
                  isLight ? "text-gray-500" : "text-gray-500"
                }`}
              >
                Paths
              </p>
              <p
                className={`mt-1.5 text-lg font-semibold ${
                  isLight ? "text-gray-900" : "text-white"
                }`}
              >
                {LEARNING_PATHS.length}
              </p>
            </div>

            <div
              className={`rounded-2xl border px-4 py-3 ${
                isLight
                  ? "border-purple-200 bg-purple-50 shadow-[0_10px_24px_rgba(15,23,42,0.04)]"
                  : "border-purple-500/15 bg-purple-500/[0.06]"
              }`}
            >
              <p
                className={`text-[10px] uppercase tracking-[0.18em] ${
                  isLight ? "text-purple-700/80" : "text-purple-200/80"
                }`}
              >
                Active
              </p>
              <p className="mt-1.5 text-lg font-semibold text-white dark:text-white">
                <span className={isLight ? "text-gray-900" : "text-white"}>
                  {stats.inProgressCount}
                </span>
              </p>
            </div>

            <div
              className={`rounded-2xl border px-4 py-3 ${
                isLight
                  ? "border-emerald-200 bg-emerald-50 shadow-[0_10px_24px_rgba(15,23,42,0.04)]"
                  : "border-emerald-500/15 bg-emerald-500/[0.06]"
              }`}
            >
              <p
                className={`text-[10px] uppercase tracking-[0.18em] ${
                  isLight ? "text-emerald-700/80" : "text-emerald-200/80"
                }`}
              >
                Mastered
              </p>
              <p className="mt-1.5 text-lg font-semibold">
                <span className={isLight ? "text-gray-900" : "text-white"}>
                  {stats.masteredCount}
                </span>
              </p>
            </div>

            <div
              className={`rounded-2xl border px-4 py-3 ${
                isLight
                  ? "border-pink-200 bg-pink-50 shadow-[0_10px_24px_rgba(15,23,42,0.04)]"
                  : "border-pink-500/15 bg-pink-500/[0.06]"
              }`}
            >
              <p
                className={`text-[10px] uppercase tracking-[0.18em] ${
                  isLight ? "text-pink-700/80" : "text-pink-200/80"
                }`}
              >
                Steps
              </p>
              <p className="mt-1.5 text-lg font-semibold">
                <span className={isLight ? "text-gray-900" : "text-white"}>
                  {stats.completedSteps}/{stats.totalSteps}
                </span>
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-3 lg:grid-cols-[1.2fr_auto]">
          <div
            className={`flex items-center rounded-2xl border px-4 py-3 transition focus-within:border-pink-300 ${
              isLight
                ? "border-gray-200 bg-white shadow-[0_10px_24px_rgba(15,23,42,0.04)] hover:border-gray-300"
                : "border-white/10 bg-[#0c0c10] hover:border-white/15 focus-within:border-pink-500/25"
            }`}
          >
            <Search className={`mr-3 h-4 w-4 ${isLight ? "text-pink-500" : "text-pink-300"}`} />
            <input
              type="text"
              placeholder="Search concepts, languages, data structures, or algorithms..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full bg-transparent text-sm outline-none ${
                isLight
                  ? "text-gray-900 placeholder:text-gray-400"
                  : "text-white placeholder:text-gray-600"
              }`}
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveFilter(cat)}
                className={`rounded-xl px-4 py-2 text-xs font-semibold transition-all ${
                  activeFilter === cat
                    ? "bg-pink-500 text-white shadow-lg shadow-pink-500/20"
                    : isLight
                    ? "border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 hover:text-gray-900 hover:shadow-sm"
                    : "border border-white/10 bg-white/[0.03] text-gray-400 hover:bg-white/[0.06] hover:text-gray-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      <AnimatePresence>
        {continuePath && (
          <motion.section
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            className={`rounded-[24px] border p-5 ${
              isLight
                ? "border-purple-200 bg-[linear-gradient(180deg,rgba(245,243,255,1),rgba(255,255,255,1))] shadow-[0_14px_34px_rgba(15,23,42,0.06)]"
                : "border-purple-500/20 bg-[linear-gradient(180deg,rgba(168,85,247,0.08),rgba(9,9,12,1))]"
            }`}
          >
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-start gap-4">
                <div
                  className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${
                    isLight
                      ? "bg-purple-100 text-purple-600"
                      : "bg-purple-500/12 text-purple-300"
                  }`}
                >
                  <TrendingUp className="h-6 w-6" />
                </div>

                <div>
                  <p
                    className={`text-[11px] font-semibold uppercase tracking-[0.22em] ${
                      isLight ? "text-purple-700" : "text-purple-300"
                    }`}
                  >
                    Continue Learning
                  </p>
                  <h2
                    className={`mt-1.5 text-xl font-semibold tracking-tight ${
                      isLight ? "text-gray-900" : "text-white"
                    }`}
                  >
                    Resume {continuePath.title}
                  </h2>
                  <p
                    className={`mt-2 text-sm leading-6 ${
                      isLight ? "text-gray-600" : "text-gray-300"
                    }`}
                  >
                    Continue from {continuePath.completedSteps}/
                    {continuePath.totalSteps} completed steps.
                  </p>
                </div>
              </div>

              <button
                onClick={() => handleStart(continuePath.id, true)}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-pink-500 to-purple-500 px-5 py-3 text-sm font-medium text-white transition hover:opacity-95"
              >
                Resume Path
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      <section className="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p
              className={`text-[11px] font-semibold uppercase tracking-[0.22em] ${
                isLight ? "text-gray-500" : "text-gray-500"
              }`}
            >
              Learning Paths
            </p>
            <h2
              className={`mt-1.5 text-2xl font-semibold tracking-tight ${
                isLight ? "text-gray-900" : "text-white"
              }`}
            >
              All available courses
            </h2>
            <p
              className={`mt-2 max-w-2xl text-sm leading-6 ${
                isLight ? "text-gray-600" : "text-gray-400"
              }`}
            >
              Start, continue, review, or unlock courses from one clean
              learning workspace.
            </p>
          </div>

          <div className={`text-sm ${isLight ? "text-gray-500" : "text-gray-500"}`}>
            {sortedPaths.length} {sortedPaths.length === 1 ? "course" : "courses"}
          </div>
        </div>

        {sortedPaths.length === 0 ? (
          <div
            className={`flex flex-col items-center justify-center rounded-[24px] border px-6 py-14 text-center ${
              isLight
                ? "border-gray-200 bg-white shadow-[0_14px_34px_rgba(15,23,42,0.06)]"
                : "border-white/10 bg-[#09090c]"
            }`}
          >
            <div
              className={`flex h-16 w-16 items-center justify-center rounded-2xl ${
                isLight ? "bg-gray-100 text-gray-400" : "bg-white/[0.04] text-gray-600"
              }`}
            >
              <BookOpen className="h-8 w-8" />
            </div>
            <h3
              className={`mt-5 text-lg font-semibold ${
                isLight ? "text-gray-900" : "text-white"
              }`}
            >
              No courses found
            </h3>
            <p
              className={`mt-2 max-w-md text-sm leading-6 ${
                isLight ? "text-gray-600" : "text-gray-400"
              }`}
            >
              We couldn’t find any learning paths matching your search or
              filters.
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setActiveFilter("All");
              }}
              className={`mt-6 text-sm font-medium ${
                isLight
                  ? "text-pink-600 hover:text-pink-700"
                  : "text-pink-400 hover:text-pink-300"
              }`}
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
            {sortedPaths.map((path) => (
              <motion.article
                key={path.id}
                layout
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                className={`group overflow-hidden rounded-[26px] border transition duration-300 ${
                  isLight
                    ? path.status === "locked"
                      ? "border-gray-200 bg-white shadow-[0_14px_34px_rgba(15,23,42,0.05)]"
                      : path.status === "in_progress"
                      ? "border-purple-200 bg-white shadow-[0_14px_34px_rgba(15,23,42,0.05)] hover:border-purple-300 hover:shadow-[0_18px_40px_rgba(15,23,42,0.08)]"
                      : "border-gray-200 bg-white shadow-[0_14px_34px_rgba(15,23,42,0.05)] hover:border-pink-200 hover:shadow-[0_18px_40px_rgba(15,23,42,0.08)]"
                    : path.status === "locked"
                    ? "border-white/10 bg-[#09090c]"
                    : path.status === "in_progress"
                    ? "border-purple-500/20 bg-[#09090c] hover:border-purple-500/30"
                    : "border-white/10 bg-[#09090c] hover:border-pink-500/20"
                }`}
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={path.coverImage}
                    alt={path.title}
                    className={`h-full w-full object-cover transition duration-500 ${
                      path.status === "locked"
                        ? "scale-100 grayscale-[0.2]"
                        : "group-hover:scale-[1.03]"
                    }`}
                  />
                  <div
                    className={`absolute inset-0 ${
                      isLight
                        ? "bg-gradient-to-t from-white via-white/30 to-transparent"
                        : "bg-gradient-to-t from-[#09090c] via-[#09090c]/40 to-transparent"
                    }`}
                  />

                  <div className="absolute left-4 right-4 top-4 flex items-start justify-between gap-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] ${getDifficultyBadge(
                          path.difficulty
                        )}`}
                      >
                        {path.difficulty}
                      </span>

                      {path.isRecommended && path.status !== "locked" && (
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] ${
                            isLight
                              ? "border-pink-200 bg-pink-50 text-pink-700"
                              : "border-pink-500/15 bg-pink-500/10 text-pink-300"
                          }`}
                        >
                          <Sparkles className="h-3.5 w-3.5" />
                          Recommended
                        </span>
                      )}
                    </div>

                    <span
                      className={`rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] ${getStatusBadge(
                        path.status
                      )}`}
                    >
                      {path.status === "in_progress"
                        ? "In Progress"
                        : path.status === "completed"
                        ? "Completed"
                        : path.status === "locked"
                        ? "Locked"
                        : "Ready"}
                    </span>
                  </div>

                  {path.status === "locked" && (
                    <div
                      className={`absolute inset-0 flex items-center justify-center ${
                        isLight
                          ? "bg-white/35 backdrop-blur-[1px]"
                          : "bg-black/30 backdrop-blur-[1px]"
                      }`}
                    >
                      <div
                        className={`rounded-2xl border p-4 text-center ${
                          isLight
                            ? "border-gray-200 bg-white/90"
                            : "border-white/10 bg-black/55"
                        }`}
                      >
                        <Lock
                          className={`mx-auto h-5 w-5 ${
                            isLight ? "text-gray-500" : "text-gray-300"
                          }`}
                        />
                        <p
                          className={`mt-2 text-[10px] font-semibold uppercase tracking-[0.16em] ${
                            isLight ? "text-gray-600" : "text-gray-300"
                          }`}
                        >
                          Locked
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="p-5">
                  <div className="flex items-center justify-between gap-3">
                    <span
                      className={`text-[11px] font-semibold uppercase tracking-[0.18em] ${
                        isLight ? "text-pink-600" : "text-pink-400"
                      }`}
                    >
                      {path.category}
                    </span>
                    <div
                      className={`flex items-center gap-1.5 text-xs ${
                        isLight ? "text-gray-500" : "text-gray-500"
                      }`}
                    >
                      <Clock className="h-3.5 w-3.5" />
                      {path.readTime}
                    </div>
                  </div>

                  <h3
                    className={`mt-3 text-xl font-semibold tracking-tight ${
                      isLight ? "text-gray-900" : "text-white"
                    }`}
                  >
                    {path.title}
                  </h3>

                  <p
                    className={`mt-2 min-h-[48px] text-sm leading-6 ${
                      isLight ? "text-gray-600" : "text-gray-400"
                    }`}
                  >
                    {path.subtitle}
                  </p>

                  <div className="mt-4">
                    <div className="mb-2 flex items-center justify-between text-[11px] font-medium">
                      <span className={isLight ? "text-gray-500" : "text-gray-500"}>
                        {path.status === "completed" ? "Mastered" : "Progress"}
                      </span>
                      <span
                        className={
                          path.status === "completed"
                            ? isLight
                              ? "text-emerald-700"
                              : "text-emerald-300"
                            : isLight
                            ? "text-gray-700"
                            : "text-gray-300"
                        }
                      >
                        {path.progressPercentage}%
                      </span>
                    </div>

                    <div
                      className={`h-2 overflow-hidden rounded-full ${
                        isLight ? "bg-gray-100" : "bg-white/[0.06]"
                      }`}
                    >
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${path.progressPercentage}%` }}
                        className={`h-full rounded-full ${
                          path.status === "completed"
                            ? "bg-emerald-500"
                            : "bg-gradient-to-r from-pink-500 to-purple-500"
                        }`}
                      />
                    </div>

                    <div
                      className={`mt-2 flex items-center justify-between text-[11px] ${
                        isLight ? "text-gray-500" : "text-gray-500"
                      }`}
                    >
                      <span>
                        {path.completedSteps}/{path.totalSteps} steps completed
                      </span>
                    </div>
                  </div>

                  {path.status === "locked" && (
                    <div
                      className={`mt-4 rounded-xl border px-3 py-2 text-xs ${
                        isLight
                          ? "border-gray-200 bg-gray-50 text-gray-500"
                          : "border-white/10 bg-white/[0.03] text-gray-500"
                      }`}
                    >
                      Complete prerequisite courses to unlock this path.
                    </div>
                  )}

                  <div className="mt-6 flex items-center gap-3">
                    <button
                      onClick={() => handleStart(path.id, path.isUnlocked)}
                      disabled={!path.isUnlocked}
                      className={`flex-1 rounded-xl px-4 py-3 text-sm font-medium transition ${
                        path.status === "locked"
                          ? isLight
                            ? "cursor-not-allowed border border-gray-200 bg-gray-50 text-gray-400"
                            : "cursor-not-allowed border border-white/10 bg-white/[0.03] text-gray-600"
                          : "bg-gradient-to-r from-pink-500 to-purple-500 text-white hover:opacity-95"
                      }`}
                    >
                      {path.status === "completed"
                        ? "Review Course"
                        : path.status === "in_progress"
                        ? "Continue Learning"
                        : "Start Learning"}
                    </button>

                    <button
                      onClick={() => handleStart(path.id, path.isUnlocked)}
                      disabled={!path.isUnlocked}
                      className={`flex h-[48px] w-[48px] items-center justify-center rounded-xl border transition ${
                        path.status === "locked"
                          ? isLight
                            ? "cursor-not-allowed border-gray-200 bg-gray-50 text-gray-400"
                            : "cursor-not-allowed border-white/10 bg-white/[0.03] text-gray-600"
                          : isLight
                          ? "border-gray-200 bg-gray-50 text-gray-700 hover:bg-gray-100"
                          : "border-white/10 bg-white/[0.04] text-white hover:bg-white/[0.08]"
                      }`}
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}