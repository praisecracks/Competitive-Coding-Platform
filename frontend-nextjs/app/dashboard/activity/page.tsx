"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Download, Filter } from "lucide-react";
import { useTheme } from "@/app/context/ThemeContext";
import PageFooter from "@/app/components/PageFooter";

import type { ActivityItem, ActivityType, ActivityStatus } from "./types";
import { formatDate, getDateGroup, isRecent as isRecentUtil, getDifficultyColors } from "./utils";

import ActivityCard from "./components/ActivityCard";
import ActivityFilters from "./components/ActivityFilters";
import ActivityInsights from "./components/ActivityInsights";
import DateGroupHeader from "./components/DateGroupHeader";
import ActivityModal from "./components/ActivityModal";
import SkeletonCard from "./components/SkeletonCard";

// Icon map — keep this in page to avoid prop drilling, or move to a shared icon util
import {
  CheckCircle2,
  XCircle,
  AlertCircle,
  Clock,
  Swords,
  BookOpen,
  FileText,
  Flame,
  Trophy,
  Award,
  Medal,
  Star,
  Crown,
  Gift,
  Heart,
  Sparkles,
  User,
  Settings,
  Code2,
  Target,
  Flag,
  Calendar,
} from "lucide-react";

const iconMap: Record<string, any> = {
  CheckCircle2,
  XCircle,
  AlertCircle,
  Clock,
  Swords,
  BookOpen,
  FileText,
  Flame,
  Trophy,
  Award,
  Medal,
  Star,
  Crown,
  Gift,
  Heart,
  Sparkles,
  User,
  Settings,
  Code2,
  Target,
  Flag,
  Calendar,
};

