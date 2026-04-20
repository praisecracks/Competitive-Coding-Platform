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
  CheckCircle2,
  PlayCircle,
  Lock,
  Home,
  FolderOpen,
  Terminal,
  Sparkles,
  Trophy,
  Swords,
  Layers3,
} from "lucide-react";
import LearningContent from "../../../../LearningContent";
import CodePlayground from "../../../../CodePlayground";
import CompletionModal from "../../../../CompletionModal";
import LessonConfirmationModal from "../../../../LessonConfirmationModal";
import {
  getTrackById,
  LearningTrack,
  TrackTopic,
  Subtopic,
} from "../../../../data";
import { useTheme } from "@/app/context/ThemeContext";
import PageFooter from "@/app/components/PageFooter";
import {
  getLearningProgress,
  migrateLegacyProgress,
  updateTrackProgress,
  updateStreak,
  TrackProgress,
} from "@/lib/learning-api";

export default function TopicPage() {
  const router = useRouter();
  const params = useParams();
  const { theme } = useTheme();
  const isLight = theme === "light";

  const trackId = params.trackId as string;
  const topicId = params.topicId as string;

  const track = getTrackById(trackId) as LearningTrack | undefined;
  const topic = track?.topics.find((t: TrackTopic) => t.id === topicId);

  const [progress, setProgress] = useState<TrackProgress>({
    completedTopicIds: [],
    completedLessonIds: [],
    lessonProgress: {},
    topicTimeSpent: {},
  });
  const [activeLessonId, setActiveLessonId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [showTopicCompleted, setShowTopicCompleted] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [pendingAction, setPendingAction] = useState<"complete" | "next" | null>(null);

  useEffect(() => {
    async function loadProgress() {
      try {
        const data = await migrateLegacyProgress();
        const trackProgress = data.trackProgress?.[trackId];
        if (trackProgress) {
          setProgress(trackProgress);
        }
      } catch (e) {
        console.error("Failed to load progress from API", e);
      }
      setLoading(false);
    }
    loadProgress();
  }, [trackId]);

   useEffect(() => {
     if (topic && !activeLessonId) {
       const firstIncomplete = topic.subtopics.find(
         (subtopic) => !progress.completedLessonIds.includes(subtopic.id)
       );
       setActiveLessonId(firstIncomplete?.id || topic.subtopics[0]?.id || null);
     }
   }, [topic, progress.completedLessonIds, activeLessonId]);

  const saveProgress = useCallback(
    async (newProgress: TrackProgress) => {
      const progressToSave: TrackProgress = {
        ...newProgress,
        lastAccessedAt: new Date().toISOString(),
        startedAt: newProgress.startedAt || new Date().toISOString(),
      };

      setProgress(progressToSave);

      try {
        await updateTrackProgress(trackId, progressToSave);
        window.dispatchEvent(new Event("codemaster-learning-updated"));
      } catch (e) {
        console.error("Failed to save progress to API", e);
      }
    },
    [trackId]
  );

  useEffect(() => {
    if (!activeLessonId || !topic) return;

    const startTime = Date.now();

    return () => {
      const timeSpent = Math.floor((Date.now() - startTime) / 1000);
      if (timeSpent <= 0) return;

      setProgress((prev) => {
        const next = { ...prev };

        if (!next.lessonProgress) next.lessonProgress = {};
        if (!next.lessonProgress[activeLessonId]) {
          next.lessonProgress[activeLessonId] = {
            completed: false,
            timeSpentSeconds: 0,
          };
        }

        next.lessonProgress[activeLessonId].timeSpentSeconds += timeSpent;

        if (!next.topicTimeSpent) next.topicTimeSpent = {};
        next.topicTimeSpent[topicId] = (next.topicTimeSpent[topicId] || 0) + timeSpent;

        // Save to API
        const progressToSave = {
          ...next,
          startedAt: next.startedAt || new Date().toISOString(),
          lastAccessedAt: new Date().toISOString(),
        };
        updateTrackProgress(trackId, progressToSave).catch(e => console.error("Failed to save time tracking", e));
        window.dispatchEvent(new Event("codemaster-learning-updated"));

        return next;
      });
    };
  }, [activeLessonId, topicId, topic, trackId]);

  const activeLesson = useMemo(
    () => topic?.subtopics.find((subtopic) => subtopic.id === activeLessonId) || null,
    [topic, activeLessonId]
  );

  const totalLessons = topic?.subtopics.length || 0;
  const completedLessons =
    topic?.subtopics.filter((subtopic) => progress.completedLessonIds.includes(subtopic.id))
      .length || 0;
  const progressPercentage =
    totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;
  const activeLessonIndex =
    topic?.subtopics.findIndex((subtopic) => subtopic.id === activeLessonId) ?? -1;

  useEffect(() => {
    if (!topic) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (showConfirmationModal || showTopicCompleted) return;
      
      if (e.key === "j" || e.key === "ArrowDown") {
        e.preventDefault();
        if (activeLessonIndex < topic.subtopics.length - 1) {
          setActiveLessonId(topic.subtopics[activeLessonIndex + 1].id);
          window.scrollTo({ top: 0, behavior: "smooth" });
        }
      } else if (e.key === "k" || e.key === "ArrowUp") {
        e.preventDefault();
        if (activeLessonIndex > 0) {
          setActiveLessonId(topic.subtopics[activeLessonIndex - 1].id);
          window.scrollTo({ top: 0, behavior: "smooth" });
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeLessonIndex, topic, showConfirmationModal, showTopicCompleted]);

  const allSubtopicsComplete = topic?.subtopics.every((subtopic) =>
    progress.completedLessonIds.includes(subtopic.id)
  ) ?? false;

  const topicSeconds = progress.topicTimeSpent?.[topicId] || 0;
  const topicMinutes = Math.floor(topicSeconds / 60);

  const nextIncompleteTopic = track?.topics.find(
    (t) => !progress.completedTopicIds.includes(t.id)
  );

  const handleCompleteLesson = useCallback(() => {
    if (allSubtopicsComplete) {
      setShowTopicCompleted(true);
    } else {
      setPendingAction("complete");
      setShowConfirmationModal(true);
    }
  }, [allSubtopicsComplete]);

  const confirmCompleteLesson = useCallback(() => {
    if (!activeLessonId || !topic) return;

    const alreadyCompleted = progress.completedLessonIds.includes(activeLessonId);
    const newCompletedLessonIds = alreadyCompleted
      ? progress.completedLessonIds
      : [...progress.completedLessonIds, activeLessonId];

    const nextProgress: TrackProgress = {
      ...progress,
      completedLessonIds: newCompletedLessonIds,
      lessonProgress: {
        ...progress.lessonProgress,
        [activeLessonId]: {
          completed: true,
          timeSpentSeconds:
            progress.lessonProgress?.[activeLessonId]?.timeSpentSeconds || 0,
        },
      },
    };

    const allLessonsComplete = topic.subtopics.every((subtopic) =>
      newCompletedLessonIds.includes(subtopic.id)
    );

    if (allLessonsComplete && !progress.completedTopicIds.includes(topicId)) {
      nextProgress.completedTopicIds = [...progress.completedTopicIds, topicId];
      setShowTopicCompleted(true);
    }

    saveProgress(nextProgress);

    // Update streak via API (non-blocking)
    updateStreak(true).then(() => {
      window.dispatchEvent(new Event("codemaster-learning-updated"));
    }).catch(e => {
      console.error("Failed to update streak", e);
    });

    const currentIndex = topic.subtopics.findIndex((subtopic) => subtopic.id === activeLessonId);
    if (currentIndex < topic.subtopics.length - 1) {
      setActiveLessonId(topic.subtopics[currentIndex + 1].id);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }

    setShowConfirmationModal(false);
    setPendingAction(null);
  }, [activeLessonId, topic, progress, topicId, saveProgress]);

  const handleSelectLesson = (lessonId: string) => {
    setActiveLessonId(lessonId);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handlePrevLesson = () => {
    if (!topic || activeLessonIndex <= 0) return;
    setActiveLessonId(topic.subtopics[activeLessonIndex - 1].id);
  };

  const handleNextLesson = () => {
    setPendingAction("next");
    setShowConfirmationModal(true);
  };

  const confirmNextLesson = useCallback(() => {
    if (!topic || activeLessonIndex >= topic.subtopics.length - 1) return;
    setActiveLessonId(topic.subtopics[activeLessonIndex + 1].id);
    setShowConfirmationModal(false);
    setPendingAction(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [activeLessonIndex, topic]);

  const isLessonCompleted = (lessonId: string) =>
    progress.completedLessonIds.includes(lessonId);

  const isLessonLocked = (subtopicId: string) => {
    if (!topic) return true;
    const index = topic.subtopics.findIndex((subtopic) => subtopic.id === subtopicId);
    if (index <= 0) return false;
    const previousSubtopic = topic.subtopics[index - 1];
    return !progress.completedLessonIds.includes(previousSubtopic.id);
  };

  const handleStartOrContinue = () => {
    const firstIncomplete = topic?.subtopics.find(
      (subtopic) => !progress.completedLessonIds.includes(subtopic.id)
    );
    setActiveLessonId(firstIncomplete?.id || topic?.subtopics[0]?.id || null);
    document.getElementById("lesson-content")?.scrollIntoView({
      behavior: "smooth",
    });
  };

  if (loading || !track || !topic) {
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

  return (
    <div className={`min-h-screen ${isLight ? "bg-[#f8fafc]" : "bg-[#020202]"}`}>
      <div
        className={`border-b ${
          isLight ? "border-gray-200 bg-white" : "border-white/10 bg-[#0b0b10]"
        }`}
      >
        <div className="mx-auto max-w-[1500px] px-4 py-3 sm:px-6 lg:px-8">
          <nav className="flex flex-wrap items-center gap-2 text-sm">
            <button
              onClick={() => router.push("/dashboard/learning")}
              className={`flex items-center gap-1 transition-colors ${
                isLight ? "text-gray-500 hover:text-pink-600" : "text-gray-400 hover:text-pink-400"
              }`}
            >
              <Home className="h-4 w-4" />
              Learning
            </button>
            <ChevronRight className={`h-4 w-4 ${isLight ? "text-gray-400" : "text-gray-600"}`} />
            <button
              onClick={() => router.push(`/dashboard/learning/track/${trackId}`)}
              className={`transition-colors ${
                isLight ? "text-gray-500 hover:text-pink-600" : "text-gray-400 hover:text-pink-400"
              }`}
            >
              {track.title}
            </button>
            <ChevronRight className={`h-4 w-4 ${isLight ? "text-gray-400" : "text-gray-600"}`} />
            <span className={`font-medium ${isLight ? "text-gray-900" : "text-white"}`}>
              {topic.title}
            </span>
          </nav>
        </div>
      </div>

      <div className="mx-auto max-w-[1500px] px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 xl:grid-cols-12">
          <section className="space-y-6 xl:col-span-8">
            <div
              className={`overflow-hidden rounded-[28px] border ${
                isLight ? "border-gray-200 bg-white" : "border-white/10 bg-[#0c0c12]"
              }`}
            >
              <div className="px-6 py-6 sm:px-8">
                <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                  <div className="max-w-3xl">
                    <div
                      className={`inline-flex items-center gap-2 rounded-lg px-3 py-1 text-xs font-semibold ${
                        isLight ? "bg-pink-100 text-pink-700" : "bg-pink-500/20 text-pink-300"
                      }`}
                    >
                      <FolderOpen className="h-3 w-3" />
                      {track.type === "master_track" ? "Master Track" : "Additional Track"}
                    </div>

                    <h1
                      className={`mt-3 text-2xl font-bold tracking-tight sm:text-3xl ${
                        isLight ? "text-gray-900" : "text-white"
                      }`}
                    >
                      {topic.title}
                    </h1>

                    <p
                      className={`mt-2 max-w-2xl text-sm leading-6 ${
                        isLight ? "text-gray-600" : "text-gray-400"
                      }`}
                    >
                      {topic.description}
                    </p>

                    <div
                      className={`mt-4 flex flex-wrap items-center gap-4 text-sm ${
                        isLight ? "text-gray-500" : "text-gray-400"
                      }`}
                    >
                      <span className="flex items-center gap-1.5">
                        <Clock className="h-4 w-4" />
                        {topic.duration}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <BookOpen className="h-4 w-4" />
                        {totalLessons} lessons
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Zap className="h-4 w-4" />
                        {progressPercentage}% complete
                      </span>
                    </div>
                  </div>

                  <div
                    className={`w-full max-w-[280px] rounded-2xl border p-4 ${
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
                      Topic Progress
                    </p>
                    <p
                      className={`mt-1 text-sm font-semibold ${
                        isLight ? "text-gray-900" : "text-white"
                      }`}
                    >
                      {completedLessons}/{totalLessons} lessons completed
                    </p>

                    <div
                      className={`mt-3 h-2 rounded-full ${
                        isLight ? "bg-gray-200" : "bg-white/10"
                      }`}
                    >
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-pink-500 to-purple-500 transition-all duration-500"
                        style={{ width: `${progressPercentage}%` }}
                      />
                    </div>

                    <button
                      onClick={handleStartOrContinue}
                      className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 px-5 py-3 text-sm font-semibold text-white transition hover:opacity-95"
                    >
                      {progressPercentage > 0 ? "Continue Learning" : "Start Topic"}
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div
              id="lesson-content"
              className={`overflow-hidden rounded-[28px] border ${
                isLight ? "border-gray-200 bg-white" : "border-white/10 bg-[#0c0c12]"
              }`}
            >
              {activeLesson && (
                <>
                  <div
                    className={`border-b px-6 py-5 sm:px-8 ${
                      isLight ? "border-gray-200" : "border-white/5"
                    }`}
                  >
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                      <div>
                        <p
                          className={`text-[11px] font-semibold uppercase tracking-[0.22em] ${
                            isLight ? "text-pink-600" : "text-pink-300"
                          }`}
                        >
                          Lesson {activeLessonIndex + 1} of {totalLessons}
                        </p>
                        <h2
                          className={`mt-2 text-2xl font-semibold tracking-tight sm:text-[2rem] ${
                            isLight ? "text-gray-900" : "text-white"
                          }`}
                        >
                          {activeLesson.title}
                        </h2>
                      </div>

                      <div className="flex flex-wrap items-center gap-3">
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
                            Lesson Progress
                          </p>
                          <p
                            className={`mt-1 text-sm font-semibold ${
                              isLight ? "text-gray-900" : "text-white"
                            }`}
                          >
                            {completedLessons}/{totalLessons} completed
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
                            XP Reward
                          </p>
                          <p
                            className={`mt-1 text-sm font-semibold ${
                              isLight ? "text-gray-900" : "text-white"
                            }`}
                          >
                            +10 XP
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                   <div className="px-6 py-6 sm:px-8">
                     <LearningContent
                       path={{
                         currentStepTitle: activeLesson?.title || topic.title,
                         currentStepDescription: topic.description,
                         content: activeLesson?.content?.explanation || ["Select a lesson to begin."],
                         example: activeLesson?.content?.example,
                       }}
                       progressPercentage={progressPercentage}
                     />
                   </div>

                   {activeLesson?.content?.example && (
                    <div
                      className={`border-t px-6 pb-6 pt-6 sm:px-8 ${
                        isLight ? "border-gray-200" : "border-white/5"
                      }`}
                    >
                      <div className="mb-4 flex items-center justify-between">
                        <h3
                          className={`text-lg font-semibold ${
                            isLight ? "text-gray-900" : "text-white"
                          }`}
                        >
                          Try It Yourself
                        </h3>
                        <span
                          className={`text-xs ${
                            isLight ? "text-gray-500" : "text-gray-500"
                          }`}
                        >
                          {track?.language === 'python' ? 'Python' : track?.language === 'go' ? 'Go' : 'JavaScript'}
                        </span>
                      </div>

<CodePlayground
                          initialCode={activeLesson.content.example.code}
                          language={(track?.language === 'multi' ? 'javascript' : track?.language) as 'javascript' | 'python' | 'go' || 'javascript'}
                          lockedLanguage={true}
                        />
                    </div>
                  )}

                  <div
                    className={`sticky bottom-0 flex flex-col gap-3 border-t px-6 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-8 ${
                      isLight ? "border-gray-200 bg-white" : "border-white/10 bg-[#0c0c12]"
                    }`}
                  >
                    <button
                      onClick={() => router.push(`/dashboard/learning/track/${trackId}`)}
                      className={`flex items-center gap-2 text-sm font-medium transition-colors ${
                        isLight
                          ? "text-gray-500 hover:text-gray-900"
                          : "text-gray-400 hover:text-white"
                      }`}
                    >
                      <ArrowLeft className="h-4 w-4" />
                      Back to {track.title}
                    </button>

                    <div className="flex flex-wrap items-center gap-3">
                      <button
                        onClick={handlePrevLesson}
                        disabled={activeLessonIndex === 0}
                        className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-30 ${
                          isLight
                            ? "border border-gray-200 bg-gray-50 text-gray-700 hover:bg-gray-100"
                            : "border border-white/10 bg-white/[0.04] text-white hover:bg-white/[0.08]"
                        }`}
                      >
                        <ChevronLeft className="h-4 w-4" />
                        Previous
                      </button>

                      <button
                        onClick={handleNextLesson}
                        disabled={activeLessonIndex === totalLessons - 1}
                        className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-30 ${
                          isLight
                            ? "border border-gray-200 bg-gray-50 text-gray-700 hover:bg-gray-100"
                            : "border border-white/10 bg-white/[0.04] text-white hover:bg-white/[0.08]"
                        }`}
                      >
                        Next
                        <ChevronRight className="h-4 w-4" />
                      </button>

                      <button
                        onClick={handleCompleteLesson}
                        className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition ${
                          allSubtopicsComplete
                            ? isLight
                              ? "bg-emerald-500 text-white hover:bg-emerald-600"
                              : "bg-emerald-600 text-white hover:bg-emerald-500"
                            : activeLessonId && progress.completedLessonIds.includes(activeLessonId)
                            ? isLight
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-emerald-500/20 text-emerald-300"
                            : "bg-gradient-to-r from-pink-500 to-purple-600 text-white hover:opacity-95"
                        }`}
                      >
                        {allSubtopicsComplete ? (
                          <>
                            <Trophy className="h-4 w-4" />
                            Finish
                          </>
                        ) : activeLessonId && progress.completedLessonIds.includes(activeLessonId) ? (
                          <>
                            <CheckCircle2 className="h-4 w-4" />
                            Completed
                          </>
                        ) : (
                          <>
                            <PlayCircle className="h-4 w-4" />
                            Mark Complete
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </section>

          <aside className="space-y-6 xl:col-span-4">
            <div
              className={`sticky top-6 space-y-6 rounded-[28px] border p-5 sm:p-6 ${
                isLight
                  ? "border-gray-200 bg-white shadow-[0_14px_34px_rgba(15,23,42,0.06)]"
                  : "border-white/10 bg-[#09090c] shadow-2xl"
              }`}
            >
              <div>
                <p
                  className={`text-[10px] font-semibold uppercase tracking-[0.2em] ${
                    isLight ? "text-gray-500" : "text-gray-500"
                  }`}
                >
                  Course Outline
                </p>
                <h3
                  className={`mt-2 text-lg font-bold tracking-tight ${
                    isLight ? "text-gray-900" : "text-white"
                  }`}
                >
                  {topic.title}
                </h3>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div
                  className={`rounded-2xl border p-4 ${
                    isLight ? "border-gray-200 bg-gray-50" : "border-white/10 bg-white/[0.03]"
                  }`}
                >
                  <p className={`text-[10px] uppercase tracking-[0.16em] ${isLight ? "text-gray-500" : "text-gray-500"}`}>
                    Lessons
                  </p>
                  <p className={`mt-1 text-lg font-semibold ${isLight ? "text-gray-900" : "text-white"}`}>
                    {totalLessons}
                  </p>
                </div>
                <div
                  className={`rounded-2xl border p-4 ${
                    isLight ? "border-gray-200 bg-gray-50" : "border-white/10 bg-white/[0.03]"
                  }`}
                >
                  <p className={`text-[10px] uppercase tracking-[0.16em] ${isLight ? "text-gray-500" : "text-gray-500"}`}>
                    Progress
                  </p>
                  <p className={`mt-1 text-lg font-semibold ${isLight ? "text-gray-900" : "text-white"}`}>
                    {progressPercentage}%
                  </p>
                </div>
                <div
                  className={`rounded-2xl border p-4 ${
                    isLight ? "border-gray-200 bg-gray-50" : "border-white/10 bg-white/[0.03]"
                  }`}
                >
                  <p className={`text-[10px] uppercase tracking-[0.16em] ${isLight ? "text-gray-500" : "text-gray-500"}`}>
                    Time Spent
                  </p>
                  <p className={`mt-1 text-lg font-semibold ${isLight ? "text-gray-900" : "text-white"}`}>
                    {topicMinutes}m
                  </p>
                </div>
                <div
                  className={`rounded-2xl border p-4 ${
                    isLight ? "border-gray-200 bg-gray-50" : "border-white/10 bg-white/[0.03]"
                  }`}
                >
                  <p className={`text-[10px] uppercase tracking-[0.16em] ${isLight ? "text-gray-500" : "text-gray-500"}`}>
                    Reward
                  </p>
                  <p className={`mt-1 text-lg font-semibold ${isLight ? "text-gray-900" : "text-white"}`}>
                    +50 XP
                  </p>
                </div>
              </div>

               <div className="space-y-3">
                {topic.subtopics.map((subtopic, idx) => {
                  const completed = isLessonCompleted(subtopic.id);
                  const active = subtopic.id === activeLessonId;
                  const locked = isLessonLocked(subtopic.id);
                  const hasExercise = !!subtopic.content.example;

                  return (
                    <button
                      key={subtopic.id}
                      onClick={() => !locked && handleSelectLesson(subtopic.id)}
                      disabled={locked}
                      className={`group relative flex w-full flex-col gap-2 rounded-2xl border p-4 text-left transition-all ${
                        active
                          ? isLight
                            ? "border-pink-300 bg-pink-50 shadow-lg shadow-pink-500/10"
                            : "border-pink-500/30 bg-pink-500/10 ring-1 ring-pink-500/20"
                          : completed
                          ? isLight
                            ? "border-emerald-200 bg-emerald-50"
                            : "border-emerald-500/20 bg-emerald-500/10"
                          : locked
                          ? isLight
                            ? "border-gray-200 bg-gray-50 opacity-50"
                            : "border-white/5 bg-white/5 opacity-50"
                          : isLight
                          ? "border-gray-200 bg-white hover:border-pink-200 hover:bg-gray-50"
                          : "border-white/10 hover:border-pink-500/20 hover:bg-white/5"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="mt-1.5 flex h-2.5 w-2.5 shrink-0 items-center justify-center">
                          <div
                            className={`h-1.5 w-1.5 rounded-full ${
                              active ? "bg-pink-500" : completed ? "bg-emerald-500" : "bg-gray-300"
                            }`}
                          />
                        </div>

                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg">
                          {completed ? (
                            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                          ) : locked ? (
                            <Lock className="h-4 w-4 text-gray-400" />
                          ) : (
                            <span
                              className={`text-xs font-bold ${
                                active
                                  ? "text-pink-600"
                                  : isLight
                                  ? "text-gray-600"
                                  : "text-gray-300"
                              }`}
                            >
                               {idx + 1}
                             </span>
                           )}
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-start justify-between gap-2">
                            <p className={`truncate text-sm font-semibold ${isLight ? "text-gray-900" : "text-white"}`}>
                              {subtopic.title}
                            </p>
                            {subtopic.duration && (
                              <span className={`shrink-0 text-xs ${isLight ? "text-gray-400" : "text-gray-500"}`}>
                                {subtopic.duration}
                              </span>
                            )}
                          </div>

                          <div className="mt-1 flex items-center gap-2">
                            {hasExercise ? (
                              <span
                                className={`inline-flex items-center gap-1 text-xs ${
                                  isLight ? "text-blue-600" : "text-blue-400"
                                }`}
                              >
                                <Terminal className="h-3 w-3" />
                                Interactive
                              </span>
                            ) : (
                              <span className={`text-xs ${isLight ? "text-gray-400" : "text-gray-500"}`}>
                                Read only
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              <div
                className={`rounded-2xl border p-5 ${
                  isLight ? "border-gray-200 bg-gray-50" : "border-white/10 bg-white/[0.03]"
                }`}
              >
                <h4 className={`text-base font-semibold ${isLight ? "text-gray-900" : "text-white"}`}>
                  This topic includes
                </h4>
                <div className={`mt-4 space-y-3 text-sm ${isLight ? "text-gray-600" : "text-gray-400"}`}>
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4" />
                    {totalLessons} structured lessons
                  </div>
                  <div className="flex items-center gap-2">
                    <Terminal className="h-4 w-4" />
                    Interactive coding practice
                  </div>
                  <div className="flex items-center gap-2">
                    <Trophy className="h-4 w-4" />
                    Completion reward
                  </div>
                  <div className="flex items-center gap-2">
                    <Layers3 className="h-4 w-4" />
                    Guided topic progression
                  </div>
                </div>
              </div>

              <div
                className={`rounded-2xl border p-5 ${
                  isLight ? "border-pink-200 bg-pink-50" : "border-pink-500/20 bg-pink-500/10"
                }`}
              >
                <h4 className={`text-base font-semibold ${isLight ? "text-gray-900" : "text-white"}`}>
                  Ready to practice?
                </h4>
                <p className={`mt-2 text-sm ${isLight ? "text-gray-600" : "text-gray-400"}`}>
                  Turn this lesson into action with a challenge or duel once you finish the topic.
                </p>

                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <button
                    className={`flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition ${
                      isLight
                        ? "bg-white text-gray-800 hover:bg-gray-100"
                        : "bg-white/[0.06] text-white hover:bg-white/[0.1]"
                    }`}
                  >
                    <Trophy className="h-4 w-4" />
                    Practice Challenge
                  </button>

                  <button
                    className={`flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition ${
                      isLight
                        ? "bg-white text-gray-800 hover:bg-gray-100"
                        : "bg-white/[0.06] text-white hover:bg-white/[0.1]"
                    }`}
                  >
                    <Swords className="h-4 w-4" />
                    Start Duel
                  </button>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>

      <AnimatePresence>
        {showTopicCompleted && (
          <CompletionModal
            courseTitle={`${track.title}: ${topic.title}`}
            onPracticeChallenge={() => {}}
            onStartDuel={() => router.push("/dashboard/challenges")}
            onNextCourse={() => {
              if (nextIncompleteTopic) {
                router.push(`/dashboard/learning/track/${trackId}/topic/${nextIncompleteTopic.id}`);
              } else {
                router.push(`/dashboard/learning/track/${trackId}`);
              }
            }}
            nextCourseTitle={nextIncompleteTopic?.title}
            hasChallenge={false}
            isLight={isLight}
            isCourseCompletion={false}
            relatedChallengeCategory={track?.category}
            noteContent={{
              courseTitle: track.title,
              stepTitle: topic.title,
              description: topic.description,
              content: topic.subtopics.flatMap((subtopic) => subtopic.content.explanation),
              keyTakeaways: [],
            }}
          />
        )}
      </AnimatePresence>

      <LessonConfirmationModal
        isOpen={showConfirmationModal}
        onConfirm={() => {
          if (pendingAction === "complete") {
            confirmCompleteLesson();
          } else if (pendingAction === "next") {
            confirmNextLesson();
          }
        }}
        onCancel={() => {
          setShowConfirmationModal(false);
          setPendingAction(null);
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
      />
    <PageFooter />
    </div>
  );
}