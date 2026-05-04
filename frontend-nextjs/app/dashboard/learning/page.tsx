"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";
import {
  Clock,
  ChevronRight,
  MapPin,
  Search,
  Code2,
  Database,
  FolderOpen,
  BookOpen,
  GraduationCap,
  ArrowRight,
} from "lucide-react";
import { LEARNING_TRACKS, ADDITIONAL_TRACKS } from "./data";
import { useTheme } from "@/app/context/ThemeContext";
import FeedbackFAB from "../../components/FeedbackFAB";
import PageFooter from "@/app/components/PageFooter";
import LearningStatsHub from "./components/LearningStatsHub";
import { migrateLegacyProgress, TrackProgress } from "@/lib/learning-api";
import {
  getUserProgressKey,
  getUserLegacyProgressKey,
  getUserStreakKey,
} from "@/lib/auth";

type AccentColor =
  | "yellow"
  | "emerald"
  | "cyan"
  | "pink"
  | "purple"
  | "orange"
  | string;

type LearningStreakData = {
  currentStreak: number;
  lastCompletedDate: string | null;
};

function getFolderAccent(color: AccentColor, isLight: boolean) {
  switch (color) {
    case "yellow":
      return {
        dot: "bg-yellow-400",
        tab: isLight
          ? "bg-yellow-100 border-yellow-200"
          : "bg-yellow-500/10 border-yellow-500/20",
        shell: isLight
          ? "from-yellow-50/80 via-white to-white"
          : "from-yellow-500/[0.04] via-[#0c0c12] to-[#0c0c12]",
        icon: isLight
          ? "bg-yellow-100 text-yellow-700"
          : "bg-yellow-500/15 text-yellow-400",
      };

    case "emerald":
      return {
        dot: "bg-emerald-400",
        tab: isLight
          ? "bg-emerald-100 border-emerald-200"
          : "bg-emerald-500/10 border-emerald-500/20",
        shell: isLight
          ? "from-emerald-50/80 via-white to-white"
          : "from-emerald-500/[0.04] via-[#0c0c12] to-[#0c0c12]",
        icon: isLight
          ? "bg-emerald-100 text-emerald-700"
          : "bg-emerald-500/15 text-emerald-400",
      };

    case "cyan":
      return {
        dot: "bg-cyan-400",
        tab: isLight
          ? "bg-cyan-100 border-cyan-200"
          : "bg-cyan-500/10 border-cyan-500/20",
        shell: isLight
          ? "from-cyan-50/80 via-white to-white"
          : "from-cyan-500/[0.04] via-[#0c0c12] to-[#0c0c12]",
        icon: isLight
          ? "bg-cyan-100 text-cyan-700"
          : "bg-cyan-500/15 text-cyan-400",
      };

    case "pink":
      return {
        dot: "bg-pink-400",
        tab: isLight
          ? "bg-pink-100 border-pink-200"
          : "bg-pink-500/10 border-pink-500/20",
        shell: isLight
          ? "from-pink-50/80 via-white to-white"
          : "from-pink-500/[0.04] via-[#0c0c12] to-[#0c0c12]",
        icon: isLight
          ? "bg-pink-100 text-pink-700"
          : "bg-pink-500/15 text-pink-400",
      };

    case "purple":
      return {
        dot: "bg-purple-400",
        tab: isLight
          ? "bg-purple-100 border-purple-200"
          : "bg-purple-500/10 border-purple-500/20",
        shell: isLight
          ? "from-purple-50/80 via-white to-white"
          : "from-purple-500/[0.04] via-[#0c0c12] to-[#0c0c12]",
        icon: isLight
          ? "bg-purple-100 text-purple-700"
          : "bg-purple-500/15 text-purple-400",
      };

    case "orange":
      return {
        dot: "bg-orange-400",
        tab: isLight
          ? "bg-orange-100 border-orange-200"
          : "bg-orange-500/10 border-orange-500/20",
        shell: isLight
          ? "from-orange-50/80 via-white to-white"
          : "from-orange-500/[0.04] via-[#0c0c12] to-[#0c0c12]",
        icon: isLight
          ? "bg-orange-100 text-orange-700"
          : "bg-orange-500/15 text-orange-400",
      };

    default:
      return {
        dot: "bg-gray-400",
        tab: isLight
          ? "bg-gray-100 border-gray-200"
          : "bg-white/[0.05] border-white/10",
        shell: isLight
          ? "from-gray-50/80 via-white to-white"
          : "from-white/[0.03] via-[#0c0c12] to-[#0c0c12]",
        icon: isLight
          ? "bg-gray-100 text-gray-700"
          : "bg-white/[0.06] text-gray-300",
      };
  }
}

