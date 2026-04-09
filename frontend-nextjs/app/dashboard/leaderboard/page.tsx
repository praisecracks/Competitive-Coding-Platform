"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { getCountryFlag } from "@/lib/flags";

type LeaderboardEntry = {
  rank: number;
  userId: string;
  username: string;
  profilePic?: string;
  country?: string;
  totalPoints: number;
  totalSolved: number;
  currentStreak: number;
  easySolved: number;
  mediumSolved: number;
  hardSolved: number;
  lastAcceptedAt?: string;
  bio?: string;
  githubUrl?: string;
  linkedinUrl?: string;
  publicProfile?: boolean;
  userRank?: string;
};

type LeaderboardResponse = {
  entries: LeaderboardEntry[];
  total: number;
};

type SortKey =
  | "rank"
  | "username"
  | "totalPoints"
  | "totalSolved"
  | "currentStreak"
  | "lastAcceptedAt";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "/api";

function resolveProfilePicUrl(profilePic?: string): string {
  if (!profilePic) return "";
  
  const normalized = profilePic.trim();
  if (!normalized) return "";
  
  if (normalized.startsWith("http://") || normalized.startsWith("https://")) {
    return normalized;
  }
  
  if (normalized.startsWith("/uploads/")) {
    return normalized;
  }
  
  return `${API_BASE_URL}${normalized}`;
}

function humanizeLastActive(date?: string) {
  if (!date) return "—";

  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return "—";

  const now = new Date();
  const diff = now.getTime() - parsed.getTime();

  const minute = 60 * 1000;
  const hour = 60 * minute;
  const day = 24 * hour;

  if (diff < minute) return "Just now";
  if (diff < hour) return `${Math.floor(diff / minute)}m ago`;
  if (diff < day) return `${Math.floor(diff / hour)}h ago`;
  if (diff < 7 * day) return `${Math.floor(diff / day)}d ago`;

  return parsed.toLocaleDateString();
}

const ENTRIES_PER_PAGE = 10;

