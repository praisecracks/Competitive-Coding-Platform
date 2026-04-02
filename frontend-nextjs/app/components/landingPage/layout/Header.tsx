"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import logo from "../../../../assets/CodeMaster_Logo.png";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Features", href: "#features" },
  { name: "Challenges", href: "#challenges" },
  { name: "Pricing", href: "#pricing" },
  { name: "FAQ", href: "#faq" },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 w-full z-50 border-b border-white/10 bg-[#020202]/90 backdrop-blur-md">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-white/5 shadow-[0_0_20px_rgba(236,72,153,0.08)]">
            <Image
              src={logo}
              alt="CodeMaster Logo"
              width={44}
              height={44}
              className="h-full w-full object-contain"
              priority
            />
          </div>

          <div className="flex flex-col leading-none">
            <span className="text-lg font-black uppercase tracking-tight text-white">
              CODEMASTER
            </span>
            <span className="text-[10px] uppercase tracking-[0.28em] text-pink-400">
              Competitive Coding Platform
            </span>
          </div>
        </Link>

        <nav className="hidden items-center gap-6 lg:gap-8 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="relative text-sm font-medium capitalize text-gray-300 transition-colors duration-200 hover:text-pink-400"
            >
              {link.name}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <Link
            href="/login"
            className="rounded-xl border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-medium text-white transition-all duration-200 hover:border-pink-400/40 hover:bg-white/10"
          >
            Login
          </Link>

          <Link
            href="/signup"
            className="rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 px-5 py-2.5 text-sm font-semibold text-white shadow-[0_0_25px_rgba(236,72,153,0.22)] transition-all duration-200 hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(168,85,247,0.28)]"
          >
            Get Started
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setMenuOpen((prev) => !prev)}
          className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/5 p-2.5 text-white transition hover:border-pink-400/40 hover:bg-white/10 md:hidden"
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
                d="M4 7h16M4 12h16M4 17h16"
              />
            )}
          </svg>
        </button>
      </div>

      {menuOpen && (
        <div className="border-t border-white/10 bg-[#070707]/95 px-4 py-5 backdrop-blur-xl md:hidden">
          <nav className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="rounded-lg px-2 py-2 text-sm font-medium text-gray-300 transition hover:bg-white/5 hover:text-pink-400"
              >
                {link.name}
              </Link>
            ))}
          </nav>

          <div className="mt-5 flex flex-col gap-3">
            <Link
              href="/login"
              onClick={() => setMenuOpen(false)}
              className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-center text-sm font-medium text-white transition hover:border-pink-400/40 hover:bg-white/10"
            >
              Login
            </Link>

            <Link
              href="/signup"
              onClick={() => setMenuOpen(false)}
              className="rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 px-4 py-3 text-center text-sm font-semibold text-white shadow-[0_0_25px_rgba(236,72,153,0.22)] transition hover:opacity-95"
            >
              Get Started
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}