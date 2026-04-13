"use client";
import { createContext, useContext, useEffect, useState } from "react";

const THEME_STORAGE_KEY = "codemaster_theme";

const ThemeContext = createContext({ theme: "dark", toggleTheme: () => {}, isLight: false });

function getStoredTheme(): string {
  if (typeof window === "undefined") return "dark";
  const stored = localStorage.getItem(THEME_STORAGE_KEY);
  return stored === "light" || stored === "dark" ? stored : "dark";
}

async function saveUserThemeToAPI(theme: string): Promise<void> {
  try {
    const token = localStorage.getItem("terminal_token");
    if (!token) return;

    // Timeout after 3 seconds - don't block UI for this
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);

    await fetch("/api/profile", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ theme }),
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);
  } catch {
    // Silently fail - localStorage already has the value
  }
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState("dark");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const stored = getStoredTheme();
    setTheme(stored);
    
    if (stored === "light") {
      document.documentElement.classList.add("light-mode");
    } else {
      document.documentElement.classList.remove("light-mode");
    }
    
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    localStorage.setItem(THEME_STORAGE_KEY, newTheme);
    
    if (newTheme === "light") {
      document.documentElement.classList.add("light-mode");
    } else {
      document.documentElement.classList.remove("light-mode");
    }
    
    // Save to API in background (non-blocking)
    saveUserThemeToAPI(newTheme);
  };

  const isLight = theme === "light";

  if (!mounted) {
    return (
      <ThemeContext.Provider value={{ theme: "dark", toggleTheme, isLight: false }}>
        <div className="bg-[#050505] text-white">
          {children}
        </div>
      </ThemeContext.Provider>
    );
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, isLight }}>
      <div className={isLight ? "bg-white text-black" : "bg-[#050505] text-white"}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);