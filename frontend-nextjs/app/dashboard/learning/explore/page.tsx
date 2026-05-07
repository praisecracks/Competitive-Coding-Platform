"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Search,
  Clock,
  ChevronRight,
  ArrowRight,
  BookOpen,
  GraduationCap,
  PlayCircle,
  Check,
} from "lucide-react";
import { LEARNING_PATHS, getTrackById } from "../data";
import { useTheme } from "@/app/context/ThemeContext";
import PageFooter from "@/app/components/PageFooter";
import { migrateLegacyProgress } from "@/lib/learning-api";

// Mapping from standalone course ID to its corresponding track and topic IDs
const COURSE_TO_TRACK_MAPPING: Record<string, { trackId: string; topicIds: string[] }> = {
  "js-functions-basics": { trackId: "master-javascript", topicIds: ["js-functions"] },
  "python-while-loops": { trackId: "master-python", topicIds: ["py-loops"] },
  "go-basics-structs": { trackId: "master-go", topicIds: ["go-structs"] },
  "binary-search-mastery": { trackId: "algorithms", topicIds: ["algo-binary-search"] },
  "sliding-window-tech": { trackId: "algorithms", topicIds: ["algo-sliding-window"] },
  "two-pointers-pattern": { trackId: "algorithms", topicIds: ["algo-two-pointers"] },
  "recursion-intro": { trackId: "algorithms", topicIds: ["algo-recursion"] },
  "dynamic-programming-intro": { trackId: "algorithms", topicIds: ["algo-dp"] },
  "hashing-basics": { trackId: "data-structures", topicIds: ["ds-hashing"] },
  "sql-basics": { trackId: "sql-databases", topicIds: ["sql-fundamentals"] },
};

type PathStatus = "not_started" | "in_progress" | "completed";

interface UserProgress {
  totalXp?: number;
  paths: {
    [pathId: string]: {
      completedStepIds: string[];
      liked: boolean;
      rating: number | null;
    };
  };
}

interface TrackProgress {
  completedTopicIds: string[];
  completedLessonIds?: string[];
  lessonProgress?: Record<string, { completed: boolean; timeSpentSeconds: number }>;
  topicTimeSpent?: Record<string, number>;
}

const categoryColors: Record<string, { light: string; dark: string; text: string }> = {
  JavaScript: { light: "bg-yellow-500", dark: "bg-yellow-500", text: "text-yellow-700" },
  Python: { light: "bg-emerald-500", dark: "bg-emerald-500", text: "text-emerald-700" },
  Go: { light: "bg-cyan-500", dark: "bg-cyan-500", text: "text-cyan-700" },
  Algorithms: { light: "bg-pink-500", dark: "bg-pink-500", text: "text-pink-700" },
  "Data Structures": { light: "bg-purple-500", dark: "bg-purple-500", text: "text-purple-700" },
};

