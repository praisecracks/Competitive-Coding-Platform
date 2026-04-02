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
  X
} from "lucide-react";

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
      <div className="flex min-h-[60vh] items-center justify-center bg-[#020202] px-4">
        <div className="flex items-center gap-3 rounded-2xl border border-white/5 bg-[#0a0a0a]/50 backdrop-blur-md px-6 py-5 shadow-2xl">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-pink-500/20 border-t-pink-500" />
          <span className="text-sm font-medium text-gray-400">Loading Control Center...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center bg-[#020202] px-4">
        <div className="w-full max-w-lg rounded-3xl border border-red-500/10 bg-red-500/5 p-8 text-center backdrop-blur-xl">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-500/10 text-red-500 mb-6">
            <AlertTriangle className="h-8 w-8" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-3">Access Denied</h1>
          <p className="text-gray-400 leading-relaxed mb-8">{error}</p>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 rounded-2xl bg-white text-black px-8 py-3.5 text-sm font-semibold transition hover:bg-gray-200 active:scale-95"
          >
            Return to Dashboard
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-white selection:bg-pink-500/30 pb-20">
      {/* Background Decorative Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-pink-500/10 blur-[150px] opacity-40 animate-pulse" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-purple-500/10 blur-[150px] opacity-40 animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto space-y-8">
        {/* Header Section */}
        <header className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-3">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-flex items-center gap-2 rounded-full border border-pink-500/20 bg-pink-500/5 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-pink-400 backdrop-blur-sm"
            >
              <ShieldCheck className="h-2.5 w-2.5" />
              Platform Administration
            </motion.div>

            <div className="space-y-1.5">
              <motion.h1
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-2xl font-bold tracking-tight text-white lg:text-3xl"
              >
                Control Center
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-gray-400 text-xs font-medium max-w-2xl"
              >
                Comprehensive management tools for overseeing platform metrics and operations.
              </motion.p>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="flex items-center gap-2"
          >
            <div className="hidden sm:flex flex-col items-end gap-0.5 px-3 py-1.5 rounded-xl border border-white/5 bg-white/[0.02]">
              <div className="flex items-center gap-1">
                <div className="relative flex h-1 w-1">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex h-1 w-1 rounded-full bg-emerald-500" />
                </div>
                <span className="text-[8px] font-bold uppercase tracking-widest text-emerald-400">System Live</span>
              </div>
              <span className="text-[8px] text-gray-500 font-medium">All services operational</span>
            </div>

            <div className={`flex items-center gap-2.5 rounded-lg border px-3 py-1.5 backdrop-blur-md transition-all shadow-lg ${
              userRole === "super_admin" 
                ? "border-purple-500/20 bg-purple-500/5" 
                : "border-sky-500/20 bg-sky-500/5"
            }`}>
              <div className={`p-1.5 rounded-lg ${
                userRole === "super_admin" ? "bg-purple-500/10 text-purple-400" : "bg-sky-500/10 text-sky-400"
              }`}>
                <ShieldCheck className="h-4 w-4" />
              </div>
              <div className="flex flex-col">
                <span className="text-[8px] uppercase tracking-tighter text-gray-500 font-bold leading-none mb-0.5">Access Level</span>
                <span className={`text-xs font-bold leading-none ${
                  userRole === "super_admin" ? "text-purple-300" : "text-sky-300"
                }`}>
                  {userRole === "super_admin" ? "Super Admin" : "Sub Admin"}
                </span>
              </div>
            </div>
          </motion.div>
        </header>

        {/* Stats Grid */}
        <section className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            label="Platform Users"
            value={stats?.totalUsers || 0}
            trend="+12% from last week"
            icon={<Users className="h-5 w-5" />}
            color="pink"
            delay={0.4}
          />
          <StatCard
            label="Total Challenges"
            value={stats?.totalChallenges || 0}
            trend="+5 new today"
            icon={<Code className="h-5 w-5" />}
            color="purple"
            delay={0.5}
          />
          <StatCard
            label="All Submissions"
            value={stats?.totalSubmissions || 0}
            trend="98.2% Success rate"
            icon={<CheckCircle2 className="h-5 w-5" />}
            color="emerald"
            delay={0.6}
          />
          <StatCard
            label="Active Staff"
            value={totalAdmins}
            trend="Active now"
            icon={<ShieldCheck className="h-5 w-5" />}
            color="sky"
            delay={0.7}
          />
        </section>

        {/* Main Content Layout */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Quick Actions Column */}
          <section className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <h2 className="text-lg font-bold tracking-tight text-white flex items-center gap-2">
                  <Settings className="h-5 w-5 text-pink-500" />
                  Management Tools
                </h2>
                <p className="text-xs text-gray-500 font-medium">Core administrative operations</p>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <ActionCard
                href="/dashboard/admin/challenges"
                title="Challenge Library"
                description="Browse, edit, and audit existing challenges."
                icon={<Code />}
                color="pink"
              />
              <ActionCard
                href="/dashboard/admin/challenges?action=create"
                title="Create Challenge"
                description="Configure and deploy new coding tasks."
                icon={<Plus />}
                color="purple"
              />
              <ActionCard
                href="/dashboard/admin/submissions"
                title="Audit Logs"
                description="Review system-wide submission data."
                icon={<Search />}
                color="sky"
              />
              <ActionCard
                href="/dashboard/admin/moderation"
                title="Moderation Center"
                description="Handle reports and community standards."
                icon={<ShieldAlert />}
                color="orange"
              />
              {userRole === "super_admin" && (
                <>
                  <ActionCard
                    href="/dashboard/admin/users"
                    title="User Directory"
                    description="Manage user profiles and permissions."
                    icon={<Users />}
                    color="emerald"
                  />
                  <ActionCard
                    href="/dashboard/admin/subadmins/create"
                    title="Staff Management"
                    description="Invite and authorize new administrators."
                    icon={<UserPlus />}
                    color="indigo"
                  />
                </>
              )}
            </div>
          </section>

          {/* Activity Column */}
          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <h2 className="text-lg font-bold tracking-tight text-white flex items-center gap-2">
                  <Activity className="h-5 w-5 text-sky-500" />
                  Live Activity
                </h2>
                <p className="text-xs text-gray-500 font-medium">Recent platform events</p>
              </div>
              <button 
                onClick={() => setIsActivityModalOpen(true)}
                className="text-xs font-bold text-sky-500 hover:text-sky-400 transition-colors uppercase tracking-widest flex items-center gap-0.5"
              >
                View all
                <ArrowUpRight className="h-3 w-3" />
              </button>
            </div>

            <div className="space-y-2">
              {recentActivityLogs.length > 0 ? (
                recentActivityLogs.slice(0, 6).map((item) => (
                  <ActivityItem key={item.id} item={item} />
                ))
              ) : (
                <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-white/10 bg-white/[0.02] p-6 text-center">
                  <div className="h-8 w-8 rounded-lg bg-white/5 flex items-center justify-center text-gray-600 mb-2">
                    <History className="h-4 w-4" />
                  </div>
                  <p className="text-xs font-semibold text-white">No recent activity</p>
                  <p className="text-[10px] text-gray-500 mt-1">Updates will appear here as they happen.</p>
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
                className="absolute inset-0 bg-[#020202]/90 backdrop-blur-xl"
              />

              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="relative w-full max-w-2xl overflow-hidden rounded-2xl border border-white/10 bg-[#0a0a0a] shadow-2xl flex flex-col max-h-[85vh]"
              >
                <div className="flex items-center justify-between border-b border-white/5 px-5 py-4">
                  <div>
                    <h3 className="text-lg font-bold text-white">Event Stream</h3>
                    <p className="text-xs text-gray-500 mt-0.5">Complete log of recent platform activity</p>
                  </div>
                  <button
                    onClick={() => setIsActivityModalOpen(false)}
                    className="h-9 w-9 flex items-center justify-center rounded-lg bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white transition-all active:scale-95"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto px-5 py-4 space-y-2 custom-scrollbar">
                  {recentActivityLogs.map((item) => (
                    <ActivityItem key={item.id} item={item} full />
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
}: {
  label: string;
  value: number;
  trend: string;
  icon: React.ReactNode;
  color: 'pink' | 'purple' | 'emerald' | 'sky';
  delay?: number;
}) {
  const colorClasses = {
    pink: "border-pink-500/20 bg-pink-500/5 text-pink-500",
    purple: "border-purple-500/20 bg-purple-500/5 text-purple-500",
    emerald: "border-emerald-500/20 bg-emerald-500/5 text-emerald-500",
    sky: "border-sky-500/20 bg-sky-500/5 text-sky-500",
  };

  const glowClasses = {
    pink: "group-hover:shadow-pink-500/10",
    purple: "group-hover:shadow-purple-500/10",
    emerald: "group-hover:shadow-emerald-500/10",
    sky: "group-hover:shadow-sky-500/10",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className={`group relative overflow-hidden rounded-xl border border-white/5 bg-white/[0.03] p-4 transition-all hover:border-white/10 hover:bg-white/[0.06] hover:shadow-lg ${glowClasses[color]}`}
    >
      <div className="flex items-center justify-between mb-3">
        <div className={`flex h-9 w-9 items-center justify-center rounded-lg border transition-all group-hover:scale-110 ${colorClasses[color]}`}>
          {icon}
        </div>
        <div className="h-1 w-1 rounded-full bg-white/10 group-hover:scale-[10] transition-transform duration-500" />
      </div>

      <div className="space-y-0.5">
        <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-gray-500 group-hover:text-gray-400 transition-colors">
          {label}
        </p>
        <p className="text-2xl font-black tracking-tight text-white tabular-nums">
          {value.toLocaleString()}
        </p>
      </div>

      <div className="mt-3 flex items-center gap-1">
        <span className={`text-[9px] font-bold ${color === 'emerald' ? 'text-emerald-500' : 'text-gray-500'}`}>
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
}: {
  href: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}) {
  const colors: Record<string, string> = {
    pink: "group-hover:text-pink-400 group-hover:bg-pink-500/10 group-hover:border-pink-500/20",
    purple: "group-hover:text-purple-400 group-hover:bg-purple-500/10 group-hover:border-purple-500/20",
    sky: "group-hover:text-sky-400 group-hover:bg-sky-500/10 group-hover:border-sky-500/20",
    emerald: "group-hover:text-emerald-400 group-hover:bg-emerald-500/10 group-hover:border-emerald-500/20",
    indigo: "group-hover:text-indigo-400 group-hover:bg-indigo-500/10 group-hover:border-indigo-500/20",
    orange: "group-hover:text-orange-400 group-hover:bg-orange-500/10 group-hover:border-orange-500/20",
  };

  return (
    <Link
      href={href}
      className="group relative flex flex-col gap-3 rounded-xl border border-white/5 bg-white/[0.02] p-4 transition-all hover:border-white/10 hover:bg-white/[0.04] active:scale-[0.98] overflow-hidden"
    >
      <div className={`w-9 h-9 flex items-center justify-center rounded-lg border border-white/5 bg-white/5 text-gray-400 transition-all duration-300 ${colors[color]}`}>
        {icon}
      </div>
      
      <div className="space-y-1">
        <h3 className="text-xs font-bold text-white uppercase tracking-wider group-hover:text-white transition-colors">
          {title}
        </h3>
        <p className="text-[11px] text-gray-500 font-medium leading-relaxed">
          {description}
        </p>
      </div>

      <div className="absolute top-3 right-3 opacity-0 -translate-x-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0">
        <ChevronRight className="h-4 w-4 text-gray-400" />
      </div>
    </Link>
  );
}

function ActivityItem({ item, full = false }: { item: ActivityLogItem, full?: boolean }) {
  return (
    <div className={`group flex items-center gap-3 rounded-lg border border-white/5 bg-white/[0.02] p-3 transition-all hover:bg-white/[0.04] hover:border-white/10 ${full ? 'py-3 px-4' : ''}`}>
      <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg border border-white/5 bg-white/5 text-gray-500 group-hover:text-white transition-all">
        <Users className="h-4 w-4" />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 mb-0.5">
          <p className="truncate text-xs font-bold text-white">
            {item.title}
          </p>
          <RoleBadge role={item.role} />
        </div>
        <p className="truncate text-[11px] text-gray-500 font-medium">
          {item.subtitle}
        </p>
      </div>

      <div className="text-right">
        <p className="text-[9px] font-bold text-gray-600 uppercase tracking-widest whitespace-nowrap">
          {item.timestamp.split(',')[0]}
        </p>
        <p className="text-[9px] font-medium text-gray-500">
          {item.timestamp.split(',')[1]}
        </p>
      </div>
    </div>
  );
}

function RoleBadge({ role }: { role: string }) {
  const normalized = role || "user";
  
  if (normalized === "user") return null;

  const classes =
    normalized === "super_admin"
      ? "border-purple-500/20 bg-purple-500/10 text-purple-400"
      : "border-sky-500/20 bg-sky-500/10 text-sky-400";

  const label =
    normalized === "super_admin"
      ? "Super"
      : "Sub";

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
