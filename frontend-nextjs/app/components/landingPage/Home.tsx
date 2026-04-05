"use client";

import { useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";

export default function Home() {
  const containerRef = useRef<HTMLElement | null>(null);
  const heroCardRef = useRef<HTMLDivElement | null>(null);

  const { scrollY } = useScroll();

  const leftY = useTransform(scrollY, [0, 400], [0, -28]);
  const rightY = useTransform(scrollY, [0, 400], [0, 36]);
  const rightScale = useTransform(scrollY, [0, 400], [1, 0.978]);
  const rightRotate = useTransform(scrollY, [0, 400], [0, 1]);

  const springLeftY = useSpring(leftY, { stiffness: 80, damping: 20 });
  const springRightY = useSpring(rightY, { stiffness: 80, damping: 20 });
  const springRightScale = useSpring(rightScale, { stiffness: 80, damping: 20 });
  const springRightRotate = useSpring(rightRotate, { stiffness: 80, damping: 20 });

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const glowX = useSpring(mouseX, { stiffness: 110, damping: 22 });
  const glowY = useSpring(mouseY, { stiffness: 110, damping: 22 });

  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0 });

  const spotlight = useMotionTemplate`radial-gradient(420px circle at ${glowX}px ${glowY}px, rgba(236,72,153,0.09), rgba(168,85,247,0.05) 28%, transparent 62%)`;
  const textGlow = useMotionTemplate`radial-gradient(220px circle at ${glowX}px ${glowY}px, rgba(255,255,255,0.08), transparent 58%)`;

  const particles = useMemo(
    () =>
      Array.from({ length: 8 }, (_, i) => ({
        id: i,
        left: `${10 + i * 10}%`,
        top: `${14 + (i % 4) * 16}%`,
        duration: 8 + (i % 4) * 2,
        delay: i * 0.35,
      })),
    []
  );

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    mouseX.set(x);
    mouseY.set(y);

    const cardRect = heroCardRef.current?.getBoundingClientRect();
    if (!cardRect) return;

    const cardX = e.clientX - cardRect.left;
    const cardY = e.clientY - cardRect.top;

    const centerX = cardRect.width / 2;
    const centerY = cardRect.height / 2;

    const rotateY = ((cardX - centerX) / centerX) * 3;
    const rotateX = -((cardY - centerY) / centerY) * 3;

    setTilt({ rotateX, rotateY });
  };

  const handleMouseLeave = () => {
    setTilt({ rotateX: 0, rotateY: 0 });
  };

  return (
    <section
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative overflow-hidden bg-[#020202] text-white"
      style={{ perspective: "1400px" }}
    >
      <div className="absolute inset-0 -z-20 overflow-hidden">
        <motion.div
          animate={{
            x: [0, 30, 0],
            y: [0, -20, 0],
            scale: [1, 1.06, 1],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -left-[5%] top-[-15%] h-[380px] w-[380px] rounded-full bg-pink-500/12 blur-[130px] sm:h-[420px] sm:w-[420px]"
        />
        <motion.div
          animate={{
            x: [0, -28, 0],
            y: [0, 28, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute -right-[8%] top-[2%] h-[320px] w-[320px] rounded-full bg-purple-500/12 blur-[120px] sm:h-[360px] sm:w-[360px]"
        />
        <motion.div
          animate={{
            x: [0, 20, 0],
            y: [0, 16, 0],
            scale: [1, 1.05, 1],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 4 }}
          className="absolute bottom-[-12%] left-[20%] h-[260px] w-[260px] rounded-full bg-fuchsia-500/10 blur-[110px] sm:h-[300px] sm:w-[300px]"
        />

        <motion.div
          style={{ background: spotlight }}
          className="absolute inset-0 opacity-65"
        />

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.04),transparent_45%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(2,2,2,0.12),rgba(2,2,2,0.42),rgba(2,2,2,0.9))]" />

        <div className="absolute inset-0 opacity-[0.04] [background-image:linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:72px_72px]" />
        <div className="absolute inset-0 opacity-[0.04] [background-image:linear-gradient(rgba(236,72,153,0.14)_1px,transparent_1px),linear-gradient(90deg,rgba(168,85,247,0.10)_1px,transparent_1px)] [background-size:180px_180px]" />

        <div className="absolute left-1/2 top-0 hidden h-full w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-fuchsia-500/15 to-transparent lg:block" />

        {particles.map((particle) => (
          <motion.span
            key={particle.id}
            initial={{ opacity: 0.1, y: 0 }}
            animate={{ opacity: [0.08, 0.26, 0.08], y: [0, -12, 0] }}
            transition={{
              duration: particle.duration,
              repeat: Infinity,
              ease: "easeInOut",
              delay: particle.delay,
            }}
            className="absolute h-[2px] w-[2px] rounded-full bg-white/55 shadow-[0_0_8px_rgba(255,255,255,0.4)]"
            style={{ left: particle.left, top: particle.top }}
          />
        ))}

        <div className="absolute inset-x-0 top-0 h-36 bg-gradient-to-b from-[#020202] to-transparent sm:h-44" />
      </div>

      <motion.div
        className="pointer-events-none absolute inset-0 -z-10 hidden lg:block"
        style={{
          background: useMotionTemplate`linear-gradient(90deg, transparent, rgba(236,72,153,0.035) 35%, rgba(168,85,247,0.05) 50%, rgba(236,72,153,0.035) 65%, transparent)`,
          maskImage: useMotionTemplate`radial-gradient(210px circle at ${glowX}px ${glowY}px, black 10%, transparent 72%)`,
          WebkitMaskImage: useMotionTemplate`radial-gradient(210px circle at ${glowX}px ${glowY}px, black 10%, transparent 72%)`,
        }}
      />

      <div className="mx-auto flex min-h-[calc(100vh-72px)] max-w-7xl flex-col items-center justify-center px-5 pb-14 pt-10 sm:min-h-[calc(100vh-80px)] sm:px-6 sm:pb-16 sm:pt-12 lg:flex-row lg:gap-14 lg:px-8 lg:pb-20 lg:pt-16">
        <motion.div
          className="max-w-2xl text-center lg:text-left"
          style={{ y: springLeftY }}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75 }}
        >
          <motion.div className="mb-5 inline-flex items-center gap-2.5 rounded-full border border-white/10 bg-white/[0.04] px-4 py-1.5 backdrop-blur-xl">
            <motion.span
              animate={{ scale: [1, 1.15, 1], opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="h-1.5 w-1.5 rounded-full bg-pink-400 shadow-[0_0_10px_rgba(244,114,182,0.8)]"
            />
            <span className="text-[10px] font-medium uppercase tracking-[0.25em] text-white/60">
              v2.0 Now Live
            </span>
          </motion.div>

          <div className="relative inline-block">
            <motion.div
              style={{ background: textGlow }}
              className="pointer-events-none absolute inset-0 blur-3xl opacity-60"
            />
            <h1 className="relative text-[2.4rem] font-bold leading-[1.02] tracking-tight sm:text-[3.25rem] md:text-[3.7rem] lg:text-[4.5rem]">
              Code sharper.
              <br />
              <span className="text-white/90">Compete smarter.</span>
              <br />
              <span className="bg-gradient-to-r from-pink-500 via-fuchsia-400 to-purple-500 bg-clip-text text-transparent">
                Learn faster.
              </span>
            </h1>
          </div>

          <p className="mx-auto mt-5 max-w-md text-[14px] leading-7 text-white/50 sm:max-w-lg sm:text-base lg:mx-0">
            The competitive coding platform that transforms how you practice,
            analyze, and level up your skills,  with real-time feedback,
            immersive missions, and live competition...
          </p>

          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row lg:justify-start">
            <motion.div whileHover={{ y: -2, scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Link
                href="/login"
                className="group inline-flex min-w-[158px] items-center justify-center rounded-2xl bg-gradient-to-r from-pink-500 to-purple-600 px-6 py-3 text-[12px] font-semibold uppercase tracking-[0.16em] text-white shadow-[0_0_22px_rgba(236,72,153,0.22)] transition-all duration-300 hover:shadow-[0_0_34px_rgba(168,85,247,0.26)]"
              >
                Start Free
                <span className="ml-2 transition-transform duration-300 group-hover:translate-x-1">
                  →
                </span>
              </Link>
            </motion.div>

            <Link
              href="#features"
              className="inline-flex min-w-[158px] items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] px-6 py-3 text-[12px] font-medium uppercase tracking-[0.16em] text-white backdrop-blur-sm transition-all duration-300 hover:border-white/20 hover:bg-white/[0.07]"
            >
              See How It Works
            </Link>
          </div>

          <div className="mt-7 flex flex-wrap items-center justify-center gap-3 text-[10px] uppercase tracking-[0.18em] text-white/35 sm:gap-4 lg:justify-start">
            <span className="flex items-center gap-2">
              <span className="h-1 w-1 rounded-full bg-emerald-400" />
              50K+ Devs
            </span>
            <span className="hidden h-1 w-1 rounded-full bg-white/30 sm:block" />
            <span>1M+ Missions</span>
            <span className="hidden h-1 w-1 rounded-full bg-white/30 sm:block" />
            <span>Live Duel</span>
          </div>
        </motion.div>

        <motion.div
          className="mt-12 w-full max-w-xl lg:mt-0"
          style={{
            y: springRightY,
            scale: springRightScale,
            rotate: springRightRotate,
          }}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85, delay: 0.15 }}
        >
          <div className="relative">
            <motion.div
              animate={{ y: [0, -7, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="pointer-events-none absolute -left-10 -top-10 h-28 w-28 rounded-full bg-pink-500/16 blur-3xl sm:h-36 sm:w-36"
            />
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="pointer-events-none absolute -right-6 top-6 h-28 w-28 rounded-full bg-purple-500/18 blur-3xl sm:h-32 sm:w-32"
            />
            <motion.div
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
              className="pointer-events-none absolute -bottom-8 left-6 h-24 w-24 rounded-full bg-fuchsia-500/14 blur-3xl sm:h-28 sm:w-28"
            />

            <motion.div
              ref={heroCardRef}
              className="relative overflow-hidden rounded-[24px] border border-white/[0.08] bg-[#050509]/98 shadow-[0_0_50px_rgba(15,23,42,0.78)] backdrop-blur-xl select-none [webkit-touch-callout:none] cursor-default"
              whileHover={{ y: -3 }}
              animate={{
                rotateX: tilt.rotateX,
                rotateY: tilt.rotateY,
              }}
              transition={{ type: "spring", stiffness: 85, damping: 16, mass: 0.7 }}
              style={{ transformStyle: "preserve-3d" }}
            >
              <motion.div
                className="pointer-events-none absolute inset-0 z-[1]"
                style={{
                  background: useMotionTemplate`radial-gradient(260px circle at ${glowX}px ${glowY}px, rgba(255,255,255,0.045), transparent 58%)`,
                }}
              />

              <motion.div
                animate={{ x: ["-120%", "140%"] }}
                transition={{ duration: 7.2, repeat: Infinity, ease: "linear" }}
                className="pointer-events-none absolute top-0 h-full w-[28%] rotate-[18deg] bg-gradient-to-r from-transparent via-white/[0.04] to-transparent blur-xl"
              />

              <div className="pointer-events-none absolute inset-0 opacity-[0.04] [background-image:linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:24px_24px]" />
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

              <div className="relative z-[2] flex items-center justify-between border-b border-white/[0.06] px-4 py-3.5 sm:px-5">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-pink-500 shadow-[0_0_8px_rgba(236,72,153,0.8)]" />
                  <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
                  <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
                </div>
                <motion.div
                  animate={{ opacity: [0.65, 1, 0.65] }}
                  transition={{ duration: 2.2, repeat: Infinity }}
                  className="flex items-center gap-2 rounded-full border border-pink-500/20 bg-pink-500/8 px-2.5 py-1 text-[9px] uppercase tracking-[0.16em] text-pink-300/80"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-pink-400" />
                  Live Session
                </motion.div>
              </div>

              <div className="relative z-[2] grid gap-4 px-4 py-4 sm:px-5 sm:py-4.5 md:grid-cols-[1.4fr_0.85fr]">
                <div
                  className="space-y-3.5"
                  style={{
                    transform: "translateZ(24px)",
                    WebkitUserSelect: "none",
                    userSelect: "none",
                  }}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-[9px] uppercase tracking-[0.24em] text-white/35">
                        Current Mission
                      </p>
                      <p className="mt-1 text-sm font-semibold text-white">
                        Two Sum Optimization
                      </p>
                    </div>
                    <span className="whitespace-nowrap rounded-full bg-emerald-500/[0.12] px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.14em] text-emerald-300">
                      In Progress
                    </span>
                  </div>

                  <div
                    className="rounded-2xl border border-white/[0.06] bg-black/50 p-3.5 font-mono text-[11px] leading-relaxed text-white/60 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]"
                    style={{ WebkitUserSelect: "none", userSelect: "none" }}
                  >
                    <p className="text-white/30">{">"} analyze()</p>
                    <motion.p
                      className="text-emerald-400"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5 }}
                    >
                      ✓ Optimal pattern detected
                    </motion.p>
                    <p className="text-white/50">{">"} Time: O(n) | Space: O(n)</p>
                    <motion.p
                      className="text-pink-400"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.8 }}
                    >
                      ! Consider hash map approach
                    </motion.p>
                    <motion.p
                      className="text-purple-300"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1.1 }}
                    >
                      {">"} Recommendation: Use Map
                    </motion.p>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    {["Accuracy", "Time", "Rank"].map((label, i) => (
                      <motion.div
                        key={label}
                        whileHover={{ y: -2 }}
                        className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-2.5"
                        style={{ WebkitUserSelect: "none", userSelect: "none" }}
                      >
                        <p className="text-[8px] uppercase tracking-[0.18em] text-white/35">
                          {label}
                        </p>
                        <p
                          className={`mt-1.5 text-base font-bold ${
                            i === 0
                              ? "text-emerald-400"
                              : i === 1
                              ? "text-white"
                              : "text-pink-400"
                          }`}
                        >
                          {i === 0 ? "98%" : i === 1 ? "12m" : "#247"}
                        </p>
                      </motion.div>
                    ))}
                  </div>
                </div>

                <div
                  className="space-y-3.5"
                  style={{
                    transform: "translateZ(36px)",
                    WebkitUserSelect: "none",
                    userSelect: "none",
                  }}
                >
                  <div className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-3.5">
                    <p className="text-[9px] uppercase tracking-[0.2em] text-white/35">
                      Session Stats
                    </p>
                    <div className="mt-3 space-y-2">
                      {[
                        { label: "Streak", value: "7 days" },
                        { label: "Rating", value: "+32" },
                        { label: "Solved", value: "23" },
                      ].map((stat) => (
                        <div
                          key={stat.label}
                          className="flex items-center justify-between rounded-lg border border-white/[0.04] bg-black/30 px-2.5 py-2"
                        >
                          <span className="text-[10px] text-white/45">{stat.label}</span>
                          <span className="text-[11px] font-semibold text-white">
                            {stat.value}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div
                    id="features"
                    className="rounded-2xl border border-white/[0.05] bg-white/[0.02] p-3.5"
                  >
                    <p className="text-[9px] uppercase tracking-[0.18em] text-white/35">
                      Duel Queue
                    </p>
                    <p className="mt-1.5 text-xs text-white/50">
                      <span className="font-semibold text-pink-400">18</span> developers ready
                    </p>
                    <div className="mt-3 flex items-center justify-between">
                      <div className="flex -space-x-2">
                        {["AK", "MJ", "TR"].map((initials) => (
                          <span
                            key={initials}
                            className="flex h-7 w-7 items-center justify-center rounded-full border border-white/[0.1] bg-white/[0.05] text-[9px] font-semibold text-white/70"
                          >
                            {initials}
                          </span>
                        ))}
                        <span className="flex h-7 w-7 items-center justify-center rounded-full border border-white/[0.1] bg-white/[0.05] text-[9px] font-semibold text-white/40">
                          +15
                        </span>
                      </div>
                      <motion.span
                        whileHover={{ scale: 1.05 }}
                        className="cursor-pointer rounded-full bg-pink-500/[0.15] px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.14em] text-pink-300"
                      >
                        Join
                      </motion.span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="absolute -right-2 -top-4 rounded-2xl border border-pink-500/35 bg-[#050509]/98 px-3.5 py-2 text-[10px] shadow-[0_0_22px_rgba(236,72,153,0.38)] backdrop-blur-xl sm:-right-3 sm:-top-5 sm:px-4 sm:py-2.5"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.35 }}
              style={{ WebkitUserSelect: "none", userSelect: "none" }}
            >
              <p className="text-[8px] uppercase tracking-[0.16em] text-white/40">
                Top performers
              </p>
              <p className="mt-0.5 text-[11px] font-semibold text-white">
                Solve 3x faster
              </p>
            </motion.div>

            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 4.8, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -left-2 bottom-6 hidden rounded-2xl border border-white/[0.08] bg-white/[0.04] px-3.5 py-2.5 text-[10px] shadow-[0_0_24px_rgba(168,85,247,0.18)] backdrop-blur-xl lg:block"
              style={{ WebkitUserSelect: "none", userSelect: "none" }}
            >
              <p className="text-[8px] uppercase tracking-[0.15em] text-white/38">
                Workspace signal
              </p>
              <p className="mt-1 text-[11px] font-semibold text-white">
                Premium dev experience
              </p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}