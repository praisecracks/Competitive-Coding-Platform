"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  AUTH_EMAIL_KEY,
  AUTH_USERNAME_KEY,
  getStoredUser,
  normalizeProfileImageUrl,
} from "@/lib/auth";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onToggle?: () => void;
}

interface NavItem {
  name: string;
  href: string;
  icon: React.ReactNode;
  activeIcon?: React.ReactNode;
  badge?: string;
  roles?: string[];
}

interface SidebarUser {
  name: string;
  email: string;
  profile_pic: string | null;
  rank: string;
  role: string;
  totalSolved: number;
  currentStreak: number;
  duelsWon: number;
  winRate: number;
}

const API_BASE_URL = "/api";

function resolveAssetUrl(path?: string | null) {
  if (!path) return null;

  const normalized = normalizeProfileImageUrl(path);
  if (!normalized) return null;

  if (
    normalized.startsWith("http://") ||
    normalized.startsWith("https://")
  ) {
    return normalized;
  }

  if (normalized.startsWith("/uploads/")) {
    return normalized;
  }

  if (normalized.startsWith("uploads/")) {
    return `/${normalized}`;
  }

  return normalized;
}

function getInitials(name?: string) {
  if (!name) return "U";
  const parts = name.trim().split(/\s+/).filter(Boolean);

  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }

  return `${parts[0][0] || ""}${parts[1][0] || ""}`.toUpperCase();
}

function readCachedSidebarUser(): SidebarUser {
  const savedName = localStorage.getItem(AUTH_USERNAME_KEY) || "Developer";
  const savedEmail = localStorage.getItem(AUTH_EMAIL_KEY) || "";
  const savedUser = getStoredUser();

  return {
    name: savedUser?.username || savedName,
    email: savedUser?.email || savedEmail,
    profile_pic: savedUser?.profile_pic || null,
    rank: (savedUser as any)?.rank || "Beginner",
    role: savedUser?.role || "user",
    totalSolved: typeof (savedUser as any)?.totalSolved === "number" ? (savedUser as any).totalSolved : 0,
    currentStreak:
      typeof (savedUser as any)?.currentStreak === "number"
        ? (savedUser as any).currentStreak
        : 0,
    duelsWon: typeof (savedUser as any)?.duelsWon === "number" ? (savedUser as any).duelsWon : 0,
    winRate: typeof (savedUser as any)?.winRate === "number" ? (savedUser as any).winRate : 0,
  };
}

function persistSidebarUser(user: SidebarUser) {
  localStorage.setItem(AUTH_USERNAME_KEY, user.name || "Developer");
  localStorage.setItem(AUTH_EMAIL_KEY, user.email || "");

  const rawUser = localStorage.getItem("user");

  let existing = {};
  if (rawUser) {
    try {
      existing = JSON.parse(rawUser);
    } catch {
      existing = {};
    }
  }

  localStorage.setItem(
    "user",
    JSON.stringify({
      ...existing,
      username: user.name,
      email: user.email,
      profile_pic: normalizeProfileImageUrl(user.profile_pic || ""),
      rank: user.rank,
      role: user.role,
      totalSolved: user.totalSolved,
      currentStreak: user.currentStreak,
      duelsWon: user.duelsWon,
      winRate: user.winRate,
    })
  );
}

