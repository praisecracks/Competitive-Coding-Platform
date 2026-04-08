"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Clock,
  ChevronRight,
  CheckCircle2,
  Lock,
  ArrowRight,
  TrendingUp,
  Sparkles,
  BookOpen,
} from "lucide-react";
import { LEARNING_PATHS } from "./data";

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
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-pink-300">
              Learning Hub
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-white sm:text-[2.35rem]">
              Explore your learning paths
            </h1>
            <p className="mt-3 text-sm leading-6 text-gray-400">
              Learn concepts clearly, track real progress, and move from
              structured lessons into practical coding confidence.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 xl:min-w-[520px]">
            <div className="rounded-2xl border border-white/10 bg-[#0c0c10] px-4 py-3">
              <p className="text-[10px] uppercase tracking-[0.18em] text-gray-500">
                Paths
              </p>
              <p className="mt-1.5 text-lg font-semibold text-white">
                {LEARNING_PATHS.length}
              </p>
            </div>

            <div className="rounded-2xl border border-purple-500/15 bg-purple-500/[0.06] px-4 py-3">
              <p className="text-[10px] uppercase tracking-[0.18em] text-purple-200/80">
                Active
              </p>
              <p className="mt-1.5 text-lg font-semibold text-white">
                {stats.inProgressCount}
              </p>
            </div>

            <div className="rounded-2xl border border-emerald-500/15 bg-emerald-500/[0.06] px-4 py-3">
              <p className="text-[10px] uppercase tracking-[0.18em] text-emerald-200/80">
                Mastered
              </p>
              <p className="mt-1.5 text-lg font-semibold text-white">
                {stats.masteredCount}
              </p>
            </div>

            <div className="rounded-2xl border border-pink-500/15 bg-pink-500/[0.06] px-4 py-3">
              <p className="text-[10px] uppercase tracking-[0.18em] text-pink-200/80">
                Steps
              </p>
              <p className="mt-1.5 text-lg font-semibold text-white">
                {stats.completedSteps}/{stats.totalSteps}
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-3 lg:grid-cols-[1.2fr_auto]">
          <div className="flex items-center rounded-2xl border border-white/10 bg-[#0c0c10] px-4 py-3 transition hover:border-white/15 focus-within:border-pink-500/25">
            <Search className="mr-3 h-4 w-4 text-pink-300" />
            <input
              type="text"
              placeholder="Search concepts, languages, data structures, or algorithms..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent text-sm text-white outline-none placeholder:text-gray-600"
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
            className="rounded-[24px] border border-purple-500/20 bg-[linear-gradient(180deg,rgba(168,85,247,0.08),rgba(9,9,12,1))] p-5"
          >
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-purple-500/12 text-purple-300">
                  <TrendingUp className="h-6 w-6" />
                </div>

                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-purple-300">
                    Continue Learning
                  </p>
                  <h2 className="mt-1.5 text-xl font-semibold tracking-tight text-white">
                    Resume {continuePath.title}
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-gray-300">
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
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-gray-500">
              Learning Paths
            </p>
            <h2 className="mt-1.5 text-2xl font-semibold tracking-tight text-white">
              All available courses
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-400">
              Start, continue, review, or unlock courses from one clean
              learning workspace.
            </p>
          </div>

          <div className="text-sm text-gray-500">
            {sortedPaths.length} {sortedPaths.length === 1 ? "course" : "courses"}
          </div>
        </div>

        {sortedPaths.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-[24px] border border-white/10 bg-[#09090c] px-6 py-14 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/[0.04] text-gray-600">
              <BookOpen className="h-8 w-8" />
            </div>
            <h3 className="mt-5 text-lg font-semibold text-white">
              No courses found
            </h3>
            <p className="mt-2 max-w-md text-sm leading-6 text-gray-400">
              We couldn’t find any learning paths matching your search or
              filters.
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setActiveFilter("All");
              }}
              className="mt-6 text-sm font-medium text-pink-400 hover:text-pink-300"
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
                className={`group overflow-hidden rounded-[26px] border bg-[#09090c] transition duration-300 ${
                  path.status === "locked"
                    ? "border-white/10"
                    : path.status === "in_progress"
                    ? "border-purple-500/20 hover:border-purple-500/30"
                    : "border-white/10 hover:border-pink-500/20"
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
                  <div className="absolute inset-0 bg-gradient-to-t from-[#09090c] via-[#09090c]/40 to-transparent" />

                  <div className="absolute left-4 right-4 top-4 flex items-start justify-between gap-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] ${
                          getDifficultyBadge(path.difficulty)
                        }`}
                      >
                        {path.difficulty}
                      </span>

                      {path.isRecommended && path.status !== "locked" && (
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-pink-500/15 bg-pink-500/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-pink-300">
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
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-[1px]">
                      <div className="rounded-2xl border border-white/10 bg-black/55 p-4 text-center">
                        <Lock className="mx-auto h-5 w-5 text-gray-300" />
                        <p className="mt-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-gray-300">
                          Locked
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="p-5">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-pink-400">
                      {path.category}
                    </span>
                    <div className="flex items-center gap-1.5 text-xs text-gray-500">
                      <Clock className="h-3.5 w-3.5" />
                      {path.readTime}
                    </div>
                  </div>

                  <h3 className="mt-3 text-xl font-semibold tracking-tight text-white">
                    {path.title}
                  </h3>

                  <p className="mt-2 min-h-[48px] text-sm leading-6 text-gray-400">
                    {path.subtitle}
                  </p>

                  <div>
                    <div className="mb-2 flex items-center justify-between text-[11px] font-medium">
                      <span className="text-gray-500">
                        {path.status === "completed" ? "Mastered" : "Progress"}
                      </span>
                      <span
                        className={
                          path.status === "completed"
                            ? "text-emerald-300"
                            : "text-gray-300"
                        }
                      >
                        {path.progressPercentage}%
                      </span>
                    </div>

                    <div className="h-2 overflow-hidden rounded-full bg-white/[0.06]">
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

                    <div className="flex items-center justify-between text-[11px] text-gray-500">
                      <span>
                        {path.completedSteps}/{path.totalSteps} steps completed
                      </span>
                    </div>
                  </div>

                  {path.status === "locked" && (
                    <div className="mt-2 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-xs text-gray-500">
                      Complete prerequisite courses to unlock this path.
                    </div>
                  )}

                  <div className="mt-6 flex items-center gap-3">
                    <button
                      onClick={() => handleStart(path.id, path.isUnlocked)}
                      disabled={!path.isUnlocked}
                      className={`flex-1 rounded-xl px-4 py-3 text-sm font-medium transition ${
                        path.status === "locked"
                          ? "cursor-not-allowed border border-white/10 bg-white/[0.03] text-gray-600"
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
                          ? "cursor-not-allowed border-white/10 bg-white/[0.03] text-gray-600"
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