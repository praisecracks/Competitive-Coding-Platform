"use client";

import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import Editor, { OnMount } from "@monaco-editor/react";
import {
  Play,
  RotateCcw,
  Check,
  X,
  Terminal,
  Loader2,
  Languages,
  Copy,
  CheckCircle2,
} from "lucide-react";
import { useTheme } from "@/app/context/ThemeContext";

type Language = "javascript" | "python" | "go";

interface CodePlaygroundProps {
  initialCode?: string;
  language?: Language;
  lockedLanguage?: boolean;
}

interface PyodideInterface {
  runPython: (code: string) => unknown;
}

declare global {
  interface Window {
    loadPyodide: (config: { indexURL: string }) => Promise<PyodideInterface>;
  }
}

const DEFAULT_CODE: Record<Language, string> = {
  javascript: `// Write your JavaScript code here
console.log("Hello, World!");

// Try this:
const numbers = [1, 2, 3, 4, 5];
const doubled = numbers.map(n => n * 2);
console.log("Doubled:", doubled);`,
  python: `# Write your Python code here
print("Hello, World!")

# Try this:
numbers = [1, 2, 3, 4, 5]
doubled = [n * 2 for n in numbers]
print("Doubled:", doubled)`,
  go: `package main

import "fmt"

func main() {
\tfmt.Println("Hello, World!")
\t
\t// Try this:
\tnumbers := []int{1, 2, 3, 4, 5}
\tfor i, n := range numbers {
\t\tnumbers[i] = n * 2
\t}
\tfmt.Println("Doubled:", numbers)
}`,
};

