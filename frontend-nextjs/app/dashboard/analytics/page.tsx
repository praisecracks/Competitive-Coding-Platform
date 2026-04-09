"use client";

import Link from "next/link";
import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { RefreshCw, TrendingUp, Award, Zap } from "lucide-react";

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

      const processedData: AnalyticsData = {
        ...result,
        stats: {
          ...result.stats,
          acceptanceRate:
            typeof result.stats.acceptanceRate === "string"
              ? parseFloat(result.stats.acceptanceRate)
              : result.stats.acceptanceRate,
          averageScore:
            result.stats.averageScore ||
            (result.recentActivity?.length > 0
              ? Math.round(
                  result.recentActivity.reduce(
                    (sum: number, item: ActivityItem) =>
                      sum + (item.score || 0),
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
      <div className="flex min-h-screen items-center justify-center bg-[#050507]">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-pink-500/20 border-t-pink-500" />
          <p className="text-xs uppercase tracking-widest text-gray-500">
            Loading analytics...
          </p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#050507]">
        <div className="w-full max-w-sm rounded-2xl border border-red-500/10 bg-red-500/5 p-6 text-center">
          <p className="text-sm font-medium text-red-400">
            {error || "Something went wrong"}
          </p>

          <div className="mt-6 flex flex-col gap-3">
            <button
              onClick={() => {
                setError("");
                setLoading(true);
                fetchAnalytics();
              }}
              className="rounded-lg bg-red-500/20 px-4 py-2.5 text-xs font-bold text-red-400 transition hover:bg-red-500/30"
            >
              Try Again
            </button>

            <Link
              href="/dashboard"
              className="rounded-lg bg-white/5 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-white/10"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen overflow-x-hidden text-white">
      <div className="mx-auto max-w-[1400px] px-3 py-4 sm:px-5 sm:py-6 lg:px-8">
        <div className="mb-5 overflow-hidden rounded-2xl border border-white/10 bg-[#0a0a0a] shadow-lg">
          <div className="border-b border-white/10 bg-[radial-gradient(circle_at_top_right,rgba(236,72,153,0.08),transparent_22%)] px-4 py-4 sm:px-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="max-w-3xl">
                <motion.span
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="inline-flex rounded-lg border border-pink-500/20 bg-pink-500/10 px-3 py-1 text-[10px] uppercase tracking-[0.15em] text-pink-200"
                >
                  📊 Live Performance Metrics
                </motion.span>

                <h1 className="mt-3 text-2xl font-bold tracking-tight text-white sm:text-3xl">
                  Your Performance Insights
                </h1>

                <p className="mt-2 text-xs leading-relaxed text-gray-400 sm:text-sm">
                  Real-time analysis of your coding journey. Track consistency,
                  master categories, and identify growth areas.
                </p>

                {data.lastUpdated && (
                  <p className="mt-2 text-[10px] text-gray-600">
                    Last updated: {data.lastUpdated}
                  </p>
                )}
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => fetchAnalytics(true)}
                  disabled={isRefreshing}
                  className="inline-flex h-9 items-center justify-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.04] px-4 text-xs font-medium text-white transition hover:bg-white/[0.08] disabled:opacity-50"
                  title="Refresh data"
                >
                  <RefreshCw
                    className={`h-3.5 w-3.5 ${
                      isRefreshing ? "animate-spin" : ""
                    }`}
                  />
                  {isRefreshing ? "Refreshing" : "Refresh"}
                </button>

                <Link
                  href="/dashboard"
                  className="inline-flex h-9 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04] px-4 text-xs font-medium text-white transition hover:bg-white/[0.08]"
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

          <div className="grid grid-cols-2 gap-px bg-white/5 sm:grid-cols-2 md:grid-cols-4">
            <StatCard
              label="Total Points"
              value={data.stats.totalPoints.toLocaleString()}
              subtext="Lifetime earnings"
              icon={<Award className="h-4 w-4" />}
              trend="Primary metric"
            />
            <StatCard
              label="Acceptance"
              value={`${Math.round(data.stats.acceptanceRate)}%`}
              subtext="Success rate"
              icon={<TrendingUp className="h-4 w-4" />}
            />
            <StatCard
              label="Streak"
              value={`${data.stats.currentStreak}`}
              subtext="Day streak"
              icon={<Zap className="h-4 w-4" />}
              trend="Keep it going!"
            />
            <StatCard
              label="Solved"
              value={data.stats.totalSolved}
              subtext="Unique challenges"
            />
          </div>
        </div>

        <div className="grid items-start gap-5 md:grid-cols-2 lg:grid-cols-3">
          <div className="min-w-0 space-y-4 sm:space-y-5 md:col-span-2">
            <section className="rounded-2xl border border-white/10 bg-[#0a0a0a] p-4 sm:p-5 lg:p-6">
              <div className="mb-4 flex items-center justify-between sm:mb-6">
                <div>
                  <h2 className="text-lg font-bold text-white">
                    Weekly Activity
                  </h2>
                  <p className="mt-0.5 text-xs text-gray-500">
                    Challenges attempted per day (Solo + Duo)
                  </p>
                </div>
              </div>

              <div className="-mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
                <div
                  className="relative min-w-[300px] w-full sm:min-w-0"
                  style={{ height: "180px", minHeight: "150px" }}
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
                          className="group relative flex h-full flex-1 flex-col items-center"
                        >
                          <div className="absolute -top-10 left-1/2 z-10 -translate-x-1/2 opacity-0 transition-opacity group-hover:opacity-100">
                            <span className="whitespace-nowrap rounded-md bg-white/10 px-2 py-1 text-[9px] text-white backdrop-blur-md">
                              {item.value}{" "}
                              {item.value === 1 ? "attempt" : "attempts"}
                            </span>
                          </div>

                          <div className="flex h-full w-full flex-col items-center justify-end">
                            <motion.div
                              initial={{ height: 0 }}
                              animate={{ height: `${Math.max(heightPercent, 8)}%` }}
                              transition={{ delay: i * 0.05, duration: 0.6 }}
                              className="w-6 rounded-t-lg bg-gradient-to-t from-pink-500/30 via-pink-500/50 to-purple-500 shadow-lg shadow-pink-500/20 transition-all group-hover:brightness-125 group-hover:shadow-pink-500/40 sm:w-8 md:w-10"
                            />
                            <span className="mt-3 text-xs font-medium text-gray-500">
                              {item.day}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </section>

            <section className="min-w-0 overflow-hidden rounded-2xl border border-white/10 bg-[#0a0a0a]">
              <div className="border-b border-white/10 p-4 sm:p-5 lg:p-6">
                <h2 className="text-lg font-bold text-white">
                  Recent Attempts
                </h2>
                <p className="mt-0.5 text-xs text-gray-500">
                  Your latest challenge interactions
                </p>
              </div>

              {data.recentActivity.length === 0 ? (
                <div className="p-8 text-center">
                  <p className="text-xs text-gray-500">
                    No activity yet. Start solving challenges!
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[400px] text-left text-xs">
                    <thead>
                      <tr className="border-b border-white/5 bg-white/[0.02] uppercase tracking-widest text-gray-500">
                        <th className="px-5 py-3 font-medium">Challenge</th>
                        <th className="px-5 py-3 font-medium">Difficulty</th>
                        <th className="px-5 py-3 font-medium">Status</th>
                        <th className="px-5 py-3 font-medium">Date</th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-white/5">
                      {data.recentActivity.map((item, i) => (
                        <tr
                          key={i}
                          className="group transition hover:bg-white/[0.02]"
                        >
                          <td className="px-5 py-3">
                            <div className="text-xs font-medium text-white">
                              {item.title}
                            </div>
                            <div className="text-[10px] text-gray-500">
                              {item.category}
                            </div>
                          </td>

                          <td className="px-5 py-3">
                            <span
                              className={`inline-flex rounded-lg px-2 py-1 text-[9px] font-semibold ${
                                item.difficulty === "Easy"
                                  ? "bg-emerald-500/10 text-emerald-400"
                                  : item.difficulty === "Medium"
                                  ? "bg-yellow-500/10 text-yellow-400"
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
                                  ? "text-emerald-400"
                                  : item.status === "Pending"
                                  ? "text-yellow-400"
                                  : "text-rose-400"
                              }`}
                            >
                              {item.status}
                            </span>
                          </td>

                          <td className="px-5 py-3 text-[10px] text-gray-500">
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
              <section className="rounded-2xl border border-white/10 bg-[#0a0a0a] p-4 sm:p-5 lg:p-6">
                <h2 className="mb-4 text-lg font-bold text-white sm:mb-5">
                  Completion
                </h2>

                <div className="space-y-4">
                  {data.difficultyBreakdown.map((item, i) => {
                    const percentage =
                      item.total > 0 ? (item.solved / item.total) * 100 : 0;

                    return (
                      <div key={i}>
                        <div className="mb-1.5 flex justify-between text-xs">
                          <span className="font-medium text-gray-400">
                            {item.label}
                          </span>
                          <span className="font-bold text-white">
                            {item.solved}/{item.total}
                          </span>
                        </div>

                        <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/5">
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

              <section className="overflow-hidden rounded-2xl border border-white/10 bg-[#0a0a0a] p-4 sm:p-5 lg:p-6">
                <h2 className="mb-4 text-lg font-bold text-white">
                  Category Strength
                </h2>

                <div className="space-y-2.5">
                  {data.categoryPerformance.slice(0, 5).map((item, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between rounded-lg border border-white/5 bg-white/[0.03] p-2.5 transition hover:bg-white/[0.05]"
                    >
                      <span className="text-xs font-medium text-gray-300">
                        {item.label}
                      </span>
                      <span className="text-xs font-bold text-pink-400">
                        {item.value}%
                      </span>
                    </div>
                  ))}

                  {data.categoryPerformance.length === 0 && (
                    <p className="py-3 text-center text-xs text-gray-500">
                      Solve challenges to unlock stats
                    </p>
                  )}
                </div>
              </section>

              <section className="rounded-2xl border border-pink-500/10 bg-gradient-to-br from-pink-500/5 to-transparent p-4 sm:p-5 lg:p-6">
                <h2 className="mb-3 text-lg font-bold text-white">
                  💡 Smart Tip
                </h2>

                <p className="text-xs leading-relaxed text-gray-400">
                  {data.stats.totalSolved < 5
                    ? "Start solving more challenges to unlock personalized insights and category-specific performance metrics."
                    : data.stats.acceptanceRate >= 80
                    ? "Excellent performance! Push to higher difficulty challenges to maximize points growth."
                    : "Focus on improving your accuracy by reviewing failed attempts before trying new challenges."}
                </p>

                <Link
                  href="/dashboard/leaderboard"
                  className="mt-4 inline-flex w-full items-center justify-center rounded-lg border border-white/10 bg-white/5 py-2.5 text-xs font-bold text-white transition hover:bg-white/10"
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

function StatCard({ label, value, subtext, icon, trend }: StatCardProps) {
  return (
    <div className="group relative bg-[#0a0a0a] px-4 py-3 transition hover:bg-white/[0.02] sm:px-5 sm:py-4">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <p className="truncate text-[9px] font-bold uppercase tracking-widest text-gray-500">
            {label}
          </p>
          <p className="mt-1.5 truncate text-xl font-bold tracking-tight text-white sm:mt-2 sm:text-2xl">
            {value}
          </p>
        </div>

        {icon && (
          <div className="shrink-0 text-gray-600 transition group-hover:text-pink-500/50">
            {icon}
          </div>
        )}
      </div>

      <div className="mt-1.5 flex items-center justify-between">
        <p className="truncate text-[10px] font-medium text-gray-500">
          {subtext}
        </p>
        {trend && (
          <span className="shrink-0 text-[9px] font-bold text-emerald-400">
            {trend}
          </span>
        )}
      </div>
    </div>
  );
}