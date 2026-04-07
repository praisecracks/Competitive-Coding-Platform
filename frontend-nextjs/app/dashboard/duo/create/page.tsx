"use client";

import { useEffect, useState, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

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

export default function DuoCreatePage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const challengeId = searchParams.get("challengeId");

  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [loadingChallenge, setLoadingChallenge] = useState(true);
  const [searchId, setSearchId] = useState("");
  const [searching, setSearching] = useState(false);
  const [foundUser, setFoundUser] = useState<User | null>(null);
  const [error, setError] = useState("");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [inviteState, setInviteState] = useState<"idle" | "waiting" | "declined" | "expired">("idle");
  const [countdown, setCountdown] = useState(120); // 2 minutes
  const [activeDuelId, setActiveDuelId] = useState<string | null>(null);
  const [duelCountdown, setDuelCountdown] = useState<number | null>(null);

  const pollInterval = 1000; // Poll every 1 second for ultra-fast detection

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
      // Use relative /api path to ensure proxy works correctly
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
        setActiveDuelId(data.duel_id);
        setInviteState("waiting");
        setCountdown(120);
      } else {
        const data = await res.json();
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

      if (res.ok) {
        const data = await res.json();
        if (data.status === "accepted") {
          // Calculate synchronized countdown based on accepted_at
          const acceptedAt = data.accepted_at ? new Date(data.accepted_at).getTime() : Date.now();
          const now = Date.now();
          const elapsedSeconds = Math.floor((now - acceptedAt) / 1000);
          const remainingSeconds = Math.max(0, 5 - elapsedSeconds);

          if (duelCountdown === null) {
            setDuelCountdown(remainingSeconds);
          }
        } else if (data.status === "declined") {
          setInviteState("declined");
          setActiveDuelId(null);
        } else if (data.status === "expired") {
          setInviteState("expired");
          setActiveDuelId(null);
        }
      }
    } catch (err) {
      console.error("Polling status error:", err);
    }
  }, [activeDuelId, duelCountdown, router]);

  // Handle the 5-second countdown for both users
  useEffect(() => {
    if (duelCountdown === null) return;

    if (duelCountdown > 0) {
      const timer = setTimeout(() => setDuelCountdown(duelCountdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      // Countdown finished, enter the duel room
      router.push(`/dashboard/duo/${activeDuelId}`);
    }
  }, [duelCountdown, activeDuelId, router]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (inviteState === "waiting" && countdown > 0 && duelCountdown === null) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
        checkDuelStatus();
      }, pollInterval);
    } else if (countdown === 0 && inviteState === "waiting" && duelCountdown === null) {
      setInviteState("expired");
      setActiveDuelId(null);
    }
    return () => clearInterval(timer);
  }, [inviteState, countdown, duelCountdown, checkDuelStatus]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  if (loadingChallenge) {
    return (
      <div className="min-h-screen bg-[#050507] flex items-center justify-center text-white">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-pink-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050507] text-white p-4 sm:p-8">
      <div className="mx-auto max-w-4xl">
        <header className="mb-10 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-black tracking-tight uppercase">Duo Duel Setup</h1>
            <p className="mt-1 text-xs text-gray-500 font-black uppercase tracking-widest">Prepare for a real-time coding battle</p>
          </div>
          <Link href={`/dashboard/challenges/${challengeId}`} className="text-[10px] font-black text-gray-500 hover:text-white transition-all uppercase tracking-[0.2em] px-4 py-2 rounded-xl bg-white/5 border border-white/10">
            Cancel
          </Link>
        </header>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Left Side: Challenge Info & Rules */}
          <div className="space-y-6">
            <section className="rounded-[32px] border border-white/10 bg-[#0a0a0a] p-8 shadow-2xl">
              <h2 className="text-sm font-black text-pink-400 uppercase tracking-widest mb-6">Target Challenge</h2>
              <div className="flex items-center gap-5">
                <div className="h-14 w-14 rounded-2xl bg-white/5 flex items-center justify-center text-2xl border border-white/10">🏆</div>
                <div>
                  <h3 className="text-xl font-black text-white">{challenge?.title}</h3>
                  <div className="flex items-center gap-3 mt-1.5">
                    <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400">{challenge?.difficulty}</span>
                    <span className="h-1 w-1 rounded-full bg-white/10" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">{challenge?.duration} Mins</span>
                  </div>
                </div>
              </div>
            </section>

            <section className="rounded-[32px] border border-white/10 bg-[#0a0a0a] p-8 shadow-2xl">
              <h2 className="text-sm font-black text-purple-400 uppercase tracking-widest mb-6">Duel Rules</h2>
              <ul className="space-y-4">
                {[
                  "Real-time synchronized start.",
                  "First to pass all test cases wins.",
                  "If neither passes, time remaining determines winner.",
                  "Invitation expires after 2 minutes of no response."
                ].map((rule, i) => (
                  <li key={i} className="flex gap-3 text-xs text-gray-400 font-medium leading-relaxed">
                    <span className="text-purple-500 font-black">•</span>
                    {rule}
                  </li>
                ))}
              </ul>
            </section>
          </div>

          {/* Right Side: Search & Invite */}
          <div className="space-y-6">
            <section className="rounded-[32px] border border-white/10 bg-[#0a0a0a] p-8 shadow-2xl h-full">
              <h2 className="text-sm font-black text-blue-400 uppercase tracking-widest mb-6">Find Opponent</h2>
              
              {inviteState === "idle" || inviteState === "declined" || inviteState === "expired" ? (
                <>
                  {inviteState === "declined" && (
                    <div className="mb-6 rounded-2xl bg-rose-500/10 border border-rose-500/20 p-4 text-rose-400 text-[10px] font-black uppercase tracking-widest">
                      Invite declined by the player.
                    </div>
                  )}
                  {inviteState === "expired" && (
                    <div className="mb-6 rounded-2xl bg-amber-500/10 border border-amber-500/20 p-4 text-amber-400 text-[10px] font-black uppercase tracking-widest">
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
                      className="w-full rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-sm text-white focus:border-blue-500/50 focus:outline-none transition-all"
                    />
                    <button
                      onClick={handleSearch}
                      disabled={searching}
                      className="absolute right-2 top-2 bottom-2 px-4 rounded-xl bg-blue-500 text-xs font-black uppercase tracking-widest text-white hover:opacity-90 disabled:opacity-50"
                    >
                      {searching ? "..." : "Search"}
                    </button>
                  </div>

                  {error && <p className="mt-4 text-xs text-rose-500 font-medium">{error}</p>}

                  {foundUser && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-8 rounded-3xl border border-white/5 bg-white/[0.02] p-6 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-white/10 to-transparent border border-white/10 flex items-center justify-center text-xl">
                          {foundUser.profilePic ? <img src={resolveAssetUrl(foundUser.profilePic) || ""} alt="" className="h-full w-full object-cover rounded-2xl" /> : "👤"}
                        </div>
                        <div>
                          <p className="text-sm font-black text-white">{foundUser.username}</p>
                          <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest">{foundUser.rank || "Challenger"}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => setShowConfirmModal(true)}
                        className="rounded-xl bg-emerald-500 px-5 py-2.5 text-[10px] font-black uppercase tracking-widest text-white hover:opacity-90 shadow-lg shadow-emerald-500/20"
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
                        cx="48" cy="48" r="45"
                        fill="none" stroke="currentColor" strokeWidth="4"
                        className="text-white/5"
                      />
                      <circle
                        cx="48" cy="48" r="45"
                        fill="none" stroke="currentColor" strokeWidth="4"
                        strokeDasharray={283}
                        strokeDashoffset={283 - (283 * countdown) / 120}
                        className="text-blue-500 transition-all duration-1000"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center text-xl font-black">
                      {formatTime(countdown)}
                    </div>
                  </div>
                  <h3 className="text-lg font-black text-white uppercase tracking-wider mb-2">
                    {duelCountdown !== null ? "Match Starting!" : "Waiting for response"}
                  </h3>
                  
                  {duelCountdown !== null ? (
                    <div className="flex flex-col items-center">
                      <div className="text-6xl font-black text-pink-500 animate-bounce mb-4">
                        {duelCountdown}
                      </div>
                      <p className="text-xs text-gray-400 font-black uppercase tracking-[0.3em]">Prepare for Battle</p>
                    </div>
                  ) : (
                    <>
                      <p className="text-xs text-gray-500 mb-8 max-w-[200px] mx-auto leading-relaxed">
                        Sent to <span className="text-white">{foundUser?.username}</span>. Duel will begin automatically upon acceptance.
                      </p>
                      <button
                        onClick={cancelInvite}
                        className="text-[10px] font-black text-rose-500 uppercase tracking-[0.2em] hover:text-rose-400 transition-colors"
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

      {/* Invite Confirmation Modal */}
      <AnimatePresence>
        {showConfirmModal && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
            <div 
              className="absolute inset-0 bg-black/80 backdrop-blur-md" 
              onClick={() => setShowConfirmModal(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md overflow-hidden rounded-3xl border border-white/10 bg-[#0d0d0d] p-8 text-center shadow-2xl"
            >
              <div className="h-16 w-16 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-2xl mx-auto mb-6">⚔️</div>
              <h3 className="text-xl font-black text-white tracking-tight uppercase">Confirm Duel</h3>
              <p className="mt-3 text-xs text-gray-500 leading-relaxed font-medium">
                Are you sure you want to invite <strong className="text-white">{foundUser?.username}</strong> to a duel?
              </p>
              <div className="mt-8 flex flex-col gap-3">
                <button
                  onClick={sendInvite}
                  className="w-full rounded-2xl bg-blue-500 py-4 text-xs font-black text-white shadow-xl shadow-blue-500/20 hover:opacity-90 transition-all uppercase tracking-widest"
                >
                  Send Invitation
                </button>
                <button onClick={() => setShowConfirmModal(false)} className="w-full py-2 text-[10px] font-black text-gray-500 hover:text-white uppercase tracking-widest transition-colors">Cancel</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