export default function CodePlayground({
  initialCode = "",
  language: initialLanguage = "javascript",
  lockedLanguage = false,
}: CodePlaygroundProps) {

  const { theme } = useTheme();
  const isLight = theme === "light";

  const [language, setLanguage] = useState<Language>(initialLanguage);
  const [code, setCode] = useState(initialCode || DEFAULT_CODE[initialLanguage]);
  const [output, setOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [showLangDropdown, setShowLangDropdown] = useState(false);
  const [pyodideReady, setPyodideReady] = useState(false);
  const [pyodideLoading, setPyodideLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const pyodideRef = useRef<any>(null);
  const editorRef = useRef<any>(null);
  const monacoRef = useRef<any>(null);
  const editorContainerRef = useRef<HTMLDivElement | null>(null);

  const languages: { value: Language; label: string; icon: string; color: string }[] = [
    { value: "javascript", label: "JavaScript", icon: "JS", color: "yellow" },
    { value: "python", label: "Python", icon: "PY", color: "blue" },
    { value: "go", label: "Go", icon: "GO", color: "cyan" },
  ];

  useEffect(() => {
    setLanguage(initialLanguage);
    setCode(initialCode || DEFAULT_CODE[initialLanguage]);
    setOutput("");
    setHasError(false);
  }, [initialCode, initialLanguage]);

  useEffect(() => {
    if (language === "python" && !pyodideRef.current && !pyodideLoading && !pyodideReady) {
      setPyodideLoading(true);

      const loadPyodideScript = async () => {
        try {
          if (!window.loadPyodide) {
            await new Promise<void>((resolve, reject) => {
              const script = document.createElement("script");
              script.src = "https://cdn.jsdelivr.net/pyodide/v0.24.1/full/pyodide.js";
              script.onload = () => resolve();
              script.onerror = () => reject(new Error("Failed to load Pyodide script"));
              document.head.appendChild(script);
            });
          }

          const pyodide = await window.loadPyodide({
            indexURL: "https://cdn.jsdelivr.net/pyodide/v0.24.1/full/",
          });

          pyodideRef.current = pyodide;
          setPyodideReady(true);
          setPyodideLoading(false);
        } catch (error) {
          console.error("Pyodide load error:", error);
          setPyodideLoading(false);
          setOutput("Failed to load Python runtime. Check your connection and refresh.");
          setHasError(true);
        }
      };

      loadPyodideScript();
    }
  }, [language, pyodideLoading, pyodideReady]);

  useEffect(() => {
    if (!editorRef.current || !editorContainerRef.current) return;

    const editor = editorRef.current;
    const container = editorContainerRef.current;

    const relayout = () => {
      requestAnimationFrame(() => {
        editor.layout();
      });
    };

    relayout();

    const resizeObserver = new ResizeObserver(() => {
      relayout();
    });

    resizeObserver.observe(container);
    window.addEventListener("resize", relayout);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", relayout);
    };
  }, [language, output]);

  const runPython = useCallback(async (currentCode: string): Promise<string> => {
    if (!pyodideRef.current) {
      throw new Error("Python runtime not ready");
    }

    try {
      pyodideRef.current.runPython(`
import sys
from io import StringIO
sys.stdout = StringIO()
sys.stderr = StringIO()
`);
      pyodideRef.current.runPython(currentCode);

      const stdout: unknown = pyodideRef.current.runPython("sys.stdout.getvalue()");
      const stderr: unknown = pyodideRef.current.runPython("sys.stderr.getvalue()");
      pyodideRef.current.runPython("sys.stdout = sys.__stdout__");
      pyodideRef.current.runPython("sys.stderr = sys.__stderr__");

      const logs: string[] = [];

      if (typeof stdout === "string" && stdout) {
        logs.push(stdout);
      }

      if (typeof stderr === "string" && stderr) {
        logs.push(stderr);
        setHasError(true);
      }

      return logs.join("\n") || "Code executed successfully with no output.";
    } catch (pyError: unknown) {
      setHasError(true);
      const errorMsg = pyError instanceof Error ? pyError.message : String(pyError);
      return `Python error:\n\n${errorMsg}`;
    }
  }, []);

  const runGo = useCallback((_currentCode: string): string => {
    return "Go execution is not yet supported in the browser. Please use JavaScript or Python for now.";
  }, []);

  const handleRun = useCallback(async () => {
    setIsRunning(true);
    setOutput("");
    setHasError(false);

    try {
      let result = "";

      if (language === "python") {
        if (!pyodideReady) {
          setOutput("Python runtime is still loading. Please wait a moment.");
          setIsRunning(false);
          return;
        }

        result = await runPython(code);
      } else if (language === "javascript") {
        const logs: string[] = [];
        const originalLog = console.log;
        const originalError = console.error;
        const originalWarn = console.warn;
        const originalInfo = console.info;

        try {
          console.log = (...args: unknown[]) => {
            logs.push(
              args
                .map((arg) =>
                  typeof arg === "object" ? JSON.stringify(arg, null, 2) : String(arg)
                )
                .join(" ")
            );
          };

          console.error = (...args: unknown[]) => {
            logs.push(
              "Error: " +
                args
                  .map((arg) =>
                    typeof arg === "object" ? JSON.stringify(arg, null, 2) : String(arg)
                  )
                  .join(" ")
            );
          };

          console.warn = (...args: unknown[]) => {
            logs.push(
              "Warning: " +
                args
                  .map((arg) =>
                    typeof arg === "object" ? JSON.stringify(arg, null, 2) : String(arg)
                  )
                  .join(" ")
            );
          };

          console.info = (...args: unknown[]) => {
            logs.push(
              "Info: " +
                args
                  .map((arg) =>
                    typeof arg === "object" ? JSON.stringify(arg, null, 2) : String(arg)
                  )
                  .join(" ")
            );
          };

          await new Function(code)();
          result = logs.join("\n") || "Code executed successfully with no output.";
        } catch (err) {
          setHasError(true);
          const errorMsg = err instanceof Error ? err.message : String(err);
          result = `JavaScript error: ${errorMsg}`;
        } finally {
          console.log = originalLog;
          console.error = originalError;
          console.warn = originalWarn;
          console.info = originalInfo;
        }
      } else if (language === "go") {
        result = runGo(code);
      } else {
        result = "Unknown language.";
      }

      setOutput(result);
    } catch (err) {
      setHasError(true);
      setOutput(`Runtime error: ${String(err)}`);
    } finally {
      setIsRunning(false);
    }
  }, [code, language, pyodideReady, runPython, runGo]);

  const handleReset = () => {
    setCode(initialCode || DEFAULT_CODE[language]);
    setOutput("");
    setHasError(false);
  };

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  const handleEditorChange = (value: string | undefined) => {
    setCode(value || "");
  };

  const handleEditorDidMount: OnMount = (editor, monaco) => {
    editorRef.current = editor;
    monacoRef.current = monaco;

    requestAnimationFrame(() => {
      editor.layout();
    });
  };

  const currentLanguage = languages.find((l) => l.value === language);

  const editorOptions = useMemo(
    () => ({
      fontSize: 13,
      fontFamily: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace",
      lineNumbers: "on" as const,
      minimap: { enabled: false },
      scrollBeyondLastLine: false,
      wordWrap: "on" as const,
      automaticLayout: true,
      tabSize: 2,
      padding: { top: 12, bottom: 12 },
      renderLineHighlight: "line" as const,
      cursorBlinking: "smooth" as const,
      smoothScrolling: true,
      contextmenu: true,
      folding: true,
      glyphMargin: false,
      lineDecorationsWidth: 8,
      lineNumbersMinChars: 3,
      hideCursorInOverviewRuler: true,
      overviewRulerLanes: 0,
      bracketPairColorization: { enabled: true },
    }),
    []
  );

  return (
    <div
      className={`flex flex-col overflow-hidden rounded-xl border shadow-lg ${
        isLight ? "border-gray-200 bg-white" : "border-white/10 bg-[#0f1117]"
      }`}
    >
      <div
        className={`flex flex-col gap-3 px-3 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-4 ${
          isLight
            ? "border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100"
            : "border-b border-white/10 bg-[#1e1e2e]"
        }`}
      >
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex shrink-0 gap-1.5">
            <div className="h-3 w-3 rounded-full bg-red-500" />
            <div className="h-3 w-3 rounded-full bg-yellow-500" />
            <div className="h-3 w-3 rounded-full bg-emerald-500" />
          </div>

          <div className="hidden h-4 w-px bg-gray-300 sm:block" />

          {!lockedLanguage && (
            <div className="relative">
              <button
                onClick={() => setShowLangDropdown((prev) => !prev)}
                className={`flex items-center gap-2 rounded-lg border px-3 py-1.5 text-xs font-semibold ${
                  isLight
                    ? "border-gray-300 bg-white text-gray-800 hover:bg-gray-50"
                    : "border-white/15 bg-white/10 text-white hover:bg-white/15"
                }`}
              >
                <Languages className="h-3.5 w-3.5" />
                {currentLanguage?.label}
              </button>

              {showLangDropdown && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setShowLangDropdown(false)}
                  />
                  <div
                    className={`absolute left-0 top-full z-20 mt-2 w-36 rounded-xl border py-2 shadow-2xl ${
                      isLight ? "border-gray-200 bg-white" : "border-white/15 bg-[#252535]"
                    }`}
                  >
                    {languages.map((lang) => (
                      <button
                        key={lang.value}
                        onClick={() => {
                          setLanguage(lang.value);
                          setCode(initialCode || DEFAULT_CODE[lang.value]);
                          setShowLangDropdown(false);
                          setOutput("");
                          setHasError(false);

                          requestAnimationFrame(() => {
                            editorRef.current?.layout();
                          });
                        }}
                        className={`flex w-full items-center gap-2.5 px-3 py-2 text-left text-sm transition-colors ${
                          language === lang.value
                            ? isLight
                              ? "bg-pink-50 text-pink-700"
                              : "bg-pink-500/15 text-pink-300"
                            : isLight
                            ? "text-gray-700 hover:bg-gray-50"
                            : "text-gray-200 hover:bg-white/5"
                        }`}
                      >
                        <span
                          className={`rounded px-1.5 py-0.5 text-[10px] font-bold ${
                            lang.color === "yellow"
                              ? "bg-yellow-100 text-yellow-700"
                              : lang.color === "blue"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-cyan-100 text-cyan-700"
                          }`}
                        >
                          {lang.icon}
                        </span>
                        {lang.label}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleCopyCode}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
              isLight ? "text-gray-600 hover:bg-gray-100" : "text-gray-400 hover:bg-white/5"
            }`}
            title="Copy code"
          >
            {copied ? (
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
            ) : (
              <Copy className="h-3.5 w-3.5" />
            )}
            {copied ? "Copied!" : "Copy"}
          </button>

          <button
            onClick={handleReset}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
              isLight ? "text-gray-600 hover:bg-gray-100" : "text-gray-400 hover:bg-white/5"
            }`}
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Reset
          </button>

          <button
            onClick={handleRun}
            disabled={isRunning || (language === "python" && !pyodideReady)}
            className={`flex items-center gap-1.5 rounded-lg px-4 py-2 text-xs font-semibold transition-all sm:px-5 ${
              isLight
                ? "bg-emerald-600 text-white shadow-sm hover:bg-emerald-700"
                : "bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg hover:opacity-95"
            } ${
              isRunning || (language === "python" && !pyodideReady)
                ? "cursor-not-allowed opacity-60"
                : ""
            }`}
          >
            {isRunning ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Play className="h-3.5 w-3.5 fill-current" />
            )}
            {isRunning ? "Running..." : "Run"}
          </button>
        </div>
      </div>

      <div
        ref={editorContainerRef}
        className="relative h-[260px] w-full sm:h-[300px] lg:h-[340px]"
      >
        <Editor
          path={`playground-${language}`}
          defaultLanguage={
            language === "go" ? "go" : language === "python" ? "python" : "javascript"
          }
          language={
            language === "go" ? "go" : language === "python" ? "python" : "javascript"
          }
          value={code}
          onChange={handleEditorChange}
          onMount={handleEditorDidMount}
          theme={isLight ? "vs" : "vs-dark"}
          options={editorOptions}
          loading={
            <div className="flex h-full items-center justify-center bg-[#0d0d14]">
              <Loader2 className="h-8 w-8 animate-spin text-pink-500" />
            </div>
          }
        />
      </div>

      {output && (
        <div
          className={`border-t ${
            isLight ? "border-gray-200 bg-gray-50" : "border-white/10 bg-[#0c0c12]"
          }`}
        >
          <div
            className={`flex flex-col gap-2 border-b px-3 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-4 ${
              isLight ? "border-gray-200 bg-gray-100" : "border-white/10 bg-[#1a1a24]"
            }`}
          >
            <div className="flex min-w-0 flex-wrap items-center gap-3">
              <div className="flex gap-1.5">
                <div className="h-3 w-3 rounded-full bg-red-500" />
                <div className="h-3 w-3 rounded-full bg-yellow-500" />
                <div className="h-3 w-3 rounded-full bg-emerald-500" />
              </div>

              <Terminal
                className={`h-3.5 w-3.5 ${isLight ? "text-gray-600" : "text-gray-400"}`}
              />

              <span
                className={`text-xs font-semibold ${isLight ? "text-gray-700" : "text-gray-300"}`}
              >
                Terminal —{" "}
                {language === "go"
                  ? "Go (not supported)"
                  : language === "python"
                  ? pyodideReady
                    ? "Python 3"
                    : "Loading Pyodide..."
                  : "JavaScript"}
              </span>

              {hasError && (
                <span className="flex items-center gap-1.5 text-xs font-medium text-red-500">
                  <X className="h-3 w-3" /> Error
                </span>
              )}

              {!hasError && output && !output.startsWith("Go execution is not yet supported") && (
                <span className="flex items-center gap-1.5 text-xs font-medium text-emerald-600">
                  <Check className="h-3 w-3" /> Executed
                </span>
              )}
            </div>

            <button
              onClick={() => setOutput("")}
              className={`w-fit text-xs font-medium ${
                isLight ? "text-gray-500 hover:text-gray-700" : "text-gray-500 hover:text-gray-300"
              }`}
            >
              Clear
            </button>
          </div>

          <div
            className={`max-h-48 overflow-y-auto px-3 py-4 font-mono text-sm leading-relaxed sm:px-4 ${
              isLight ? "text-gray-800" : "text-gray-200"
            }`}
          >
            <pre className="whitespace-pre-wrap break-words">{output}</pre>
          </div>
        </div>
      )}
    </div>
  );
}