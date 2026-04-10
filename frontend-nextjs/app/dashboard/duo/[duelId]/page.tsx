"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import ChallengeWorkspace from "@/app/components/dashboard/challenges/ChallengeWorkspace";
import ChallengeHeader from "@/app/components/dashboard/challenges/ChallengeHeader";
import type { Language } from "@/app/components/dashboard/challenges/CodeEditor";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "/api";

type TerminalEntry = {
  time: string;
  line: string;
};

function nowLabel() {
  return new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

export default function DuelRoomPage() {
  const params = useParams<{ duelId: string }>();
  const router = useRouter();
  const duelId = params?.duelId;

  const [duel, setDuel] = useState<any>(null);
  const [challenge, setChallenge] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [preDuelCountdown, setPreDuelCountdown] = useState(5);
  const [gameState, setGameState] = useState<"counting" | "coding" | "finished">("counting");
  const [userId, setUserId] = useState<string | null>(null);

  const [code, setCode] = useState("");
  const [language, setLanguage] = useState<Language>("javascript");
  const [terminalHistory, setTerminalHistory] = useState<TerminalEntry[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [running, setRunning] = useState(false);
  const [lastScore, setLastScore] = useState<number | null>(null);
  const [timeLeftLabel, setTimeLeftLabel] = useState("00:00");
  const [workspaceTab, setWorkspaceTab] = useState<"problem" | "examples" | "constraints">("problem");

  const pushTerminal = useCallback((line: string) => {
    setTerminalHistory((prev) => [...prev, { time: nowLabel(), line }]);
  }, []);

useEffect(() => {
    const loadUserId = async () => {
      const token = localStorage.getItem("terminal_token");
      if (!token) return;
      
      try {
        const res = await fetch(`${API_BASE_URL}/profile`, {
          headers: { Authorization: `Bearer ${token}` },
          cache: "no-store",
        });
        if (res.ok) {
          const data = await res.json();
          setUserId(data.id || data._id || null);
        }
      } catch (e) {
        setUserId(null);
      }
    };
    
    loadUserId();
  }, []);

  const fetchDuelData = useCallback(
    async (silent = false) => {
      try {
        const token = localStorage.getItem("terminal_token");
        const res = await fetch(`${API_BASE_URL}/duo/status/${duelId}`, {
          headers: { Authorization: `Bearer ${token}` },
          cache: "no-store",
        });

        if (!res.ok) {
          router.push("/dashboard/challenges");
          return;
        }

        const data = await res.json();
        setDuel(data);

        if (!silent) {
          pushTerminal(`Duel status: ${String(data.status).toUpperCase()}`);
        }

        if (!challenge || challenge.id !== data.challenge_id) {
          const challengeRes = await fetch(`${API_BASE_URL}/challenges/${data.challenge_id}`, {
            cache: "no-store",
          });

          if (challengeRes.ok) {
            const cData = await challengeRes.json();
            setChallenge(cData);
            if (!silent) {
              pushTerminal(`Challenge loaded: ${cData.title}`);
            }
          }
        }

        if (data.status === "completed") {
          pushTerminal("Duel completed. Redirecting to result...");
          setGameState("finished");
          router.push(`/dashboard/duo/${duelId}/result`);
        }
      } catch (err) {
        console.error("Failed to fetch duel data", err);
        if (!silent) {
          pushTerminal("Failed to sync duel state.");
        }
      } finally {
        setLoading(false);
      }
    },
    [duelId, router, challenge, pushTerminal]
  );

  useEffect(() => {
    fetchDuelData(false);
  }, [fetchDuelData]);

  useEffect(() => {
    if (!duelId || loading) return;
    const interval = setInterval(() => {
      fetchDuelData(true);
    }, 2000);

    return () => clearInterval(interval);
  }, [duelId, loading, fetchDuelData]);

  useEffect(() => {
    if (gameState === "counting" && !loading) {
      const timer = setInterval(() => {
        setPreDuelCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setGameState("coding");
            pushTerminal("Duel started. Begin coding.");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [gameState, loading, pushTerminal]);

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
          pushTerminal("Time is up. Redirecting to result...");
          router.push(`/dashboard/duo/${duelId}/result`);
        }
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [gameState, duel, challenge, duelId, router, pushTerminal]);

  const isChallenger = useMemo(() => {
    return !!userId && !!duel && duel.challenger_id === userId;
  }, [userId, duel]);

  const myScore = useMemo(() => {
    if (!duel || !userId) return 0;
    return isChallenger ? duel.challenger_score || 0 : duel.opponent_score || 0;
  }, [duel, userId, isChallenger]);

  const opponentScore = useMemo(() => {
    if (!duel || !userId) return 0;
    return isChallenger ? duel.opponent_score || 0 : duel.challenger_score || 0;
  }, [duel, userId, isChallenger]);

  const mySubmitted = useMemo(() => {
    if (!duel || !userId) return false;
    return isChallenger ? !!duel.challenger_submitted : !!duel.opponent_submitted;
  }, [duel, userId, isChallenger]);

  const opponentSubmitted = useMemo(() => {
    if (!duel || !userId) return false;
    return isChallenger ? !!duel.opponent_submitted : !!duel.challenger_submitted;
  }, [duel, userId, isChallenger]);

  const myProgress = useMemo(() => {
    if (mySubmitted) return myScore;
    if (lastScore !== null && lastScore > 0) return lastScore;
    if (code.length > 10) return Math.min(10, code.length / 50);
    return 0;
  }, [mySubmitted, myScore, lastScore, code.length]);

  const opponentProgress = useMemo(() => {
    if (opponentSubmitted) return opponentScore;
    if (opponentScore > 0) return opponentScore;
    return 0;
  }, [opponentSubmitted, opponentScore]);

  const handleRun = async () => {
    if (!code.trim()) {
      pushTerminal("No code to run.");
      return;
    }

    setRunning(true);
    pushTerminal(`Running ${language} solution...`);

    try {
      const token = localStorage.getItem("terminal_token");
      const runRes = await fetch(`${API_BASE_URL}/submit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          challenge_id: challenge?.id,
          language: language,
          code: code,
        }),
      });

      if (runRes.ok) {
        const runData = await runRes.json();
        const runScore = runData.score || 0;
        setLastScore(runScore);
        pushTerminal(`Run complete: ${runScore}% (${runData.passed_tests || 0}/${runData.total_tests || 0} tests passed)`);
      } else {
        pushTerminal("Run failed.");
      }
    } catch (err) {
      console.error("Run error:", err);
      pushTerminal("Run error occurred.");
    } finally {
      setRunning(false);
    }
  };

  const handleSubmit = async () => {
    if (!code.trim()) {
      pushTerminal("No code to submit.");
      setSubmitting(false);
      return;
    }

    setSubmitting(true);
    pushTerminal("Evaluating solution...");

    try {
      const token = localStorage.getItem("terminal_token");

      const evalRes = await fetch(`${API_BASE_URL}/submit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          challenge_id: challenge?.id,
          language: language,
          code: code,
        }),
      });

      let realScore = 0;
      if (evalRes.ok) {
        const evalData = await evalRes.json();
        realScore = evalData.score || 0;
        pushTerminal(`Evaluated: ${realScore}% (${evalData.passed_tests || 0}/${evalData.total_tests || 0} passed)`);
      } else {
        pushTerminal("Evaluation failed. Using code activity.");
        realScore = Math.min(100, Math.floor(code.length / 20));
      }

      setLastScore(realScore);

      const res = await fetch(`${API_BASE_URL}/duo/submit/${duelId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          score: realScore,
        }),
      });

      if (!res.ok) {
        pushTerminal("Submission failed.");
        return;
      }

      const data = await res.json();
      setLastScore(realScore);
      pushTerminal(`Duel score submitted: ${realScore}%`);

      await fetchDuelData(true);

      if (data.status === "completed") {
        pushTerminal("Both players submitted. Opening result...");
        router.push(`/dashboard/duo/${duelId}/result`);
      } else {
        pushTerminal("Waiting for opponent submission...");
      }
    } catch (err) {
      console.error("Submission error:", err);
      pushTerminal("Submission error occurred.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050507] flex items-center justify-center text-white">
        Loading duel...
      </div>
    );
  }

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
            <p className="text-xl font-black uppercase tracking-[0.5em] text-gray-500 mt-10">
              Prepare for Battle
            </p>
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
          onReset={() => {
            setCode("");
            pushTerminal("Editor reset.");
          }}
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

      <footer className="h-16 border-t border-white/10 bg-[#0a0a0a] px-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="h-2 w-32 rounded-full bg-white/5 overflow-hidden">
            <div
              className="h-full bg-blue-500 transition-all duration-500"
              style={{ width: `${opponentProgress}%` }}
            />
          </div>
          <span className="text-[10px] font-black uppercase tracking-widest text-blue-400">
            {opponentSubmitted ? `Opponent ${opponentScore}%` : "Opponent Coding..."}
          </span>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-[10px] font-black uppercase tracking-widest text-pink-400">
            {mySubmitted ? `Your Progress ${myScore}%` : "Your Progress"}
          </span>
          <div className="h-2 w-32 rounded-full bg-white/5 overflow-hidden">
            <div
              className="h-full bg-pink-500 transition-all duration-500"
              style={{ width: `${myProgress}%` }}
            />
          </div>
        </div>
      </footer>
    </div>
  );
}