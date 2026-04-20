"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Clock,
  ChevronRight,
  MapPin,
  Search,
  Flame,
  Code2,
  Database,
  FolderOpen,
  BookOpen,
  GraduationCap,
  Sprout,
  Zap,
  Crown,
  Gem,
  Award,
} from "lucide-react";
import { LEARNING_TRACKS, ADDITIONAL_TRACKS } from "./data";
import { useTheme } from "@/app/context/ThemeContext";
import FeedbackFAB from "../../components/FeedbackFAB";
import PageFooter from "@/app/components/PageFooter";
import {
  getLearningProgress,
  migrateLegacyProgress,
} from "@/lib/learning-api";
import {
  getUserProgressKey,
  getUserLegacyProgressKey,
  getUserStreakKey,
} from "@/lib/auth";

interface TrackProgress {
  completedTopicIds: string[];
  completedLessonIds?: string[];
  lessonProgress?: {
    [lessonId: string]: { completed: boolean; timeSpentSeconds: number };
  };
  topicTimeSpent?: { [topicId: string]: number };
  startedAt?: string;
  lastAccessedAt?: string;
}

type AccentColor =
  | "yellow"
  | "emerald"
  | "cyan"
  | "pink"
  | "purple"
  | "orange"
  | string;

function getFolderAccent(color: AccentColor, isLight: boolean) {
  switch (color) {
    case "yellow":
      return {
        dot: "bg-yellow-400",
        tab: isLight
          ? "bg-yellow-100 border-yellow-200"
          : "bg-yellow-500/10 border-yellow-500/20",
        shell: isLight
          ? "from-yellow-50/90 via-white to-white"
          : "from-yellow-500/[0.04] via-[#0c0c12] to-[#0c0c12]",
        icon: isLight ? "bg-yellow-100 text-yellow-700" : "bg-yellow-500/15 text-yellow-400",
      };
    case "emerald":
      return {
        dot: "bg-emerald-400",
        tab: isLight
          ? "bg-emerald-100 border-emerald-200"
          : "bg-emerald-500/10 border-emerald-500/20",
        shell: isLight
          ? "from-emerald-50/90 via-white to-white"
          : "from-emerald-500/[0.04] via-[#0c0c12] to-[#0c0c12]",
        icon: isLight
          ? "bg-emerald-100 text-emerald-700"
          : "bg-emerald-500/15 text-emerald-400",
      };
    case "cyan":
      return {
        dot: "bg-cyan-400",
        tab: isLight ? "bg-cyan-100 border-cyan-200" : "bg-cyan-500/10 border-cyan-500/20",
        shell: isLight
          ? "from-cyan-50/90 via-white to-white"
          : "from-cyan-500/[0.04] via-[#0c0c12] to-[#0c0c12]",
        icon: isLight ? "bg-cyan-100 text-cyan-700" : "bg-cyan-500/15 text-cyan-400",
      };
    case "pink":
      return {
        dot: "bg-pink-400",
        tab: isLight ? "bg-pink-100 border-pink-200" : "bg-pink-500/10 border-pink-500/20",
        shell: isLight
          ? "from-pink-50/90 via-white to-white"
          : "from-pink-500/[0.04] via-[#0c0c12] to-[#0c0c12]",
        icon: isLight ? "bg-pink-100 text-pink-700" : "bg-pink-500/15 text-pink-400",
      };
    case "purple":
      return {
        dot: "bg-purple-400",
        tab: isLight
          ? "bg-purple-100 border-purple-200"
          : "bg-purple-500/10 border-purple-500/20",
        shell: isLight
          ? "from-purple-50/90 via-white to-white"
          : "from-purple-500/[0.04] via-[#0c0c12] to-[#0c0c12]",
        icon: isLight ? "bg-purple-100 text-purple-700" : "bg-purple-500/15 text-purple-400",
      };
    case "orange":
      return {
        dot: "bg-orange-400",
        tab: isLight
          ? "bg-orange-100 border-orange-200"
          : "bg-orange-500/10 border-orange-500/20",
        shell: isLight
          ? "from-orange-50/90 via-white to-white"
          : "from-orange-500/[0.04] via-[#0c0c12] to-[#0c0c12]",
        icon: isLight ? "bg-orange-100 text-orange-700" : "bg-orange-500/15 text-orange-400",
      };
    default:
      return {
        dot: "bg-gray-400",
        tab: isLight ? "bg-gray-100 border-gray-200" : "bg-white/[0.05] border-white/10",
        shell: isLight
          ? "from-gray-50/90 via-white to-white"
          : "from-white/[0.03] via-[#0c0c12] to-[#0c0c12]",
        icon: isLight ? "bg-gray-100 text-gray-700" : "bg-white/[0.06] text-gray-300",
      };
  }
}

