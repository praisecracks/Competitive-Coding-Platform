"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "./components/landingPage/layout/Header";
import Home from "./components/landingPage/Home";
import ChallengesPreview from "./components/landingPage/ChallengesPreview";
import Footer from "./components/Footer";
import Features from "./components/landingPage/features";
import Pricing from "./components/landingPage/pricing";
import PricingFAQ from "./components/landingPage/PricingFAQ";
import { isAuthenticated } from "@/lib/auth";

export default function Page() {
  const router = useRouter();
  const [checkingSession, setCheckingSession] = useState(true);

  useEffect(() => {
    if (isAuthenticated()) {
      router.replace("/dashboard");
      return;
    }

    setCheckingSession(false);
  }, [router]);

  if (checkingSession) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#020202] text-white">
        <p className="text-sm uppercase tracking-[0.25em] text-gray-500">
          Checking session...
        </p>
      </div>
    );
  }

  return (
    <>
      <Header />

      <main className="min-h-screen overflow-hidden bg-[#020202] pt-20 text-white">
        <Home />
        <Features />
        <ChallengesPreview />
        <Pricing />
        <PricingFAQ />
        <Footer />
      </main>
    </>
  );
}