export default function ActivityPage() {
  const router = useRouter();
  const { theme } = useTheme();
  const isLight = theme === "light";

  // State
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [typeFilter, setTypeFilter] = useState<ActivityType | "all">("all");
  const [statusFilter, setStatusFilter] = useState<ActivityStatus | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedDates, setExpandedDates] = useState<Set<string>>(new Set(["Today"]));
  const [selectedActivity, setSelectedActivity] = useState<ActivityItem | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [page, setPage] = useState(1);
  const perPage = 20;

  // Fetch activities
  useEffect(() => {
    async function fetchActivities() {
      try {
        setError("");
        const token = localStorage.getItem("terminal_token");
        if (!token) {
          router.push("/login?redirect=/dashboard/activity");
          return;
        }

        const res = await fetch("/api/activity/feed?limit=100", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error("Failed to fetch activities");
        const data = await res.json();

        const activities = (data.activities || []).map((a: any) => ({
          ...a,
          date: a.date || a.CreatedAt || new Date().toISOString(),
        }));
        setActivities(activities);
      } catch (e) {
        console.error("Failed to fetch activities", e);
        setError("Unable to load activity history. Please try again.");
      } finally {
        setLoading(false);
      }
    }
    fetchActivities();
  }, [router]);

  // Filtered list
  const filteredActivities = useMemo(() => {
    return activities.filter((item) => {
      if (typeFilter !== "all" && item.type !== typeFilter) return false;
      if (statusFilter !== "all" && item.status !== statusFilter) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        return (
          item.title?.toLowerCase().includes(q) ||
          item.subtitle?.toLowerCase().includes(q) ||
          item.description?.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [activities, typeFilter, statusFilter, searchQuery]);

  // Group by date
  const groupedActivities = useMemo(() => {
    const groups: Record<string, ActivityItem[]> = {};
    filteredActivities.forEach((activity) => {
      const dateKey = getDateGroup(activity.date);
      if (!groups[dateKey]) groups[dateKey] = [];
      groups[dateKey].push(activity);
    });
    return groups;
  }, [filteredActivities]);

  // Metrics & Insights
  const insights = useMemo(() => {
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const submissions = activities.filter(
      (a) => a.type === "submission" && a.status === "accepted"
    );
    const duelsWon = activities.filter((a) => a.type === "duel" && a.status === "won");
    const learning = activities.filter(
      (a) => a.type === "learning" || a.type === "achievement"
    );

    // Streak calculation
    const dates = activities
      .filter((a) => a.date)
      .map((a) => new Date(a.date!).toDateString())
      .filter((v, i, a) => a.indexOf(v) === i)
      .sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

    let longestStreak = 0;
    let currentStreak = 0;
    if (dates.length > 0) {
      const sorted = [...dates].sort(
        (a, b) => new Date(a).getTime() - new Date(b).getTime()
      );
      let streak = 1;
      for (let i = 1; i < sorted.length; i++) {
        const prev = new Date(sorted[i - 1]);
        const curr = new Date(sorted[i]);
        const diffDays = Math.floor((curr.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24));
        if (diffDays === 1) {
          streak++;
        } else {
          if (streak > longestStreak) longestStreak = streak;
          streak = 1;
        }
      }
      if (streak > longestStreak) longestStreak = streak;

      // Current streak
      let currStreak = 1;
      for (let i = sorted.length - 1; i > 0; i--) {
        const prev = new Date(sorted[i - 1]);
        const curr = new Date(sorted[i]);
        const diffDays = Math.floor((curr.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24));
        if (diffDays === 1) {
          currStreak++;
        } else {
          break;
        }
      }
      currentStreak = currStreak;
    }

    return {
      totalXp: activities.reduce(
        (sum, a) => sum + (a.score || 0) + (a.xpAwarded || 0),
        0
      ),
      submissionsThisWeek: activities.filter(
        (a) => a.type === "submission" && a.date && new Date(a.date) >= weekAgo
      ).length,
      duelsWon: duelsWon.length,
      learningActivities: learning.length,
      longestStreak,
      currentStreak,
      mostActiveDay: "N/A", // Could calculate from dates
      achievementsUnlocked: activities.filter((a) => a.type === "achievement").length,
    };
  }, [activities]);

  // Handlers
  const toggleDateGroup = (group: string) => {
    setExpandedDates((prev) => {
      const next = new Set(prev);
      if (next.has(group)) next.delete(group);
      else next.add(group);
      return next;
    });
  };

  const openModal = (activity: ActivityItem) => {
    setSelectedActivity(activity);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedActivity(null);
  };

  // Export
  const exportActivities = useCallback(
    (format: "json" | "csv") => {
      const data = filteredActivities;
      if (format === "json") {
        const blob = new Blob([JSON.stringify(data, null, 2)], {
          type: "application/json",
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `activity-export-${new Date().toISOString().split("T")[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
      } else {
        const headers = ["Title", "Type", "Status", "Score", "Date", "Description"];
        const rows = data.map((a) => [
          a.title,
          a.type,
          a.status || "",
          (a.score || 0).toString(),
          a.date || "",
          a.subtitle || "",
        ]);
        const csv = [headers, ...rows].map((r) => r.map((c) => `"${c}"`).join(",")).join("\n");
        const blob = new Blob([csv], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `activity-export-${new Date().toISOString().split("T")[0]}.csv`;
        a.click();
        URL.revokeObjectURL(url);
      }
    },
    [filteredActivities]
  );

  // Icon getter
  const getIcon = useCallback((iconName: string, size: number = 4) => {
    const IconComponent = iconMap[iconName] || Clock;
    return <IconComponent className={`h-${size} w-${size}`} />;
  }, []);

  // Sort groups
  const sortedGroups = Object.entries(groupedActivities).sort(([a], [b]) => {
    const order = ["Today", "Yesterday", "This Week", "This Month"];
    const aIdx = order.indexOf(a);
    const bIdx = order.indexOf(b);
    if (aIdx !== -1 && bIdx !== -1) return aIdx - bIdx;
    if (aIdx !== -1) return -1;
    if (bIdx !== -1) return 1;
    return a.localeCompare(b);
  });

  return (
    <div className={`min-h-screen ${isLight ? "bg-[#f8fafc]" : "bg-[#020202]"}`}>
      <div
        className={`border-b ${isLight ? "border-gray-200 bg-white" : "border-white/10 bg-[#0c0c12]"}`}
      >
        <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <button
                onClick={() => router.push("/")}
                className={`mb-4 flex items-center gap-2 text-sm transition-colors ${
                  isLight ? "text-gray-500 hover:text-gray-900" : "text-gray-400 hover:text-white"
                }`}
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Dashboard
              </button>
              <h1 className={`text-3xl font-bold ${isLight ? "text-gray-900" : "text-white"}`}>
                Activity Feed
              </h1>
              <p className={`mt-1 text-sm ${isLight ? "text-gray-500" : "text-gray-400"}`}>
                Track your journey and milestones
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => exportActivities("json")}
                className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                  isLight
                    ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    : "bg-white/10 text-gray-300 hover:bg-white/20"
                }`}
              >
                <Download className="h-4 w-4" />
                Export
              </button>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors hidden md:flex ${
                  isLight
                    ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    : "bg-white/10 text-gray-300 hover:bg-white/20"
                }`}
              >
                <Filter className="h-4 w-4" />
                Filters
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
        {/* Insights */}
        <ActivityInsights insights={insights} isLight={isLight} />

        {/* Filters */}
        <ActivityFilters
          isLight={isLight}
          typeFilter={typeFilter}
          statusFilter={statusFilter}
          searchQuery={searchQuery}
          showFilters={showFilters}
          onTypeChange={setTypeFilter}
          onStatusChange={setStatusFilter}
          onSearchChange={setSearchQuery}
          onClearSearch={() => setSearchQuery("")}
          onToggleFilters={() => setShowFilters(!showFilters)}
        />

        {/* Activity List */}
        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <SkeletonCard key={i} isLight={isLight} />
            ))}
          </div>
        ) : error ? (
          <div
            className={`rounded-xl border p-8 text-center ${
              isLight ? "border-red-200 bg-red-50" : "border-red-500/20 bg-red-500/10"
            }`}
          >
            <p className="text-red-600">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 rounded-lg bg-pink-500 px-4 py-2 text-white hover:bg-pink-600"
            >
              Try Again
            </button>
          </div>
        ) : activities.length === 0 ? (
          <div
            className={`flex flex-col items-center justify-center rounded-2xl border py-16 ${
              isLight ? "border-gray-200 bg-white" : "border-white/10 bg-[#0c0c12]"
            }`}
          >
            <Flame className={`h-16 w-16 ${isLight ? "text-gray-300" : "text-gray-600"}`} />
            <h3 className={`mt-4 text-xl font-semibold ${isLight ? "text-gray-900" : "text-white"}`}>
              No activities yet
            </h3>
            <p className={`mt-2 text-center text-sm ${isLight ? "text-gray-500" : "text-gray-400"}`}>
              Start solving challenges, dueling friends, and learning to build your activity history!
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {sortedGroups.map(([group, groupActivities]) => (
              <div key={group} className="space-y-3">
                <DateGroupHeader
                  group={group}
                  count={groupActivities.length}
                  isExpanded={expandedDates.has(group)}
                  onToggle={() => toggleDateGroup(group)}
                  isLight={isLight}
                />

                <AnimatePresence>
                  {expandedDates.has(group) && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="space-y-3 overflow-hidden"
                    >
                      {groupActivities.map((activity, idx) => (
                        <ActivityCard
                          key={activity.id || idx}
                          activity={activity}
                          index={idx}
                          isLight={isLight}
                          isRecent={isRecentUtil}
                          formatDate={formatDate}
                          getDifficultyColors={getDifficultyColors}
                          onClick={openModal}
                          getIcon={getIcon}
                        />
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      <ActivityModal
        activity={selectedActivity}
        isOpen={showModal}
        isLight={isLight}
        onClose={closeModal}
        getIcon={getIcon}
      />

      <PageFooter />
    </div>
  );
}
