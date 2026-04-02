"use client";

import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface NewsItem {
  id: string;
  title: string;
  source: string;
  sourceIcon: React.ReactNode;
  url: string;
  timestamp: string;
  summary: string;
  category: "tech" | "community" | "innovation" | "coding";
  engagement?: {
    likes?: number;
    comments?: number;
  };
  author?: {
    name: string;
    username: string;
    avatar?: string;
  };
}

type SourceType = "github" | "devto" | "hackernews" | "reddit";

interface SourceConfig {
  id: SourceType;
  name: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  description: string;
}

const GitHubIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.108-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
  </svg>
);

const DevToIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
    <path d="M7.42 10.05c-.18-.16-.46-.23-.84-.23h-.78v4.61h.78c.38 0 .66-.07.84-.23.18-.16.27-.44.27-.85v-2.45c0-.41-.09-.69-.27-.85zM12 0C5.37 0 0 5.37 0 12s5.37 12 12 12 12-5.37 12-12S18.63 0 12 0zm-2.88 12.89c0 .95-.27 1.64-.82 2.08-.55.44-1.29.67-2.22.67H4.5V8.36h1.58c.93 0 1.67.23 2.22.67.55.44.82 1.13.82 2.08v1.78zm5.38-2.75h-2.06v1.38h1.7v1.33h-1.7v1.69h2.06v1.44h-2.26c-.57 0-1.01-.15-1.32-.46-.31-.31-.46-.74-.46-1.29v-3.94c0-.55.15-.98.46-1.29.31-.31.75-.46 1.32-.46h2.26v1.44zm4.75 5.06c-.57.57-1.32.86-2.25.86-.93 0-1.68-.29-2.25-.86-.57-.57-.86-1.32-.86-2.25v-2.94c0-.93.29-1.68.86-2.25.57-.57 1.32-.86 2.25-.86.93 0 1.68.29 2.25.86.57.57.86 1.32.86 2.25v2.94c0 .93-.29 1.68-.86 2.25z" />
  </svg>
);

const HackerNewsIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
    <path d="M0 0v24h24V0H0zm5.2 4h2.2l3.1 6.2L13.7 4h2.2l-5.2 9.8V20H9.8v-6.2L5.2 4z" />
  </svg>
);

const RedditIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.5 13.5c0 .828-.672 1.5-1.5 1.5s-1.5-.672-1.5-1.5.672-1.5 1.5-1.5 1.5.672 1.5 1.5zm-8.5 1.5c-.828 0-1.5-.672-1.5-1.5s.672-1.5 1.5-1.5 1.5.672 1.5 1.5-.672 1.5-1.5 1.5zm4.5 3.5c-1.5 0-2.8-.8-3.6-2h7.2c-.8 1.2-2.1 2-3.6 2z" />
  </svg>
);

const TrendingIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
  </svg>
);

const RefreshIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
  </svg>
);

const ExternalLinkIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
  </svg>
);

const CloseIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const AutoRotateIcon = () => (
  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
  </svg>
);

const sources: SourceConfig[] = [
  {
    id: "github",
    name: "GitHub",
    icon: <GitHubIcon />,
    color: "from-purple-500 to-pink-500",
    bgColor: "bg-purple-500/10",
    description: "Trending open source repositories",
  },
  {
    id: "devto",
    name: "DEV Community",
    icon: <DevToIcon />,
    color: "from-blue-500 to-cyan-500",
    bgColor: "bg-blue-500/10",
    description: "Developer articles and tutorials",
  },
  {
    id: "hackernews",
    name: "Hacker News",
    icon: <HackerNewsIcon />,
    color: "from-orange-500 to-red-500",
    bgColor: "bg-orange-500/10",
    description: "Tech news and startup discussions",
  },
  {
    id: "reddit",
    name: "Reddit",
    icon: <RedditIcon />,
    color: "from-green-500 to-emerald-500",
    bgColor: "bg-green-500/10",
    description: "Community tech discussions",
  },
];

