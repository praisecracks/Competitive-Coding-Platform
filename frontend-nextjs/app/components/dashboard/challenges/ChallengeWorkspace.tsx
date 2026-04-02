"use client";

import CodeEditor, { type Language } from "./CodeEditor";
import SubmissionPanel from "./SubmissionPanel";
import TerminalConsole from "./TerminalConsole";
import type { Challenge } from "@/app/challenges/[id]/types";

type MissionState = "active" | "submitted" | "completed" | "timeout";

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
}: Props) {
  const fallbackExamples = buildFallbackExamples(challenge);
  const fallbackConstraints = buildFallbackConstraints(challenge);

  const renderInfoPanel = () => {
    const tabContent =
      activeTab === "problem" ? (
        <div className="space-y-4 sm:space-y-5">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-pink-300">
              Problem Brief
            </p>
            <p className="mt-2 text-sm leading-6 text-gray-500">
              Understand the task clearly before writing your solution.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 sm:p-5">
            <p className="break-words text-sm leading-7 text-gray-300 sm:leading-8">
              {challenge.description}
            </p>
          </div>

          {challenge.tags?.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {challenge.tags.map((tag) => (
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
        <div className="space-y-4 sm:space-y-5">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-pink-300">
              Examples
            </p>
            <p className="mt-2 text-sm leading-6 text-gray-500">
              Review sample inputs and outputs before submitting.
            </p>
          </div>

          {challenge.examples?.length ? (
            <div className="space-y-4">
              {challenge.examples.map((example, index) => (
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
              {fallbackExamples.map((item, index) => (
                <div
                  key={`${item.title}-${index}`}
                  className="rounded-2xl border border-yellow-500/15 bg-yellow-500/[0.05] p-4 sm:p-5"
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
        <div className="space-y-4 sm:space-y-5">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-pink-300">
              Constraints
            </p>
            <p className="mt-2 text-sm leading-6 text-gray-500">
              Use these limits to shape an efficient solution.
            </p>
          </div>

          {(challenge.constraints?.length
            ? challenge.constraints
            : fallbackConstraints
          ).map((constraint) => (
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
      <div className="space-y-4 sm:space-y-5">
        <div className="rounded-3xl border border-white/10 bg-[#0a0a0a] p-4 sm:p-5 lg:p-6">
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

  return (
    <div className="space-y-4 sm:space-y-5">
      <div className="grid gap-4 sm:gap-5 xl:grid-cols-[0.78fr_1.22fr]">
        <section className="min-h-[220px] xl:min-h-[300px]">
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
          />
        </section>
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