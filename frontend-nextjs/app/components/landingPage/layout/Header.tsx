"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import logo from "../../../../assets/CodeMaster_Logo.png";

const navLinks = [
  { name: "Features", href: "#features" },
  { name: "Challenges", href: "#challenges" },
  { name: "Pricing", href: "#pricing" },
  { name: "FAQ", href: "#faq" },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <header
        className="fixed top-0 left-0 z-50 w-full bg-[#020202]"
      >
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl border border-white/[0.08] bg-white/[0.03] shadow-[0_0_20px_rgba(236,72,153,0.06)] transition-all duration-300 group-hover:scale-105 group-hover:border-pink-500/25">
              <Image
                src={logo}
                alt="CodeMaster"
                width={40}
                height={40}
                className="h-full w-full object-contain"
                priority
              />
            </div>
            <div className="flex flex-col leading-none">
              <span className="text-base font-bold tracking-tight text-white">
                CODEMASTER
              </span>
              <span className="text-[9px] uppercase tracking-[0.3em] text-white/35">
                Competitive Coding
              </span>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="hidden items-center gap-7 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-sm font-medium text-white/50 transition-colors duration-200 hover:text-white"
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* CTA Buttons */}
          <div className="hidden items-center gap-3 md:flex">
            <Link
              href="/login"
              className="text-sm font-medium text-white/50 transition-colors duration-200 hover:text-white"
            >
              Sign In
            </Link>
            <Link
              href="/signup"
              className="rounded-full bg-gradient-to-r from-pink-500 to-purple-600 px-5 py-2.5 text-sm font-semibold text-white shadow-[0_0_20px_rgba(236,72,153,0.2)] transition-all duration-300 hover:shadow-[0_0_32px_rgba(236,72,153,0.35)]"
            >
              Get Started
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] p-2.5 text-white transition-colors duration-200 hover:border-pink-500/30 hover:bg-white/[0.08] md:hidden"
            aria-label="Open menu"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 7h16M4 12h16M4 17h16" />
            </svg>
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <motion.div
        className={`fixed inset-0 z-[60] md:hidden ${menuOpen ? "pointer-events-auto" : "pointer-events-none"}`}
        initial={false}
        animate={menuOpen ? { opacity: 1 } : { opacity: 0 }}
      >
        <motion.div
          className="absolute inset-0 bg-[#020202]/98 backdrop-blur-2xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        />
        
        {/* Background glows for mobile menu */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            animate={{ scale: [1, 1.15, 1], opacity: [0.08, 0.12, 0.08] }}
            transition={{ duration: 6, repeat: Infinity }}
            className="absolute -top-20 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-pink-500/10 blur-[100px]"
          />
          <motion.div
            animate={{ scale: [1, 1.1, 1], opacity: [0.06, 0.1, 0.06] }}
            transition={{ duration: 8, repeat: Infinity, delay: 1 }}
            className="absolute bottom-0 right-0 h-56 w-56 rounded-full bg-purple-600/10 blur-[90px]"
          />
        </div>

        <div className="relative flex min-h-screen flex-col px-6 pt-6">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3" onClick={closeMenu}>
              <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-white/[0.04]">
                <Image src={logo} alt="CodeMaster" width={40} height={40} className="h-full w-full object-contain" priority />
              </div>
              <span className="text-base font-bold text-white">CODEMASTER</span>
            </Link>
            <button
              type="button"
              onClick={closeMenu}
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-white"
              aria-label="Close menu"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <nav className="flex flex-1 flex-col items-center justify-center gap-6">
            {navLinks.map((link, index) => (
              <motion.div
                key={link.name}
                initial={{ opacity: 0, y: 15 }}
                animate={menuOpen ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.1 + index * 0.07 }}
              >
                <Link
                  href={link.href}
                  onClick={closeMenu}
                  className="text-2xl font-semibold text-white transition-colors hover:text-pink-400"
                >
                  {link.name}
                </Link>
              </motion.div>
            ))}
          </nav>

          <div className="flex flex-col gap-3 pb-8">
            <Link href="/login" onClick={closeMenu} className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-center font-medium text-white">
              Sign In
            </Link>
            <Link href="/signup" onClick={closeMenu} className="rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 px-4 py-3 text-center font-semibold text-white">
              Get Started
            </Link>
          </div>
        </div>
      </motion.div>
    </>
  );
}