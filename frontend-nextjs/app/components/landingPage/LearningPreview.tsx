"use client";

import { motion } from "framer-motion";
import { Code2, Database, Brain, BookOpen, GraduationCap, Flame, ArrowRight, HardDrive, CircuitBoard } from "lucide-react";
import { useTheme } from "@/app/context/ThemeContext";
import { useRouter } from "next/navigation";

const LEARNING_PATHS = [
  {
    id: "full-stack",
    headline: "Become a Complete Coder",
    subheadline: "Build real applications from scratch",
    description: "Master the full stack — frontend, backend, and architecture. Three comprehensive tracks, 94 hours of content, 150+ projects.",
    tracks: [
      { 
        id: "master-javascript", 
        title: "Master JavaScript", 
        hours: 28, 
        color: "yellow", 
        icon: "Code2",
        coverImage: "https://images.unsplash.com/photo-1627398242454-45a1465c2479?auto=format&fit=crop&q=80&w=400"
      },
      { 
        id: "master-python", 
        title: "Master Python", 
        hours: 28, 
        color: "emerald", 
        icon: "GraduationCap",
        coverImage: "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?auto=format&fit=crop&q=80&w=400"
      },
      { 
        id: "system-design", 
        title: "System Design", 
        hours: 38, 
        color: "orange", 
        icon: "CircuitBoard",
        coverImage: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&q=80&w=400"
      },
    ],
    totalHours: 94,
    stats: { projects: "150+", lessons: "400+", rating: "4.9★" },
    gradient: "from-blue-600/90 via-indigo-600/90 to-purple-600/90",
    cta: "Start your journey",
    previewTrack: "master-javascript",
  },
  {
    id: "interviews",
    headline: "Crush Technical Interviews",
    subheadline: "Master the patterns that appear in 90% of interviews",
    description: "Two deep specializations covering 81 hours of algorithmic problem-solving, data structures, and real company questions.",
    tracks: [
      { 
        id: "algorithms", 
        title: "Algorithm Patterns", 
        hours: 41, 
        color: "pink", 
        icon: "Brain",
        coverImage: "https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&q=80&w=400"
      },
      { 
        id: "data-structures", 
        title: "Data Structures", 
        hours: 40, 
        color: "purple", 
        icon: "Database",
        coverImage: "https://images.unsplash.com/photo-1516116216624-53e697fedbea?auto=format&fit=crop&q=80&w=400"
      },
    ],
    totalHours: 81,
    stats: { patterns: "200+", problems: "500+", rating: "4.9★" },
    gradient: "from-rose-600/90 via-orange-600/90 to-pink-600/90",
    cta: "Prepare systematically",
    previewTrack: "algorithms",
  },
  {
    id: "specialize",
    headline: "Specialize & Go Deep",
    subheadline: "Add niche expertise to your profile",
    description: "Production-grade systems thinking for senior roles. Master Go and SQL to build scalable, high-performance applications.",
    tracks: [
      { 
        id: "master-go", 
        title: "Master Go", 
        hours: 33, 
        color: "cyan", 
        icon: "Code2",
        coverImage: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=400"
      },
      { 
        id: "sql-databases", 
        title: "SQL & Databases", 
        hours: 25, 
        color: "teal", 
        icon: "HardDrive",
        coverImage: "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?auto=format&fit=crop&q=80&w=400"
      },
    ],
    totalHours: 58,
    stats: { projects: "40+", systems: "production-grade", rating: "4.8★" },
    gradient: "from-emerald-600/90 via-teal-600/90 to-cyan-600/90",
    cta: "Explore specializations",
    viewAll: true,
  },
];

