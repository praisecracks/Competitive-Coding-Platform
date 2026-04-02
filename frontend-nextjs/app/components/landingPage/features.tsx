"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  BoltIcon,
  AcademicCapIcon,
  ChartBarIcon,
  ArrowPathRoundedSquareIcon,
  TrophyIcon,
  CpuChipIcon,
} from "@heroicons/react/24/outline";

const roadmapSteps = [
  {
    phase: "01",
    eyebrow: "Learn",
    title: "Purposeful Practice",
    description:
      "Mission-based training keeps practice structured, focused, and effective from the very beginning.",
    tag: "Foundation",
    status: "Active",
    icon: AcademicCapIcon,
  },
  {
    phase: "02",
    eyebrow: "Guide",
    title: "Guided Mastery",
    description:
      "Structured paths, intelligent hints, and support systems help users build true coding mastery while solving.",
    tag: "Learning System",
    status: "Live",
    icon: CpuChipIcon,
  },
  {
    phase: "03",
    eyebrow: "Analyze",
    title: "Mission Reports",
    description:
      "Detailed post-challenge breakdowns reveal strengths, mistakes, missed opportunities, and clear areas for improvement.",
    tag: "Performance Intel",
    status: "Live",
    icon: ChartBarIcon,
  },
  {
    phase: "04",
    eyebrow: "Reflect",
    title: "Replay System",
    description:
      "Users can revisit their problem-solving flow step by step to understand how their thinking evolved during each mission.",
    tag: "Review Flow",
    status: "Core",
    icon: ArrowPathRoundedSquareIcon,
  },
  {
    phase: "05",
    eyebrow: "Track",
    title: "Skill Tracking",
    description:
      "Visual growth tracking exposes patterns, weak spots, and long-term improvement trends across missions.",
    tag: "Growth Layer",
    status: "Progressive",
    icon: BoltIcon,
  },
  {
    phase: "06",
    eyebrow: "Compete",
    title: "Duel Mode",
    description:
      "Real-time developer competitions sharpen speed, confidence, pressure handling, and competitive readiness.",
    tag: "Challenge Layer",
    status: "Advanced",
    icon: TrophyIcon,
  },
];

const analyzerSignals = [
  "Pattern detected",
  "Hash Map strategy identified",
  "Estimated runtime: O(n)",
  "Edge-case warning surfaced",
  "Learning confidence rising",
];

