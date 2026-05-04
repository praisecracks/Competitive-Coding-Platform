"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle } from "lucide-react";
import { useTheme } from "@/app/context/ThemeContext";

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  isDestructive?: boolean;
}

export default function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
  isDestructive = false,
}: ConfirmDialogProps) {
  const { theme } = useTheme();
  const isLight = theme === "light";

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onCancel();
      } else if (e.key === "Enter") {
        onConfirm();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onConfirm, onCancel]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] flex items-center justify-center p-4"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onCancel}
            className={`absolute inset-0 ${
              isLight ? "bg-black/40" : "bg-black/60"
            } backdrop-blur-sm`}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className={`relative w-full max-w-md rounded-2xl border p-6 shadow-2xl ${
              isLight
                ? "bg-white border-gray-200"
                : "bg-[#0c0c12] border-white/10"
            }`}
          >
            <div className="flex items-start gap-4">
              {/* Icon */}
              <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                isDestructive
                  ? isLight
                    ? "bg-red-100 text-red-600"
                    : "bg-red-500/15 text-red-400"
                  : isLight
                    ? "bg-amber-100 text-amber-700"
                    : "bg-amber-500/15 text-amber-400"
              }`}>
                <AlertTriangle className="h-5 w-5" />
              </div>

              {/* Content */}
              <div className="flex-1">
                <h3 className={`text-lg font-semibold ${isLight ? "text-gray-900" : "text-white"}`}>
                  {title}
                </h3>
                <p className={`mt-1.5 text-sm ${isLight ? "text-gray-600" : "text-gray-400"}`}>
                  {message}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                onClick={onCancel}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                  isLight
                    ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    : "bg-white/5 text-white hover:bg-white/10"
                }`}
              >
                {cancelText}
              </button>
              <button
                onClick={onConfirm}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                  isDestructive
                    ? isLight
                      ? "bg-red-600 text-white hover:bg-red-700"
                      : "bg-red-500 text-white hover:bg-red-600"
                    : isLight
                      ? "bg-gray-900 text-white hover:bg-gray-800"
                      : "bg-white/10 text-white hover:bg-white/20"
                }`}
              >
                {confirmText}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
