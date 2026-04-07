"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Logo from "../logo";
import Notifications from "./Notifications";
import SearchBar from "../SearchBar";
import { clearUserSession } from "@/lib/auth";

interface HeaderProps {
  onMenuClick?: () => void;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "/api";
const IS_PRODUCTION = process.env.NODE_ENV === "production";

function resolveAssetUrl(path?: string | null) {
  if (!path) return null;

  // If it's a full URL, check if it's our own production domain
  if (path.startsWith("http://") || path.startsWith("https://")) {
    const productionDomain = "codemaster-q9oo.onrender.com"; // Replace with your actual production domain
    if (path.includes(productionDomain)) {
      // If in production, use the full URL directly
      if (IS_PRODUCTION) {
        return path;
      }
      // If in development, rewrite to local proxy
      const url = new URL(path);
      return `/api${url.pathname}`;
    }
    // External URL, return as is
    return path;
  }

  // Handle relative paths
  let cleanPath = path.trim().replace(/\/+/g, "/");
  if (cleanPath.startsWith("/")) cleanPath = cleanPath.substring(1);

  // If it's a profile pic upload filename (e.g., "image.jpg")
  if (!cleanPath.includes("/")) {
    return `/api/uploads/profiles/${cleanPath}`;
  }

  // If it's already a full relative path (e.g., "uploads/profiles/image.jpg")
  return `/api/${cleanPath}`;
}

function ProfileAvatarIcon() {
  return (
    <svg
      className="h-4.5 w-4.5 text-white"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
      />
    </svg>
  );
}

export default function Header({ onMenuClick }: HeaderProps) {
  const router = useRouter();

  const [scrolled, setScrolled] = useState(false);
  const [username, setUsername] = useState("");
  const [profilePic, setProfilePic] = useState<string | null>(null);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const loadHeaderUser = useCallback(() => {
    const savedUsername = localStorage.getItem("user_name") || "";
    const directProfilePic = localStorage.getItem("profile_pic");

    let parsedProfilePic: string | null = directProfilePic;

    const rawUser = localStorage.getItem("user");
    if (rawUser) {
      try {
        const parsed = JSON.parse(rawUser);
        // Prioritize the nested profile_pic from the user object
        parsedProfilePic = parsed?.profile_pic || parsed?.profilePic || parsedProfilePic;
      } catch {
        // ignore malformed cache
      }
    }

    setUsername(savedUsername);
    setProfilePic(parsedProfilePic);
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);

    const handleUserRefresh = () => {
      loadHeaderUser();
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("storage", handleUserRefresh);
    window.addEventListener(
      "user-profile-updated",
      handleUserRefresh as EventListener
    );

    loadHeaderUser();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("storage", handleUserRefresh);
      window.removeEventListener(
        "user-profile-updated",
        handleUserRefresh as EventListener
      );
    };
  }, [loadHeaderUser]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest("[data-user-menu-wrapper]")) {
        setUserMenuOpen(false);
      }
    };

    if (userMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [userMenuOpen]);

  const resolvedProfilePic = useMemo(() => {
    return resolveAssetUrl(profilePic);
  }, [profilePic]);

  const handleLogout = () => {
    clearUserSession();
    // Clear legacy keys that might be sticking around
    localStorage.removeItem("profile_pic");
    localStorage.removeItem("user_pic");
    localStorage.removeItem("user_name");
    localStorage.removeItem("user_email");
    
    setUserMenuOpen(false);
    router.replace("/login");
    router.refresh();
  };

  return (
    <header
      className={`fixed left-0 right-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "border-b border-white/10 bg-black/95 shadow-lg backdrop-blur-xl"
          : "border-b border-white/5 bg-black/80 backdrop-blur-md"
      }`}
    >
      <div className="mx-auto w-full pr-4 sm:pr-6 lg:pr-8">
        <div className="flex h-16 items-center justify-between gap-4">
          <div className="flex items-center">
            {/* Sidebar Toggle Button Area - Aligned with Sidebar Icons */}
            <div className="flex w-10 sm:w-12 items-center justify-center lg:flex">
              <button
                onClick={onMenuClick}
                className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-white/10 hover:text-white"
                aria-label="Toggle sidebar"
                type="button"
              >
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
            </div>

            {/* Logo and other left items */}
            <div className="flex items-center gap-1 pl-1">
              <div
                className="cursor-pointer"
                onClick={() => router.push("/dashboard")}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    router.push("/dashboard");
                  }
                }}
              >
                <Logo
                  size={40}
                  showText={true}
                  clickable={false}
                  className="transition-opacity hover:opacity-80"
                />
              </div>
            </div>
          </div>

          <div className="mx-4 hidden max-w-xl flex-1 md:block">
            <SearchBar />
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <Notifications />

            <div className="relative" data-user-menu-wrapper>
              <button
                onClick={() => setUserMenuOpen((prev) => !prev)}
                className="flex items-center gap-2 rounded-lg px-1 py-1 focus:outline-none"
                type="button"
                aria-label="Open user menu"
              >
                <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full border border-white/10 bg-gradient-to-r from-pink-500 to-purple-500 shadow-lg">
                  {resolvedProfilePic ? (
                    <img
                      src={resolvedProfilePic}
                      alt={username || "User avatar"}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <ProfileAvatarIcon />
                  )}
                </div>

                <span className="hidden text-sm font-medium text-white sm:block">
                  {username || "Profile"}
                </span>

                <svg
                  className={`h-4 w-4 text-gray-400 transition-transform ${
                    userMenuOpen ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 z-50 mt-2 w-52 rounded-lg border border-white/10 bg-[#0a0a0a] py-1 shadow-xl">
                  <Link
                    href="/dashboard"
                    onClick={() => setUserMenuOpen(false)}
                    className="block px-4 py-2 text-sm text-gray-300 transition-colors hover:bg-white/10 hover:text-white"
                  >
                    Dashboard
                  </Link>

                  <Link
                    href="/dashboard/profile"
                    onClick={() => setUserMenuOpen(false)}
                    className="block px-4 py-2 text-sm text-gray-300 transition-colors hover:bg-white/10 hover:text-white"
                  >
                    Profile Settings
                  </Link>

                  <Link
                    href="/dashboard/challenges"
                    onClick={() => setUserMenuOpen(false)}
                    className="block px-4 py-2 text-sm text-gray-300 transition-colors hover:bg-white/10 hover:text-white"
                  >
                    My Challenges
                  </Link>

                  <div className="my-1 border-t border-white/10" />

                  <button
                    onClick={handleLogout}
                    className="block w-full px-4 py-2 text-left text-sm text-red-400 transition-colors hover:bg-white/10 hover:text-red-300"
                    type="button"
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}