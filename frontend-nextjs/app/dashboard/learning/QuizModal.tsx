"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, CheckCircle, XCircle, ArrowRight, RotateCcw, BookOpen } from "lucide-react";
import { useTheme } from "@/app/context/ThemeContext";

type QuizModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onPass: () => void;
  onFailReturn: () => void;
  onFailRetry: () => void;
  courseTitle: string;
  stepTitle: string;
  keyTakeaways?: string[];
  commonMistake?: string;
};

interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
}

export default function QuizModal({
  isOpen,
  onClose,
  onPass,
  onFailReturn,
  onFailRetry,
  courseTitle,
  stepTitle,
  keyTakeaways,
  commonMistake,
}: QuizModalProps) {
  const { theme } = useTheme();
  const isLight = theme === "light";

  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [finished, setFinished] = useState(false);

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setScore(0);
    setShowResult(false);
    setFinished(false);
  };

  useEffect(() => {
    if (!isOpen) return;
    
    const generatedQuestions: QuizQuestion[] = [];
    
    const shuffleArray = <T,>(arr: T[]): T[] => {
      const newArr = [...arr];
      for (let i = newArr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
      }
      return newArr;
    };

    // Question 1: Simple - direct recall from key takeaways
    if (keyTakeaways && keyTakeaways.length > 0) {
      const takeaway = keyTakeaways[0];
      const options = shuffleArray([
        takeaway,
        "Avoiding best practices",
        "Ignoring the concept entirely",
        "Using outdated methods"
      ]);
      generatedQuestions.push({
        question: `What is a key principle from "${courseTitle}"?`,
        options,
        correctIndex: options.indexOf(takeaway),
      });
    }

    // Question 2: Intermediate - apply the concept
    if (keyTakeaways && keyTakeaways.length > 1) {
      const takeaway = keyTakeaways[1];
      const options = shuffleArray([
        "Apply the concept in real scenarios",
        takeaway,
        "Memorize all the syntax",
        "Skip the practical exercises"
      ]);
      const correctIdx = options.indexOf("Apply the concept in real scenarios");
      generatedQuestions.push({
        question: `How would you implement what you learned in ${stepTitle}?`,
        options,
        correctIndex: correctIdx >= 0 ? correctIdx : 0,
      });
    }

    // Question 3: Harder - analyze the mistake
    if (commonMistake) {
      const options = shuffleArray([
        "Debug and fix the error early",
        commonMistake,
        "Ignore warnings and continue",
        "Delete the code"
      ]);
      generatedQuestions.push({
        question: `When you encounter "${commonMistake.substring(0, 30)}...", what is the best approach?`,
        options,
        correctIndex: options.indexOf("Debug and fix the error early"),
      });
    }

    // Question 4: Complex - evaluate scenarios
    if (keyTakeaways && keyTakeaways.length > 2) {
      const takeaway = keyTakeaways[2];
      generatedQuestions.push({
        question: `Given a scenario where ${takeaway.substring(0, 40)}... which outcome is most likely?`,
        options: shuffleArray([
          "Successful implementation with clean code",
          "Runtime errors across the application",
          "Memory leak in production",
          "Successful but slow execution"
        ]),
        correctIndex: 0,
      });
    }

    // Question 5: Trickiest - synthesis question
    if (keyTakeaways && keyTakeaways.length > 0 && commonMistake) {
      generatedQuestions.push({
        question: `To succeed in ${courseTitle}, you must avoid "${commonMistake.substring(0, 25)}..." AND embrace which approach?`,
        options: shuffleArray([
          "Consistent practice with real projects",
          "Only reading documentation",
          "Watching tutorials without coding",
          "Asking AI for all answers"
        ]),
        correctIndex: 0,
      });
    }

    // Fallback if not enough questions
    while (generatedQuestions.length < 3) {
      generatedQuestions.push({
        question: `What is essential for mastering ${courseTitle}?`,
        options: shuffleArray([
          "Building real projects",
          "Memorizing syntax",
          "Reading only",
          "Passive watching"
        ]),
        correctIndex: 0,
      });
    }

    setQuestions(generatedQuestions.slice(0, 5));
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setScore(0);
    setShowResult(false);
    setFinished(false);
  }, [isOpen, keyTakeaways, commonMistake, courseTitle, stepTitle]);

  const handleAnswer = (index: number) => {
    if (selectedAnswer !== null) return;
    
    setSelectedAnswer(index);
    
    const isCorrect = index === questions[currentQuestion].correctIndex;
    if (isCorrect) {
      setScore((prev) => prev + 1);
    }
    
    setShowResult(true);
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
      setSelectedAnswer(null);
      setShowResult(false);
} else {
      const passed = score >= Math.ceil(questions.length * 0.6);
      setFinished(true);
      if (!passed) {
        setShowResult(true);
      }
    }
  };

  const handleFail = (action: "retry" | "return") => {
    if (action === "retry") {
      resetQuiz();
    } else {
      onFailReturn();
      onClose();
    }
  };

  if (!isOpen) return null;

  const passed = score >= Math.ceil(questions.length * 0.6);

  return (
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
          className={`absolute inset-0 ${isLight ? "bg-black/40" : "bg-black/70"}`}
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className={`relative w-full max-w-lg overflow-hidden rounded-3xl border ${
            isLight
              ? "border-gray-200 bg-white shadow-2xl"
              : "border-white/10 bg-[#0c0c12]"
          }`}
        >
          {!finished ? (
            <>
              <div className="relative overflow-hidden bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-pink-500/20 px-8 pt-10 pb-8">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(34,211,238,0.15),transparent_50%)]" />
                
                <div className="relative z-10">
                  <div className="mb-4 flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-cyan-400" />
                    <span className={`text-xs font-semibold uppercase tracking-[0.2em] ${
                      isLight ? "text-gray-500" : "text-cyan-400"
                    }`}>
                      Quick Quiz
                    </span>
                  </div>
                  
                  <h2 className={`text-xl font-bold ${isLight ? "text-gray-900" : "text-white"}`}>
                    Test your knowledge
                  </h2>
                  <p className={`mt-2 text-sm ${isLight ? "text-gray-600" : "text-gray-400"}`}>
                    Answer to confirm you understood the lesson
                  </p>
                </div>
              </div>

              <div className="space-y-3 p-6">
                <div className="mb-4 flex items-center justify-between">
                  <span className={`text-sm ${isLight ? "text-gray-500" : "text-gray-400"}`}>
                    Question {currentQuestion + 1} of {questions.length}
                  </span>
                  <span className={`text-sm font-medium ${
                    isLight ? "text-gray-500" : "text-gray-400"
                  }`}>
                    Score: {score}/{currentQuestion + (selectedAnswer !== null ? 1 : 0)}
                  </span>
                </div>

                <p className={`text-lg font-medium ${isLight ? "text-gray-900" : "text-white"}`}>
                  {questions[currentQuestion]?.question}
                </p>

                <div className="space-y-2">
                  {questions[currentQuestion]?.options.map((option, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleAnswer(idx)}
                      disabled={selectedAnswer !== null}
                      className={`w-full rounded-xl border p-4 text-left transition-all ${
                        selectedAnswer === null
                          ? isLight
                            ? "border-gray-200 hover:border-pink-300 hover:bg-pink-50"
                            : "border-white/10 hover:border-cyan-500/30 hover:bg-cyan-500/10"
                          : idx === questions[currentQuestion].correctIndex
                          ? "border-green-500 bg-green-500/10 text-green-300"
                          : selectedAnswer === idx
                          ? "border-red-500 bg-red-500/10 text-red-300"
                          : "opacity-50"
                      } ${
                        isLight ? "text-gray-700" : "text-white"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {selectedAnswer !== null && idx === questions[currentQuestion].correctIndex && (
                          <CheckCircle className="h-5 w-5 text-green-400" />
                        )}
                        {selectedAnswer !== null && selectedAnswer === idx && idx !== questions[currentQuestion].correctIndex && (
                          <XCircle className="h-5 w-5 text-red-400" />
                        )}
                        <span>{option}</span>
                      </div>
                    </button>
                  ))}
                </div>

                {selectedAnswer !== null && (
                  <button
                    onClick={handleNext}
                    className="mt-4 w-full rounded-xl bg-gradient-to-r from-cyan-500 to-purple-500 px-4 py-3 text-sm font-semibold text-white transition-all hover:opacity-95"
                  >
                    {currentQuestion < questions.length - 1 ? "Next Question" : "See Results"}
                  </button>
                )}
              </div>
            </>
          ) : (
            <div className="p-8 text-center">
              {passed && finished ? (
                <>
                  <div className="mb-4 flex justify-center">
                    <div className="rounded-full bg-green-500/20 p-4">
                      <Sparkles className="h-12 w-12 text-green-400" />
                    </div>
                  </div>
                  <h2 className={`text-2xl font-bold ${isLight ? "text-gray-900" : "text-white"}`}>
                    🎉 Quiz Passed!
                  </h2>
                  <p className={`mt-2 ${isLight ? "text-gray-600" : "text-gray-400"}`}>
                    You scored {score} out of {questions.length}
                  </p>
                  <button
                    onClick={onPass}
                    className="mt-6 w-full rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 px-4 py-3 text-sm font-semibold text-white transition-all hover:opacity-95"
                  >
                    Continue
                  </button>
                </>
              ) : (
                <>
                  <div className="mb-4 flex justify-center">
                    <div className="rounded-full bg-red-500/20 p-4">
                      <XCircle className="h-12 w-12 text-red-400" />
                    </div>
                  </div>
                  <h2 className={`text-2xl font-bold ${isLight ? "text-gray-900" : "text-white"}`}>
                    Quiz Not Passed
                  </h2>
                  <p className={`mt-2 ${isLight ? "text-gray-600" : "text-gray-400"}`}>
                    You scored {score} out of {questions.length}. Need at least {Math.ceil(questions.length * 0.6)} to pass.
                  </p>
                  
                  <div className="mt-6 space-y-3">
                    <button
                      onClick={() => handleFail("retry")}
                      className="w-full rounded-xl bg-gradient-to-r from-cyan-500 to-purple-500 px-4 py-3 text-sm font-semibold text-white transition-all hover:opacity-95"
                    >
                      <RotateCcw className="mr-2 inline h-4 w-4" />
                      Try Again
                    </button>
                    <button
                      onClick={() => handleFail("return")}
                      className={`w-full rounded-xl border px-4 py-3 text-sm font-medium transition-all ${
                        isLight
                          ? "border-gray-200 text-gray-700 hover:bg-gray-50"
                          : "border-white/10 text-white hover:bg-white/5"
                      }`}
                    >
                      <BookOpen className="mr-2 inline h-4 w-4" />
                      Return to Learning
                    </button>
                  </div>
                </>
              )}
            </div>
          )}

          <button
            onClick={onClose}
            className={`absolute right-4 top-4 rounded-full p-2 transition-colors ${
              isLight ? "text-gray-400 hover:bg-gray-100" : "text-gray-500 hover:bg-white/10"
            }`}
          >
            <XCircle className="h-5 w-5" />
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}