function getAccentColor(color: string, isLight: boolean) {
  const colors: Record<string, { bg: string; text: string; border: string }> = {
    yellow: isLight
      ? { bg: "bg-yellow-100", text: "text-yellow-700", border: "border-yellow-300" }
      : { bg: "bg-yellow-500/20", text: "text-yellow-300", border: "border-yellow-500/30" },
    emerald: isLight
      ? { bg: "bg-emerald-100", text: "text-emerald-700", border: "border-emerald-300" }
      : { bg: "bg-emerald-500/20", text: "text-emerald-300", border: "border-emerald-500/30" },
    cyan: isLight
      ? { bg: "bg-cyan-100", text: "text-cyan-700", border: "border-cyan-300" }
      : { bg: "bg-cyan-500/20", text: "text-cyan-300", border: "border-cyan-500/30" },
    pink: isLight
      ? { bg: "bg-pink-100", text: "text-pink-700", border: "border-pink-300" }
      : { bg: "bg-pink-500/20", text: "text-pink-300", border: "border-pink-500/30" },
    purple: isLight
      ? { bg: "bg-purple-100", text: "text-purple-700", border: "border-purple-300" }
      : { bg: "bg-purple-500/20", text: "text-purple-300", border: "border-purple-500/30" },
    orange: isLight
      ? { bg: "bg-orange-100", text: "text-orange-700", border: "border-orange-300" }
      : { bg: "bg-orange-500/20", text: "text-orange-300", border: "border-orange-500/30" },
     blue: isLight
        ? { bg: "bg-blue-100", text: "text-blue-700", border: "border-blue-300" }
        : { bg: "bg-blue-500/20", text: "text-blue-300", border: "border-blue-500/30" },
     teal: isLight
        ? { bg: "bg-teal-100", text: "text-teal-700", border: "border-teal-300" }
        : { bg: "bg-teal-500/20", text: "text-teal-300", border: "border-teal-500/30" },
    };
    return colors[color] || colors.purple;
  }

  function ImageStack({ images }: { images: string[] }) {
  return (
    <div className="relative flex h-[140px] w-[200px] items-center justify-center">
      {images.map((img, idx) => {
        const isTop = idx === 0;
        const isMiddle = idx === 1;
        const isBottom = idx === 2;
        const zIndex = 3 - idx; // top image highest z-index

        // Base styles
        let rotate = 0;
        let translateY = 0;
        let translateX = 0;
        let shadow = "shadow-lg";

        if (isTop) {
          rotate = -4;
          translateY = -25;
          translateX = -10;
          shadow = "shadow-xl";
        } else if (isMiddle) {
          rotate = 2;
          translateY = 0;
          translateX = 10;
          shadow = "shadow-lg";
        } else if (isBottom) {
          rotate = -2;
          translateY = 25;
          translateX = -5;
          shadow = "shadow-md";
        }

        return (
          <motion.div
            key={idx}
            className={`absolute ${shadow} rounded-xl border-2 border-white/10 overflow-hidden bg-white`}
            style={{
              width: "140px",
              height: "100px",
              zIndex,
              rotate,
              x: translateX,
              y: translateY,
            }}
            initial={false}
            whileHover={{
              rotate: rotate * (isTop ? 0.3 : 1),
              y: translateY + (isTop ? -5 : 0),
              scale: isTop ? 1.05 : 1,
              transition: { duration: 0.2 },
            }}
          >
            <img
              src={img}
              alt={`Track cover ${idx + 1}`}
              className="h-full w-full object-cover"
            />
          </motion.div>
        );
      })}
    </div>
  );
}

