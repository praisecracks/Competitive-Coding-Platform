"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  CheckCircle2,
  XCircle,
  Clock,
  AlertCircle,
  Search,
  Zap,
} from "lucide-react";
import { useTheme } from "@/app/context/ThemeContext";
import PageFooter from "@/app/components/PageFooter";

type ActivityItem = {
  id?: number;
  title?: string;
  status?: string;
  score?: number;
  date?: string;
  difficulty?: string;
  category?: string;
};

export default function ActivityPage() {
  const router = useRouter();
  const { theme } = useTheme();
  const isLight = theme === "light";

  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState<"all" | "accepted" | "failed" | "pending">("all");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    async function fetchActivities() {
      try {
        setError("");
        const token = localStorage.getItem("terminal_token");
        if (!token) {
          router.push("/login?redirect=/dashboard/activity");
          return;
        }

        const res = await fetch("/api/dashboard/stats", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error("Failed to fetch activities");
        const data = await res.json();
        
        const submissions = data.recentSubmissions || [];
        setActivities(submissions);
      } catch (e) {
        console.error("Failed to fetch activities", e);
        setError("Unable to load activity history. Please try again.");
      } finally {
        setLoading(false);
      }
    }
    fetchActivities();
  }, [router]);

  const filteredActivities = useMemo(() => {
    return activities.filter((item) => {
      // Filter by status
      if (filter !== "all") {
        const normalized = item.status?.toLowerCase() || "";
        if (filter === "accepted" && !["accepted", "completed", "passed", "correct"].some(s => normalized.includes(s))) return false;
        if (filter === "failed" && !["failed", "runtime error", "time limit", "memory limit"].some(s => normalized.includes(s))) return false;
        if (filter === "pending" && (normalized.includes("accepted") || normalized.includes("passed") || normalized.includes("failed"))) return false;
      }
      
      // Filter by search
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        return (
          item.title?.toLowerCase().includes(q) ||
          item.category?.toLowerCase().includes(q) ||
          item.status?.toLowerCase().includes(q)
        );
      }
      
      return true;
    });
  }, [activities, filter, searchQuery]);

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "Recent";
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  const getStatusStyles = (status?: string) => {
    const normalized = status?.toLowerCase() || "";
    const isSuccess = normalized === "accepted" || normalized === "completed" || normalized === "passed" || normalized === "correct";
    const isError = normalized === "failed" || normalized === "runtime error" || normalized === "time limit exceeded" || normalized === "memory limit exceeded";

    if (isSuccess) {
      return { icon: <CheckCircle2 className="h-4 w-4 text-emerald-500" />, text: "text-emerald-500", bg: "bg-emerald-500/20" };
    }
    if (isError) {
      return { icon: <XCircle className="h-4 w-4 text-red-500" />, text: "text-red-500", bg: "bg-red-500/20" };
    }
    return { icon: <AlertCircle className="h-4 w-4 text-amber-500" />, text: "text-amber-500", bg: "bg-amber-500/20" };
  };

  const getDifficultyColors = (difficulty?: string) => {
    if (difficulty === "Easy") return "text-emerald-600 bg-emerald-100";
    if (difficulty === "Medium") return "text-amber-600 bg-amber-100";
    if (difficulty === "Hard") return "text-red-600 bg-red-100";
    return "";
  };

  const stats = useMemo(() => {
    const accepted = activities.filter(a => ["accepted", "completed", "passed", "correct"].some(s => a.status?.toLowerCase().includes(s))).length;
    const failed = activities.filter(a => a.status?.toLowerCase().includes("failed") || a.status?.toLowerCase().includes("runtime error") || a.status?.toLowerCase().includes("time limit")).length;
    const totalPoints = activities.reduce((sum, a) => sum + (a.score ?? 0), 0);
    return { accepted, failed, totalPoints };
  }, [activities]);

  return (
    <div className={`min-h-screen ${isLight ? "bg-[#f8fafc]" : "bg-[#020202]"}`}>
      <div className={`border-b ${isLight ? "border-gray-200 bg-white" : "border-white/10 bg-[#0c0c12]"}`}>
        <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
          <button
            onClick={() => router.push("/dashboard/profile")}
            className={`mb-6 flex items-center gap-2 text-sm transition-colors ${
              isLight ? "text-gray-500 hover:text-gray-900" : "text-gray-400 hover:text-white"
            }`}
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Profile
          </button>

          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className={`text-2xl font-bold ${isLight ? "text-gray-900" : "text-white"}`}>
                Activity History
              </h1>
              <p className={`mt-1 text-sm ${isLight ? "text-gray-500" : "text-gray-400"}`}>
                Track your challenges and learning journey
              </p>
            </div>
            
            {/* Quick Stats */}
            {!loading && activities.length > 0 && (
              <div className="flex gap-4">
                <div className={`flex items-center gap-2 rounded-xl border px-4 py-2 ${isLight ? "border-emerald-200 bg-emerald-50" : "border-emerald-500/20 bg-emerald-500/10"}`}>
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  <span className={`text-sm font-bold text-emerald-600 ${isLight ? "text-emerald-700" : "text-emerald-400"}`}>
                    {stats.accepted}
                  </span>
                </div>
                <div className={`flex items-center gap-2 rounded-xl border px-4 py-2 ${isLight ? "border-red-200 bg-red-50" : "border-red-500/20 bg-red-500/10"}`}>
                  <XCircle className="h-4 w-4 text-red-500" />
                  <span className={`text-sm font-bold text-red-600 ${isLight ? "text-red-700" : "text-red-400"}`}>
                    {stats.failed}
                  </span>
                </div>
                <div className={`flex items-center gap-2 rounded-xl border px-4 py-2 ${isLight ? "border-amber-200 bg-amber-50" : "border-amber-500/20 bg-amber-500/10"}`}>
                  <Zap className="h-4 w-4 text-amber-500" />
                  <span className={`text-sm font-bold text-amber-600 ${isLight ? "text-amber-700" : "text-amber-400"}`}>
                    {stats.totalPoints} XP
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
        {/* Search */}
        <div className="mb-4">
          <div className={`flex items-center rounded-xl border px-4 py-3 ${isLight ? "border-gray-200 bg-white" : "border-white/10 bg-white/[0.05]"}`}>
            <Search className={`mr-3 h-4 w-4 ${isLight ? "text-gray-400" : "text-gray-500"}`} />
            <input
              type="text"
              placeholder="Search activities..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`flex-1 bg-transparent text-sm outline-none ${isLight ? "text-gray-900 placeholder:text-gray-400" : "text-white placeholder:text-gray-500"}`}
            />
          </div>
        </div>

        {/* Status Filters */}
        <div className="mb-6 flex flex-wrap gap-2">
          {(["all", "accepted", "failed", "pending"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-xl px-4 py-2 text-xs font-semibold capitalize transition-all ${
                filter === f
                  ? "bg-pink-500 text-white"
                  : isLight
                  ? "border border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
                  : "border border-white/10 bg-white/[0.03] text-gray-400 hover:bg-white/[0.06]"
              }`}
            >
              {f === "all" ? "All" : f}
            </button>
          ))}
        </div>

        {/* Error State */}
        {error && (
          <div className={`rounded-xl border border-red-200 bg-red-50 p-4 ${isLight ? "text-red-700" : "text-red-400"}`}>
            <p>{error}</p>
          </div>
        )}

        {/* Loading */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-pink-500/30 border-t-pink-500" />
          </div>
        ) : filteredActivities.length === 0 ? (
          <div className={`flex flex-col items-center justify-center rounded-2xl border py-16 ${
            isLight ? "border-gray-200 bg-white" : "border-white/10 bg-[#0c0c12]"
          }`}>
            <Clock className={`h-12 w-12 ${isLight ? "text-gray-300" : "text-gray-600"}`} />
            <h3 className={`mt-4 text-lg font-semibold ${isLight ? "text-gray-900" : "text-white"}`}>
              No activity found
            </h3>
            <p className={`mt-2 text-sm ${isLight ? "text-gray-500" : "text-gray-400"}`}>
              {searchQuery || filter !== "all" ? "Try adjusting your filters" : "Start solving challenges to see your activity here"}
            </p>
            {(searchQuery || filter !== "all") && (
              <button
                onClick={() => { setSearchQuery(""); setFilter("all"); }}
                className={`mt-4 text-sm font-medium ${isLight ? "text-pink-600 hover:text-pink-700" : "text-pink-400 hover:text-pink-300"}`}
              >
                Clear filters
              </button>
            )}
            {filter === "all" && !searchQuery && (
              <button
                onClick={() => router.push("/dashboard/challenges")}
                className={`mt-4 rounded-xl px-6 py-2 text-sm font-semibold bg-pink-500 text-white hover:bg-pink-600`}
              >
                Explore Challenges
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {filteredActivities.map((item, index) => {
              const statusStyles = getStatusStyles(item.status);
              return (
                <motion.div
                  key={`${item.id ?? index}-${index}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(index * 0.03, 0.1) }}
                  className={`flex items-center justify-between rounded-xl border p-4 ${
                    isLight
                      ? "border-gray-200 bg-white hover:border-gray-300"
                      : "border-white/10 bg-white/[0.03] hover:border-white/15"
                  }`}
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className={statusStyles.icon} />
                      <p className={`font-medium truncate ${isLight ? "text-gray-900" : "text-white"}`}>
                        {item.title || `Challenge #${(item.id ?? index) + 1}`}
                      </p>
                    </div>
                    <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
                      {item.difficulty && (
                        <span className={`rounded px-2 py-0.5 font-medium ${getDifficultyColors(item.difficulty)}`}>
                          {item.difficulty}
                        </span>
                      )}
                      <span className={`px-2 py-0.5 rounded-full font-medium ${statusStyles.bg} ${statusStyles.text}`}>
                        {item.status || "Pending"}
                      </span>
                      {item.category && (
                        <span className={isLight ? "text-gray-500" : "text-gray-400"}>
                          {item.category}
                        </span>
                      )}
                      <span className={`flex items-center gap-1 ${isLight ? "text-gray-400" : "text-gray-500"}`}>
                        <Clock className="h-3 w-3" />
                        {formatDate(item.date)}
                      </span>
                    </div>
                  </div>

                  <div className="ml-4 text-right">
                    <p className={`text-lg font-bold ${
                      item.status?.toLowerCase().includes("accept") || item.status?.toLowerCase().includes("pass") || item.status?.toLowerCase().includes("correct") 
                        ? "text-emerald-500" 
                        : item.status?.toLowerCase().includes("failed") || item.status?.toLowerCase().includes("error")
                        ? "text-red-500"
                        : "text-amber-500"
                    }`}>
                      +{item.score ?? 0} pts
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {!loading && filteredActivities.length > 0 && (
          <p className={`mt-6 text-center text-xs ${isLight ? "text-gray-400" : "text-gray-500"}`}>
            Showing {filteredActivities.length} of {activities.length} activities
          </p>
        )}
      </div>
      <PageFooter />
    </div>
  );
}