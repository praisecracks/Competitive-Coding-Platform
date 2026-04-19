"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom";
import { MessageCircle, X, Send, CheckCircle } from "lucide-react";
import { useTheme } from "@/app/context/ThemeContext";

interface FeedbackFABProps {
  onSubmit?: (feedback: string) => Promise<void>;
}

export default function FeedbackFAB({ onSubmit }: FeedbackFABProps) {
  const { theme } = useTheme();
  const isLight = theme === "light";
  const [isOpen, setIsOpen] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [mounted, setMounted] = useState(false);
  const successTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setMounted(true);
    return () => {
      if (successTimeoutRef.current) {
        clearTimeout(successTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!mounted) return;

    if (isOpen) {
      const previousOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";

      return () => {
        document.body.style.overflow = previousOverflow;
      };
    }
  }, [isOpen, mounted]);

  useEffect(() => {
    if (showSuccess) {
      if (successTimeoutRef.current) {
        clearTimeout(successTimeoutRef.current);
      }
      successTimeoutRef.current = setTimeout(() => {
        setShowSuccess(false);
        successTimeoutRef.current = null;
      }, 3000);
    }
  }, [showSuccess]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedback.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      if (onSubmit) {
        await onSubmit(feedback.trim());
      } else {
        const token = localStorage.getItem("terminal_token");
        const page = window.location.pathname;

        await fetch("/api/feedback", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({ message: feedback.trim(), page }),
        });
      }

      setFeedback("");
      setIsOpen(false);
      setShowSuccess(true);
    } catch (error) {
      console.error("Failed to submit feedback:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="feedback-modal"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999]"
          onClick={() => setIsOpen(false)}
        >
          <div className="absolute inset-0 bg-black/35 backdrop-blur-[1px]" />

          <div className="absolute inset-0 flex items-end justify-end p-4 sm:p-5">
            <motion.div
              initial={{ scale: 0.96, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.96, opacity: 0, y: 20 }}
              transition={{ duration: 0.2 }}
              className={`relative w-full max-w-sm rounded-2xl p-5 shadow-2xl ${
                isLight ? "bg-white" : "bg-[#0f0f13]"
              }`}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setIsOpen(false)}
                className={`absolute right-4 top-4 rounded-full p-1 transition-colors ${
                  isLight
                    ? "text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                    : "text-gray-500 hover:bg-gray-800 hover:text-gray-300"
                }`}
              >
                <X className="h-5 w-5" />
              </button>

              <div className="mb-4 pr-8">
                <h3
                  className={`text-lg font-semibold ${
                    isLight ? "text-gray-900" : "text-white"
                  }`}
                >
                  Share Your Feedback
                </h3>
                <p
                  className={`text-sm ${
                    isLight ? "text-gray-600" : "text-gray-400"
                  }`}
                >
                  Help us improve CodeMaster with your thoughts and suggestions
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <textarea
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="What's on your mind?"
                  className={`w-full resize-none rounded-lg border p-3 text-sm focus:outline-none focus:ring-2 ${
                    isLight
                      ? "border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:ring-purple-500/20"
                      : "border-gray-700 bg-gray-800 text-white placeholder-gray-400 focus:ring-purple-500/20"
                  }`}
                  rows={4}
                  required
                />

                <button
                  type="submit"
                  disabled={!feedback.trim() || isSubmitting}
                  className={`flex w-full items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                    feedback.trim() && !isSubmitting
                      ? "bg-purple-600 text-white hover:bg-purple-700"
                      : "cursor-not-allowed bg-gray-300 text-gray-500"
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      Send Feedback
                    </>
                  )}
                </button>
              </form>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <>
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-24 right-6 z-[9998] flex items-center gap-2 rounded-lg px-3 py-2 shadow-lg"
            style={{
              backgroundColor: isLight ? "#10b981" : "#059669",
              color: "white",
            }}
          >
            <CheckCircle className="h-5 w-5" />
            <span className="text-sm font-medium">
              Thank you for your feedback!
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {mounted ? createPortal(modalContent, document.body) : null}

      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 z-30 flex h-14 w-14 items-center justify-center rounded-full shadow-lg transition-colors ${
          isLight
            ? "bg-purple-600 text-white hover:bg-purple-700"
            : "bg-purple-500 text-white hover:bg-purple-600"
        }`}
        style={{
          boxShadow: isLight
            ? "0 4px 14px 0 rgba(147, 51, 234, 0.3)"
            : "0 4px 14px 0 rgba(147, 51, 234, 0.5)",
        }}
      >
        <MessageCircle className="h-6 w-6" />
      </motion.button>
    </>
  );
}