"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  Search,
  ShieldCheck,
  ShieldAlert,
  Trash2,
  ArrowLeft,
  UserCheck,
  UserX,
  Calendar,
  Mail,
  ArrowUpDown,
  Clock,
} from "lucide-react";
import { useTheme } from "@/app/context/ThemeContext";

interface User {
  id: string;
  username: string;
  email: string;
  role: string;
  rank: string;
  createdAt: string;
  lastActive?: string;
  profile_pic?: string;
  country?: string;
}

type ConfirmAction =
  | {
      type: "delete" | "promote" | "demote";
      userId: string;
      username: string;
    }
  | null;

export default function ManageUsers() {
  const { theme } = useTheme();
  const isLight = theme === "light";

  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updating, setUpdating] = useState<string | null>(null);
  const [currentUserRole, setCurrentUserRole] = useState<string>("user");
  const [searchTerm, setSearchTerm] = useState("");
  const [isSuperAdmin, setIsSuperAdmin] = useState<boolean | null>(null);
  const [confirmAction, setConfirmAction] = useState<ConfirmAction>(null);

  const fetchUsers = async () => {
    try {
      setError("");
      const token = localStorage.getItem("terminal_token");

      const res = await fetch("/api/admin/users", {
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      });

      if (!res.ok) {
        throw new Error("Failed to fetch users");
      }

      const data = await res.json();

      const normalizedUsers = Array.isArray(data)
        ? data.map(normalizeUser)
        : Array.isArray(data?.users)
        ? data.users.map(normalizeUser)
        : [];

      setUsers(normalizedUsers);
    } catch (err) {
      setError("Failed to load users. Admin privileges required.");
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId: string, targetRole: string) => {
    setUpdating(userId);

    try {
      const token = localStorage.getItem("terminal_token");

      const res = await fetch("/api/admin/super/promote", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ userId, role: targetRole }),
      });

      if (!res.ok) {
        const data = await safeJson(res);
        alert(data?.error || "Action failed");
        return;
      }

      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === userId ? { ...user, role: targetRole } : user
        )
      );

      setConfirmAction(null);
    } catch (err) {
      alert("Network error occurred");
    } finally {
      setUpdating(null);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    setUpdating(userId);

    try {
      const token = localStorage.getItem("terminal_token");

      const res = await fetch(`/api/admin/super/users/${userId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        const data = await safeJson(res);
        alert(data?.error || "Deletion failed");
        return;
      }

      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
      setConfirmAction(null);
    } catch (err) {
      alert("Network error occurred");
    } finally {
      setUpdating(null);
    }
  };

  useEffect(() => {
    const checkSuperAdminAccess = async () => {
      try {
        const token = localStorage.getItem("terminal_token");

        if (!token) {
          setIsSuperAdmin(false);
          setLoading(false);
          return;
        }

        const res = await fetch("/api/profile", {
          headers: { Authorization: `Bearer ${token}` },
          cache: "no-store",
        });

        if (!res.ok) {
          setIsSuperAdmin(false);
          setLoading(false);
          return;
        }

        const data = await res.json();
        const role = data?.role || "user";
        const superAdmin = role === "super_admin";

        setCurrentUserRole(role);
        setIsSuperAdmin(superAdmin);

        localStorage.setItem(
          "user",
          JSON.stringify({
            username: data?.username || "",
            email: data?.email || "",
            country: data?.country || "",
            profile_pic: data?.profile_pic || "",
            role,
          })
        );

        if (superAdmin) {
          await fetchUsers();
        } else {
          setLoading(false);
        }
      } catch (err) {
        console.error("Failed to verify admin access:", err);
        setIsSuperAdmin(false);
        setLoading(false);
      }
    };

    checkSuperAdminAccess();
  }, []);

  const filteredUsers = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    if (!query) return users;

    return users.filter((user) => {
      return (
        user.username.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query) ||
        user.role.toLowerCase().includes(query) ||
        (user.rank || "").toLowerCase().includes(query) ||
        (user.country || "").toLowerCase().includes(query)
      );
    });
  }, [users, searchTerm]);

  const totalUsers = users.length;
  const totalAdmins = users.filter(
    (user) => user.role === "super_admin" || user.role === "sub_admin"
  ).length;
  const totalRegularUsers = users.filter((user) => user.role === "user").length;

  if (isSuperAdmin === false) {
    return (
      <div
        className={`flex min-h-[80vh] items-center justify-center px-4 ${
          isLight ? "bg-[#f8fafc]" : "bg-[#020202]"
        }`}
      >
        <div
          className={`w-full max-w-lg rounded-2xl border p-6 text-center backdrop-blur-xl ${
            isLight
              ? "border-red-200 bg-white shadow-[0_18px_40px_rgba(15,23,42,0.08)]"
              : "border-red-500/10 bg-red-500/5"
          }`}
        >
          <div
            className={`mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg shadow-lg ${
              isLight
                ? "bg-red-50 text-red-500 shadow-red-500/10"
                : "bg-red-500/10 text-red-500 shadow-red-500/10"
            }`}
          >
            <ShieldAlert className="h-6 w-6" />
          </div>

          <h1
            className={`mb-2 text-lg font-bold tracking-tight ${
              isLight ? "text-gray-900" : "text-white"
            }`}
          >
            Access Restricted
          </h1>

          <p
            className={`mb-6 text-xs leading-relaxed ${
              isLight ? "text-gray-600" : "text-gray-400"
            }`}
          >
            Only Super Admins can manage users and system roles. Please contact
            support if you require elevated access.
          </p>

          <Link
            href="/dashboard/admin"
            className={`inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-xs font-bold shadow-lg transition active:scale-95 ${
              isLight
                ? "bg-gray-900 text-white hover:bg-black"
                : "bg-white text-black hover:bg-gray-200"
            }`}
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Admin Center
          </Link>
        </div>
      </div>
    );
  }

  if (loading || isSuperAdmin === null) {
    return (
      <div
        className={`flex min-h-[60vh] items-center justify-center ${
          isLight ? "bg-[#f8fafc]" : ""
        }`}
      >
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-pink-500/20 border-t-pink-500" />
          <span
            className={`text-xs font-bold uppercase tracking-widest ${
              isLight ? "text-gray-500" : "text-gray-500"
            }`}
          >
            Accessing Registry...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen space-y-6 pb-20 ${
        isLight ? "bg-[#f8fafc] text-gray-900" : "text-white"
      }`}
    >
      <AnimatePresence>
        {confirmAction && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setConfirmAction(null)}
              className={`absolute inset-0 backdrop-blur-xl ${
                isLight ? "bg-black/35" : "bg-[#020202]/90"
              }`}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className={`relative w-full max-w-md rounded-2xl border p-6 shadow-2xl ${
                isLight
                  ? "border-gray-200 bg-white"
                  : "border-white/10 bg-[#0a0a0a]"
              }`}
            >
              <div
                className={`mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg ${
                  confirmAction.type === "delete"
                    ? isLight
                      ? "bg-rose-50 text-rose-500"
                      : "bg-rose-500/10 text-rose-500"
                    : isLight
                    ? "bg-sky-50 text-sky-600"
                    : "bg-sky-500/10 text-sky-500"
                }`}
              >
                {confirmAction.type === "delete" ? (
                  <Trash2 className="h-6 w-6" />
                ) : (
                  <ShieldCheck className="h-6 w-6" />
                )}
              </div>

              <h3
                className={`text-center text-lg font-bold tracking-tight ${
                  isLight ? "text-gray-900" : "text-white"
                }`}
              >
                {confirmAction.type === "delete"
                  ? "Confirm Deletion"
                  : confirmAction.type === "promote"
                  ? "Promote User"
                  : "Demote User"}
              </h3>

              <p
                className={`mt-2.5 text-center text-xs leading-relaxed ${
                  isLight ? "text-gray-600" : "text-gray-400"
                }`}
              >
                Are you sure you want to {confirmAction.type}{" "}
                <span
                  className={`font-bold ${
                    isLight ? "text-gray-900" : "text-white"
                  }`}
                >
                  {confirmAction.username}
                </span>
                ?
                {confirmAction.type === "delete" &&
                  " All associated data will be permanently removed from the platform."}
              </p>

              <div className="mt-6 space-y-2">
                <button
                  onClick={() => {
                    if (confirmAction.type === "delete") {
                      handleDeleteUser(confirmAction.userId);
                    } else if (confirmAction.type === "promote") {
                      handleRoleChange(confirmAction.userId, "sub_admin");
                    } else {
                      handleRoleChange(confirmAction.userId, "user");
                    }
                  }}
                  disabled={!!updating}
                  className={`flex w-full items-center justify-center gap-1.5 rounded-lg py-2.5 text-xs font-bold transition-all active:scale-95 ${
                    confirmAction.type === "delete"
                      ? "bg-rose-500 text-white shadow-lg shadow-rose-500/20 hover:bg-rose-600"
                      : isLight
                      ? "bg-gray-900 text-white hover:bg-black"
                      : "bg-white text-black hover:bg-gray-200"
                  }`}
                >
                  {updating ? (
                    <div className="h-3 w-3 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  ) : confirmAction.type === "delete" ? (
                    "Delete Permanently"
                  ) : (
                    "Confirm Changes"
                  )}
                </button>

                <button
                  onClick={() => setConfirmAction(null)}
                  className={`w-full py-2 text-xs font-bold transition-colors ${
                    isLight
                      ? "text-gray-500 hover:text-gray-900"
                      : "text-gray-500 hover:text-white"
                  }`}
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <header className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-2.5">
          <Link
            href="/dashboard/admin"
            className={`group inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest transition-colors ${
              isLight
                ? "text-gray-500 hover:text-gray-900"
                : "text-gray-500 hover:text-white"
            }`}
          >
            <ArrowLeft className="h-3 w-3 transition-transform group-hover:-translate-x-1" />
            Back to Dashboard
          </Link>

          <div className="space-y-1">
            <h1
              className={`text-2xl font-bold tracking-tight lg:text-3xl ${
                isLight ? "text-gray-900" : "text-white"
              }`}
            >
              User Registry
            </h1>
            <p
              className={`text-xs font-medium ${
                isLight ? "text-gray-600" : "text-gray-400"
              }`}
            >
              Global membership management and administrative privilege control.
            </p>
          </div>
        </div>

        <div className="flex flex-col items-center gap-3 sm:flex-row">
          <div className="group relative w-full sm:w-72">
            <Search
              className={`absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transition-colors group-focus-within:text-emerald-500 ${
                isLight ? "text-gray-400" : "text-gray-500"
              }`}
            />
            <input
              type="text"
              placeholder="Filter by name, email, role..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full rounded-lg border py-2.5 pl-10 pr-4 text-xs shadow-sm transition-all focus:outline-none ${
                isLight
                  ? "border-gray-200 bg-white text-gray-900 placeholder:text-gray-400 focus:border-emerald-300 focus:bg-white"
                  : "border-white/5 bg-white/[0.03] text-white placeholder:text-gray-600 focus:border-emerald-500/30 focus:bg-white/[0.05]"
              }`}
            />
          </div>

          <div
            className={`flex items-center gap-2.5 rounded-lg border px-4 py-2 backdrop-blur-md ${
              isLight
                ? "border-gray-200 bg-white shadow-[0_10px_24px_rgba(15,23,42,0.05)]"
                : "border-white/5 bg-white/[0.02]"
            }`}
          >
            <div
              className={`rounded-lg p-1.5 ${
                isLight
                  ? "bg-emerald-50 text-emerald-600"
                  : "bg-emerald-500/10 text-emerald-400"
              }`}
            >
              <Users className="h-4 w-4" />
            </div>

            <div className="flex flex-col">
              <span
                className={`text-[9px] font-bold uppercase tracking-widest leading-none ${
                  isLight ? "text-gray-500" : "text-gray-500"
                }`}
              >
                Registry
              </span>
              <div className="flex items-baseline gap-1">
                <span
                  className={`text-lg font-bold leading-none tabular-nums ${
                    isLight ? "text-gray-900" : "text-white"
                  }`}
                >
                  {totalUsers}
                </span>
                <span
                  className={`text-[9px] font-bold uppercase ${
                    isLight ? "text-gray-500" : "text-gray-600"
                  }`}
                >
                  Users
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <section className="grid gap-3 sm:grid-cols-3">
        <SummaryCard
          label="Total Users"
          value={totalUsers}
          helper="All accounts in the system"
          isLight={isLight}
        />
        <SummaryCard
          label="Admins"
          value={totalAdmins}
          helper="Super admin and sub admin accounts"
          isLight={isLight}
        />
        <SummaryCard
          label="Regular Users"
          value={totalRegularUsers}
          helper="Standard platform users"
          isLight={isLight}
        />
      </section>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`flex items-center gap-2 rounded-lg border p-3 text-xs font-bold ${
            isLight
              ? "border-red-200 bg-red-50 text-red-600"
              : "border-red-500/20 bg-red-500/10 text-red-400"
          }`}
        >
          <ShieldAlert className="h-4 w-4" />
          {error}
        </motion.div>
      )}

      <div
        className={`relative overflow-hidden rounded-xl border shadow-lg backdrop-blur-sm ${
          isLight
            ? "border-gray-200 bg-white"
            : "border-white/5 bg-white/[0.02]"
        }`}
      >
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr
                className={`border-b ${
                  isLight
                    ? "border-gray-200 bg-gray-50"
                    : "border-white/5 bg-white/[0.03]"
                }`}
              >
                <th className="px-4 py-4">
                  <div
                    className={`flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-[0.15em] ${
                      isLight ? "text-gray-500" : "text-gray-500"
                    }`}
                  >
                    <Users className="h-3 w-3" />
                    Identity
                  </div>
                </th>

                <th className="px-4 py-4">
                  <div
                    className={`flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-[0.15em] ${
                      isLight ? "text-gray-500" : "text-gray-500"
                    }`}
                  >
                    <ArrowUpDown className="h-3 w-3" />
                    Rank
                  </div>
                </th>

                <th className="px-4 py-4">
                  <div
                    className={`flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-[0.15em] ${
                      isLight ? "text-gray-500" : "text-gray-500"
                    }`}
                  >
                    <ShieldCheck className="h-3 w-3" />
                    Access
                  </div>
                </th>

                <th className="px-4 py-4">
                  <div
                    className={`flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-[0.15em] ${
                      isLight ? "text-gray-500" : "text-gray-500"
                    }`}
                  >
                    <Calendar className="h-3 w-3" />
                    Joined
                  </div>
                </th>

                <th className="px-4 py-4">
                  <div
                    className={`flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-[0.15em] ${
                      isLight ? "text-gray-500" : "text-gray-500"
                    }`}
                  >
                    <Clock className="h-3 w-3" />
                    Last Active
                  </div>
                </th>

                <th className="px-4 py-4 text-right">
                  <div
                    className={`inline-flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-[0.15em] ${
                      isLight ? "text-gray-500" : "text-gray-500"
                    }`}
                  >
                    Control
                  </div>
                </th>
              </tr>
            </thead>

            <tbody
              className={`divide-y ${
                isLight ? "divide-gray-100" : "divide-white/5"
              }`}
            >
              {filteredUsers.map((user) => (
                <tr
                  key={user.id}
                  className={`group transition-colors ${
                    isLight
                      ? "hover:bg-gray-50"
                      : "hover:bg-white/[0.03]"
                  }`}
                >
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-9 w-9 items-center justify-center rounded-lg border text-xs font-bold shadow-inner transition-transform group-hover:scale-110 ${
                          isLight
                            ? "border-gray-200 bg-gradient-to-br from-gray-100 to-white text-gray-900"
                            : "border-white/10 bg-gradient-to-br from-white/10 to-transparent text-white"
                        }`}
                      >
                        {getInitials(user.username)}
                      </div>

                      <div className="min-w-0">
                        <div
                          className={`truncate text-xs font-bold transition-colors ${
                            isLight
                              ? "text-gray-900 group-hover:text-emerald-600"
                              : "text-white group-hover:text-emerald-400"
                          }`}
                        >
                          {user.username}
                        </div>
                        <div
                          className={`mt-0.5 flex items-center gap-1 truncate text-[10px] ${
                            isLight ? "text-gray-500" : "text-gray-500"
                          }`}
                        >
                          <Mail className="h-2.5 w-2.5" />
                          {user.email}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="px-4 py-4">
                    <div className="flex flex-col">
                      <span
                        className={`text-xs font-bold ${
                          isLight ? "text-gray-900" : "text-white"
                        }`}
                      >
                        {user.rank || "Novice"}
                      </span>
                      <span
                        className={`mt-0.5 text-[8px] font-medium uppercase tracking-widest ${
                          isLight ? "text-gray-500" : "text-gray-600"
                        }`}
                      >
                        Global Rank
                      </span>
                    </div>
                  </td>

                  <td className="px-4 py-4">
                    <RoleBadge role={user.role} isLight={isLight} />
                  </td>

                  <td className="px-4 py-4">
                    <div
                      className={`text-xs font-medium ${
                        isLight ? "text-gray-600" : "text-gray-400"
                      }`}
                    >
                      {formatDate(user.createdAt)}
                    </div>
                  </td>

                  <td className="px-4 py-4">
                    <div
                      className={`text-xs font-medium ${
                        isLight ? "text-gray-600" : "text-gray-400"
                      }`}
                    >
                      {user.lastActive ? formatLastActive(user.lastActive) : "Never"}
                    </div>
                  </td>

                  <td className="px-4 py-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      {isSuperAdmin && user.role !== "super_admin" && (
                        <div
                          className={`flex items-center gap-1 rounded-lg p-0.5 shadow-sm transition-all ${
                            isLight
                              ? "border border-gray-200 bg-gray-50 group-hover:bg-white"
                              : "border border-white/5 bg-white/[0.03] group-hover:bg-white/[0.05]"
                          }`}
                        >
                          <button
                            onClick={() =>
                              setConfirmAction({
                                type:
                                  user.role === "sub_admin"
                                    ? "demote"
                                    : "promote",
                                userId: user.id,
                                username: user.username,
                              })
                            }
                            className={`flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-[8px] font-bold uppercase tracking-widest transition-all active:scale-95 ${
                              user.role === "sub_admin"
                                ? isLight
                                  ? "bg-amber-50 text-amber-700 hover:bg-amber-100"
                                  : "bg-amber-500/10 text-amber-500 hover:bg-amber-500/20"
                                : isLight
                                ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                                : "bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20"
                            }`}
                          >
                            {user.role === "sub_admin" ? (
                              <>
                                <UserX className="h-2.5 w-2.5" />
                                Demote
                              </>
                            ) : (
                              <>
                                <UserCheck className="h-2.5 w-2.5" />
                                Promote
                              </>
                            )}
                          </button>

                          <button
                            onClick={() =>
                              setConfirmAction({
                                type: "delete",
                                userId: user.id,
                                username: user.username,
                              })
                            }
                            className={`rounded-lg p-1.5 transition-all active:scale-90 ${
                              isLight
                                ? "bg-rose-50 text-rose-400 hover:bg-rose-100 hover:text-rose-600"
                                : "bg-rose-500/5 text-rose-500/30 hover:bg-rose-500/10 hover:text-rose-500"
                            }`}
                            title="Delete Account"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredUsers.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div
                className={`mb-4 flex h-14 w-14 items-center justify-center rounded-lg ${
                  isLight
                    ? "bg-gray-100 text-gray-400"
                    : "bg-white/[0.03] text-gray-600"
                }`}
              >
                <Search className="h-7 w-7" />
              </div>

              <h3
                className={`text-sm font-bold ${
                  isLight ? "text-gray-900" : "text-white"
                }`}
              >
                No users found
              </h3>
              <p
                className={`mx-auto mt-1 max-w-xs text-xs ${
                  isLight ? "text-gray-500" : "text-gray-500"
                }`}
              >
                Try adjusting your search terms to find the account you want.
              </p>

              <button
                onClick={() => setSearchTerm("")}
                className={`mt-4 text-xs font-bold underline underline-offset-4 transition-colors ${
                  isLight
                    ? "text-emerald-600 hover:text-emerald-700"
                    : "text-emerald-400 hover:text-emerald-300"
                }`}
              >
                Clear all searches
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function SummaryCard({
  label,
  value,
  helper,
  isLight,
}: {
  label: string;
  value: number;
  helper: string;
  isLight: boolean;
}) {
  return (
    <div
      className={`rounded-lg border p-3.5 shadow-sm ${
        isLight
          ? "border-gray-200 bg-white"
          : "border-white/5 bg-white/[0.02]"
      }`}
    >
      <p
        className={`text-[9px] font-bold uppercase tracking-[0.15em] ${
          isLight ? "text-gray-500" : "text-gray-500"
        }`}
      >
        {label}
      </p>
      <p
        className={`mt-2 text-xl font-bold ${
          isLight ? "text-gray-900" : "text-white"
        }`}
      >
        {value}
      </p>
      <p
        className={`mt-1.5 text-xs ${
          isLight ? "text-gray-500" : "text-gray-500"
        }`}
      >
        {helper}
      </p>
    </div>
  );
}

