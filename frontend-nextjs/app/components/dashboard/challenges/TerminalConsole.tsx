"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type TerminalEntry = {
  time: string;
  line: string;
};

type Props = {
  history: TerminalEntry[];
  isLocked?: boolean;
  lockMessage?: string;
};

type Tone = {
  prompt: string;
  promptClass: string;
  textClass: string;
};

const MIN_HEIGHT = 280;
const DEFAULT_HEIGHT = 420;
const MAX_HEIGHT = 760;
const MOBILE_HEIGHT = 320;

function getEntryTone(line: string): Tone {
  const value = line.toLowerCase();

  const isAcceptedCompletion =
    value.includes("challenge accepted") ||
    value.includes("submission accepted") ||
    value.includes("challenge completed: submission accepted");

  if (
    value.includes("failed") ||
    value.includes("error") ||
    value.includes("blocked") ||
    value.includes("exception") ||
    value.includes("timeout") ||
    value.includes("locked")
  ) {
    return {
      prompt: "!",
      promptClass: "text-red-400",
      textClass: "text-red-200",
    };
  }

  if (
    value.includes("submitting") ||
    value.includes("submission") ||
    value.includes("score awarded") ||
    value.includes("test result")
  ) {
    return {
      prompt: "→",
      promptClass: "text-purple-400",
      textClass: "text-purple-200",
    };
  }

  if (
    value.includes("starting") ||
    value.includes("running") ||
    value.includes("execution") ||
    value.includes("language switched") ||
    value.includes("run completed") ||
    value.includes("mission remains active")
  ) {
    return {
      prompt: "›",
      promptClass: "text-yellow-400",
      textClass: "text-yellow-200",
    };
  }

  if (
    isAcceptedCompletion ||
    value.includes("loaded") ||
    value.includes("ready") ||
    value.includes("initialized") ||
    value.includes("restored") ||
    value.includes("mission started")
  ) {
    return {
      prompt: "✓",
      promptClass: "text-emerald-400",
      textClass: "text-emerald-200",
    };
  }

  return {
    prompt: "$",
    promptClass: "text-cyan-400",
    textClass: "text-gray-200",
  };
}

