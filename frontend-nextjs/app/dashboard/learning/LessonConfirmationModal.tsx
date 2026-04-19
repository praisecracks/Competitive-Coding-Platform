"use client";

import { X, HelpCircle } from "lucide-react";
import { useTheme } from "@/app/context/ThemeContext";

interface LessonConfirmationModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function LessonConfirmationModal({
  isOpen,
  onConfirm,
  onCancel,
}: LessonConfirmationModalProps) {
  const { theme } = useTheme();
  const isLight = theme === "light";

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/70"
        onClick={onCancel}
      />
      <div
        className={`relative z-10 w-full max-w-md rounded-3xl border p-6 shadow-2xl mx-4 ${
          isLight
            ? "bg-white border-gray-200"
            : "bg-[#121218] border-white/10"
        }`}
      >
        <div className="flex flex-col items-center text-center">
          <div
            className={`mb-4 flex h-16 w-16 items-center justify-center rounded-full ${
              isLight
                ? "bg-pink-100 text-pink-600"
                : "bg-pink-500/20 text-pink-400"
            }`}
          >
            <HelpCircle className="h-8 w-8" />
          </div>

          <h2
            className={`text-xl font-bold ${
              isLight ? "text-gray-900" : "text-white"
            }`}
          >
            Did you actually finish the lesson?
          </h2>

          <p
            className={`mt-2 text-sm ${
              isLight ? "text-gray-500" : "text-gray-400"
            }`}
          >
            Make sure you&apos;ve understood and completed the lesson before
            moving on.
          </p>

          <div className="mt-6 flex w-full flex-col gap-3">
            <button
              onClick={onConfirm}
              className={`w-full rounded-xl py-3 text-sm font-semibold transition ${
                isLight
                  ? "bg-gradient-to-r from-pink-500 to-purple-600 text-white hover:opacity-95"
                  : "bg-gradient-to-r from-pink-500 to-purple-600 text-white hover:opacity-95"
              }`}
            >
              Yes, I finished the lesson
            </button>

            <button
              onClick={onCancel}
              className={`w-full rounded-xl py-3 text-sm font-semibold transition ${
                isLight
                  ? "border border-gray-200 text-gray-700 hover:bg-gray-50"
                  : "border border-white/10 text-gray-300 hover:bg-white/5"
              }`}
            >
              No, go back and finish
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}