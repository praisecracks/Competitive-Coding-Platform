"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Header from "../components/dashboard/header";
import Sidebar from "../components/dashboard/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const token = localStorage.getItem("terminal_token");

    if (!token) {
      router.replace(`/login?redirect=${pathname}`);
      return;
    }

    setIsAuthenticated(true);
    setCheckingAuth(false);

    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      setSidebarOpen(!mobile);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, [router, pathname]);

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  if (checkingAuth) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#020202]">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-pink-500 border-t-transparent" />
      </div>
    );
  }

  if (!isAuthenticated) return null;

  const mainPadding = isMobile
    ? "pl-0"
    : sidebarOpen
    ? "lg:pl-62"
    : "lg:pl-20";

  return (
    <div className="min-h-screen bg-[#020202] text-white overflow-x-clip">
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