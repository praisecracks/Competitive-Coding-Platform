"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { 
  MapPin, 
  Route, 
  BookOpen, 
  Sparkles, 
  Target, 
  Zap,
  ChevronRight,
  ArrowLeft,
  CheckCircle2
} from "lucide-react";
import { LEARNING_PATH_GROUPS, getPathProgress } from "../data";
import { useTheme } from "@/app/context/ThemeContext";
import type { PathGroup } from "../data";
import { getUserProgressKey } from "@/lib/auth";

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

export default function LearningPathsPage() {
  const router = useRouter();
  const { theme } = useTheme();
  const isLight = theme === "light";

  const [userProgress, setUserProgress] = useState<UserProgress>({
    paths: {},
    totalXp: 0,
  });

  useEffect(() => {
    const PROGRESS_KEY = getUserProgressKey();
    const saved = localStorage.getItem(PROGRESS_KEY);
    if (saved) {
      try {
        setUserProgress(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse progress", e);
      }
    }
  }, []);

  const getPathStatus = (group: any) => {
    const progress = getPathProgress(group, userProgress.paths);
    if (progress.completed === 0) return "not_started";
    if (progress.completed === progress.total) return "completed";
    return "in_progress";
  };

  const getNextCourseInPath = (group: any) => {
    const progress = getPathProgress(group, userProgress.paths);
    const currentCourseId = group.order[progress.currentIndex];
    if (!currentCourseId) {
      // If all completed, return first course
      return group.order[0];
    }
    return currentCourseId;
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.push("/dashboard/learning")}
          className={`flex items-center gap-2 text-sm font-medium transition-colors ${
            isLight ? "text-gray-600 hover:text-gray-900" : "text-gray-400 hover:text-white"
          }`}
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Learning Hub
        </button>
      </div>

      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <MapPin className={`h-5 w-5 ${isLight ? "text-pink-600" : "text-pink-400"}`} />
          <h1 className={`text-2xl font-bold ${isLight ? "text-gray-900" : "text-white"}`}>
            Learning Paths
          </h1>
        </div>
        <p className={`text-sm ${isLight ? "text-gray-600" : "text-gray-400"}`}>
          Choose a structured path and follow the recommended order to master skills step by step.
          Each path guides you from beginner to advanced.
        </p>
      </section>

      {/* Path Cards */}
      <div className="grid gap-6 sm:grid-cols-2">
        {LEARNING_PATH_GROUPS.map((group, index) => {
          const progress = getPathProgress(group, userProgress.paths);
          const percentComplete = progress.total > 0 ? Math.round((progress.completed / progress.total) * 100) : 0;
          const status = getPathStatus(group);
          const nextCourseId = getNextCourseInPath(group);
          
          return (
            <motion.div
              key={group.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => router.push(`/dashboard/learning/${nextCourseId}`)}
              className={`group relative cursor-pointer overflow-hidden rounded-3xl border p-6 transition-all hover:scale-[1.01] ${
                isLight
                  ? "border-gray-200 bg-white shadow-[0_8px_32px_rgba(15,23,42,0.08)] hover:border-pink-300 hover:shadow-[0_16px_48px_rgba(15,23,42,0.12)]"
                  : "border-white/10 bg-[#0c0c10] hover:border-pink-500/30 hover:shadow-[0_20px_60px_rgba(168,85,247,0.1)]"
              }`}
            >
              {/* Background Accent */}
              <div className={`absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 ${
                status === "completed" ? "bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.1),transparent_50%)]" :
                status === "in_progress" ? "bg-[radial_gradient(circle_at_top_right,rgba(168,85,247,0.1),transparent_50%)]" :
                "bg-[radial_gradient(circle_at_top_right,rgba(236,72,153,0.08),transparent_50%)]"
              }`} />

              <div className="relative z-10">
                {/* Status Badge */}
                <div className="mb-4 flex items-center justify-between">
                  <div className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-wider ${
                    status === "completed" 
                      ? isLight ? "bg-emerald-50 text-emerald-700" : "bg-emerald-500/15 text-emerald-400"
                      : status === "in_progress"
                      ? isLight ? "bg-purple-50 text-purple-700" : "bg-purple-500/15 text-purple-400"
                      : isLight ? "bg-pink-50 text-pink-700" : "bg-pink-500/15 text-pink-400"
                  }`}>
                    {status === "completed" && <><CheckCircle2 className="h-3 w-3" /> Completed</>}
                    {status === "in_progress" && <><Target className="h-3 w-3" /> In Progress</>}
                    {status === "not_started" && <><Zap className="h-3 w-3" /> Start Here</>}
                  </div>
                  <span className={`text-2xl font-bold ${isLight ? "text-gray-900" : "text-white"}`}>
                    {percentComplete}%
                  </span>
                </div>

                {/* Title & Description */}
                <h3 className={`text-xl font-bold ${isLight ? "text-gray-900" : "text-white"}`}>
                  {group.title}
                </h3>
                <p className={`mt-2 text-sm ${isLight ? "text-gray-600" : "text-gray-400"}`}>
                  {group.description}
                </p>

                {/* Course Count */}
                <div className={`mt-4 flex items-center gap-4 text-xs ${isLight ? "text-gray-500" : "text-gray-500"}`}>
                  <div className="flex items-center gap-1.5">
                    <BookOpen className="h-4 w-4" />
                    <span>{group.order.length} courses</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4" />
                    <span>{progress.completed}/{progress.total} steps</span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className={`mt-4 h-2 rounded-full ${isLight ? "bg-gray-100" : "bg-white/10"}`}>
                  <div 
                    className={`h-full rounded-full transition-all duration-500 ${
                      status === "completed" ? "bg-emerald-500" :
                      status === "in_progress" ? "bg-gradient-to-r from-purple-500 to-pink-500" :
                      "bg-gradient-to-r from-pink-500 to-purple-500"
                    }`}
                    style={{ width: `${percentComplete}%` }}
                  />
                </div>

                {/* CTA */}
                <div className={`mt-5 flex items-center justify-between`}>
                  <span className={`text-sm font-medium ${isLight ? "text-gray-900" : "text-white"}`}>
                    {status === "completed" ? "Review Path" : status === "in_progress" ? "Continue Learning" : "Begin Journey"}
                  </span>
                  <ChevronRight className={`h-5 w-5 transition-transform group-hover:translate-x-1 ${
                    isLight ? "text-gray-400" : "text-gray-500"
                  }`} />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Quick Stats */}
      <section className={`rounded-2xl border p-6 ${isLight ? "border-gray-200 bg-white" : "border-white/10 bg-[#0c0c10]"}`}>
        <h3 className={`text-lg font-semibold ${isLight ? "text-gray-900" : "text-white"}`}>
          Your Learning Journey
        </h3>
        <div className="mt-4 grid grid-cols-3 gap-4 text-center">
          <div>
            <p className={`text-2xl font-bold ${isLight ? "text-gray-900" : "text-white"}`}>
              {LEARNING_PATH_GROUPS.filter(g => getPathProgress(g, userProgress.paths).completed === getPathProgress(g, userProgress.paths).total && getPathProgress(g, userProgress.paths).total > 0).length}
            </p>
            <p className={`text-xs ${isLight ? "text-gray-500" : "text-gray-500"}`}>Completed</p>
          </div>
          <div>
            <p className={`text-2xl font-bold ${isLight ? "text-gray-900" : "text-white"}`}>
              {LEARNING_PATH_GROUPS.filter(g => {
                const p = getPathProgress(g, userProgress.paths);
                return p.completed > 0 && p.completed < p.total;
              }).length}
            </p>
            <p className={`text-xs ${isLight ? "text-gray-500" : "text-gray-500"}`}>In Progress</p>
          </div>
          <div>
            <p className={`text-2xl font-bold ${isLight ? "text-gray-900" : "text-white"}`}>
              {userProgress.totalXp || 0}
            </p>
            <p className={`text-xs ${isLight ? "text-gray-500" : "text-gray-500"}`}>Total XP</p>
          </div>
        </div>
      </section>
    </div>
  );
}