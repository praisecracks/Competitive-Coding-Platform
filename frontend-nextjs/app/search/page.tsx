"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import Header from "../components/dashboard/header";
import AppFooter from "../components/dashboard/footer";
import { fetchSearchResults, SearchResults } from "@/lib/search";
import Link from "next/link";

function Search() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";

  const [results, setResults] = useState<SearchResults>({
    users: [],
    challenges: [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const handleSearch = async () => {
      if (!query.trim()) {
        setResults({ users: [], challenges: [] });
        return;
      }

      try {
        setLoading(true);
        setError("");

        const token =
          typeof window !== "undefined"
            ? localStorage.getItem("terminal_token") || undefined
            : undefined;

        const data = await fetchSearchResults(query, token);
        setResults(data);
      } catch (err) {
        console.error("Search error:", err);
        setError("Failed to search. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    handleSearch();
  }, [query]);

  const hasResults =
    results.users.length > 0 || results.challenges.length > 0;
  const totalResults = results.users.length + results.challenges.length;

  return (
    <div className="flex min-h-screen flex-col bg-[#020202] text-white">
      {/* HEADER */}
      <Header onMenuClick={() => {}} />

      {/* MAIN (THIS FIXES FOOTER ISSUE) */}
      <main className="flex-1 pt-20">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

          {/* HEADER SECTION */}
          <div className="mb-10">
            <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
              Search Results
            </h1>

            <p className="mt-2 text-gray-400">
              {query ? (
                <>
                  Showing results for{" "}
                  <span className="text-pink-400">"{query}"</span>
                </>
              ) : (
                "Start typing in the search bar to explore users and challenges"
              )}
            </p>
          </div>

          {/* LOADING */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-pink-500/30 border-t-pink-500"></div>
              <p className="mt-4 text-sm text-gray-400">Searching...</p>
            </div>
          )}

          {/* ERROR */}
          {error && !loading && (
            <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-5 text-center">
              <p className="text-red-400">{error}</p>
            </div>
          )}

          {/* EMPTY */}
          {!loading && !error && query && !hasResults && (
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-14 text-center">
              <p className="text-lg font-medium text-white">
                No results found
              </p>
              <p className="mt-2 text-sm text-gray-500">
                Try a different keyword or explore challenges
              </p>
            </div>
          )}

          {/* RESULTS */}
          {!loading && hasResults && (
            <div className="space-y-10">

              {/* USERS */}
              {results.users.length > 0 && (
                <div>
                  <h2 className="mb-5 text-lg font-semibold text-pink-400">
                    Users ({results.users.length})
                  </h2>

                  <div className="grid gap-3">
                    {results.users.map((user) => (
                      <Link
                        key={user.id}
                        href={`/dashboard/leaderboard?user=${user.id}`}
                        className="group flex items-center gap-4 rounded-xl border border-white/10 bg-white/[0.03] p-4 transition hover:border-pink-500/40 hover:bg-white/[0.06]"
                      >
                        {user.profile_pic ? (
                          <img
                            src={user.profile_pic}
                            alt={user.username}
                            className="h-11 w-11 rounded-xl object-cover border border-white/10"
                          />
                        ) : (
                          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/5 text-sm font-semibold text-pink-400">
                            {user.username.charAt(0).toUpperCase()}
                          </div>
                        )}

                        <div>
                          <p className="font-medium text-white group-hover:text-pink-400">
                            {user.username}
                          </p>
                          {user.rank && (
                            <p className="text-xs text-gray-500">
                              {user.rank}
                            </p>
                          )}
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* CHALLENGES */}
              {results.challenges.length > 0 && (
                <div>
                  <h2 className="mb-5 text-lg font-semibold text-purple-400">
                    Challenges ({results.challenges.length})
                  </h2>

                  <div className="grid gap-3">
                    {results.challenges.map((challenge) => (
                      <Link
                        key={challenge.id}
                        href={`/dashboard/challenges/${challenge.id}`}
                        className="group rounded-xl border border-white/10 bg-white/[0.03] p-4 transition hover:border-purple-500/40 hover:bg-white/[0.06]"
                      >
                        <div className="flex items-center justify-between">
                          <p className="font-medium text-white group-hover:text-purple-400">
                            {challenge.title}
                          </p>

                          <div className="flex items-center gap-3">
                            {challenge.opened && (
                              <span className="rounded-full bg-purple-500/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-purple-400 border border-purple-500/20">
                                Opened
                              </span>
                            )}
                            {challenge.difficulty && (
                              <span
                                className={`rounded-full px-3 py-1 text-xs ${
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
                          </div>
                        </div>

                        {challenge.category && (
                          <p className="mt-1 text-sm text-gray-500">
                            {challenge.category}
                          </p>
                        )}

                        {challenge.tags && (
                          <div className="mt-3 flex gap-2 flex-wrap">
                            {challenge.tags.slice(0, 3).map((tag, i) => (
                              <span
                                key={i}
                                className="text-xs text-gray-400 bg-white/5 px-2 py-1 rounded"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* RESULT COUNT (IMPROVED) */}
              <div className="mt-12 text-center">
                <p className="text-sm text-gray-500">
                  Found{" "}
                  <span className="font-semibold text-white">
                    {totalResults}
                  </span>{" "}
                  result{totalResults !== 1 ? "s" : ""} for{" "}
                  <span className="text-pink-400">"{query}"</span>
                </p>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* FOOTER */}
      <AppFooter />
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}> 
      <Search />
    </Suspense>
  );
}