// app/components/dashboard/RecentActivity.tsx
"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

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

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "text-green-400 bg-green-500/10";
      case "attempted":
        return "text-yellow-400 bg-yellow-500/10";
      case "failed":
        return "text-red-400 bg-red-500/10";
      default:
        return "text-gray-400 bg-gray-500/10";
    }
  };

  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-white">Recent Activity</h2>
        <span className="text-xs text-gray-500">Last 7 days</span>
      </div>

      <div className="space-y-3">
        {submissions.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 text-sm">No submissions yet</p>
            <button
              onClick={() => router.push("/challenges")}
              className="mt-3 text-pink-400 text-sm hover:text-pink-300"
            >
              Start your first challenge →
            </button>
          </div>
        ) : (
          submissions.map((submission, index) => (
            <motion.div
              key={submission.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="flex items-center justify-between p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-all cursor-pointer group"
              onClick={() => router.push(`/challenges/${submission.id}`)}
            >
              <div className="flex-1">
                <p className="text-white font-medium group-hover:text-pink-400 transition-colors">
                  {submission.title}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <p className="text-xs text-gray-500">{submission.date}</p>
                  {submission.language && (
                    <>
                      <span className="text-gray-600">•</span>
                      <p className="text-xs text-gray-500">{submission.language}</p>
                    </>
                  )}
                </div>
              </div>
              <div className="text-right">
                <span className={`text-xs font-medium px-2 py-1 rounded-full ${getStatusColor(submission.status)}`}>
                  {submission.status}
                </span>
                {submission.score && (
                  <p className="text-xs text-gray-500 mt-1">Score: {submission.score}</p>
                )}
              </div>
            </motion.div>
          ))
        )}
      </div>

      {submissions.length > 0 && (
        <button
          onClick={() => router.push("/submissions")}
          className="w-full mt-4 px-4 py-2 text-center text-sm text-pink-400 hover:text-pink-300 transition-colors border-t border-white/10 pt-4"
        >
          View All Activity →
        </button>
      )}
    </div>
  );
}