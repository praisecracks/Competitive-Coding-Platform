"use client";

import { useEffect, useState, useMemo, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Plus, 
  Search, 
  Trash2, 
  Edit3, 
  ChevronRight, 
  Clock, 
  Tag, 
  Layers, 
  AlertCircle,
  X
} from "lucide-react";

interface Challenge {
  id: number;
  title: string;
  description: string;
  difficulty: string;
  category: string;
  duration: number;
  tags: string[];
  constraints?: string[];
  problem_statement?: string;
}

function ManageChallengesContent() {
  const searchParams = useSearchParams();
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleting, setDeleting] = useState<number | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<Challenge | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDifficulty, setFilterDifficulty] = useState("All");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingChallenge, setEditingChallenge] = useState<Challenge | null>(null);

  const fetchChallenges = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("terminal_token");
      const res = await fetch("/api/admin/challenges", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Unauthorized");
      const data = await res.json();
      setChallenges(data);
    } catch (err) {
      setError("Failed to load challenges.");
    } finally {
      setTimeout(() => setLoading(false), 800);
    }
  };

  const handleDelete = async (id: number) => {
    setDeleting(id);
    try {
      const token = localStorage.getItem("terminal_token");
      const res = await fetch(`/api/admin/challenges/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setChallenges(challenges.filter((c) => c.id !== id));
        setConfirmDelete(null);
      } else {
        alert("Delete failed");
      }
    } catch (err) {
      alert("Error deleting challenge");
    } finally {
      setDeleting(null);
    }
  };

  const filteredChallenges = useMemo(() => {
    return challenges.filter((c) => {
      const matchesSearch = c.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           c.category.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesDifficulty = filterDifficulty === "All" || c.difficulty === filterDifficulty;
      return matchesSearch && matchesDifficulty;
    });
  }, [challenges, searchTerm, filterDifficulty]);

  const openCreateModal = () => {
    setEditingChallenge(null);
    setIsModalOpen(true);
  };

  const openEditModal = (challenge: Challenge) => {
    setEditingChallenge(challenge);
    setIsModalOpen(true);
  };

  useEffect(() => {
    fetchChallenges();
  }, []);

  return (
    <div className="min-h-screen bg-[#020202] text-white/90">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header Section */}
        <header className="mb-12 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm font-medium text-white/40">
              <Link href="/dashboard/admin" className="hover:text-fuchsia-400 transition-colors">Admin Center</Link>
              <ChevronRight className="h-4 w-4" />
              <span className="text-white/60">Challenges</span>
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">Challenge Library</h1>
            <p className="text-white/40">Manage your platform's coding content and difficulty levels.</p>
          </div>
          
          <button
            onClick={openCreateModal}
            className="group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-2xl bg-white px-6 py-3.5 text-sm font-semibold text-black transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-fuchsia-500/20 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
            <Plus className="h-4 w-4" />
            Create Challenge
          </button>
        </header>

        {/* Filters & Search */}
        <div className="mb-8 grid gap-4 md:grid-cols-[1fr_auto]">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/20 transition-colors group-focus-within:text-fuchsia-400" />
            <input
              type="text"
              placeholder="Search by title or category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-12 w-full rounded-2xl border border-white/10 bg-white/[0.03] pl-11 pr-4 text-sm outline-none transition-all focus:border-fuchsia-500/30 focus:bg-white/[0.05] focus:ring-4 focus:ring-fuchsia-500/5"
            />
          </div>
          
          <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0">
            {["All", "Easy", "Medium", "Hard"].map((level) => (
              <button
                key={level}
                onClick={() => setFilterDifficulty(level)}
                className={`h-12 whitespace-nowrap rounded-2xl px-6 text-sm font-medium transition-all ${
                  filterDifficulty === level
                    ? "bg-white text-black"
                    : "border border-white/10 bg-white/[0.03] text-white/60 hover:border-white/20 hover:bg-white/[0.05]"
                }`}
              >
                {level}
              </button>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div className="relative min-h-[400px]">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 space-y-4">
              <div className="relative h-12 w-12">
                <div className="absolute inset-0 animate-ping rounded-full bg-fuchsia-500/20" />
                <div className="relative flex h-full w-full items-center justify-center rounded-full border border-fuchsia-500/50 bg-black">
                  <Layers className="h-5 w-5 text-fuchsia-400 animate-pulse" />
                </div>
              </div>
              <p className="text-sm font-medium text-white/40 uppercase tracking-widest">Indexing Library...</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center rounded-3xl border border-red-500/10 bg-red-500/[0.02] py-20">
              <AlertCircle className="mb-4 h-10 w-10 text-red-400/50" />
              <p className="text-red-400">{error}</p>
              <button onClick={fetchChallenges} className="mt-4 text-sm font-medium text-white/40 hover:text-white underline decoration-white/20 underline-offset-4">Try again</button>
            </div>
          ) : filteredChallenges.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-3xl border border-white/5 bg-white/[0.01] py-24">
              <div className="mb-6 rounded-2xl bg-white/5 p-4">
                <Search className="h-8 w-8 text-white/20" />
              </div>
              <h3 className="text-lg font-semibold text-white">No challenges found</h3>
              <p className="mt-1 text-sm text-white/40">Try adjusting your search or filters.</p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <AnimatePresence mode="popLayout">
                {filteredChallenges.map((challenge) => (
                  <motion.div
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    key={challenge.id}
                    className="group relative flex flex-col rounded-3xl border border-white/10 bg-white/[0.02] p-6 transition-all hover:border-fuchsia-500/30 hover:bg-white/[0.04]"
                  >
                    <div className="mb-4 flex items-start justify-between">
                      <div className={`rounded-xl px-3 py-1 text-[10px] font-bold uppercase tracking-widest ${
                        challenge.difficulty === "Easy" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" :
                        challenge.difficulty === "Medium" ? "bg-amber-500/10 text-amber-400 border border-amber-500/20" :
                        "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                      }`}>
                        {challenge.difficulty}
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => openEditModal(challenge)}
                          className="rounded-lg bg-white/5 p-2 text-white/40 transition-colors hover:bg-white/10 hover:text-white"
                          title="Edit"
                        >
                          <Edit3 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => setConfirmDelete(challenge)}
                          className="rounded-lg bg-white/5 p-2 text-white/40 transition-colors hover:bg-red-500/10 hover:text-red-400"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    <h3 className="mb-2 text-lg font-bold text-white group-hover:text-fuchsia-400 transition-colors line-clamp-1">
                      {challenge.title}
                    </h3>
                    <p className="mb-6 text-sm leading-relaxed text-white/40 line-clamp-2">
                      {challenge.description}
                    </p>

                    <div className="mt-auto flex flex-wrap gap-2">
                      <div className="flex items-center gap-1.5 rounded-lg bg-white/5 px-2.5 py-1.5 text-[10px] font-medium text-white/60">
                        <Clock className="h-3 w-3" />
                        {challenge.duration}m
                      </div>
                      <div className="flex items-center gap-1.5 rounded-lg bg-white/5 px-2.5 py-1.5 text-[10px] font-medium text-white/60">
                        <Tag className="h-3 w-3" />
                        {challenge.category}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {confirmDelete && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
              onClick={() => setConfirmDelete(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-sm rounded-[32px] border border-white/10 bg-[#0d0d0d] p-8 shadow-2xl"
            >
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-500/10">
                <AlertCircle className="h-7 w-7 text-red-500" />
              </div>
              <h2 className="mb-2 text-xl font-bold text-white">Delete Challenge?</h2>
              <p className="mb-8 text-sm leading-relaxed text-white/40">
                Are you sure you want to delete <span className="text-white font-medium">"{confirmDelete.title}"</span>? This action is permanent and cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setConfirmDelete(null)}
                  className="flex-1 rounded-2xl border border-white/10 bg-white/5 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(confirmDelete.id)}
                  disabled={deleting !== null}
                  className="flex-1 rounded-2xl bg-red-500 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
                >
                  {deleting === confirmDelete.id ? "Deleting..." : "Delete"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Create/Edit Modal */}
      <ChallengeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => {
          setIsModalOpen(false);
          fetchChallenges();
        }}
        challenge={editingChallenge}
      />
    </div>
  );
}

// Modal Component
function ChallengeModal({ isOpen, onClose, onSuccess, challenge }: { 
  isOpen: boolean; 
  onClose: () => void; 
  onSuccess: () => void;
  challenge: Challenge | null;
}) {
  const [formData, setFormData] = useState<Partial<Challenge>>({
    title: "",
    description: "",
    difficulty: "Easy",
    category: "General",
    duration: 30,
    tags: [],
    constraints: [],
    problem_statement: ""
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (challenge) {
      setFormData(challenge);
    } else {
      setFormData({
        title: "",
        description: "",
        difficulty: "Easy",
        category: "General",
        duration: 30,
        tags: [],
        constraints: [],
        problem_statement: ""
      });
    }
    setError("");
  }, [challenge, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      const token = localStorage.getItem("terminal_token");
      const url = challenge ? `/api/admin/challenges/${challenge.id}` : "/api/admin/challenges";
      const method = challenge ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Save failed");
      }
      
      onSuccess();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/90 backdrop-blur-md"
        onClick={onClose}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative flex h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-[40px] border border-white/10 bg-[#0d0d0d] shadow-2xl"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-white/5 px-8 py-6">
          <div>
            <h2 className="text-2xl font-bold text-white">
              {challenge ? "Edit Challenge" : "Create Challenge"}
            </h2>
            <p className="text-sm text-white/40">Define your coding problem details below.</p>
          </div>
          <button
            onClick={onClose}
            className="rounded-2xl bg-white/5 p-3 text-white/40 transition-colors hover:bg-white/10 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto px-8 py-8">
          <form id="challenge-form" onSubmit={handleSubmit} className="grid gap-8 lg:grid-cols-2">
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-white/40">Title</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Array Summation"
                  className="h-14 w-full rounded-2xl border border-white/10 bg-white/[0.03] px-5 text-sm text-white outline-none transition-all focus:border-fuchsia-500/30 focus:bg-white/[0.05]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-white/40">Difficulty</label>
                  <select
                    value={formData.difficulty}
                    onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                    className="h-14 w-full rounded-2xl border border-white/10 bg-white/[0.03] px-5 text-sm text-white outline-none transition-all focus:border-fuchsia-500/30 focus:bg-white/[0.05] appearance-none"
                  >
                    <option value="Easy" className="bg-[#0d0d0d]">Easy</option>
                    <option value="Medium" className="bg-[#0d0d0d]">Medium</option>
                    <option value="Hard" className="bg-[#0d0d0d]">Hard</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-white/40">Duration (Mins)</label>
                  <input
                    type="number"
                    required
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
                    className="h-14 w-full rounded-2xl border border-white/10 bg-white/[0.03] px-5 text-sm text-white outline-none transition-all focus:border-fuchsia-500/30 focus:bg-white/[0.05]"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-white/40">Category</label>
                <input
                  type="text"
                  required
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  placeholder="e.g. Data Structures"
                  className="h-14 w-full rounded-2xl border border-white/10 bg-white/[0.03] px-5 text-sm text-white outline-none transition-all focus:border-fuchsia-500/30 focus:bg-white/[0.05]"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-white/40">Summary</label>
                <textarea
                  required
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Briefly explain the challenge goal..."
                  className="w-full rounded-2xl border border-white/10 bg-white/[0.03] p-5 text-sm text-white outline-none transition-all focus:border-fuchsia-500/30 focus:bg-white/[0.05] resize-none"
                />
              </div>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-white/40">Problem Statement (Full)</label>
                <textarea
                  required
                  rows={8}
                  value={formData.problem_statement}
                  onChange={(e) => setFormData({ ...formData, problem_statement: e.target.value })}
                  placeholder="Detailed explanation, input/output formats, etc..."
                  className="w-full rounded-2xl border border-white/10 bg-white/[0.03] p-5 text-sm text-white outline-none transition-all focus:border-fuchsia-500/30 focus:bg-white/[0.05] resize-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-white/40">Tags (Comma separated)</label>
                <input
                  type="text"
                  value={formData.tags?.join(", ")}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value.split(",").map(s => s.trim()).filter(Boolean) })}
                  placeholder="arrays, math, algorithms"
                  className="h-14 w-full rounded-2xl border border-white/10 bg-white/[0.03] px-5 text-sm text-white outline-none transition-all focus:border-fuchsia-500/30 focus:bg-white/[0.05]"
                />
              </div>

              {error && (
                <div className="flex items-center gap-2 rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-xs font-medium text-red-400">
                  <AlertCircle className="h-4 w-4" />
                  {error}
                </div>
              )}
            </div>
          </form>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-end gap-3 border-t border-white/5 px-8 py-6">
          <button
            onClick={onClose}
            className="rounded-2xl border border-white/10 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10"
          >
            Cancel
          </button>
          <button
            form="challenge-form"
            type="submit"
            disabled={saving}
            className="group relative inline-flex items-center justify-center overflow-hidden rounded-2xl bg-white px-8 py-3 text-sm font-semibold text-black transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-fuchsia-500/20 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
            <span className="relative z-10">{saving ? "Saving..." : "Save Challenge"}</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
}

export default function ManageChallenges() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#020202] text-white/90">
          <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <div className="flex flex-col items-center justify-center py-20 space-y-4">
              <div className="h-12 w-12 animate-spin rounded-full border-2 border-fuchsia-500 border-t-transparent" />
              <p className="text-sm font-medium text-white/40 uppercase tracking-widest">Loading challenges...</p>
            </div>
          </div>
        </div>
      }
    >
      <ManageChallengesContent />
    </Suspense>
  );
}
