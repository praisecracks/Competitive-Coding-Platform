'use client';

import { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  Activity, 
  Search, 
  Filter, 
  ChevronRight, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  Timer, 
  Trophy, 
  BarChart3, 
  Layers,
  Code2,
  Calendar,
  ArrowUpDown,
  History,
  Zap
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
      sorted.sort((a, b) => new Date(b.submitted_at).getTime() - new Date(a.submitted_at).getTime());
    } else if (sortBy === 'oldest') {
      sorted.sort((a, b) => new Date(a.submitted_at).getTime() - new Date(b.submitted_at).getTime());
    } else if (sortBy === 'score') {
      sorted.sort((a, b) => b.score - a.score);
    }

    return sorted;
  }, [submissions, filterStatus, searchQuery, sortBy]);

  return (
    <div className="min-h-screen space-y-10 pb-20">
      {/* Header Section */}
      <header className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-3">
          <Link 
            href="/dashboard/admin"
            className="inline-flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-white transition-colors uppercase tracking-widest group"
          >
            <ArrowLeft className="h-3 w-3 group-hover:-translate-x-1 transition-transform" />
            Back to Dashboard
          </Link>
          <div className="space-y-2">
            <h1 className="text-2xl font-black tracking-tight text-white lg:text-3xl">Audit Stream</h1>
            <p className="text-gray-400 text-xs font-medium">Monitor real-time submission metrics and system-wide performance.</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3 rounded-lg border border-emerald-500/10 bg-emerald-500/5 px-4 py-2.5 backdrop-blur-sm">
            <div className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            </div>
            <span className="text-xs font-black uppercase tracking-widest text-emerald-400">Live Analysis</span>
          </div>
        </div>
      </header>

      {/* Metrics Grid */}
      {metrics && (
        <section className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-5">
          <MetricCard label="Total" value={metrics.total_submissions} icon={<History className="h-4 w-4" />} color="blue" />
          <MetricCard label="Accepted" value={metrics.accepted} icon={<CheckCircle2 className="h-4 w-4" />} color="emerald" />
          <MetricCard label="Rejected" value={metrics.rejected} icon={<XCircle className="h-4 w-4" />} color="rose" />
          <MetricCard label="Pending" value={metrics.pending} icon={<Timer className="h-4 w-4" />} color="amber" />
          <MetricCard label="Avg Score" value={Math.round(metrics.average_score)} icon={<Trophy className="h-4 w-4" />} color="indigo" />
        </section>
      )}

      {/* Filters & Controls */}
      <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
          <div className="relative w-full sm:w-80 group">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500 group-focus-within:text-sky-400 transition-colors" />
            <input 
              type="text" 
              placeholder="Search by user or task..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-white/5 bg-white/[0.03] py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-gray-600 focus:border-sky-500/30 focus:bg-white/[0.05] focus:outline-none transition-all"
            />
          </div>

          <div className="relative group">
            <Filter className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500 group-focus-within:text-sky-400 transition-colors" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full sm:w-56 appearance-none rounded-lg border border-white/5 bg-white/[0.03] py-2.5 pl-10 pr-8 text-sm text-white focus:border-sky-500/30 focus:bg-white/[0.05] focus:outline-none transition-all cursor-pointer"
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

        <div className="flex items-center gap-2 p-1.5 rounded-lg border border-white/5 bg-white/[0.03] backdrop-blur-sm w-full lg:w-auto">
          {(['recent', 'oldest', 'score'] as const).map((option) => (
            <button
              key={option}
              onClick={() => setSortBy(option)}
              className={`flex-1 lg:flex-none px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${
                sortBy === option
                  ? 'bg-white text-black shadow-xl'
                  : 'text-gray-500 hover:text-white hover:bg-white/5'
              }`}
            >
              {option === 'recent' ? 'Recent' : option === 'oldest' ? 'Oldest' : 'Top Score'}
            </button>
          ))}
        </div>
      </div>

      {/* Submissions List */}
      <div className="relative rounded-[32px] border border-white/5 bg-white/[0.02] overflow-hidden shadow-2xl backdrop-blur-sm">
        {loading ? (
          <div className="py-32 flex flex-col items-center justify-center text-center">
            <div className="h-12 w-12 animate-spin rounded-full border-2 border-sky-500/20 border-t-sky-500 mb-4" />
            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Processing Audit Stream...</p>
          </div>
        ) : filteredAndSortedSubmissions.length === 0 ? (
          <div className="py-32 flex flex-col items-center justify-center text-center">
            <div className="h-20 w-20 rounded-[40px] bg-white/[0.03] flex items-center justify-center text-gray-600 mb-8 border border-white/5">
              <Zap className="h-10 w-10" />
            </div>
            <h3 className="text-2xl font-black text-white tracking-tight">Stream Quiet</h3>
            <p className="text-gray-500 mt-2 max-w-sm mx-auto font-medium">No submissions matched your search criteria. Try broadening your filters.</p>
          </div>
        ) : (
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white/[0.03] border-b border-white/5">
                  <th className="px-5 py-4">
                    <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.2em] text-gray-500">
                      User
                    </div>
                  </th>
                  <th className="px-5 py-4">
                    <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.2em] text-gray-500">
                      Challenge
                    </div>
                  </th>
                  <th className="px-5 py-4">
                    <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.2em] text-gray-500">
                      Platform
                    </div>
                  </th>
                  <th className="px-5 py-4 text-center">
                    <div className="flex items-center justify-center gap-2 text-[9px] font-black uppercase tracking-[0.2em] text-gray-500">
                      Outcome
                    </div>
                  </th>
                  <th className="px-5 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 text-[9px] font-black uppercase tracking-[0.2em] text-gray-500">
                      Score
                    </div>
                  </th>
                  <th className="px-5 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 text-[9px] font-black uppercase tracking-[0.2em] text-gray-500">
                      Timeline
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredAndSortedSubmissions.slice(0, 50).map((submission, idx) => (
                  <motion.tr
                    key={submission.id}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.01 }}
                    className="group hover:bg-white/[0.03] transition-colors"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-white/10 to-transparent border border-white/10 flex items-center justify-center text-[10px] font-black text-white group-hover:scale-110 transition-transform">
                          {submission.username.slice(0, 2).toUpperCase()}
                        </div>
                        <p className="text-sm font-bold text-white group-hover:text-sky-400 transition-colors">{submission.username}</p>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-gray-300 group-hover:text-white transition-colors">{submission.challenge_name}</span>
                        <span className="text-[9px] font-medium text-gray-600 uppercase tracking-widest mt-0.5">ID: {submission.challenge_id.slice(0, 8)}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="inline-flex items-center gap-2 px-2 py-1 rounded-lg bg-white/[0.05] border border-white/5 text-[9px] font-bold text-gray-400">
                        <Code2 className="h-3 w-3 text-sky-500/50" />
                        {submission.language.toUpperCase()}
                      </div>
                    </td>
                    <td className="px-5 py-4 text-center">
                      <StatusBadge status={submission.status} />
                    </td>
                    <td className="px-5 py-4 text-right">
                      <div className="flex flex-col items-end">
                        <span className="text-base font-black text-white tabular-nums">{submission.score}</span>
                        <span className="text-[9px] font-bold text-gray-600 uppercase tracking-tighter">pts</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <div className="flex flex-col items-end">
                        <span className="text-xs font-bold text-gray-400">{formatTime(submission.submitted_at)}</span>
                        <span className="text-[9px] font-medium text-gray-600 flex items-center gap-1">
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
          <p className="text-xs font-bold text-gray-600 uppercase tracking-[0.2em]">
            Limited to first 50 entries of {filteredAndSortedSubmissions.length} records
          </p>
        </div>
      )}
    </div>
  );
}

