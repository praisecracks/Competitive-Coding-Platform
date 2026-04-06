"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  fetchSearchResults,
  debounce,
  getInitials,
  SearchResults,
  SearchUser,
  SearchChallenge,
} from "@/lib/search";

export default function SearchBar() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResults>({ users: [], challenges: [] });
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState("");
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Debounced search function - use useMemo to maintain same instance
  const performSearch = useMemo(() => {
    return debounce(async (searchQuery: string) => {
      if (!searchQuery.trim()) {
        setResults({ users: [], challenges: [] });
        setError("");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");
        // Get token at call time
        const token =
          typeof window !== "undefined"
            ? localStorage.getItem("terminal_token") || undefined
            : undefined;
        const data = await fetchSearchResults(searchQuery, token);
        setResults(data);
      } catch (err) {
        console.error("Search error:", err);
        setError("Failed to search. Please try again.");
      } finally {
        setLoading(false);
      }
    }, 300); // 300ms debounce
  }, []);

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    setIsOpen(true);

    if (!value.trim()) {
      setResults({ users: [], challenges: [] });
      setError("");
      setLoading(false);
    } else {
      setLoading(true);
      performSearch(value);
    }
  };

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") {
      setIsOpen(false);
      setQuery("");
    }
    
    // Prevent Enter from submitting and navigating
    if (e.key === "Enter") {
      e.preventDefault();
      // Optionally: select the first result if available
      if (results.users.length > 0) {
        handleUserClick(results.users[0].id, results.users[0].username);
      } else if (results.challenges.length > 0) {
        handleChallengeClick(results.challenges[0].id);
      } else {
        setIsOpen(false);
      }
    }
  };

  // Handle user click
  const handleUserClick = (userId: string, username: string) => {
    setIsOpen(false);
    setQuery("");
    router.push(`/dashboard/leaderboard?user=${userId}`);
  };

  // Handle challenge click
  const handleChallengeClick = (challengeId: string) => {
    setIsOpen(false);
    setQuery("");
    router.push(`/dashboard/challenges/${challengeId}`);
  };

  const hasResults =
    results.users.length > 0 || results.challenges.length > 0;
  const totalResults = results.users.length + results.challenges.length;

  return (
    <div ref={searchRef} className="relative w-full">
      {/* Search Input */}
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => query && setIsOpen(true)}
          placeholder="Search users, challenges..."
          className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 pr-10 text-sm text-white placeholder:text-gray-500 outline-none transition focus:border-pink-500/50 focus:bg-white/10"
        />

        {/* Search Icon */}
        <svg
          className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>

        {/* Loading Spinner */}
        {loading && (
          <div className="absolute right-10 top-1/2 -translate-y-1/2">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-pink-500/30 border-t-pink-500"></div>
          </div>
        )}
      </div>

      {/* Dropdown Results */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 z-[100] mt-2 rounded-lg border border-white/10 bg-[#0a0a0a] backdrop-blur-xl shadow-2xl">
          {/* Loading State */}
          {loading && !hasResults && (
            <div className="flex items-center justify-center px-4 py-8">
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-pink-500/30 border-t-pink-500"></div>
            </div>
          )}
Search Results
          {/* Error State */}
          {error && (
            <div className="px-4 py-4 text-center">
              <p className="text-sm text-red-400">{error}</p>
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && query && !hasResults && (
            <div className="px-4 py-8 text-center">
              <svg
                className="mx-auto h-8 w-8 text-gray-600 mb-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p className="text-sm text-gray-500">
                No results found for "<span className="text-white">{query}</span>"
              </p>
            </div>
          )}

          {/* Results Sections */}
          {hasResults && (
            <div className="max-h-[420px] overflow-y-auto">
              {/* Users Section */}
              {results.users.length > 0 && (
                <div className="border-b border-white/5 py-2">
                  <div className="px-4 py-2">
                    <p className="text-xs font-semibold uppercase tracking-wider text-gray-600">
                      Users
                    </p>
                  </div>
                  <div className="space-y-1">
                    {results.users.map((user: SearchUser) => (
                      <button
                        key={user.id}
                        onClick={() => handleUserClick(user.id, user.username)}
                        className="w-full px-4 py-3 text-left transition hover:bg-white/5"
                      >
                        <div className="flex items-center gap-3">
                          {/* Avatar */}
                          {user.profile_pic ? (
                            <img
                              src={user.profile_pic}
                              alt={user.username}
                              className="h-8 w-8 rounded-lg border border-white/10 object-cover"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.style.display = 'none';
                                target.nextElementSibling?.classList.remove('hidden');
                              }}
                            />
                          ) : (
                            <div className="hidden flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-gradient-to-br from-pink-500/20 to-purple-500/20 text-xs font-bold text-pink-400">
                              {getInitials(user.username)}
                            </div>
                          )}

                          {/* User Info */}
                          <div className="min-w-0">
                            <p className="truncate text-sm font-medium text-white">
                              {user.username}
                            </p>
                            {user.rank && (
                              <p className="text-xs text-gray-500">{user.rank}</p>
                            )}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Challenges Section */}
              {results.challenges.length > 0 && (
                <div className="py-2">
                  <div className="px-4 py-2">
                    <p className="text-xs font-semibold uppercase tracking-wider text-gray-600">
                      Challenges
                    </p>
                  </div>
                  <div className="space-y-1">
                    {results.challenges.map((challenge: SearchChallenge) => (
                      <button
                        key={challenge.id}
                        onClick={() => handleChallengeClick(challenge.id)}
                        className="w-full px-4 py-3 text-left transition hover:bg-white/5"
                      >
                        <div className="space-y-1">
                          <p className="truncate text-sm font-medium text-white">
                            {challenge.title}
                          </p>
                          <div className="flex items-center gap-2">
                            {challenge.difficulty && (
                              <span
                                className={`inline-flex text-xs font-medium px-2 py-0.5 rounded-full ${
                                  challenge.difficulty === "Easy"
                                    ? "bg-emerald-500/10 text-emerald-400"
                                    : challenge.difficulty === "Medium"
                                    ? "bg-yellow-500/10 text-yellow-400"
                                    : "bg-red-500/10 text-red-400"
                                }`}
                              >
                                {challenge.difficulty}
                              </span>
                            )}
                            {challenge.category && (
                              <span className="text-xs text-gray-500">
                                {challenge.category}
                              </span>
                            )}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Show more results indicator */}
              {totalResults >= 5 && (
                <div className="border-t border-white/5 px-4 py-2 text-center">
                  <p className="text-xs text-gray-600">
                    Showing {totalResults} result{totalResults !== 1 ? "s" : ""}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
