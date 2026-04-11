"use client";

import { ChevronLeft, ChevronRight, X, Brain } from "lucide-react";
import CodeEditor, { type Language } from "./CodeEditor";
import SubmissionPanel from "./SubmissionPanel";
import TerminalConsole from "./TerminalConsole";

type MissionState = "active" | "submitted" | "completed" | "timeout";

type ChallengeExample = {
  input: string;
  output: string;
  explanation?: string;
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
  analyzerResult?: {
    insight: string;
    pattern: string;
    strengths: string[];
    gaps: string[];
    nextHint: string;
    complexity: { time: string; space: string };
    progress: { exploration: number; optimization: number; completion: number };
  } | null;
  showAnalyzer?: boolean;
  onToggleAnalyzer?: () => void;
};

type GuidanceCard = {
  title: string;
  body: string;
};

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
        />
      </div>
    );
  };

  const renderAnalyzerPanel = () => {
    if (!analyzerResult) return null;
    
    return (
      <>
        <div className="hidden xl:block h-full">
          <div className="flex flex-col overflow-hidden rounded-2xl border border-purple-500/20 bg-[#0d0d14] h-full">
            <div className="flex-1 overflow-y-auto p-4">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium uppercase tracking-wider text-purple-300">Thinking Analyzer</span>
                  <span className="rounded-full border border-purple-500/30 bg-purple-500/10 px-2 py-0.5 text-[10px] text-purple-300">{analyzerResult.pattern}</span>
                </div>
                <button onClick={onToggleAnalyzer} className="text-purple-400 hover:text-purple-200">
                  <X size={16} />
                </button>
              </div>
              <AnalyzerContent result={analyzerResult} />
            </div>
          </div>
        </div>

{showAnalyzer && (
          <div className="fixed inset-0 z-[9998] flex items-end justify-center xl:hidden">
            <div className="absolute inset-0 bg-black/50" onClick={(e) => {
              e.preventDefault();
              onToggleAnalyzer?.();
            }} />
            <div className="relative max-h-[75vh] w-full overflow-y-auto rounded-t-2xl border border-purple-500/20 bg-[#0d0d14] p-4 animate-in slide-in-from-bottom duration-300">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium uppercase tracking-wider text-purple-300">Thinking Analyzer</span>
                  <span className="rounded-full border border-purple-500/30 bg-purple-500/10 px-2 py-0.5 text-[10px] text-purple-300">{analyzerResult.pattern}</span>
                </div>
                <button 
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onToggleAnalyzer?.();
                  }} 
                  className="rounded-full border border-white/20 bg-white/10 p-2 text-gray-300"
                >
                  <X size={16} />
                </button>
              </div>
              <AnalyzerContent result={analyzerResult} />
            </div>
          </div>
        )}
      </>
    );
  };

  const AnalyzerContent = ({ result }: { result: NonNullable<typeof analyzerResult> }) => (
    <div className="space-y-4">
      <div>
        <p className="text-[10px] uppercase tracking-wider text-gray-500">Insight</p>
        <p className="mt-1 text-sm text-gray-300">{result.insight}</p>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <p className="text-[10px] uppercase tracking-wider text-gray-500">Complexity</p>
          <p className="mt-1 text-sm text-gray-300">
            Time: <span className="text-pink-400">{result.complexity.time}</span><br />
            Space: <span className="text-pink-400">{result.complexity.space}</span>
          </p>
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-wider text-gray-500">Progress</p>
          <div className="mt-1 space-y-1 text-xs">
            <div className="flex items-center justify-between"><span className="text-gray-400">Exploration</span><span className="text-emerald-400">{result.progress.exploration}%</span></div>
            <div className="flex items-center justify-between"><span className="text-gray-400">Optimization</span><span className="text-blue-400">{result.progress.optimization}%</span></div>
            <div className="flex items-center justify-between"><span className="text-gray-400">Completion</span><span className="text-purple-400">{result.progress.completion}%</span></div>
          </div>
        </div>
      </div>
      {result.strengths.length > 0 && (
        <div>
          <p className="text-[10px] uppercase tracking-wider text-gray-500">Strengths</p>
          <ul className="mt-1 space-y-1">
            {result.strengths.slice(0, 2).map((s: string, i: number) => <li key={i} className="text-xs text-emerald-300">+ {s}</li>)}
          </ul>
        </div>
      )}
      {result.gaps.length > 0 && (
        <div>
          <p className="text-[10px] uppercase tracking-wider text-gray-500">Gaps</p>
          <ul className="mt-1 space-y-1">
            {result.gaps.slice(0, 2).map((g: string, i: number) => <li key={i} className="text-xs text-rose-300">• {g}</li>)}
          </ul>
        </div>
      )}
      <div className="rounded-xl border border-purple-500/20 bg-purple-500/[0.05] p-3">
        <p className="text-[10px] uppercase tracking-wider text-gray-500">Next Hint</p>
        <p className="mt-1 text-sm text-purple-200">{result.nextHint}</p>
      </div>
    </div>
  );

  const hasAnalyzer = !!analyzerResult;

  return (
    <div className="space-y-3 sm:space-y-4">
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
          <section className="hidden xl:block">
            {renderAnalyzerPanel()}
          </section>
        )}

        {hasAnalyzer && showAnalyzer && (
          <div className="fixed inset-0 z-[9998] flex items-end justify-center xl:hidden">
            <div className="absolute inset-0 bg-black/60" onClick={() => onToggleAnalyzer?.()} />
            <div className="relative max-h-[70vh] w-full overflow-y-auto rounded-t-2xl border border-purple-500/30 bg-[#0d0d14] p-4 animate-in slide-in-from-bottom duration-200">
              <div className="mb-4 flex items-center justify-between border-b border-purple-500/20 pb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold uppercase tracking-wider text-purple-300">Thinking Analyzer</span>
                  <span className="rounded-full border border-purple-500/30 bg-purple-500/10 px-2 py-0.5 text-[10px] text-purple-300">{analyzerResult.pattern}</span>
                </div>
                <button type="button" onClick={() => onToggleAnalyzer?.()} className="rounded-full bg-white/10 p-2 text-gray-300">
                  <X size={16} />
                </button>
              </div>
              <div className="max-h-[50vh] overflow-y-auto">
                <AnalyzerContent result={analyzerResult} />
              </div>
            </div>
          </div>
        )}

        {hasAnalyzer && !showAnalyzer && (
          <button 
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onToggleAnalyzer?.();
            }} 
            className="fixed bottom-24 right-4 z-[9999] flex items-center justify-center rounded-full bg-purple-600 text-white shadow-lg hover:bg-purple-500 w-12 h-12 md:hidden lg:hidden xl:hidden cursor-pointer"
            aria-label="Open Thinking Analyzer"
          >
            <Brain size={22} />
          </button>
        )}
      </div>

      <section className="min-w-0">
        <TerminalConsole
          history={terminalHistory}
          isLocked={isEditorLocked}
          lockMessage={editorLockMessage}
        />
      </section>
    </div>
  );
}