export default function Sidebar({ isOpen, onClose, onToggle }: SidebarProps) {
  const pathname = usePathname();

  const [userData, setUserData] = useState<SidebarUser>({
    name: "Developer",
    email: "",
    profile_pic: null,
    rank: "Beginner",
    role: "user",
    totalSolved: 0,
    currentStreak: 0,
    duelsWon: 0,
    winRate: 0,
  });

  const [isMobile, setIsMobile] = useState(false);

  const loadUserDataFromCache = useCallback(() => {
    const cached = readCachedSidebarUser();
    setUserData(cached);
  }, []);

  const fetchLiveSidebarData = useCallback(async () => {
    const token = localStorage.getItem("terminal_token");

    if (!token) {
      loadUserDataFromCache();
      return;
    }

    try {
      const [profileRes, statsRes] = await Promise.all([
        fetch(`${API_BASE_URL}/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),
        fetch(`${API_BASE_URL}/dashboard/stats`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),
      ]);

      const cached = readCachedSidebarUser();
      let nextUser: SidebarUser = { ...cached };

      if (profileRes.ok) {
        const profile = await profileRes.json();

        nextUser = {
          ...nextUser,
          name: profile.username || cached.name || "Developer",
          email: profile.email || cached.email || "",
          profile_pic: normalizeProfileImageUrl(
            profile.profile_pic || cached.profile_pic || ""
          ) || null,
          rank: profile.rank || cached.rank || "Beginner",
          role: profile.role || cached.role || "user",
        };
      }

      if (statsRes.ok) {
        const stats = await statsRes.json();

        nextUser = {
          ...nextUser,
          totalSolved:
            typeof stats.totalSolved === "number"
              ? stats.totalSolved
              : nextUser.totalSolved,
          currentStreak:
            typeof stats.currentStreak === "number"
              ? stats.currentStreak
              : nextUser.currentStreak,
          duelsWon:
            typeof stats.duelsWon === "number"
              ? stats.duelsWon
              : nextUser.duelsWon,
          winRate:
            typeof stats.winRate === "number"
              ? stats.winRate
              : nextUser.winRate,
          rank:
            typeof stats.rank === "number" && stats.rank > 0
              ? `#${stats.rank}`
              : nextUser.rank,
        };
      }

      setUserData(nextUser);
      persistSidebarUser(nextUser);
    } catch (error) {
      console.error("Sidebar live sync failed:", error);
      loadUserDataFromCache();
    }
  }, [loadUserDataFromCache]);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    loadUserDataFromCache();
    void fetchLiveSidebarData();

    const handleStorage = () => loadUserDataFromCache();
    const handleFocus = () => {
      loadUserDataFromCache();
      void fetchLiveSidebarData();
    };
    const handleProfileRefresh = () => {
      loadUserDataFromCache();
      void fetchLiveSidebarData();
    };

    window.addEventListener("storage", handleStorage);
    window.addEventListener("focus", handleFocus);
    window.addEventListener(
      "user-profile-updated",
      handleProfileRefresh as EventListener
    );

    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("focus", handleFocus);
      window.removeEventListener(
        "user-profile-updated",
        handleProfileRefresh as EventListener
      );
    };
  }, [fetchLiveSidebarData, loadUserDataFromCache]);

  useEffect(() => {
    void fetchLiveSidebarData();
  }, [pathname, fetchLiveSidebarData]);

  const resolvedProfilePic = useMemo(() => {
    return resolveAssetUrl(userData.profile_pic);
  }, [userData.profile_pic]);

  const initials = useMemo(() => {
    return getInitials(userData.name);
  }, [userData.name]);

  const memberLabel = useMemo(() => {
    if (userData.totalSolved > 25) return "Power Member";
    if (userData.totalSolved > 0) return "Active Member";
    return "New Member";
  }, [userData.totalSolved]);

  const navItems: NavItem[] = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
          />
        </svg>
      ),
      activeIcon: (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
          />
        </svg>
      ),
    },
    {
      name: "Challenges",
      href: "/dashboard/challenges",
      icon: (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
          />
        </svg>
      ),
      activeIcon: (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
          />
        </svg>
      ),
    },


    
    {
      name: "Learning", 
      href: "/dashboard/learning", 
      icon: (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
          />
        </svg>
      ),
      activeIcon: (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
          />
        </svg>
      ),
    },






    {
      name: "Leaderboard",
      href: "/dashboard/leaderboard",
      icon: (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      ),
      activeIcon: (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      ),
    },
    {
      name: "Profile",
      href: "/dashboard/profile",
      icon: (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
          />
        </svg>
      ),
      activeIcon: (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
          />
        </svg>
      ),
    },
    {
      name: "Analytics",
      href: "/dashboard/analytics",
      icon: (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
          />
        </svg>
      ),
      activeIcon: (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
          />
        </svg>
      ),
    },
    {
      name: "Settings",
      href: "/dashboard/settings",
      icon: (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
      ),
      activeIcon: (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
      ),
    },
    {
      name: "Admin Center",
      href: "/dashboard/admin",
      roles: ["super_admin", "sub_admin"],
      icon: (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      activeIcon: (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
    },
    {
      name: "Users",
      href: "/dashboard/admin/users",
      roles: ["super_admin"],
      icon: (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
    },
  ];

  const filteredNavItems = useMemo(() => {
    return navItems.filter((item) => {
      if (!item.roles) return true;
      return item.roles.includes(userData.role);
    });
  }, [userData.role]);

  const isActive = (href: string) => {
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(href);
  };

  const sidebarContent = (
    <div className="flex h-full flex-col border-r border-white/10 bg-[#0a0a0a]/95 backdrop-blur-xl">
      <div className="border-b border-white/10 p-5">
        <div className="flex items-center gap-3">
          <div className="relative h-11 w-11 shrink-0 overflow-visible rounded-full">
            <div className="h-11 w-11 overflow-hidden rounded-full border-2 border-white/10 bg-gradient-to-br from-pink-500/20 to-purple-500/20 shadow-[0_0_20px_rgba(236,72,153,0.15)]">
              {resolvedProfilePic ? (
                <img
                  src={resolvedProfilePic}
                  alt={userData.name}
                  className="h-full w-full object-cover transition-transform duration-500 hover:scale-110"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  <span className="text-sm font-bold text-white">{initials}</span>
                </div>
              )}
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 z-10 h-3.5 w-3.5 rounded-full border-2 border-[#0a0a0a] bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.55)]" />
          </div>

          <div className="min-w-0 flex-1">
            <h3 className="truncate text-sm font-semibold text-white">
              {userData.name || "Developer"}
            </h3>
            <p className="truncate text-[11px] text-gray-500">
              {memberLabel}
            </p>
          </div>
        </div>

        <div className="mt-6 rounded-[20px] border border-white/5 bg-white/[0.02] p-4 shadow-inner">
          <div className="mb-3 flex items-center justify-between px-1">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-pink-500/80">
              Battle Stats
            </p>
            <div className="h-1 w-1 animate-pulse rounded-full bg-pink-500" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="group relative">
              <p className="text-[10px] text-gray-500 transition-colors group-hover:text-gray-400">
                Victories
              </p>
              <div className="mt-1 flex items-baseline gap-1.5">
                <p className="text-xl font-bold text-white">{userData.duelsWon}</p>
                <span className="text-[10px]">🏆</span>
              </div>
            </div>
            <div className="group relative">
              <p className="text-[10px] text-gray-500 transition-colors group-hover:text-gray-400">
                Win Rate
              </p>
              <div className="mt-1 flex items-baseline gap-1.5">
                <p className="text-xl font-bold text-white">{userData.winRate}%</p>
              </div>
            </div>
          </div>

          <div className="mt-4 border-t border-white/5 pt-3">
            <div className="flex items-center justify-between text-[10px]">
              <span className="text-gray-500">Current Rank</span>
              <span className="font-medium text-pink-400">{userData.rank}</span>
            </div>
          </div>
        </div>
      </div>

      <nav className="no-scrollbar flex-1 overflow-y-auto py-6">
        {filteredNavItems.map((item) => {
          const active = isActive(item.href);

          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => isMobile && onClose()}
              className={`group relative mx-3 mb-1.5 flex items-center gap-3.5 rounded-xl px-4 py-3 transition-all duration-300 ${
                active
                  ? "bg-white/[0.03] text-white shadow-[inset_0_0_20px_rgba(255,255,255,0.02)]"
                  : "text-gray-500 hover:bg-white/[0.02] hover:text-gray-200"
              }`}
            >
              {active && (
                <motion.div
                  layoutId="active-pill"
                  className="absolute left-0 h-5 w-1 rounded-r-full bg-pink-500 shadow-[0_0_15px_rgba(236,72,153,0.8)]"
                />
              )}

              <span
                className={`transition-all duration-300 ${
                  active
                    ? "scale-110 text-pink-500 drop-shadow-[0_0_8px_rgba(236,72,153,0.4)]"
                    : "group-hover:scale-105 group-hover:text-white"
                }`}
              >
                {active ? item.activeIcon || item.icon : item.icon}
              </span>

              <span
                className={`text-sm font-medium transition-all duration-300 ${
                  active ? "opacity-100" : "opacity-70 group-hover:opacity-100"
                }`}
              >
                {item.name}
              </span>

              {item.badge && !active && (
                <span className="ml-auto rounded-lg border border-pink-500/20 bg-pink-500/10 px-2 py-0.5 text-[10px] text-pink-300">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-white/10 p-5">
        {!isMobile && onToggle && (
          <button
            onClick={onToggle}
            className="mb-3 flex w-full items-center justify-center gap-2 rounded-lg px-3 py-2 text-gray-400 transition-colors hover:bg-white/5 hover:text-white"
            type="button"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
              />
            </svg>
            <span className="text-xs">Collapse</span>
          </button>
        )}

        <p className="text-center text-[10px] text-gray-600">CODEMASTER v2.0</p>
        <p className="mt-1 text-center text-[9px] text-gray-700">© 2026</p>
      </div>
    </div>
  );

  if (!isMobile) {
    return (
      <motion.aside
        initial={false}
        animate={{ width: isOpen ? 256 : 84 }}
        transition={{ duration: 0.22, ease: "easeInOut" }}
        className="fixed bottom-0 left-0 top-16 z-40 overflow-hidden border-r border-white/10 bg-[#0a0a0a]"
      >
        <div className="no-scrollbar h-full overflow-y-auto">
          {isOpen ? (
            sidebarContent
          ) : (
            <div className="flex flex-col items-center py-4">
              <div className="relative mb-4 h-11 w-11 overflow-visible rounded-full">
                <div className="h-11 w-11 overflow-hidden rounded-full border border-white/10 bg-gradient-to-r from-pink-500 to-purple-500">
                  {resolvedProfilePic ? (
                    <img
                      src={resolvedProfilePic}
                      alt={userData.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <span className="text-sm font-bold text-white">{initials}</span>
                    </div>
                  )}
                </div>

                <span className="absolute -bottom-0.5 -right-0.5 z-10 h-3.5 w-3.5 rounded-full border-2 border-[#0a0a0a] bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.55)]" />
              </div>

              {filteredNavItems.map((item) => {
                const active = isActive(item.href);

                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`my-1 flex h-12 w-12 items-center justify-center rounded-lg transition-all duration-200 ${
                      active
                        ? "bg-gradient-to-r from-pink-500/10 to-purple-500/10 text-pink-400"
                        : "text-gray-400 hover:bg-white/5 hover:text-white"
                    }`}
                    title={item.name}
                  >
                    <span className="h-5 w-5">
                      {active ? item.activeIcon || item.icon : item.icon}
                    </span>
                  </Link>
                );
              })}

              {onToggle && (
                <button
                  onClick={onToggle}
                  className="mt-4 flex h-12 w-12 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-white/5 hover:text-white"
                  title="Expand"
                  type="button"
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 5l7 7-7 7M5 5l7 7-7 7"
                    />
                  </svg>
                </button>
              )}
            </div>
          )}
        </div>
      </motion.aside>
    );
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/80"
            onClick={onClose}
          />
          <motion.aside
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            transition={{ type: "spring", damping: 25 }}
            className="fixed bottom-0 left-0 top-0 z-50 w-64"
          >
            {sidebarContent}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}