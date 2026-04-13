"use client";

import { useEffect, useState, useCallback, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useTheme } from "@/app/context/ThemeContext";

interface Challenge {
  id: number;
  title: string;
  difficulty: string;
  category: string;
  duration: number;
}

interface User {
  id: string;
  username: string;
  profilePic?: string;
  rank?: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "/api";
const IS_PRODUCTION = process.env.NODE_ENV === "production";

function resolveAssetUrl(path?: string | null) {
  if (!path) return null;

  if (path.startsWith("http://") || path.startsWith("https://")) {
    const productionDomain = "codemaster-q9oo.onrender.com";
    if (path.includes(productionDomain)) {
      if (IS_PRODUCTION) {
        return path;
      }
      const url = new URL(path);
      return `/api${url.pathname}`;
    }
    return path;
  }

  let cleanPath = path.trim().replace(/\/+/g, "/");
  if (cleanPath.startsWith("/")) cleanPath = cleanPath.substring(1);

  if (!cleanPath.includes("/")) {
    return `/api/uploads/profiles/${cleanPath}`;
  }

  return `/api/${cleanPath}`;
}

function DuoCreateForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { theme } = useTheme();
  const isLight = theme === "light";
  const challengeId = searchParams.get("challengeId");

  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [loadingChallenge, setLoadingChallenge] = useState(true);
  const [searchId, setSearchId] = useState("");
  const [searching, setSearching] = useState(false);
  const [foundUser, setFoundUser] = useState<User | null>(null);
  const [error, setError] = useState("");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [inviteState, setInviteState] = useState<"idle" | "waiting" | "declined" | "expired">("idle");
  const [countdown, setCountdown] = useState(120);
  const [activeDuelId, setActiveDuelId] = useState<string | null>(null);
  const [duelCountdown, setDuelCountdown] = useState<number | null>(null);

  const pollInterval = 1000;

  useEffect(() => {
    if (!challengeId) {
      router.push("/dashboard/challenges");
      return;
    }

    const fetchChallenge = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/challenges/${challengeId}`);
        if (res.ok) {
          const data = await res.json();
          setChallenge(data);
        }
      } catch (err) {
        console.error("Failed to fetch challenge", err);
      } finally {
        setLoadingChallenge(false);
      }
    };

    fetchChallenge();
  }, [challengeId, router]);

  const handleSearch = async () => {
    if (!searchId.trim()) return;
    setSearching(true);
    setError("");
    setFoundUser(null);

    try {
      const token = localStorage.getItem("terminal_token");
      const res = await fetch(`/api/users/search?q=${searchId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.ok) {
        const data = await res.json();
        setFoundUser(data);
      } else {
        setError("User not found. Please check the ID or Username.");
      }
    } catch (err) {
      setError("Search failed. Try again later.");
    } finally {
      setSearching(false);
    }
  };

  const sendInvite = async () => {
    if (!foundUser || !challenge) return;
    setShowConfirmModal(false);
    setError("");

    try {
      const token = localStorage.getItem("terminal_token");
      const res = await fetch(`${API_BASE_URL}/duo/invite`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          challenge_id: challenge.id,
          opponent_id: foundUser.id,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const duelId = data.duel_id || data.id;

        if (!duelId) {
          setError("Invite was sent, but duel ID was not returned.");
          return;
        }

        setActiveDuelId(duelId);
        setInviteState("waiting");
        setCountdown(120);
        setDuelCountdown(null);
      } else {
        const data = await res.json().catch(() => ({}));
        setError(data.error || "Failed to send invitation.");
      }
    } catch (err) {
      setError("Communication failure. Try again later.");
    }
  };

  const cancelInvite = () => {
    setInviteState("idle");
    setCountdown(120);
    setActiveDuelId(null);
    setDuelCountdown(null);
  };

