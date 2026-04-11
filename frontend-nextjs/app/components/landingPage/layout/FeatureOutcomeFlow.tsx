"use client";

import React, { useState } from "react";
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

  const glowStyle = {
    background: `radial-gradient(600px circle at ${hoverPoint.x}% ${hoverPoint.y}%, rgba(236, 72, 153, 0.15), transparent 40%)`,
  };

  return (
    <section className="mx-auto mt-20 max-w-6xl px-4 sm:px-6 lg:px-8">
      <div className="mb-12 text-center">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.32em] text-pink-400">
          Product Flow
        </p>

        <h3 className="text-2xl font-black tracking-[-0.04em] text-gray-600 sm:text-3xl lg:text-4xl">
          A clear path from
          <span className="bg-gradient-to-r from-gray-500 to-gray-400 bg-clip-text text-transparent">
            {" "}
            practice to mastery
          </span>
        </h3>

        <p className="mx-auto mt-4 max-w-2xl text-xs leading-7 text-gray-400 xs:text-base">
          Every layer of CODEMASTER is designed to move users from learning
          concepts to building stronger coding instincts through repetition,
          review, and challenge-based growth.
        </p>
      </div>

      <div className="relative overflow-hidden bg-white/[0.02] backdrop-blur-xl">
        {/* <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-pink-500/40 to-transparent" /> */}
        <div className="absolute left-1/2 top-0 h-32 w-40 -translate-x-1/2 rounded-full bg-pink-500/10 blur-3xl" />

        {/* <div className="relative hidden px-8 pt-8 lg:block"> */}
          {/* <div className="relative h-px w-full bg-white/10">
            <div className="absolute left-0 top-1/2 h-2.5 w-2.5 -translate-y-1/2 rounded-full bg-pink-500 shadow-[0_0_20px_rgba(236,72,153,0.6)]" />
            <div className="absolute left-1/3 top-1/2 h-2.5 w-2.5 -translate-y-1/2 rounded-full bg-purple-400 shadow-[0_0_20px_rgba(168,85,247,0.55)]" />
            <div className="absolute left-2/3 top-1/2 h-2.5 w-2.5 -translate-y-1/2 rounded-full bg-fuchsia-400 shadow-[0_0_20px_rgba(217,70,239,0.55)]" />
            <div className="absolute right-0 top-1/2 h-2.5 w-2.5 -translate-y-1/2 rounded-full bg-pink-500 shadow-[0_0_20px_rgba(236,72,153,0.6)]" />
          </div> */}
        {/* </div> */}

        <div className="grid grid-cols-1 divide-y divide-white/10 md:grid-cols-2 md:divide-y-0 lg:grid-cols-4 lg:divide-x lg:divide-white/10">
          {productFlow.map((item, index) => {
            const Icon = item.icon;

            return (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.45, delay: index * 0.08 }}
                className="group relative px-6 py-8 sm:px-7 lg:min-h-[280px] lg:px-8 lg:py-10"
              >
                <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                <div className="absolute inset-x-6 bottom-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent lg:hidden" />

                <div className="relative z-10">
                  <div className="mb-6 flex items-start justify-between gap-4">
                    <span className="text-[10px] font-semibold uppercase tracking-[0.26em] text-pink-400">
                      Step {item.step}
                    </span>

                    <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl  -white/10 bg-white/[0.03] transition-all duration-300 group-hover:-pink-500/20 group-hover:bg-white/[0.05]">
                      <Icon className="h-5 w-5 text-white/80 transition-colors duration-300 group-hover:text-white" />
                    </div>
                  </div>

                  <h4 className="text-xl font-bold text-white sm:text-[1.35rem]">
                    {item.title}
                  </h4>

                  <p className="mt-4 max-w-xs text-sm leading-7 text-gray-400">
                    {item.description}
                  </p>

                  <div className="mt-6 flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-gray-500">
                    {/* <span className="h-1.5 w-1.5 rounded-full bg-gradient-to-r from-pink-500 to-purple-500" /> */}
                    Mastery sequence
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
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
          className="group relative overflow-hidden rounded-[32px]  -white/10 bg-gradient-to-br from-white/[0.05] to-white/[0.02] p-8 text-center shadow-[0_18px_60px_rgba(0,0,0,0.26)] backdrop-blur-xl"
        >
          <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" style={glowStyle} />
          <div className="absolute left-1/2 top-0 h-px w-40 -translate-x-1/2 bg-gradient-to-r from-transparent via-pink-500/70 to-transparent" />
          <div className="absolute left-1/2 top-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full bg-pink-500/10 blur-3xl" />

          <div className="relative z-10">
            <div className="mx-auto mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl  -white/10 bg-gradient-to-br from-pink-500/15 to-purple-500/15 text-white">
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

            <div className="mt-6 inline-flex items-center gap-2 rounded-full  -white/10 bg-white/[0.04] px-4 py-2 text-[11px] uppercase tracking-[0.18em] text-gray-300">
              <span className="h-1.5 w-1.5 rounded-full bg-gradient-to-r from-pink-500 to-purple-500" />
              Built for growth, clarity, and competition
            </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}