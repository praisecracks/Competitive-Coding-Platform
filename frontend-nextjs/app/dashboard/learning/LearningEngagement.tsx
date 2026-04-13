"use client";

import {
  Heart,
  CheckCircle2,
  Star,
  BookOpenCheck,
  Download,
} from "lucide-react";
import { useTheme } from "@/app/context/ThemeContext";

type LearningEngagementProps = {
  liked: boolean;
  likesCount: number;
  onLike: () => void;
  isCompleted: boolean;
  setIsCompleted: () => void;
  selectedRating: number | null;
  setSelectedRating: (value: number) => void;
  onPractice: () => void;
  rating: number;
  totalRatings: number;
  hasRelatedChallenge?: boolean;
  noteContent?: {
    courseTitle: string;
    stepTitle: string;
    description?: string;
    content?: string[];
    example?: {
      title?: string;
      code?: string;
      explanation?: string;
    };
    commonMistake?: string;
    keyTakeaways?: string[];
  };
};

export default function LearningEngagement({
  liked,
  likesCount,
  onLike,
  isCompleted,
  setIsCompleted,
  selectedRating,
  setSelectedRating,
  onPractice,
  rating,
  totalRatings,
  hasRelatedChallenge = false,
  noteContent,
}: LearningEngagementProps) {
  const { theme } = useTheme();
  const isLight = theme === "light";

  const activeRating = selectedRating ?? Math.round(rating);

  const handleDownloadNote = () => {
    if (!noteContent) return;

    const lines: string[] = [];

    lines.push("CODEMASTER LEARNING NOTE");
    lines.push("========================");
    lines.push("");
    lines.push(`Course: ${noteContent.courseTitle}`);
    lines.push(`Lesson Step: ${noteContent.stepTitle}`);
    lines.push("");

    if (noteContent.description) {
      lines.push("Description");
      lines.push("-----------");
      lines.push(noteContent.description);
      lines.push("");
    }

    if (noteContent.content && noteContent.content.length > 0) {
      lines.push("Lesson Content");
      lines.push("--------------");
      noteContent.content.forEach((paragraph, index) => {
        lines.push(`${index + 1}. ${paragraph}`);
        lines.push("");
      });
    }

    if (noteContent.example) {
      lines.push("Example");
      lines.push("-------");

      if (noteContent.example.title) {
        lines.push(`Title: ${noteContent.example.title}`);
        lines.push("");
      }

      if (noteContent.example.code) {
        lines.push("Code:");
        lines.push(noteContent.example.code);
        lines.push("");
      }

      if (noteContent.example.explanation) {
        lines.push("Explanation:");
        lines.push(noteContent.example.explanation);
        lines.push("");
      }
    }

    if (noteContent.commonMistake) {
      lines.push("Common Mistake");
      lines.push("--------------");
      lines.push(noteContent.commonMistake);
      lines.push("");
    }

    if (noteContent.keyTakeaways && noteContent.keyTakeaways.length > 0) {
      lines.push("Key Takeaways");
      lines.push("-------------");
      noteContent.keyTakeaways.forEach((takeaway) => {
        lines.push(`- ${takeaway}`);
      });
      lines.push("");
    }

    lines.push("Generated from CodeMaster Learning System");

    const blob = new Blob([lines.join("\n")], {
      type: "text/plain;charset=utf-8",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    const safeCourse = noteContent.courseTitle
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

    const safeStep = noteContent.stepTitle
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

    link.href = url;
    link.download = `${safeCourse}-${safeStep}-note.txt`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <section
      className={`rounded-[24px] border p-5 sm:p-6 ${
        isLight
          ? "border-gray-200 bg-white shadow-[0_14px_34px_rgba(15,23,42,0.06)]"
          : "border-white/10 bg-[#0b0b0f]"
      }`}
    >
      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div className="max-w-2xl">
          <p
            className={`text-[10px] font-semibold uppercase tracking-[0.24em] ${
              isLight ? "text-gray-500" : "text-gray-500"
            }`}
          >
            Lesson Engagement
          </p>

          <h3
            className={`mt-3 text-xl font-semibold tracking-tight ${
              isLight ? "text-gray-900" : "text-white"
            }`}
          >
            Interact and track your learning progress
          </h3>

          <p
            className={`mt-2 text-sm leading-6 ${
              isLight ? "text-gray-600" : "text-gray-400"
            }`}
          >
            Like this lesson, rate the learning experience, download your lesson
            note, and complete this step to unlock the next part of the course.
          </p>

          <div
            className={`mt-4 flex flex-wrap items-center gap-3 text-xs ${
              isLight ? "text-gray-500" : "text-gray-500"
            }`}
          >
            <span>{likesCount} lesson likes</span>
            <span>•</span>
            <span>{totalRatings} ratings</span>
            <span>•</span>
            <span>{rating.toFixed(1)} average rating</span>
          </div>
        </div>

        <div
          className={`rounded-2xl border px-4 py-3 ${
            isLight
              ? "border-gray-200 bg-gray-50"
              : "border-white/10 bg-white/[0.03]"
          }`}
        >
          <p
            className={`text-[10px] uppercase tracking-[0.16em] ${
              isLight ? "text-gray-500" : "text-gray-500"
            }`}
          >
            Your Rating
          </p>

          <div className="mt-3 flex items-center gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => setSelectedRating(star)}
                className="transition-transform hover:scale-105 active:scale-90"
                type="button"
              >
                <Star
                  className={`h-5 w-5 transition-colors ${
                    star <= activeRating
                      ? "fill-amber-400 text-amber-400"
                      : isLight
                      ? "text-gray-300 hover:text-gray-500"
                      : "text-gray-600 hover:text-gray-400"
                  }`}
                />
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <button
          onClick={onLike}
          className={`inline-flex items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-medium transition active:scale-[0.98] ${
            liked
              ? isLight
                ? "border-rose-200 bg-rose-50 text-rose-600"
                : "border-rose-500/20 bg-rose-500/10 text-rose-300"
              : isLight
              ? "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
              : "border-white/10 bg-white/[0.04] text-white hover:bg-white/[0.08]"
          }`}
        >
          <Heart className={`h-4 w-4 ${liked ? "fill-current" : ""}`} />
          {liked ? "Liked" : "Like Lesson"}
        </button>

        <button
          onClick={setIsCompleted}
          className={`inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-medium transition active:scale-[0.98] ${
            isCompleted
              ? isLight
                ? "border border-emerald-200 bg-emerald-50 text-emerald-600"
                : "border border-emerald-500/20 bg-emerald-500/10 text-emerald-300"
              : "bg-gradient-to-r from-pink-500 to-purple-500 text-white hover:opacity-95"
          }`}
        >
          {isCompleted ? (
            <>
              <CheckCircle2 className="h-4 w-4" />
              Step Completed
            </>
          ) : (
            <>
              <BookOpenCheck className="h-4 w-4" />
              Complete Step
            </>
          )}
        </button>

        <button
          onClick={handleDownloadNote}
          disabled={!noteContent}
          className={`inline-flex items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-medium transition active:scale-[0.98] ${
            noteContent
              ? isLight
                ? "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
                : "border-white/10 bg-white/[0.04] text-white hover:bg-white/[0.08]"
              : isLight
              ? "cursor-not-allowed border-gray-200 bg-gray-50 text-gray-400"
              : "cursor-not-allowed border-white/10 bg-white/[0.03] text-gray-600"
          }`}
        >
          <Download className="h-4 w-4" />
          Download Note
        </button>

        {hasRelatedChallenge ? (
          <button
            onClick={onPractice}
            className={`inline-flex items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-medium transition active:scale-[0.98] ${
              isLight
                ? "border-gray-200 bg-gray-50 text-gray-800 hover:bg-gray-100"
                : "border-white/10 bg-white/[0.04] text-white hover:bg-white/[0.08]"
            }`}
          >
            Practice Related Challenge
          </button>
        ) : (
          <div className="hidden xl:block" />
        )}
      </div>
    </section>
  );
}