function RoleBadge({
  role,
  isLight,
}: {
  role: string;
  isLight: boolean;
}) {
  const normalized = role || "user";

  const config: Record<
    string,
    { label: string; classes: string; icon: ReactNode }
  > = {
    super_admin: {
      label: "Super Admin",
      classes: isLight
        ? "bg-purple-50 text-purple-700 border-purple-200"
        : "bg-purple-500/10 text-purple-400 border-purple-500/20",
      icon: <ShieldCheck className="h-2.5 w-2.5" />,
    },
    sub_admin: {
      label: "Sub Admin",
      classes: isLight
        ? "bg-sky-50 text-sky-700 border-sky-200"
        : "bg-sky-500/10 text-sky-400 border-sky-500/20",
      icon: <UserCheck className="h-2.5 w-2.5" />,
    },
    user: {
      label: "User",
      classes: isLight
        ? "bg-gray-50 text-gray-600 border-gray-200"
        : "bg-white/5 text-gray-500 border-white/10",
      icon: <Users className="h-2.5 w-2.5" />,
    },
  };

  const selectedConfig = config[normalized] || {
    label: "Unknown",
    classes: isLight
      ? "bg-gray-50 text-gray-500 border-gray-200"
      : "bg-white/5 text-gray-400 border-white/10",
    icon: <UserX className="h-2.5 w-2.5" />,
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-lg border px-2 py-1 text-[8px] font-bold uppercase tracking-[0.1em] ${selectedConfig.classes}`}
    >
      {selectedConfig.icon}
      {selectedConfig.label}
    </span>
  );
}

function normalizeUser(raw: any): User {
  return {
    id: raw.id || raw._id || raw.userId || "",
    username: raw.username || raw.name || "Unknown User",
    email: raw.email || "No email",
    role: raw.role || "user",
    rank: raw.rank || "Novice",
    createdAt:
      raw.createdAt ||
      raw.created_at ||
      raw.createdon ||
      raw.joinedAt ||
      new Date().toISOString(),
    lastActive:
      raw.lastActive ||
      raw.last_active ||
      null,
    profile_pic: raw.profile_pic || raw.profilePicture || "",
    country: raw.country || "",
  };
}

function getInitials(username: string) {
  return username.slice(0, 2).toUpperCase();
}

function formatDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Unknown date";
  }

  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatLastActive(value: string) {
  if (!value) return "Never";
  
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Never";

  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  
  if (minutes < 5) return "Online";
  if (minutes < 60) return `${minutes}m ago`;
  if (minutes < 1440) return `${Math.floor(minutes / 60)}h ago`;
  
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

async function safeJson(res: Response) {
  try {
    return await res.json();
  } catch {
    return null;
  }
}