"use client";

import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, Code2, Rocket, Trophy } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

interface UserStats {
  challengesPlayed: number;
  totalSolved: number;
  currentStreak: number;
}

const onboardingSteps = [
  {
    badge: "Welcome",
    title: "Welcome to CodeMaster",
    description:
      "Your personal space to learn, practice, master, and build real coding confidence.",
    Icon: Rocket,
  },
  {
    badge: "Learn",
    title: "Start with guided learning",
    description:
      "Follow structured learning paths for JavaScript, Python, Go, algorithms, data structures, and more.",
    Icon: BookOpen,
  },
  {
    badge: "Practice",
    title: "Solve real challenges",
    description:
      "Move from theory to action by solving coding problems, running code, and submitting solutions.",
    Icon: Code2,
  },
  {
    badge: "Grow",
    title: "Build streaks and climb",
    description:
      "Stay consistent, improve your rank, track progress, and compete on the leaderboard.",
    Icon: Trophy,
  },
];

function getOnboardingKey() {
  if (typeof window === "undefined") return "codemaster_seen_onboarding_guest";

  const userEmail = localStorage.getItem("user_email");
  const userName = localStorage.getItem("user_name");
  const fallbackId = userEmail || userName || "guest";

  return `codemaster_seen_onboarding_${fallbackId}`;
}

