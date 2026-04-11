"use client";

import { useMemo } from "react";
import Editor from "@monaco-editor/react";

export type Language = "javascript" | "python" | "go";

type Props = {
  code: string;
  onChange: (value: string) => void;
  onRun: () => void;
  onReset: () => void;
  starterCodeMap?: Partial<Record<Language, string>>;
  language: Language;
  onLanguageChange: (language: Language) => void;
  isRunning?: boolean;
  isSubmitting?: boolean;
  isLocked?: boolean;
  lockMessage?: string;
  hasAnalyzer?: boolean;
  showAnalyzer?: boolean;
  onToggleAnalyzer?: () => void;
};

export default function CodeEditor({
  code,
  onChange,
  onRun,
  onReset,
  starterCodeMap,
  language,
  onLanguageChange,
  isRunning = false,
  isSubmitting = false,
  isLocked = false,
  lockMessage = "Editor is locked for this mission.",
  hasAnalyzer = false,
  showAnalyzer = false,
  onToggleAnalyzer,
}: Props) {
  const stats = useMemo(() => {
    const safeCode = typeof code === "string" ? code : "";
    const lines = safeCode.split("\n").length;
    const chars = safeCode.length;
    return { lines, chars };
  }, [code]);

  const languageLabel = useMemo(() => {
    if (language === "javascript") return "JavaScript";
    if (language === "python") return "Python";
    return "Go";
  }, [language]);

  const starterAvailable = Boolean(starterCodeMap?.[language]);
  const controlsDisabled = isRunning || isSubmitting || isLocked;

  const statusLabel = useMemo(() => {
    if (isLocked) return "Locked";
    if (isSubmitting) return "Submitting";
    if (isRunning) return "Running";
    return "Ready";
  }, [isLocked, isSubmitting, isRunning]);

  const statusClasses = useMemo(() => {
    if (isLocked) {
      return "border-red-500/20 bg-red-500/10 text-red-200";
    }

    if (isSubmitting) {
      return "border-purple-500/20 bg-purple-500/10 text-purple-200";
    }

    if (isRunning) {
      return "border-yellow-500/20 bg-yellow-500/10 text-yellow-200";
    }

    return "border-emerald-500/20 bg-emerald-500/10 text-emerald-300";
  }, [isLocked, isSubmitting, isRunning]);

  return (
    <div className="flex h-full min-h-[280px] flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#0a0a0a] shadow-[0_0_0_1px_rgba(255,255,255,0.02)] lg:min-h-[300px]">
      <div className="border-b border-white/10 bg-[#0d0d12] px-3 py-3 sm:px-4">
        <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-xs uppercase tracking-[0.18em] text-pink-300">
                Code Editor
              </p>

              <select
                value={language}
                onChange={(e) => onLanguageChange(e.target.value as Language)}
                disabled={controlsDisabled}
                className="rounded-lg border border-white/10 bg-[#08080c] px-3 py-1.5 text-xs text-white outline-none disabled:cursor-not-allowed disabled:opacity-60"
              >
                <option value="javascript">JavaScript</option>
                <option value="python">Python</option>
                <option value="go">Go</option>
              </select>

              <span
                className={`rounded-full border px-2 py-1 text-[10px] ${statusClasses}`}
              >
                {statusLabel}
              </span>

              {starterAvailable && (
                <span className="rounded-full border border-white/10 bg-white/[0.03] px-2 py-1 text-[10px] text-gray-400">
                  Starter Loaded
                </span>
              )}
            </div>

            <p className="mt-2 text-sm text-gray-500">
              {isLocked
                ? lockMessage
                : `Build your solution in ${languageLabel} and test it inside the workspace.`}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="text-xs text-gray-400">
              {stats.lines} lines • {stats.chars} chars
            </div>

            <button
              onClick={onReset}
              disabled={controlsDisabled}
              className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-60"
              type="button"
            >
              Reset
            </button>

            <button
              onClick={onRun}
              disabled={controlsDisabled}
              className="rounded-lg border border-purple-500/20 bg-purple-500/10 px-3 py-2 text-sm text-purple-200 transition hover:bg-purple-500/20 disabled:cursor-not-allowed disabled:opacity-60"
              type="button"
            >
              {isLocked ? "Locked" : isRunning ? "Running..." : "Run"}
            </button>

            {hasAnalyzer && (
              <button
                onClick={onToggleAnalyzer}
                className={`rounded-lg border px-3 py-2 text-sm transition ${
                  showAnalyzer
                    ? "border-purple-500 bg-purple-500/20 text-purple-200"
                    : "border-purple-500/30 bg-purple-500/10 text-purple-300 hover:bg-purple-500/20"
                }`}
                type="button"
              >
                {showAnalyzer ? "Hide Analyzer" : "Analyzer"}
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="relative min-h-[220px] flex-1 lg:min-h-[320px]">
        {isLocked && (
          <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center bg-[#050507]/55 backdrop-blur-[2px]">
            <div className="rounded-2xl border border-red-500/20 bg-[#0b0b10]/90 px-5 py-4 text-center shadow-[0_20px_60px_rgba(0,0,0,0.35)]">
              <p className="text-sm font-medium text-red-200">Editor Locked</p>
              <p className="mt-2 max-w-sm text-xs leading-6 text-gray-300">
                {lockMessage}
              </p>
            </div>
          </div>
        )}

        <Editor
          height="100%"
          language={language}
          theme="vs-dark"
          value={code}
          onChange={(value) => onChange(value || "")}
          options={{
            fontSize: 13,
            minimap: { enabled: false },
            wordWrap: "on",
            automaticLayout: true,
            tabSize: language === "python" ? 4 : 2,
            lineNumbers: "on",
            smoothScrolling: true,
            bracketPairColorization: { enabled: true },
            padding: { top: 16, bottom: 16 },
            scrollBeyondLastLine: false,
            renderLineHighlight: "all",
            readOnly: isLocked,
          }}
        />
      </div>

      <div className="flex items-center justify-between border-t border-white/10 bg-[#08080c] px-3 py-2 text-xs text-gray-500 sm:px-4">
        <span>{language.toUpperCase()}</span>
        <span>Ln {stats.lines}</span>
      </div>
    </div>
  );
}