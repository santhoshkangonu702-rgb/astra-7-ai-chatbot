import React, { useState, useEffect } from 'react';
import { Brain, Plus, Trash2, Check, Sparkles, X, Shield, BookmarkCheck, Lightbulb } from 'lucide-react';
import { api } from '../../services/api';
import { UserMemoryItem } from '../../types';

interface MemoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onMemoriesUpdated?: (memories: UserMemoryItem[]) => void;
}

export const MemoryModal: React.FC<MemoryModalProps> = ({
  isOpen,
  onClose,
  onMemoriesUpdated
}) => {
  const [memories, setMemories] = useState<UserMemoryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [newContent, setNewContent] = useState('');
  const [newCategory, setNewCategory] = useState<'fact' | 'preference' | 'project' | 'instruction'>('preference');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadMemories();
    }
  }, [isOpen]);

  const loadMemories = async () => {
    setLoading(true);
    try {
      const data = await api.getUserMemories();
      const list = (data.memories || []) as UserMemoryItem[];
      setMemories(list);
      onMemoriesUpdated?.(list);
    } catch (e) {
      console.warn('Could not load memories:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleAddMemory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newContent.trim() || isSaving) return;

    setIsSaving(true);
    try {
      const res = await api.addUserMemory({
        category: newCategory,
        content: newContent.trim()
      });
      if (res.memory) {
        const updated = [...memories, res.memory];
        setMemories(updated);
        onMemoriesUpdated?.(updated);
        setNewContent('');
      }
    } catch (e) {
      console.error('Error adding memory:', e);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.deleteUserMemory(id);
      const updated = memories.filter((m) => m.id !== id);
      setMemories(updated);
      onMemoriesUpdated?.(updated);
    } catch (e) {
      console.error('Failed to delete memory:', e);
    }
  };

  const handleClearAll = async () => {
    if (!window.confirm('Are you sure you want to clear all saved AI memories?')) return;
    try {
      await api.clearUserMemories();
      setMemories([]);
      onMemoriesUpdated?.([]);
    } catch (e) {
      console.error('Failed to clear memories:', e);
    }
  };

  if (!isOpen) return null;

  const categoryBadges: Record<string, { label: string; bg: string; text: string }> = {
    preference: { label: 'Preference', bg: 'bg-purple-500/15', text: 'text-purple-300' },
    project: { label: 'Active Project', bg: 'bg-cyan-500/15', text: 'text-cyan-300' },
    fact: { label: 'User Fact', bg: 'bg-emerald-500/15', text: 'text-emerald-300' },
    instruction: { label: 'Custom Rule', bg: 'bg-amber-500/15', text: 'text-amber-300' }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700/70 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/50">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30">
              <Brain className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                Astra 7 Memory & Context System
                <span className="text-xs px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  {memories.length} Active
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Astra 7 preserves these facts and preferences across conversations for personalized responses.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Add new memory form */}
          <form onSubmit={handleAddMemory} className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/60 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                <Plus className="w-3.5 h-3.5 text-purple-400" />
                Add Context or Preference
              </span>
              <div className="flex gap-1">
                {(['preference', 'project', 'fact', 'instruction'] as const).map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setNewCategory(cat)}
                    className={`px-2 py-1 text-xs rounded-lg transition capitalize ${
                      newCategory === cat
                        ? 'bg-purple-600 text-white font-medium'
                        : 'text-slate-400 hover:bg-slate-700'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <textarea
              rows={2}
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
              placeholder="e.g., I prefer TypeScript over JavaScript, and I appreciate concise answers with runnable code blocks."
              className="w-full px-3 py-2 text-sm bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 transition resize-none"
            />

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={!newContent.trim() || isSaving}
                className="px-4 py-2 text-xs font-medium bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 disabled:opacity-50 text-white rounded-lg transition flex items-center gap-1.5 shadow-md shadow-purple-900/30"
              >
                {isSaving ? (
                  'Saving...'
                ) : (
                  <>
                    <BookmarkCheck className="w-4 h-4" />
                    Save to Memory
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Memory List */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-semibold uppercase tracking-wider text-slate-300">
                Saved Memories ({memories.length})
              </span>
              {memories.length > 0 && (
                <button
                  type="button"
                  onClick={handleClearAll}
                  className="text-rose-400 hover:text-rose-300 transition text-xs flex items-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Clear All
                </button>
              )}
            </div>

            {loading ? (
              <div className="py-8 text-center text-sm text-slate-400">Loading saved memories...</div>
            ) : memories.length === 0 ? (
              <div className="py-8 text-center border border-dashed border-slate-800 rounded-xl p-6">
                <Brain className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                <p className="text-sm text-slate-300 font-medium">No custom memories saved yet</p>
                <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                  Add project details or tone preferences above. Astra 7 will reference them automatically in every response.
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {memories.map((mem) => {
                  const badge = categoryBadges[mem.category] || categoryBadges.preference;
                  return (
                    <div
                      key={mem.id}
                      className="group flex items-start justify-between gap-3 p-3 rounded-xl bg-slate-800/40 border border-slate-700/40 hover:border-slate-600 transition"
                    >
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-2">
                          <span className={`text-[10px] px-2 py-0.5 rounded font-medium ${badge.bg} ${badge.text}`}>
                            {badge.label}
                          </span>
                          <span className="text-[10px] text-slate-500">
                            {new Date(mem.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-xs text-slate-200 leading-relaxed">{mem.content}</p>
                      </div>
                      <button
                        onClick={() => handleDelete(mem.id)}
                        className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-700/50 transition"
                        title="Delete memory"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Privacy Notice */}
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-start gap-2.5">
            <Shield className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <p className="text-[11px] text-slate-400 leading-normal">
              <strong className="text-slate-200">Private & Secure:</strong> Memories are isolated to your workspace and stored server-side. Astra 7 never shares your memories or private documents across external systems.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-950/50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
