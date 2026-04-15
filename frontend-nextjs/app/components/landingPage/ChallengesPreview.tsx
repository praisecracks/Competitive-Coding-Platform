"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform, useMotionValue, useSpring, useMotionTemplate } from "framer-motion";
import { ArrowRight, Clock3, Layers3, Sparkles, Swords, Trophy, Flame, Zap, Target, ChevronRight } from "lucide-react";

const previewChallenges = [
  {
    id: 1,
    title: "Reverse String",
    difficulty: "Easy",
    category: "Strings",
    description: "Reverse the given string without using built-in reverse methods.",
    duration: "5 mins",
    status: "Starter Mission",
    accentColor: "#10B981",
  },
  {
    id: 2,
    title: "Two Sum",
    difficulty: "Easy",
    category: "Arrays",
    description: "Find two numbers in an array that add up to a target value.",
    duration: "8 mins",
    status: "Popular Mission",
    accentColor: "#EC4899",
  },
  {
    id: 3,
    title: "Valid Parentheses",
    difficulty: "Medium",
    category: "Stacks",
    description: "Check whether the brackets in a string are properly matched.",
    duration: "10 mins",
    status: "Core Mission",
    accentColor: "#A855F7",
  },
];

const competitiveFeatures = [
  { icon: Swords, title: "Live Duels", description: "Challenge other developers in real-time", color: "#EC4899" },
  { icon: Trophy, title: "Leaderboards", description: "Compete globally and rank up", color: "#F59E0B" },
  { icon: Flame, title: "Streaks", description: "Build daily coding habits", color: "#10B981" },
];

const getDifficultyStyles = (difficulty: string) => {
  switch (difficulty) {
    case "Easy": return "border-emerald-500/30 bg-emerald-500/10 text-emerald-300";
    case "Medium": return "border-amber-500/30 bg-amber-500/10 text-amber-300";
    case "Hard": return "border-red-500/30 bg-red-500/10 text-red-300";
    default: return "border-white/20 bg-white/5 text-gray-300";
  }
};

const getStatusStyles = (status: string) => {
  switch (status) {
    case "Starter Mission": return "border-cyan-500/30 bg-cyan-500/10 text-cyan-300";
    case "Popular Mission": return "border-pink-500/30 bg-pink-500/10 text-pink-300";
    case "Core Mission": return "border-purple-500/30 bg-purple-500/10 text-purple-300";
    default: return "border-white/20 bg-white/5 text-gray-300";
  }
};

