"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Calendar,
  BookOpen,
  Download,
  Trash2,
  Trophy,
  Target,
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

  useEffect(() => {
    const journalKey = getUserJournalKey();
    const savedJournal = localStorage.getItem(journalKey);

    if (savedJournal) {
      try {
        const parsed: JournalEntry[] = JSON.parse(savedJournal);
        setJournalEntries(parsed);
        if (parsed.length > 0) {
          setSelectedEntry(parsed[0]);
        }
      } catch (error) {
        console.error("Failed to parse learning journal", error);
      }
    }
  }, []);

  const handleDownloadNote = async (entry: JournalEntry) => {
    if (!entry.noteContent) return;

    const safeCourse = entry.noteContent.courseTitle
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

    const timestamp = new Date().toISOString().split("T")[0];

    let htmlContent = `
      <div style="font-family: 'Segoe UI', system-ui, sans-serif; max-width: 800px; margin: 0 auto; padding: 40px; color: #1a1a2e; background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);">
        <div style="text-align: center; margin-bottom: 30px; padding-bottom: 20px; border-bottom: 2px solid #6366f1;">
          <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cdefs%3E%3ClinearGradient id='grad' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%236366f1'/%3E%3Cstop offset='100%25' style='stop-color:%23ec4899'/%3E%3C/linearGradient%3E%3C/defs%3E%3Ccircle cx='50' cy='50' r='45' fill='url(%23grad)'/%3E%3Ctext x='50' y='65' font-size='40' fill='white' text-anchor='middle' font-family='Arial' font-weight='bold'%3ECM%3C/text%3E%3C/svg%3E" alt="CodeMaster" style="width: 80px; height: 80px; margin-bottom: 15px;" />
          <h1 style="margin: 0; font-size: 28px; color: #1a1a2e;">CODEMASTER</h1>
          <p style="margin: 5px 0 0; color: #6366f1; font-size: 14px; letter-spacing: 3px;">LEARNING JOURNAL</p>
        </div>

        <div style="background: white; border-radius: 16px; padding: 30px; box-shadow: 0 4px 20px rgba(0,0,0,0.08); margin-bottom: 20px;">
          <div style="background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; font-size: 12px; font-weight: 600; letter-spacing: 2px; margin-bottom: 8px;">${
            entry.type === "course_completion"
              ? "COURSE COMPLETED"
              : "TOPIC COMPLETED"
          }</div>
          <h2 style="margin: 0 0 10px; font-size: 22px; color: #1a1a2e;">${
            entry.noteContent.courseTitle
          }</h2>
          <p style="margin: 0; color: #6b7280; font-size: 14px;">Completed on ${new Date(
            entry.completedAt
          ).toLocaleDateString()}</p>
        </div>
    `;

    if (entry.noteContent.description) {
      htmlContent += `
        <div style="background: white; border-radius: 16px; padding: 30px; box-shadow: 0 4px 20px rgba(0,0,0,0.08); margin-bottom: 20px;">
          <div style="color: #6366f1; font-size: 12px; font-weight: 600; letter-spacing: 2px; margin-bottom: 12px;">DESCRIPTION</div>
          <p style="margin: 0; line-height: 1.7; color: #4b5563;">${entry.noteContent.description}</p>
        </div>
      `;
    }

    if (entry.noteContent.content && entry.noteContent.content.length > 0) {
      htmlContent += `
        <div style="background: white; border-radius: 16px; padding: 30px; box-shadow: 0 4px 20px rgba(0,0,0,0.08); margin-bottom: 20px;">
          <div style="color: #6366f1; font-size: 12px; font-weight: 600; letter-spacing: 2px; margin-bottom: 12px;">CONTENT</div>
          <ol style="margin: 0; padding-left: 20px; line-height: 1.8;">
      `;
      entry.noteContent.content.forEach((paragraph) => {
        htmlContent += `<li style="margin-bottom: 10px; color: #4b5563;">${paragraph}</li>`;
      });
      htmlContent += `</ol></div>`;
    }

    if (entry.noteContent.example?.code) {
      htmlContent += `
        <div style="background: white; border-radius: 16px; padding: 30px; box-shadow: 0 4px 20px rgba(0,0,0,0.08); margin-bottom: 20px;">
          <div style="color: #6366f1; font-size: 12px; font-weight: 600; letter-spacing: 2px; margin-bottom: 12px;">CODE EXAMPLE</div>
          <pre style="background: #1e1e2e; color: #a5b4fc; padding: 20px; border-radius: 12px; overflow-x: auto; font-family: 'Fira Code', monospace; font-size: 13px; line-height: 1.6; margin: 15px 0;">${entry.noteContent.example.code}</pre>
        </div>
      `;
    }

    if (entry.noteContent.keyTakeaways && entry.noteContent.keyTakeaways.length > 0) {
      htmlContent += `
        <div style="background: white; border-radius: 16px; padding: 30px; box-shadow: 0 4px 20px rgba(0,0,0,0.08); margin-bottom: 20px;">
          <div style="color: #6366f1; font-size: 12px; font-weight: 600; letter-spacing: 2px; margin-bottom: 12px;">KEY TAKEAWAYS</div>
          <ul style="margin: 0; padding-left: 20px; line-height: 1.8;">
      `;
      entry.noteContent.keyTakeaways.forEach((takeaway) => {
        htmlContent += `<li style="margin-bottom: 8px; color: #059669;">✓ ${takeaway}</li>`;
      });
      htmlContent += `</ul></div>`;
    }

    htmlContent += `
        <div style="text-align: center; padding: 20px; color: #9ca3af; font-size: 12px; border-top: 1px solid #e5e7eb; margin-top: 20px;">
          <p style="margin: 0;">From CodeMaster Learning Journal • ${timestamp}</p>
        </div>
      </div>
    `;

    const container = document.createElement("div");
    container.innerHTML = htmlContent;

    const html2pdf = require("html2pdf.js");
    const pdfOptions = {
      margin: 10,
      filename: `${safeCourse}-journal-${timestamp}.pdf`,
      image: { type: "jpeg" as const, quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: {
        unit: "mm" as const,
        format: "a4" as const,
        orientation: "portrait" as const,
      },
    };

    await html2pdf().set(pdfOptions).from(container).save();
  };

  const handleDeleteEntry = (entryId: string) => {
    const updatedEntries = journalEntries.filter((entry) => entry.id !== entryId);
    setJournalEntries(updatedEntries);
    const journalKey = getUserJournalKey();
    localStorage.setItem(
      journalKey,
      JSON.stringify(updatedEntries)
    );

    if (selectedEntry?.id === entryId) {
      setSelectedEntry(updatedEntries[0] || null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div
      className={`min-h-screen ${
        isLight
          ? "bg-gray-50"
          : "bg-[radial-gradient(circle_at_top,rgba(236,72,153,0.08),transparent_22%),radial-gradient(circle_at_right,rgba(168,85,247,0.08),transparent_18%),#050505]"
      }`}
    >
      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
        <div className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-center">
          <button
            onClick={() => router.back()}
            className={`inline-flex w-fit items-center gap-2 rounded-lg px-4 py-2 transition-colors ${
              isLight
                ? "text-gray-600 hover:bg-gray-100"
                : "text-gray-300 hover:bg-white/[0.05]"
            }`}
          >
            <ArrowLeft className="h-5 w-5" />
            Back
          </button>

          <div>
            <h1
              className={`text-2xl font-bold sm:text-3xl ${
                isLight ? "text-gray-900" : "text-white"
              }`}
            >
              Learning Journal
            </h1>
            <p className={`mt-2 text-sm sm:text-base ${isLight ? "text-gray-600" : "text-gray-400"}`}>
              Your coding achievements and progress
            </p>
          </div>
        </div>

        {journalEntries.length === 0 ? (
          <div className={`py-16 text-center ${isLight ? "text-gray-500" : "text-gray-400"}`}>
            <BookOpen className="mx-auto mb-4 h-16 w-16 opacity-50" />
            <h3 className="mb-2 text-xl font-semibold">No entries yet</h3>
            <p>Complete topics and courses to start building your learning journal</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 lg:gap-8 lg:items-start">
            <div className="lg:col-span-1">
              <div
                className={`rounded-xl border p-4 sm:p-6 ${
                  isLight ? "border-gray-200 bg-white" : "border-white/10 bg-[#0d0d12]"
                }`}
              >
                <h2
                  className={`mb-4 text-lg font-semibold sm:text-xl ${
                    isLight ? "text-gray-900" : "text-white"
                  }`}
                >
                  Your Achievements
                </h2>

                <div className="space-y-3">
                  {journalEntries.map((entry) => (
                    <div
                      key={entry.id}
                      onClick={() => setSelectedEntry(entry)}
                      className={`cursor-pointer rounded-lg border p-4 transition-all ${
                        selectedEntry?.id === entry.id
                          ? isLight
                            ? "border-pink-200 bg-pink-50"
                            : "border-pink-500/20 bg-gradient-to-r from-pink-500/10 to-purple-500/10"
                          : isLight
                          ? "border-gray-200 bg-gray-50 hover:bg-gray-100"
                          : "border-white/10 bg-[#14141a] hover:bg-[#181820]"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full ${
                            entry.type === "course_completion"
                              ? isLight
                                ? "bg-yellow-100"
                                : "bg-purple-500/15"
                              : isLight
                              ? "bg-green-100"
                              : "bg-pink-500/15"
                          }`}
                        >
                          {entry.type === "course_completion" ? (
                            <Trophy
                              className={`h-5 w-5 ${
                                isLight ? "text-yellow-600" : "text-purple-300"
                              }`}
                            />
                          ) : (
                            <Target
                              className={`h-5 w-5 ${
                                isLight ? "text-green-600" : "text-pink-300"
                              }`}
                            />
                          )}
                        </div>

                        <div className="min-w-0 flex-1">
                          <h3
                            className={`truncate font-medium ${
                              isLight ? "text-gray-900" : "text-white"
                            }`}
                          >
                            {entry.title}
                          </h3>
                          <p
                            className={`mt-1 text-sm ${
                              isLight ? "text-gray-500" : "text-gray-400"
                            }`}
                          >
                            {entry.type === "course_completion" ? "Course" : "Topic"} •{" "}
                            {formatDate(entry.completedAt)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="lg:col-span-2">
              {selectedEntry ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex flex-col rounded-xl border p-4 sm:p-6 ${
                    isLight ? "border-gray-200 bg-white" : "border-white/10 bg-[#0d0d12]"
                  } lg:h-[75vh]`}
                >
                  <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between shrink-0">
                    <div className="flex items-start gap-3">
                      <div
                        className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full ${
                          selectedEntry.type === "course_completion"
                            ? isLight
                              ? "bg-yellow-100"
                              : "bg-purple-500/15"
                            : isLight
                            ? "bg-green-100"
                            : "bg-pink-500/15"
                        }`}
                      >
                        {selectedEntry.type === "course_completion" ? (
                          <Trophy
                            className={`h-6 w-6 ${
                              isLight ? "text-yellow-600" : "text-purple-300"
                            }`}
                          />
                        ) : (
                          <Target
                            className={`h-6 w-6 ${
                              isLight ? "text-green-600" : "text-pink-300"
                            }`}
                          />
                        )}
                      </div>

                      <div className="min-w-0">
                        <h2
                          className={`break-words text-xl font-bold sm:text-2xl ${
                            isLight ? "text-gray-900" : "text-white"
                          }`}
                        >
                          {selectedEntry.title}
                        </h2>
                        <p
                          className={`mt-1 flex flex-wrap items-center gap-2 text-sm ${
                            isLight ? "text-gray-500" : "text-gray-400"
                          }`}
                        >
                          <Calendar className="h-4 w-4" />
                          Completed {formatDate(selectedEntry.completedAt)}
                        </p>
                      </div>
                    </div>

                    <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:flex-wrap">
                      {selectedEntry.noteContent && (
                        <button
                          onClick={() => handleDownloadNote(selectedEntry)}
                          className={`inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 ${
                            isLight
                              ? "text-pink-600 hover:bg-pink-50"
                              : "text-pink-300 hover:bg-pink-500/10"
                          } transition-colors`}
                        >
                          <Download className="h-4 w-4" />
                          Download
                        </button>
                      )}

                      <button
                        onClick={() => handleDeleteEntry(selectedEntry.id)}
                        className={`inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 ${
                          isLight
                            ? "text-red-600 hover:bg-red-50"
                            : "text-red-400 hover:bg-red-500/10"
                        } transition-colors`}
                      >
                        <Trash2 className="h-4 w-4" />
                        Delete
                      </button>
                    </div>
                  </div>

                  <div className="min-h-0 flex-1 overflow-visible lg:overflow-y-auto lg:pr-2">
                    {selectedEntry.noteContent && (
                      <div className="space-y-6">
                        {selectedEntry.noteContent.description && (
                          <div>
                            <h3
                              className={`mb-2 text-lg font-semibold ${
                                isLight ? "text-gray-900" : "text-white"
                              }`}
                            >
                              Description
                            </h3>
                            <p className={`${isLight ? "text-gray-700" : "text-gray-300"}`}>
                              {selectedEntry.noteContent.description}
                            </p>
                          </div>
                        )}

                        {selectedEntry.noteContent.content &&
                          selectedEntry.noteContent.content.length > 0 && (
                            <div>
                              <h3
                                className={`mb-2 text-lg font-semibold ${
                                  isLight ? "text-gray-900" : "text-white"
                                }`}
                              >
                                Content
                              </h3>
                              <ol
                                className={`list-inside list-decimal space-y-2 ${
                                  isLight ? "text-gray-700" : "text-gray-300"
                                }`}
                              >
                                {selectedEntry.noteContent.content.map((item, index) => (
                                  <li key={index}>{item}</li>
                                ))}
                              </ol>
                            </div>
                          )}

                        {selectedEntry.noteContent.example?.code && (
                          <div>
                            <h3
                              className={`mb-2 text-lg font-semibold ${
                                isLight ? "text-gray-900" : "text-white"
                              }`}
                            >
                              Code Example
                            </h3>
                            <pre
                              className={`overflow-x-auto rounded-lg p-4 text-sm ${
                                isLight
                                  ? "bg-gray-100 text-gray-900"
                                  : "border border-white/10 bg-black text-gray-100"
                              }`}
                            >
                              <code>{selectedEntry.noteContent.example.code}</code>
                            </pre>
                          </div>
                        )}

                        {selectedEntry.noteContent.keyTakeaways &&
                          selectedEntry.noteContent.keyTakeaways.length > 0 && (
                            <div>
                              <h3
                                className={`mb-2 text-lg font-semibold ${
                                  isLight ? "text-gray-900" : "text-white"
                                }`}
                              >
                                Key Takeaways
                              </h3>
                              <ul
                                className={`space-y-1 ${
                                  isLight ? "text-gray-700" : "text-gray-300"
                                }`}
                              >
                                {selectedEntry.noteContent.keyTakeaways.map(
                                  (takeaway, index) => (
                                    <li key={index} className="flex items-start gap-2">
                                      <span className="mt-1 text-green-500">✓</span>
                                      {takeaway}
                                    </li>
                                  )
                                )}
                              </ul>
                            </div>
                          )}
                      </div>
                    )}
                  </div>
                </motion.div>
              ) : (
                <div
                  className={`flex flex-col items-center justify-center rounded-xl border p-10 text-center sm:p-12 ${
                    isLight ? "border-gray-200 bg-white" : "border-white/10 bg-[#0d0d12]"
                  } lg:h-[75vh]`}
                >
                  <BookOpen
                    className={`mx-auto mb-4 h-16 w-16 ${
                      isLight ? "text-gray-400" : "text-gray-500"
                    }`}
                  />
                  <h3
                    className={`mb-2 text-xl font-semibold ${
                      isLight ? "text-gray-900" : "text-white"
                    }`}
                  >
                    Select an achievement
                  </h3>
                  <p className={`${isLight ? "text-gray-500" : "text-gray-400"}`}>
                    Click on any entry from your journal to view details
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}