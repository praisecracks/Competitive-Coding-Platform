"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
  const [expanded, setExpanded] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const [reporting, setReporting] = useState(false);
  const [reportSent, setReportSent] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<UserSearchResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserSearchResult | null>(null);

  const handleReport = async () => {
    if (!reportReason.trim()) return;
    if (type === "user" && !targetLabel && !selectedUser) return;
    setReporting(true);
    const finalReason = reportReason === "Other (specify below)" && customReason.trim() 
      ? `Other: ${customReason}` 
      : reportReason;
    const finalTargetId = selectedUser ? parseInt(selectedUser.id) : targetId;
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
      : [
          "Suspicious code",
          "Plagiarism",
          "Cheating",
          "Other",
        ];

  const [customReason, setCustomReason] = useState("");

  return (
    <>
      {/* Floating Button */}
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

      {/* Expandable Panel */}
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

      {/* Report Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          >
            <div
              className={`absolute inset-0 ${isLight ? "bg-gray-900/50" : "bg-black/80"}`}
              onClick={() => setShowModal(false)}
            />
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className={`relative w-full max-w-md rounded-2xl border p-6 shadow-2xl ${
                isLight ? "border-gray-200 bg-white" : "border-white/10 bg-[#0d0d0d]"
              }`}
            >
              {reportSent ? (
                <div className="text-center py-8">
                  <div
                    className={`mx-auto h-16 w-16 rounded-full flex items-center justify-center mb-4 ${
                      isLight ? "bg-green-100" : "bg-green-500/20"
                    }`}
                  >
                    <Flag className={isLight ? "h-8 w-8 text-green-600" : "h-8 w-8 text-green-500"} />
                  </div>
                  <h3 className={`text-xl font-bold ${isLight ? "text-gray-900" : "text-white"}`}>
                    Report Submitted
                  </h3>
                  <p className={`mt-2 text-sm ${isLight ? "text-gray-500" : "text-gray-400"}`}>
                    Thank you for helping keep our community safe.
                  </p>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className={`text-lg font-bold ${isLight ? "text-gray-900" : "text-white"}`}>
                      Report {type === "challenge" ? "Challenge" : type === "user" ? "User" : "Submission"}
                    </h3>
                    <button
                      onClick={() => setShowModal(false)}
                      className={`p-1 rounded-lg transition ${
                        isLight ? "hover:bg-gray-100" : "hover:bg-white/10"
                      }`}
                    >
                      <X className={isLight ? "h-5 w-5 text-gray-500" : "h-5 w-5 text-gray-400"} />
                    </button>
                  </div>

                  {/* User search - show if no targetLabel provided (report any user) */}
                  {type === "user" && !targetLabel && (
                    <div className="mb-4">
                      <p className={`text-xs mb-2 ${isLight ? "text-gray-500" : "text-gray-500"}`}>
                        Search for user to report:
                      </p>
                      <div className="relative">
                        <Search className={`absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 ${isLight ? "text-gray-400" : "text-gray-500"}`} />
                        <input
                          type="text"
                          placeholder="Search by username..."
                          value={searchQuery}
                          onChange={(e) => {
                            setSearchQuery(e.target.value);
                            searchUsers(e.target.value);
                          }}
                          className={`w-full rounded-xl border pl-10 pr-4 py-3 text-sm ${
                            isLight 
                              ? "border-gray-200 bg-gray-50 text-gray-900 placeholder:text-gray-400" 
                              : "border-white/10 bg-white/5 text-white placeholder:text-gray-500"
                          }`}
                        />
                      </div>
                      {searchResults.length > 0 && (
                        <div className={`mt-2 rounded-xl border ${
                          isLight ? "border-gray-200 bg-white" : "border-white/10 bg-[#0d0d0d]"
                        }`}>
                          {searchResults.map((user) => (
                            <button
                              key={user.id}
                              onClick={() => handleSelectUser(user)}
                              className={`w-full flex items-center gap-3 px-4 py-3 text-sm transition ${
                                isLight ? "hover:bg-gray-50" : "hover:bg-white/10"
                              }`}
                            >
                              <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${
                                isLight ? "bg-gray-100" : "bg-white/10"
                              }`}>
                                <User className={`h-4 w-4 ${isLight ? "text-gray-600" : "text-gray-400"}`} />
                              </div>
                              <span className={isLight ? "text-gray-900" : "text-white"}>{user.username}</span>
                            </button>
                          ))}
                        </div>
                      )}
                      {searching && (
                        <p className={`text-xs mt-2 ${isLight ? "text-gray-500" : "text-gray-500"}`}>Searching...</p>
                      )}
                    </div>
                  )}

                  {targetLabel && (
                    <div className={`mb-4 p-3 rounded-xl border ${
                      isLight ? "border-gray-200 bg-gray-50" : "border-white/10 bg-white/[0.03]"
                    }`}>
                      <p className={`text-xs ${isLight ? "text-gray-500" : "text-gray-500"}`}>Reporting:</p>
                      <p className={`text-sm font-medium ${isLight ? "text-gray-900" : "text-white"}`}>{targetLabel}</p>
                    </div>
)}

                  {(targetLabel || selectedUser) && (
                    <>
                      <p className={`text-sm mb-4 ${isLight ? "text-gray-600" : "text-gray-400"}`}>
                        Why are you reporting this?
                      </p>

                      <div className="space-y-2 mb-6">
                        {reportOptions.map((reason) => (
                          <label
                            key={reason}
                            className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition ${
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
                              className={`h-4 w-4 rounded-full border flex items-center justify-center ${
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
                            <span className={`text-sm ${isLight ? "text-gray-700" : "text-gray-300"}`}>
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
                        disabled={!reportReason || (type === "user" && !targetLabel && !selectedUser) || (reportReason === "Other (specify below)" && !customReason.trim()) || reporting}
                        className={`w-full py-3 rounded-xl font-medium transition ${
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
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}