function MetricCard({ label, value, icon, color }: { label: string; value: number; icon: React.ReactNode; color: string }) {
  const colorClasses: Record<string, string> = {
    blue: 'border-blue-500/10 bg-blue-500/5 text-blue-400',
    emerald: 'border-emerald-500/10 bg-emerald-500/5 text-emerald-400',
    rose: 'border-rose-500/10 bg-rose-500/5 text-rose-400',
    amber: 'border-amber-500/10 bg-amber-500/5 text-amber-400',
    indigo: 'border-indigo-500/10 bg-indigo-500/5 text-indigo-400',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`group relative overflow-hidden rounded-xl border p-5 transition-all hover:bg-white/[0.02] ${colorClasses[color]}`}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="h-6 w-6 rounded-lg bg-white/5 border border-white/5 flex items-center justify-center opacity-50 group-hover:opacity-100 transition-all">
          {icon}
        </div>
        <BarChart3 className="h-4 w-4 opacity-10" />
      </div>
      <p className="text-[9px] font-black uppercase tracking-[0.2em] opacity-60">{label}</p>
      <p className="mt-1 text-2xl font-black tracking-tight tabular-nums">{value.toLocaleString()}</p>
    </motion.div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const statusConfig = {
    accepted: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/20', icon: <CheckCircle2 className="h-3 w-3" /> },
    rejected: { bg: 'bg-rose-500/10', text: 'text-rose-400', border: 'border-rose-500/20', icon: <XCircle className="h-3 w-3" /> },
    pending: { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/20', icon: <Timer className="h-3 w-3" /> },
    runtime_error: { bg: 'bg-orange-500/10', text: 'text-orange-400', border: 'border-orange-500/20', icon: <AlertCircle className="h-3 w-3" /> },
    compilation_error: { bg: 'bg-rose-500/10', text: 'text-rose-400', border: 'border-rose-500/20', icon: <AlertCircle className="h-3 w-3" /> },
  };

  const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
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
