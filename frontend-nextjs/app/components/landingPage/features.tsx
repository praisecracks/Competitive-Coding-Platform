"use client";

import FeatureHeroPanel from "./layout/FeatureHeroPanel";
import FeatureCardsGrid from "./layout/FeatureCardsGrid";
import FeatureOutcomeFlow from "./layout/FeatureOutcomeFlow";

export default function Features() {
  return (
    <section className="relative overflow-hidden bg-[#020202] px-4 py-20 text-white sm:px-6 lg:px-8">
      
      {/* Background System */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute left-[5%] top-10 h-72 w-72 rounded-full bg-pink-500/10 blur-[120px]" />
        <div className="absolute right-[6%] top-24 h-80 w-80 rounded-full bg-purple-500/10 blur-[140px]" />
        <div className="absolute inset-0 opacity-[0.045] [background-image:linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:72px_72px]" />
      </div>

      <div className="mx-auto max-w-7xl space-y-24">
        <FeatureHeroPanel />
        <FeatureCardsGrid />
        <FeatureOutcomeFlow />
      </div>
    </section>
  );
}