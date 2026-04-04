"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

export default function Home() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("scroll", handleScroll);
    
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Calculate parallax offsets
  const bgParallaxY = scrollY * 0.05;
  const shapeParallaxX = mousePosition.x * 0.01;
  const shapeParallaxY = mousePosition.y * 0.01;

  return (
    <section className="relative overflow-hidden bg-[#020202] text-white">
      {/* Enhanced Animated Background with parallax */}
      <div className="absolute inset-0 -z-10">
        <div 
          className="absolute left-[-10%] top-[-10%] h-[360px] w-[360px] rounded-full bg-pink-500/20 blur-[120px] transition-transform duration-300"
          style={{
            transform: `translate(${shapeParallaxX * 0.5}px, ${shapeParallaxY * 0.3}px)`,
          }}
        />
        <div 
          className="absolute right-[-10%] top-[5%] h-[320px] w-[320px] rounded-full bg-purple-500/18 blur-[110px] transition-transform duration-300"
          style={{
            transform: `translate(${-shapeParallaxX * 0.4}px, ${shapeParallaxY * 0.2}px)`,
          }}
        />
        <div 
          className="absolute bottom-[-10%] left-[15%] h-[280px] w-[280px] rounded-full bg-fuchsia-500/18 blur-[110px] transition-transform duration-300"
          style={{
            transform: `translate(${shapeParallaxX * 0.3}px, ${-shapeParallaxY * 0.4}px)`,
          }}
        />
        <div 
          className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.06),transparent_45%)]"
          style={{
            transform: `translateY(${bgParallaxY}px)`,
          }}
        />
        <div className="absolute inset-0 opacity-[0.05] [background-image:linear-gradient(rgba(255,255,255,0.09)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.09)_1px,transparent_1px)] [background-size:70px_70px]" />
        
        {/* Additional floating orbs that follow mouse subtly */}
        <div 
          className="absolute rounded-full bg-pink-500/5 blur-[80px] transition-transform duration-500"
          style={{
            width: '400px',
            height: '400px',
            left: `${mousePosition.x * 0.1}px`,
            top: `${mousePosition.y * 0.1}px`,
            transform: 'translate(-50%, -50%)',
          }}
        />
      </div>

      <div className="mx-auto flex min-h-[calc(100vh-80px)] max-w-7xl flex-col items-center justify-center px-6 pb-16 pt-10 sm:pb-20 sm:pt-16 lg:flex-row lg:gap-12 lg:px-8">
        {/* LEFT - with enhanced animation */}
        <motion.div
          className="max-w-xl text-center lg:text-left"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          style={{
            transform: `translate(${shapeParallaxX * 0.2}px, ${shapeParallaxY * 0.1}px)`,
          }}
        >
          <motion.div 
            className="mb-5 inline-flex items-center rounded-full border border-pink-500/20 bg-white/5 px-4 py-1.5 shadow-[0_0_24px_rgba(236,72,153,0.16)] backdrop-blur-md"
            whileHover={{ scale: 1.02, boxShadow: "0 0 32px rgba(236,72,153,0.25)" }}
            animate={{
              boxShadow: ["0 0 24px rgba(236,72,153,0.16)", "0 0 32px rgba(236,72,153,0.22)", "0 0 24px rgba(236,72,153,0.16)"],
            }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-pink-300 sm:text-[11px]">
              AI-assisted competitive coding platform
            </span>
          </motion.div>

          <h1 className="text-3xl font-black leading-tight tracking-tight sm:text-5xl md:text-5xl lg:text-[3.9rem]">
            Train harder.
            <br />
            <span className="text-white/90">Think smarter.</span>
            <br />
            <span className="bg-gradient-to-r from-pink-500 via-fuchsia-400 to-purple-500 bg-clip-text text-transparent animate-gradient-x">
              Solve like a pro.
            </span>
          </h1>

          <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-gray-400 sm:text-[15px] sm:leading-7 lg:mx-0">
            CODEMASTER is a mission-based coding platform where developers
            solve real challenges, get intelligent feedback, and train like
            they are preparing for competition.
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row lg:justify-start">
            <motion.div whileHover={{ y: -2, scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Link
                href="/login"
                className="inline-flex min-w-[180px] items-center justify-center rounded-2xl bg-gradient-to-r from-pink-500 to-purple-600 px-7 py-3.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-white shadow-[0_0_26px_rgba(236,72,153,0.28)] transition-all duration-300 hover:shadow-[0_0_38px_rgba(168,85,247,0.32)] relative overflow-hidden group"
              >
                <span className="relative z-10">Start Mission</span>
                <span className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent -translate-x-full group-hover:translate-x-0 transition-transform duration-500" />
              </Link>
            </motion.div>

            <motion.div whileHover={{ y: -2, scale: 1.02 }}>
              <Link
                href="#challenges"
                className="inline-flex min-w-[180px] items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-7 py-3.5 text-[11px] font-medium uppercase tracking-[0.18em] text-white backdrop-blur-sm transition-all duration-300 hover:border-pink-400/40 hover:bg-white/10"
              >
                Browse challenges
              </Link>
            </motion.div>
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3 text-[10px] uppercase tracking-[0.22em] text-gray-500 sm:gap-5 lg:justify-start">
            <span>Live thinking analysis</span>
            <span className="hidden h-1 w-1 rounded-full bg-pink-400 sm:block" />
            <span>Mission reports</span>
            <span className="hidden h-1 w-1 rounded-full bg-purple-400 sm:block" />
            <span>Replay system</span>
            <span className="hidden h-1 w-1 rounded-full bg-pink-400 sm:block" />
            <span>Duel mode</span>
          </div>
        </motion.div>

        {/* RIGHT: product visual - with parallax on hover */}
        <motion.div
          className="mt-12 w-full max-w-xl lg:mt-0"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          style={{
            transform: `translate(${-shapeParallaxX * 0.15}px, ${shapeParallaxY * 0.05}px)`,
          }}
        >
          <div className="relative">
            <div 
              className="pointer-events-none absolute -left-10 -top-10 h-32 w-32 rounded-full bg-pink-500/25 blur-3xl animate-pulse-slow" 
            />
            <div 
              className="pointer-events-none absolute -right-6 top-6 h-28 w-28 rounded-full bg-purple-500/30 blur-3xl animate-pulse-slow animation-delay-1000" 
            />
            <div 
              className="pointer-events-none absolute -bottom-8 left-10 h-28 w-28 rounded-full bg-fuchsia-500/25 blur-3xl animate-pulse-slow animation-delay-2000" 
            />

            <motion.div
              className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#050509]/95 shadow-[0_0_50px_rgba(15,23,42,0.9)] backdrop-blur-xl"
              whileHover={{ y: -4, scale: 1.01 }}
              transition={{ type: "spring", stiffness: 140, damping: 16 }}
            >
              <div className="flex items-center justify-between border-b border-white/10 px-5 py-3.5">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-pink-500 shadow-[0_0_8px_rgba(236,72,153,0.9)] animate-pulse" />
                  <span className="h-2 w-2 rounded-full bg-yellow-400/80" />
                  <span className="h-2 w-2 rounded-full bg-emerald-400/80" />
                </div>
              <motion.div
                animate={{ opacity: [0.6, 1, 0.6] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="flex items-center gap-1 rounded-full border border-pink-500/20 bg-pink-500/10 px-3 py-1 text-[9px] uppercase tracking-[0.18em] text-pink-300"
              >
                <motion.span 
                  className="h-1.5 w-1.5 rounded-full bg-pink-400"
                  animate={{ scale: [1, 1.3, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                />
                Live mission
              </motion.div>
              </div>

              <div className="grid gap-3.5 px-5 py-4 md:grid-cols-[1.3fr_0.9fr]">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.22em] text-gray-500">
                        Mission
                      </p>
                      <p className="text-xs font-semibold text-white">
                        Optimize Array Pair Sum
                      </p>
                    </div>
                    <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-[9px] font-semibold uppercase tracking-[0.16em] text-emerald-300">
                      Ranked
                    </span>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-black/40 p-3 font-mono text-[11px] leading-relaxed text-gray-300">
                    <p className="text-gray-500">{">"} mission.run()</p>
                    <motion.p 
                      className="text-emerald-400"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 }}
                    >
                      ✓ Pattern detected
                    </motion.p>
                    <p className="text-gray-400">{">"} Hash Map | O(n)</p>
                    <motion.p 
                      className="text-pink-400"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.8 }}
                    >
                      ! Edge case: duplicates
                    </motion.p>
                    <motion.p 
                      className="text-purple-300"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 1.1 }}
                    >
                      {">"} Suggesting faster path...
                    </motion.p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-3">
                    <p className="text-[10px] uppercase tracking-[0.2em] text-gray-500">
                      Session overview
                    </p>
                    <div className="mt-3 grid grid-cols-2 gap-2">
                      {[
                        { label: "Accuracy", value: "94%", color: "white" },
                        { label: "Speed", value: "+32%", color: "emerald-400" },
                        { label: "Rank shift", value: "+12", color: "pink-400" },
                        { label: "Streak", value: "7 days", color: "white" }
                      ].map((item, idx) => (
                        <motion.div 
                          key={item.label}
                          className="rounded-xl border border-white/10 bg-black/40 p-2"
                          whileHover={{ scale: 1.02, borderColor: "rgba(236,72,153,0.3)" }}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.3 + idx * 0.1 }}
                        >
                          <p className="text-[9px] uppercase tracking-[0.16em] text-gray-500">
                            {item.label}
                          </p>
                          <p className={`text-base font-bold text-${item.color}`}>
                            {item.value}
                          </p>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  <motion.div 
                    className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.03] px-3 py-2.5"
                    whileHover={{ borderColor: "rgba(236,72,153,0.3)", scale: 1.01 }}
                  >
                    <div>
                      <p className="text-[9px] uppercase tracking-[0.18em] text-gray-500">
                        Duel queue
                      </p>
                      <p className="text-[11px] text-gray-300">
                        18 players ready to compete
                      </p>
                    </div>
                    <motion.span 
                      className="inline-flex items-center rounded-full bg-pink-500/20 px-3 py-1 text-[9px] font-semibold uppercase tracking-[0.16em] text-pink-200 cursor-pointer"
                      whileHover={{ scale: 1.05, backgroundColor: "rgba(236,72,153,0.35)" }}
                    >
                      Join lobby
                    </motion.span>
                  </motion.div>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="absolute -right-2 -top-4 rounded-2xl border border-pink-500/40 bg-[#050509]/95 px-4 py-3 text-[11px] shadow-[0_0_30px_rgba(236,72,153,0.6)]"
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.25 }}
              whileHover={{ scale: 1.05, y: -6 }}
            >
              <p className="text-[9px] uppercase tracking-[0.18em] text-gray-400">
                Codemaster users
              </p>
              <p className="mt-1 text-[11px] font-semibold text-white">
                Complete missions 2.4x faster
              </p>
            </motion.div>
          </div>
        </motion.div>
      </div>

      <style jsx>{`
        @keyframes gradient-x {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.25; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(1.05); }
        }
        .animate-gradient-x {
          background-size: 200% 200%;
          animation: gradient-x 3s ease infinite;
        }
        .animate-pulse-slow {
          animation: pulse-slow 4s ease-in-out infinite;
        }
        .animation-delay-1000 { animation-delay: 1s; }
        .animation-delay-2000 { animation-delay: 2s; }
      `}</style>
    </section>
  );
}