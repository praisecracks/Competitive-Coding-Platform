"use client";

import { useEffect, type ReactElement } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Clock, Calendar } from "lucide-react";
import type { ActivityItem } from "../types";
import { formatDate } from "../utils";

interface ActivityModalProps {
  activity: ActivityItem | null;
  isOpen: boolean;
  isLight: boolean;
  onClose: () => void;
  getIcon: (iconName: string, size?: number) => ReactElement;
}

export default function ActivityModal({
  activity,
  isOpen,
  isLight,
  onClose,
  getIcon,
}: ActivityModalProps) {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.addEventListener("keydown", handleEsc);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!activity || !isOpen) return null;

  const iconColorClass = activity.color || "text-gray-500";
  const iconBgClass = activity.bgColor || "bg-gray-500/20";

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className={`w-full max-w-lg rounded-2xl border p-6 ${
              isLight ? "bg-white border-gray-200" : "bg-[#0c0c12] border-white/10"
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                <div className={`rounded-full p-3 ${iconBgClass}`}>
                  <div className={iconColorClass}>{getIcon(activity.icon, 8)}</div>
                </div>
                <div>
                  <h2
                    className={`text-xl font-bold ${isLight ? "text-gray-900" : "text-white"}`}
                  >
                    {activity.title}
                  </h2>
                  <p className={`mt-1 ${isLight ? "text-gray-500" : "text-gray-400"}`}>
                    {activity.subtitle}
                  </p>
                  {activity.description && (
                    <p className={`mt-2 text-sm ${isLight ? "text-gray-600" : "text-gray-300"}`}>
                      {activity.description}
                    </p>
                  )}
                </div>
              </div>
              <button
                onClick={onClose}
                className={`rounded-lg p-2 transition-colors ${
                  isLight ? "hover:bg-gray-100" : "hover:bg-white/10"
                }`}
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div
                  className={`rounded-lg border p-3 ${
                    isLight ? "border-gray-200" : "border-white/10"
                  }`}
                >
                  <p className="text-xs text-gray-500">Type</p>
                  <p className="mt-1 font-medium capitalize">{activity.type}</p>
                </div>
                <div
                  className={`rounded-lg border p-3 ${
                    isLight ? "border-gray-200" : "border-white/10"
                  }`}
                >
                  <p className="text-xs text-gray-500">Status</p>
                  <p className={`mt-1 font-medium capitalize ${activity.color}`}>
                    {activity.status}
                  </p>
                </div>
                {activity.score !== undefined && (
                  <div
                    className={`rounded-lg border p-3 ${
                      isLight ? "border-gray-200" : "border-white/10"
                    }`}
                  >
                    <p className="text-xs text-gray-500">Score</p>
                    <p className="mt-1 font-bold text-pink-500">{activity.score} pts</p>
                  </div>
                )}
                {activity.xpAwarded && activity.xpAwarded > 0 && (
                  <div
                    className={`rounded-lg border p-3 ${
                      isLight ? "border-gray-200" : "border-white/10"
                    }`}
                  >
                    <p className="text-xs text-gray-500">XP Gained</p>
                    <p className="mt-1 font-bold text-purple-500">{activity.xpAwarded} XP</p>
                  </div>
                )}
              </div>

              {activity.metadata && Object.keys(activity.metadata).length > 0 && (
                <div
                  className={`rounded-lg border p-4 ${
                    isLight ? "border-gray-200" : "border-white/10"
                  }`}
                >
                  <h3 className="mb-3 font-semibold">Details</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {activity.metadata.opponent && (
                      <div>
                        <p className="text-xs text-gray-500">Opponent</p>
                        <p className="font-medium">{activity.metadata.opponent}</p>
                      </div>
                    )}
                    {activity.metadata.language && (
                      <div>
                        <p className="text-xs text-gray-500">Language</p>
                        <p className="font-medium">{activity.metadata.language}</p>
                      </div>
                    )}
                    {activity.metadata.streakDays && (
                      <div>
                        <p className="text-xs text-gray-500">Streak</p>
                        <p className="font-medium">{activity.metadata.streakDays} days</p>
                      </div>
                    )}
                    {activity.metadata.badgeName && (
                      <div>
                        <p className="text-xs text-gray-500">Badge</p>
                        <p className="font-medium">{activity.metadata.badgeName}</p>
                      </div>
                    )}
                    {activity.metadata.passedTests !== undefined && (
                      <div>
                        <p className="text-xs text-gray-500">Tests Passed</p>
                        <p className="font-medium">
                          {activity.metadata.passedTests} / {activity.metadata.totalTests}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div
                className={`rounded-lg border p-3 text-sm ${
                  isLight ? "border-gray-200 text-gray-600" : "border-white/10 text-gray-400"
                }`}
              >
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  {formatDate(activity.date)} at{" "}
                  {new Date(activity.date!).toLocaleTimeString()}
                </div>
              </div>
            </div>

            <div className="mt-6">
              <button
                onClick={onClose}
                className={`w-full rounded-xl py-2.5 font-semibold transition-colors ${
                  isLight
                    ? "bg-gray-900 text-white hover:bg-gray-800"
                    : "bg-pink-500 text-white hover:bg-pink-600"
                }`}
              >
                Close
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
