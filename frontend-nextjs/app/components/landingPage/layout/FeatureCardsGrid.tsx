"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AcademicCapIcon,
  ChartBarIcon,
  ArrowPathRoundedSquareIcon,
  TrophyIcon,
  SparklesIcon,
  ClockIcon,
  ChartPieIcon,
  FireIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";

const featureCards = [
  {
    title: "Guided Mastery",
    label: "Learning System",
    description:
      "Structured missions, intelligent hints, and clear challenge flow help users build real coding confidence over time.",
    moreDetails:
      "Progress through carefully curated challenges that adapt to your skill level. Get real-time hints when stuck and track your mastery with detailed progress analytics.",
    icon: AcademicCapIcon,
    accent: "from-cyan-500/15 to-blue-500/15",
    border: "hover:border-cyan-400/25",
    preview: "learning",
  },
  {
    title: "Mission Reports",
    label: "Performance Intel",
    description:
      "Post-challenge breakdowns highlight mistakes, strengths, and better paths for improvement after every mission.",
    moreDetails:
      "After each challenge, receive a comprehensive report analyzing your approach, time complexity, and providing actionable suggestions for improvement.",
    icon: ChartBarIcon,
    accent: "from-pink-500/15 to-purple-500/15",
    border: "hover:border-pink-500/25",
    preview: "report",
  },
  {
    title: "Replay System",
    label: "Review Flow",
    description:
      "Revisit your mission step by step to understand how you solved, where you slowed down, and what to improve next.",
    moreDetails:
      "Watch your solution play back in real-time. Identify bottlenecks, compare with optimal solutions, and learn from your mistakes.",
    icon: ArrowPathRoundedSquareIcon,
    accent: "from-amber-500/15 to-orange-500/15",
    border: "hover:border-amber-400/25",
    preview: "replay",
  },
  {
    title: "Duel Mode",
    label: "Competitive Layer",
    description:
      "Competitive coding sessions sharpen speed, confidence, and decision-making under pressure.",
    moreDetails:
      "Compete head-to-head in real-time coding battles. Climb the ranks, earn badges, and prove your coding prowess against developers worldwide.",
    icon: TrophyIcon,
    accent: "from-emerald-500/15 to-teal-500/15",
    border: "hover:border-emerald-400/25",
    preview: "duel",
  },
];

