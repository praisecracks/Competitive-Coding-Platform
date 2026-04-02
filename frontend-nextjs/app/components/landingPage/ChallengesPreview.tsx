import Link from "next/link";

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
      return "border border-yellow-500/20 bg-yellow-500/10 text-yellow-300";
    case "Hard":
      return "border border-red-500/20 bg-red-500/10 text-red-300";
    default:
      return "border border-gray-100/10 bg-gray-100/5 text-gray-100";
  }
};

export default function ChallengesPreview() {
  return (
    <section
      id="challenges"
      className="relative overflow-hidden py-20 text-gray-100 sm:py-24"
    >
      {/* background atmosphere */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute left-[8%] top-10 h-64 w-64 rounded-full bg-pink-500/10 blur-[120px]" />
        <div className="absolute right-[10%] top-20 h-72 w-72 rounded-full bg-purple-500/10 blur-[130px]" />
        <div className="absolute inset-0 opacity-[0.04] [background-image:linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:72px_72px]" />
      </div>

      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* section header */}
        <div className="mx-auto mb-14 max-w-3xl text-center">
          <p className="mb-4 text-[10px] font-mono uppercase tracking-[0.35em] text-pink-400">
            Mission Preview
          </p>

          <h2 className="text-3xl font-black uppercase tracking-tight text-gray-300 sm:text-4xl lg:text-5xl">
            Explore Missions
            <span className="block bg-gradient-to-r sm:text-lg from-pink-500 via-fuchsia-400 to-purple-500 bg-clip-text text-transparent">
              before you enter the system
            </span>
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-xs leading-7 text-gray-400 xs:text-base">
            Preview the kind of coding missions waiting inside CODEMASTER.
            Understand the challenge, difficulty, and training style before you
            begin.
          </p>
        </div>
        {/* cards */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {previewChallenges.map((challenge) => (
            <div
              key={challenge.id}
              className="group relative overflow-hidden rounded-[28px] border border-gray-100/10 bg-[#08080c]/90 p-6 shadow-[0_18px_50px_rgba(8, 8, 12, 1)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-pink-500/25 hover:bg-[#0b0b10]"
            >
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-pink-500/60 to-transparent opacity-70" />

              <div className="mb-5 flex items-start justify-between gap-3">
                <div>
                  <p className="mb-2 text-[10px] font-mono uppercase tracking-[0.26em] text-gray-500">
                    Mission #{challenge.id}
                  </p>

                  <h3 className="text-xl font-bold tracking-tight text-gray-100 transition-colors duration-300 group-hover:text-pink-400">
                    {challenge.title}
                  </h3>

                  <p className="mt-2 text-[10px] uppercase tracking-[0.22em] text-purple-300">
                    {challenge.status}
                  </p>
                </div>

                <span
                  className={`rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] ${getDifficultyStyles(
                    challenge.difficulty
                  )}`}
                >
                  {challenge.difficulty}
                </span>
              </div>

              <div className="mb-5 flex flex-wrap items-center gap-3 text-[11px] uppercase tracking-[0.16em] text-gray-500">
                <span className="rounded-full border border-purple-500/20 bg-purple-500/10 px-3 py-1 text-purple-300">
                  {challenge.category}
                </span>

                <span className="rounded-full border border-gray-100/10 bg-gray-100/5 px-3 py-1 text-gray-300">
                  {challenge.duration}
                </span>
              </div>

              <p className="mb-6 text-sm leading-7 text-gray-400">
                {challenge.description}
              </p>

              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.18em] text-gray-500">
                  <span className="h-1.5 w-1.5 rounded-full bg-pink-400" />
                  <span>Preview only</span>
                </div>

                <Link
                  href="/login"
                  className="inline-flex items-center justify-center rounded-xl border border-gray-100/10 bg-gray-100/5 px-4 py-2.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-gray-100 transition-all duration-300 hover:border-pink-500/30 hover:bg-pink-500 hover:text-gray-100"
                >
                  Start Mission
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* bottom CTA */}
        <div className="mt-14 text-center">
          <Link
            href="/challenges"
            className="inline-flex items-center justify-center rounded-2xl bg-purple-600  px-7 py-3.5 text-sm font-semibold uppercase tracking-[0.18em] text-gray-100 shadow-[0_0_25px_rgba(236,72,153,0.22)] transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_38px_rgba(168,85,247,0.28)]"
          >
            Browse All Missions
          </Link>
        </div>
      </div>
    </section>
  );
}