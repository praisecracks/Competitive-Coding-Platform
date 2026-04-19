"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Target, Swords, ChevronRight, X, BookOpen, GraduationCap, Trophy, Download, Share2, Bookmark } from "lucide-react";

type CompletionModalProps = {
  courseTitle: string;
  onPracticeChallenge?: () => void;
  onStartDuel?: () => void;
  onNextCourse?: () => void;
  nextCourseTitle?: string;
  hasChallenge?: boolean;
  isLight: boolean;
  isCourseCompletion?: boolean;
  relatedChallengeCategory?: string;
  noteContent?: {
    courseTitle: string;
    stepTitle: string;
    description?: string;
    content?: string[];
    example?: {
      title?: string;
      code?: string;
      explanation?: string;
    };
    commonMistake?: string;
    keyTakeaways?: string[];
  };
};

export default function CompletionModal({
  courseTitle,
  onPracticeChallenge,
  onStartDuel,
  onNextCourse,
  nextCourseTitle,
  hasChallenge,
  isLight,
  isCourseCompletion = false,
  relatedChallengeCategory,
  noteContent,
}: CompletionModalProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['overview']));
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const toggleSection = (sectionId: string) => {
    const newSections = new Set(expandedSections);
    if (newSections.has(sectionId)) {
      newSections.delete(sectionId);
    } else {
      newSections.add(sectionId);
    }
    setExpandedSections(newSections);
  };

  useEffect(() => {
    // Play celebration sound using Web Audio API
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      // Create a celebratory sound - rising notes
      oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime); // C5
      oscillator.frequency.setValueAtTime(659.25, audioContext.currentTime + 0.1); // E5
      oscillator.frequency.setValueAtTime(783.99, audioContext.currentTime + 0.2); // G5
      
      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.5);
    } catch (error) {
      // Fallback to existing sound file if Web Audio API fails
      if (audioRef.current) {
        audioRef.current.play().catch(() => {});
      }
    }
  }, []);

  const handleDownloadNote = async () => {
    if (!noteContent) return;

    try {
      const { jsPDF } = require('jspdf');
      const doc = new jsPDF();
      let yPosition = 20;
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 15;
      const maxWidth = pageWidth - 2 * margin;
      const lineHeight = 7;

      // Helper function to add text with word wrapping
      const addWrappedText = (text: string, fontSize: number, isBold: boolean = false) => {
        doc.setFontSize(fontSize);
        if (isBold) doc.setFont(undefined, 'bold');
        const lines = doc.splitTextToSize(text, maxWidth);
        doc.text(lines, margin, yPosition);
        yPosition += lines.length * lineHeight + 2;
      };

      // Check if we need a new page
      const checkNewPage = (space: number) => {
        if (yPosition + space > pageHeight - 10) {
          doc.addPage();
          yPosition = 20;
        }
      };

      // Header
      doc.setFillColor(99, 102, 241); // Indigo
      doc.rect(0, 0, pageWidth, 30, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(20);
      doc.setFont(undefined, 'bold');
      doc.text('CODEMASTER', pageWidth / 2, 15, { align: 'center' });
      doc.setFontSize(10);
      doc.setFont(undefined, 'normal');
      doc.text('LEARNING NOTE', pageWidth / 2, 24, { align: 'center' });

      yPosition = 40;
      doc.setTextColor(26, 26, 46);

      // Course Title
      doc.setFontSize(18);
      doc.setFont(undefined, 'bold');
      addWrappedText(noteContent.courseTitle, 18, true);
      yPosition += 3;

      // Topic/Step Title
      if (noteContent.stepTitle) {
        doc.setFontSize(14);
        doc.setFont(undefined, 'bold');
        addWrappedText(noteContent.stepTitle, 14, true);
        yPosition += 3;
      }

      // Date
      doc.setFontSize(10);
      doc.setFont(undefined, 'normal');
      doc.setTextColor(107, 114, 128);
      const date = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
      addWrappedText(`Completed on ${date}`, 10);
      yPosition += 5;

      // Description
      if (noteContent.description) {
        checkNewPage(30);
        doc.setTextColor(26, 26, 46);
        doc.setFontSize(12);
        doc.setFont(undefined, 'bold');
        doc.text('Overview', margin, yPosition);
        yPosition += 10;
        
        doc.setFontSize(11);
        doc.setFont(undefined, 'normal');
        addWrappedText(noteContent.description, 11);
        yPosition += 5;
      }

      // Content
      if (noteContent.content && noteContent.content.length > 0) {
        checkNewPage(30);
        doc.setTextColor(26, 26, 46);
        doc.setFontSize(12);
        doc.setFont(undefined, 'bold');
        doc.text('Content', margin, yPosition);
        yPosition += 10;

        doc.setFontSize(11);
        doc.setFont(undefined, 'normal');
        noteContent.content.forEach((item, index) => {
          checkNewPage(15);
          const bulletText = `${index + 1}. ${item}`;
          const lines = doc.splitTextToSize(bulletText, maxWidth - 5);
          doc.text(lines, margin + 5, yPosition);
          yPosition += lines.length * lineHeight + 2;
        });
        yPosition += 3;
      }

      // Example Code
      if (noteContent.example?.code) {
        checkNewPage(35);
        doc.setTextColor(26, 26, 46);
        doc.setFontSize(12);
        doc.setFont(undefined, 'bold');
        doc.text('Code Example', margin, yPosition);
        yPosition += 10;

        doc.setFillColor(30, 30, 46);
        doc.rect(margin, yPosition - 5, maxWidth, 50, 'F');
        doc.setTextColor(165, 180, 252);
        doc.setFontSize(9);
        doc.setFont(undefined, 'normal');
        const codeLines = noteContent.example.code.split('\n');
        codeLines.forEach((line) => {
          checkNewPage(12);
          doc.text(line, margin + 3, yPosition);
          yPosition += 6;
        });
        yPosition += 5;
      }

      // Key Takeaways
      if (noteContent.keyTakeaways && noteContent.keyTakeaways.length > 0) {
        checkNewPage(30);
        doc.setTextColor(26, 26, 46);
        doc.setFontSize(12);
        doc.setFont(undefined, 'bold');
        doc.text('Key Takeaways', margin, yPosition);
        yPosition += 10;

        doc.setFontSize(11);
        doc.setFont(undefined, 'normal');
        doc.setTextColor(5, 150, 105);
        noteContent.keyTakeaways.forEach((takeaway) => {
          checkNewPage(15);
          const lines = doc.splitTextToSize(`✓ ${takeaway}`, maxWidth - 5);
          doc.text(lines, margin + 5, yPosition);
          yPosition += lines.length * lineHeight + 3;
        });
      }

      // Footer
      const timestamp = new Date().toISOString().split("T")[0];
      const safeTopic = (noteContent.stepTitle || noteContent.courseTitle)
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
      
      doc.save(`${safeTopic}-note-${timestamp}.pdf`);
    } catch (error) {
      console.error('PDF generation error:', error);
      alert('Failed to generate PDF. Please try again.');
    }
  };

  const handleShareAchievement = async () => {
    const shareText = `Just made progress on CodeMaster.\n\nCompleted "${courseTitle}".\nLearning step by step and building consistency.\n\ncodemasterx.com.ng`;
    const shareUrl = 'codemasterx.com.ng';

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'CodeMaster Achievement',
          text: shareText,
          url: shareUrl,
        });
      } catch (error) {
        // Fallback to clipboard
        navigator.clipboard.writeText(shareText);
        alert('Achievement message copied to clipboard!');
      }
    } else {
      // Fallback for browsers without Web Share API
      navigator.clipboard.writeText(shareText);
      alert('Achievement message copied to clipboard!');
    }
  };

  const handleSaveToJournal = () => {
    const journalKey = 'codemaster_learning_journal';
    const existingJournal = JSON.parse(localStorage.getItem(journalKey) || '[]');
    
    const journalEntry = {
      id: Date.now().toString(),
      type: isCourseCompletion ? 'course_completion' : 'topic_completion',
      title: courseTitle,
      completedAt: new Date().toISOString(),
      noteContent: noteContent,
    };

    existingJournal.unshift(journalEntry);
    
    // Keep only last 50 entries
    if (existingJournal.length > 50) {
      existingJournal.splice(50);
    }

    localStorage.setItem(journalKey, JSON.stringify(existingJournal));
    alert('Achievement saved to your learning journal!');
  };

  useEffect(() => {
    const timer = setTimeout(() => setIsOpen(true), 500);
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsOpen(false);
  };

  const handlePracticeChallenge = () => {
    if (onPracticeChallenge) {
      handleClose();
      onPracticeChallenge();
    }
  };

  const handleStartDuel = () => {
    if (onStartDuel) {
      handleClose();
      onStartDuel();
    }
  };

  const handleNextCourse = () => {
    if (onNextCourse) {
      handleClose();
      onNextCourse();
    }
  };

  const handleRelatedChallenges = () => {
    handleClose();
    if (relatedChallengeCategory) {
      const categoryMap: Record<string, string> = {
        JavaScript: "JavaScript",
        Python: "Python",
        Go: "Go",
        Algorithms: "Algorithms",
        "Data Structures": "Data Structures",
        Multi: "All",
      };
      const challengeCat = categoryMap[relatedChallengeCategory] || "All";
      window.location.href = `/dashboard/challenges?category=${encodeURIComponent(challengeCat)}`;
    } else {
      window.location.href = "/dashboard/challenges";
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <audio ref={audioRef} src="/sounds/blip.mp3" preload="auto" />
      <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
      >
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={isCourseCompletion ? undefined : handleClose}
          className={`absolute inset-0 ${isLight ? "bg-black/50" : "bg-[#020202]/90"}`}
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className={`relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl border ${
            isLight
              ? "border-gray-200 bg-white shadow-2xl"
              : "border-white/10 bg-[#0c0c12]"
          }`}
        >
          {/* Close Button */}
          <button
            type="button"
            onClick={handleClose}
            aria-label="Close"
            className={`absolute right-4 top-4 z-50 flex h-8 w-8 items-center justify-center rounded-full transition-colors ${
              isLight ? "text-gray-400 hover:bg-gray-100" : "text-gray-400 hover:bg-white/10"
            }`}
          >
            <X className="h-5 w-5" />
          </button>

          {/* Header */}
          <div className="relative overflow-hidden bg-gradient-to-r from-pink-500/20 via-purple-500/20 to-cyan-500/20 px-8 pt-10 pb-8">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(236,72,153,0.15),transparent_50%)]" />
            
            <div className="relative z-10 flex flex-col items-center text-center">
              <div className={`mb-4 flex h-16 w-16 items-center justify-center rounded-full ${
                isLight ? "bg-gradient-to-br from-pink-100 to-purple-100" : "bg-pink-500/20"
              }`}>
                <Sparkles className="h-8 w-8 text-pink-500" />
              </div>
              
              <h2 className={`text-2xl font-bold ${isLight ? "text-gray-900" : "text-white"}`}>
                🎉 Course Completed!
              </h2>
              <p className={`mt-2 text-sm ${isLight ? "text-gray-600" : "text-gray-400"}`}>
                You've mastered <span className="font-semibold text-pink-400">{courseTitle}</span>
              </p>
            </div>
          </div>

          {/* Options */}
          <div className="space-y-3 p-6">
            <p className={`text-center text-sm ${isLight ? "text-gray-500" : "text-gray-400"}`}>
              What's next? Choose your path:
            </p>

            <div className="space-y-3">
              {/* Download Note */}
              {noteContent && (
                <button
                  onClick={handleDownloadNote}
                  className={`flex w-full items-center justify-between gap-4 rounded-2xl border p-4 transition-all hover:scale-[1.01] ${
                    isLight
                      ? "border-gray-200 hover:border-cyan-300 hover:bg-cyan-50"
                      : "border-white/10 hover:border-cyan-500/30 hover:bg-cyan-500/10"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                      isLight ? "bg-cyan-100" : "bg-cyan-500/20"
                    }`}>
                      <Download className="h-5 w-5 text-cyan-500" />
                    </div>
                    <div className="text-left">
                      <p className={`font-semibold ${isLight ? "text-gray-900" : "text-white"}`}>
                        Download Note
                      </p>
                      <p className={`text-xs ${isLight ? "text-gray-500" : "text-gray-400"}`}>
                        Save your learning summary
                      </p>
                    </div>
                  </div>
                  <ChevronRight className={`h-5 w-5 ${isLight ? "text-gray-400" : "text-gray-500"}`} />
                </button>
              )}

              {/* Share Achievement */}
              <button
                onClick={handleShareAchievement}
                className={`flex w-full items-center justify-between gap-4 rounded-2xl border p-4 transition-all hover:scale-[1.01] ${
                  isLight
                    ? "border-gray-200 hover:border-purple-300 hover:bg-purple-50"
                    : "border-white/10 hover:border-purple-500/30 hover:bg-purple-500/10"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                    isLight ? "bg-purple-100" : "bg-purple-500/20"
                  }`}>
                    <Share2 className="h-5 w-5 text-purple-500" />
                  </div>
                  <div className="text-left">
                    <p className={`font-semibold ${isLight ? "text-gray-900" : "text-white"}`}>
                      Share Achievement
                    </p>
                    <p className={`text-xs ${isLight ? "text-gray-500" : "text-gray-400"}`}>
                      Celebrate your progress
                    </p>
                  </div>
                </div>
                <ChevronRight className={`h-5 w-5 ${isLight ? "text-gray-400" : "text-gray-500"}`} />
              </button>

              {/* Save to Journal */}
              <button
                onClick={handleSaveToJournal}
                className={`flex w-full items-center justify-between gap-4 rounded-2xl border p-4 transition-all hover:scale-[1.01] ${
                  isLight
                    ? "border-gray-200 hover:border-emerald-300 hover:bg-emerald-50"
                    : "border-white/10 hover:border-emerald-500/30 hover:bg-emerald-500/10"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                    isLight ? "bg-emerald-100" : "bg-emerald-500/20"
                  }`}>
                    <Bookmark className="h-5 w-5 text-emerald-500" />
                  </div>
                  <div className="text-left">
                    <p className={`font-semibold ${isLight ? "text-gray-900" : "text-white"}`}>
                      Save to Journal
                    </p>
                    <p className={`text-xs ${isLight ? "text-gray-500" : "text-gray-400"}`}>
                      Keep track of your learning
                    </p>
                  </div>
                </div>
                <ChevronRight className={`h-5 w-5 ${isLight ? "text-gray-400" : "text-gray-500"}`} />
              </button>

              {/* Practice Challenge */}
              {hasChallenge && onPracticeChallenge && (
                <button
                  onClick={handlePracticeChallenge}
                  className={`flex w-full items-center justify-between gap-4 rounded-2xl border p-4 transition-all hover:scale-[1.01] ${
                    isLight
                      ? "border-gray-200 hover:border-pink-300 hover:bg-pink-50"
                      : "border-white/10 hover:border-pink-500/30 hover:bg-pink-500/10"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                      isLight ? "bg-pink-100" : "bg-pink-500/20"
                    }`}>
                      <Target className="h-5 w-5 text-pink-500" />
                    </div>
                    <div className="text-left">
                      <p className={`font-semibold ${isLight ? "text-gray-900" : "text-white"}`}>
                        Practice Challenge
                      </p>
                      <p className={`text-xs ${isLight ? "text-gray-500" : "text-gray-400"}`}>
                        Apply what you learned
                      </p>
                    </div>
                  </div>
                  <ChevronRight className={`h-5 w-5 ${isLight ? "text-gray-400" : "text-gray-500"}`} />
                </button>
              )}

              {/* Try in Workspace */}
              {onStartDuel && (
                <button
                  onClick={handleStartDuel}
                  className={`flex w-full items-center justify-between gap-4 rounded-2xl border p-4 transition-all hover:scale-[1.01] ${
                    isLight
                      ? "border-gray-200 hover:border-purple-300 hover:bg-purple-50"
                      : "border-white/10 hover:border-purple-500/30 hover:bg-purple-500/10"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                      isLight ? "bg-purple-100" : "bg-purple-500/20"
                    }`}>
                      <Swords className="h-5 w-5 text-purple-500" />
                    </div>
                    <div className="text-left">
                      <p className={`font-semibold ${isLight ? "text-gray-900" : "text-white"}`}>
                        Try in Workspace
                      </p>
                      <p className={`text-xs ${isLight ? "text-gray-500" : "text-gray-400"}`}>
                        Practice what you learned
                      </p>
                    </div>
                  </div>
                  <ChevronRight className={`h-5 w-5 ${isLight ? "text-gray-400" : "text-gray-500"}`} />
                </button>
              )}

              {/* Next Course */}
              {onNextCourse && nextCourseTitle && (
                <button
                  onClick={handleNextCourse}
                  className={`flex w-full items-center justify-between gap-4 rounded-2xl border p-4 transition-all hover:scale-[1.01] ${
                    isLight
                      ? "border-gray-200 hover:border-cyan-300 hover:bg-cyan-50"
                      : "border-white/10 hover:border-cyan-500/30 hover:bg-cyan-500/10"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                      isLight ? "bg-cyan-100" : "bg-cyan-500/20"
                    }`}>
                      <BookOpen className="h-5 w-5 text-cyan-500" />
                    </div>
                    <div className="text-left">
                      <p className={`font-semibold ${isLight ? "text-gray-900" : "text-white"}`}>
                        Next Course
                      </p>
                      <p className={`text-xs ${isLight ? "text-gray-500" : "text-gray-400"}`}>
                        Continue your learning journey
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-sm font-medium ${isLight ? "text-cyan-600" : "text-cyan-400"}`}>
                      {nextCourseTitle}
                    </span>
                    <ChevronRight className="h-5 w-5 text-cyan-500" />
                  </div>
                </button>
              )}

              {/* Only show Continue Browsing for non-course completion */}              {!isCourseCompletion && (
                <button
                  onClick={handleClose}
                  className={`flex w-full items-center justify-center gap-2 rounded-2xl border p-3 text-sm font-medium transition-colors ${
                    isLight
                      ? "border-gray-200 text-gray-600 hover:bg-gray-50"
                      : "border-white/10 text-gray-400 hover:bg-white/5"
                  }`}
                >
                  Continue Browsing
                </button>
              )}
            </div>
          </div>

          {/* Stats Footer */}
          <div className={`border-t px-6 py-4 ${isLight ? "border-gray-100 bg-gray-50" : "border-white/5 bg-white/[0.02]"}`}>
            <div className="flex items-center justify-center gap-6 text-center">
              <div>
                <Trophy className={`mx-auto h-5 w-5 ${isLight ? "text-amber-500" : "text-amber-400"}`} />
                <p className={`mt-1 text-xs ${isLight ? "text-gray-500" : "text-gray-400"}`}>Keep Learning</p>
              </div>
              <div className={`h-8 w-px ${isLight ? "bg-gray-200" : "bg-white/10"}`} />
              <div>
                <GraduationCap className={`mx-auto h-5 w-5 ${isLight ? "text-pink-500" : "text-pink-400"}`} />
                <p className={`mt-1 text-xs ${isLight ? "text-gray-500" : "text-gray-400"}`}>Build Skills</p>
              </div>
              <div className={`h-8 w-px ${isLight ? "bg-gray-200" : "bg-white/10"}`} />
              <div>
                <Swords className={`mx-auto h-5 w-5 ${isLight ? "text-purple-500" : "text-purple-400"}`} />
                <p className={`mt-1 text-xs ${isLight ? "text-gray-500" : "text-gray-400"}`}>Compete</p>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
    </>
  );
}