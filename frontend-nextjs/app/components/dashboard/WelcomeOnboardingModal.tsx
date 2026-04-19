"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "../../context/ThemeContext";

interface UserStats {
  challengesPlayed: number;
  totalSolved: number;
  currentStreak: number;
}

export default function WelcomeOnboardingModal() {
  const router = useRouter();
  const { theme } = useTheme();
  const isLight = theme === "light";
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [userStats, setUserStats] = useState<UserStats | null>(null);

  useEffect(() => {
    setMounted(true);
    const hasSeenOnboarding = localStorage.getItem("codemaster_seen_onboarding");
    const token = localStorage.getItem("terminal_token");
    
    if (!hasSeenOnboarding) {
      if (!token) {
        setIsOpen(true);
      } else {
        fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || "http://127.0.0.1:8080"}/dashboard/stats`, {
          headers: { Authorization: `Bearer ${token}` },
        })
          .then((res) => res.json())
          .then((data) => {
            const stats = {
              challengesPlayed: data?.stats?.challengesPlayed || 0,
              totalSolved: data?.stats?.totalSolved || 0,
              currentStreak: data?.stats?.currentStreak || 0,
            };
            setUserStats(stats);
            
            const isNewUser = !data?.stats || (stats.challengesPlayed === 0 && stats.totalSolved === 0);
            if (isNewUser) {
              setIsOpen(true);
            } else {
              localStorage.setItem("codemaster_seen_onboarding", "true");
            }
          })
          .catch(() => {
            localStorage.setItem("codemaster_seen_onboarding", "true");
          });
      }
    }
  }, []);

  useEffect(() => {
    if (!mounted || !isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen, mounted]);

  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        handleClose();
      }
    };

    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen]);

  const handleClose = () => {
    localStorage.setItem("codemaster_seen_onboarding", "true");
    setIsOpen(false);
  };

  const handleAction = (route: string) => {
    localStorage.setItem("codemaster_seen_onboarding", "true");
    setIsOpen(false);
    router.push(route);
  };

  // Determine button text based on user progress
  const hasStartedLearning = (userStats?.currentStreak || 0) > 0;
  const hasPlayedChallenges = (userStats?.challengesPlayed || 0) > 0;

  const learningButtonText = hasStartedLearning ? "Continue Learning" : "Start Learning";
  const challengeButtonText = hasPlayedChallenges ? "Continue Challenges" : "Try a Challenge";

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[300]">
          <motion.button
            type="button"
            aria-label="Close onboarding"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className={`absolute inset-0 h-screen w-screen ${
              isLight
                ? "bg-slate-900/50 backdrop-blur-md"
                : "bg-black/80 backdrop-blur-md"
            }`}
          />

          <div className="absolute inset-0 flex min-h-screen items-center justify-center overflow-y-auto p-4">
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label="Welcome to CodeMaster"
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              onClick={(e) => e.stopPropagation()}
              className={`relative mx-auto w-full max-w-md overflow-hidden rounded-2xl border shadow-2xl ${
                isLight
                  ? "border-gray-200 bg-white shadow-xl"
                  : "border-white/10 bg-[#0a0a0c]"
              }`}
            >
              <div className={`absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-pink-500/40 to-transparent ${
                isLight ? "via-pink-400" : "via-pink-500/40"
              }`} />
              <div className={`absolute right-0 top-0 h-24 w-24 -translate-y-1/2 translate-x-1/2 rounded-full blur-3xl ${
                isLight ? "bg-pink-200" : "bg-pink-500/10"
              }`} />

              <div className="p-6 sm:p-8">
                <h2 className={`text-2xl font-bold tracking-tight sm:text-[1.75rem] ${
                  isLight ? "text-gray-900" : "text-white"
                }`}>
                  Welcome to CodeMaster <span className={isLight ? "text-pink-600" : "text-pink-400"}>!</span>
                </h2>

                <p className={`mt-3 text-sm leading-relaxed ${
                  isLight ? "text-gray-600" : "text-gray-400"
                }`}>
                  Master coding by learning, practicing, and competing.
                </p>

                <div className="mt-6 flex flex-col gap-3">
                  <button
                    onClick={() => handleAction("/dashboard/learning")}
                    className="w-full rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 px-4 py-3 text-sm font-semibold uppercase tracking-[0.1em] text-white transition-all hover:shadow-lg hover:shadow-pink-500/25"
                  >
                    {learningButtonText}
                  </button>

                  <button
                    onClick={() => handleAction("/dashboard/challenges")}
                    className={`w-full rounded-xl border px-4 py-3 text-sm font-medium uppercase tracking-[0.1em] transition-all ${
                      isLight
                        ? "border-gray-200 bg-gray-50 text-gray-700 hover:border-gray-300 hover:bg-gray-100"
                        : "border-white/10 bg-white/[0.04] text-white hover:border-white/20 hover:bg-white/[0.07]"
                    }`}
                  >
                    {challengeButtonText}
                  </button>

                  <button
                    onClick={handleClose}
                    className={`w-full px-4 py-3 text-sm font-medium transition-colors ${
                      isLight ? "text-gray-500 hover:text-gray-900" : "text-gray-500 hover:text-white"
                    }`}
                  >
                    Skip
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}