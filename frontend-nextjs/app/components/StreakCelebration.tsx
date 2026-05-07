"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Flame } from "lucide-react";

type CelebrationType = "streak" | "badge" | "level-up" | "topic-complete";

interface CelebrationData {
  type: CelebrationType;
  value: number; // streak count, badge count, level number
  label?: string; // custom message
}

export interface CelebrationOverlayProps {
   celebration: CelebrationData | null;
   isLight: boolean;
   onDismiss?: () => void;
 }

 export interface StreakCelebrationProps {
   streak: number;
   isLight: boolean;
   onComplete?: () => void;
 }

export function CelebrationOverlay({
   celebration,
   isLight,
   onDismiss,
 }: CelebrationOverlayProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Play sound when celebration appears
  useEffect(() => {
    if (!celebration) return;

    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      const playNote = (freq: number, startTime: number, duration: number) => {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(freq, startTime);
        oscillator.type = "sine";
        
        gainNode.gain.setValueAtTime(0.15, startTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + duration);
        
        oscillator.start(startTime);
        oscillator.stop(startTime + duration);
      };

      const now = audioContext.currentTime;
      
      // Different sounds for different celebration types
      switch (celebration.type) {
        case "streak":
          // Rising arpeggio for streak
          playNote(523.25, now, 0.15);    // C5
          playNote(659.25, now + 0.08, 0.15); // E5
          playNote(783.99, now + 0.16, 0.15); // G5
          playNote(1046.50, now + 0.24, 0.3); // C6
          break;
        case "badge":
          // Triumphant chord
          playNote(659.25, now, 0.2);
          playNote(783.99, now + 0.1, 0.2);
          playNote(987.77, now + 0.2, 0.4); // B5
          break;
        case "level-up":
          // Rising scale
          playNote(440, now, 0.1);
          playNote(554.37, now + 0.1, 0.1);
          playNote(659.25, now + 0.2, 0.1);
          playNote(880, now + 0.3, 0.4);
          break;
        default:
          // Simple ding
          playNote(800, now, 0.1);
      }
    } catch (error) {
      console.log("Web Audio API not supported");
    }
  }, [celebration]);

  if (!celebration) return null;

  const isStreak = celebration.type === "streak";
  const isBadge = celebration.type === "badge";
  const isLevelUp = celebration.type === "level-up";

  // Theme colors based on type
  const colors = {
    streak: isLight 
      ? { primary: "#f97316", secondary: "#f59e0b", bg: "rgba(249,115,22,0.15)" }
      : { primary: "#fb923c", secondary: "#facc15", bg: "rgba(249,115,22,0.25)" },
    badge: isLight
      ? { primary: "#eab308", secondary: "#f59e0b", bg: "rgba(234,179,8,0.15)" }
      : { primary: "#facc15", secondary: "#fbbf24", bg: "rgba(234,179,8,0.25)" },
    "level-up": isLight
      ? { primary: "#8b5cf6", secondary: "#a78bfa", bg: "rgba(139,92,246,0.15)" }
      : { primary: "#a78bfa", secondary: "#c4b5fd", bg: "rgba(139,92,246,0.25)" },
    "topic-complete": isLight
      ? { primary: "#22c55e", secondary: "#4ade80", bg: "rgba(34,197,94,0.15)" }
      : { primary: "#4ade80", secondary: "#22c55e", bg: "rgba(34,197,94,0.25)" },
  };

  const theme = colors[celebration.type as keyof typeof colors] || colors.streak;

  // Generate confetti particles
  const particleColors = isLight
    ? ["#f97316", "#eab308", "#22c55e", "#3b82f6", "#8b5cf6", "#ec4899"]
    : ["#fb923c", "#facc15", "#4ade80", "#60a5fa", "#a78bfa", "#f472b6"];

  const particles = Array.from({ length: 50 }).map((_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    color: particleColors[Math.floor(Math.random() * particleColors.length)],
    delay: Math.random() * 0.5,
    duration: 1 + Math.random() * 1.5,
  }));

  // Get emoji based on type
  const emojis = {
    streak: ["🔥", "⚡", "💪", "🎯"],
    badge: ["🏆", "⭐", "✨", "💎"],
    "level-up": ["🚀", "⬆️", "🎯", "💫"],
    "topic-complete": ["🎉", "✅", "🎓", "🏅"],
  };

  return (
    <AnimatePresence>
      <motion.div
        key={celebration.type + "-" + celebration.value}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0, transition: { duration: 0.2 } }}
        className="fixed inset-0 z-[200] flex items-center justify-center"
        style={{
          background: `radial-gradient(circle at center, ${theme.bg} 0%, rgba(0,0,0,0.6) 100%)`,
        }}
        onClick={(e) => {
          e.stopPropagation();
          onDismiss?.();
        }}
      >
        {/* Confetti */}
        {particles.map((particle) => (
          <motion.div
            key={`confetti-${particle.id}`}
            initial={{ y: "-10vh", x: particle.left, rotate: 0, opacity: 1 }}
            animate={{ 
              y: "110vh", 
              rotate: 720,
              opacity: 0 
            }}
            transition={{
              duration: particle.duration,
              delay: particle.delay,
              ease: "easeOut",
            }}
            className="fixed z-[201] h-3 w-3 rounded-full"
            style={{ 
              backgroundColor: particle.color,
              left: particle.left,
              top: "-12px",
            }}
          />
        ))}

        {/* Main celebration content */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ 
            scale: 1, 
            rotate: 0,
            transition: { 
              type: "spring",
              stiffness: 260,
              damping: 20,
              delay: 0.1,
            }
          }}
          exit={{ 
            scale: 0,
            rotate: 180,
            transition: { duration: 0.2 }
          }}
          className="relative flex flex-col items-center"
        >
          {/* Icon with orbital animation */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ 
              scale: [0, 1.2, 1],
              rotate: [0, 10, -10, 0],
            }}
            transition={{
              scale: { delay: 0.2, duration: 0.5 },
              rotate: { delay: 0.5, duration: 0.8 },
            }}
            className="mb-4"
          >
            {isStreak ? (
              <Flame className="h-24 w-24 drop-shadow-[0_0_20px_rgba(249,115,22,1)]" strokeWidth={2.5} />
            ) : isBadge ? (
              <div className="h-24 w-24 flex items-center justify-center">
                <span className="text-6xl">🏆</span>
              </div>
            ) : (
              <div className="h-24 w-24 flex items-center justify-center">
                <span className="text-6xl">🚀</span>
              </div>
            )}
          </motion.div>

          {/* Value display */}
          <motion.div
            initial={{ scale: 0, y: 20 }}
            animate={{ 
              scale: 1, 
              y: 0,
              transition: { delay: 0.3, type: "spring", stiffness: 300, damping: 20 }
            }}
            exit={{ scale: 0, y: -20 }}
            className={`relative rounded-2xl px-8 py-4 ${
              isLight
                ? `bg-gradient-to-br from-${theme.primary}-100 to-${theme.secondary}-100 border-2 border-${theme.primary}-300`
                : `bg-gradient-to-br ${theme.bg} border-2 border-${theme.primary}-50`
            }`}
            style={{
              background: isLight
                ? `linear-gradient(135deg, ${theme.primary}15 0%, ${theme.secondary}15 100%)`
                : `linear-gradient(135deg, ${theme.bg} 0%, ${theme.bg} 100%)`,
              borderColor: isLight ? theme.primary : `${theme.primary}50`,
            }}
          >
            <span className="text-6xl font-black" style={{ color: theme.primary }}>
              {celebration.value}
            </span>
            
            {/* Shine effect */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.3, 0] }}
              transition={{ duration: 1, delay: 0.5 }}
              className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/40 via-transparent to-transparent"
            />
          </motion.div>

          {/* Label */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-3 text-lg font-bold uppercase tracking-widest"
            style={{ color: theme.primary }}
          >
            {isStreak && "Day Streak!"}
            {isBadge && "Badge Earned!"}
            {isLevelUp && "Level Up!"}
            {celebration.type === "topic-complete" && "Topic Completed!"}
          </motion.p>

          {/* Custom label or subtitle */}
          {celebration.label && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className={`mt-1 text-sm ${isLight ? "text-gray-600" : "text-gray-400"}`}
            >
              {celebration.label}
            </motion.p>
          )}

          {/* Dismiss prompt */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className={`mt-3 text-xs ${isLight ? "text-gray-500" : "text-gray-500"}`}
          >
            Tap anywhere or wait 5s to dismiss
          </motion.p>
        </motion.div>

        {/* Floating emojis */}
        <div className="absolute inset-0 pointer-events-none">
          {emojis[celebration.type].map((emoji, i) => (
            <motion.div
              key={emoji}
              initial={{ 
                x: "50%", 
                y: "50%",
                scale: 0,
                rotate: 0,
              }}
              animate={{
                x: [
                  "50%",
                  `${20 + i * 15}%`,
                  `${10 + i * 20}%`,
                ],
                y: [
                  "50%",
                  `${15 + i * 8}%`,
                  `${25 + i * 12}%`,
                ],
                scale: [0, 1.8, 0],
                rotate: [0, 90, -45],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 2.5,
                delay: 0.3 + i * 0.15,
                ease: "easeOut",
              }}
              className="fixed text-4xl"
            >
              {emoji}
            </motion.div>
          ))}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}