export default function LearningPage() {
  const router = useRouter();
  const { theme } = useTheme();
  const isLight = theme === "light";

  const [trackProgressMap, setTrackProgressMap] = useState<
    Record<string, TrackProgress>
  >(() => {
    if (typeof window === "undefined") return {};

    const key = getUserProgressKey();
    const saved = localStorage.getItem(key);

    try {
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [legacyProgress, setLegacyProgress] = useState<{
    paths: Record<string, { completedStepIds: string[] }>;
  }>(() => {
    if (typeof window === "undefined") return { paths: {} };

    const key = getUserLegacyProgressKey();
    const saved = localStorage.getItem(key);

    try {
      return saved ? JSON.parse(saved) : { paths: {} };
    } catch {
      return { paths: {} };
    }
  });

  const [streakData, setStreakData] = useState<LearningStreakData>(() => {
    if (typeof window === "undefined") {
      return {
        currentStreak: 0,
        lastCompletedDate: null,
      };
    }

    const key = getUserStreakKey();
    const saved = localStorage.getItem(key);

    if (!saved) {
      return {
        currentStreak: 0,
        lastCompletedDate: null,
      };
    }

    try {
      const parsed = JSON.parse(saved);

      return {
        currentStreak: parsed.currentStreak || 0,
        lastCompletedDate:
          parsed.lastCompletedDate || parsed.lastLearningDate || null,
      };
    } catch {
      return {
        currentStreak: 0,
        lastCompletedDate: null,
      };
    }
  });

  const [searchQuery, setSearchQuery] = useState("");

  const allTracks = useMemo(
    () => [...LEARNING_TRACKS, ...ADDITIONAL_TRACKS],
    []
  );

  const loadProgress = async () => {
    try {
      const data = await migrateLegacyProgress();

      if (data.trackProgress) {
        setTrackProgressMap(data.trackProgress);
      }

      if (data.legacyProgress) {
        setLegacyProgress({ paths: data.legacyProgress as any });
      }

      if (data.streak) {
        setStreakData({
          currentStreak: data.streak.currentStreak || 0,
          lastCompletedDate: data.streak.lastLearningDate || null,
        });
      }
    } catch (e) {
      console.error("Failed to load progress", e);
    }
  };

  useEffect(() => {
    loadProgress();

    const handleProgressUpdate = () => {
      loadProgress();
    };

    window.addEventListener(
      "codemaster-learning-updated",
      handleProgressUpdate
    );

    return () => {
      window.removeEventListener(
        "codemaster-learning-updated",
        handleProgressUpdate
      );
    };
  }, []);

  const getTrackProgress = (track: (typeof allTracks)[number]) => {
    const trackProgress = trackProgressMap[track.id];

    let totalLessons = 0;
    let completedLessons = 0;

    track.topics.forEach((topic) => {
      const topicLessons = topic.subtopics.length;
      totalLessons += topicLessons;

      let topicCompletedLessons = 0;

      const completedTopicIds = trackProgress?.completedTopicIds || [];
      const completedLessonIds = trackProgress?.completedLessonIds || [];

      if (completedTopicIds.includes(topic.id)) {
        topicCompletedLessons = topicLessons;
      } else {
        topic.subtopics.forEach((subtopic) => {
          if (
            trackProgress?.lessonProgress?.[subtopic.id]?.completed ||
            completedLessonIds.includes(subtopic.id)
          ) {
            topicCompletedLessons++;
          }
        });
      }

      completedLessons += topicCompletedLessons;
    });

    const progressPercentage =
      totalLessons > 0
        ? Math.round((completedLessons / totalLessons) * 100)
        : 0;

    const status =
      progressPercentage === 100
        ? "completed"
        : progressPercentage > 0
        ? "in_progress"
        : "not_started";

    return {
      totalLessons,
      completedLessons,
      progressPercentage,
      status,
    };
  };

  const orderedTracks = useMemo(() => {
    return [...allTracks].sort((a, b) => {
      const aProgress = getTrackProgress(a).progressPercentage;
      const bProgress = getTrackProgress(b).progressPercentage;

      if (aProgress !== bProgress) return bProgress - aProgress;

      const aStarted = aProgress > 0;
      const bStarted = bProgress > 0;

      if (aStarted !== bStarted) return aStarted ? -1 : 1;

      return 0;
    });
  }, [allTracks, trackProgressMap]);

  const filteredTracks = useMemo(() => {
    const visibleTracks = orderedTracks.filter(Boolean);

    if (!searchQuery.trim()) return visibleTracks;

    const query = searchQuery.toLowerCase();

    return visibleTracks.filter(
      (track) =>
        track.title.toLowerCase().includes(query) ||
        track.description.toLowerCase().includes(query) ||
        track.subtitle.toLowerCase().includes(query)
    );
  }, [searchQuery, orderedTracks]);

  const trackStats = useMemo(() => {
    let totalTopics = 0;
    let completedTopics = 0;
    let completedLessons = 0;
    let totalLessons = 0;

    allTracks.forEach((track) => {
      const progress = trackProgressMap[track.id];
      const completedTopicIds = progress?.completedTopicIds || [];
      const completedLessonIds = progress?.completedLessonIds || [];

      totalTopics += track.topics.length;

      track.topics.forEach((topic) => {
        const topicLessons = topic.subtopics.length;
        totalLessons += topicLessons;

        let topicCompletedLessons = 0;

        if (completedTopicIds.includes(topic.id)) {
          completedTopics++;
          topicCompletedLessons = topicLessons;
        } else {
          topic.subtopics.forEach((subtopic) => {
            if (
              progress?.lessonProgress?.[subtopic.id]?.completed ||
              completedLessonIds.includes(subtopic.id)
            ) {
              topicCompletedLessons++;
            }
          });
        }

        completedLessons += topicCompletedLessons;
      });
    });

    const legacyLessonsCompleted = Object.values(
      legacyProgress?.paths || {}
    ).reduce((sum, p) => sum + (p.completedStepIds?.length || 0), 0);

    const totalLessonsFromBoth = completedLessons + legacyLessonsCompleted;

    const milestones = [
      { count: 5, label: "5", iconName: "Sprout" },
      { count: 10, label: "10", iconName: "BookOpen" },
      { count: 15, label: "15", iconName: "Code2" },
      { count: 20, label: "20", iconName: "Flame" },
      { count: 25, label: "25", iconName: "Zap" },
      { count: 30, label: "30", iconName: "Award" },
      { count: 40, label: "40", iconName: "Gem" },
      { count: 50, label: "50", iconName: "Crown" },
    ];

    const earnedMilestones = milestones
      .filter((m) => totalLessonsFromBoth >= m.count)
      .reverse();

    const progressPercent =
      totalLessons > 0
        ? Math.round((completedLessons / totalLessons) * 100)
        : 0;

    return {
      totalTopics,
      completedTopics,
      totalLessons,
      totalLessonsCompleted: completedLessons,
      progressPercent,
      earnedMilestones,
    };
  }, [trackProgressMap, legacyProgress, allTracks]);

  const continueLearning = useMemo(() => {
    const inProgressTrack = orderedTracks.find((track) => {
      const progressData = trackProgressMap[track.id];
      const progress = getTrackProgress(track).progressPercentage;

      return (
        progress > 0 ||
        !!progressData?.lastAccessedAt ||
        !!progressData?.startedAt
      );
    });

    const selectedTrack = inProgressTrack || orderedTracks[0];

    if (!selectedTrack) return null;

    const progress = trackProgressMap[selectedTrack.id];
    const completedTopicIds = progress?.completedTopicIds || [];
    const completedLessonIds = progress?.completedLessonIds || [];

    for (const topic of selectedTrack.topics) {
      const topicFullyCompleted = completedTopicIds.includes(topic.id);

      if (topicFullyCompleted) continue;

      const nextLesson =
        topic.subtopics.find(
          (subtopic) =>
            !progress?.lessonProgress?.[subtopic.id]?.completed &&
            !completedLessonIds.includes(subtopic.id)
        ) || topic.subtopics[0];

      return {
        track: selectedTrack,
        topic,
        lesson: nextLesson,
        href: `/dashboard/learning/track/${selectedTrack.id}/topic/${topic.id}`,
      };
    }

    return {
      track: selectedTrack,
      topic: selectedTrack.topics[0],
      lesson: selectedTrack.topics[0]?.subtopics[0],
      href: `/dashboard/learning/track/${selectedTrack.id}`,
    };
  }, [orderedTracks, trackProgressMap]);

  const handleTrackClick = (trackId: string) => {
    router.push(`/dashboard/learning/track/${trackId}`);
  };

  const handleExploreCourses = () => {
    router.push("/dashboard/learning/explore");
  };

  return (
    <div className="space-y-7">
      <section className="space-y-5">
        <div className="mx-auto max-w-[1500px] px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_680px] xl:items-start">
            <div>
              <div className="flex items-center gap-2">
                <MapPin
                  className={`h-4 w-4 ${
                    isLight ? "text-pink-600" : "text-pink-400"
                  }`}
                />
                <p
                  className={`text-[11px] font-semibold uppercase tracking-[0.22em] ${
                    isLight ? "text-pink-600" : "text-pink-300"
                  }`}
                >
                  Learning Tracks
                </p>
              </div>

              <h1
                className={`mt-2 text-[2.2rem] font-semibold tracking-tight ${
                  isLight ? "text-gray-900" : "text-white"
                }`}
              >
                Start Your Learning Journey
              </h1>

              <p
                className={`mt-2 max-w-2xl text-sm leading-6 ${
                  isLight ? "text-gray-600" : "text-gray-400"
                }`}
              >
                Choose a track and master programming fundamentals step by step.
              </p>

              <div className="mt-4 flex flex-wrap gap-3">
                <button
                  onClick={() => router.push("/dashboard/learning/journal")}
                  className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-colors ${
                    isLight
                      ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                      : "bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20"
                  }`}
                >
                  <BookOpen className="h-4 w-4" />
                  View Journal
                </button>

                {continueLearning && (
                  <button
                    onClick={() => router.push(continueLearning.href)}
                    className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition-all ${
                      isLight
                        ? "bg-pink-600 text-white hover:bg-pink-700"
                        : "bg-pink-500 text-white hover:bg-pink-400"
                    }`}
                  >
                    Continue Learning
                    <ArrowRight className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>

            <LearningStatsHub
              isLight={isLight}
              streak={streakData.currentStreak}
              lastCompletedDate={streakData.lastCompletedDate || undefined}
              completedTopics={trackStats.completedTopics}
              totalTopics={trackStats.totalTopics}
              completedLessons={trackStats.totalLessonsCompleted}
              totalLessons={trackStats.totalLessons}
              progressPercent={trackStats.progressPercent}
              earnedMilestones={trackStats.earnedMilestones}
              onContinueLearning={
                continueLearning
                  ? () => router.push(continueLearning.href)
                  : undefined
              }
            />
          </div>

          {continueLearning && (
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
              className={`mt-6 overflow-hidden rounded-2xl border ${
                isLight
                  ? "border-pink-100 bg-white shadow-[0_16px_40px_rgba(15,23,42,0.06)]"
                  : "border-pink-500/10 bg-gradient-to-r from-pink-500/[0.08] via-purple-500/[0.05] to-transparent"
              }`}
            >
              <div className="flex flex-col gap-4 p-5 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex items-start gap-4">
                  <div
                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${
                      isLight
                        ? "bg-pink-50 text-pink-600"
                        : "bg-pink-500/15 text-pink-300"
                    }`}
                  >
                    <Code2 className="h-5 w-5" />
                  </div>

                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <p
                        className={`text-sm font-semibold ${
                          isLight ? "text-gray-900" : "text-white"
                        }`}
                      >
                        Continue where you stopped
                      </p>
                      <span
                        className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                          isLight
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-emerald-500/10 text-emerald-300"
                        }`}
                      >
                        Recommended
                      </span>
                    </div>

                    <h2
                      className={`mt-1 text-xl font-bold ${
                        isLight ? "text-gray-900" : "text-white"
                      }`}
                    >
                      {continueLearning.track.title}
                    </h2>

                    <p
                      className={`mt-1 text-sm ${
                        isLight ? "text-gray-600" : "text-gray-400"
                      }`}
                    >
                      Next topic:{" "}
                      <span
                        className={
                          isLight ? "text-gray-900" : "text-gray-200"
                        }
                      >
                        {continueLearning.topic?.title}
                      </span>
                      {continueLearning.lesson?.title
                        ? ` • ${continueLearning.lesson.title}`
                        : ""}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => router.push(continueLearning.href)}
                  className={`flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-bold transition-all ${
                    isLight
                      ? "bg-pink-600 text-white hover:bg-pink-700"
                      : "bg-pink-500 text-white hover:bg-pink-400"
                  }`}
                >
                  Resume Learning
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </motion.div>
          )}
        </div>

        <div className="mx-auto max-w-[1500px] px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-3 lg:flex-row">
            <div
              className={`flex flex-1 items-center rounded-2xl border px-4 py-3 transition-all ${
                isLight
                  ? "border-gray-200 bg-white focus-within:border-pink-300"
                  : "border-white/10 bg-[#0c0c10] focus-within:border-pink-500/30"
              }`}
            >
              <Search
                className={`mr-3 h-4 w-4 ${
                  isLight ? "text-pink-500" : "text-pink-300"
                }`}
              />
              <input
                type="text"
                placeholder="Search tracks, topics, or technologies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full bg-transparent text-sm outline-none ${
                  isLight
                    ? "text-gray-900 placeholder:text-gray-400"
                    : "text-white placeholder:text-gray-600"
                }`}
              />

              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className={`ml-2 rounded-lg px-2 py-1 text-xs transition ${
                    isLight
                      ? "text-gray-500 hover:text-gray-700"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  Clear
                </button>
              )}
            </div>

            <button
              onClick={handleExploreCourses}
              className={`flex items-center justify-center gap-2 rounded-2xl border px-5 py-3 font-medium transition-all ${
                isLight
                  ? "border-pink-200 bg-pink-50 text-pink-700 hover:bg-pink-100"
                  : "border-pink-500/15 bg-pink-500/10 text-pink-300 hover:bg-pink-500/15"
              }`}
            >
              <GraduationCap className="h-4 w-4" />
              <span className="whitespace-nowrap">Browse other Courses</span>
            </button>
          </div>
        </div>
      </section>

      <section className="py-2">
        <div className="mx-auto max-w-[1500px] px-4 sm:px-6 lg:px-8">
          <div className="grid gap-5 sm:grid-cols-2 2xl:grid-cols-3">
            {filteredTracks.map((track) => {
              const {
                totalLessons,
                completedLessons,
                progressPercentage,
                status,
              } = getTrackProgress(track);

              const accent = getFolderAccent(track.color, isLight);

              return (
                <motion.article
                  key={track.id}
                  initial={{ opacity: 1, y: 0 }}
                  animate={{ opacity: 1, y: 0 }}
                  onClick={() => handleTrackClick(track.id)}
                  className="group h-full cursor-pointer"
                  whileHover={{ y: -3 }}
                  transition={{ duration: 0.18 }}
                >
                  <div className="relative h-full pt-3">
                    <div
                      className={`absolute left-5 top-0 z-20 h-7 w-20 rounded-t-[12px] rounded-br-[10px] border bg-gradient-to-b ${accent.tab}`}
                    >
                      <div className="flex h-full items-center justify-between px-2">
                        <span
                          className={`h-2 w-2 rounded-full ${accent.dot}`}
                        />
                        <FolderOpen
                          className={`h-3.5 w-3.5 ${
                            isLight ? "text-gray-500" : "text-gray-400"
                          }`}
                        />
                      </div>
                    </div>

                    <div
                      className={`relative flex h-full min-h-[335px] flex-col overflow-hidden rounded-[22px] border bg-gradient-to-b ${
                        accent.shell
                      } ${
                        isLight
                          ? "border-gray-200 shadow-[0_14px_32px_rgba(15,23,42,0.07)]"
                          : "border-white/10 shadow-[0_14px_32px_rgba(0,0,0,0.22)]"
                      } transition-all duration-300 group-hover:shadow-[0_18px_38px_rgba(15,23,42,0.12)]`}
                    >
                      {track.coverImage ? (
                        <div className="relative h-[90px] w-full overflow-hidden bg-gradient-to-br from-pink-500 via-fuchsia-500 to-purple-500">
                          <Image
                            src={track.coverImage}
                            alt={track.title}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                            onError={(e) => {
                              const target =
                                e.currentTarget as HTMLImageElement;
                              target.style.display = "none";
                            }}
                            sizes="(max-width: 768px) 100vw, (max-width: 1536px) 50vw, 33vw"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
                        </div>
                      ) : (
                        <div className="h-2 w-full bg-gradient-to-r from-pink-500 via-fuchsia-500 to-purple-500" />
                      )}

                      <div className="flex flex-1 flex-col p-4">
                        <div className="flex items-start justify-between gap-3">
                          <div
                            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${accent.icon}`}
                          >
                            {track.type === "master_track" ? (
                              <Code2 className="h-[18px] w-[18px]" />
                            ) : (
                              <Database className="h-[18px] w-[18px]" />
                            )}
                          </div>

                          <div
                            className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                              status === "completed"
                                ? isLight
                                  ? "bg-emerald-100 text-emerald-700"
                                  : "bg-emerald-500/20 text-emerald-300"
                                : status === "in_progress"
                                ? isLight
                                  ? "bg-pink-50 text-pink-700"
                                  : "bg-pink-500/15 text-pink-300"
                                : isLight
                                ? "bg-gray-100 text-gray-600"
                                : "bg-white/[0.06] text-gray-300"
                            }`}
                          >
                            {status === "completed"
                              ? "Completed"
                              : status === "in_progress"
                              ? "In Progress"
                              : "New"}
                          </div>
                        </div>

                        <div className="mt-4">
                          <h3
                            className={`line-clamp-1 text-[1.45rem] font-bold leading-tight transition-colors duration-300 ${
                              isLight
                                ? "text-gray-900 group-hover:text-pink-600"
                                : "text-white group-hover:text-pink-400"
                            }`}
                          >
                            {track.title}
                          </h3>

                          <p
                            className={`mt-1 text-xs font-medium ${
                              isLight ? "text-gray-500" : "text-gray-400"
                            }`}
                          >
                            {track.subtitle}
                          </p>
                        </div>

                        <p
                          className={`mt-3 min-h-[44px] text-sm leading-6 ${
                            isLight ? "text-gray-600" : "text-gray-400"
                          } line-clamp-2`}
                        >
                          {track.description}
                        </p>

                        <div
                          className={`mt-4 flex items-center gap-4 text-xs ${
                            isLight ? "text-gray-500" : "text-gray-500"
                          }`}
                        >
                          <span className="flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            {track.totalHours}h total
                          </span>
                        </div>

                        <div className="mt-3">
                          <div
                            className={`h-2 overflow-hidden rounded-full ${
                              isLight ? "bg-gray-100" : "bg-white/[0.06]"
                            }`}
                          >
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${progressPercentage}%` }}
                              transition={{ duration: 0.75, ease: "easeOut" }}
                              className={`h-full rounded-full ${
                                status === "completed"
                                  ? "bg-emerald-500"
                                  : "bg-gradient-to-r from-pink-500 to-purple-500"
                              }`}
                            />
                          </div>

                          <p
                            className={`mt-2 text-xs ${
                              isLight ? "text-gray-500" : "text-gray-500"
                            }`}
                          >
                            <span
                              className={
                                isLight ? "text-gray-700" : "text-gray-300"
                              }
                            >
                              {completedLessons}
                            </span>
                            /{totalLessons} lessons completed
                          </p>
                        </div>

                        <motion.button
                          whileHover={{ scale: 1.01 }}
                          whileTap={{ scale: 0.985 }}
                          className={`mt-auto flex w-full items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-300 ${
                            isLight
                              ? "bg-gray-100 text-gray-700 hover:bg-pink-500 hover:text-white"
                              : "bg-white/[0.06] text-white hover:bg-pink-500"
                          }`}
                        >
                          {status === "completed"
                            ? "Review Track"
                            : status === "in_progress"
                            ? "Continue Track"
                            : "Start Track"}
                          <ChevronRight className="h-4 w-4" />
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </div>
        </div>

        {filteredTracks.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`mx-auto mt-12 flex max-w-2xl flex-col items-center justify-center rounded-2xl border py-16 ${
              isLight
                ? "border-gray-200 bg-white"
                : "border-white/10 bg-[#0c0c12]"
            }`}
          >
            <Search
              className={`h-12 w-12 ${
                isLight ? "text-gray-300" : "text-gray-600"
              }`}
            />
            <h3
              className={`mt-4 text-lg font-semibold ${
                isLight ? "text-gray-900" : "text-white"
              }`}
            >
              No tracks found
            </h3>
            <p
              className={`mt-2 text-sm ${
                isLight ? "text-gray-500" : "text-gray-400"
              }`}
            >
              Try adjusting your search
            </p>
            <button
              onClick={() => setSearchQuery("")}
              className={`mt-4 text-sm font-medium ${
                isLight
                  ? "text-pink-600 hover:text-pink-700"
                  : "text-pink-400 hover:text-pink-300"
              }`}
            >
              Clear filters
            </button>
          </motion.div>
        )}
      </section>

      <FeedbackFAB />
      <PageFooter />
    </div>
  );
}