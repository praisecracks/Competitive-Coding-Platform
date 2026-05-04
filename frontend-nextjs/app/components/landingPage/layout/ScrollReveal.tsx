"use client";

import { ReactNode, useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type ScrollRevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  once?: boolean;
};

export default function ScrollReveal({
  children,
  className = "",
  delay = 0,
  y = 64,
  once = true,
}: ScrollRevealProps) {
  const revealRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const element = revealRef.current;
    if (!element) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        element,
        {
          autoAlpha: 0,
          y,
          scale: 0.985,
          filter: "blur(10px)",
        },
        {
          autoAlpha: 1,
          y: 0,
          scale: 1,
          filter: "blur(0px)",
          duration: 0.9,
          delay,
          ease: "power3.out",
          scrollTrigger: {
            trigger: element,
            start: "top 82%",
            toggleActions: once
              ? "play none none none"
              : "play none none reverse",
          },
        }
      );
    }, element);

    return () => ctx.revert();
  }, [delay, y, once]);

  return (
    <div ref={revealRef} className={className}>
      {children}
    </div>
  );
}