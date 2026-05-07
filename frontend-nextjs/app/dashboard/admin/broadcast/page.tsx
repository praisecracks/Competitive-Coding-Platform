"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Send,
  Users,
  CheckCircle2,
  AlertTriangle,
  ArrowLeft,
  ExternalLink,
  Eye,
  Megaphone,
  Sparkles,
  Mail,
  Bell,
  Wand2,
  ShieldCheck,
} from "lucide-react";
import { useTheme } from "@/app/context/ThemeContext";

const templates = [
  {
    label: "Relaunch Update",
    icon: Sparkles,
    title: "CodeMaster just got better",
    message: `CodeMaster just got a major upgrade.

You can now:
– learn in a structured way
– keep streaks as you improve
– compete on the leaderboard
– challenge friends directly

Come back and see what’s new.`,
    actionUrl: "https://codemasterx.com.ng",
  },
  {
    label: "User Comeback",
    icon: Wand2,
    title: "Ready to continue your coding journey?",
    message: `A lot has changed on CodeMaster.

Learning is now more structured, progress tracking is clearer, and challenges feel better.

Come back, try a challenge, and keep improving.`,
    actionUrl: "https://codemasterx.com.ng",
  },
  {
    label: "Challenge Push",
    icon: Megaphone,
    title: "Challenge yourself today",
    message: `Your next challenge is waiting.

Practice, build your streak, and climb the leaderboard.

Jump back into CodeMaster today.`,
    actionUrl: "https://codemasterx.com.ng/dashboard/challenges",
  },
];

