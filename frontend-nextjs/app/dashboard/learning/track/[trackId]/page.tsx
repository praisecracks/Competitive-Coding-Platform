"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter, useParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Clock,
  BookOpen,
  ChevronRight,
  CheckCircle2,
  Lock,
} from "lucide-react";
import { getTrackById, TrackTopic } from "../../data";
import { useTheme } from "@/app/context/ThemeContext";
import PageFooter from "@/app/components/PageFooter";

const PROGRESS_KEY = "codemaster_learning_track_progress";

interface TrackProgress {
  completedTopicIds: string[];
  completedLessonIds: string[];
  lessonProgress: {
    [lessonId: string]: { completed: boolean; timeSpentSeconds: number };
  };
  topicTimeSpent: { [topicId: string]: number };
  startedAt?: string;
  lastAccessedAt?: string;
}

export default function TrackOverviewPage() {
  const router = useRouter();
  const params = useParams();
  const { theme } = useTheme();
  const isLight = theme === "light";

  const trackId = params.trackId as string;
  const track = getTrackById(trackId);

  const [progress, setProgress] = useState<TrackProgress>({
    completedTopicIds: [],
    completedLessonIds: [],
    lessonProgress: {},
    topicTimeSpent: {},
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedProgress = localStorage.getItem(PROGRESS_KEY);
    if (savedProgress) {
      try {
        const parsed = JSON.parse(savedProgress);
        const trackProgress = parsed[trackId] || parsed?.tracks?.[trackId];
        if (trackProgress) {
          setProgress(trackProgress);
        }
      } catch (error) {
        console.error("Error loading progress:", error);
      }
    }
    setLoading(false);
  }, [trackId]);

  const trackProgressStats = useMemo(() => {
    if (!track) {
      return {
        completedTopics: 0,
        totalTopics: 0,
        progressPercentage: 0,
        currentTopic: null,
      };
    }

    let totalLessons = 0;
    let completedLessons = 0;
    let currentTopic: TrackTopic | null = null;
    let lastAccessedTopic: TrackTopic | null = null;

    track.topics.forEach((topic) => {
      const topicLessons = topic.subtopics.length;
      totalLessons += topicLessons;

      let topicCompletedLessons = 0;

      if (progress.completedTopicIds.includes(topic.id)) {
        topicCompletedLessons = topicLessons;
      } else {
        topic.subtopics.forEach((subtopic) => {
          if (progress.lessonProgress?.[subtopic.id]?.completed) {
            topicCompletedLessons++;
          } else if (progress.completedLessonIds?.includes(subtopic.id)) {
            topicCompletedLessons++;
          }
        });
      }

      completedLessons += topicCompletedLessons;

      if (
        !currentTopic &&
        topicCompletedLessons > 0 &&
        topicCompletedLessons < topicLessons
      ) {
        currentTopic = topic;
      }

      if (
        progress.topicTimeSpent?.[topic.id] &&
        (!lastAccessedTopic ||
          progress.topicTimeSpent[topic.id] >
            (progress.topicTimeSpent[lastAccessedTopic.id] || 0))
      ) {
        lastAccessedTopic = topic;
      }
    });

    if (!currentTopic) {
      currentTopic =
        lastAccessedTopic ||
        track.topics.find((topic) => {
          const topicLessons = topic.subtopics.length;
          let completed = 0;

          if (progress.completedTopicIds.includes(topic.id)) {
            completed = topicLessons;
          } else {
            topic.subtopics.forEach((sub) => {
              if (
                progress.lessonProgress?.[sub.id]?.completed ||
                progress.completedLessonIds?.includes(sub.id)
              ) {
                completed++;
              }
            });
          }

          return completed < topicLessons;
        }) ||
        track.topics[0];
    }

    const completedTopics = track.topics.filter((topic) => {
      if (progress.completedTopicIds.includes(topic.id)) return true;

      return topic.subtopics.every(
        (sub) =>
          progress.lessonProgress?.[sub.id]?.completed ||
          progress.completedLessonIds?.includes(sub.id)
      );
    }).length;

    const progressPercentage =
      totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

    return {
      completedTopics,
      totalTopics: track.topics.length,
      progressPercentage,
      currentTopic,
    };
  }, [track, progress]);

  const completedTopicsCount = trackProgressStats.completedTopics;
  const totalTopics = track?.topics.length || 0;
  const progressPercentage = trackProgressStats.progressPercentage;

  if (loading) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center ${
          isLight ? "bg-gray-50" : "bg-[#020202]"
        }`}
      >
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-pink-500" />
      </div>
    );
  }

  if (!track) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center ${
          isLight ? "bg-gray-50" : "bg-[#020202]"
        }`}
      >
        <div className="text-center">
          <h1
            className={`mb-4 text-2xl font-bold ${
              isLight ? "text-gray-900" : "text-white"
            }`}
          >
            Track Not Found
          </h1>
          <button
            onClick={() => router.push("/dashboard/learning")}
            className="rounded-lg bg-pink-500 px-6 py-2 text-white transition-colors hover:bg-pink-600"
          >
            Back to Learning
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${isLight ? "bg-gray-50" : "bg-[#020202]"}`}>
      {/* Header */}
      <div
        className={`border-b ${
          isLight ? "border-gray-200 bg-white" : "border-white/10 bg-[#09090c]"
        }`}
      >
        <div className="mx-auto w-full max-w-6xl px-4 py-4 sm:px-6">
          <div className="flex items-start gap-3 sm:items-center sm:gap-4">
            <button
              onClick={() => router.back()}
              className={`shrink-0 rounded-lg p-2 transition-colors ${
                isLight
                  ? "text-gray-600 hover:bg-gray-100"
                  : "text-gray-400 hover:bg-gray-800"
              }`}
            >
              <ArrowLeft className="h-5 w-5" />
            </button>

            <div className="min-w-0">
              <h1
                className={`text-xl font-bold sm:text-2xl ${
                  isLight ? "text-gray-900" : "text-white"
                }`}
              >
                {track.title}
              </h1>
              <p
                className={`mt-1 text-sm ${
                  isLight ? "text-gray-600" : "text-gray-400"
                }`}
              >
                {track.subtitle}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
        {/* Track Info */}
        <div
          className={`mb-6 rounded-xl border p-4 sm:mb-8 sm:p-6 ${
            isLight
              ? "border-gray-200 bg-white"
              : "border-white/10 bg-[#09090c]"
          }`}
        >
          <div className="mb-4 flex flex-col gap-4">
            <div className="min-w-0">
              <h2
                className={`mb-2 text-lg font-semibold sm:text-xl ${
                  isLight ? "text-gray-900" : "text-white"
                }`}
              >
                {track.title}
              </h2>

              <p
                className={`mb-4 text-sm leading-6 ${
                  isLight ? "text-gray-600" : "text-gray-400"
                }`}
              >
                {track.description}
              </p>

              <div className="flex flex-wrap items-center gap-3 text-sm sm:gap-4">
                <div
                  className={`flex items-center gap-1 ${
                    isLight ? "text-gray-600" : "text-gray-400"
                  }`}
                >
                  <Clock className="h-4 w-4" />
                  {track.totalHours} hours
                </div>

                <div
                  className={`flex items-center gap-1 ${
                    isLight ? "text-gray-600" : "text-gray-400"
                  }`}
                >
                  <BookOpen className="h-4 w-4" />
                  {totalTopics} topics
                </div>
              </div>

              {trackProgressStats.currentTopic &&
                progressPercentage > 0 &&
                progressPercentage < 100 && (
                  <div
                    className={`mt-4 rounded-lg border p-3 ${
                      isLight
                        ? "border-pink-200 bg-pink-50"
                        : "border-pink-500/20 bg-pink-500/10"
                    }`}
                  >
                    <p
                      className={`text-sm leading-6 ${
                        isLight ? "text-pink-700" : "text-pink-300"
                      }`}
                    >
                      <span className="font-medium">Continue from:</span>{" "}
                      {trackProgressStats.currentTopic.title}
                    </p>
                  </div>
                )}
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-1">
            <div className="mb-2 flex flex-col gap-1 text-sm sm:flex-row sm:items-center sm:justify-between">
              <span className={isLight ? "text-gray-600" : "text-gray-400"}>
                Progress: {completedTopicsCount} of {totalTopics} topics completed
              </span>
              <span className={isLight ? "text-gray-600" : "text-gray-400"}>
                {Math.round(progressPercentage)}%
              </span>
            </div>

            <div
              className={`h-2 w-full rounded-full ${
                isLight ? "bg-gray-200" : "bg-white/10"
              }`}
            >
              <div
                className="h-full rounded-full bg-gradient-to-r from-pink-500 to-purple-500 transition-all duration-300"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>
        </div>

        {/* Topics List */}
        <div
          className={`rounded-xl border p-4 sm:p-6 ${
            isLight
              ? "border-gray-200 bg-white"
              : "border-white/10 bg-[#09090c]"
          }`}
        >
          <h3
            className={`mb-5 text-lg font-semibold sm:mb-6 ${
              isLight ? "text-gray-900" : "text-white"
            }`}
          >
            Topics
          </h3>

          <div className="space-y-3">
            {track.topics.map((topic: TrackTopic, index: number) => {
              const isCompleted = progress.completedTopicIds.includes(topic.id);
              const isLocked =
                index > 0 &&
                !progress.completedTopicIds.includes(track.topics[index - 1].id);

              let topicCompletedLessons = 0;
              const topicTotalLessons = topic.subtopics.length;

              if (isCompleted) {
                topicCompletedLessons = topicTotalLessons;
              } else {
                topic.subtopics.forEach((subtopic) => {
                  if (
                    progress.lessonProgress?.[subtopic.id]?.completed ||
                    progress.completedLessonIds?.includes(subtopic.id)
                  ) {
                    topicCompletedLessons++;
                  }
                });
              }

              const topicProgressPercentage =
                topicTotalLessons > 0
                  ? (topicCompletedLessons / topicTotalLessons) * 100
                  : 0;

              const hasPartialProgress =
                topicCompletedLessons > 0 && !isCompleted;

              return (
                <motion.div
                  key={topic.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.08 }}
                  className={`w-full rounded-lg border p-4 transition-all ${
                    isLocked
                      ? isLight
                        ? "cursor-not-allowed border-gray-200 bg-gray-50 opacity-60"
                        : "cursor-not-allowed border-white/10 bg-[#0c0c12] opacity-60"
                      : isLight
                      ? "cursor-pointer border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm"
                      : "cursor-pointer border-white/10 bg-[#0c0c12] hover:border-white/20 hover:bg-[#101016]"
                  }`}
                  onClick={() => {
                    if (!isLocked) {
                      router.push(
                        `/dashboard/learning/track/${trackId}/topic/${topic.id}`
                      );
                    }
                  }}
                >
                  <div className="flex w-full flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex min-w-0 flex-1 items-start gap-3">
                      <div
                        className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-medium ${
                          isCompleted
                            ? "bg-emerald-500 text-white"
                            : hasPartialProgress
                            ? "bg-pink-500 text-white"
                            : isLocked
                            ? isLight
                              ? "bg-gray-300 text-gray-500"
                              : "bg-white/10 text-gray-400"
                            : "bg-pink-500 text-white"
                        }`}
                      >
                        {isCompleted ? (
                          <CheckCircle2 className="h-4 w-4" />
                        ) : isLocked ? (
                          <Lock className="h-4 w-4" />
                        ) : (
                          index + 1
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <h4
                          className={`text-base font-medium leading-6 ${
                            isLight ? "text-gray-900" : "text-white"
                          }`}
                        >
                          {topic.title}
                        </h4>

                        <p
                          className={`mt-1 text-sm leading-6 ${
                            isLight ? "text-gray-600" : "text-gray-400"
                          }`}
                        >
                          {topic.description}
                        </p>

                        {hasPartialProgress && (
                          <div className="mt-3">
                            <div
                              className={`h-1.5 w-full rounded-full ${
                                isLight ? "bg-gray-200" : "bg-white/10"
                              }`}
                            >
                              <div
                                className="h-full rounded-full bg-gradient-to-r from-pink-500 to-purple-500 transition-all duration-300"
                                style={{ width: `${topicProgressPercentage}%` }}
                              />
                            </div>

                            <p
                              className={`mt-1 text-xs ${
                                isLight ? "text-gray-500" : "text-gray-400"
                              }`}
                            >
                              {topicCompletedLessons} of {topicTotalLessons} lessons
                              completed
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-3 pl-12 sm:min-w-fit sm:justify-end sm:pl-0">
                      <span
                        className={`text-sm ${
                          isLight ? "text-gray-500" : "text-gray-400"
                        }`}
                      >
                        {topic.duration}
                      </span>
                      <ChevronRight
                        className={`h-5 w-5 shrink-0 ${
                          isLight ? "text-gray-400" : "text-gray-500"
                        }`}
                      />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
      <PageFooter/>
    </div>
  );
}