export default function ExploreCoursesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [userProgress, setUserProgress] = useState<UserProgress>({
    paths: {},
    totalXp: 0,
  });
  const [trackProgressMap, setTrackProgressMap] = useState<Record<string, TrackProgress>>({});

  const { theme } = useTheme();
  const isLight = theme === "light";
  const router = useRouter();

  useEffect(() => {
      async function loadProgress() {
        const userEmail = localStorage.getItem("user_email");
        const sanitized = userEmail ? userEmail.toLowerCase().replace(/[^a-z0-9@._-]/g, "_").slice(0, 64) : null;
        
        // Read all possible sources synchronously first
        const userTrackKey = sanitized ? `codemaster_learning_track_progress_${sanitized}` : null;
        const userLegacyKey = sanitized ? `codemaster_learning_progress_v1_${sanitized}` : null;
        
        const userTrackStr = userTrackKey ? localStorage.getItem(userTrackKey) : null;
        const userLegacyStr = userLegacyKey ? localStorage.getItem(userLegacyKey) : null;
        const globalTrackStr = localStorage.getItem("codemaster_learning_track_progress");
        const globalLegacyStr = localStorage.getItem("codemaster_learning_progress_v1");
        
        // Parse user-scoped track data
        let userTrackData: Record<string, TrackProgress> = {};
        if (userTrackStr) {
          try {
            const parsed = JSON.parse(userTrackStr);
            if (parsed && Object.keys(parsed).length > 0) {
              userTrackData = parsed;
            }
          } catch {}
        }
        
        // Parse user-scoped legacy data
        let userLegacyData: UserProgress["paths"] = {};
        if (userLegacyStr) {
          try {
            const parsed: UserProgress = JSON.parse(userLegacyStr);
            if (parsed?.paths && Object.keys(parsed.paths).length > 0) {
              userLegacyData = parsed.paths;
            }
          } catch {}
        }
        
        // Parse global track data (fallback)
        let globalTrackData: Record<string, TrackProgress> = {};
        if (globalTrackStr) {
          try {
            const parsed = JSON.parse(globalTrackStr);
            if (parsed && Object.keys(parsed).length > 0) {
              globalTrackData = parsed as Record<string, TrackProgress>;
            }
          } catch {}
        }
        
        // Parse global legacy data (fallback)
        let globalLegacyData: UserProgress["paths"] = {};
        if (globalLegacyStr) {
          try {
            const parsed: UserProgress = JSON.parse(globalLegacyStr);
            if (parsed?.paths && Object.keys(parsed.paths).length > 0) {
              globalLegacyData = parsed.paths;
            }
          } catch {}
        }
        
        // Try MongoDB API (authoritative if available)
        try {
          const apiData = await migrateLegacyProgress();
          if (apiData.trackProgress && Object.keys(apiData.trackProgress).length > 0) {
            setTrackProgressMap(apiData.trackProgress);
          } else if (Object.keys(userTrackData).length > 0) {
            setTrackProgressMap(userTrackData);
          } else if (Object.keys(globalTrackData).length > 0) {
            setTrackProgressMap(globalTrackData);
          }
          
          if (apiData.legacyProgress && Object.keys(apiData.legacyProgress).length > 0) {
            setUserProgress({ paths: apiData.legacyProgress, totalXp: 0 });
          } else if (Object.keys(userLegacyData).length > 0) {
            setUserProgress({ paths: userLegacyData, totalXp: 0 });
          } else if (Object.keys(globalLegacyData).length > 0) {
            setUserProgress({ paths: globalLegacyData, totalXp: 0 });
          }
        } catch (e) {
          console.warn("API failed, using localStorage", e);
          // API failed - use best available localStorage data
          if (Object.keys(userTrackData).length > 0) {
            setTrackProgressMap(userTrackData);
          } else if (Object.keys(globalTrackData).length > 0) {
            setTrackProgressMap(globalTrackData);
          }
          
          if (Object.keys(userLegacyData).length > 0) {
            setUserProgress({ paths: userLegacyData, totalXp: 0 });
          } else if (Object.keys(globalLegacyData).length > 0) {
            setUserProgress({ paths: globalLegacyData, totalXp: 0 });
          }
        }
        
        // After state updates, derivedPaths will recompute
      };
      
      loadProgress();

      const handleProgressUpdate = () => {
        loadProgress();
      };

      window.addEventListener("codemaster-learning-updated", handleProgressUpdate);

      return () => {
        window.removeEventListener("codemaster-learning-updated", handleProgressUpdate);
      };
    }, []);



    const getProgressForCourse = (
      path: (typeof LEARNING_PATHS)[number],
      progressMap: Record<string, TrackProgress>,
      legacyProgress: UserProgress
    ) => {
      // 1. Check direct legacy course progress
      const directCourseProgress = legacyProgress?.paths?.[path.id];
      
      if (directCourseProgress?.completedStepIds && Array.isArray(directCourseProgress.completedStepIds)) {
        const completedSteps = directCourseProgress.completedStepIds.length;
        const totalSteps = path.steps.length;
        const progressPercentage = totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 0;
        
        const status: PathStatus =
          progressPercentage === 100
            ? "completed"
            : progressPercentage > 0
            ? "in_progress"
            : "not_started";
        
        return {
          completedSteps,
          totalSteps,
          progressPercentage,
          status,
        };
      }
      
      // 2. Check track-based progress via mapping
      const mapping = COURSE_TO_TRACK_MAPPING[path.id];
      if (mapping) {
        const trackProgress = progressMap[mapping.trackId];
        if (trackProgress) {
          const track = getTrackById(mapping.trackId);
          if (!track) {
            return {
              completedSteps: 0,
              totalSteps: path.steps.length,
              progressPercentage: 0,
              status: "not_started" as PathStatus,
            };
          }
          
          let totalLessons = 0;
          let completedLessons = 0;
          
          mapping.topicIds.forEach((topicId) => {
            const topic = track.topics.find((t) => t.id === topicId);
            if (!topic) return;
            
            const subtopicLessons = topic.subtopics.length;
            totalLessons += subtopicLessons;
            
            topic.subtopics.forEach((subtopic) => {
              if (
                trackProgress.lessonProgress?.[subtopic.id]?.completed ||
                trackProgress.completedLessonIds?.includes(subtopic.id)
              ) {
                completedLessons++;
              }
            });
          });
          
          // If the topic itself is marked completed, all its lessons count
          if (mapping.topicIds.some(tid => trackProgress.completedTopicIds?.includes(tid))) {
            completedLessons = totalLessons;
          }
          
          completedLessons = Math.min(completedLessons, totalLessons);
          
          const progressPercentage = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;
          const status: PathStatus =
            progressPercentage === 100
              ? "completed"
              : progressPercentage > 0
              ? "in_progress"
              : "not_started";
          
          return {
            completedSteps: completedLessons,
            totalSteps: totalLessons,
            progressPercentage,
            status,
          };
        }
      }
      
      // 3. Fallback: check if course ID directly matches a track topic
      for (const [trackId, progress] of Object.entries(progressMap)) {
        const track = getTrackById(trackId);
        if (!track) continue;
        
        const topic = track.topics.find((t) => t.id === path.id);
        if (topic) {
          const totalLessons = topic.subtopics.length;
          let completedLessons = 0;
          
          topic.subtopics.forEach((subtopic) => {
            if (
              progress.lessonProgress?.[subtopic.id]?.completed ||
              progress.completedLessonIds?.includes(subtopic.id)
            ) {
              completedLessons++;
            }
          });
          
          if (progress.completedTopicIds?.includes(path.id)) {
            completedLessons = totalLessons;
          }
          
          const progressPercentage = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;
          const status: PathStatus =
            progressPercentage === 100
              ? "completed"
              : progressPercentage > 0
              ? "in_progress"
              : "not_started";
          
          return {
            completedSteps: completedLessons,
            totalSteps: totalLessons,
            progressPercentage,
            status,
          };
        }
      }
      
      // No progress found
      return {
        completedSteps: 0,
        totalSteps: path.steps.length,
        progressPercentage: 0,
        status: "not_started" as PathStatus,
      };
    };

   // Helper to check if a specific course is fully completed (100%)
   const isCourseCompleted = (pathId: string): boolean => {
     const path = LEARNING_PATHS.find(p => p.id === pathId);
     if (!path) return true; // Unknown path considered satisfied
     const progress = getProgressForCourse(path, trackProgressMap, userProgress);
     return progress.progressPercentage === 100;
   };
   
   // Helper function to check if a course is locked based on prerequisites
   const isCourseLocked = (pathId: string): boolean => {
     const path = LEARNING_PATHS.find(p => p.id === pathId);
     if (!path) return true;
     
     // Beginner courses are always auto-unlocked
     if (path.difficulty === "Beginner") {
       return false;
     }
     
     if (!path.prerequisiteIds || path.prerequisiteIds.length === 0) {
       return false;
     }
     
     // Course is locked if ANY prerequisite is not completed (progress < 100%)
     return path.prerequisiteIds.some(prereqId => !isCourseCompleted(prereqId));
   };

      const derivedPaths = useMemo(() => {
        return LEARNING_PATHS.map((path) => {
          const resolvedProgress = getProgressForCourse(path, trackProgressMap, userProgress);
          const isLocked = isCourseLocked(path.id);

          return {
            ...path,
            completedSteps: resolvedProgress.completedSteps,
            totalSteps: resolvedProgress.totalSteps,
            progressPercentage: resolvedProgress.progressPercentage,
            status: resolvedProgress.status,
            isLocked,
          };
        });
      }, [userProgress, trackProgressMap]);

  const filteredPaths = derivedPaths.filter((path) => {
    const matchesSearch =
      path.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      path.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      path.category.toLowerCase().includes(searchQuery.toLowerCase());

    let matchesCategory = false;
    if (activeFilter === "All") {
      matchesCategory = true;
    } else if (activeFilter === "Interview Prep") {
      matchesCategory = path.category === "Algorithms" || path.category === "Data Structures";
    } else {
      matchesCategory = path.category === activeFilter;
    }

    return matchesSearch && matchesCategory;
  });

  const categories = [
    "All",
    "Interview Prep",
    ...Array.from(new Set(LEARNING_PATHS.map((p) => p.category))),
  ];

  const handleStart = (pathId: string) => {
    router.push(`/dashboard/learning/${pathId}`);
  };

  return (
    <div className={`min-h-screen ${isLight ? "bg-[#f8fafc]" : "bg-[#020202]"}`}>
      <div className={`border-b ${isLight ? "border-gray-200 bg-white" : "border-white/10 bg-[#0c0c12]"}`}>
        <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
          <button
            onClick={() => router.push("/dashboard/learning")}
            className={`mb-4 flex items-center gap-2 text-sm transition-colors ${
              isLight ? "text-gray-500 hover:text-gray-700" : "text-gray-400 hover:text-white"
            }`}
          >
            <ArrowRight className="h-4 w-4 rotate-180" />
            Back to Learning Paths
          </button>

          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <p
                className={`text-[11px] font-semibold uppercase tracking-[0.24em] ${
                  isLight ? "text-pink-600" : "text-pink-300"
                }`}
              >
                Available Courses
              </p>
              <h1
                className={`mt-2 text-3xl font-semibold tracking-tight sm:text-[2.35rem] ${
                  isLight ? "text-gray-900" : "text-white"
                }`}
              >
                Explore All Courses
              </h1>
              <p
                className={`mt-3 text-sm leading-6 ${
                  isLight ? "text-gray-600" : "text-gray-400"
                }`}
              >
                Browse through all available courses and find what interests you. Each course offers
                structured lessons to build your skills.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:min-w-[400px]">
              <div
                className={`flex items-center rounded-2xl border px-4 py-3 ${
                  isLight
                    ? "border-gray-200 bg-white shadow-[0_10px_24px_rgba(15,23,42,0.04)]"
                    : "border-white/10 bg-[#0c0c10]"
                }`}
              >
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                    isLight ? "bg-pink-50" : "bg-pink-500/15"
                  }`}
                >
                  <GraduationCap
                    className={`h-5 w-5 ${isLight ? "text-pink-600" : "text-pink-400"}`}
                  />
                </div>
                <div className="ml-3">
                  <p
                    className={`text-[10px] uppercase tracking-[0.18em] ${
                      isLight ? "text-gray-500" : "text-gray-400"
                    }`}
                  >
                    Total Courses
                  </p>
                  <p className={`text-lg font-semibold ${isLight ? "text-gray-900" : "text-white"}`}>
                    {LEARNING_PATHS.length}
                  </p>
                </div>
              </div>

               <div
                 className={`flex items-center rounded-2xl border px-4 py-3 ${
                   isLight
                     ? "border-purple-200 bg-purple-50 shadow-[0_10px_24px_rgba(15,23,42,0.04)]"
                     : "border-purple-500/15 bg-purple-500/[0.06]"
                 }`}
               >
                 <div
                   className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                     isLight ? "bg-purple-50" : "bg-purple-500/15"
                   }`}
                 >
                   <BookOpen
                     className={`h-5 w-5 ${isLight ? "text-purple-600" : "text-purple-400"}`}
                   />
                 </div>
                 <div className="ml-3">
                   <p
                     className={`text-[10px] uppercase tracking-[0.18em] ${
                       isLight ? "text-gray-500" : "text-gray-400"
                     }`}
                   >
                     Topics
                   </p>
                   <p className={`text-lg font-semibold ${isLight ? "text-gray-900" : "text-white"}`}>
                     {LEARNING_PATHS.reduce((sum, p) => sum + p.steps.length, 0)}
                   </p>
                 </div>
               </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid gap-3 lg:grid-cols-[1.2fr_auto]">
          <div
            className={`flex items-center rounded-2xl border px-4 py-3 transition-all duration-300 focus-within:border-pink-300 ${
              isLight
                ? "border-gray-200 bg-white shadow-[0_10px_24px_rgba(15,23,42,0.04)] hover:border-gray-300"
                : "border-white/10 bg-[#0c0c10] hover:border-white/15"
            }`}
          >
            <Search
              className={`mr-3 h-4 w-4 ${isLight ? "text-pink-500" : "text-pink-300"}`}
            />
            <input
              type="text"
              placeholder="Search courses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full bg-transparent text-sm outline-none ${
                isLight
                  ? "text-gray-900 placeholder:text-gray-400"
                  : "text-white placeholder:text-gray-600"
              }`}
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveFilter(cat)}
                className={`rounded-xl px-4 py-2 text-xs font-semibold transition-all ${
                  activeFilter === cat
                    ? "bg-pink-500 text-white shadow-lg shadow-pink-500/20"
                    : isLight
                    ? "border border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
                    : "border border-white/10 bg-white/[0.03] text-gray-400 hover:bg-white/[0.06]"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filteredPaths.map((path, index) => {
            const categoryColor = categoryColors[path.category] || categoryColors.JavaScript;

            return (
              <motion.article
                key={path.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05, duration: 0.3 }}
                className="group cursor-pointer"
              >
                 <div
                   className={`relative overflow-hidden rounded-[20px] border transition-all duration-400 ease-out ${
                     isLight
                       ? "border-gray-200 bg-white shadow-[0_8px_30px_rgba(15,23,42,0.08)]"
                       : "border-white/10 bg-[#0c0c12]"
                   } group-hover:-translate-y-2 group-hover:shadow-[0_20px_50px_rgba(15,23,42,0.15)] ${
                     path.isLocked ? "opacity-50 pointer-events-none" : ""
                   }`}
                 >
                  <div className="relative h-40 overflow-hidden">
                    <motion.img
                      src={path.coverImage}
                      alt={path.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

                    <div className="absolute left-4 top-4">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold text-white shadow-lg ${
                          isLight
                            ? `${categoryColor.light}`
                            : `${categoryColor.dark} bg-opacity-90`
                        }`}
                      >
                        {path.category}
                      </span>
                    </div>

                    {path.status === "completed" && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/90 backdrop-blur-sm">
                          <Check className="h-6 w-6 text-white" />
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="p-5">
                    <h3
                      className={`text-lg font-bold transition-colors duration-300 ${
                        isLight
                          ? "text-gray-900 group-hover:text-pink-600"
                          : "text-white group-hover:text-pink-400"
                      }`}
                    >
                      {path.title}
                    </h3>
                    <p className={`mt-1.5 text-sm ${isLight ? "text-gray-500" : "text-gray-400"}`}>
                      {path.subtitle}
                    </p>

                    <div
                      className={`mt-4 flex items-center gap-4 text-sm ${
                        isLight ? "text-gray-500" : "text-gray-500"
                      }`}
                    >
                      <span className="flex items-center gap-1.5">
                        <Clock className="h-4 w-4" />
                        {path.readTime}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <PlayCircle className="h-4 w-4" />
                        {path.totalSteps} lessons
                      </span>
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                          path.difficulty === "Beginner"
                            ? isLight
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-emerald-500/20 text-emerald-300"
                            : path.difficulty === "Intermediate"
                            ? isLight
                              ? "bg-amber-100 text-amber-700"
                              : "bg-amber-500/20 text-amber-300"
                            : isLight
                            ? "bg-rose-100 text-rose-700"
                            : "bg-rose-500/20 text-rose-300"
                        }`}
                      >
                        {path.difficulty}
                      </span>
                    </div>

                    <div className="mt-5">
                      <div
                        className={`h-2.5 overflow-hidden rounded-full ${
                          isLight ? "bg-gray-100" : "bg-white/[0.06]"
                        }`}
                      >
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${path.progressPercentage}%` }}
                          transition={{ duration: 0.8, ease: "easeOut" }}
                          className={`h-full rounded-full ${
                            path.status === "completed"
                              ? "bg-emerald-500"
                              : "bg-gradient-to-r from-pink-500 to-purple-500"
                          }`}
                        />
                      </div>
                      <p className={`mt-2 text-sm ${isLight ? "text-gray-500" : "text-gray-500"}`}>
                        <span className={isLight ? "text-gray-700" : "text-gray-300"}>
                          {path.completedSteps}
                        </span>
                        /{path.totalSteps} lessons completed
                      </p>
                    </div>

                     <motion.button
                       whileHover={{ scale: 1.02 }}
                       whileTap={{ scale: 0.98 }}
                       onClick={() => {
                         if (!path.isLocked) {
                           handleStart(path.id);
                         }
                       }}
                       className={`mt-5 flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3.5 text-sm font-semibold transition-all duration-300 ${
                         path.status === "completed"
                           ? isLight
                             ? "bg-gray-100 text-gray-700 hover:bg-emerald-500 hover:text-white"
                             : "bg-white/[0.06] text-white hover:bg-emerald-500"
                           : path.status === "in_progress"
                           ? "bg-gradient-to-r from-pink-500 to-purple-600 text-white"
                           : path.isLocked
                           ? isLight
                             ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                             : "bg-white/[0.06] text-gray-400 cursor-not-allowed"
                           : isLight
                           ? "bg-gray-100 text-gray-700 hover:bg-pink-500 hover:text-white"
                           : "bg-white/[0.06] text-white hover:bg-pink-500"
                       }`}
                     >
                       {path.isLocked
                         ? "Locked"
                         : path.status === "completed"
                         ? "Review Course"
                         : path.status === "in_progress"
                         ? "Continue Learning"
                         : "Start Course"}
                       <ChevronRight className="h-4 w-4" />
                     </motion.button>
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>

        {filteredPaths.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`mt-12 flex flex-col items-center justify-center rounded-2xl border py-16 ${
              isLight ? "border-gray-200 bg-white" : "border-white/10 bg-[#0c0c12]"
            }`}
          >
            <Search className={`h-12 w-12 ${isLight ? "text-gray-300" : "text-gray-600"}`} />
            <h3
              className={`mt-4 text-lg font-semibold ${isLight ? "text-gray-900" : "text-white"}`}
            >
              No courses found
            </h3>
            <p className={`mt-2 text-sm ${isLight ? "text-gray-500" : "text-gray-400"}`}>
              Try adjusting your search or filters
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setActiveFilter("All");
              }}
              className={`mt-4 text-sm font-medium ${
                isLight ? "text-pink-600 hover:text-pink-700" : "text-pink-400 hover:text-pink-300"
              }`}
            >
              Clear filters
            </button>
          </motion.div>
        )}
      </div>
      <PageFooter/>
    </div>
  );
}