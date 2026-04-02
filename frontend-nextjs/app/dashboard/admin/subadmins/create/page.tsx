"use client";

import { useState, useCallback, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeft, 
  UserPlus, 
  ShieldCheck, 
  ShieldAlert, 
  Mail, 
  Lock, 
  Users, 
  Copy, 
  CheckCircle2, 
  Search, 
  Clock,
  ChevronRight,
  Shield,
  Zap,
  Info
} from "lucide-react";

interface CreatedAccount {
  id: string;
  username: string;
  email: string;
  password: string;
  role: string;
  createdAt: string;
}

export default function CreateSubAdmin() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [createdAccounts, setCreatedAccounts] = useState<CreatedAccount[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [fetchingAdmins, setFetchingAdmins] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: "sub_admin",
  });

  useEffect(() => {
    fetchExistingAdmins();
  }, []);

  const fetchExistingAdmins = async () => {
    try {
      const token = localStorage.getItem("terminal_token");
      if (!token) {
        setFetchingAdmins(false);
        return;
      }

      const res = await fetch("/api/admin/users", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        const data = await res.json();
        const admins: CreatedAccount[] = data.map((user: any) => ({
          id: user.id,
          username: user.username,
          email: user.email,
          password: "", 
          role: user.role,
          createdAt: new Date(user.createdAt).toLocaleString(),
        }));
        setCreatedAccounts(admins);
      }
    } catch (err) {
      console.error("Failed to fetch existing admins:", err);
    } finally {
      setTimeout(() => setFetchingAdmins(false), 800);
    }
  };

  const copyToClipboard = useCallback(async (text: string, id: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(`${id}-${type}`);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const token = localStorage.getItem("terminal_token");
      const res = await fetch("/api/admin/super/create-admin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        const data = await res.json();
        const newAccount: CreatedAccount = {
          id: data.admin.id,
          username: formData.username,
          email: formData.email,
          password: formData.password,
          role: formData.role,
          createdAt: new Date().toLocaleString(),
        };

        setCreatedAccounts([newAccount, ...createdAccounts]);
        setSuccess("Staff account created successfully!");
        
        setFormData({
          username: "",
          email: "",
          password: "",
          role: "sub_admin",
        });

        setTimeout(() => setSuccess(""), 3000);
      } else {
        const data = await res.json();
        throw new Error(data.error || "Failed to create staff account");
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const filteredAccounts = createdAccounts.filter(
    (account) =>
      account.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      account.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen space-y-10 pb-20">
      {/* Header Section */}
      <header className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-3">
          <Link 
            href="/dashboard/admin"
            className="inline-flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-white transition-colors uppercase tracking-widest group"
          >
            <ArrowLeft className="h-3 w-3 group-hover:-translate-x-1 transition-transform" />
            Back to Dashboard
          </Link>
          <div className="space-y-2">
            <h1 className="text-2xl font-black tracking-tight text-white lg:text-3xl">Staff Onboarding</h1>
            <p className="text-gray-400 text-xs font-medium">Create and authorize new administrative staff members for the platform.</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3 rounded-lg border border-indigo-500/10 bg-indigo-500/5 px-4 py-2.5 backdrop-blur-sm">
            <Shield className="h-4 w-4 text-indigo-400" />
            <span className="text-xs font-black uppercase tracking-widest text-indigo-400">Secure Provisioning</span>
          </div>
        </div>
      </header>

      <div className="grid gap-6 lg:grid-cols-[1fr_0.8fr]">
        {/* Form Section */}
        <motion.section
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="rounded-[32px] border border-white/5 bg-white/[0.02] p-8 shadow-2xl backdrop-blur-sm"
        >
          <div className="flex items-center gap-4 mb-6">
            <div className="h-10 w-10 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <UserPlus className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-white uppercase tracking-tight">Provision Account</h2>
              <p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest mt-0.5">Initialize core staff credentials</p>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mb-6 rounded-lg border border-rose-500/20 bg-rose-500/10 p-4 text-sm text-rose-400 flex items-center gap-3 font-bold"
              >
                <ShieldAlert className="h-5 w-5 flex-shrink-0" />
                {error}
              </motion.div>
            )}

            {success && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mb-6 rounded-lg border border-emerald-500/20 bg-emerald-500/10 p-4 text-sm text-emerald-400 flex items-center gap-3 font-bold"
              >
                <CheckCircle2 className="h-5 w-5 flex-shrink-0" />
                {success}
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="text-[9px] font-black text-gray-500 uppercase tracking-[0.2em] ml-1 flex items-center gap-2">
                  <Users className="h-3 w-3" />
                  Username
                </label>
                <input
                  type="text" required value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  className="w-full rounded-lg border border-white/5 bg-white/[0.03] px-4 py-3 text-sm text-white placeholder:text-gray-600 focus:border-indigo-500/30 focus:bg-white/[0.05] focus:outline-none transition-all"
                  placeholder="e.g. admin_prime"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[9px] font-black text-gray-500 uppercase tracking-[0.2em] ml-1 flex items-center gap-2">
                  <Mail className="h-3 w-3" />
                  Email Address
                </label>
                <input
                  type="email" required value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full rounded-lg border border-white/5 bg-white/[0.03] px-4 py-3 text-sm text-white placeholder:text-gray-600 focus:border-indigo-500/30 focus:bg-white/[0.05] focus:outline-none transition-all"
                  placeholder="staff@platform.com"
                />
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="text-[9px] font-black text-gray-500 uppercase tracking-[0.2em] ml-1 flex items-center gap-2">
                  <Lock className="h-3 w-3" />
                  Security Key
                </label>
                <input
                  type="password" required value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full rounded-lg border border-white/5 bg-white/[0.03] px-4 py-3 text-sm text-white placeholder:text-gray-600 focus:border-indigo-500/30 focus:bg-white/[0.05] focus:outline-none transition-all"
                  placeholder="Minimum 8 characters"
                  minLength={8}
                />
              </div>

              <div className="space-y-2">
                <label className="text-[9px] font-black text-gray-500 uppercase tracking-[0.2em] ml-1 flex items-center gap-2">
                  <ShieldCheck className="h-3 w-3" />
                  Authorization Level
                </label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full rounded-lg border border-white/5 bg-white/[0.03] px-4 py-3 text-sm text-white focus:border-indigo-500/30 focus:bg-white/[0.05] focus:outline-none transition-all appearance-none cursor-pointer"
                >
                  <option value="sub_admin" className="bg-[#0a0a0a]">Sub Admin (Standard)</option>
                  <option value="super_admin" className="bg-[#0a0a0a]">Super Admin (Full Access)</option>
                </select>
              </div>
            </div>

            <button
              type="submit" disabled={loading}
              className="mt-4 w-full rounded-lg bg-white text-black py-3 text-sm font-black transition hover:bg-gray-200 disabled:opacity-50 active:scale-[0.98] uppercase tracking-widest shadow-xl shadow-white/5 flex items-center justify-center gap-3"
            >
              {loading ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-black/20 border-t-black" />
              ) : (
                <>
                  <Zap className="h-4 w-4" />
                  Authorize Staff Account
                </>
              )}
            </button>
          </form>
        </motion.section>

        {/* Logs Section */}
        <motion.section
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="rounded-[32px] border border-white/5 bg-white/[0.02] p-8 shadow-2xl backdrop-blur-sm h-fit"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                <Users className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-lg font-black text-white uppercase tracking-tight">Access Registry</h2>
                <p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest mt-0.5">{createdAccounts.length} Authorized Entities</p>
              </div>
            </div>
          </div>

          <div className="relative mb-5 group">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500 group-focus-within:text-indigo-400 transition-colors" />
            <input
              type="text"
              placeholder="Search by username or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-white/5 bg-white/[0.03] py-3 pl-10 pr-4 text-sm text-white placeholder:text-gray-600 focus:border-indigo-500/30 focus:bg-white/[0.05] focus:outline-none transition-all"
            />
          </div>

          <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
            {fetchingAdmins ? (
              <div className="py-20 flex flex-col items-center justify-center text-center">
                <div className="h-10 w-10 animate-spin rounded-full border-2 border-indigo-500/20 border-t-indigo-500 mb-4" />
                <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Accessing Secure Logs...</p>
              </div>
            ) : filteredAccounts.length > 0 ? (
              filteredAccounts.map((account, index) => (
                <motion.div
                  key={account.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="group relative rounded-2xl border border-white/5 bg-white/[0.03] p-4 hover:bg-white/[0.06] hover:border-white/10 transition-all shadow-lg"
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-white/10 to-transparent border border-white/10 flex items-center justify-center text-sm font-black text-white group-hover:scale-110 transition-transform">
                        {account.username.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-white group-hover:text-indigo-400 transition-colors truncate">{account.username}</p>
                        <p className="text-[9px] font-bold text-gray-600 uppercase tracking-widest flex items-center gap-1.5 mt-0.5">
                          <Clock className="h-3 w-3" />
                          {account.createdAt.split(',')[0]}
                        </p>
                      </div>
                    </div>
                    <RoleBadge role={account.role} />
                  </div>

                  <div className="space-y-2 pt-3 border-t border-white/5">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2 min-w-0">
                        <Mail className="h-3 w-3 text-gray-600 flex-shrink-0" />
                        <p className="text-[10px] font-medium text-gray-500 truncate">{account.email}</p>
                      </div>
                      <button
                        onClick={() => copyToClipboard(account.email, account.id, "email")}
                        className={`p-1.5 rounded-lg transition-all ${
                          copiedId === `${account.id}-email`
                            ? "bg-emerald-500/10 text-emerald-500"
                            : "bg-white/5 text-gray-600 hover:text-white hover:bg-white/10"
                        }`}
                      >
                        {copiedId === `${account.id}-email` ? <CheckCircle2 className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                      </button>
                    </div>

                    {account.password && (
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2 min-w-0">
                          <Lock className="h-3 w-3 text-gray-600 flex-shrink-0" />
                          <p className="text-[10px] font-mono text-gray-500 truncate">••••••••••••</p>
                        </div>
                        <button
                          onClick={() => copyToClipboard(account.password, account.id, "password")}
                          className={`p-1.5 rounded-lg transition-all ${
                            copiedId === `${account.id}-password`
                              ? "bg-emerald-500/10 text-emerald-400"
                              : "bg-white/5 text-gray-600 hover:text-white hover:bg-white/10"
                          }`}
                        >
                          {copiedId === `${account.id}-password` ? <CheckCircle2 className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                        </button>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="py-16 flex flex-col items-center justify-center text-center">
                <div className="h-14 w-14 rounded-lg bg-white/[0.03] border border-white/5 flex items-center justify-center text-gray-700 mb-4">
                  <Info className="h-7 w-7" />
                </div>
                <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest">Registry Empty</h3>
                <p className="text-[9px] text-gray-600 mt-1.5 max-w-[180px] mx-auto font-medium">No administrative accounts found matching your query.</p>
              </div>
            )}
          </div>
        </motion.section>
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.1);
        }
      `}</style>
    </div>
  );
}

function RoleBadge({ role }: { role: string }) {
  const isSuper = role === "super_admin";
  return (
    <span className={`px-2 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest border ${
      isSuper 
        ? "bg-purple-500/10 text-purple-400 border-purple-500/20" 
        : "bg-indigo-500/10 text-indigo-400 border-indigo-500/20"
    }`}>
      {isSuper ? "Super" : "Sub"}
    </span>
  );
}
