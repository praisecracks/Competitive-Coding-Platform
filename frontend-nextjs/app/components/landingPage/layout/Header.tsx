"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import logo from "../../../../assets/CodeMaster_Logo.png";

const navLinks = [
  { name: "Features", href: "#features" },
  { name: "Challenges", href: "#challenges" },
  { name: "Pricing", href: "#pricing" },
  { name: "FAQ", href: "#faq" },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const headerRef = useRef<HTMLElement>(null);

  // Scroll handler with parallax effect for header
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
      
      // Parallax effect: header background intensity changes with scroll
      if (headerRef.current) {
        const scrollPercent = Math.min(window.scrollY / 500, 1);
        headerRef.current.style.setProperty('--scroll-intensity', scrollPercent.toString());
      }
    };
    
    handleScroll();
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Mouse move handler for cursor-following glow effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Body scroll lock for mobile menu
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
      {/* Cursor Glow Effect - follows mouse with color blending */}
      <div 
        className="fixed pointer-events-none z-50 rounded-full transition-transform duration-150 will-change-transform"
        style={{
          left: mousePosition.x - 150,
          top: mousePosition.y - 150,
          width: '300px',
          height: '300px',
          background: `radial-gradient(circle, rgba(236,72,153,0.15) 0%, rgba(139,92,246,0.1) 40%, rgba(0,0,0,0) 70%)`,
          filter: 'blur(40px)',
          transform: `translate(${mousePosition.x > 0 ? 0 : -9999}px, ${mousePosition.y > 0 ? 0 : -9999}px)`,
        }}
      />

      {/* Floating animated background shapes */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div 
          className="absolute rounded-full mix-blend-screen animate-float-1"
          style={{
            width: '400px',
            height: '400px',
            top: '10%',
            left: '-10%',
            background: 'radial-gradient(circle, rgba(236,72,153,0.08), transparent)',
            filter: 'blur(60px)',
          }}
        />
        <div 
          className="absolute rounded-full animate-float-2"
          style={{
            width: '350px',
            height: '350px',
            bottom: '5%',
            right: '-5%',
            background: 'radial-gradient(circle, rgba(139,92,246,0.08), transparent)',
            filter: 'blur(55px)',
          }}
        />
        <div 
          className="absolute rounded-full animate-float-3"
          style={{
            width: '250px',
            height: '250px',
            top: '40%',
            right: '15%',
            background: 'radial-gradient(circle, rgba(59,130,246,0.06), transparent)',
            filter: 'blur(50px)',
          }}
        />
      </div>

      <header
        ref={headerRef}
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
          scrolled 
            ? "bg-[#020202]/80 backdrop-blur-2xl shadow-[0_8px_32px_rgba(0,0,0,0.4)]" 
            : "bg-transparent"
        }`}
        style={{
          borderBottom: 'none',
        }}
      >
        <div
          className={`mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 transition-all duration-500 ${
            scrolled ? "scale-[0.98]" : "scale-100"
          }`}
        >
          <Link href="/" className="flex items-center gap-3 group" onClick={closeMenu}>
            <div className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-white/5 shadow-[0_0_30px_rgba(236,72,153,0.08)] transition-all duration-300 group-hover:scale-105 group-hover:shadow-[0_0_40px_rgba(236,72,153,0.2)] group-hover:border-pink-500/30">
              <Image
                src={logo}
                alt="CodeMaster Logo"
                width={44}
                height={44}
                className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-110"
                priority
              />
            </div>

            <div className="flex flex-col leading-none">
              <span className="text-lg font-bold tracking-tight text-white transition-all duration-300 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-pink-400 group-hover:to-purple-400 group-hover:bg-clip-text">
                CODEMASTER
              </span>
              <span className="text-[10px] uppercase tracking-[0.28em] text-white/40 group-hover:text-white/60 transition-colors duration-300">
                Competitive Coding, Reimagined
              </span>
            </div>
          </Link>

          <nav className="hidden items-center gap-8 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="relative text-sm font-medium text-white/60 transition-all duration-300 hover:text-white group"
              >
                {link.name}
                
              </Link>
            ))}
          </nav>

          <div className="hidden items-center gap-3 md:flex">
            <Link
              href="/login"
              className="relative text-sm font-medium text-white/60 transition-all duration-300 hover:text-white "
            >
              Sign In
            </Link>

            <Link
              href="/signup"
              className="relative overflow-hidden rounded-full bg-gradient-to-r from-pink-500 to-purple-600 px-6 py-2.5 text-sm font-semibold text-white shadow-[0_0_30px_rgba(236,72,153,0.25)] transition-all duration-300 hover:scale-[1.04] hover:shadow-[0_0_45px_rgba(236,72,153,0.4)] before:absolute before:inset-0 before:bg-gradient-to-r before:from-white/20 before:to-transparent before:-translate-x-full before:transition-transform before:duration-500 hover:before:translate-x-0 overflow-hidden"
            >
              Start Free
            </Link>
          </div>

          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/5 p-2.5 text-white transition-all duration-300 hover:border-pink-400/40 hover:bg-white/10 hover:scale-105 md:hidden"
            aria-label="Open menu"
            aria-expanded={menuOpen}
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
                d="M4 7h16M4 12h16M4 17h16"
              />
            </svg>
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay - Enhanced with animations */}
      <div
        className={`fixed inset-0 z-[60] md:hidden transition-all duration-500 ${
          menuOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
      >
        <div className="absolute inset-0 bg-[#020202]/96 backdrop-blur-2xl" />

        {/* Animated background gradients for mobile menu */}
        <div className="absolute inset-0 overflow-hidden">
          <div 
            className="absolute -top-20 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-pink-500/10 blur-[110px] animate-pulse-slow" 
          />
          <div 
            className="absolute bottom-0 right-0 h-64 w-64 rounded-full bg-purple-600/10 blur-[110px] animate-pulse-slow animation-delay-1000" 
          />
          <div 
            className="absolute bottom-20 left-0 h-52 w-52 rounded-full bg-fuchsia-500/10 blur-[100px] animate-pulse-slow animation-delay-2000" 
          />
        </div>

        <div className="relative flex min-h-screen flex-col px-6 pt-6 pb-8">
          <div className="flex items-center justify-between">
            <Link
              href="/"
              className="flex items-center gap-3 group"
              onClick={closeMenu}
            >
              <div className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-white/5 shadow-[0_0_20px_rgba(236,72,153,0.08)] transition-all duration-300 group-hover:scale-105">
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
                <span className="text-lg font-bold tracking-tight text-white group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-pink-400 group-hover:to-purple-400 group-hover:bg-clip-text transition-all duration-300">
                  CODEMASTER
                </span>
                <span className="text-[10px] uppercase tracking-[0.28em] text-white/40">
                  Competitive Coding, Reimagined
                </span>
              </div>
            </Link>

            <button
              type="button"
              onClick={closeMenu}
              className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white transition-all duration-300 hover:border-pink-400/40 hover:bg-white/10 hover:scale-105"
              aria-label="Close menu"
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
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <div
            className={`flex flex-1 flex-col items-center justify-center transition-all duration-700 ${
              menuOpen ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
            }`}
          >
            <nav className="flex flex-col items-center gap-8 text-center">
              {navLinks.map((link, index) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={closeMenu}
                  className="relative text-2xl font-semibold tracking-tight text-white transition-all duration-300 hover:scale-[1.05] hover:text-transparent hover:bg-gradient-to-r hover:from-pink-400 hover:to-purple-400 hover:bg-clip-text group"
                  style={{
                    transitionDelay: menuOpen ? `${index * 80}ms` : "0ms",
                  }}
                >
                  {link.name}
                  <span className="absolute -bottom-2 left-1/2 w-0 h-px bg-gradient-to-r from-pink-500 to-purple-600 transition-all duration-300 group-hover:w-full group-hover:left-0" />
                </Link>
              ))}
            </nav>
          </div>

          <div
            className={`transition-all duration-700 ${
              menuOpen ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
            }`}
            style={{ transitionDelay: menuOpen ? "240ms" : "0ms" }}
          >
            <div className="flex flex-col gap-3">
              <Link
                href="/login"
                onClick={closeMenu}
                className="relative rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-center text-sm font-medium text-white transition-all duration-300 hover:border-pink-400/40 hover:bg-white/10 hover:scale-[1.02] overflow-hidden group"
              >
                <span className="relative z-10">Sign In</span>
                <span className="absolute inset-0 bg-gradient-to-r from-pink-500/10 to-purple-600/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              </Link>

              <Link
                href="/signup"
                onClick={closeMenu}
                className="relative rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 px-4 py-3 text-center text-sm font-semibold text-white shadow-[0_0_25px_rgba(236,72,153,0.22)] transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_35px_rgba(236,72,153,0.35)] overflow-hidden group"
              >
                <span className="relative z-10">Start Free</span>
                <span className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent -translate-x-full group-hover:translate-x-0 transition-transform duration-500" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Add these styles to your global CSS or in a style tag */}
      <style jsx>{`
        @keyframes float-1 {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          50% { transform: translate(30px, 20px) rotate(5deg); }
        }
        @keyframes float-2 {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          50% { transform: translate(-25px, 15px) rotate(-4deg); }
        }
        @keyframes float-3 {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          50% { transform: translate(20px, -20px) rotate(3deg); }
        }
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.1; transform: scale(1); }
          50% { opacity: 0.2; transform: scale(1.1); }
        }
        .animate-float-1 { animation: float-1 20s ease-in-out infinite; }
        .animate-float-2 { animation: float-2 18s ease-in-out infinite; }
        .animate-float-3 { animation: float-3 22s ease-in-out infinite; }
        .animate-pulse-slow { animation: pulse-slow 4s ease-in-out infinite; }
        .animation-delay-1000 { animation-delay: 1s; }
        .animation-delay-2000 { animation-delay: 2s; }
      `}</style>
    </>
  );
}