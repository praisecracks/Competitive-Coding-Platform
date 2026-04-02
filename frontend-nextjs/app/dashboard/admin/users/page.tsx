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
} from "lucide-react";

interface User {
  id: string;
  username: string;
  email: string;
  role: string;
  rank: string;
  createdAt: string;
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
      <div className="flex min-h-[80vh] items-center justify-center bg-[#020202] px-4">
        <div className="w-full max-w-lg rounded-2xl border border-red-500/10 bg-red-500/5 p-6 text-center backdrop-blur-xl">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-red-500/10 text-red-500 shadow-lg shadow-red-500/10">
            <ShieldAlert className="h-6 w-6" />
          </div>

          <h1 className="mb-2 text-lg font-bold tracking-tight text-white">
            Access Restricted
          </h1>

          <p className="mb-6 text-xs leading-relaxed text-gray-400">
            Only Super Admins can manage users and system roles. Please contact
            support if you require elevated access.
          </p>

          <Link
            href="/dashboard/admin"
            className="inline-flex items-center gap-2 rounded-lg bg-white px-5 py-2.5 text-xs font-bold text-black shadow-lg transition hover:bg-gray-200 active:scale-95"
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
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-pink-500/20 border-t-pink-500" />
          <span className="text-xs font-bold uppercase tracking-widest text-gray-500">
            Accessing Registry...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen space-y-6 pb-20">
      <AnimatePresence>
        {confirmAction && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setConfirmAction(null)}
              className="absolute inset-0 bg-[#020202]/90 backdrop-blur-xl"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md rounded-2xl border border-white/10 bg-[#0a0a0a] p-6 shadow-2xl"
            >
              <div
                className={`mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg ${
                  confirmAction.type === "delete"
                    ? "bg-rose-500/10 text-rose-500"
                    : "bg-sky-500/10 text-sky-500"
                }`}
              >
                {confirmAction.type === "delete" ? (
                  <Trash2 className="h-6 w-6" />
                ) : (
                  <ShieldCheck className="h-6 w-6" />
                )}
              </div>

              <h3 className="text-center text-lg font-bold tracking-tight text-white">
                {confirmAction.type === "delete"
                  ? "Confirm Deletion"
                  : confirmAction.type === "promote"
                  ? "Promote User"
                  : "Demote User"}
              </h3>

              <p className="mt-2.5 text-center text-xs leading-relaxed text-gray-400">
                Are you sure you want to {confirmAction.type}{" "}
                <span className="font-bold text-white">
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
                  className="w-full py-2 text-xs font-bold text-gray-500 transition-colors hover:text-white"
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
            className="group inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-500 transition-colors hover:text-white"
          >
            <ArrowLeft className="h-3 w-3 transition-transform group-hover:-translate-x-1" />
            Back to Dashboard
          </Link>

          <div className="space-y-1">
            <h1 className="text-2xl font-bold tracking-tight text-white lg:text-3xl">
              User Registry
            </h1>
            <p className="text-xs font-medium text-gray-400">
              Global membership management and administrative privilege control.
            </p>
          </div>
        </div>

        <div className="flex flex-col items-center gap-3 sm:flex-row">
          <div className="group relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500 transition-colors group-focus-within:text-emerald-500" />
            <input
              type="text"
              placeholder="Filter by name, email, role..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-lg border border-white/5 bg-white/[0.03] py-2.5 pl-10 pr-4 text-xs text-white placeholder:text-gray-600 shadow-sm transition-all focus:border-emerald-500/30 focus:bg-white/[0.05] focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-2.5 rounded-lg border border-white/5 bg-white/[0.02] px-4 py-2 backdrop-blur-md">
            <div className="rounded-lg bg-emerald-500/10 p-1.5 text-emerald-400">
              <Users className="h-4 w-4" />
            </div>

            <div className="flex flex-col">
              <span className="text-[9px] font-bold uppercase tracking-widest text-gray-500 leading-none">
                Registry
              </span>
              <div className="flex items-baseline gap-1">
                <span className="text-lg font-bold leading-none tabular-nums text-white">
                  {totalUsers}
                </span>
                <span className="text-[9px] font-bold uppercase text-gray-600">
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
        />
        <SummaryCard
          label="Admins"
          value={totalAdmins}
          helper="Super admin and sub admin accounts"
        />
        <SummaryCard
          label="Regular Users"
          value={totalRegularUsers}
          helper="Standard platform users"
        />
      </section>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-xs font-bold text-red-400"
        >
          <ShieldAlert className="h-4 w-4" />
          {error}
        </motion.div>
      )}

      <div className="relative overflow-hidden rounded-xl border border-white/5 bg-white/[0.02] shadow-lg backdrop-blur-sm">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-white/5 bg-white/[0.03]">
                <th className="px-4 py-4">
                  <div className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-[0.15em] text-gray-500">
                    <Users className="h-3 w-3" />
                    Identity
                  </div>
                </th>

                <th className="px-4 py-4">
                  <div className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-[0.15em] text-gray-500">
                    <ArrowUpDown className="h-3 w-3" />
                    Rank
                  </div>
                </th>

                <th className="px-4 py-4">
                  <div className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-[0.15em] text-gray-500">
                    <ShieldCheck className="h-3 w-3" />
                    Access
                  </div>
                </th>

                <th className="px-4 py-4">
                  <div className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-[0.15em] text-gray-500">
                    <Calendar className="h-3 w-3" />
                    Joined
                  </div>
                </th>

                <th className="px-4 py-4 text-right">
                  <div className="inline-flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-[0.15em] text-gray-500">
                    Control
                  </div>
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-white/5">
              {filteredUsers.map((user) => (
                <tr
                  key={user.id}
                  className="group transition-colors hover:bg-white/[0.03]"
                >
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-gradient-to-br from-white/10 to-transparent text-xs font-bold text-white shadow-inner transition-transform group-hover:scale-110">
                        {getInitials(user.username)}
                      </div>

                      <div className="min-w-0">
                        <div className="truncate text-xs font-bold text-white transition-colors group-hover:text-emerald-400">
                          {user.username}
                        </div>
                        <div className="mt-0.5 flex items-center gap-1 truncate text-[10px] text-gray-500">
                          <Mail className="h-2.5 w-2.5" />
                          {user.email}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="px-4 py-4">
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-white">
                        {user.rank || "Novice"}
                      </span>
                      <span className="mt-0.5 text-[8px] font-medium uppercase tracking-widest text-gray-600">
                        Global Rank
                      </span>
                    </div>
                  </td>

                  <td className="px-4 py-4">
                    <RoleBadge role={user.role} />
                  </td>

                  <td className="px-4 py-4">
                    <div className="text-xs font-medium text-gray-400">
                      {formatDate(user.createdAt)}
                    </div>
                  </td>

                  <td className="px-4 py-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      {isSuperAdmin && user.role !== "super_admin" && (
                        <div className="flex items-center gap-1 rounded-lg border border-white/5 bg-white/[0.03] p-0.5 shadow-sm transition-all group-hover:bg-white/[0.05]">
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
                                ? "bg-amber-500/10 text-amber-500 hover:bg-amber-500/20"
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
                            className="rounded-lg bg-rose-500/5 p-1.5 text-rose-500/30 transition-all hover:bg-rose-500/10 hover:text-rose-500 active:scale-90"
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
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-lg bg-white/[0.03] text-gray-600">
                <Search className="h-7 w-7" />
              </div>

              <h3 className="text-sm font-bold text-white">No users found</h3>
              <p className="mx-auto mt-1 max-w-xs text-xs text-gray-500">
                Try adjusting your search terms to find the account you want.
              </p>

              <button
                onClick={() => setSearchTerm("")}
                className="mt-4 text-xs font-bold text-emerald-400 underline underline-offset-4 transition-colors hover:text-emerald-300"
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
}: {
  label: string;
  value: number;
  helper: string;
}) {
  return (
    <div className="rounded-lg border border-white/5 bg-white/[0.02] p-3.5 shadow-sm">
      <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-gray-500">
        {label}
      </p>
      <p className="mt-2 text-xl font-bold text-white">{value}</p>
      <p className="mt-1.5 text-xs text-gray-500">{helper}</p>
    </div>
  );
}

function RoleBadge({ role }: { role: string }) {
  const normalized = role || "user";

  const config: Record<
    string,
    { label: string; classes: string; icon: ReactNode }
  > = {
    super_admin: {
      label: "Super Admin",
      classes: "bg-purple-500/10 text-purple-400 border-purple-500/20",
      icon: <ShieldCheck className="h-2.5 w-2.5" />,
    },
    sub_admin: {
      label: "Sub Admin",
      classes: "bg-sky-500/10 text-sky-400 border-sky-500/20",
      icon: <UserCheck className="h-2.5 w-2.5" />,
    },
    user: {
      label: "User",
      classes: "bg-white/5 text-gray-500 border-white/10",
      icon: <Users className="h-2.5 w-2.5" />,
    },
  };

  const selectedConfig = config[normalized] || {
    label: "Unknown",
    classes: "bg-white/5 text-gray-400 border-white/10",
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

async function safeJson(res: Response) {
  try {
    return await res.json();
  } catch {
    return null;
  }
}