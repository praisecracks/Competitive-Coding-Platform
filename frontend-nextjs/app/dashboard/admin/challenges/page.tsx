"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Code, 
  Plus, 
  Search, 
  Filter, 
  Trash2, 
  Edit3, 
  ArrowLeft, 
  ChevronRight, 
  Clock, 
  Tag, 
  Layers, 
  AlertCircle,
  X,
  CheckCircle2,
  ChevronDown,
  LayoutGrid,
  Zap
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

export default function ManageChallenges() {
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
    const action = searchParams.get("action");
    if (action === "create") {
      openCreateModal();
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen space-y-6 pb-20">
      <header className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-2.5">
          <Link 
            href="/dashboard/admin"
            className="inline-flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-white transition-colors uppercase tracking-widest group"
          >
            <ArrowLeft className="h-3 w-3 group-hover:-translate-x-1 transition-transform" />
            Back to Dashboard
          </Link>
          <div className="space-y-1">
            <h1 className="text-2xl font-bold tracking-tight text-white lg:text-3xl">Challenge Repository</h1>
            <p className="text-gray-400 text-xs font-medium">Curate and manage high-performance tasks for the coding library.</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={openCreateModal}
            className="inline-flex items-center gap-2 rounded-lg bg-white text-black px-5 py-2.5 text-xs font-bold transition hover:bg-gray-200 active:scale-95 shadow-lg shadow-white/5"
          >
            <Plus className="h-4 w-4" />
            Create Challenge
          </button>
        </div>
      </header>

      <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
        <div className="relative w-full lg:w-80 group">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500 group-focus-within:text-pink-500 transition-colors" />
          <input 
            type="text" 
            placeholder="Search tasks, categories..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-lg border border-white/5 bg-white/[0.03] py-2.5 pl-10 pr-4 text-xs text-white placeholder:text-gray-600 focus:border-pink-500/30 focus:bg-white/[0.05] focus:outline-none transition-all shadow-sm"
          />
        </div>

        <div className="flex items-center gap-1.5 p-1 rounded-lg border border-white/5 bg-white/[0.03] backdrop-blur-sm overflow-x-auto no-scrollbar w-full lg:w-auto">
          {["All", "Easy", "Medium", "Hard"].map((diff) => (
            <button
              key={diff}
              onClick={() => setFilterDifficulty(diff)}
              className={`px-4 py-1.5 rounded-md text-[9px] font-bold uppercase tracking-widest transition-all ${
                filterDifficulty === diff 
                ? "bg-white text-black shadow-lg" 
                : "text-gray-500 hover:text-white hover:bg-white/5"
              }`}
            >
              {diff}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-lg bg-rose-500/10 border border-rose-500/20 p-3 text-rose-400 text-xs font-bold flex items-center gap-2"
        >
          <AlertCircle className="h-4 w-4" />
          {error}
        </motion.div>
      )}

      {loading ? (
        <div className="grid gap-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-20 w-full rounded-lg bg-white/[0.02] animate-pulse border border-white/5" />
          ))}
        </div>
      ) : (
        <div className="grid gap-3">
          {filteredChallenges.length > 0 ? (
            filteredChallenges.map((challenge) => (
              <motion.div 
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                key={challenge.id} 
                className="group relative flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-lg border border-white/5 bg-white/[0.02] p-4 transition-all hover:bg-white/[0.04] hover:border-white/10 hover:shadow-lg hover:shadow-pink-500/5"
              >
                <div className="flex items-center gap-4">
                  <div className={`h-10 w-10 rounded-lg flex items-center justify-center text-xs font-bold border transition-transform group-hover:scale-110 ${
                    challenge.difficulty === 'Easy' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                    challenge.difficulty === 'Medium' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                    'bg-rose-500/10 text-rose-400 border-rose-500/20'
                  }`}>
                    {challenge.difficulty[0]}
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-sm font-bold text-white tracking-tight group-hover:text-pink-400 transition-colors truncate">{challenge.title}</h3>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 mt-1.5">
                      <div className="flex items-center gap-1 text-[9px] font-bold text-gray-500 uppercase tracking-widest">
                        <Layers className="h-2.5 w-2.5 text-pink-500/50" />
                        {challenge.category}
                      </div>
                      <div className="flex items-center gap-1 text-[9px] font-bold text-gray-500 uppercase tracking-widest">
                        <Clock className="h-2.5 w-2.5 text-purple-500/50" />
                        {challenge.duration}m
                      </div>
                      <div className="flex gap-1.5">
                        {challenge.tags?.slice(0, 3).map(tag => (
                          <span key={tag} className="text-[8px] font-bold text-gray-400 bg-white/5 px-1.5 py-0.5 rounded border border-white/5 group-hover:border-white/10 transition-colors">#{tag}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 self-end sm:self-center">
                  <button 
                    onClick={() => openEditModal(challenge)}
                    className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-all active:scale-95 border border-white/5 hover:border-white/10"
                    title="Edit Challenge"
                  >
                    <Edit3 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setConfirmDelete(challenge)}
                    className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-500/5 text-rose-500/40 hover:text-rose-500 hover:bg-rose-500/10 transition-all active:scale-95 border border-transparent hover:border-rose-500/20"
                    title="Delete Challenge"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                  <div className="ml-1.5 h-6 w-px bg-white/5 hidden sm:block" />
                  <ChevronRight className="h-4 w-4 text-gray-700 group-hover:text-pink-500 group-hover:translate-x-1 transition-all hidden sm:block" />
                </div>
              </motion.div>
            ))
          ) : (
            <div className="py-20 flex flex-col items-center justify-center text-center">
              <div className="h-16 w-16 rounded-xl bg-white/[0.03] flex items-center justify-center text-gray-600 mb-4 border border-white/5">
                <Code className="h-8 w-8" />
              </div>
              <h3 className="text-lg font-bold text-white tracking-tight">Repository Empty</h3>
              <p className="text-gray-500 mt-1.5 max-w-sm mx-auto font-medium text-xs">No challenges found matching your filters. Start by creating a new challenge or adjust your search.</p>
              <button 
                onClick={() => { setSearchTerm(''); setFilterDifficulty('All'); }}
                className="mt-6 text-xs font-bold text-pink-500 hover:text-pink-400 transition-colors underline underline-offset-4"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      )}

      {/* Challenge Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <ChallengeModal 
            challenge={editingChallenge} 
            onClose={() => setIsModalOpen(false)} 
            onSuccess={() => {
              setIsModalOpen(false);
              fetchChallenges();
            }}
          />
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {confirmDelete && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setConfirmDelete(null)}
              className="absolute inset-0 bg-[#020202]/90 backdrop-blur-xl"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md rounded-2xl border border-white/10 bg-[#0a0a0a] p-6 shadow-2xl"
            >
              <div className="mx-auto h-12 w-12 rounded-lg bg-rose-500/10 text-rose-500 flex items-center justify-center mb-4">
                <Trash2 className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-white text-center tracking-tight uppercase">Confirm Deletion</h3>
              <p className="mt-2.5 text-gray-400 text-xs text-center leading-relaxed font-medium">
                Are you sure you want to remove <strong className="text-white">{confirmDelete.title}</strong>? All associated submission records will be permanently erased.
              </p>
              <div className="mt-6 space-y-2">
                <button
                  onClick={() => handleDelete(confirmDelete.id)}
                  disabled={!!deleting}
                  className="w-full rounded-lg bg-rose-500 py-2.5 text-xs font-bold text-white shadow-lg shadow-rose-500/20 hover:bg-rose-600 transition-all active:scale-95 disabled:opacity-50 uppercase tracking-widest"
                >
                  {deleting ? (
                    <div className="h-3 w-3 animate-spin rounded-full border-2 border-white/20 border-t-white mx-auto" />
                  ) : "Delete Permanently"}
                </button>
                <button 
                  onClick={() => setConfirmDelete(null)} 
                  className="w-full py-2 text-xs font-bold text-gray-500 hover:text-white transition-colors"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ChallengeModal({ challenge, onClose, onSuccess }: { challenge: Challenge | null, onClose: () => void, onSuccess: () => void }) {
  const isEdit = !!challenge;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    title: challenge?.title || "",
    description: challenge?.description || "",
    difficulty: challenge?.difficulty || "Easy",
    category: challenge?.category || "Algorithms",
    duration: challenge?.duration || 30,
    tags: challenge?.tags?.join(", ") || "",
    problem_statement: challenge?.problem_statement || "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("terminal_token");
      const url = isEdit ? `/api/admin/challenges/${challenge.id}` : "/api/admin/challenges";
      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          tags: formData.tags.split(",").map((t) => t.trim()).filter(Boolean),
          duration: Number(formData.duration),
        }),
      });

      if (res.ok) {
        onSuccess();
      } else {
        const data = await res.json();
        throw new Error(data.error || "Operation failed");
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-[#020202]/90 backdrop-blur-xl"
      />
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }} 
        animate={{ opacity: 1, scale: 1, y: 0 }} 
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border border-white/10 bg-[#0a0a0a] p-6 shadow-2xl custom-scrollbar"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight uppercase">
              {isEdit ? "Refine Challenge" : "Forge New Challenge"}
            </h2>
            <p className="text-gray-500 text-[10px] font-bold mt-0.5 uppercase tracking-widest flex items-center gap-1.5">
              <Zap className="h-3 w-3 text-pink-500" />
              {isEdit ? `Synchronizing ID: ${challenge.id}` : "Initialize core task parameters"}
            </p>
          </div>
          <button 
            onClick={onClose} 
            className="h-9 w-9 flex items-center justify-center rounded-lg bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white transition-all active:scale-95"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {error && (
          <div className="mb-6 rounded-lg bg-rose-500/10 border border-rose-500/20 p-3 text-rose-400 text-xs font-bold flex items-center gap-2">
            <AlertCircle className="h-4 w-4" />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label className="text-[9px] font-bold text-gray-500 uppercase tracking-[0.15em] ml-1">Title</label>
              <input
                type="text" required value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full rounded-lg border border-white/5 bg-white/[0.03] px-3.5 py-2.5 text-xs text-white focus:border-pink-500/30 focus:bg-white/[0.05] focus:outline-none transition-all"
                placeholder="e.g. Memory Matrix"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[9px] font-bold text-gray-500 uppercase tracking-[0.15em] ml-1">Difficulty</label>
              <div className="relative">
                <select
                  value={formData.difficulty}
                  onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                  className="w-full rounded-lg border border-white/5 bg-white/[0.03] px-3.5 py-2.5 text-xs text-white focus:border-pink-500/30 focus:bg-white/[0.05] focus:outline-none transition-all appearance-none cursor-pointer"
                >
                  <option value="Easy" className="bg-[#0a0a0a] text-emerald-400">🟢 Easy</option>
                  <option value="Medium" className="bg-[#0a0a0a] text-amber-400">🟡 Medium</option>
                  <option value="Hard" className="bg-[#0a0a0a] text-rose-400">🔴 Hard</option>
                </select>
                <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-500 pointer-events-none" />
              </div>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label className="text-[9px] font-bold text-gray-500 uppercase tracking-[0.15em] ml-1">Category</label>
              <input
                type="text" required value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full rounded-lg border border-white/5 bg-white/[0.03] px-3.5 py-2.5 text-xs text-white focus:border-pink-500/30 focus:bg-white/[0.05] focus:outline-none transition-all"
                placeholder="e.g. Data Structures"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[9px] font-bold text-gray-500 uppercase tracking-[0.15em] ml-1">Limit (Minutes)</label>
              <div className="relative">
                <Clock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-600" />
                <input
                  type="number" required value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: Number(e.target.value) })}
                  className="w-full rounded-lg border border-white/5 bg-white/[0.03] px-10 py-2.5 text-xs text-white focus:border-pink-500/30 focus:bg-white/[0.05] focus:outline-none transition-all"
                />
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[9px] font-bold text-gray-500 uppercase tracking-[0.15em] ml-1 flex items-center gap-1.5">
              <Tag className="h-3 w-3" />
              Tags
            </label>
            <input
              type="text" value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              className="w-full rounded-lg border border-white/5 bg-white/[0.03] px-3.5 py-2.5 text-xs text-white focus:border-pink-500/30 focus:bg-white/[0.05] focus:outline-none transition-all"
              placeholder="array, sorting, optimization..."
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[9px] font-bold text-gray-500 uppercase tracking-[0.15em] ml-1">Brief Overview</label>
            <textarea
              rows={2} required value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full rounded-lg border border-white/5 bg-white/[0.03] px-3.5 py-2.5 text-xs text-white focus:border-pink-500/30 focus:bg-white/[0.05] focus:outline-none transition-all resize-none"
              placeholder="Summarize the core problem in 1-2 sentences..."
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[9px] font-bold text-gray-500 uppercase tracking-[0.15em] ml-1 flex items-center gap-1.5">
              <LayoutGrid className="h-3 w-3" />
              Full Specification (Markdown)
            </label>
            <textarea
              rows={6} required value={formData.problem_statement}
              onChange={(e) => setFormData({ ...formData, problem_statement: e.target.value })}
              className="w-full rounded-lg border border-white/5 bg-white/[0.03] px-3.5 py-2.5 text-xs text-white focus:border-pink-500/30 focus:bg-white/[0.05] focus:outline-none transition-all resize-none font-mono custom-scrollbar"
              placeholder="Detailed instructions, input/output format, examples..."
            />
          </div>

          <button
            type="submit" disabled={loading}
            className="w-full mt-4 rounded-lg bg-white text-black py-2.5 text-xs font-bold transition hover:bg-gray-200 disabled:opacity-50 active:scale-[0.98] uppercase tracking-widest shadow-lg shadow-white/5 flex items-center justify-center gap-2"
          >
            {loading ? (
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-black/20 border-t-black" />
            ) : (
              <>
                <CheckCircle2 className="h-4 w-4" />
                {isEdit ? "Update Challenge" : "Deploy Challenge"}
              </>
            )}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
