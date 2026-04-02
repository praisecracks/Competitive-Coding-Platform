"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

type Challenge = {
  id: number;
  title: string;
  description: string;
  difficulty: string;
  category: string;
  duration: number;
  tags: string[];
  examples?: {
    input: string;
    output: string;
    explanation?: string;
  }[];
  constraints?: string[];
  learning?: {
    concept?: string;
    objective?: string;
    steps?: string[];
    walkthrough?: string[];
    edgeCases?: string[];
    hints?: string[];
  };
};

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "/api";

type SectionKey =
  | "overview"
  | "examples"
  | "constraints"
  | "focus"
  | "learning"
  | "walkthrough"
  | "edge-cases"
  | "hints"
  | "execution";

export default function DashboardChallengeDetailsPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();

  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [activeSection, setActiveSection] = useState<SectionKey>("overview");
  const [readingProgress, setReadingProgress] = useState(0);
  const [copiedExampleIndex, setCopiedExampleIndex] = useState<number | null>(null);
  const [isModeModalOpen, setIsModeModalOpen] = useState(false);

  const challengeId = Number(params?.id);

  useEffect(() => {
    if (!challengeId || Number.isNaN(challengeId)) {
      setLoading(false);
      setErrorMessage("Invalid challenge ID.");
      return;
    }

    const fetchChallenge = async () => {
      setLoading(true);
      setErrorMessage("");

      try {
        const res = await fetch(`${API_BASE_URL}/challenges/${challengeId}`, {
          cache: "no-store",
        });

        if (!res.ok) {
          const errorText = await res.text().catch(() => "");
          console.error("Challenge details fetch failed:", res.status, errorText);
          setErrorMessage("Unable to load challenge details.");
          return;
        }

        const data = await res.json();

        setChallenge({
          id: data.id,
          title: data.title || "Untitled Challenge",
          description: data.description || "No challenge description available.",
          difficulty: data.difficulty || "Unknown",
          category: data.category || "General",
          duration: data.duration || 30,
          tags: Array.isArray(data.tags) ? data.tags : [],
          examples: Array.isArray(data.examples) ? data.examples : [],
          constraints: Array.isArray(data.constraints) ? data.constraints : [],
          learning: {
            concept: data.learning?.concept || "",
            objective: data.learning?.objective || "",
            steps: Array.isArray(data.learning?.steps) ? data.learning.steps : [],
            walkthrough: Array.isArray(data.learning?.walkthrough)
              ? data.learning.walkthrough
              : [],
            edgeCases: Array.isArray(data.learning?.edgeCases)
              ? data.learning.edgeCases
              : [],
            hints: Array.isArray(data.learning?.hints) ? data.learning.hints : [],
          },
        });
      } catch (error) {
        console.error("Challenge details fetch error:", error);
        setErrorMessage("Backend is offline or unreachable.");
      } finally {
        setLoading(false);
      }
    };

    fetchChallenge();
  }, [challengeId]);

  const examplesCount = challenge?.examples?.length ?? 0;
  const constraintsCount = challenge?.constraints?.length ?? 0;
  const focusAreasCount = challenge?.tags?.length ?? 0;
  const learningStepsCount = challenge?.learning?.steps?.length ?? 0;
  const walkthroughCount = challenge?.learning?.walkthrough?.length ?? 0;
  const edgeCasesCount = challenge?.learning?.edgeCases?.length ?? 0;
  const hintsCount = challenge?.learning?.hints?.length ?? 0;

  const sections: {
    key: SectionKey;
    label: string;
    visible: boolean;
    count?: number;
  }[] = [
    { key: "overview", label: "Overview", visible: true },
    { key: "examples", label: "Examples", visible: examplesCount > 0, count: examplesCount },
    {
      key: "constraints",
      label: "Constraints",
      visible: constraintsCount > 0,
      count: constraintsCount,
    },
    { key: "focus", label: "Focus Areas", visible: focusAreasCount > 0, count: focusAreasCount },
    {
      key: "learning",
      label: "Learning",
      visible:
        !!challenge?.learning?.concept ||
        !!challenge?.learning?.objective ||
        learningStepsCount > 0,
      count: learningStepsCount || undefined,
    },
    {
      key: "walkthrough",
      label: "Walkthrough",
      visible: walkthroughCount > 0,
      count: walkthroughCount,
    },
    {
      key: "edge-cases",
      label: "Edge Cases",
      visible: edgeCasesCount > 0,
      count: edgeCasesCount,
    },
    {
      key: "hints",
      label: "Hints",
      visible: hintsCount > 0,
      count: hintsCount,
    },
    { key: "execution", label: "Execution Path", visible: true },
  ];

  const visibleSections = sections.filter((section) => section.visible);

  useEffect(() => {
    const ids = visibleSections.map((section) => section.key);

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (visible?.target?.id) {
          setActiveSection(visible.target.id as SectionKey);
        }
      },
      {
        rootMargin: "-20% 0px -55% 0px",
        threshold: [0.15, 0.3, 0.6],
      }
    );

    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [challenge, visibleSections]);

  useEffect(() => {
    const updateReadingProgress = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress =
        docHeight <= 0 ? 0 : Math.min(100, (scrollTop / docHeight) * 100);

      setReadingProgress(progress);
    };

    updateReadingProgress();
    window.addEventListener("scroll", updateReadingProgress);

    return () => window.removeEventListener("scroll", updateReadingProgress);
  }, []);

  useEffect(() => {
    if (copiedExampleIndex === null) return;

    const timer = window.setTimeout(() => {
      setCopiedExampleIndex(null);
    }, 1800);

    return () => window.clearTimeout(timer);
  }, [copiedExampleIndex]);

  const difficultyClasses = useMemo(() => {
    const value = challenge?.difficulty?.toLowerCase() || "";

    if (value === "easy") {
      return "border-emerald-500/20 bg-emerald-500/10 text-emerald-300";
    }

    if (value === "medium") {
      return "border-yellow-500/20 bg-yellow-500/10 text-yellow-300";
    }

    if (value === "hard") {
      return "border-red-500/20 bg-red-500/10 text-red-300";
    }

    return "border-white/10 bg-white/5 text-gray-300";
  }, [challenge?.difficulty]);

  const complexitySignal = useMemo(() => {
    const difficulty = challenge?.difficulty?.toLowerCase() || "";
    if (difficulty === "easy") return "Low complexity";
    if (difficulty === "medium") return "Moderate complexity";
    if (difficulty === "hard") return "High complexity";
    return "General complexity";
  }, [challenge?.difficulty]);

  const effortSignal = useMemo(() => {
    const duration = challenge?.duration ?? 0;
    if (duration <= 20) return "Quick solve";
    if (duration <= 45) return "Standard solve";
    return "Deep solve";
  }, [challenge?.duration]);

  const learningSummary = useMemo(() => {
    if (!challenge) return "";

    if (challenge.learning?.objective) return challenge.learning.objective;
    if (challenge.learning?.concept) return challenge.learning.concept;

    return "Understand the challenge clearly, inspect the examples, and prepare a correct implementation strategy before entering the coding workspace.";
  }, [challenge]);

  const scrollToSection = (key: SectionKey) => {
    const el = document.getElementById(key);
    if (!el) return;

    el.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const handleCopyExample = async (
    example: { input: string; output: string; explanation?: string },
    index: number
  ) => {
    const text = `Input:\n${example.input}\n\nOutput:\n${example.output}${
      example.explanation ? `\n\nExplanation:\n${example.explanation}` : ""
    }`;

    try {
      await navigator.clipboard.writeText(text);
      setCopiedExampleIndex(index);
    } catch (error) {
      console.error("Failed to copy example:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050507] px-4 py-6 text-white sm:px-6 sm:py-10">
        <div className="mx-auto max-w-7xl">
          <div className="rounded-[28px] border border-white/10 bg-[#0a0a0d] px-6 py-24 text-center shadow-[0_0_0_1px_rgba(255,255,255,0.02)] sm:px-8">
            <div className="mx-auto max-w-md">
              <div className="mx-auto h-10 w-10 animate-pulse rounded-2xl bg-gradient-to-br from-pink-500/20 to-purple-500/20" />
              <p className="mt-5 text-sm font-medium text-white">
                Loading challenge documentation
              </p>
              <p className="mt-2 text-sm leading-7 text-gray-500">
                Preparing the challenge brief, examples, and learning content.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (errorMessage || !challenge) {
    return (
      <div className="min-h-screen bg-[#050507] px-4 py-6 text-white sm:px-6 sm:py-10">
        <div className="mx-auto max-w-7xl space-y-5">
          <button
            onClick={() => router.push("/dashboard/challenges")}
            className="inline-flex items-center rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm text-white transition hover:bg-white/[0.06]"
            type="button"
          >
            ← Back to Challenges
          </button>

          <div className="rounded-[28px] border border-pink-500/15 bg-pink-500/[0.04] px-6 py-16 text-center sm:px-8">
            <p className="text-sm font-medium text-pink-200">
              Unable to load challenge details
            </p>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-gray-300">
              {errorMessage || "This challenge could not be found."}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050507] text-white">
      <div className="fixed left-0 right-0 top-0 z-50 h-[2px] bg-white/5">
        <div
          className="h-full bg-gradient-to-r from-pink-500 via-purple-500 to-pink-400 transition-all duration-150"
          style={{ width: `${readingProgress}%` }}
        />
      </div>

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8">
        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <button
              onClick={() => router.push("/dashboard/challenges")}
              className="inline-flex items-center rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm text-white transition hover:bg-white/[0.06]"
              type="button"
            >
              ← Back to Challenges
            </button>

            <div className="text-xs uppercase tracking-[0.18em] text-gray-500">
              Challenge Documentation
            </div>
          </div>

          <section className="overflow-hidden rounded-[30px] border border-white/10 bg-[#0a0a0d] shadow-[0_0_0_1px_rgba(255,255,255,0.02)]">
            <div className="border-b border-white/10 px-5 py-6 sm:px-7 sm:py-7">
              <div className="flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
                <div className="max-w-3xl">
                  <div className="flex flex-wrap gap-2">
                    <span
                      className={`rounded-full border px-3 py-1 text-xs ${difficultyClasses}`}
                    >
                      {challenge.difficulty}
                    </span>

                    <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-gray-300">
                      {challenge.category}
                    </span>

                    <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-gray-300">
                      {challenge.duration} min
                    </span>

                    <span className="rounded-full border border-pink-500/20 bg-pink-500/10 px-3 py-1 text-xs text-pink-200">
                      Challenge #{String(challenge.id).padStart(3, "0")}
                    </span>
                  </div>

                  <h1 className="mt-4 text-3xl font-semibold leading-tight text-white sm:text-4xl">
                    {challenge.title}
                  </h1>

                  <p className="mt-4 max-w-2xl text-sm leading-8 text-gray-300 sm:text-base">
                    {learningSummary}
                  </p>

                  <div className="mt-5 flex flex-wrap gap-2">
                    <span className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs text-gray-300">
                      {complexitySignal}
                    </span>
                    <span className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs text-gray-300">
                      {effortSignal}
                    </span>
                    <span className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs text-gray-300">
                      {visibleSections.length} sections
                    </span>
                    {challenge.learning?.concept && (
                      <span className="rounded-full border border-purple-500/20 bg-purple-500/10 px-3 py-1.5 text-xs text-purple-200">
                        {challenge.learning.concept}
                      </span>
                    )}
                  </div>
                </div>

                <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                  <p className="text-xs uppercase tracking-[0.16em] text-gray-500">
                    Action
                  </p>

                  <p className="mt-3 text-sm leading-7 text-gray-300">
                    Study the exact learning flow for this challenge, then move into the workspace when you are ready to implement your solution.
                  </p>

                  <div className="mt-5 flex flex-col gap-3">
                    <button
                      onClick={() => setIsModeModalOpen(true)}
                      className="w-full rounded-2xl bg-gradient-to-r from-pink-500 to-purple-500 px-5 py-3.5 text-sm font-medium text-white transition hover:opacity-95"
                      type="button"
                    >
                      Start Challenge
                    </button>

                    <button
                      onClick={() => router.push("/dashboard/challenges")}
                      className="w-full rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-3.5 text-sm text-white transition hover:bg-white/[0.06]"
                      type="button"
                    >
                      Return to Catalog
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 px-5 py-4 sm:grid-cols-4 sm:px-7">
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4">
                <p className="text-[11px] uppercase tracking-[0.16em] text-gray-500">
                  Focus Areas
                </p>
                <p className="mt-2 text-2xl font-semibold text-white">
                  {focusAreasCount}
                </p>
                <p className="mt-1 text-sm text-gray-400">
                  Concepts involved in this challenge
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4">
                <p className="text-[11px] uppercase tracking-[0.16em] text-gray-500">
                  Examples
                </p>
                <p className="mt-2 text-2xl font-semibold text-white">
                  {examplesCount}
                </p>
                <p className="mt-1 text-sm text-gray-400">
                  Sample cases to study before coding
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4">
                <p className="text-[11px] uppercase tracking-[0.16em] text-gray-500">
                  Constraints
                </p>
                <p className="mt-2 text-2xl font-semibold text-white">
                  {constraintsCount}
                </p>
                <p className="mt-1 text-sm text-gray-400">
                  Limits that influence your solution
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4">
                <p className="text-[11px] uppercase tracking-[0.16em] text-gray-500">
                  Learning Steps
                </p>
                <p className="mt-2 text-2xl font-semibold text-white">
                  {learningStepsCount}
                </p>
                <p className="mt-1 text-sm text-gray-400">
                  Guided steps tied to this mission
                </p>
              </div>
            </div>
          </section>

          <div className="xl:hidden">
            <div className="overflow-x-auto rounded-[24px] border border-white/10 bg-[#0a0a0d] p-2">
              <div className="flex min-w-max gap-2">
                {visibleSections.map((section) => {
                  const active = activeSection === section.key;

                  return (
                    <button
                      key={section.key}
                      onClick={() => scrollToSection(section.key)}
                      className={`rounded-xl px-3 py-2 text-sm whitespace-nowrap transition ${
                        active
                          ? "bg-pink-500/10 text-pink-200"
                          : "text-gray-400 hover:bg-white/[0.04] hover:text-white"
                      }`}
                      type="button"
                    >
                      {section.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 xl:grid-cols-[250px_minmax(0,1fr)]">
            <aside className="hidden xl:block xl:sticky xl:top-6 xl:self-start">
              <div className="rounded-[24px] border border-white/10 bg-[#0a0a0d] p-4 shadow-[0_0_0_1px_rgba(255,255,255,0.02)]">
                <p className="text-xs uppercase tracking-[0.18em] text-pink-300">
                  On this page
                </p>

                <div className="mt-4 space-y-1.5">
                  {visibleSections.map((section) => {
                    const active = activeSection === section.key;

                    return (
                      <button
                        key={section.key}
                        onClick={() => scrollToSection(section.key)}
                        className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-sm transition ${
                          active
                            ? "border border-pink-500/20 bg-pink-500/10 text-pink-200"
                            : "border border-transparent text-gray-400 hover:bg-white/[0.04] hover:text-white"
                        }`}
                        type="button"
                      >
                        <span>{section.label}</span>
                        {typeof section.count === "number" ? (
                          <span
                            className={`rounded-full px-2 py-0.5 text-[10px] ${
                              active
                                ? "bg-pink-500/10 text-pink-200"
                                : "bg-white/[0.04] text-gray-500"
                            }`}
                          >
                            {section.count}
                          </span>
                        ) : active ? (
                          <span className="text-xs">•</span>
                        ) : null}
                      </button>
                    );
                  })}
                </div>
              </div>
            </aside>

            <main className="min-w-0 space-y-6">
              <section
                id="overview"
                className="scroll-mt-24 rounded-[26px] border border-white/10 bg-[#0a0a0d] p-6 shadow-[0_0_0_1px_rgba(255,255,255,0.02)] sm:p-7"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.18em] text-pink-300">
                      Overview
                    </p>
                    <h2 className="mt-2 text-2xl font-semibold text-white">
                      Problem statement
                    </h2>
                  </div>

                  <button
                    onClick={() => scrollToSection("overview")}
                    className="hidden rounded-lg border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs text-gray-400 transition hover:bg-white/[0.06] hover:text-white sm:block"
                    type="button"
                  >
                    #overview
                  </button>
                </div>

                <p className="mt-5 text-sm leading-8 text-gray-300 sm:text-[15px]">
                  {challenge.description}
                </p>
              </section>

              {challenge.examples && challenge.examples.length > 0 && (
                <section
                  id="examples"
                  className="scroll-mt-24 rounded-[26px] border border-white/10 bg-[#0a0a0d] p-6 shadow-[0_0_0_1px_rgba(255,255,255,0.02)] sm:p-7"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs uppercase tracking-[0.18em] text-pink-300">
                        Examples
                      </p>
                      <h2 className="mt-2 text-2xl font-semibold text-white">
                        Worked sample cases
                      </h2>
                    </div>

                    <button
                      onClick={() => scrollToSection("examples")}
                      className="hidden rounded-lg border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs text-gray-400 transition hover:bg-white/[0.06] hover:text-white sm:block"
                      type="button"
                    >
                      #examples
                    </button>
                  </div>

                  <p className="mt-3 text-sm leading-7 text-gray-400">
                    Study how the inputs map to the outputs. These examples are the
                    fastest way to verify that you truly understand the task.
                  </p>

                  <div className="mt-6 space-y-4">
                    {challenge.examples.map((example, index) => (
                      <div
                        key={`${example.input}-${index}`}
                        className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03]"
                      >
                        <div className="flex items-center justify-between gap-3 border-b border-white/10 px-5 py-3">
                          <p className="text-sm font-medium text-white">
                            Example {index + 1}
                          </p>

                          <button
                            onClick={() => handleCopyExample(example, index)}
                            className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs text-gray-300 transition hover:bg-white/[0.06] hover:text-white"
                            type="button"
                          >
                            {copiedExampleIndex === index ? "Copied" : "Copy"}
                          </button>
                        </div>

                        <div className="space-y-4 px-5 py-5">
                          <div>
                            <p className="text-[11px] uppercase tracking-[0.15em] text-gray-500">
                              Input
                            </p>
                            <div className="mt-2 overflow-x-auto rounded-2xl border border-white/10 bg-[#07080b] px-4 py-3 font-mono text-sm text-gray-200">
                              {example.input}
                            </div>
                          </div>

                          <div>
                            <p className="text-[11px] uppercase tracking-[0.15em] text-gray-500">
                              Output
                            </p>
                            <div className="mt-2 overflow-x-auto rounded-2xl border border-white/10 bg-[#07080b] px-4 py-3 font-mono text-sm text-gray-200">
                              {example.output}
                            </div>
                          </div>

                          {example.explanation && (
                            <div>
                              <p className="text-[11px] uppercase tracking-[0.15em] text-gray-500">
                                Explanation
                              </p>
                              <p className="mt-2 text-sm leading-7 text-gray-300">
                                {example.explanation}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {challenge.constraints && challenge.constraints.length > 0 && (
                <section
                  id="constraints"
                  className="scroll-mt-24 rounded-[26px] border border-white/10 bg-[#0a0a0d] p-6 shadow-[0_0_0_1px_rgba(255,255,255,0.02)] sm:p-7"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs uppercase tracking-[0.18em] text-pink-300">
                        Constraints
                      </p>
                      <h2 className="mt-2 text-2xl font-semibold text-white">
                        Technical boundaries
                      </h2>
                    </div>

                    <button
                      onClick={() => scrollToSection("constraints")}
                      className="hidden rounded-lg border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs text-gray-400 transition hover:bg-white/[0.06] hover:text-white sm:block"
                      type="button"
                    >
                      #constraints
                    </button>
                  </div>

                  <p className="mt-3 text-sm leading-7 text-gray-400">
                    Constraints determine whether your approach is practical, efficient,
                    and robust enough for real evaluation.
                  </p>

                  <div className="mt-6 space-y-3">
                    {challenge.constraints.map((constraint, index) => (
                      <div
                        key={`${constraint}-${index}`}
                        className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4 text-sm text-gray-300"
                      >
                        {constraint}
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {challenge.tags?.length > 0 && (
                <section
                  id="focus"
                  className="scroll-mt-24 rounded-[26px] border border-white/10 bg-[#0a0a0d] p-6 shadow-[0_0_0_1px_rgba(255,255,255,0.02)] sm:p-7"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs uppercase tracking-[0.18em] text-pink-300">
                        Focus Areas
                      </p>
                      <h2 className="mt-2 text-2xl font-semibold text-white">
                        What you will practice
                      </h2>
                    </div>

                    <button
                      onClick={() => scrollToSection("focus")}
                      className="hidden rounded-lg border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs text-gray-400 transition hover:bg-white/[0.06] hover:text-white sm:block"
                      type="button"
                    >
                      #focus
                    </button>
                  </div>

                  <div className="mt-5 flex flex-wrap gap-2">
                    {challenge.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs text-gray-300"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </section>
              )}

              {(challenge.learning?.concept ||
                challenge.learning?.objective ||
                (challenge.learning?.steps?.length ?? 0) > 0) && (
                <section
                  id="learning"
                  className="scroll-mt-24 rounded-[26px] border border-purple-500/15 bg-[linear-gradient(180deg,rgba(168,85,247,0.10),rgba(168,85,247,0.04))] p-6 shadow-[0_0_0_1px_rgba(255,255,255,0.02)] sm:p-7"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs uppercase tracking-[0.18em] text-purple-200">
                        Learning
                      </p>
                      <h2 className="mt-2 text-2xl font-semibold text-white">
                        Understand the concept
                      </h2>
                    </div>

                    <button
                      onClick={() => scrollToSection("learning")}
                      className="hidden rounded-lg border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs text-gray-300 transition hover:bg-white/[0.06] hover:text-white sm:block"
                      type="button"
                    >
                      #learning
                    </button>
                  </div>

                  {challenge.learning?.concept && (
                    <p className="mt-4 text-sm font-medium text-purple-200">
                      {challenge.learning.concept}
                    </p>
                  )}

                  {challenge.learning?.objective && (
                    <p className="mt-3 text-sm leading-7 text-gray-300">
                      {challenge.learning.objective}
                    </p>
                  )}

                  {(challenge.learning?.steps?.length ?? 0) > 0 && (
                    <div className="mt-5 space-y-3">
                      {challenge.learning!.steps!.map((step, index) => (
                        <div
                          key={`${step}-${index}`}
                          className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-4"
                        >
                          <p className="text-sm font-medium text-pink-200">
                            Step {index + 1}
                          </p>
                          <p className="mt-2 text-sm leading-7 text-gray-300">
                            {step}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </section>
              )}

              {(challenge.learning?.walkthrough?.length ?? 0) > 0 && (
                <section
                  id="walkthrough"
                  className="scroll-mt-24 rounded-[26px] border border-white/10 bg-[#0a0a0d] p-6 shadow-[0_0_0_1px_rgba(255,255,255,0.02)] sm:p-7"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs uppercase tracking-[0.18em] text-pink-300">
                        Walkthrough
                      </p>
                      <h2 className="mt-2 text-2xl font-semibold text-white">
                        Step-by-step thinking
                      </h2>
                    </div>

                    <button
                      onClick={() => scrollToSection("walkthrough")}
                      className="hidden rounded-lg border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs text-gray-400 transition hover:bg-white/[0.06] hover:text-white sm:block"
                      type="button"
                    >
                      #walkthrough
                    </button>
                  </div>

                  <div className="mt-5 space-y-3">
                    {challenge.learning!.walkthrough!.map((step, index) => (
                      <div
                        key={`${step}-${index}`}
                        className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4"
                      >
                        <p className="text-sm font-medium text-white">
                          Walkthrough {index + 1}
                        </p>
                        <p className="mt-2 text-sm leading-7 text-gray-300">
                          {step}
                        </p>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {(challenge.learning?.edgeCases?.length ?? 0) > 0 && (
                <section
                  id="edge-cases"
                  className="scroll-mt-24 rounded-[26px] border border-yellow-500/20 bg-yellow-500/[0.05] p-6 shadow-[0_0_0_1px_rgba(255,255,255,0.02)] sm:p-7"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs uppercase tracking-[0.18em] text-yellow-300">
                        Edge Cases
                      </p>
                      <h2 className="mt-2 text-2xl font-semibold text-white">
                        Cases you should not ignore
                      </h2>
                    </div>

                    <button
                      onClick={() => scrollToSection("edge-cases")}
                      className="hidden rounded-lg border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs text-gray-300 transition hover:bg-white/[0.06] hover:text-white sm:block"
                      type="button"
                    >
                      #edge-cases
                    </button>
                  </div>

                  <div className="mt-5 space-y-3">
                    {challenge.learning!.edgeCases!.map((edgeCase, index) => (
                      <div
                        key={`${edgeCase}-${index}`}
                        className="rounded-2xl border border-white/10 bg-black/20 px-4 py-4 text-sm text-gray-200"
                      >
                        • {edgeCase}
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {(challenge.learning?.hints?.length ?? 0) > 0 && (
                <section
                  id="hints"
                  className="scroll-mt-24 rounded-[26px] border border-blue-500/20 bg-blue-500/[0.05] p-6 shadow-[0_0_0_1px_rgba(255,255,255,0.02)] sm:p-7"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs uppercase tracking-[0.18em] text-blue-300">
                        Hints
                      </p>
                      <h2 className="mt-2 text-2xl font-semibold text-white">
                        Helpful nudges before coding
                      </h2>
                    </div>

                    <button
                      onClick={() => scrollToSection("hints")}
                      className="hidden rounded-lg border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs text-gray-300 transition hover:bg-white/[0.06] hover:text-white sm:block"
                      type="button"
                    >
                      #hints
                    </button>
                  </div>

                  <div className="mt-5 space-y-3">
                    {challenge.learning!.hints!.map((hint, index) => (
                      <div
                        key={`${hint}-${index}`}
                        className="rounded-2xl border border-white/10 bg-black/20 px-4 py-4 text-sm text-gray-200"
                      >
                        💡 {hint}
                      </div>
                    ))}
                  </div>
                </section>
              )}

              <section
                id="execution"
                className="scroll-mt-24 rounded-[26px] border border-white/10 bg-[#0a0a0d] p-6 shadow-[0_0_0_1px_rgba(255,255,255,0.02)] sm:p-7"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.18em] text-pink-300">
                      Execution Path
                    </p>
                    <h2 className="mt-2 text-2xl font-semibold text-white">
                      Suggested workflow
                    </h2>
                  </div>

                  <button
                    onClick={() => scrollToSection("execution")}
                    className="hidden rounded-lg border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs text-gray-400 transition hover:bg-white/[0.06] hover:text-white sm:block"
                    type="button"
                  >
                    #execution
                  </button>
                </div>

                <div className="mt-5 space-y-4">
                  <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4">
                    <p className="text-sm font-medium text-white">
                      1. Understand the learning objective
                    </p>
                    <p className="mt-1 text-sm leading-7 text-gray-400">
                      Read the concept, steps, and examples until the task becomes clear.
                    </p>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4">
                    <p className="text-sm font-medium text-white">
                      2. Anticipate constraints and edge cases
                    </p>
                    <p className="mt-1 text-sm leading-7 text-gray-400">
                      Think about what can break your approach before writing code.
                    </p>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4">
                    <p className="text-sm font-medium text-white">
                      3. Enter the workspace and implement
                    </p>
                    <p className="mt-1 text-sm leading-7 text-gray-400">
                      Code, run, refine, and submit once your logic is stable.
                    </p>
                  </div>
                </div>

                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  <button
                    onClick={() =>
                      router.push(`/challenges/${challenge.id}?mode=solo`)
                    }
                    className="w-full rounded-2xl bg-gradient-to-r from-pink-500 to-purple-500 px-5 py-3.5 text-sm font-medium text-white transition hover:opacity-95"
                    type="button"
                  >
                    Continue to Challenge Workspace
                  </button>

                  <button
                    onClick={() => scrollToSection("overview")}
                    className="w-full rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-3.5 text-sm text-white transition hover:bg-white/[0.06]"
                    type="button"
                  >
                    Revisit Overview
                  </button>
                </div>
              </section>
            </main>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isModeModalOpen && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModeModalOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md rounded-[32px] border border-white/10 bg-[#0d0d0d] p-8 shadow-2xl text-center"
            >
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-pink-500/20 to-purple-500/20 text-3xl mb-6">
                🏆
              </div>
              <h2 className="text-2xl font-black tracking-tight text-white uppercase">Choose Your Path</h2>
              <p className="mt-2 text-sm text-gray-400 font-medium leading-relaxed">
                Will you conquer this challenge alone or duel with a rival?
              </p>
              
              <div className="mt-8 grid gap-4">
                <button
                  onClick={() => {
                    setIsModeModalOpen(false);
                    router.push(`/challenges/${challenge.id}?mode=solo`);
                  }}
                  className="group flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition hover:bg-white/[0.06] hover:border-white/20 text-left"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/[0.05] text-2xl group-hover:scale-110 transition-transform">
                    👤
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-white uppercase tracking-wider">Play Solo</h3>
                    <p className="text-[11px] text-gray-500 mt-0.5">Test your skills in a private workspace.</p>
                  </div>
                </button>

                <button
                  onClick={() => {
                    setIsModeModalOpen(false);
                    router.push(`/dashboard/duo/create?challengeId=${challenge.id}`);
                  }}
                  className="group flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition hover:bg-white/[0.06] hover:border-white/20 text-left border-pink-500/20 shadow-lg shadow-pink-500/5"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-pink-500/10 text-2xl group-hover:scale-110 transition-transform">
                    ⚔️
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-pink-400 uppercase tracking-wider">Play Duo</h3>
                    <p className="text-[11px] text-gray-500 mt-0.5">Duel against another player in real-time.</p>
                  </div>
                </button>
              </div>

              <button
                onClick={() => setIsModeModalOpen(false)}
                className="mt-6 text-[10px] font-black text-gray-500 hover:text-white uppercase tracking-[0.2em] transition-colors"
              >
                Close Selection
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}