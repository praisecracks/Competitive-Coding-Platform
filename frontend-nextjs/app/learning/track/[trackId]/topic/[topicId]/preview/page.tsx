"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { Sparkles, ArrowLeft, PlayCircle, GraduationCap, Languages, AlertTriangle, LogIn, UserPlus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import LearningContent from "@/app/dashboard/learning/LearningContent";
import CodePlayground from "@/app/dashboard/learning/CodePlayground";
import { useTheme } from "@/app/context/ThemeContext";
import {
  getTrackById,
  LearningTrack,
  TrackTopic,
  Subtopic,
} from "@/app/dashboard/learning/data";

export default function PublicLessonPreviewPage() {
  const { theme } = useTheme();
  const isLight = theme === "light";
  const router = useRouter();
  const params = useParams();
  const trackId = params.trackId as string;
  const topicId = params.topicId as string;

  const track = getTrackById(trackId) as LearningTrack | undefined;
  const topic = track?.topics.find((t: TrackTopic) => t.id === topicId);
  const firstLesson = topic?.subtopics[0];

  const [activeLesson, setActiveLesson] = useState<Subtopic | null>(
    firstLesson || null
  );
  const [loading, setLoading] = useState(true);

  // Run limiter state
  const [runCount, setRunCount] = useState<number>(() => {
    if (typeof window !== "undefined") {
      const saved = sessionStorage.getItem(`preview-run-count-${trackId}-${topicId}`);
      return saved ? parseInt(saved, 10) : 0;
    }
    return 0;
  });

  const [isRunDisabled, setIsRunDisabled] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      const saved = sessionStorage.getItem(`preview-run-disabled-${trackId}-${topicId}`);
      return saved === "true";
    }
    return false;
  });

   const [showWarningModal, setShowWarningModal] = useState(false);
   const [showAuthModal, setShowAuthModal] = useState(false);

   // Scroll to curriculum on mount if hash is present
   useEffect(() => {
     if (typeof window !== "undefined") {
       const hash = window.location.hash;
       if (hash) {
         const element = document.querySelector(hash);
         if (element) {
           setTimeout(() => {
             element.scrollIntoView({ behavior: "smooth", block: "start" });
           }, 100);
         }
       }
     }
   }, []);

   const authRedirect = `/dashboard/learning/track/${trackId}/topic/${topicId}`;
  const signupHref = `/signup?redirect=${encodeURIComponent(authRedirect)}`;
  const loginHref = `/login?redirect=${encodeURIComponent(authRedirect)}`;

  useEffect(() => {
    if (topic?.subtopics[0]) {
      setActiveLesson(topic.subtopics[0]);
    }
    setLoading(false);
  }, [topic]);

  // Persist run count to sessionStorage
  useEffect(() => {
    sessionStorage.setItem(`preview-run-count-${trackId}-${topicId}`, runCount.toString());
  }, [runCount, trackId, topicId]);

   // Persist disabled state to sessionStorage
   useEffect(() => {
     sessionStorage.setItem(`preview-run-disabled-${trackId}-${topicId}`, isRunDisabled.toString());
   }, [isRunDisabled, trackId, topicId]);

   // Handlers must be defined BEFORE any early returns
   const handleRun = useCallback(() => {
     if (isRunDisabled) return;

     const newCount = runCount + 1;
     setRunCount(newCount);

     if (newCount === 4) {
       setShowWarningModal(true);
     } else if (newCount >= 5) {
       setShowAuthModal(true);
     }
   }, [runCount, isRunDisabled]);

   const handleSkip = () => {
     setIsRunDisabled(true);
     setShowAuthModal(false);
   };

   const handleSignUp = () => {
     router.push(signupHref);
   };

   const handleLogin = () => {
     router.push(loginHref);
   };

   const handleCloseWarning = () => {
     setShowWarningModal(false);
   };

   const getLanguageDisplayName = (lang: string) => {
     if (lang === 'python') return 'Python';
     if (lang === 'go') return 'Go';
     return 'JavaScript';
   };

   // Determine playground language based on track type and language
   const getPlaygroundLanguage = (): "javascript" | "python" | "go" => {
     if (track?.language !== "multi" && track?.language) {
       return track.language as "javascript" | "python" | "go";
     }
     // For multi-language tracks in preview, default to javascript
     return "javascript"; 
   };

   const playgroundLanguage = getPlaygroundLanguage();
   const isMultiLanguage = track?.language === "multi";
   const isSingleLanguage = track?.language !== "multi";

   if (loading || !track || !topic || !activeLesson) {
     return (
       <div className="flex min-h-screen items-center justify-center bg-[#050505]">
         <div className="h-8 w-8 animate-spin rounded-full border-2 border-pink-500 border-t-transparent" />
       </div>
     );
    }

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-fuchsia-500/20 selection:text-white">
      {/* Public header */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-black/80 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4">
            <div className="flex min-w-0 items-center gap-2">
              <button
                onClick={() => router.push(`/learning/track/${trackId}`)}
                className="flex items-center gap-1.5 text-sm text-white/50 transition-colors hover:text-white"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back</span>
              </button>
              <span className="text-white/20">/</span>
              <span className="truncate text-sm text-white/60">
                Learning Preview
              </span>
            </div>

            <div className="flex items-center gap-2">
              <a
                href={loginHref}
                className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3.5 py-2 text-xs font-medium text-white/80 transition hover:bg-white/10"
              >
                <PlayCircle className="h-3.5 w-3.5" />
                Sign In
              </a>
              <a
                href={signupHref}
                className="inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-fuchsia-600 to-pink-600 px-3.5 py-2 text-xs font-semibold text-white shadow-lg shadow-fuchsia-500/20 transition hover:opacity-95"
              >
                Create Account
              </a>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Track + Topic title */}
        <div className="mb-8">
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-fuchsia-500/10 px-3 py-1 text-xs font-semibold text-fuchsia-300">
              <Sparkles className="h-3 w-3" />
              Free Preview
            </span>
            <span className="text-white/30">•</span>
            <span className="text-sm text-white/50">{track.title}</span>
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
            {topic.title}
          </h1>

          <p className="mt-2 max-w-3xl text-sm leading-6 text-white/60">
            {topic.description}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-stretch">
          {/* Main content */}
          <section className="space-y-6 lg:col-span-8">
            <div className="rounded-2xl border border-fuchsia-500/20 bg-fuchsia-500/8 px-5 py-4">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-sm font-semibold text-white">
                    You’re previewing the first lesson
                  </p>
                  <p className="mt-1 text-sm leading-6 text-white/65">
                    Explore the lesson, test code in the playground, and create
                    a free account to unlock all lessons and save your progress.
                  </p>
                </div>

                <div className="flex shrink-0 gap-2">
                  <a
                    href={signupHref}
                    className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-fuchsia-600 to-pink-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-fuchsia-500/20 transition hover:opacity-95"
                  >
                    Create Free Account
                  </a>
                  <a
                    href={loginHref}
                    className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-medium text-white/90 transition hover:bg-white/10"
                  >
                    Log In
                  </a>
                </div>
              </div>
            </div>

            {/* Lesson content */}
            <LearningContent
              path={{
                currentStepTitle: activeLesson.title,
                currentStepDescription: topic.description,
                content: activeLesson.content.explanation,
                example: activeLesson.content.example,
              }}
              progressPercentage={0}
            />

              {/* Code playground */}
              {activeLesson.content.example && (
                <div className="rounded-2xl border border-white/10 bg-[#0a0a0f] p-5 sm:p-6">
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-white">
                      Try It Yourself
                    </h3>
                    <div className="flex items-center gap-3">
                      {/* Language selector for multi-language tracks in preview */}
                      {isMultiLanguage && (
                        <div className="relative">
                          {/* For preview, we could add a simple cycle button; keeping it simple for now */}
                          <span className="inline-flex items-center gap-2 rounded-lg border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-semibold text-white">
                            <Languages className="h-3.5 w-3.5" />
                            {getLanguageDisplayName(playgroundLanguage)}
                          </span>
                        </div>
                      )}
                      <span className="rounded-lg border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/60">
                        {isSingleLanguage 
                          ? getLanguageDisplayName(track?.language || 'javascript')
                          : isMultiLanguage
                            ? getLanguageDisplayName(playgroundLanguage)
                            : 'Code'}
                      </span>
                    </div>
                  </div>

                   <CodePlayground
                     initialCode={activeLesson.content.example.code}
                     language={playgroundLanguage}
                     lockedLanguage={true}
                     onRun={handleRun}
                     runDisabled={isRunDisabled}
                   />
                 </div>
               )}

             {/* Bottom CTA */}
            <div className="rounded-2xl border border-fuchsia-500/30 bg-fuchsia-500/10 px-6 py-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-semibold text-white">
                    Enjoying this lesson?
                  </p>
                  <p className="mt-0.5 text-sm text-white/70">
                    Create a free account to save progress, unlock all topics,
                    and continue your learning path.
                  </p>
                </div>

                <div className="flex gap-2">
                  <a
                    href={signupHref}
                    className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-fuchsia-600 to-pink-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-fuchsia-500/20 transition hover:opacity-95"
                  >
                    Create Free Account
                  </a>
                  <a
                    href={loginHref}
                    className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-medium text-white/90 transition hover:bg-white/10"
                  >
                    Log In
                  </a>
                </div>
              </div>
            </div>
          </section>

           {/* Sticky Sidebar */}
           <aside className="lg:col-span-4">
             <div className="lg:sticky lg:top-24 lg:max-h-[calc(100vh-7rem)] lg:overflow-y-auto lg:pr-1">
              <div className="space-y-6">
                {/* Course outline */}
                <div className="rounded-2xl border border-white/10 bg-[#0a0a0f] p-5 sm:p-6">
                  <div className="mb-3">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/50">
                      Previewing
                    </p>
                    <h3 className="mt-1 text-base font-bold text-white">
                      {topic.title}
                    </h3>
                  </div>

                  <p className="mb-4 text-xs text-white/50">
                    Lesson 1 of {topic.subtopics.length}
                  </p>

                  <div className="space-y-2">
                    {topic.subtopics.map((subtopic, idx) => (
                      <div
                        key={subtopic.id}
                        className={`flex items-start gap-3 rounded-xl border p-3 text-sm ${
                          idx === 0
                            ? "border-fuchsia-500/30 bg-fuchsia-500/10 ring-1 ring-fuchsia-500/20"
                            : "border-white/10 bg-white/5 opacity-70"
                        }`}
                      >
                        <div className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white/10 text-xs font-bold text-white">
                          {idx + 1}
                        </div>

                        <div className="min-w-0 flex-1">
                          <p
                            className={`truncate text-sm font-medium ${
                              idx === 0 ? "text-white" : "text-white/70"
                            }`}
                          >
                            {subtopic.title}
                          </p>
                          {idx === 0 ? (
                            <p className="mt-1 text-xs text-fuchsia-300">
                              Available in preview
                            </p>
                          ) : (
                            <p className="mt-1 text-xs text-white/40">
                              Unlock after sign up
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  <p className="mt-4 text-xs text-white/40">
                    Sign up to unlock all {topic.subtopics.length} lessons in
                    this topic.
                  </p>
                </div>

                {/* Included */}
                <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 px-5 py-4">
                  <h4 className="text-sm font-semibold text-amber-100">
                    What’s included
                  </h4>

                  <div className="mt-3 space-y-2 text-sm text-amber-200/70">
                    <div className="flex items-center gap-2">
                      <PlayCircle className="h-4 w-4" />
                      Interactive code playground
                    </div>
                    <div className="flex items-center gap-2">
                      <GraduationCap className="h-4 w-4" />
                      Complete first lesson content
                    </div>
                  </div>
                </div>

                {/* Sticky CTA card */}
                <div className="rounded-2xl border border-fuchsia-500/20 bg-gradient-to-br from-fuchsia-500/10 to-pink-500/10 p-5">
                  <p className="text-sm font-semibold text-white">
                    Ready to continue?
                  </p>
                  <p className="mt-2 text-sm leading-6 text-white/65">
                    Unlock the full track, save progress, and keep learning from
                    where you stop.
                  </p>

                  <div className="mt-4 flex flex-col gap-2">
                    <a
                      href={signupHref}
                      className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-fuchsia-600 to-pink-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-fuchsia-500/20 transition hover:opacity-95"
                    >
                      Create Free Account
                    </a>
                    <a
                      href={loginHref}
                      className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium text-white/90 transition hover:bg-white/10"
                    >
                      Log In
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </main>

       {/* Simple footer */}
       <footer className="border-t border-white/10 py-6 text-center text-sm text-white/30">
         <p>© 2026 CodeMaster. Learning preview. Sign up to continue.</p>
       </footer>

       {/* Warning Modal: Shows on 4th run */}
       <AnimatePresence>
         {showWarningModal && (
           <motion.div
             key="run-limit-warning"
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             exit={{ opacity: 0 }}
             className="fixed inset-0 z-[200] flex items-center justify-center p-4"
           >
             <motion.div
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               onClick={handleCloseWarning}
               className={`absolute inset-0 ${isLight ? "bg-black/40" : "bg-black/60"} backdrop-blur-sm`}
             />
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
                 <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                   isLight ? "bg-amber-100 text-amber-700" : "bg-amber-500/15 text-amber-400"
                 }`}>
                   <AlertTriangle className="h-5 w-5" />
                 </div>
                 <div className="flex-1">
                   <h3 className={`text-lg font-semibold ${isLight ? "text-gray-900" : "text-white"}`}>
                     Last free attempt
                   </h3>
                   <p className={`mt-1.5 text-sm ${isLight ? "text-gray-600" : "text-gray-400"}`}>
                     You have 1 more try to run code. To continue practicing, please sign up or log in.
                   </p>
                 </div>
               </div>
               <div className="mt-6 flex items-center justify-end gap-3">
                 <button
                   onClick={handleCloseWarning}
                   className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                     isLight
                       ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
                       : "bg-white/5 text-white hover:bg-white/10"
                   }`}
                 >
                   Continue
                 </button>
               </div>
             </motion.div>
           </motion.div>
         )}
       </AnimatePresence>

       {/* Auth Required Modal: Shows on 5th+ run */}
       <AnimatePresence>
         {showAuthModal && (
           <motion.div
             key="auth-required"
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             exit={{ opacity: 0 }}
             className="fixed inset-0 z-[200] flex items-center justify-center p-4"
           >
             <motion.div
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               onClick={handleSkip}
               className={`absolute inset-0 ${isLight ? "bg-black/40" : "bg-black/60"} backdrop-blur-sm`}
             />
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
                 <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                   isLight ? "bg-red-100 text-red-600" : "bg-red-500/15 text-red-400"
                 }`}>
                   <AlertTriangle className="h-5 w-5" />
                 </div>
                 <div className="flex-1">
                   <h3 className={`text-lg font-semibold ${isLight ? "text-gray-900" : "text-white"}`}>
                     Sign up required
                   </h3>
                   <p className={`mt-1.5 text-sm ${isLight ? "text-gray-600" : "text-gray-400"}`}>
                     You've used all your free attempts. Sign up for a free account to continue running code, or skip to continue browsing.
                   </p>
                 </div>
               </div>
               <div className="mt-6 flex flex-col gap-2">
                 <button
                   onClick={handleSignUp}
                   className={`w-full rounded-lg px-4 py-2.5 text-sm font-semibold text-white transition-colors ${
                     isLight
                       ? "bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700"
                       : "bg-gradient-to-r from-fuchsia-600 to-pink-600 hover:opacity-95"
                   }`}
                 >
                   <span className="flex items-center justify-center gap-2">
                     <UserPlus className="h-4 w-4" />
                     Create Free Account
                   </span>
                 </button>
                 <button
                   onClick={handleLogin}
                   className={`w-full rounded-lg border px-4 py-2.5 text-sm font-medium transition-colors ${
                     isLight
                       ? "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                       : "border-white/10 bg-white/5 text-white hover:bg-white/10"
                   }`}
                 >
                   <span className="flex items-center justify-center gap-2">
                     <LogIn className="h-4 w-4" />
                     Log In
                   </span>
                 </button>
                 <button
                   onClick={handleSkip}
                   className={`w-full rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${
                     isLight
                       ? "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                       : "text-gray-400 hover:text-white hover:bg-white/5"
                   }`}
                 >
                   Skip, continue without signing up
                 </button>
               </div>
             </motion.div>
           </motion.div>
         )}
       </AnimatePresence>
     </div>
   );
 }