function Features() {
  return (
    <section
      id="features"
      className="relative overflow-hidden bg-[#020202] px-4 py-20 text-white sm:px-6 lg:px-8"
    >
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <motion.div
          animate={{ x: [0, 25, 0], y: [0, -20, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute left-[4%] top-12 h-72 w-72 rounded-full bg-pink-500/12 blur-[120px]"
        />

        <motion.div
          animate={{ x: [0, -30, 0], y: [0, 25, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          className="absolute right-[5%] top-24 h-80 w-80 rounded-full bg-purple-500/12 blur-[140px]"
        />

        <motion.div
          animate={{ scale: [1, 1.08, 1], opacity: [0.35, 0.55, 0.35] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-0 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-fuchsia-500/10 blur-[130px]"
        />

        <div className="absolute inset-0 opacity-[0.06] [background-image:linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:72px_72px]" />

        <motion.div
          animate={{ opacity: [0.04, 0.09, 0.04] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0 bg-[linear-gradient(180deg,transparent,rgba(255,255,255,0.02),transparent)]"
        />
      </div>

      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65 }}
          viewport={{ once: true, amount: 0.2 }}
          className="mx-auto mb-16 max-w-3xl text-center"
        >
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.35em] text-pink-400">
            Core Features
          </p>

          <h2 className="text-2xl font-black uppercase leading-tight tracking-tight sm:text-3xl md:text-2xl lg:text-3xl">
            Build coding skill
            <span className="block bg-gradient-to-r from-pink-500 via-fuchsia-400 to-purple-500 bg-clip-text text-transparent">
              and actually master it
            </span>
          </h2>

    <p className="mt-5 text-xs leading-5 text-gray-400 sm:text-sm">
      CODEMASTER is designed to feel alive while users learn, solve,
      analyze, and improve through a futuristic coding experience.
    </p>
        </motion.div>

        <div className="mx-auto mb-20 grid max-w-6xl gap-8 lg:grid-cols-[1.08fr_0.92fr]">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65 }}
            viewport={{ once: true, amount: 0.15 }}
            className="relative overflow-hidden rounded-[30px] border border-white/10 bg-white/[0.04] p-6 shadow-[0_12px_45px_rgba(0,0,0,0.28)] backdrop-blur-xl sm:p-8"
          >
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-pink-500/70 to-transparent" />
            <div className="absolute -right-16 top-10 h-40 w-40 rounded-full bg-pink-500/10 blur-3xl" />

            <div className="mb-4 flex flex-wrap items-center gap-3">
              <span className="inline-flex rounded-full border border-purple-400/20 bg-purple-500/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.24em] text-purple-300">
                Core Intelligence
              </span>
              <motion.span
                animate={{ opacity: [0.65, 1, 0.65] }}
                transition={{ duration: 2.2, repeat: Infinity }}
                className="inline-flex rounded-full border border-emerald-400/20 bg-emerald-500/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.24em] text-emerald-300"
              >
                Live System
              </motion.span>
            </div>

            <h3 className="mb-4 text-xl font-black leading-tight tracking-tight sm:text-2xl md:text-2xl">
              Live Thinking Analyzer
            </h3>

            <p className="mb-6 max-w-xl text-xs leading-7 text-gray-400 xs:text-base">
              The system actively analyzes logic, strategy, and coding behavior
              while the user solves missions, turning the experience into a live
              training environment instead of a passive challenge page.
            </p>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {[
                {
                  label: "Real-time Guidance",
                  desc: "Active hints and useful signals while coding.",
                },
                {
                  label: "Smarter Practice",
                  desc: "Training becomes intentional instead of random.",
                },
                {
                  label: "Strategy Insight",
                  desc: "Better approaches surfaced before submission.",
                },
                {
                  label: "Learning Loop",
                  desc: "Code, review, improve, repeat continuously.",
                },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  whileHover={{ y: -4, scale: 1.01 }}
                  transition={{ duration: 0.22 }}
                  className="group rounded-2xl border border-white/10 bg-black/20 p-4 transition-all duration-300 hover:border-pink-500/25 hover:bg-white/[0.05]"
                >
                  <div className="mb-3 flex items-center gap-2">
                    <motion.span
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        delay: i * 0.25,
                      }}
                      className="h-2 w-2 rounded-full bg-gradient-to-r from-pink-500 to-purple-500"
                    />
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white">
                      {item.label}
                    </p>
                  </div>
                  <p className="text-sm leading-6 text-gray-400">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65 }}
            viewport={{ once: true, amount: 0.15 }}
            className="relative overflow-hidden rounded-[30px] border border-white/10 bg-[#08080b]/95 p-6 shadow-[0_16px_55px_rgba(0,0,0,0.35)] backdrop-blur-xl"
          >
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-purple-500/60 to-transparent" />
            <div className="absolute -left-16 bottom-0 h-40 w-40 rounded-full bg-purple-500/10 blur-3xl" />

            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <motion.span
                  animate={{ scale: [1, 1.15, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="h-2.5 w-2.5 rounded-full bg-pink-500"
                />
                <span className="h-2.5 w-2.5 rounded-full bg-purple-500" />
                <span className="h-2.5 w-2.5 rounded-full bg-white/30" />
              </div>

              <span className="inline-flex rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] uppercase tracking-[0.24em] text-gray-400">
                Tactical Terminal
              </span>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/40 p-4 sm:p-5">
              <div className="space-y-3 font-mono text-xs leading-relaxed sm:text-sm">
                <p className="text-gray-500">{">"} mission.run()</p>

                {analyzerSignals.map((signal, index) => (
                  <motion.p
                    key={signal}
                    initial={{ opacity: 0.45 }}
                    animate={{ opacity: [0.45, 1, 0.45] }}
                    transition={{
                      duration: 2.2,
                      repeat: Infinity,
                      delay: index * 0.35,
                    }}
                    className={
                      index === 0
                        ? "text-emerald-400"
                        : index === 3
                        ? "text-pink-400"
                        : index === 4
                        ? "text-purple-300"
                        : "text-gray-300"
                    }
                  >
                    {index === 0 ? "✓ " : index === 3 ? "! " : "> "}
                    {signal}
                  </motion.p>
                ))}

                <p className="text-gray-500">{">"} report.generate()</p>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3">
              {[
                { label: "Accuracy", value: "94%" },
                { label: "Efficiency", value: "O(n)" },
                { label: "Learning", value: "Active" },
                { label: "Rank Impact", value: "+12" },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  whileHover={{ y: -3 }}
                  className="rounded-2xl border border-white/10 bg-white/[0.04] p-4"
                >
                  <p className="text-[11px] uppercase tracking-[0.22em] text-gray-500">
                    {item.label}
                  </p>
                  <p className="mt-2 text-lg font-black text-white">
                    {item.value}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65 }}
          viewport={{ once: true, amount: 0.2 }}
          className="mx-auto mb-12 max-w-3xl text-center"
        >
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.32em] text-pink-400">
            Mastery Roadmap
          </p>

          <h3 className="text-2xl font-black uppercase tracking-tight sm:text-3xl md:text-4xl">
            A living path from
            <span className="bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
              {" "}
              coding to mastery
            </span>
          </h3>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-gray-400 sm:text-base">
            The roadmap should feel active, intelligent, and futuristic — like a
            real startup product system that evolves with the user.
          </p>
        </motion.div>

        <div className="mx-auto max-w-6xl">
          <div className="relative">
            <div className="absolute left-5 top-0 h-full w-px bg-gradient-to-b from-pink-500/50 via-purple-500/35 to-transparent md:left-1/2 md:-translate-x-1/2" />

            <motion.div
              animate={{ opacity: [0.35, 0.9, 0.35], y: [0, 18, 0] }}
              transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
              className="absolute left-5 top-0 h-24 w-[2px] -translate-x-1/2 bg-gradient-to-b from-pink-400 via-fuchsia-400 to-transparent shadow-[0_0_20px_rgba(236,72,153,0.45)] md:left-1/2"
            />

            <div className="space-y-8 md:space-y-10">
              {roadmapSteps.map((step, index) => {
                const isLeft = index % 2 === 0;
                const Icon = step.icon;

                return (
                  <motion.div
                    key={step.title}
                    initial={{ opacity: 0, y: 28 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.15 }}
                    transition={{ duration: 0.55, delay: index * 0.05 }}
                    className="relative grid grid-cols-1 md:grid-cols-2 md:gap-12"
                  >
                    <div className="absolute left-5 top-8 z-20 -translate-x-1/2 md:left-1/2">
                      <motion.div
                        animate={{
                          boxShadow: [
                            "0 0 0px rgba(236,72,153,0.15)",
                            "0 0 22px rgba(236,72,153,0.45)",
                            "0 0 0px rgba(236,72,153,0.15)",
                          ],
                          scale: [1, 1.08, 1],
                        }}
                        transition={{
                          duration: 2.5,
                          repeat: Infinity,
                          delay: index * 0.18,
                        }}
                        className="relative flex h-4 w-4 items-center justify-center rounded-full border border-white/20 bg-gradient-to-br from-pink-500 to-purple-500"
                      >
                        <div className="absolute h-9 w-9 rounded-full bg-pink-500/20 blur-md" />
                      </motion.div>
                    </div>

                    <div
                      className={`pl-12 md:pl-0 ${
                        isLeft ? "md:pr-10" : "md:order-2 md:pl-10"
                      }`}
                    >
                      <motion.div
                        whileHover={{ y: -6, scale: 1.01 }}
                        transition={{ duration: 0.24 }}
                        className="group relative overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.05] p-6 shadow-[0_14px_45px_rgba(0,0,0,0.24)] backdrop-blur-xl hover:border-pink-500/25 hover:bg-white/[0.07] sm:p-7"
                      >
                        <motion.div
                          animate={{ x: ["-120%", "220%"] }}
                          transition={{
                            duration: 4.5,
                            repeat: Infinity,
                            ease: "linear",
                            delay: index * 0.35,
                          }}
                          className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-[-20deg]"
                        />

                        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-pink-500/60 to-transparent" />

                        <div className="mb-5 flex flex-wrap items-center gap-3">
                          <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-gradient-to-br from-pink-500/15 to-purple-500/15 text-white">
                            <Icon className="h-5 w-5" />
                          </div>

                          <div>
                            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-pink-400">
                              {step.eyebrow}
                            </p>
                            <p className="text-[11px] uppercase tracking-[0.18em] text-gray-500">
                              Phase {step.phase}
                            </p>
                          </div>

                          <motion.span
                            animate={{ opacity: [0.7, 1, 0.7] }}
                            transition={{
                              duration: 2.2,
                              repeat: Infinity,
                              delay: index * 0.25,
                            }}
                            className="ml-auto inline-flex rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-gray-300"
                          >
                            {step.status}
                          </motion.span>
                        </div>

                        <div className="mb-3 flex flex-wrap items-center gap-2">
                          <h4 className="text-xl font-black text-white">
                            {step.title}
                          </h4>

                          <span className="inline-flex rounded-full border border-purple-400/15 bg-purple-500/10 px-2.5 py-1 text-[10px] uppercase tracking-[0.18em] text-purple-300">
                            {step.tag}
                          </span>
                        </div>

                        <p className="text-sm leading-6 text-gray-400 sm:text-[15px]">
                          {step.description}
                        </p>

                        <div className="mt-5 flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-gray-500">
                          <motion.span
                            animate={{ opacity: [0.45, 1, 0.45] }}
                            transition={{
                              duration: 1.8,
                              repeat: Infinity,
                              delay: index * 0.2,
                            }}
                            className="h-1.5 w-1.5 rounded-full bg-pink-400"
                          />
                          <span>Part of the mastery system</span>
                        </div>
                      </motion.div>
                    </div>

                    <div
                      className={`hidden md:block ${
                        isLeft ? "md:order-2" : "md:order-1"
                      }`}
                    />
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 26 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.12 }}
          transition={{ duration: 0.6 }}
          className="mx-auto mt-16 max-w-4xl"
        >
          <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-gradient-to-br from-white/[0.05] to-white/[0.02] p-8 text-center shadow-[0_18px_60px_rgba(0,0,0,0.28)] backdrop-blur-xl">
            <div className="absolute left-1/2 top-0 h-px w-40 -translate-x-1/2 bg-gradient-to-r from-transparent via-pink-500/70 to-transparent" />
            <motion.div
              animate={{ opacity: [0.25, 0.55, 0.25], scale: [1, 1.08, 1] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="absolute left-1/2 top-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full bg-pink-500/10 blur-3xl"
            />

            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.32em] text-pink-400">
              Final Outcome
            </p>

            <h4 className="text-2xl font-black uppercase tracking-tight sm:text-3xl">
              From solving problems
              <span className="block bg-gradient-to-r from-pink-500 via-fuchsia-400 to-purple-500 bg-clip-text text-transparent">
                to mastering how to think
              </span>
            </h4>

            <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-gray-400 sm:text-base">
              This is the difference between a challenge website and an
              intelligent coding training product. CODEMASTER helps users code,
              learn, improve, and compete inside a system built for mastery.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default Features;