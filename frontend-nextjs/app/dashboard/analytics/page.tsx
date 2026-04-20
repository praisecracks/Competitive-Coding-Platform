"use client";

import Link from "next/link";
import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { RefreshCw, TrendingUp, Award, Zap } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import { migrateLegacyProgress } from "@/lib/learning-api";

type StatCardProps = {
  label: string;
  value: string | number;
  subtext: string;
  icon?: React.ReactNode;
  trend?: string;
  loading?: boolean;
};

type ActivityItem = {
  title: string;
  category: string;
  difficulty: "Easy" | "Medium" | "Hard";
  status: "Accepted" | "Failed" | "Pending";
  date: string;
  score?: number;
};

type AnalyticsData = {
  weeklyProgress: { day: string; value: number }[];
  difficultyBreakdown: { label: string; solved: number; total: number }[];
  categoryPerformance: { label: string; value: number }[];
  recentActivity: ActivityItem[];
  stats: {
    totalPoints: number;
    acceptanceRate: number;
    currentStreak: number;
    totalSolved: number;
    totalAttempts?: number;
    averageScore?: number;
  };
  lastUpdated?: string;
};

export default function AnalyticsPage() {
  const { theme } = useTheme();
  const isLight = theme === "light";

  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchAnalytics = useCallback(async (showRefresh = false) => {
    if (showRefresh) setIsRefreshing(true);

    try {
      const token = localStorage.getItem("terminal_token");

      if (!token) {
        setError("Session expired. Please log in again.");
        if (!showRefresh) setLoading(false);
        return;
      }

      const res = await fetch("/api/analytics", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
      });

      if (!res.ok) {
        const errorText = await res.text().catch(() => "Unknown error");
        console.error(`Analytics API error (${res.status}):`, errorText);
        throw new Error(`Failed to fetch analytics: ${res.status}`);
      }

      const result = await res.json();

      // Fetch learning progress and streak from API (with migration)
      let completedLessons: string[] = [];
      let learningStreak = 0;
      try {
        const learningData = await migrateLegacyProgress();
        // Collect all completed lesson IDs from all tracks
        for (const trackProgress of Object.values(learningData.trackProgress || {})) {
          if (trackProgress.completedLessonIds) {
            completedLessons = [...completedLessons, ...trackProgress.completedLessonIds];
          }
        }
        learningStreak = learningData.streak?.currentStreak || 0;
      } catch {
        // Silently fail - analytics will just not show learning data
      }

      // Calculate combined weekly progress (challenges + learning)
      const weeklyProgress = (result.weeklyProgress || []).map((d: any) => ({ ...d }));
      const now = new Date();
      
      // Add learning activity to weekly progress
      for (let i = 6; i >= 0; i--) {
        const day = new Date(now);
        day.setDate(day.getDate() - i);
        const dayKey = day.toISOString().split('T')[0].slice(0, 10);
        
        // Count completed lessons from learning data
        const learningCount = completedLessons.filter((lesson: string) => lesson.includes(dayKey)).length;
        
        // Add learning count to challenge count
        const dayName = day.toLocaleDateString('en-US', { weekday: 'short' });
        const existing = weeklyProgress.find((d: any) => d.day === dayName);
        if (existing && learningCount > 0) {
          existing.value = (existing.value || 0) + learningCount;
        }
      }

      // Calculate combined streak (challenges + learning)
      const activityStreak = weeklyProgress.reduce((maxStreak: number, day: any, index: number) => {
        if (day.value > 0) {
          let streak = 1;
          for (let j = index - 1; j >= 0; j--) {
            if (weeklyProgress[j].value > 0) streak++;
            else break;
          }
          return Math.max(maxStreak, streak);
        }
        return maxStreak;
      }, 0);

      // Use the higher of challenge streak or learning streak
      const combinedStreak = Math.max(activityStreak, learningStreak);

      const processedData: AnalyticsData = {
        ...result,
        weeklyProgress,
        stats: {
          ...result.stats,
          currentStreak: Math.max(combinedStreak, result.stats.currentStreak || 0),
          acceptanceRate:
            typeof result.stats.acceptanceRate === "string"
              ? parseFloat(result.stats.acceptanceRate)
              : result.stats.acceptanceRate,
          averageScore:
            result.stats.averageScore ||
            (result.recentActivity?.length > 0
              ? Math.round(
                  result.recentActivity.reduce(
                    (sum: number, item: ActivityItem) => sum + (item.score || 0),
                    0
                  ) / result.recentActivity.length
                )
              : 0),
        },
        lastUpdated: new Date().toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        }),
      };

      setData(processedData);
      setError("");
    } catch (err) {
      console.error("Analytics error details:", err);
      setError("Unable to load analytics data. Please try again.");
    } finally {
      if (showRefresh) setIsRefreshing(false);
      else setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAnalytics();

    const interval = setInterval(() => fetchAnalytics(), 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [fetchAnalytics]);

  if (loading) {
    return (
      <div className={`min-h-screen pb-20 ${isLight ? "bg-[#f8fafc]" : "bg-[#050507]"}`}>
        <div className="mx-auto max-w-7xl space-y-8 px-4 pt-8">
          {/* Header Skeleton */}
          <header className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="space-y-3">
              <div className="h-6 w-28 animate-pulse rounded-full bg-gray-200" />
              <div className="space-y-2">
                <div className="h-8 w-56 animate-pulse rounded-lg bg-gray-200" />
                <div className="h-4 w-80 animate-pulse rounded-lg bg-gray-200" />
              </div>
            </div>
            <div className="h-10 w-28 animate-pulse rounded-lg bg-gray-200" />
          </header>

          {/* Stats Grid Skeleton */}
          <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className={`h-28 rounded-xl border p-4 ${isLight ? "border-gray-200 bg-white" : "border-white/5 bg-white/[0.02]"}`}>
                <div className="mb-3 h-9 w-9 animate-pulse rounded-lg bg-gray-200" />
                <div className="space-y-2">
                  <div className="h-3 w-16 animate-pulse rounded bg-gray-200" />
                  <div className="h-6 w-12 animate-pulse rounded bg-gray-200" />
                </div>
              </div>
            ))}
          </section>

          {/* Charts Skeleton */}
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Weekly Progress Skeleton */}
            <div className={`rounded-xl border p-5 ${isLight ? "border-gray-200 bg-white" : "border-white/5 bg-white/[0.02]"}`}>
              <div className="mb-4 h-5 w-32 animate-pulse rounded bg-gray-200" />
              <div className="flex items-end justify-between gap-2 h-40">
                {[...Array(7)].map((_, i) => (
                  <div key={i} className="flex-1 animate-pulse rounded-t-lg bg-gray-200" style={{ height: `${20 + Math.random() * 60}%` }} />
                ))}
              </div>
            </div>

            {/* Category Skeleton */}
            <div className={`rounded-xl border p-5 ${isLight ? "border-gray-200 bg-white" : "border-white/5 bg-white/[0.02]"}`}>
              <div className="mb-4 h-5 w-40 animate-pulse rounded bg-gray-200" />
              <div className="space-y-3">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="h-4 w-16 animate-pulse rounded bg-gray-200" />
                    <div className="flex-1 h-3 animate-pulse rounded bg-gray-200" />
                    <div className="h-3 w-8 animate-pulse rounded bg-gray-200" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Activity Skeleton */}
          <section className="space-y-4">
            <div className="h-5 w-32 animate-pulse rounded bg-gray-200" />
            <div className="space-y-2">
              {[...Array(5)].map((_, i) => (
                <div key={i} className={`flex items-center gap-4 rounded-xl border p-4 ${isLight ? "border-gray-200 bg-white" : "border-white/5 bg-white/[0.02]"}`}>
                  <div className="h-10 w-10 animate-pulse rounded-lg bg-gray-200" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-48 animate-pulse rounded bg-gray-200" />
                    <div className="h-3 w-32 animate-pulse rounded bg-gray-200" />
                  </div>
                  <div className="h-4 w-16 animate-pulse rounded bg-gray-200" />
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div
        className={`flex min-h-screen items-center justify-center ${
          isLight ? "bg-[#f8fafc]" : "bg-[#050507]"
        }`}
      >
        <div
          className={`w-full max-w-sm rounded-2xl border p-6 text-center ${
            isLight
              ? "border-red-200 bg-white shadow-[0_14px_34px_rgba(15,23,42,0.08)]"
              : "border-red-500/10 bg-red-500/5"
          }`}
        >
          <p
            className={`text-sm font-medium ${
              isLight ? "text-red-600" : "text-red-400"
            }`}
          >
            {error || "Something went wrong"}
          </p>

          <div className="mt-6 flex flex-col gap-3">
            <button
              onClick={() => {
                setError("");
                setLoading(true);
                fetchAnalytics();
              }}
              className={`rounded-lg px-4 py-2.5 text-xs font-bold transition ${
                isLight
                  ? "border border-red-200 bg-red-50 text-red-600 hover:bg-red-100"
                  : "bg-red-500/20 text-red-400 hover:bg-red-500/30"
              }`}
            >
              Try Again
            </button>

            <Link
              href="/dashboard"
              className={`rounded-lg px-4 py-2.5 text-xs font-bold transition ${
                isLight
                  ? "border border-gray-200 bg-gray-50 text-gray-900 hover:bg-gray-100"
                  : "bg-white/5 text-white hover:bg-white/10"
              }`}
            >
              Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen overflow-x-hidden ${
        isLight ? "bg-[#f8fafc] text-gray-900" : "text-white"
      }`}
    >
      <div className="mx-auto max-w-[1400px] px-3 py-4 sm:px-5 sm:py-6 lg:px-8">
        <div
          className={`mb-5 overflow-hidden rounded-2xl border shadow-lg ${
            isLight
              ? "border-gray-200 bg-white shadow-[0_14px_34px_rgba(15,23,42,0.06)]"
              : "border-white/10 bg-[#0a0a0a]"
          }`}
        >
          <div
            className={`px-4 py-4 sm:px-6 ${
              isLight
                ? "border-b border-gray-200 bg-[radial-gradient(circle_at_top_right,rgba(236,72,153,0.06),transparent_22%)]"
                : "border-b border-white/10 bg-[radial-gradient(circle_at_top_right,rgba(236,72,153,0.08),transparent_22%)]"
            }`}
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="max-w-3xl">
                <motion.span
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className={`inline-flex rounded-lg border px-3 py-1 text-[10px] uppercase tracking-[0.15em] ${
                    isLight
                      ? "border-pink-200 bg-pink-50 text-pink-600"
                      : "border-pink-500/20 bg-pink-500/10 text-pink-200"
                  }`}
                >
                  📊 Live Performance Metrics
                </motion.span>

                <h1
                  className={`mt-3 text-2xl font-bold tracking-tight sm:text-3xl ${
                    isLight ? "text-gray-900" : "text-white"
                  }`}
                >
                  Your Performance Insights
                </h1>

                <p
                  className={`mt-2 text-xs leading-relaxed sm:text-sm ${
                    isLight ? "text-gray-600" : "text-gray-400"
                  }`}
                >
                  Real-time analysis of your coding journey. Track consistency,
                  master categories, and identify growth areas.
                </p>

                {data.lastUpdated && (
                  <p
                    className={`mt-2 text-[10px] ${
                      isLight ? "text-gray-500" : "text-gray-600"
                    }`}
                  >
                    Last updated: {data.lastUpdated}
                  </p>
                )}
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => fetchAnalytics(true)}
                  disabled={isRefreshing}
                  className={`inline-flex h-9 items-center justify-center gap-1.5 rounded-lg border px-4 text-xs font-medium transition disabled:opacity-50 ${
                    isLight
                      ? "border-gray-200 bg-gray-50 text-gray-800 hover:bg-gray-100"
                      : "border-white/10 bg-white/[0.04] text-white hover:bg-white/[0.08]"
                  }`}
                  title="Refresh data"
                >
                  <RefreshCw
                    className={`h-3.5 w-3.5 ${isRefreshing ? "animate-spin" : ""}`}
                  />
                  {isRefreshing ? "Refreshing" : "Refresh"}
                </button>

                <Link
                  href="/dashboard"
                  className={`inline-flex h-9 items-center justify-center rounded-lg border px-4 text-xs font-medium transition ${
                    isLight
                      ? "border-gray-200 bg-gray-50 text-gray-800 hover:bg-gray-100"
                      : "border-white/10 bg-white/[0.04] text-white hover:bg-white/[0.08]"
                  }`}
                >
                  Dashboard
                </Link>

                <Link
                  href="/dashboard/challenges"
                  className="inline-flex h-9 items-center justify-center rounded-lg bg-gradient-to-r from-pink-500 to-purple-500 px-4 text-xs font-medium text-white shadow-lg shadow-pink-500/20 transition hover:opacity-90"
                >
                  New Challenge
                </Link>
              </div>
            </div>
          </div>

          <div
            className={`grid grid-cols-2 gap-px sm:grid-cols-2 md:grid-cols-4 ${
              isLight ? "bg-gray-200" : "bg-white/5"
            }`}
          >
            <StatCard
              label="Total Points"
              value={data.stats.totalPoints.toLocaleString()}
              subtext="Lifetime earnings"
              icon={<Award className="h-4 w-4" />}
              trend="Primary metric"
              isLight={isLight}
            />
            <StatCard
              label="Acceptance"
              value={`${Math.round(data.stats.acceptanceRate)}%`}
              subtext="Success rate"
              icon={<TrendingUp className="h-4 w-4" />}
              isLight={isLight}
            />
            <StatCard
              label="Streak"
              value={`${Math.max(data.stats.currentStreak || 0, 0)}`}
              subtext="Day streak (challenges + learning)"
              icon={<Zap className="h-4 w-4" />}
              trend="Keep it going!"
              isLight={isLight}
            />
            <StatCard
              label="Solved"
              value={data.stats.totalSolved}
              subtext="Unique challenges"
              isLight={isLight}
            />
          </div>
        </div>

        <div className="grid items-start gap-5 md:grid-cols-2 lg:grid-cols-3">
          <div className="min-w-0 space-y-4 sm:space-y-5 md:col-span-2">
            <section
              className={`rounded-2xl border p-4 sm:p-5 lg:p-6 ${
                isLight
                  ? "border-gray-200 bg-white shadow-[0_10px_30px_rgba(15,23,42,0.06)]"
                  : "border-white/10 bg-[#0a0a0a]"
              }`}
            >
              <div className="mb-4 flex items-center justify-between sm:mb-6">
                <div>
                  <h2
                    className={`text-lg font-bold ${
                      isLight ? "text-gray-900" : "text-white"
                    }`}
                  >
                    Weekly Activity
                  </h2>
                  <p
                    className={`mt-0.5 text-xs ${
                      isLight ? "text-gray-500" : "text-gray-500"
                    }`}
                  >
                    Challenges + Learning lessons completed
                  </p>
                </div>
              </div>

              <div className="-mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
                <div
                  className="relative min-w-[300px] w-full sm:min-w-0"
                  style={{ height: "180px", minHeight: "150px", overflow: "visible" }}
                >
                  <div className="absolute inset-0 flex items-end justify-between gap-1 sm:gap-2 md:gap-3">
                    {data.weeklyProgress.map((item, i) => {
                      const maxValue = Math.max(
                        ...data.weeklyProgress.map((p) => p.value),
                        1
                      );
                      const heightPercent = (item.value / maxValue) * 100;

                      return (
                        <div
                          key={i}
                          className="group relative flex h-full flex-1 cursor-pointer flex-col items-center justify-end px-1"
                        >
                          <div className="absolute left-1/2 top-30 z-30 -translate-x-1/2 -translate-y-full opacity-0 transition-all duration-200 group-hover:opacity-100">
                            <span
                              className={`whitespace-nowrap rounded-md border px-2.5 py-1.5 text-xs font-semibold shadow-lg ${
                                isLight
                                  ? "border-gray-200 bg-white text-gray-900"
                                  : "border-purple-500/30 bg-[#141019] text-white"
                              }`}
                            >
                              {item.value} {item.value === 1 ? "attempt" : "attempts"}
                            </span>
                          </div>

                          <motion.div
                            initial={{ height: 0 }}
                            animate={{ height: `${Math.max(heightPercent, 8)}%` }}
                            transition={{ delay: i * 0.05, duration: 0.6 }}
                            className={`w-full max-w-[40px] rounded-t-lg bg-gradient-to-t from-pink-500/30 via-pink-500/50 to-purple-500 transition-all duration-200 group-hover:scale-105 group-hover:brightness-125 ${
                              isLight
                                ? "shadow-[0_10px_24px_rgba(236,72,153,0.16)] group-hover:shadow-[0_14px_30px_rgba(236,72,153,0.24)]"
                                : "shadow-lg shadow-pink-500/20 group-hover:shadow-pink-500/40"
                            }`}
                          />

                          <span
                            className={`mt-3 text-xs font-medium transition-colors ${
                              isLight
                                ? "text-gray-500 group-hover:text-gray-900"
                                : "text-gray-500 group-hover:text-white"
                            }`}
                          >
                            {item.day}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </section>

            <section
              className={`min-w-0 overflow-hidden rounded-2xl border ${
                isLight
                  ? "border-gray-200 bg-white shadow-[0_10px_30px_rgba(15,23,42,0.06)]"
                  : "border-white/10 bg-[#0a0a0a]"
              }`}
            >
              <div
                className={`p-4 sm:p-5 lg:p-6 ${
                  isLight ? "border-b border-gray-200" : "border-b border-white/10"
                }`}
              >
                <h2
                  className={`text-lg font-bold ${
                    isLight ? "text-gray-900" : "text-white"
                  }`}
                >
                  Recent Attempts
                </h2>
                <p
                  className={`mt-0.5 text-xs ${
                    isLight ? "text-gray-500" : "text-gray-500"
                  }`}
                >
                  Your latest challenge interactions
                </p>
              </div>

              {data.recentActivity.length === 0 ? (
                <div className="p-8 text-center">
                  <p
                    className={`text-xs ${
                      isLight ? "text-gray-500" : "text-gray-500"
                    }`}
                  >
                    No activity yet. Start solving challenges!
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[400px] text-left text-xs">
                    <thead>
                      <tr
                        className={`uppercase tracking-widest ${
                          isLight
                            ? "border-b border-gray-200 bg-gray-50 text-gray-500"
                            : "border-b border-white/5 bg-white/[0.02] text-gray-500"
                        }`}
                      >
                        <th className="px-5 py-3 font-medium">Challenge</th>
                        <th className="px-5 py-3 font-medium">Difficulty</th>
                        <th className="px-5 py-3 font-medium">Status</th>
                        <th className="px-5 py-3 font-medium">Date</th>
                      </tr>
                    </thead>

                    <tbody
                      className={isLight ? "divide-y divide-gray-200" : "divide-y divide-white/5"}
                    >
                      {data.recentActivity.map((item, i) => (
                        <tr
                          key={i}
                          className={`group transition ${
                            isLight ? "hover:bg-gray-50" : "hover:bg-white/[0.02]"
                          }`}
                        >
                          <td className="px-5 py-3">
                            <div
                              className={`text-xs font-medium ${
                                isLight ? "text-gray-900" : "text-white"
                              }`}
                            >
                              {item.title}
                            </div>
                            <div
                              className={`text-[10px] ${
                                isLight ? "text-gray-500" : "text-gray-500"
                              }`}
                            >
                              {item.category}
                            </div>
                          </td>

                          <td className="px-5 py-3">
                            <span
                              className={`inline-flex rounded-lg px-2 py-1 text-[9px] font-semibold ${
                                item.difficulty === "Easy"
                                  ? isLight
                                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                    : "bg-emerald-500/10 text-emerald-400"
                                  : item.difficulty === "Medium"
                                  ? isLight
                                    ? "bg-amber-50 text-amber-700 border border-amber-200"
                                    : "bg-yellow-500/10 text-yellow-400"
                                  : isLight
                                  ? "bg-rose-50 text-rose-700 border border-rose-200"
                                  : "bg-red-500/10 text-red-400"
                              }`}
                            >
                              {item.difficulty}
                            </span>
                          </td>

                          <td className="px-5 py-3">
                            <span
                              className={`text-[10px] font-medium ${
                                item.status === "Accepted"
                                  ? isLight
                                    ? "text-emerald-600"
                                    : "text-emerald-400"
                                  : item.status === "Pending"
                                  ? isLight
                                    ? "text-amber-600"
                                    : "text-yellow-400"
                                  : isLight
                                  ? "text-rose-600"
                                  : "text-rose-400"
                              }`}
                            >
                              {item.status}
                            </span>
                          </td>

                          <td
                            className={`px-5 py-3 text-[10px] ${
                              isLight ? "text-gray-500" : "text-gray-500"
                            }`}
                          >
                            {item.date}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          </div>

          <div className="min-w-0 self-start">
            <div className="space-y-4 sm:space-y-5 lg:sticky lg:top-28">
              <section
                className={`rounded-2xl border p-4 sm:p-5 lg:p-6 ${
                  isLight
                    ? "border-gray-200 bg-white shadow-[0_10px_30px_rgba(15,23,42,0.06)]"
                    : "border-white/10 bg-[#0a0a0a]"
                }`}
              >
                <h2
                  className={`mb-4 text-lg font-bold sm:mb-5 ${
                    isLight ? "text-gray-900" : "text-white"
                  }`}
                >
                  Completion
                </h2>

                <div className="space-y-4">
                  {data.difficultyBreakdown.map((item, i) => {
                    const percentage =
                      item.total > 0 ? (item.solved / item.total) * 100 : 0;

                    return (
                      <div key={i}>
                        <div className="mb-1.5 flex justify-between text-xs">
                          <span
                            className={`font-medium ${
                              isLight ? "text-gray-600" : "text-gray-400"
                            }`}
                          >
                            {item.label}
                          </span>
                          <span
                            className={`font-bold ${
                              isLight ? "text-gray-900" : "text-white"
                            }`}
                          >
                            {item.solved}/{item.total}
                          </span>
                        </div>

                        <div
                          className={`h-1.5 w-full overflow-hidden rounded-full ${
                            isLight ? "bg-gray-200" : "bg-white/5"
                          }`}
                        >
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${percentage}%` }}
                            className={`h-full rounded-full ${
                              item.label === "Easy"
                                ? "bg-emerald-500"
                                : item.label === "Medium"
                                ? "bg-yellow-500"
                                : "bg-red-500"
                            }`}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>

              <section
                className={`overflow-hidden rounded-2xl border p-4 sm:p-5 lg:p-6 ${
                  isLight
                    ? "border-gray-200 bg-white shadow-[0_10px_30px_rgba(15,23,42,0.06)]"
                    : "border-white/10 bg-[#0a0a0a]"
                }`}
              >
                <h2
                  className={`mb-4 text-lg font-bold ${
                    isLight ? "text-gray-900" : "text-white"
                  }`}
                >
                  Category Strength
                </h2>

                <div className="space-y-2.5">
                  {data.categoryPerformance.slice(0, 5).map((item, i) => (
                    <div
                      key={i}
                      className={`flex items-center justify-between rounded-lg border p-2.5 transition ${
                        isLight
                          ? "border-gray-200 bg-gray-50 hover:bg-gray-100"
                          : "border-white/5 bg-white/[0.03] hover:bg-white/[0.05]"
                      }`}
                    >
                      <span
                        className={`text-xs font-medium ${
                          isLight ? "text-gray-700" : "text-gray-300"
                        }`}
                      >
                        {item.label}
                      </span>
                      <span
                        className={`text-xs font-bold ${
                          isLight ? "text-pink-600" : "text-pink-400"
                        }`}
                      >
                        {item.value}%
                      </span>
                    </div>
                  ))}

                  {data.categoryPerformance.length === 0 && (
                    <p
                      className={`py-3 text-center text-xs ${
                        isLight ? "text-gray-500" : "text-gray-500"
                      }`}
                    >
                      Solve challenges to unlock stats
                    </p>
                  )}
                </div>
              </section>

              <section
                className={`rounded-2xl border p-4 sm:p-5 lg:p-6 ${
                  isLight
                    ? "border-pink-200 bg-gradient-to-br from-pink-50 to-white shadow-[0_10px_30px_rgba(15,23,42,0.06)]"
                    : "border-pink-500/10 bg-gradient-to-br from-pink-500/5 to-transparent"
                }`}
              >
                <h2
                  className={`mb-3 text-lg font-bold ${
                    isLight ? "text-gray-900" : "text-white"
                  }`}
                >
                  💡 Smart Tip
                </h2>

                <p
                  className={`text-xs leading-relaxed ${
                    isLight ? "text-gray-600" : "text-gray-400"
                  }`}
                >
                  {data.stats.totalSolved < 5
                    ? "Start solving more challenges to unlock personalized insights and category-specific performance metrics."
                    : data.stats.acceptanceRate >= 80
                    ? "Excellent performance! Push to higher difficulty challenges to maximize points growth."
                    : "Focus on improving your accuracy by reviewing failed attempts before trying new challenges."}
                </p>

                <Link
                  href="/dashboard/leaderboard"
                  className={`mt-4 inline-flex w-full items-center justify-center rounded-lg border py-2.5 text-xs font-bold transition ${
                    isLight
                      ? "border-gray-200 bg-white text-gray-900 hover:bg-gray-100"
                      : "border-white/10 bg-white/5 text-white hover:bg-white/10"
                  }`}
                >
                  View Global Rank
                </Link>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  subtext,
  icon,
  trend,
  isLight,
}: StatCardProps & { isLight: boolean }) {
  return (
    <div
      className={`group relative px-4 py-3 transition sm:px-5 sm:py-4 ${
        isLight ? "bg-white hover:bg-gray-50" : "bg-[#0a0a0a] hover:bg-white/[0.02]"
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <p
            className={`truncate text-[9px] font-bold uppercase tracking-widest ${
              isLight ? "text-gray-500" : "text-gray-500"
            }`}
          >
            {label}
          </p>
          <p
            className={`mt-1.5 truncate text-xl font-bold tracking-tight sm:mt-2 sm:text-2xl ${
              isLight ? "text-gray-900" : "text-white"
            }`}
          >
            {value}
          </p>
        </div>

        {icon && (
          <div
            className={`shrink-0 transition ${
              isLight
                ? "text-gray-400 group-hover:text-pink-500"
                : "text-gray-600 group-hover:text-pink-500/50"
            }`}
          >
            {icon}
          </div>
        )}
      </div>

      <div className="mt-1.5 flex items-center justify-between">
        <p
          className={`truncate text-[10px] font-medium ${
            isLight ? "text-gray-500" : "text-gray-500"
          }`}
        >
          {subtext}
        </p>
        {trend && (
          <span
            className={`shrink-0 text-[9px] font-bold ${
              isLight ? "text-emerald-600" : "text-emerald-400"
            }`}
          >
            {trend}
          </span>
        )}
      </div>
    </div>
  );
}