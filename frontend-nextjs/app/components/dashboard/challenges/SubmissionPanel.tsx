"use client";

import { useMemo } from "react";

type MissionState = "active" | "submitted" | "completed" | "timeout";

type Props = {
  onSubmit: () => void;
  onReplay: () => void;
  submitting: boolean;
  code: string;
  lastScore: number | null;
  missionState: MissionState;
  timeLeftLabel: string;
};

export default function SubmissionPanel({
  onSubmit,
  onReplay,
  submitting,
  code,
  lastScore,
  missionState,
  timeLeftLabel,
}: Props) {
  const lineCount = code.split("\n").length;
  const charCount = code.length;
  const hasCode = code.trim() !== "";
  const missionActive = missionState === "active";

  const qualityLabel = useMemo(() => {
    if (!hasCode) return "Empty";
    if (lineCount < 5) return "Draft";
    if (lineCount < 20) return "In Progress";
    return "Ready";
  }, [hasCode, lineCount]);

  const qualityClasses = useMemo(() => {
    if (!hasCode) return "border-white/10 bg-white/[0.03] text-gray-400";
    if (lineCount < 5) {
      return "border-yellow-500/20 bg-yellow-500/10 text-yellow-300";
    }
    if (lineCount < 20) {
      return "border-purple-500/20 bg-purple-500/10 text-purple-200";
    }
    return "border-emerald-500/20 bg-emerald-500/10 text-emerald-300";
  }, [hasCode, lineCount]);

  const missionBadgeClass = useMemo(() => {
    if (missionState === "completed") {
      return "border-emerald-500/20 bg-emerald-500/10 text-emerald-300";
    }

    if (missionState === "timeout") {
      return "border-red-500/20 bg-red-500/10 text-red-200";
    }

    if (missionState === "submitted") {
      return "border-yellow-500/20 bg-yellow-500/10 text-yellow-200";
    }

    return "border-cyan-500/20 bg-cyan-500/10 text-cyan-200";
  }, [missionState]);

  const submissionText = useMemo(() => {
    if (submitting) {
      return "Your solution is being validated against challenge test cases.";
    }

    if (missionState === "timeout") {
      return "Time is up. This attempt has ended and the editor is locked.";
    }

    if (missionState === "completed") {
      return "Challenge completed successfully.";
    }

    if (missionState === "submitted") {
      return "Your last attempt failed. Retry the mission to improve your result.";
    }

    if (hasCode) {
      return "Your solution is ready for evaluation.";
    }

    return "Write some code before submitting your solution.";
  }, [submitting, missionState, hasCode]);

  const badgeText = useMemo(() => {
    if (submitting) return "Submitting";
    if (missionState === "completed") return "Accepted";
    if (missionState === "timeout") return "Timed Out";
    if (missionState === "submitted") return "Failed";
    if (hasCode) return "Ready";
    return "Waiting";
  }, [submitting, missionState, hasCode]);

  const badgeClasses = useMemo(() => {
    if (submitting) {
      return "border-purple-500/20 bg-purple-500/10 text-purple-200";
    }

    if (missionState === "completed") {
      return "border-emerald-500/20 bg-emerald-500/10 text-emerald-300";
    }

    if (missionState === "timeout") {
      return "border-red-500/20 bg-red-500/10 text-red-200";
    }

    if (missionState === "submitted") {
      return "border-yellow-500/20 bg-yellow-500/10 text-yellow-200";
    }

    if (hasCode) {
      return "border-cyan-500/20 bg-cyan-500/10 text-cyan-200";
    }

    return "border-white/10 bg-white/[0.03] text-gray-400";
  }, [submitting, missionState, hasCode]);

  const submitDisabled = submitting || !hasCode || !missionActive;

  return (
    <div className="rounded-3xl border border-white/10 bg-[#0a0a0a] p-3.5 shadow-[0_0_0_1px_rgba(255,255,255,0.02)] sm:p-4">
      <div className="flex flex-col gap-3.5">
        <div className="flex flex-col gap-3">
          <div>
            <div className="flex items-center justify-between gap-3">
              <p className="text-[11px] uppercase tracking-[0.18em] text-pink-300">
                Submission Control
              </p>

              <span
                className={`inline-flex rounded-full border px-2.5 py-1 text-[10px] uppercase tracking-[0.14em] ${badgeClasses}`}
              >
                {badgeText}
              </span>
            </div>

            <p className="mt-1.5 text-xs leading-6 text-gray-400">
              Run checks output. Submit is what validates your challenge result.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-3 py-2.5">
              <p className="text-[10px] uppercase tracking-[0.14em] text-gray-500">
                Score
              </p>
              <p className="mt-1 text-base font-semibold leading-none text-white">
                {lastScore !== null ? `${lastScore}%` : "—"}
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-3 py-2.5">
              <p className="text-[10px] uppercase tracking-[0.14em] text-gray-500">
                Time Left
              </p>
              <p className="mt-1 text-base font-semibold leading-none text-white">
                {timeLeftLabel}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-3 py-2.5">
            <p className="text-[10px] uppercase tracking-[0.14em] text-gray-500">
              Lines
            </p>
            <p className="mt-1 text-base font-semibold leading-none text-white">
              {lineCount}
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-3 py-2.5">
            <p className="text-[10px] uppercase tracking-[0.14em] text-gray-500">
              Characters
            </p>
            <p className="mt-1 text-base font-semibold leading-none text-white">
              {charCount}
            </p>
          </div>

          <div className={`rounded-2xl border px-3 py-2.5 ${qualityClasses}`}>
            <p className="text-[10px] uppercase tracking-[0.14em] text-inherit/80">
              Code State
            </p>
            <p className="mt-1 text-sm font-semibold leading-none">
              {qualityLabel}
            </p>
          </div>

          <div className={`rounded-2xl border px-3 py-2.5 ${missionBadgeClass}`}>
            <p className="text-[10px] uppercase tracking-[0.14em] text-inherit/80">
              Mission
            </p>
            <p className="mt-1 text-sm font-semibold capitalize leading-none">
              {missionState}
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-[#08080c] px-3 py-2.5">
          <p className="text-xs font-medium text-white">Submission status</p>
          <p className="mt-1 text-[11px] leading-5 text-gray-500">
            {submissionText}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
          <button
            onClick={onSubmit}
            disabled={submitDisabled}
            className="w-full rounded-2xl bg-gradient-to-r from-pink-500 to-purple-500 px-4 py-3 text-sm font-medium text-white transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
            type="button"
          >
            {submitting
              ? "Submitting..."
              : missionActive
              ? "Submit Solution"
              : "Submission Locked"}
          </button>

          <button
            onClick={onReplay}
            className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-medium text-white transition hover:bg-white/[0.08]"
            type="button"
          >
            Retry Mission
          </button>
        </div>
      </div>
    </div>
  );
}