const FALLBACK_NEWS: Record<SourceType, NewsItem[]> = {
  github: [
    {
      id: "fallback-github-1",
      title: "Trending repositories will appear here",
      source: "GitHub",
      sourceIcon: <GitHubIcon />,
      url: "#",
      timestamp: new Date().toISOString(),
      summary: "GitHub data is temporarily unavailable. Try refreshing in a moment.",
      category: "coding",
      engagement: { likes: 0, comments: 0 },
      author: { name: "GitHub", username: "@github" },
    },
  ],
  devto: [
    {
      id: "fallback-devto-1",
      title: "Developer articles will appear here",
      source: "DEV Community",
      sourceIcon: <DevToIcon />,
      url: "#",
      timestamp: new Date().toISOString(),
      summary: "DEV Community feed is temporarily unavailable.",
      category: "coding",
      engagement: { likes: 0, comments: 0 },
      author: { name: "DEV", username: "@dev" },
    },
  ],
  hackernews: [
    {
      id: "fallback-hn-1",
      title: "Tech stories will appear here",
      source: "Hacker News",
      sourceIcon: <HackerNewsIcon />,
      url: "#",
      timestamp: new Date().toISOString(),
      summary: "Hacker News is temporarily unavailable.",
      category: "tech",
      engagement: { likes: 0, comments: 0 },
      author: { name: "Hacker News", username: "hn" },
    },
  ],
  reddit: [
    {
      id: "fallback-reddit-1",
      title: "Reddit discussions will appear here",
      source: "Reddit",
      sourceIcon: <RedditIcon />,
      url: "#",
      timestamp: new Date().toISOString(),
      summary: "Reddit feed is temporarily unavailable.",
      category: "tech",
      engagement: { likes: 0, comments: 0 },
      author: { name: "Reddit", username: "u/reddit" },
    },
  ],
};

function dedupeNews(items: NewsItem[], source: SourceType): NewsItem[] {
  const seen = new Set<string>();

  return items
    .filter((item, index) => {
      const safeId =
        item.id?.trim() ||
        `${source}-${index}-${item.title?.trim() || "untitled"}`;

      if (seen.has(safeId)) return false;
      seen.add(safeId);

      item.id = safeId;
      return true;
    })
    .slice(0, 8);
}

