"use client";

type WorkspaceTab = "problem" | "examples" | "constraints";

type ChallengeHeaderProps = {
  challenge: {
    id: number;
    title: string;
    difficulty: string;
    category: string;
    duration: number;
  };
  mode: string;
  lastScore: number | null;
  lines: number;
  chars: number;
  timerLabel: string;
  sessionState: string;
  workspaceTab: WorkspaceTab;
  onTabChange: (tab: WorkspaceTab) => void;
  onBack: () => void;
};

const tabs: WorkspaceTab[] = ["problem", "examples", "constraints"];

function formatTabLabel(tab: WorkspaceTab) {
  if (tab === "problem") return "Problem";
  if (tab === "examples") return "Examples";
  return "Constraints";
}

export default function ChallengeHeader({
  challenge,
  mode,
  lastScore,
  lines,
  chars,
  timerLabel,
  sessionState,
  workspaceTab,
  onTabChange,
  onBack,
}: ChallengeHeaderProps) {
  const difficultyClasses = (() => {
    const value = challenge.difficulty?.toLowerCase() || "";

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
  })();

  const sessionClasses = (() => {
    const value = sessionState.toLowerCase();

    if (value.includes("running")) {
      return "border-yellow-500/20 bg-yellow-500/10 text-yellow-200";
    }

    if (value.includes("submitting")) {
      return "border-purple-500/20 bg-purple-500/10 text-purple-200";
    }

    if (value.includes("completed")) {
      return "border-emerald-500/20 bg-emerald-500/10 text-emerald-300";
    }

    if (value.includes("timeout")) {
      return "border-red-500/20 bg-red-500/10 text-red-200";
    }

    if (value.includes("submitted")) {
      return "border-orange-500/20 bg-orange-500/10 text-orange-200";
    }

    return "border-cyan-500/20 bg-cyan-500/10 text-cyan-200";
  })();

  const timerClasses = (() => {
    const [minutes = "0", seconds = "0"] = timerLabel.split(":");
    const totalSeconds =
      Number.parseInt(minutes, 10) * 60 + Number.parseInt(seconds, 10);

    if (totalSeconds <= 60) {
      return "border-red-500/20 bg-red-500/10 text-red-200";
    }

    if (totalSeconds <= 300) {
      return "border-yellow-500/20 bg-yellow-500/10 text-yellow-200";
    }

    return "border-cyan-500/20 bg-cyan-500/10 text-cyan-200";
  })();

  return (
    <div className="mb-4 overflow-hidden rounded-[28px] border border-white/10 bg-[#0a0a0a] shadow-[0_0_0_1px_rgba(255,255,255,0.02)]">
      <div className="border-b border-white/10 bg-[radial-gradient(circle_at_top_right,rgba(236,72,153,0.08),transparent_24%),radial-gradient(circle_at_bottom_left,rgba(34,211,238,0.06),transparent_22%)] px-4 py-3 sm:px-5 sm:py-3 lg:px-6">
        <div className="flex flex-col gap-3 xl:gap-4 2xl:flex-row 2xl:items-start 2xl:justify-between">
          <div className="min-w-0 flex-1">
            <button
              onClick={onBack}
              className="mb-2 inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-2.5 py-1.5 text-xs text-pink-300 transition hover:border-pink-500/20 hover:bg-pink-500/10 hover:text-pink-200"
              type="button"
            >
              <span aria-hidden="true">←</span>
              <span>Back</span>
            </button>

            <div className="flex flex-col gap-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full border border-pink-500/20 bg-pink-500/10 px-2.5 py-0.5 text-[10px] uppercase tracking-[0.16em] text-pink-200">
                  Mission Chamber
                </span>

                <span
                  className={`rounded-full border px-2.5 py-0.5 text-[10px] uppercase tracking-[0.16em] ${difficultyClasses}`}
                >
                  {challenge.difficulty}
                </span>
              </div>

              <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
                <div className="min-w-0">
                  <h1 className="break-words text-lg font-semibold leading-tight text-white sm:text-xl lg:text-2xl">
                    {challenge.title}
                  </h1>

                  <div className="mt-1.5 flex flex-wrap gap-1.5">
                    <span className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-0.5 text-[11px] text-gray-300">
                      {challenge.category}
                    </span>

                    <span className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-0.5 text-[11px] text-gray-300">
                      {challenge.duration} min
                    </span>

                    <span className="rounded-full border border-purple-500/20 bg-purple-500/10 px-2.5 py-0.5 text-[11px] text-purple-200">
                      {mode.toUpperCase()} MODE
                    </span>

                    <span
                      className={`rounded-full border px-2.5 py-0.5 text-[11px] ${sessionClasses}`}
                    >
                      {sessionState}
                    </span>
                  </div>
                </div>

                <div className="hidden xl:flex xl:justify-end">
                  <div className="rounded-xl border border-white/10 bg-white/[0.03] px-3 py-1.5 text-right">
                    <p className="text-[10px] uppercase tracking-[0.16em] text-gray-500">
                      Mission ID
                    </p>
                    <p className="mt-0.5 text-xs font-semibold text-white">
                      #{String(challenge.id).padStart(3, "0")}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 xl:grid-cols-5 2xl:min-w-[540px]">
            <div className="rounded-xl border border-white/10 bg-white/[0.03] px-2.5 py-2 text-left sm:px-3 sm:text-center">
              <p className="text-[9px] uppercase tracking-[0.16em] text-gray-500 sm:text-[10px]">
                Score
              </p>
              <p className="mt-0.5 text-sm font-semibold text-white sm:text-base">
                {lastScore !== null ? `${lastScore}%` : "—"}
              </p>
            </div>

            <div className="rounded-xl border border-white/10 bg-white/[0.03] px-2.5 py-2 text-left sm:px-3 sm:text-center">
              <p className="text-[9px] uppercase tracking-[0.16em] text-gray-500 sm:text-[10px]">
                Lines
              </p>
              <p className="mt-0.5 text-sm font-semibold text-white sm:text-base">
                {lines}
              </p>
            </div>

            <div className="rounded-xl border border-white/10 bg-white/[0.03] px-2.5 py-2 text-left sm:px-3 sm:text-center">
              <p className="text-[9px] uppercase tracking-[0.16em] text-gray-500 sm:text-[10px]">
                Chars
              </p>
              <p className="mt-0.5 text-sm font-semibold text-white sm:text-base">
                {chars}
              </p>
            </div>

            <div
              className={`rounded-xl border px-2.5 py-2 text-left sm:px-3 sm:text-center ${timerClasses}`}
            >
              <p className="text-[9px] uppercase tracking-[0.16em] text-inherit/80 sm:text-[10px]">
                Timer
              </p>
              <p className="mt-0.5 text-sm font-semibold sm:text-base">
                {timerLabel}
              </p>
            </div>

            <div className="rounded-xl border border-white/10 bg-white/[0.03] px-2.5 py-2 text-left sm:px-3 sm:text-center xl:block">
              <p className="text-[9px] uppercase tracking-[0.16em] text-gray-500 sm:text-[10px]">
                ID
              </p>
              <p className="mt-0.5 text-sm font-semibold text-white sm:text-base">
                #{String(challenge.id).padStart(3, "0")}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-white/5 bg-[#09090c]/80 px-3 py-2 sm:px-5 lg:px-6">
        <div className="scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/10 flex gap-2 overflow-x-auto pb-0.5">
          {tabs.map((tab) => {
            const active = workspaceTab === tab;

            return (
              <button
                key={tab}
                onClick={() => onTabChange(tab)}
                className={`shrink-0 rounded-lg px-3 py-1.5 text-xs transition sm:px-3.5 ${
                  active
                    ? "border border-pink-500/20 bg-pink-500/10 text-pink-200 shadow-[0_0_0_1px_rgba(236,72,153,0.08)]"
                    : "border border-white/10 bg-white/[0.03] text-gray-300 hover:bg-white/[0.06]"
                }`}
                type="button"
              >
                {formatTabLabel(tab)}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}