export default function LeaderboardPage() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [failedImages, setFailedImages] = useState<Set<string>>(new Set());
  const [sortKey, setSortKey] = useState<SortKey>("rank");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState<LeaderboardEntry | null>(null);
  const [isModalLoading, setIsModalLoading] = useState(false);
  const [currentUserPublicProfile, setCurrentUserPublicProfile] = useState(true);

  const currentUsername =
    typeof window !== "undefined"
      ? window.localStorage.getItem("user_name") || ""
      : "";

  const handleImageError = (userId: string) => {
    setFailedImages((prev) => new Set([...prev, userId]));
  };

  const fetchLeaderboard = async (showLoading = true) => {
    const token =
      typeof window !== "undefined"
        ? window.localStorage.getItem("terminal_token")
        : null;

    if (!token) {
      setErrorMessage("Your session has expired. Please log in again.");
      if (showLoading) setLoading(false);
      return;
    }

    try {
      if (showLoading) setLoading(true);
      setRefreshing(true);
      setErrorMessage("");

      const res = await fetch(`${API_BASE_URL}/leaderboard?t=${Date.now()}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
      });

      if (!res.ok) {
        const text = await res.text().catch(() => "");
        console.error("Leaderboard fetch failed:", res.status, text);
        setErrorMessage("Unable to load leaderboard right now.");
        if (showLoading) setLoading(false);
        setRefreshing(false);
        return;
      }

      const data: LeaderboardResponse = await res.json();
      setEntries(Array.isArray(data.entries) ? data.entries : []);
    } catch (error) {
      console.error("Leaderboard fetch error:", error);
      setErrorMessage("Backend is offline or unreachable.");
    } finally {
      if (showLoading) setLoading(false);
      setRefreshing(false);
    }
  };

  const fetchCurrentUserPublicProfile = async () => {
    const token = typeof window !== "undefined" ? localStorage.getItem("terminal_token") : null;
    if (!token) return;

    try {
      const res = await fetch("/api/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setCurrentUserPublicProfile(data.publicProfile !== false);
      }
    } catch (e) {
      // silently fail
    }
  };

  const openUserProfile = (entry: LeaderboardEntry) => {
    setSelectedUser(entry);
  };

  const closeUserProfile = () => {
    setSelectedUser(null);
  };

  useEffect(() => {
    fetchLeaderboard(true);
    fetchCurrentUserPublicProfile();

    const interval = setInterval(() => {
      fetchLeaderboard(false);
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const filteredEntries = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    if (!query) return entries;

    return entries.filter((entry) => {
      return (
        entry.username.toLowerCase().includes(query) ||
        (entry.country || "").toLowerCase().includes(query)
      );
    });
  }, [entries, searchQuery]);

  // Reset to first page when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const sortedEntries = useMemo(() => {
    const cloned = [...filteredEntries];

    cloned.sort((a, b) => {
      let result = 0;

      switch (sortKey) {
        case "rank":
          result = a.rank - b.rank;
          break;
        case "username":
          result = a.username.localeCompare(b.username);
          break;
        case "totalPoints":
          result = a.totalPoints - b.totalPoints;
          break;
        case "totalSolved":
          result = a.totalSolved - b.totalSolved;
          break;
        case "currentStreak":
          result = a.currentStreak - b.currentStreak;
          break;
        case "lastAcceptedAt": {
          const aTime = a.lastAcceptedAt ? new Date(a.lastAcceptedAt).getTime() : 0;
          const bTime = b.lastAcceptedAt ? new Date(b.lastAcceptedAt).getTime() : 0;
          result = aTime - bTime;
          break;
        }
      }

      return sortDirection === "asc" ? result : -result;
    });

    return cloned;
  }, [filteredEntries, sortKey, sortDirection]);

  // Pagination calculations
  const totalPages = Math.ceil(sortedEntries.length / ENTRIES_PER_PAGE);
  const startIndex = (currentPage - 1) * ENTRIES_PER_PAGE;
  const endIndex = startIndex + ENTRIES_PER_PAGE;
  const paginatedEntries = sortedEntries.slice(startIndex, endIndex);

  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const totals = useMemo(() => {
    return filteredEntries.reduce(
      (acc, entry) => {
        acc.points += entry.totalPoints;
        acc.solved += entry.totalSolved;
        acc.streak += entry.currentStreak;
        return acc;
      },
      { points: 0, solved: 0, streak: 0 }
    );
  }, [filteredEntries]);

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
      return;
    }

    setSortKey(key);

    if (key === "username" || key === "rank") {
      setSortDirection("asc");
      return;
    }

    setSortDirection("desc");
  };

  const isCurrentUser = (entry: LeaderboardEntry) =>
    currentUsername &&
    entry.username.toLowerCase() === currentUsername.toLowerCase();

  const SortHeader = ({
    label,
    value,
    align = "left",
  }: {
    label: string;
    value: SortKey;
    align?: "left" | "center" | "right";
  }) => (
    <button
      type="button"
      onClick={() => toggleSort(value)}
      className={`inline-flex items-center gap-1 text-[11px] font-medium uppercase tracking-[0.16em] text-gray-500 transition hover:text-gray-300 ${
        align === "center"
          ? "justify-center"
          : align === "right"
          ? "justify-end"
          : "justify-start"
      }`}
    >
      <span>{label}</span>
      <span className="text-[10px]">
        {sortKey === value ? (sortDirection === "asc" ? "↑" : "↓") : "↕"}
      </span>
    </button>
  );

  return (
    <div className="min-h-screen bg-[#050507] text-white">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <div className="mb-6 overflow-hidden rounded-[28px] border border-white/10 bg-[#0a0a0a]">
          <div className="border-b border-white/10 px-5 py-5 sm:px-6 sm:py-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-3xl">
                <span className="inline-flex rounded-full border border-pink-500/20 bg-pink-500/10 px-3 py-1 text-[11px] uppercase tracking-[0.16em] text-pink-200">
                  Global Ranking
                </span>

                <h1 className="mt-4 text-xl font-semibold tracking-tight text-white sm:text-2xl">
                  CODEMASTER Leaderboard
                </h1>

                <p className="mt-2 max-w-2xl text-xs leading-6 text-gray-400 sm:text-sm">
                  Clean rankings • Compete on points • Build streaks
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <Link
                  href="/dashboard"
                  className="inline-flex h-10 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04] px-3 text-xs font-medium text-white transition hover:bg-white/[0.08]"
                >
                  Dashboard
                </Link>

                <Link
                  href="/dashboard/challenges"
                  className="inline-flex h-10 items-center justify-center rounded-lg bg-gradient-to-r from-pink-500 to-purple-500 px-3 text-xs font-medium text-white transition hover:opacity-95"
                >
                  Solve
                </Link>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 px-5 py-5 sm:grid-cols-2 sm:px-6 lg:grid-cols-4">
            <div className="rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2.5">
              <p className="text-[9px] uppercase tracking-[0.16em] text-gray-500">
                Users
              </p>
              <p className="mt-1 text-base font-semibold text-white">
                {filteredEntries.length}
              </p>
            </div>

            <div className="rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2.5">
              <p className="text-[9px] uppercase tracking-[0.16em] text-gray-500">
                Points
              </p>
              <p className="mt-1 text-base font-semibold text-white">
                {totals.points}
              </p>
            </div>

            <div className="rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2.5">
              <p className="text-[9px] uppercase tracking-[0.16em] text-gray-500">
                Solved
              </p>
              <p className="mt-1 text-base font-semibold text-white">
                {totals.solved}
              </p>
            </div>

            <div className="rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2.5 sm:col-span-2 lg:col-span-1">
              <p className="text-[9px] uppercase tracking-[0.16em] text-gray-500">
                Streak
              </p>
              <p className="mt-1 text-base font-semibold text-white">
                {totals.streak}
              </p>
            </div>
          </div>
        </div>

        <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-medium text-white">Search</p>
            <p className="mt-0.5 text-xs text-gray-500">
              Find by username or country
            </p>
          </div>

          <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center">
            <div className="w-full sm:w-[280px]">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search..."
                className="w-full rounded-lg border border-white/10 bg-[#0a0a0a] px-3 py-2 text-xs text-white outline-none placeholder:text-gray-500 transition focus:border-pink-500/30"
              />
            </div>

            <button
              onClick={() => fetchLeaderboard(true)}
              disabled={refreshing}
              className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-xs font-medium text-white transition hover:bg-white/[0.08] disabled:cursor-not-allowed disabled:opacity-50"
              type="button"
            >
              <svg
                className={`h-3.5 w-3.5 ${refreshing ? "animate-spin" : ""}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              {refreshing ? "..." : "Refresh"}
            </button>
          </div>
        </div>

        {loading ? (
          <div className="rounded-[28px] border border-white/10 bg-[#0a0a0a] px-6 py-20 text-center">
            <p className="text-sm text-gray-400">Loading leaderboard...</p>
          </div>
        ) : errorMessage ? (
          <div className="rounded-[28px] border border-red-500/15 bg-red-500/[0.05] px-6 py-16 text-center">
            <p className="text-sm font-medium text-red-200">
              Unable to load leaderboard
            </p>
            <p className="mx-auto mt-2 max-w-xl text-sm leading-7 text-gray-300">
              {errorMessage}
            </p>
          </div>
        ) : sortedEntries.length === 0 ? (
          <div className="rounded-[28px] border border-white/10 bg-[#0a0a0a] px-6 py-16 text-center">
            <p className="text-sm font-medium text-white">No leaderboard data yet</p>
            <p className="mx-auto mt-2 max-w-xl text-sm leading-7 text-gray-400">
              Once users begin solving accepted challenges, rankings will appear here.
            </p>
          </div>
        ) : (
          <>
            <div className="hidden overflow-hidden rounded-[28px] border border-white/10 bg-[#0a0a0a] lg:block">
              <div className="overflow-x-auto">
                <table className="min-w-full border-collapse">
                  <thead className="bg-white/[0.02]">
                    <tr className="border-b border-white/10">
                      <th className="px-6 py-4 text-left">
                        <SortHeader label="Rank" value="rank" />
                      </th>
                      <th className="px-6 py-4 text-left">
                        <SortHeader label="Player" value="username" />
                      </th>
                      <th className="px-6 py-4 text-left">
                        <SortHeader label="Points" value="totalPoints" />
                      </th>
                      <th className="px-6 py-4 text-left">
                        <SortHeader label="Solved" value="totalSolved" />
                      </th>
                      <th className="px-6 py-4 text-left">
                        <SortHeader label="Streak" value="currentStreak" />
                      </th>
                      <th className="px-6 py-4 text-left">
                        <SortHeader label="Last Active" value="lastAcceptedAt" />
                      </th>
                      <th className="px-6 py-4 text-left">
                        <span className="text-[11px] font-medium uppercase tracking-[0.16em] text-gray-500">
                          Difficulty Mix
                        </span>
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {paginatedEntries.map((entry) => {
                      const currentUser = isCurrentUser(entry);

                      return (
                        <tr
                          key={entry.userId}
                          className={`border-b border-white/5 transition ${
                            currentUser
                              ? "bg-pink-500/[0.06]"
                              : "hover:bg-white/[0.02]"
                          }`}
                        >
                          <td className="px-6 py-4 align-middle">
                            <span
                              className={`inline-flex min-w-[56px] items-center justify-center rounded-full border px-3 py-1 text-[11px] font-medium ${
                                entry.rank === 1
                                  ? "border-yellow-500/20 bg-yellow-500/10 text-yellow-200"
                                  : entry.rank === 2
                                  ? "border-slate-400/20 bg-slate-400/10 text-slate-200"
                                  : entry.rank === 3
                                  ? "border-orange-500/20 bg-orange-500/10 text-orange-200"
                                  : currentUser
                                  ? "border-pink-500/20 bg-pink-500/10 text-pink-200"
                                  : "border-white/10 bg-white/[0.03] text-gray-300"
                              }`}
                            >
                              #{entry.rank}
                            </span>
                          </td>

                          <td className="px-6 py-4 align-middle">
                            <button
                              type="button"
                              onClick={() => openUserProfile(entry)}
                              className="flex min-w-0 items-center gap-3 text-left hover:opacity-80 transition"
                            >
                              {entry.profilePic && !failedImages.has(entry.userId) ? (
                                <img
                                  src={resolveProfilePicUrl(entry.profilePic)}
                                  alt={entry.username}
                                  className="h-11 w-11 rounded-xl border border-white/10 object-cover"
                                  onError={() => handleImageError(entry.userId)}
                                />
                              ) : (
                                <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-xs font-semibold text-pink-200">
                                  {entry.username.slice(0, 2).toUpperCase()}
                                </div>
                              )}

                              <div className="min-w-0">
                                <p className="truncate text-sm font-semibold text-white">
                                  {entry.username}
                                  {entry.country && (
                                    <span className="ml-1.5 text-xs">
                                      {getCountryFlag(entry.country)}
                                    </span>
                                  )}
                                  {currentUser ? (
                                    <span className="ml-2 rounded-full border border-pink-500/20 bg-pink-500/10 px-2 py-0.5 text-[10px] font-medium text-pink-200">
                                      You
                                    </span>
                                  ) : null}
                                </p>
                                <p className="mt-0.5 text-xs text-gray-500">
                                  Competitive coder
                                </p>
                              </div>
                            </button>
                          </td>

                          <td className="px-6 py-4 align-middle text-sm font-semibold text-white">
                            {entry.totalPoints}
                          </td>

                          <td className="px-6 py-4 align-middle text-sm font-semibold text-white">
                            {entry.totalSolved}
                          </td>

                          <td className="px-6 py-4 align-middle text-sm font-semibold text-white">
                            {entry.currentStreak}
                          </td>

                          <td className="px-6 py-4 align-middle text-sm text-gray-300">
                            {humanizeLastActive(entry.lastAcceptedAt)}
                          </td>

                          <td className="px-6 py-4 align-middle">
                            <div className="flex flex-wrap gap-1.5">
                              <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 text-[10px] text-emerald-300">
                                E {entry.easySolved}
                              </span>
                              <span className="rounded-full border border-yellow-500/20 bg-yellow-500/10 px-2.5 py-1 text-[10px] text-yellow-300">
                                M {entry.mediumSolved}
                              </span>
                              <span className="rounded-full border border-red-500/20 bg-red-500/10 px-2.5 py-1 text-[10px] text-red-300">
                                H {entry.hardSolved}
                              </span>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="space-y-3 lg:hidden">
              {paginatedEntries.map((entry) => {
                const currentUser = isCurrentUser(entry);

                return (
                  <button
                    key={entry.userId}
                    type="button"
                    onClick={() => openUserProfile(entry)}
                    className={`w-full rounded-[24px] border border-white/10 bg-[#0a0a0a] p-4 text-left ${currentUser ? "ring-1 ring-pink-500/20" : ""}`}
                  >
                    <div className="mb-4 flex items-start justify-between gap-3">
                      <div className="flex min-w-0 items-center gap-3">
                        {entry.profilePic && !failedImages.has(entry.userId) ? (
                          <img
                            src={resolveProfilePicUrl(entry.profilePic)}
                            alt={entry.username}
                            className="h-11 w-11 rounded-xl border border-white/10 object-cover"
                            onError={() => handleImageError(entry.userId)}
                          />
                        ) : (
                          <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-xs font-semibold text-pink-200">
                            {entry.username.slice(0, 2).toUpperCase()}
                          </div>
                        )}

                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-white">
                            {entry.username}
                            {entry.country && (
                              <span className="ml-1.5 text-xs">
                                {getCountryFlag(entry.country)}
                              </span>
                            )}
                            {currentUser ? (
                              <span className="ml-2 rounded-full border border-pink-500/20 bg-pink-500/10 px-2 py-0.5 text-[10px] font-medium text-pink-200">
                                You
                              </span>
                            ) : null}
                          </p>
                          <p className="mt-1 text-xs text-gray-500">
                            {humanizeLastActive(entry.lastAcceptedAt)}
                          </p>
                        </div>
                      </div>

                      <span className="inline-flex min-w-[56px] items-center justify-center rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-[11px] font-medium text-gray-300">
                        #{entry.rank}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="rounded-xl border border-white/10 bg-black/20 px-3 py-3">
                        <p className="text-[10px] uppercase tracking-[0.15em] text-gray-500">
                          Points
                        </p>
                        <p className="mt-1 text-sm font-semibold text-white">
                          {entry.totalPoints}
                        </p>
                      </div>

                      <div className="rounded-xl border border-white/10 bg-black/20 px-3 py-3">
                        <p className="text-[10px] uppercase tracking-[0.15em] text-gray-500">
                          Solved
                        </p>
                        <p className="mt-1 text-sm font-semibold text-white">
                          {entry.totalSolved}
                        </p>
                      </div>

                      <div className="rounded-xl border border-white/10 bg-black/20 px-3 py-3">
                        <p className="text-[10px] uppercase tracking-[0.15em] text-gray-500">
                          Streak
                        </p>
                        <p className="mt-1 text-sm font-semibold text-white">
                          {entry.currentStreak}
                        </p>
                      </div>

                      <div className="rounded-xl border border-white/10 bg-black/20 px-3 py-3">
                        <p className="text-[10px] uppercase tracking-[0.15em] text-gray-500">
                          Difficulty
                        </p>
                        <p className="mt-1 text-sm font-medium text-white">
                          E {entry.easySolved} · M {entry.mediumSolved} · H{" "}
                          {entry.hardSolved}
                        </p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {totalPages > 1 && (
              <div className="mt-6 flex items-center justify-between rounded-[24px] border border-white/10 bg-[#0a0a0a] px-5 py-4 sm:px-6">
                <button
                  onClick={handlePreviousPage}
                  disabled={currentPage === 1}
                  className="inline-flex items-center justify-center rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-xs font-medium text-white transition hover:bg-white/[0.08] disabled:cursor-not-allowed disabled:opacity-50"
                  type="button"
                >
                  ← Previous
                </button>

                <div className="flex items-center justify-center gap-2">
                  <span className="text-xs font-medium text-gray-400">
                    Page <span className="text-white">{currentPage}</span> of{" "}
                    <span className="text-white">{totalPages}</span>
                  </span>
                </div>

                <button
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                  className="inline-flex items-center justify-center rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-xs font-medium text-white transition hover:bg-white/[0.08] disabled:cursor-not-allowed disabled:opacity-50"
                  type="button"
                >
                  Next →
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* User Profile Modal */}
      {selectedUser && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/75 backdrop-blur-sm"
            onClick={closeUserProfile}
          />
          <div className="relative w-full max-w-md overflow-hidden rounded-[26px] border border-white/10 bg-[#0b0b10] shadow-[0_25px_100px_rgba(0,0,0,0.45)]">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-pink-500/50 to-transparent" />
            
            <div className="p-5 sm:p-6">
              <div className="mb-5 flex items-start justify-between gap-4">
                <div className="flex items-center gap-4">
                  {selectedUser.profilePic && !failedImages.has(selectedUser.userId) ? (
                    <img
                      src={resolveProfilePicUrl(selectedUser.profilePic)}
                      alt={selectedUser.username}
                      className="h-16 w-16 rounded-2xl border border-white/10 object-cover"
                    />
                  ) : (
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-xl font-semibold text-pink-200">
                      {selectedUser.username.slice(0, 2).toUpperCase()}
                    </div>
                  )}
                  <div>
                    <h3 className="text-lg font-semibold text-white">
                      {selectedUser.username}
                    </h3>
                    {selectedUser.country && (
                      <p className="text-sm text-gray-400">
                        {getCountryFlag(selectedUser.country)} {selectedUser.country}
                      </p>
                    )}
                  </div>
                </div>

                <button
                  onClick={closeUserProfile}
                  className="rounded-full border border-white/10 px-2.5 py-1 text-xs text-gray-400 transition hover:border-white/20 hover:text-white"
                >
                  ✕
                </button>
              </div>

              {selectedUser.bio ? (
                <p className="mb-5 text-sm leading-6 text-gray-300">
                  {selectedUser.bio}
                </p>
              ) : (
                <p className="mb-5 text-sm text-gray-500 italic">
                  No bio available
                </p>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-white/10 bg-white/[0.03] px-3 py-3">
                  <p className="text-[10px] uppercase tracking-[0.15em] text-gray-500">
                    XP
                  </p>
                  <p className="mt-1 text-base font-semibold text-white">
                    {selectedUser.totalPoints.toLocaleString()}
                  </p>
                </div>

                <div className="rounded-xl border border-white/10 bg-white/[0.03] px-3 py-3">
                  <p className="text-[10px] uppercase tracking-[0.15em] text-gray-500">
                    Rank
                  </p>
                  <p className="mt-1 text-base font-semibold text-white">
                    {selectedUser.userRank || "Beginner"}
                  </p>
                </div>
              </div>

              <div className="mt-5 flex flex-wrap gap-2">
                {selectedUser.githubUrl && (
                  <a
                    href={selectedUser.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs text-gray-300 transition hover:bg-white/[0.06] hover:text-white"
                  >
                    <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
                    </svg>
                    GitHub
                  </a>
                )}
                {selectedUser.linkedinUrl && (
                  <a
                    href={selectedUser.linkedinUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs text-gray-300 transition hover:bg-white/[0.06] hover:text-white"
                  >
                    <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451c.979 0 1.771-.773 1.771-1.729V1.729C24 .774 23.204 0 22.225 0zM7.119 20.452H3.555V9h3.564v11.452zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zM20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286z"/>
                    </svg>
                    LinkedIn
                  </a>
                )}
              </div>

              {selectedUser.publicProfile === false && !isCurrentUser(selectedUser) && (
                <p className="mt-4 text-[10px] text-gray-600 text-center">
                  This user has limited their profile visibility
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}