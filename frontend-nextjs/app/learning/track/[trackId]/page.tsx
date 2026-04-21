"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter, useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Clock,
  BookOpen,
  ChevronRight,
  Lock,
  PlayCircle,
  CheckCircle2,
  Code2,
  Database,
  Brain,
  GraduationCap,
  HardDrive,
  CircuitBoard,
  Sparkles,
  Star,
  ShieldCheck,
  Zap,
  Users,
  Target,
} from "lucide-react";
import { getTrackById, TrackTopic, Subtopic } from "@/app/dashboard/learning/data";
import { useTheme } from "@/app/context/ThemeContext";
import PageFooter from "@/app/components/PageFooter";
import {
  getLearningProgress,
  migrateLegacyProgress,
  updateTrackProgress,
  updateStreak,
  TrackProgress,
} from "@/lib/learning-api";
import { FaGithub, FaTwitter, FaDiscord } from "react-icons/fa";
import Link from "next/link";
import AppFooter from "@/app/components/dashboard/footer";
import Footer from "@/app/components/PageFooter";

export default function PublicTrackPage() {
  const router = useRouter();
  const params = useParams();
  const { theme } = useTheme();
  const isLight = theme === "light";

  const trackId = params.trackId as string;
  const track = getTrackById(trackId);

  const [expandedTopics, setExpandedTopics] = useState<Set<string>>(new Set());
  const [sampleLessonId, setSampleLessonId] = useState<string | null>(null);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("terminal_token");

    if (token) {
      router.replace(`/dashboard/learning/track/${trackId}`);
      return;
    }

    setCheckingAuth(false);
  }, [trackId, router]);

  useEffect(() => {
    if (track?.topics?.length) {
      const firstTopic = track.topics[0];
      if (firstTopic?.subtopics?.length) {
        setSampleLessonId(firstTopic.subtopics[0].id);
        setExpandedTopics(new Set([firstTopic.id]));
      }
    }
  }, [track]);

  const totalLessons = useMemo(() => {
    if (!track) return 0;
    return track.topics.reduce((sum, topic) => sum + topic.subtopics.length, 0);
  }, [track]);

  if (checkingAuth) {
    return (
      <div
        className={`flex min-h-screen items-center justify-center ${
          isLight ? "bg-[#f8fafc]" : "bg-[#020202]"
        }`}
      >
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-pink-500 border-t-transparent" />
      </div>
    );
  }

  if (!track) {
    return (
      
      <div
        className={`flex min-h-screen items-center justify-center ${
          isLight ? "bg-[#f8fafc]" : "bg-[#020202]"
        }`}
      >
        <div className="text-center">
          <h1 className={`mb-4 text-2xl font-bold ${isLight ? "text-gray-900" : "text-white"}`}>
            Track Not Found
          </h1>
          <button
            onClick={() => router.push("/")}
            className={`rounded-xl px-6 py-3 transition ${
              isLight
                ? "bg-gray-200 text-gray-700 hover:bg-gray-300"
                : "bg-white/10 text-white hover:bg-white/20"
            }`}
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "Code2":
        return <Code2 className="h-5 w-5" />;
      case "Database":
        return <Database className="h-5 w-5" />;
      case "Brain":
        return <Brain className="h-5 w-5" />;
      case "GraduationCap":
        return <GraduationCap className="h-5 w-5" />;
      case "HardDrive":
        return <HardDrive className="h-5 w-5" />;
      case "CircuitBoard":
        return <CircuitBoard className="h-5 w-5" />;
      default:
        return <BookOpen className="h-5 w-5" />;
    }
  };

  const getColorClasses = (color: string) => {
    const colorMap: Record<
      string,
      {
        softBg: string;
        softBorder: string;
        softText: string;
        accentBg: string;
        accentText: string;
      }
    > = {
      yellow: {
        softBg: isLight ? "bg-yellow-50" : "bg-yellow-500/10",
        softBorder: isLight ? "border-yellow-200" : "border-yellow-500/20",
        softText: isLight ? "text-yellow-700" : "text-yellow-300",
        accentBg: "from-yellow-500 to-orange-500",
        accentText: "text-yellow-400",
      },
      emerald: {
        softBg: isLight ? "bg-emerald-50" : "bg-emerald-500/10",
        softBorder: isLight ? "border-emerald-200" : "border-emerald-500/20",
        softText: isLight ? "text-emerald-700" : "text-emerald-300",
        accentBg: "from-emerald-500 to-teal-500",
        accentText: "text-emerald-400",
      },
      cyan: {
        softBg: isLight ? "bg-cyan-50" : "bg-cyan-500/10",
        softBorder: isLight ? "border-cyan-200" : "border-cyan-500/20",
        softText: isLight ? "text-cyan-700" : "text-cyan-300",
        accentBg: "from-cyan-500 to-blue-500",
        accentText: "text-cyan-400",
      },
      pink: {
        softBg: isLight ? "bg-pink-50" : "bg-pink-500/10",
        softBorder: isLight ? "border-pink-200" : "border-pink-500/20",
        softText: isLight ? "text-pink-700" : "text-pink-300",
        accentBg: "from-pink-500 to-purple-600",
        accentText: "text-pink-400",
      },
      purple: {
        softBg: isLight ? "bg-purple-50" : "bg-purple-500/10",
        softBorder: isLight ? "border-purple-200" : "border-purple-500/20",
        softText: isLight ? "text-purple-700" : "text-purple-300",
        accentBg: "from-purple-500 to-fuchsia-600",
        accentText: "text-purple-400",
      },
      orange: {
        softBg: isLight ? "bg-orange-50" : "bg-orange-500/10",
        softBorder: isLight ? "border-orange-200" : "border-orange-500/20",
        softText: isLight ? "text-orange-700" : "text-orange-300",
        accentBg: "from-orange-500 to-red-500",
        accentText: "text-orange-400",
      },
      teal: {
        softBg: isLight ? "bg-teal-50" : "bg-teal-500/10",
        softBorder: isLight ? "border-teal-200" : "border-teal-500/20",
        softText: isLight ? "text-teal-700" : "text-teal-300",
        accentBg: "from-teal-500 to-cyan-500",
        accentText: "text-teal-400",
      },
    };

    return colorMap[color] || colorMap.purple;
  };

  const colorTheme = getColorClasses(track.color);
  const brandGradient = "from-pink-500 to-purple-600";

  const handleTopicClick = (topicId: string) => {
    setExpandedTopics((prev) => {
      const next = new Set(prev);
      if (next.has(topicId)) {
        next.delete(topicId);
      } else {
        next.add(topicId);
      }
      return next;
    });
  };

  const handleStartTrack = () => {
    router.push(`/login?next=/dashboard/learning/track/${trackId}`);
  };

  const handleTrySample = (topicId: string, lessonId: string) => {
    router.push(
      `/login?next=/dashboard/learning/track/${trackId}/topic/${topicId}/lesson/${lessonId}`
    );
  };

  const strongText = isLight ? "text-gray-900" : "text-white";
  const mutedText = isLight ? "text-gray-600" : "text-gray-400";
  const softSurface = isLight ? "bg-white" : "bg-[#09090c]";
  const borderSurface = isLight ? "border-gray-200" : "border-white/10";

  return (
    <div className={`min-h-screen ${isLight ? "bg-[#f8fafc]" : "bg-[#020202]"}`}>
      <div className="relative overflow-hidden">
        {track.coverImage ? (
          <div className="absolute inset-0">
            <img
              src={track.coverImage}
              alt=""
              className="h-full w-full object-cover"
              style={{ filter: "brightness(0.18) blur(2px)" }}
            />
            <div
              className={`absolute inset-0 ${
                isLight
                  ? "bg-[linear-gradient(to_bottom,rgba(255,255,255,0.92),rgba(248,250,252,0.96),rgba(248,250,252,1))]"
                  : "bg-[linear-gradient(to_bottom,rgba(2,2,3,0.72),rgba(2,2,3,0.90),rgba(2,2,3,1))]"
              }`}
            />
          </div>
        ) : null}

        <div
          className={`relative border-b ${
            isLight ? "border-gray-200/80 bg-white/70" : "border-white/10 bg-black/20"
          } backdrop-blur-xl`}
        >
          <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
            <button
              onClick={() => router.back()}
              className={`inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition ${
                isLight
                  ? "text-gray-700 hover:bg-gray-100"
                  : "text-gray-300 hover:bg-white/5"
              }`}
            >
              <ArrowLeft className="h-4 w-4" />
              Back to tracks
            </button>

            <div className={`hidden text-sm ${mutedText} sm:block`}>
              Public learning track preview
            </div>
          </div>
        </div>

        <div className="relative px-4 pb-14 pt-10 sm:px-6 sm:pb-16 lg:px-8 lg:pt-14">
          <div className="mx-auto max-w-7xl">
            <div className="grid items-center gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:gap-10">
              <motion.div
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45 }}
              >
                <div
                  className={`mb-5 inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] ${
                    isLight
                      ? "border-pink-200 bg-pink-50 text-pink-700"
                      : "border-pink-500/20 bg-pink-500/10 text-pink-300"
                  }`}
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  Premium Learning Track
                </div>

                <div className="mb-6 flex items-center gap-4">
                  <div
                    className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border ${
                      isLight ? "border-white/80 bg-white shadow-lg" : "border-white/10 bg-white/5"
                    }`}
                  >
                    <div className={colorTheme.accentText}>{getIcon(track.icon)}</div>
                  </div>

                  <div>
                    <h1 className={`text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl ${strongText}`}>
                      {track.title}
                    </h1>
                    <p className={`mt-2 text-base sm:text-lg ${mutedText}`}>{track.subtitle}</p>
                  </div>
                </div>

                <p className={`max-w-3xl text-sm leading-7 sm:text-base lg:text-lg ${mutedText}`}>
                  {track.description}
                </p>

                <div className="mt-7 flex flex-wrap gap-3">
                  <HeroMetric
                    icon={Clock}
                    title={`${track.totalHours}h`}
                    subtitle="Duration"
                    isLight={isLight}
                    colorTheme={colorTheme}
                  />
                  <HeroMetric
                    icon={BookOpen}
                    title={`${track.topics.length}`}
                    subtitle="Topics"
                    isLight={isLight}
                    colorTheme={colorTheme}
                  />
                  <HeroMetric
                    icon={CheckCircle2}
                    title={`${totalLessons}`}
                    subtitle="Lessons"
                    isLight={isLight}
                    colorTheme={colorTheme}
                  />
                  <HeroMetric
                    icon={Star}
                    title="4.9"
                    subtitle="Rating"
                    isLight={isLight}
                    colorTheme={colorTheme}
                  />
                </div>

                <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                  <button
                    onClick={handleStartTrack}
                    className={`inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r ${brandGradient} px-6 py-4 text-sm font-semibold text-white shadow-[0_18px_50px_rgba(236,72,153,0.25)] transition hover:scale-[1.01]`}
                  >
                    Start Learning Free
                    <PlayCircle className="h-5 w-5" />
                  </button>

                  {sampleLessonId ? (
                    <button
                      onClick={() => handleTrySample(track.topics[0].id, sampleLessonId)}
                      className={`inline-flex items-center justify-center gap-2 rounded-2xl border px-6 py-4 text-sm font-semibold transition ${
                        isLight
                          ? "border-gray-200 bg-white text-gray-900 hover:bg-gray-50"
                          : "border-white/10 bg-white/5 text-white hover:bg-white/10"
                      }`}
                    >
                      <PlayCircle className="h-5 w-5" />
                      Preview First Lesson
                    </button>
                  ) : null}
                </div>

                <p className={`mt-3 text-sm ${isLight ? "text-gray-500" : "text-gray-500"}`}>
                  No credit card required · Visitors preview first, users continue inside dashboard
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: 0.08 }}
                className={`overflow-hidden rounded-[28px] border ${borderSurface} ${softSurface} ${
                  isLight
                    ? "shadow-[0_18px_60px_rgba(15,23,42,0.08)]"
                    : "shadow-[0_20px_70px_rgba(0,0,0,0.35)]"
                }`}
              >
                <div className="p-5 sm:p-6">
                  <div className="mb-5 flex items-center justify-between">
                    <div>
                      <p className={`text-xs font-semibold uppercase tracking-[0.16em] ${mutedText}`}>
                        Why this feels premium
                      </p>
                      <h2 className={`mt-2 text-xl font-semibold ${strongText}`}>
                        Built to convert visitors
                      </h2>
                    </div>

                    <div
                      className={`rounded-2xl border p-3 ${
                        isLight
                          ? "border-pink-200 bg-pink-50 text-pink-700"
                          : "border-pink-500/20 bg-pink-500/10 text-pink-300"
                      }`}
                    >
                      <Target className="h-5 w-5" />
                    </div>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <FeatureMiniCard
                      icon={ShieldCheck}
                      title="Trusted structure"
                      text="Clear learning path with real lessons and progression."
                      isLight={isLight}
                    />
                    <FeatureMiniCard
                      icon={Zap}
                      title="Fast hook"
                      text="Preview lesson gives users a reason to stay."
                      isLight={isLight}
                    />
                    <FeatureMiniCard
                      icon={Users}
                      title="Visitor-safe flow"
                      text="Visitors see public UI, users go to dashboard."
                      isLight={isLight}
                    />
                    <FeatureMiniCard
                      icon={Star}
                      title="Modern design"
                      text="Better spacing, hierarchy, and conversion clarity."
                      isLight={isLight}
                    />
                  </div>

                  <div
                    className={`mt-5 rounded-2xl border p-4 ${
                      isLight
                        ? "border-emerald-200 bg-emerald-50"
                        : "border-emerald-500/20 bg-emerald-500/10"
                    }`}
                  >
                    <div className="mb-2 flex items-center gap-2">
                      <PlayCircle className="h-4 w-4 text-emerald-500" />
                      <p className={`text-sm font-semibold ${isLight ? "text-emerald-700" : "text-emerald-300"}`}>
                        Free preview available
                      </p>
                    </div>
                    <p className={`text-sm leading-6 ${isLight ? "text-emerald-700/90" : "text-emerald-200/90"}`}>
                      The first lesson is open as a teaser. All other deeper lessons route visitors
                      through login first, so your visitor and user logic stay separate.
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      <section className={`px-4 py-14 sm:px-6 lg:px-8 ${isLight ? "bg-white" : "bg-[#07080c]"}`}>
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-10 text-center"
          >
            <div
              className={`mb-3 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] ${
                isLight
                  ? "border-gray-200 bg-gray-50 text-gray-700"
                  : "border-white/10 bg-white/5 text-gray-300"
              }`}
            >
              What users get
            </div>
            <h2 className={`text-3xl font-bold sm:text-4xl ${strongText}`}>What you’ll build</h2>
            <p className={`mt-3 text-base sm:text-lg ${mutedText}`}>
              Position the track like a serious product, not a plain documentation page.
            </p>
          </motion.div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {[
              {
                title: "Real-world projects",
                description:
                  "Build practical solutions that feel relevant outside tutorials and theory.",
                icon: <Code2 className="h-6 w-6" />,
              },
              {
                title: "Pattern recognition",
                description:
                  "Train your thinking with repeatable concepts you can apply across many problems.",
                icon: <Brain className="h-6 w-6" />,
              },
              {
                title: "Production mindset",
                description:
                  "Move beyond syntax into how real systems are designed and improved.",
                icon: <Database className="h-6 w-6" />,
              },
            ].map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.06 }}
                className={`rounded-[24px] border p-6 transition ${
                  isLight
                    ? "border-gray-200 bg-white shadow-[0_10px_30px_rgba(15,23,42,0.05)] hover:-translate-y-0.5 hover:shadow-[0_16px_40px_rgba(15,23,42,0.08)]"
                    : "border-white/10 bg-[#09090c] hover:-translate-y-0.5 hover:border-white/20"
                }`}
              >
                <div
                  className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl border ${colorTheme.softBg} ${colorTheme.softBorder} ${colorTheme.softText}`}
                >
                  {item.icon}
                </div>
                <h3 className={`text-xl font-semibold ${strongText}`}>{item.title}</h3>
                <p className={`mt-2 text-sm leading-7 ${mutedText}`}>{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className={`px-4 py-14 sm:px-6 lg:px-8 ${isLight ? "bg-[#f8fafc]" : "bg-[#020203]"}`}>
        <div className="mx-auto max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-10 text-center"
          >
            <div
              className={`mb-3 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] ${
                isLight
                  ? "border-pink-200 bg-pink-50 text-pink-700"
                  : "border-pink-500/20 bg-pink-500/10 text-pink-300"
              }`}
            >
              Curriculum
            </div>
            <h2 className={`text-3xl font-bold sm:text-4xl ${strongText}`}>Explore the curriculum</h2>
            <p className={`mt-3 text-base sm:text-lg ${mutedText}`}>
              Visitors can inspect the structure, preview the first lesson, and sign in for the full experience.
            </p>
          </motion.div>

          <div className="space-y-4">
            {track.topics.map((topic: TrackTopic, index: number) => {
              const isExpanded = expandedTopics.has(topic.id);
              const isFirstTopic = index === 0;

              return (
                <motion.div
                  key={topic.id}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.04 }}
                  className={`overflow-hidden rounded-[24px]  transition ${
                    isLight
                      ? "border-gray-200 bg-white shadow-[0_8px_24px_rgba(15,23,42,0.04)]"
                      : "border-white/10 bg-[#09090c] hover:border-white/20"
                  }`}
                >
                  <button
                    onClick={() => handleTopicClick(topic.id)}
                    className="flex w-full items-start justify-between gap-4 p-5 text-left sm:p-6"
                  >
                    <div className="flex min-w-0 items-start gap-4">
                      <div
                        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-r ${colorTheme.accentBg} text-sm font-bold text-white shadow-lg`}
                      >
                        {index + 1}
                      </div>

                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className={`text-lg font-semibold ${strongText}`}>{topic.title}</h3>
                          {isFirstTopic ? (
                            <span className="rounded-full bg-emerald-500/10 px-2.5 py-1 text-[11px] font-semibold text-emerald-400">
                              FREE PREVIEW
                            </span>
                          ) : null}
                        </div>

                        <p className={`mt-2 text-sm leading-7 ${mutedText}`}>{topic.description}</p>

                        <div className="mt-3 flex flex-wrap items-center gap-3 text-sm">
                          <span
                            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 ${
                              isLight ? "bg-gray-100 text-gray-700" : "bg-white/5 text-gray-300"
                            }`}
                          >
                            <Clock className="h-3.5 w-3.5" />
                            {topic.duration}
                          </span>

                          <span
                            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 ${
                              isLight ? "bg-gray-100 text-gray-700" : "bg-white/5 text-gray-300"
                            }`}
                          >
                            <BookOpen className="h-3.5 w-3.5" />
                            {topic.subtopics.length} lessons
                          </span>
                        </div>
                      </div>
                    </div>

                    <ChevronRight
                      className={`mt-1 h-5 w-5 shrink-0 transition-transform ${
                        isExpanded ? "rotate-90" : ""
                      } ${isLight ? "text-gray-400" : "text-gray-500"}`}
                    />
                  </button>

                  <AnimatePresence initial={false}>
                    {isExpanded ? (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className={`overflow-hidden border-t ${
                          isLight ? "border-gray-100" : "border-white/5"
                        }`}
                      >
                        <div className="space-y-2 p-5 sm:p-6">
                          {topic.subtopics.map((subtopic, subIndex) => {
                            const isSampleLesson = isFirstTopic && subtopic.id === sampleLessonId;

                            return (
                              <div
                                key={subtopic.id}
                                className={`flex items-center justify-between gap-3 rounded-2xl  p-3 sm:p-4 ${
                                  isSampleLesson
                                    ? isLight
                                      ? "border-emerald-200 bg-emerald-50"
                                      : "border-emerald-500/20 bg-emerald-500/10"
                                    : isLight
                                    ? "border-gray-200 bg-gray-50"
                                    : "border-white/10 bg-white/[0.03]"
                                }`}
                              >
                                <div className="flex min-w-0 items-center gap-3">
                                  <div
                                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl ${
                                      isSampleLesson
                                        ? "bg-emerald-500 text-white"
                                        : isLight
                                        ? "bg-white text-gray-500"
                                        : "bg-white/5 text-gray-400"
                                    }`}
                                  >
                                    {isSampleLesson ? (
                                      <PlayCircle className="h-4 w-4" />
                                    ) : (
                                      <span className="text-xs font-semibold">{subIndex + 1}</span>
                                    )}
                                  </div>

                                  <div className="min-w-0">
                                    <p className={`truncate text-sm font-medium ${strongText}`}>
                                      {subtopic.title}
                                    </p>
                                    <p className={`text-xs ${mutedText}`}>
                                      {isSampleLesson
                                        ? "Available as a free preview"
                                        : "Unlock after sign in"}
                                    </p>
                                  </div>
                                </div>

                                {isSampleLesson ? (
                                  <button
                                    onClick={() => handleTrySample(topic.id, subtopic.id)}
                                    className="shrink-0 rounded-xl bg-emerald-500 px-3 py-2 text-xs font-semibold text-white transition hover:bg-emerald-600"
                                  >
                                    Try Free
                                  </button>
                                ) : (
                                  <div className="shrink-0 rounded-xl bg-white/5 p-2">
                                    <Lock className="h-4 w-4 text-gray-500" />
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </motion.div>
                    ) : null}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* <section className={`border-y ${isLight ? "border-gray-200 bg-white" : "border-white/10 bg-[#07080c]"}`}>
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-6 text-center sm:grid-cols-4">
            {[
              { icon: <Code2 className="h-5 w-5" />, label: "Interactive lessons" },
              { icon: <Database className="h-5 w-5" />, label: "Real-world context" },
              { icon: <Brain className="h-5 w-5" />, label: "Clear explanations" },
              { icon: <GraduationCap className="h-5 w-5" />, label: "Structured growth" },
            ].map((feature) => (
              <div key={feature.label} className="flex flex-col items-center gap-2">
                <div className={colorTheme.accentText}>{feature.icon}</div>
                <span className={`text-sm font-medium ${strongText}`}>{feature.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section> */}

      <section className={`px-4 py-16 sm:px-6 lg:px-8 ${isLight ? "bg-[#f8fafc]" : "bg-[#020203]"}`}>
        <div
          className={`mx-auto max-w-4xl overflow-hidden rounded-[28px] border p-6 text-center sm:p-8 ${
            isLight
              ? "border-gray-200 bg-[linear-gradient(135deg,#ffffff,#fdf2f8)] shadow-[0_12px_40px_rgba(15,23,42,0.06)]"
              : "border-white/10 bg-[linear-gradient(135deg,rgba(17,24,39,0.96),rgba(88,28,135,0.18))]"
          }`}
        >
          <div className="mx-auto max-w-2xl">
            <div
              className={`mb-3 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] ${
                isLight
                  ? "border-pink-200 bg-pink-50 text-pink-700"
                  : "border-pink-500/20 bg-pink-500/10 text-pink-300"
              }`}
            >
              Ready to start?
            </div>

            <h2 className={`text-3xl font-bold sm:text-4xl ${strongText}`}>
              Start learning {track.title.toLowerCase()}
            </h2>

            <p className={`mt-3 text-base leading-7 ${mutedText}`}>
              Visitors get the polished public preview. Signed-in users continue inside the real
              learning dashboard. That separation stays intact here.
            </p>

            <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
              <button
                onClick={handleStartTrack}
                className={`inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r ${brandGradient} px-6 py-4 text-sm font-semibold text-white transition hover:scale-[1.01]`}
              >
                Start Learning Free
                <PlayCircle className="h-5 w-5" />
              </button>

              {sampleLessonId ? (
                <button
                  onClick={() => handleTrySample(track.topics[0].id, sampleLessonId)}
                  className={`inline-flex items-center justify-center gap-2 rounded-2xl border px-6 py-4 text-sm font-semibold transition ${
                    isLight
                      ? "border-gray-200 bg-white text-gray-900 hover:bg-gray-50"
                      : "border-white/10 bg-white/5 text-white hover:bg-white/10"
                  }`}
                >
                  Preview Lesson
                </button>
              ) : null}
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}

function HeroMetric({
  icon: Icon,
  title,
  subtitle,
  isLight,
  colorTheme,
}: {
  icon: any;
  title: string;
  subtitle: string;
  isLight: boolean;
  colorTheme: { softBg: string; softBorder: string; softText: string };
}) {
  return (
    <div
      className={`flex items-center gap-3 rounded-2xl border px-4 py-3 ${
        isLight
          ? "border-gray-200 bg-white shadow-sm"
          : "border-white/10 bg-white/5"
      }`}
    >
      <div
        className={`flex h-10 w-10 items-center justify-center rounded-xl border ${colorTheme.softBg} ${colorTheme.softBorder} ${colorTheme.softText}`}
      >
        <Icon className="h-4 w-4" />
      </div>
      <div>
        <p className={`text-base font-semibold ${isLight ? "text-gray-900" : "text-white"}`}>
          {title}
        </p>
        <p className={`text-xs ${isLight ? "text-gray-500" : "text-gray-500"}`}>{subtitle}</p>
      </div>
    </div>
  );
}

function FeatureMiniCard({
  icon: Icon,
  title,
  text,
  isLight,
}: {
  icon: any;
  title: string;
  text: string;
  isLight: boolean;
}) {
  return (
    <div
      className={`rounded-2xl border p-4 ${
        isLight
          ? "border-gray-200 bg-gray-50"
          : "border-white/10 bg-white/[0.03]"
      }`}
    >
      <div
        className={`mb-3 inline-flex rounded-xl p-2 ${
          isLight ? "bg-white text-pink-600" : "bg-pink-500/10 text-pink-300"
        }`}
      >
        <Icon className="h-4 w-4" />
      </div>
      <h3 className={`text-sm font-semibold ${isLight ? "text-gray-900" : "text-white"}`}>
        {title}
      </h3>
      <p className={`mt-1 text-xs leading-6 ${isLight ? "text-gray-600" : "text-gray-400"}`}>
        {text}
      </p>
    </div>
  );
}
