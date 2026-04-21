"use client";

import { useMemo, useRef, useState, useEffect } from "react";
import Link from "next/link";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";

const credibilityLogos = [
  {
    name: "GitHub",
    category: "Platform",
    svg: (
      <svg
        className="h-10 w-10"
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M12 .5C5.648.5.5 5.648.5 12a11.5 11.5 0 0 0 7.863 10.907c.575.106.787-.25.787-.556 0-.275-.012-1.187-.018-2.153-3.2.695-3.877-1.357-3.877-1.357-.524-1.332-1.28-1.686-1.28-1.686-1.047-.716.08-.702.08-.702 1.158.082 1.768 1.188 1.768 1.188 1.03 1.764 2.702 1.254 3.36.958.104-.746.403-1.255.733-1.543-2.554-.29-5.238-1.277-5.238-5.682 0-1.255.448-2.281 1.183-3.085-.119-.29-.513-1.458.112-3.04 0 0 .965-.309 3.162 1.178A10.96 10.96 0 0 1 12 6.32c.974.004 1.955.132 2.872.388 2.195-1.487 3.159-1.178 3.159-1.178.627 1.582.233 2.75.115 3.04.737.804 1.181 1.83 1.181 3.085 0 4.416-2.689 5.389-5.252 5.673.414.356.783 1.055.783 2.126 0 1.536-.014 2.773-.014 3.149 0 .309.208.668.793.555A11.503 11.503 0 0 0 23.5 12C23.5 5.648 18.352.5 12 .5Z" />
      </svg>
    ),
  },
  {
    name: "Google",
    category: "Cloud",
    svg: (
      <svg className="h-10 w-10" viewBox="0 0 24 24" aria-hidden="true">
        <path
          fill="#4285F4"
          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        />
        <path
          fill="#34A853"
          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.84 20.99 7.65 23 12 23z"
        />
        <path
          fill="#FBBC05"
          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        />
        <path
          fill="#EA4335"
          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.65 1 3.84 3.01 2.18 6.14l2.85 2.84c.87-2.6 3.3-4.6 6.16-4.6z"
        />
      </svg>
    ),
  },
  {
    name: "OpenAI",
    category: "AI",
    svg: (
      <svg
        className="h-10 w-10"
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M22.282 9.821a5.984 5.984 0 0 0-.515-4.91 6.046 6.046 0 0 0-6.509-2.9A6.065 6.065 0 0 0 4.981 4.18a5.984 5.984 0 0 0-3.998 2.9 6.046 6.046 0 0 0 .743 7.097 5.98 5.98 0 0 0 .51 4.911 6.051 6.051 0 0 0 6.514 2.9A5.984 5.984 0 0 0 13 24a6.056 6.056 0 0 0 5.951-5.949 5.98 5.98 0 0 0 3.997-2.9 6.056 6.056 0 0 0-.667-7.073 5.98 5.98 0 0 0-.515-4.909 5.98 5.98 0 0 0-6.509-2.9A6.066 6.066 0 0 0 13 0a5.984 5.984 0 0 0-.505 4.783 5.98 5.98 0 0 0-.511 4.91c.055.281.138.541.216.747A6.039 6.039 0 0 0 13 12a5.984 5.984 0 0 0 .505-4.783 5.98 5.98 0 0 0-.511-4.909zM13 8.727a3.488 3.488 0 0 1-.342-2.334A2.477 2.477 0 0 0 13 5.164a2.475 2.475 0 0 0-.669 1.229A3.49 3.49 0 0 1 13 8.727zm-7.449-.402a1.518 1.518 0 0 1 1.412-1.412A1.518 1.518 0 0 1 8.727 8.727a1.52 1.52 0 0 1-1.412 1.413A1.52 1.52 0 0 1 5.551 8.727zm7.449 7.449a1.518 1.518 0 0 1-1.412-1.412 1.52 1.52 0 0 1 1.412-1.413 1.52 1.52 0 0 1 1.413 1.413 1.518 1.518 0 0 1-1.413 1.412z" />
      </svg>
    ),
  },
  {
    name: "Vercel",
    category: "Deploy",
    svg: (
      <svg
        className="h-10 w-10"
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M12 1L1.272 22.182h21.456L12 1z" />
      </svg>
    ),
  },
  {
    name: "LinkedIn",
    category: "Social",
    svg: (
      <svg
        className="h-10 w-10"
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451c.979 0 1.771-.773 1.771-1.729V1.729C24 .774 23.204 0 22.225 0z" />
      </svg>
    ),
  },
];

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
  const springRightRotate = useSpring(rightRotate, {
    stiffness: 80,
    damping: 20,
  });

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

  const [displayText, setDisplayText] = useState("");
  const fullText = "Code sharper. Compete smarter. Learn faster.";
  const typewriterSpeed = 45;

  useEffect(() => {
    let index = 0;
    const timer = setInterval(() => {
      if (index <= fullText.length) {
        setDisplayText(fullText.slice(0, index));
        index++;
      } else {
        clearInterval(timer);
      }
    }, typewriterSpeed);
    return () => clearInterval(timer);
  }, []);

  const heroY = useTransform(scrollY, [0, 500], [0, 150]);
  const heroOpacity = useTransform(scrollY, [0, 300], [1, 0]);
  const cardY = useTransform(scrollY, [0, 500], [0, -100]);
  const cardScale = useTransform(scrollY, [0, 300], [1, 0.95]);

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
          transition={{
            duration: 14,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
          className="absolute -right-[8%] top-[2%] h-[320px] w-[320px] rounded-full bg-purple-500/12 blur-[120px] sm:h-[360px] sm:w-[360px]"
        />
        <motion.div
          animate={{
            x: [0, 20, 0],
            y: [0, 16, 0],
            scale: [1, 1.05, 1],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 4,
          }}
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

      <div className="mx-auto flex min-h-[calc(100vh-72px)] max-w-7xl flex-col items-center justify-start px-5 pb-12 pt-8 sm:min-h-[calc(100vh-80px)] sm:px-6 sm:pb-14 sm:pt-10 lg:flex-row lg:items-center lg:justify-center lg:gap-14 lg:px-8 lg:pb-20 lg:pt-16">
        <motion.div
          className="w-full max-w-2xl text-center lg:text-left"
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

          <motion.div 
            className="relative inline-block"
            style={{ y: heroY, opacity: heroOpacity }}
          >
            <motion.div
              style={{ background: textGlow }}
              className="pointer-events-none absolute inset-0 blur-3xl opacity-60"
            />
            <h1 className="relative text-[2.7rem] font-bold leading-[0.98] tracking-tight sm:text-[3.4rem] md:text-[3.8rem] lg:text-[4.5rem]">
              <span className="text-white/90">{displayText}</span>
              <motion.span
                animate={{ opacity: [1, 0, 1] }}
                transition={{ duration: 0.8, repeat: Infinity }}
                className="inline-block h-6 w-0.5 bg-pink-500 ml-1 align-middle"
              />
            </h1>
          </motion.div>

          <p className="mx-auto mt-4 max-w-[34rem] text-[14px] leading-7 text-white/55 sm:text-[15px] sm:leading-7 lg:mx-0 lg:max-w-lg lg:text-base">
            The competitive coding platform that transforms how you practice,
            analyze, and level up your skills, with real-time feedback,
            immersive missions, and live competition...
          </p>

          <div className="mt-7 flex w-full flex-col items-stretch gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-center lg:justify-start">
            <motion.div
              whileHover={{ y: -2, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full sm:w-auto"
            >
              <Link
                href="/login"
                className="group inline-flex w-full min-w-0 items-center justify-center rounded-2xl bg-gradient-to-r from-pink-500 to-purple-600 px-6 py-3.5 text-[12px] font-semibold uppercase tracking-[0.16em] text-white shadow-[0_0_22px_rgba(236,72,153,0.22)] transition-all duration-300 hover:shadow-[0_0_34px_rgba(168,85,247,0.26)] sm:w-auto sm:min-w-[158px]"
              >
                Start Free
                <span className="ml-2 transition-transform duration-300 group-hover:translate-x-1">
                  →
                </span>
              </Link>
            </motion.div>

            {/* <Link
              href="#features"
              className="inline-flex w-full min-w-0 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] px-6 py-3.5 text-[12px] font-medium uppercase tracking-[0.16em] text-white backdrop-blur-sm transition-all duration-300 hover:border-white/20 hover:bg-white/[0.07] sm:w-auto sm:min-w-[158px]"
            >
              See How It Works
            </Link> */}

            <Link
              href="/challenges/1?guest=true"
              className="inline-flex w-full min-w-0 items-center justify-center rounded-2xl border border-emerald-500/20 bg-red-500/8 px-6 py-3.5 text-[12px] font-medium uppercase tracking-[0.16em] text-emerald-300 backdrop-blur-sm transition-all duration-300 hover:border-emerald-500/40 hover:bg-emerald-500/12 sm:w-auto sm:min-w-[158px]"
            >
              Try Instantly
            </Link>
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-2.5 text-[10px] uppercase tracking-[0.18em] text-white/35 sm:gap-4 lg:justify-start">
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
          className="mt-10 w-full max-w-[92vw] sm:mt-12 sm:max-w-xl lg:mt-0 lg:max-w-xl"
          style={{
            y: cardY,
            scale: cardScale,
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
              className="relative overflow-hidden rounded-[22px] border border-white/[0.08] bg-[#050509]/98 shadow-[0_0_40px_rgba(15,23,42,0.72)] backdrop-blur-xl select-none [webkit-touch-callout:none] cursor-default"
              whileHover={{ y: -3 }}
              animate={{
                rotateX: tilt.rotateX,
                rotateY: tilt.rotateY,
              }}
              transition={{
                type: "spring",
                stiffness: 85,
                damping: 16,
                mass: 0.7,
              }}
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

              <div className="relative z-[2] grid gap-3 px-3.5 py-3.5 sm:gap-4 sm:px-5 sm:py-4.5 md:grid-cols-[1.4fr_0.85fr]">
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
                          <span className="text-[10px] text-white/45">
                            {stat.label}
                          </span>
                          <span className="text-[11px] font-semibold text-white">
                            {stat.value}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div
                    className="rounded-2xl border border-white/[0.05] bg-white/[0.02] p-3.5"
                  >
                    <p className="text-[9px] uppercase tracking-[0.18em] text-white/35">
                      Duel Queue
                    </p>
                    <p className="mt-1.5 text-xs text-white/50">
                      <span className="font-semibold text-pink-400">18</span>{" "}
                      developers ready
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
              className="absolute -right-1 top-3 rounded-2xl border border-pink-500/35 bg-[#050509]/98 px-3 py-2 text-[10px] shadow-[0_0_22px_rgba(236,72,153,0.38)] backdrop-blur-xl sm:-right-3 sm:-top-5 sm:px-4 sm:py-2.5"
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
              className="absolute left-3 bottom-3 hidden rounded-2xl border border-white/[0.08] bg-white/[0.04] px-3.5 py-2.5 text-[10px] shadow-[0_0_24px_rgba(168,85,247,0.18)] backdrop-blur-xl lg:block"
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

      <motion.div
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.6 }}
        className="relative mx-auto -mt-2 w-full max-w-6xl px-5 pb-14 sm:px-6 sm:pb-16 lg:px-8 lg:pb-20"
      >
        <div className="relative mt-10 overflow-hidden px-5 py-8 sm:px-7 lg:px-10">
          <div className="absolute left-1/2 top-0 h-24 w-40 -translate-x-1/2 rounded-full" />

          <div className="relative z-10 text-center">
            <p className="text-[10px] font-medium uppercase tracking-[0.28em] text-white/40">
              Built around tools developers already trust
            </p>

            <div className="mt-10 flex flex-wrap items-center justify-center gap-x-10 gap-y-8 sm:gap-x-16 sm:gap-y-10">
              {credibilityLogos.map((logo, index) => (
                <motion.div
                  key={logo.name}
                  initial={{ opacity: 0, y: 8 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45, delay: index * 0.06 }}
                  whileHover={{ y: -2 }}
                  className="group flex cursor-pointer flex-col items-center gap-2 transition-all duration-300"
                >
                  <div className="text-white/30 transition-all duration-300 group-hover:text-white/55">
                    {logo.svg}
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="text-[12px] font-medium tracking-[0.06em] text-white/30 transition-all duration-300 group-hover:text-white/50">
                      {logo.name}
                    </span>
                    <span className="text-[8px] uppercase tracking-[0.14em] text-white/15">
                      {logo.category}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}