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
  Target,
  TrendingUp,
  Trophy,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { LEARNING_TRACKS, ADDITIONAL_TRACKS } from "./data";
import { useTheme } from "@/app/context/ThemeContext";
import FeedbackFAB from "../../components/FeedbackFAB";
import PageFooter from "@/app/components/PageFooter";
import { migrateLegacyProgress } from "@/lib/learning-api";
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

  const allTracks = useMemo(() => [...LEARNING_TRACKS, ...ADDITIONAL_TRACKS], []);

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

    const handleProgressUpdate = () => {
      loadProgress();
    };

    window.addEventListener("codemaster-learning-updated", handleProgressUpdate);
    return () => {
      window.removeEventListener("codemaster-learning-updated", handleProgressUpdate);
    };
  }, []);

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

   // Calculate activity score for sorting tracks
   const getTrackActivityScore = (track: typeof LEARNING_TRACKS[0]) => {
     const progress = trackProgressMap[track.id];
     if (!progress) return 0; // Untouched tracks

     let score = 0;

     // Check if track has ANY activity (started)
     const hasActivity =
       progress.completedTopicIds?.length ||
       progress.completedLessonIds?.length ||
       Object.values(progress.lessonProgress || {}).some((l) => l.completed);

     if (!hasActivity) return 0;

     // Strong bonus: recent lastAccessedAt (within 30 days)
     if (progress.lastAccessedAt) {
       const daysAgo = (Date.now() - new Date(progress.lastAccessedAt).getTime()) / (1000 * 60 * 60 * 24);
       score += Math.max(0, 100 - daysAgo * 3.33); // 100 at today, 0 at 30 days
     }

     // Medium bonus: total time spent (hours -> points)
     const totalTimeSpent = Object.values(progress.topicTimeSpent || {}).reduce((sum, sec) => sum + sec, 0);
     const hoursSpent = totalTimeSpent / 3600;
     score += hoursSpent * 50;

     // Medium bonus: completed lessons
     const completedLessons = progress.completedLessonIds?.length || 0;
     const lessonProgressCount = Object.values(progress.lessonProgress || {}).filter(l => l.completed).length;
     score += (completedLessons + lessonProgressCount) * 5;

     // Small bonus: progress percentage
     let trackTotalLessons = 0;
     let trackCompletedLessons = 0;
     track.topics.forEach((topic) => {
       const topicLessons = topic.subtopics.length;
       trackTotalLessons += topicLessons;
       let topicCompleted = 0;
       if (progress.completedTopicIds?.includes(topic.id)) {
         topicCompleted = topicLessons;
       } else {
         topic.subtopics.forEach((subtopic) => {
           if (progress.lessonProgress?.[subtopic.id]?.completed || progress.completedLessonIds?.includes(subtopic.id)) {
             topicCompleted++;
           }
         });
       }
       trackCompletedLessons += topicCompleted;
     });
     const progressPercent = trackTotalLessons > 0 ? (trackCompletedLessons / trackTotalLessons) * 100 : 0;
     score += progressPercent * 2;

     // Small bonus: completed topics
     score += (progress.completedTopicIds?.length || 0) * 15;

     return score;
   };

   // Sort all tracks by activity score (independent of search)
   const sortedTracksBase = useMemo(() => {
     const withScores = allTracks.map(track => ({
       track,
       score: getTrackActivityScore(track),
       isActive: getTrackActivityScore(track) > 0
     }));

     const activeTracks = withScores.filter(item => item.isActive);
     const untouchedTracks = withScores.filter(item => !item.isActive);

     // Sort active tracks by score desc, then by lastAccessedAt desc
     activeTracks.sort((a, b) => {
       if (b.score !== a.score) {
         return b.score - a.score;
       }
       const aTime = trackProgressMap[a.track.id]?.lastAccessedAt || "";
       const bTime = trackProgressMap[b.track.id]?.lastAccessedAt || "";
       return new Date(bTime).getTime() - new Date(aTime).getTime();
     });

     // Preserve original order for untouched tracks
     untouchedTracks.sort((a, b) => {
       const aIndex = allTracks.findIndex(t => t.id === a.track.id);
       const bIndex = allTracks.findIndex(t => t.id === b.track.id);
       return aIndex - bIndex;
     });

     return [...activeTracks.map(item => item.track), ...untouchedTracks.map(item => item.track)];
   }, [allTracks, trackProgressMap]);

   // Apply search filter on top of sorted base
   const sortedTracks = useMemo(() => {
     if (!searchQuery.trim()) return sortedTracksBase;

     const query = searchQuery.toLowerCase();
     return sortedTracksBase.filter(
       (track) =>
         track.title.toLowerCase().includes(query) ||
         track.description.toLowerCase().includes(query) ||
         track.subtitle.toLowerCase().includes(query)
     );
   }, [sortedTracksBase, searchQuery]);

  const trackStats = useMemo(() => {
    let totalTopics = 0;
    let completedTopics = 0;
    let completedLessons = 0;
    let totalLessons = 0;

    allTracks.forEach((track) => {
      const progress = trackProgressMap[track.id];
      totalTopics += track.topics.length;

      track.topics.forEach((topic) => {
        const topicLessons = topic.subtopics.length;
        totalLessons += topicLessons;

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

    const progressPercent =
      totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

    return {
      totalTopics,
      completedTopics,
      totalLessons,
      totalLessonsCompleted: completedLessons,
      progressPercent,
      earnedMilestones,
    };
  }, [trackProgressMap, allTracks, legacyProgress]);

   const continueLearning = useMemo(() => {
     // Use sortedTracksBase to prioritize most active track (ignoring search)
     const inProgressTrack = sortedTracksBase.find((track) => {
       const progress = trackProgressMap[track.id];
       return (
         progress?.completedTopicIds?.length ||
         progress?.completedLessonIds?.length ||
         Object.values(progress?.lessonProgress || {}).some((lesson) => lesson.completed)
       );
     });

     const selectedTrack = inProgressTrack || sortedTracksBase[0];

    if (!selectedTrack) return null;

    const progress = trackProgressMap[selectedTrack.id];

    for (const topic of selectedTrack.topics) {
      const topicFullyCompleted = progress?.completedTopicIds?.includes(topic.id);

      if (topicFullyCompleted) continue;

      const nextLesson =
        topic.subtopics.find(
          (subtopic) =>
            !progress?.lessonProgress?.[subtopic.id]?.completed &&
            !progress?.completedLessonIds?.includes(subtopic.id)
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
  }, [allTracks, trackProgressMap]);

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
    <div className="space-y-7">
      <section className="space-y-5">
        <div className="mx-auto max-w-[1500px] px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_620px] xl:items-start">
            <div>
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

              <p className={`mt-2 text-sm leading-6 ${isLight ? "text-gray-600" : "text-gray-400"}`}>
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

            <div className="grid gap-4 lg:h-40 sm:grid-cols-2 xl:grid-cols-3">
              <motion.div
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                className={`relative overflow-hidden rounded-2xl border px-5 py-4 ${
                  isLight
                    ? "border-orange-200 bg-gradient-to-br from-orange-50 to-white shadow-[0_14px_35px_rgba(15,23,42,0.06)]"
                    : "border-orange-500/15 bg-gradient-to-br from-orange-500/[0.12] via-orange-500/[0.04] to-[#0c0c10]"
                }`}
              >
                <div className="absolute right-3 top-3 opacity-10">
                  <Flame className="h-16 w-16" />
                </div>

                <p className={`text-[10px] uppercase tracking-[0.18em] ${isLight ? "text-orange-700/80" : "text-orange-200/80"}`}>
                  Daily Streak
                </p>

                <div className="mt-2 flex items-end gap-2">
                  <Flame className={`mb-1 h-6 w-6 ${streak > 0 ? "animate-pulse text-orange-400" : "text-gray-400"}`} />
                  <p className={`text-3xl font-bold ${isLight ? "text-gray-900" : "text-white"}`}>
                    {streak}
                  </p>
                  <span className={`mb-1 text-sm ${isLight ? "text-gray-500" : "text-gray-400"}`}>
                    days
                  </span>
                </div>

                <p className={`mt-2 text-xs leading-5 ${isLight ? "text-orange-700" : "text-orange-200/70"}`}>
                  {streak > 0 ? "Keep it alive, complete one lesson today." : "Start a lesson today to build your streak."}
                </p>
              </motion.div>

              <motion.div
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                className={`relative overflow-hidden rounded-2xl border px-5 py-4 ${
                  isLight
                    ? "border-emerald-200 bg-gradient-to-br from-emerald-50 to-white shadow-[0_14px_35px_rgba(15,23,42,0.06)]"
                    : "border-emerald-500/15 bg-gradient-to-br from-emerald-500/[0.12] via-emerald-500/[0.04] to-[#0c0c10]"
                }`}
              >
                <div className="flex items-center justify-between">
                  <p className={`text-[10px] uppercase tracking-[0.18em] ${isLight ? "text-emerald-700/80" : "text-emerald-200/80"}`}>
                    Progress
                  </p>
                  <TrendingUp className={`h-4 w-4 ${isLight ? "text-emerald-600" : "text-emerald-300"}`} />
                </div>

                <p className={`mt-2 text-3xl font-bold ${isLight ? "text-gray-900" : "text-white"}`}>
                  {trackStats.completedTopics}/{trackStats.totalTopics}
                </p>

                <p className={`mt-1 text-xs ${isLight ? "text-emerald-700" : "text-emerald-300/70"}`}>
                  {trackStats.totalLessonsCompleted}/{trackStats.totalLessons} lessons completed
                </p>

                <div className={`mt-3 h-2 overflow-hidden rounded-full ${isLight ? "bg-emerald-100" : "bg-white/[0.06]"}`}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${trackStats.progressPercent}%` }}
                    transition={{ duration: 0.9, ease: "easeOut" }}
                    className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-teal-400"
                  />
                </div>

                <p className={`mt-2 text-xs ${isLight ? "text-gray-500" : "text-gray-400"}`}>
                  {trackStats.progressPercent}% overall completion
                </p>
              </motion.div>

              <motion.div
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                className={`relative overflow-hidden rounded-2xl border px-5 py-4 sm:col-span-2 xl:col-span-1 ${
                  isLight
                    ? "border-amber-200 bg-gradient-to-br from-amber-50 to-white shadow-[0_14px_35px_rgba(15,23,42,0.06)]"
                    : "border-amber-500/15 bg-gradient-to-br from-amber-500/[0.12] via-amber-500/[0.04] to-[#0c0c10]"
                }`}
              >
                <div className="flex items-center justify-between">
                  <p className={`text-[10px] uppercase tracking-[0.18em] ${isLight ? "text-amber-700/80" : "text-amber-200/80"}`}>
                    Badges Earned
                  </p>
                  <Trophy className={`h-4 w-4 ${isLight ? "text-amber-600" : "text-amber-300"}`} />
                </div>

                {trackStats.earnedMilestones.length > 0 ? (
                  <>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {trackStats.earnedMilestones.slice(0, 4).map((milestone, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ scale: 0.9, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ delay: idx * 0.05 }}
                          className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-semibold ${
                            isLight
                              ? "bg-amber-100 text-amber-800"
                              : "bg-amber-500/20 text-amber-300"
                          }`}
                        >
                          {getMilestoneIcon(milestone.iconName)}
                          <span>{milestone.label}</span>
                        </motion.div>
                      ))}
                    </div>

                    <p className={`mt-3 text-xs ${isLight ? "text-amber-700" : "text-amber-300/70"}`}>
                      Latest milestone unlocked. Keep learning to earn more.
                    </p>
                  </>
                ) : (
                  <div className="mt-3">
                    <p className={`text-sm font-semibold ${isLight ? "text-gray-900" : "text-white"}`}>
                      No badges yet
                    </p>
                    <p className={`mt-1 text-xs ${isLight ? "text-amber-700" : "text-amber-300/70"}`}>
                      Complete 5 lessons to unlock your first badge.
                    </p>
                  </div>
                )}
              </motion.div>
            </div>
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
                      isLight ? "bg-pink-50 text-pink-600" : "bg-pink-500/15 text-pink-300"
                    }`}
                  >
                    <Target className="h-5 w-5" />
                  </div>

                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <p className={`text-sm font-semibold ${isLight ? "text-gray-900" : "text-white"}`}>
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

                    <h2 className={`mt-1 text-xl font-bold ${isLight ? "text-gray-900" : "text-white"}`}>
                      {continueLearning.track.title}
                    </h2>

                    <p className={`mt-1 text-sm ${isLight ? "text-gray-600" : "text-gray-400"}`}>
                      Next topic:{" "}
                      <span className={isLight ? "text-gray-900" : "text-gray-200"}>
                        {continueLearning.topic?.title}
                      </span>
                      {continueLearning.lesson?.title ? ` • ${continueLearning.lesson.title}` : ""}
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
         <motion.div
           className="mx-auto max-w-[1500px] px-4 sm:px-6 lg:px-8"
           variants={containerVariants}
           initial="hidden"
           animate="visible"
         >
           <div className="grid gap-7 md:grid-cols-2 xl:grid-cols-3">
             {sortedTracks.map((track) => {
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
                        <FolderOpen className={`h-3.5 w-3.5 ${isLight ? "text-gray-500" : "text-gray-400"}`} />
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
                          isLight ? "border-gray-200 bg-white/92" : "border-white/0 bg-white/[0.03]"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${accent.icon}`}>
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

                          <p className={`mt-1 text-sm ${isLight ? "text-gray-500" : "text-gray-400"}`}>
                            {track.subtitle}
                          </p>
                        </div>

                        <p className={`mt-2 line-clamp-2 text-sm leading-6 ${isLight ? "text-gray-600" : "text-gray-400"}`}>
                          {track.description}
                        </p>

                        <div className={`mt-4 flex items-center gap-4 text-sm ${isLight ? "text-gray-500" : "text-gray-500"}`}>
                          <span className="flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            {track.totalHours}h total
                          </span>
                        </div>

                        <div className="mt-3">
                          <div className={`h-2 overflow-hidden rounded-full ${isLight ? "bg-gray-100" : "bg-white/[0.06]"}`}>
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

                          <p className={`mt-2 text-sm ${isLight ? "text-gray-500" : "text-gray-500"}`}>
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
            <h3 className={`mt-4 text-lg font-semibold ${isLight ? "text-gray-900" : "text-white"}`}>
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