export default function LearningPreview() {
  const { theme } = useTheme();
  const isLight = theme === "light";
  const router = useRouter();

  return (
    <section id="learning" className="relative scroll-mt-20 overflow-hidden py-20 sm:py-24 lg:py-28">
      {/* Background grid pattern */}
      <div
        className={`absolute inset-0 ${
          isLight ? "bg-gradient-to-b from-gray-50/50 to-white" : "bg-gradient-to-b from-[#020202] to-[#050505]"
        }`}
      />
      <div
        className={`absolute inset-0 opacity-[0.03] ${
          isLight ? "bg-[radial-gradient(circle_at_50%_50%,theme('colors.gray.800'),transparent_50%)]" : ""
        }`}
      />

      <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="mx-auto mb-12 max-w-3xl text-center"
        >
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-pink-500 to-purple-600">
            <BookOpen className="h-6 w-6 text-white" />
          </div>
          <h2
            className={`text-3xl font-bold tracking-tight sm:text-4xl ${
              isLight ? "text-gray-900" : "text-white"
            }`}
          >
            Start Your Learning Journey
          </h2>
          <p
            className={`mt-3 text-lg leading-6 sm:text-xl ${
              isLight ? "text-gray-600" : "text-gray-300"
            }`}
          >
            Your path to mastering code, structured, project-based, and proven
          </p>
        </motion.div>

        {/* 3 Path Cards */}
        <div className="space-y-6">
          {LEARNING_PATHS.map((path, index) => (
            <motion.div
              key={path.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              className={`relative overflow-hidden rounded-3xl bg-gradient-to-r ${path.gradient} shadow-xl transition-all duration-300 hover:shadow-2xl hover:scale-[1.01] cursor-pointer`}
               onClick={() => path.previewTrack ? router.push(`/learning/track/${path.previewTrack}`) : router.push('/login?next=/dashboard/learning')}
            >
              {/* Decorative background elements */}
              <div className="absolute inset-0 opacity-20">
                <div className="absolute -right-10 -top-10 h-64 w-64 rounded-full bg-white blur-3xl" />
                <div className="absolute -bottom-10 -left-10 h-64 w-64 rounded-full bg-white blur-3xl" />
              </div>

              <div className="relative p-6 sm:p-8 lg:p-10">
                <div className="grid items-center gap-8 lg:grid-cols-2">
                  {/* Left: Content */}
                  <div className="space-y-4">
                    <div>
                      <h3
                        className={`text-2xl font-bold tracking-tight sm:text-3xl ${
                          isLight ? "text-white" : "text-white"
                        }`}
                      >
                        {path.headline}
                      </h3>
                      <p
                        className={`mt-2 text-base leading-6 sm:text-lg ${
                          isLight ? "text-white/90" : "text-white/80"
                        }`}
                      >
                        {path.subheadline}
                      </p>
                      <p
                        className={`mt-3 text-sm leading-6 sm:text-base ${
                          isLight ? "text-white/70" : "text-white/70"
                        }`}
                      >
                        {path.description}
                      </p>
                    </div>

                    {/* Stats row */}
                    <div className="flex items-center gap-6 pt-2">
                      <div className="flex items-center gap-2">
                        <Flame className="h-5 w-5 text-white/70" />
                        <span className="text-sm font-semibold text-white/90">{path.totalHours}h</span>
                      </div>
                      {Object.entries(path.stats).map(([key, value]) => (
                        <div key={key} className="flex items-center gap-1.5">
                          <span className="text-sm text-white/70 capitalize">{key.replace(/[A-Z]/g, " $1")}:</span>
                          <span className="text-sm font-semibold text-white">{value}</span>
                        </div>
                      ))}
                    </div>

                    {/* CTA */}
                    <div className="flex items-center text-gray-800 gap-4 pt-3">
                      <a
                        href={path.viewAll ? "/login?next=/dashboard/learning" : `/learning/track/${path.previewTrack}`}
                        onClick={(e) => path.viewAll && e.stopPropagation()}
                        className="inline-flex items-center gap-2 rounded-xl bg-white  px-6 py-3 text-sm font-semibold text-gray-800 shadow-lg transition-all hover:from-pink-600 hover:to-purple-700 hover:gap-3"
                      >
                        {path.cta}
                        <ArrowRight className="h-4 w-4" />
                      </a>
                      {!path.viewAll && (
                        <a
                          href="/login?next=/dashboard/learning"
                          onClick={(e) => e.stopPropagation()}
                          className="text-sm font-medium text-white/80 underline underline-offset-4 hover:text-white"
                        >
                          Browse all tracks
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Right: Image collage */}
                  <div className="hidden lg:flex items-center justify-end">
                    <ImageStack images={path.tracks.map(t => t.coverImage)} />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-10 text-center"
        >
          <a
            href="/login?next=/dashboard/learning"
            className={`inline-flex items-center gap-2 rounded-2xl  px-8 py-4 text-base font-semibold transition-all ${
              isLight
                ? "border-pink-300 bg-pink-50 text-pink-700 hover:bg-pink-100 hover:border-pink-400"
                : "border-white/20 bg-white/5 text-white hover:bg-white/10 backdrop-blur-sm"
            }`}
          >
            <GraduationCap className="h-5 w-5" />
            Browse all tracks
          </a>
        </motion.div>
      </div>
    </section>
  );
}
