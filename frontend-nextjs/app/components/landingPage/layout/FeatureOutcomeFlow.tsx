"use client";

import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  BoltIcon,
  AcademicCapIcon,
  ChartBarIcon,
  ArrowTrendingUpIcon,
  TrophyIcon,
} from "@heroicons/react/24/outline";

const productFlow = [
  {
    step: "01",
    title: "Learn",
    description: "Train with focused missions designed for structured growth.",
    icon: AcademicCapIcon,
  },
  {
    step: "02",
    title: "Analyze",
    description: "Get live signals and deeper reports while you solve.",
    icon: ChartBarIcon,
  },
  {
    step: "03",
    title: "Improve",
    description: "Review weak points and build better coding habits over time.",
    icon: ArrowTrendingUpIcon,
  },
  {
    step: "04",
    title: "Compete",
    description: "Put your progress into motion through ranked challenge play.",
    icon: TrophyIcon,
  },
];

export default function FeatureOutcomeFlow() {
  const [hoverPoint, setHoverPoint] = useState({ x: 50, y: 50 });

  const glowStyle = useMemo(
    () => ({
      background: `radial-gradient(circle at ${hoverPoint.x}% ${hoverPoint.y}%, rgba(236,72,153,0.22), rgba(168,85,247,0.14) 22%, transparent 58%)`,
    }),
    [hoverPoint]
  );

  return (
    <div className="mx-auto mt-18 max-w-6xl">
      <div className="mb-10 text-center">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.32em] text-pink-400">
          Product Flow
        </p>

        <h3 className="text-3xl font-black tracking-[-0.04em] text-white sm:text-4xl">
          A clear path from
          <span className="bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
            {" "}practice to mastery
          </span>
        </h3>

        <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-gray-400 sm:text-base">
          Every layer of the product is designed to move users from solving
          problems to building stronger thinking patterns.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {productFlow.map((item, index) => {
          const Icon = item.icon;

          return (
            <motion.div
              key={item.step}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.18 }}
              transition={{ duration: 0.4, delay: index * 0.06 }}
              whileHover={{ y: -3 }}
              className="group relative overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.035] p-5 backdrop-blur-xl transition-all duration-300 hover:border-purple-500/25 hover:bg-white/[0.05]"
            >
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
              <div className="absolute right-0 top-0 h-24 w-24 rounded-full bg-gradient-to-br from-pink-500/10 to-purple-500/10 blur-3xl opacity-70 transition-opacity duration-300 group-hover:opacity-100" />

              <div className="mb-4 flex items-center justify-between">
                <span className="text-[10px] font-semibold uppercase tracking-[0.24em] text-pink-400">
                  Step {item.step}
                </span>
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04]">
                  <Icon className="h-5 w-5 text-white" />
                </div>
              </div>

              <h4 className="text-xl font-black text-white">{item.title}</h4>
              <p className="mt-3 text-sm leading-6 text-gray-400">
                {item.description}
              </p>

              <div className="mt-5 flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-gray-500">
                <span className="h-1.5 w-1.5 rounded-full bg-gradient-to-r from-pink-500 to-purple-500" />
                Part of the mastery loop
              </div>
            </motion.div>
          );
        })}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.12 }}
        transition={{ duration: 0.55 }}
        className="mx-auto mt-16 max-w-4xl"
      >
        <motion.div
          onMouseMove={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 100;
            const y = ((e.clientY - rect.top) / rect.height) * 100;
            setHoverPoint({ x, y });
          }}
          className="group relative overflow-hidden rounded-[32px] border border-white/10 bg-gradient-to-br from-white/[0.05] to-white/[0.02] p-8 text-center shadow-[0_18px_60px_rgba(0,0,0,0.26)] backdrop-blur-xl"
        >
          <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" style={glowStyle} />
          <div className="absolute left-1/2 top-0 h-px w-40 -translate-x-1/2 bg-gradient-to-r from-transparent via-pink-500/70 to-transparent" />
          <div className="absolute left-1/2 top-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full bg-pink-500/10 blur-3xl" />

          <div className="relative z-10">
            <div className="mx-auto mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-gradient-to-br from-pink-500/15 to-purple-500/15 text-white">
              <BoltIcon className="h-6 w-6" />
            </div>

            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.32em] text-pink-400">
              Final Outcome
            </p>

            <h4 className="text-3xl font-black tracking-[-0.04em] text-white sm:text-4xl">
              More than a challenge page
              <span className="block bg-gradient-to-r from-pink-500 via-fuchsia-400 to-purple-500 bg-clip-text text-transparent">
                a real coding training system
              </span>
            </h4>

            <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-gray-400 sm:text-base">
              CODEMASTER helps users code, review, improve, and compete inside a
              product built for long-term skill growth.
            </p>

            <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-[11px] uppercase tracking-[0.18em] text-gray-300">
              <span className="h-1.5 w-1.5 rounded-full bg-gradient-to-r from-pink-500 to-purple-500" />
              Built for growth, clarity, and competition
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}