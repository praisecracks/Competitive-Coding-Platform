"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { CheckCircle2, AlertCircle, XCircle, Clock3, ChevronRight } from "lucide-react";

interface Submission {
  id: number;
  title: string;
  status: string;
  score: number;
  date: string;
  language?: string;
}

interface RecentActivityProps {
  submissions: Submission[];
}

export default function RecentActivity({ submissions }: RecentActivityProps) {
  const router = useRouter();

  const getStatusMeta = (status: string) => {
    const normalized = status.toLowerCase();

    switch (normalized) {
      case "completed":
      case "accepted":
        return {
          label: "Accepted",
          className: "text-emerald-300 bg-emerald-500/10 border border-emerald-500/15",
          icon: <CheckCircle2 className="h-3.5 w-3.5" />,
        };

      case "attempted":
      case "pending":
        return {
          label: "Attempted",
          className: "text-amber-300 bg-amber-500/10 border border-amber-500/15",
          icon: <Clock3 className="h-3.5 w-3.5" />,
        };

      case "failed":
      case "rejected":
        return {
          label: "Failed",
          className: "text-rose-300 bg-rose-500/10 border border-rose-500/15",
          icon: <XCircle className="h-3.5 w-3.5" />,
        };

      case "runtime error":
      case "runtime_error":
      case "error":
        return {
          label: "Runtime Error",
          className: "text-orange-300 bg-orange-500/10 border border-orange-500/15",
          icon: <AlertCircle className="h-3.5 w-3.5" />,
        };

      default:
        return {
          label: status,
          className: "text-gray-300 bg-white/5 border border-white/10",
          icon: <Clock3 className="h-3.5 w-3.5" />,
        };
    }
  };

  return (
    <div className="rounded-[24px] border border-white/10 bg-[#09090c] p-4 sm:p-5">
      <div className="mb-5 flex items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold tracking-tight text-white sm:text-lg">
            Recent Activity
          </h2>
          <p className="mt-1 text-xs text-gray-500 sm:text-sm">
            Your latest challenge submissions and learning activity.
          </p>
        </div>

        <span className="rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.16em] text-gray-500 sm:text-[11px]">
          Last 7 days
        </span>
      </div>

      <div className="space-y-3">
        {submissions.length === 0 ? (
          <div className="rounded-[20px] border border-white/10 bg-white/[0.03] px-4 py-8 text-center sm:px-6">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-gray-400">
              <Clock3 className="h-5 w-5" />
            </div>

            <p className="text-sm font-medium text-white">No submissions yet</p>
            <p className="mt-1 text-sm leading-6 text-gray-500">
              Start your first challenge and your activity will appear here.
            </p>

            <button
              onClick={() => router.push("/dashboard/challenges")}
              className="mt-4 inline-flex items-center gap-2 rounded-xl border border-pink-500/20 bg-pink-500/[0.08] px-4 py-2.5 text-sm font-medium text-pink-300 transition hover:bg-pink-500/[0.12]"
            >
              Start your first challenge
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        ) : (
          submissions.map((submission, index) => {
            const statusMeta = getStatusMeta(submission.status);

            return (
              <motion.button
                key={`${submission.id}-${submission.title}-${submission.date}-${index}`}
                type="button"
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05, duration: 0.25 }}
                onClick={() => router.push(`/dashboard/challenges/${submission.id}`)}
                className="group w-full rounded-[20px] border border-white/10 bg-white/[0.03] p-4 text-left transition duration-200 hover:border-pink-500/20 hover:bg-white/[0.05]"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <p className="truncate pr-2 text-sm font-medium text-white transition-colors group-hover:text-pink-200 sm:text-[15px]">
                        {submission.title}
                      </p>

                      <ChevronRight className="mt-0.5 h-4 w-4 shrink-0 text-gray-600 transition group-hover:text-pink-300" />
                    </div>

                    <div className="mt-2 flex flex-wrap items-center gap-2 text-[11px] text-gray-500 sm:text-xs">
                      <span>{submission.date}</span>

                      {submission.language && (
                        <>
                          <span className="text-gray-600">•</span>
                          <span>{submission.language}</span>
                        </>
                      )}

                      {typeof submission.score === "number" && submission.score > 0 && (
                        <>
                          <span className="text-gray-600">•</span>
                          <span>Score: {submission.score}</span>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="shrink-0">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium ${statusMeta.className}`}
                    >
                      {statusMeta.icon}
                      {statusMeta.label}
                    </span>
                  </div>
                </div>
              </motion.button>
            );
          })
        )}
      </div>

      {submissions.length > 0 && (
        <button
          onClick={() => router.push("/dashboard/submissions")}
          className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-pink-400 transition hover:text-pink-300"
        >
          View all activity
          <ChevronRight className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}