  const checkDuelStatus = useCallback(async () => {
    if (!activeDuelId) return;

    try {
      const token = localStorage.getItem("terminal_token");
      const res = await fetch(`${API_BASE_URL}/duo/status/${activeDuelId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) return;

      const data = await res.json();

      if (data.status === "accepted") {
        const acceptedAt = data.accepted_at
          ? new Date(data.accepted_at).getTime()
          : Date.now();

        const now = Date.now();
        const elapsedSeconds = Math.floor((now - acceptedAt) / 1000);
        const remainingSeconds = Math.max(0, 5 - elapsedSeconds);

        setDuelCountdown(remainingSeconds);
      } else if (data.status === "declined") {
        setInviteState("declined");
        setActiveDuelId(null);
        setDuelCountdown(null);
      } else if (data.status === "expired") {
        setInviteState("expired");
        setActiveDuelId(null);
        setDuelCountdown(null);
      }
    } catch (err) {
      console.error("Polling status error:", err);
    }
  }, [activeDuelId]);

  useEffect(() => {
    if (duelCountdown === null) return;

    if (duelCountdown > 0) {
      const timer = setTimeout(() => setDuelCountdown(duelCountdown - 1), 1000);
      return () => clearTimeout(timer);
    }

    router.push(`/dashboard/duo/${activeDuelId}`);
  }, [duelCountdown, activeDuelId, router]);

  useEffect(() => {
    let timer: NodeJS.Timeout | undefined;

    if (inviteState === "waiting" && countdown > 0 && duelCountdown === null) {
      timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) return 0;
          return prev - 1;
        });
        checkDuelStatus();
      }, pollInterval);
    } else if (countdown === 0 && inviteState === "waiting" && duelCountdown === null) {
      setInviteState("expired");
      setActiveDuelId(null);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [inviteState, countdown, duelCountdown, checkDuelStatus]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  if (loadingChallenge) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isLight ? "bg-gray-100 text-gray-900" : "bg-[#050507] text-white"}`}>
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-pink-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className={`min-h-screen p-4 sm:p-8 ${isLight ? "bg-gray-100 text-gray-900" : "bg-[#050507] text-white"}`}>
      <div className="mx-auto max-w-4xl">
        <header className="mb-10 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-black tracking-tight uppercase">Duo Duel Setup</h1>
            <p className={`mt-1 text-xs font-black uppercase tracking-widest ${isLight ? "text-gray-500" : "text-gray-500"}`}>
              Prepare for a real-time coding battle
            </p>
          </div>
          <Link
            href={`/dashboard/challenges/${challengeId}`}
            className={`text-[10px] font-black uppercase tracking-[0.2em] px-4 py-2 rounded-xl transition-all ${isLight ? "text-gray-500 hover:text-gray-900 bg-gray-200 border border-gray-300" : "text-gray-500 hover:text-white bg-white/5 border border-white/10"}`}
          >
            Cancel
          </Link>
        </header>

        <div className="grid gap-8 lg:grid-cols-2">
          <div className="space-y-6">
            <section className={`rounded-[32px] border p-8 shadow-2xl ${isLight ? "border-gray-200 bg-white" : "border-white/10 bg-[#0a0a0a]"}`}>
              <h2 className={`text-sm font-black uppercase tracking-widest mb-6 ${isLight ? "text-pink-600" : "text-pink-400"}`}>
                Target Challenge
              </h2>
              <div className="flex items-center gap-5">
                <div className={`h-14 w-14 rounded-2xl flex items-center justify-center text-2xl ${isLight ? "bg-gray-100 border border-gray-200" : "bg-white/5 border border-white/10"}`}>
                  🏆
                </div>
                <div>
                  <h3 className={`text-xl font-black ${isLight ? "text-gray-900" : "text-white"}`}>{challenge?.title}</h3>
                  <div className="flex items-center gap-3 mt-1.5">
                    <span className={`text-[10px] font-black uppercase tracking-widest ${isLight ? "text-emerald-600" : "text-emerald-400"}`}>
                      {challenge?.difficulty}
                    </span>
                    <span className={`h-1 w-1 rounded-full ${isLight ? "bg-gray-300" : "bg-white/10"}`} />
                    <span className={`text-[10px] font-black uppercase tracking-widest ${isLight ? "text-gray-500" : "text-gray-500"}`}>
                      {challenge?.duration} Mins
                    </span>
                  </div>
                </div>
              </div>
            </section>

            <section className={`rounded-[32px] border p-8 shadow-2xl ${isLight ? "border-gray-200 bg-white" : "border-white/10 bg-[#0a0a0a]"}`}>
              <h2 className={`text-sm font-black uppercase tracking-widest mb-6 ${isLight ? "text-purple-600" : "text-purple-400"}`}>
                Duel Rules
              </h2>
              <ul className="space-y-4">
                {[
                  "Real-time synchronized start.",
                  "First to pass all test cases wins.",
                  "If neither passes, higher score wins.",
                  "Invitation expires after 2 minutes of no response.",
                ].map((rule, i) => (
                  <li
                    key={i}
                    className={`flex gap-3 text-xs font-medium leading-relaxed ${isLight ? "text-gray-600" : "text-gray-400"}`}
                  >
                    <span className={`font-black ${isLight ? "text-purple-600" : "text-purple-500"}`}>•</span>
                    {rule}
                  </li>
                ))}
              </ul>
            </section>
          </div>

          <div className="space-y-6">
            <section className={`rounded-[32px] border p-8 shadow-2xl h-full ${isLight ? "border-gray-200 bg-white" : "border-white/10 bg-[#0a0a0a]"}`}>
              <h2 className={`text-sm font-black uppercase tracking-widest mb-6 ${isLight ? "text-blue-600" : "text-blue-400"}`}>
                Find Opponent
              </h2>

              {inviteState === "idle" || inviteState === "declined" || inviteState === "expired" ? (
                <>
                  {inviteState === "declined" && (
                    <div className={`mb-6 rounded-2xl p-4 text-[10px] font-black uppercase tracking-widest ${isLight ? "bg-red-50 border border-red-200 text-red-600" : "bg-rose-500/10 border border-rose-500/20 text-rose-400"}`}>
                      Invite declined by the player.
                    </div>
                  )}
                  {inviteState === "expired" && (
                    <div className={`mb-6 rounded-2xl p-4 text-[10px] font-black uppercase tracking-widest ${isLight ? "bg-amber-50 border border-amber-200 text-amber-600" : "bg-amber-500/10 border border-amber-500/20 text-amber-400"}`}>
                      Invite expired. Try inviting another player.
                    </div>
                  )}

                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Enter Opponent ID or Username..."
                      value={searchId}
                      onChange={(e) => setSearchId(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                      className={`w-full rounded-2xl border px-5 py-4 text-sm focus:border-blue-500/50 focus:outline-none transition-all ${isLight ? "border-gray-200 bg-gray-50 text-gray-900 placeholder:text-gray-400" : "border-white/10 bg-white/5 text-white"}`}
                    />
                    <button
                      onClick={handleSearch}
                      disabled={searching}
                      className={`absolute right-2 top-2 bottom-2 px-4 rounded-xl text-xs font-black uppercase tracking-widest transition-all hover:opacity-90 disabled:opacity-50 ${isLight ? "bg-blue-600 text-white hover:bg-blue-700" : "bg-blue-500 text-white"}`}
                    >
                      {searching ? "..." : "Search"}
                    </button>
                  </div>

                  {error && <p className={`mt-4 text-xs font-medium ${isLight ? "text-red-600" : "text-rose-500"}`}>{error}</p>}

                  {foundUser && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`mt-8 rounded-3xl border p-6 flex items-center justify-between ${isLight ? "border-gray-200 bg-gray-50" : "border-white/5 bg-white/[0.02]"}`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`h-12 w-12 rounded-2xl border flex items-center justify-center text-xl ${isLight ? "bg-gray-100 border-gray-200" : "bg-gradient-to-br from-white/10 to-transparent border-white/10"}`}>
                          {foundUser.profilePic ? (
                            <img
                              src={resolveAssetUrl(foundUser.profilePic) || ""}
                              alt=""
                              className="h-full w-full object-cover rounded-2xl"
                            />
                          ) : (
                            "👤"
                          )}
                        </div>
                        <div>
                          <p className={`text-sm font-black ${isLight ? "text-gray-900" : "text-white"}`}>{foundUser.username}</p>
                          <p className={`text-[10px] font-black uppercase tracking-widest ${isLight ? "text-gray-500" : "text-gray-500"}`}>
                            {foundUser.rank || "Challenger"}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => setShowConfirmModal(true)}
                        className={`rounded-xl px-5 py-2.5 text-[10px] font-black uppercase tracking-widest shadow-lg transition-all hover:opacity-90 ${isLight ? "bg-emerald-600 text-white shadow-emerald-600/20" : "bg-emerald-500 text-white shadow-emerald-500/20"}`}
                      >
                        Send Invite
                      </button>
                    </motion.div>
                  )}
                </>
              ) : (
                <div className="text-center py-10">
                  <div className="relative mx-auto h-24 w-24 mb-8">
                    <svg className="h-full w-full rotate-[-90deg]">
                      <circle
                        cx="48"
                        cy="48"
                        r="45"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="4"
                        className={isLight ? "text-gray-200" : "text-white/5"}
                      />
                      <circle
                        cx="48"
                        cy="48"
                        r="45"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="4"
                        strokeDasharray={283}
                        strokeDashoffset={283 - (283 * countdown) / 120}
                        className="text-blue-500 transition-all duration-1000"
                      />
                    </svg>
                    <div className={`absolute inset-0 flex items-center justify-center text-xl font-black ${isLight ? "text-gray-900" : "text-white"}`}>
                      {formatTime(countdown)}
                    </div>
                  </div>
                  <h3 className={`text-lg font-black uppercase tracking-wider mb-2 ${isLight ? "text-gray-900" : "text-white"}`}>
                    {duelCountdown !== null ? "Match Starting!" : "Waiting for response"}
                  </h3>

                  {duelCountdown !== null ? (
                    <div className="flex flex-col items-center">
                      <div className={`text-6xl font-black animate-bounce mb-4 ${isLight ? "text-pink-600" : "text-pink-500"}`}>
                        {duelCountdown}
                      </div>
                      <p className={`text-xs font-black uppercase tracking-[0.3em] ${isLight ? "text-gray-500" : "text-gray-400"}`}>
                        Prepare for Battle
                      </p>
                    </div>
                  ) : (
                    <>
                      <p className={`text-xs mb-8 max-w-[200px] mx-auto leading-relaxed ${isLight ? "text-gray-500" : "text-gray-500"}`}>
                        Sent to <span className={isLight ? "text-gray-900" : "text-white"}>{foundUser?.username}</span>. Duel will begin automatically upon acceptance.
                      </p>
                      <button
                        onClick={cancelInvite}
                        className={`text-[10px] font-black uppercase tracking-[0.2em] transition-colors hover:opacity-80 ${isLight ? "text-rose-600 hover:text-rose-700" : "text-rose-500 hover:text-rose-400"}`}
                      >
                        Cancel Invitation
                      </button>
                    </>
                  )}
                </div>
              )}
            </section>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showConfirmModal && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
            <div
              className={`absolute inset-0 backdrop-blur-md ${isLight ? "bg-gray-900/80" : "bg-black/80"}`}
              onClick={() => setShowConfirmModal(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className={`relative w-full max-w-md overflow-hidden rounded-3xl border p-8 text-center shadow-2xl ${isLight ? "border-gray-200 bg-white" : "border-white/10 bg-[#0d0d0d]"}`}
            >
              <div className={`h-16 w-16 rounded-2xl border flex items-center justify-center text-2xl mx-auto mb-6 ${isLight ? "bg-blue-50 border-blue-200" : "bg-blue-500/10 border-blue-500/20"}`}>
                ⚔️
              </div>
              <h3 className={`text-xl font-black tracking-tight uppercase ${isLight ? "text-gray-900" : "text-white"}`}>
                Confirm Duel
              </h3>
              <p className={`mt-3 text-xs leading-relaxed font-medium ${isLight ? "text-gray-500" : "text-gray-500"}`}>
                Are you sure you want to invite <strong className={isLight ? "text-gray-900" : "text-white"}>{foundUser?.username}</strong> to a duel?
              </p>
              <div className="mt-8 flex flex-col gap-3">
                <button
                  onClick={sendInvite}
                  className={`w-full rounded-2xl py-4 text-xs font-black shadow-xl hover:opacity-90 transition-all uppercase tracking-widest ${isLight ? "bg-blue-600 text-white shadow-blue-600/20" : "bg-blue-500 text-white shadow-blue-500/20"}`}
                >
                  Send Invitation
                </button>
                <button
                  onClick={() => setShowConfirmModal(false)}
                  className={`w-full py-2 text-[10px] font-black uppercase tracking-widest transition-colors hover:opacity-80 ${isLight ? "text-gray-500 hover:text-gray-700" : "text-gray-500 hover:text-white"}`}
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function DuoCreatePage() {
  const { theme } = useTheme();
  const isLight = theme === "light";
  
  return (
    <Suspense
      fallback={
        <div className={`min-h-screen flex items-center justify-center ${isLight ? "bg-gray-100 text-gray-900" : "bg-[#050507] text-white"}`}>
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-pink-500 border-t-transparent" />
        </div>
      }
    >
      <DuoCreateForm />
    </Suspense>
  );
}
