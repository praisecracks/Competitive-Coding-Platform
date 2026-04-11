"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "/api";

export default function DuelResultPage() {
  const params = useParams<{ duelId: string }>();
  const router = useRouter();
  const duelId = params?.duelId;

  const [duel, setDuel] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [copying, setCopying] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        setUserId(parsed.id || parsed._id || null);
      } catch {
        setUserId(null);
      }
    }

    const fetchResult = async () => {
      try {
        const token = localStorage.getItem("terminal_token");

        const [duelRes, profileRes] = await Promise.all([
          fetch(`${API_BASE_URL}/duo/status/${duelId}`, {
            headers: { Authorization: `Bearer ${token}` },
            cache: "no-store",
          }),
          fetch(`${API_BASE_URL}/profile`, {
            headers: { Authorization: `Bearer ${token}` },
            cache: "no-store",
          }),
        ]);

        if (!duelRes.ok) {
          router.push("/dashboard/challenges");
          return;
        }

        const duelData = await duelRes.json();
        
        let currentUserId: string | null = null;
        if (profileRes.ok) {
          const profileData = await profileRes.json();
          currentUserId = profileData.id || profileData._id || null;
        }

        const isParticipant = duelData.challenger_id === currentUserId || duelData.opponent_id === currentUserId;
        if (!isParticipant) {
          router.push("/dashboard/challenges");
          return;
        }
        
        if (duelData.status !== "completed") {
          router.push("/dashboard/challenges");
          return;
        }

        setDuel(duelData);
        setUserId(currentUserId);
      } catch (err) {
        console.error("Failed to fetch duel result", err);
        router.push("/dashboard/challenges");
      } finally {
        setLoading(false);
      }
    };

    fetchResult();
  }, [duelId]);

  const isDraw = duel?.winner_id === "TIE";

  const isWinner = useMemo(() => {
    if (!duel || !userId) return false;
    return duel.winner_id === userId;
  }, [duel, userId]);

  const myScore = useMemo(() => {
    if (!duel || !userId) return 0;
    return duel.challenger_id === userId
      ? duel.challenger_score || 0
      : duel.opponent_score || 0;
  }, [duel, userId]);

  const opponentScore = useMemo(() => {
    if (!duel || !userId) return 0;
    return duel.challenger_id === userId
      ? duel.opponent_score || 0
      : duel.challenger_score || 0;
  }, [duel, userId]);

  const outcomeLabel = isDraw ? "Draw" : isWinner ? "Victory" : "Defeat";

  const stateStyles = isDraw
    ? {
        badge: "border-blue-500/20 bg-blue-500/10 text-blue-300",
        iconWrap: "border-blue-500/20 bg-blue-500/10 text-blue-300",
        title: "text-blue-300",
        glow: "bg-blue-500/10",
        scoreAccent: "text-blue-300",
        winnerText: "text-blue-300",
      }
    : isWinner
    ? {
        badge: "border-emerald-500/20 bg-emerald-500/10 text-emerald-300",
        iconWrap: "border-emerald-500/20 bg-emerald-500/10 text-emerald-300",
        title: "text-emerald-300",
        glow: "bg-emerald-500/10",
        scoreAccent: "text-emerald-300",
        winnerText: "text-emerald-300",
      }
    : {
        badge: "border-rose-500/20 bg-rose-500/10 text-rose-300",
        iconWrap: "border-rose-500/20 bg-rose-500/10 text-rose-300",
        title: "text-rose-300",
        glow: "bg-rose-500/10",
        scoreAccent: "text-rose-300",
        winnerText: "text-rose-300",
      };

  const outcomeIcon = isDraw ? "🤝" : isWinner ? "🏆" : "💀";

  const winnerLabel = isDraw ? "Draw" : isWinner ? "You Win" : "Opponent Wins";

  const scoreLead =
    myScore === opponentScore ? 0 : Math.abs(myScore - opponentScore);

  const handleCopyReceipt = () => {
    if (!duel) return;

    setCopying(true);

    const resultText = `🏆 DUEL RESULT: ${outcomeLabel.toUpperCase()}
⚔️ Challenge ID: ${duel.challenge_id}
📊 Your Score: ${myScore}
📊 Opponent Score: ${opponentScore}
🎯 Winner: ${isDraw ? "DRAW" : isWinner ? "YOU" : "OPPONENT"}
#CodeMaster #CompetitiveCoding`;

    navigator.clipboard.writeText(resultText);
    setTimeout(() => setCopying(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6 text-white">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-2 border-white/10 border-t-pink-500" />
          <p className="text-sm tracking-[0.2em] uppercase text-gray-400">
            Calculating result
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen mt-[-40px] bg-[#050507] text-white px-4 py-6 sm:px-6 sm:py-8">
      <div className="mx-auto max-w-8xl">
        <motion.div
          initial={{ opacity: 0, y: 18, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.35 }}
          className="relative overflow-hidden rounded-[36px]  border-white/10 bg-[#0a0a0a] sm:bg-[#000]"
        >
          <div
            className={`pointer-events-none absolute -left-24 top-0 h-72 w-72 rounded-full blur-[110px] ${stateStyles.glow}`}
          />
          <div
            className={`pointer-events-none absolute -right-24 bottom-0 h-72 w-72 rounded-full blur-[110px] ${stateStyles.glow}`}
          />
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

          <div className="relative z-10 grid gap-6 p-5 sm:p-8 lg:grid-cols-[1.15fr_0.85fr] lg:p-10">
            <div>
              <div
                className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] ${stateStyles.badge}`}
              >
                <span>{isDraw ? "Balanced" : isWinner ? "Mission Won" : "Mission Lost"}</span>
              </div>

              <div className="mt-6 flex items-center gap-4">
                <div
                  className={`flex h-20 w-20 shrink-0 items-center justify-center rounded-[28px] border text-4xl shadow-[0_15px_50px_rgba(0,0,0,0.35)] ${stateStyles.iconWrap}`}
                >
                  {outcomeIcon}
                </div>

                <div className="min-w-0">
                  <h1 className="text-4xl font-black italic uppercase tracking-tight text-white sm:text-5xl lg:text-6xl">
                    {outcomeLabel}
                  </h1>
                  <p className="mt-2 text-[10px] font-bold uppercase tracking-[0.32em] text-gray-500 sm:text-[11px]">
                    Duel Report • {new Date().toLocaleDateString()}
                  </p>
                </div>
              </div>

              <p className="mt-8 max-w-2xl text-sm leading-7 text-gray-400 sm:text-[15px]">
                {isDraw
                  ? "Both competitors finished with the same score. This duel ends in a draw."
                  : isWinner
                  ? "You outperformed your opponent in this duel. Strong execution, better score, and cleaner finish."
                  : "Your opponent finished ahead this round. Review the challenge, sharpen your approach, and queue the rematch."}
              </p>

              <div className="mt-8 grid gap-4 sm:grid-cols-3">
                <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-5">
                  <p className="text-[10px] font-black uppercase tracking-[0.18em] text-gray-500">
                    Your Score
                  </p>
                  <div className="mt-3 flex items-end gap-2">
                    <span className="text-4xl font-black text-white">{myScore}</span>
                    <span className="pb-1 text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">
                      pts
                    </span>
                  </div>
                </div>

                <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-5">
                  <p className="text-[10px] font-black uppercase tracking-[0.18em] text-gray-500">
                    Opponent
                  </p>
                  <div className="mt-3 flex items-end gap-2">
                    <span className="text-4xl font-black text-white">{opponentScore}</span>
                    <span className="pb-1 text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">
                      pts
                    </span>
                  </div>
                </div>

                <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-5">
                  <p className="text-[10px] font-black uppercase tracking-[0.18em] text-gray-500">
                    Score Gap
                  </p>
                  <div className="mt-3 flex items-end gap-2">
                    <span className={`text-4xl font-black ${stateStyles.scoreAccent}`}>
                      {scoreLead}
                    </span>
                    <span className="pb-1 text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">
                      pts
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-8 overflow-hidden rounded-[28px] border border-white/10 bg-black/20">
                <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
                  <p className="text-[10px] font-black uppercase tracking-[0.18em] text-gray-500">
                    Winner Status
                  </p>
                  <span
                    className={`rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] ${stateStyles.badge}`}
                  >
                    {winnerLabel}
                  </span>
                </div>

                <div className="px-5 py-5">
                  <div className="mb-4 flex items-center justify-between text-sm text-gray-400">
                    <span>You</span>
                    <span>Opponent</span>
                  </div>

                  <div className="relative h-4 overflow-hidden rounded-full bg-white/[0.04]">
                    <div
                      className="absolute left-0 top-0 h-full rounded-full bg-gradient-to-r from-pink-500 to-fuchsia-400 transition-all duration-700"
                      style={{
                        width: `${Math.max(6, Math.min(100, myScore))}%`,
                      }}
                    />
                    <div
                      className="absolute right-0 top-0 h-full rounded-full bg-gradient-to-l from-cyan-500 to-blue-400 transition-all duration-700 opacity-90"
                      style={{
                        width: `${Math.max(6, Math.min(100, opponentScore))}%`,
                      }}
                    />
                  </div>

                  <div className="mt-4 flex items-center justify-between text-xs font-semibold uppercase tracking-[0.16em] text-gray-500">
                    <span>{myScore}% pressure</span>
                    <span>{opponentScore}% pressure</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-5">
              <div className="rounded-[28px] border border-white/10 bg-white/[0.03] p-5 sm:p-6">
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-gray-500">
                  Match Summary
                </p>

                <div className="mt-5 space-y-4">
                  <div className="flex items-start justify-between gap-4">
                    <span className="text-sm text-gray-400">Challenge ID</span>
                    <span className="text-sm font-semibold text-white">
                      #{String(duel?.challenge_id || "—").padStart(3, "0")}
                    </span>
                  </div>

                  <div className="flex items-start justify-between gap-4">
                    <span className="text-sm text-gray-400">Result</span>
                    <span className={`text-sm font-semibold ${stateStyles.title}`}>
                      {winnerLabel}
                    </span>
                  </div>

                  <div className="flex items-start justify-between gap-4">
                    <span className="text-sm text-gray-400">Your Final Score</span>
                    <span className="text-sm font-semibold text-white">{myScore}</span>
                  </div>

                  <div className="flex items-start justify-between gap-4">
                    <span className="text-sm text-gray-400">Opponent Final Score</span>
                    <span className="text-sm font-semibold text-white">{opponentScore}</span>
                  </div>
                </div>
              </div>

              <div className="rounded-[28px] border border-white/10 bg-white/[0.03] p-5 sm:p-6">
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-gray-500">
                  Actions
                </p>

                <div className="mt-5 flex flex-col gap-3">
                  <button
                    onClick={handleCopyReceipt}
                    className="inline-flex w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 px-4 py-4 text-xs font-black uppercase tracking-[0.18em] text-white shadow-[0_12px_40px_rgba(16,185,129,0.22)] transition-all hover:opacity-95 active:scale-[0.99]"
                  >
                    {copying ? "Result Copied" : "Copy Match Result"}
                    <span className="text-base">{copying ? "✓" : "📄"}</span>
                  </button>

                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <Link
                      href="/dashboard/challenges"
                      className="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-4 text-[11px] font-black uppercase tracking-[0.18em] text-white transition-all hover:bg-white/[0.08]"
                    >
                      Back to Challenges
                    </Link>

                    <button
                      onClick={() =>
                        router.push(`/dashboard/duo/create?challengeId=${duel?.challenge_id}`)
                      }
                      className="inline-flex items-center justify-center rounded-2xl border border-pink-500/20 bg-pink-500/10 px-4 py-4 text-[11px] font-black uppercase tracking-[0.18em] text-pink-200 transition-all hover:bg-pink-500/15"
                    >
                      Rematch
                    </button>
                  </div>
                </div>
              </div>

              <div className="rounded-[28px] border border-white/10 bg-white/[0.03] p-5 sm:p-6">
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-gray-500">
                  CodeMaster Verdict
                </p>
                <p className="mt-3 text-sm leading-7 text-gray-400">
                  {isDraw
                    ? "Evenly matched duel. Push one more clean submission and force separation in the next round."
                    : isWinner
                    ? "Strong duel finish. You secured the better score and controlled the match flow."
                    : "You lost this round on score margin. Study the challenge and come back sharper for the rematch."}
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}