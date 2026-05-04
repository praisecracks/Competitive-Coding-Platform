"use client";

import { useState, useRef, useMemo, useEffect } from "react";
import Editor, { OnMount } from "@monaco-editor/react";
import {
  Play,
  RotateCcw,
  Maximize2,
  Minimize2,
  X,
  Monitor,
} from "lucide-react";

interface BrowserPlaygroundProps {
  initialHtml?: string;
  initialCss?: string;
  title?: string;
  isLight: boolean;
}

const DEFAULT_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
</head>
<body>
  <h1>Hello, World!</h1>
  <p>Edit the HTML and CSS to see changes.</p>
</body>
</html>`;

const DEFAULT_CSS = `* {
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  margin: 0;
  padding: 20px;
  background: #f5f5f5;
}

h1 {
  color: #333;
}`;

export default function BrowserPlayground({
  initialHtml = "",
  initialCss = "",
  title = "Browser Preview",
  isLight,
}: BrowserPlaygroundProps) {
  const [html, setHtml] = useState(initialHtml || DEFAULT_HTML);
  const [css, setCss] = useState(initialCss || DEFAULT_CSS);
  const [showPreview, setShowPreview] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isEditorExpanded, setIsEditorExpanded] = useState(false);

  const htmlEditorRef = useRef<any>(null);
  const monacoRef = useRef<any>(null);

  const generateSrcDoc = useMemo(() => {
    const safeHtml = html || DEFAULT_HTML;
    const safeCss = css || DEFAULT_CSS;

    const htmlWithoutStyle = safeHtml.replace(
      /<style[^>]*>[\s\S]*?<\/style>/gi,
      "",
    );

    const bodyMatch = htmlWithoutStyle.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
    const bodyContent = bodyMatch ? bodyMatch[1] : htmlWithoutStyle;

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <style>
${safeCss}
  </style>
</head>
<body>
${bodyContent}
</body>
</html>`;
  }, [html, css]);

  useEffect(() => {
    if (html || css) {
      setShowPreview(true);
    }
  }, [html, css]);

  const handleRun = () => {
    setShowPreview(true);
  };

  const handleReset = () => {
    setHtml(initialHtml || DEFAULT_HTML);
    setCss(initialCss || DEFAULT_CSS);
    setShowPreview(true);
  };

  const handleHtmlChange = (value: string | undefined) => {
    setHtml(value || "");
  };

  const handleCssChange = (value: string | undefined) => {
    setCss(value || "");
  };

  useEffect(() => {
    if (htmlEditorRef.current) {
      requestAnimationFrame(() => {
        htmlEditorRef.current.layout();
      });
    }
  }, [isEditorExpanded]);

  const handleEditorDidMount: OnMount = (editor, monaco) => {
    if (!htmlEditorRef.current) {
      htmlEditorRef.current = editor;
    }

    monacoRef.current = monaco;

    // Configure Monaco workers to use CDN URLs to prevent route-relative path errors
    if (typeof window !== "undefined" && !(window as any).__monacoWorkersConfigured) {
      const cdnUrl = "https://cdn.jsdelivr.net/npm/monaco-editor@0.55.1/min/vs";
      (window as any).MonacoEnvironment = {
        getWorkerUrl: (_moduleId: string, label: string) => {
          if (label === "json") return `${cdnUrl}/assets/json.worker.js`;
          if (label === "css" || label === "scss" || label === "less") return `${cdnUrl}/assets/css.worker.js`;
          if (label === "html" || label === "handlebars" || label === "razor") return `${cdnUrl}/assets/html.worker.js`;
          if (label === "typescript" || label === "javascript") return `${cdnUrl}/assets/ts.worker.js`;
          return `${cdnUrl}/assets/editor.worker.js`;
        },
      };
      (window as any).__monacoWorkersConfigured = true;
    }
  };

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
    [],
  );

  return (
    <>
      <div
        className={`flex flex-col overflow-hidden rounded-xl border shadow-lg ${
          isLight
            ? "border-gray-200 bg-white shadow-gray-200/70"
            : "border-white/10 bg-[#0f1117] shadow-black/40"
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

            <div
              className={`hidden h-4 w-px sm:block ${
                isLight ? "bg-gray-300" : "bg-white/15"
              }`}
            />

            <div className="min-w-0">
              <span
                className={`block truncate text-sm font-semibold ${
                  isLight ? "text-gray-800" : "text-white"
                }`}
              >
                {title}
              </span>
              <p
                className={`mt-0.5 hidden text-xs sm:block ${
                  isLight ? "text-gray-500" : "text-gray-400"
                }`}
              >
                Edit HTML and CSS, then preview it like a real browser.
              </p>
            </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={handleReset}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                  isLight
                    ? "text-gray-600 hover:bg-gray-100"
                    : "text-gray-400 hover:bg-white/5"
                }`}
              >
                <RotateCcw className="h-3.5 w-3.5" />
                Reset
              </button>

              <button
                onClick={() => setIsEditorExpanded((prev) => !prev)}
                className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium transition-colors ${
                  isLight
                    ? "text-gray-600 hover:bg-gray-100"
                    : "text-gray-400 hover:bg-white/5"
                }`}
              >
                <Maximize2
                  className={`h-3.5 w-3.5 transition-transform duration-300 ${
                    isEditorExpanded ? "rotate-180" : ""
                  }`}
                />
              </button>

              <button
                onClick={handleRun}
                className={`flex items-center gap-1.5 rounded-lg px-4 py-2 text-xs font-semibold transition-all ${
                  isLight
                    ? "bg-emerald-600 text-white shadow-sm hover:bg-emerald-700"
                    : "bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg hover:opacity-95"
                }`}
              >
                <Play className="h-3.5 w-3.5 fill-current" />
                Run
              </button>
            </div>
        </div>

        <div
          className={`border-b px-4 py-2 text-xs ${
            isLight
              ? "border-gray-200 bg-white text-gray-500"
              : "border-white/10 bg-[#0b0d13] text-gray-400"
          }`}
        >
          Live preview updates automatically as you type. Use fullscreen to view
          your result like a web page.
        </div>

        <div className="flex flex-col lg:flex-row">
          <div
            className={`flex-1 lg:max-w-[50%] ${isLight ? "border-b border-gray-200 lg:border-b-0 lg:border-r" : "border-b border-white/10 lg:border-b-0 lg:border-r"}`}
          >
            <div
              className={`border-b px-3 py-2 ${
                isLight ? "border-gray-200" : "border-white/10"
              }`}
            >
              <span
                className={`text-[10px] font-semibold uppercase tracking-[0.16em] ${
                  isLight ? "text-gray-500" : "text-gray-400"
                }`}
              >
                HTML
              </span>
            </div>

            <div
              className={`h-[220px] transition-all duration-300 ${
                isEditorExpanded ? "lg:h-[calc(100vh-300px)]" : "lg:h-[300px]"
              }`}
            >
              <Editor
                path="html-editor"
                defaultLanguage="html"
                language="html"
                value={html}
                onChange={handleHtmlChange}
                onMount={handleEditorDidMount}
                theme={isLight ? "vs" : "vs-dark"}
                options={editorOptions}
              />
            </div>
          </div>

          <div className="flex-1 lg:max-w-[50%]">
            <div
              className={`border-b px-3 py-2 ${
                isLight ? "border-gray-200" : "border-white/10"
              }`}
            >
              <span
                className={`text-[10px] font-semibold uppercase tracking-[0.16em] ${
                  isLight ? "text-gray-500" : "text-gray-400"
                }`}
              >
                CSS
              </span>
            </div>

            <div
              className={`h-[220px] transition-all duration-300 ${
                isEditorExpanded ? "lg:h-[calc(100vh-300px)]" : "lg:h-[300px]"
              }`}
            >
              <Editor
                path="css-editor"
                defaultLanguage="css"
                language="css"
                value={css}
                onChange={handleCssChange}
                theme={isLight ? "vs" : "vs-dark"}
                options={editorOptions}
              />
            </div>
          </div>
        </div>

        <div
          className={`border-t ${
            isLight ? "border-gray-200" : "border-white/10"
          }`}
        >
          <div
            className={`flex items-center justify-between px-3 py-2 ${
              isLight ? "bg-gray-50" : "bg-[#0b0d13]"
            }`}
          >
            <div className="flex items-center gap-2">
              <Monitor
                className={`h-3.5 w-3.5 ${
                  isLight ? "text-gray-500" : "text-gray-400"
                }`}
              />
              <span
                className={`text-[10px] font-semibold uppercase tracking-[0.16em] ${
                  isLight ? "text-gray-500" : "text-gray-400"
                }`}
              >
                Preview
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsFullscreen(true)}
                className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium transition-colors ${
                  isLight
                    ? "text-gray-600 hover:bg-gray-100"
                    : "text-gray-400 hover:bg-white/5"
                }`}
              >
                <Maximize2 className="h-3.5 w-3.5" />
                Fullscreen
              </button>

              <button
                onClick={() => setShowPreview(!showPreview)}
                className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium transition-colors ${
                  isLight
                    ? "text-gray-600 hover:bg-gray-100"
                    : "text-gray-400 hover:bg-white/5"
                }`}
              >
                {showPreview ? (
                  <>
                    <Minimize2 className="h-3.5 w-3.5" />
                    Collapse
                  </>
                ) : (
                  <>
                    <Maximize2 className="h-3.5 w-3.5" />
                    Expand
                  </>
                )}
              </button>
            </div>
          </div>

          <div
            className={`relative overflow-hidden transition-all duration-300 ${
              showPreview ? "h-[260px] sm:h-[340px]" : "h-0"
            }`}
          >
            <iframe
              srcDoc={generateSrcDoc}
              title="browser-preview"
              className="h-full w-full border-0 bg-white"
              sandbox="allow-same-origin"
            />
          </div>
        </div>
      </div>

      {isFullscreen && (
        <div className="fixed inset-0 z-[200] bg-black/80 p-4 backdrop-blur-sm">
          <div
            className={`flex h-full flex-col overflow-hidden rounded-2xl border shadow-2xl ${
              isLight
                ? "border-gray-200 bg-white"
                : "border-white/10 bg-[#0f1117]"
            }`}
          >
            <div
              className={`flex items-center justify-between border-b px-4 py-3 ${
                isLight
                  ? "border-gray-200 bg-gray-50"
                  : "border-white/10 bg-[#1e1e2e]"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="flex gap-1.5">
                  <div className="h-3 w-3 rounded-full bg-red-500" />
                  <div className="h-3 w-3 rounded-full bg-yellow-500" />
                  <div className="h-3 w-3 rounded-full bg-emerald-500" />
                </div>

                <span
                  className={`text-sm font-semibold ${
                    isLight ? "text-gray-800" : "text-white"
                  }`}
                >
                  Full Browser Preview
                </span>
              </div>

              <button
                onClick={() => setIsFullscreen(false)}
                className={`rounded-lg p-2 transition-colors ${
                  isLight
                    ? "text-gray-600 hover:bg-gray-100"
                    : "text-gray-300 hover:bg-white/10"
                }`}
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <iframe
              srcDoc={generateSrcDoc}
              title="fullscreen-browser-preview"
              className="h-full w-full border-0 bg-white"
              sandbox="allow-same-origin"
            />
          </div>
        </div>
      )}
    </>
  );
}