function TiltCard({ challenge, index }: { challenge: typeof previewChallenges[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  const springConfig = { stiffness: 300, damping: 25 };
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [6, -6]), springConfig);
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-6, 6]), springConfig);

  const glowX = useSpring(useTransform(x, [-0.5, 0.5], ["0%", "100%"]), { stiffness: 200, damping: 20 });
  const glowY = useSpring(useTransform(y, [-0.5, 0.5], ["0%", "100%"]), { stiffness: 200, damping: 20 });
  const spotlight = useMotionTemplate`radial-gradient(600px circle at ${glowX}px ${glowY}px, ${challenge.accentColor}12, transparent 70%)`;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    x.set((e.clientX - (rect.left + rect.width / 2)) / rect.width);
    y.set((e.clientY - (rect.top + rect.height / 2)) / rect.height);
  };

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => { setIsHovered(false); x.set(0); y.set(0); };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 25 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="relative"
    >
      <div className="group relative overflow-hidden rounded-[28px] border border-white/[0.06] bg-[#0A0A0C] p-6 transition-all duration-500 hover:border-white/12 sm:p-7">
        {/* Spotlight */}
        <motion.div style={{ background: spotlight }} className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500" animate={{ opacity: isHovered ? 1 : 0 }} />
        
        {/* Grid Pattern */}
        <div className="pointer-events-none absolute inset-0 opacity-[0.02] [background-image:linear-gradient(rgba(255,255,255,0.5)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.5)_1px,transparent_1px)] [background-size:24px_24px]" />
        
        {/* Top Line */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />
        
        {/* Bottom Glow */}
        <div className="absolute bottom-0 inset-x-0 h-28 transition-opacity duration-500" style={{ background: `linear-gradient(to top, ${challenge.accentColor}06, transparent)`, opacity: isHovered ? 1 : 0.3 }} />
        
        {/* Hover Glow */}
        <div className="absolute -inset-px rounded-[28px] opacity-0 transition-opacity duration-500 blur-xl" style={{ background: `linear-gradient(135deg, ${challenge.accentColor}15, transparent 60%)`, opacity: isHovered ? 0.4 : 0 }} />

        <div className="relative z-10">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-gray-400">
                <Sparkles className="h-3.5 w-3.5" style={{ color: challenge.accentColor }} />
                Mission #{challenge.id}
              </div>
              <h3 className="text-2xl font-bold tracking-tight text-white transition-colors duration-300 group-hover:text-white">{challenge.title}</h3>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04]" style={{ boxShadow: `0 0 20px ${challenge.accentColor}15` }}>
              <Layers3 className="h-5 w-5" style={{ color: challenge.accentColor }} />
            </div>
          </div>

          {/* Badges */}
          <div className="mt-5 flex flex-wrap gap-2.5">
            <span className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.15em] ${getDifficultyStyles(challenge.difficulty)}`}>{challenge.difficulty}</span>
            <span className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.15em] ${getStatusStyles(challenge.status)}`}>{challenge.status}</span>
          </div>

          {/* Meta */}
          <div className="mt-5 flex items-center gap-3 text-[11px] uppercase tracking-[0.16em] text-gray-400">
            <span className="inline-flex items-center gap-2 rounded-lg border border-purple-500/20 bg-purple-500/08 px-3 py-1.5 text-purple-300">
              <Layers3 className="h-3.5 w-3.5" />
              {challenge.category}
            </span>
            <span className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.04] px-3 py-1.5 text-gray-400">
              <Clock3 className="h-3.5 w-3.5" />
              {challenge.duration}
            </span>
          </div>

          <p className="mt-6 text-[15px] leading-6 text-gray-400">{challenge.description}</p>

          {/* CTA */}
          <div className="mt-6 border-t border-white/[0.06] pt-5">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.18em] text-gray-500">
                <span className="h-1.5 w-1.5 rounded-full" style={{ background: challenge.accentColor }} />
                <span>Preview only</span>
              </div>
              <Link href="/login" className="group/btn inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-[12px] font-semibold uppercase tracking-[0.12em] text-white transition-all duration-300 hover:gap-3" style={{ background: `linear-gradient(135deg, ${challenge.accentColor}12, ${challenge.accentColor}06)`, border: `1px solid ${challenge.accentColor}25` }}>
                <span>Start</span>
                <ChevronRight className="h-4 w-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function ChallengesPreview() {
  const containerRef = useRef<HTMLElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, -15]);
  
  const sectionGlowX = useSpring(mouseX, { stiffness: 100, damping: 20 });
  const sectionGlowY = useSpring(mouseY, { stiffness: 100, damping: 20 });
  const sectionSpotlight = useMotionTemplate`radial-gradient(800px circle at ${sectionGlowX}px ${sectionGlowY}px, rgba(168,85,247,0.05), transparent 50%)`;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  };

  return (
    <section ref={containerRef} onMouseMove={handleMouseMove} id="challenges" className="relative overflow-hidden bg-[#020202] py-24 text-gray-100 sm:py-28">
      {/* Background */}
      <motion.div style={{ y }} className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute left-[7%] top-10 h-64 w-64 rounded-full bg-pink-500/6 blur-[140px]" />
        <div className="absolute right-[10%] top-16 h-72 w-72 rounded-full bg-purple-500/6 blur-[130px]" />
        <div className="absolute bottom-0 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-fuchsia-500/5 blur-[120px]" />
      </motion.div>
      
      <motion.div style={{ background: sectionSpotlight }} className="pointer-events-none absolute inset-0 -z-10 opacity-50" />
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-[0.025] [background-image:linear-gradient(rgba(255,255,255,0.5)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.5)_1px,transparent_1px)] [background-size:56px_56px]" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 25 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }} className="mx-auto mb-12 max-w-3xl text-center">
          <div className="inline-flex items-center gap-3 rounded-full border border-pink-500/30 bg-pink-500/10 px-5 py-2 text-[11px] font-medium uppercase tracking-[0.28em] text-pink-300 backdrop-blur-xl">
            <Zap className="h-4 w-4" />
            Missions & Competition
          </div>
          <h2 className="mt-8 text-5xl font-black tracking-[-0.04em] text-white sm:text-6xl md:text-7xl">
            Train. Compete.
            <span className="block bg-gradient-to-r from-white via-pink-200 to-purple-300 bg-clip-text text-transparent">Dominate.</span>
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-[17px] leading-7 text-gray-400">
            Master coding challenges through structured missions, then prove yourself against real opponents in live duels.
          </p>
        </motion.div>

        {/* Competitive Features */}
        <motion.div initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="mb-8 grid gap-4 sm:grid-cols-3">
          {competitiveFeatures.map((feature, index) => (
            <motion.div key={feature.title} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: 0.1 + index * 0.1 }} className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-4 backdrop-blur-xl">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl" style={{ background: `${feature.color}15` }}>
                <feature.icon className="h-5 w-5" style={{ color: feature.color }} />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">{feature.title}</p>
                <p className="text-[11px] text-gray-400">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Challenge Cards */}
        <motion.div style={{ y }} className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {previewChallenges.map((challenge, index) => (
            <TiltCard key={challenge.id} challenge={challenge} index={index} />
          ))}
        </motion.div>

        {/* Bottom CTA */}
        <motion.div initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="mt-16 rounded-[28px] border border-white/10 bg-white/[0.03] p-8 backdrop-blur-xl">
          <div className="flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-center">
            <div className="max-w-xl">
              <p className="text-xl font-bold text-white">Missions built for real coding growth</p>
              <p className="mt-2 text-[15px] text-gray-400">Train with structured challenges, then duel real opponents. Track your progress and climb the leaderboards.</p>
            </div>
            <Link href="/login" className="group inline-flex shrink-0 items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-pink-500 to-purple-600 px-8 py-4 text-sm font-semibold text-white transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_40px_rgba(168,85,247,0.25)]">
              Browse All Missions
              <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}