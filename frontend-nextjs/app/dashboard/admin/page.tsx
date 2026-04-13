"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  Code,
  CheckCircle2,
  ShieldCheck,
  Activity,
  Plus,
  Settings,
  History,
  AlertTriangle,
  ChevronRight,
  UserPlus,
  ShieldAlert,
  Search,
  ArrowUpRight,
  ArrowRight,
  X,
} from "lucide-react";
import { useTheme } from "@/app/context/ThemeContext";

interface AdminStats {
  totalUsers: number;
  totalChallenges: number;
  totalSubmissions: number;
  recentSignups: {
    username: string;
    email: string;
    role: string;
    created_at: string;
  }[];
}

type ActivityLogItem = {
  id: string;
  title: string;
  subtitle: string;
  timestamp: string;
  role: string;
};

export default function AdminOverview() {
  const { theme } = useTheme();
  const isLight = theme === "light";

  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [userRole, setUserRole] = useState("user");
  const [isActivityModalOpen, setIsActivityModalOpen] = useState(false);

  useEffect(() => {
    fetchStats();

    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        setUserRole(parsed.role || "user");
      } catch (e) {
        console.error("Failed to parse user role", e);
      }
    }
  }, []);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem("terminal_token");

      const res = await fetch("/api/admin/stats", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        throw new Error("Unauthorized");
      }

      const data = await res.json();
      setStats(data);
    } catch (err) {
      setError("You do not have permission to view this page.");
    } finally {
      setLoading(false);
    }
  };

  const totalAdmins = useMemo(() => {
    if (!stats?.recentSignups) return 0;

    return stats.recentSignups.filter(
      (user) => user.role === "super_admin" || user.role === "sub_admin"
    ).length;
  }, [stats]);

  const recentActivityLogs: ActivityLogItem[] = useMemo(() => {
    if (!stats?.recentSignups) return [];

    return stats.recentSignups.map((user, index) => ({
      id: `${user.email}-${index}`,
      title: `${user.username} joined`,
      subtitle:
        user.role === "super_admin"
          ? "Granted Super Admin access"
          : user.role === "sub_admin"
          ? "Granted Sub Admin access"
          : "Registered as a user",
      timestamp: formatDateTime(user.created_at),
      role: user.role,
    }));
  }, [stats]);

  if (loading) {
    return (
      <div
        className={`flex min-h-[60vh] items-center justify-center px-4 ${
          isLight ? "bg-[#f8fafc]" : "bg-[#020202]"
        }`}
      >
        <div
          className={`flex items-center gap-3 rounded-2xl border px-6 py-5 backdrop-blur-md ${
            isLight
              ? "border-gray-200 bg-white shadow-[0_14px_34px_rgba(15,23,42,0.08)]"
              : "border-white/5 bg-[#0a0a0a]/50 shadow-2xl"
          }`}
        >
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-pink-500/20 border-t-pink-500" />
          <span
            className={`text-sm font-medium ${
              isLight ? "text-gray-600" : "text-gray-400"
            }`}
          >
            Loading Control Center...
          </span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className={`min-h-[80vh] flex items-center justify-center px-4 ${
          isLight ? "bg-[#f8fafc]" : "bg-[#020202]"
        }`}
      >
        <div
          className={`w-full max-w-lg rounded-3xl border p-8 text-center backdrop-blur-xl ${
            isLight
              ? "border-red-200 bg-white shadow-[0_18px_40px_rgba(15,23,42,0.08)]"
              : "border-red-500/10 bg-red-500/5"
          }`}
        >
          <div
            className={`mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl ${
              isLight
                ? "bg-red-50 text-red-500"
                : "bg-red-500/10 text-red-500"
            }`}
          >
            <AlertTriangle className="h-8 w-8" />
          </div>
          <h1
            className={`mb-3 text-2xl font-bold ${
              isLight ? "text-gray-900" : "text-white"
            }`}
          >
            Access Denied
          </h1>
          <p
            className={`mb-8 leading-relaxed ${
              isLight ? "text-gray-600" : "text-gray-400"
            }`}
          >
            {error}
          </p>
          <Link
            href="/dashboard"
            className={`inline-flex items-center gap-2 rounded-2xl px-8 py-3.5 text-sm font-semibold transition active:scale-95 ${
              isLight
                ? "bg-gray-900 text-white hover:bg-black"
                : "bg-white text-black hover:bg-gray-200"
            }`}
          >
            Return to Dashboard
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen pb-20 selection:bg-pink-500/30 ${
        isLight ? "bg-[#f8fafc] text-gray-900" : "text-white"
      }`}
    >
      {/* Background Decorative Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div
          className={`absolute top-[-20%] left-[-10%] h-[50%] w-[50%] rounded-full blur-[150px] opacity-40 animate-pulse ${
            isLight ? "bg-pink-500/8" : "bg-pink-500/10"
          }`}
        />
        <div
          className={`absolute bottom-[-20%] right-[-10%] h-[50%] w-[50%] rounded-full blur-[150px] opacity-40 animate-pulse ${
            isLight ? "bg-purple-500/8" : "bg-purple-500/10"
          }`}
          style={{ animationDelay: "1s" }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl space-y-8">
        {/* Header Section */}
        <header className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-3">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-wider backdrop-blur-sm ${
                isLight
                  ? "border-pink-200 bg-pink-50 text-pink-600"
                  : "border-pink-500/20 bg-pink-500/5 text-pink-400"
              }`}
            >
              <ShieldCheck className="h-2.5 w-2.5" />
              Platform Administration
            </motion.div>

            <div className="space-y-1.5">
              <motion.h1
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className={`text-2xl font-bold tracking-tight lg:text-3xl ${
                  isLight ? "text-gray-900" : "text-white"
                }`}
              >
                Control Center
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className={`max-w-2xl text-xs font-medium ${
                  isLight ? "text-gray-500" : "text-gray-400"
                }`}
              >
                Comprehensive management tools for overseeing platform metrics and
                operations.
              </motion.p>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="flex items-center gap-2"
          >
            <div
              className={`hidden sm:flex flex-col items-end gap-0.5 rounded-xl border px-3 py-1.5 ${
                isLight
                  ? "border-gray-200 bg-white shadow-sm"
                  : "border-white/5 bg-white/[0.02]"
              }`}
            >
              <div className="flex items-center gap-1">
                <div className="relative flex h-1 w-1">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex h-1 w-1 rounded-full bg-emerald-500" />
                </div>
                <span className="text-[8px] font-bold uppercase tracking-widest text-emerald-500">
                  System Live
                </span>
              </div>
              <span
                className={`text-[8px] font-medium ${
                  isLight ? "text-gray-500" : "text-gray-500"
                }`}
              >
                All services operational
              </span>
            </div>

            <div
              className={`flex items-center gap-2.5 rounded-lg border px-3 py-1.5 backdrop-blur-md transition-all shadow-lg ${
                userRole === "super_admin"
                  ? isLight
                    ? "border-purple-200 bg-purple-50"
                    : "border-purple-500/20 bg-purple-500/5"
                  : isLight
                  ? "border-sky-200 bg-sky-50"
                  : "border-sky-500/20 bg-sky-500/5"
              }`}
            >
              <div
                className={`rounded-lg p-1.5 ${
                  userRole === "super_admin"
                    ? isLight
                      ? "bg-purple-100 text-purple-600"
                      : "bg-purple-500/10 text-purple-400"
                    : isLight
                    ? "bg-sky-100 text-sky-600"
                    : "bg-sky-500/10 text-sky-400"
                }`}
              >
                <ShieldCheck className="h-4 w-4" />
              </div>
              <div className="flex flex-col">
                <span className="mb-0.5 text-[8px] font-bold uppercase tracking-tighter leading-none text-gray-500">
                  Access Level
                </span>
                <span
                  className={`text-xs font-bold leading-none ${
                    userRole === "super_admin"
                      ? isLight
                        ? "text-purple-700"
                        : "text-purple-300"
                      : isLight
                      ? "text-sky-700"
                      : "text-sky-300"
                  }`}
                >
                  {userRole === "super_admin" ? "Super Admin" : "Sub Admin"}
                </span>
              </div>
            </div>
          </motion.div>
        </header>

        {/* Stats Grid */}
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            label="Platform Users"
            value={stats?.totalUsers || 0}
            trend="+12% from last week"
            icon={<Users className="h-5 w-5" />}
            color="pink"
            delay={0.4}
            isLight={isLight}
          />
          <StatCard
            label="Total Challenges"
            value={stats?.totalChallenges || 0}
            trend="+5 new today"
            icon={<Code className="h-5 w-5" />}
            color="purple"
            delay={0.5}
            isLight={isLight}
          />
          <StatCard
            label="All Submissions"
            value={stats?.totalSubmissions || 0}
            trend="98.2% Success rate"
            icon={<CheckCircle2 className="h-5 w-5" />}
            color="emerald"
            delay={0.6}
            isLight={isLight}
          />
          <StatCard
            label="Active Staff"
            value={totalAdmins}
            trend="Active now"
            icon={<ShieldCheck className="h-5 w-5" />}
            color="sky"
            delay={0.7}
            isLight={isLight}
          />
        </section>

        {/* Main Content Layout */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Quick Actions Column */}
          <section className="space-y-6 lg:col-span-2">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <h2
                  className={`flex items-center gap-2 text-lg font-bold tracking-tight ${
                    isLight ? "text-gray-900" : "text-white"
                  }`}
                >
                  <Settings className="h-5 w-5 text-pink-500" />
                  Management Tools
                </h2>
                <p
                  className={`text-xs font-medium ${
                    isLight ? "text-gray-500" : "text-gray-500"
                  }`}
                >
                  Core administrative operations
                </p>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <ActionCard
                href="/dashboard/admin/challenges"
                title="Challenge Library"
                description="Browse, edit, and audit existing challenges."
                icon={<Code />}
                color="pink"
                isLight={isLight}
              />
              <ActionCard
                href="/dashboard/admin/challenges?action=create"
                title="Create Challenge"
                description="Configure and deploy new coding tasks."
                icon={<Plus />}
                color="purple"
                isLight={isLight}
              />
              <ActionCard
                href="/dashboard/admin/submissions"
                title="Audit Logs"
                description="Review system-wide submission data."
                icon={<Search />}
                color="sky"
                isLight={isLight}
              />
              <ActionCard
                href="/dashboard/admin/moderation"
                title="Moderation Center"
                description="Handle reports and community standards."
                icon={<ShieldAlert />}
                color="orange"
                isLight={isLight}
              />
              {userRole === "super_admin" && (
                <>
                  <ActionCard
                    href="/dashboard/admin/users"
                    title="User Directory"
                    description="Manage user profiles and permissions."
                    icon={<Users />}
                    color="emerald"
                    isLight={isLight}
                  />
                  <ActionCard
                    href="/dashboard/admin/subadmins/create"
                    title="Staff Management"
                    description="Invite and authorize new administrators."
                    icon={<UserPlus />}
                    color="indigo"
                    isLight={isLight}
                  />
                </>
              )}
            </div>
          </section>

          {/* Activity Column */}
          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <h2
                  className={`flex items-center gap-2 text-lg font-bold tracking-tight ${
                    isLight ? "text-gray-900" : "text-white"
                  }`}
                >
                  <Activity className="h-5 w-5 text-sky-500" />
                  Live Activity
                </h2>
                <p
                  className={`text-xs font-medium ${
                    isLight ? "text-gray-500" : "text-gray-500"
                  }`}
                >
                  Recent platform events
                </p>
              </div>
              <button
                onClick={() => setIsActivityModalOpen(true)}
                className="flex items-center gap-0.5 text-xs font-bold uppercase tracking-widest text-sky-500 transition-colors hover:text-sky-400"
              >
                View all
                <ArrowUpRight className="h-3 w-3" />
              </button>
            </div>

            <div className="space-y-2">
              {recentActivityLogs.length > 0 ? (
                recentActivityLogs
                  .slice(0, 6)
                  .map((item) => (
                    <ActivityItem
                      key={item.id}
                      item={item}
                      isLight={isLight}
                    />
                  ))
              ) : (
                <div
                  className={`flex flex-col items-center justify-center rounded-lg border p-6 text-center ${
                    isLight
                      ? "border-dashed border-gray-200 bg-white shadow-sm"
                      : "border-dashed border-white/10 bg-white/[0.02]"
                  }`}
                >
                  <div
                    className={`mb-2 flex h-8 w-8 items-center justify-center rounded-lg ${
                      isLight
                        ? "bg-gray-100 text-gray-400"
                        : "bg-white/5 text-gray-600"
                    }`}
                  >
                    <History className="h-4 w-4" />
                  </div>
                  <p
                    className={`text-xs font-semibold ${
                      isLight ? "text-gray-900" : "text-white"
                    }`}
                  >
                    No recent activity
                  </p>
                  <p
                    className={`mt-1 text-[10px] ${
                      isLight ? "text-gray-500" : "text-gray-500"
                    }`}
                  >
                    Updates will appear here as they happen.
                  </p>
                </div>
              )}
            </div>
          </section>
        </div>

        {/* Activity Modal */}
        <AnimatePresence>
          {isActivityModalOpen && (
            <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsActivityModalOpen(false)}
                className={`absolute inset-0 backdrop-blur-xl ${
                  isLight ? "bg-black/35" : "bg-[#020202]/90"
                }`}
              />

              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className={`relative flex max-h-[85vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border shadow-2xl ${
                  isLight
                    ? "border-gray-200 bg-white"
                    : "border-white/10 bg-[#0a0a0a]"
                }`}
              >
                <div
                  className={`flex items-center justify-between px-5 py-4 ${
                    isLight ? "border-b border-gray-200" : "border-b border-white/5"
                  }`}
                >
                  <div>
                    <h3
                      className={`text-lg font-bold ${
                        isLight ? "text-gray-900" : "text-white"
                      }`}
                    >
                      Event Stream
                    </h3>
                    <p
                      className={`mt-0.5 text-xs ${
                        isLight ? "text-gray-500" : "text-gray-500"
                      }`}
                    >
                      Complete log of recent platform activity
                    </p>
                  </div>
                  <button
                    onClick={() => setIsActivityModalOpen(false)}
                    className={`flex h-9 w-9 items-center justify-center rounded-lg transition-all active:scale-95 ${
                      isLight
                        ? "bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-900"
                        : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <div className="custom-scrollbar flex-1 space-y-2 overflow-y-auto px-5 py-4">
                  {recentActivityLogs.map((item) => (
                    <ActivityItem
                      key={item.id}
                      item={item}
                      full
                      isLight={isLight}
                    />
                  ))}
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  trend,
  icon,
  color,
  delay = 0,
  isLight,
}: {
  label: string;
  value: number;
  trend: string;
  icon: React.ReactNode;
  color: "pink" | "purple" | "emerald" | "sky";
  delay?: number;
  isLight: boolean;
}) {
  const colorClasses = {
    pink: isLight
      ? "border-pink-200 bg-pink-50 text-pink-600"
      : "border-pink-500/20 bg-pink-500/5 text-pink-500",
    purple: isLight
      ? "border-purple-200 bg-purple-50 text-purple-600"
      : "border-purple-500/20 bg-purple-500/5 text-purple-500",
    emerald: isLight
      ? "border-emerald-200 bg-emerald-50 text-emerald-600"
      : "border-emerald-500/20 bg-emerald-500/5 text-emerald-500",
    sky: isLight
      ? "border-sky-200 bg-sky-50 text-sky-600"
      : "border-sky-500/20 bg-sky-500/5 text-sky-500",
  };

  const glowClasses = {
    pink: isLight
      ? "group-hover:shadow-[0_12px_30px_rgba(236,72,153,0.12)]"
      : "group-hover:shadow-pink-500/10",
    purple: isLight
      ? "group-hover:shadow-[0_12px_30px_rgba(168,85,247,0.12)]"
      : "group-hover:shadow-purple-500/10",
    emerald: isLight
      ? "group-hover:shadow-[0_12px_30px_rgba(16,185,129,0.12)]"
      : "group-hover:shadow-emerald-500/10",
    sky: isLight
      ? "group-hover:shadow-[0_12px_30px_rgba(14,165,233,0.12)]"
      : "group-hover:shadow-sky-500/10",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className={`group relative overflow-hidden rounded-xl border p-4 transition-all hover:shadow-lg ${
        isLight
          ? "border-gray-200 bg-white hover:border-gray-300"
          : "border-white/5 bg-white/[0.03] hover:border-white/10 hover:bg-white/[0.06]"
      } ${glowClasses[color]}`}
    >
      <div className="mb-3 flex items-center justify-between">
        <div
          className={`flex h-9 w-9 items-center justify-center rounded-lg border transition-all group-hover:scale-110 ${colorClasses[color]}`}
        >
          {icon}
        </div>
        <div
          className={`h-1 w-1 rounded-full transition-transform duration-500 group-hover:scale-[10] ${
            isLight ? "bg-gray-200" : "bg-white/10"
          }`}
        />
      </div>

      <div className="space-y-0.5">
        <p
          className={`text-[10px] font-bold uppercase tracking-[0.15em] transition-colors ${
            isLight
              ? "text-gray-500 group-hover:text-gray-700"
              : "text-gray-500 group-hover:text-gray-400"
          }`}
        >
          {label}
        </p>
        <p
          className={`text-2xl font-black tracking-tight tabular-nums ${
            isLight ? "text-gray-900" : "text-white"
          }`}
        >
          {value.toLocaleString()}
        </p>
      </div>

      <div className="mt-3 flex items-center gap-1">
        <span
          className={`text-[9px] font-bold ${
            color === "emerald"
              ? isLight
                ? "text-emerald-600"
                : "text-emerald-500"
              : isLight
              ? "text-gray-500"
              : "text-gray-500"
          }`}
        >
          {trend}
        </span>
      </div>
    </motion.div>
  );
}

function ActionCard({
  href,
  title,
  description,
  icon,
  color,
  isLight,
}: {
  href: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  isLight: boolean;
}) {
  const colors: Record<string, string> = {
    pink: isLight
      ? "group-hover:text-pink-600 group-hover:bg-pink-50 group-hover:border-pink-200"
      : "group-hover:text-pink-400 group-hover:bg-pink-500/10 group-hover:border-pink-500/20",
    purple: isLight
      ? "group-hover:text-purple-600 group-hover:bg-purple-50 group-hover:border-purple-200"
      : "group-hover:text-purple-400 group-hover:bg-purple-500/10 group-hover:border-purple-500/20",
    sky: isLight
      ? "group-hover:text-sky-600 group-hover:bg-sky-50 group-hover:border-sky-200"
      : "group-hover:text-sky-400 group-hover:bg-sky-500/10 group-hover:border-sky-500/20",
    emerald: isLight
      ? "group-hover:text-emerald-600 group-hover:bg-emerald-50 group-hover:border-emerald-200"
      : "group-hover:text-emerald-400 group-hover:bg-emerald-500/10 group-hover:border-emerald-500/20",
    indigo: isLight
      ? "group-hover:text-indigo-600 group-hover:bg-indigo-50 group-hover:border-indigo-200"
      : "group-hover:text-indigo-400 group-hover:bg-indigo-500/10 group-hover:border-indigo-500/20",
    orange: isLight
      ? "group-hover:text-orange-600 group-hover:bg-orange-50 group-hover:border-orange-200"
      : "group-hover:text-orange-400 group-hover:bg-orange-500/10 group-hover:border-orange-500/20",
  };

  return (
    <Link
      href={href}
      className={`group relative flex flex-col gap-3 overflow-hidden rounded-xl border p-4 transition-all active:scale-[0.98] ${
        isLight
          ? "border-gray-200 bg-white hover:border-gray-300 hover:shadow-[0_14px_34px_rgba(15,23,42,0.06)]"
          : "border-white/5 bg-white/[0.02] hover:border-white/10 hover:bg-white/[0.04]"
      }`}
    >
      <div
        className={`flex h-9 w-9 items-center justify-center rounded-lg border transition-all duration-300 ${
          isLight
            ? "border-gray-200 bg-gray-50 text-gray-500"
            : "border-white/5 bg-white/5 text-gray-400"
        } ${colors[color]}`}
      >
        {icon}
      </div>

      <div className="space-y-1">
        <h3
          className={`text-xs font-bold uppercase tracking-wider transition-colors ${
            isLight ? "text-gray-900" : "text-white"
          }`}
        >
          {title}
        </h3>
        <p
          className={`text-[11px] font-medium leading-relaxed ${
            isLight ? "text-gray-500" : "text-gray-500"
          }`}
        >
          {description}
        </p>
      </div>

      <div className="absolute top-3 right-3 -translate-x-2 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100">
        <ChevronRight
          className={`h-4 w-4 ${isLight ? "text-gray-400" : "text-gray-400"}`}
        />
      </div>
    </Link>
  );
}

function ActivityItem({
  item,
  full = false,
  isLight,
}: {
  item: ActivityLogItem;
  full?: boolean;
  isLight: boolean;
}) {
  return (
    <div
      className={`group flex items-center gap-3 rounded-lg border p-3 transition-all ${
        full ? "py-3 px-4" : ""
      } ${
        isLight
          ? "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50"
          : "border-white/5 bg-white/[0.02] hover:border-white/10 hover:bg-white/[0.04]"
      }`}
    >
      <div
        className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg border transition-all ${
          isLight
            ? "border-gray-200 bg-gray-50 text-gray-500 group-hover:text-gray-900"
            : "border-white/5 bg-white/5 text-gray-500 group-hover:text-white"
        }`}
      >
        <Users className="h-4 w-4" />
      </div>

      <div className="min-w-0 flex-1">
        <div className="mb-0.5 flex items-center gap-1.5">
          <p
            className={`truncate text-xs font-bold ${
              isLight ? "text-gray-900" : "text-white"
            }`}
          >
            {item.title}
          </p>
          <RoleBadge role={item.role} isLight={isLight} />
        </div>
        <p
          className={`truncate text-[11px] font-medium ${
            isLight ? "text-gray-500" : "text-gray-500"
          }`}
        >
          {item.subtitle}
        </p>
      </div>

      <div className="text-right">
        <p
          className={`whitespace-nowrap text-[9px] font-bold uppercase tracking-widest ${
            isLight ? "text-gray-500" : "text-gray-600"
          }`}
        >
          {item.timestamp.split(",")[0]}
        </p>
        <p
          className={`text-[9px] font-medium ${
            isLight ? "text-gray-500" : "text-gray-500"
          }`}
        >
          {item.timestamp.split(",")[1]}
        </p>
      </div>
    </div>
  );
}

function RoleBadge({ role, isLight }: { role: string; isLight: boolean }) {
  const normalized = role || "user";

  if (normalized === "user") return null;

  const classes =
    normalized === "super_admin"
      ? isLight
        ? "border-purple-200 bg-purple-50 text-purple-700"
        : "border-purple-500/20 bg-purple-500/10 text-purple-400"
      : isLight
      ? "border-sky-200 bg-sky-50 text-sky-700"
      : "border-sky-500/20 bg-sky-500/10 text-sky-400";

  const label = normalized === "super_admin" ? "Super" : "Sub";

  return (
    <span
      className={`rounded-md border px-1.5 py-0.5 text-[7px] font-black uppercase tracking-widest ${classes}`}
    >
      {label}
    </span>
  );
}

function formatDateTime(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Unknown time";

  return date.toLocaleString([], {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}