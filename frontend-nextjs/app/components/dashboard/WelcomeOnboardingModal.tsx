"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export default function WelcomeOnboardingModal() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const hasSeenOnboarding = localStorage.getItem("codemaster_seen_onboarding");
    
    if (!hasSeenOnboarding) {
      setIsOpen(true);
    }
  }, []);

  const handleClose = () => {
    localStorage.setItem("codemaster_seen_onboarding", "true");
    setIsOpen(false);
  };

  const handleAction = (route: string) => {
    localStorage.setItem("codemaster_seen_onboarding", "true");
    setIsOpen(false);
    router.push(route);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center"
        >
          <div 
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={handleClose}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="relative z-10 mx-4 w-full max-w-md overflow-hidden rounded-2xl border border-white/10 bg-[#0a0a0c] shadow-2xl"
          >
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-pink-500/40 to-transparent" />
            <div className="absolute right-0 top-0 h-24 w-24 -translate-y-1/2 translate-x-1/2 rounded-full bg-pink-500/10 blur-3xl" />

            <div className="p-6 sm:p-8">
              <h2 className="text-2xl font-bold tracking-tight text-white sm:text-[1.75rem]">
                Welcome to CodeMaster <span className="text-pink-400">!</span>
              </h2>

              <p className="mt-3 text-sm leading-relaxed text-gray-400">
                Master coding by learning, practicing, and competing.
              </p>

              <div className="mt-6 flex flex-col gap-3">
                <button
                  onClick={() => handleAction("/dashboard/learn")}
                  className="w-full rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 px-4 py-3 text-sm font-semibold uppercase tracking-[0.1em] text-white transition-all hover:shadow-lg hover:shadow-pink-500/25"
                >
                  Start Learning
                </button>

                <button
                  onClick={() => handleAction("/challenges")}
                  className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-medium uppercase tracking-[0.1em] text-white transition-all hover:border-white/20 hover:bg-white/[0.07]"
                >
                  Try a Challenge
                </button>

                <button
                  onClick={handleClose}
                  className="w-full px-4 py-3 text-sm font-medium text-gray-500 transition-colors hover:text-white"
                >
                  Skip
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}