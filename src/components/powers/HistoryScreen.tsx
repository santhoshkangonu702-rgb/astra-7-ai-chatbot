import React, { useState } from 'react';
import {
  History,
  Search,
  Trash2,
  Download,
  ExternalLink,
  MessageSquare,
  FileText,
  Code2,
  Image as ImageIcon,
  Sparkles,
  RotateCcw,
  Calendar
} from 'lucide-react';
import { PowerId } from '../../types';

interface HistoryScreenProps {
  onSelectPower: (power: PowerId) => void;
  onDirectPrompt?: (prompt: string, targetPower: PowerId) => void;
}

export const HistoryScreen: React.FC<HistoryScreenProps> = ({
  onSelectPower,
  onDirectPrompt
}) => {
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState<string>('all');

  const [historyItems, setHistoryItems] = useState([
    {
      id: 'hist-1',
      title: 'Quantum computing superposition explanation',
      type: 'chat',
      date: 'Today, 2:15 PM',
      preview: 'A quantum bit can exist in a linear combination of |0> and |1> states until measured...',
      power: 'chat' as PowerId
    },
    {
      id: 'hist-2',
      title: 'Binary Search Algorithm Implementation',
      type: 'code',
      date: 'Today, 11:30 AM',
      preview: 'function binarySearch(arr: number[], target: number): number { ... }',
      power: 'tool-code' as PowerId
    },
    {
      id: 'hist-3',
      title: 'Full-Stack Software Engineer ATS Resume',
      type: 'resume',
      date: 'Yesterday, 4:45 PM',
      preview: 'Alex Morgan • Full-Stack Engineer • 3+ years experience with microservices...',
      power: 'tool-resume' as PowerId
    },
    {
      id: 'hist-4',
      title: 'Organic Chemistry Functional Groups Flashcards',
      type: 'study',
      date: 'Sep 10, 2026',
      preview: 'Alkenes, Alkynes, Ketones, Carboxylic acids with boiling point comparisons...',
      power: 'tool-study' as PowerId
    },
    {
      id: 'hist-5',
      title: 'Futuristic AI Robot Mascot in Space',
      type: 'image',
      date: 'Sep 09, 2026',
      preview: 'Prompt: 3D rendered friendly robot on crystalline nebula background...',
      power: 'tool-image' as PowerId
    }
  ]);

  const filtered = historyItems.filter((item) => {
    const matchesFilter = filterType === 'all' || item.type === filterType;
    const matchesSearch =
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.preview.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleDelete = (id: string) => {
    setHistoryItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to clear your local history?')) {
      setHistoryItems([]);
    }
  };

  const handleExportJSON = () => {
    const blob = new Blob([JSON.stringify(historyItems, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `astra-history-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full min-h-screen bg-slate-50 dark:bg-slate-950 p-4 sm:p-6 lg:p-8 transition-colors">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-600 text-white flex items-center justify-center shadow-md shadow-indigo-500/20">
              <History className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-slate-900 dark:text-white">Activity History</h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Search and revisit past chats, generated drafts, code snippets, and study materials.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportJSON}
              className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 text-xs font-bold transition-colors flex items-center gap-1.5"
            >
              <Download className="w-4 h-4" />
              <span>Export History</span>
            </button>
            <button
              onClick={handleClearAll}
              disabled={historyItems.length === 0}
              className="px-3.5 py-2 rounded-xl bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 text-rose-600 dark:text-rose-400 disabled:opacity-40 text-xs font-bold transition-colors flex items-center gap-1.5"
            >
              <Trash2 className="w-4 h-4" />
              <span>Clear</span>
            </button>
          </div>
        </div>

        {/* Search & Filters */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative w-full sm:flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search across all past generations..."
              className="w-full pl-10 pr-4 py-2.5 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 shadow-sm"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-none">
            {['all', 'chat', 'code', 'resume', 'study', 'image'].map((type) => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize whitespace-nowrap transition-all ${
                  filterType === type
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200/80 dark:border-slate-800'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* History List */}
        <div className="space-y-3">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="group bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:border-indigo-300 dark:hover:border-indigo-700 transition-all flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
            >
              <div className="space-y-1 sm:max-w-2xl">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 uppercase">
                    {item.type}
                  </span>
                  <span className="text-[11px] text-slate-400 flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {item.date}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
                  {item.preview}
                </p>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-center">
                <button
                  onClick={() => onSelectPower(item.power)}
                  className="px-3.5 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 text-indigo-600 dark:text-indigo-400 text-xs font-bold transition-colors flex items-center gap-1.5"
                >
                  <span>Open Tool</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                  title="Delete item"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}

          {filtered.length === 0 && (
            <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 text-slate-400 space-y-2">
              <History className="w-8 h-8 mx-auto text-slate-300 dark:text-slate-700" />
              <p className="text-xs">No activity found matching your criteria.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
