"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom";
import { useTheme } from "@/app/context/ThemeContext";
import { Flag, X, Search, User } from "lucide-react";

interface ReportButtonProps {
  type: "challenge" | "user" | "submission";
  targetId: number;
  targetLabel?: string;
}

interface UserSearchResult {
  id: string;
  username: string;
  profile_pic?: string;
}

export function ReportButton({ type, targetId, targetLabel }: ReportButtonProps) {
  const { theme } = useTheme();
  const isLight = theme === "light";

  const [mounted, setMounted] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const [customReason, setCustomReason] = useState("");
  const [reporting, setReporting] = useState(false);
  const [reportSent, setReportSent] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<UserSearchResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserSearchResult | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    if (showModal) {
      const previousOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";

      return () => {
        document.body.style.overflow = previousOverflow;
      };
    }
  }, [showModal, mounted]);

  const handleReport = async () => {
    if (!reportReason.trim()) return;
    if (type === "user" && !targetLabel && !selectedUser) return;

    setReporting(true);

    const finalReason =
      reportReason === "Other (specify below)" && customReason.trim()
        ? `Other: ${customReason}`
        : reportReason;

    const finalTargetId = selectedUser ? parseInt(selectedUser.id, 10) : targetId;
    const finalType = selectedUser ? "user" : type;
    const finalTargetUsername = selectedUser ? selectedUser.username : targetLabel;

    try {
      const token = localStorage.getItem("terminal_token");

      await fetch("/api/report", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          type: finalType,
          targetId: finalTargetId,
          targetUsername: finalTargetUsername,
          reason: finalReason,
        }),
      });

      setReportSent(true);

      setTimeout(() => {
        setShowModal(false);
        setReportSent(false);
        setReportReason("");
        setCustomReason("");
        setSearchQuery("");
        setSearchResults([]);
        setSelectedUser(null);
        setExpanded(false);
      }, 2000);
    } catch (err) {
      console.error("Report failed:", err);
    } finally {
      setReporting(false);
    }
  };

  const searchUsers = async (query: string) => {
    if (query.length < 2) {
      setSearchResults([]);
      return;
    }

    setSearching(true);

    try {
      const token = localStorage.getItem("terminal_token");
      const res = await fetch(`/api/users/search?q=${encodeURIComponent(query)}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        const data = await res.json();
        setSearchResults(data.slice(0, 5));
      }
    } catch (err) {
      console.error("Search failed:", err);
    } finally {
      setSearching(false);
    }
  };

  const handleSelectUser = (user: UserSearchResult) => {
    setSelectedUser(user);
    setSearchQuery(user.username);
    setSearchResults([]);
  };

  const reportOptions =
    type === "challenge"
      ? [
          "Inappropriate content",
          "Incorrect problem statement",
          "Test cases are wrong",
          "Duplicate challenge",
          "Spam or misleading",
          "Other",
        ]
      : type === "user"
      ? [
          "Harassment or bullying",
          "Fake account",
          "Inappropriate profile",
          "Spam",
          "Impersonation",
          "Other (specify below)",
        ]
      : ["Suspicious code", "Plagiarism", "Cheating", "Other"];

  const resetModalState = () => {
    setShowModal(false);
    setReportReason("");
    setCustomReason("");
    setSearchQuery("");
    setSearchResults([]);
    setSelectedUser(null);
    setReportSent(false);
  };

  const modalContent = (
    <AnimatePresence>
      {showModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999]"
        >
          <div
            className="absolute inset-0 bg-black/45"
            onClick={resetModalState}
          />

          <div className="absolute inset-0 flex items-end justify-end p-4 sm:p-6">
            <motion.div
              initial={{ scale: 0.95, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 20, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className={`relative w-full max-w-sm rounded-2xl border p-5 shadow-2xl ${
                isLight ? "border-gray-200 bg-white" : "border-white/10 bg-[#0d0d0d]"
              }`}
              onClick={(e) => e.stopPropagation()}
            >
              {reportSent ? (
                <div className="py-8 text-center">
                  <div
                    className={`mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full ${
                      isLight ? "bg-green-100" : "bg-green-500/20"
                    }`}
                  >
                    <Flag
                      className={
                        isLight
                          ? "h-8 w-8 text-green-600"
                          : "h-8 w-8 text-green-500"
                      }
                    />
                  </div>

                  <h3
                    className={`text-xl font-bold ${
                      isLight ? "text-gray-900" : "text-white"
                    }`}
                  >
                    Report Submitted
                  </h3>

                  <p
                    className={`mt-2 text-sm ${
                      isLight ? "text-gray-500" : "text-gray-400"
                    }`}
                  >
                    Thank you for helping keep our community safe.
                  </p>
                </div>
              ) : (
                <>
                  <div className="mb-4 flex items-center justify-between">
                    <h3
                      className={`text-lg font-bold ${
                        isLight ? "text-gray-900" : "text-white"
                      }`}
                    >
                      Report{" "}
                      {type === "challenge"
                        ? "Challenge"
                        : type === "user"
                        ? "User"
                        : "Submission"}
                    </h3>

                    <button
                      onClick={resetModalState}
                      className={`rounded-lg p-1 transition ${
                        isLight ? "hover:bg-gray-100" : "hover:bg-white/10"
                      }`}
                    >
                      <X
                        className={
                          isLight
                            ? "h-5 w-5 text-gray-500"
                            : "h-5 w-5 text-gray-400"
                        }
                      />
                    </button>
                  </div>

                  {type === "user" && !targetLabel && (
                    <div className="mb-4">
                      <p
                        className={`mb-2 text-xs ${
                          isLight ? "text-gray-500" : "text-gray-500"
                        }`}
                      >
                        Search for user to report:
                      </p>

                      <div className="relative">
                        <Search
                          className={`absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 ${
                            isLight ? "text-gray-400" : "text-gray-500"
                          }`}
                        />

                        <input
                          type="text"
                          placeholder="Search by username..."
                          value={searchQuery}
                          onChange={(e) => {
                            setSearchQuery(e.target.value);
                            searchUsers(e.target.value);
                          }}
                          className={`w-full rounded-xl border py-3 pl-10 pr-4 text-sm ${
                            isLight
                              ? "border-gray-200 bg-gray-50 text-gray-900 placeholder:text-gray-400"
                              : "border-white/10 bg-white/5 text-white placeholder:text-gray-500"
                          }`}
                        />
                      </div>

                      {searchResults.length > 0 && (
                        <div
                          className={`mt-2 rounded-xl border ${
                            isLight
                              ? "border-gray-200 bg-white"
                              : "border-white/10 bg-[#0d0d0d]"
                          }`}
                        >
                          {searchResults.map((user) => (
                            <button
                              key={user.id}
                              onClick={() => handleSelectUser(user)}
                              className={`flex w-full items-center gap-3 px-4 py-3 text-sm transition ${
                                isLight ? "hover:bg-gray-50" : "hover:bg-white/10"
                              }`}
                            >
                              <div
                                className={`flex h-8 w-8 items-center justify-center rounded-lg ${
                                  isLight ? "bg-gray-100" : "bg-white/10"
                                }`}
                              >
                                <User
                                  className={`h-4 w-4 ${
                                    isLight ? "text-gray-600" : "text-gray-400"
                                  }`}
                                />
                              </div>

                              <span
                                className={isLight ? "text-gray-900" : "text-white"}
                              >
                                {user.username}
                              </span>
                            </button>
                          ))}
                        </div>
                      )}

                      {searching && (
                        <p
                          className={`mt-2 text-xs ${
                            isLight ? "text-gray-500" : "text-gray-500"
                          }`}
                        >
                          Searching...
                        </p>
                      )}
                    </div>
                  )}

                  {targetLabel && (
                    <div
                      className={`mb-4 rounded-xl border p-3 ${
                        isLight
                          ? "border-gray-200 bg-gray-50"
                          : "border-white/10 bg-white/[0.03]"
                      }`}
                    >
                      <p
                        className={`text-xs ${
                          isLight ? "text-gray-500" : "text-gray-500"
                        }`}
                      >
                        Reporting:
                      </p>
                      <p
                        className={`text-sm font-medium ${
                          isLight ? "text-gray-900" : "text-white"
                        }`}
                      >
                        {targetLabel}
                      </p>
                    </div>
                  )}

                  {(targetLabel || selectedUser) && (
                    <>
                      <p
                        className={`mb-4 text-sm ${
                          isLight ? "text-gray-600" : "text-gray-400"
                        }`}
                      >
                        Why are you reporting this?
                      </p>

                      <div className="mb-6 space-y-2">
                        {reportOptions.map((reason) => (
                          <label
                            key={reason}
                            className={`flex cursor-pointer items-center gap-3 rounded-xl border p-3 transition ${
                              reportReason === reason
                                ? isLight
                                  ? "border-pink-500 bg-pink-50"
                                  : "border-pink-500/50 bg-pink-500/10"
                                : isLight
                                ? "border-gray-200 hover:border-gray-300"
                                : "border-white/10 hover:border-white/20"
                            }`}
                          >
                            <input
                              type="radio"
                              name="reportReason"
                              value={reason}
                              checked={reportReason === reason}
                              onChange={(e) => setReportReason(e.target.value)}
                              className="sr-only"
                            />

                            <div
                              className={`flex h-4 w-4 items-center justify-center rounded-full border ${
                                reportReason === reason
                                  ? "border-pink-500 bg-pink-500"
                                  : isLight
                                  ? "border-gray-300"
                                  : "border-white/30"
                              }`}
                            >
                              {reportReason === reason && (
                                <div className="h-2 w-2 rounded-full bg-white" />
                              )}
                            </div>

                            <span
                              className={`text-sm ${
                                isLight ? "text-gray-700" : "text-gray-300"
                              }`}
                            >
                              {reason}
                            </span>
                          </label>
                        ))}
                      </div>

                      {reportReason === "Other (specify below)" && (
                        <div className="mt-3">
                          <input
                            type="text"
                            placeholder="Please specify the reason..."
                            value={customReason}
                            onChange={(e) => setCustomReason(e.target.value)}
                            className={`w-full rounded-xl border px-4 py-3 text-sm ${
                              isLight
                                ? "border-gray-200 bg-gray-50 text-gray-900 placeholder:text-gray-400"
                                : "border-white/10 bg-white/5 text-white placeholder:text-gray-500"
                            }`}
                          />
                        </div>
                      )}

                      <button
                        onClick={handleReport}
                        disabled={
                          !reportReason ||
                          (type === "user" && !targetLabel && !selectedUser) ||
                          (reportReason === "Other (specify below)" &&
                            !customReason.trim()) ||
                          reporting
                        }
                        className={`w-full rounded-xl py-3 font-medium transition ${
                          reportReason && !reporting
                            ? "bg-pink-500 text-white hover:bg-pink-600"
                            : isLight
                            ? "bg-gray-200 text-gray-500"
                            : "bg-white/10 text-white/50"
                        }`}
                      >
                        {reporting ? "Submitting..." : "Submit Report"}
                      </button>
                    </>
                  )}
                </>
              )}
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <>
      <motion.button
        initial={false}
        animate={{ scale: expanded ? 0.9 : 1 }}
        onClick={() => setExpanded(true)}
        className={`fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full shadow-lg transition-all hover:scale-110 ${
          isLight
            ? "bg-gray-900 text-white hover:bg-gray-800"
            : "bg-white text-black hover:bg-gray-200"
        }`}
      >
        <Flag className="h-6 w-6" />
      </motion.button>

      <AnimatePresence>
        {expanded && !showModal && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className={`fixed bottom-6 right-20 z-40 rounded-xl border p-4 shadow-lg ${
              isLight ? "border-gray-200 bg-white" : "border-white/10 bg-[#0d0d0d]"
            }`}
          >
            <div className="space-y-2">
              <button
                onClick={() => {
                  setShowModal(true);
                  setExpanded(false);
                }}
                className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm transition ${
                  isLight
                    ? "text-gray-700 hover:bg-gray-100"
                    : "text-gray-300 hover:bg-white/10"
                }`}
              >
                <Flag className="h-4 w-4" />
                Report {type}
              </button>

              <button
                onClick={() => setExpanded(false)}
                className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm transition ${
                  isLight
                    ? "text-gray-500 hover:bg-gray-100"
                    : "text-gray-500 hover:bg-white/10"
                }`}
              >
                <X className="h-4 w-4" />
                Close
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {mounted ? createPortal(modalContent, document.body) : null}
    </>
  );
}