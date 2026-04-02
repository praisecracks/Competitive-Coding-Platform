"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import ChallengeWorkspace from "@/app/components/dashboard/challenges/ChallengeWorkspace";
import ChallengeHeader from "@/app/components/dashboard/challenges/ChallengeHeader";
import type { Language } from "@/app/components/dashboard/challenges/CodeEditor";

type ChallengeExample = {
  input: string;
  output: string;
  explanation?: string;
};

type StarterCodeMap = {
  javascript?: string;
  python?: string;
  go?: string;
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
  starterCode?: string | StarterCodeMap;
  constraints?: string[];
};

type TerminalEntry = {
  time: string;
  line: string;
};

type RunResponse = {
  status?: string;
  language?: string;
  challenge_id?: number;
  output?: string[] | string;
  error?: string;
  executedAt?: string;
  executionTime?: string;
  message?: string;
  result?: string;
};

type SubmitResponse = {
  status?: string;
  score?: number;
  language?: string;
  challenge_id?: number;
  output?: string[] | string;
  error?: string;
  submittedAt?: string;
  executionTime?: string;
  message?: string;
  result?: string;
  passedTests?: number;
  totalTests?: number;
  passed?: number;
  total?: number;
  testsPassed?: number;
  testsTotal?: number;
};

type MissionState = "active" | "submitted" | "completed" | "timeout";
type ResultStatus = "accepted" | "failed" | "timeout";

type ResultModalState = {
  open: boolean;
  status: ResultStatus;
  score: number;
  passedTests: number;
  totalTests: number;
  title: string;
  description: string;
};

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "/api";

const DEFAULT_LANGUAGE: Language = "javascript";
const LEADERBOARD_ROUTE = "/dashboard/leaderboard";

const DEFAULT_CODE: Record<Language, string> = {
  javascript: `function solve(input) {
  // Write your solution here
  return input;
}

console.log(solve("test"));`,

  python: `def solve(input):
    # Write your solution here
    return input

print(solve("test"))`,

  go: `package main

import "fmt"

func solve(input string) string {
    // Write your solution here
    return input
}

func main() {
    fmt.Println(solve("test"))
}`,
};

const starterCodeFallback = DEFAULT_CODE.javascript;

