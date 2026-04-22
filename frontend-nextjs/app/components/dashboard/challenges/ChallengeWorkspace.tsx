"use client";

import { ChevronLeft, ChevronRight, X, Brain } from "lucide-react";
import { motion } from "framer-motion";
import CodeEditor, { type Language } from "./CodeEditor";
import SubmissionPanel from "./SubmissionPanel";
import TerminalConsole from "./TerminalConsole";

type MissionState = "active" | "submitted" | "completed" | "timeout";

type ChallengeExample = {
  input: string;
  output: string;
  explanation?: string;
};

type AnalyzerResult = {
  insight: string;
  pattern: string;
  strengths: string[];
  gaps: string[];
  nextHint: string;
  complexity: { time: string; space: string };
  progress: { exploration: number; optimization: number; completion: number };
};

type Challenge = {
  id: number;
  title: string;
  description: string;
  difficulty: string;
  category: string;
  duration: number;
  tags: string[];
  examples?: ChallengeExample[];
  starterCode?: string | Partial<Record<Language, string>>;
  constraints?: string[];
};

type Props = {
  challenge: Challenge;
  activeTab: "problem" | "examples" | "constraints";
  code: string;
  onCodeChange: (value: string) => void;
  onRun: () => void;
  onReset: () => void;
  onSubmit: () => void;
  onReplay: () => void;
  terminalHistory: { time: string; line: string }[];
  submitting: boolean;
  running?: boolean;
  lastScore: number | null;
  language: Language;
  onLanguageChange: (language: Language) => void;
  starterCodeMap?: Partial<Record<Language, string>>;
  missionState: MissionState;
  isEditorLocked: boolean;
  editorLockMessage: string;
  timeLeftLabel: string;
  analyzerResult?: AnalyzerResult | null;
  showAnalyzer?: boolean;
  onToggleAnalyzer?: () => void;
  isGuestMode?: boolean;
  guestFirstRunSuccess?: boolean;
  guestSubmitAttempted?: boolean;
  guestSuccessDismissed?: boolean;
  onDismissSubmitPrompt?: () => void;
  onDismissSuccess?: () => void;
};

type GuidanceCard = {
  title: string;
  body: string;
};

function AnalyzerContent({ result, isGuestMode = false }: { result: AnalyzerResult; isGuestMode?: boolean }) {
  return (
    <div className="space-y-4">
      <div>
        <p className="text-[10px] uppercase tracking-wider text-gray-500">Insight</p>
        <p className={`mt-1 text-sm ${isGuestMode ? 'text-gray-400' : 'text-gray-300'}`}>{result.insight}</p>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <p className="text-[10px] uppercase tracking-wider text-gray-500">Complexity</p>
          <p className={`mt-1 text-sm ${isGuestMode ? 'text-gray-400' : 'text-gray-300'}`}>
            Time: <span className={isGuestMode ? "text-pink-300/80" : "text-pink-400"}>{result.complexity.time}</span><br />
            Space: <span className={isGuestMode ? "text-pink-300/80" : "text-pink-400"}>{result.complexity.space}</span>
          </p>
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-wider text-gray-500">Progress</p>
          <div className="mt-1 space-y-1 text-xs">
            <div className="flex items-center justify-between"><span className={isGuestMode ? "text-gray-500" : "text-gray-400"}>{isGuestMode ? "Exploration" : "Exploration"}</span><span className={isGuestMode ? "text-emerald-300/80" : "text-emerald-400"}>{result.progress.exploration}%</span></div>
            <div className="flex items-center justify-between"><span className={isGuestMode ? "text-gray-500" : "text-gray-400"}>{isGuestMode ? "Optimization" : "Optimization"}</span><span className={isGuestMode ? "text-blue-300/80" : "text-blue-400"}>{result.progress.optimization}%</span></div>
            <div className="flex items-center justify-between"><span className={isGuestMode ? "text-gray-500" : "text-gray-400"}>{isGuestMode ? "Completion" : "Completion"}</span><span className={isGuestMode ? "text-purple-300/80" : "text-purple-400"}>{result.progress.completion}%</span></div>
          </div>
        </div>
      </div>
      {result.strengths.length > 0 && (
        <div>
          <p className="text-[10px] uppercase tracking-wider text-gray-500">Strengths</p>
          <ul className="mt-1 space-y-1">
            {result.strengths.slice(0, 2).map((s: string, i: number) => <li key={i} className={`text-xs ${isGuestMode ? "text-emerald-300/80" : "text-emerald-300"}`}>+ {s}</li>)}
          </ul>
        </div>
      )}
      {result.gaps.length > 0 && (
        <div>
          <p className="text-[10px] uppercase tracking-wider text-gray-500">Gaps</p>
          <ul className="mt-1 space-y-1">
            {result.gaps.slice(0, 2).map((g: string, i: number) => <li key={i} className={`text-xs ${isGuestMode ? "text-rose-300/80" : "text-rose-300"}`}>• {g}</li>)}
          </ul>
        </div>
      )}
      <div className={`rounded-xl border p-3 ${isGuestMode ? "border-purple-500/15 bg-purple-500/[0.08]" : "border-purple-500/20 bg-purple-500/[0.05]"}`}>
        <p className="text-[10px] uppercase tracking-wider text-gray-500">Next Hint</p>
        <p className={`mt-1 text-sm ${isGuestMode ? "text-purple-200/80" : "text-purple-200"}`}>{result.nextHint}</p>
      </div>
    </div>
  );
}

