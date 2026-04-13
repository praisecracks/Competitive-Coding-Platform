"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  CheckCircle2,
  AlertCircle,
  XCircle,
  Clock3,
  ChevronRight,
} from "lucide-react";

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

export default function RecentActivity({
  submissions,
}: RecentActivityProps) {
  const router = useRouter();

  const getStatusMeta = (status: string) => {
    const normalized = status.toLowerCase();

    switch (normalized) {
      case "completed":
      case "accepted":
        return {
          label: "Accepted",
          className:
            "text-emerald-700 bg-emerald-50 border border-emerald-200 dark:text-emerald-300 dark:bg-emerald-500/10 dark:border-emerald-500/15",
          icon: <CheckCircle2 className="h-3.5 w-3.5" />,
        };

      case "attempted":
      case "pending":
        return {
          label: "Attempted",
          className:
            "text-amber-700 bg-amber-50 border border-amber-200 dark:text-amber-300 dark:bg-amber-500/10 dark:border-amber-500/15",
          icon: <Clock3 className="h-3.5 w-3.5" />,
        };

      case "failed":
      case "rejected":
        return {
          label: "Failed",
          className:
            "text-rose-700 bg-rose-50 border border-rose-200 dark:text-rose-300 dark:bg-rose-500/10 dark:border-rose-500/15",
          icon: <XCircle className="h-3.5 w-3.5" />,
        };

      case "runtime error":
      case "runtime_error":
      case "error":
        return {
          label: "Runtime Error",
          className:
            "text-orange-700 bg-orange-50 border border-orange-200 dark:text-orange-300 dark:bg-orange-500/10 dark:border-orange-500/15",
          icon: <AlertCircle className="h-3.5 w-3.5" />,
        };

      default:
        return {
          label: status,
          className:
            "text-slate-700 bg-slate-100 border border-slate-200 dark:text-gray-300 dark:bg-white/5 dark:border-white/10",
          icon: <Clock3 className="h-3.5 w-3.5" />,
        };
    }
  };

  return (
    <div
      className="
        rounded-[24px]
        border border-slate-200/90
        bg-white
        p-4 shadow-[0_8px_30px_rgba(15,23,42,0.06)]
        sm:p-5
        dark:border-white/10
        dark:bg-[#09090c]
        dark:shadow-none
      "
    >
      <div className="mb-5 flex items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold tracking-tight text-slate-900 sm:text-lg dark:text-white">
            Recent Activity
          </h2>
          <p className="mt-1 text-xs text-slate-500 sm:text-sm dark:text-gray-500">
            Your latest challenge submissions and learning activity.
          </p>
        </div>

        <span
          className="
            rounded-full
            border border-slate-200
            bg-slate-50
            px-2.5 py-1
            text-[10px] font-medium uppercase tracking-[0.16em]
            text-slate-500
            sm:text-[11px]
            dark:border-white/10
            dark:bg-white/[0.03]
            dark:text-gray-500
          "
        >
          Last 7 days
        </span>
      </div>

      <div className="space-y-3">
        {submissions.length === 0 ? (
          <div
            className="
              rounded-[20px]
              border border-slate-200
              bg-slate-50/80
              px-4 py-8 text-center
              shadow-[0_4px_18px_rgba(15,23,42,0.04)]
              sm:px-6
              dark:border-white/10
              dark:bg-white/[0.03]
              dark:shadow-none
            "
          >
            <div
              className="
                mx-auto mb-3 flex h-12 w-12 items-center justify-center
                rounded-2xl border border-slate-200
                bg-white
                text-slate-500
                shadow-sm
                dark:border-white/10
                dark:bg-white/[0.04]
                dark:text-gray-400
                dark:shadow-none
              "
            >
              <Clock3 className="h-5 w-5" />
            </div>

            <p className="text-sm font-medium text-slate-900 dark:text-white">
              No submissions yet
            </p>
            <p className="mt-1 text-sm leading-6 text-slate-500 dark:text-gray-500">
              Start your first challenge and your activity will appear here.
            </p>

            <button
              onClick={() => router.push("/dashboard/challenges")}
              className="
                mt-4 inline-flex items-center gap-2
                rounded-xl border border-pink-200
                bg-pink-50
                px-4 py-2.5 text-sm font-medium text-pink-700
                transition hover:bg-pink-100
                dark:border-pink-500/20
                dark:bg-pink-500/[0.08]
                dark:text-pink-300
                dark:hover:bg-pink-500/[0.12]
              "
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
                onClick={() =>
                  router.push(`/dashboard/challenges/${submission.id}`)
                }
                className="
                  group w-full rounded-[20px]
                  border border-slate-200
                  bg-white
                  p-4 text-left
                  shadow-[0_6px_22px_rgba(15,23,42,0.05)]
                  transition duration-200
                  hover:border-pink-200
                  hover:bg-pink-50/30
                  hover:shadow-[0_10px_28px_rgba(236,72,153,0.08)]
                  dark:border-white/10
                  dark:bg-white/[0.03]
                  dark:shadow-none
                  dark:hover:border-pink-500/20
                  dark:hover:bg-white/[0.05]
                "
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <p className="truncate pr-2 text-sm font-medium text-slate-900 transition-colors group-hover:text-pink-700 sm:text-[15px] dark:text-white dark:group-hover:text-pink-200">
                        {submission.title}
                      </p>

                      <ChevronRight className="mt-0.5 h-4 w-4 shrink-0 text-slate-400 transition group-hover:text-pink-500 dark:text-gray-600 dark:group-hover:text-pink-300" />
                    </div>

                    <div className="mt-2 flex flex-wrap items-center gap-2 text-[11px] text-slate-500 sm:text-xs dark:text-gray-500">
                      <span>{submission.date}</span>

                      {submission.language && (
                        <>
                          <span className="text-slate-300 dark:text-gray-600">
                            •
                          </span>
                          <span>{submission.language}</span>
                        </>
                      )}

                      {typeof submission.score === "number" &&
                        submission.score > 0 && (
                          <>
                            <span className="text-slate-300 dark:text-gray-600">
                              •
                            </span>
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
          className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-pink-600 transition hover:text-pink-700 dark:text-pink-400 dark:hover:text-pink-300"
        >
          View all activity
          <ChevronRight className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}