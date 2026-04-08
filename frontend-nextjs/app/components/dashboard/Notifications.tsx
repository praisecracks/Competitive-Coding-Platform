"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

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
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [preferences, setPreferences] = useState({
    emailNotifications: true,
  });

  useEffect(() => {
    const fetchPrefs = async () => {
      try {
        const token = localStorage.getItem("terminal_token");
        if (!token) return;

        const res = await fetch("/api/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setPreferences({
            emailNotifications: data.emailNotifications ?? true,
          });
        }
      } catch (e) {
        console.error("Failed to fetch notification preferences");
      }
    };
    fetchPrefs();
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem("dashboard_notifications");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setNotifications(parsed.map((n: any) => ({ ...n, timestamp: new Date(n.timestamp) })));
      } catch (e) {
        console.error("Failed to parse notifications");
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("dashboard_notifications", JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const token = localStorage.getItem("terminal_token");
        if (!token) return;
        const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "/api";

        const notifRes = await fetch(`${API_BASE_URL}/notifications`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        let fetchedNotifications: Notification[] = [];
        if (notifRes.ok) {
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
          }
        }

        const res = await fetch(`${API_BASE_URL}/duo/pending-invites`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.ok) {
          const invites = await res.json();
          if (!invites || !Array.isArray(invites)) {
            setNotifications(fetchedNotifications.slice(0, 20));
            return;
          }

          const duelInvites: Notification[] = invites.map((invite: any) => ({
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

          setNotifications([...duelInvites, ...fetchedNotifications].slice(0, 20));
        } else {
          setNotifications(fetchedNotifications.slice(0, 20));
        }
      } catch (e) {
        console.error("Failed to fetch notifications:", e);
      }
    };

    fetchNotifications();
    const interval = setInterval(fetchNotifications, 2000);
    return () => clearInterval(interval);
  }, []);

  const [countdown, setCountdown] = useState<{ [key: string]: number }>({});

  const handleDuelAction = async (duelId: string, action: "accept" | "decline") => {
    try {
      const token = localStorage.getItem("terminal_token");
      const res = await fetch(`/api/duo/${action}/${duelId}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        if (action === "accept") {
          setCountdown((prev) => ({ ...prev, [duelId]: 5 }));
        } else {
          removeNotification(`invite-${duelId}`);
        }
      }
    } catch (e) {
      console.error(`Failed to ${action} duel`);
    }
  };

  useEffect(() => {
    const activeDuelIds = Object.keys(countdown);
    if (activeDuelIds.length === 0) return;

    const timers = activeDuelIds.map((duelId) => {
      if (countdown[duelId] > 0) {
        return setTimeout(() => {
          setCountdown((prev) => ({ ...prev, [duelId]: prev[duelId] - 1 }));
        }, 1000);
      } else {
        window.location.href = `/dashboard/duo/${duelId}`;
        return null;
      }
    });

    return () => timers.forEach((t) => t && clearTimeout(t));
  }, [countdown]);

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
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
        className="relative p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
        aria-label="Notifications"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
          />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 w-2 h-2 bg-pink-500 rounded-full animate-pulse" />
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed right-2 mt-2 w-80 sm:absolute sm:right-0 sm:mt-2 sm:w-96 bg-[#0a0a0a] border border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden"
          >
            <div className="flex justify-between items-center p-4 border-b border-white/10">
              <h3 className="text-sm font-semibold text-white">Notifications</h3>
              <div className="flex gap-2">
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-xs text-pink-400 hover:text-pink-300 transition-colors"
                  >
                    Mark all read
                  </button>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-500 hover:text-white transition-colors"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="max-h-96 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-8 text-center">
                  <div className="text-4xl mb-2">🔔</div>
                  <p className="text-sm text-gray-500">No notifications yet</p>
                  <p className="text-xs text-gray-600 mt-1">
                    We'll notify you when something important happens
                  </p>
                </div>
              ) : (
                notifications.map((notification) => (
                  <motion.div
                    key={notification.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className={`p-4 border-b border-white/5 transition-colors ${
                      !notification.read ? "bg-white/5" : "hover:bg-white/5"
                    }`}
                    onClick={() => markAsRead(notification.id)}
                  >
                    <div className="flex gap-3">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center ${getTypeStyles(
                          notification.type
                        )}`}
                      >
                        <span className="text-sm">{getTypeIcon(notification.type)}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                          <p className="text-sm font-medium text-white truncate">
                            {notification.title}
                          </p>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              removeNotification(notification.id);
                            }}
                            className="text-gray-500 hover:text-gray-400 text-xs ml-2"
                          >
                            ✕
                          </button>
                        </div>
                        <p className="text-xs text-gray-400 mt-1">{notification.message}</p>

                        {notification.type === "duel_invite" && notification.duelId && (
                          <div className="mt-3">
                            {countdown[notification.duelId] !== undefined ? (
                              <div className="flex flex-col items-center bg-pink-500/10 rounded-xl p-3 border border-pink-500/20">
                                <span className="text-2xl font-black text-pink-500 mb-1">
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
                                  className="flex-1 rounded-lg bg-emerald-500 py-1.5 text-[10px] font-black uppercase tracking-widest text-white hover:opacity-90 transition-all"
                                >
                                  Accept
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDuelAction(notification.duelId!, "decline");
                                  }}
                                  className="flex-1 rounded-lg bg-white/5 border border-white/10 py-1.5 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-white transition-all"
                                >
                                  Decline
                                </button>
                              </div>
                            )}
                          </div>
                        )}

                        <p className="text-[10px] text-gray-500 mt-2">
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
                ))
              )}
            </div>

            {notifications.length > 0 && (
              <div className="p-3 border-t border-white/10 text-center">
                <button
                  onClick={() => {
                    setNotifications([]);
                    setIsOpen(false);
                  }}
                  className="text-xs text-gray-500 hover:text-gray-400 transition-colors"
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