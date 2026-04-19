"use client";

import { useState } from "react";
import {
  Heart,
  CheckCircle2,
  Star,
  BookOpenCheck,
  Download,
  Swords,
  Target,
  ChevronRight,
} from "lucide-react";
import { useTheme } from "@/app/context/ThemeContext";
import html2pdf from "html2pdf.js";

type LearningEngagementProps = {
  liked: boolean;
  likesCount: number;
  onLike: () => void;
  isCompleted: boolean;
  setIsCompleted: () => void;
  selectedRating: number | null;
  setSelectedRating: (value: number) => void;
  rating?: number;
  totalRatings?: number;
  onPractice: () => void;
  onDuel: () => void;
  onNextCourse: () => void;
  hasRelatedChallenge: boolean;
  hasNextCourse: boolean;
  nextCourseTitle?: string;
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
  onDuel,
  onNextCourse,
  rating,
  totalRatings,
  hasRelatedChallenge = false,
  hasNextCourse = false,
  nextCourseTitle,
  noteContent,
}: LearningEngagementProps) {
  const { theme } = useTheme();
  const isLight = theme === "light";

  const [notification, setNotification] = useState<string | null>(null);

  const activeRating = selectedRating ?? Math.round(rating ?? 0);

  const handleDownloadNote = async () => {
    if (!noteContent) return;
    if (!isCompleted) {
      setNotification("Finish lesson before downloading note");
      setTimeout(() => setNotification(null), 3000);
      return;
    }

    const safeCourse = noteContent.courseTitle
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

    const safeStep = noteContent.stepTitle
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

    const timestamp = new Date().toISOString().split("T")[0];

    let htmlContent = `
      <div style="font-family: 'Segoe UI', system-ui, sans-serif; max-width: 800px; margin: 0 auto; padding: 40px; color: #1a1a2e; background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);">
        <div style="text-align: center; margin-bottom: 30px; padding-bottom: 20px; border-bottom: 2px solid #6366f1;">
          <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cdefs%3E%3ClinearGradient id='grad' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%236366f1'/%3E%3Cstop offset='100%25' style='stop-color:%23ec4899'/%3E%3C/linearGradient%3E%3C/defs%3E%3Ccircle cx='50' cy='50' r='45' fill='url(%23grad)'/%3E%3Ctext x='50' y='65' font-size='40' fill='white' text-anchor='middle' font-family='Arial' font-weight='bold'%3ECM%3C/text%3E%3C/svg%3E" alt="CodeMaster" style="width: 80px; height: 80px; margin-bottom: 15px;" />
          <h1 style="margin: 0; font-size: 28px; color: #1a1a2e;">CODEMASTER</h1>
          <p style="margin: 5px 0 0; color: #6366f1; font-size: 14px; letter-spacing: 3px;">LEARNING NOTE</p>
        </div>

        <div style="background: white; border-radius: 16px; padding: 30px; box-shadow: 0 4px 20px rgba(0,0,0,0.08); margin-bottom: 20px;">
          <div style="background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; font-size: 12px; font-weight: 600; letter-spacing: 2px; margin-bottom: 8px;">COURSE</div>
          <h2 style="margin: 0 0 20px; font-size: 22px; color: #1a1a2e;">${noteContent.courseTitle}</h2>
          
          <div style="background: linear-gradient(135deg, #ec4899 0%, #f43f5e 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; font-size: 12px; font-weight: 600; letter-spacing: 2px; margin-bottom: 8px;">LESSON STEP</div>
          <h3 style="margin: 0; font-size: 18px; color: #374151;">${noteContent.stepTitle}</h3>
        </div>
    `;

    if (noteContent.description) {
      htmlContent += `
        <div style="background: white; border-radius: 16px; padding: 30px; box-shadow: 0 4px 20px rgba(0,0,0,0.08); margin-bottom: 20px;">
          <div style="color: #6366f1; font-size: 12px; font-weight: 600; letter-spacing: 2px; margin-bottom: 12px;">DESCRIPTION</div>
          <p style="margin: 0; line-height: 1.7; color: #4b5563;">${noteContent.description}</p>
        </div>
      `;
    }

    if (noteContent.content && noteContent.content.length > 0) {
      htmlContent += `
        <div style="background: white; border-radius: 16px; padding: 30px; box-shadow: 0 4px 20px rgba(0,0,0,0.08); margin-bottom: 20px;">
          <div style="color: #6366f1; font-size: 12px; font-weight: 600; letter-spacing: 2px; margin-bottom: 12px;">LESSON CONTENT</div>
          <ol style="margin: 0; padding-left: 20px; line-height: 1.8;">
      `;
      noteContent.content.forEach((paragraph) => {
        htmlContent += `<li style="margin-bottom: 10px; color: #4b5563;">${paragraph}</li>`;
      });
      htmlContent += `</ol></div>`;
    }

    if (noteContent.example) {
      htmlContent += `
        <div style="background: white; border-radius: 16px; padding: 30px; box-shadow: 0 4px 20px rgba(0,0,0,0.08); margin-bottom: 20px;">
          <div style="color: #6366f1; font-size: 12px; font-weight: 600; letter-spacing: 2px; margin-bottom: 12px;">EXAMPLE</div>
      `;
      if (noteContent.example.title) {
        htmlContent += `<h4 style="margin: 0 0 10px; font-size: 16px; color: #1a1a2e;">${noteContent.example.title}</h4>`;
      }
      if (noteContent.example.code) {
        htmlContent += `
          <pre style="background: #1e1e2e; color: #a5b4fc; padding: 20px; border-radius: 12px; overflow-x: auto; font-family: 'Fira Code', monospace; font-size: 13px; line-height: 1.6; margin: 15px 0;">${noteContent.example.code}</pre>
        `;
      }
      if (noteContent.example.explanation) {
        htmlContent += `<p style="margin: 10px 0 0; line-height: 1.7; color: #4b5563;"><strong>Explanation:</strong> ${noteContent.example.explanation}</p>`;
      }
      htmlContent += `</div>`;
    }

    if (noteContent.commonMistake) {
      htmlContent += `
        <div style="background: #fef2f2; border: 1px solid #fecaca; border-radius: 16px; padding: 30px; box-shadow: 0 4px 20px rgba(0,0,0,0.08); margin-bottom: 20px;">
          <div style="color: #ef4444; font-size: 12px; font-weight: 600; letter-spacing: 2px; margin-bottom: 12px;">COMMON MISTAKE</div>
          <p style="margin: 0; line-height: 1.7; color: #991b1b;">⚠️ ${noteContent.commonMistake}</p>
        </div>
      `;
    }

    if (noteContent.keyTakeaways && noteContent.keyTakeaways.length > 0) {
      htmlContent += `
        <div style="background: white; border-radius: 16px; padding: 30px; box-shadow: 0 4px 20px rgba(0,0,0,0.08); margin-bottom: 20px;">
          <div style="color: #6366f1; font-size: 12px; font-weight: 600; letter-spacing: 2px; margin-bottom: 12px;">KEY TAKEAWAYS</div>
          <ul style="margin: 0; padding-left: 20px; line-height: 1.8;">
      `;
      noteContent.keyTakeaways.forEach((takeaway) => {
        htmlContent += `<li style="margin-bottom: 8px; color: #059669;">✓ ${takeaway}</li>`;
      });
      htmlContent += `</ul></div>`;
    }

    htmlContent += `
        <div style="text-align: center; padding: 20px; color: #9ca3af; font-size: 12px; border-top: 1px solid #e5e7eb; margin-top: 20px;">
          <p style="margin: 0;">Generated from CodeMaster Learning System • ${timestamp}</p>
        </div>
      </div>
    `;

    const container = document.createElement("div");
    container.innerHTML = htmlContent;
    container.style.width = "800px";

    const pdfOptions = {
      margin: 10,
      filename: `${safeCourse}-${safeStep}-note-${timestamp}.pdf`,
      image: { type: "jpeg" as const, quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: "mm" as const, format: "a4" as const, orientation: "portrait" as const },
    };

    await html2pdf().set(pdfOptions).from(container).save();
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
            <span>{totalRatings ?? 0} ratings</span>
            <span>•</span>
            <span>{(rating ?? 0).toFixed(1)} average rating</span>
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
          disabled={!noteContent || !isCompleted}
          className={`inline-flex items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-medium transition active:scale-[0.98] ${
            noteContent && isCompleted
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

        {/* Next Course or Related Challenge or Duel */}
        {hasNextCourse ? (
          <button
            onClick={onNextCourse}
            className={`inline-flex items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-medium transition active:scale-[0.98] ${
              isLight
                ? "border-purple-200 bg-purple-50 text-purple-700 hover:bg-purple-100"
                : "border-purple-500/20 bg-purple-500/10 text-purple-300 hover:bg-purple-500/20"
            }`}
          >
            <Target className="h-4 w-4" />
            Next: {nextCourseTitle}
            <ChevronRight className="h-4 w-4" />
          </button>
        ) : hasRelatedChallenge ? (
          <>
            <button
              onClick={onPractice}
              className={`inline-flex items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-medium transition active:scale-[0.98] ${
                isLight
                  ? "border-gray-200 bg-gray-50 text-gray-800 hover:bg-gray-100"
                  : "border-white/10 bg-white/[0.04] text-white hover:bg-white/[0.08]"
              }`}
            >
              <Target className="h-4 w-4" />
              Practice Challenge
            </button>
      
          </>
        ) : (
          <div className="hidden xl:block" />
        )}

        {notification && (
          <div className="fixed left-1/2 top-24 z-50 -translate-x-1/2">
            <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-5 py-3 shadow-2xl backdrop-blur-xl text-red-300">
              <p className="text-sm font-medium">{notification}</p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}