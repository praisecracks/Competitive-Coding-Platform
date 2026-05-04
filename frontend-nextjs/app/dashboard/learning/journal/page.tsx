"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Calendar,
  BookOpen,
  Download,
  Trash2,
  Trophy,
  Target,
  Search,
  Filter,
  X,
  Sparkles,
  Clock,
  ChevronRight,
  Loader2,
  FileText,
  Code2,
  Lightbulb,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useTheme } from "@/app/context/ThemeContext";
import { getUserJournalKey } from "@/lib/auth";

interface JournalEntry {
  id: string;
  type: "course_completion" | "topic_completion";
  title: string;
  completedAt: string;
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
}

export default function LearningJournalPage() {
  const router = useRouter();
  const { theme } = useTheme();
  const isLight = theme === "light";
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);
  const [selectedEntry, setSelectedEntry] = useState<JournalEntry | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<"all" | "course" | "topic">("all");
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  useEffect(() => {
    const journalKey = getUserJournalKey();
    const savedJournal = localStorage.getItem(journalKey);

    if (savedJournal) {
      try {
        const parsed: JournalEntry[] = JSON.parse(savedJournal);
        const sorted = parsed.sort((a, b) => 
          new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime()
        );
        setJournalEntries(sorted);
        if (sorted.length > 0) {
          setSelectedEntry(sorted[0]);
        }
      } catch (error) {
        console.error("Failed to parse learning journal", error);
      }
    }
  }, []);

  const filteredEntries = journalEntries.filter((entry) => {
    const matchesSearch = entry.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = 
      filterType === "all" ? true :
      filterType === "course" ? entry.type === "course_completion" :
      entry.type === "topic_completion";
    return matchesSearch && matchesType;
  });

  const handleDownloadNote = async (entry: JournalEntry) => {
    if (!entry.noteContent) return;
    setIsDownloading(entry.id);

    try {
      const safeCourse = entry.noteContent.courseTitle
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");

      const timestamp = new Date().toISOString().split("T")[0];

      let htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <title>CodeMaster Journal - ${entry.noteContent.courseTitle}</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body {
              font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
              background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
              padding: 40px;
            }
            .container {
              max-width: 800px;
              margin: 0 auto;
              background: white;
              border-radius: 24px;
              box-shadow: 0 20px 60px rgba(0,0,0,0.1);
              overflow: hidden;
            }
            .header {
              background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #ec4899 100%);
              padding: 40px;
              text-align: center;
              color: white;
            }
            .header h1 { font-size: 28px; margin-bottom: 8px; }
            .header p { opacity: 0.9; font-size: 14px; }
            .content { padding: 40px; }
            .section {
              margin-bottom: 32px;
              padding: 24px;
              background: #f8f9fa;
              border-radius: 16px;
              border-left: 4px solid #6366f1;
            }
            .section-title {
              font-size: 14px;
              font-weight: 600;
              text-transform: uppercase;
              letter-spacing: 2px;
              color: #6366f1;
              margin-bottom: 16px;
            }
            .code-block {
              background: #1e1e2e;
              color: #a5b4fc;
              padding: 20px;
              border-radius: 12px;
              overflow-x: auto;
              font-family: 'Fira Code', 'Courier New', monospace;
              font-size: 13px;
              line-height: 1.6;
              margin: 16px 0;
            }
            .takeaway-item {
              display: flex;
              align-items: center;
              gap: 12px;
              padding: 12px 0;
              border-bottom: 1px solid #e5e7eb;
            }
            .takeaway-item:last-child { border-bottom: none; }
            .check-icon { color: #10b981; font-size: 20px; }
            .footer {
              background: #f8f9fa;
              padding: 20px;
              text-align: center;
              color: #6b7280;
              font-size: 12px;
              border-top: 1px solid #e5e7eb;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>📓 CODEMASTER</h1>
              <p>Learning Journal • ${timestamp}</p>
            </div>
            <div class="content">
              <div class="section">
                <div class="section-title">🎯 ${entry.type === "course_completion" ? "COURSE COMPLETED" : "TOPIC COMPLETED"}</div>
                <h2 style="font-size: 24px; margin-bottom: 12px;">${entry.noteContent.courseTitle}</h2>
                <p style="color: #6b7280;">Completed on ${new Date(entry.completedAt).toLocaleDateString()}</p>
              </div>
      `;

      if (entry.noteContent.description) {
        htmlContent += `
          <div class="section">
            <div class="section-title">📖 DESCRIPTION</div>
            <p style="line-height: 1.7; color: #4b5563;">${entry.noteContent.description}</p>
          </div>
        `;
      }

      if (entry.noteContent.content && entry.noteContent.content.length > 0) {
        htmlContent += `
          <div class="section">
            <div class="section-title">📚 KEY CONCEPTS</div>
            <ul style="padding-left: 20px; line-height: 1.8;">
        `;
        entry.noteContent.content.forEach((paragraph) => {
          htmlContent += `<li style="margin-bottom: 8px;">${escapeHtml(paragraph)}</li>`;
        });
        htmlContent += `</ul></div>`;
      }

      if (entry.noteContent.example?.code) {
        htmlContent += `
          <div class="section">
            <div class="section-title">💻 CODE EXAMPLE</div>
            ${entry.noteContent.example.title ? `<p style="margin-bottom: 12px; font-weight: 500;">${entry.noteContent.example.title}</p>` : ""}
            <div class="code-block">${escapeHtml(entry.noteContent.example.code)}</div>
            ${entry.noteContent.example.explanation ? `<p style="margin-top: 12px; color: #6b7280; font-size: 14px;">${entry.noteContent.example.explanation}</p>` : ""}
          </div>
        `;
      }

      if (entry.noteContent.commonMistake) {
        htmlContent += `
          <div class="section">
            <div class="section-title">⚠️ COMMON MISTAKE</div>
            <p style="color: #dc2626;">${escapeHtml(entry.noteContent.commonMistake)}</p>
          </div>
        `;
      }

      if (entry.noteContent.keyTakeaways && entry.noteContent.keyTakeaways.length > 0) {
        htmlContent += `
          <div class="section">
            <div class="section-title">✨ KEY TAKEAWAYS</div>
        `;
        entry.noteContent.keyTakeaways.forEach((takeaway) => {
          htmlContent += `
            <div class="takeaway-item">
              <span class="check-icon">✓</span>
              <span>${escapeHtml(takeaway)}</span>
            </div>
          `;
        });
        htmlContent += `</div>`;
      }

      htmlContent += `
            </div>
            <div class="footer">
              <p>Generated from CodeMaster Learning Platform • Keep coding! 🚀</p>
            </div>
          </div>
        </body>
        </html>
      `;

      const blob = new Blob([htmlContent], { type: "text/html" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${safeCourse}-journal-${timestamp}.html`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed:", error);
    } finally {
      setIsDownloading(null);
    }
  };

  const escapeHtml = (text: string) => {
    return text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  };

  const handleDeleteEntry = (entryId: string) => {
    setIsDeleting(entryId);
    setTimeout(() => {
      const updatedEntries = journalEntries.filter((entry) => entry.id !== entryId);
      setJournalEntries(updatedEntries);
      const journalKey = getUserJournalKey();
      localStorage.setItem(journalKey, JSON.stringify(updatedEntries));

      if (selectedEntry?.id === entryId) {
        setSelectedEntry(updatedEntries[0] || null);
      }
      setIsDeleting(null);
      setShowDeleteConfirm(null);
    }, 300);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffHours < 1) return "Just now";
    if (diffHours < 24) return `${diffHours} hour${diffHours === 1 ? "" : "s"} ago`;
    return `${Math.floor(diffHours / 24)} day${Math.floor(diffHours / 24) === 1 ? "" : "s"} ago`;
  };

  const stats = {
    total: journalEntries.length,
    courses: journalEntries.filter(e => e.type === "course_completion").length,
    topics: journalEntries.filter(e => e.type === "topic_completion").length,
    lastWeek: journalEntries.filter(e => {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return new Date(e.completedAt) > weekAgo;
    }).length,
  };

  return (
    <div
      className={`min-h-screen mt-[-10px] ${
        isLight
          ? "bg-gradient-to-b from-gray-50 to-gray-100"
          : "bg-[radial-gradient(circle_at_top,rgba(236,72,153,0.08),transparent_22%),radial-gradient(circle_at_right,rgba(168,85,247,0.08),transparent_18%),#050505]"
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8">
        {/* Back Button - Top Left */}
        <div className="mb-6">
          <button
            onClick={() => router.back()}
            className={`group inline-flex items-center gap-2 rounded-xl px-4 py-2 transition-all duration-200 ${
              isLight
                ? "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                : "text-gray-400 hover:bg-white/[0.05] hover:text-white"
            }`}
          >
            <ArrowLeft className="h-5 w-5 transition-transform group-hover:-translate-x-0.5" />
            <span className="hidden sm:inline">Back to Dashboard</span>
          </button>
        </div>

        {/* Header with Stats */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1
              className={`text-3xl font-bold tracking-tight sm:text-4xl ${
                isLight ? "text-gray-900" : "bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent"
              }`}
            >
              Learning Journal
            </h1>
            <p className={`mt-2 ${isLight ? "text-gray-600" : "text-gray-400"}`}>
              Track your coding journey and celebrate achievements
            </p>
          </div>

          {/* Stats Cards */}
          {journalEntries.length > 0 && (
            <div className="flex gap-3">
              <div className={`flex items-center gap-2 rounded-xl px-4 py-2 ${
                isLight ? "bg-white" : "bg-white/5"
              }`}>
                <Trophy className={`h-4 w-4 ${isLight ? "text-yellow-600" : "text-yellow-400"}`} />
                <span className={`text-sm font-medium ${isLight ? "text-gray-900" : "text-white"}`}>
                  {stats.courses} Courses
                </span>
              </div>
              <div className={`flex items-center gap-2 rounded-xl px-4 py-2 ${
                isLight ? "bg-white" : "bg-white/5"
              }`}>
                <Target className={`h-4 w-4 ${isLight ? "text-purple-600" : "text-purple-400"}`} />
                <span className={`text-sm font-medium ${isLight ? "text-gray-900" : "text-white"}`}>
                  {stats.topics} Topics
                </span>
              </div>
              <div className={`flex items-center gap-2 rounded-xl px-4 py-2 ${
                isLight ? "bg-white" : "bg-white/5"
              }`}>
                <Sparkles className={`h-4 w-4 ${isLight ? "text-pink-600" : "text-pink-400"}`} />
                <span className={`text-sm font-medium ${isLight ? "text-gray-900" : "text-white"}`}>
                  {stats.lastWeek} This week
                </span>
              </div>
            </div>
          )}
        </div>

        {journalEntries.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-12 text-center ${
              isLight ? "border-gray-300 bg-white/50" : "border-white/10 bg-white/5"
            }`}
          >
            <div className={`mb-6 rounded-full p-4 ${
              isLight ? "bg-gray-100" : "bg-white/10"
            }`}>
              <BookOpen className={`h-12 w-12 ${isLight ? "text-gray-400" : "text-gray-500"}`} />
            </div>
            <h3 className={`mb-2 text-xl font-semibold ${isLight ? "text-gray-900" : "text-white"}`}>
              Your journal is empty
            </h3>
            <p className={`mb-6 max-w-md ${isLight ? "text-gray-500" : "text-gray-400"}`}>
              Complete courses and topics to start building your learning journal. Every achievement will be recorded here.
            </p>
            <button
              onClick={() => router.push("/dashboard/learning")}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-3 font-medium text-white transition-all hover:from-purple-600 hover:to-pink-600"
            >
              Start Learning
              <ChevronRight className="h-4 w-4" />
            </button>
          </motion.div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
            {/* Left Sidebar - Sticky Course List */}
            <div className="lg:w-80 xl:w-96 flex-shrink-0">
              <div className="sticky top-6">
                <div
                  className={`rounded-2xl border ${
                    isLight ? "border-gray-200 bg-white/80 backdrop-blur-sm" : "border-white/10 bg-[#0d0d12]/80 backdrop-blur-sm"
                  }`}
                >
                  {/* Search and Filter */}
                  <div className="border-b p-4 ${isLight ? 'border-gray-200' : 'border-white/10'}">
                    <h2 className={`mb-3 text-lg font-semibold ${isLight ? "text-gray-900" : "text-white"}`}>
                      Your Achievements
                    </h2>
                    <div className={`relative flex items-center rounded-xl ${
                      isLight ? "bg-gray-100" : "bg-white/5"
                    }`}>
                      <Search className={`absolute left-3 h-4 w-4 ${isLight ? "text-gray-400" : "text-gray-500"}`} />
                      <input
                        type="text"
                        placeholder="Search entries..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className={`w-full rounded-xl border-0 bg-transparent py-2 pl-9 pr-8 text-sm outline-none focus:ring-2 focus:ring-purple-500 ${
                          isLight ? "text-gray-900 placeholder:text-gray-400" : "text-white placeholder:text-gray-500"
                        }`}
                      />
                      {searchQuery && (
                        <button
                          onClick={() => setSearchQuery("")}
                          className={`absolute right-3 rounded-full p-0.5 ${
                            isLight ? "hover:bg-gray-200" : "hover:bg-white/10"
                          }`}
                        >
                          <X className="h-3 w-3" />
                        </button>
                      )}
                    </div>

                    <div className="mt-3 flex gap-2">
                      <button
                        onClick={() => setFilterType("all")}
                        className={`flex-1 rounded-lg px-3 py-1.5 text-sm font-medium transition-all ${
                          filterType === "all"
                            ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                            : isLight
                            ? "bg-gray-100 text-gray-600 hover:bg-gray-200"
                            : "bg-white/5 text-gray-400 hover:bg-white/10"
                        }`}
                      >
                        All
                      </button>
                      <button
                        onClick={() => setFilterType("course")}
                        className={`flex-1 rounded-lg px-3 py-1.5 text-sm font-medium transition-all ${
                          filterType === "course"
                            ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                            : isLight
                            ? "bg-gray-100 text-gray-600 hover:bg-gray-200"
                            : "bg-white/5 text-gray-400 hover:bg-white/10"
                        }`}
                      >
                        Courses
                      </button>
                      <button
                        onClick={() => setFilterType("topic")}
                        className={`flex-1 rounded-lg px-3 py-1.5 text-sm font-medium transition-all ${
                          filterType === "topic"
                            ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                            : isLight
                            ? "bg-gray-100 text-gray-600 hover:bg-gray-200"
                            : "bg-white/5 text-gray-400 hover:bg-white/10"
                        }`}
                      >
                        Topics
                      </button>
                    </div>
                  </div>

                  {/* Scrollable Entry List */}
                  <div className="max-h-[calc(100vh-280px)] overflow-y-auto p-2 custom-scrollbar">
                    <AnimatePresence>
                      {filteredEntries.map((entry, index) => (
                        <motion.div
                          key={entry.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          onClick={() => setSelectedEntry(entry)}
                          className={`group cursor-pointer rounded-xl p-3 transition-all duration-200 ${
                            selectedEntry?.id === entry.id
                              ? isLight
                                ? "bg-gradient-to-r from-purple-50 to-pink-50 shadow-md"
                                : "bg-gradient-to-r from-purple-500/10 to-pink-500/10"
                              : isLight
                              ? "hover:bg-gray-50"
                              : "hover:bg-white/5"
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <div
                              className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl ${
                                entry.type === "course_completion"
                                  ? isLight
                                    ? "bg-yellow-100"
                                    : "bg-purple-500/20"
                                  : isLight
                                  ? "bg-green-100"
                                  : "bg-pink-500/20"
                              }`}
                            >
                              {entry.type === "course_completion" ? (
                                <Trophy className={`h-5 w-5 ${isLight ? "text-yellow-600" : "text-purple-300"}`} />
                              ) : (
                                <Target className={`h-5 w-5 ${isLight ? "text-green-600" : "text-pink-300"}`} />
                              )}
                            </div>

                            <div className="min-w-0 flex-1">
                              <h4
                                className={`truncate font-medium ${
                                  isLight ? "text-gray-900" : "text-white"
                                }`}
                              >
                                {entry.title}
                              </h4>
                              <div className="mt-1 flex items-center gap-2">
                                <Clock className="h-3 w-3 text-gray-400" />
                                <span className={`text-xs ${isLight ? "text-gray-500" : "text-gray-400"}`}>
                                  {getTimeAgo(entry.completedAt)}
                                </span>
                              </div>
                            </div>

                            <ChevronRight className={`h-4 w-4 flex-shrink-0 transition-transform group-hover:translate-x-0.5 ${
                              isLight ? "text-gray-400" : "text-gray-500"
                            }`} />
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>

                    {filteredEntries.length === 0 && (
                      <div className="py-8 text-center">
                        <Search className={`mx-auto h-8 w-8 ${isLight ? "text-gray-400" : "text-gray-500"}`} />
                        <p className={`mt-2 text-sm ${isLight ? "text-gray-500" : "text-gray-400"}`}>
                          No matching entries found
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Content - Fixed Height with Scroll */}
            <div className="flex-1 min-w-0">
              <div className="h-[calc(100vh-140px)] sticky top-6">
                <AnimatePresence mode="wait">
                  {selectedEntry ? (
                    <motion.div
                      key={selectedEntry.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.2 }}
                      className={`h-full rounded-2xl border flex flex-col ${
                        isLight ? "border-gray-200 bg-white/80 backdrop-blur-sm" : "border-white/10 bg-[#0d0d12]/80 backdrop-blur-sm"
                      }`}
                    >
                      {/* Entry Header - Fixed */}
                      <div className={`flex-shrink-0 border-b p-6 ${isLight ? "border-gray-200" : "border-white/10"}`}>
                        <div className="flex flex-wrap items-start justify-between gap-4">
                          <div className="flex items-start gap-4">
                            <div
                              className={`flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl ${
                                selectedEntry.type === "course_completion"
                                  ? isLight
                                    ? "bg-yellow-100"
                                    : "bg-purple-500/20"
                                  : isLight
                                  ? "bg-green-100"
                                  : "bg-pink-500/20"
                              }`}
                            >
                              {selectedEntry.type === "course_completion" ? (
                                <Trophy className={`h-7 w-7 ${isLight ? "text-yellow-600" : "text-purple-300"}`} />
                              ) : (
                                <Target className={`h-7 w-7 ${isLight ? "text-green-600" : "text-pink-300"}`} />
                              )}
                            </div>

                            <div>
                              <div className="mb-1 flex items-center gap-2">
                                <span className={`text-xs font-medium uppercase tracking-wider ${
                                  selectedEntry.type === "course_completion"
                                    ? "text-purple-500"
                                    : "text-pink-500"
                                }`}>
                                  {selectedEntry.type === "course_completion" ? "Course Completed" : "Topic Mastered"}
                                </span>
                              </div>
                              <h2 className={`text-xl font-bold ${
                                isLight ? "text-gray-900" : "text-white"
                              }`}>
                                {selectedEntry.title}
                              </h2>
                              <div className="mt-2 flex flex-wrap items-center gap-3">
                                <div className="flex items-center gap-1.5">
                                  <Calendar className="h-4 w-4 text-gray-400" />
                                  <span className={`text-sm ${isLight ? "text-gray-500" : "text-gray-400"}`}>
                                    {formatDate(selectedEntry.completedAt)}
                                  </span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                  <Clock className="h-4 w-4 text-gray-400" />
                                  <span className={`text-sm ${isLight ? "text-gray-500" : "text-gray-400"}`}>
                                    {getTimeAgo(selectedEntry.completedAt)}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="flex gap-2">
                            {selectedEntry.noteContent && (
                              <button
                                onClick={() => handleDownloadNote(selectedEntry)}
                                disabled={isDownloading === selectedEntry.id}
                                className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all ${
                                  isLight
                                    ? "border border-purple-200 bg-purple-50 text-purple-700 hover:bg-purple-100"
                                    : "border border-purple-500/30 bg-purple-500/10 text-purple-300 hover:bg-purple-500/20"
                                }`}
                              >
                                {isDownloading === selectedEntry.id ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  <Download className="h-4 w-4" />
                                )}
                                Export
                              </button>
                            )}

                            <button
                              onClick={() => setShowDeleteConfirm(selectedEntry.id)}
                              className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all ${
                                isLight
                                  ? "border border-red-200 bg-red-50 text-red-600 hover:bg-red-100"
                                  : "border border-red-500/30 bg-red-500/10 text-red-400 hover:bg-red-500/20"
                              }`}
                            >
                              <Trash2 className="h-4 w-4" />
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Entry Content - Scrollable */}
                      <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
                        {selectedEntry.noteContent && (
                          <div className="space-y-6">
                            {/* Description */}
                            {selectedEntry.noteContent.description && (
                              <div className={`rounded-xl p-4 ${
                                isLight ? "bg-gray-50" : "bg-white/5"
                              }`}>
                                <div className="mb-2 flex items-center gap-2">
                                  <FileText className="h-4 w-4 text-purple-400" />
                                  <h3 className="font-semibold">Overview</h3>
                                </div>
                                <p className={`${isLight ? "text-gray-700" : "text-gray-300"}`}>
                                  {selectedEntry.noteContent.description}
                                </p>
                              </div>
                            )}

                            {/* Content List */}
                            {selectedEntry.noteContent.content && selectedEntry.noteContent.content.length > 0 && (
                              <div>
                                <div className="mb-3 flex items-center gap-2">
                                  <BookOpen className="h-4 w-4 text-purple-400" />
                                  <h3 className="font-semibold">What You Learned</h3>
                                </div>
                                <div className="space-y-2">
                                  {selectedEntry.noteContent.content.map((item, index) => (
                                    <div key={index} className="flex items-start gap-2 rounded-lg p-2">
                                      <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-500" />
                                      <span className={`text-sm ${isLight ? "text-gray-700" : "text-gray-300"}`}>
                                        {item}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Code Example */}
                            {selectedEntry.noteContent.example?.code && (
                              <div>
                                <div className="mb-3 flex items-center gap-2">
                                  <Code2 className="h-4 w-4 text-purple-400" />
                                  <h3 className="font-semibold">Code Example</h3>
                                </div>
                                <div className={`overflow-x-auto rounded-xl p-4 ${
                                  isLight ? "bg-gray-900" : "bg-black/50"
                                }`}>
                                  <pre className="text-sm text-gray-100">
                                    <code>{selectedEntry.noteContent.example.code}</code>
                                  </pre>
                                </div>
                                {selectedEntry.noteContent.example.explanation && (
                                  <p className={`mt-2 text-sm ${isLight ? "text-gray-500" : "text-gray-400"}`}>
                                    {selectedEntry.noteContent.example.explanation}
                                  </p>
                                )}
                              </div>
                            )}

                            {/* Common Mistake */}
                            {selectedEntry.noteContent.commonMistake && (
                              <div className={`rounded-xl border-l-4 border-red-500 p-4 ${
                                isLight ? "bg-red-50" : "bg-red-500/10"
                              }`}>
                                <div className="flex items-center gap-2">
                                  <AlertCircle className="h-4 w-4 text-red-500" />
                                  <h3 className="font-semibold text-red-600 dark:text-red-400">Common Mistake to Avoid</h3>
                                </div>
                                <p className={`mt-1 text-sm ${isLight ? "text-red-700" : "text-red-300"}`}>
                                  {selectedEntry.noteContent.commonMistake}
                                </p>
                              </div>
                            )}

                            {/* Key Takeaways */}
                            {selectedEntry.noteContent.keyTakeaways && selectedEntry.noteContent.keyTakeaways.length > 0 && (
                              <div>
                                <div className="mb-3 flex items-center gap-2">
                                  <Lightbulb className="h-4 w-4 text-yellow-500" />
                                  <h3 className="font-semibold">Key Takeaways</h3>
                                </div>
                                <div className="space-y-2">
                                  {selectedEntry.noteContent.keyTakeaways.map((takeaway, index) => (
                                    <div key={index} className="flex items-start gap-2 rounded-lg p-2">
                                      <Sparkles className="mt-0.5 h-4 w-4 flex-shrink-0 text-yellow-500" />
                                      <span className={`text-sm ${isLight ? "text-gray-700" : "text-gray-300"}`}>
                                        {takeaway}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className={`h-full flex flex-col items-center justify-center rounded-2xl border p-12 text-center ${
                        isLight ? "border-gray-200 bg-white/80" : "border-white/10 bg-[#0d0d12]/80"
                      }`}
                    >
                      <BookOpen className={`mb-4 h-16 w-16 ${isLight ? "text-gray-400" : "text-gray-500"}`} />
                      <h3 className={`mb-2 text-xl font-semibold ${isLight ? "text-gray-900" : "text-white"}`}>
                        Select an entry
                      </h3>
                      <p className={`${isLight ? "text-gray-500" : "text-gray-400"}`}>
                        Click on any achievement from your journal to view detailed notes
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
            onClick={() => setShowDeleteConfirm(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className={`relative w-full max-w-md rounded-2xl p-6 ${
                isLight ? "bg-white" : "bg-[#0d0d12]"
              }`}
            >
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-500/10">
                  <AlertCircle className="h-6 w-6 text-red-500" />
                </div>
                <div>
                  <h3 className={`text-lg font-semibold ${isLight ? "text-gray-900" : "text-white"}`}>
                    Delete Journal Entry
                  </h3>
                  <p className={`text-sm ${isLight ? "text-gray-500" : "text-gray-400"}`}>
                    This action cannot be undone
                  </p>
                </div>
              </div>
              <p className={`mb-6 ${isLight ? "text-gray-700" : "text-gray-300"}`}>
                Are you sure you want to delete "{journalEntries.find(e => e.id === showDeleteConfirm)?.title}"?
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(null)}
                  className={`flex-1 rounded-xl px-4 py-2 font-medium transition-all ${
                    isLight
                      ? "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                      : "border border-white/10 bg-white/5 text-gray-300 hover:bg-white/10"
                  }`}
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDeleteEntry(showDeleteConfirm)}
                  disabled={isDeleting === showDeleteConfirm}
                  className="flex-1 rounded-xl bg-gradient-to-r from-red-500 to-pink-500 px-4 py-2 font-medium text-white transition-all hover:from-red-600 hover:to-pink-600 disabled:opacity-50"
                >
                  {isDeleting === showDeleteConfirm ? (
                    <Loader2 className="mx-auto h-5 w-5 animate-spin" />
                  ) : (
                    "Delete"
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(139, 92, 246, 0.3);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(139, 92, 246, 0.5);
        }
      `}</style>
    </div>
  );
}