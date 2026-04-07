"use client";

import React, { useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  CommandLineIcon,
  CpuChipIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";

export default function FeatureHeroPanel() {
  const prefersReducedMotion = useReducedMotion();
  const [isExpanded, setIsExpanded] = useState(false);
  const [rotateX, setRotateX] = useState(-8);
  const [rotateY, setRotateY] = useState(16);

  const terminalLines = useMemo(
    () => [
      "$ codemaster run two-sum --analyze",
      "> mission loaded: two sum / arrays / easy",
      "✓ pattern detected: hash map strategy",
      "> complexity estimate: time O(n), space O(n)",
      "! warning: duplicate values edge-case detected",
      "✓ confidence score increased to 94%",
      "> replay report ready",
    ],
    []
  );

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (prefersReducedMotion || isExpanded) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const xPct = x / rect.width;
    const yPct = y / rect.height;

    const nextRotateY = (xPct - 0.5) * 18;
    const nextRotateX = (0.5 - yPct) * 14;

    setRotateX(nextRotateX);
    setRotateY(nextRotateY);
  };

  const handleMouseLeave = () => {
    if (prefersReducedMotion || isExpanded) return;
    setRotateX(-8);
    setRotateY(16);
  };

  return (
    <section id="features" className="mx-auto max-w-6xl">
      <div className="grid items-center gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-12">
        <motion.div
          initial={{ opacity: 0, x: -32 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: false, amount: 0.45 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-lg"
        >
          <div className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[9px] font-medium uppercase tracking-[0.24em] text-pink-300 backdrop-blur-xl">
            Core Features
          </div>

          <h2 className="mt-4 text-[1.75rem] font-black leading-[1.02] tracking-[-0.05em] text-white sm:text-[2.15rem] lg:text-[2.4rem]">
            Code with more clarity.
            <span className="block bg-gradient-to-r from-white via-pink-200 to-purple-300 bg-clip-text text-transparent">
              Train inside a smarter system.
            </span>
          </h2>

          <p className="mt-4 max-w-md text-[13px] leading-6 text-gray-400 sm:text-sm sm:leading-7">
            CODEMASTER combines guided coding flow, live analysis, mission
            review, and competitive readiness inside a premium developer
            experience.
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-2.5">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-[10px] uppercase tracking-[0.16em] text-gray-300">
              <CpuChipIcon className="h-3.5 w-3.5 text-pink-300" />
              Live analysis
            </div>

            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-[10px] uppercase tracking-[0.16em] text-gray-300">
              <SparklesIcon className="h-3.5 w-3.5 text-purple-300" />
              Product-grade flow
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 36, y: 18 }}
          whileInView={{ opacity: 1, x: 0, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          className="relative flex justify-center lg:justify-end"
        >
          <div className="relative w-full max-w-[620px] [perspective:1600px]">
            <motion.button
              type="button"
              onClick={() => setIsExpanded((prev) => !prev)}
              whileHover={
                prefersReducedMotion
                  ? {}
                  : isExpanded
                  ? {}
                  : { y: -5, scale: 1.008 }
              }
              transition={{ duration: 0.22 }}
              className="group relative block w-full cursor-pointer bg-transparent p-0 text-left outline-none"
              aria-label="Toggle terminal preview"
            >
              <div 
                className="absolute inset-0 z-50" 
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
              />
              <motion.div
                animate={
                  prefersReducedMotion
                    ? {}
                    : {
                        y: [0, -5, 0],
                      }
                }
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="pointer-events-none absolute -right-4 top-8 h-28 w-28 rounded-full bg-purple-500/12 blur-3xl"
              />
              <motion.div
                animate={
                  prefersReducedMotion
                    ? {}
                    : {
                        y: [0, 6, 0],
                      }
                }
                transition={{
                  duration: 7,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="pointer-events-none absolute -left-6 bottom-2 h-32 w-32 rounded-full bg-pink-500/10 blur-3xl"
              />

              <motion.div
                animate={
                  isExpanded
                    ? {
                        rotateX: 0,
                        rotateY: 0,
                        scale: 1,
                        x: 0,
                      }
                    : {
                        rotateX,
                        rotateY,
                        scale: 0.955,
                        x: 6,
                      }
                }
                transition={{
                  type: "spring",
                  stiffness: 140,
                  damping: 18,
                }}
                className="relative origin-center transform-gpu"
                style={{
                  transformStyle: "preserve-3d",
                }}
              >
                <div className="relative overflow-hidden rounded-[26px] border border-white/10 bg-[#07080d] shadow-[0_22px_70px_rgba(0,0,0,0.4)]">
                  <div className="absolute inset-y-0 left-0 z-10 w-[36%] bg-gradient-to-r from-[#020202] via-[#020202]/70 to-transparent" />
                  <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_top_right,rgba(168,85,247,0.14),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(236,72,153,0.12),transparent_28%)]" />

                  <div className="relative z-20 border-b border-white/10 bg-white/[0.03] px-4 py-3">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-2">
                        <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
                        <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
                        <span className="h-3 w-3 rounded-full bg-[#28c840]" />
                      </div>

                      <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[9px] uppercase tracking-[0.2em] text-gray-400">
                        <CommandLineIcon className="h-3.5 w-3.5" />
                        Terminal Preview
                      </div>
                    </div>
                  </div>

                  <div className="relative z-20 grid min-h-[280px] grid-cols-1 lg:grid-cols-[0.86fr_1.14fr]">
                    <div className="hidden border-r border-white/10 bg-white/[0.02] lg:block">
                      <div className="flex h-full flex-col justify-between p-4">
                        <div>
                          <p className="text-[9px] uppercase tracking-[0.2em] text-pink-400">
                            Live workspace
                          </p>
                          <h3 className="mt-3 text-base font-bold text-white">
                            A premium product feel before signup
                          </h3>
                          <p className="mt-3 text-[13px] leading-6 text-gray-400">
                            Users preview a polished coding interface with
                            command flow, mission insight, and analysis-driven
                            feedback.
                          </p>
                        </div>

                        <div className="space-y-2.5">
                          {[
                            "Mission runtime analysis",
                            "Pattern detection",
                            "Replay-aware reporting",
                          ].map((item) => (
                            <div
                              key={item}
                              className="rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-[13px] text-gray-300"
                            >
                              {item}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="p-4">
                      <div className="rounded-[22px] border border-white/10 bg-[#04050a] shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]">
                        <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
                          <div className="flex items-center gap-3">
                            <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[9px] uppercase tracking-[0.18em] text-gray-400">
                              shell
                            </span>
                            <span className="text-[11px] text-gray-500">
                              codemaster@workspace
                            </span>
                          </div>

                          <span className="text-[9px] uppercase tracking-[0.18em] text-emerald-300">
                            active
                          </span>
                        </div>

                        <div className="min-h-[210px] space-y-2 px-4 py-4 font-mono text-[12px] leading-6 sm:px-5">
                          {terminalLines.map((line, index) => {
                            const isCommand = line.startsWith("$");
                            const isWarning = line.startsWith("!");
                            const isSuccess = line.startsWith("✓");
                            const isInfo = line.startsWith(">");

                            return (
                              <motion.p
                                key={line}
                                initial={{ opacity: 0, x: 8 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{
                                  duration: 0.3,
                                  delay: 0.08 * index,
                                }}
                                className={
                                  isCommand
                                    ? "text-white"
                                    : isWarning
                                    ? "text-amber-300"
                                    : isSuccess
                                    ? "text-emerald-400"
                                    : isInfo
                                    ? "text-sky-300"
                                    : "text-gray-500"
                                }
                              >
                                {line}
                              </motion.p>
                            );
                          })}

                          <div className="flex items-center gap-2 pt-1.5">
                            <span className="text-pink-400">$</span>
                            <motion.span
                              animate={{ opacity: [1, 0, 1] }}
                              transition={{ duration: 0.9, repeat: Infinity }}
                              className="inline-block h-4 w-[8px] bg-white/90"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3 border-t border-white/10 bg-white/[0.03] px-4 py-3 sm:px-5">
                          {[
                            { label: "Analyzer", value: "Live" },
                            { label: "Runtime", value: "O(n)" },
                            { label: "Confidence", value: "94%" },
                            { label: "Replay", value: "Ready" },
                          ].map((item) => (
                            <div
                              key={item.label}
                              className="rounded-xl border border-white/10 bg-black/20 px-3 py-2"
                            >
                              <p className="text-[9px] uppercase tracking-[0.18em] text-gray-500">
                                {item.label}
                              </p>
                              <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-white">
                                {item.value}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pointer-events-none absolute inset-0 rounded-[26px] ring-1 ring-white/5" />
                </div>
              </motion.div>
            </motion.button>

            <p className="mt-3 text-center text-[10px] uppercase tracking-[0.18em] text-gray-500 lg:text-right">
              Click preview to expand the workspace feel
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}