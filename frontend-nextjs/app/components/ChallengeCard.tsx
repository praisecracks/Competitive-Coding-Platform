"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import Link from "next/link";
import Header from "../components/Header";
import Footer from "../components/Footer";

// ----- TYPE DEFINITIONS -----
type Challenge = {
  id: number | string;
  title: string;
  description: string;
  difficulty: "LOW" | "MEDIUM" | "HIGH";
  category?: string;
  duration?: number;
  tags?: string[];
  xp?: number;
  status?: string;
};

interface ChallengeCardProps {
  challenge: Challenge;
  onStart: (c: Challenge) => void;
  playHover?: () => void;
}

function ChallengeCard({ challenge, onStart, playHover }: ChallengeCardProps) {
  const diffColor = {
    LOW: "text-green-500 border-green-500/30 bg-green-500/5",
    MEDIUM: "text-yellow-500 border-yellow-500/30 bg-yellow-500/5",
    HIGH: "text-pink-500 border-pink-500/30 bg-pink-500/5",
  }[challenge.difficulty] || "text-gray-500 border-white/10 bg-white/5";

  return (
    <div
      className="group relative bg-[#0a0a0a] border border-white/10 p-6 transition-all hover:border-pink-500/50 cursor-pointer overflow-hidden"
      onMouseEnter={playHover}
      onClick={() => onStart(challenge)}
    >
      <div className="absolute -right-4 -top-4 text-white/5 font-black text-[3rem] select-none">
        {challenge.id}
      </div>
      <h2 className="text-xl font-black tracking-tighter uppercase italic mb-1 group-hover:text-pink-500 transition-colors">
        {challenge.title}
      </h2>
      {challenge.category && (
        <p className="text-cyan-500/60 text-[9px] mb-2 uppercase">{`[${challenge.category}]`}</p>
      )}
      <p className="text-gray-400 text-xs mb-4 line-clamp-2">{challenge.description}</p>
      <span className={`px-2 py-0.5 border text-[9px] font-mono font-bold ${diffColor}`}>
        {challenge.difficulty}
      </span>
    </div>
  );
}