export default function BroadcastNotificationPage() {
  const { theme } = useTheme();
  const isLight = theme === "light";

  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [actionUrl, setActionUrl] = useState("");
  const [sendToAll, setSendToAll] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const messageStrength = useMemo(() => {
    if (!message.trim()) return "Waiting";
    if (message.length <= 220) return "Strong";
    if (message.length <= 420) return "Good";
    return "Too long";
  }, [message]);

  const applyTemplate = (template: (typeof templates)[number]) => {
    setTitle(template.title);
    setMessage(template.message);
    setActionUrl(template.actionUrl);
    setSuccess(false);
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      const token = localStorage.getItem("terminal_token");
      const res = await fetch("/api/admin/super/broadcast", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, message, actionUrl, sendToAll }),
      });

      if (!res.ok) {
        throw new Error("Failed to send broadcast");
      }

      setSuccess(true);
      setTitle("");
      setMessage("");
      setActionUrl("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send broadcast");
    } finally {
      setLoading(false);
    }
  };

  const pageBg = isLight ? "bg-[#f8fafc] text-gray-900" : "bg-[#020202] text-white";
  const cardClass = isLight
    ? "border-gray-200 bg-white shadow-sm"
    : "border-white/10 bg-white/[0.025] shadow-[0_0_30px_rgba(0,0,0,0.25)]";
  const mutedText = isLight ? "text-gray-500" : "text-gray-400";
  const titleText = isLight ? "text-gray-900" : "text-white";
  const inputClass = isLight
    ? "border-gray-200 bg-white text-gray-900 placeholder:text-gray-400 focus:border-pink-300 focus:ring-2 focus:ring-pink-300/20"
    : "border-white/10 bg-black/30 text-white placeholder:text-gray-500 focus:border-pink-500/50 focus:ring-2 focus:ring-pink-500/20";

  return (
    <div className={`min-h-screen pb-20 ${pageBg}`}>
      <div className="mx-auto w-full max-w-7xl space-y-8 px-4 pt-8 sm:px-6 lg:px-8">
        <motion.header
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`rounded-3xl border p-5 sm:p-6 ${cardClass}`}
        >
          <Link
            href="/dashboard/admin"
            className={`mb-5 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider transition-all ${
              isLight ? "text-gray-500 hover:text-gray-900" : "text-gray-400 hover:text-white"
            }`}
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Admin
          </Link>

          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-pink-500/20 bg-pink-500/10 px-3 py-1 text-xs font-semibold text-pink-400">
                <Megaphone className="h-3.5 w-3.5" />
                Broadcast Center
              </div>

              <h1 className={`text-2xl font-bold tracking-tight sm:text-3xl ${titleText}`}>
                Send Broadcast Notification
              </h1>

              <p className={`mt-2 max-w-2xl text-sm font-medium leading-6 ${mutedText}`}>
                Re-engage users with product updates, learning reminders, streak pushes,
                challenge announcements, and platform news.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              <div className={`rounded-2xl border p-3 ${isLight ? "border-gray-200 bg-gray-50" : "border-white/10 bg-black/30"}`}>
                <Mail className="mb-2 h-4 w-4 text-pink-400" />
                <p className={`text-xs font-semibold ${titleText}`}>Email</p>
                <p className={`text-[11px] ${mutedText}`}>User inbox</p>
              </div>

              <div className={`rounded-2xl border p-3 ${isLight ? "border-gray-200 bg-gray-50" : "border-white/10 bg-black/30"}`}>
                <Bell className="mb-2 h-4 w-4 text-purple-400" />
                <p className={`text-xs font-semibold ${titleText}`}>In-app</p>
                <p className={`text-[11px] ${mutedText}`}>Notification bar</p>
              </div>

              <div className={`col-span-2 rounded-2xl border p-3 sm:col-span-1 ${isLight ? "border-gray-200 bg-gray-50" : "border-white/10 bg-black/30"}`}>
                <ShieldCheck className="mb-2 h-4 w-4 text-emerald-400" />
                <p className={`text-xs font-semibold ${titleText}`}>Controlled</p>
                <p className={`text-[11px] ${mutedText}`}>Admin only</p>
              </div>
            </div>
          </div>
        </motion.header>

        {success && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex items-center gap-3 rounded-2xl border p-4 ${
              isLight
                ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                : "border-emerald-500/20 bg-emerald-500/10 text-emerald-400"
            }`}
          >
            <CheckCircle2 className="h-5 w-5" />
            <span className="font-medium">Broadcast sent successfully!</span>
          </motion.div>
        )}

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex items-center gap-3 rounded-2xl border p-4 ${
              isLight
                ? "border-red-200 bg-red-50 text-red-700"
                : "border-red-500/20 bg-red-500/10 text-red-400"
            }`}
          >
            <AlertTriangle className="h-5 w-5" />
            <span className="font-medium">{error}</span>
          </motion.div>
        )}

        <div className="grid gap-8 lg:grid-cols-[1.35fr_0.9fr]">
          <form onSubmit={handleSubmit} className={`rounded-3xl border p-5 sm:p-6 ${cardClass}`}>
            <div className="mb-6 flex items-center justify-between gap-4">
              <div>
                <h2 className={`text-lg font-bold ${titleText}`}>Compose Message</h2>
                <p className={`mt-1 text-sm ${mutedText}`}>
                  Keep it short, clear, and action-driven.
                </p>
              </div>
              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                  messageStrength === "Strong"
                    ? "bg-emerald-500/10 text-emerald-400"
                    : messageStrength === "Good"
                    ? "bg-amber-500/10 text-amber-400"
                    : messageStrength === "Too long"
                    ? "bg-red-500/10 text-red-400"
                    : "bg-gray-500/10 text-gray-400"
                }`}
              >
                {messageStrength}
              </span>
            </div>

            <div className="mb-6 grid gap-3 sm:grid-cols-3">
              {templates.map((template) => {
                const Icon = template.icon;
                return (
                  <button
                    key={template.label}
                    type="button"
                    onClick={() => applyTemplate(template)}
                    className={`rounded-2xl border p-4 text-left transition-all hover:-translate-y-0.5 ${
                      isLight
                        ? "border-gray-200 bg-gray-50 hover:border-pink-200 hover:bg-pink-50/50"
                        : "border-white/10 bg-black/30 hover:border-pink-500/30 hover:bg-pink-500/5"
                    }`}
                  >
                    <Icon className="mb-3 h-4 w-4 text-pink-400" />
                    <p className={`text-xs font-bold ${titleText}`}>{template.label}</p>
                    <p className={`mt-1 text-[11px] leading-4 ${mutedText}`}>
                      Auto-fill a proven message.
                    </p>
                  </button>
                );
              })}
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <label className={`text-xs font-bold uppercase tracking-wider ${isLight ? "text-gray-700" : "text-gray-300"}`}>
                  Notification Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., CodeMaster just got better"
                  required
                  className={`w-full rounded-2xl border px-4 py-3 text-sm font-medium outline-none transition-all ${inputClass}`}
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between gap-3">
                  <label className={`text-xs font-bold uppercase tracking-wider ${isLight ? "text-gray-700" : "text-gray-300"}`}>
                    Message Content
                  </label>
                  <span className={`text-xs ${message.length > 420 ? "text-red-400" : mutedText}`}>
                    {message.length}/420
                  </span>
                </div>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Write a clear announcement that makes users want to return..."
                  rows={9}
                  required
                  className={`w-full resize-none rounded-2xl border px-4 py-3 text-sm font-medium leading-6 outline-none transition-all ${inputClass}`}
                />
                <p className={`text-xs ${mutedText}`}>
                  Best practice: one update, one reason to return, one clear action.
                </p>
              </div>

              <div className="space-y-2">
                <label className={`text-xs font-bold uppercase tracking-wider ${isLight ? "text-gray-700" : "text-gray-300"}`}>
                  Action URL
                </label>
                <div className="relative">
                  <ExternalLink className={`absolute left-3 top-3.5 h-4 w-4 ${isLight ? "text-gray-400" : "text-gray-500"}`} />
                  <input
                    type="url"
                    value={actionUrl}
                    onChange={(e) => setActionUrl(e.target.value)}
                    placeholder="https://codemasterx.com.ng"
                    className={`w-full rounded-2xl border py-3 pl-10 pr-4 text-sm font-medium outline-none transition-all ${inputClass}`}
                  />
                </div>
              </div>

              <label
                htmlFor="sendToAll"
                className={`flex cursor-pointer items-start gap-3 rounded-2xl border p-4 transition-all ${
                  isLight
                    ? "border-gray-200 bg-gray-50 hover:border-pink-200"
                    : "border-white/10 bg-black/30 hover:border-pink-500/25"
                }`}
              >
                <input
                  type="checkbox"
                  id="sendToAll"
                  checked={sendToAll}
                  onChange={(e) => setSendToAll(e.target.checked)}
                  className="mt-1 h-4 w-4 rounded border-gray-300 text-pink-600 focus:ring-pink-500"
                />
                <div>
                  <p className={`text-sm font-semibold ${titleText}`}>
                    Send to all users
                  </p>
                  <p className={`mt-1 text-xs leading-5 ${mutedText}`}>
                    Overrides email notification preferences and sends both email and in-app notifications.
                  </p>
                </div>
              </label>

              <div
                className={`rounded-2xl border p-4 ${
                  isLight ? "border-amber-200 bg-amber-50" : "border-amber-500/20 bg-amber-500/10"
                }`}
              >
                <p className={`text-xs font-medium leading-5 ${isLight ? "text-amber-700" : "text-amber-400"}`}>
                  <strong>Testing Tip:</strong> Set BROADCAST_TEST_MODE=true in the backend environment
                  to safely test without sending real emails.
                </p>
              </div>

              <button
                type="submit"
                disabled={loading || !title.trim() || !message.trim()}
                className={`flex w-full items-center justify-center gap-2 rounded-2xl border px-6 py-4 text-sm font-bold transition-all active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 ${
                  isLight
                    ? "border-pink-200 bg-pink-500 text-white hover:bg-pink-600"
                    : "border-pink-500/20 bg-pink-500 text-black hover:bg-pink-400"
                }`}
              >
                {loading ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    Sending Broadcast...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    Send Broadcast
                  </>
                )}
              </button>
            </div>
          </form>

          <aside className="space-y-6">
            <div className={`rounded-3xl border p-5 sm:p-6 ${cardClass}`}>
              <div className="mb-5 flex items-center gap-2">
                <Eye className="h-4 w-4 text-pink-400" />
                <h2 className={`text-lg font-bold ${titleText}`}>Live Preview</h2>
              </div>

              <div
                className={`rounded-3xl border p-4 ${
                  isLight ? "border-gray-200 bg-gray-50" : "border-white/10 bg-black/40"
                }`}
              >
                <p className={`mb-3 text-[11px] font-bold uppercase tracking-wider ${isLight ? "text-pink-600" : "text-pink-400"}`}>
                  In-app notification
                </p>

                <div className={`rounded-2xl border p-4 ${isLight ? "border-gray-200 bg-white" : "border-white/10 bg-[#09090b]"}`}>
                  <div className="mb-3 flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-gradient-to-br from-pink-500 to-purple-600">
                      <Bell className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <p className={`text-sm font-bold ${titleText}`}>
                        {title || "Your notification title"}
                      </p>
                      <p className={`text-[11px] ${mutedText}`}>Just now</p>
                    </div>
                  </div>

                  <p className={`whitespace-pre-line text-sm leading-6 ${isLight ? "text-gray-600" : "text-gray-300"}`}>
                    {message || "Your broadcast message preview will appear here as you type."}
                  </p>

                  {actionUrl && (
                    <div className="mt-4 inline-flex items-center gap-2 rounded-xl bg-pink-500 px-3 py-2 text-xs font-bold text-white">
                      Open CodeMaster
                      <ExternalLink className="h-3.5 w-3.5" />
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className={`rounded-3xl border p-5 sm:p-6 ${cardClass}`}>
              <h2 className={`text-lg font-bold ${titleText}`}>Delivery Summary</h2>

              <div className="mt-5 space-y-3">
                <div className={`flex items-center justify-between rounded-2xl border p-4 ${isLight ? "border-gray-200 bg-gray-50" : "border-white/10 bg-black/30"}`}>
                  <div className="flex items-center gap-3">
                    <Users className="h-4 w-4 text-pink-400" />
                    <span className={`text-sm font-semibold ${titleText}`}>Audience</span>
                  </div>
                  <span className={`text-xs font-bold ${sendToAll ? "text-emerald-400" : mutedText}`}>
                    {sendToAll ? "All users" : "Preference-based"}
                  </span>
                </div>

                <div className={`flex items-center justify-between rounded-2xl border p-4 ${isLight ? "border-gray-200 bg-gray-50" : "border-white/10 bg-black/30"}`}>
                  <div className="flex items-center gap-3">
                    <Mail className="h-4 w-4 text-purple-400" />
                    <span className={`text-sm font-semibold ${titleText}`}>Email</span>
                  </div>
                  <span className="text-xs font-bold text-emerald-400">Enabled</span>
                </div>
                
                <div className={`flex items-center justify-between rounded-2xl border p-4 ${isLight ? "border-gray-200 bg-gray-50" : "border-white/10 bg-black/30"}`}>
                  <div className="flex items-center gap-3">
                    <Bell className="h-4 w-4 text-emerald-400" />
                    <span className={`text-sm font-semibold ${titleText}`}>In-app</span>
                  </div>
                  <span className="text-xs font-bold text-emerald-400">Enabled</span>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