function buildFallbackExamples(challenge: Challenge): GuidanceCard[] {
  const title = challenge.title.toLowerCase();
  const category = challenge.category.toLowerCase();

  if (
    title.includes("sum") ||
    title.includes("two sum") ||
    category.includes("array")
  ) {
    return [
      {
        title: "Understand the Input",
        body: "Identify the values you need to work with before writing the logic. If the task is about adding values, make sure you extract the correct numbers first.",
      },
      {
        title: "Apply the Required Logic",
        body: "Do the actual computation the challenge asks for. Avoid returning placeholder values or raw input when the mission expects a processed result.",
      },
      {
        title: "Match the Expected Output",
        body: "Return the final answer exactly in the format required by the challenge so the test cases can validate it correctly.",
      },
    ];
  }

  return [
    {
      title: "Understand the Goal",
      body: "Break the challenge into simple steps: read the input, apply the required logic, then return the expected result.",
    },
    {
      title: "Check Output Format",
      body: "Even correct logic can fail if the returned output does not match the exact expected format.",
    },
    {
      title: "Test Small Cases",
      body: "Run small and obvious examples first before submitting, so you can quickly verify your reasoning.",
    },
  ];
}

function buildFallbackConstraints(challenge: Challenge): string[] {
  const constraints = [
    "Your solution should return the expected output for the provided input.",
    "Do not leave placeholder logic such as returning raw input unless the challenge explicitly requires it.",
    "Make sure your final answer matches the expected output format exactly.",
  ];

  if (challenge.difficulty.toLowerCase() === "hard") {
    constraints.push(
      "Consider edge cases and solution efficiency before submitting."
    );
  }

  return constraints;
}

