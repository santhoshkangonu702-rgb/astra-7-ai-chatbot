import React, { useState } from 'react';
import {
  FolderKanban,
  Bookmark,
  MessageSquare,
  FileText,
  Trash2,
  Download,
  Share2,
  ExternalLink,
  Plus,
  Landmark,
  BookOpen
} from 'lucide-react';
import { UserProfile, LibraryItem } from '../../types';

interface LibraryPowerProps {
  currentUser: UserProfile;
  onNavigateToPower: (power: any, targetId?: string) => void;
}

export const LibraryPower: React.FC<LibraryPowerProps> = ({ currentUser, onNavigateToPower }) => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'saved_object' | 'conversation' | 'created_doc' | 'research_report'>('all');
  const [items, setItems] = useState<LibraryItem[]>([
    {
      id: 'lib-01',
      userId: currentUser.id,
      type: 'saved_object',
      title: 'Mask of Tutankhamun',
      snippet: 'Saved reference for 18th Dynasty burial customs and gold metallurgical techniques.',
      targetId: 'obj-tut-01',
      createdAt: new Date().toISOString()
    },
    {
      id: 'lib-02',
      userId: currentUser.id,
      type: 'research_report',
      title: 'Research: Bronze Age Trade Networks',
      snippet: 'Institutional study of tin and copper distribution pathways across the Mediterranean.',
      targetId: 'rep-01',
      createdAt: new Date(Date.now() - 86400000).toISOString()
    },
    {
      id: 'lib-03',
      userId: currentUser.id,
      type: 'created_doc',
      title: 'ESSAY: Decipherment of Linear B',
      snippet: 'Scholarly drafting exploring Michael Ventris and the phonetic grid methodology.',
      targetId: 'doc-01',
      createdAt: new Date(Date.now() - 172800000).toISOString()
    }
  ]);

  const filteredItems = activeFilter === 'all' ? items : items.filter((i) => i.type === activeFilter);

  const handleDelete = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const handleExportAll = () => {
    const jsonStr = JSON.stringify(items, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `astra-library-${currentUser.name.toLowerCase().replace(/\s+/g, '-')}.json`;
    a.click();
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20 text-xs font-mono font-bold mb-2">
            <FolderKanban className="w-3.5 h-3.5 text-amber-400" />
            <span>PERSONAL REPOSITORY</span>
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            Saved Collections & Documents
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Organize bookmarked ancient objects, generated reports, essay drafts, and past queries.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportAll}
            className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-slate-200 font-medium flex items-center gap-1.5 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Library JSON</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2">
        {[
          { id: 'all', label: 'All Items' },
          { id: 'saved_object', label: 'Artifacts' },
          { id: 'research_report', label: 'Research Reports' },
          { id: 'created_doc', label: 'Documents & Essays' },
          { id: 'conversation', label: 'Conversations' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveFilter(tab.id as any)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all ${
              activeFilter === tab.id
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-semibold'
                : 'bg-slate-900 border border-white/5 text-slate-400 hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Library Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredItems.map((item) => {
          let icon = <FileText className="w-4 h-4 text-purple-400" />;
          if (item.type === 'saved_object') icon = <Landmark className="w-4 h-4 text-amber-400" />;
          if (item.type === 'research_report') icon = <BookOpen className="w-4 h-4 text-cyan-400" />;
          if (item.type === 'conversation') icon = <MessageSquare className="w-4 h-4 text-blue-400" />;

          return (
            <div
              key={item.id}
              className="p-5 rounded-3xl bg-slate-900 border border-white/10 hover:border-amber-500/30 transition-all space-y-3 flex flex-col justify-between shadow-lg"
            >
              <div>
                <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                  <div className="flex items-center gap-1.5 capitalize font-mono text-[10px]">
                    {icon}
                    <span>{item.type.replace('_', ' ')}</span>
                  </div>
                  <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                </div>

                <h3 className="text-sm font-bold text-white line-clamp-1">{item.title}</h3>
                <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                  {item.snippet}
                </p>
              </div>

              <div className="pt-3 border-t border-white/5 flex items-center justify-between">
                <button
                  onClick={() => {
                    if (item.type === 'artifact') onNavigateToPower('history', item.targetId);
                    else if (item.type === 'research_report') onNavigateToPower('search');
                    else if (item.type === 'document') onNavigateToPower('create');
                    else onNavigateToPower('chat');
                  }}
                  className="text-xs font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1"
                >
                  <span>Open</span>
                  <ExternalLink className="w-3 h-3" />
                </button>

                <button
                  onClick={() => handleDelete(item.id)}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 transition-colors"
                  title="Remove from library"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
