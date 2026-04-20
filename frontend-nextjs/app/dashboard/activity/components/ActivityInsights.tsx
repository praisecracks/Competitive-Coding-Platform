"use client";

import type { ReactElement } from "react";
import { TrendingUp, Zap, Target, Flame, Award } from "lucide-react";

interface ActivityInsightsProps {
  insights: {
    totalXp: number;
    submissionsThisWeek: number;
    duelsWon: number;
    learningActivities: number;
    longestStreak: number;
    currentStreak: number;
    mostActiveDay: string;
    achievementsUnlocked: number;
  };
  isLight: boolean;
}

export default function ActivityInsights({ insights, isLight }: ActivityInsightsProps) {
  const cards = [
    {
      label: "Total XP",
      value: insights.totalXp,
      icon: <Zap className="h-6 w-6" />,
      trend: `+${insights.submissionsThisWeek} this week`,
    },
    {
      label: "Submissions",
      value: insights.submissionsThisWeek,
      icon: <Target className="h-6 w-6" />,
      trend: `${insights.duelsWon} duels won`,
    },
    {
      label: "Current Streak",
      value: `${insights.currentStreak} days`,
      icon: <Flame className="h-6 w-6" />,
      trend: "Keep it up!",
    },
    {
      label: "Achievements",
      value: insights.achievementsUnlocked,
      icon: <Award className="h-6 w-6" />,
      trend: "Milestones",
    },
  ];

  return (
    <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
      {cards.map((card, idx) => (
        <div
          key={idx}
          className={`rounded-xl border p-4 ${
            isLight ? "border-gray-200 bg-white" : "border-white/10 bg-white/[0.03]"
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm ${isLight ? "text-gray-500" : "text-gray-400"}`}>
                {card.label}
              </p>
              <p className={`mt-1 text-2xl font-bold ${isLight ? "text-gray-900" : "text-white"}`}>
                {card.value}
              </p>
              {card.trend && (
                <p className="mt-1 text-xs text-emerald-500 flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" />
                  {card.trend}
                </p>
              )}
            </div>
            <div
              className={`rounded-full p-3 ${isLight ? "bg-gray-50" : "bg-white/5"}`}
            >
              <div className={`h-6 w-6 ${isLight ? "text-gray-600" : "text-gray-400"}`}>
                {card.icon}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
