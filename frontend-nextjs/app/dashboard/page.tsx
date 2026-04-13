"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import SkeletonLoader from "../components/dashboard/LoadingSkeleton";
import ProgressOverview from "../components/dashboard/ProgressOverview";
import WelcomeSection from "../components/dashboard/WelcomeSection";
import SocialsNews from "../components/dashboard/socialsnews";
import RankModal from "../components/dashboard/RankModal";
import WelcomeOnboardingModal from "../components/dashboard/WelcomeOnboardingModal";
import { clearUserSession } from "@/lib/auth";
import { Copy, Check } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

interface DashboardData {
  stats: {
    totalSolved: number;
    currentStreak: number;
    challengesWon: number;
    challengesPlayed: number;
    rank: number;
    totalPoints: number;
    easySolved: number;
    mediumSolved: number;
    hardSolved: number;
  };
  totals: {
    easy: number;
    medium: number;
    hard: number;
  };
  recentSubmissions: Array<{
    id: number;
    title: string;
    status: string;
    score: number;
    date: string;
  }>;
}

const defaultData: DashboardData = {
  stats: {
    totalSolved: 0,
    currentStreak: 0,
    challengesWon: 0,
    challengesPlayed: 0,
    rank: 0,
    totalPoints: 0,
    easySolved: 0,
    mediumSolved: 0,
    hardSolved: 0,
  },
  totals: {
    easy: 0,
    medium: 0,
    hard: 0,
  },
  recentSubmissions: [],
};

