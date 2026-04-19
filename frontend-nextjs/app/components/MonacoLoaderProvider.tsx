"use client";

import { useEffect, useState } from "react";

export default function MonacoLoaderProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // Configure Monaco to use a singleton loader to prevent duplicate module errors
    // This ensures only one Monaco instance exists across the app
    const initMonaco = async () => {
      try {
        // @ts-ignore — monaco-editor exposes a global loader
        if (window.__monacoLoaderInitialized) {
          setLoaded(true);
          return;
        }

        const monaco = await import("monaco-editor");
        // @ts-ignore
        window.__monacoLoaderInitialized = true;
        setLoaded(true);
      } catch (err) {
        console.error("Monaco loader init failed:", err);
      }
    };

    initMonaco();
  }, []);

  if (!loaded) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-pink-500 border-t-transparent" />
      </div>
    );
  }

  return <>{children}</>;
}