export default function ChallengeWorkspace({
  challenge,
  activeTab,
  code,
  onCodeChange,
  onRun,
  onReset,
  onSubmit,
  onReplay,
  terminalHistory,
  submitting,
  running = false,
  lastScore,
  language,
  onLanguageChange,
  starterCodeMap,
  missionState,
  isEditorLocked,
  editorLockMessage,
  timeLeftLabel,
  analyzerResult,
  showAnalyzer = false,
  onToggleAnalyzer,
  isGuestMode = false,
  guestFirstRunSuccess = false,
  guestSubmitAttempted = false,
  guestSuccessDismissed = false,
  onDismissSubmitPrompt,
  onDismissSuccess,
}: Props) {
  const fallbackExamples = buildFallbackExamples(challenge);
  const fallbackConstraints = buildFallbackConstraints(challenge);

  const renderInfoPanel = () => {
    const constraintList: string[] =
      Array.isArray(challenge.constraints) && challenge.constraints.length > 0
        ? challenge.constraints
        : fallbackConstraints;

    const exampleList: ChallengeExample[] =
      Array.isArray(challenge.examples) && challenge.examples.length > 0
        ? challenge.examples
        : [];

    const tabContent =
      activeTab === "problem" ? (
        <div className="space-y-3 sm:space-y-4">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-pink-300">
              Problem Brief
            </p>
            <p className="mt-2 text-sm leading-6 text-gray-500">
              Understand the task clearly before writing your solution.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-3 sm:p-4">
            <p className="break-words text-sm leading-7 text-gray-300 sm:leading-8">
              {challenge.description}
            </p>
          </div>

          {Array.isArray(challenge.tags) && challenge.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {challenge.tags.map((tag: string) => (
                <span
                  key={tag}
                  className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] text-gray-300"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      ) : activeTab === "examples" ? (
        <div className="space-y-3 sm:space-y-4">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-pink-300">
              Examples
            </p>
            <p className="mt-2 text-sm leading-6 text-gray-500">
              Review sample inputs and outputs before submitting.
            </p>
          </div>

          {exampleList.length > 0 ? (
            <div className="space-y-4">
              {exampleList.map((example: ChallengeExample, index: number) => (
                <div
                  key={`${example.input}-${index}`}
                  className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 sm:p-5"
                >
                  <p className="text-sm font-semibold text-white">
                    Example {index + 1}
                  </p>

                  <div className="mt-4 grid gap-4">
                    <div>
                      <p className="mb-2 text-xs uppercase tracking-[0.15em] text-gray-500">
                        Input
                      </p>
                      <pre className="overflow-x-auto whitespace-pre-wrap break-words rounded-xl border border-white/10 bg-black/30 px-3 py-3 text-xs text-gray-200 sm:px-4">
                        {example.input}
                      </pre>
                    </div>

                    <div>
                      <p className="mb-2 text-xs uppercase tracking-[0.15em] text-gray-500">
                        Output
                      </p>
                      <pre className="overflow-x-auto whitespace-pre-wrap break-words rounded-xl border border-white/10 bg-black/30 px-3 py-3 text-xs text-gray-200 sm:px-4">
                        {example.output}
                      </pre>
                    </div>

                    {example.explanation && (
                      <div>
                        <p className="mb-2 text-xs uppercase tracking-[0.15em] text-gray-500">
                          Explanation
                        </p>
                        <p className="break-words text-sm leading-7 text-gray-300">
                          {example.explanation}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {fallbackExamples.map((item: GuidanceCard, index: number) => (
                <div
                  key={`${item.title}-${index}`}
                  className="rounded-2xl border border-yellow-500/15 bg-yellow-500/[0.05] p-3 sm:p-4"
                >
                  <p className="text-sm font-semibold text-yellow-200">
                    {item.title}
                  </p>
                  <p className="mt-2 text-sm leading-7 text-gray-300">
                    {item.body}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-3 sm:space-y-4">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-pink-300">
              Constraints
            </p>
            <p className="mt-2 text-sm leading-6 text-gray-500">
              Use these limits to shape an efficient solution.
            </p>
          </div>

          {constraintList.map((constraint: string) => (
            <div
              key={constraint}
              className="break-words rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm leading-7 text-gray-300"
            >
              {constraint}
            </div>
          ))}
        </div>
      );

    return (
      <div className="space-y-3 sm:space-y-4">
        <div className="rounded-3xl border border-white/10 bg-[#0a0a0a] p-3 sm:p-4">
          {tabContent}
        </div>

        <SubmissionPanel
          onSubmit={onSubmit}
          onReplay={onReplay}
          submitting={submitting}
          code={code}
          lastScore={lastScore}
          missionState={missionState}
          timeLeftLabel={timeLeftLabel}
          isGuestMode={isGuestMode}
          guestSubmitAttempted={guestSubmitAttempted}
          onDismissSubmitPrompt={onDismissSubmitPrompt}
        />
      </div>
    );
  }

  const hasAnalyzer = !!analyzerResult;

  return (
    <div className="space-y-3 sm:space-y-4">
      {/* First-step helper for guest mode */}
      {isGuestMode && (
        <div className="rounded-2xl border border-blue-500/15 bg-blue-500/[0.06] px-4 py-3">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 h-5 w-5 flex-shrink-0 rounded-full bg-blue-500/20 flex items-center justify-center">
              <span className="text-[10px] font-medium text-blue-300">1</span>
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-white">Get started in 3 easy steps:</p>
              <ul className="mt-1.5 space-y-1 text-xs text-gray-300">
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-blue-400" />
                  Read the problem description
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-blue-400" />
                  Edit the starter code in the editor
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-blue-400" />
                  Run your code to test it
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}

      <div className={`grid gap-4 sm:gap-5 ${showAnalyzer && hasAnalyzer ? 'xl:grid-cols-[0.78fr_1fr_0.38fr]' : 'xl:grid-cols-[0.78fr_1fr]'}`}>
        <section className="min-h-[160px] xl:min-h-[200px]">
          {renderInfoPanel()}
        </section>

        <section className="min-w-0 space-y-4 sm:space-y-5">
          <CodeEditor
            code={code}
            onChange={onCodeChange}
            onRun={onRun}
            onReset={onReset}
            starterCodeMap={starterCodeMap}
            language={language}
            onLanguageChange={onLanguageChange}
            isRunning={running}
            isSubmitting={submitting}
            isLocked={isEditorLocked}
            lockMessage={editorLockMessage}
            hasAnalyzer={hasAnalyzer}
            showAnalyzer={showAnalyzer}
            onToggleAnalyzer={onToggleAnalyzer}
          />
        </section>

        {hasAnalyzer && showAnalyzer && (
          <section className="hidden xl:block h-full">
            <div className={`flex flex-col overflow-hidden rounded-2xl border h-full ${
              isGuestMode
                ? "border-purple-500/15 bg-purple-500/[0.10]"
                : "border-purple-500/20 bg-[#0d0d14]"
            }`}>
              <div className="flex-1 overflow-y-auto p-4">
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-medium uppercase tracking-wider ${isGuestMode ? 'text-purple-300/80' : 'text-purple-300'}`}>Thinking Analyzer</span>
                    <span className={`rounded-full border px-2 py-0.5 text-[10px] ${isGuestMode ? 'border-purple-500/20 bg-purple-500/10 text-purple-300/80' : 'border-purple-500/30 bg-purple-500/10 text-purple-300'}`}>{analyzerResult!.pattern}</span>
                  </div>
                  <button onClick={onToggleAnalyzer} className={isGuestMode ? "text-purple-300/70 hover:text-purple-300" : "text-purple-400 hover:text-purple-200"}>
                    <X size={16} />
                  </button>
                </div>
                <AnalyzerContent result={analyzerResult!} isGuestMode={isGuestMode} />
              </div>
            </div>
          </section>
        )}

        {showAnalyzer && (
          <div className="fixed inset-0 z-[9998] flex items-end justify-center xl:hidden">
            <div className="absolute inset-0 bg-black/70" onClick={(e) => {
              e.preventDefault();
              onToggleAnalyzer?.();
            }} />
            <div className={`relative max-h-[75vh] w-full overflow-y-auto rounded-t-2xl border p-4 animate-in slide-in-from-bottom duration-300 ${
              isGuestMode
                ? "border-purple-500/15 bg-purple-500/[0.18]"
                : "border-purple-500/20 bg-[#0d0d14]"
            }`}>
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-medium uppercase tracking-wider ${isGuestMode ? 'text-purple-300/80' : 'text-purple-300'}`}>Thinking Analyzer</span>
                  <span className={`rounded-full border px-2 py-0.5 text-[10px] ${isGuestMode ? 'border-purple-500/20 bg-purple-500/10 text-purple-300/80' : 'border-purple-500/30 bg-purple-500/10 text-purple-300'}`}>{analyzerResult!.pattern}</span>
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onToggleAnalyzer?.();
                  }}
                  className={`rounded-full border p-2 ${isGuestMode ? 'border-white/10 bg-white/5 text-gray-300' : 'border-white/20 bg-white/10 text-gray-300'}`}
                >
                  <X size={16} />
                </button>
              </div>
              <AnalyzerContent result={analyzerResult!} isGuestMode={isGuestMode} />
            </div>
          </div>
        )}
      </div>

      {/* First run success feedback for guests */}
      {isGuestMode && guestFirstRunSuccess && !guestSuccessDismissed && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
          className="relative mb-3 rounded-2xl border border-emerald-500/40 bg-gradient-to-br from-emerald-500/[0.14] to-emerald-500/[0.05] px-4 py-3.5 shadow-[0_0_0_1px_rgba(16,185,129,0.08),0_8px_24px_rgba(16,185,129,0.12)]"
        >
          <div className="flex flex-col gap-3">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-2.5">
                <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-500/25 ring-1 ring-emerald-500/50">
                  <svg className="h-3.5 w-3.5 text-emerald-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-emerald-100">First step completed</p>
                    <span className="rounded-full border border-emerald-500/30 bg-emerald-500/12 px-1.5 py-0.5 text-[9px] font-medium uppercase tracking-wider text-emerald-300/90">
                      Step 1 of 3
                    </span>
                  </div>
                  <p className="mt-1.5 text-xs leading-5.5 text-gray-300/90">
                    Your code ran successfully in the CodeMaster workspace.
                  </p>
                  <p className="mt-1 text-xs leading-5.5 text-gray-400">
                    Create a free account to save your progress and continue your journey.
                  </p>
                </div>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 sm:justify-end">
              <button
                onClick={onDismissSuccess}
                className="rounded-xl border border-white/12 bg-white/[0.04] px-3 py-2 text-xs font-medium text-gray-300 transition hover:bg-white/[0.08] hover:text-white"
                type="button"
              >
                Continue Practicing
              </button>
              <button
                onClick={() => window.location.href = "/signup"}
                className="rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 px-3.5 py-2 text-xs font-semibold text-white shadow-[0_0_16px_rgba(16,185,129,0.3)] transition hover:opacity-95 hover:shadow-[0_0_20px_rgba(16,185,129,0.4)]"
                type="button"
              >
                Create Free Account
              </button>
            </div>
          </div>
        </motion.div>
      )}

      <section className="min-w-0">
        <TerminalConsole
          history={terminalHistory}
          isLocked={isEditorLocked}
          lockMessage={editorLockMessage}
        />
      </section>

      {/* Floating analyzer button for mobile (when analyzer available but hidden) */}
      {hasAnalyzer && !showAnalyzer && (
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onToggleAnalyzer?.();
          }}
          className={`fixed bottom-24 right-4 z-[9999] flex items-center justify-center rounded-full w-12 h-12 shadow-lg md:hidden lg:hidden xl:hidden ${
            isGuestMode
              ? "bg-purple-500/30 text-purple-300 hover:bg-purple-500/40"
              : "bg-purple-600 text-white hover:bg-purple-500"
          }`}
          aria-label="Open Thinking Analyzer"
        >
          <Brain size={22} />
        </button>
      )}
    </div>
  );
}