"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Header from "../components/dashboard/header";
import Sidebar from "../components/dashboard/Sidebar";
import { ThemeProvider, useTheme } from "../context/ThemeContext";

function DashboardContent({ children }: { children: React.ReactNode }) {
  const { theme } = useTheme();
  const isLight = theme === "light";
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      setSidebarOpen(!mobile);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  const contentBg = isLight ? "bg-gray-50" : "bg-[#020202]";
  const textColor = isLight ? "text-gray-900" : "text-white";
  const mainPadding = isMobile ? "pl-0" : sidebarOpen ? "lg:pl-62" : "lg:pl-20";

  return (
    <div className={`min-h-screen overflow-x-clip ${contentBg} ${textColor}`}>
      <Header onMenuClick={toggleSidebar} />

      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => {
          if (isMobile) setSidebarOpen(false);
        }}
        onToggle={toggleSidebar}
      />

      <main
        className={`relative overflow-visible pt-20 transition-all duration-300 ${mainPadding}`}
      >
        <div className="w-full min-w-0 overflow-visible px-4 py-6 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>
    </div>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const token = localStorage.getItem("terminal_token");
    const searchParams = new URLSearchParams(window.location.search);
    const isGuest = searchParams.get("guest") === "true";

    if (!token && !isGuest) {
      const redirectPath = window.location.pathname + window.location.search;
      router.replace(`/login?redirect=${encodeURIComponent(redirectPath)}`);
      return;
    }

    setIsAuthenticated(true);
    setCheckingAuth(false);
  }, [router, pathname]);

  const loaderBg = "bg-[#020202]";

  if (checkingAuth) {
    return (
      <div className={`flex min-h-screen items-center justify-center ${loaderBg}`}>
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-pink-500 border-t-transparent" />
      </div>
    );
  }

  if (!isAuthenticated) return null;

  return (
    <ThemeProvider>
      <DashboardContent>{children}</DashboardContent>
    </ThemeProvider>
  );
}