'use client';

import { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useTheme } from '@/app/context/ThemeContext';
import {
  ArrowLeft,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Timer,
  Trophy,
  BarChart3,
  Code2,
  Calendar,
  History,
  Zap,
} from 'lucide-react';

interface Submission {
  id: string;
  username: string;
  challenge_id: string;
  challenge_name: string;
  language: string;
  status: 'accepted' | 'rejected' | 'pending' | 'runtime_error' | 'compilation_error';
  score: number;
  submitted_at: string;
}

interface SubmissionMetrics {
  total_submissions: number;
  accepted: number;
  rejected: number;
  pending: number;
  errors: number;
  average_score: number;
}

export default function SubmissionsAuditPage() {
  const router = useRouter();
  const { theme } = useTheme();
  const isLight = theme === 'light';

  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [metrics, setMetrics] = useState<SubmissionMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'recent' | 'oldest' | 'score'>('recent');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('terminal_token');
        if (!token) {
          router.push('/login');
          return;
        }

        const submissionsRes = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/submissions`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (submissionsRes.ok) {
          const data = await submissionsRes.json();
          setSubmissions(data.submissions || []);
          setMetrics(data.metrics);
        }
      } catch (error) {
        console.error('Failed to fetch submissions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

  const filteredAndSortedSubmissions = useMemo(() => {
    let filtered = submissions;

    if (filterStatus !== 'all') {
      filtered = filtered.filter((s) => s.status === filterStatus);
    }

    if (searchQuery) {
      filtered = filtered.filter(
        (s) =>
          s.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.challenge_name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    const sorted = [...filtered];
    if (sortBy === 'recent') {
      sorted.sort(
        (a, b) =>
          new Date(b.submitted_at).getTime() - new Date(a.submitted_at).getTime()
      );
    } else if (sortBy === 'oldest') {
      sorted.sort(
        (a, b) =>
          new Date(a.submitted_at).getTime() - new Date(b.submitted_at).getTime()
      );
    } else if (sortBy === 'score') {
      sorted.sort((a, b) => b.score - a.score);
    }

    return sorted;
  }, [submissions, filterStatus, searchQuery, sortBy]);

  return (
    <div
      className={`min-h-screen space-y-10 pb-20 ${
        isLight ? 'bg-[#f8fafc] text-gray-900' : 'text-white'
      }`}
    >
      {/* Header Section */}
      <header className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-3">
          <Link
            href="/dashboard/admin"
            className={`group inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest transition-colors ${
              isLight ? 'text-gray-500 hover:text-gray-900' : 'text-gray-500 hover:text-white'
            }`}
          >
            <ArrowLeft className="h-3 w-3 transition-transform group-hover:-translate-x-1" />
            Back to Dashboard
          </Link>
          <div className="space-y-2">
            <h1
              className={`text-2xl font-black tracking-tight lg:text-3xl ${
                isLight ? 'text-gray-900' : 'text-white'
              }`}
            >
              Audit Stream
            </h1>
            <p
              className={`text-xs font-medium ${
                isLight ? 'text-gray-600' : 'text-gray-400'
              }`}
            >
              Monitor real-time submission metrics and system-wide performance.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div
            className={`flex items-center gap-3 rounded-lg border px-4 py-2.5 backdrop-blur-sm ${
              isLight
                ? 'border-emerald-200 bg-emerald-50 text-emerald-700 shadow-[0_10px_24px_rgba(15,23,42,0.05)]'
                : 'border-emerald-500/10 bg-emerald-500/5 text-emerald-400'
            }`}
          >
            <div className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            </div>
            <span className="text-xs font-black uppercase tracking-widest">
              Live Analysis
            </span>
          </div>
        </div>
      </header>

      {/* Metrics Grid */}
      {metrics && (
        <section className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          <MetricCard
            label="Total"
            value={metrics.total_submissions}
            icon={<History className="h-4 w-4" />}
            color="blue"
            isLight={isLight}
          />
          <MetricCard
            label="Accepted"
            value={metrics.accepted}
            icon={<CheckCircle2 className="h-4 w-4" />}
            color="emerald"
            isLight={isLight}
          />
          <MetricCard
            label="Rejected"
            value={metrics.rejected}
            icon={<XCircle className="h-4 w-4" />}
            color="rose"
            isLight={isLight}
          />
          <MetricCard
            label="Pending"
            value={metrics.pending}
            icon={<Timer className="h-4 w-4" />}
            color="amber"
            isLight={isLight}
          />
          <MetricCard
            label="Avg Score"
            value={Math.round(metrics.average_score)}
            icon={<Trophy className="h-4 w-4" />}
            color="indigo"
            isLight={isLight}
          />
        </section>
      )}

      {/* Filters & Controls */}
      <div className="flex flex-col items-center justify-between gap-6 lg:flex-row">
        <div className="flex w-full flex-col gap-3 sm:flex-row lg:w-auto">
          <div className="group relative w-full sm:w-80">
            <Search
              className={`absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transition-colors group-focus-within:text-sky-500 ${
                isLight ? 'text-gray-400' : 'text-gray-500'
              }`}
            />
            <input
              type="text"
              placeholder="Search by user or task..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full rounded-lg border py-2.5 pl-10 pr-4 text-sm transition-all focus:outline-none ${
                isLight
                  ? 'border-gray-200 bg-white text-gray-900 placeholder:text-gray-400 shadow-sm focus:border-sky-300 focus:bg-white'
                  : 'border-white/5 bg-white/[0.03] text-white placeholder:text-gray-600 focus:border-sky-500/30 focus:bg-white/[0.05]'
              }`}
            />
          </div>

          <div className="group relative">
            <Filter
              className={`absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transition-colors group-focus-within:text-sky-500 ${
                isLight ? 'text-gray-400' : 'text-gray-500'
              }`}
            />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className={`w-full cursor-pointer appearance-none rounded-lg border py-2.5 pl-10 pr-8 text-sm transition-all focus:outline-none sm:w-56 ${
                isLight
                  ? 'border-gray-200 bg-white text-gray-900 shadow-sm focus:border-sky-300 focus:bg-white'
                  : 'border-white/5 bg-white/[0.03] text-white focus:border-sky-500/30 focus:bg-white/[0.05]'
              }`}
            >
              <option value="all">All Statuses</option>
              <option value="accepted">Accepted</option>
              <option value="rejected">Rejected</option>
              <option value="pending">Pending</option>
              <option value="runtime_error">Runtime Error</option>
              <option value="compilation_error">Compilation Error</option>
            </select>
          </div>
        </div>

        <div
          className={`flex w-full items-center gap-2 rounded-lg p-1.5 backdrop-blur-sm lg:w-auto ${
            isLight
              ? 'border border-gray-200 bg-white shadow-sm'
              : 'border border-white/5 bg-white/[0.03]'
          }`}
        >
          {(['recent', 'oldest', 'score'] as const).map((option) => (
            <button
              key={option}
              onClick={() => setSortBy(option)}
              className={`flex-1 rounded-lg px-4 py-2 text-[9px] font-black uppercase tracking-widest transition-all lg:flex-none ${
                sortBy === option
                  ? isLight
                    ? 'bg-gray-900 text-white shadow-lg'
                    : 'bg-white text-black shadow-xl'
                  : isLight
                  ? 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'
                  : 'text-gray-500 hover:bg-white/5 hover:text-white'
              }`}
            >
              {option === 'recent'
                ? 'Recent'
                : option === 'oldest'
                ? 'Oldest'
                : 'Top Score'}
            </button>
          ))}
        </div>
      </div>

      {/* Submissions List */}
      <div
        className={`relative overflow-hidden rounded-[32px] border backdrop-blur-sm ${
          isLight
            ? 'border-gray-200 bg-white shadow-[0_18px_40px_rgba(15,23,42,0.06)]'
            : 'border-white/5 bg-white/[0.02] shadow-2xl'
        }`}
      >
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <div className="mb-4 h-12 w-12 animate-spin rounded-full border-2 border-sky-500/20 border-t-sky-500" />
            <p
              className={`text-xs font-bold uppercase tracking-widest ${
                isLight ? 'text-gray-500' : 'text-gray-500'
              }`}
            >
              Processing Audit Stream...
            </p>
          </div>
        ) : filteredAndSortedSubmissions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <div
              className={`mb-8 flex h-20 w-20 items-center justify-center rounded-[40px] border ${
                isLight
                  ? 'border-gray-200 bg-gray-50 text-gray-400'
                  : 'border-white/5 bg-white/[0.03] text-gray-600'
              }`}
            >
              <Zap className="h-10 w-10" />
            </div>
            <h3
              className={`text-2xl font-black tracking-tight ${
                isLight ? 'text-gray-900' : 'text-white'
              }`}
            >
              Stream Quiet
            </h3>
            <p
              className={`mx-auto mt-2 max-w-sm font-medium ${
                isLight ? 'text-gray-500' : 'text-gray-500'
              }`}
            >
              No submissions matched your search criteria. Try broadening your
              filters.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr
                  className={`border-b ${
                    isLight
                      ? 'border-gray-200 bg-gray-50'
                      : 'border-white/5 bg-white/[0.03]'
                  }`}
                >
                  <th className="px-5 py-4">
                    <div
                      className={`flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.2em] ${
                        isLight ? 'text-gray-500' : 'text-gray-500'
                      }`}
                    >
                      User
                    </div>
                  </th>
                  <th className="px-5 py-4">
                    <div
                      className={`flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.2em] ${
                        isLight ? 'text-gray-500' : 'text-gray-500'
                      }`}
                    >
                      Challenge
                    </div>
                  </th>
                  <th className="px-5 py-4">
                    <div
                      className={`flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.2em] ${
                        isLight ? 'text-gray-500' : 'text-gray-500'
                      }`}
                    >
                      Platform
                    </div>
                  </th>
                  <th className="px-5 py-4 text-center">
                    <div
                      className={`flex items-center justify-center gap-2 text-[9px] font-black uppercase tracking-[0.2em] ${
                        isLight ? 'text-gray-500' : 'text-gray-500'
                      }`}
                    >
                      Outcome
                    </div>
                  </th>
                  <th className="px-5 py-4 text-right">
                    <div
                      className={`flex items-center justify-end gap-2 text-[9px] font-black uppercase tracking-[0.2em] ${
                        isLight ? 'text-gray-500' : 'text-gray-500'
                      }`}
                    >
                      Score
                    </div>
                  </th>
                  <th className="px-5 py-4 text-right">
                    <div
                      className={`flex items-center justify-end gap-2 text-[9px] font-black uppercase tracking-[0.2em] ${
                        isLight ? 'text-gray-500' : 'text-gray-500'
                      }`}
                    >
                      Timeline
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody
                className={`divide-y ${
                  isLight ? 'divide-gray-100' : 'divide-white/5'
                }`}
              >
                {filteredAndSortedSubmissions.slice(0, 50).map((submission, idx) => (
                  <motion.tr
                    key={submission.id}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.01 }}
                    className={`group transition-colors ${
                      isLight ? 'hover:bg-gray-50' : 'hover:bg-white/[0.03]'
                    }`}
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={`flex h-8 w-8 items-center justify-center rounded-lg border text-[10px] font-black transition-transform group-hover:scale-110 ${
                            isLight
                              ? 'border-gray-200 bg-gradient-to-br from-gray-100 to-white text-gray-900'
                              : 'border-white/10 bg-gradient-to-br from-white/10 to-transparent text-white'
                          }`}
                        >
                          {submission.username.slice(0, 2).toUpperCase()}
                        </div>
                        <p
                          className={`text-sm font-bold transition-colors ${
                            isLight
                              ? 'text-gray-900 group-hover:text-sky-600'
                              : 'text-white group-hover:text-sky-400'
                          }`}
                        >
                          {submission.username}
                        </p>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex flex-col">
                        <span
                          className={`text-xs font-bold transition-colors ${
                            isLight
                              ? 'text-gray-700 group-hover:text-gray-900'
                              : 'text-gray-300 group-hover:text-white'
                          }`}
                        >
                          {submission.challenge_name}
                        </span>
                        <span
                          className={`mt-0.5 text-[9px] font-medium uppercase tracking-widest ${
                            isLight ? 'text-gray-400' : 'text-gray-600'
                          }`}
                        >
                          ID: {submission.challenge_id.slice(0, 8)}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div
                        className={`inline-flex items-center gap-2 rounded-lg border px-2 py-1 text-[9px] font-bold ${
                          isLight
                            ? 'border-gray-200 bg-gray-50 text-gray-600'
                            : 'border-white/5 bg-white/[0.05] text-gray-400'
                        }`}
                      >
                        <Code2
                          className={`h-3 w-3 ${
                            isLight ? 'text-sky-500' : 'text-sky-500/50'
                          }`}
                        />
                        {submission.language.toUpperCase()}
                      </div>
                    </td>
                    <td className="px-5 py-4 text-center">
                      <StatusBadge status={submission.status} isLight={isLight} />
                    </td>
                    <td className="px-5 py-4 text-right">
                      <div className="flex flex-col items-end">
                        <span
                          className={`text-base font-black tabular-nums ${
                            isLight ? 'text-gray-900' : 'text-white'
                          }`}
                        >
                          {submission.score}
                        </span>
                        <span
                          className={`text-[9px] font-bold uppercase tracking-tighter ${
                            isLight ? 'text-gray-400' : 'text-gray-600'
                          }`}
                        >
                          pts
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <div className="flex flex-col items-end">
                        <span
                          className={`text-xs font-bold ${
                            isLight ? 'text-gray-600' : 'text-gray-400'
                          }`}
                        >
                          {formatTime(submission.submitted_at)}
                        </span>
                        <span
                          className={`flex items-center gap-1 text-[9px] font-medium ${
                            isLight ? 'text-gray-400' : 'text-gray-600'
                          }`}
                        >
                          <Calendar className="h-3 w-3" />
                          {new Date(submission.submitted_at).toLocaleDateString()}
                        </span>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {filteredAndSortedSubmissions.length > 50 && (
        <div className="text-center">
          <p
            className={`text-xs font-bold uppercase tracking-[0.2em] ${
              isLight ? 'text-gray-500' : 'text-gray-600'
            }`}
          >
            Limited to first 50 entries of {filteredAndSortedSubmissions.length}{' '}
            records
          </p>
        </div>
      )}
    </div>
  );
}

