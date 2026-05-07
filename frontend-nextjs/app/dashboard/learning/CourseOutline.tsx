"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { CheckCircle2, Lock, PlayCircle, Terminal } from "lucide-react";
import { TrackTopic, Subtopic } from "./data";
import { useTheme } from "@/app/context/ThemeContext";

interface CourseOutlineProps {
  track: any;
  topic: TrackTopic;
  activeLessonId: string | null;
  onSelectLesson: (lessonId: string) => void;
  progress: any;
  isLessonCompleted: (lessonId: string) => boolean;
  isLessonLocked: (subtopicId: string) => boolean;
  topicMinutes: number;
}

function getTopicTimeSpent(minutes: number): string {
  return `${minutes}m`;
}

export default function CourseOutline({
  track,
  topic,
  activeLessonId,
  onSelectLesson,
  progress,
  isLessonCompleted,
  isLessonLocked,
  topicMinutes,
}: CourseOutlineProps) {
  const { theme } = useTheme();
  const isLight = theme === "light";
  const router = useRouter();
  const params = useParams();
  const trackId = params.trackId as string;
  const topicId = params.topicId as string;

  const totalLessons = topic?.subtopics.length || 0;
  const completedLessons =
    topic?.subtopics.filter((subtopic) => progress.completedLessonIds.includes(subtopic.id)).length || 0;
  const progressPercentage = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

   return (
     <div className="space-y-6 max-w-full">
      {/* Course outline header */}
      <div>
        <p
          className={`text-[10px] font-semibold uppercase tracking-[0.2em] ${
            isLight ? "text-gray-500" : "text-gray-500"
          }`}
        >
          Course Outline
        </p>
        <h3
          className={`mt-1 text-lg font-bold tracking-tight ${
            isLight ? "text-gray-900" : "text-white"
          }`}
        >
          {topic.title}
        </h3>
      </div>

      {/* Stats */}
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
            {getTopicTimeSpent(topicMinutes)}
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

      {/* Lessons list */}
      <div className="space-y-3">
        {topic.subtopics.map((subtopic, idx) => {
          const completed = isLessonCompleted(subtopic.id);
          const active = subtopic.id === activeLessonId;
          const locked = isLessonLocked(subtopic.id);
          const hasExercise = !!subtopic.content?.example;

          return (
            <button
              key={subtopic.id}
              onClick={() => !locked && onSelectLesson(subtopic.id)}
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
                <div className="mt-1 flex h-2.5 w-2.5 shrink-0 items-center justify-center">
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
                    <p className={`truncate text-sm font-semibold ${
                      isLight ? "text-gray-900" : "text-white"}`}
                    >
                      {subtopic.title}
                    </p>
                    {subtopic.duration && (
                      <span className={`shrink-0 text-xs ${
                        isLight ? "text-gray-400" : "text-gray-500"}`}
                      >
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
                      <span className={`text-xs ${
                        isLight ? "text-gray-400" : "text-gray-500"}`}
                      >
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

      {/* Topic info */}
      <div
        className={`rounded-2xl border p-5 ${
          isLight ? "border-gray-200 bg-gray-50" : "border-white/10 bg-white/[0.03]"
        }`}
      >
        <h4 className={`text-base font-semibold ${
          isLight ? "text-gray-900" : "text-white"}`}
        >
          This topic includes
        </h4>
        <div className={`mt-4 space-y-3 text-sm ${
          isLight ? "text-gray-600" : "text-gray-400"}`}
        >
          <div className="flex items-center gap-2">
            <PlayCircle className="h-4 w-4" />
            {totalLessons} structured lessons
          </div>
          <div className="flex items-center gap-2">
            <Terminal className="h-4 w-4" />
            Interactive coding practice
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4" />
            Completion reward
          </div>
        </div>
      </div>
    </div>
  );
}
