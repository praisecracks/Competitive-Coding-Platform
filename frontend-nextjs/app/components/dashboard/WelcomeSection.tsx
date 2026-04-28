"use client";

import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

interface WelcomeSectionProps {
  userName: string;
  actionTitle?: string;
  actionSubtitle?: string;
  actionButtonLabel?: string;
  secondaryButtonLabel?: string;
  onActionClick?: () => void;
  onSecondaryActionClick?: () => void;
}

export default function WelcomeSection({
  userName,
  actionTitle = "Continue your learning journey",
  actionSubtitle = "Pick up from where you stopped and keep building stronger problem-solving depth.",
  actionButtonLabel = "Continue Learning",
  secondaryButtonLabel = "Explore Challenges",
  onActionClick,
  onSecondaryActionClick,
}: WelcomeSectionProps) {
  const { theme } = useTheme();
  const isLight = theme === "light";

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className={`relative overflow-hidden rounded-[24px] border px-4 py-4 sm:px-5 sm:py-5 lg:rounded-[28px] lg:p-6 xl:p-5 ${
        isLight
          ? "border-gray-200 bg-white shadow-[0_14px_38px_rgba(15,23,42,0.07)]"
          : "border-white/10 bg-[#09090c]"
      }`}
    >
      <div
        className={`absolute inset-0 ${
          isLight
            ? "bg-[radial-gradient(circle_at_top_right,rgba(168,85,247,0.1),transparent_28%),radial-gradient(circle_at_left,rgba(236,72,153,0.06),transparent_24%)]"
            : "bg-[radial-gradient(circle_at_top_right,rgba(168,85,247,0.14),transparent_28%),radial-gradient(circle_at_left,rgba(236,72,153,0.09),transparent_24%)]"
        }`}
      />

      <div
        className={`absolute inset-0 ${
          isLight
            ? "opacity-[0.025] [background-image:linear-gradient(rgba(15,23,42,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(15,23,42,0.1)_1px,transparent_1px)] [background-size:28px_28px]"
            : "opacity-[0.05] [background-image:linear-gradient(rgba(255,255,255,0.09)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.09)_1px,transparent_1px)] [background-size:28px_28px]"
        }`}
      />

      <div className="relative flex flex-col gap-5 lg:flex-row lg:items-stretch lg:justify-between lg:gap-6">
        <div className="flex max-w-2xl flex-col justify-center">
          <span
            className={`inline-flex w-fit items-center gap-2 rounded-full border px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.18em] sm:px-3 sm:text-[10px] sm:tracking-[0.22em] ${
              isLight
                ? "border-pink-200 bg-pink-50 text-pink-600"
                : "border-pink-500/20 bg-pink-500/[0.08] text-pink-200"
            }`}
          >
            <Sparkles className="h-3 w-3" />
            Dashboard overview
          </span>

          <h1
            className={`mt-3 text-xl font-semibold leading-tight tracking-tight sm:text-2xl lg:mt-4 lg:text-[2rem] xl:text-[2.35rem] ${
              isLight ? "text-gray-900" : "text-white"
            }`}
          >
            Welcome back,{" "}
            <span className="bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
              {userName}
            </span>
          </h1>

          <p
            className={`mt-2 max-w-xl text-[13px] leading-6 sm:text-sm lg:mt-3 ${
              isLight ? "text-gray-600" : "text-gray-400"
            }`}
          >
            Track your progress, continue learning with intention, and sharpen
            your coding mastery one challenge at a time.
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.98, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.08 }}
          className={`relative w-full overflow-hidden rounded-[22px] border p-4 backdrop-blur-sm lg:max-w-md lg:rounded-[26px] ${
            isLight
              ? "border-pink-100 bg-white shadow-[0_14px_35px_rgba(236,72,153,0.08)]"
              : "border-pink-500/15 bg-white/[0.035] shadow-[0_20px_60px_rgba(0,0,0,0.22)]"
          }`}
        >
          <div
            className={`absolute inset-x-0 top-0 h-px ${
              isLight
                ? "bg-gradient-to-r from-transparent via-pink-300 to-transparent"
                : "bg-gradient-to-r from-transparent via-pink-500/60 to-transparent"
            }`}
          />

          <div className="mb-3 flex items-center justify-between gap-3">
            <p
              className={`text-[10px] font-semibold uppercase tracking-[0.2em] sm:text-[11px] ${
                isLight ? "text-pink-600" : "text-pink-300"
              }`}
            >
              Next move
            </p>

            <span
              className={`rounded-full border px-2.5 py-1 text-[10px] font-medium ${
                isLight
                  ? "border-pink-200 bg-pink-50 text-pink-600"
                  : "border-pink-500/20 bg-pink-500/[0.08] text-pink-200"
              }`}
            >
              Recommended
            </span>
          </div>

          <h2
            className={`text-base font-semibold leading-6 tracking-tight sm:text-lg ${
              isLight ? "text-gray-900" : "text-white"
            }`}
          >
            {actionTitle}
          </h2>

          <p
            className={`mt-2 text-[13px] leading-6 sm:text-sm ${
              isLight ? "text-gray-600" : "text-gray-400"
            }`}
          >
            {actionSubtitle}
          </p>

          <div className="mt-4 flex flex-col gap-2.5 sm:flex-row">
            <button
              onClick={onActionClick}
              className="group flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-pink-500 to-purple-500 px-4 py-3 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(236,72,153,0.22)] transition duration-200 hover:opacity-95"
            >
              {actionButtonLabel}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </button>

            <button
              onClick={onSecondaryActionClick}
              className={`rounded-xl border px-4 py-3 text-sm font-medium transition duration-200 ${
                isLight
                  ? "border-gray-200 bg-gray-50 text-gray-800 hover:bg-gray-100"
                  : "border-white/10 bg-white/[0.04] text-white hover:bg-white/[0.08]"
              }`}
            >
              {secondaryButtonLabel}
            </button>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
}