function isStarterCodeMap(value: unknown): value is StarterCodeMap {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function extractStarterCode(
  starterCode?: string | StarterCodeMap,
  preferredLanguage: Language = "javascript"
): string {
  if (typeof starterCode === "string") {
    return starterCode.trim() !== "" ? starterCode : starterCodeFallback;
  }

  if (isStarterCodeMap(starterCode)) {
    const preferred = starterCode[preferredLanguage];
    if (typeof preferred === "string" && preferred.trim() !== "") {
      return preferred;
    }

    const fallback =
      starterCode.javascript || starterCode.python || starterCode.go;

    if (typeof fallback === "string" && fallback.trim() !== "") {
      return fallback;
    }
  }

  return starterCodeFallback;
}

function getReadableTime() {
  return new Date().toLocaleTimeString();
}

function getStorageKey(
  challengeId: number,
  mode: string,
  language: Language = DEFAULT_LANGUAGE
) {
  return `cm_challenge_draft_${challengeId}_${mode}_${language}`;
}

function extractOutputLines(data: {
  output?: unknown;
  message?: unknown;
  result?: unknown;
}): string[] {
  if (Array.isArray(data?.output)) {
    return data.output.filter((line): line is string => typeof line === "string");
  }

  if (typeof data?.output === "string" && data.output.trim() !== "") {
    return data.output.split("\n").filter((line) => line.trim() !== "");
  }

  if (typeof data?.message === "string" && data.message.trim() !== "") {
    return [data.message];
  }

  if (typeof data?.result === "string" && data.result.trim() !== "") {
    return [data.result];
  }

  return [];
}

function extractErrorMessage(errorText: string, fallback: string) {
  try {
    const parsed = JSON.parse(errorText);
    if (typeof parsed?.error === "string" && parsed.error.trim() !== "") {
      return parsed.error;
    }
    if (typeof parsed?.message === "string" && parsed.message.trim() !== "") {
      return parsed.message;
    }
  } catch {
    //
  }

  return errorText?.trim() || fallback;
}

function formatCountdown(totalSeconds: number) {
  const safe = Math.max(0, totalSeconds);
  const minutes = Math.floor(safe / 60);
  const seconds = safe % 60;

  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
    2,
    "0"
  )}`;
}

function normalizeTestCounts(data: SubmitResponse) {
  const passedTests =
    typeof data.passedTests === "number"
      ? data.passedTests
      : typeof data.passed === "number"
      ? data.passed
      : typeof data.testsPassed === "number"
      ? data.testsPassed
      : 0;

  const totalTests =
    typeof data.totalTests === "number"
      ? data.totalTests
      : typeof data.total === "number"
      ? data.total
      : typeof data.testsTotal === "number"
      ? data.testsTotal
      : 0;

  return {
    passedTests,
    totalTests,
  };
}

function normalizeSubmissionResult(data: SubmitResponse) {
  const rawStatus = String(data.status || "").toLowerCase();
  const { passedTests, totalTests } = normalizeTestCounts(data);

  const derivedScore =
    typeof data.score === "number"
      ? Math.max(0, Math.min(100, Math.round(data.score)))
      : totalTests > 0
      ? Math.round((passedTests / totalTests) * 100)
      : 0;

  const isAccepted =
    rawStatus === "accepted" ||
    rawStatus === "passed" ||
    rawStatus === "success" ||
    rawStatus === "completed" ||
    (totalTests > 0 && passedTests === totalTests);

  const status: ResultStatus = isAccepted ? "accepted" : "failed";

  return {
    status,
    score: derivedScore,
    passedTests,
    totalTests,
  };
}

function buildResultModal(
  status: ResultStatus,
  score: number,
  passedTests: number,
  totalTests: number
): ResultModalState {
  if (status === "accepted") {
    return {
      open: true,
      status,
      score,
      passedTests,
      totalTests,
      title: "Challenge Accepted",
      description:
        "Your submission passed all required test cases. Mission completed successfully.",
    };
  }

  if (status === "timeout") {
    return {
      open: true,
      status,
      score,
      passedTests,
      totalTests,
      title: "Time Expired",
      description:
        "The mission timer reached zero. The editor has been locked for this attempt.",
    };
  }

  return {
    open: true,
    status,
    score,
    passedTests,
    totalTests,
    title: "Challenge Failed",
    description:
      "Your submission was evaluated, but it did not pass all required test cases.",
  };
}

export default function ChallengeDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [code, setCode] = useState<string>(starterCodeFallback);
  const [language, setLanguage] = useState<Language>(DEFAULT_LANGUAGE);
  const [terminalHistory, setTerminalHistory] = useState<TerminalEntry[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [running, setRunning] = useState(false);
  const [lastScore, setLastScore] = useState<number | null>(null);
  const [workspaceTab, setWorkspaceTab] = useState<
    "problem" | "examples" | "constraints"
  >("problem");
  const [missionState, setMissionState] = useState<MissionState>("active");
  const [timeLeftSeconds, setTimeLeftSeconds] = useState(0);
  const [resultModal, setResultModal] = useState<ResultModalState>({
    open: false,
    status: "failed",
    score: 0,
    passedTests: 0,
    totalTests: 0,
    title: "",
    description: "",
  });

  const languageInitializedRef = useRef(false);
  const timeoutHandledRef = useRef(false);

  const challengeId = Number(params?.id);
  const mode = searchParams.get("mode") || "solo";

  const addTerminalLine = useCallback((line: string) => {
    setTerminalHistory((prev) => [
      ...prev,
      {
        time: getReadableTime(),
        line,
      },
    ]);
  }, []);

  const starterCodeMap = useMemo<Record<Language, string>>(() => {
    const starter = challenge?.starterCode;

    if (!starter) {
      return DEFAULT_CODE;
    }

    if (typeof starter === "string") {
      return {
        javascript: starter,
        python: starter,
        go: starter,
      };
    }

    return {
      javascript: starter.javascript || DEFAULT_CODE.javascript,
      python: starter.python || DEFAULT_CODE.python,
      go: starter.go || DEFAULT_CODE.go,
    };
  }, [challenge]);

  const missionIsActive = missionState === "active";
  const editorLocked = missionState !== "active";

  const countdownLabel = useMemo(
    () => formatCountdown(timeLeftSeconds),
    [timeLeftSeconds]
  );

  const editorLockMessage = useMemo(() => {
    if (missionState === "timeout") {
      return "Time is up for this mission. Replay to start a new attempt.";
    }

    if (missionState === "completed") {
      return "This mission has been completed successfully.";
    }

    if (missionState === "submitted") {
      return "This attempt has ended. Replay to start a fresh mission.";
    }

    return "Editor is locked for this mission.";
  }, [missionState]);

  const resetMission = useCallback(
    (options?: { resetCode?: boolean }) => {
      if (!challenge) return;

      const durationSeconds = Math.max(1, (challenge.duration || 30) * 60);

      timeoutHandledRef.current = false;
      setMissionState("active");
      setResultModal((prev) => ({ ...prev, open: false }));
      setLastScore(null);
      setErrorMessage("");
      setRunning(false);
      setSubmitting(false);
      setTimeLeftSeconds(durationSeconds);

      if (options?.resetCode) {
        const storageKey = getStorageKey(challenge.id, mode, language);
        const savedDraft =
          typeof window !== "undefined"
            ? window.localStorage.getItem(storageKey)
            : null;

        if (typeof savedDraft === "string" && savedDraft.trim() !== "") {
          setCode(savedDraft);
        } else {
          setCode(starterCodeMap[language] || DEFAULT_CODE[language]);
        }
      }

      setTerminalHistory([
        {
          time: getReadableTime(),
          line: `Challenge #${challenge.id} loaded successfully.`,
        },
        {
          time: getReadableTime(),
          line: `Workspace mode: ${mode.toUpperCase()}.`,
        },
        {
          time: getReadableTime(),
          line: `Mission started. Timer set to ${challenge.duration} minutes.`,
        },
      ]);
    },
    [challenge, language, mode, starterCodeMap]
  );

  useEffect(() => {
    if (!challengeId || Number.isNaN(challengeId)) {
      setLoading(false);
      setErrorMessage("Invalid challenge ID.");
      return;
    }

    const fetchChallenge = async () => {
      setLoading(true);
      setErrorMessage("");
      languageInitializedRef.current = false;
      timeoutHandledRef.current = false;

      try {
        const res = await fetch(`${API_BASE_URL}/challenges/${challengeId}`, {
          cache: "no-store",
        });

        if (!res.ok) {
          const errorText = await res.text().catch(() => "");
          console.error("Challenge detail fetch failed:", res.status, errorText);
          setErrorMessage("Unable to load this challenge right now.");
          return;
        }

        const data = await res.json();

        const normalizedChallenge: Challenge = {
          id: data.id,
          title: data.title || "Untitled Challenge",
          description: data.description || "No challenge description available.",
          difficulty: data.difficulty || "Unknown",
          category: data.category || "General",
          duration: data.duration || 30,
          tags: Array.isArray(data.tags) ? data.tags : [],
          examples: Array.isArray(data.examples) ? data.examples : [],
          starterCode:
            data.starterCode || data.starter_code || starterCodeFallback,
          constraints: Array.isArray(data.constraints) ? data.constraints : [],
        };

        const initialLanguage: Language = DEFAULT_LANGUAGE;
        const storageKey = getStorageKey(
          normalizedChallenge.id,
          mode,
          initialLanguage
        );
        const savedDraft =
          typeof window !== "undefined"
            ? window.localStorage.getItem(storageKey)
            : null;

        const resolvedStarterCode = extractStarterCode(
          normalizedChallenge.starterCode,
          initialLanguage
        );

        const initialCode =
          typeof savedDraft === "string" && savedDraft.trim() !== ""
            ? savedDraft
            : resolvedStarterCode;

        const durationSeconds = Math.max(
          1,
          (normalizedChallenge.duration || 30) * 60
        );

        setChallenge(normalizedChallenge);
        setLanguage(initialLanguage);
        setCode(initialCode);
        setLastScore(null);
        setMissionState("active");
        setResultModal((prev) => ({ ...prev, open: false }));
        setTimeLeftSeconds(durationSeconds);
        setRunning(false);
        setSubmitting(false);

        const initialLogs: TerminalEntry[] = [
          {
            time: getReadableTime(),
            line: `Challenge #${normalizedChallenge.id} loaded successfully.`,
          },
          {
            time: getReadableTime(),
            line: `Workspace mode: ${mode.toUpperCase()}.`,
          },
          {
            time: getReadableTime(),
            line:
              savedDraft && savedDraft.trim() !== ""
                ? `Draft restored for ${initialLanguage}.`
                : `Editor initialized for ${initialLanguage}.`,
          },
          {
            time: getReadableTime(),
            line: `Mission started. Timer set to ${normalizedChallenge.duration} minutes.`,
          },
        ];

        setTerminalHistory(initialLogs);
        languageInitializedRef.current = true;
      } catch (error) {
        console.error("Challenge detail fetch error:", error);
        setErrorMessage("Backend is offline or unreachable.");
      } finally {
        setLoading(false);
      }
    };

    fetchChallenge();
  }, [challengeId, mode]);

  useEffect(() => {
    if (!challenge || loading) return;

    const storageKey = getStorageKey(challenge.id, mode, language);

    try {
      window.localStorage.setItem(storageKey, code);
    } catch (error) {
      console.error("Failed to persist challenge draft:", error);
    }
  }, [challenge, code, mode, language, loading]);

  useEffect(() => {
    if (!challenge || !languageInitializedRef.current) return;

    const storageKey = getStorageKey(challenge.id, mode, language);
    const savedDraft =
      typeof window !== "undefined"
        ? window.localStorage.getItem(storageKey)
        : null;

    if (typeof savedDraft === "string" && savedDraft.trim() !== "") {
      setCode(savedDraft);
      addTerminalLine(`Draft restored for ${language}.`);
      return;
    }

    setCode(starterCodeMap[language] || DEFAULT_CODE[language]);
    addTerminalLine(`Language switched to ${language}.`);
  }, [language, challenge, mode, starterCodeMap, addTerminalLine]);

  useEffect(() => {
    if (!challenge || !missionIsActive || loading) return;

    const interval = window.setInterval(() => {
      setTimeLeftSeconds((prev) => {
        if (prev <= 1) {
          window.clearInterval(interval);
          return 0;
        }

        return prev - 1;
      });
    }, 1000);

    return () => window.clearInterval(interval);
  }, [challenge, missionIsActive, loading]);

  useEffect(() => {
    if (!challenge || missionState !== "active" || timeLeftSeconds > 0) return;
    if (timeoutHandledRef.current) return;

    timeoutHandledRef.current = true;
    setMissionState("timeout");
    setRunning(false);
    setSubmitting(false);

    addTerminalLine("Mission timeout: allocated time has been exhausted.");
    addTerminalLine("Editor locked. Run and submit actions are now disabled.");

    setResultModal(buildResultModal("timeout", lastScore ?? 0, 0, 0));
  }, [challenge, timeLeftSeconds, missionState, addTerminalLine, lastScore]);

  const handleRunCode = async () => {
    const token =
      typeof window !== "undefined"
        ? window.localStorage.getItem("terminal_token")
        : null;

    if (!challenge) {
      addTerminalLine("Run blocked: challenge not loaded.");
      return;
    }

    if (!missionIsActive) {
      addTerminalLine("Run blocked: mission is no longer active.");
      return;
    }

    if (running) {
      addTerminalLine("Run ignored: execution already in progress.");
      return;
    }

    if (submitting) {
      addTerminalLine("Run blocked: submission in progress.");
      return;
    }

    if (!code.trim()) {
      addTerminalLine("Run blocked: editor is empty.");
      return;
    }

    if (!token) {
      addTerminalLine("Run blocked: missing authentication token.");
      setErrorMessage("Your session has expired. Please log in again.");
      return;
    }

    try {
      setRunning(true);
      setErrorMessage("");
      addTerminalLine(`Starting ${language} execution...`);

      const res = await fetch(`${API_BASE_URL}/run`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          challenge_id: challenge.id,
          language,
          code,
        }),
      });

      if (!res.ok) {
        const errorText = await res.text().catch(() => "");
        const message = extractErrorMessage(
          errorText,
          `Run failed (${res.status}).`
        );

        console.warn("Run request failed:", res.status, errorText);
        addTerminalLine(`Run failed: ${message}`);
        return;
      }

      const data: RunResponse = await res.json();
      const outputLines = extractOutputLines(data);
      const executionTime =
        typeof data.executionTime === "string" && data.executionTime.trim() !== ""
          ? data.executionTime
          : null;

      if (String(data.status || "").toLowerCase() === "failed") {
        if (outputLines.length > 0) {
          outputLines.forEach((line) => addTerminalLine(line));
        }

        if (data.error) {
          addTerminalLine(`Runtime error: ${data.error}`);
        }

        if (executionTime) {
          addTerminalLine(`Execution time: ${executionTime}`);
        }

        addTerminalLine("Execution failed.");
        addTerminalLine(
          "Challenge is not completed. Fix the code and submit again when ready."
        );
        return;
      }

      if (outputLines.length === 0) {
        addTerminalLine("Execution finished. No output returned.");
      } else {
        outputLines.forEach((line) => addTerminalLine(line));
      }

      if (executionTime) {
        addTerminalLine(`Execution time: ${executionTime}`);
      }

      addTerminalLine(
        "Run completed. Mission remains active until a valid submission is accepted."
      );
    } catch (error) {
      console.error("Run error:", error);
      addTerminalLine("Run failed due to a network error.");
    } finally {
      setRunning(false);
    }
  };

  const handleResetCode = () => {
    if (!missionIsActive) {
      addTerminalLine("Reset blocked: mission is no longer active.");
      return;
    }

    setCode(starterCodeMap[language] || DEFAULT_CODE[language]);
    addTerminalLine(`Editor reset for ${language}.`);
  };

  const handleSubmitCode = async () => {
    const token =
      typeof window !== "undefined"
        ? window.localStorage.getItem("terminal_token")
        : null;

    if (!token) {
      addTerminalLine("Submission blocked: missing authentication token.");
      setErrorMessage("Your session has expired. Please log in again.");
      return;
    }

    if (!challenge) {
      addTerminalLine("Submission blocked: challenge not loaded.");
      return;
    }

    if (!missionIsActive) {
      addTerminalLine("Submission blocked: mission is no longer active.");
      return;
    }

    if (submitting) {
      addTerminalLine("Submission ignored: request already in progress.");
      return;
    }

    if (running) {
      addTerminalLine("Submission blocked: wait for the current run to finish.");
      return;
    }

    if (!code.trim()) {
      addTerminalLine("Submission blocked: editor is empty.");
      return;
    }

    const historySnapshot = [...terminalHistory];

    try {
      setSubmitting(true);
      setErrorMessage("");
      addTerminalLine(
        `Submitting ${language} solution for challenge #${challenge.id}...`
      );

      const res = await fetch(`${API_BASE_URL}/submit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          challenge_id: challenge.id,
          language,
          code,
          history: historySnapshot,
        }),
      });

      if (!res.ok) {
        const errorText = await res.text().catch(() => "");
        const message = extractErrorMessage(
          errorText,
          `Submission failed (${res.status}).`
        );

        console.error("Submission failed:", res.status, errorText);
        addTerminalLine(`Submission failed: ${message}`);
        return;
      }

      const data: SubmitResponse = await res.json();
      const outputLines = extractOutputLines(data);
      const executionTime =
        typeof data.executionTime === "string" && data.executionTime.trim() !== ""
          ? data.executionTime
          : null;

      const normalized = normalizeSubmissionResult(data);
      setLastScore(normalized.score);

      if (outputLines.length > 0) {
        outputLines.forEach((line) => addTerminalLine(line));
      }

      if (data.error) {
        addTerminalLine(`Submission error: ${data.error}`);
      }

      if (executionTime) {
        addTerminalLine(`Execution time: ${executionTime}`);
      }

      addTerminalLine(
        `Test result: ${normalized.passedTests}/${normalized.totalTests} passed.`
      );
      addTerminalLine(`Score awarded: ${normalized.score}%`);

      if (normalized.status === "accepted") {
        setMissionState("completed");
        addTerminalLine("Challenge completed: submission accepted.");

        setResultModal(
          buildResultModal(
            "accepted",
            normalized.score,
            normalized.passedTests,
            normalized.totalTests
          )
        );

        try {
          window.localStorage.removeItem(
            getStorageKey(challenge.id, mode, language)
          );
        } catch (error) {
          console.error("Failed to clear saved draft after submission:", error);
        }

        return;
      }

      setMissionState("submitted");
      addTerminalLine("Challenge failed. Review feedback and retry the mission.");

      setResultModal(
        buildResultModal(
          "failed",
          normalized.score,
          normalized.passedTests,
          normalized.totalTests
        )
      );
    } catch (error) {
      console.error("Submission error:", error);
      addTerminalLine("Submission failed due to a network error.");
    } finally {
      setSubmitting(false);
    }
  };

  const completionMeta = useMemo(() => {
    const safeCode = typeof code === "string" ? code : "";
    const lines = safeCode.split("\n").length;
    const chars = safeCode.length;
    return { lines, chars };
  }, [code]);

  const sessionMeta = useMemo(() => {
    return {
      timerLabel: countdownLabel,
      state: submitting
        ? "Submitting"
        : running
        ? "Running"
        : missionState === "completed"
        ? "Completed"
        : missionState === "submitted"
        ? "Submitted"
        : missionState === "timeout"
        ? "Timeout"
        : "Active",
    };
  }, [countdownLabel, missionState, running, submitting]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050507] px-4 py-6 text-white sm:px-6 sm:py-10">
        <div className="mx-auto max-w-7xl">
          <div className="rounded-3xl border border-white/10 bg-[#0a0a0a] px-6 py-20 text-center sm:px-10 sm:py-24">
            <p className="text-sm text-gray-500">Loading challenge workspace...</p>
          </div>
        </div>
      </div>
    );
  }

  if (errorMessage && !challenge) {
    return (
      <div className="min-h-screen bg-[#050507] px-4 py-6 text-white sm:px-6 sm:py-10">
        <div className="mx-auto max-w-4xl space-y-4">
          <button
            onClick={() => router.push("/dashboard/challenges")}
            className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white transition hover:bg-white/10"
            type="button"
          >
            ← Back to Challenges
          </button>

          <div className="rounded-3xl border border-pink-500/15 bg-pink-500/[0.04] px-5 py-12 text-center sm:px-6 sm:py-14">
            <p className="text-sm font-medium text-pink-200">
              Unable to load challenge
            </p>
            <p className="mx-auto mt-2 max-w-xl text-sm leading-7 text-gray-300">
              {errorMessage || "This challenge could not be found."}
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!challenge) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#050507] text-white">
      <div className="mx-auto max-w-[1600px] px-3 py-4 sm:px-5 sm:py-5 lg:px-6">
        {errorMessage && (
          <div className="mb-4 rounded-2xl border border-yellow-500/15 bg-yellow-500/[0.05] px-4 py-3">
            <p className="text-sm text-yellow-200">{errorMessage}</p>
          </div>
        )}

        <ChallengeHeader
          challenge={challenge}
          mode={mode}
          lastScore={lastScore}
          lines={completionMeta.lines}
          chars={completionMeta.chars}
          timerLabel={sessionMeta.timerLabel}
          sessionState={sessionMeta.state}
          workspaceTab={workspaceTab}
          onTabChange={setWorkspaceTab}
          onBack={() => router.push("/dashboard/challenges")}
        />

        <ChallengeWorkspace
          challenge={challenge}
          activeTab={workspaceTab}
          code={code}
          onCodeChange={setCode}
          onRun={handleRunCode}
          onReset={handleResetCode}
          onSubmit={handleSubmitCode}
          onReplay={() => resetMission({ resetCode: false })}
          terminalHistory={terminalHistory}
          submitting={submitting}
          running={running}
          lastScore={lastScore}
          language={language}
          onLanguageChange={setLanguage}
          starterCodeMap={starterCodeMap}
          missionState={missionState}
          isEditorLocked={editorLocked}
          editorLockMessage={editorLockMessage}
          timeLeftLabel={countdownLabel}
        />
      </div>

      {resultModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-[28px] border border-white/10 bg-[#0a0a0f] p-6 shadow-[0_25px_80px_rgba(0,0,0,0.45)] sm:p-7">
            <div className="flex items-start justify-between gap-4">
              <div>
                <span
                  className={`inline-flex rounded-full border px-3 py-1 text-[11px] uppercase tracking-[0.16em] ${
                    resultModal.status === "accepted"
                      ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-300"
                      : resultModal.status === "timeout"
                      ? "border-red-500/20 bg-red-500/10 text-red-200"
                      : "border-yellow-500/20 bg-yellow-500/10 text-yellow-200"
                  }`}
                >
                  {resultModal.status}
                </span>

                <h2 className="mt-4 text-xl font-semibold text-white">
                  {resultModal.title}
                </h2>

                <p className="mt-2 text-sm leading-7 text-gray-400">
                  {resultModal.description}
                </p>
              </div>

              <button
                onClick={() =>
                  setResultModal((prev) => ({ ...prev, open: false }))
                }
                className="rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-xs text-gray-300 transition hover:bg-white/[0.06]"
                type="button"
              >
                Close
              </button>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4">
                <p className="text-[11px] uppercase tracking-[0.15em] text-gray-500">
                  Score
                </p>
                <p className="mt-1 text-xl font-semibold text-white">
                  {resultModal.score}%
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4">
                <p className="text-[11px] uppercase tracking-[0.15em] text-gray-500">
                  Passed
                </p>
                <p className="mt-1 text-xl font-semibold text-white">
                  {resultModal.passedTests}
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4">
                <p className="text-[11px] uppercase tracking-[0.15em] text-gray-500">
                  Total Tests
                </p>
                <p className="mt-1 text-xl font-semibold text-white">
                  {resultModal.totalTests}
                </p>
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <button
                onClick={() => resetMission({ resetCode: false })}
                className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-3 text-sm font-medium text-white transition hover:bg-white/[0.08]"
                type="button"
              >
                Retry Mission
              </button>

              {resultModal.status === "accepted" ? (
                <button
                  onClick={() => router.push(LEADERBOARD_ROUTE)}
                  className="w-full rounded-2xl bg-gradient-to-r from-pink-500 to-purple-500 px-5 py-3 text-sm font-medium text-white transition hover:opacity-95"
                  type="button"
                >
                  Go to Leaderboard
                </button>
              ) : null}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}