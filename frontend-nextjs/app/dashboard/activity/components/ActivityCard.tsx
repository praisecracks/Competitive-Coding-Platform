"use client";

import type { ReactElement } from "react";
import type { ActivityItem } from "../types";
import { formatDate as defaultFormatDate } from "../utils";
import { motion } from "framer-motion";
import {
  CheckCircle2,
  XCircle,
  AlertCircle,
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
  Clock,
  Zap,
} from "lucide-react";

interface ActivityCardProps {
  activity: ActivityItem;
  index: number;
  isLight: boolean;
  isRecent: (dateStr?: string) => boolean;
  formatDate: (dateStr?: string) => string;
  getDifficultyColors: (difficulty?: string, isLight?: boolean) => string;
  onClick: (activity: ActivityItem) => void;
  getIcon: (iconName: string, size?: number) => ReactElement;
}

export default function ActivityCard({
  activity,
  index,
  isLight,
  isRecent,
  formatDate,
  getDifficultyColors,
  onClick,
  getIcon,
}: ActivityCardProps) {
  const activityIsRecent = isRecent(activity.date);
  const isAchievement = activity.type === "achievement";
  const isDuel = activity.type === "duel";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03 }}
      className={`group relative overflow-hidden rounded-xl border transition-all duration-200 hover:shadow-lg cursor-pointer ${
        isLight ? "border-gray-200 bg-white hover:border-gray-300" : "border-white/10 bg-white/[0.03] hover:border-white/20"
      } ${activity.isMilestone ? "ring-2 ring-yellow-500/50" : ""}`}
      onClick={() => onClick(activity)}
    >
      {/* Milestone glow effect */}
      {activity.isMilestone && (
        <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/10 via-amber-500/10 to-orange-500/10 animate-pulse" />
      )}

      <div className="relative p-4">
        <div className="flex items-start gap-3">
          {/* Icon */}
          <div className={`flex-shrink-0 rounded-full p-2 ${activity.bgColor || "bg-gray-500/20"}`}>
            <div className={activity.color || "text-gray-500"}>
              {getIcon(activity.icon, 5)}
            </div>
          </div>

          {/* Content */}
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h3 className={`truncate font-semibold ${isLight ? "text-gray-900" : "text-white"}`}>
                {activity.title}
              </h3>
              {isAchievement && (
                <Trophy className="h-4 w-4 text-yellow-500 animate-bounce" />
              )}
              {activityIsRecent && (
                <span className="rounded-full bg-emerald-500/20 px-1.5 py-0.5 text-[10px] font-bold text-emerald-500">
                  NEW
                </span>
              )}
            </div>

            <p className={`mt-0.5 text-sm ${isLight ? "text-gray-500" : "text-gray-400"}`}>
              {activity.subtitle || activity.description}
            </p>

            {/* Metadata */}
            <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
              <span className={`rounded px-2 py-0.5 font-medium ${activity.bgColor} ${activity.color}`}>
                {activity.status ? activity.status.charAt(0).toUpperCase() + activity.status.slice(1) : "Completed"}
              </span>

              {activity.difficulty && (
                <span className={`rounded px-2 py-0.5 font-medium ${getDifficultyColors(activity.difficulty, isLight)}`}>
                  {activity.difficulty}
                </span>
              )}

              {activity.category && (
                <span className={isLight ? "text-gray-500" : "text-gray-400"}>
                  {activity.category}
                </span>
              )}

              {activity.metadata?.opponent && (
                <span className={isLight ? "text-gray-500" : "text-gray-400"}>
                  vs {activity.metadata.opponent}
                </span>
              )}

              {activity.metadata?.streakDays && (
                <span className="flex items-center gap-1 text-amber-500">
                  <Flame className="h-3 w-3" />
                  {activity.metadata.streakDays} day streak
                </span>
              )}

              {activity.score !== undefined && activity.score > 0 && (
                <span className="flex items-center gap-1 font-bold text-pink-500">
                  <Zap className="h-3 w-3" />
                  +{activity.score} XP
                </span>
              )}

              {activity.xpAwarded && activity.xpAwarded > 0 && (
                <span className="flex items-center gap-1 font-bold text-purple-500">
                  <Sparkles className="h-3 w-3" />
                  +{activity.xpAwarded} XP
                </span>
              )}

              <span className={`flex items-center gap-1 ${isLight ? "text-gray-400" : "text-gray-500"}`}>
                <Clock className="h-3 w-3" />
                {formatDate(activity.date)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
