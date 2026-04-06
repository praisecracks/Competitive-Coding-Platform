import Link from "next/link";
import { ArrowRight, Clock3, Layers3, Sparkles } from "lucide-react";

const previewChallenges = [
  {
    id: 1,
    title: "Reverse String",
    difficulty: "Easy",
    category: "Strings",
    description:
      "Reverse the given string without using built-in reverse methods.",
    duration: "5 mins",
    status: "Starter Mission",
  },
  {
    id: 2,
    title: "Two Sum",
    difficulty: "Easy",
    category: "Arrays",
    description:
      "Find two numbers in an array that add up to a target value.",
    duration: "8 mins",
    status: "Popular Mission",
  },
  {
    id: 3,
    title: "Valid Parentheses",
    difficulty: "Medium",
    category: "Stacks",
    description:
      "Check whether the brackets in a string are properly matched.",
    duration: "10 mins",
    status: "Core Mission",
  },
];

const getDifficultyStyles = (difficulty: string) => {
  switch (difficulty) {
    case "Easy":
      return "border border-emerald-500/20 bg-emerald-500/10 text-emerald-300";
    case "Medium":
      return "border border-amber-500/20 bg-amber-500/10 text-amber-300";
    case "Hard":
      return "border border-red-500/20 bg-red-500/10 text-red-300";
    default:
      return "border border-white/10 bg-white/5 text-gray-200";
  }
};

const getStatusStyles = (status: string) => {
  switch (status) {
    case "Starter Mission":
      return "border border-cyan-500/20 bg-cyan-500/10 text-cyan-300";
    case "Popular Mission":
      return "border border-pink-500/20 bg-pink-500/10 text-pink-300";
    case "Core Mission":
      return "border border-purple-500/20 bg-purple-500/10 text-purple-300";
    default:
      return "border border-white/10 bg-white/5 text-gray-300";
  }
};

export default function ChallengesPreview() {
  return (
    <section
      id="challenges"
      className="relative overflow-hidden bg-[#020202] py-20 text-gray-100 sm:py-24"
    >
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute left-[7%] top-10 h-64 w-64 rounded-full bg-pink-500/10 blur-[120px]" />
        <div className="absolute right-[10%] top-16 h-72 w-72 rounded-full bg-purple-500/10 blur-[130px]" />
        <div className="absolute bottom-0 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-fuchsia-500/10 blur-[120px]" />
        <div className="absolute inset-0 opacity-[0.04] [background-image:linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:72px_72px]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.06),transparent_35%)]" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-14 max-w-3xl text-center">
          <div className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-[10px] font-medium uppercase tracking-[0.28em] text-pink-300 backdrop-blur-xl">
            Mission Preview
          </div>

          <h2 className="mt-5 text-4xl font-black tracking-[-0.04em] text-white sm:text-5xl md:text-6xl">
            Explore missions
            <span className="block bg-gradient-to-r from-white via-pink-200 to-purple-300 bg-clip-text text-transparent">
              before you enter the system
            </span>
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-gray-400 sm:text-base">
            Preview the kind of coding missions waiting inside CODEMASTER.
            Understand the challenge style, difficulty, and training flow before
            you begin.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {previewChallenges.map((challenge) => (
            <div
              key={challenge.id}
              className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.045),rgba(255,255,255,0.02))] p-6 shadow-[0_20px_60px_rgba(0,0,0,0.45)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1.5 hover:border-pink-500/25 hover:shadow-[0_30px_80px_rgba(168,85,247,0.12)] sm:p-7"
            >
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-pink-500/60 to-transparent opacity-70" />
              <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 bg-[radial-gradient(circle_at_top_right,rgba(236,72,153,0.08),transparent_30%)]" />

              <div className="relative z-10 flex items-start justify-between gap-4">
                <div>
                  <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-gray-300">
                    <Sparkles className="h-3.5 w-3.5 text-pink-300" />
                    Mission #{challenge.id}
                  </div>

                  <h3 className="text-2xl font-bold tracking-tight text-white transition-colors duration-300 group-hover:text-pink-300">
                    {challenge.title}
                  </h3>
                </div>

                <div className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-white">
                  <Layers3 className="h-5 w-5" />
                </div>
              </div>

              <div className="relative z-10 mt-5 flex flex-wrap items-center gap-2.5">
                <span
                  className={`rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] ${getDifficultyStyles(
                    challenge.difficulty
                  )}`}
                >
                  {challenge.difficulty}
                </span>

                <span
                  className={`rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] ${getStatusStyles(
                    challenge.status
                  )}`}
                >
                  {challenge.status}
                </span>
              </div>

              <div className="relative z-10 mt-5 flex items-center gap-3 text-[11px] uppercase tracking-[0.16em] text-gray-400">
                <span className="inline-flex items-center gap-2 rounded-full border border-purple-500/20 bg-purple-500/10 px-3 py-1.5 text-purple-300">
                  <Layers3 className="h-3.5 w-3.5" />
                  {challenge.category}
                </span>

                <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-gray-300">
                  <Clock3 className="h-3.5 w-3.5" />
                  {challenge.duration}
                </span>
              </div>

              <p className="relative z-10 mt-6 text-sm leading-7 text-gray-400">
                {challenge.description}
              </p>

              <div className="relative z-10 mt-6 border-t border-white/10 pt-5">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.18em] text-gray-500">
                    <span className="h-1.5 w-1.5 rounded-full bg-pink-400" />
                    <span>Preview only</span>
                  </div>

                  <Link
                    href="/login"
                    className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-2.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-white transition-all duration-300 hover:border-pink-500/30 hover:bg-white hover:text-black"
                  >
                    Start Mission
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-14 rounded-3xl border border-white/10 bg-white/[0.03] px-6 py-5 backdrop-blur-xl">
          <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
            <div>
              <p className="text-sm font-medium text-white">
                Missions built for real coding growth
              </p>
              <p className="mt-1 text-sm text-gray-400">
                Train with structured challenges, clear difficulty levels, and
                mission flows designed to make improvement feel measurable.
              </p>
            </div>

            <Link
              href="/challenges"
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-pink-500 to-purple-600 px-6 py-3 text-sm font-semibold text-white shadow-[0_0_24px_rgba(236,72,153,0.22)] transition-all duration-300 hover:scale-[1.01] hover:shadow-[0_0_36px_rgba(168,85,247,0.28)]"
            >
              Browse All Missions
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}