export default function TerminalConsole({
  history,
  isLocked = false,
  lockMessage = "Terminal interaction is locked for this mission.",
}: Props) {
  const totalEntries = useMemo(() => history.length, [history]);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const terminalRef = useRef<HTMLDivElement | null>(null);

  const [height, setHeight] = useState(DEFAULT_HEIGHT);
  const [isResizing, setIsResizing] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const lastEntry = history.length > 0 ? history[history.length - 1] : null;

  const terminalState = useMemo(() => {
    const lastLine = lastEntry?.line?.toLowerCase() || "";

    if (
      isLocked ||
      lastLine.includes("timeout") ||
      lastLine.includes("editor locked")
    ) {
      return {
        label: "Locked",
        badgeClass: "border-red-500/20 bg-red-500/10 text-red-200",
      };
    }

    if (lastLine.includes("submitting")) {
      return {
        label: "Submitting",
        badgeClass: "border-purple-500/20 bg-purple-500/10 text-purple-200",
      };
    }

    if (
      lastLine.includes("challenge accepted") ||
      lastLine.includes("submission accepted") ||
      lastLine.includes("challenge completed: submission accepted")
    ) {
      return {
        label: "Accepted",
        badgeClass: "border-emerald-500/20 bg-emerald-500/10 text-emerald-300",
      };
    }

    if (
      lastLine.includes("challenge failed") ||
      lastLine.includes("submission failed") ||
      lastLine.includes("submission evaluated but challenge is not complete")
    ) {
      return {
        label: "Failed",
        badgeClass: "border-yellow-500/20 bg-yellow-500/10 text-yellow-200",
      };
    }

    if (
      lastLine.includes("starting") ||
      lastLine.includes("execution") ||
      lastLine.includes("run completed")
    ) {
      return {
        label: "Running",
        badgeClass: "border-yellow-500/20 bg-yellow-500/10 text-yellow-200",
      };
    }

    return {
      label: "Live",
      badgeClass: "border-cyan-500/20 bg-cyan-500/10 text-cyan-200",
    };
  }, [history, isLocked, lastEntry]);

  useEffect(() => {
    const updateViewport = () => {
      const desktop = window.innerWidth >= 1024;
      setIsDesktop(desktop);

      if (!desktop) {
        setHeight(MOBILE_HEIGHT);
        setIsResizing(false);
      } else if (height < MIN_HEIGHT || height > MAX_HEIGHT) {
        setHeight(DEFAULT_HEIGHT);
      }
    };

    updateViewport();
    window.addEventListener("resize", updateViewport);

    return () => window.removeEventListener("resize", updateViewport);
  }, [height]);

  useEffect(() => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [history, expanded]);

  useEffect(() => {
    if (!isResizing || !isDesktop || expanded) return;

    const handleMouseMove = (event: MouseEvent) => {
      if (!terminalRef.current) return;

      const rect = terminalRef.current.getBoundingClientRect();
      const nextHeight = rect.bottom - event.clientY;
      const clampedHeight = Math.max(MIN_HEIGHT, Math.min(MAX_HEIGHT, nextHeight));
      setHeight(clampedHeight);
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };

    document.body.style.cursor = "row-resize";
    document.body.style.userSelect = "none";

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };
  }, [isResizing, isDesktop, expanded]);

  const terminalContent = (
    <>
      <div className="border-b border-white/10 bg-[#0b0c10] px-3 pb-3 pt-3 sm:px-4 lg:px-5">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <p className="text-xs uppercase tracking-[0.18em] text-pink-300">
                Terminal
              </p>

              <span
                className={`rounded-full border px-2 py-0.5 text-[10px] uppercase tracking-[0.12em] ${terminalState.badgeClass}`}
              >
                {terminalState.label}
              </span>
            </div>

            <p className="mt-1 text-sm text-gray-500">
              Runtime output, execution logs, submission feedback, and mission events.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[10px] uppercase tracking-[0.12em] text-gray-400">
              {totalEntries} entr{totalEntries === 1 ? "y" : "ies"}
            </span>

            {!expanded && isDesktop && (
              <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[10px] uppercase tracking-[0.12em] text-gray-400">
                {height}px
              </span>
            )}

            <button
              type="button"
              onClick={() => setExpanded(true)}
              className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[10px] uppercase tracking-[0.12em] text-gray-300 transition hover:bg-white/[0.08]"
            >
              Expand
            </button>
          </div>
        </div>
      </div>

      <div
        className="border-b border-white/10 bg-[#08090d] px-3 py-2 sm:px-4 lg:px-5"
        onDoubleClick={() => setExpanded((prev) => !prev)}
      >
        <div className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
            <span className="h-2.5 w-2.5 rounded-full bg-yellow-400" />
            <span className="h-2.5 w-2.5 rounded-full bg-green-400" />
            <span className="ml-2 truncate font-mono text-[11px] text-gray-500">
              codemaster-terminal
            </span>
          </div>

          <div className="font-mono text-[11px] text-gray-600">bash</div>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="relative min-h-0 flex-1 overflow-y-auto bg-[#050507] px-3 py-4 font-mono text-[12px] sm:px-4 lg:px-5"
      >
        {isLocked && (
          <div className="pointer-events-none absolute inset-x-0 top-0 z-10 flex justify-center px-4 py-3">
            <div className="rounded-xl border border-red-500/20 bg-[#0b0b10]/85 px-4 py-2 text-center shadow-[0_10px_30px_rgba(0,0,0,0.28)] backdrop-blur-[2px]">
              <p className="text-xs font-medium text-red-200">{lockMessage}</p>
            </div>
          </div>
        )}

        {history.length === 0 ? (
          <div className="flex h-full items-center justify-center">
            <div className="w-full max-w-xl rounded-2xl border border-dashed border-white/10 bg-white/[0.02] px-4 py-8 text-center sm:px-6 sm:py-10">
              <p className="text-sm text-gray-300">Terminal is ready.</p>
              <p className="mt-2 text-xs leading-6 text-gray-500">
                Run code to view execution output, runtime feedback, and submission logs.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-1">
            {history.map((entry, index) => {
              const tone = getEntryTone(entry.line);

              return (
                <div
                  key={`${entry.time}-${index}`}
                  className="grid grid-cols-[62px_16px_minmax(0,1fr)] items-start gap-2 rounded-lg px-2 py-1.5 transition-colors hover:bg-white/[0.03] sm:grid-cols-[78px_18px_minmax(0,1fr)] sm:gap-3"
                >
                  <span className="pt-0.5 text-[10px] text-gray-600">
                    {entry.time}
                  </span>

                  <span className={`pt-0.5 font-bold ${tone.promptClass}`}>
                    {tone.prompt}
                  </span>

                  <pre
                    className={`whitespace-pre-wrap break-words leading-6 ${tone.textClass}`}
                  >
                    {entry.line}
                  </pre>
                </div>
              );
            })}

            <div className="grid grid-cols-[62px_16px_minmax(0,1fr)] items-center gap-2 px-2 py-1.5 sm:grid-cols-[78px_18px_minmax(0,1fr)] sm:gap-3">
              <span className="text-[10px] text-transparent">--:--:--</span>
              <span
                className={`font-bold ${
                  isLocked ? "text-red-400" : "text-cyan-400"
                }`}
              >
                {isLocked ? "!" : "$"}
              </span>
              <span
                className={`inline-block h-4 w-2 animate-pulse rounded-sm ${
                  isLocked ? "bg-red-400/80" : "bg-cyan-400/80"
                }`}
              />
            </div>
          </div>
        )}
      </div>
    </>
  );

  return (
    <>
      <div
        ref={terminalRef}
        className="relative flex h-full min-h-[340px] flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#05060a] shadow-[0_0_0_1px_rgba(255,255,255,0.02)]"
        style={!expanded && isDesktop ? { height } : undefined}
      >
        {!expanded && isDesktop && (
          <button
            type="button"
            aria-label="Resize terminal"
            onMouseDown={() => setIsResizing(true)}
            className="absolute inset-x-0 top-0 z-20 h-3 cursor-row-resize bg-transparent"
          >
            <div className="mx-auto mt-1 h-1 w-16 rounded-full bg-white/10 transition hover:bg-white/20" />
          </button>
        )}

        <div className={!isDesktop ? "overflow-hidden flex-1" : "flex-1"}>
          <div className={!isDesktop ? "h-full overflow-y-auto" : ""}>
            {terminalContent}
          </div>
        </div>
      </div>

      {expanded && (
        <div className="fixed inset-0 z-50 bg-black/75 p-3 backdrop-blur-sm sm:p-4">
          <div className="mx-auto flex h-full max-w-6xl min-h-0 flex-col overflow-hidden rounded-3xl border border-white/10 bg-[#05060a] shadow-[0_25px_80px_rgba(0,0,0,0.5)]">
            <div className="flex shrink-0 items-center justify-between border-b border-white/10 bg-[#0b0c10] px-4 py-3">
              <div>
                <p className="text-sm font-semibold text-white">Expanded Terminal</p>
                <p className="text-xs text-gray-500">
                  Double-click the terminal bar or use close to return.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setExpanded(false)}
                className="rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-xs text-white transition hover:bg-white/[0.08]"
              >
                Close
              </button>
            </div>

            <div className="flex min-h-0 flex-1 flex-col">
              {terminalContent}
            </div>
          </div>
        </div>
      )}
    </>
  );
}