export default function SocialsNews() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentSource, setCurrentSource] = useState<SourceType>("github");
  const [error, setError] = useState<string | null>(null);
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);
  const [autoRotate, setAutoRotate] = useState(true);

  const rotationTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const failoverTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const activeRequestIdRef = useRef(0);
  const cacheRef = useRef<Partial<Record<SourceType, NewsItem[]>>>({});

  const currentSourceConfig = useMemo(
    () => sources.find((s) => s.id === currentSource)!,
    [currentSource]
  );

  const clearTimers = useCallback(() => {
    if (rotationTimerRef.current) {
      clearInterval(rotationTimerRef.current);
      rotationTimerRef.current = null;
    }

    if (failoverTimerRef.current) {
      clearTimeout(failoverTimerRef.current);
      failoverTimerRef.current = null;
    }
  }, []);

  const rotateToNextSource = useCallback(() => {
    setCurrentSource((prev) => {
      const currentIndex = sources.findIndex((s) => s.id === prev);
      const nextIndex = (currentIndex + 1) % sources.length;
      return sources[nextIndex].id;
    });
  }, []);

  const fetchGitHubTrending = useCallback(async (): Promise<NewsItem[]> => {
    const response = await fetch(
      "/api/news-proxy?source=github",
      { cache: "no-store" }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch GitHub repositories");
    }

    const data = await response.json();
    if (!Array.isArray(data.items)) return [];

    return data.items.map((repo: any, index: number) => ({
      id: `github-${repo.id ?? index}`,
      title: repo.name || "Untitled repository",
      summary:
        repo.description ||
        `${repo.stargazers_count ?? 0} stars • ${repo.forks_count ?? 0} forks`,
      source: "GitHub",
      sourceIcon: <GitHubIcon />,
      url: repo.html_url || "#",
      timestamp: repo.created_at
        ? new Date(repo.created_at).toISOString()
        : new Date().toISOString(),
      category: "coding",
      engagement: {
        likes: repo.stargazers_count ?? 0,
        comments: repo.open_issues_count ?? 0,
      },
      author: {
        name: repo.owner?.login || "GitHub",
        username: `@${repo.owner?.login || "github"}`,
        avatar: repo.owner?.avatar_url,
      },
    }));
  }, []);

  const fetchDevToNews = useCallback(async (): Promise<NewsItem[]> => {
    const response = await fetch(
      "/api/news-proxy?source=devto",
      { cache: "no-store" }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch DEV articles");
    }

    const articles = await response.json();
    if (!Array.isArray(articles)) return [];

    return articles.map((article: any, index: number) => ({
      id: `devto-${article.id ?? index}`,
      title: article.title || "Untitled article",
      summary: article.description || article.title || "Developer article",
      source: "DEV Community",
      sourceIcon: <DevToIcon />,
      url: article.url || "#",
      timestamp: article.published_at || new Date().toISOString(),
      category: "coding",
      engagement: {
        likes: article.positive_reactions_count ?? 0,
        comments: article.comments_count ?? 0,
      },
      author: {
        name: article.user?.name || "DEV Author",
        username: `@${article.user?.username || "dev"}`,
        avatar: article.user?.profile_image,
      },
    }));
  }, []);

  const fetchHackerNews = useCallback(async (): Promise<NewsItem[]> => {
    const response = await fetch(
      "/api/news-proxy?source=hackernews_ids",
      { cache: "no-store" }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch Hacker News ids");
    }

    const storyIds = await response.json();
    if (!Array.isArray(storyIds)) return [];

    const topIds = storyIds.slice(0, 8);

    const stories = await Promise.all(
      topIds.map(async (id: number) => {
        const storyRes = await fetch(
          `/api/news-proxy?source=hackernews_item&id=${id}`,
          { cache: "no-store" }
        );

        if (!storyRes.ok) return null;
        return storyRes.json();
      })
    );

    return stories
      .filter(Boolean)
      .map((story: any, index: number) => ({
        id: `hn-${story?.id ?? index}`,
        title: story?.title || "Untitled story",
        summary:
          story?.text?.slice(0, 120) ||
          `${story?.score ?? 0} points • ${story?.descendants ?? 0} comments`,
        source: "Hacker News",
        sourceIcon: <HackerNewsIcon />,
        url: story?.url || `https://news.ycombinator.com/item?id=${story?.id ?? index}`,
        timestamp: story?.time
          ? new Date(story.time * 1000).toISOString()
          : new Date().toISOString(),
        category: "tech",
        engagement: {
          likes: story?.score ?? 0,
          comments: story?.descendants ?? 0,
        },
        author: {
          name: story?.by || "Hacker News",
          username: story?.by || "hn",
        },
      }));
  }, []);

  const fetchRedditTech = useCallback(async (): Promise<NewsItem[]> => {
    const response = await fetch(
      "/api/news-proxy?source=reddit",
      { cache: "no-store" }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch Reddit posts");
    }

    const data = await response.json();
    const children = data?.data?.children;

    if (!Array.isArray(children)) return [];

    return children.map((post: any, index: number) => ({
      id: `reddit-${post?.data?.id ?? index}`,
      title: post?.data?.title || "Untitled post",
      summary:
        post?.data?.selftext?.slice(0, 120) ||
        `${post?.data?.score ?? 0} points • ${post?.data?.num_comments ?? 0} comments`,
      source: "Reddit",
      sourceIcon: <RedditIcon />,
      url: post?.data?.permalink
        ? `https://reddit.com${post.data.permalink}`
        : "#",
      timestamp: post?.data?.created_utc
        ? new Date(post.data.created_utc * 1000).toISOString()
        : new Date().toISOString(),
      category: "tech",
      engagement: {
        likes: post?.data?.score ?? 0,
        comments: post?.data?.num_comments ?? 0,
      },
      author: {
        name: post?.data?.author || "Reddit",
        username: `u/${post?.data?.author || "reddit"}`,
      },
    }));
  }, []);

  const getNewsForSource = useCallback(
    async (source: SourceType): Promise<NewsItem[]> => {
      switch (source) {
        case "github":
          return fetchGitHubTrending();
        case "devto":
          return fetchDevToNews();
        case "hackernews":
          return fetchHackerNews();
        case "reddit":
          return fetchRedditTech();
        default:
          return [];
      }
    },
    [fetchDevToNews, fetchGitHubTrending, fetchHackerNews, fetchRedditTech]
  );

  const fetchFromCurrentSource = useCallback(
    async (source: SourceType, forceRefresh = false) => {
      const requestId = ++activeRequestIdRef.current;

      setLoading(true);
      setError(null);

      if (!forceRefresh && cacheRef.current[source]?.length) {
        setNews(cacheRef.current[source]!);
        setLoading(false);
        return;
      }

      try {
        const fetchedNews = dedupeNews(await getNewsForSource(source), source);

        if (activeRequestIdRef.current !== requestId) return;

        if (!fetchedNews.length) {
          throw new Error(`No data from ${source}`);
        }

        cacheRef.current[source] = fetchedNews;
        setNews(fetchedNews);
      } catch (err) {
        console.error(`Failed to fetch from ${source}:`, err);

        if (activeRequestIdRef.current !== requestId) return;

        const fallback = cacheRef.current[source]?.length
          ? cacheRef.current[source]!
          : FALLBACK_NEWS[source];

        setNews(fallback);
        setError(`Unable to fetch from ${currentSourceConfig.name}.`);

        if (autoRotate) {
          if (failoverTimerRef.current) {
            clearTimeout(failoverTimerRef.current);
          }

          failoverTimerRef.current = setTimeout(() => {
            rotateToNextSource();
          }, 2000);
        }
      } finally {
        if (activeRequestIdRef.current === requestId) {
          setLoading(false);
        }
      }
    },
    [autoRotate, currentSourceConfig.name, getNewsForSource, rotateToNextSource]
  );

  const handleManualRefresh = useCallback(() => {
    fetchFromCurrentSource(currentSource, true);
  }, [currentSource, fetchFromCurrentSource]);

  const selectSource = useCallback((sourceId: SourceType) => {
    if (failoverTimerRef.current) {
      clearTimeout(failoverTimerRef.current);
      failoverTimerRef.current = null;
    }

    setCurrentSource(sourceId);
  }, []);

  const formatTimeAgo = (timestamp: string) => {
    const time = new Date(timestamp).getTime();

    if (Number.isNaN(time)) return "Recently";

    const seconds = Math.floor((Date.now() - time) / 1000);

    if (seconds < 60) return `${Math.max(seconds, 0)}s ago`;

    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;

    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;

    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  useEffect(() => {
    fetchFromCurrentSource(currentSource);
  }, [currentSource, fetchFromCurrentSource]);

  useEffect(() => {
    if (!autoRotate) {
      if (rotationTimerRef.current) {
        clearInterval(rotationTimerRef.current);
        rotationTimerRef.current = null;
      }
      return;
    }

    rotationTimerRef.current = setInterval(() => {
      rotateToNextSource();
    }, 30000);

    return () => {
      if (rotationTimerRef.current) {
        clearInterval(rotationTimerRef.current);
        rotationTimerRef.current = null;
      }
    };
  }, [autoRotate, rotateToNextSource]);

  useEffect(() => {
    return () => {
      clearTimers();
    };
  }, [clearTimers]);

  return (
    <div className="overflow-hidden rounded-xl border border-white/10 bg-white/5">
      <div className="border-b border-white/10 p-5">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-r from-pink-500 to-purple-500">
              <TrendingIcon />
            </div>
            <h2 className="text-lg font-semibold text-white">Tech Pulse</h2>
            <span className="rounded-full bg-white/5 px-2 py-1 text-[10px] text-gray-500">
              Auto-rotating
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setAutoRotate((prev) => !prev)}
              className={`flex items-center gap-1 rounded px-2 py-1 text-xs transition-colors ${
                autoRotate
                  ? "text-green-400 hover:text-green-300"
                  : "text-gray-500 hover:text-gray-400"
              }`}
              title={autoRotate ? "Auto-rotate on" : "Auto-rotate off"}
            >
              <AutoRotateIcon />
              {autoRotate ? "Auto" : "Manual"}
            </button>

            <button
              onClick={handleManualRefresh}
              disabled={loading}
              className="p-1 text-gray-400 transition-colors hover:text-pink-400 disabled:opacity-50"
            >
              <RefreshIcon />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {sources.map((source) => (
            <button
              key={source.id}
              onClick={() => selectSource(source.id)}
              className={`relative rounded-lg p-2 text-center transition-all ${
                currentSource === source.id
                  ? `bg-gradient-to-r ${source.color} scale-[1.02] text-white shadow-lg`
                  : `${source.bgColor} text-gray-400 hover:bg-white/10 hover:text-white`
              }`}
            >
              <div className="mb-1 flex justify-center">{source.icon}</div>
              <p className="truncate text-[10px] font-medium">{source.name}</p>

              {currentSource === source.id && (
                <motion.div
                  layoutId="active-source"
                  className="absolute bottom-0 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-white"
                />
              )}
            </button>
          ))}
        </div>

        <p className="mt-3 text-center text-[10px] text-gray-500">
          {currentSourceConfig.description}
        </p>
      </div>

      {loading && (
        <div className="p-6">
          <div className="space-y-3 animate-pulse">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex gap-3">
                <div className="h-10 w-10 rounded-full bg-white/10" />
                <div className="flex-1">
                  <div className="mb-2 h-4 w-3/4 rounded bg-white/10" />
                  <div className="h-3 w-full rounded bg-white/10" />
                  <div className="mt-1 h-3 w-2/3 rounded bg-white/10" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {error && !loading && (
        <div className="p-6 text-center">
          <div className="mb-2 text-3xl">⚠️</div>
          <p className="text-sm text-red-400">{error}</p>
          <button
            onClick={handleManualRefresh}
            className="mt-3 text-xs text-pink-400 hover:text-pink-300"
          >
            Try Again
          </button>
        </div>
      )}

      {!loading && (
        <div className="max-h-[500px] divide-y divide-white/5 overflow-y-auto">
          {news.map((item, idx) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(idx * 0.03, 0.3) }}
              onClick={() => setSelectedNews(item)}
              className="group cursor-pointer p-4 transition-all hover:bg-white/5"
            >
              <div className="flex gap-3">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-pink-500 to-purple-500 text-white">
                  {item.sourceIcon}
                </div>

                <div className="min-w-0 flex-1">
                  <h3 className="line-clamp-2 text-sm font-medium text-white transition-colors group-hover:text-pink-400">
                    {item.title}
                  </h3>

                  <div className="mt-1 flex flex-wrap items-center gap-2">
                    <span className="text-[10px] text-gray-500">{item.source}</span>
                    <span className="h-1 w-1 rounded-full bg-gray-600" />
                    <span className="text-[10px] text-gray-500">
                      {formatTimeAgo(item.timestamp)}
                    </span>

                    {item.engagement?.likes !== undefined && (
                      <>
                        <span className="h-1 w-1 rounded-full bg-gray-600" />
                        <span className="text-[10px] text-gray-500">
                          ⭐ {formatNumber(item.engagement.likes)}
                        </span>
                      </>
                    )}
                  </div>

                  <p className="mt-2 line-clamp-2 text-xs text-gray-400">
                    {item.summary}
                  </p>

                  {item.author && (
                    <p className="mt-2 text-[10px] text-gray-500">
                      {item.author.username}
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <div className="border-t border-white/10 bg-white/5 px-5 py-3">
        <div className="flex items-center justify-between text-[10px] text-gray-500">
          <span>
            {news.length} stories from {currentSourceConfig.name}
          </span>

          <span className="flex items-center gap-1">
            <span
              className={`h-1.5 w-1.5 rounded-full ${
                autoRotate ? "animate-pulse bg-green-500" : "bg-gray-500"
              }`}
            />
            {autoRotate ? "Next update in 30s" : "Manual mode"}
          </span>
        </div>
      </div>

      <AnimatePresence>
        {selectedNews && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
            <div 
              className="absolute inset-0 bg-black/80 backdrop-blur-md" 
              onClick={() => setSelectedNews(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl overflow-hidden rounded-3xl border border-white/10 bg-[#0d0d0d] shadow-2xl flex flex-col max-h-[90vh]"
            >
              <div className="border-b border-white/10 p-5">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-pink-500 to-purple-500 text-white">
                      {selectedNews.sourceIcon}
                    </div>

                    <div>
                      <p className="text-sm font-medium text-white">
                        {selectedNews.source}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatTimeAgo(selectedNews.timestamp)}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => setSelectedNews(null)}
                    className="text-gray-500 hover:text-white"
                  >
                    <CloseIcon />
                  </button>
                </div>
              </div>

              <div className="p-5">
                <h3 className="mb-3 text-lg font-semibold text-white">
                  {selectedNews.title}
                </h3>

                <p className="mb-4 text-sm text-gray-300">
                  {selectedNews.summary}
                </p>

                {selectedNews.engagement && (
                  <div className="mb-4 flex items-center gap-4 rounded-lg bg-white/5 p-3">
                    <span className="text-sm">
                      ⭐ {formatNumber(selectedNews.engagement.likes || 0)}
                    </span>
                    <span className="text-sm">
                      💬 {formatNumber(selectedNews.engagement.comments || 0)}
                    </span>
                  </div>
                )}

                <button
                  onClick={() => {
                    if (selectedNews.url && selectedNews.url !== "#") {
                      window.open(selectedNews.url, "_blank", "noopener,noreferrer");
                    }
                  }}
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-pink-500 to-purple-500 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90"
                >
                  <ExternalLinkIcon />
                  Read Full Story
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}