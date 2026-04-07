"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Image from "next/image";
import logo from "../../assets/CodeMaster_Logo.png";
import SearchBar from "./SearchBar";
import {
  AUTH_EMAIL_KEY,
  AUTH_TOKEN_KEY,
  AUTH_USERNAME_KEY,
  clearUserSession,
  getStoredUser,
} from "@/lib/auth";

interface HeaderProps {
  onMenuClick?: () => void;
}

interface HeaderUser {
  name: string;
  email: string;
  avatar: string | null;
}

export default function Header({ onMenuClick }: HeaderProps) {
  const pathname = usePathname();
  const router = useRouter();

  const [scrolled, setScrolled] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [profilePic, setProfilePic] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [userData, setUserData] = useState<HeaderUser | null>(null);

  const isDashboard = pathname?.startsWith("/dashboard");
  const isAuthPage =
    pathname === "/login" ||
    pathname === "/signup" ||
    pathname === "/forgot-password" ||
    pathname === "/forgotpassword";

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 16);
    window.addEventListener("scroll", handleScroll);

    const checkAuth = () => {
      const token = localStorage.getItem(AUTH_TOKEN_KEY);
      const savedUserName = localStorage.getItem(AUTH_USERNAME_KEY);
      const savedEmail = localStorage.getItem(AUTH_EMAIL_KEY);
      const storedUser = getStoredUser();

      const resolvedUsername =
        storedUser?.username || savedUserName || "";
      const resolvedEmail = storedUser?.email || savedEmail || "";
      const resolvedProfilePic = storedUser?.profile_pic || "";

      if (token && resolvedUsername) {
        setIsLoggedIn(true);
        setUsername(resolvedUsername);
        setProfilePic(resolvedProfilePic || null);
        setUserData({
          name: resolvedUsername,
          email: resolvedEmail,
          avatar: resolvedProfilePic || null,
        });
      } else {
        setIsLoggedIn(false);
        setUsername("");
        setProfilePic(null);
        setUserData(null);
      }
    };

    checkAuth();
    window.addEventListener("storage", checkAuth);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("storage", checkAuth);
    };
  }, []);

  const handleLogout = () => {
    clearUserSession();
    setIsLoggedIn(false);
    setUsername("");
    setProfilePic(null);
    setUserData(null);
    setMenuOpen(false);

    router.push("/");
    router.refresh();
  };

  const getNavLinks = () => {
    const baseLinks = [
      { name: "Challenges", href: "/dashboard/challenges" },
      { name: "Leaderboard", href: "/dashboard/leaderboard" },
    ];

    if (isLoggedIn) {
      return [...baseLinks, { name: "Dashboard", href: "/dashboard" }];
    }

    return [
      { name: "Home", href: "/" },
      { name: "Login", href: "/login" },
      { name: "Sign Up", href: "/signup" },
    ];
  };

  const isActive = (path: string) => pathname === path;

  return (
    <header
      className={`fixed left-0 top-0 z-[70] w-full border-b transition-all duration-300 ${
        isAuthPage
          ? scrolled
            ? "border-white/10 bg-black/80 backdrop-blur-2xl"
            : "border-transparent bg-transparent"
          : scrolled
          ? "border-white/10 bg-black/80 backdrop-blur-2xl"
          : "border-white/5 bg-black/30 backdrop-blur-xl"
      }`}
    >
      <div className="mx-auto flex h-[78px] max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-3">
          {isDashboard && isLoggedIn && (
            <button
              onClick={onMenuClick}
              className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-white transition hover:border-fuchsia-400/40/[0.08] lg:hidden"
              aria-label="Toggle sidebar"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          )}

          <Link
            href={isLoggedIn ? "/dashboard" : "/signup"}
            className="group flex items-center gap-3"
          >
            <div className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-full bg-white/[0.05] shadow-[0_8px_30px_rgba(217,70,239,0.10)] transition-all duration-300 group-hover:border-fuchsia-400/30 group-hover:bg-white/[0.08]">
              <Image
                src={logo}
                alt="CodeMaster Logo"
                width={40}
                height={40}
                className="h-full w-full object-contain p-1"
                priority
              />
            </div>

            <div className="flex flex-col leading-none">
              <span className="text-base font-semibold tracking-tight text-white sm:text-lg">
                CODEMASTER
              </span>
              <span className="text-[10px] uppercase tracking-[0.28em] text-white/40">
                {isAuthPage
                  ? "Account Access"
                  : isDashboard
                  ? "Developer Workspace"
                  : "Competitive Coding Platform"}
              </span>
            </div>
          </Link>
        </div>

        {isLoggedIn && !isDashboard && !isAuthPage && (
          <div className="hidden max-w-md flex-1 sm:flex">
            <SearchBar />
          </div>
        )}

        {!isDashboard && !isAuthPage && (
          <nav className="hidden lg:block">
            <ul className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-2 py-2">
              {getNavLinks().map((link) => {
                const active = isActive(link.href);

                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className={`rounded-full px-4 py-2 text-xs font-medium transition-all ${
                        active
                          ? "bg-white text-black"
                          : "text-white/60/[0.06] hover:text-white"
                      }`}
                    >
                      {link.name}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        )}

        {isAuthPage ? (
          <div className="hidden items-center gap-3 sm:flex">
            <Link
              href="/login"
              className="rounded-full px-4 py-2 text-sm font-medium text-white/65 transition hover:text-white"
            >
              Login
            </Link>
            <Link
              href="/signup"
              className="rounded-full border border-white/10 bg-purple-700 px-5 py-2.5 text-sm font-semibold text-white transition/90"
            >
              Get Started
            </Link>
          </div>
        ) : !isLoggedIn ? (
          <div className="hidden items-center gap-3 sm:flex">
            <Link
              href="/login"
              className="rounded-full px-4 py-2 text-sm font-medium text-white/65 transition hover:text-white"
            >
              Login
            </Link>
            <Link
              href="/signup"
              className="rounded-full border border-white/10 bg-white px-5 py-2.5 text-sm font-semibold text-black transition/90"
            >
              Get Started
            </Link>
          </div>
        ) : (
          <div className="relative">
            <button
              onClick={() => setMenuOpen((prev) => !prev)}
              className="group flex items-center gap-3 rounded-full border border-white/10 bg-white/[0.04] px-2 py-2 transition hover:border-fuchsia-400/30/[0.08]"
            >
              <div className="relative">
                <div className="h-10 w-10 overflow-hidden rounded-full border border-fuchsia-400/20 bg-gradient-to-br from-fuchsia-500/10 to-purple-500/10">
                  {profilePic ? (
                    <img
                      src={profilePic}
                      alt={username}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-sm font-semibold text-fuchsia-300">
                      {username.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <div className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-black bg-emerald-400" />
              </div>

              <div className="hidden text-left md:block">
                <p className="text-xs font-medium text-white">{username}</p>
                <p className="text-[11px] text-white/40">Active account</p>
              </div>

              <svg
                className={`hidden h-4 w-4 text-white/40 transition-transform md:block ${
                  menuOpen ? "rotate-180" : ""
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

            {menuOpen && (
              <div className="absolute right-0 mt-3 w-60 overflow-hidden rounded-2xl border border-white/10 bg-[#090909]/95 py-2 shadow-2xl backdrop-blur-2xl">
                <div className="border-b border-white/8 px-4 py-3">
                  <p className="text-sm font-semibold text-white">{username}</p>
                  <p className="truncate text-xs text-white/40">
                    {userData?.email || "user@codemaster.com"}
                  </p>
                </div>

                <Link
                  href="/dashboard"
                  onClick={() => setMenuOpen(false)}
                  className="block px-4 py-3 text-sm text-white/70 transition/[0.05] hover:text-white"
                >
                  Dashboard
                </Link>

                <Link
                  href="/profile"
                  onClick={() => setMenuOpen(false)}
                  className="block px-4 py-3 text-sm text-white/70 transition/[0.05] hover:text-white"
                >
                  Profile Settings
                </Link>

                <Link
                  href="/dashboard/challenges"
                  onClick={() => setMenuOpen(false)}
                  className="block px-4 py-3 text-sm text-white/70 transition/[0.05] hover:text-white"
                >
                  My Challenges
                </Link>

                <div className="mt-2 border-t border-white/8 pt-2">
                  <button
                    onClick={handleLogout}
                    className="w-full px-4 py-3 text-left text-sm text-red-400 transition hover:bg-red-500/10 hover:text-red-300"
                  >
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {!isDashboard && (
          <button
            type="button"
            onClick={() => setMenuOpen((prev) => !prev)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-white transition hover:border-fuchsia-400/40/[0.08] lg:hidden"
            aria-label="Toggle menu"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              viewBox="0 0 24 24"
            >
              {menuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        )}
      </div>

      {!isDashboard && menuOpen && (
        <div className="border-t border-white/10 bg-[#090909]/95 px-4 py-5 backdrop-blur-2xl lg:hidden">
          {isAuthPage ? (
            <div className="flex flex-col gap-3">
              <Link
                href="/login"
                onClick={() => setMenuOpen(false)}
                className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-center text-sm font-medium text-white transition"
              >
                Login
              </Link>
              <Link
                href="/signup"
                onClick={() => setMenuOpen(false)}
                className="rounded-2xl bg-purple-700 px-4 py-3 text-center text-sm font-semibold text-white transition hover:bg-purple/80"
              >
                Get Started
              </Link>
            </div>
          ) : !isLoggedIn ? (
            <div className="flex flex-col gap-3">
              {getNavLinks().map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="rounded-2xl px-4 py-3 text-sm font-medium text-white/70 transition/[0.05] hover:text-white"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              <Link
                href="/dashboard"
                onClick={() => setMenuOpen(false)}
                className="rounded-2xl px-4 py-3 text-sm font-medium text-white/70 transition/[0.05] hover:text-white"
              >
                Dashboard
              </Link>
              <Link
                href="/profile"
                onClick={() => setMenuOpen(false)}
                className="rounded-2xl px-4 py-3 text-sm font-medium text-white/70 transition/[0.05] hover:text-white"
              >
                Profile Settings
              </Link>
              <button
                onClick={handleLogout}
                className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-left text-sm font-medium text-red-400 transition hover:bg-red-500/20"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
}