export default function DashboardPage() {
  const router = useRouter();
  const { theme } = useTheme();
  const isLight = theme === "light";

  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState("");
  const [data, setData] = useState<DashboardData>(defaultData);
  const [statsError, setStatsError] = useState("");
  const [isRankModalOpen, setIsRankModalOpen] = useState(false);
  const [isCopied, setIsCheck] = useState(false);

  const tips = useMemo(
    () => [
      "Clean code is not written, it is rewritten.",
      "The best way to learn a new language is to build something with it.",
      "Documentation is a love letter that you write to your future self.",
      "Before you start coding, spend time understanding the problem.",
      "Consistency beats intensity. Small daily steps lead to big results.",
      "Don't just solve problems, understand why the solution works.",
    ],
    []
  );

  const dailyTip = useMemo(() => {
    const dayOfYear = Math.floor(
      (new Date().getTime() -
        new Date(new Date().getFullYear(), 0, 0).getTime()) /
        (1000 * 60 * 60 * 24)
    );
    return tips[dayOfYear % tips.length];
  }, [tips]);

  const handleCopyTip = () => {
    navigator.clipboard.writeText(dailyTip);
    setIsCheck(true);
    setTimeout(() => setIsCheck(false), 2000);
  };

  useEffect(() => {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("terminal_token")
        : null;

    const name =
      typeof window !== "undefined"
        ? localStorage.getItem("user_name")
        : null;

    if (!token) {
      router.replace("/login?redirect=/dashboard");
      return;
    }

    if (name) {
      setUserName(name);
    }

    fetchDashboardData(token);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchDashboardData = async (token: string) => {
    try {
      setStatsError("");

      const res = await fetch("/api/dashboard/stats", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status === 401 || res.status === 403) {
        clearUserSession();
        router.replace(
          "/login?message=Your session has expired. Please sign in again.&redirect=/dashboard"
        );
        return;
      }

      if (!res.ok) {
        const errorText = await res.text().catch(() => "");
        console.error(
          "Dashboard stats request failed:",
          res.status,
          errorText
        );
        setData(defaultData);
        setStatsError("Live dashboard stats are unavailable right now.");
        return;
      }

      const apiData = await res.json();

      setData({
        stats: {
          totalSolved: apiData.totalSolved ?? 0,
          currentStreak: apiData.currentStreak ?? 0,
          challengesWon: apiData.challengesWon ?? 0,
          challengesPlayed: apiData.challengesPlayed ?? 0,
          rank: apiData.rank ?? 0,
          totalPoints: apiData.totalPoints ?? 0,
          easySolved: apiData.easySolved ?? 0,
          mediumSolved: apiData.mediumSolved ?? 0,
          hardSolved: apiData.hardSolved ?? 0,
        },
        totals: {
          easy: apiData.totalEasy ?? 0,
          medium: apiData.totalMedium ?? 0,
          hard: apiData.totalHard ?? 0,
        },
        recentSubmissions: Array.isArray(apiData.recentSubmissions)
          ? apiData.recentSubmissions
          : [],
      });
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
      setData(defaultData);
      setStatsError("Unable to connect to dashboard stats.");
    } finally {
      setLoading(false);
    }
  };

  const handleResetStats = async () => {
    try {
      const token = localStorage.getItem("terminal_token");
      if (!token) return;

      const res = await fetch("/api/dashboard/reset-stats", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        fetchDashboardData(token);
      }
    } catch (err) {
      console.error("Failed to reset stats:", err);
    }
  };

  if (loading) {
    return <SkeletonLoader />;
  }

  return (
    <div className="space-y-6">
      <WelcomeOnboardingModal />

      <WelcomeSection
        userName={userName || "Developer"}
        actionTitle={
          data.recentSubmissions.length > 0
            ? `Continue: ${data.recentSubmissions[0].title}`
            : "Start your next challenge"
        }
        actionSubtitle={
          data.recentSubmissions.length > 0
            ? "Jump back into your most recent learning activity and keep the momentum going."
            : "Explore challenges and begin building your progress with a focused first step."
        }
        actionButtonLabel={
          data.recentSubmissions.length > 0
            ? "Continue Learning"
            : "Start Learning"
        }
        secondaryButtonLabel="Explore Challenges"
        onActionClick={() => router.push("/dashboard/learning")}
        onSecondaryActionClick={() => router.push("/dashboard/challenges")}
      />

      {statsError && (
        <div
          className={`rounded-lg border px-4 py-3 ${
            isLight
              ? "border-pink-200 bg-pink-50"
              : "border-pink-500/20 bg-pink-500/10"
          }`}
        >
          <p
            className={`text-sm ${
              isLight ? "text-pink-700" : "text-pink-300"
            }`}
          >
            {statsError}
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <ProgressOverview
            stats={data.stats}
            totals={data.totals}
            recentSubmissions={data.recentSubmissions}
            onStartChallenge={() => router.push("/dashboard/challenges")}
            onViewProfile={() => router.push("/dashboard/profile")}
            onRankClick={() => setIsRankModalOpen(true)}
            onResetStats={handleResetStats}
          />

          <RankModal
            isOpen={isRankModalOpen}
            onClose={() => setIsRankModalOpen(false)}
            rank={data.stats.rank}
            points={data.stats.totalPoints}
            solvedStats={{
              easy: data.stats.easySolved,
              medium: data.stats.mediumSolved,
              hard: data.stats.hardSolved,
            }}
          />

          <div
            className={`rounded-xl border p-5 ${
              isLight
                ? "border-gray-200 bg-white shadow-[0_10px_30px_rgba(15,23,42,0.06)]"
                : "border-white/10 bg-[#0a0a0a]"
            }`}
          >
            <h2
              className={`mb-4 text-sm font-semibold ${
                isLight ? "text-gray-900" : "text-white"
              }`}
            >
              Quick Actions
            </h2>

            <div className="grid grid-cols-2 gap-3">
              {[
                {
                  title: "Start Challenge",
                  desc: "Solve a new problem",
                  route: "/dashboard/challenges",
                },
                {
                  title: "Leaderboard",
                  desc: "Check rankings",
                  route: "/dashboard/leaderboard",
                },
                {
                  title: "Profile",
                  desc: "View your profile",
                  route: "/dashboard/profile",
                },
                {
                  title: "Settings",
                  desc: "Manage your account",
                  route: "/dashboard/settings",
                },
              ].map((item) => (
                <button
                  key={item.title}
                  onClick={() => router.push(item.route)}
                  className={`rounded-lg border p-3 text-left transition ${
                    isLight
                      ? "border-gray-200 bg-gray-50 hover:bg-gray-100"
                      : "border-white/10 bg-white/[0.02] hover:bg-white/[0.05]"
                  }`}
                >
                  <p
                    className={`text-sm font-medium ${
                      isLight ? "text-gray-900" : "text-white"
                    }`}
                  >
                    {item.title}
                  </p>
                  <p
                    className={`mt-1 text-xs ${
                      isLight ? "text-gray-500" : "text-gray-500"
                    }`}
                  >
                    {item.desc}
                  </p>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <SocialsNews />

          <div
            className={`group relative rounded-xl border p-5 transition-all ${
              isLight
                ? "border-gray-200 bg-white shadow-[0_10px_30px_rgba(15,23,42,0.06)] hover:border-fuchsia-300"
                : "border-white/10 bg-[#0a0a0a] hover:border-fuchsia-500/30"
            }`}
          >
            <div className="mb-3 flex items-center justify-between">
              <span
                className={`text-[10px] font-bold uppercase tracking-[0.2em] ${
                  isLight ? "text-fuchsia-600" : "text-fuchsia-400"
                }`}
              >
                Daily Insight
              </span>
              <button
                onClick={handleCopyTip}
                className={`rounded-md p-1.5 transition-colors ${
                  isLight
                    ? "text-gray-500 hover:bg-gray-100 hover:text-gray-900"
                    : "text-gray-500 hover:bg-white/5 hover:text-white"
                }`}
                title="Copy to clipboard"
              >
                {isCopied ? (
                  <Check className="h-3.5 w-3.5 text-emerald-500" />
                ) : (
                  <Copy
                    className={`h-3.5 w-3.5 ${
                      isLight ? "text-gray-500" : ""
                    }`}
                  />
                )}
              </button>
            </div>
            <p
              className={`text-sm leading-relaxed ${
                isLight ? "text-gray-700" : "text-gray-300"
              }`}
            >
              {dailyTip}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}