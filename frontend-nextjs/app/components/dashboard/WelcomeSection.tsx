// app/components/dashboard/WelcomeSection.tsx
"use client";

import { motion } from "framer-motion";

interface WelcomeSectionProps {
  userName: string;
}

export default function WelcomeSection({ userName }: WelcomeSectionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-8"
    >
      <h1 className="text-3xl font-bold text-white">
        Welcome back,{" "}
        <span className="bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
          {userName}
        </span>
      </h1>
      <p className="text-gray-400 mt-2">
        Track your progress, continue coding, and level up your skills.
      </p>
    </motion.div>
  );
}