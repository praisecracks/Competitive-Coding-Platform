"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Clock,
  Zap,
  BookOpen,
  ChevronRightCircle,
} from "lucide-react";
import LearningHero from "../LearningHero";
import LearningContent from "../LearningContent";
import LearningEngagement from "../LearningEngagement";
import LearningOutline from "../LearningOutline";
import { LEARNING_PATHS, getTrackById } from "../data";
import { useTheme } from "@/app/context/ThemeContext";

const PROGRESS_KEY = "codemaster_learning_progress_v1";

interface PathProgress {
  completedStepIds: string[];
  liked: boolean;
  rating: number | null;
}

interface UserProgress {
  totalXp?: number;
  paths: {
    [pathId: string]: PathProgress;
  };
}

export default function LearningPathEngine() {
  const router = useRouter();
  const params = useParams();
  const { theme } = useTheme();
  const isLight = theme === "light";
  const pathId = params.pathId as string;

  useEffect(() => {
    const track = getTrackById(pathId);
    if (track) {
      router.replace(`/dashboard/learning/track/${pathId}`);
    }
  }, [pathId, router]);

  const [userProgress, setUserProgress] = useState<UserProgress>({
    paths: {},
    totalXp: 0,
  });
  const [activeStepId, setActiveStepId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [showXpPopup, setShowXpPopup] = useState<number | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem(PROGRESS_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setUserProgress(parsed);
      } catch (e) {
        console.error("Failed to parse progress", e);
      }
    }
    setLoading(false);
  }, []);

  const path = useMemo(
    () => LEARNING_PATHS.find((p) => p.id === pathId),
    [pathId]
  );

  const pathProgress = useMemo(
    () =>
      userProgress.paths[pathId] || {
        completedStepIds: [],
        liked: false,
        rating: null,
      },
    [userProgress, pathId]
  );

  const completedStepsCount = pathProgress.completedStepIds.length;
  const totalStepsCount = path?.steps.length || 0;
  const progressPercentage =
    totalStepsCount > 0
      ? Math.round((completedStepsCount / totalStepsCount) * 100)
      : 0;

  const relatedPaths = useMemo(() => {
    if (!path) return [];
    return LEARNING_PATHS.filter(
      (p) =>
        p.id !== path.id &&
        (p.category === path.category || p.prerequisiteIds?.includes(path.id))
    ).slice(0, 2);
  }, [path]);

  useEffect(() => {
    if (path && !activeStepId) {
      const firstIncomplete = path.steps.find(
        (step) => !pathProgress.completedStepIds.includes(step.id)
      );
      setActiveStepId(firstIncomplete?.id || path.steps[0]?.id || null);
    }
  }, [path, pathProgress.completedStepIds, activeStepId]);

  const activeStep = useMemo(
    () => path?.steps.find((s) => s.id === activeStepId) || null,
    [path, activeStepId]
  );

  const activeStepIndex = useMemo(
    () => path?.steps.findIndex((s) => s.id === activeStepId) ?? -1,
    [path, activeStepId]
  );

  const isStepLocked = useCallback(
    (stepId: string) => {
      if (!path) return true;
      const index = path.steps.findIndex((s) => s.id === stepId);
      if (index === 0) return false;
      const prevStep = path.steps[index - 1];
      return !pathProgress.completedStepIds.includes(prevStep.id);
    },
    [path, pathProgress.completedStepIds]
  );

  const handleStepSelect = (stepId: string) => {
    if (!isStepLocked(stepId)) {
      setActiveStepId(stepId);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const saveProgress = (newProgress: UserProgress) => {
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(newProgress));
    setUserProgress(newProgress);
    window.dispatchEvent(new Event("codemaster-learning-updated"));
  };

  const handleCompleteStep = () => {
    if (!activeStepId || !path || !activeStep) return;

    const isAlreadyCompleted =
      pathProgress.completedStepIds.includes(activeStepId);

    const newCompletedIds = isAlreadyCompleted
      ? pathProgress.completedStepIds
      : [...pathProgress.completedStepIds, activeStepId];

    const xpToGain = isAlreadyCompleted ? 0 : activeStep.xp;
    const newTotalXp = (userProgress.totalXp || 0) + xpToGain;

    if (xpToGain > 0) {
      setShowXpPopup(xpToGain);
      setTimeout(() => setShowXpPopup(null), 2000);
    }

    const newProgress = {
      ...userProgress,
      totalXp: newTotalXp,
      paths: {
        ...userProgress.paths,
        [pathId]: {
          ...pathProgress,
          completedStepIds: newCompletedIds,
        },
      },
    };

    saveProgress(newProgress);

    if (activeStepIndex < path.steps.length - 1) {
      setActiveStepId(path.steps[activeStepIndex + 1].id);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleNext = () => {
    if (path && activeStepIndex < path.steps.length - 1) {
      const nextStep = path.steps[activeStepIndex + 1];
      if (!isStepLocked(nextStep.id)) {
        setActiveStepId(nextStep.id);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }
  };

  const handlePrev = () => {
    if (path && activeStepIndex > 0) {
      setActiveStepId(path.steps[activeStepIndex - 1].id);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleLike = () => {
    const newProgress = {
      ...userProgress,
      paths: {
        ...userProgress.paths,
        [pathId]: {
          ...pathProgress,
          liked: !pathProgress.liked,
        },
      },
    };
    saveProgress(newProgress);
  };

  const handleRate = (rating: number) => {
    const newProgress = {
      ...userProgress,
      paths: {
        ...userProgress.paths,
        [pathId]: {
          ...pathProgress,
          rating,
        },
      },
    };
    saveProgress(newProgress);
  };

  if (loading) {
    return (
      <div
        className={`flex min-h-screen items-center justify-center ${
          isLight ? "bg-[#f8fafc]" : "bg-[#020202]"
        }`}
      >
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-pink-500 border-t-transparent" />
      </div>
    );
  }

  if (!path) {
    return (
      <div
        className={`flex min-h-screen flex-col items-center justify-center gap-4 ${
          isLight ? "bg-[#f8fafc]" : "bg-[#020202]"
        }`}
      >
        <h1 className={`text-2xl font-bold ${isLight ? "text-gray-900" : "text-white"}`}>
          Course not found
        </h1>
        <p className={isLight ? "text-gray-600" : "text-gray-400"}>
          The course you&apos;re looking for doesn&apos;t exist.
        </p>
        <button
          onClick={() => router.push("/dashboard/learning")}
          className="px-4 py-2 bg-pink-500 text-white rounded-lg"
        >
          Back to Learning
        </button>
      </div>
    );
  }

  const enhancedPath = {
    ...path,
    completedSteps: completedStepsCount,
    totalSteps: totalStepsCount,
    steps: path.steps.map((step) => ({
      ...step,
      status: (
        pathProgress.completedStepIds.includes(step.id)
          ? "completed"
          : step.id === activeStepId
          ? "active"
          : isStepLocked(step.id)
          ? "locked"
          : "not_started"
      ) as "completed" | "active" | "locked" | "not_started",
    })),
  };

  const heroPath = {
    title: path.title,
    subtitle: path.subtitle,
    difficulty: path.difficulty,
    category: path.category,
    readTime: path.readTime,
    likes: path.likes + (pathProgress.liked ? 1 : 0),
    rating: pathProgress.rating || path.rating,
    completedSteps: completedStepsCount,
    totalSteps: totalStepsCount,
    coverImage: path.coverImage,
  };

  const contentPath = activeStep
    ? {
        currentStepTitle: activeStep.title,
        currentStepDescription: activeStep.description,
        content: [activeStep.content.overview, ...activeStep.content.explanation],
        keyTakeaways: activeStep.content.keyTakeaways,
        example: activeStep.content.example,
        commonMistake: activeStep.content.commonMistake,
      }
    : null;

  return (
    <div
      className={`min-h-screen ${
        isLight
          ? "bg-[#f8fafc] text-gray-900"
          : "bg-[#020202] text-white"
      }`}
    >
      <AnimatePresence>
        {showXpPopup && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.5 }}
            animate={{ opacity: 1, y: -100, scale: 1.12 }}
            exit={{ opacity: 0, scale: 0.5 }}
            className="pointer-events-none fixed inset-x-0 top-1/2 z-[200] flex justify-center"
          >
            <div className="flex items-center gap-3 rounded-full bg-amber-500 px-6 py-3 font-black text-black shadow-[0_0_30px_rgba(245,158,11,0.6)]">
              <Zap className="h-6 w-6 fill-current" />
              <span className="text-2xl">+{showXpPopup} XP</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mx-auto mt-[-30px] max-w-[1440px] px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <button
            onClick={() => router.push("/dashboard/learning/explore")}
            className={`group inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] transition-colors ${
              isLight ? "text-gray-500 hover:text-gray-900" : "text-gray-500 hover:text-white"
            }`}
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Back to Learning Hub
          </button>

          <div className="flex flex-wrap items-center gap-3">
            <div
              className={`flex items-center gap-2 rounded-xl border px-4 py-2 ${
                isLight
                  ? "border-amber-200 bg-amber-50 text-amber-700 shadow-[0_10px_24px_rgba(15,23,42,0.04)]"
                  : "border-amber-500/20 bg-amber-500/10 text-amber-400"
              }`}
            >
              <Zap className="h-4 w-4 fill-current" />
              <span className="text-[11px] font-semibold uppercase tracking-[0.16em]">
                Mastery: {userProgress.totalXp || 0} XP
              </span>
            </div>

            <div
              className={`flex items-center gap-2 rounded-xl border px-3 py-2 ${
                isLight
                  ? "border-gray-200 bg-white shadow-[0_10px_24px_rgba(15,23,42,0.04)]"
                  : "border-white/10 bg-white/[0.03]"
              }`}
            >
              <button
                onClick={handlePrev}
                disabled={activeStepIndex === 0}
                className={`flex h-9 w-9 items-center justify-center rounded-lg border transition disabled:cursor-not-allowed disabled:opacity-30 ${
                  isLight
                    ? "border-gray-200 bg-gray-50 text-gray-700 hover:bg-gray-100"
                    : "border-white/10 bg-white/[0.04] text-white hover:bg-white/[0.08]"
                }`}
              >
                <ChevronLeft className="h-4 w-4" />
              </button>

              <span
                className={`px-2 text-[11px] font-semibold uppercase tracking-[0.16em] ${
                  isLight ? "text-gray-500" : "text-gray-500"
                }`}
              >
                Step {activeStepIndex + 1} of {totalStepsCount}
              </span>

              <button
                onClick={handleNext}
                disabled={
                  activeStepIndex === totalStepsCount - 1 ||
                  isStepLocked(path.steps[activeStepIndex + 1]?.id)
                }
                className={`flex h-9 w-9 items-center justify-center rounded-lg border transition disabled:cursor-not-allowed disabled:opacity-30 ${
                  isLight
                    ? "border-gray-200 bg-gray-50 text-gray-700 hover:bg-gray-100"
                    : "border-white/10 bg-white/[0.04] text-white hover:bg-white/[0.08]"
                }`}
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 xl:grid-cols-12">
          <div className="space-y-8 pb-20 xl:col-span-8">
            <LearningHero path={heroPath} />

            {activeStep && contentPath && (
              <div
                className={`overflow-hidden rounded-[28px] border ${
                  isLight
                    ? "border-gray-200 bg-white shadow-[0_14px_34px_rgba(15,23,42,0.06)]"
                    : "border-white/10 bg-[#09090c]"
                }`}
              >
                <div
                  className={`border-b px-6 py-5 sm:px-8 ${
                    isLight ? "border-gray-200" : "border-white/5"
                  }`}
                >
                  <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                    <div>
                      <p
                        className={`text-[11px] font-semibold uppercase tracking-[0.22em] ${
                          isLight ? "text-pink-600" : "text-pink-300"
                        }`}
                      >
                        Lesson Step
                      </p>
                      <h2
                        className={`mt-2 text-2xl font-semibold tracking-tight sm:text-[2rem] ${
                          isLight ? "text-gray-900" : "text-white"
                        }`}
                      >
                        {activeStep.title}
                      </h2>
                      <p
                        className={`mt-3 max-w-3xl text-sm leading-6 ${
                          isLight ? "text-gray-600" : "text-gray-400"
                        }`}
                      >
                        {activeStep.description}
                      </p>
                    </div>

                    <div
                      className={`rounded-2xl border px-4 py-3 ${
                        isLight
                          ? "border-gray-200 bg-gray-50"
                          : "border-white/10 bg-white/[0.03]"
                      }`}
                    >
                      <p
                        className={`text-[10px] uppercase tracking-[0.16em] ${
                          isLight ? "text-gray-500" : "text-gray-500"
                        }`}
                      >
                        Step Progress
                      </p>
                      <p
                        className={`mt-1 text-sm font-semibold ${
                          isLight ? "text-gray-900" : "text-white"
                        }`}
                      >
                        {completedStepsCount}/{totalStepsCount} completed
                      </p>
                    </div>
                  </div>
                </div>

                <div className="px-6 py-6 sm:px-8">
                  <LearningContent
                    path={contentPath}
                    progressPercentage={progressPercentage}
                  />
                </div>

                <div
                  className={`border-t px-6 py-6 sm:px-8 ${
                    isLight ? "border-gray-200" : "border-white/5"
                  }`}
                >
                  <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p
                        className={`text-[11px] font-semibold uppercase tracking-[0.18em] ${
                          isLight ? "text-gray-500" : "text-gray-500"
                        }`}
                      >
                        Step Navigation
                      </p>
                      <p
                        className={`mt-1 text-sm ${
                          isLight ? "text-gray-600" : "text-gray-400"
                        }`}
                      >
                        Move through the lesson step by step and complete each
                        section to unlock the next one.
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        onClick={handlePrev}
                        disabled={activeStepIndex === 0}
                        className={`rounded-xl border px-4 py-2.5 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-30 ${
                          isLight
                            ? "border-gray-200 bg-gray-50 text-gray-700 hover:bg-gray-100"
                            : "border-white/10 bg-white/[0.04] text-white hover:bg-white/[0.08]"
                        }`}
                      >
                        Previous
                      </button>

                      <button
                        onClick={handleNext}
                        disabled={
                          activeStepIndex === totalStepsCount - 1 ||
                          isStepLocked(path.steps[activeStepIndex + 1]?.id)
                        }
                        className={`rounded-xl border px-4 py-2.5 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-30 ${
                          isLight
                            ? "border-gray-200 bg-gray-50 text-gray-700 hover:bg-gray-100"
                            : "border-white/10 bg-white/[0.04] text-white hover:bg-white/[0.08]"
                        }`}
                      >
                        Next
                      </button>
                    </div>
                  </div>

                  <LearningEngagement
                    liked={pathProgress.liked}
                    likesCount={path.likes + (pathProgress.liked ? 1 : 0)}
                    onLike={handleLike}
                    isCompleted={pathProgress.completedStepIds.includes(
                      activeStepId!
                    )}
                    setIsCompleted={handleCompleteStep}
                    selectedRating={pathProgress.rating}
                    setSelectedRating={handleRate}
                    onPractice={() =>
                      path.relatedChallengeId &&
                      router.push(`/dashboard/challenges/${path.relatedChallengeId}`)
                    }
                    onDuel={() => router.push("/dashboard/challenges")}
                    onNextCourse={() => {}}
                    hasRelatedChallenge={!!path.relatedChallengeId}
                    hasNextCourse={false}
                    rating={path.rating}
                    totalRatings={path.totalRatings}
                  />
                </div>
              </div>
            )}

            {relatedPaths.length > 0 && (
              <section className="pt-4">
                <div className="mb-6 flex items-center justify-between">
                  <h3
                    className={`flex items-center gap-3 text-xl font-semibold ${
                      isLight ? "text-gray-900" : "text-white"
                    }`}
                  >
                    <BookOpen className="h-5 w-5 text-pink-500" />
                    Recommended Next Courses
                  </h3>
                </div>

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  {relatedPaths.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => router.push(`/dashboard/learning/${p.id}`)}
                      className={`group flex items-center gap-4 rounded-[24px] border p-4 text-left transition-all ${
                        isLight
                          ? "border-gray-200 bg-white shadow-[0_10px_24px_rgba(15,23,42,0.05)] hover:border-pink-200 hover:shadow-[0_14px_30px_rgba(15,23,42,0.08)]"
                          : "border-white/10 bg-[#09090c] hover:border-pink-500/20 hover:bg-[#0d0d12]"
                      }`}
                    >
                      <div
                        className={`h-20 w-20 shrink-0 overflow-hidden rounded-2xl border ${
                          isLight ? "border-gray-200" : "border-white/10"
                        }`}
                      >
                        <img
                          src={p.coverImage}
                          alt=""
                          className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]"
                        />
                      </div>

                      <div className="min-w-0 flex-1">
                        <span
                          className={`text-[10px] font-semibold uppercase tracking-[0.18em] ${
                            isLight ? "text-pink-600" : "text-pink-400"
                          }`}
                        >
                          {p.category}
                        </span>
                        <h4
                          className={`mt-1 text-base font-semibold transition-colors ${
                            isLight
                              ? "text-gray-900 group-hover:text-pink-600"
                              : "text-white group-hover:text-pink-300"
                          }`}
                        >
                          {p.title}
                        </h4>
                        <div
                          className={`mt-2 flex items-center gap-3 text-[11px] ${
                            isLight ? "text-gray-500" : "text-gray-500"
                          }`}
                        >
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {p.readTime}
                          </span>
                        </div>
                      </div>

                      <ChevronRightCircle
                        className={`h-6 w-6 transition-all ${
                          isLight
                            ? "text-gray-300 group-hover:text-pink-500"
                            : "text-gray-700 group-hover:text-pink-500"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </section>
            )}
          </div>

          <div className="xl:col-span-4 xl:self-start">
            <div className="mt-20 p-2 pb-6 pr-8 pt-4 lg:fixed xl:top-24 xl:max-h-[calc(100vh-120px)] xl:overflow-y-auto no-scrollbar">
              <LearningOutline
                path={{
                  completedSteps: enhancedPath.completedSteps,
                  totalSteps: enhancedPath.totalSteps,
                  steps: enhancedPath.steps,
                }}
                onStepSelect={handleStepSelect}
                activeStepId={activeStepId || undefined}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}