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
        const res = await fetch(`${API_BASE_URL}/duo/status/${duelId}`, {
          headers: { Authorization: `Bearer ${token}` },
          cache: "no-store",
        });

        if (res.ok) {
          const data = await res.json();
          setDuel(data);
        }
      } catch (err) {
        console.error("Failed to fetch duel result", err);
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
    return duel.challenger_id === userId ? duel.challenger_score || 0 : duel.opponent_score || 0;
  }, [duel, userId]);

  const opponentScore = useMemo(() => {
    if (!duel || !userId) return 0;
    return duel.challenger_id === userId ? duel.opponent_score || 0 : duel.challenger_score || 0;
  }, [duel, userId]);

  const outcomeLabel = isDraw ? "Draw" : isWinner ? "Victory" : "Defeat";

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
      <div className="min-h-screen bg-[#050507] flex items-center justify-center text-white">
        Calculating results...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050507] text-white p-4 sm:p-8 flex flex-col items-center justify-center">
      <div className="max-w-2xl w-full text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative mb-8 overflow-hidden rounded-[48px] border border-white/10 bg-[#0a0a0a] p-12 shadow-2xl"
        >
          {isWinner && (
            <div className="absolute -left-24 -top-24 h-64 w-64 rounded-full bg-emerald-500/20 blur-[100px] animate-pulse" />
          )}

          <div className="relative z-10">
            <div
              className={`mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-3xl border border-white/10 text-5xl shadow-2xl ${
                isWinner
                  ? "bg-emerald-500/20 text-emerald-400"
                  : isDraw
                  ? "bg-blue-500/20 text-blue-400"
                  : "bg-rose-500/20 text-rose-400"
              }`}
            >
              {isWinner ? "🏆" : isDraw ? "🤝" : "💀"}
            </div>

            <h1 className="mb-4 text-6xl font-black italic tracking-tighter uppercase drop-shadow-2xl">
              {outcomeLabel}
            </h1>

            <p className="mb-12 text-[10px] font-bold uppercase tracking-[0.3em] text-gray-500">
              Mission Report: {new Date().toLocaleDateString()}
            </p>

            <div className="mb-6 grid grid-cols-2 gap-4">
              <div className="rounded-3xl border border-white/5 bg-white/[0.02] p-6 text-left">
                <p className="mb-2 text-[10px] font-black uppercase tracking-widest text-gray-500">
                  Your Score
                </p>
                <p className="text-3xl font-black text-white">{myScore}</p>
              </div>

              <div className="rounded-3xl border border-white/5 bg-white/[0.02] p-6 text-left">
                <p className="mb-2 text-[10px] font-black uppercase tracking-widest text-gray-500">
                  Opponent Score
                </p>
                <p className="text-3xl font-black text-white">{opponentScore}</p>
              </div>
            </div>

            <div className="mb-12 rounded-3xl border border-white/5 bg-white/[0.02] p-6 text-left">
              <p className="mb-2 text-[10px] font-black uppercase tracking-widest text-gray-500">
                Winner
              </p>
              <p
                className={`text-3xl font-black ${
                  isDraw ? "text-blue-400" : isWinner ? "text-emerald-400" : "text-rose-400"
                }`}
              >
                {isDraw ? "Draw" : isWinner ? "You Win" : "Opponent Wins"}
              </p>
            </div>

            <div className="flex flex-col gap-4">
              <button
                onClick={handleCopyReceipt}
                className="flex w-full items-center justify-center gap-3 rounded-2xl bg-emerald-500 py-5 text-xs font-black uppercase tracking-[0.2em] text-white shadow-xl transition-all hover:bg-emerald-400 active:scale-[0.98]"
              >
                {copying ? "Receipt Copied!" : "Copy Match Result"}
                {!copying && <span className="text-lg">📄</span>}
              </button>

              <div className="grid grid-cols-2 gap-4">
                <Link
                  href="/dashboard/challenges"
                  className="rounded-2xl border border-white/10 bg-white/5 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-white transition-all hover:bg-white/10"
                >
                  Return Home
                </Link>

                <button
                  onClick={() => router.push(`/dashboard/duo/create?challengeId=${duel?.challenge_id}`)}
                  className="rounded-2xl border border-white/10 bg-white/5 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-white transition-all hover:bg-white/10"
                >
                  New Match
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}