export default function WelcomeOnboardingModal() {
  const router = useRouter();
  const { theme } = useTheme();
  const isLight = theme === "light";

  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [step, setStep] = useState(0);

  const currentStep = onboardingSteps[step];
  const StepIcon = currentStep.Icon;
  const isLastStep = step === onboardingSteps.length - 1;

  useEffect(() => {
    setMounted(true);

    const token = localStorage.getItem("terminal_token");
    const onboardingKey = getOnboardingKey();
    const hasSeenOnboarding = localStorage.getItem(onboardingKey);

    if (hasSeenOnboarding) return;

    setStep(0);

    if (!token) {
      setIsOpen(true);
      return;
    }

    fetch(
      `${
        process.env.NEXT_PUBLIC_BACKEND_URL || "http://127.0.0.1:8080"
      }/dashboard/stats`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    )
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch dashboard stats");
        return res.json();
      })
      .then((data) => {
        const source = data?.stats || data || {};

        const stats = {
          challengesPlayed: source?.challengesPlayed || 0,
          totalSolved: source?.totalSolved || 0,
          currentStreak: source?.currentStreak || 0,
        };

        setUserStats(stats);

        const isNewUser = stats.challengesPlayed === 0 && stats.totalSolved === 0;

        if (isNewUser) {
          setIsOpen(true);
        } else {
          localStorage.setItem(onboardingKey, "true");
        }
      })
      .catch(() => {
        setIsOpen(true);
      });
  }, []);

  useEffect(() => {
    if (!mounted || !isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen, mounted]);

  const handleClose = () => {
    localStorage.setItem(getOnboardingKey(), "true");
    setIsOpen(false);
  };

  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") handleClose();
    };

    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen]);

  const handleAction = (route: string) => {
    localStorage.setItem(getOnboardingKey(), "true");
    setIsOpen(false);
    router.push(route);
  };

  const handleNext = () => {
    if (!isLastStep) setStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setStep((prev) => Math.max(prev - 1, 0));
  };

  const hasStartedLearning = (userStats?.currentStreak || 0) > 0;
  const hasPlayedChallenges = (userStats?.challengesPlayed || 0) > 0;

  const learningButtonText = hasStartedLearning
    ? "Continue Learning"
    : "Start Learning";

  const challengeButtonText = hasPlayedChallenges
    ? "Continue Challenges"
    : "Try a Challenge";

  const progressPercent = useMemo(() => {
    return ((step + 1) / onboardingSteps.length) * 100;
  }, [step]);

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
                ? "bg-slate-950/50 backdrop-blur-md"
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
              className={`relative mx-auto w-full max-w-lg overflow-hidden rounded-[28px] border shadow-2xl ${
                isLight
                  ? "border-gray-200 bg-white shadow-[0_24px_70px_rgba(15,23,42,0.22)]"
                  : "border-white/10 bg-[#08080b] shadow-[0_24px_80px_rgba(0,0,0,0.65)]"
              }`}
            >
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-pink-500/60 to-transparent" />

              <div
                className={`absolute -right-16 -top-16 h-40 w-40 rounded-full blur-3xl ${
                  isLight ? "bg-pink-200/70" : "bg-pink-500/20"
                }`}
              />

              <div
                className={`absolute -left-16 bottom-10 h-40 w-40 rounded-full blur-3xl ${
                  isLight ? "bg-purple-200/60" : "bg-purple-500/10"
                }`}
              />

              <button
                type="button"
                onClick={handleClose}
                className={`absolute right-4 top-4 z-10 rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                  isLight
                    ? "border-gray-200 bg-white/80 text-gray-500 hover:text-gray-900"
                    : "border-white/10 bg-white/[0.04] text-gray-400 hover:text-white"
                }`}
              >
                Skip
              </button>

              <div className="relative p-6 sm:p-7">
                <div className="mb-6">
                  <div className="mb-3 flex items-center justify-between pr-16">
                    <span
                      className={`rounded-full border px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] ${
                        isLight
                          ? "border-pink-200 bg-pink-50 text-pink-600"
                          : "border-pink-500/20 bg-pink-500/10 text-pink-200"
                      }`}
                    >
                      {currentStep.badge}
                    </span>

                    <span
                      className={`text-xs font-medium ${
                        isLight ? "text-gray-500" : "text-gray-500"
                      }`}
                    >
                      Step {step + 1} of {onboardingSteps.length}
                    </span>
                  </div>

                  <div
                    className={`h-1.5 overflow-hidden rounded-full ${
                      isLight ? "bg-gray-100" : "bg-white/10"
                    }`}
                  >
                    <motion.div
                      className="h-full rounded-full bg-gradient-to-r from-pink-500 to-purple-600"
                      initial={false}
                      animate={{ width: `${progressPercent}%` }}
                      transition={{ duration: 0.35, ease: "easeOut" }}
                    />
                  </div>
                </div>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={step}
                    initial={{ opacity: 0, x: 24 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -24 }}
                    transition={{ duration: 0.22, ease: "easeOut" }}
                  >
                    <div
                      className={`mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border text-pink-500 ${
                        isLight
                          ? "border-gray-200 bg-gradient-to-br from-pink-50 to-purple-50 shadow-sm"
                          : "border-white/10 bg-white/[0.04]"
                      }`}
                    >
                      <StepIcon className="h-8 w-8" strokeWidth={2.2} />
                    </div>

                    <h2
                      className={`text-2xl font-bold tracking-tight sm:text-[1.8rem] ${
                        isLight ? "text-gray-950" : "text-white"
                      }`}
                    >
                      {currentStep.title}
                    </h2>

                    <p
                      className={`mt-3 text-sm leading-7 ${
                        isLight ? "text-gray-600" : "text-gray-400"
                      }`}
                    >
                      {currentStep.description}
                    </p>

                    <div
                      className={`mt-6 rounded-2xl border p-4 ${
                        isLight
                          ? "border-gray-200 bg-gray-50"
                          : "border-white/10 bg-white/[0.035]"
                      }`}
                    >
                      <p
                        className={`text-xs font-semibold uppercase tracking-[0.16em] ${
                          isLight ? "text-gray-500" : "text-gray-500"
                        }`}
                      >
                        Your first mission
                      </p>

                      <p
                        className={`mt-2 text-sm ${
                          isLight ? "text-gray-700" : "text-gray-300"
                        }`}
                      >
                        {step === 0 &&
                          "Understand how CodeMaster helps you move from learning to real coding practice."}
                        {step === 1 &&
                          "Open the learning path that matches your current goal and start your first topic."}
                        {step === 2 &&
                          "Try a starter challenge, run your code, and submit when your solution passes."}
                        {step === 3 &&
                          "Keep solving consistently to increase your streak and move up the leaderboard."}
                      </p>
                    </div>
                  </motion.div>
                </AnimatePresence>

                <div className="mt-7 flex items-center justify-center gap-2">
                  {onboardingSteps.map((item, index) => (
                    <button
                      key={item.title}
                      type="button"
                      onClick={() => setStep(index)}
                      className={`h-2 rounded-full transition-all ${
                        index === step
                          ? "w-8 bg-gradient-to-r from-pink-500 to-purple-600"
                          : isLight
                          ? "w-2 bg-gray-300 hover:bg-gray-400"
                          : "w-2 bg-white/20 hover:bg-white/35"
                      }`}
                      aria-label={`Go to step ${index + 1}`}
                    />
                  ))}
                </div>

                <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                  <button
                    type="button"
                    onClick={handleBack}
                    disabled={step === 0}
                    className={`h-11 rounded-xl border px-4 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-40 sm:w-28 ${
                      isLight
                        ? "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
                        : "border-white/10 bg-white/[0.04] text-white hover:bg-white/[0.07]"
                    }`}
                  >
                    Back
                  </button>

                  {!isLastStep ? (
                    <button
                      type="button"
                      onClick={handleNext}
                      className="h-11 flex-1 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 px-4 text-sm font-semibold uppercase tracking-[0.12em] text-white transition-all hover:shadow-lg hover:shadow-pink-500/25"
                    >
                      Next Step
                    </button>
                  ) : (
                    <div className="flex flex-1 flex-col gap-3 text-sm sm:flex-row">
                      <button
                        type="button"
                        onClick={() => handleAction("/dashboard/learning")}
                        className="h-11 flex-1 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 px-4 text-xs font-semibold uppercase tracking-[0.12em] text-white transition-all hover:shadow-lg hover:shadow-pink-500/25 flex "
                      >
                        {learningButtonText}
                      </button>

                      <button
                        type="button"
                        onClick={() => handleAction("/dashboard/challenges")}
                        className={`h-11 flex-1 rounded-xl border px-4 text-xs font-semibold uppercase tracking-[0.12em] transition ${
                          isLight
                            ? "border-gray-200 bg-gray-50 text-gray-800 hover:bg-gray-100"
                            : "border-white/10 bg-white/[0.04] text-white hover:bg-white/[0.08]"
                        }`}
                      >
                        {challengeButtonText}
                      </button>
                    </div>
                  )}
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