'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
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
  Info
} from 'lucide-react';

interface FlaggedSubmission {
  id: string;
  username: string;
  challenge_id: number;
  challenge_name: string;
  reason: string;
  flagged_at: string;
  status: 'pending' | 'approved' | 'rejected';
}

export default function ModerationPage() {
  const router = useRouter();
  const [submissions, setSubmissions] = useState<FlaggedSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>('pending');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('terminal_token');
        if (!token) {
          router.push('/login');
          return;
        }

        // Simulate fetch delay
        setTimeout(() => {
          setSubmissions([]);
          setLoading(false);
        }, 800);
      } catch (error) {
        console.error('Failed to fetch flagged submissions:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

  const filteredSubmissions = submissions.filter((s) => {
    if (filterStatus === 'all') return true;
    return s.status === filterStatus;
  });

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
            <h1 className="text-2xl font-black tracking-tight text-white lg:text-3xl">Moderation Center</h1>
            <p className="text-gray-400 text-xs font-medium">Review flagged content and enforce community quality standards.</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3 rounded-lg border border-amber-500/10 bg-amber-500/5 px-4 py-2.5 backdrop-blur-sm">
            <div className="relative flex h-2 w-2">
              <span className="animate-pulse absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-amber-500" />
            </div>
            <span className="text-xs font-black uppercase tracking-widest text-amber-400">Review Queue Active</span>
          </div>
        </div>
      </header>

      {/* Filters */}
      <div className="flex items-center gap-2 p-1.5 rounded-lg border border-white/5 bg-white/[0.03] backdrop-blur-sm w-full lg:w-auto overflow-x-auto no-scrollbar">
        {(['pending', 'approved', 'rejected', 'all'] as const).map((status) => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${
              filterStatus === status
                ? 'bg-white text-black shadow-xl'
                : 'text-gray-500 hover:text-white hover:bg-white/5'
            }`}
          >
            {status === 'all' ? 'All Activity' : status}
          </button>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="relative rounded-[32px] border border-white/5 bg-white/[0.02] overflow-hidden shadow-2xl backdrop-blur-sm min-h-[400px] flex flex-col items-center justify-center">
        {loading ? (
          <div className="flex flex-col items-center gap-4">
            <div className="h-12 w-12 animate-spin rounded-full border-2 border-amber-500/20 border-t-amber-500" />
            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Synchronizing Queue...</p>
          </div>
        ) : filteredSubmissions.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="py-16 flex flex-col items-center justify-center text-center px-6"
          >
            <div className="h-20 w-20 rounded-[32px] bg-white/[0.03] flex items-center justify-center text-gray-600 mb-6 border border-white/5 relative">
              <ShieldCheck className="h-10 w-10" />
              <div className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                <CheckCircle2 className="h-3 w-3 text-emerald-500" />
              </div>
            </div>
            
            <h3 className="text-lg font-black text-white tracking-tight uppercase">Queue is Clear</h3>
            <p className="text-gray-500 mt-2 max-w-sm mx-auto font-medium leading-relaxed text-xs">
              {filterStatus === 'pending'
                ? 'Excellent work! There are no pending items requiring immediate moderation.'
                : `No ${filterStatus} records found in the current archive.`}
            </p>
            
            <div className="mt-8 p-4 rounded-2xl bg-white/[0.03] border border-white/5 max-w-md w-full flex items-start gap-3 text-left">
              <div className="h-8 w-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center flex-shrink-0">
                <Info className="h-4 w-4 text-amber-500" />
              </div>
              <div className="space-y-0.5">
                <p className="text-[10px] font-bold text-white uppercase tracking-wider">Moderation Protocol</p>
                <p className="text-[9px] text-gray-500 leading-relaxed">
                  Content flagged by the system or users will appear here for review. Maintain platform integrity by enforcing our community guidelines.
                </p>
              </div>
            </div>
          </motion.div>
        ) : (
          <div className="w-full p-8">
            {/* List would go here */}
          </div>
        )}
      </div>
    </div>
  );
}
