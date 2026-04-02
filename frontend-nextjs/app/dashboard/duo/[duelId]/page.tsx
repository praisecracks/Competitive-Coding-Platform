"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import ChallengeWorkspace from "@/app/components/dashboard/challenges/ChallengeWorkspace";
import ChallengeHeader from "@/app/components/dashboard/challenges/ChallengeHeader";
import type { Language } from "@/app/components/dashboard/challenges/CodeEditor";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "/api";

export default function DuelRoomPage() {
  const params = useParams<{ duelId: string }>();
  const router = useRouter();
  const duelId = params?.duelId;

  const [duel, setDuel] = useState<any>(null);
  const [challenge, setChallenge] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [preDuelCountdown, setPreDuelCountdown] = useState(5);
  const [gameState, setGameState] = useState<"counting" | "coding" | "finished">("counting");
  
  // Workspace states
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState<Language>("javascript");
  const [terminalHistory, setTerminalHistory] = useState<{ time: string; line: string }[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [running, setRunning] = useState(false);
  const [lastScore, setLastScore] = useState<number | null>(null);
  const [timeLeftLabel, setTimeLeftLabel] = useState("00:00");
  const [workspaceTab, setWorkspaceTab] = useState<"problem" | "examples" | "constraints">("problem");

  const fetchDuelData = useCallback(async () => {
    try {
      const token = localStorage.getItem("terminal_token");
      const res = await fetch(`${API_BASE_URL}/duo/status/${duelId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setDuel(data);
        
        // Fetch challenge if not loaded
        const challengeRes = await fetch(`${API_BASE_URL}/challenges/${data.challenge_id}`);
        if (challengeRes.ok) {
          const cData = await challengeRes.json();
          setChallenge(cData);
        }
      } else {
        router.push("/dashboard/challenges");
      }
    } catch (err) {
      console.error("Failed to fetch duel data", err);
    } finally {
      setLoading(false);
    }
  }, [duelId, router]);

  useEffect(() => {
    fetchDuelData();
  }, [fetchDuelData]);

  // Pre-duel countdown
  useEffect(() => {
    if (gameState === "counting" && !loading) {
      const timer = setInterval(() => {
        setPreDuelCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setGameState("coding");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [gameState, loading]);

  // Game timer logic
  useEffect(() => {
    if (gameState === "coding" && duel?.accepted_at) {
      const duration = (challenge?.duration || 30) * 60;
      const startTime = new Date(duel.accepted_at).getTime();
      
      const timer = setInterval(() => {
        const now = Date.now();
        const elapsed = Math.floor((now - startTime) / 1000);
        const remaining = Math.max(0, duration - elapsed);
        
        const mins = Math.floor(remaining / 60);
        const secs = remaining % 60;
        setTimeLeftLabel(`${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`);
        
        if (remaining <= 0) {
          clearInterval(timer);
          setGameState("finished");
          router.push(`/dashboard/duo/${duelId}/result`);
        }
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [gameState, duel, challenge, duelId, router]);

  const handleRun = async () => {
    setRunning(true);
    // ... logic for running code ...
    setRunning(false);
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const token = localStorage.getItem("terminal_token");
      const res = await fetch(`${API_BASE_URL}/duo/submit/${duelId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          score: 100, // In a real app, this would be based on test cases
        }),
      });

      if (res.ok) {
        router.push(`/dashboard/duo/${duelId}/result`);
      } else {
        console.error("Failed to submit duel result");
      }
    } catch (err) {
      console.error("Submission error:", err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="min-h-screen bg-[#050507] flex items-center justify-center text-white">Loading duel...</div>;

  return (
    <div className="min-h-screen bg-[#050507] text-white flex flex-col">
      <AnimatePresence>
        {gameState === "counting" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-black/95 flex flex-col items-center justify-center"
          >
            <motion.div
              key={preDuelCountdown}
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 200 }}
              className="text-[12rem] font-black italic text-pink-500 drop-shadow-[0_0_30px_rgba(236,72,153,0.3)]"
            >
              {preDuelCountdown}
            </motion.div>
            <p className="text-xl font-black uppercase tracking-[0.5em] text-gray-500 mt-10">Prepare for Battle</p>
          </motion.div>
        )}
      </AnimatePresence>

      <ChallengeHeader
        challenge={challenge}
        mode="duo"
        lastScore={lastScore}
        lines={code.split("\n").length}
        chars={code.length}
        timerLabel={timeLeftLabel}
        sessionState={gameState}
        workspaceTab={workspaceTab}
        onTabChange={setWorkspaceTab}
        onBack={() => router.push("/dashboard/challenges")}
      />

      <main className="flex-1 overflow-hidden">
        <ChallengeWorkspace
          challenge={challenge}
          activeTab={workspaceTab}
          code={code}
          onCodeChange={setCode}
          onRun={handleRun}
          onReset={() => setCode("")}
          onSubmit={handleSubmit}
          onReplay={() => {}}
          terminalHistory={terminalHistory}
          submitting={submitting}
          running={running}
          lastScore={lastScore}
          language={language}
          onLanguageChange={setLanguage}
          missionState={gameState === "coding" ? "active" : "completed"}
          isEditorLocked={gameState !== "coding"}
          editorLockMessage={gameState === "counting" ? "Preparing duel..." : "Duel finished"}
          timeLeftLabel={timeLeftLabel}
        />
      </main>

      {/* Opponent Progress Bar (Bottom) */}
      <footer className="h-16 border-t border-white/10 bg-[#0a0a0a] px-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="h-2 w-32 rounded-full bg-white/5 overflow-hidden">
            <div className="h-full bg-blue-500 w-1/2 animate-pulse" />
          </div>
          <span className="text-[10px] font-black uppercase tracking-widest text-blue-400">Opponent Coding...</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-[10px] font-black uppercase tracking-widest text-pink-400">Your Progress</span>
          <div className="h-2 w-32 rounded-full bg-white/5 overflow-hidden">
            <div className="h-full bg-pink-500 w-[10%]" />
          </div>
        </div>
      </footer>
    </div>
  );
}
