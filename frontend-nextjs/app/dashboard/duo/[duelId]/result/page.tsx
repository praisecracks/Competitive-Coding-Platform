"use client";

import { useEffect, useState } from "react";
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

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUserId(JSON.parse(savedUser).id);
    }

    const fetchResult = async () => {
      try {
        const token = localStorage.getItem("terminal_token");
        const res = await fetch(`${API_BASE_URL}/duo/status/${duelId}`, {
          headers: { Authorization: `Bearer ${token}` },
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

  const [copying, setCopying] = useState(false);

  const handleCopyReceipt = () => {
    setCopying(true);
    const resultText = `🏆 DUEL RESULT: ${isWinner ? "VICTORY" : isDraw ? "DRAW" : "DEFEAT"}
🔥 Challenge: ${duel?.challenge_title || "Competitive Coding"}
⚔️ Opponent: ${duel?.opponent_name || "Unknown"}
📊 Score: ${isWinner ? duel?.challenger_score : duel?.opponent_score}
⏱️ Time: ${new Date().toLocaleDateString()}
#CodeMaster #CompetitiveCoding`;

    navigator.clipboard.writeText(resultText);
    setTimeout(() => setCopying(false), 2000);
  };

  if (loading) return <div className="min-h-screen bg-[#050507] flex items-center justify-center text-white">Calculating results...</div>;

  const isWinner = duel?.winner_id === userId;
  const isDraw = duel?.winner_id === "TIE";

  return (
    <div className="min-h-screen bg-[#050507] text-white p-4 sm:p-8 flex flex-col items-center justify-center">
      <div className="max-w-2xl w-full text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="rounded-[48px] border border-white/10 bg-[#0a0a0a] p-12 shadow-2xl relative overflow-hidden mb-8"
        >
          {/* Victory Card Glow */}
          {isWinner && (
            <div className="absolute -top-24 -left-24 w-64 h-64 bg-emerald-500/20 rounded-full blur-[100px] animate-pulse" />
          )}

          <div className="relative z-10">
            <div className={`mx-auto h-24 w-24 rounded-3xl flex items-center justify-center text-5xl mb-8 border border-white/10 shadow-2xl ${isWinner ? 'bg-emerald-500/20 text-emerald-400' : isDraw ? 'bg-blue-500/20 text-blue-400' : 'bg-rose-500/20 text-rose-400'}`}>
              {isWinner ? "🏆" : isDraw ? "🤝" : "💀"}
            </div>

            <h1 className="text-6xl font-black italic tracking-tighter uppercase mb-4 drop-shadow-2xl">
              {isWinner ? "Victory" : isDraw ? "Draw" : "Defeat"}
            </h1>
            
            <p className="text-gray-500 font-bold uppercase tracking-[0.3em] text-[10px] mb-12">
              Mission Report: {new Date().toLocaleDateString()}
            </p>

            <div className="grid grid-cols-2 gap-4 mb-12">
              <div className="rounded-3xl border border-white/5 bg-white/[0.02] p-6 text-left">
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">Final Score</p>
                <p className="text-3xl font-black text-white">{isWinner ? duel?.challenger_score || 100 : duel?.opponent_score || 100}</p>
              </div>
              <div className="rounded-3xl border border-white/5 bg-white/[0.02] p-6 text-left">
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">Outcome</p>
                <p className={`text-3xl font-black ${isWinner ? 'text-emerald-400' : 'text-rose-400'}`}>{isWinner ? "+25 RP" : "-10 RP"}</p>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <button
                onClick={handleCopyReceipt}
                className="w-full rounded-2xl bg-emerald-500 text-white py-5 text-xs font-black uppercase tracking-[0.2em] shadow-xl hover:bg-emerald-400 transition-all active:scale-[0.98] flex items-center justify-center gap-3"
              >
                {copying ? "Receipt Copied!" : "Copy Victory Receipt"}
                {!copying && <span className="text-lg">📄</span>}
              </button>
              
              <div className="grid grid-cols-2 gap-4">
                <Link
                  href="/dashboard/challenges"
                  className="rounded-2xl border border-white/10 bg-white/5 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-white hover:bg-white/10 transition-all"
                >
                  Return Home
                </Link>
                <button
                  onClick={() => router.push(`/dashboard/duo/create?challengeId=${duel?.challenge_id}`)}
                  className="rounded-2xl border border-white/10 bg-white/5 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-white hover:bg-white/10 transition-all"
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