function MetricCard({
  label,
  value,
  icon,
  color,
  isLight,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
  color: string;
  isLight: boolean;
}) {
  const colorClasses: Record<string, string> = {
    blue: isLight
      ? 'border-blue-200 bg-blue-50 text-blue-600'
      : 'border-blue-500/10 bg-blue-500/5 text-blue-400',
    emerald: isLight
      ? 'border-emerald-200 bg-emerald-50 text-emerald-600'
      : 'border-emerald-500/10 bg-emerald-500/5 text-emerald-400',
    rose: isLight
      ? 'border-rose-200 bg-rose-50 text-rose-600'
      : 'border-rose-500/10 bg-rose-500/5 text-rose-400',
    amber: isLight
      ? 'border-amber-200 bg-amber-50 text-amber-600'
      : 'border-amber-500/10 bg-amber-500/5 text-amber-400',
    indigo: isLight
      ? 'border-indigo-200 bg-indigo-50 text-indigo-600'
      : 'border-indigo-500/10 bg-indigo-500/5 text-indigo-400',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`group relative overflow-hidden rounded-xl border p-5 transition-all ${
        isLight
          ? 'bg-white hover:shadow-[0_14px_34px_rgba(15,23,42,0.06)]'
          : 'hover:bg-white/[0.02]'
      } ${colorClasses[color]}`}
    >
      <div className="mb-3 flex items-center justify-between">
        <div
          className={`flex h-6 w-6 items-center justify-center rounded-lg border ${
            isLight
              ? 'border-current/15 bg-white/60 opacity-90'
              : 'border-white/5 bg-white/5 opacity-50 group-hover:opacity-100'
          } transition-all`}
        >
          {icon}
        </div>
        <BarChart3 className="h-4 w-4 opacity-10" />
      </div>
      <p className="text-[9px] font-black uppercase tracking-[0.2em] opacity-60">
        {label}
      </p>
      <p className="mt-1 text-2xl font-black tracking-tight tabular-nums">
        {value.toLocaleString()}
      </p>
    </motion.div>
  );
}

