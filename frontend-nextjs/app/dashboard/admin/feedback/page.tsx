"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, Calendar, User, Trash2, Eye, X, ArrowLeft, Search, TrendingUp, CheckCircle } from "lucide-react";
import { useTheme } from "@/app/context/ThemeContext";
import Link from "next/link";

interface FeedbackItem {
  id: string;
  userId: string;
  username: string;
  profilePic: string;
  message: string;
  page: string;
  createdAt: string;
}

export default function FeedbackPage() {
  const { theme } = useTheme();
  const isLight = theme === "light";
  const [feedback, setFeedback] = useState<FeedbackItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedFeedback, setSelectedFeedback] = useState<FeedbackItem | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{ isOpen: boolean; id: string | null }>({ isOpen: false, id: null });
  const [userRole, setUserRole] = useState("user");
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        setUserRole(parsed.role || "user");
      } catch (e) {
        console.error("Failed to parse user role", e);
      }
    }

    if (userRole !== "super_admin") {
      fetchFeedback();
    }
  }, [userRole]);

  const fetchFeedback = async () => {
    try {
      const token = localStorage.getItem("terminal_token");
      const res = await fetch("/api/admin/feedback", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to fetch feedback");
      }

      const data = await res.json();
      setFeedback(data);
    } catch (err: any) {
      setError(err.message || "Failed to load feedback");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirm.id) return;

    try {
      const token = localStorage.getItem("terminal_token");
      const res = await fetch(`/api/admin/feedback/${deleteConfirm.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        setFeedback(feedback.filter((item) => item.id !== deleteConfirm.id));
        if (selectedFeedback?.id === deleteConfirm.id) {
          setSelectedFeedback(null);
        }
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
      }
    } catch (err) {
      console.error("Failed to delete feedback:", err);
    } finally {
      setDeleteConfirm({ isOpen: false, id: null });
    }
  };

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  if (loading) {
    return (
      <div className={`flex min-h-[60vh] items-center justify-center px-4 ${isLight ? "bg-[#f8fafc]" : "bg-[#020202]"}`}>
        <div className={`flex items-center gap-3 rounded-2xl border px-6 py-5 backdrop-blur-md ${
          isLight ? "border-gray-200 bg-white shadow-[0_14px_34px_rgba(15,23,42,0.08)]" : "border-white/5 bg-[#0a0a0a]/50 shadow-2xl"
        }`}>
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-blue-500/20 border-t-blue-500" />
          <span className={`text-sm font-medium ${isLight ? "text-gray-600" : "text-gray-400"}`}>
            Loading Feedback...
          </span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`min-h-[80vh] flex items-center justify-center px-4 ${isLight ? "bg-[#f8fafc]" : "bg-[#020202]"}`}>
        <div className={`w-full max-w-lg rounded-3xl border p-8 text-center backdrop-blur-xl ${
          isLight ? "border-red-200 bg-white shadow-[0_18px_40px_rgba(15,23,42,0.08)]" : "border-red-500/10 bg-red-500/5"
        }`}>
          <div className={`mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl ${
            isLight ? "bg-red-50 text-red-500" : "bg-red-500/10 text-red-500"
          }`}>
            <TrendingUp className="h-8 w-8" />
          </div>
          <h1 className={`mb-3 text-2xl font-bold ${isLight ? "text-gray-900" : "text-white"}`}>
            Access Denied
          </h1>
          <p className={`mb-8 leading-relaxed ${isLight ? "text-gray-600" : "text-gray-400"}`}>
            {error}
          </p>
          <Link href="/dashboard" className={`inline-flex items-center gap-2 rounded-2xl px-8 py-3.5 text-sm font-semibold transition active:scale-95 ${
            isLight ? "bg-gray-900 text-white hover:bg-black" : "bg-white text-black hover:bg-gray-200"
          }`}>
            <ArrowLeft className="h-4 w-4" />
            Return to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen pb-20 selection:bg-blue-500/30 ${isLight ? "bg-[#f8fafc] text-gray-900" : "text-white"}`}>
      {/* Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className={`absolute top-[-20%] left-[-10%] h-[50%] w-[50%] rounded-full blur-[150px] opacity-40 animate-pulse ${
          isLight ? "bg-blue-500/8" : "bg-blue-500/10"
        }`} />
        <div className={`absolute bottom-[-20%] right-[-10%] h-[50%] w-[50%] rounded-full blur-[150px] opacity-40 animate-pulse ${
          isLight ? "bg-purple-500/8" : "bg-purple-500/10"
        }`} style={{ animationDelay: "1s" }} />
      </div>

      {/* Success Toast */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-20 right-6 z-50 flex items-center gap-2 rounded-lg px-4 py-2 shadow-lg"
            style={{
              backgroundColor: isLight ? "#10b981" : "#059669",
              color: "white"
            }}
          >
            <CheckCircle className="h-5 w-5" />
            <span className="text-sm font-medium">Feedback deleted successfully!</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative z-10 mx-auto max-w-7xl space-y-8 px-4">
        {/* Header */}
        <header className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard/admin" className={`flex h-10 w-10 items-center justify-center rounded-xl border transition-all ${
              isLight ? "border-gray-200 bg-white hover:bg-gray-100" : "border-white/10 bg-white/5 hover:bg-white/10"
            }`}>
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div className="space-y-1.5">
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-wider backdrop-blur-sm ${
                isLight ? "border-blue-200 bg-blue-50 text-blue-600" : "border-blue-500/20 bg-blue-500/5 text-blue-400"
              }`}>
                <MessageCircle className="h-2.5 w-2.5" />
                User Feedback
              </motion.div>
              <motion.h1 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`text-2xl font-bold tracking-tight lg:text-3xl ${
                isLight ? "text-gray-900" : "text-white"
              }`}>
                Feedback Management
              </motion.h1>
              <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className={`text-xs font-medium ${
                isLight ? "text-gray-500" : "text-gray-400"
              }`}>
                View and manage user feedback to improve the platform
              </motion.p>
            </div>
          </div>

          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className={`flex items-center gap-2 rounded-xl border px-4 py-2 ${
            isLight ? "border-gray-200 bg-white shadow-sm" : "border-white/5 bg-white/[0.02]"
          }`}>
            <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${
              isLight ? "bg-blue-50 text-blue-600" : "bg-blue-500/10 text-blue-400"
            }`}>
              <MessageCircle className="h-4 w-4" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Total Feedback</span>
              <span className={`text-lg font-black ${isLight ? "text-gray-900" : "text-white"}`}>{feedback.length}</span>
            </div>
          </motion.div>
        </header>

        {/* Feedback List */}
        {feedback.length === 0 ? (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className={`flex flex-col items-center justify-center rounded-2xl border p-12 text-center ${
            isLight ? "border-dashed border-gray-200 bg-white" : "border-dashed border-white/10 bg-white/[0.02]"
          }`}>
            <div className={`mb-4 flex h-16 w-16 items-center justify-center rounded-2xl ${
              isLight ? "bg-gray-100 text-gray-400" : "bg-white/5 text-gray-600"
            }`}>
              <MessageCircle className="h-8 w-8" />
            </div>
            <h3 className={`mb-2 text-lg font-bold ${isLight ? "text-gray-900" : "text-white"}`}>No feedback yet</h3>
            <p className={`text-sm ${isLight ? "text-gray-500" : "text-gray-400"}`}>
              User feedback will appear here when they submit it from the app
            </p>
          </motion.div>
        ) : (
          <div className="space-y-3">
            {feedback.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`group relative flex items-start gap-4 rounded-xl border p-4 transition-all hover:shadow-lg ${
                  isLight ? "border-gray-200 bg-white hover:border-gray-300" : "border-white/5 bg-white/[0.02] hover:border-white/10 hover:bg-white/[0.04]"
                }`}
              >
                {/* User Avatar */}
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border ${
                  isLight ? "border-gray-200 bg-gray-100" : "border-white/10 bg-white/5"
                }`}>
                  {item.profilePic ? (
                    <img src={item.profilePic} alt={item.username} className="h-full w-full rounded-full object-cover" />
                  ) : (
                    <User className={`h-5 w-5 ${isLight ? "text-gray-400" : "text-gray-500"}`} />
                  )}
                </div>

                {/* Content */}
                <div className="min-w-0 flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className={`font-bold ${isLight ? "text-gray-900" : "text-white"}`}>
                      {item.username || "Anonymous"}
                    </span>
                    <span className={`rounded-md border px-1.5 py-0.5 text-[7px] font-black uppercase tracking-widest ${
                      isLight ? "border-gray-200 bg-gray-100 text-gray-500" : "border-white/10 bg-white/5 text-gray-500"
                    }`}>
                      User
                    </span>
                    <span className={`ml-auto flex items-center gap-1 text-[10px] ${isLight ? "text-gray-500" : "text-gray-500"}`}>
                      <Calendar className="h-3 w-3" />
                      {formatDate(item.createdAt)}
                    </span>
                  </div>
                  <p className={`text-sm leading-relaxed ${isLight ? "text-gray-600" : "text-gray-400"}`}>
                    {item.message.length > 150 ? item.message.slice(0, 150) + "..." : item.message}
                  </p>
                  <div className={`flex items-center gap-2 text-[10px] ${isLight ? "text-gray-500" : "text-gray-500"}`}>
                    <span className="font-medium">Submitted from:</span>
                    <code className={`rounded px-1.5 py-0.5 ${isLight ? "bg-gray-100 text-gray-600" : "bg-white/5 text-gray-400"}`}>
                      {item.page}
                    </code>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                  <button onClick={() => setSelectedFeedback(item)} className={`flex h-8 w-8 items-center justify-center rounded-lg transition-all ${
                    isLight ? "hover:bg-gray-100" : "hover:bg-white/10"
                  }`} title="View">
                    <Eye className={`h-4 w-4 ${isLight ? "text-gray-500" : "text-gray-400"}`} />
                  </button>
                  <button onClick={() => setDeleteConfirm({ isOpen: true, id: item.id })} className={`flex h-8 w-8 items-center justify-center rounded-lg transition-all hover:bg-red-500/10`} title="Delete">
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedFeedback && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedFeedback(null)} className={`absolute inset-0 backdrop-blur-xl ${
              isLight ? "bg-black/35" : "bg-[#020202]/90"
            }`} />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className={`relative flex max-h-[80vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border shadow-2xl ${
              isLight ? "border-gray-200 bg-white" : "border-white/10 bg-[#0a0a0a]"
            }`}>
              <div className={`flex items-center justify-between px-6 py-4 ${isLight ? "border-b border-gray-200" : "border-b border-white/5"}`}>
                <div className="flex items-center gap-3">
                  <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border ${
                    isLight ? "border-gray-200 bg-gray-100" : "border-white/10 bg-white/5"
                  }`}>
                    {selectedFeedback.profilePic ? (
                      <img src={selectedFeedback.profilePic} alt={selectedFeedback.username} className="h-full w-full rounded-full object-cover" />
                    ) : (
                      <User className={`h-5 w-5 ${isLight ? "text-gray-400" : "text-gray-500"}`} />
                    )}
                  </div>
                  <div>
                    <h3 className={`font-bold ${isLight ? "text-gray-900" : "text-white"}`}>{selectedFeedback.username || "Anonymous"}</h3>
                    <p className={`text-xs ${isLight ? "text-gray-500" : "text-gray-400"}`}>{formatDate(selectedFeedback.createdAt)}</p>
                  </div>
                </div>
                <button onClick={() => setSelectedFeedback(null)} className={`flex h-9 w-9 items-center justify-center rounded-lg transition-all active:scale-95 ${
                  isLight ? "bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-900" : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white"
                }`}>
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-6">
                <div className={`mb-4 rounded-xl p-4 ${isLight ? "bg-gray-50" : "bg-white/5"}`}>
                  <p className={`text-sm leading-relaxed ${isLight ? "text-gray-700" : "text-gray-300"}`}>{selectedFeedback.message}</p>
                </div>
                <div className={`flex items-center gap-2 text-xs ${isLight ? "text-gray-500" : "text-gray-500"}`}>
                  <span>Submitted from:</span>
                  <code className={`rounded px-2 py-1 ${isLight ? "bg-gray-100 text-gray-600" : "bg-white/5 text-gray-400"}`}>{selectedFeedback.page}</code>
                </div>
              </div>
              <div className={`flex justify-end gap-2 border-t p-4 ${isLight ? "border-gray-200" : "border-white/5"}`}>
                <button onClick={() => { setDeleteConfirm({ isOpen: true, id: selectedFeedback.id }); setSelectedFeedback(null); }} className="flex items-center gap-2 rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-600">
                  <Trash2 className="h-4 w-4" />
                  Delete
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteConfirm.isOpen && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setDeleteConfirm({ isOpen: false, id: null })} className={`absolute inset-0 backdrop-blur-xl ${
              isLight ? "bg-black/50" : "bg-[#020202]/90"
            }`} />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className={`relative w-full max-w-sm overflow-hidden rounded-2xl border shadow-2xl ${
              isLight ? "border-gray-200 bg-white" : "border-white/10 bg-[#0a0a0a]"
            }`}>
              <div className="p-6 text-center">
                <div className={`mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-100 ${
                  isLight ? "bg-red-50" : "bg-red-500/10"
                }`}>
                  <Trash2 className="h-7 w-7 text-red-500" />
                </div>
                <h3 className={`mb-2 text-lg font-bold ${isLight ? "text-gray-900" : "text-white"}`}>
                  Delete Feedback?
                </h3>
                <p className={`text-sm ${isLight ? "text-gray-600" : "text-gray-400"}`}>
                  This action cannot be undone. The feedback will be permanently removed.
                </p>
              </div>
              <div className={`flex gap-2 border-t p-4 ${isLight ? "border-gray-200" : "border-white/5"}`}>
                <button onClick={() => setDeleteConfirm({ isOpen: false, id: null })} className={`flex-1 rounded-lg px-4 py-2.5 text-sm font-medium transition ${
                  isLight ? "bg-gray-100 text-gray-700 hover:bg-gray-200" : "bg-white/5 text-gray-300 hover:bg-white/10"
                }`}>
                  Cancel
                </button>
                <button onClick={handleDelete} className="flex-1 rounded-lg bg-red-500 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-red-600">
                  Delete
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}