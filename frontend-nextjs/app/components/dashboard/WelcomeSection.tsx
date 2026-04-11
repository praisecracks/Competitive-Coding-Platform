"use client";

import { motion } from "framer-motion";

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
  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="relative overflow-hidden rounded-[24px] border border-white/10 bg-[#09090c] px-4 py-4 sm:px-5 sm:py-5 lg:rounded-[28px] lg:p-6 xl:p-4"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(168,85,247,0.12),transparent_28%),radial-gradient(circle_at_left,rgba(236,72,153,0.08),transparent_24%)]" />
      <div className="absolute inset-0 opacity-[0.04] [background-image:linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:28px_28px]" />

      <div className="relative flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between lg:gap-6">
        <div className="max-w-2xl">
          <span className="inline-flex items-center rounded-full border border-pink-500/20 bg-pink-500/[0.08] px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.18em] text-pink-200 sm:px-3 sm:text-[10px] sm:tracking-[0.22em]">
            Dashboard overview
          </span>

          <h1 className="mt-3 text-xl font-semibold leading-tight tracking-tight text-white sm:text-2xl lg:mt-4 lg:text-[2rem] xl:text-[2.35rem]">
            Welcome back,{" "}
            <span className="bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
              {userName}
            </span>
          </h1>

          <p className="mt-2 max-w-xl text-[13px] leading-6 text-gray-400 sm:text-sm lg:mt-3">
            Track your progress, continue learning with intention, and sharpen your
            coding mastery one challenge at a time.
          </p>
        </div>

        <div className="w-full rounded-[20px] border border-white/10 bg-white/[0.03] p-3.5 backdrop-blur-sm sm:p-4 lg:max-w-md lg:rounded-[24px]">
          <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-gray-500 sm:text-[11px] sm:tracking-[0.22em]">
            Next action
          </p>

          <h2 className="mt-2 text-sm font-semibold leading-6 tracking-tight text-white sm:text-[15px] lg:text-lg lg:leading-tight">
            {actionTitle}
          </h2>

          <p className="mt-1.5 text-[12px] leading-5 text-gray-400 sm:text-[13px] sm:leading-6 lg:mt-2 lg:text-sm">
            {actionSubtitle}
          </p>

          <div className="mt-3 flex gap-2 sm:mt-4 lg:mt-5 lg:flex-col xl:flex-row xl:gap-2.5">
            <button
              onClick={onActionClick}
              className="flex-1 rounded-xl bg-gradient-to-r from-pink-500 to-purple-500 px-3.5 py-2.5 text-sm font-medium text-white transition duration-200 hover:opacity-95 lg:px-4 lg:py-3"
            >
              {actionButtonLabel}
            </button>

            <button
              onClick={onSecondaryActionClick}
              className="rounded-xl border border-white/10 bg-white/[0.04] px-3.5 py-2.5 text-sm font-medium text-white transition duration-200 hover:bg-white/[0.08] lg:px-4 lg:py-3"
            >
              {secondaryButtonLabel}
            </button>
          </div>
        </div>
      </div>
    </motion.section>
  );
}