function StatusBadge({
  status,
  isLight,
}: {
  status: string;
  isLight: boolean;
}) {
  const statusConfig = {
    accepted: {
      bg: isLight ? 'bg-emerald-50' : 'bg-emerald-500/10',
      text: isLight ? 'text-emerald-700' : 'text-emerald-400',
      border: isLight ? 'border-emerald-200' : 'border-emerald-500/20',
      icon: <CheckCircle2 className="h-3 w-3" />,
    },
    rejected: {
      bg: isLight ? 'bg-rose-50' : 'bg-rose-500/10',
      text: isLight ? 'text-rose-700' : 'text-rose-400',
      border: isLight ? 'border-rose-200' : 'border-rose-500/20',
      icon: <XCircle className="h-3 w-3" />,
    },
    pending: {
      bg: isLight ? 'bg-amber-50' : 'bg-amber-500/10',
      text: isLight ? 'text-amber-700' : 'text-amber-400',
      border: isLight ? 'border-amber-200' : 'border-amber-500/20',
      icon: <Timer className="h-3 w-3" />,
    },
    runtime_error: {
      bg: isLight ? 'bg-orange-50' : 'bg-orange-500/10',
      text: isLight ? 'text-orange-700' : 'text-orange-400',
      border: isLight ? 'border-orange-200' : 'border-orange-500/20',
      icon: <AlertCircle className="h-3 w-3" />,
    },
    compilation_error: {
      bg: isLight ? 'bg-rose-50' : 'bg-rose-500/10',
      text: isLight ? 'text-rose-700' : 'text-rose-400',
      border: isLight ? 'border-rose-200' : 'border-rose-500/20',
      icon: <AlertCircle className="h-3 w-3" />,
    },
  };

  const config =
    statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
  const label = status.replace('_', ' ').toUpperCase();

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-lg border px-2 py-1 text-[8px] font-black uppercase tracking-widest ${config.bg} ${config.text} ${config.border}`}
    >
      {config.icon}
      {label}
    </span>
  );
}

function formatTime(timestamp: string): string {
  const date = new Date(timestamp);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;

  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}