// ----- MAIN COMPONENT -----
export default function ChallengesMissionPage() {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentUser, setCurrentUser] = useState("GUEST_01");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [time, setTime] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null);
  const [targetPlayer, setTargetPlayer] = useState("");
  const [duelMode, setDuelMode] = useState(false);
  const [terminalActive, setTerminalActive] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);
  const [consoleLogs, setConsoleLogs] = useState<{ msg: string; type: 'info' | 'error' | 'success' | 'warn' }[]>([]);
  const [activeTab, setActiveTab] = useState<'intel' | 'duel'>('intel');

  const clickAudio = useRef<HTMLAudioElement | null>(null);
  const hoverAudio = useRef<HTMLAudioElement | null>(null);
  const consoleEndRef = useRef<HTMLDivElement>(null);

  // ----- EFFECTS -----
  useEffect(() => {
    clickAudio.current = new Audio("/sounds/blip.mp3");
    hoverAudio.current = new Audio("/sounds/hover.mp3");
    clickAudio.current.volume = 0.05;
    hoverAudio.current.volume = 0.02;

    const checkAuth = () => {
      const savedUser = localStorage.getItem("user_name");
      const token = localStorage.getItem("terminal_token");
      if (token) {
        setIsLoggedIn(true);
        setCurrentUser(savedUser?.toUpperCase() || "ADMIN");
      } else {
        setIsLoggedIn(false);
        setCurrentUser("GUEST_01");
      }
    };

    checkAuth();
    window.addEventListener("storage", checkAuth);
    return () => window.removeEventListener("storage", checkAuth);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date().toLocaleTimeString('en-GB', { hour12: false })), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchChallenges = async () => {
      try {
        const res = await fetch("/api/challenges");
        if (res.ok) {
          const data = await res.json();
          setChallenges(data);
        }
      } catch {
        console.error("Database Offline");
      } finally {
        setLoading(false);
      }
    };
    fetchChallenges();
  }, []);

  useEffect(() => {
    consoleEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [consoleLogs]);

  // ----- SOUND HANDLER -----
  const playSound = useCallback((type: "click" | "hover") => {
    const sound = type === "click" ? clickAudio.current : hoverAudio.current;
    if (sound) { sound.currentTime = 0; sound.play().catch(() => {}); }
  }, []);

  // ----- MODAL LOGIC -----
  const openMissionMenu = (challenge: Challenge) => {
    playSound("click");
    if (!isLoggedIn) return; // Could redirect to login
    setSelectedChallenge(challenge);
    setShowModal(true);
  };

  const handleSendChallenge = async () => {
    if (!selectedChallenge) return;
    const token = localStorage.getItem("terminal_token");
    const payload = { to_user: duelMode ? targetPlayer : currentUser, mission_id: selectedChallenge.id };

    try {
      const res = await fetch("/api/profile/challenges/send", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setShowModal(false);
        setDuelMode(false);
        setTargetPlayer("");
        if (!duelMode) setTerminalActive(true);
      }
    } catch { console.error("Error sending challenge"); }
  };

  // ----- TERMINAL RUN LOGIC -----
  const runPayload = () => {
    setIsExecuting(true);
    setConsoleLogs([{ msg: "> INITIALIZING...", type: 'info' }]);
    setTimeout(() => setConsoleLogs(prev => [...prev, { msg: "> RUNNING TEST CASE...", type: 'info' }]), 1000);
    setTimeout(() => setConsoleLogs(prev => [...prev, { msg: "> [SUCCESS] PASSED.", type: 'success' }]), 2000);
    setTimeout(() => { setConsoleLogs(prev => [...prev, { msg: "> [ERROR] OUTPUT MISMATCH", type: 'error' }]); setIsExecuting(false); }, 3000);
  };

  const filteredChallenges = challenges.filter(c =>
    c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.category?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // ----- RENDER -----
  return (
    <div className="flex flex-col min-h-screen bg-[#020202] text-white selection:bg-pink-500/30">
      <Header />

      {/* SEARCH + TIME BAR */}
      <main className="flex-1 container mx-auto px-4 py-8 relative z-10">
        <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
          <span className="font-mono text-[9px] text-gray-500 uppercase">{time}</span>
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search missions..."
            className="px-3 py-2 bg-[#0a0a0a] border border-white/10 text-pink-500 text-xs font-mono rounded w-full sm:w-64"
          />
        </div>

        {/* CHALLENGE GRID */}
        {loading ? (
          <div className="flex justify-center py-20">
            <span className="animate-spin border-t-2 border-pink-500 rounded-full w-8 h-8"></span>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredChallenges.map(ch => (
              <ChallengeCard key={ch.id} challenge={ch} onStart={openMissionMenu} playHover={() => playSound("hover")} />
            ))}
          </div>
        )}
      </main>

      {/* MODAL */}
      {showModal && selectedChallenge && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4 backdrop-blur-md">
          <div className="bg-[#0a0a0a] border border-pink-500/30 p-8 max-w-md w-full">
            <h3 className="text-2xl font-black italic mb-2">{selectedChallenge.title}</h3>
            <button
              onClick={() => { setDuelMode(false); handleSendChallenge(); }}
              className="w-full py-3 mb-2 bg-white/5 border border-white/10 hover:bg-pink-500 hover:text-black font-mono text-xs uppercase"
            >Solo Challenge</button>

            {!duelMode ? (
              <button onClick={() => setDuelMode(true)} className="w-full py-3 bg-white/5">Challenge Player</button>
            ) : (
              <div className="space-y-2 mt-2">
                <input type="text" value={targetPlayer} onChange={e => setTargetPlayer(e.target.value)} className="w-full p-2 border border-pink-500/50 bg-black text-pink-500"/>
                <div className="flex gap-2">
                  <button onClick={() => setDuelMode(false)} className="flex-1 py-2 border">Back</button>
                  <button onClick={handleSendChallenge} className="flex-1 py-2 bg-pink-500 text-black">Send Duel</button>
                </div>
              </div>
            )}
            <button onClick={() => { setShowModal(false); setDuelMode(false); }} className="absolute top-4 right-4">✕</button>
          </div>
        </div>
      )}

      {/* TERMINAL */}
      {terminalActive && (
        <div className="fixed bottom-0 left-0 right-0 h-64 bg-black/90 border-t border-white/10 p-4 overflow-y-auto font-mono text-[10px]">
          <div className="flex justify-between mb-2">
            <span>Terminal Output</span>
            <button onClick={() => setConsoleLogs([])}>Clear</button>
          </div>
          {consoleLogs.length === 0 && <div className="italic text-gray-500">Awaiting instruction...</div>}
          {consoleLogs.map((log, i) => (
            <div key={i} className={log.type === 'error' ? 'text-red-500' : log.type === 'success' ? 'text-green-400' : 'text-cyan-400/70'}>
              [{new Date().toLocaleTimeString()}] {log.msg}
            </div>
          ))}
          <div ref={consoleEndRef} />
          <button onClick={runPayload} disabled={isExecuting} className="mt-2 px-4 py-2 bg-pink-500 text-black">Run Exploit</button>
        </div>
      )}

      <Footer />
    </div>
  );
}