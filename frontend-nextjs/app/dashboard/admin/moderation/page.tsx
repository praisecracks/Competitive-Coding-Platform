'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useTheme } from '@/app/context/ThemeContext';
import { 
  ArrowLeft, 
  ShieldAlert, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Filter, 
  Search, 
  AlertCircle,
  MessageSquare,
  ShieldCheck,
  Zap,
  Info,
  Flag,
  User,
  FileText,
  Eye,
  Check,
  X
} from 'lucide-react';

interface Report {
  id: string;
  userId: string;
  reporterUsername?: string;
  reporterProfilePic?: string;
  type: string;
  targetId: number;
  targetUsername: string;
  targetProfilePic?: string;
  reason: string;
  status: 'pending' | 'resolved' | 'dismissed';
  createdAt: string;
}

export default function ModerationPage() {
  const router = useRouter();
  const { theme } = useTheme();
  const isLight = theme === "light";
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>('pending');
  const [resolving, setResolving] = useState<string | null>(null);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const token = localStorage.getItem('terminal_token');
        if (!token) {
          router.push('/login');
          return;
        }

        const res = await fetch('/api/admin/reports', {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.ok) {
          const data = await res.json();
          setReports(data);
        }
      } catch (error) {
        console.error('Failed to fetch reports:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, [router]);

  const handleResolve = async (reportId: string, status: 'resolved' | 'dismissed') => {
    setResolving(reportId);
    try {
      const token = localStorage.getItem('terminal_token');
      const res = await fetch(`/api/admin/reports/${reportId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });

      if (res.ok) {
        setReports(reports.map(r => 
          r.id === reportId ? { ...r, status } : r
        ));
      }
    } catch (error) {
      console.error('Failed to resolve report:', error);
    } finally {
      setResolving(null);
    }
  };

  const filteredReports = (reports || []).filter((r) => {
    if (filterStatus === 'all') return true;
    return r.status === filterStatus;
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'user':
        return <User className="h-4 w-4" />;
      case 'challenge':
        return <FileText className="h-4 w-4" />;
      default:
        return <Flag className="h-4 w-4" />;
    }
  };

  const pendingCount = (reports || []).filter(r => r.status === 'pending').length;

  return (
    <div className={`min-h-screen space-y-10 pb-20 ${isLight ? "bg-gray-100" : ""}`}>
      {/* Header Section */}
      <header className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div className={`space-y-3 ${isLight ? "text-gray-500": "text-gray-200"}`}>
          <Link 
            href="/dashboard/admin"
            className={`inline-flex items-center gap-2 text-xs font-bold transition-colors uppercase tracking-widest group ${isLight ? "text-gray-500 hover:text-gray-900" : "text-gray-500 hover:text-white"}`}
          >
            <ArrowLeft className={`${isLight ? "text-gray-500" : "text-gray-200"} h-3 w-3 group-hover:-translate-x-1 transition-transform`} />
            Back to Dashboard
          </Link>
          <div className="space-y-2">
            <h1 className={`text-2xl font-black tracking-tight lg:text-3xl ${isLight ? "text-gray-900" : "text-white"}`}>Moderation Center</h1>
            <p className={`text-xs font-medium ${isLight ? "text-gray-500" : "text-gray-400"}`}>Review flagged content and enforce community quality standards.</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className={`flex items-center gap-3 rounded-lg border px-4 py-2.5 backdrop-blur-sm ${isLight ? "border-amber-200 bg-amber-50" : "border-amber-500/10 bg-amber-500/5"}`}>
            <div className="relative flex h-2 w-2">
              <span className="animate-pulse absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-amber-500" />
            </div>
            <span className={`text-xs font-black uppercase tracking-widest ${isLight ? "text-amber-600" : "text-amber-400"}`}>
              {pendingCount} Pending
            </span>
          </div>
        </div>
      </header>

      {/* Filters */}
      <div className={`flex items-center gap-2 p-1.5 rounded-lg border backdrop-blur-sm w-full lg:w-auto overflow-x-auto no-scrollbar ${isLight ? "border-gray-200 bg-gray-50" : "border-white/5 bg-white/[0.03]"}`}>
        {(['pending', 'resolved', 'dismissed', 'all'] as const).map((status) => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${
              filterStatus === status
                ? isLight 
                  ? 'bg-gray-900 text-white shadow-xl'
                  : 'bg-white text-black shadow-xl'
                : isLight 
                  ? 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
                  : 'text-gray-500 hover:text-white hover:bg-white/5'
            }`}
          >
            {status === 'all' ? 'All Reports' : status}
          </button>
        ))}
      </div>

      {/* Main Content Area */}
      <div className={`relative rounded-[32px] border overflow-hidden shadow-2xl backdrop-blur-sm min-h-[400px] ${isLight ? "border-gray-200 bg-white" : "border-white/5 bg-white/[0.02]"}`}>
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="h-12 w-12 animate-spin rounded-full border-2 border-amber-500/20 border-t-amber-500" />
            <p className={`text-xs font-bold uppercase tracking-widest ${isLight ? "text-gray-500" : "text-gray-500"}`}>Synchronizing Queue...</p>
          </div>
        ) : filteredReports.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="py-16 flex flex-col items-center justify-center text-center px-6"
          >
            <div className={`h-20 w-20 rounded-[32px] flex items-center justify-center mb-6 border relative ${isLight ? "bg-gray-100 border-gray-200 text-gray-400" : "bg-white/[0.03] border-white/5 text-gray-600"}`}>
              <ShieldCheck className="h-10 w-10" />
              <div className={`absolute -top-2 -right-2 h-6 w-6 rounded-full border flex items-center justify-center ${isLight ? "bg-green-50 border-green-200" : "bg-emerald-500/10 border-emerald-500/20"}`}>
                <CheckCircle2 className="h-3 w-3 text-emerald-500" />
              </div>
            </div>
            
            <h3 className={`text-lg font-black tracking-tight uppercase ${isLight ? "text-gray-900" : "text-white"}`}>Queue is Clear</h3>
            <p className={`mt-2 max-w-sm mx-auto font-medium leading-relaxed text-xs ${isLight ? "text-gray-500" : "text-gray-500"}`}>
              {filterStatus === 'pending'
                ? 'Excellent work! There are no pending items requiring immediate moderation.'
                : `No ${filterStatus} records found in the current archive.`}
            </p>
            
            <div className={`mt-8 p-4 rounded-2xl border max-w-md w-full flex items-start gap-3 text-left ${isLight ? "bg-gray-50 border-gray-200" : "bg-white/[0.03] border-white/5"}`}>
              <div className={`h-8 w-8 rounded-lg border flex items-center justify-center flex-shrink-0 ${isLight ? "bg-amber-50 border-amber-200" : "bg-amber-500/10 border-amber-500/20"}`}>
                <Info className={`h-4 w-4 ${isLight ? "text-amber-600" : "text-amber-500"}`} />
              </div>
              <div className="space-y-0.5">
                <p className={`text-[10px] font-bold uppercase tracking-wider ${isLight ? "text-gray-900" : "text-white"}`}>Moderation Protocol</p>
                <p className={`text-[9px] leading-relaxed ${isLight ? "text-gray-500" : "text-gray-500"}`}>
                  Users can report inappropriate content. Approve reports to take action, or dismiss if content is acceptable.
                </p>
              </div>
            </div>
          </motion.div>
        ) : (
          <div className="p-6 space-y-4">
            {filteredReports.map((report) => (
              <motion.div
                key={report.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`rounded-2xl border p-5 ${isLight ? "border-gray-200 bg-gray-50" : "border-white/10 bg-white/[0.03]"}`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className={`h-10 w-10 rounded-lg border flex items-center justify-center ${isLight ? "bg-red-50 border-red-200 text-red-600" : "bg-red-500/10 border-red-500/20 text-red-400"}`}>
                      {getTypeIcon(report.type)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-bold uppercase ${isLight ? "text-gray-900" : "text-white"}`}>
                          {report.type}
                        </span>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full ${report.status === 'pending' 
                          ? isLight ? "bg-amber-100 text-amber-700" : "bg-amber-500/20 text-amber-400"
                          : report.status === 'resolved'
                          ? isLight ? "bg-green-100 text-green-700" : "bg-green-500/20 text-green-400"
                          : isLight ? "bg-gray-200 text-gray-500" : "bg-white/10 text-gray-500"
                        }`}>
                          {report.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 mt-2">
                        {report.reporterProfilePic ? (
                          <img src={report.reporterProfilePic} alt="" className="h-8 w-8 rounded-full object-cover border" />
                        ) : (
                          <div className={`h-8 w-8 rounded-full border flex items-center justify-center ${isLight ? "bg-gray-200 border-gray-300" : "bg-white/10 border-white/20"}`}>
                            <User className={`h-4 w-4 ${isLight ? "text-gray-500" : "text-gray-500"}`} />
                          </div>
                        )}
                        <div className="flex flex-col">
                          <p className={`text-[10px] uppercase ${isLight ? "text-gray-500" : "text-gray-500"}`}>Reporter</p>
                          <p className={`text-sm font-medium ${isLight ? "text-gray-900" : "text-white"}`}>
                            {report.reporterUsername || `User ${report.userId}`}
                          </p>
                        </div>
                        <span className={`text-xs ${isLight ? "text-gray-400" : "text-gray-600"}`}>→</span>
                        {report.targetProfilePic ? (
                          <img src={report.targetProfilePic} alt="" className="h-8 w-8 rounded-full object-cover border" />
                        ) : (
                          <div className={`h-8 w-8 rounded-full border flex items-center justify-center ${isLight ? "bg-gray-200 border-gray-300" : "bg-white/10 border-white/20"}`}>
                            <User className={`h-4 w-4 ${isLight ? "text-gray-500" : "text-gray-500"}`} />
                          </div>
                        )}
                        <div className="flex flex-col">
                          <p className={`text-[10px] uppercase ${isLight ? "text-gray-500" : "text-gray-500"}`}>Reported</p>
                          <p className={`text-sm font-medium ${isLight ? "text-gray-900" : "text-white"}`}>
                            {report.targetUsername || `ID: ${report.targetId}`}
                          </p>
                        </div>
                      </div>
                      <p className={`text-xs mt-2 ${isLight ? "text-gray-600" : "text-gray-400"}`}>
                        {report.reason} • {new Date(report.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  {report.status === 'pending' && (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleResolve(report.id, 'resolved')}
                        disabled={resolving === report.id}
                        className={`p-2 rounded-lg transition ${isLight ? "bg-green-100 text-green-600 hover:bg-green-200" : "bg-green-500/10 text-green-400 hover:bg-green-500/20"}`}
                        title="Approve"
                      >
                        {resolving === report.id ? <Clock className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                      </button>
                      <button
                        onClick={() => handleResolve(report.id, 'dismissed')}
                        disabled={resolving === report.id}
                        className={`p-2 rounded-lg transition ${isLight ? "bg-gray-100 text-gray-500 hover:bg-gray-200" : "bg-white/10 text-gray-500 hover:bg-white/20"}`}
                        title="Dismiss"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}