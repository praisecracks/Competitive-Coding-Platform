"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform, useMotionValue, useSpring, useMotionTemplate } from "framer-motion";
import { BookOpen, Clock, ArrowRight, Sparkles, Code2, Brain, Database, GraduationCap, Hexagon, Zap, ChevronRight } from "lucide-react";

const learningCategories = [
  {
    id: "javascript",
    title: "JavaScript Fundamentals",
    description: "Master the building blocks of the web",
    icon: Code2,
    color: "yellow",
    difficulty: "Beginner",
    lessons: 6,
    duration: "2 hrs",
    accentColor: "#EAB308",
    languages: ["JavaScript"],
  },
  {
    id: "algorithms",
    title: "Algorithms & Problem Solving",
    description: "Core patterns every developer must know",
    icon: Brain,
    color: "pink",
    difficulty: "Intermediate",
    lessons: 12,
    duration: "6 hrs",
    accentColor: "#EC4899",
    languages: ["JS", "Python", "Go"],
  },
  {
    id: "python",
    title: "Python Basics",
    description: "Learn Python from zero to hero",
    icon: GraduationCap,
    color: "emerald",
    difficulty: "Beginner",
    lessons: 5,
    duration: "1.5 hrs",
    accentColor: "#10B981",
    languages: ["Python"],
  },
  {
    id: "go",
    title: "Go Fundamentals",
    description: "Build efficient backend systems",
    icon: Code2,
    color: "cyan",
    difficulty: "Beginner",
    lessons: 5,
    duration: "2 hrs",
    accentColor: "#06B6D4",
    languages: ["Go"],
  },
  {
    id: "datastructures",
    title: "Data Structures",
    description: "Master arrays, maps, trees & more",
    icon: Database,
    color: "purple",
    difficulty: "Intermediate",
    lessons: 8,
    duration: "4 hrs",
    accentColor: "#A855F7",
    languages: ["JS", "Python", "Go"],
  },
];

const getDifficultyStyles = (difficulty: string) => {
  switch (difficulty) {
    case "Beginner":
      return "border-emerald-500/30 bg-emerald-500/10 text-emerald-300";
    case "Intermediate":
      return "border-amber-500/30 bg-amber-500/10 text-amber-300";
    default:
      return "border-white/20 bg-white/5 text-gray-300";
  }
};