export default function LearningPage() {
  const router = useRouter();
  const { theme } = useTheme();
  const isLight = theme === "light";

  const [trackProgressMap, setTrackProgressMap] = useState<Record<string, TrackProgress>>({});
  const [legacyProgress, setLegacyProgress] = useState<{
    paths: Record<string, { completedStepIds: string[] }>;
  }>({ paths: {} });
  const [streak, setStreak] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");

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
        setStreak(data.streak.currentStreak || 0);
      }
    } catch (e) {
      console.error("Failed to load progress", e);
      // Fallback to localStorage
      const TRACK_PROGRESS_KEY = getUserProgressKey();
      const LEGACY_PROGRESS_KEY = getUserLegacyProgressKey();

      const trackSaved = localStorage.getItem(TRACK_PROGRESS_KEY);
      if (trackSaved) {
        try {
          setTrackProgressMap(JSON.parse(trackSaved));
        } catch (e) {
          console.error("Failed to parse track progress", e);
        }
      }

      const legacySaved = localStorage.getItem(LEGACY_PROGRESS_KEY);
      if (legacySaved) {
        try {
          setLegacyProgress(JSON.parse(legacySaved));
        } catch (e) {
          console.error("Failed to parse legacy progress", e);
        }
      }

      const streakKey = getUserStreakKey();
      const streakData = localStorage.getItem(streakKey);
      if (streakData) {
        try {
          const parsed = JSON.parse(streakData);
          setStreak(parsed.currentStreak || 0);
        } catch (e) {
          console.error("Failed to parse streak", e);
        }
      }
    }
  };

  useEffect(() => {
    loadProgress();

    // Listen for progress updates
    const handleProgressUpdate = () => {
      loadProgress();
    };

    window.addEventListener("codemaster-learning-updated", handleProgressUpdate);
    return () => {
      window.removeEventListener("codemaster-learning-updated", handleProgressUpdate);
    };
  }, []);

  const allTracks = [...LEARNING_TRACKS, ...ADDITIONAL_TRACKS];

  const filteredTracks = useMemo(() => {
    if (!searchQuery.trim()) return allTracks;
    const query = searchQuery.toLowerCase();
    return allTracks.filter(
      (track) =>
        track.title.toLowerCase().includes(query) ||
        track.description.toLowerCase().includes(query) ||
        track.subtitle.toLowerCase().includes(query)
    );
  }, [searchQuery, allTracks]);

  const trackStats = useMemo(() => {
    let totalTopics = 0;
    let completedTopics = 0;
    let completedLessons = 0;

    allTracks.forEach((track) => {
      const progress = trackProgressMap[track.id];
      totalTopics += track.topics.length;

      track.topics.forEach((topic) => {
        const topicLessons = topic.subtopics.length;
        let topicCompletedLessons = 0;

        if (progress?.completedTopicIds?.includes(topic.id)) {
          completedTopics++;
          topicCompletedLessons = topicLessons;
        } else {
          topic.subtopics.forEach((subtopic) => {
            if (
              progress?.lessonProgress?.[subtopic.id]?.completed ||
              progress?.completedLessonIds?.includes(subtopic.id)
            ) {
              topicCompletedLessons++;
            }
          });
        }

        completedLessons += topicCompletedLessons;
      });
    });

    const legacyLessonsCompleted = Object.values(legacyProgress?.paths || {}).reduce(
      (sum, p) => sum + (p.completedStepIds?.length || 0),
      0
    );

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

    return {
      totalTopics,
      completedTopics,
      totalLessonsCompleted: completedLessons,
      earnedMilestones,
    };
  }, [trackProgressMap, allTracks, legacyProgress]);

  const handleTrackClick = (trackId: string) => {
    router.push(`/dashboard/learning/track/${trackId}`);
  };

  const handleExploreCourses = () => {
    router.push("/dashboard/learning/explore");
  };

  const getMilestoneIcon = (iconName: string) => {
    const iconMap: Record<string, React.ReactNode> = {
      Sprout: <Sprout className="h-4 w-4" />,
      BookOpen: <BookOpen className="h-4 w-4" />,
      Code2: <Code2 className="h-4 w-4" />,
      Flame: <Flame className="h-4 w-4" />,
      Zap: <Zap className="h-4 w-4" />,
      Award: <Award className="h-4 w-4" />,
      Gem: <Gem className="h-4 w-4" />,
      Crown: <Crown className="h-4 w-4" />,
    };
    return iconMap[iconName] || null;
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.06,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 16 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.32,
        ease: [0.25, 0.1, 0.25, 1] as const,
      },
    },
  };

  return (
    <div className="space-y-6">
      <section className="space-y-5">
        <div className="mx-auto max-w-[1500px] px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
            <div className="max-w-2xl">
              <div className="flex items-center gap-2">
                <MapPin className={`h-4 w-4 ${isLight ? "text-pink-600" : "text-pink-400"}`} />
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
                className={`mt-2 text-sm leading-6 ${
                  isLight ? "text-gray-600" : "text-gray-400"
                }`}
              >
                Choose a track and master programming fundamentals step by step
              </p>

              <div className="mt-4 flex gap-3">
                <button
                  onClick={() => router.push("/dashboard/learning/journal")}
                  className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                    isLight
                      ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                      : "bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20"
                  }`}
                >
                  <BookOpen className="h-4 w-4" />
                  View Journal
                </button>
              </div>
            </div>

            <div className="grid w-full max-w-[600px] grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
              <div
                className={`rounded-2xl border px-5 py-4 ${
                  isLight
                    ? "border-orange-200 bg-orange-50 shadow-[0_10px_24px_rgba(15,23,42,0.04)]"
                    : "border-orange-500/15 bg-orange-500/[0.06]"
                }`}
              >
                <p
                  className={`text-[10px] uppercase tracking-[0.18em] ${
                    isLight ? "text-orange-700/80" : "text-orange-200/80"
                  }`}
                >
                  <Flame className={`mr-1 inline h-3 w-3 ${streak > 0 ? "animate-pulse" : ""}`} />
                  Streak
                </p>
                <p className={`mt-2 text-2xl font-semibold ${isLight ? "text-gray-900" : "text-white"}`}>
                  {streak}
                </p>
              </div>

              <div
                className={`rounded-2xl border px-5 py-4 ${
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
                  <BookOpen className="mr-1 inline h-3 w-3" />
                  Topics Done
                </p>
                <p
                  className={`mt-2 text-2xl font-semibold ${
                    isLight ? "text-gray-900" : "text-white"
                  }`}
                >
                  {trackStats.completedTopics}/{trackStats.totalTopics}
                </p>
                <p className={`mt-1 text-xs ${isLight ? "text-emerald-700" : "text-emerald-300/70"}`}>
                  {trackStats.totalLessonsCompleted} lessons completed
                </p>
              </div>

              <div
                className={`rounded-2xl border px-5 py-4 ${
                  isLight
                    ? "border-amber-200 bg-amber-50 shadow-[0_10px_24px_rgba(15,23,42,0.04)]"
                    : "border-amber-500/15 bg-amber-500/[0.06]"
                }`}
              >
                <p
                  className={`text-[10px] uppercase tracking-[0.18em] ${
                    isLight ? "text-amber-700/80" : "text-amber-200/80"
                  }`}
                >
                  <Award className="mr-1 inline h-3 w-3" />
                  Badges
                </p>

                {trackStats.earnedMilestones.length > 0 ? (
                  <>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {trackStats.earnedMilestones.slice(0, 4).map((milestone, idx) => (
                        <div
                          key={idx}
                          className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-semibold ${
                            isLight
                              ? "bg-amber-100 text-amber-800"
                              : "bg-amber-500/20 text-amber-300"
                          }`}
                        >
                          {getMilestoneIcon(milestone.iconName)}
                          <span>{milestone.label}</span>
                        </div>
                      ))}
                    </div>

                    {trackStats.earnedMilestones.length > 4 && (
                      <p className={`mt-2 text-xs ${isLight ? "text-amber-700" : "text-amber-300/70"}`}>
                        +{trackStats.earnedMilestones.length - 4} more badges
                      </p>
                    )}
                  </>
                ) : (
                  <p className={`mt-2 text-sm ${isLight ? "text-amber-700" : "text-amber-300/70"}`}>
                    No badges yet
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-[1500px] px-4 sm:px-6 lg:px-8">
          <div className="flex gap-3">
            <div
              className={`flex-1 flex items-center rounded-2xl border px-4 py-3 transition-all ${
                isLight
                  ? "border-gray-200 bg-white focus-within:border-pink-300"
                  : "border-white/10 bg-[#0c0c10] focus-within:border-pink-500/30"
              }`}
            >
              <Search className={`mr-3 h-4 w-4 ${isLight ? "text-pink-500" : "text-pink-300"}`} />
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
                    isLight ? "text-gray-500 hover:text-gray-700" : "text-gray-400 hover:text-white"
                  }`}
                >
                  Clear
                </button>
              )}
            </div>

            <button
              onClick={handleExploreCourses}
              className={`flex items-center gap-2 rounded-2xl border px-5 py-3 transition-all font-medium ${
                isLight
                  ? "border-pink-200 bg-pink-50 hover:bg-pink-100 text-pink-700"
                  : "border-pink-500/15 bg-pink-500/10 hover:bg-pink-500/15 text-pink-300"
              }`}
            >
              <GraduationCap className="h-4 w-4" />
              <span className="whitespace-nowrap">Browse other Courses</span>
            </button>
          </div>
        </div>
      </section>

      <section className="py-2">
        <motion.div
          className="mx-auto max-w-[1500px] px-4 sm:px-6 lg:px-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="grid gap-7 md:grid-cols-2 xl:grid-cols-3">
            {filteredTracks.map((track) => {
              const trackProgress = trackProgressMap[track.id];

              let totalLessons = 0;
              let completedLessons = 0;

              track.topics.forEach((topic) => {
                const topicLessons = topic.subtopics.length;
                totalLessons += topicLessons;

                let topicCompletedLessons = 0;

                if (trackProgress?.completedTopicIds?.includes(topic.id)) {
                  topicCompletedLessons = topicLessons;
                } else {
                  topic.subtopics.forEach((subtopic) => {
                    if (
                      trackProgress?.lessonProgress?.[subtopic.id]?.completed ||
                      trackProgress?.completedLessonIds?.includes(subtopic.id)
                    ) {
                      topicCompletedLessons++;
                    }
                  });
                }

                completedLessons += topicCompletedLessons;
              });

              const progressPercentage =
                totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

              const status =
                progressPercentage === 100
                  ? "completed"
                  : progressPercentage > 0
                  ? "in_progress"
                  : "not_started";

              const accent = getFolderAccent(track.color, isLight);

              return (
                <motion.article
                  key={track.id}
                  variants={itemVariants}
                  onClick={() => handleTrackClick(track.id)}
                  className="group h-full cursor-pointer"
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="relative h-full pt-4">
                    <div
                      className={`absolute inset-x-3 bottom-0 top-5 rounded-[22px] ${
                        isLight
                          ? "bg-gray-100/80 shadow-[0_14px_30px_rgba(15,23,42,0.06)]"
                          : "bg-black/25 shadow-[0_14px_30px_rgba(0,0,0,0.25)]"
                      } transition-all duration-300 group-hover:translate-y-[3px]`}
                    />

                    <div
                      className={`absolute left-5 top-0 z-20 h-8 w-20 rounded-t-[12px] rounded-br-[10px] border bg-gradient-to-b ${accent.tab} transition-all duration-300`}
                    >
                      <div className="flex h-full items-center justify-between px-2">
                        <span className={`h-2 w-2 rounded-full ${accent.dot}`} />
                        <FolderOpen
                          className={`h-3.5 w-3.5 ${
                            isLight ? "text-gray-500" : "text-gray-400"
                          }`}
                        />
                      </div>
                    </div>

                    <div
                      className={`relative z-10 flex h-full flex-col overflow-hidden rounded-[24px] border bg-gradient-to-b ${
                        accent.shell
                      } ${
                        isLight
                          ? "border-gray-200 shadow-[0_16px_38px_rgba(15,23,42,0.08)]"
                          : "border-white/10 shadow-[0_16px_38px_rgba(0,0,0,0.28)]"
                      } transition-all duration-300 group-hover:shadow-[0_20px_44px_rgba(15,23,42,0.12)]`}
                    >
                      {track.coverImage ? (
                        <div className="relative h-28 w-full overflow-hidden">
                          <img
                            src={track.coverImage}
                            alt={track.title}
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
                        </div>
                      ) : (
                        <div className="h-2 w-full bg-gradient-to-r from-pink-500 via-fuchsia-500 to-purple-500" />
                      )}

                      <div
                        className={`m-3 flex flex-1 flex-col rounded-[16px] border p-4 ${
                          isLight
                            ? "border-white/80 bg-white/92"
                            : "border-white/5 bg-white/[0.03]"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div
                            className={`flex h-10 w-10 items-center justify-center rounded-xl ${accent.icon}`}
                          >
                            {track.type === "master_track" ? (
                              <Code2 className="h-4.5 w-4.5" />
                            ) : (
                              <Database className="h-4.5 w-4.5" />
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

                        <div className="mt-3">
                          <h3
                            className={`text-[1.85rem] font-bold leading-tight transition-colors duration-300 ${
                              isLight
                                ? "text-gray-900 group-hover:text-pink-600"
                                : "text-white group-hover:text-pink-400"
                            }`}
                          >
                            {track.title}
                          </h3>

                          <p
                            className={`mt-1 text-sm ${
                              isLight ? "text-gray-500" : "text-gray-400"
                            }`}
                          >
                            {track.subtitle}
                          </p>
                        </div>

                        <p
                          className={`mt-2 line-clamp-2 text-sm leading-6 ${
                            isLight ? "text-gray-600" : "text-gray-400"
                          }`}
                        >
                          {track.description}
                        </p>

                        <div
                          className={`mt-4 flex items-center gap-4 text-sm ${
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
                            className={`mt-2 text-sm ${
                              isLight ? "text-gray-500" : "text-gray-500"
                            }`}
                          >
                            <span className={isLight ? "text-gray-700" : "text-gray-300"}>
                              {completedLessons}
                            </span>
                            /{totalLessons} lessons completed
                          </p>
                        </div>

                        <motion.button
                          whileHover={{ scale: 1.01 }}
                          whileTap={{ scale: 0.985 }}
                          className={`mt-auto flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-300 ${
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
        </motion.div>

        {filteredTracks.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`mx-auto mt-12 flex max-w-2xl flex-col items-center justify-center rounded-2xl border py-16 ${
              isLight ? "border-gray-200 bg-white" : "border-white/10 bg-[#0c0c12]"
            }`}
          >
            <Search className={`h-12 w-12 ${isLight ? "text-gray-300" : "text-gray-600"}`} />
            <h3
              className={`mt-4 text-lg font-semibold ${
                isLight ? "text-gray-900" : "text-white"
              }`}
            >
              No tracks found
            </h3>
            <p className={`mt-2 text-sm ${isLight ? "text-gray-500" : "text-gray-400"}`}>
              Try adjusting your search
            </p>
            <button
              onClick={() => setSearchQuery("")}
              className={`mt-4 text-sm font-medium ${
                isLight ? "text-pink-600 hover:text-pink-700" : "text-pink-400 hover:text-pink-300"
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