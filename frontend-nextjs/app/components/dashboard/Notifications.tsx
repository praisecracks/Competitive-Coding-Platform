"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "../../context/ThemeContext";

interface Notification {
  id: string;
  type: "success" | "info" | "warning" | "error" | "duel_invite";
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  duelId?: string;
  challengeTitle?: string;
  challengerName?: string;
}

export default function Notifications() {
  const { theme } = useTheme();
  const isLight = theme === "light";
  
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [preferences, setPreferences] = useState({
    emailNotifications: true,
  });
  const [countdown, setCountdown] = useState<Record<string, number>>({});
  const [processingDuelIds, setProcessingDuelIds] = useState<Record<string, "accept" | "decline" | null>>({});
  const processedInviteIdsRef = useRef<Set<string>>(new Set());

  const getAuthToken = useCallback((): string | null => {
    const token = localStorage.getItem("terminal_token");
    if (!token) {
      console.debug("No auth token found in localStorage");
    }
    return token;
  }, []);

  useEffect(() => {
    const fetchPrefs = async () => {
      try {
        const token = getAuthToken();
        if (!token) return;

        const res = await fetch("/api/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.ok) {
          const data = await res.json();
          setPreferences({
            emailNotifications: data.emailNotifications ?? true,
          });
        } else {
          console.warn("Profile API returned non-OK status:", res.status);
        }
      } catch (e) {
        console.error("Failed to fetch notification preferences:", e);
      }
    };

    fetchPrefs();
  }, [getAuthToken]);

  useEffect(() => {
    const saved = localStorage.getItem("dashboard_notifications");
    if (!saved) return;

    try {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) {
        setNotifications(
          parsed.map((n: any) => ({
            ...n,
            timestamp: new Date(n.timestamp),
          }))
        );
      }
    } catch (e) {
      console.error("Failed to parse notifications");
    }
  }, []);

  // Get dismissed notification IDs from localStorage
  const getDismissedIds = (): Set<string> => {
    try {
      const stored = localStorage.getItem("dismissed_notification_ids");
      return stored ? new Set(JSON.parse(stored)) : new Set();
    } catch {
      return new Set();
    }
  };

  // Save dismissed notification ID to localStorage
  const saveDismissedId = (id: string) => {
    const dismissed = getDismissedIds();
    dismissed.add(id);
    localStorage.setItem("dismissed_notification_ids", JSON.stringify([...dismissed]));
  };

  useEffect(() => {
    localStorage.setItem("dashboard_notifications", JSON.stringify(notifications));
  }, [notifications]);

  const removeNotification = (id: string) => {
    saveDismissedId(id); // Save so it won't reappear
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const markInviteProcessed = (duelId: string) => {
    const notificationId = `invite-${duelId}`;
    processedInviteIdsRef.current.add(notificationId);
    removeNotification(notificationId);
  };

useEffect(() => {
      const fetchNotifications = async () => {
        const token = getAuthToken();
        if (!token) return;

        const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "/api";
        console.debug("Fetching notifications from:", `${API_BASE_URL}/notifications`, `${API_BASE_URL}/duo/pending-invites`);

        // Check user role for admin notifications (only super_admin sees feedback notifications)
        let isSuperAdmin = false;
        try {
          const userData = localStorage.getItem("user");
          if (userData) {
            const user = JSON.parse(userData);
            isSuperAdmin = user.role === "super_admin";
          }
        } catch {}

        try {
          // Fetch regular notifications
          let fetchedNotifications: Notification[] = [];
          
          try {
            const notifRes = await fetch(`${API_BASE_URL}/notifications`, {
              headers: { Authorization: `Bearer ${token}` },
              cache: "no-store",
            });

            if (notifRes.ok) {
              try {
                const data = await notifRes.json();
                if (Array.isArray(data)) {
                  fetchedNotifications = data.map((n: any) => ({
                    id: n.id,
                    type: n.type,
                    title: n.title,
                    message: n.message,
                    timestamp: new Date(n.created_at),
                    read: n.read,
                  }));
                  console.debug("Fetched", fetchedNotifications.length, "regular notifications");
                } else {
                  console.debug("Notifications response not array, using empty");
                }
              } catch (parseErr) {
                console.debug("Failed to parse notifications JSON, using empty");
              }
            } else {
              // Silently ignore non-OK responses — common if endpoint doesn't exist
              console.debug("Notifications API status:", notifRes.status, "- skipping");
            }
} catch (err) {
              console.debug("Regular notifications fetch failed (expected if no endpoint):", err);
            }

            // Fetch system notifications for super_admin only
            if (isSuperAdmin) {
              try {
                const sysRes = await fetch(`${API_BASE_URL}/notifications/system`, {
                  headers: { Authorization: `Bearer ${token}` },
                  cache: "no-store",
                });

                if (sysRes.ok) {
                  const sysData = await sysRes.json();
                  if (Array.isArray(sysData)) {
                    // Get dismissed IDs to filter out
                    const dismissedIds = getDismissedIds();
                    const systemNotifs = sysData.map((n: any) => ({
                      id: n.id,
                      type: n.type,
                      title: n.title,
                      message: n.message,
                      timestamp: new Date(n.created_at),
                      read: n.read || false,
                    })).filter((n: any) => !dismissedIds.has(n.id)); // Filter out dismissed
                    fetchedNotifications = [...fetchedNotifications, ...systemNotifs];
                    console.debug("Fetched", systemNotifs.length, "system notifications for admin");
                  }
                }
              } catch (sysErr) {
                console.debug("System notifications fetch failed:", sysErr);
              }
            }

            // Fetch duel invites (may fail if endpoint doesn't exist - that's ok)
           try {
            const res = await fetch(`${API_BASE_URL}/duo/pending-invites`, {
              headers: { Authorization: `Bearer ${token}` },
              cache: "no-store",
            });

            if (!res.ok) {
              // Silently ignore — endpoint may not exist or user not authenticated
              console.debug("Duel invites API status:", res.status, "- skipping");
              setNotifications(fetchedNotifications.slice(0, 20));
              return;
            }

            let invites: any[];
            try {
              invites = await res.json();
            } catch (parseErr) {
              console.debug("Failed to parse duel invites JSON, using empty");
              setNotifications(fetchedNotifications.slice(0, 20));
              return;
            }

            if (!Array.isArray(invites)) {
              console.debug("Duel invites not array, using empty");
              setNotifications(fetchedNotifications.slice(0, 20));
              return;
            }

           console.debug("Fetched", invites.length, "duel invites");

           const duelInvites: Notification[] = invites
             .filter((invite: any) => {
               const duelId = String(invite.id || "");
               if (!duelId) return false;
               const notificationId = `invite-${duelId}`;
               if (processedInviteIdsRef.current.has(notificationId)) return false;
               if (processingDuelIds[duelId]) return false;
               return true;
             })
             .map((invite: any) => ({
               id: `invite-${invite.id}`,
               type: "duel_invite",
               title: "Duel Invitation",
               message: `${invite.challenger_name} challenged you to ${invite.challenge_title}`,
               timestamp: new Date(invite.created_at),
               read: false,
               duelId: invite.id,
               challengeTitle: invite.challenge_title,
               challengerName: invite.challenger_name,
             }));

           setNotifications((prev) => {
             const nonInviteNotifications = fetchedNotifications;
             const preservedCountdownInvites = prev.filter(
               (n) =>
                 n.type === "duel_invite" &&
                 n.duelId &&
                 (countdown[n.duelId] !== undefined || processingDuelIds[n.duelId])
             );

             const merged = [
               ...preservedCountdownInvites,
               ...duelInvites,
               ...nonInviteNotifications,
             ];

             const seen = new Set<string>();
             return merged.filter((n) => {
               if (seen.has(n.id)) return false;
               seen.add(n.id);
               return true;
             }).slice(0, 20);
           });
         } catch (err) {
           console.error("Failed to fetch duel invites:", err);
           // Fallback to regular notifications only
           setNotifications(fetchedNotifications.slice(0, 20));
         }
       } catch (error) {
         console.error("Unexpected error in fetchNotifications:", error);
         // Last resort: don't crash, just keep existing notifications
       }
     };

     fetchNotifications();
     const interval = setInterval(fetchNotifications, 2000);

     return () => clearInterval(interval);
   }, [countdown, processingDuelIds, getAuthToken]);

  // Streak reminder system
  useEffect(() => {
    const checkStreaks = () => {
      const now = new Date();
      const currentHour = now.getHours();
      const currentMinute = now.getMinutes();
      const timeUntilMidnight = (24 - currentHour) * 60 - currentMinute;

      // Check learning streak
      const streakData = localStorage.getItem("codemaster_learning_streak_v1");
      if (streakData) {
        const streak = JSON.parse(streakData);
        if (streak.currentStreak > 0) {
          const lastDate = new Date(streak.lastLearningDate);
          const lastDateStr = lastDate.toDateString();
          const todayStr = now.toDateString();
          const yesterday = new Date(now);
          yesterday.setDate(yesterday.getDate() - 1);
          const yesterdayStr = yesterday.toDateString();

          // Show reminder in the evening (after 6 PM)
          if (currentHour >= 18 && lastDateStr !== todayStr && lastDateStr !== yesterdayStr) {
            const streakNotifId = "streak-learning-reminder";
            const existingNotif = notifications.find(n => n.id === streakNotifId);
            if (!existingNotif) {
              const newNotif: Notification = {
                id: streakNotifId,
                type: "warning",
                title: "🔥 Learning Streak at Risk!",
                message: `Your ${streak.currentStreak}-day learning streak will reset tonight. Complete a lesson to keep it alive!`,
                timestamp: now,
                read: false,
              };
              setNotifications(prev => [newNotif, ...prev]);
            }
          }
        }
      }

      // Check challenge streak (from dashboard stats)
      const userData = localStorage.getItem("user");
      if (userData) {
        const user = JSON.parse(userData);
        if (user.currentStreak && user.currentStreak > 0 && user.lastActive) {
          const lastActiveDate = new Date(user.lastActive);
          const lastActiveStr = lastActiveDate.toDateString();
          const todayStr = now.toDateString();
          const yesterday = new Date(now);
          yesterday.setDate(yesterday.getDate() - 1);
          const yesterdayStr = yesterday.toDateString();

          if (currentHour >= 18 && lastActiveStr !== todayStr && lastActiveStr !== yesterdayStr) {
            const challengeNotifId = "streak-challenge-reminder";
            const existingNotif = notifications.find(n => n.id === challengeNotifId);
            if (!existingNotif) {
              const newNotif: Notification = {
                id: challengeNotifId,
                type: "warning",
                title: "⚡ Challenge Streak at Risk!",
                message: `Your ${user.currentStreak}-day challenge streak will reset tonight. Complete a challenge to keep it alive!`,
                timestamp: now,
                read: false,
              };
              setNotifications(prev => [newNotif, ...prev]);
            }
          }
        }
      }
    };

    // Check on mount and every hour
    checkStreaks();
    const hourInterval = setInterval(checkStreaks, 60 * 60 * 1000);

    return () => clearInterval(hourInterval);
  }, []);

  const handleDuelAction = async (duelId: string, action: "accept" | "decline") => {
    const token = getAuthToken();
    if (!token) {
      console.warn("Cannot handle duel action: no auth token");
      return;
    }

    setProcessingDuelIds((prev) => ({ ...prev, [duelId]: action }));

    try {
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "/api";
      const endpoint =
        action === "accept"
          ? `${API_BASE_URL}/duo/accept/${duelId}`
          : `${API_BASE_URL}/duo/decline/${duelId}`;

      console.debug(`Duel action: ${action} for duel ${duelId} at ${endpoint}`);

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ error: "Unknown error" }));
        console.error(`Failed to ${action} duel:`, res.status, errorData);
        return;
      }

      if (action === "accept") {
        markInviteProcessed(duelId);
        setCountdown((prev) => ({ ...prev, [duelId]: 5 }));
      } else {
        markInviteProcessed(duelId);
      }
    } catch (e) {
      console.error(`Failed to ${action} duel:`, e);
    } finally {
      setProcessingDuelIds((prev) => ({ ...prev, [duelId]: null }));
    }
  };

  useEffect(() => {
    const activeDuelIds = Object.keys(countdown);
    if (activeDuelIds.length === 0) return;

    const timers = activeDuelIds.map((duelId) => {
      if (countdown[duelId] > 0) {
        return setTimeout(() => {
          setCountdown((prev) => ({
            ...prev,
            [duelId]: prev[duelId] - 1,
          }));
        }, 1000);
      }

      const next = { ...countdown };
      delete next[duelId];
      setCountdown(next);
      window.location.href = `/dashboard/duo/${duelId}`;
      return null;
    });

    return () => {
      timers.forEach((t) => {
        if (t) clearTimeout(t);
      });
    };
  }, [countdown]);

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "duel_invite":
        return "⚔️";
      case "duel_result":
        return "🏆";
      case "system":
        return "⚙️";
      default:
        return "🔔";
    }
  };

  const getTypeStyles = (type: string) => {
    switch (type) {
      case "duel_invite":
        return "bg-purple-500/20 text-purple-400";
      case "duel_result":
        return "bg-emerald-500/20 text-emerald-400";
      case "system":
        return "bg-blue-500/20 text-blue-400";
      default:
        return "bg-gray-500/20 text-gray-400";
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`relative rounded-lg p-2 transition-colors ${
          isLight
            ? "text-gray-500 hover:bg-gray-100 hover:text-gray-900"
            : "text-gray-400 hover:bg-white/10 hover:text-white"
        }`}
        aria-label="Notifications"
      >
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
          />
        </svg>

        {unreadCount > 0 && (
          <span className="absolute right-0 top-0 h-2 w-2 rounded-full bg-pink-500 animate-pulse" />
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className={`fixed right-2 z-50 mt-2 w-80 overflow-hidden rounded-xl border shadow-2xl ${
                  isLight
                    ? "border-gray-200 bg-white"
                    : "border-white/10 bg-[#0a0a0a]"
                } sm:absolute sm:right-0 sm:mt-2 sm:w-96`}
          >
            <div className={`flex items-center justify-between border-b p-4 ${
              isLight ? "border-gray-200" : "border-white/10"
            }`}>
              <h3 className={`text-sm font-semibold ${
                isLight ? "text-gray-900" : "text-white"
              }`}>Notifications</h3>

              <div className="flex gap-2">
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-xs text-pink-400 transition-colors hover:text-pink-300"
                  >
                    Mark all read
                  </button>
                )}

                <button
                  onClick={() => setIsOpen(false)}
                  className={`transition-colors ${
                    isLight
                      ? "text-gray-500 hover:text-gray-900"
                      : "text-gray-500 hover:text-white"
                  }`}
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="max-h-96 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-8 text-center">
                  <div className="mb-2 text-4xl">🔔</div>
                  <p className="text-sm text-gray-500">No notifications yet</p>
                  <p className="mt-1 text-xs text-gray-600">
                    We&apos;ll notify you when something important happens
                  </p>
                </div>
              ) : (
                notifications.map((notification) => {
                  const duelActionLoading =
                    notification.duelId && processingDuelIds[notification.duelId];

                  return (
                    <motion.div
                      key={notification.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className={`border-b border-white/5 p-4 transition-colors ${
                        !notification.read ? "bg-white/5" : "hover:bg-white/5"
                      }`}
                      onClick={() => markAsRead(notification.id)}
                    >
                      <div className="flex gap-3">
                        <div
                          className={`flex h-8 w-8 items-center justify-center rounded-full ${getTypeStyles(
                            notification.type
                          )}`}
                        >
                          <span className="text-sm">{getTypeIcon(notification.type)}</span>
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-start justify-between">
                            <p className="truncate text-sm font-medium text-white">
                              {notification.title}
                            </p>

                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                if (notification.duelId) {
                                  markInviteProcessed(notification.duelId);
                                } else {
                                  removeNotification(notification.id);
                                }
                              }}
                              className="ml-2 text-xs text-gray-500 hover:text-gray-400"
                            >
                              ✕
                            </button>
                          </div>

                          <p className="mt-1 text-xs text-gray-400">
                            {notification.message}
                          </p>

                          {notification.type === "duel_invite" && notification.duelId && (
                            <div className="mt-3">
                              {countdown[notification.duelId] !== undefined ? (
                                <div className="flex flex-col items-center rounded-xl border border-pink-500/20 bg-pink-500/10 p-3">
                                  <span className="mb-1 text-2xl font-black text-pink-500">
                                    {countdown[notification.duelId]}
                                  </span>
                                  <span className="text-[8px] font-black uppercase tracking-widest text-pink-400">
                                    Match Starting...
                                  </span>
                                </div>
                              ) : (
                                <div className="flex gap-2">
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleDuelAction(notification.duelId!, "accept");
                                    }}
                                    disabled={!!duelActionLoading}
                                    className="flex-1 rounded-lg bg-emerald-500 py-1.5 text-[10px] font-black uppercase tracking-widest text-white transition-all hover:opacity-90 disabled:opacity-50"
                                  >
                                    {duelActionLoading === "accept" ? "..." : "Accept"}
                                  </button>

                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleDuelAction(notification.duelId!, "decline");
                                    }}
                                    disabled={!!duelActionLoading}
                                    className="flex-1 rounded-lg border border-white/10 bg-white/5 py-1.5 text-[10px] font-black uppercase tracking-widest text-gray-400 transition-all hover:text-white disabled:opacity-50"
                                  >
                                    {duelActionLoading === "decline" ? "..." : "Decline"}
                                  </button>
                                </div>
                              )}
                            </div>
                          )}

                          <p className="mt-2 text-[10px] text-gray-500">
                            {notification.timestamp.toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                            {" • "}
                            {notification.timestamp.toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  );
                })
              )}
            </div>

            {notifications.length > 0 && (
              <div className="border-t border-white/10 p-3 text-center">
                <button
                  onClick={() => {
                    notifications.forEach((n) => {
                      if (n.duelId) {
                        processedInviteIdsRef.current.add(`invite-${n.duelId}`);
                      }
                    });
                    setNotifications([]);
                    setIsOpen(false);
                  }}
                  className="text-xs text-gray-500 transition-colors hover:text-gray-400"
                >
                  Clear all
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}