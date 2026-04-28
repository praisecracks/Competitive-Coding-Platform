"use client";

import { createPortal } from "react-dom";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { getStoredToken } from "@/lib/auth";
import { useTheme } from "../../context/ThemeContext";
import Header from "@/app/components/dashboard/header";
import Footer from "@/app/components/Footer";
import FeedbackFAB from "../../components/FeedbackFAB";
import PageFooter from "@/app/components/PageFooter";
import { motion } from "framer-motion";
import {
  Target,
  Trophy,
  BookOpen,
  ChevronRight,
  Search,
  Clock,
  Zap,
  PlayCircle,
} from "lucide-react";

type Challenge = {
  id: number;
  title: string;
  description: string;
  difficulty: string;
  category: string;
  duration: number;
  tags: string[];
  opened?: boolean;
};

const difficultyOrder = ["Easy", "Medium", "Hard"];
const statusOptions = ["All", "Opened", "Available"];
const INITIAL_SECTION_LIMIT = 6;
const LOAD_MORE_STEP = 6;

export default function DashboardChallengesPage() {
  const router = useRouter();
  const { theme } = useTheme();
  const isLight = theme === "light";

  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeDifficulty, setActiveDifficulty] = useState("All");
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeStatus, setActiveStatus] = useState("All");
  const [errorMessage, setErrorMessage] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(
    null
  );
  const [mounted, setMounted] = useState(false);

  const [visibleCount, setVisibleCount] = useState(INITIAL_SECTION_LIMIT);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!showModal) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [showModal]);

  useEffect(() => {
    if (!showModal) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeChallengeModal();
      }
    };

    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, [showModal]);

  const truncateText = (text: string, maxLength: number) => {
    if (!text) return "";
    return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
  };

  const fetchChallenges = useCallback(async () => {
    setLoading(true);
    setErrorMessage("");

    try {
      const token = getStoredToken();
      const headers: HeadersInit = {
        "Content-Type": "application/json",
      };

      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const res = await fetch("/api/challenges", {
        cache: "no-store",
        headers,
      });

      if (!res.ok) {
        const errorText = await res.text().catch(() => "");
        console.error("Challenge fetch failed:", res.status, errorText);
        setChallenges([]);
        setErrorMessage("Unable to load challenges right now.");
        return;
      }

      const data = await res.json();
      setChallenges(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Challenge fetch error:", error);
      setChallenges([]);
      setErrorMessage("Backend is offline or unreachable at the moment.");
    } finally {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchChallenges();
  }, [fetchChallenges]);

  useEffect(() => {
    setVisibleCount(INITIAL_SECTION_LIMIT);
  }, [searchQuery, activeDifficulty, activeCategory, activeStatus]);

    const categories = useMemo(() => {
      const unique = [
        ...new Set(challenges.map((item) => item.category).filter(Boolean)),
      ];
      return ["All", ...unique];
    }, [challenges]);

     // Smart challenge recommendation logic
     const smartChallenge = useMemo(() => {
       // If there's an opened challenge, show the first opened challenge
       const openedChallenge = challenges.find((c) => c.opened);
       if (openedChallenge) return openedChallenge;
       
       // Else show first unopened Easy challenge
       const easyUnopenedChallenge = challenges.find(
         (c) => !c.opened && c.difficulty?.toLowerCase() === "easy"
       );
       if (easyUnopenedChallenge) return easyUnopenedChallenge;
       
       // Else show first challenge
       return challenges[0];
     }, [challenges]);

     // Filter challenges based on search and filters
     const filteredChallenges = useMemo(() => {
       return challenges.filter((challenge) => {
         // Search filter
         if (searchQuery.trim() !== '') {
           const searchableText = `${challenge.title} ${challenge.category} ${challenge.description} ${challenge.tags.join(' ')}`.toLowerCase();
           if (!searchableText.includes(searchQuery.toLowerCase())) {
             return false;
           }
         }
         
         // Difficulty filter
         if (activeDifficulty !== 'All' && challenge.difficulty !== activeDifficulty) {
           return false;
         }
         
         // Category filter
         if (activeCategory !== 'All' && challenge.category !== activeCategory) {
           return false;
         }
         
         // Status filter
         if (activeStatus !== 'All') {
           if (activeStatus === 'Opened' && !challenge.opened) {
             return false;
           }
           if (activeStatus === 'Available' && challenge.opened) {
             return false;
           }
         }
         
         return true;
       });
     }, [challenges, searchQuery, activeDifficulty, activeCategory, activeStatus]);

     // Visible challenges (paginated)
     const visibleChallenges = useMemo(() => {
       return filteredChallenges.slice(0, visibleCount);
     }, [filteredChallenges, visibleCount]);

     // Start Here section - first 3 Easy challenges
     const startHereChallenges = useMemo(() => {
       return challenges
         .filter((challenge) => !challenge.opened && challenge.difficulty?.toLowerCase() === "easy")
         .slice(0, 3);
     }, [challenges]);

     // Continue Learning section - opened challenges
     const openedChallenges = useMemo(() => {
       return challenges.filter((challenge) => challenge.opened);
     }, [challenges]);

     // Available challenges - not opened
     const availableChallenges = useMemo(() => {
       return challenges.filter((challenge) => !challenge.opened);
     }, [challenges]);

      // Learning stats
      const learningStats = useMemo(() => {
        return {
          started: openedChallenges.length,
          available: availableChallenges.length
        };
      }, [openedChallenges, availableChallenges]);

      // Recommended challenge - use smartChallenge for recommendation
      const recommendedChallenge = useMemo(() => {
        return smartChallenge;
      }, [smartChallenge]);

      // Helper function to get recommendation reason
      const getRecommendationReason = useCallback((challenge: Challenge) => {
        if (!challenge) return "";

        if (challenge.opened) {
          return "You already started this challenge — continue from here.";
        }

        if (!challenge.opened && challenge.difficulty?.toLowerCase() === "easy") {
          return "A good beginner-friendly challenge to build momentum.";
        }

        return "A focused challenge to keep your practice moving.";
      }, []);

    const getDifficultyWeight = (difficulty: string) => {
        switch (difficulty?.toLowerCase()) {
          case "easy":
            return 1;
          case "medium":
            return 2;
          case "hard":
            return 3;
          default:
            return 4;
        }
      };

    // Helper function to get smart challenge reason
    const getSmartChallengeReason = useCallback((challenge: Challenge) => {
      if (!challenge) return "";

      if (challenge.opened) {
        return "You already started this challenge — continue from here.";
      }

      if (!challenge.opened && challenge.difficulty?.toLowerCase() === "easy") {
        return "A good beginner-friendly challenge to build momentum.";
      }

      return "A focused challenge to keep your practice moving.";
    }, []);

    // Get difficulty icon for UI
    const getDifficultyIcon = (difficulty: string) => {
      switch (difficulty?.toLowerCase()) {
        case "easy":
          return <BookOpen className="h-3.5 w-3.5" />;
        case "medium":
          return <Zap className="h-3.5 w-3.5" />;
        case "hard":
          return <Trophy className="h-3.5 w-3.5" />;
        default:
          return <Target className="h-3.5 w-3.5" />;
      }
    };

    const openChallengeModal = (challenge: Challenge) => {
    setSelectedChallenge(challenge);
    setShowModal(true);
  };

  const closeChallengeModal = () => {
    setShowModal(false);
    setSelectedChallenge(null);
  };

  const handleStartChallenge = () => {
    if (!selectedChallenge) return;
    closeChallengeModal();
    router.push(`/challenges/${selectedChallenge.id}?mode=solo`);
  };

  const handleViewDetails = (challengeId: number) => {
    closeChallengeModal();
    router.push(`/dashboard/challenges/${challengeId}`);
  };

  const getDifficultyClasses = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case "easy":
        return isLight
          ? "border-emerald-200 bg-emerald-50 text-emerald-700"
          : "border-emerald-500/20 bg-emerald-500/10 text-emerald-300";
      case "medium":
        return isLight
          ? "border-amber-200 bg-amber-50 text-amber-700"
          : "border-amber-500/20 bg-amber-500/10 text-amber-300";
      case "hard":
        return isLight
          ? "border-rose-200 bg-rose-50 text-rose-700"
          : "border-rose-500/20 bg-rose-500/10 text-rose-300";
      default:
     return isLight
           ? "border-gray-200 bg-gray-50 text-gray-700"
           : "border-white/10 bg-white/5 text-gray-300";
     }
   };

   // Get XP value for difficulty
   const getXP = (difficulty: string) => {
     switch (difficulty?.toLowerCase()) {
       case "easy":
         return 50;
       case "medium":
         return 100;
       case "hard":
         return 200;
       default:
         return 25;
     }
   };

  const CustomSelect = ({
    value,
    onChange,
    options,
    allLabel,
  }: {
    value: string;
    onChange: (value: string) => void;
    options: string[];
    allLabel: string;
  }) => {
    return (
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full appearance-none rounded-2xl border px-4 py-3 pr-10 text-sm outline-none transition duration-200 ${
            isLight
              ? "border-gray-200 bg-white text-gray-800 hover:border-gray-300 focus:border-pink-300 focus:bg-white"
              : "border-white/10 bg-[#0c0c10] text-gray-200 hover:border-white/15 focus:border-pink-500/30 focus:bg-[#101017]"
          }`}
        >
          {options.map((option) => (
            <option
              key={option}
              value={option}
              className={isLight ? "bg-white text-gray-800" : "bg-[#0c0c10] text-gray-200"}
            >
              {option === "All" ? allLabel : option}
            </option>
          ))}
        </select>

        <span
          className={`pointer-events-none absolute inset-y-0 right-4 flex items-center text-[11px] ${
            isLight ? "text-gray-400" : "text-gray-500"
          }`}
        >
          ▼
        </span>
      </div>
    );
  };

   const renderChallengeCard = (challenge: Challenge) => {
     // Determine card accent color based on difficulty
     const getDifficultyIcon = (difficulty: string) => {
       switch (difficulty?.toLowerCase()) {
         case "easy":
           return <BookOpen className="h-3.5 w-3.5" />;
         case "medium":
           return <Zap className="h-3.5 w-3.5" />;
         case "hard":
           return <Trophy className="h-3.5 w-3.5" />;
         default:
           return <Target className="h-3.5 w-3.5" />;
       }
     };

     return (
       <motion.article
         key={challenge.id}
         initial={{ opacity: 0, y: 20 }}
         animate={{ opacity: 1, y: 0 }}
         transition={{ duration: 0.35 }}
         whileHover={{ y: -4, transition: { duration: 0.2 } }}
         className={`group relative overflow-hidden rounded-[24px] border p-5 transition-all duration-300 ${
           isLight
             ? "border-gray-200 bg-white shadow-[0_10px_30px_rgba(15,23,42,0.06)] hover:border-pink-200 hover:shadow-[0_20px_50px_rgba(15,23,42,0.12)]"
             : "border-white/10 bg-[#09090c] hover:border-pink-500/20 hover:shadow-[0_0_0_1px_rgba(236,72,153,0.06),0_20px_60px_rgba(0,0,0,0.30)]"
         }`}
       >
         {/* Top gradient line */}
         <div
           className={`absolute inset-x-0 top-0 h-px ${
             isLight
               ? "bg-gradient-to-r from-transparent via-pink-200 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"
               : "bg-gradient-to-r from-transparent via-pink-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"
           }`}
         />

         <div className="mb-3 flex items-start justify-between gap-3">
           <div className="flex items-center gap-2">
             <span
               className={`rounded-full border px-2.5 py-1 text-[10px] font-mono ${
                 isLight
                   ? "border-gray-200 bg-gray-50 text-gray-500"
                   : "border-white/10 bg-white/[0.04] text-gray-400"
               }`}
             >
               #{String(challenge.id).padStart(3, "0")}
             </span>

             {challenge.opened && (
               <span
                 className={`rounded-full border px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.18em] ${
                   isLight
                     ? "border-purple-200 bg-purple-50 text-purple-700"
                     : "border-purple-500/20 bg-purple-500/10 text-purple-300"
                 }`}
               >
                 In Progress
               </span>
             )}
           </div>

            <span
              className={`rounded-full border px-2.5 py-1 text-[10px] font-medium flex items-center gap-1.5 ${getDifficultyClasses(
                challenge.difficulty
              )}`}
            >
              {getDifficultyIcon(challenge.difficulty)}
              {challenge.difficulty}
              <span className="text-[9px] font-normal opacity-75">
                (+{getXP(challenge.difficulty)} XP)
              </span>
            </span>
          </div>

         <h3
           className={`text-[1.15rem] font-semibold leading-tight tracking-tight transition ${
             isLight
               ? "text-gray-900 group-hover:text-pink-600"
               : "text-white group-hover:text-pink-100"
           }`}
         >
           {challenge.title}
         </h3>

          <p className={`mt-1.5 text-xs flex items-center gap-2 ${isLight ? "text-gray-500" : "text-gray-400"}`}>
            <span>{challenge.category}</span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {challenge.duration} min
            </span>
          </p>

         <p
           className={`mt-3 text-sm leading-6 ${
             isLight ? "text-gray-600" : "text-gray-400"
           }`}
         >
           {truncateText(challenge.description, 110)}
         </p>

         {challenge.tags?.length > 0 && (
           <div className="mt-3 flex flex-wrap gap-2">
             {challenge.tags.slice(0, 3).map((tag) => (
               <span
                 key={tag}
                 className={`rounded-full border px-2.5 py-1 text-[10px] ${
                   isLight
                     ? "border-gray-200 bg-gray-50 text-gray-700"
                     : "border-white/10 bg-white/[0.04] text-gray-300"
                 }`}
               >
                 {tag}
               </span>
             ))}
           </div>
         )}

         {/* Progress feedback */}
         <div className="mt-4">
           {challenge.opened ? (
             <p className={`text-xs flex items-center gap-1.5 ${isLight ? "text-emerald-600" : "text-emerald-400"}`}>
               <PlayCircle className="h-3.5 w-3.5" />
               You've started this — continue your progress
             </p>
           ) : (
             <p className={`text-xs flex items-center gap-1.5 ${isLight ? "text-blue-600" : "text-blue-400"}`}>
               <Target className="h-3.5 w-3.5" />
               New challenge — ready to start
             </p>
           )}
         </div>

         <div className="mt-4 flex items-center gap-2">
           <button
             onClick={() => openChallengeModal(challenge)}
             className={`flex-1 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-200 ${
               isLight
                 ? "bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-[0_4px_12px_rgba(236,72,153,0.3)] hover:shadow-[0_6px_20px_rgba(236,72,153,0.4)] hover:scale-[1.01] active:scale-[0.99]"
                 : "bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-[0_4px_12px_rgba(236,72,153,0.25)] hover:shadow-[0_6px_20px_rgba(236,72,153,0.35)] hover:scale-[1.01] active:scale-[0.99]"
             }`}
           >
             {challenge.opened ? (
               <>
                 <PlayCircle className="inline h-4 w-4 mr-1.5" />
                 Continue
               </>
             ) : (
               <>
                 <Target className="inline h-4 w-4 mr-1.5" />
                 Start Challenge
               </>
             )}
           </button>

           <button
             onClick={() => handleViewDetails(challenge.id)}
             className={`rounded-xl border px-4 py-2.5 text-sm font-medium transition ${
               isLight
                 ? "border-gray-200 bg-white text-gray-700 hover:bg-gray-50 hover:border-gray-300"
                 : "border-white/10 bg-[#0c0c10] text-white hover:bg-white/5 hover:border-white/15"
             }`}
           >
             Details
           </button>
         </div>
       </motion.article>
     );
   };

  const renderSection = ({
    title,
    subtitle,
    items,
    totalCount,
    visibleCount,
    onLoadMore,
  }: {
    title: string;
    subtitle: string;
    items: Challenge[];
    totalCount: number;
    visibleCount: number;
    onLoadMore: () => void;
  }) => {
    const hasMore = visibleCount < totalCount;

    return (
      <section className="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2
              className={`text-[1.85rem] font-semibold leading-tight tracking-tight ${
                isLight ? "text-gray-900" : "text-white"
              }`}
            >
              {title}
            </h2>
            <p
              className={`mt-2 max-w-2xl text-sm leading-6 ${
                isLight ? "text-gray-600" : "text-gray-400"
              }`}
            >
              {subtitle}
            </p>
          </div>

          <div className={`text-sm ${isLight ? "text-gray-500" : "text-gray-500"}`}>
            {totalCount} {totalCount === 1 ? "challenge" : "challenges"}
          </div>
        </div>

         {items.length === 0 ? (
           <motion.div
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             className={`rounded-[24px] border px-6 py-12 text-center ${
               isLight
                 ? "border-gray-200 bg-white shadow-[0_10px_30px_rgba(15,23,42,0.06)]"
                 : "border-white/10 bg-[#09090c]"
             }`}
           >
             <div className={`mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full ${
               isLight ? "bg-gray-100 text-gray-400" : "bg-white/5 text-gray-500"
             }`}>
              <Search className="h-6 w-6" />
             </div>
             <p className={`text-lg font-semibold ${isLight ? "text-gray-900" : "text-white"}`}>
               No challenges found
             </p>
             <p
               className={`mx-auto mt-2 max-w-md text-sm leading-6 ${
                 isLight ? "text-gray-600" : "text-gray-400"
               }`}
             >
               {searchQuery || activeDifficulty !== "All" || activeCategory !== "All" || activeStatus !== "All"
                 ? "Try adjusting your search or filter options to see more results."
                 : "No challenges are available at the moment. Check back soon!"}
             </p>
             {(searchQuery || activeDifficulty !== "All" || activeCategory !== "All" || activeStatus !== "All") && (
               <button
                 onClick={() => {
                   setSearchQuery("");
                   setActiveDifficulty("All");
                   setActiveCategory("All");
                   setActiveStatus("All");
                 }}
                 className={`mt-4 rounded-xl border px-5 py-2.5 text-sm font-medium transition ${
                   isLight
                     ? "border-pink-200 bg-pink-50 text-pink-700 hover:bg-pink-100"
                     : "border-pink-500/20 bg-pink-500/10 text-pink-300 hover:bg-pink-500/15"
                 }`}
               >
                 Reset Filters
               </button>
             )}
           </motion.div>
         ) : (
           <>
             <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
               {items.map((challenge) => renderChallengeCard(challenge))}
             </div>

             {hasMore && (
               <motion.div
                 initial={{ opacity: 0, y: 10 }}
                 animate={{ opacity: 1, y: 0 }}
                 className="flex justify-center pt-2"
               >
                 <button
                   onClick={onLoadMore}
                   className={`group relative rounded-xl border px-6 py-3 text-sm font-semibold transition-all duration-200 ${
                     isLight
                       ? "border-pink-200 bg-gradient-to-r from-pink-50 to-white text-pink-700 hover:border-pink-300 hover:shadow-[0_8px_24px_rgba(236,72,153,0.15)]"
                       : "border-pink-500/20 bg-gradient-to-r from-pink-500/[0.08] to-transparent text-pink-300 hover:border-pink-500/30 hover:shadow-[0_8px_24px_rgba(236,72,153,0.12)]"
                   }`}
                 >
                   Load More Challenges
                 </button>
               </motion.div>
             )}
           </>
         )}
      </section>
    );
  };

  const challengeModal =
    mounted &&
    showModal &&
    selectedChallenge &&
    createPortal(
      <div className="fixed inset-0 z-[300]">
        <button
          type="button"
          aria-label="Close challenge preview modal"
          className={`absolute inset-0 h-screen w-screen ${
            isLight ? "bg-slate-900/30" : "bg-black/50"
          } backdrop-blur-md`}
          onClick={closeChallengeModal}
        />

        <div className="absolute inset-0 flex min-h-screen items-center justify-center overflow-y-auto p-4">
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Challenge preview"
            className={`relative w-full max-w-md overflow-hidden rounded-[26px] border ${
              isLight
                ? "border-gray-200 bg-white shadow-[0_24px_60px_rgba(15,23,42,0.18)]"
                : "border-white/10 bg-[#0b0b10] shadow-[0_25px_100px_rgba(0,0,0,0.45)]"
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className={`absolute inset-x-0 top-0 h-px ${
                isLight
                  ? "bg-gradient-to-r from-transparent via-pink-300 to-transparent"
                  : "bg-gradient-to-r from-transparent via-pink-500/50 to-transparent"
              }`}
            />

            <div className="p-5">
              <div className="mb-4 flex items-start justify-between gap-4">
                <div>
                  <p
                    className={`text-[11px] uppercase tracking-[0.22em] ${
                      isLight ? "text-pink-600" : "text-pink-300"
                    }`}
                  >
                    Challenge Preview
                  </p>
                  <h3
                    className={`mt-2 text-lg font-semibold leading-tight tracking-tight ${
                      isLight ? "text-gray-900" : "text-white"
                    }`}
                  >
                    {selectedChallenge.title}
                  </h3>
                </div>

                <button
                  onClick={closeChallengeModal}
                  className={`rounded-full border px-2.5 py-1 text-xs transition ${
                    isLight
                      ? "border-gray-200 text-gray-500 hover:border-gray-300 hover:text-gray-900"
                      : "border-white/10 text-gray-400 hover:border-white/20 hover:text-white"
                  }`}
                >
                  ✕
                </button>
              </div>

              <div className="mb-4 flex flex-wrap gap-2">
                <span
                  className={`rounded-full border px-3 py-1 text-[10px] font-medium flex items-center gap-1.5 ${getDifficultyClasses(
                    selectedChallenge.difficulty
                  )}`}
                >
                  {getDifficultyIcon(selectedChallenge.difficulty)}
                  {selectedChallenge.difficulty}
                  <span className="text-[9px] font-normal opacity-75">
                    (+{getXP(selectedChallenge.difficulty)} XP)
                  </span>
                </span>

                 {selectedChallenge.opened && (
                   <span
                     className={`rounded-full border px-3 py-1 text-[9px] font-semibold uppercase tracking-[0.18em] ${
                       isLight
                         ? "border-purple-200 bg-purple-50 text-purple-700"
                         : "border-purple-500/20 bg-purple-500/10 text-purple-300"
                     }`}
                   >
                     In Progress
                   </span>
                 )}

                <span
                  className={`rounded-full border px-3 py-1 text-[10px] ${
                    isLight
                      ? "border-gray-200 bg-gray-50 text-gray-700"
                      : "border-white/10 bg-white/[0.04] text-gray-300"
                  }`}
                >
                  {selectedChallenge.category}
                </span>

                <span
                  className={`rounded-full border px-3 py-1 text-[10px] ${
                    isLight
                      ? "border-gray-200 bg-gray-50 text-gray-700"
                      : "border-white/10 bg-white/[0.04] text-gray-300"
                  }`}
                >
                  {selectedChallenge.duration} min
                </span>
              </div>

              <p
                className={`text-sm leading-6 ${
                  isLight ? "text-gray-600" : "text-gray-400"
                }`}
              >
                {selectedChallenge.description}
              </p>

              {selectedChallenge.tags?.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {selectedChallenge.tags.map((tag) => (
                    <span
                      key={tag}
                      className={`rounded-full border px-2.5 py-1 text-[10px] ${
                        isLight
                          ? "border-gray-200 bg-gray-50 text-gray-700"
                          : "border-white/10 bg-white/[0.04] text-gray-300"
                      }`}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              <div className="mt-5 flex items-center gap-2.5">
                <button
                  onClick={handleStartChallenge}
                  className={`flex-1 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-200 ${
                    isLight
                      ? "bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-[0_4px_12px_rgba(236,72,153,0.3)] hover:shadow-[0_6px_20px_rgba(236,72,153,0.4)] hover:scale-[1.01] active:scale-[0.99]"
                      : "bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-[0_4px_12px_rgba(236,72,153,0.25)] hover:shadow-[0_6px_20px_rgba(236,72,153,0.35)] hover:scale-[1.01] active:scale-[0.99]"
                  }`}
                >
                  {selectedChallenge.opened ? (
                    <>
                      <PlayCircle className="inline h-4 w-4 mr-1.5" />
                      Continue
                    </>
                  ) : (
                    <>
                      <Target className="inline h-4 w-4 mr-1.5" />
                      Start Challenge
                    </>
                  )}
                </button>

                <button
                  onClick={() => handleViewDetails(selectedChallenge.id)}
                  className={`rounded-xl border px-4 py-2.5 text-sm font-medium transition ${
                    isLight
                      ? "border-gray-200 bg-white text-gray-700 hover:bg-gray-50 hover:border-gray-300"
                      : "border-white/10 bg-[#0c0c10] text-white hover:bg-white/5 hover:border-white/15"
                  }`}
                >
                  Details
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>,
      document.body
    );

  return (
    <div className={`space-y-6 ${isLight ? "text-gray-900" : "text-white"}`}>
      {challengeModal}

      <section
        className={`relative overflow-hidden rounded-[28px] border px-5 py-5 sm:px-6 sm:py-6 ${
          isLight
            ? "border-gray-200 bg-white shadow-[0_12px_34px_rgba(15,23,42,0.06)]"
            : "border-white/10 bg-[#09090c]"
        }`}
      >
        <div
          className={`absolute inset-0 ${
            isLight
              ? "bg-[radial-gradient(circle_at_top_right,rgba(168,85,247,0.08),transparent_26%),radial-gradient(circle_at_left,rgba(236,72,153,0.05),transparent_24%)]"
              : "bg-[radial-gradient(circle_at_top_right,rgba(168,85,247,0.12),transparent_26%),radial-gradient(circle_at_left,rgba(236,72,153,0.08),transparent_24%)]"
          }`}
        />
        <div
          className={`absolute inset-0 ${
            isLight
              ? "opacity-[0.02] [background-image:linear-gradient(rgba(15,23,42,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(15,23,42,0.08)_1px,transparent_1px)] [background-size:28px_28px]"
              : "opacity-[0.04] [background-image:linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:28px_28px]"
          }`}
        />

        <div className="relative">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            {/* Main hero content */}
            <div className="max-w-2xl">
              <span
                className={`inline-flex items-center rounded-full border px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] ${
                  isLight
                    ? "border-pink-200 bg-pink-50 text-pink-600"
                    : "border-pink-500/20 bg-pink-500/[0.08] text-pink-200"
                }`}
              >
                Learning workspace
              </span>

              <h1
                className={`mt-4 text-[2rem] font-semibold leading-tight tracking-tight sm:text-[2.35rem] ${
                  isLight ? "text-gray-900" : "text-white"
                }`}
              >
                Sharpen your coding mastery with focused practice
              </h1>

              <p
                className={`mt-3 max-w-xl text-sm leading-6 ${
                  isLight ? "text-gray-600" : "text-gray-400"
                }`}
              >
                Continue opened challenges and move into the next set of learning
                recommendations with a cleaner, more focused workflow.
              </p>

              {/* Continue Learning CTA */}
               {smartChallenge && (
                 <motion.div
                   initial={{ opacity: 0, y: 10 }}
                   animate={{ opacity: 1, y: 0 }}
                   transition={{ duration: 0.3, delay: 0.1 }}
                   className="mt-6"
                 >
                   <button
                     onClick={() => router.push(`/challenges/${smartChallenge.id}?mode=solo`)}
                     className={`group relative inline-flex items-center gap-2.5 rounded-2xl px-5 py-3 text-sm font-semibold transition-all duration-300 ${
                       isLight
                         ? "bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow-[0_8px_24px_rgba(236,72,153,0.35)] hover:shadow-[0_12px_32px_rgba(236,72,153,0.45)] hover:scale-[1.02]"
                         : "bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-[0_8px_24px_rgba(236,72,153,0.25)] hover:shadow-[0_12px_32px_rgba(236,72,153,0.35)] hover:scale-[1.02]"
                     }`}
                   >
                     <PlayCircle className="h-4 w-4" />
                     Continue Last Challenge
                     <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                   </button>
                   <p className={`mt-2 text-xs ${isLight ? "text-gray-500" : "text-gray-400"}`}>
                     Pick up where you left off
                   </p>
                 </motion.div>
               )}
            </div>

            {/* Contextual Stats Cards */}
            <div className="flex flex-wrap gap-2.5 lg:max-w-[360px] lg:justify-end">
              {/* Completed Challenges Card */}
              {/* Started Challenges Card */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.32, delay: 0 }}
                className={`relative overflow-hidden rounded-2xl border px-5 py-4 ${
                  isLight
                    ? "border-emerald-200 bg-gradient-to-br from-emerald-50 to-white shadow-[0_14px_34px_rgba(15,23,42,0.06)]"
                    : "border-emerald-500/15 bg-gradient-to-br from-emerald-500/[0.12] via-emerald-500/[0.04] to-[#0b0b10] shadow-xl"
                }`}
              >
                <div className="absolute right-2 top-2 opacity-10">
                  <Trophy className="h-10 w-10" />
                </div>
                <div className="flex items-center gap-2">
                  <div
                    className={`flex h-9 w-9 items-center justify-center rounded-lg ${
                      isLight ? "bg-emerald-100 text-emerald-700" : "bg-emerald-500/15 text-emerald-400"
                    }`}
                  >
                    <PlayCircle className="h-4 w-4" />
                  </div>
                  <div>
                    <p
                      className={`text-[10px] font-semibold uppercase tracking-[0.18em] ${
                        isLight ? "text-emerald-600/80" : "text-emerald-200/80"
                      }`}
                    >
                      Started
                    </p>
                    <p className={`mt-0.5 text-2xl font-bold ${isLight ? "text-gray-900" : "text-white"}`}>
                      {learningStats.started}
                    </p>
                    <p className={`text-[10px] ${isLight ? "text-emerald-700/70" : "text-emerald-300/70"}`}>
                      in progress
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Available Challenges Card */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.32, delay: 0.05 }}
                className={`relative overflow-hidden rounded-2xl border px-5 py-4 ${
                  isLight
                    ? "border-blue-200 bg-gradient-to-br from-blue-50 to-white shadow-[0_14px_34px_rgba(15,23,42,0.06)]"
                    : "border-blue-500/15 bg-gradient-to-br from-blue-500/[0.12] via-blue-500/[0.04] to-[#0b0b10] shadow-xl"
                }`}
              >
                <div className="absolute right-2 top-2 opacity-10">
                  <BookOpen className="h-10 w-10" />
                </div>
                <div className="flex items-center gap-2">
                  <div
                    className={`flex h-9 w-9 items-center justify-center rounded-lg ${
                      isLight ? "bg-blue-100 text-blue-700" : "bg-blue-500/15 text-blue-400"
                    }`}
                  >
                    <BookOpen className="h-4 w-4" />
                  </div>
                  <div>
                    <p
                      className={`text-[10px] font-semibold uppercase tracking-[0.18em] ${
                        isLight ? "text-blue-600/80" : "text-blue-200/80"
                      }`}
                    >
                      Available
                    </p>
                    <p className={`mt-0.5 text-2xl font-bold ${isLight ? "text-gray-900" : "text-white"}`}>
                      {learningStats.available}
                    </p>
                    <p className={`text-[10px] ${isLight ? "text-blue-700/70" : "text-blue-300/70"}`}>
                      to start
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      <section
        className={`rounded-[26px] border p-3 sm:p-4 ${
          isLight
            ? "border-gray-200 bg-white shadow-[0_10px_30px_rgba(15,23,42,0.06)]"
            : "border-white/10 bg-[#09090c]"
        }`}
      >
        <div className="grid gap-3 lg:grid-cols-[1.35fr_0.28fr_0.28fr_0.28fr]">
          <div
            className={`flex items-center rounded-2xl border px-4 py-3 transition duration-200 ${
              isLight
                ? "border-gray-200 bg-white hover:border-gray-300 focus-within:border-pink-300"
                : "border-white/10 bg-[#0c0c10] hover:border-white/15 focus-within:border-pink-500/25"
            }`}
          >
            <span className={`mr-3 text-sm ${isLight ? "text-pink-600" : "text-pink-300"}`}>
              Search
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Title, category, description, or tags"
              className={`w-full bg-transparent text-sm outline-none ${
                isLight
                  ? "text-gray-900 placeholder:text-gray-400"
                  : "text-white placeholder:text-gray-600"
              }`}
            />
          </div>

          <CustomSelect
            value={activeStatus}
            onChange={setActiveStatus}
            options={statusOptions}
            allLabel="All status"
          />

          <CustomSelect
            value={activeDifficulty}
            onChange={setActiveDifficulty}
            options={["All", ...difficultyOrder]}
            allLabel="All difficulties"
          />

          <CustomSelect
            value={activeCategory}
            onChange={setActiveCategory}
            options={categories}
            allLabel="All categories"
          />
         </div>
       </section>

         {/* Recommended Next Challenge Section */}
         {!loading && !errorMessage && recommendedChallenge && (
           <section className="space-y-4 mb-8">
             <div className="flex items-center gap-2">
               <Target className={`h-5 w-5 ${isLight ? "text-blue-600" : "text-blue-400"}`} />
               <h2
                 className={`text-[1.5rem] font-semibold leading-tight tracking-tight ${
                   isLight ? "text-gray-900" : "text-white"
                 }`}
               >
                 Recommended Next
               </h2>
             </div>
             <p
               className={`text-sm leading-6 ${isLight ? "text-gray-600" : "text-gray-400"}`}
             >
               {getRecommendationReason(recommendedChallenge)}
             </p>

             <div className="grid grid-cols-1 gap-4">
               <div key={recommendedChallenge.id}>
                 {renderChallengeCard(recommendedChallenge)}
               </div>
             </div>

             {/* <div className="mt-4 flex items-center gap-2">
               <button
                 onClick={() => {
                   openChallengeModal(recommendedChallenge);
                 }}
                 className={`flex-1 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-200 ${
                   isLight
                     ? "bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-[0_4px_12px_rgba(236,72,153,0.3)] hover:shadow-[0_6px_20px_rgba(236,72,153,0.4)] hover:scale-[1.01] active:scale-[0.99]"
                     : "bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-[0_4px_12px_rgba(236,72,153,0.25)] hover:shadow-[0_6px_20px_rgba(236,72,153,0.35)] hover:scale-[1.01] active:scale-[0.99]"
                 }`}
               >
                 {recommendedChallenge.opened ? (
                   <>
                     <PlayCircle className="inline h-4 w-4 mr-1.5" />
                     Continue
                   </>
                 ) : (
                   <>
                     <Target className="inline h-4 w-4 mr-1.5" />
                     Start Recommended
                   </>
                 )}
               </button>

               <button
                 onClick={() => handleViewDetails(recommendedChallenge.id)}
                 className={`rounded-xl border px-4 py-2.5 text-sm font-medium transition ${
                   isLight
                     ? "border-gray-200 bg-white text-gray-700 hover:bg-gray-50 hover:border-gray-300"
                     : "border-white/10 bg-[#0c0c10] text-white hover:bg-white/5 hover:border-white/15"
                 }`}
               >
                 Details
               </button>
             </div> */}
           </section>
         )}



        {/* Main Challenges Section */}
        {loading ? (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className={`relative overflow-hidden rounded-[24px] border p-5 ${
                  isLight
                    ? "border-gray-200 bg-white"
                    : "border-white/10 bg-[#09090c]"
                }`}
              >
                {/* Skeleton top border line */}
                <div className={`absolute inset-x-0 top-0 h-px ${
                  isLight ? "bg-gray-200" : "bg-white/10"
                }`} />
                
                {/* Badge row skeleton */}
                <div className="mb-3 flex items-start justify-between gap-3">
                  <div className="flex gap-2">
                    <div className={`h-6 w-12 animate-pulse rounded-full ${
                      isLight ? "bg-gray-200" : "bg-white/10"
                    }`} />
                    <div className={`h-6 w-14 animate-pulse rounded-full ${
                      isLight ? "bg-gray-200" : "bg-white/10"
                    }`} />
                  </div>
                  <div className={`h-6 w-16 animate-pulse rounded-full ${
                    isLight ? "bg-gray-200" : "bg-white/10"
                  }`} />
                </div>

                {/* Title */}
                <div className={`h-6 w-3/4 animate-pulse rounded-lg mb-3 ${
                  isLight ? "bg-gray-200" : "bg-white/10"
                }`} />
                
                {/* Category line */}
                <div className={`h-4 w-1/2 animate-pulse rounded mb-4 ${
                  isLight ? "bg-gray-200" : "bg-white/10"
                }`} />

                {/* Description */}
                <div className={`space-y-2 mb-4`}>
                  <div className={`h-4 w-full animate-pulse rounded ${
                    isLight ? "bg-gray-200" : "bg-white/10"
                  }`} />
                  <div className={`h-4 w-full animate-pulse rounded ${
                    isLight ? "bg-gray-200" : "bg-white/10"
                  }`} />
                  <div className={`h-4 w-2/3 animate-pulse rounded ${
                    isLight ? "bg-gray-200" : "bg-white/10"
                  }`} />
                </div>

                {/* Tags skeleton */}
                <div className="flex gap-2 mb-4">
                  <div className={`h-6 w-16 animate-pulse rounded-full ${
                    isLight ? "bg-gray-200" : "bg-white/10"
                  }`} />
                  <div className={`h-6 w-20 animate-pulse rounded-full ${
                    isLight ? "bg-gray-200" : "bg-white/10"
                  }`} />
                </div>

                {/* Progress feedback placeholder */}
                <div className={`h-4 w-48 animate-pulse rounded mb-4 ${
                  isLight ? "bg-gray-100" : "bg-white/5"
                }`} />

                {/* Action buttons */}
                <div className="flex gap-2.5">
                  <div className={`flex-1 h-10 animate-pulse rounded-xl ${
                    isLight ? "bg-gray-200" : "bg-white/10"
                  }`} />
                  <div className={`h-10 w-20 animate-pulse rounded-xl ${
                    isLight ? "bg-gray-200" : "bg-white/10"
                  }`} />
                </div>
              </div>
            ))}
          </div>
        ) : errorMessage ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`rounded-[24px] border px-6 py-12 text-center ${
              isLight
                ? "border-pink-200 bg-pink-50 shadow-[0_10px_30px_rgba(236,72,153,0.08)]"
                : "border-pink-500/15 bg-pink-500/[0.04]"
            }`}
          >
            <div className={`mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full ${
              isLight ? "bg-pink-100 text-pink-600" : "bg-pink-500/15 text-pink-400"
            }`}>
              <Target className="h-6 w-6" />
            </div>
            <p
              className={`text-lg font-semibold ${
                isLight ? "text-pink-700" : "text-pink-200"
              }`}
            >
              Unable to load challenges
            </p>
            <p
              className={`mx-auto mt-2 max-w-md text-sm leading-6 ${
                isLight ? "text-gray-600" : "text-gray-300"
              }`}
            >
              {errorMessage}
            </p>
            <button
              onClick={fetchChallenges}
              className={`mt-4 rounded-xl border px-5 py-2.5 text-sm font-medium transition ${
                isLight
                  ? "border-pink-200 bg-pink-100 text-pink-700 hover:bg-pink-200"
                  : "border-pink-500/20 bg-pink-500/15 text-pink-300 hover:bg-pink-500/20"
              }`}
            >
              Try Again
            </button>
          </motion.div>
        ) : (
        renderSection({
          title: "Challenges",
          subtitle: "Browse, resume, or discover your next challenge.",
          items: visibleChallenges,
          totalCount: filteredChallenges.length,
          visibleCount: visibleCount,
          onLoadMore: () => setVisibleCount((prev) => prev + LOAD_MORE_STEP),
        })
      )}
      {/* <Footer /> */}
      <FeedbackFAB />
      <PageFooter />
    </div>
  );
}