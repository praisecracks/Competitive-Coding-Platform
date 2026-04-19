"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { MessageCircle, Calendar, User, Trash2, Eye } from "lucide-react";
import { useTheme } from "@/app/context/ThemeContext";

interface FeedbackItem {
  id: number;
  message: string;
  timestamp: string;
  page: string;
}

export default function AdminFeedbackViewer() {
  const { theme } = useTheme();
  const isLight = theme === "light";
  const [feedback, setFeedback] = useState<FeedbackItem[]>([]);
  const [selectedFeedback, setSelectedFeedback] = useState<FeedbackItem | null>(null);

  useEffect(() => {
    // Load feedback from localStorage (in production, this would be from MongoDB)
    const loadFeedback = () => {
      try {
        const stored = localStorage.getItem('userFeedback');
        if (stored) {
          const parsedFeedback = JSON.parse(stored);
          setFeedback(parsedFeedback.reverse()); // Most recent first
        }
      } catch (error) {
        console.error('Failed to load feedback:', error);
      }
    };

    loadFeedback();

    // Listen for storage changes (in case feedback is added in another tab)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'userFeedback') {
        loadFeedback();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleDelete = (id: number) => {
    const updatedFeedback = feedback.filter(item => item.id !== id);
    setFeedback(updatedFeedback);
    localStorage.setItem('userFeedback', JSON.stringify(updatedFeedback.reverse()));
    if (selectedFeedback?.id === id) {
      setSelectedFeedback(null);
    }
  };

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  const getPageDisplayName = (page: string) => {
    if (page.includes('/dashboard')) return 'Dashboard';
    if (page.includes('/learning')) return 'Learning';
    if (page.includes('/challenges')) return 'Challenges';
    return page;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className={`text-2xl font-bold ${isLight ? "text-gray-900" : "text-white"}`}>
            User Feedback
          </h2>
          <p className={`mt-1 text-sm ${isLight ? "text-gray-600" : "text-gray-400"}`}>
            View and manage user feedback and suggestions
          </p>
        </div>
        <div className={`rounded-lg px-3 py-1 text-sm font-medium ${
          isLight ? "bg-blue-100 text-blue-700" : "bg-blue-500/20 text-blue-300"
        }`}>
          {feedback.length} total feedback
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Feedback List */}
        <div className="lg:col-span-2">
          <div className={`rounded-xl border ${
            isLight ? "border-gray-200 bg-white" : "border-white/10 bg-gray-900"
          }`}>
            <div className="p-6">
              <h3 className={`text-lg font-semibold mb-4 ${
                isLight ? "text-gray-900" : "text-white"
              }`}>
                Recent Feedback
              </h3>

              {feedback.length === 0 ? (
                <div className="text-center py-8">
                  <MessageCircle className={`mx-auto h-12 w-12 ${
                    isLight ? "text-gray-300" : "text-gray-600"
                  }`} />
                  <p className={`mt-2 text-sm ${
                    isLight ? "text-gray-500" : "text-gray-400"
                  }`}>
                    No feedback received yet
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {feedback.map((item) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`cursor-pointer rounded-lg border p-4 transition-all hover:shadow-md ${
                        selectedFeedback?.id === item.id
                          ? isLight
                            ? "border-blue-300 bg-blue-50"
                            : "border-blue-500/30 bg-blue-500/10"
                          : isLight
                          ? "border-gray-200 bg-gray-50 hover:border-gray-300"
                          : "border-white/10 bg-gray-800/50 hover:border-white/20"
                      }`}
                      onClick={() => setSelectedFeedback(item)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm font-medium truncate ${
                            isLight ? "text-gray-900" : "text-white"
                          }`}>
                            {item.message.length > 100
                              ? `${item.message.substring(0, 100)}...`
                              : item.message
                            }
                          </p>
                          <div className="flex items-center gap-4 mt-2 text-xs">
                            <span className={`flex items-center gap-1 ${
                              isLight ? "text-gray-500" : "text-gray-400"
                            }`}>
                              <Calendar className="h-3 w-3" />
                              {formatDate(item.timestamp)}
                            </span>
                            <span className={`flex items-center gap-1 ${
                              isLight ? "text-gray-500" : "text-gray-400"
                            }`}>
                              <Eye className="h-3 w-3" />
                              {getPageDisplayName(item.page)}
                            </span>
                          </div>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(item.id);
                          }}
                          className={`ml-2 rounded p-1 transition-colors ${
                            isLight
                              ? "text-gray-400 hover:bg-gray-200 hover:text-red-600"
                              : "text-gray-500 hover:bg-gray-700 hover:text-red-400"
                          }`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Feedback Details */}
        <div>
          <div className={`rounded-xl border ${
            isLight ? "border-gray-200 bg-white" : "border-white/10 bg-gray-900"
          }`}>
            <div className="p-6">
              <h3 className={`text-lg font-semibold mb-4 ${
                isLight ? "text-gray-900" : "text-white"
              }`}>
                {selectedFeedback ? "Feedback Details" : "Select Feedback"}
              </h3>

              {selectedFeedback ? (
                <div className="space-y-4">
                  <div>
                    <label className={`text-sm font-medium ${
                      isLight ? "text-gray-700" : "text-gray-300"
                    }`}>
                      Message
                    </label>
                    <div className={`mt-1 rounded-lg border p-3 text-sm ${
                      isLight
                        ? "border-gray-200 bg-gray-50 text-gray-900"
                        : "border-white/10 bg-gray-800 text-white"
                    }`}>
                      {selectedFeedback.message}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className={`text-sm font-medium ${
                        isLight ? "text-gray-700" : "text-gray-300"
                      }`}>
                        Page
                      </label>
                      <div className={`mt-1 rounded-lg border px-3 py-2 text-sm ${
                        isLight
                          ? "border-gray-200 bg-gray-50 text-gray-900"
                          : "border-white/10 bg-gray-800 text-white"
                      }`}>
                        {getPageDisplayName(selectedFeedback.page)}
                      </div>
                    </div>

                    <div>
                      <label className={`text-sm font-medium ${
                        isLight ? "text-gray-700" : "text-gray-300"
                      }`}>
                        Date
                      </label>
                      <div className={`mt-1 rounded-lg border px-3 py-2 text-sm ${
                        isLight
                          ? "border-gray-200 bg-gray-50 text-gray-900"
                          : "border-white/10 bg-gray-800 text-white"
                      }`}>
                        {formatDate(selectedFeedback.timestamp)}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleDelete(selectedFeedback.id)}
                    className="w-full flex items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete Feedback
                  </button>
                </div>
              ) : (
                <div className="text-center py-8">
                  <MessageCircle className={`mx-auto h-8 w-8 ${
                    isLight ? "text-gray-300" : "text-gray-600"
                  }`} />
                  <p className={`mt-2 text-sm ${
                    isLight ? "text-gray-500" : "text-gray-400"
                  }`}>
                    Click on a feedback item to view details
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}