function LearningPreview() {
  return (
    <div className="rounded-[18px] border border-white/10 bg-black/25 p-3.5">
      <div className="mb-2.5 flex items-center justify-between">
        <span className="text-[9px] uppercase tracking-[0.18em] text-gray-500">
          Progress Path
        </span>
        <span className="inline-flex items-center gap-1 text-[9px] uppercase tracking-[0.18em] text-cyan-300">
          <SparklesIcon className="h-3 w-3" />
          Guided
        </span>
      </div>

      <div className="space-y-2.5">
        {[
          { name: "Arrays Basics", active: true },
          { name: "Hash Map Patterns", active: true },
          { name: "Pointer Logic", active: false },
        ].map((item) => (
          <div
            key={item.name}
            className="flex items-center justify-between rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2"
          >
            <span className="text-[13px] text-gray-300">{item.name}</span>
            <span
              className={`text-[9px] font-semibold uppercase tracking-[0.16em] ${
                item.active ? "text-emerald-300" : "text-gray-500"
              }`}
            >
              {item.active ? "Unlocked" : "Queued"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ReportPreview() {
  return (
    <div className="rounded-[18px] border border-white/10 bg-black/25 p-3.5">
      <div className="mb-2.5 flex items-center justify-between">
        <span className="text-[9px] uppercase tracking-[0.18em] text-gray-500">
          Latest Report
        </span>
        <span className="text-[9px] uppercase tracking-[0.18em] text-pink-300">
          Mission #24
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2.5">
        {[
          { label: "Accuracy", value: "94%" },
          { label: "Runtime", value: "O(n)" },
          { label: "Score", value: "+12" },
          { label: "Mistakes", value: "2" },
        ].map((item) => (
          <div
            key={item.label}
            className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2.5"
          >
            <p className="text-[9px] uppercase tracking-[0.16em] text-gray-500">
              {item.label}
            </p>
            <p className="mt-1 text-[15px] font-black text-white">
              {item.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

function ReplayPreview() {
  return (
    <div className="rounded-[18px] border border-white/10 bg-black/25 p-3.5">
      <div className="mb-3 flex items-center justify-between">
        <span className="text-[9px] uppercase tracking-[0.18em] text-gray-500">
          Replay Timeline
        </span>
        <ClockIcon className="h-3.5 w-3.5 text-amber-300" />
      </div>

      <div className="space-y-2.5">
        {[
          { time: "00:12", label: "Brute-force attempt", active: false },
          { time: "01:08", label: "Pattern recognized", active: true },
          { time: "02:14", label: "Hash map switch", active: true },
        ].map((item, index) => (
          <div key={item.time} className="flex gap-2.5">
            <div className="flex flex-col items-center">
              <span
                className={`mt-1 h-2 w-2 rounded-full ${
                  item.active ? "bg-amber-300" : "bg-white/20"
                }`}
              />
              {index !== 2 && <span className="mt-1 h-7 w-px bg-white/10" />}
            </div>

            <div className="flex-1 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2">
              <div className="flex items-center justify-between gap-3">
                <span className="text-[13px] text-gray-300">{item.label}</span>
                <span className="text-[9px] uppercase tracking-[0.16em] text-gray-500">
                  {item.time}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function DuelPreview() {
  return (
    <div className="rounded-[18px] border border-white/10 bg-black/25 p-3.5">
      <div className="mb-3 flex items-center justify-between">
        <span className="text-[9px] uppercase tracking-[0.18em] text-gray-500">
          Live Match
        </span>
        <span className="inline-flex items-center gap-1 text-[9px] uppercase tracking-[0.16em] text-emerald-300">
          <FireIcon className="h-3 w-3" />
          Ranked
        </span>
      </div>

      <div className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-3">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[13px] font-semibold text-white">You</p>
            <p className="text-[9px] uppercase tracking-[0.14em] text-gray-500">
              Current score
            </p>
          </div>
          <p className="text-[16px] font-black text-emerald-300">128</p>
        </div>

        <div className="my-3 h-px bg-white/10" />

        <div className="flex items-center justify-between">
          <div>
            <p className="text-[13px] font-semibold text-white">Opponent</p>
            <p className="text-[9px] uppercase tracking-[0.14em] text-gray-500">
              Match score
            </p>
          </div>
          <p className="text-[16px] font-black text-white">121</p>
        </div>

        <div className="mt-3.5 h-2 overflow-hidden rounded-full bg-white/10">
          <div className="h-full w-[68%] rounded-full bg-gradient-to-r from-emerald-400 to-teal-400" />
        </div>
      </div>
    </div>
  );
}

function FeaturePreview({ type }: { type: string }) {
  switch (type) {
    case "learning":
      return <LearningPreview />;
    case "report":
      return <ReportPreview />;
    case "replay":
      return <ReplayPreview />;
    case "duel":
      return <DuelPreview />;
    default:
      return null;
  }
}

export default function FeatureCardsGrid() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const goToPrevious = useCallback(() => {
    setCurrentIndex((prev) => (prev === 0 ? featureCards.length - 1 : prev - 1));
  }, []);

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev === featureCards.length - 1 ? 0 : prev + 1));
  }, []);

  useEffect(() => {
    if (isPaused || isHovered) return;
    const interval = setInterval(() => {
      goToNext();
    }, 4000);
    return () => clearInterval(interval);
  }, [isPaused, isHovered, goToNext]);

  const currentFeature = featureCards[currentIndex];
  const Icon = currentFeature.icon;

  return (
    <div className="mx-auto mt-12 max-w-5xl">
      <div className="mb-8 text-center">
        <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.28em] text-pink-400">
          What the platform offers
        </p>

        <h3 className="text-[1.85rem] font-black tracking-[-0.05em] text-gray-600 sm:text-[2.15rem]">
          Product features designed for
          <span className="bg-gradient-to-r from-gray-500 to-gray-400 bg-clip-text text-transparent">
            {" "}real coding progress
          </span>
        </h3>

        <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-gray-400">
          Every layer of CODEMASTER is designed to help users learn better,
          review faster, and improve with more clarity.
        </p>
      </div>

      <div 
        className="relative"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <button
          onClick={goToPrevious}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          className="absolute left-0 top-1/2 z-20 -translate-y-1/2 flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-black/70 backdrop-blur-xl transition-all duration-300 hover:scale-110 hover:border-pink-500/50 hover:bg-gradient-to-r hover:from-pink-500/20 hover:to-purple-500/20"
          aria-label="Previous feature"
        >
          <ChevronLeftIcon className="h-5 w-5 text-gray-300 transition-all duration-300 group-hover:text-white" />
        </button>

        <button
          onClick={goToNext}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          className="absolute right-0 top-1/2 z-20 -translate-y-1/2 flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-black/70 backdrop-blur-xl transition-all duration-300 hover:scale-110 hover:border-pink-500/50 hover:bg-gradient-to-r hover:from-pink-500/20 hover:to-purple-500/20"
          aria-label="Next feature"
        >
          <ChevronRightIcon className="h-5 w-5 text-gray-300 transition-all duration-300 group-hover:text-white" />
        </button>

        <div className="overflow-hidden px-14">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 80 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -80 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="relative overflow-hidden rounded-[24px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.018))] p-4 shadow-[0_12px_36px_rgba(0,0,0,0.22)] backdrop-blur-xl sm:p-5"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
              <div
                className={`absolute right-0 top-0 h-24 w-24 rounded-full bg-gradient-to-br ${currentFeature.accent} blur-3xl opacity-80`}
              />

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: isHovered ? 1 : 0 }}
                transition={{ duration: 0.25 }}
                className={`absolute inset-0 z-30 flex items-center justify-center rounded-[24px] bg-black/80 backdrop-blur-xl ${
                  isHovered ? "pointer-events-auto" : "pointer-events-none"
                }`}
              >
                <div className="max-w-sm px-6 text-center">
                  <p className="text-sm font-medium leading-relaxed text-white">
                    {currentFeature.moreDetails}
                  </p>
                </div>
              </motion.div>

              <div className="relative z-10">
                <div className="mb-3.5 flex items-start justify-between gap-4">
                  <div>
                    <p className="mb-2 text-[9px] font-semibold uppercase tracking-[0.22em] text-pink-400">
                      {currentFeature.label}
                    </p>

                    <h4 className="text-[1.2rem] font-black tracking-tight text-white sm:text-[1.35rem]">
                      {currentFeature.title}
                    </h4>
                    <div className="mt-2 h-px w-12 bg-gradient-to-r from-pink-500 to-transparent" />
                  </div>

                  <div
                    className={`inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-gradient-to-br ${currentFeature.accent}`}
                  >
                    <Icon className="h-5 w-5 text-white" />
                  </div>
                </div>

                <p className="max-w-[30rem] text-sm leading-6 text-gray-400">
                  {currentFeature.description}
                </p>

                <div className="mt-5">
                  <FeaturePreview type={currentFeature.preview} />
                </div>

                <div className="mt-4 flex items-center justify-between gap-3 border-t border-white/10 pt-3.5">
                  <div className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.16em] text-gray-500">
                    <span className="h-1.5 w-1.5 rounded-full bg-gradient-to-r from-pink-500 to-purple-500" />
                    Product layer active
                  </div>

                  <div className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.16em] text-gray-400">
                    <ChartPieIcon className="h-3.5 w-3.5 text-pink-300" />
                    Live-ready UI
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="mt-6 flex items-center justify-center gap-2">
          {featureCards.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setCurrentIndex(index);
                setIsPaused(true);
                setTimeout(() => setIsPaused(false), 100);
              }}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? "w-8 bg-gradient-to-r from-pink-500 to-purple-500"
                  : "w-1.5 bg-white/20 hover:bg-white/40"
              }`}
              aria-label={`Go to feature ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}