function TiltCard({ category, index }: { category: typeof learningCategories[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  const springConfig = { stiffness: 300, damping: 25 };
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [8, -8]), springConfig);
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-8, 8]), springConfig);

  const glowX = useSpring(useTransform(x, [-0.5, 0.5], ["0%", "100%"]), { stiffness: 200, damping: 20 });
  const glowY = useSpring(useTransform(y, [-0.5, 0.5], ["0%", "100%"]), { stiffness: 200, damping: 20 });
  
  const spotlight = useMotionTemplate`radial-gradient(600px circle at ${glowX}px ${glowY}px, ${category.accentColor}15, transparent 70%)`;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set((e.clientX - centerX) / rect.width);
    y.set((e.clientY - centerY) / rect.height);
  };

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => {
    setIsHovered(false);
    x.set(0);
    y.set(0);
  };

  const Icon = category.icon;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="relative"
    >
      <div className="group relative overflow-hidden rounded-[28px] border border-white/[0.08] bg-[#0A0A0C] p-6 transition-all duration-500 hover:border-white/15 sm:p-7">
        {/* Dynamic Spotlight Glow */}
        <motion.div
          style={{ background: spotlight }}
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500"
          animate={{ opacity: isHovered ? 1 : 0 }}
        />

        {/* Subtle Grid Pattern */}
        <div className="pointer-events-none absolute inset-0 opacity-[0.03] [background-image:linear-gradient(rgba(255,255,255,0.5)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.5)_1px,transparent_1px)] [background-size:32px_32px]" />

        {/* Top Gradient Line */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        
        {/* Bottom Glow */}
        <div 
          className="absolute bottom-0 inset-x-0 h-32 transition-opacity duration-500"
          style={{ 
            background: `linear-gradient(to top, ${category.accentColor}08, transparent)`,
            opacity: isHovered ? 1 : 0.3
          }} 
        />

        {/* Card Glow on Hover */}
        <div 
          className="absolute -inset-px rounded-[28px] opacity-0 transition-opacity duration-500 blur-xl"
          style={{ 
            background: `linear-gradient(135deg, ${category.accentColor}20, transparent 60%)`,
            opacity: isHovered ? 0.5 : 0
          }}
        />

        <div className="relative z-10">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div 
                className="flex h-14 w-14 items-center justify-center rounded-2xl transition-transform duration-300"
                style={{ 
                  background: `linear-gradient(135deg, ${category.accentColor}20, ${category.accentColor}08)`,
                  boxShadow: `0 0 30px ${category.accentColor}20`
                }}
              >
                <Icon className="h-7 w-7" style={{ color: category.accentColor }} />
              </div>
              
              <div>
                <span className={`inline-flex rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.15em] ${getDifficultyStyles(category.difficulty)}`}>
                  {category.difficulty}
                </span>
              </div>
            </div>

            {/* Corner Accent */}
            <div className="relative">
              <div 
                className="h-8 w-8 rounded-lg opacity-20 transition-all duration-500"
                style={{ background: category.accentColor }}
              />
              <div 
                className="absolute inset-0 rounded-lg opacity-0 transition-opacity duration-500"
                style={{ 
                  background: `linear-gradient(135deg, ${category.accentColor}, transparent)`,
                  opacity: isHovered ? 0.3 : 0
                }}
              />
            </div>
          </div>

          {/* Content */}
          <div className="mt-6">
            <h3 className="text-2xl font-bold tracking-tight text-white transition-colors duration-300">
              {category.title}
            </h3>
            
            <p className="mt-2.5 text-[15px] leading-6 text-gray-400">
              {category.description}
            </p>
          </div>

          {/* Stats Row */}
          <div className="mt-6 flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center">
                <BookOpen className="h-4 w-4 text-gray-500" />
              </div>
              <span className="text-[13px] font-medium text-gray-300">{category.lessons} Lessons</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center">
                <Clock className="h-4 w-4 text-gray-500" />
              </div>
              <span className="text-[13px] font-medium text-gray-300">{category.duration}</span>
            </div>
          </div>

          {/* Language Tags */}
          <div className="mt-5 flex flex-wrap gap-2">
            {category.languages.map((lang) => (
              <span 
                key={lang}
                className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-1.5 text-[12px] font-medium text-gray-400 transition-all duration-300 hover:border-white/20 hover:bg-white/[0.06]"
              >
                <Hexagon className="h-3 w-3" style={{ color: category.accentColor }} />
                {lang}
              </span>
            ))}
          </div>

          {/* CTA */}
          <div className="mt-7 border-t border-white/[0.08] pt-5">
            <Link
              href="/login"
              className="group/btn inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-[12px] font-semibold uppercase tracking-[0.12em] text-white transition-all duration-300 hover:gap-3"
              style={{ 
                background: `linear-gradient(135deg, ${category.accentColor}15, ${category.accentColor}08)`,
                border: `1px solid ${category.accentColor}30`
              }}
            >
              <span>Start Learning</span>
              <ChevronRight className="h-4 w-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function LearningPreview() {
  const containerRef = useRef<HTMLElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const y1 = useTransform(scrollYProgress, [0, 1], [0, -30]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, 30]);
  
  const sectionGlowX = useSpring(mouseX, { stiffness: 100, damping: 20 });
  const sectionGlowY = useSpring(mouseY, { stiffness: 100, damping: 20 });
  
  const sectionSpotlight = useMotionTemplate`radial-gradient(800px circle at ${sectionGlowX}px ${sectionGlowY}px, rgba(168,85,247,0.06), transparent 50%)`;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  };

  return (
    <section 
      ref={containerRef}
      id="learning"
      onMouseMove={handleMouseMove}
      className="relative overflow-hidden bg-[#020202] py-24 text-gray-100 sm:py-28 lg:py-36"
    >
      {/* Dynamic Background */}
      <motion.div 
        style={{ y: y1 }}
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
      >
        <div className="absolute left-[10%] top-0 h-[500px] w-[500px] rounded-full bg-pink-500/6 blur-[180px]" />
        <div className="absolute right-[5%] top-[20%] h-[400px] w-[400px] rounded-full bg-purple-500/6 blur-[160px]" />
        <div className="absolute bottom-[10%] left-[30%] h-[300px] w-[300px] rounded-full bg-cyan-500/4 blur-[140px]" />
      </motion.div>

      {/* Section Spotlight */}
      <motion.div
        style={{ background: sectionSpotlight }}
        className="pointer-events-none absolute inset-0 -z-10 opacity-60"
      />

      {/* Grid Pattern */}
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-[0.025] [background-image:linear-gradient(rgba(255,255,255,0.5)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.5)_1px,transparent_1px)] [background-size:64px_64px]" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mx-auto mb-16 max-w-3xl text-center"
        >
          <div className="inline-flex items-center gap-3 rounded-full border border-purple-500/30 bg-purple-500/10 px-5 py-2 text-[11px] font-medium uppercase tracking-[0.28em] text-purple-300 backdrop-blur-xl">
            <Zap className="h-4 w-4" />
            Learning System
            <span className="ml-1 rounded-full border border-pink-500/40 bg-pink-500/20 px-2.5 py-0.5 text-[10px] font-bold text-pink-200">
              3 Languages
            </span>
          </div>

          <h2 className="mt-8 text-5xl font-black tracking-[-0.04em] text-white sm:text-6xl md:text-7xl">
            Learn to code
            <span className="block bg-gradient-to-r from-purple-300 via-pink-300 to-rose-300 bg-clip-text text-transparent">
              the right way
            </span>
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-[17px] leading-7 text-gray-400">
            Structured courses in <span className="text-white font-medium">JavaScript, Python & Go</span>. 
            Master languages, algorithms, and data structures with guided paths built for beginners to experts.
          </p>
        </motion.div>

        {/* Category Cards Grid */}
        <motion.div 
          style={{ y: y2 }}
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {learningCategories.map((category, index) => (
            <TiltCard key={category.id} category={category} index={index} />
          ))}
        </motion.div>

        {/* Bottom CTA Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-20 rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(168,85,247,0.1),rgba(9,9,12,1))] p-8 backdrop-blur-xl sm:p-10"
        >
          <div className="flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
            <div className="max-w-xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-pink-500/30 bg-pink-500/10 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-pink-300">
                <Sparkles className="h-4 w-4" />
                30+ Languages Coming Soon
              </div>
              <p className="mt-6 text-2xl font-bold text-white">
                One platform. Infinite possibilities.
              </p>
              <p className="mt-3 text-[15px] text-gray-400">
                From JavaScript to Rust, Python to Go — master any language 
                with our structured learning paths. New languages added regularly.
              </p>
            </div>

            <Link
              href="/login"
              className="group inline-flex shrink-0 items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-pink-500 to-purple-600 px-8 py-4 text-sm font-semibold text-white transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_40px_rgba(168,85,247,0.3)]"
            >
              Start Your Journey
              <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}