export function StreakCelebration({
  streak,
  isLight,
  onComplete,
}: StreakCelebrationProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Play celebration sound on mount
  useEffect(() => {
    // Play a short celebratory sound using Web Audio API
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      // Create a "cha-ching" + rising celebration sound
      const playNote = (freq: number, startTime: number, duration: number) => {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(freq, startTime);
        oscillator.type = "sine";
        
        gainNode.gain.setValueAtTime(0.2, startTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + duration);
        
        oscillator.start(startTime);
        oscillator.stop(startTime + duration);
      };
      
      // Celebratory major chord arpeggio (C5-E5-G5-C6)
      const now = audioContext.currentTime;
      playNote(523.25, now, 0.2);    // C5
      playNote(659.25, now + 0.1, 0.2); // E5
      playNote(783.99, now + 0.2, 0.2); // G5
      playNote(1046.50, now + 0.3, 0.4); // C6
      
    } catch (error) {
      console.log("Web Audio API not supported for streak celebration");
    }

    // Auto-close after 3 seconds
    const timer = setTimeout(() => {
      onComplete?.();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  // Generate confetti particles
  const confettiColors = isLight 
    ? ["#f97316", "#eab308", "#22c55e", "#3b82f6", "#8b5cf6", "#ec4899"]
    : ["#fb923c", "#facc15", "#4ade80", "#60a5fa", "#a78bfa", "#f472b6"];

  const confettiParticles = Array.from({ length: 50 }).map((_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    color: confettiColors[Math.floor(Math.random() * confettiColors.length)],
    delay: Math.random() * 0.5,
    duration: 1 + Math.random() * 1.5,
  }));

  // Generate flame particles
  const flames = Array.from({ length: 12 }).map((_, i) => ({
    id: i,
    angle: (i / 12) * Math.PI * 2,
    delay: Math.random() * 0.3,
    scale: 0.8 + Math.random() * 0.4,
  }));

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[200] flex items-center justify-center"
        style={{
          background: isLight 
            ? "radial-gradient(circle at center, rgba(249,115,22,0.15) 0%, rgba(0,0,0,0.3) 100%)"
            : "radial-gradient(circle at center, rgba(249,115,22,0.25) 0%, rgba(0,0,0,0.7) 100%)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Confetti particles */}
        {confettiParticles.map((particle) => (
          <motion.div
            key={`confetti-${particle.id}`}
            initial={{ y: "-10vh", x: particle.left, rotate: 0, opacity: 1 }}
            animate={{ 
              y: "110vh", 
              rotate: 720,
              opacity: 0 
            }}
            transition={{
              duration: particle.duration,
              delay: particle.delay,
              ease: "easeOut",
            }}
            className="fixed z-[201] h-3 w-3 rounded-full"
            style={{ 
              backgroundColor: particle.color,
              left: particle.left,
              top: "-12px",
            }}
          />
        ))}

        {/* Central celebration content */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ 
            scale: 1, 
            rotate: 0,
            transition: { 
              type: "spring",
              stiffness: 260,
              damping: 20,
              delay: 0.1,
            }
          }}
          exit={{ 
            scale: 0,
            rotate: 180,
            transition: { duration: 0.2 }
          }}
          className="relative flex flex-col items-center"
        >
          {/* Flames orbiting around */}
          {flames.map((flame) => (
            <motion.div
              key={`flame-${flame.id}`}
              initial={{ 
                rotate: flame.angle * (180 / Math.PI),
                scale: 0,
              }}
              animate={{
                rotate: flame.angle * (180 / Math.PI) + 360,
                scale: [0, flame.scale, flame.scale * 0.8],
              }}
              transition={{
                rotate: {
                  duration: 2 + Math.random(),
                  repeat: Infinity,
                  ease: "linear",
                  delay: flame.delay,
                },
                scale: {
                  duration: 0.5,
                  delay: flame.delay,
                  repeat: Infinity,
                  repeatType: "reverse",
                  repeatDelay: 1,
                },
              }}
              className="absolute"
              style={{
                width: 60,
                height: 60,
                transformOrigin: "center center",
              }}
            >
              <Flame 
                className="h-full w-full text-orange-500 drop-shadow-[0_0_8px_rgba(249,115,22,0.8)]" 
                style={{
                  filter: `drop-shadow(0 0 ${8 + Math.random() * 4}px rgba(249,115,22,0.8))`,
                }}
              />
            </motion.div>
          ))}

          {/* Main streak display */}
          <div className="relative z-10 flex flex-col items-center">
            {/* Dabs */}
            <motion.div
              initial={{ y: 0 }}
              animate={{ 
                y: [0, -15, 0],
              }}
              transition={{
                duration: 0.6,
                repeat: 4,
                repeatDelay: 0.2,
              }}
              className="mb-2"
            >
              <Flame 
                className="h-20 w-20 text-orange-500" 
                strokeWidth={2.5}
                style={{
                  filter: "drop-shadow(0 0 12px rgba(249,115,22,1))",
                }}
              />
            </motion.div>

            {/* Streak number */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ 
                scale: [0, 1.3, 1],
                transition: { 
                  delay: 0.2,
                  times: [0, 0.6, 1],
                  duration: 0.6,
                }
              }}
              className={`relative rounded-2xl px-8 py-4 ${
                isLight 
                  ? "bg-gradient-to-br from-orange-100 to-amber-100 border-2 border-orange-300" 
                  : "bg-gradient-to-br from-orange-500/20 to-amber-500/20 border-2 border-orange-500/50"
              }`}
            >
              <span className={`text-6xl font-black ${isLight ? "text-orange-600" : "text-orange-400"}`}>
                {streak}
              </span>
              
              {/* Glossy shine effect */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 0.3, 0] }}
                transition={{ duration: 1, delay: 0.5 }}
                className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/40 via-transparent to-transparent"
              />
            </motion.div>

            {/* Label */}
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className={`mt-3 text-lg font-bold uppercase tracking-widest ${isLight ? "text-orange-600" : "text-orange-400"}`}
            >
              Day Streak!
            </motion.p>

            {/* Subtext */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className={`mt-1 text-sm ${isLight ? "text-gray-600" : "text-gray-400"}`}
            >
              Keep it up! 🔥
            </motion.p>
          </div>
        </motion.div>

        {/* "Excellent!" popping text */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ 
            opacity: [0, 1, 1, 0],
            scale: [0.5, 1.2, 1, 0.8],
            y: [0, -30, -60],
          }}
          transition={{
            duration: 2,
            times: [0, 0.3, 0.7, 1],
            delay: 0.3,
          }}
          className="absolute top-[20%] left-1/2 -translate-x-1/2 text-4xl font-black"
          style={{
            color: isLight ? "#f97316" : "#fb923c",
            textShadow: `0 0 20px ${isLight ? "rgba(249,115,22,0.8)" : "rgba(251,146,60,0.8)"}`,
          }}
        >
          EXCELLENT!
        </motion.div>

        {/* Additional floating emojis */}
        {["🔥", "⚡", "🎯", "💪"].map((emoji, i) => (
          <motion.div
            key={emoji}
            initial={{ 
              x: "50%", 
              y: "50%",
              scale: 0,
              rotate: 0,
            }}
            animate={{
              x: [
                "50%",
                `${30 + i * 10}%`,
                `${20 + i * 15}%`,
              ],
              y: [
                "50%",
                `${20 + i * 5}%`,
                `${30 + i * 10}%`,
              ],
              scale: [0, 1.5, 0],
              rotate: [0, 90, -45],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 2,
              delay: 0.2 + i * 0.15,
              ease: "easeOut",
            }}
            className="fixed z-[202] text-4xl"
          >
            {emoji}
          </motion.div>
        ))}
      </motion.div>
    </AnimatePresence>
  );
}
