"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import FeatureHeroPanel from "./layout/FeatureHeroPanel";
import FeatureCardsGrid from "./layout/FeatureCardsGrid";
import FeatureOutcomeFlow from "./layout/FeatureOutcomeFlow";

gsap.registerPlugin(ScrollTrigger);

export default function Features() {
  const sectionRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".gsap-feature-section",
        {
          opacity: 0,
          y: 70,
          scale: 0.985,
          filter: "blur(10px)",
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          filter: "blur(0px)",
          duration: 1,
          ease: "power3.out",
          stagger: 0.18,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 75%",
            end: "bottom 20%",
            toggleActions: "play none none reverse",
          },
        }
      );

      gsap.to(".gsap-feature-glow-left", {
        y: -70,
        x: 35,
        scale: 1.08,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 1.2,
        },
      });

      gsap.to(".gsap-feature-glow-right", {
        y: 90,
        x: -45,
        scale: 1.12,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 1.2,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-[#020202] px-4 py-20 text-white sm:px-6 lg:px-8"
    >
      {/* Background System */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="gsap-feature-glow-left absolute left-[5%] top-10 h-72 w-72 rounded-full bg-pink-500/10 blur-[120px]" />
        <div className="gsap-feature-glow-right absolute right-[6%] top-24 h-80 w-80 rounded-full bg-purple-500/10 blur-[140px]" />
        <div className="absolute inset-0 opacity-[0.045] [background-image:linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:72px_72px]" />
      </div>

      <div className="mx-auto max-w-7xl space-y-24">
        <div className="gsap-feature-section">
          <FeatureHeroPanel />
        </div>

        <div className="gsap-feature-section">
          <FeatureCardsGrid />
        </div>

        <div className="gsap-feature-section">
          <FeatureOutcomeFlow />
        </div>
      </div>
    </section>
  );
}